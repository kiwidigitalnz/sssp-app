
import { useEffect, useState } from "react";
import { SSSPList } from "./SSSPList";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";

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

      // Ensure all required properties are present
      const formattedSssps: SSSP[] = data.map(sssp => ({
        ...sssp,
        created_by: sssp.created_by || user.id, // Default to current user if not set
        modified_by: sssp.modified_by || user.id, // Default to current user if not set
      }));

      setSssps(formattedSssps);
    };

    fetchSSSPs();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <SSSPList sssps={sssps} />
    </div>
  );
}
