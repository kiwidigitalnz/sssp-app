
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SSSPList } from "./SSSPList";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";
import { Loader2 } from "lucide-react";

interface DashboardContentProps {
  session: Session;
}

export function DashboardContent({ session }: DashboardContentProps) {
  const { toast } = useToast();

  const { data: sssps, isLoading, error } = useQuery({
    queryKey: ['sssps', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('sssps')
        .select(`
          id,
          title,
          description,
          company_name,
          status,
          created_at,
          updated_at,
          version
        `)
        .eq('created_by', session.user.id);

      if (error) throw error;
      return data || [];
    },
    retry: 2,
    retryDelay: 1000,
    meta: {
      errorMessage: "Failed to load SSSPs"
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load SSSPs. Please try again later."
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <WelcomeHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your SSSPs...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <WelcomeHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats sssps={sssps || []} />
        <div className="mt-8">
          <SSSPList sssps={sssps || []} />
        </div>
      </main>
    </div>
  );
}
