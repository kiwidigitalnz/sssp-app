
import { useState } from "react";
import { HazardTable } from "@/components/SSSPForm/HazardTable";
import { HazardActions } from "@/components/SSSPForm/HazardActions";
import { RiskLevelGuide } from "@/components/SSSPForm/RiskLevelGuide";
import { Card, CardContent } from "@/components/ui/card";
import type { HazardFormData } from "@/types/sssp/forms";

interface HazardManagementSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const HazardManagementSection = ({ data, setFormData }: HazardManagementSectionProps) => {
  const [previousHazards] = useState<HazardFormData[]>([]);
  const hazards = data.hazards || [];

  const addHazard = () => {
    const updatedHazards = [
      ...hazards,
      { hazard: "", risk: "", riskLevel: "Low" as const, controlMeasures: "" }
    ];
    setFormData({ ...data, hazards: updatedHazards });
  };

  const removeHazard = (index: number) => {
    const updatedHazards = hazards.filter((_: any, i: number) => i !== index);
    setFormData({ ...data, hazards: updatedHazards });
  };

  const updateHazard = (index: number, field: keyof HazardFormData, value: string) => {
    const updatedHazards = hazards.map((hazard: HazardFormData, i: number) =>
      i === index ? { ...hazard, [field]: value } : hazard
    );
    setFormData({ ...data, hazards: updatedHazards });
  };

  const addMultipleHazards = (selectedHazards: HazardFormData[]) => {
    const updatedHazards = [...hazards, ...selectedHazards];
    setFormData({ ...data, hazards: updatedHazards });
  };

  return (
    <div className="space-y-6">
      <RiskLevelGuide />
      
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <HazardTable
            hazards={hazards}
            previousHazards={previousHazards}
            previousRisks={[]}
            previousControls={[]}
            updateHazard={updateHazard}
            removeHazard={removeHazard}
          />

          <div className="mt-4">
            <HazardActions
              previousHazards={previousHazards}
              addHazard={addHazard}
              addMultipleHazards={addMultipleHazards}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
