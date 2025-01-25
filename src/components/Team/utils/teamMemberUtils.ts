import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

// Simplified type definition to avoid deep nesting
type TeamMemberRole = 'admin' | 'editor' | 'viewer';

export async function findProfileByEmail(email: string) {
  // First get the user from auth.users through Supabase auth
  const { data, error: authError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1
  });

  if (authError) throw new Error("Error looking up user");
  
  const user = data.users.find((u: User) => u.email === email);
  if (!user) throw new Error("No user found with this email address");

  // Then get their profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError) throw new Error("Error looking up user profile");
  if (!profile) throw new Error("No profile found for this user");
  
  return profile;
}

export async function checkExistingMembership(companyId: string, memberId: string) {
  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('company_id', companyId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw new Error("Error checking team membership");
  if (data) throw new Error("This user is already a team member");
}

export async function addTeamMember(companyId: string, memberId: string, role: TeamMemberRole) {
  const { error } = await supabase
    .from('team_members')
    .insert({
      company_id: companyId,
      member_id: memberId,
      role: role,
    });

  if (error) throw new Error("Failed to add team member");
}