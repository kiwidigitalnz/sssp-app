import type { Database } from "@/integrations/supabase/types";

export type TeamMember = Database['public']['Tables']['team_members']['Row'] & {
  member_profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};