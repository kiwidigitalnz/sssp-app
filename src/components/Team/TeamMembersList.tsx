import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, Crown } from "lucide-react";
import { useState } from "react";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { TransferOwnershipDialog } from "./TransferOwnershipDialog";
import { TeamMembersTable } from "./TeamMembersTable";
import { useToast } from "@/components/ui/use-toast";
import type { TeamMember } from "@/types/team";

export function TeamMembersList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      return user;
    },
  });

  const { data: teamMembers, isLoading } = useQuery({
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

  const isCurrentUserAdmin = teamMembers?.some(
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

  if (isLoading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>
        <div className="flex gap-2">
          {isCurrentUserAdmin && (
            <>
              <Button
                onClick={() => setIsTransferDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Transfer Ownership
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            </>
          )}
        </div>
      </div>

      <TeamMembersTable
        teamMembers={teamMembers || []}
        onRemoveMember={removeMember}
        isCurrentUserAdmin={!!isCurrentUserAdmin}
      />

      <AddTeamMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <TransferOwnershipDialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        teamMembers={teamMembers || []}
      />
    </div>
  );
}