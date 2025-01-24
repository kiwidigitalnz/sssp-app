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
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Define simple types to avoid deep type instantiation
type TeamMemberRole = 'admin' | 'editor' | 'viewer';

interface Profile {
  id: string;
  email?: string;
}

// Schema with custom error messages
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTeamMemberDialog({
  open,
  onOpenChange,
}: AddTeamMemberDialogProps) {
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
      console.log("Starting team member addition process:", values);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error("Authentication error");
      if (!user) throw new Error("No authenticated user found");
      
      console.log("Current user:", user.id);

      // Find invited user's profile using a simplified query
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

      // Check for existing membership with simplified query
      const { data: existingMember, error: checkError } = await supabase
        .from('team_members')
        .select('id')
        .eq('company_id', user.id)
        .eq('member_id', invitedProfile.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing membership:", checkError);
        throw new Error("Error checking team membership");
      }

      if (existingMember) {
        throw new Error("This user is already a team member");
      }

      // Add team member with simplified insert
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          company_id: user.id,
          member_id: invitedProfile.id,
          role: values.role,
        });

      if (insertError) {
        console.error("Error adding team member:", insertError);
        throw new Error("Failed to add team member");
      }

      // Success handling
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      onOpenChange(false);
      form.reset();

    } catch (error: any) {
      console.error("Error in team member addition:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add team member",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your team
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