import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MemberForm } from "./MemberForm";
import { CompanyMemberFormValues } from "@/types/company";

interface AddCompanyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyMemberDialog({
  open,
  onOpenChange,
}: AddCompanyMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onSubmit = async (values: CompanyMemberFormValues) => {
    try {
      setIsLoading(true);
      console.log("Starting company member addition process:", values);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error("Authentication error");
      if (!user) throw new Error("No authenticated user found");
      
      console.log("Current user:", user.id);

      const { data: invitedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();

      if (profileError) {
        console.error("Error finding profile:", profileError);
        throw new Error("Error looking up user profile");
      }

      if (!invitedProfile) {
        throw new Error("No user found with this email address");
      }

      console.log("Found invited profile:", invitedProfile.id);

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
        throw new Error("This user is already a company member");
      }

      const { error: insertError } = await supabase
        .from('company_access')
        .insert({
          company_id: user.id,
          user_id: invitedProfile.id,
          role: values.role,
        });

      if (insertError) {
        console.error("Error adding company member:", insertError);
        throw new Error("Failed to add company member");
      }

      queryClient.invalidateQueries({ queryKey: ["company-members"] });
      toast({
        title: "Success",
        description: "Company member added successfully",
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error("Error in company member addition:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add company member",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your company
          </DialogDescription>
        </DialogHeader>

        <MemberForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}