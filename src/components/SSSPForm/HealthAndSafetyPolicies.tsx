
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Wine, Moon, Shield, Phone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const healthAndSafetySchema = z.object({
  drug_and_alcohol: z.string()
    .min(10, "Drug and alcohol policy must be at least 10 characters long")
    .max(1000, "Drug and alcohol policy must not exceed 1000 characters"),
  fatigue_management: z.string()
    .min(10, "Fatigue management must be at least 10 characters long")
    .max(1000, "Fatigue management must not exceed 1000 characters"),
  ppe: z.string()
    .min(10, "PPE requirements must be at least 10 characters long")
    .max(500, "PPE requirements must not exceed 500 characters"),
  mobile_phone: z.string()
    .min(10, "Mobile phone usage policy must be at least 10 characters long")
    .max(500, "Mobile phone usage policy must not exceed 500 characters")
});

type HealthAndSafetyFormData = z.infer<typeof healthAndSafetySchema>;

export const HealthAndSafetyPolicies = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<HealthAndSafetyFormData>({
    resolver: zodResolver(healthAndSafetySchema),
    defaultValues: {
      drug_and_alcohol: formData?.drug_and_alcohol || "",
      fatigue_management: formData?.fatigue_management || "",
      ppe: formData?.ppe || "",
      mobile_phone: formData?.mobile_phone || ""
    }
  });

  useEffect(() => {
    if (formData) {
      console.log("Setting form values with:", {
        drug_and_alcohol: formData.drug_and_alcohol,
        fatigue_management: formData.fatigue_management,
        ppe: formData.ppe,
        mobile_phone: formData.mobile_phone
      });
      setValue("drug_and_alcohol", formData.drug_and_alcohol || "");
      setValue("fatigue_management", formData.fatigue_management || "");
      setValue("ppe", formData.ppe || "");
      setValue("mobile_phone", formData.mobile_phone || "");
    }
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof HealthAndSafetyFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    setValue(field, value);
    const result = await trigger(field);
    if (!result && errors[field]) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[field]?.message
      });
    }
  };

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
              <Label htmlFor="drug_and_alcohol" className="text-lg font-semibold flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Drug and Alcohol Policy
              </Label>
              <QuickFillButton
                fieldId="drug_and_alcohol"
                fieldName="Drug and Alcohol Policy"
                onSelect={(value) => handleFieldChange("drug_and_alcohol", value)}
              />
            </div>
            <Textarea
              id="drug_and_alcohol"
              {...register("drug_and_alcohol")}
              className={`min-h-[100px] resize-none ${errors.drug_and_alcohol ? "border-destructive" : ""}`}
              placeholder="Detail your company's drug and alcohol policies..."
              onChange={(e) => handleFieldChange("drug_and_alcohol", e.target.value)}
              value={formData?.drug_and_alcohol || ""}
            />
            {errors.drug_and_alcohol && (
              <p className="text-sm text-destructive mt-1">{errors.drug_and_alcohol.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fatigue_management" className="text-lg font-semibold flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Fatigue Management
              </Label>
              <QuickFillButton
                fieldId="fatigue_management"
                fieldName="Fatigue Management"
                onSelect={(value) => handleFieldChange("fatigue_management", value)}
              />
            </div>
            <Textarea
              id="fatigue_management"
              {...register("fatigue_management")}
              className={`min-h-[100px] resize-none ${errors.fatigue_management ? "border-destructive" : ""}`}
              placeholder="Outline fatigue management procedures and policies..."
              onChange={(e) => handleFieldChange("fatigue_management", e.target.value)}
              value={formData?.fatigue_management || ""}
            />
            {errors.fatigue_management && (
              <p className="text-sm text-destructive mt-1">{errors.fatigue_management.message}</p>
            )}
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
                onSelect={(value) => handleFieldChange("ppe", value)}
              />
            </div>
            <Textarea
              id="ppe"
              {...register("ppe")}
              className={`min-h-[100px] resize-none ${errors.ppe ? "border-destructive" : ""}`}
              placeholder="List required Personal Protective Equipment..."
              onChange={(e) => handleFieldChange("ppe", e.target.value)}
              value={formData?.ppe || ""}
            />
            {errors.ppe && (
              <p className="text-sm text-destructive mt-1">{errors.ppe.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mobile_phone" className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Phone Usage
              </Label>
              <QuickFillButton
                fieldId="mobile_phone"
                fieldName="Mobile Phone Usage"
                onSelect={(value) => handleFieldChange("mobile_phone", value)}
              />
            </div>
            <Textarea
              id="mobile_phone"
              {...register("mobile_phone")}
              className={`min-h-[100px] resize-none ${errors.mobile_phone ? "border-destructive" : ""}`}
              placeholder="Specify mobile phone usage rules and restrictions..."
              onChange={(e) => handleFieldChange("mobile_phone", e.target.value)}
              value={formData?.mobile_phone || ""}
            />
            {errors.mobile_phone && (
              <p className="text-sm text-destructive mt-1">{errors.mobile_phone.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
