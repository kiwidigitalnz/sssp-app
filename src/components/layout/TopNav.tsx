import { User, LogOut, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-bold text-xl text-gray-900">SSSP Manager</span>
              <span className="text-xs text-muted-foreground -mt-1">by Kiwi Digital</span>
            </div>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}