
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorClosed, Cigarette, Boxes, Lock, Users } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const siteSafetyRulesSchema = z.object({
  site_access_rules: z.string()
    .min(10, "Site access rules must be at least 10 characters long")
    .max(1000, "Site access rules must not exceed 1000 characters"),
  smoking_policy: z.string()
    .min(10, "Smoking policy must be at least 10 characters long")
    .max(500, "Smoking policy must not exceed 500 characters"),
  housekeeping_rules: z.string()
    .min(10, "Housekeeping rules must be at least 10 characters long")
    .max(500, "Housekeeping rules must not exceed 500 characters"),
  security_requirements: z.string()
    .min(10, "Security requirements must be at least 10 characters long")
    .max(500, "Security requirements must not exceed 500 characters"),
  visitor_rules: z.string()
    .min(10, "Visitor rules must be at least 10 characters long")
    .max(500, "Visitor rules must not exceed 500 characters")
});

type SiteSafetyRulesFormData = z.infer<typeof siteSafetyRulesSchema>;

export const SiteSafetyRules = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<SiteSafetyRulesFormData>({
    resolver: zodResolver(siteSafetyRulesSchema),
    defaultValues: {
      site_access_rules: formData.site_access_rules || "",
      smoking_policy: formData.smoking_policy || "",
      housekeeping_rules: formData.housekeeping_rules || "",
      security_requirements: formData.security_requirements || "",
      visitor_rules: formData.visitor_rules || ""
    }
  });

  useEffect(() => {
    setValue("site_access_rules", formData.site_access_rules || "");
    setValue("smoking_policy", formData.smoking_policy || "");
    setValue("housekeeping_rules", formData.housekeeping_rules || "");
    setValue("security_requirements", formData.security_requirements || "");
    setValue("visitor_rules", formData.visitor_rules || "");
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof SiteSafetyRulesFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
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
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Lock className="h-6 w-6 text-primary" />
          Site Safety Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="site_access_rules" className="text-base font-medium flex items-center gap-2">
                <DoorClosed className="h-4 w-4" />
                Site Access Rules
              </Label>
              <QuickFillButton
                fieldId="site_access_rules"
                fieldName="Site Access Rules"
                onSelect={(value) => handleFieldChange("site_access_rules", value)}
              />
            </div>
            <Textarea
              id="site_access_rules"
              {...register("site_access_rules")}
              className={`min-h-[100px] resize-none ${errors.site_access_rules ? "border-destructive" : ""}`}
              placeholder="Detail site access procedures and rules..."
              onChange={(e) => handleFieldChange("site_access_rules", e.target.value)}
            />
            {errors.site_access_rules && (
              <p className="text-sm text-destructive mt-1">{errors.site_access_rules.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="smoking_policy" className="text-base font-medium flex items-center gap-2">
                <Cigarette className="h-4 w-4" />
                Smoking Policy
              </Label>
              <QuickFillButton
                fieldId="smoking_policy"
                fieldName="Smoking Policy"
                onSelect={(value) => handleFieldChange("smoking_policy", value)}
              />
            </div>
            <Textarea
              id="smoking_policy"
              {...register("smoking_policy")}
              className={`min-h-[100px] resize-none ${errors.smoking_policy ? "border-destructive" : ""}`}
              placeholder="Specify smoking areas and restrictions..."
              onChange={(e) => handleFieldChange("smoking_policy", e.target.value)}
            />
            {errors.smoking_policy && (
              <p className="text-sm text-destructive mt-1">{errors.smoking_policy.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="housekeeping_rules" className="text-base font-medium flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                Housekeeping Rules
              </Label>
              <QuickFillButton
                fieldId="housekeeping_rules"
                fieldName="Housekeeping Rules"
                onSelect={(value) => handleFieldChange("housekeeping_rules", value)}
              />
            </div>
            <Textarea
              id="housekeeping_rules"
              {...register("housekeeping_rules")}
              className={`min-h-[100px] resize-none ${errors.housekeeping_rules ? "border-destructive" : ""}`}
              placeholder="Detail housekeeping standards and requirements..."
              onChange={(e) => handleFieldChange("housekeeping_rules", e.target.value)}
            />
            {errors.housekeeping_rules && (
              <p className="text-sm text-destructive mt-1">{errors.housekeeping_rules.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="security_requirements" className="text-base font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security Requirements
              </Label>
              <QuickFillButton
                fieldId="security_requirements"
                fieldName="Security Requirements"
                onSelect={(value) => handleFieldChange("security_requirements", value)}
              />
            </div>
            <Textarea
              id="security_requirements"
              {...register("security_requirements")}
              className={`min-h-[100px] resize-none ${errors.security_requirements ? "border-destructive" : ""}`}
              placeholder="Specify security measures and protocols..."
              onChange={(e) => handleFieldChange("security_requirements", e.target.value)}
            />
            {errors.security_requirements && (
              <p className="text-sm text-destructive mt-1">{errors.security_requirements.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visitor_rules" className="text-base font-medium flex items-center gap-2">
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
              {...register("visitor_rules")}
              className={`min-h-[100px] resize-none ${errors.visitor_rules ? "border-destructive" : ""}`}
              placeholder="Detail rules and procedures for visitors..."
              onChange={(e) => handleFieldChange("visitor_rules", e.target.value)}
            />
            {errors.visitor_rules && (
              <p className="text-sm text-destructive mt-1">{errors.visitor_rules.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
