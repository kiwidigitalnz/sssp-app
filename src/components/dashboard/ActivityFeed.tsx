
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityItem } from "./activity/ActivityItem";
import { ActivitySkeleton } from "./activity/ActivitySkeleton";
import { useActivitySubscription } from "./activity/useActivitySubscription";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

type ActivityType = 'all' | 'created' | 'updated' | 'shared';

export function ActivityFeed() {
  const { session } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [page, setPage] = useState(1);
  
  const query = useQuery({
    queryKey: ['activities', activityType, page],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      let query = supabase
        .from('sssp_activity')
        .select(`
          *,
          sssps!sssp_activity_sssp_id_fkey (title),
          profiles!sssp_activity_user_id_fkey (first_name, last_name)
        `, { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (activityType !== 'all') {
        query = query.eq('action', activityType);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        items: data,
        total: count || 0
      };
    },
    enabled: !!session?.access_token,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setPage(1);
  }, [activityType]);

  useActivitySubscription(query);

  const totalPages = Math.ceil((query.data?.total || 0) / ITEMS_PER_PAGE);

  return (
    <Card className="col-span-3 h-[600px] flex flex-col">
      <CardHeader className="pb-4 space-y-4">
        <CardTitle className="text-2xl font-semibold">Recent Activity</CardTitle>
        <div className="flex justify-between items-center">
          <Select
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[440px] px-6">
          {query.isLoading ? (
            <ActivitySkeleton />
          ) : query.error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                Error loading activities
              </p>
            </div>
          ) : query.data?.items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {query.data?.items.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        
        {query.data?.items && query.data.items.length > 0 && (
          <div className="flex items-center justify-between px-6 py-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
