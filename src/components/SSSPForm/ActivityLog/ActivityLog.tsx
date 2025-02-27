
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getActivityLogs, ActivityAction, ActivityCategory, getFieldDisplayName, formatValueForDisplay } from '@/utils/activityLogging';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Clock, Search, Filter, Download, Trash, Eye, PenSquare, Share2, FilePlus2, FileText, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ActivityLogProps {
  sssp_id: string;
}

interface ActivityLogFilters {
  actions: ActivityAction[];
  categories: ActivityCategory[];
  fromDate: Date | null;
  toDate: Date | null;
  userId: string | null;
  searchTerm: string;
}

const ACTIVITY_ACTIONS = [
  { value: 'created', label: 'Created', icon: <FilePlus2 className="h-4 w-4" /> },
  { value: 'updated', label: 'Updated', icon: <PenSquare className="h-4 w-4" /> },
  { value: 'shared', label: 'Shared', icon: <Share2 className="h-4 w-4" /> },
  { value: 'cloned', label: 'Cloned', icon: <FileText className="h-4 w-4" /> },
  { value: 'deleted', label: 'Deleted', icon: <Trash className="h-4 w-4" /> },
  { value: 'reviewed', label: 'Reviewed', icon: <RefreshCw className="h-4 w-4" /> },
  { value: 'downloaded', label: 'Downloaded', icon: <Download className="h-4 w-4" /> },
];

const ACTIVITY_CATEGORIES = [
  { value: 'content', label: 'Content Changes' },
  { value: 'access', label: 'Access Control' },
  { value: 'review', label: 'Reviews & Approvals' },
  { value: 'system', label: 'System Events' },
  { value: 'document', label: 'Document Management' },
];

export const ActivityLog = ({ sssp_id }: ActivityLogProps) => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActivityLogFilters>({
    actions: [],
    categories: [],
    fromDate: null,
    toDate: null,
    userId: null,
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchLogs();
  }, [sssp_id, page, limit]);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchLogs = async () => {
    if (!sssp_id) return;

    setLoading(true);
    try {
      const options = {
        limit,
        offset: page * limit,
        actions: filters.actions.length > 0 ? filters.actions as ActivityAction[] : undefined,
        categories: filters.categories.length > 0 ? filters.categories as ActivityCategory[] : undefined,
        fromDate: filters.fromDate ? format(filters.fromDate, 'yyyy-MM-dd') : undefined,
        toDate: filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : undefined,
        userId: filters.userId || undefined,
      };

      const activityLogs = await getActivityLogs(sssp_id, options);
      
      // Filter out 'viewed' actions from the activity logs
      const filteredActivityLogs = activityLogs.filter(log => log.action !== 'viewed');
      
      setLogs(filteredActivityLogs);
      applyFilters();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load activity logs'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Apply search filter if present
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.user_name.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.details?.description && log.details.description.toLowerCase().includes(searchLower)) ||
        (log.details?.section && log.details.section.toLowerCase().includes(searchLower)) ||
        (log.details?.updated_fields && log.details.updated_fields.some((field: string) => 
          field.toLowerCase().includes(searchLower) || 
          getFieldDisplayName(field).toLowerCase().includes(searchLower)
        )) ||
        (log.details?.field_changes && log.details.field_changes.some((change: any) => 
          change.displayName.toLowerCase().includes(searchLower) ||
          (change.oldValue && String(change.oldValue).toLowerCase().includes(searchLower)) ||
          (change.newValue && String(change.newValue).toLowerCase().includes(searchLower))
        ))
      );
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (key: keyof ActivityLogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAction = (action: ActivityAction) => {
    setFilters(prev => {
      const currentActions = [...prev.actions];
      if (currentActions.includes(action)) {
        return { ...prev, actions: currentActions.filter(a => a !== action) };
      } else {
        return { ...prev, actions: [...currentActions, action] };
      }
    });
  };

  const toggleCategory = (category: ActivityCategory) => {
    setFilters(prev => {
      const currentCategories = [...prev.categories];
      if (currentCategories.includes(category)) {
        return { ...prev, categories: currentCategories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...currentCategories, category] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      actions: [],
      categories: [],
      fromDate: null,
      toDate: null,
      userId: null,
      searchTerm: '',
    });
  };

  const getActionIcon = (action: string) => {
    const actionItem = ACTIVITY_ACTIONS.find(item => item.value === action);
    return actionItem ? actionItem.icon : <PenSquare className="h-4 w-4" />;
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'shared':
        return 'bg-purple-100 text-purple-800';
      case 'cloned':
        return 'bg-indigo-100 text-indigo-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-amber-100 text-amber-800';
      case 'downloaded':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format a date or timestamp
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy HH:mm');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLogs}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            View all activities and changes made to this SSSP
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <Card className="mb-4 bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Filter by Action</h3>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_ACTIONS.map(action => (
                        <Button
                          key={action.value}
                          variant={filters.actions.includes(action.value as ActivityAction) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAction(action.value as ActivityAction)}
                          className="flex items-center gap-1"
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_CATEGORIES.map(category => (
                        <Button
                          key={category.value}
                          variant={filters.categories.includes(category.value as ActivityCategory) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCategory(category.value as ActivityCategory)}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">From Date</h3>
                      <div className="flex items-center">
                        <Input
                          type="date"
                          value={filters.fromDate ? format(filters.fromDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => handleFilterChange('fromDate', e.target.value ? new Date(e.target.value) : null)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">To Date</h3>
                      <div className="flex items-center">
                        <Input
                          type="date"
                          value={filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => handleFilterChange('toDate', e.target.value ? new Date(e.target.value) : null)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetFilters} size="sm">
                      Reset Filters
                    </Button>
                    <Button onClick={() => fetchLogs()} size="sm">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="w-[140px]">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                          <span className="mr-1">{getActionIcon(log.action)}</span>
                          <span className="capitalize">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {log.details?.description && (
                            <p className="text-sm font-medium">{log.details.description}</p>
                          )}
                          
                          {log.details?.section && (
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {log.details.section}
                              </span>
                            </div>
                          )}
                          
                          {/* Display field changes with old and new values */}
                          {log.details?.field_changes && log.details.field_changes.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {log.details.field_changes.map((change: any, index: number) => (
                                <div key={index} className="text-xs border-b border-muted pb-1 last:border-0">
                                  <span className="font-medium">{change.displayName || getFieldDisplayName(change.field)}</span>
                                  {': '}
                                  <span className="text-red-600 line-through">
                                    {formatValueForDisplay(change.oldValue, change.field)}
                                  </span>
                                  {' → '}
                                  <span className="text-green-600">
                                    {formatValueForDisplay(change.newValue, change.field)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Legacy support for just listing updated fields */}
                          {!log.details?.field_changes && log.details?.updated_fields && log.details.updated_fields.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Updated fields:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {log.details.updated_fields.map((field: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs"
                                  >
                                    {getFieldDisplayName(field)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {log.details?.metadata && Object.keys(log.details.metadata).length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {Object.entries(log.details.metadata).map(([key, value], idx) => (
                                <div key={idx}>
                                  <span className="font-medium">{key.replace(/_/g, ' ')}</span>: {formatValueForDisplay(value, key)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.user_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(page * limit + 1, filteredLogs.length || 1)} to {Math.min((page + 1) * limit, filteredLogs.length || 0)} of {filteredLogs.length || 0} activities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filteredLogs.length < limit}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
