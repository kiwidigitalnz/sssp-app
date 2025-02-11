
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, DoorOpen, Car, HardHat } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const siteSafetyRulesSchema = z.object({
  entry_exit_procedures: z.string()
    .min(10, "Entry/Exit procedures must be at least 10 characters long")
    .max(1000, "Entry/Exit procedures must not exceed 1000 characters"),
  speed_limits: z.string()
    .min(10, "Speed limits description must be at least 10 characters long")
    .max(500, "Speed limits description must not exceed 500 characters"),
  parking_rules: z.string()
    .min(10, "Parking rules must be at least 10 characters long")
    .max(500, "Parking rules must not exceed 500 characters"),
  site_specific_ppe: z.string()
    .min(10, "Site PPE requirements must be at least 10 characters long")
    .max(500, "Site PPE requirements must not exceed 500 characters")
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
      entry_exit_procedures: formData?.entry_exit_procedures || "",
      speed_limits: formData?.speed_limits || "",
      parking_rules: formData?.parking_rules || "",
      site_specific_ppe: formData?.site_specific_ppe || ""
    }
  });

  useEffect(() => {
    console.log("SiteSafetyRules - Current formData:", formData);
    setValue("entry_exit_procedures", formData?.entry_exit_procedures || "");
    setValue("speed_limits", formData?.speed_limits || "");
    setValue("parking_rules", formData?.parking_rules || "");
    setValue("site_specific_ppe", formData?.site_specific_ppe || "");
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
          <ShieldCheck className="h-6 w-6 text-primary" />
          Site Safety Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="entry_exit_procedures" className="text-base font-medium flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                Entry/Exit Procedures
              </Label>
              <QuickFillButton
                fieldId="entry_exit_procedures"
                fieldName="Entry/Exit Procedures"
                onSelect={(value) => handleFieldChange("entry_exit_procedures", value)}
              />
            </div>
            <Textarea
              id="entry_exit_procedures"
              {...register("entry_exit_procedures")}
              className={`min-h-[100px] resize-none ${errors.entry_exit_procedures ? "border-destructive" : ""}`}
              placeholder="Detail site entry and exit procedures..."
              onChange={(e) => handleFieldChange("entry_exit_procedures", e.target.value)}
            />
            {errors.entry_exit_procedures && (
              <p className="text-sm text-destructive mt-1">{errors.entry_exit_procedures.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed_limits" className="text-base font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Speed Limits
              </Label>
              <QuickFillButton
                fieldId="speed_limits"
                fieldName="Speed Limits"
                onSelect={(value) => handleFieldChange("speed_limits", value)}
              />
            </div>
            <Textarea
              id="speed_limits"
              {...register("speed_limits")}
              className={`min-h-[100px] resize-none ${errors.speed_limits ? "border-destructive" : ""}`}
              placeholder="Specify site speed limits and vehicle rules..."
              onChange={(e) => handleFieldChange("speed_limits", e.target.value)}
            />
            {errors.speed_limits && (
              <p className="text-sm text-destructive mt-1">{errors.speed_limits.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="parking_rules" className="text-base font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Parking Rules
              </Label>
              <QuickFillButton
                fieldId="parking_rules"
                fieldName="Parking Rules"
                onSelect={(value) => handleFieldChange("parking_rules", value)}
              />
            </div>
            <Textarea
              id="parking_rules"
              {...register("parking_rules")}
              className={`min-h-[100px] resize-none ${errors.parking_rules ? "border-destructive" : ""}`}
              placeholder="Detail parking regulations and designated areas..."
              onChange={(e) => handleFieldChange("parking_rules", e.target.value)}
            />
            {errors.parking_rules && (
              <p className="text-sm text-destructive mt-1">{errors.parking_rules.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="site_specific_ppe" className="text-base font-medium flex items-center gap-2">
                <HardHat className="h-4 w-4" />
                Site-Specific PPE Requirements
              </Label>
              <QuickFillButton
                fieldId="site_specific_ppe"
                fieldName="Site-Specific PPE Requirements"
                onSelect={(value) => handleFieldChange("site_specific_ppe", value)}
              />
            </div>
            <Textarea
              id="site_specific_ppe"
              {...register("site_specific_ppe")}
              className={`min-h-[100px] resize-none ${errors.site_specific_ppe ? "border-destructive" : ""}`}
              placeholder="List required PPE for specific site areas..."
              onChange={(e) => handleFieldChange("site_specific_ppe", e.target.value)}
            />
            {errors.site_specific_ppe && (
              <p className="text-sm text-destructive mt-1">{errors.site_specific_ppe.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
