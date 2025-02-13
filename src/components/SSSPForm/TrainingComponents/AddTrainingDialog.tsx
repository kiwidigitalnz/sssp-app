
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTrainingDialogProps {
  newTraining: {
    requirement: string;
    description: string;
    frequency: string;
  };
  setNewTraining: (training: {
    requirement: string;
    description: string;
    frequency: string;
  }) => void;
  onAdd: () => void;
}

export const AddTrainingDialog = ({
  newTraining,
  setNewTraining,
  onAdd,
}: AddTrainingDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-background hover:bg-muted h-9 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Training
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Training Requirement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="requirement">Training Requirement</Label>
            <Input
              id="requirement"
              value={newTraining.requirement}
              onChange={(e) =>
                setNewTraining({
                  ...newTraining,
                  requirement: e.target.value,
                })
              }
              placeholder="Enter training requirement"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTraining.description}
              onChange={(e) =>
                setNewTraining({
                  ...newTraining,
                  description: e.target.value,
                })
              }
              placeholder="Enter training description"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              value={newTraining.frequency}
              onChange={(e) =>
                setNewTraining({
                  ...newTraining,
                  frequency: e.target.value,
                })
              }
              placeholder="e.g., Annual, Monthly, One-time"
            />
          </div>
          <Button
            onClick={onAdd}
            className="w-full mt-4"
          >
            Add Training
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
