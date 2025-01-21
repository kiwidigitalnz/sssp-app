import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

export const HazardManagement = ({ formData, setFormData }: any) => {
  const hazards = formData.hazards || [];

  const addHazard = () => {
    setFormData({
      ...formData,
      hazards: [...hazards, { hazard: "", risk: "", controlMeasures: "" }],
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hazards.map((hazard: Hazard, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={hazard.hazard}
                    onChange={(e) => updateHazard(index, "hazard", e.target.value)}
                    placeholder="e.g., Fatigue"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={hazard.risk}
                    onChange={(e) => updateHazard(index, "risk", e.target.value)}
                    placeholder="e.g., Driver drowsiness"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={hazard.controlMeasures}
                    onChange={(e) => updateHazard(index, "controlMeasures", e.target.value)}
                    placeholder="e.g., Fatigue management plan"
                  />
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={addHazard}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Hazard
        </Button>
      </div>
    </div>
  );
};