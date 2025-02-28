
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SSSPTable } from "./SSSPTable";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import type { SSSP } from "@/types/sssp";
import type { Database } from "@/integrations/supabase/types";

export function DashboardContent() {
  const { data: sssps = [], refetch, isLoading } = useQuery({
    queryKey: ['sssps'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Use the materialized view for faster query performance
      // This avoids full table scans on the main sssps table
      const { data, error } = await supabase
        .from('mv_active_sssps')
        .select('id');

      if (error) throw error;
      
      // Get the IDs of all SSSPs from the materialized view
      const sssp_ids = data.map((item: any) => item.id);
      
      // If no SSSPs found, return an empty array
      if (sssp_ids.length === 0) return [];
      
      // Query the full SSSP data in a single batch 
      // instead of individual queries for better performance
      const { data: sssp_data, error: sssp_error } = await supabase
        .from('sssps')
        .select('*')
        .in('id', sssp_ids)
        .order('updated_at', { ascending: false });
      
      if (sssp_error) throw sssp_error;

      // Transform the data to match the SSSP type
      const formattedSssps: SSSP[] = sssp_data.map(sssp => ({
        ...sssp,
        monitoring_review: sssp.monitoring_review ? 
          // Type assertion since we know the structure from the database
          {
            review_schedule: {
              frequency: (sssp.monitoring_review as any).review_schedule?.frequency || '',
              last_review: (sssp.monitoring_review as any).review_schedule?.last_review || null,
              next_review: (sssp.monitoring_review as any).review_schedule?.next_review || null,
              responsible_person: (sssp.monitoring_review as any).review_schedule?.responsible_person || null
            },
            kpis: (sssp.monitoring_review as any).kpis || [],
            corrective_actions: {
              process: (sssp.monitoring_review as any).corrective_actions?.process || '',
              tracking_method: (sssp.monitoring_review as any).corrective_actions?.tracking_method || '',
              responsible_person: (sssp.monitoring_review as any).corrective_actions?.responsible_person || null
            },
            audits: (sssp.monitoring_review as any).audits || [],
            worker_consultation: {
              method: (sssp.monitoring_review as any).worker_consultation?.method || '',
              frequency: (sssp.monitoring_review as any).worker_consultation?.frequency || '',
              last_consultation: (sssp.monitoring_review as any).worker_consultation?.last_consultation || null
            },
            review_triggers: (sssp.monitoring_review as any).review_triggers || [],
            documentation: {
              storage_location: (sssp.monitoring_review as any).documentation?.storage_location || '',
              retention_period: (sssp.monitoring_review as any).documentation?.retention_period || '',
              access_details: (sssp.monitoring_review as any).documentation?.access_details || ''
            }
          }
        : null
      }));

      return formattedSssps;
    },
    // Add caching to reduce redundant data fetching
    staleTime: 60 * 1000, // Cache for 1 minute
    cacheTime: 3 * 60 * 1000, // Keep in cache for 3 minutes
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
