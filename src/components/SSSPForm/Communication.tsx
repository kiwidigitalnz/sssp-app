import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CommunicationProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const Communication = ({ formData, setFormData }: CommunicationProps) => {
  const [meetings, setMeetings] = useState(formData.meetings || []);

  const addMeeting = () => {
    const newMeetings = [...meetings, { type: "", frequency: "", attendees: "" }];
    setMeetings(newMeetings);
    setFormData({ ...formData, meetings: newMeetings });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication and Consultation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Health and Safety Meetings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Required Attendees</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={meeting.type}
                        onChange={(e) => {
                          const newMeetings = [...meetings];
                          newMeetings[index].type = e.target.value;
                          setMeetings(newMeetings);
                          setFormData({ ...formData, meetings: newMeetings });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={meeting.frequency}
                        onChange={(e) => {
                          const newMeetings = [...meetings];
                          newMeetings[index].frequency = e.target.value;
                          setMeetings(newMeetings);
                          setFormData({ ...formData, meetings: newMeetings });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={meeting.attendees}
                        onChange={(e) => {
                          const newMeetings = [...meetings];
                          newMeetings[index].attendees = e.target.value;
                          setMeetings(newMeetings);
                          setFormData({ ...formData, meetings: newMeetings });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newMeetings = meetings.filter((_, i) => i !== index);
                          setMeetings(newMeetings);
                          setFormData({ ...formData, meetings: newMeetings });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addMeeting} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Meeting
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Worker Feedback Mechanisms</h3>
            <Textarea
              placeholder="Document how workers can provide feedback..."
              value={formData.workerFeedback || ""}
              onChange={(e) => setFormData({ ...formData, workerFeedback: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Procedure Change Notifications</h3>
            <Textarea
              placeholder="Document how changes in procedures are communicated..."
              value={formData.procedureChanges || ""}
              onChange={(e) => setFormData({ ...formData, procedureChanges: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};