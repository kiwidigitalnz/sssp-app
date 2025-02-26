
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {    
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(initialSession);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
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

  return <DashboardContent />;
};

export default Index;
