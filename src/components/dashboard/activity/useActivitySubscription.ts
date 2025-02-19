
import { useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

const SUBSCRIPTION_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

export function useActivitySubscription(query: UseQueryResult<any, Error>) {
  const { toast } = useToast();
  const { refetch } = query;

  useEffect(() => {
    console.log('[useActivitySubscription] Setting up realtime subscription');
    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;
    let channel: RealtimeChannel | null = null;
    let timeoutId: NodeJS.Timeout;

    const setupSubscription = () => {
      try {
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Set new timeout for subscription
        timeoutId = setTimeout(() => {
          console.log('[useActivitySubscription] Subscription timeout, reconnecting...');
          if (channel) {
            supabase.removeChannel(channel);
          }
          setupSubscription();
        }, SUBSCRIPTION_TIMEOUT);

        // Create new channel with optimized query
        channel = supabase
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
                
                // Optimized query for fetching activity details
                const { data: activityDetails, error: fetchError } = await supabase
                  .from('sssp_activity')
                  .select(`
                    id,
                    action,
                    created_at,
                    sssps!sssp_activity_sssp_id_fkey (
                      id,
                      title
                    ),
                    profiles!sssp_activity_user_id_fkey (
                      first_name,
                      last_name
                    )
                  `)
                  .eq('id', payload.new.id)
                  .limit(1)
                  .maybeSingle();

                if (fetchError) {
                  console.error('[useActivitySubscription] Error fetching activity details:', fetchError);
                  return;
                }

                if (activityDetails) {
                  const userName = activityDetails.profiles?.first_name 
                    ? `${activityDetails.profiles.first_name} ${activityDetails.profiles.last_name}`
                    : 'A user';
                  
                  const actionText = {
                    created: 'created',
                    updated: 'updated',
                    shared: 'shared',
                    cloned: 'cloned',
                    deleted: 'deleted'
                  }[activityDetails.action] || activityDetails.action;
                  
                  toast({
                    title: "New Activity",
                    description: `${userName} ${actionText} "${activityDetails.sssps.title}"`,
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
              retryCount = 0;
            } else {
              console.error('[useActivitySubscription] Subscription status:', status);
              handleSubscriptionError(new Error(`Failed to subscribe: ${status}`));
            }
          });
      } catch (error) {
        console.error('[useActivitySubscription] Error in subscription setup:', error);
        handleSubscriptionError(error as Error);
      }
    };

    const handleSubscriptionError = (error: Error) => {
      console.error('[useActivitySubscription] Subscription error:', error);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        
        retryTimeout = setTimeout(() => {
          console.log(`[useActivitySubscription] Retry attempt ${retryCount}`);
          setupSubscription();
        }, delay);
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to activity feed. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    // Initial setup
    setupSubscription();

    // Cleanup function
    return () => {
      console.log('[useActivitySubscription] Cleaning up subscription');
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [refetch, toast]);
}
