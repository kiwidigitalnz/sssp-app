
import { useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useActivitySubscription(query: UseQueryResult<any, Error>) {
  const { toast } = useToast();
  const { refetch } = query;

  useEffect(() => {
    console.log('[useActivitySubscription] Setting up realtime subscription');
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let retryTimeout: NodeJS.Timeout;

    const setupSubscription = async () => {
      try {
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
              console.log('[useActivitySubscription] Received new activity:', payload);
              try {
                await refetch();
                
                const { data: activityDetails, error: fetchError } = await supabase
                  .from('sssp_activity')
                  .select(`
                    *,
                    sssps (title),
                    profiles!sssp_activity_user_id_fkey (first_name, last_name)
                  `)
                  .eq('id', payload.new.id)
                  .single();

                if (fetchError) {
                  console.error('[useActivitySubscription] Error fetching activity details:', fetchError);
                  return;
                }

                console.log('[useActivitySubscription] Fetched activity details:', activityDetails);

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
              } catch (error) {
                console.error('[useActivitySubscription] Error processing activity:', error);
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('[useActivitySubscription] Successfully subscribed to activities');
              retryCount = 0; // Reset retry count on successful subscription
            } else {
              console.error('[useActivitySubscription] Subscription status:', status);
              handleSubscriptionError(new Error(`Failed to subscribe: ${status}`));
            }
          });

        return () => {
          console.log('[useActivitySubscription] Cleaning up subscription');
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('[useActivitySubscription] Error in subscription setup:', error);
        handleSubscriptionError(error as Error);
        return () => {}; // Return empty cleanup function for failed setup
      }
    };

    const handleSubscriptionError = (error: Error) => {
      console.error('[useActivitySubscription] Subscription error:', error);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
        console.log(`[useActivitySubscription] Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`);
        
        retryTimeout = setTimeout(() => {
          console.log(`[useActivitySubscription] Retry attempt ${retryCount}`);
          cleanup = setupSubscription();
        }, delay);
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to activity feed. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    let cleanup = setupSubscription();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      cleanup();
    };
  }, [refetch, toast]);
}
