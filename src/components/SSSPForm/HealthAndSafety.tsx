import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Users, UserCog, Users2 } from "lucide-react";

export const HealthAndSafety = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          Health and Safety Responsibilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pcbuDuties" className="text-lg font-semibold flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                PCBU Duties
              </Label>
              <QuickFillButton
                fieldId="pcbuDuties"
                fieldName="PCBU Duties"
                onSelect={(value) =>
                  setFormData({ ...formData, pcbuDuties: value })
                }
              />
            </div>
            <Textarea
              id="pcbuDuties"
              value={formData.pcbuDuties || ""}
              onChange={(e) =>
                setFormData({ ...formData, pcbuDuties: e.target.value })
              }
              placeholder="Outline company duties under the Health and Safety at Work Act 2015"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="workerResponsibilities" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Worker Responsibilities
              </Label>
              <QuickFillButton
                fieldId="workerResponsibilities"
                fieldName="Worker Responsibilities"
                onSelect={(value) =>
                  setFormData({ ...formData, workerResponsibilities: value })
                }
              />
            </div>
            <Textarea
              id="workerResponsibilities"
              value={formData.workerResponsibilities || ""}
              onChange={(e) =>
                setFormData({ ...formData, workerResponsibilities: e.target.value })
              }
              placeholder="List worker responsibilities (e.g., reporting hazards, following safe practices)"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contractorDuties" className="text-lg font-semibold flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                Contractor/Subcontractor Duties
              </Label>
              <QuickFillButton
                fieldId="contractorDuties"
                fieldName="Contractor/Subcontractor Duties"
                onSelect={(value) =>
                  setFormData({ ...formData, contractorDuties: value })
                }
              />
            </div>
            <Textarea
              id="contractorDuties"
              value={formData.contractorDuties || ""}
              onChange={(e) =>
                setFormData({ ...formData, contractorDuties: e.target.value })
              }
              placeholder="Outline compliance requirements for contractors"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visitorRules" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Visitor Rules
              </Label>
              <QuickFillButton
                fieldId="visitorRules"
                fieldName="Visitor Rules"
                onSelect={(value) =>
                  setFormData({ ...formData, visitorRules: value })
                }
              />
            </div>
            <Textarea
              id="visitorRules"
              value={formData.visitorRules || ""}
              onChange={(e) =>
                setFormData({ ...formData, visitorRules: e.target.value })
              }
              placeholder="Specify safety rules for visitors on site"
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};