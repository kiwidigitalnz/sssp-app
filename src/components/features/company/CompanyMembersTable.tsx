import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CompanyMemberFormValues } from "./MemberForm";
import { RoleSelector } from "./RoleSelector";
import { AddCompanyMemberDialog } from "./AddCompanyMemberDialog";

interface CompanyMembersTableProps {
  members: any[];
  onMemberRemoved: (id: string) => void;
}

export function CompanyMembersTable({ members, onMemberRemoved }: CompanyMembersTableProps) {
  const { toast } = useToast();

  const handleRemoveMember = async (id: string) => {
    try {
      const { error } = await supabase.from("company_access").delete().eq("id", id);
      if (error) throw error;

      onMemberRemoved(id);
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  return (
    <div>
      <AddCompanyMemberDialog onMemberAdded={() => {}} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <RoleSelector field={{ value: member.role, onChange: () => {} }} disabled={false} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
