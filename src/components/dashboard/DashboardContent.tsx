
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SSSPTable } from "./SSSPTable";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import type { SSSP } from "@/types/sssp";
import { asUUID, safelyExtractData, safelyGetProperty, isSupabaseError } from "@/utils/supabaseHelpers";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to create an empty monitoring review object
const createEmptyMonitoringReview = (): NonNullable<SSSP['monitoring_review']> => ({
  review_schedule: {
    frequency: '',
    last_review: null,
    next_review: null,
    responsible_person: null
  },
  kpis: [],
  corrective_actions: {
    process: '',
    tracking_method: '',
    responsible_person: null
  },
  audits: [],
  worker_consultation: {
    method: '',
    frequency: '',
    last_consultation: null
  },
  review_triggers: [],
  documentation: {
    storage_location: '',
    retention_period: '',
    access_details: ''
  }
});

export function DashboardContent() {
  const { data: sssps = [], refetch, isLoading, isError } = useQuery({
    queryKey: ['sssps'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Fetching SSPSs for user:", user.id);

      // First get the user's SSPSs
      const { data: userSssps, error: userSsspsError } = await supabase
        .from('sssps')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (userSsspsError) {
        console.error("Error fetching user SSPSs:", userSsspsError);
        throw userSsspsError;
      }

      console.log(`Found ${userSssps?.length || 0} SSPSs for user:`, user.id);
      
      // Also get SSPSs that have been shared with the user
      const { data: sharedSsspsAccess, error: sharedSsspsError } = await supabase
        .from('sssp_access')
        .select('sssp_id')
        .eq('user_id', user.id);
      
      if (sharedSsspsError) {
        console.error("Error fetching shared SSPSs access:", sharedSsspsError);
        // Don't throw here, we still want to return the user's SSPSs
      }

      let allSssps = userSssps || [];
      
      // If the user has shared SSPSs, fetch them
      if (sharedSsspsAccess && sharedSsspsAccess.length > 0) {
        const sharedSsspIds = sharedSsspsAccess.map(access => access.sssp_id);
        console.log(`Found ${sharedSsspIds.length} shared SSPSs for user:`, user.id);
        
        const { data: sharedSssps, error: fetchSharedError } = await supabase
          .from('sssps')
          .select('*')
          .in('id', sharedSsspIds)
          .order('updated_at', { ascending: false });
        
        if (fetchSharedError) {
          console.error("Error fetching shared SSPSs:", fetchSharedError);
        } else if (sharedSssps) {
          allSssps = [...allSssps, ...sharedSssps];
        }
      }

      // Transform the data to match the SSSP type with null checks
      const formattedSssps: SSSP[] = allSssps.map(sssp => {
        // Safely extract monitoring_review or create an empty one if it doesn't exist
        const monitoringReview = sssp.monitoring_review || createEmptyMonitoringReview();
        
        return {
          ...sssp,
          monitoring_review: {
            review_schedule: {
              frequency: safelyGetProperty(monitoringReview, 'review_schedule.frequency', '') || '',
              last_review: safelyGetProperty(monitoringReview, 'review_schedule.last_review', null),
              next_review: safelyGetProperty(monitoringReview, 'review_schedule.next_review', null),
              responsible_person: safelyGetProperty(monitoringReview, 'review_schedule.responsible_person', null)
            },
            kpis: safelyGetProperty(monitoringReview, 'kpis', []) || [],
            corrective_actions: {
              process: safelyGetProperty(monitoringReview, 'corrective_actions.process', '') || '',
              tracking_method: safelyGetProperty(monitoringReview, 'corrective_actions.tracking_method', '') || '',
              responsible_person: safelyGetProperty(monitoringReview, 'corrective_actions.responsible_person', null)
            },
            audits: safelyGetProperty(monitoringReview, 'audits', []) || [],
            worker_consultation: {
              method: safelyGetProperty(monitoringReview, 'worker_consultation.method', '') || '',
              frequency: safelyGetProperty(monitoringReview, 'worker_consultation.frequency', '') || '',
              last_consultation: safelyGetProperty(monitoringReview, 'worker_consultation.last_consultation', null)
            },
            review_triggers: safelyGetProperty(monitoringReview, 'review_triggers', []) || [],
            documentation: {
              storage_location: safelyGetProperty(monitoringReview, 'documentation.storage_location', '') || '',
              retention_period: safelyGetProperty(monitoringReview, 'documentation.retention_period', '') || '',
              access_details: safelyGetProperty(monitoringReview, 'documentation.access_details', '') || ''
            }
          }
        };
      });

      console.log(`Returning ${formattedSssps.length} total SSPSs`);
      return formattedSssps;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 3 * 60 * 1000, // Keep in cache for 3 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });

  return (
    <>
      <WelcomeHeader />
      <div className="container mx-auto py-8">
        <DashboardStats sssps={sssps} />
        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
          ) : isError ? (
            <div className="p-6 text-center bg-white rounded-lg shadow-sm">
              <p className="text-red-500">Error loading your SSSPs. Please try refreshing the page.</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : (
            <SSSPTable sssps={sssps} onRefresh={refetch} />
          )}
        </div>
      </div>
    </>
  );
}
