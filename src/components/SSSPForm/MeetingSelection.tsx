
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { Meeting, MeetingFrequency } from "@/types/meetings";
import { toast } from "@/components/ui/use-toast";

interface MeetingSelectionProps {
  meetings: Meeting[];
  onMeetingsChange: (meetings: Meeting[]) => void;
}

export const MeetingSelection = ({
  meetings,
  onMeetingsChange,
}: MeetingSelectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const [newMeeting, setNewMeeting] = useState<Meeting>({
    type: "",
    frequency: "weekly",
    participants: [],
    description: "",
  });

  const handleAddMeeting = () => {
    if (!newMeeting.type || newMeeting.participants.length === 0) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingIndex > -1) {
      const updatedMeetings = [...meetings];
      updatedMeetings[editingIndex] = newMeeting;
      onMeetingsChange(updatedMeetings);
    } else {
      onMeetingsChange([...meetings, newMeeting]);
    }

    setNewMeeting({
      type: "",
      frequency: "weekly",
      participants: [],
      description: "",
    });
    setEditingIndex(-1);
    setIsDialogOpen(false);
  };

  const handleEditMeeting = (meeting: Meeting, index: number) => {
    setEditingIndex(index);
    setNewMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleDeleteMeeting = (index: number) => {
    const updatedMeetings = meetings.filter((_, i) => i !== index);
    onMeetingsChange(updatedMeetings);
  };

  const frequencies: MeetingFrequency[] = [
    "daily",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "asneeded",
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingIndex > -1 ? "Edit Meeting" : "Add New Meeting"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Meeting Type *</Label>
                <Input
                  id="type"
                  value={newMeeting.type}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, type: e.target.value })
                  }
                  placeholder="e.g., Safety Committee Meeting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={newMeeting.frequency}
                  onValueChange={(value: MeetingFrequency) =>
                    setNewMeeting({ ...newMeeting, frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants *</Label>
                <Input
                  id="participants"
                  value={newMeeting.participants.join(", ")}
                  onChange={(e) =>
                    setNewMeeting({
                      ...newMeeting,
                      participants: e.target.value.split(",").map(p => p.trim()).filter(Boolean)
                    })
                  }
                  placeholder="e.g., All site workers, Safety Officer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMeeting.description}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, description: e.target.value })
                  }
                  placeholder="Meeting details and objectives..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeeting}>
                {editingIndex > -1 ? "Update" : "Add"} Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4 space-y-4">
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 rounded-lg border bg-card"
            >
              <div className="space-y-1">
                <h4 className="font-medium">{meeting.type}</h4>
                <p className="text-sm text-muted-foreground">
                  Frequency: {meeting.frequency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Participants: {meeting.participants.join(", ")}
                </p>
                {meeting.description && (
                  <p className="text-sm text-muted-foreground">
                    {meeting.description}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditMeeting(meeting, index)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteMeeting(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {meetings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No meetings scheduled. Click "Add Meeting" to create one.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
