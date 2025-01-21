import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Shield, Phone, Clock } from "lucide-react";

interface HealthAndSafetyPoliciesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HealthAndSafetyPolicies = ({
  formData,
  setFormData,
}: HealthAndSafetyPoliciesProps) => {
  const [policies, setPolicies] = useState({
    drugAndAlcohol: formData.drugAndAlcohol || "",
    fatigueManagement: formData.fatigueManagement || "",
    ppe: formData.ppe || "",
    mobilePhone: formData.mobilePhone || "",
  });

  const handlePolicyChange = (field: string, value: string) => {
    const updatedPolicies = { ...policies, [field]: value };
    setPolicies(updatedPolicies);
    setFormData({ ...formData, ...updatedPolicies });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Health and Safety Policies</h2>
        <p className="text-muted-foreground mt-2">
          Define your company's key safety policies and guidelines
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Drug and Alcohol Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="drugAndAlcohol">Policy Details</Label>
              <Textarea
                id="drugAndAlcohol"
                placeholder="Enter your drug and alcohol policy details..."
                value={policies.drugAndAlcohol}
                onChange={(e) => handlePolicyChange("drugAndAlcohol", e.target.value)}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Fatigue Management Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="fatigueManagement">Policy Details</Label>
              <Textarea
                id="fatigueManagement"
                placeholder="Enter your fatigue management policy details..."
                value={policies.fatigueManagement}
                onChange={(e) => handlePolicyChange("fatigueManagement", e.target.value)}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                PPE (Personal Protective Equipment) Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="ppe">Policy Details</Label>
              <Textarea
                id="ppe"
                placeholder="Enter your PPE policy details..."
                value={policies.ppe}
                onChange={(e) => handlePolicyChange("ppe", e.target.value)}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Mobile Phone and Distraction Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="mobilePhone">Policy Details</Label>
              <Textarea
                id="mobilePhone"
                placeholder="Enter your mobile phone usage policy details..."
                value={policies.mobilePhone}
                onChange={(e) => handlePolicyChange("mobilePhone", e.target.value)}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};