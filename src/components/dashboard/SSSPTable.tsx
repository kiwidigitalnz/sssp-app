
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import { useQuery } from '@tanstack/react-query';
import { SSSPActions } from "./SSSPActions";
import { ShareDialog } from "./ShareDialog";
import { DeleteDialog } from "./DeleteDialog";
import type { SSSPTableProps, SharedUser } from "./types";

export function SSSPTable({ sssps, onRefresh }: SSSPTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSSSP, setSelectedSSSP] = useState<SSSP | null>(null);

  const { data: sharedUsers = {}, refetch: refetchSharedUsers } = useQuery({
    queryKey: ['shared-users', selectedSSSP?.id],
    queryFn: async () => {
      if (!selectedSSSP) return {};

      console.log('Fetching shared users for SSSP:', selectedSSSP.id);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Current user:', user.id);

      // Get all invitations for this SSSP first
      const { data: invitations, error: invitationsError } = await supabase
        .from('sssp_invitations')
        .select('email, access_level, status')
        .eq('sssp_id', selectedSSSP.id);

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        return { [selectedSSSP.id]: [] };
      }

      console.log('Fetched invitations:', invitations);

      // Then get the creator's profile
      const { data: creatorProfile, error: creatorError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', selectedSSSP.created_by)
        .single();

      if (creatorError) {
        console.error('Error fetching creator profile:', creatorError);
      }

      console.log('Creator profile:', creatorProfile);

      const users: SharedUser[] = [];
      
      // Add creator if found
      if (creatorProfile) {
        users.push({
          email: creatorProfile.email,
          access_level: 'owner',
          status: 'accepted',
          is_creator: true
        });
      }

      // Add all invitations
      if (invitations) {
        users.push(...invitations.map(inv => ({
          email: inv.email,
          access_level: inv.access_level,
          status: inv.status,
          is_creator: false
        })));
      }

      console.log('Final users list:', users);

      return { [selectedSSSP.id]: users };
    },
    enabled: !!selectedSSSP && shareDialogOpen
  });

  const handleShare = async (email: string, accessLevel: 'view' | 'edit') => {
    if (!selectedSSSP) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    if (userProfile?.email === email) {
      throw new Error('Cannot invite yourself');
    }

    const { data: existingInvitations } = await supabase
      .from('sssp_invitations')
      .select('*')
      .eq('sssp_id', selectedSSSP.id)
      .eq('email', email)
      .eq('status', 'pending');

    if (existingInvitations && existingInvitations.length > 0) {
      throw new Error('Invitation already exists');
    }

    const { data: invitation, error: inviteError } = await supabase
      .from('sssp_invitations')
      .insert({
        sssp_id: selectedSSSP.id,
        email,
        access_level: accessLevel,
        invited_by: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    const { error: functionError } = await supabase.functions.invoke('send-invitation', {
      body: {
        to: email,
        ssspTitle: selectedSSSP.title,
        sssp_id: selectedSSSP.id,
        accessLevel,
        inviterEmail: userProfile?.email
      }
    });

    if (functionError) {
      await supabase
        .from('sssp_invitations')
        .delete()
        .eq('id', invitation.id);
      throw functionError;
    }

    toast({
      title: "Success",
      description: "Invitation sent successfully",
    });
    refetchSharedUsers();
  };

  const handleClone = async (sssp: SSSP) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: originalSSSP, error: fetchError } = await supabase
        .from('sssps')
        .select('*')
        .eq('id', sssp.id)
        .single();

      if (fetchError) throw fetchError;

      const { error: insertError } = await supabase
        .from('sssps')
        .insert({
          ...originalSSSP,
          id: undefined,
          title: `${originalSSSP.title} (Copy)`,
          created_by: user.id,
          modified_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          status: 'draft'
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "SSSP cloned successfully",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone SSSP",
      });
    }
  };

  const handlePrintToPDF = (sssp: SSSP) => {
    try {
      window.open(`/sssp/${sssp.id}/print`, '_blank');
      toast({
        title: "Success",
        description: "Preparing PDF for download...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF",
      });
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
        title: "Success",
        description: "SSSP deleted successfully",
      });

      setDeleteDialogOpen(false);
      setSelectedSSSP(null);
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete SSSP",
      });
    }
  };

  const handleRevokeAccess = async (ssspId: string, email: string) => {
    try {
      await supabase
        .from('sssp_invitations')
        .delete()
        .eq('sssp_id', ssspId)
        .eq('email', email);

      toast({
        title: "Access Revoked",
        description: `Access has been revoked for ${email}`,
      });

      refetchSharedUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke access",
      });
    }
  };

  const handleResendInvite = async (ssspId: string, email: string) => {
    try {
      const { data: invitation } = await supabase
        .from('sssp_invitations')
        .select('*')
        .eq('sssp_id', ssspId)
        .eq('email', email)
        .eq('status', 'pending')
        .single();

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: functionError } = await supabase.functions.invoke('send-invitation', {
        body: {
          to: email,
          ssspTitle: selectedSSSP?.title || '',
          sssp_id: ssspId,
          accessLevel: invitation.access_level,
          inviterEmail: user.email,
        },
      });

      if (functionError) throw functionError;

      toast({
        title: "Invitation Resent",
        description: `A new invitation has been sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend invitation",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Shared With</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sssps.map((sssp) => (
            <TableRow key={sssp.id} className="cursor-pointer">
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.title}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.company_name}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.status}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.version}</TableCell>
              <TableCell>
                {sharedUsers[sssp.id]?.length > 0 ? (
                  <div className="flex gap-1 items-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {sharedUsers[sssp.id].length} user{sharedUsers[sssp.id].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not shared</span>
                )}
              </TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>
                {new Date(sssp.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <SSSPActions
                  sssp={sssp}
                  onShare={(sssp) => {
                    setSelectedSSSP(sssp);
                    setShareDialogOpen(true);
                  }}
                  onClone={handleClone}
                  onPrintToPDF={handlePrintToPDF}
                  onDelete={(sssp) => {
                    setSelectedSSSP(sssp);
                    setDeleteDialogOpen(true);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        selectedSSSP={selectedSSSP}
        sharedUsers={sharedUsers}
        onShare={handleShare}
        onRevokeAccess={handleRevokeAccess}
        onResendInvite={handleResendInvite}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedSSSP={selectedSSSP}
        onDelete={handleDelete}
      />
    </>
  );
}
