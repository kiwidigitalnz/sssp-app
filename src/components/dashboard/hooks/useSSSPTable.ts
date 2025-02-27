
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import type { SharedUser } from "../types";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogging";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type SortConfig = {
  key: keyof SSSP;
  direction: 'asc' | 'desc';
} | null;

// Helper function to transform and validate monitoring review data
const transformMonitoringReview = (rawData: any): NonNullable<SSSP['monitoring_review']> => {
  if (!rawData) return createEmptyMonitoringReview();
  
  return {
    review_schedule: {
      frequency: rawData.review_schedule?.frequency || "",
      last_review: rawData.review_schedule?.last_review || null,
      next_review: rawData.review_schedule?.next_review || null,
      responsible_person: rawData.review_schedule?.responsible_person || null
    },
    kpis: Array.isArray(rawData.kpis) ? rawData.kpis : [],
    corrective_actions: {
      process: rawData.corrective_actions?.process || "",
      tracking_method: rawData.corrective_actions?.tracking_method || "",
      responsible_person: rawData.corrective_actions?.responsible_person || null
    },
    audits: Array.isArray(rawData.audits) ? rawData.audits : [],
    worker_consultation: {
      method: rawData.worker_consultation?.method || "",
      frequency: rawData.worker_consultation?.frequency || "",
      last_consultation: rawData.worker_consultation?.last_consultation || null
    },
    review_triggers: Array.isArray(rawData.review_triggers) ? rawData.review_triggers : [],
    documentation: {
      storage_location: rawData.documentation?.storage_location || "",
      retention_period: rawData.documentation?.retention_period || "",
      access_details: rawData.documentation?.access_details || ""
    }
  };
};

// Helper function to create a properly typed monitoring review object
const createEmptyMonitoringReview = (): NonNullable<SSSP['monitoring_review']> => ({
  review_schedule: {
    frequency: "",
    last_review: null,
    next_review: null,
    responsible_person: null
  },
  kpis: [],
  corrective_actions: {
    process: "",
    tracking_method: "",
    responsible_person: null
  },
  audits: [],
  worker_consultation: {
    method: "",
    frequency: "",
    last_consultation: null
  },
  review_triggers: [],
  documentation: {
    storage_location: "",
    retention_period: "",
    access_details: ""
  }
});

// Helper function to transform Supabase response to SSSP type
const transformToSSSP = (data: any): SSSP => ({
  ...data,
  hazards: Array.isArray(data.hazards) ? data.hazards : [],
  emergency_contacts: Array.isArray(data.emergency_contacts) ? data.emergency_contacts : [],
  required_training: Array.isArray(data.required_training) ? data.required_training : [],
  meetings_schedule: Array.isArray(data.meetings_schedule) ? data.meetings_schedule : [],
  monitoring_review: transformMonitoringReview(data.monitoring_review),
  version_history: Array.isArray(data.version_history) ? data.version_history : []
});

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

      const { data: invitations, error: invitationsError } = await supabase
        .from('sssp_invitations')
        .select('email, access_level, status')
        .eq('sssp_id', selectedSSSP.id);

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        return { [selectedSSSP.id]: [] };
      }

      const { data: creatorProfile, error: creatorError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', selectedSSSP.created_by)
        .single();

      if (creatorError) {
        console.error('Error fetching creator profile:', creatorError);
      }

      const users: SharedUser[] = [];
      
      if (creatorProfile) {
        users.push({
          email: creatorProfile.email,
          access_level: 'owner',
          status: 'accepted',
          is_creator: true
        });
      }

      if (invitations) {
        users.push(...invitations.map(inv => ({
          email: inv.email,
          access_level: inv.access_level,
          status: inv.status,
          is_creator: false
        })));
      }

      return { [selectedSSSP.id]: users };
    },
    enabled: !!selectedSSSP && shareDialogOpen
  });

  const handleShare = async (email: string, accessLevel: 'view' | 'edit') => {
    if (!selectedSSSP) return;

    try {
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: { 
          ssspId: selectedSSSP.id,
          recipientEmail: email,
          accessLevel
        }
      });

      if (error) throw error;

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
  };

  const cloneMutation = useMutation({
    mutationFn: async (sssp: SSSP) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const newSSSPData = {
        ...sssp,
        title: `${sssp.title} (Copy)`,
        created_by: user.id,
        modified_by: user.id,
        version: 1,
        version_history: [],
        status: "draft",
        hazards: sssp.hazards || [],
        emergency_contacts: sssp.emergency_contacts || [],
        required_training: sssp.required_training || [],
        meetings_schedule: sssp.meetings_schedule || [],
        monitoring_review: transformMonitoringReview(sssp.monitoring_review)
      };

      delete (newSSSPData as any).id;
      delete (newSSSPData as any).created_at;
      delete (newSSSPData as any).updated_at;

      const { data: newSSSP, error } = await supabase
        .from('sssps')
        .insert([newSSSPData])
        .select()
        .single();

      if (error) throw error;

      await logActivity(newSSSP.id, 'cloned', user.id, {
        original_sssp_id: sssp.id,
        original_title: sssp.title
      });

      return transformToSSSP(newSSSP);
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
        company_name: sssp.company_name,
        monitoring_review: createEmptyMonitoringReview(),
        hazards: [],
        emergency_contacts: [],
        required_training: [],
        meetings_schedule: []
      };

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

  const handleClone = async (sssp: SSSP) => {
    setGeneratingPdfFor(sssp.id);
    try {
      await cloneMutation.mutateAsync(sssp);
    } finally {
      setGeneratingPdfFor(null);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (sssp: SSSP) => {
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

  const handleDelete = async (sssp: SSSP) => {
    deleteMutation.mutate(sssp);
  };

  const handleRevokeAccess = async (ssspId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('sssp_invitations')
        .delete()
        .match({ sssp_id: ssspId, email });

      if (error) throw error;

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
  };

  const handleResendInvite = async (ssspId: string, email: string) => {
    try {
      const { error } = await supabase.functions.invoke('resend-invitation', {
        body: { ssspId, email }
      });

      if (error) throw error;

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
  };

  const handleSort = (key: keyof SSSP) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return currentSort.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ sssp, newStatus }: { sssp: SSSP, newStatus: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('sssps')
        .update({ 
          status: newStatus,
          modified_by: user.id 
        })
        .eq('id', sssp.id)
        .select()
        .single();

      if (error) throw error;

      await logActivity(sssp.id, 'updated', user.id, {
        field: 'status',
        old_value: sssp.status,
        new_value: newStatus
      });

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
    onError: (error, { sssp, newStatus }) => {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
      
      onRefresh();
    }
  });

  const handleStatusChange = (sssp: SSSP, newStatus: string) => {
    updateStatusMutation.mutate({ sssp, newStatus });
  };

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
    sharedUsers,
    handleShare,
    handleClone,
    handleDelete,
    handleRevokeAccess,
    handleResendInvite,
    handleSort,
    handleStatusChange
  };
}
