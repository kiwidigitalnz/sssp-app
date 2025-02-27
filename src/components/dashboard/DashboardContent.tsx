
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SSSPTable } from "./SSSPTable";

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
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SSSPTable sssps={sssps} onRefresh={refetch} />
    </div>
  );
}
