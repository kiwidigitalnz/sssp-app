
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  handleInvitationAcceptance: (userId: string, inviteToken: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  handleInvitationAcceptance: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session initialization error:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          console.log("Auth state changed:", _event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Handle invitation acceptance after authentication
          const urlParams = new URLSearchParams(window.location.search);
          const invite = urlParams.get('invite');
          
          if (session?.user && invite) {
            await handleInvitationAcceptance(session.user.id, invite);
            // Clear the invite from URL without refreshing the page
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      }
    );

    initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleInvitationAcceptance = async (userId: string, inviteToken: string | null) => {
    if (!inviteToken) return;

    try {
      const { data: invitation, error: inviteError } = await supabase
        .from("sssp_invitations")
        .select("*")
        .eq("id", inviteToken)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        throw new Error("Invalid or expired invitation");
      }

      const { error: accessError } = await supabase
        .from("sssp_access")
        .insert({
          sssp_id: invitation.sssp_id,
          user_id: userId,
          access_level: invitation.access_level,
        });

      if (accessError) throw accessError;

      const { error: updateError } = await supabase
        .from("sssp_invitations")
        .update({ status: "accepted" })
        .eq("id", inviteToken);

      if (updateError) throw updateError;

      await supabase.from("sssp_activity").insert({
        sssp_id: invitation.sssp_id,
        user_id: userId,
        action: "joined_sssp",
        details: { invitation_id: inviteToken },
      });

      toast({
        title: "Welcome!",
        description: "You now have access to the shared SSSP.",
      });

      // Navigate to the shared SSSP
      navigate(`/sssp/${invitation.sssp_id}`);
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error accepting invitation",
        description: error.message,
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verification=true`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      setSession(null);
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        login,
        logout,
        signup,
        handleInvitationAcceptance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
