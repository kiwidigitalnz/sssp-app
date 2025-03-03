
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import type { SharedUser } from "../types";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogging";
import { asUUID, hasLength, safelyExtractData, safelyGetNestedProperty } from "@/utils/supabaseHelpers";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type SortConfig = {
  key: keyof SSSP;
  direction: 'asc' | 'desc';
} | null;

export function useSSSPTable(sssps: SSSP[], onRefresh: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSSSP, setSelectedSSSP] = useState<SSSP | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shareFilter, setShareFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [generatingPdfFor, setGeneratingPdfFor] = useState<string | null>(null);

  const { data: sharedUsers = {}, refetch: refetchSharedUsers } = useQuery({
    queryKey: ['shared-users', selectedSSSP?.id],
    queryFn: async () => {
      if (!selectedSSSP) return {};

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use regular from() and call the RPC function using SQL
      const { data, error } = await supabase
        .from('sssp_access')
        .select(`
          user_id,
          access_level,
          profiles:user_id (
            email,
            first_name,
            last_name
          )
        `)
        .eq('sssp_id', selectedSSSP.id);

      if (error) {
        console.error('Error fetching shared users:', error);
        return { [selectedSSSP.id]: [] };
      }

      // Transform the data to match the SharedUser type with safe property access
      const sharedUsersArray = Array.isArray(data) ? data.map(item => ({
        // Use safelyGetNestedProperty to safely extract the email with a fallback
        email: safelyGetNestedProperty(item?.profiles, ['email'], ''), 
        access_level: item.access_level,
        status: 'active',
        is_creator: item.user_id === user.id
      })) : [];
      
      return { [selectedSSSP.id]: sharedUsersArray };
    },
    enabled: !!selectedSSSP && shareDialogOpen,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10
  });

  const handleShare = useCallback(async (email: string, accessLevel: 'view' | 'edit') => {
    if (!selectedSSSP) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('send-invitation', {
        body: { 
          ssspId: selectedSSSP.id,
          recipientEmail: email,
          accessLevel
        }
      });

      if (error) throw error;

      await logActivity(selectedSSSP.id, 'shared' as any, user.id, {
        description: `Shared SSSP with ${email}`,
        field_changes: [{
          field: 'sharing',
          displayName: 'Sharing',
          oldValue: 'private',
          newValue: `shared with ${email} (${accessLevel})`
        }],
        section: 'Access Control',
        severity: 'major',
        metadata: {
          shared_with: email,
          access_level: accessLevel
        }
      }, 'access');

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`
      });

      await refetchSharedUsers();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedSSSP, toast, refetchSharedUsers]);

  const cloneMutation = useMutation({
    mutationFn: async (sssp: SSSP) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use SQL directly instead of RPC
      const { data, error } = await supabase
        .from('sssps')
        .insert({
          title: `${sssp.title} (Copy)`,
          company_name: sssp.company_name,
          status: 'draft',
          created_by: user.id,
          modified_by: user.id,
          // Clone all other fields from the original SSSP
          ...Object.fromEntries(
            Object.entries(sssp)
              .filter(([key]) => !['id', 'title', 'created_at', 'updated_at', 'created_by', 'modified_by', 'version', 'version_history'].includes(key))
          )
        })
        .select('*')
        .single();

      if (error) throw error;

      // Fix type compatibility issue by using type assertion
      return data as unknown as SSSP;
    },
    onMutate: async (sssp) => {
      await queryClient.cancelQueries({ queryKey: ['sssps'] });

      const previousSssps = queryClient.getQueryData<SSSP[]>(['sssps']);

      const optimisticClone: SSSP = {
        ...sssp,
        id: `temp-${Date.now()}`,
        title: `${sssp.title} (Copy)`,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        version_history: [],
        created_by: sssp.created_by,
        modified_by: sssp.modified_by,
        company_name: sssp.company_name
      } as SSSP;

      queryClient.setQueryData<SSSP[]>(['sssps'], old => {
        const oldData = old || [];
        return [...oldData, optimisticClone];
      });

      return { previousSssps, optimisticId: optimisticClone.id };
    },
    onError: (err, _, context) => {
      if (context?.previousSssps) {
        queryClient.setQueryData<SSSP[]>(['sssps'], context.previousSssps);
      }
      console.error('Error cloning SSSP:', err);
      toast({
        title: "Error cloning SSSP",
        description: err instanceof Error ? err.message : "Failed to clone SSSP. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (newSSSP, originalSSSP) => {
      toast({
        title: "SSSP cloned successfully",
        description: `"${originalSSSP.title}" has been cloned successfully`
      });

      queryClient.setQueryData<SSSP[]>(['sssps'], old => {
        const oldData = old || [];
        return oldData.map(s => s.id.startsWith('temp-') ? newSSSP : s);
      });
    },
    onSettled: () => {
      onRefresh();
    }
  });

  const handleClone = useCallback(async (sssp: SSSP) => {
    setGeneratingPdfFor(sssp.id);
    try {
      await cloneMutation.mutateAsync(sssp);
    } finally {
      setGeneratingPdfFor(null);
    }
  }, [cloneMutation]);

  const deleteMutation = useMutation({
    mutationFn: async (sssp: SSSP) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await logActivity(sssp.id, 'deleted' as any, user.id, {
        description: `Deleted SSSP "${sssp.title}"`,
        section: 'Document Management',
        severity: 'critical',
        metadata: {
          sssp_title: sssp.title,
          company_name: sssp.company_name
        }
      }, 'document');

      // Use direct delete with cascade instead of RPC
      const { error } = await supabase
        .from('sssps')
        .delete()
        .eq('id', sssp.id);

      if (error) throw error;
      return sssp;
    },
    onMutate: async (sssp) => {
      await queryClient.cancelQueries({ queryKey: ['sssps'] });

      const previousSssps = queryClient.getQueryData<SSSP[]>(['sssps']);

      queryClient.setQueryData<SSSP[]>(['sssps'], old => {
        return old ? old.filter(s => s.id !== sssp.id) : [];
      });

      return { previousSssps };
    },
    onError: (err, sssp, context) => {
      if (context?.previousSssps) {
        queryClient.setQueryData(['sssps'], context.previousSssps);
      }
      console.error('Error deleting SSSP:', err);
      toast({
        title: "Error",
        description: "Failed to delete SSSP. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (sssp) => {
      toast({
        title: "SSSP deleted",
        description: `Successfully deleted "${sssp.title}"`
      });
      setDeleteDialogOpen(false);
    },
    onSettled: () => {
      onRefresh();
    }
  });

  const handleDelete = useCallback(async (sssp: SSSP) => {
    deleteMutation.mutate(sssp);
  }, [deleteMutation]);

  const handleRevokeAccess = useCallback(async (ssspId: string, email: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the user_id for the email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) throw profileError;

      // Delete the access record
      const { error } = await supabase
        .from('sssp_access')
        .delete()
        .eq('sssp_id', ssspId)
        .eq('user_id', profileData.id);

      if (error) throw error;

      await logActivity(ssspId, 'updated' as any, user.id, {
        description: `Revoked access for ${email}`,
        field_changes: [{
          field: 'access',
          displayName: 'User Access',
          oldValue: `${email} had access`,
          newValue: `${email} access revoked`
        }],
        section: 'Access Control',
        severity: 'major',
        metadata: {
          email,
          action: 'revoke_access'
        }
      }, 'access');

      toast({
        title: "Access revoked",
        description: `Successfully revoked access for ${email}`
      });

      await refetchSharedUsers();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: "Error",
        description: "Failed to revoke access. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast, refetchSharedUsers]);

  const handleResendInvite = useCallback(async (ssspId: string, email: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('resend-invitation', {
        body: { ssspId, email }
      });

      if (error) throw error;

      await logActivity(ssspId, 'shared' as any, user.id, {
        description: `Resent invitation to ${email}`,
        section: 'Access Control',
        severity: 'minor',
        metadata: {
          email,
          action: 'resend_invitation'
        }
      }, 'access');

      toast({
        title: "Invitation resent",
        description: `Successfully resent invitation to ${email}`
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSort = useCallback((key: keyof SSSP) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return currentSort.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ sssp, newStatus }: { sssp: SSSP, newStatus: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update the status directly
      const { data, error } = await supabase
        .from('sssps')
        .update({ 
          status: newStatus,
          modified_by: user.id 
        })
        .eq('id', sssp.id)
        .select('*')
        .single();

      if (error) throw error;

      await logActivity(sssp.id, 'updated' as any, user.id, {
        field_changes: [{
          field: 'status',
          displayName: 'Status',
          oldValue: sssp.status,
          newValue: newStatus
        }],
        description: `Changed status from ${sssp.status} to ${newStatus}`,
        section: 'Document Management',
        severity: 'major'
      }, 'document');

      return data;
    },
    onMutate: async ({ sssp, newStatus }) => {
      const updatedSssps = sssps.map(s => 
        s.id === sssp.id ? { ...s, status: newStatus } : s
      );
      
      queryClient.setQueryData(['sssps'], updatedSssps);
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Status has been updated successfully"
      });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
      
      onRefresh();
    }
  });

  const handleStatusChange = useCallback((sssp: SSSP, newStatus: string) => {
    updateStatusMutation.mutate({ sssp, newStatus });
  }, [updateStatusMutation]);

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    shareDialogOpen,
    setShareDialogOpen,
    selectedSSSP,
    setSelectedSSSP,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    shareFilter,
    setShareFilter,
    dateRange,
    setDateRange,
    sortConfig,
    setSortConfig,
    generatingPdfFor,
    setGeneratingPdfFor,
    sharedUsers: sharedUsers as Record<string, SharedUser[]>,
    handleShare,
    handleClone,
    handleDelete,
    handleRevokeAccess,
    handleResendInvite,
    handleSort,
    handleStatusChange
  };
}
