import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Meeting {
  type: string;
  frequency: string;
  attendees: string;
}

interface MeetingSelectionProps {
  previousMeetings: Meeting[];
  onSelect: (selectedMeetings: Meeting[]) => void;
}

export const MeetingSelection = ({
  previousMeetings,
  onSelect,
}: MeetingSelectionProps) => {
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const handleToggle = (index: number) => {
    const newSelected = new Set(selected);
    if (selected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const handleAdd = () => {
    const selectedItems = Array.from(selected).map(
      (index) => previousMeetings[index]
    );
    onSelect(selectedItems);
    setSelected(new Set());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Multiple Meetings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Meetings from Previous Entries</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {previousMeetings.map((meeting, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border p-4 rounded-lg"
              >
                <Checkbox
                  id={`meeting-${index}`}
                  checked={selected.has(index)}
                  onCheckedChange={() => handleToggle(index)}
                />
                <div className="space-y-1">
                  <Label htmlFor={`meeting-${index}`}>
                    <div className="font-medium">{meeting.type}</div>
                    <div className="text-sm text-muted-foreground">
                      Frequency: {meeting.frequency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Attendees: {meeting.attendees}
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end">
          <Button onClick={handleAdd} disabled={selected.size === 0}>
            Add Selected ({selected.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};