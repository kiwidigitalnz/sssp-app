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
      
      return matchesSearch && matchesStatus;
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

  const getSortIcon = (key: keyof SSSP) => {
    if (sortConfig?.key === key) {
      return <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-30" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Filter SSSPs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              Search
            </label>
            <Input
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
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
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
