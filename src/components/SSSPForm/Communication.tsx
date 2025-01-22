import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ClipboardList, Users } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const communicationSchema = z.object({
  meetings: z.string()
    .min(10, "Safety meetings description must be at least 10 characters long")
    .max(1000, "Safety meetings description must not exceed 1000 characters"),
  reporting: z.string()
    .min(10, "Incident reporting procedures must be at least 10 characters long")
    .max(1000, "Incident reporting procedures must not exceed 1000 characters"),
  consultation: z.string()
    .min(10, "Worker consultation process must be at least 10 characters long")
    .max(1000, "Worker consultation process must not exceed 1000 characters")
});

type CommunicationFormData = z.infer<typeof communicationSchema>;

export const Communication = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      meetings: formData.meetings || "",
      reporting: formData.reporting || "",
      consultation: formData.consultation || ""
    }
  });

  useEffect(() => {
    setValue("meetings", formData.meetings || "");
    setValue("reporting", formData.reporting || "");
    setValue("consultation", formData.consultation || "");
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof CommunicationFormData, value: string) => {
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
          <MessageSquare className="h-6 w-6 text-primary" />
          Communication and Consultation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meetings" className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Safety Meetings
              </Label>
              <QuickFillButton
                fieldId="meetings"
                fieldName="Safety Meetings"
                onSelect={(value) => handleFieldChange("meetings", value)}
              />
            </div>
            <Textarea
              id="meetings"
              {...register("meetings")}
              className={`min-h-[100px] resize-none ${errors.meetings ? "border-destructive" : ""}`}
              placeholder="Detail safety meeting schedules and procedures..."
              onChange={(e) => handleFieldChange("meetings", e.target.value)}
            />
            {errors.meetings && (
              <p className="text-sm text-destructive mt-1">{errors.meetings.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reporting" className="text-base font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Incident Reporting
              </Label>
              <QuickFillButton
                fieldId="reporting"
                fieldName="Incident Reporting"
                onSelect={(value) => handleFieldChange("reporting", value)}
              />
            </div>
            <Textarea
              id="reporting"
              {...register("reporting")}
              className={`min-h-[100px] resize-none ${errors.reporting ? "border-destructive" : ""}`}
              placeholder="Outline incident reporting procedures..."
              onChange={(e) => handleFieldChange("reporting", e.target.value)}
            />
            {errors.reporting && (
              <p className="text-sm text-destructive mt-1">{errors.reporting.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="consultation" className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Worker Consultation
              </Label>
              <QuickFillButton
                fieldId="consultation"
                fieldName="Worker Consultation"
                onSelect={(value) => handleFieldChange("consultation", value)}
              />
            </div>
            <Textarea
              id="consultation"
              {...register("consultation")}
              className={`min-h-[100px] resize-none ${errors.consultation ? "border-destructive" : ""}`}
              placeholder="Describe worker consultation processes..."
              onChange={(e) => handleFieldChange("consultation", e.target.value)}
            />
            {errors.consultation && (
              <p className="text-sm text-destructive mt-1">{errors.consultation.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};