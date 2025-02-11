import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  onForgotPassword: () => void;
  inviteToken?: string | null;
  handleInvitation?: (userId: string) => Promise<void>;
}

export const LoginForm = ({
  email,
  setEmail,
  onForgotPassword,
  inviteToken,
  handleInvitation,
}: LoginFormProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "demo@sssp.dev",
        password: "demo123456",
      });

      if (error) {
        console.error("Quick login error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      navigate("/");
      toast({
        title: "Welcome to the demo!",
        description: "You have successfully logged in as the demo user.",
      });
    } catch (error: any) {
      console.error("Quick login error:", error);
      toast({
        title: "Quick Login Failed",
        description: error.message || "An error occurred during quick login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }
      
      if (inviteToken && data.user && handleInvitation) {
        await handleInvitation(data.user.id);
      }

      navigate("/");
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={onForgotPassword}
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
    </>
  );
};
