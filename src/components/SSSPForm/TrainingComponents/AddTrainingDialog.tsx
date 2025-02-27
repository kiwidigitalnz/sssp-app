
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
import { Plus, Pencil } from "lucide-react";

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
  isEditing?: boolean;
}

export const AddTrainingDialog = ({
  newTraining,
  setNewTraining,
  onAdd,
  isEditing = false,
}: AddTrainingDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 bg-background hover:bg-muted"
        >
          {isEditing ? (
            <>
              <Pencil className="h-4 w-4" />
              Update Training
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Training
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Training Requirement" : "Add New Training Requirement"}
          </DialogTitle>
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
            {isEditing ? "Update Training" : "Add Training"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
