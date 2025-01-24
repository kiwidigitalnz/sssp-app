import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profile settings will be implemented with Supabase authentication.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;