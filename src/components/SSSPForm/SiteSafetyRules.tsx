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
  entryExitProcedures: z.string()
    .min(10, "Entry/Exit procedures must be at least 10 characters long")
    .max(1000, "Entry/Exit procedures must not exceed 1000 characters"),
  speedLimits: z.string()
    .min(10, "Speed limits description must be at least 10 characters long")
    .max(500, "Speed limits description must not exceed 500 characters"),
  parkingRules: z.string()
    .min(10, "Parking rules must be at least 10 characters long")
    .max(500, "Parking rules must not exceed 500 characters"),
  sitePPE: z.string()
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
      entryExitProcedures: formData.entryExitProcedures || "",
      speedLimits: formData.speedLimits || "",
      parkingRules: formData.parkingRules || "",
      sitePPE: formData.sitePPE || ""
    }
  });

  useEffect(() => {
    setValue("entryExitProcedures", formData.entryExitProcedures || "");
    setValue("speedLimits", formData.speedLimits || "");
    setValue("parkingRules", formData.parkingRules || "");
    setValue("sitePPE", formData.sitePPE || "");
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
              <Label htmlFor="entryExitProcedures" className="text-base font-medium flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                Entry/Exit Procedures
              </Label>
              <QuickFillButton
                fieldId="entryExitProcedures"
                fieldName="Entry/Exit Procedures"
                onSelect={(value) => handleFieldChange("entryExitProcedures", value)}
              />
            </div>
            <Textarea
              id="entryExitProcedures"
              {...register("entryExitProcedures")}
              className={`min-h-[100px] resize-none ${errors.entryExitProcedures ? "border-destructive" : ""}`}
              placeholder="Detail site entry and exit procedures..."
              onChange={(e) => handleFieldChange("entryExitProcedures", e.target.value)}
            />
            {errors.entryExitProcedures && (
              <p className="text-sm text-destructive mt-1">{errors.entryExitProcedures.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speedLimits" className="text-base font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Speed Limits
              </Label>
              <QuickFillButton
                fieldId="speedLimits"
                fieldName="Speed Limits"
                onSelect={(value) => handleFieldChange("speedLimits", value)}
              />
            </div>
            <Textarea
              id="speedLimits"
              {...register("speedLimits")}
              className={`min-h-[100px] resize-none ${errors.speedLimits ? "border-destructive" : ""}`}
              placeholder="Specify site speed limits and vehicle rules..."
              onChange={(e) => handleFieldChange("speedLimits", e.target.value)}
            />
            {errors.speedLimits && (
              <p className="text-sm text-destructive mt-1">{errors.speedLimits.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="parkingRules" className="text-base font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Parking Rules
              </Label>
              <QuickFillButton
                fieldId="parkingRules"
                fieldName="Parking Rules"
                onSelect={(value) => handleFieldChange("parkingRules", value)}
              />
            </div>
            <Textarea
              id="parkingRules"
              {...register("parkingRules")}
              className={`min-h-[100px] resize-none ${errors.parkingRules ? "border-destructive" : ""}`}
              placeholder="Detail parking regulations and designated areas..."
              onChange={(e) => handleFieldChange("parkingRules", e.target.value)}
            />
            {errors.parkingRules && (
              <p className="text-sm text-destructive mt-1">{errors.parkingRules.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sitePPE" className="text-base font-medium flex items-center gap-2">
                <HardHat className="h-4 w-4" />
                Site-Specific PPE Requirements
              </Label>
              <QuickFillButton
                fieldId="sitePPE"
                fieldName="Site-Specific PPE Requirements"
                onSelect={(value) => handleFieldChange("sitePPE", value)}
              />
            </div>
            <Textarea
              id="sitePPE"
              {...register("sitePPE")}
              className={`min-h-[100px] resize-none ${errors.sitePPE ? "border-destructive" : ""}`}
              placeholder="List required PPE for specific site areas..."
              onChange={(e) => handleFieldChange("sitePPE", e.target.value)}
            />
            {errors.sitePPE && (
              <p className="text-sm text-destructive mt-1">{errors.sitePPE.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};