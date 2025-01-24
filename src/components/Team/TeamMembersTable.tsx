import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, UserCog } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { useState } from "react";
import { UpdateRoleDialog } from "./UpdateRoleDialog";

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  onRemoveMember: (memberId: string) => Promise<void>;
  isCurrentUserAdmin: boolean;
}

export function TeamMembersTable({ teamMembers, onRemoveMember, isCurrentUserAdmin }: TeamMembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

  return (
    <>
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
                  <AvatarImage src={member.member_profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.member_profile.first_name?.[0]}
                    {member.member_profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {member.member_profile.first_name} {member.member_profile.last_name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {isCurrentUserAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMember(member);
                        setIsUpdateRoleOpen(true);
                      }}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UpdateRoleDialog
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRoleOpen}
        member={selectedMember}
      />
    </>
  );
}