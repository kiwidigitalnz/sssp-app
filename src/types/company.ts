import type { Database } from "@/integrations/supabase/types";

export type CompanyAccess = Database['public']['Tables']['company_access']['Row'] & {
  company_profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export type CompanyRole = 'owner' | 'admin' | 'editor' | 'viewer';