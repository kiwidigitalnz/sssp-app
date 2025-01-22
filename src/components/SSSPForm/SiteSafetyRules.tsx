import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

interface SiteSafetyRulesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SiteSafetyRules = ({ formData, setFormData }: SiteSafetyRulesProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site-Specific Safety Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Entry and Exit Procedures</h3>
              <QuickFillButton
                fieldId="entryExitProcedures"
                fieldName="Entry and Exit Procedures"
                onSelect={(value) =>
                  setFormData({ ...formData, entryExitProcedures: value })
                }
              />
            </div>
            <Textarea
              placeholder="Document site entry and exit procedures..."
              value={formData.entryExitProcedures || ""}
              onChange={(e) => setFormData({ ...formData, entryExitProcedures: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Site Speed Limits</h3>
              <QuickFillButton
                fieldId="speedLimits"
                fieldName="Site Speed Limits"
                onSelect={(value) =>
                  setFormData({ ...formData, speedLimits: value })
                }
              />
            </div>
            <Input
              type="text"
              placeholder="e.g., 20 km/h"
              value={formData.speedLimits || ""}
              onChange={(e) => setFormData({ ...formData, speedLimits: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Parking and Loading Zones</h3>
              <QuickFillButton
                fieldId="parkingRules"
                fieldName="Parking and Loading Zones"
                onSelect={(value) =>
                  setFormData({ ...formData, parkingRules: value })
                }
              />
            </div>
            <Textarea
              placeholder="Document parking and loading zone rules..."
              value={formData.parkingRules || ""}
              onChange={(e) => setFormData({ ...formData, parkingRules: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Site-Specific PPE Requirements</h3>
              <QuickFillButton
                fieldId="sitePPE"
                fieldName="Site-Specific PPE Requirements"
                onSelect={(value) =>
                  setFormData({ ...formData, sitePPE: value })
                }
              />
            </div>
            <Textarea
              placeholder="List all required PPE for this site..."
              value={formData.sitePPE || ""}
              onChange={(e) => setFormData({ ...formData, sitePPE: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};