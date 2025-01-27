import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersTable } from "./TeamMembersTable";

export function TeamMembersList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <TeamMembersTable />
      </CardContent>
    </Card>
  );
}