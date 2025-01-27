import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { PasswordReset } from "@/components/auth/PasswordReset";
import { UpdatePassword } from "@/components/auth/UpdatePassword";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const type = searchParams.get("type");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    if (inviteToken) {
      const email = searchParams.get("email");
      if (email) {
        setSignupEmail(email);
        setLoginEmail(email);
      }
    }
  }, [inviteToken, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      
      if (inviteToken && data.user) {
        await handleInvitation(data.user.id);
      }

      navigate("/");
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth?verification=true`,
        },
      });

      if (error) throw error;
      
      if (inviteToken && data.user) {
        await handleInvitation(data.user.id);
      }
      
      toast({
        title: "Welcome!",
        description: "Please check your email to verify your account.",
      });
      
      const loginTab = document.querySelector('[data-tab="login"]') as HTMLElement;
      if (loginTab) loginTab.click();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleQuickLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Quick Login (Demo User)"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" data-tab="login">Login</TabsTrigger>
            <TabsTrigger value="signup" data-tab="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setShowPasswordReset(true)}
              >
                Forgot password?
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {inviteToken ? "Accepting invitation..." : "Logging in..."}
                  </>
                ) : (
                  inviteToken ? "Login & Accept Invitation" : "Login"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="john@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {inviteToken ? "Creating account & accepting..." : "Creating account..."}
                  </>
                ) : (
                  inviteToken ? "Create Account & Accept Invitation" : "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
