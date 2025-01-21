import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
            <h3 className="text-lg font-semibold mb-4">Entry and Exit Procedures</h3>
            <Textarea
              placeholder="Document site entry and exit procedures..."
              value={formData.entryExitProcedures || ""}
              onChange={(e) => setFormData({ ...formData, entryExitProcedures: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Site Speed Limits</h3>
            <Input
              type="text"
              placeholder="e.g., 20 km/h"
              value={formData.speedLimits || ""}
              onChange={(e) => setFormData({ ...formData, speedLimits: e.target.value })}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Parking and Loading Zones</h3>
            <Textarea
              placeholder="Document parking and loading zone rules..."
              value={formData.parkingRules || ""}
              onChange={(e) => setFormData({ ...formData, parkingRules: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Site-Specific PPE Requirements</h3>
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