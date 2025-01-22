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
import { Label } from "@/components/ui/label";

interface Audit {
  type: string;
  frequency: string;
  responsible: string;
  lastDate: string;
  nextDate: string;
}

interface AuditSelectionProps {
  previousAudits: Audit[];
  onSelect: (selectedAudits: Audit[]) => void;
}

export const AuditSelection = ({
  previousAudits,
  onSelect,
}: AuditSelectionProps) => {
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
      (index) => previousAudits[index]
    );
    onSelect(selectedItems);
    setSelected(new Set());
  };

  return (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Audits from Previous Entries</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {previousAudits.map((audit, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border p-4 rounded-lg"
              >
                <Checkbox
                  id={`audit-${index}`}
                  checked={selected.has(index)}
                  onCheckedChange={() => handleToggle(index)}
                />
                <div className="space-y-1">
                  <Label htmlFor={`audit-${index}`}>
                    <div className="font-medium">{audit.type}</div>
                    <div className="text-sm text-muted-foreground">
                      Frequency: {audit.frequency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Responsible: {audit.responsible}
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