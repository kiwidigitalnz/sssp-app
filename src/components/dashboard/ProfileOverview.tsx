import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface ProfileOverviewProps {
  session: Session | null;
  profile: any;
}

export const ProfileOverview = ({ session, profile }: ProfileOverviewProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="text-gray-500">Name</p>
            <p className="font-medium">
              {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Not set'}
            </p>
          </div>
          <div className="text-sm">
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div className="text-sm">
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{profile?.phone || 'Not set'}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate('/profile')}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};