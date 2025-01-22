import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Wine, Moon, Shield, Phone } from "lucide-react";

export const HealthAndSafetyPolicies = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Health and Safety Policies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="drugAndAlcohol" className="text-lg font-semibold flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Drug and Alcohol Policy
              </Label>
              <QuickFillButton
                fieldId="drugAndAlcohol"
                fieldName="Drug and Alcohol Policy"
                onSelect={(value) =>
                  setFormData({ ...formData, drugAndAlcohol: value })
                }
              />
            </div>
            <Textarea
              id="drugAndAlcohol"
              value={formData.drugAndAlcohol || ""}
              onChange={(e) =>
                setFormData({ ...formData, drugAndAlcohol: e.target.value })
              }
              placeholder="Detail your company's drug and alcohol policies..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fatigueManagement" className="text-lg font-semibold flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Fatigue Management
              </Label>
              <QuickFillButton
                fieldId="fatigueManagement"
                fieldName="Fatigue Management"
                onSelect={(value) =>
                  setFormData({ ...formData, fatigueManagement: value })
                }
              />
            </div>
            <Textarea
              id="fatigueManagement"
              value={formData.fatigueManagement || ""}
              onChange={(e) =>
                setFormData({ ...formData, fatigueManagement: e.target.value })
              }
              placeholder="Outline fatigue management procedures and policies..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ppe" className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                PPE Requirements
              </Label>
              <QuickFillButton
                fieldId="ppe"
                fieldName="PPE Requirements"
                onSelect={(value) =>
                  setFormData({ ...formData, ppe: value })
                }
              />
            </div>
            <Textarea
              id="ppe"
              value={formData.ppe || ""}
              onChange={(e) =>
                setFormData({ ...formData, ppe: e.target.value })
              }
              placeholder="List required Personal Protective Equipment..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mobilePhone" className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Phone Usage
              </Label>
              <QuickFillButton
                fieldId="mobilePhone"
                fieldName="Mobile Phone Usage"
                onSelect={(value) =>
                  setFormData({ ...formData, mobilePhone: value })
                }
              />
            </div>
            <Textarea
              id="mobilePhone"
              value={formData.mobilePhone || ""}
              onChange={(e) =>
                setFormData({ ...formData, mobilePhone: e.target.value })
              }
              placeholder="Specify mobile phone usage rules and restrictions..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};