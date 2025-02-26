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

interface SSSPQueryResult {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  visitor_rules: string | null;
  company_name: string;
  created_by: string;
  modified_by: string;
  version: number;
}

const fetchSSSPs = async () => {
  console.log('[fetchSSSPs] ====== Starting new fetch attempt ======');
  
  // Test direct table access first
  try {
    const { count, error: countError } = await supabase
      .from('sssps')
      .select('*', { count: 'exact', head: true });
    
    console.log('[fetchSSSPs] Table access test:', {
      success: !countError,
      count,
      error: countError
    });
  } catch (e) {
    console.error('[fetchSSSPs] Table access test failed:', e);
  }

  const { data: { user } } = await supabase.auth.getUser();
  console.log('[fetchSSSPs] Auth state:', {
    id: user?.id,
    email: user?.email,
    aud: user?.aud,
    role: user?.role,
    session: !!user
  });

  if (!user) {
    console.log('[fetchSSSPs] No authenticated user found');
    throw new Error('Authentication required');
  }

  // Test simplified query first
  try {
    const { data: testData, error: testError } = await supabase
      .from('sssps')
      .select('id')
      .limit(1);

    console.log('[fetchSSSPs] Simple query test:', {
      success: !testError,
      hasData: !!testData?.length,
      error: testError
    });
  } catch (e) {
    console.error('[fetchSSSPs] Simple query test failed:', e);
  }

  // Main query
  try {
    console.log('[fetchSSSPs] Attempting main query...');
    const { data: sssps, error } = await supabase
      .from('sssps')
      .select()
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[fetchSSSPs] Main query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('[fetchSSSPs] Query succeeded:', {
      count: sssps?.length || 0,
      hasData: !!sssps?.length,
      firstItem: sssps?.[0]?.id
    });

    const transformedSssps = (sssps || []).map(item => ({
      ...item,
      visitor_rules: item.visitor_rules || undefined
    }));
    
    return transformedSssps;
  } catch (error) {
    console.error('[fetchSSSPs] Fatal error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const { data: sssps = [], isLoading, error } = useQuery({
    queryKey: ['sssps'],
    queryFn: fetchSSSPs,
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
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

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sssps'
        },
        (payload) => {
          console.log('Change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['sssps'] });
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
