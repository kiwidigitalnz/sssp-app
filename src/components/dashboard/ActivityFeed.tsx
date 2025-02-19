
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityItem } from "./activity/ActivityItem";
import { ActivitySkeleton } from "./activity/ActivitySkeleton";
import { useActivitySubscription } from "./activity/useActivitySubscription";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;
const ACTIVITY_WINDOW = '7 days'; // Time window for activities

type ActivityType = 'all' | 'created' | 'updated' | 'shared';

export function ActivityFeed() {
  const { session } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const query = useQuery({
    queryKey: ['sssp-activities', activityType, currentPage],
    queryFn: async () => {
      console.log('[ActivityFeed] Starting to fetch activities');
      if (!session?.access_token) {
        console.log('[ActivityFeed] No session, skipping fetch');
        return { items: [], count: 0 };
      }

      // Build base query
      let query = supabase
        .from('sssp_activity')
        .select(`
          *,
          sssps!sssp_activity_sssp_id_fkey(title),
          profiles!sssp_activity_user_id_fkey(first_name, last_name)
        `, { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false });

      // Apply activity type filter if not 'all'
      if (activityType !== 'all') {
        query = query.eq('action', activityType);
      }

      // Apply pagination
      query = query.range(
        currentPage * ITEMS_PER_PAGE, 
        (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE - 1
      );

      const { data, error, count } = await query;

      if (error) {
        console.error('[ActivityFeed] Error fetching activities:', error);
        throw error;
      }

      console.log('[ActivityFeed] Successfully fetched activities:', data);
      
      if (count !== null) {
        setTotalCount(count);
      }

      // Client-side data cleanup: remove any activities with missing relationships
      const cleanedData = data.filter(activity => 
        activity.sssps?.title && 
        activity.profiles?.first_name
      );

      return { items: cleanedData, count: count || 0 };
    },
    enabled: Boolean(session?.access_token),
    staleTime: 30000, // Data is considered fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep inactive data in cache for 5 minutes
    retry: 3,
  });

  useActivitySubscription(query);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <Card className="bg-white shadow-sm h-[600px] flex flex-col">
      <CardHeader className="border-b bg-muted/10">
        <div className="space-y-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
            {query.data && (
              <span className="text-sm text-muted-foreground ml-2">
                ({totalCount} activities in the last 7 days)
              </span>
            )}
          </CardTitle>
          <Tabs
            value={activityType}
            onValueChange={(value) => {
              setActivityType(value as ActivityType);
              setCurrentPage(0); // Reset to first page when changing filters
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="created">Created</TabsTrigger>
              <TabsTrigger value="updated">Updated</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[440px] px-6"> {/* Adjusted height to account for pagination */}
          {query.isLoading ? (
            <ActivitySkeleton />
          ) : query.error ? (
            <Alert variant="destructive" className="mx-6 my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load activities. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          ) : query.data?.items && query.data.items.length > 0 ? (
            <div className="space-y-4 py-4">
              {query.data.items.map((activity) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground py-8">
              No {activityType === 'all' ? 'recent' : activityType} activity
            </div>
          )}
        </ScrollArea>
        
        {/* Pagination Controls */}
        {query.data?.items && query.data.items.length > 0 && (
          <div className="flex items-center justify-between px-6 py-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
