import { User, Settings, LogOut, FileText, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function TopNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">SafetySys</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="ml-8 flex items-center space-x-4">
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </Link>
          <Link
            to="/create-sssp"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
              isActive("/create-sssp") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline-block">New SSSP</span>
          </Link>
        </nav>

        {/* User Menu (existing code) */}
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
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
              <DropdownMenuItem asChild>
                <Link to="/company-settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Company Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}