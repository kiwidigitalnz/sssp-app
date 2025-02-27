import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ArrowUpDown, Search, Filter } from "lucide-react";
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

type SortConfig = {
  key: keyof SSSP;
  direction: 'asc' | 'desc';
} | null;

export function SSSPTable({ sssps, onRefresh }: SSSPTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSSSP, setSelectedSSSP] = useState<SSSP | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

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

  const filteredAndSortedSSSPs = sssps
    .filter((sssp) => {
      const matchesSearch = 
        sssp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sssp.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || sssp.status === statusFilter;
      const matchesVersion = versionFilter === "all" || sssp.version.toString() === versionFilter;
      
      return matchesSearch && matchesStatus && matchesVersion;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === bValue) return 0;
      if (direction === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

  const versions = Array.from(new Set(sssps.map(sssp => sssp.version.toString())));

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

  const getSortIcon = (key: keyof SSSP) => {
    if (sortConfig?.key === key) {
      return <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-30" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Version</label>
            <Select value={versionFilter} onValueChange={setVersionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>Version {version}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead 
                className="cursor-pointer font-semibold"
                onClick={() => handleSort('title')}
              >
                Title {getSortIcon('title')}
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold"
                onClick={() => handleSort('company_name')}
              >
                Company {getSortIcon('company_name')}
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold"
                onClick={() => handleSort('version')}
              >
                Version {getSortIcon('version')}
              </TableHead>
              <TableHead>Shared With</TableHead>
              <TableHead 
                className="cursor-pointer font-semibold"
                onClick={() => handleSort('updated_at')}
              >
                Last Updated {getSortIcon('updated_at')}
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSSSPs.map((sssp) => (
              <TableRow 
                key={sssp.id} 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>
                  <div className="font-medium">{sssp.title}</div>
                </TableCell>
                <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.company_name}</TableCell>
                <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${sssp.status === 'published' ? 'bg-green-100 text-green-800' :
                      sssp.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {sssp.status}
                  </span>
                </TableCell>
                <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    v{sssp.version}
                  </span>
                </TableCell>
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
            {filteredAndSortedSSSPs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No SSSPs found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}
