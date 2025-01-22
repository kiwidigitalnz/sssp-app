import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HazardSelection } from "./HazardSelection";

interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

interface HazardActionsProps {
  previousHazards: Hazard[];
  addHazard: () => void;
  addMultipleHazards: (hazards: Hazard[]) => void;
}

export const HazardActions = ({
  previousHazards,
  addHazard,
  addMultipleHazards,
}: HazardActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shadow-sm"
        onClick={addHazard}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Single Hazard
      </Button>
      <HazardSelection
        previousHazards={previousHazards}
        onSelect={addMultipleHazards}
      />
    </div>
  );
};