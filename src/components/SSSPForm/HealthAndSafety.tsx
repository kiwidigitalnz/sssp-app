import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Users, UserCog, Users2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const healthAndSafetySchema = z.object({
  project_manager_responsibilities: z.string()
    .min(10, "Project manager responsibilities must be at least 10 characters long")
    .max(1000, "Project manager responsibilities must not exceed 1000 characters"),
  site_supervisor_responsibilities: z.string()
    .min(10, "Site supervisor responsibilities must be at least 10 characters long")
    .max(1000, "Site supervisor responsibilities must not exceed 1000 characters"),
  worker_responsibilities: z.string()
    .min(10, "Worker responsibilities must be at least 10 characters long")
    .max(1000, "Worker responsibilities must not exceed 1000 characters"),
  subcontractor_responsibilities: z.string()
    .min(10, "Subcontractor responsibilities must be at least 10 characters long")
    .max(1000, "Subcontractor responsibilities must not exceed 1000 characters")
});

type HealthAndSafetyFormData = z.infer<typeof healthAndSafetySchema>;

export const HealthAndSafety = ({ formData, setFormData, isLoading }: any) => {
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
      project_manager_responsibilities: formData.project_manager_responsibilities || "",
      site_supervisor_responsibilities: formData.site_supervisor_responsibilities || "",
      worker_responsibilities: formData.worker_responsibilities || "",
      subcontractor_responsibilities: formData.subcontractor_responsibilities || ""
    }
  });

  useEffect(() => {
    setValue("project_manager_responsibilities", formData.project_manager_responsibilities || "");
    setValue("site_supervisor_responsibilities", formData.site_supervisor_responsibilities || "");
    setValue("worker_responsibilities", formData.worker_responsibilities || "");
    setValue("subcontractor_responsibilities", formData.subcontractor_responsibilities || "");
  }, [formData, setValue]);

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
              <Label htmlFor="project_manager_responsibilities" className="text-lg font-semibold flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Project Manager Responsibilities
              </Label>
              <QuickFillButton
                fieldId="project_manager_responsibilities"
                fieldName="Project Manager Responsibilities"
                onSelect={(value) => handleFieldChange("project_manager_responsibilities", value)}
              />
            </div>
            <Textarea
              id="project_manager_responsibilities"
              {...register("project_manager_responsibilities")}
              className={`min-h-[100px] resize-none ${errors.project_manager_responsibilities ? "border-destructive" : ""}`}
              placeholder="Outline project manager responsibilities for health and safety"
              onChange={(e) => handleFieldChange("project_manager_responsibilities", e.target.value)}
            />
            {errors.project_manager_responsibilities && (
              <p className="text-sm text-destructive mt-1">{errors.project_manager_responsibilities.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="site_supervisor_responsibilities" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Site Supervisor Responsibilities
              </Label>
              <QuickFillButton
                fieldId="site_supervisor_responsibilities"
                fieldName="Site Supervisor Responsibilities"
                onSelect={(value) => handleFieldChange("site_supervisor_responsibilities", value)}
              />
            </div>
            <Textarea
              id="site_supervisor_responsibilities"
              {...register("site_supervisor_responsibilities")}
              className={`min-h-[100px] resize-none ${errors.site_supervisor_responsibilities ? "border-destructive" : ""}`}
              placeholder="List site supervisor responsibilities for health and safety"
              onChange={(e) => handleFieldChange("site_supervisor_responsibilities", e.target.value)}
            />
            {errors.site_supervisor_responsibilities && (
              <p className="text-sm text-destructive mt-1">{errors.site_supervisor_responsibilities.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="worker_responsibilities" className="text-lg font-semibold flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                Worker Responsibilities
              </Label>
              <QuickFillButton
                fieldId="worker_responsibilities"
                fieldName="Worker Responsibilities"
                onSelect={(value) => handleFieldChange("worker_responsibilities", value)}
              />
            </div>
            <Textarea
              id="worker_responsibilities"
              {...register("worker_responsibilities")}
              className={`min-h-[100px] resize-none ${errors.worker_responsibilities ? "border-destructive" : ""}`}
              placeholder="Outline worker responsibilities for health and safety"
              onChange={(e) => handleFieldChange("worker_responsibilities", e.target.value)}
            />
            {errors.worker_responsibilities && (
              <p className="text-sm text-destructive mt-1">{errors.worker_responsibilities.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subcontractor_responsibilities" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Subcontractor Responsibilities
              </Label>
              <QuickFillButton
                fieldId="subcontractor_responsibilities"
                fieldName="Subcontractor Responsibilities"
                onSelect={(value) => handleFieldChange("subcontractor_responsibilities", value)}
              />
            </div>
            <Textarea
              id="subcontractor_responsibilities"
              {...register("subcontractor_responsibilities")}
              className={`min-h-[100px] resize-none ${errors.subcontractor_responsibilities ? "border-destructive" : ""}`}
              placeholder="Specify subcontractor responsibilities for health and safety"
              onChange={(e) => handleFieldChange("subcontractor_responsibilities", e.target.value)}
            />
            {errors.subcontractor_responsibilities && (
              <p className="text-sm text-destructive mt-1">{errors.subcontractor_responsibilities.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};