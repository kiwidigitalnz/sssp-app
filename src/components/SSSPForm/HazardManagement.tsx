import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown } from "lucide-react";
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
import { useState, useEffect } from "react";
import { HazardSelection } from "./HazardSelection";

interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

interface HazardManagementProps {
  formData: {
    hazards?: Hazard[];
  };
  setFormData: (data: any) => void;
}

export const HazardManagement = ({
  formData,
  setFormData,
}: HazardManagementProps) => {
  const hazards = formData.hazards || [];
  const [previousHazards, setPreviousHazards] = useState<Hazard[]>([]);
  const [previousRisks, setPreviousRisks] = useState<string[]>([]);
  const [previousControls, setPreviousControls] = useState<string[]>([]);

  useEffect(() => {
    const storedSSSPs = localStorage.getItem("sssps");
    if (storedSSSPs) {
      const sssps = JSON.parse(storedSSSPs);
      const allHazards: Hazard[] = [];
      const allRisks = new Set<string>();
      const allControls = new Set<string>();

      sssps.forEach((sssp: any) => {
        sssp.hazards?.forEach((h: Hazard) => {
          if (h.hazard && h.risk && h.controlMeasures) {
            allHazards.push(h);
          }
          if (h.risk) allRisks.add(h.risk);
          if (h.controlMeasures) allControls.add(h.controlMeasures);
        });
      });

      setPreviousHazards(allHazards);
      setPreviousRisks(Array.from(allRisks));
      setPreviousControls(Array.from(allControls));
    }
  }, []);

  const addHazard = () => {
    setFormData({
      ...formData,
      hazards: [...hazards, { hazard: "", risk: "", controlMeasures: "" }],
    });
  };

  const addMultipleHazards = (selectedHazards: Hazard[]) => {
    setFormData({
      ...formData,
      hazards: [...hazards, ...selectedHazards],
    });
  };

  const removeHazard = (index: number) => {
    const updatedHazards = hazards.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, hazards: updatedHazards });
  };

  const updateHazard = (index: number, field: keyof Hazard, value: string) => {
    const updatedHazards = hazards.map((hazard: Hazard, i: number) =>
      i === index ? { ...hazard, [field]: value } : hazard
    );
    setFormData({ ...formData, hazards: updatedHazards });
  };

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hazard and Risk Management</h2>

      <div className="space-y-4">
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

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
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
      </div>
    </div>
  );
};