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

const healthAndSafetySchema = z.object({
  pcbuDuties: z.string()
    .min(10, "PCBU duties description must be at least 10 characters long")
    .max(1000, "PCBU duties description must not exceed 1000 characters"),
  workerResponsibilities: z.string()
    .min(10, "Worker responsibilities must be at least 10 characters long")
    .max(1000, "Worker responsibilities must not exceed 1000 characters"),
  contractorDuties: z.string()
    .min(10, "Contractor duties must be at least 10 characters long")
    .max(1000, "Contractor duties must not exceed 1000 characters"),
  visitorRules: z.string()
    .min(10, "Visitor rules must be at least 10 characters long")
    .max(1000, "Visitor rules must not exceed 1000 characters")
});

type HealthAndSafetyFormData = z.infer<typeof healthAndSafetySchema>;

export const HealthAndSafety = ({ formData, setFormData }: any) => {
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
      pcbuDuties: formData.pcbuDuties || "",
      workerResponsibilities: formData.workerResponsibilities || "",
      contractorDuties: formData.contractorDuties || "",
      visitorRules: formData.visitorRules || ""
    }
  });

  useEffect(() => {
    setValue("pcbuDuties", formData.pcbuDuties || "");
    setValue("workerResponsibilities", formData.workerResponsibilities || "");
    setValue("contractorDuties", formData.contractorDuties || "");
    setValue("visitorRules", formData.visitorRules || "");
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
                onSelect={(value) => handleFieldChange("pcbuDuties", value)}
              />
            </div>
            <Textarea
              id="pcbuDuties"
              {...register("pcbuDuties")}
              className={`min-h-[100px] resize-none ${errors.pcbuDuties ? "border-destructive" : ""}`}
              placeholder="Outline company duties under the Health and Safety at Work Act 2015"
              onChange={(e) => handleFieldChange("pcbuDuties", e.target.value)}
            />
            {errors.pcbuDuties && (
              <p className="text-sm text-destructive mt-1">{errors.pcbuDuties.message}</p>
            )}
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
                onSelect={(value) => handleFieldChange("workerResponsibilities", value)}
              />
            </div>
            <Textarea
              id="workerResponsibilities"
              {...register("workerResponsibilities")}
              className={`min-h-[100px] resize-none ${errors.workerResponsibilities ? "border-destructive" : ""}`}
              placeholder="List worker responsibilities (e.g., reporting hazards, following safe practices)"
              onChange={(e) => handleFieldChange("workerResponsibilities", e.target.value)}
            />
            {errors.workerResponsibilities && (
              <p className="text-sm text-destructive mt-1">{errors.workerResponsibilities.message}</p>
            )}
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
                onSelect={(value) => handleFieldChange("contractorDuties", value)}
              />
            </div>
            <Textarea
              id="contractorDuties"
              {...register("contractorDuties")}
              className={`min-h-[100px] resize-none ${errors.contractorDuties ? "border-destructive" : ""}`}
              placeholder="Outline compliance requirements for contractors"
              onChange={(e) => handleFieldChange("contractorDuties", e.target.value)}
            />
            {errors.contractorDuties && (
              <p className="text-sm text-destructive mt-1">{errors.contractorDuties.message}</p>
            )}
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
                onSelect={(value) => handleFieldChange("visitorRules", value)}
              />
            </div>
            <Textarea
              id="visitorRules"
              {...register("visitorRules")}
              className={`min-h-[100px] resize-none ${errors.visitorRules ? "border-destructive" : ""}`}
              placeholder="Specify safety rules for visitors on site"
              onChange={(e) => handleFieldChange("visitorRules", e.target.value)}
            />
            {errors.visitorRules && (
              <p className="text-sm text-destructive mt-1">{errors.visitorRules.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};