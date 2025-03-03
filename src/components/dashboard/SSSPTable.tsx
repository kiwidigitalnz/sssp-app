
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SSSP } from "@/types/sssp";
import { SSSPActions } from "./SSSPActions";
import { ShareDialog } from "./ShareDialog";
import { DeleteDialog } from "./DeleteDialog";
import type { SSSPTableProps } from "./types";
import { SSSPTableFilters } from "./components/SSSPTableFilters";
import { useSSSPTable } from "./hooks/useSSSPTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hasLength } from "@/utils/supabaseHelpers";

export function SSSPTable({ sssps, onRefresh }: SSSPTableProps) {
  const navigate = useNavigate();
  const {
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
    generatingPdfFor,
    sharedUsers,
    handleShare,
    handleClone,
    handleDelete,
    handleRevokeAccess,
    handleResendInvite,
    handleSort,
    handleStatusChange
  } = useSSSPTable(sssps, onRefresh);

  const filteredAndSortedSSSPs = sssps
    .filter((sssp) => {
      const matchesSearch = 
        sssp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sssp.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || sssp.status === statusFilter;

      // Safely check shared user counts using the hasLength helper
      const sharedUsersForSSSP = sharedUsers[sssp.id] || [];
      const sharedUserCount = hasLength(sharedUsersForSSSP) ? sharedUsersForSSSP.length : 0;
      
      const matchesShared = shareFilter === "all" || 
        (shareFilter === "shared" && sharedUserCount > 0) ||
        (shareFilter === "not-shared" && sharedUserCount === 0);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20';
      case 'archived':
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  return (
    <div className="space-y-4">
      <SSSPTableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        shareFilter={shareFilter}
        onShareFilterChange={setShareFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

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
            {filteredAndSortedSSSPs.map((sssp) => {
              // Safely get shared users count using hasLength helper
              const sharedUsersForSSSP = sharedUsers[sssp.id] || [];
              const sharedUserCount = hasLength(sharedUsersForSSSP) ? sharedUsersForSSSP.length : 0;
              
              return (
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
                    className="py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={sssp.status}
                      onValueChange={(value) => handleStatusChange(sssp, value)}
                    >
                      <SelectTrigger className={`w-28 h-7 border-0 ${getStatusColor(sssp.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-4">
                    {sharedUserCount > 0 ? (
                      <div className="flex gap-1.5 items-center">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {sharedUserCount} user{sharedUserCount !== 1 ? 's' : ''}
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
                      onPrintToPDF={() => {}}
                      isGeneratingPdf={generatingPdfFor === sssp.id}
                      onDelete={(sssp) => {
                        setSelectedSSSP(sssp);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
