
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

export function ActivityFeed() {
  const { session } = useAuth();

  const query = useQuery({
    queryKey: ['sssp-activities'],
    queryFn: async () => {
      console.log('[ActivityFeed] Starting to fetch activities');
      if (!session?.access_token) {
        console.log('[ActivityFeed] No session, skipping fetch');
        return [];
      }

      const { data, error } = await supabase
        .from('sssp_activity')
        .select(`
          *,
          sssps (title),
          profiles!sssp_activity_user_id_fkey (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('[ActivityFeed] Error fetching activities:', error);
        throw error;
      }

      console.log('[ActivityFeed] Successfully fetched activities:', data);
      return data;
    },
    enabled: Boolean(session?.access_token),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
  });

  useActivitySubscription(query);

  return (
    <Card className="bg-white shadow-sm h-[600px] flex flex-col">
      <CardHeader className="border-b bg-muted/10">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[520px] px-6">
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
              No recent activity
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
