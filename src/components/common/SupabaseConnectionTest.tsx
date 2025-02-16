
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SupabaseConnectionTest() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['connection-test'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schema_checks')
        .select('*')
        .eq('check_name', 'connection_test')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Alert>
        <AlertTitle>Testing Supabase Connection...</AlertTitle>
        <AlertDescription>Please wait while we verify the database connection.</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          Failed to connect to Supabase: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Issue</AlertTitle>
        <AlertDescription>
          Could not find connection test record in database.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Connected Successfully</AlertTitle>
      <AlertDescription className="text-green-700">
        Last connection check: {new Date(data.checked_at).toLocaleString()}
      </AlertDescription>
    </Alert>
  );
}
