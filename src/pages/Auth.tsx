import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { PasswordReset } from "@/components/auth/PasswordReset";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const type = searchParams.get("type");
  const { toast } = useToast();

  useEffect(() => {
    if (inviteToken) {
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, [inviteToken, searchParams]);

  const handleInvitation = async (userId: string) => {
    if (!inviteToken) return;

    try {
      // First verify the invitation is valid
      const { data: invitation, error: inviteError } = await supabase
        .from("sssp_invitations")
        .select("*")
        .eq("id", inviteToken)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        throw new Error("Invalid or expired invitation");
      }

      // Create access record
      const { error: accessError } = await supabase
        .from("sssp_access")
        .insert({
          sssp_id: invitation.sssp_id,
          user_id: userId,
          access_level: invitation.access_level,
        });

      if (accessError) throw accessError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from("sssp_invitations")
        .update({ status: "accepted" })
        .eq("id", inviteToken);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from("sssp_activity").insert({
        sssp_id: invitation.sssp_id,
        user_id: userId,
        action: "joined_sssp",
        details: { invitation_id: inviteToken },
      });

      toast({
        title: "Invitation accepted",
        description: "You now have access to the shared SSSP.",
      });
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show update password form if we're in recovery mode
  if (type === "recovery") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Update Password</h1>
            <p className="text-muted-foreground">Enter your new password below</p>
          </div>
          <UpdatePassword />
        </Card>
      </div>
    );
  }

  // Show password reset form if requested
  if (showPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>
          <PasswordReset onBack={() => setShowPasswordReset(false)} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to SSSP Manager</h1>
          <p className="text-muted-foreground">
            {inviteToken 
              ? "Accept invitation by signing in or creating an account"
              : "Sign in to your account or create a new one"
            }
          </p>
        </div>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" data-tab="login">Login</TabsTrigger>
            <TabsTrigger value="signup" data-tab="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              email={email}
              setEmail={setEmail}
              onForgotPassword={() => setShowPasswordReset(true)}
              inviteToken={inviteToken}
              handleInvitation={handleInvitation}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm
              email={email}
              setEmail={setEmail}
              inviteToken={inviteToken}
              handleInvitation={handleInvitation}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}