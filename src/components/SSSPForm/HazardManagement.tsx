import { useState, useEffect } from "react";
import { HazardTable } from "./HazardTable";
import { HazardActions } from "./HazardActions";

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hazard and Risk Management</h2>

      <div className="space-y-4">
        <HazardTable
          hazards={hazards}
          previousHazards={previousHazards}
          previousRisks={previousRisks}
          previousControls={previousControls}
          updateHazard={updateHazard}
          removeHazard={removeHazard}
        />

        <HazardActions
          previousHazards={previousHazards}
          addHazard={addHazard}
          addMultipleHazards={addMultipleHazards}
        />
      </div>
    </div>
  );
};