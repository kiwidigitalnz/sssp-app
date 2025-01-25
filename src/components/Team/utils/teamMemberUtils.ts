import { supabase } from "@/integrations/supabase/client";

// Simplified type definition to avoid deep nesting
type TeamMemberRole = 'admin' | 'editor' | 'viewer';

export async function findProfileByEmail(email: string) {
  // First get the user from auth.users through Supabase auth
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
    filters: {
      email: email
    }
  });

  if (authError) throw new Error("Error looking up user");
  if (!users || users.length === 0) throw new Error("No user found with this email address");

  // Then get their profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', users[0].id)
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