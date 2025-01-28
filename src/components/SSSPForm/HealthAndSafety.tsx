import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Building2, Users2, Users, UserCheck } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const healthAndSafetySchema = z.object({
  pcbu_duties: z.string()
    .min(10, "PCBU duties must be at least 10 characters long")
    .max(1000, "PCBU duties must not exceed 1000 characters"),
  site_supervisor_duties: z.string()
    .min(10, "Site supervisor duties must be at least 10 characters long")
    .max(1000, "Site supervisor duties must not exceed 1000 characters"),
  worker_duties: z.string()
    .min(10, "Worker duties must be at least 10 characters long")
    .max(1000, "Worker duties must not exceed 1000 characters"),
  contractor_duties: z.string()
    .min(10, "Contractor duties must be at least 10 characters long")
    .max(1000, "Contractor duties must not exceed 1000 characters"),
  visitor_rules: z.string()
    .min(10, "Visitor rules must be at least 10 characters long")
    .max(1000, "Visitor rules must not exceed 1000 characters")
});

type HealthAndSafetyFormData = z.infer<typeof healthAndSafetySchema>;

export const HealthAndSafety = ({ formData, setFormData, isLoading }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    reset
  } = useForm<HealthAndSafetyFormData>({
    resolver: zodResolver(healthAndSafetySchema),
    defaultValues: {
      pcbu_duties: "",
      site_supervisor_duties: "",
      worker_duties: "",
      contractor_duties: "",
      visitor_rules: ""
    }
  });

  useEffect(() => {
    if (formData) {
      reset({
        pcbu_duties: formData.pcbu_duties || "",
        site_supervisor_duties: formData.site_supervisor_duties || "",
        worker_duties: formData.worker_duties || "",
        contractor_duties: formData.contractor_duties || "",
        visitor_rules: formData.visitor_rules || ""
      });
    }
  }, [formData, reset]);

  const handleFieldChange = async (field: keyof HealthAndSafetyFormData, value: string) => {
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

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

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
              {...register("pcbu_duties")}
              className={`min-h-[100px] resize-none ${errors.pcbu_duties ? "border-destructive" : ""}`}
              placeholder="Enter PCBU duties for health and safety"
              onChange={(e) => handleFieldChange("pcbu_duties", e.target.value)}
            />
            {errors.pcbu_duties && (
              <p className="text-sm text-destructive mt-1">{errors.pcbu_duties.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="site_supervisor_duties" className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
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
              {...register("site_supervisor_duties")}
              className={`min-h-[100px] resize-none ${errors.site_supervisor_duties ? "border-destructive" : ""}`}
              placeholder="Enter site supervisor duties for health and safety"
              onChange={(e) => handleFieldChange("site_supervisor_duties", e.target.value)}
            />
            {errors.site_supervisor_duties && (
              <p className="text-sm text-destructive mt-1">{errors.site_supervisor_duties.message}</p>
            )}
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
              {...register("worker_duties")}
              className={`min-h-[100px] resize-none ${errors.worker_duties ? "border-destructive" : ""}`}
              placeholder="Enter worker duties for health and safety"
              onChange={(e) => handleFieldChange("worker_duties", e.target.value)}
            />
            {errors.worker_duties && (
              <p className="text-sm text-destructive mt-1">{errors.worker_duties.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contractor_duties" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
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
              {...register("contractor_duties")}
              className={`min-h-[100px] resize-none ${errors.contractor_duties ? "border-destructive" : ""}`}
              placeholder="Enter contractor duties for health and safety"
              onChange={(e) => handleFieldChange("contractor_duties", e.target.value)}
            />
            {errors.contractor_duties && (
              <p className="text-sm text-destructive mt-1">{errors.contractor_duties.message}</p>
            )}
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
              {...register("visitor_rules")}
              className={`min-h-[100px] resize-none ${errors.visitor_rules ? "border-destructive" : ""}`}
              placeholder="Enter visitor rules for health and safety"
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