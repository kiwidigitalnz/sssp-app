
import React, { useMemo } from "react";
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
import { Plus, Calendar, Users, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Meeting } from "@/types/meetings";

interface PreviousMeetingSelectionProps {
  previousMeetings: Meeting[];
  onSelect: (selectedMeetings: Meeting[]) => void;
}

export const PreviousMeetingSelection = ({
  previousMeetings,
  onSelect,
}: PreviousMeetingSelectionProps) => {
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  // Filter to get only unique meeting types
  const uniqueMeetings = useMemo(() => {
    const meetingMap = new Map<string, Meeting>();
    
    // Use meeting type as the unique key
    previousMeetings.forEach(meeting => {
      if (!meetingMap.has(meeting.type)) {
        meetingMap.set(meeting.type, meeting);
      }
    });
    
    return Array.from(meetingMap.values());
  }, [previousMeetings]);

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
      (index) => uniqueMeetings[index]
    );
    onSelect(selectedItems);
    setSelected(new Set());
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
      case 'weekly':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'monthly':
      case 'quarterly':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add from Previous Meetings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Meetings from Previous Entries</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {uniqueMeetings.map((meeting, index) => (
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
                    <div className="flex items-center gap-2">
                      {getFrequencyIcon(meeting.frequency)}
                      <span className="font-medium">{meeting.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Frequency: {meeting.frequency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Participants: {(meeting.participants || []).join(", ")}
                    </div>
                    {meeting.description && (
                      <div className="text-sm text-muted-foreground">
                        Description: {meeting.description}
                      </div>
                    )}
                  </Label>
                </div>
              </div>
            ))}
            {uniqueMeetings.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No previous meetings found. Create a meeting first in any SSSP.
              </div>
            )}
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
