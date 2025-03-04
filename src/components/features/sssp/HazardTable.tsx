
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HazardFormData } from "@/types/sssp/forms";
import type { HazardTableProps } from "@/types/sssp/ui";

export const HazardTable = ({
  hazards,
  previousHazards,
  previousRisks,
  previousControls,
  updateHazard,
  removeHazard,
}: HazardTableProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[25%] min-w-[200px]">Hazard/Risk Source</TableHead>
            <TableHead className="w-[15%] min-w-[120px]">Risk Level</TableHead>
            <TableHead className="w-[30%] min-w-[250px]">Control Measures</TableHead>
            <TableHead className="w-[5%] min-w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hazards.map((hazard: HazardFormData, index: number) => (
            <TableRow key={index} className="hover:bg-muted/50">
              <TableCell className="align-top">
                <Input
                  value={hazard.hazard}
                  onChange={(e) => updateHazard(index, "hazard", e.target.value)}
                  placeholder="Describe the hazard"
                  className="w-full"
                />
              </TableCell>
              <TableCell className="align-top">
                <Select
                  value={hazard.riskLevel}
                  onValueChange={(value) => updateHazard(index, "riskLevel", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  value={hazard.controlMeasures}
                  onChange={(e) =>
                    updateHazard(index, "controlMeasures", e.target.value)
                  }
                  placeholder="List control measures (hierarchy of controls)"
                  className="w-full"
                />
              </TableCell>
              <TableCell className="align-top">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHazard(index)}
                  className="hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {hazards.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No hazards added yet. Click "Add Single Hazard" to begin.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
