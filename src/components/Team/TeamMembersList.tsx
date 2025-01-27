import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersTable } from "./TeamMembersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { TeamMember } from "@/types/team";

export function TeamMembersList() {
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      return user;
    },
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          member_profile:profiles!team_members_member_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('company_id', user.id);

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const isCurrentUserAdmin = teamMembers.some(
    member => member.member_id === currentUser?.id && member.role === 'admin'
  );

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <TeamMembersTable 
          teamMembers={teamMembers}
          onRemoveMember={removeMember}
          isCurrentUserAdmin={!!isCurrentUserAdmin}
        />
      </CardContent>
    </Card>
  );
}