
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
import { Plus, ListPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { HazardFormData } from "@/types/sssp/forms";

interface HazardSelectionProps {
  previousHazards: HazardFormData[];
  onSelect: (selectedHazards: HazardFormData[]) => void;
}

export const HazardSelection = ({
  previousHazards,
  onSelect,
}: HazardSelectionProps) => {
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
    const selectedHazards = Array.from(selected).map(
      (index) => previousHazards[index]
    );
    onSelect(selectedHazards);
    setSelected(new Set());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="shadow-sm min-w-[160px]"
        >
          <ListPlus className="mr-2 h-4 w-4" />
          Add Multiple Hazards
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <ListPlus className="h-5 w-5 text-primary" />
            Select Hazards from Previous Entries
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4 mt-4">
          <div className="space-y-3">
            {previousHazards.map((hazard, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border p-4 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={`hazard-${index}`}
                  checked={selected.has(index)}
                  onCheckedChange={() => handleToggle(index)}
                  className="mt-1"
                />
                <div className="space-y-1.5 flex-1">
                  <Label 
                    htmlFor={`hazard-${index}`}
                    className="font-medium text-base"
                  >
                    {hazard.hazard}
                  </Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">Risk Level:</span> {hazard.riskLevel}</p>
                    <p><span className="font-medium">Control Measures:</span> {hazard.controlMeasures}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleAdd} 
            disabled={selected.size === 0}
            className="min-w-[120px]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {selected.size > 0 ? `(${selected.size})` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
