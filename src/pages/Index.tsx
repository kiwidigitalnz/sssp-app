
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SSSP } from "@/types/sssp";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SSSPTable } from "@/components/dashboard/SSSPTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { FileText, AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react";
import { addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 30000; // 30 seconds

const fetchSSSPs = async () => {
  console.log('[fetchSSSPs] Starting fetch...');
  
  const { data: { user } } = await supabase.auth.getUser();
  console.log('[fetchSSSPs] Current user:', user?.email);
  
  if (!user) {
    console.log('[fetchSSSPs] No authenticated user found');
    throw new Error('Authentication required');
  }

  // Optimized query using new indexes
  const { data, error } = await supabase
    .from('sssps')
    .select(`
      id,
      title,
      status,
      created_at,
      updated_at,
      company_name
    `)
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
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // Optimized query configuration
  const { data: sssps = [], isLoading, error } = useQuery({
    queryKey: ['sssps'],
    queryFn: fetchSSSPs,
    enabled: !!session,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: false
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

  // Optimized realtime subscription
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sssps',
          filter: `created_by=eq.${session.user.id}`
        },
        (payload) => {
          console.log('[Index] Change received:', payload);
          queryClient.invalidateQueries({ 
            queryKey: ['sssps'],
            refetchType: 'active'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);

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
          <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-slate-900">
            Site-Specific Safety Plans{" "}
            <span className="relative whitespace-nowrap text-primary">
              made simple
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl tracking-tight text-slate-700">
            Create, manage, and share your Site-Specific Safety Plans with ease. Built for construction professionals who value safety and efficiency.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-900">Error loading data</h2>
          <p className="mt-2 text-gray-600">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: sssps.length,
    draft: sssps.filter(s => s.status === "draft").length,
    published: sssps.filter(s => s.status === "published").length,
    needsReview: sssps.filter(s => {
      const thirtyDaysFromNow = addDays(new Date(), 30);
      const lastUpdated = new Date(s.updated_at);
      return thirtyDaysFromNow.getTime() - lastUpdated.getTime() >= 30 * 24 * 60 * 60 * 1000;
    }).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 gap-8">          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total SSSPs"
              value={stats.total}
              icon={FileText}
              iconColor="text-blue-500"
              className="transition-all hover:scale-102 hover:shadow-lg"
            />
            <StatsCard
              title="Draft SSSPs"
              value={stats.draft}
              icon={AlertTriangle}
              iconColor="text-yellow-500"
              className="transition-all hover:scale-102 hover:shadow-lg"
            />
            <StatsCard
              title="Published SSSPs"
              value={stats.published}
              icon={CheckCircle}
              iconColor="text-green-500"
              className="transition-all hover:scale-102 hover:shadow-lg"
            />
            <StatsCard
              title={isMobile ? "Need Review" : "Need Review (30 Days)"}
              value={stats.needsReview}
              icon={ClipboardCheck}
              iconColor="text-purple-500"
              className="transition-all hover:scale-102 hover:shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
              <SSSPTable ssspList={sssps} />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
