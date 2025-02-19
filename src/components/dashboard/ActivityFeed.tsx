
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityItem } from "./activity/ActivityItem";
import { ActivitySkeleton } from "./activity/ActivitySkeleton";
import { useActivitySubscription } from "./activity/useActivitySubscription";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ACTIVITY_LIMIT = 50; // Maximum number of activities to fetch
const ACTIVITY_WINDOW = '7 days'; // Time window for activities

type ActivityType = 'all' | 'created' | 'updated' | 'shared';

export function ActivityFeed() {
  const { session } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('all');

  const query = useQuery({
    queryKey: ['sssp-activities', activityType],
    queryFn: async () => {
      console.log('[ActivityFeed] Starting to fetch activities');
      if (!session?.access_token) {
        console.log('[ActivityFeed] No session, skipping fetch');
        return [];
      }

      // Fetch activities within the time window and with a limit
      let query = supabase
        .from('sssp_activity')
        .select(`
          *,
          sssps (title),
          profiles!sssp_activity_user_id_fkey (first_name, last_name)
        `)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false });

      // Apply activity type filter if not 'all'
      if (activityType !== 'all') {
        query = query.eq('action', activityType);
      }

      const { data, error } = await query.limit(ACTIVITY_LIMIT);

      if (error) {
        console.error('[ActivityFeed] Error fetching activities:', error);
        throw error;
      }

      console.log('[ActivityFeed] Successfully fetched activities:', data);

      // Client-side data cleanup: remove any activities with missing relationships
      const cleanedData = data.filter(activity => 
        activity.sssps?.title && 
        activity.profiles?.first_name
      );

      return cleanedData;
    },
    enabled: Boolean(session?.access_token),
    staleTime: 30000, // Data is considered fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep inactive data in cache for 5 minutes
    retry: 3,
  });

  useActivitySubscription(query);

  return (
    <Card className="bg-white shadow-sm h-[600px] flex flex-col">
      <CardHeader className="border-b bg-muted/10">
        <div className="space-y-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
            {query.data && (
              <span className="text-sm text-muted-foreground ml-2">
                ({query.data.length} activities in the last 7 days)
              </span>
            )}
          </CardTitle>
          <Tabs
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
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
        <ScrollArea className="h-[480px] px-6"> {/* Adjusted height to account for tabs */}
          {query.isLoading ? (
            <ActivitySkeleton />
          ) : query.error ? (
            <Alert variant="destructive" className="mx-6 my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load activities. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          ) : query.data && query.data.length > 0 ? (
            <div className="space-y-4 py-4">
              {query.data.map((activity) => (
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
      </CardContent>
    </Card>
  );
}
