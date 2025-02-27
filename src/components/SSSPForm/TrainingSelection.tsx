
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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Training {
  requirement: string;
  description: string;
  frequency: string;
}

interface TrainingSelectionProps {
  previousTrainings: Training[];
  onSelect: (selectedTrainings: Training[]) => void;
}

export const TrainingSelection = ({
  previousTrainings,
  onSelect,
}: TrainingSelectionProps) => {
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  // Filter to get only unique training requirements
  const uniqueTrainings = useMemo(() => {
    const trainingMap = new Map<string, Training>();
    
    // Use requirement as the unique key
    previousTrainings.forEach(training => {
      if (!trainingMap.has(training.requirement)) {
        trainingMap.set(training.requirement, training);
      }
    });
    
    return Array.from(trainingMap.values());
  }, [previousTrainings]);

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
      (index) => uniqueTrainings[index]
    );
    onSelect(selectedItems);
    setSelected(new Set());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Multiple Training Requirements
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Training Requirements from Previous Entries</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {uniqueTrainings.map((training, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border p-4 rounded-lg"
              >
                <Checkbox
                  id={`training-${index}`}
                  checked={selected.has(index)}
                  onCheckedChange={() => handleToggle(index)}
                />
                <div className="space-y-1">
                  <Label htmlFor={`training-${index}`}>
                    <div className="font-medium">{training.requirement}</div>
                    <div className="text-sm text-muted-foreground">
                      Description: {training.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Frequency: {training.frequency}
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
