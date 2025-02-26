
import { useEffect, useState } from "react";
import { SSSPList } from "./SSSPList";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";

type MonitoringReviewType = {
  review_schedule?: {
    frequency?: string;
    last_review?: string | null;
    next_review?: string | null;
    responsible_person?: string | null;
  };
  kpis?: any[];
  corrective_actions?: {
    process?: string;
    tracking_method?: string;
    responsible_person?: string | null;
  };
  audits?: any[];
  worker_consultation?: {
    method?: string;
    frequency?: string;
    last_consultation?: string | null;
  };
  review_triggers?: any[];
  documentation?: {
    storage_location?: string;
    retention_period?: string;
    access_details?: string;
  };
};

export function DashboardContent() {
  const [sssps, setSssps] = useState<SSSP[]>([]);

  useEffect(() => {
    const fetchSSSPs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sssps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching SSSPs:', error);
        return;
      }

      // Transform the data to match the SSSP type
      const formattedSssps: SSSP[] = data.map(sssp => {
        const monitoringReview = sssp.monitoring_review as MonitoringReviewType;

        return {
          ...sssp,
          created_by: sssp.created_by || user.id,
          modified_by: sssp.modified_by || user.id,
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
          } : null
        };
      });

      setSssps(formattedSssps);
    };

    fetchSSSPs();
  }, []);

  return (
    <>
      <WelcomeHeader />
      <div className="container mx-auto py-8">
        <DashboardStats sssps={sssps} />
        <div className="mt-8">
          <SSSPList sssps={sssps} />
        </div>
      </div>
    </>
  );
}
