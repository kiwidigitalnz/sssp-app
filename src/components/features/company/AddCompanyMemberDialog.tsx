import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MemberForm } from "./MemberForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CompanyMemberFormValues } from "./MemberForm";

interface AddCompanyMemberDialogProps {
  onMemberAdded: () => void;
}

export function AddCompanyMemberDialog({ onMemberAdded }: AddCompanyMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: CompanyMemberFormValues) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      // Find the profile of the invited user
      const { data: invitedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();

      if (profileError) {
        console.error("Error finding profile:", profileError);
        throw new Error("User not found");
      }

      if (!invitedProfile) {
        throw new Error("User not found");
      }

      // Check if the user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('company_access')
        .select('id')
        .eq('company_id', user.id)
        .eq('user_id', invitedProfile.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing membership:", checkError);
        throw new Error("Error checking company membership");
      }

      if (existingMember) {
        throw new Error("User is already a member of the company");
      }

      // Add the new member
      const { error: insertError } = await supabase.from('company_access').insert({
        company_id: user.id,
        user_id: invitedProfile.id,
        role: values.role,
      });

      if (insertError) {
        console.error("Error adding member:", insertError);
        throw new Error("Error adding member to company");
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      setOpen(false);
      onMemberAdded();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add member",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company Member</DialogTitle>
        </DialogHeader>
        <MemberForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}