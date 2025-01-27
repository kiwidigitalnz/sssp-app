import { useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useActivitySubscription(query: UseQueryResult<any, Error>) {
  const { toast } = useToast();
  const { refetch } = query;

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
          await refetch();
          
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
}