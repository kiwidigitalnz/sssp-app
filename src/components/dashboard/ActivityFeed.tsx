import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User, Share, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function ActivityFeed() {
  const { toast } = useToast();
  const { data: activities, isLoading, refetch } = useQuery({
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

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sssp_activity'
        },
        async (payload) => {
          // Refetch to update the list
          await refetch();
          
          // Show a toast notification for the new activity
          const { data: activityDetails } = await supabase
            .from('sssp_activity')
            .select(`
              *,
              sssps (title),
              profiles!sssp_activity_user_id_fkey (first_name, last_name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (activityDetails) {
            const userName = activityDetails.profiles?.first_name 
              ? `${activityDetails.profiles.first_name} ${activityDetails.profiles.last_name}`
              : 'A user';
            
            toast({
              title: "New Activity",
              description: `${userName} ${activityDetails.action} "${activityDetails.sssps.title}"`,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'shared':
        return <Share className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    const userName = activity.profiles?.first_name 
      ? `${activity.profiles.first_name} ${activity.profiles.last_name}`
      : 'A user';
    
    switch (activity.action) {
      case 'created':
        return `${userName} created "${activity.sssps.title}"`;
      case 'updated':
        return `${userName} updated "${activity.sssps.title}"`;
      case 'shared':
        return `${userName} shared "${activity.sssps.title}"`;
      default:
        return `${userName} performed an action on "${activity.sssps.title}"`;
    }
  };

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
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="mt-1">{getActivityIcon(activity.action)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{getActivityText(activity)}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.created_at), 'PPp')}
                    </p>
                  </div>
                </div>
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