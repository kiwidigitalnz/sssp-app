import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CompanyMemberFormValues } from "./MemberForm";

interface UpdateCompanyRoleDialogProps {
  memberId: string;
  onRoleUpdated: () => void;
}

export function UpdateCompanyRoleDialog({ memberId, onRoleUpdated }: UpdateCompanyRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('company_access')
        .update({ role })
        .eq('id', memberId);

      if (error) {
        throw new Error("Error updating role");
      }

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      setOpen(false);
      onRoleUpdated();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Update Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Company Member Role</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter new role"
          className="border p-2"
        />
        <Button onClick={handleSubmit} className="mt-4">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
