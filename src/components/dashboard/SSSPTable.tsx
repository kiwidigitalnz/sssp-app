import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ArrowUpDown, Search, Calendar, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import { useQuery } from '@tanstack/react-query';
import { SSSPActions } from "./SSSPActions";
import { ShareDialog } from "./ShareDialog";
import { DeleteDialog } from "./DeleteDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { SSSPTableProps, SharedUser } from "./types";

type SortConfig = {
  key: keyof SSSP;
  direction: 'asc' | 'desc';
} | null;

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function SSSPTable({ sssps, onRefresh }: SSSPTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      const { data: newSSSP, error } = await supabase
        .from('sssps')
        .insert([{ ...sssp, title: `${sssp.title} (Copy)` }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "SSSP cloned",
        description: `Successfully created a copy of "${sssp.title}"`
      });

      onRefresh();
    } catch (error) {
      console.error('Error cloning SSSP:', error);
      toast({
        title: "Error",
        description: "Failed to clone SSSP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrintToPDF = async (sssp: SSSP) => {
    setGeneratingPdfFor(sssp.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-sssp-pdf', {
        body: { ssspId: sssp.id }
      });

      if (error) throw error;

      if (data?.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.download = `${sssp.title}-SSSP.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "PDF generated successfully",
          description: "Your PDF has been generated and downloaded"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
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

  const filteredAndSortedSSSPs = sssps
    .filter((sssp) => {
      const matchesSearch = 
        sssp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sssp.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || sssp.status === statusFilter;

      const matchesShared = shareFilter === "all" || 
        (shareFilter === "shared" && sharedUsers[sssp.id]?.length > 0) ||
        (shareFilter === "not-shared" && (!sharedUsers[sssp.id] || sharedUsers[sssp.id].length === 0));

      const matchesDate = !dateRange.from || !dateRange.to || (
        new Date(sssp.updated_at) >= dateRange.from &&
        new Date(sssp.updated_at) <= dateRange.to
      );
      
      return matchesSearch && matchesStatus && matchesShared && matchesDate;
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
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
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
          <Select value={shareFilter} onValueChange={setShareFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by sharing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SSSPs</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="not-shared">Not Shared</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-full justify-start text-left font-normal ${
                  !dateRange.from && !dateRange.to ? 'text-muted-foreground' : ''
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd")
                  )
                ) : (
                  "Filter by date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ 
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to
                  });
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
              <TableHead 
                className="cursor-pointer font-semibold text-gray-700 py-4"
                onClick={() => handleSort('title')}
              >
                Title {getSortIcon('title')}
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold text-gray-700 py-4"
                onClick={() => handleSort('company_name')}
              >
                Company {getSortIcon('company_name')}
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold text-gray-700 py-4"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Shared With
              </TableHead>
              <TableHead 
                className="cursor-pointer font-semibold text-gray-700 py-4"
                onClick={() => handleSort('updated_at')}
              >
                Last Updated {getSortIcon('updated_at')}
              </TableHead>
              <TableHead className="w-[80px] font-semibold text-gray-700 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSSSPs.map((sssp) => (
              <TableRow 
                key={sssp.id} 
                className="cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-gray-200 last:border-0"
              >
                <TableCell 
                  onClick={() => navigate(`/sssp/${sssp.id}`)}
                  className="py-4"
                >
                  <div className="font-medium text-gray-900">{sssp.title}</div>
                </TableCell>
                <TableCell 
                  onClick={() => navigate(`/sssp/${sssp.id}`)}
                  className="py-4 text-gray-600"
                >
                  {sssp.company_name}
                </TableCell>
                <TableCell 
                  onClick={() => navigate(`/sssp/${sssp.id}`)}
                  className="py-4"
                >
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${sssp.status === 'published' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                      sssp.status === 'draft' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20' :
                      'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'}`}>
                    {sssp.status}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  {sharedUsers[sssp.id]?.length > 0 ? (
                    <div className="flex gap-1.5 items-center">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {sharedUsers[sssp.id].length} user{sharedUsers[sssp.id].length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not shared</span>
                  )}
                </TableCell>
                <TableCell 
                  onClick={() => navigate(`/sssp/${sssp.id}`)}
                  className="py-4 text-gray-600"
                >
                  {new Date(sssp.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4">
                  <SSSPActions
                    sssp={sssp}
                    onShare={(sssp) => {
                      setSelectedSSSP(sssp);
                      setShareDialogOpen(true);
                    }}
                    onClone={handleClone}
                    onPrintToPDF={handlePrintToPDF}
                    isGeneratingPdf={generatingPdfFor === sssp.id}
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
                <TableCell 
                  colSpan={6} 
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-gray-400">No SSSPs found matching your filters</p>
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
