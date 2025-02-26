import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, testConnection } from "@/integrations/supabase/client";
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

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('[Index] Testing Supabase connection...');
    testConnection().then(status => {
      console.log('[Index] Connection test result:', status);
      setConnectionStatus(status);
      if (!status) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to the database. Please try again later."
        });
      }
    });
  }, [toast]);

  useEffect(() => {
    console.log('[Index] Component mounted');
    
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        console.log('[Index] Initial auth check:', {
          hasSession: !!initialSession,
          email: initialSession?.user?.email
        });
        setSession(initialSession);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('[Index] Auth state changed:', {
            event: _event,
            email: session?.user?.email
          });
          setSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('[Index] Auth initialization error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to initialize authentication"
        });
      }
    };

    initializeAuth();
  }, [toast]);

  const { data: sssps, isLoading, error } = useQuery({
    queryKey: ['sssps', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      console.log('[Index] Fetching SSSPs for user:', session.user.id);
      const { data, error } = await supabase
        .from('sssps')
        .select('*')
        .eq('created_by', session.user.id);

      if (error) {
        console.error('[Index] Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message}${error.hint ? ` (${error.hint})` : ''}`);
      }

      if (!data) {
        console.log('[Index] No SSSPs found for user');
        return [];
      }

      const transformedData: SSSP[] = data.map(item => {
        const monitoringReview = item.monitoring_review as Record<string, any> | null;
        
        console.log('[Index] Raw monitoring_review data:', monitoringReview);

        return {
          ...item,
          monitoring_review: monitoringReview ? {
            review_schedule: {
              frequency: monitoringReview.review_schedule?.frequency || '',
              last_review: monitoringReview.review_schedule?.last_review || null,
              next_review: monitoringReview.review_schedule?.next_review || null,
              responsible_person: monitoringReview.review_schedule?.responsible_person || null
            },
            kpis: Array.isArray(monitoringReview.kpis) ? monitoringReview.kpis : [],
            corrective_actions: {
              process: monitoringReview.corrective_actions?.process || '',
              tracking_method: monitoringReview.corrective_actions?.tracking_method || '',
              responsible_person: monitoringReview.corrective_actions?.responsible_person || null
            },
            audits: Array.isArray(monitoringReview.audits) ? monitoringReview.audits : [],
            worker_consultation: {
              method: monitoringReview.worker_consultation?.method || '',
              frequency: monitoringReview.worker_consultation?.frequency || '',
              last_consultation: monitoringReview.worker_consultation?.last_consultation || null
            },
            review_triggers: Array.isArray(monitoringReview.review_triggers) ? monitoringReview.review_triggers : [],
            documentation: {
              storage_location: monitoringReview.documentation?.storage_location || '',
              retention_period: monitoringReview.documentation?.retention_period || '',
              access_details: monitoringReview.documentation?.access_details || ''
            }
          } : null
        };
      });

      console.log('[Index] Successfully transformed SSSPs:', {
        count: transformedData.length,
        firstItem: transformedData[0],
        rawMonitoringReview: data[0]?.monitoring_review
      });
      
      return transformedData;
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  if (connectionStatus === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-900">Database Connection Error</h2>
          <p className="mt-2 text-gray-600">Unable to connect to the database. Please try again later.</p>
        </div>
      </div>
    );
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <WelcomeHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    console.error('[Index] Query error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <WelcomeHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Error Loading SSSPs</h2>
            <p className="mt-2 text-gray-600">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['sssps'] })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const totalSssps = sssps?.length || 0;
  const draftSssps = sssps?.filter(sssp => sssp.status === 'draft').length || 0;
  const publishedSssps = sssps?.filter(sssp => sssp.status === 'published').length || 0;
  const recentSssps = sssps?.filter(sssp => {
    const date = new Date(sssp.updated_at);
    const thirtyDaysAgo = addDays(new Date(), -30);
    return date > thirtyDaysAgo;
  }).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <WelcomeHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total SSSPs"
            value={totalSssps}
            icon={FileText}
            className="sm:col-span-1"
          />
          <StatsCard
            title="Draft"
            value={draftSssps}
            icon={ClipboardCheck}
            iconColor="text-yellow-500"
            className="sm:col-span-1"
          />
          <StatsCard
            title="Published"
            value={publishedSssps}
            icon={CheckCircle}
            iconColor="text-green-500"
            className="sm:col-span-1"
          />
          <StatsCard
            title="Updated (30d)"
            value={recentSssps}
            icon={AlertTriangle}
            iconColor="text-blue-500"
            className="sm:col-span-1"
          />
        </div>
        <div className="mt-8">
          <SSSPTable ssspList={sssps || []} />
        </div>
      </main>
    </div>
  );
};

export default Index;
