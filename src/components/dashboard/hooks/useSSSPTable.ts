
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
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

export function useSSSPTable(sssps: SSSP[], onRefresh: () => void) {
  const { toast } = useToast();
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

  const handleClone = async (sssp: SSSP) => {
    try {
      setGeneratingPdfFor(sssp.id);

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
        hazards: sssp.hazards ? [...sssp.hazards] : [],
        emergency_contacts: sssp.emergency_contacts ? [...sssp.emergency_contacts] : [],
        required_training: sssp.required_training ? [...sssp.required_training] : [],
        meetings_schedule: sssp.meetings_schedule ? [...sssp.meetings_schedule] : [],
        monitoring_review: sssp.monitoring_review ? {
          ...sssp.monitoring_review,
          review_schedule: {
            ...sssp.monitoring_review.review_schedule,
            last_review: null,
            next_review: null
          },
          kpis: sssp.monitoring_review.kpis ? [...sssp.monitoring_review.kpis] : [],
          audits: sssp.monitoring_review.audits ? [...sssp.monitoring_review.audits] : [],
          review_triggers: sssp.monitoring_review.review_triggers ? [...sssp.monitoring_review.review_triggers] : []
        } : null
      };

      delete newSSSPData.id;
      delete newSSSPData.created_at;
      delete newSSSPData.updated_at;

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

      toast({
        title: "SSSP cloned successfully",
        description: `"${sssp.title}" has been cloned successfully`
      });

      onRefresh();
    } catch (error) {
      console.error('Error cloning SSSP:', error);
      toast({
        title: "Error cloning SSSP",
        description: error instanceof Error ? error.message : "Failed to clone SSSP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingPdfFor(null);
    }
  };

  const handleDelete = async (sssp: SSSP) => {
    try {
      const { error } = await supabase
        .from('sssps')
        .delete()
        .eq('id', sssp.id);

      if (error) throw error;

      toast({
        title: "SSSP deleted",
        description: `Successfully deleted "${sssp.title}"`
      });

      setDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error deleting SSSP:', error);
      toast({
        title: "Error",
        description: "Failed to delete SSSP. Please try again.",
        variant: "destructive"
      });
    }
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
    handleSort
  };
}
