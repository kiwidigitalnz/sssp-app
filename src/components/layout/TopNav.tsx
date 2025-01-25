import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-lg font-bold">
        <Link to="/">MyApp</Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span>{user.email}</span>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
