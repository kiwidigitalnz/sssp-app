
import { useState, useEffect } from "react";
import { HazardTable } from "./HazardTable";
import { HazardActions } from "./HazardActions";
import { RiskLevelGuide } from "./RiskLevelGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

interface HazardManagementProps {
  formData: {
    hazards?: Hazard[];
    [key: string]: any;
  };
  setFormData: (data: any) => void;
}

export const HazardManagement = ({
  formData,
  setFormData,
}: HazardManagementProps) => {
  const { id } = useParams();
  console.log("HazardManagement - Received formData:", formData);
  
  const hazards = formData.hazards || [];
  const [previousHazards, setPreviousHazards] = useState<Hazard[]>([]);
  const [previousRisks, setPreviousRisks] = useState<string[]>([]);
  const [previousControls, setPreviousControls] = useState<string[]>([]);

  useEffect(() => {
    const fetchSSSPData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('sssps')
          .select('hazards')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching SSSP data:', error);
          return;
        }

        if (data && data.hazards) {
          // If we have hazards data and formData doesn't, update formData
          if (!formData.hazards || formData.hazards.length === 0) {
            setFormData({ ...formData, hazards: data.hazards });
          }
        }
      }
    };

    fetchSSSPData();
  }, [id]);

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
    const updatedHazards = [
      ...hazards,
      { hazard: "", risk: "", controlMeasures: "" },
    ];
    setFormData({ ...formData, hazards: updatedHazards });
  };

  const addMultipleHazards = (selectedHazards: Hazard[]) => {
    const updatedHazards = [...hazards, ...selectedHazards];
    setFormData({ ...formData, hazards: updatedHazards });
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
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            Hazard and Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
