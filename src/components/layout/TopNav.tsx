import { User, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function TopNav() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const avatarUrl = profile?.avatar_url 
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl 
    : undefined;

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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : session.user.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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