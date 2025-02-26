
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

  // Test Supabase connection on component mount
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

  // Show connection status if there's an error
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

  // For now, let's just show a simple welcome message instead of trying to fetch SSSPs
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <WelcomeHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome!</h2>
          <p className="mt-2 text-gray-600">
            Connected to Supabase successfully. User: {session.user.email}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
