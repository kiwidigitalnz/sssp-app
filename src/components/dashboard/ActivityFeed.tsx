import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityItem } from "./activity/ActivityItem";
import { ActivitySkeleton } from "./activity/ActivitySkeleton";
import { useActivitySubscription } from "./activity/useActivitySubscription";

export function ActivityFeed() {
  const query = useQuery({
    queryKey: ['sssp-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sssp_activity')
        .select(`
          *,
          sssps (title),
          profiles!sssp_activity_user_id_fkey (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  useActivitySubscription(query);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {query.isLoading ? (
            <ActivitySkeleton />
          ) : query.data && query.data.length > 0 ? (
            <div className="space-y-4">
              {query.data.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No recent activity
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}