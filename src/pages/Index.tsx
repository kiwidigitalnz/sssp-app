
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { SSSP } from "@/types/sssp";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SSSPTable } from "@/components/dashboard/SSSPTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { FileText, AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react";
import { addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const fetchSSSPs = async () => {
  console.log('[fetchSSSPs] Starting fetch...');
  
  // First check if we have an authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('[fetchSSSPs] Current user:', user?.email);
  
  if (!user) {
    console.log('[fetchSSSPs] No authenticated user found');
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[fetchSSSPs] Error:', error);
    throw new Error(error.message);
  }
  
  console.log('[fetchSSSPs] Success! Data:', data);
  return data as SSSP[];
};

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const { data: sssps = [], isLoading, error } = useQuery({
    queryKey: ['sssps'],
    queryFn: fetchSSSPs,
    enabled: !!session,
    retry: false, // Disable retries temporarily for debugging
    gcTime: 5 * 60 * 1000
  });

  useEffect(() => {
    console.log('[Index] Component mounted');
    
    const initializeAuth = async () => {
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      console.log('[Index] Initial session check:', initialSession?.user?.email, sessionError);
      setSession(initialSession);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('[Index] Auth state changed:', _event, session?.user?.email);
        setSession(session);
      });

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (error) {
      console.error('[Index] Query error:', error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error instanceof Error ? error.message : "Failed to load SSSPs"
      });
    }
  }, [error, toast]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error loading data</h2>
          <p className="mt-2 text-gray-600">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: sssps.length,
    draft: sssps.filter(s => s.status === "draft").length,
    submitted: sssps.filter(s => s.status !== "draft").length,
    needsReview: sssps.filter(s => {
      const thirtyDaysFromNow = addDays(new Date(), 30);
      const lastUpdated = new Date(s.updated_at);
      return thirtyDaysFromNow.getTime() - lastUpdated.getTime() >= 30 * 24 * 60 * 60 * 1000;
    }).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 gap-8">          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total SSSPs"
              value={stats.total}
              icon={FileText}
              iconColor="text-blue-500"
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
            <StatsCard
              title="Need Review (30 Days)"
              value={stats.needsReview}
              icon={ClipboardCheck}
              iconColor="text-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SSSPTable ssspList={sssps} />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
