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

interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

interface HazardTableProps {
  hazards: Hazard[];
  previousHazards: Hazard[];
  previousRisks: string[];
  previousControls: string[];
  updateHazard: (index: number, field: keyof Hazard, value: string) => void;
  removeHazard: (index: number) => void;
}

export const HazardTable = ({
  hazards,
  previousHazards,
  previousRisks,
  previousControls,
  updateHazard,
  removeHazard,
}: HazardTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Hazard/Risk Source</TableHead>
          <TableHead className="w-[15%]">Risk Level</TableHead>
          <TableHead className="w-[20%]">Potential Harm</TableHead>
          <TableHead className="w-[30%]">Control Measures</TableHead>
          <TableHead className="w-[10%]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hazards.map((hazard: Hazard, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                value={hazard.hazard}
                onChange={(e) => updateHazard(index, "hazard", e.target.value)}
                placeholder="Describe the hazard"
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Select
                value={hazard.risk}
                onValueChange={(value) => updateHazard(index, "risk", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input
                value={hazard.risk}
                onChange={(e) => updateHazard(index, "risk", e.target.value)}
                placeholder="Describe potential harm"
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                value={hazard.controlMeasures}
                onChange={(e) =>
                  updateHazard(index, "controlMeasures", e.target.value)
                }
                placeholder="List control measures (hierarchy of controls)"
                className="w-full"
              />
            </TableCell>
            <TableCell>
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
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No hazards added yet. Click "Add Single Hazard" to begin.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};