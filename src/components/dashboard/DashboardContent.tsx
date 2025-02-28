
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SSSPTable } from "./SSSPTable";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import type { SSSP } from "@/types/sssp";
import type { Database } from "@/integrations/supabase/types";
import { asUUID, safelyExtractData } from "@/utils/supabaseHelpers";

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
  const { data: sssps = [], refetch, isLoading } = useQuery({
    queryKey: ['sssps'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Use the materialized view for faster query performance
      const { data: viewData, error: viewError } = await supabase
        .from('mv_active_sssps')
        .select('id');

      if (viewError) throw viewError;
      
      // Get the IDs of all SSSPs from the materialized view
      const sssp_ids = (viewData || []).map((item: any) => item.id);
      
      // If no SSSPs found, return an empty array
      if (sssp_ids.length === 0) return [];
      
      // Query the full SSSP data in a single batch 
      const { data: sssp_data, error: sssp_error } = await supabase
        .from('sssps')
        .select('*')
        .in('id', sssp_ids)
        .order('updated_at', { ascending: false });
      
      if (sssp_error) throw sssp_error;

      // Transform the data to match the SSSP type with null checks
      const formattedSssps: SSSP[] = (sssp_data || []).map(sssp => {
        const monitoringReview = sssp.monitoring_review || null;
        return {
          ...sssp,
          monitoring_review: monitoringReview ? {
            review_schedule: {
              frequency: monitoringReview.review_schedule?.frequency || '',
              last_review: monitoringReview.review_schedule?.last_review || null,
              next_review: monitoringReview.review_schedule?.next_review || null,
              responsible_person: monitoringReview.review_schedule?.responsible_person || null
            },
            kpis: monitoringReview.kpis || [],
            corrective_actions: {
              process: monitoringReview.corrective_actions?.process || '',
              tracking_method: monitoringReview.corrective_actions?.tracking_method || '',
              responsible_person: monitoringReview.corrective_actions?.responsible_person || null
            },
            audits: monitoringReview.audits || [],
            worker_consultation: {
              method: monitoringReview.worker_consultation?.method || '',
              frequency: monitoringReview.worker_consultation?.frequency || '',
              last_consultation: monitoringReview.worker_consultation?.last_consultation || null
            },
            review_triggers: monitoringReview.review_triggers || [],
            documentation: {
              storage_location: monitoringReview.documentation?.storage_location || '',
              retention_period: monitoringReview.documentation?.retention_period || '',
              access_details: monitoringReview.documentation?.access_details || ''
            }
          } : createEmptyMonitoringReview()
        };
      });

      return formattedSssps;
    },
    // Update to use gcTime (previously cacheTime) for React Query v4+
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 3 * 60 * 1000, // Keep in cache for 3 minutes
  });

  return (
    <>
      <WelcomeHeader />
      <div className="container mx-auto py-8">
        <DashboardStats sssps={sssps} />
        <div className="mt-8">
          <SSSPTable sssps={sssps} onRefresh={refetch} />
        </div>
      </div>
    </>
  );
}
