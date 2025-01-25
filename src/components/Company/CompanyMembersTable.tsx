import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCog, Trash2 } from "lucide-react";
import type { CompanyAccess } from "@/types/company";
import { useState } from "react";
import { UpdateCompanyRoleDialog } from "./UpdateCompanyRoleDialog";

interface CompanyMembersTableProps {
  companyMembers: CompanyAccess[];
  onRemoveMember: (memberId: string) => Promise<void>;
  isCurrentUserOwner: boolean;
}

export function CompanyMembersTable({ 
  companyMembers, 
  onRemoveMember, 
  isCurrentUserOwner 
}: CompanyMembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<CompanyAccess | null>(null);
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
          {companyMembers?.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.company_profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.company_profile.first_name?.[0]}
                    {member.company_profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {member.company_profile.first_name} {member.company_profile.last_name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {isCurrentUserOwner && (
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

      <UpdateCompanyRoleDialog
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRoleOpen}
        member={selectedMember}
      />
    </>
  );
}