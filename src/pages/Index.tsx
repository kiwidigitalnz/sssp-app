import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { SSSP } from "@/types/sssp";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SSSPTable } from "@/components/dashboard/SSSPTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";

const fetchSSSPs = async () => {
  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SSSP[];
};

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  const { data: sssps = [], isLoading } = useQuery({
    queryKey: ['sssps'],
    queryFn: fetchSSSPs,
    enabled: !!session
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Site-Specific Safety Plans{" "}
            <span className="relative whitespace-nowrap text-primary">
              made simple
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Create, manage, and share your Site-Specific Safety Plans with ease. Built for construction professionals who value safety and efficiency.
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    total: sssps.length,
    draft: sssps.filter(s => s.status === "draft").length,
    submitted: sssps.filter(s => s.status !== "draft").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatsCard
                title="Total SSSPs"
                value={stats.total}
                icon={FileText}
              />
              <StatsCard
                title="Draft SSSPs"
                value={stats.draft}
                icon={AlertTriangle}
                iconColor="text-yellow-500"
              />
              <StatsCard
                title="Submitted SSSPs"
                value={stats.submitted}
                icon={CheckCircle}
                iconColor="text-green-500"
              />
            </div>

            <SSSPTable ssspList={sssps} />
          </div>

          <div className="space-y-6">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;