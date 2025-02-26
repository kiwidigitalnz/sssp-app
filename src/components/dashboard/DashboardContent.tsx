
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SSSPList } from "./SSSPList";
import { DashboardStats } from "./DashboardStats";
import { WelcomeHeader } from "./WelcomeHeader";

interface DashboardContentProps {
  session: Session;
}

export function DashboardContent({ session }: DashboardContentProps) {
  const { toast } = useToast();

  const { data: sssps, isLoading, error } = useQuery({
    queryKey: ['sssps', session?.user?.id],
    queryFn: async () => {
      console.log('Fetching SSSPs for user:', session?.user?.id); // Debug log
      
      if (!session?.user?.id) {
        console.error('No user ID found in session');
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

      if (error) {
        console.error('Supabase query error:', error); // Debug log
        throw error;
      }

      console.log('Fetched SSSPs:', data); // Debug log
      return data || [];
    },
    meta: {
      errorMessage: "Failed to load SSSPs"
    }
  });

  if (error) {
    console.error('React Query error:', error); // Debug log
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load SSSPs"
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <WelcomeHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading SSSPs...</div>
        </main>
      </div>
    );
  }

  // Add debug log for rendered data
  console.log('Rendering with SSSPs:', sssps);

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
