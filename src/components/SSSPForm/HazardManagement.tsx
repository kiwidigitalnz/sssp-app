import { useState, useEffect } from "react";
import { HazardTable } from "./HazardTable";
import { HazardActions } from "./HazardActions";
import { RiskLevelGuide } from "./RiskLevelGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Hazard and Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiskLevelGuide />
          
          <div className="space-y-6">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <HazardTable
                  hazards={hazards}
                  previousHazards={previousHazards}
                  previousRisks={previousRisks}
                  previousControls={previousControls}
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
        </CardContent>
      </Card>
    </div>
  );
};