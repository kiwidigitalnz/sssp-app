import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database['public']['Tables']['team_members']['Row'] & {
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export function TeamMembersList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          profiles:member_id (
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

  const removeMember = async (memberId: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team member",
      });
    } else {
      toast({
        title: "Success",
        description: "Team member removed successfully",
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
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers?.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.profiles.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.profiles.first_name?.[0]}
                    {member.profiles.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {member.profiles.first_name} {member.profiles.last_name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddTeamMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}