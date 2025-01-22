import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const renderDropdown = (
    items: string[],
    current: string,
    onChange: (value: string) => void
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {current || "Select..."}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {items.map((item, i) => (
          <DropdownMenuItem key={i} onSelect={() => onChange(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hazard</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Control Measures</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hazards.map((hazard: Hazard, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2">
                {renderDropdown(
                  previousHazards.map((h) => h.hazard),
                  hazard.hazard,
                  (value) => updateHazard(index, "hazard", value)
                )}
                <QuickFillButton
                  fieldId={`hazard-${index}`}
                  fieldName="Hazard"
                  onSelect={(value) => updateHazard(index, "hazard", value)}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {renderDropdown(
                  previousRisks,
                  hazard.risk,
                  (value) => updateHazard(index, "risk", value)
                )}
                <QuickFillButton
                  fieldId={`risk-${index}`}
                  fieldName="Risk"
                  onSelect={(value) => updateHazard(index, "risk", value)}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {renderDropdown(
                  previousControls,
                  hazard.controlMeasures,
                  (value) => updateHazard(index, "controlMeasures", value)
                )}
                <QuickFillButton
                  fieldId={`control-measures-${index}`}
                  fieldName="Control Measures"
                  onSelect={(value) =>
                    updateHazard(index, "controlMeasures", value)
                  }
                />
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHazard(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};