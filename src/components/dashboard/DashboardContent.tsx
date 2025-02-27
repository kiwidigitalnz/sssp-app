
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SSSPTable } from "./SSSPTable";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import type { SSSP } from "@/types/sssp";

export function DashboardContent() {
  const { data: sssps = [], refetch } = useQuery({
    queryKey: ['sssps'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('sssps')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the SSSP type
      const formattedSssps: SSSP[] = data.map(sssp => ({
        ...sssp,
        monitoring_review: sssp.monitoring_review ? {
          review_schedule: {
            frequency: sssp.monitoring_review.review_schedule?.frequency || '',
            last_review: sssp.monitoring_review.review_schedule?.last_review || null,
            next_review: sssp.monitoring_review.review_schedule?.next_review || null,
            responsible_person: sssp.monitoring_review.review_schedule?.responsible_person || null
          },
          kpis: sssp.monitoring_review.kpis || [],
          corrective_actions: {
            process: sssp.monitoring_review.corrective_actions?.process || '',
            tracking_method: sssp.monitoring_review.corrective_actions?.tracking_method || '',
            responsible_person: sssp.monitoring_review.corrective_actions?.responsible_person || null
          },
          audits: sssp.monitoring_review.audits || [],
          worker_consultation: {
            method: sssp.monitoring_review.worker_consultation?.method || '',
            frequency: sssp.monitoring_review.worker_consultation?.frequency || '',
            last_consultation: sssp.monitoring_review.worker_consultation?.last_consultation || null
          },
          review_triggers: sssp.monitoring_review.review_triggers || [],
          documentation: {
            storage_location: sssp.monitoring_review.documentation?.storage_location || '',
            retention_period: sssp.monitoring_review.documentation?.retention_period || '',
            access_details: sssp.monitoring_review.documentation?.access_details || ''
          }
        } : null
      }));

      return formattedSssps;
    }
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
