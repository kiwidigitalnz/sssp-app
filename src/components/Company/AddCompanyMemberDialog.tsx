import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['owner', 'admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof formSchema>;

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  const onSubmit = async (values: FormValues) => {
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
        .maybeSingle();

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
        .maybeSingle();

      if (checkError) {
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
      form.reset();

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="member@company.com" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}