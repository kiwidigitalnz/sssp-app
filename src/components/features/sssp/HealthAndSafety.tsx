
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Building2, Users2, Users } from "lucide-react";

interface HealthAndSafetyProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HealthAndSafety = ({ formData, setFormData }: HealthAndSafetyProps) => {
  console.log("HealthAndSafety - Received formData:", formData);

  const handleFieldChange = (field: string, value: string) => {
    console.log("HealthAndSafety - Updating field:", field, "with value:", value);
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <HardHat className="h-6 w-6 text-primary" />
          Health and Safety Responsibilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pcbu_duties" className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                PCBU (Company) Duties
              </Label>
              <QuickFillButton
                fieldId="pcbu_duties"
                fieldName="PCBU Duties"
                onSelect={(value) => handleFieldChange("pcbu_duties", value)}
              />
            </div>
            <Textarea
              id="pcbu_duties"
              value={formData?.pcbu_duties || ""}
              onChange={(e) => handleFieldChange("pcbu_duties", e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Enter PCBU duties for health and safety"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="site_supervisor_duties" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Site Manager/Supervisor Duties
              </Label>
              <QuickFillButton
                fieldId="site_supervisor_duties"
                fieldName="Site Supervisor Duties"
                onSelect={(value) => handleFieldChange("site_supervisor_duties", value)}
              />
            </div>
            <Textarea
              id="site_supervisor_duties"
              value={formData?.site_supervisor_duties || ""}
              onChange={(e) => handleFieldChange("site_supervisor_duties", e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Enter site supervisor duties for health and safety"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="worker_duties" className="text-lg font-semibold flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                Worker Duties
              </Label>
              <QuickFillButton
                fieldId="worker_duties"
                fieldName="Worker Duties"
                onSelect={(value) => handleFieldChange("worker_duties", value)}
              />
            </div>
            <Textarea
              id="worker_duties"
              value={formData?.worker_duties || ""}
              onChange={(e) => handleFieldChange("worker_duties", e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Enter worker duties for health and safety"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contractor_duties" className="text-lg font-semibold flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                Contractor/Subcontractor Duties
              </Label>
              <QuickFillButton
                fieldId="contractor_duties"
                fieldName="Contractor Duties"
                onSelect={(value) => handleFieldChange("contractor_duties", value)}
              />
            </div>
            <Textarea
              id="contractor_duties"
              value={formData?.contractor_duties || ""}
              onChange={(e) => handleFieldChange("contractor_duties", e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Enter contractor duties for health and safety"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visitor_rules" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Visitor Rules
              </Label>
              <QuickFillButton
                fieldId="visitor_rules"
                fieldName="Visitor Rules"
                onSelect={(value) => handleFieldChange("visitor_rules", value)}
              />
            </div>
            <Textarea
              id="visitor_rules"
              value={formData?.visitor_rules || ""}
              onChange={(e) => handleFieldChange("visitor_rules", e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Enter visitor rules for health and safety"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
