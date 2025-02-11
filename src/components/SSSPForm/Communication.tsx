
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ClipboardList, Users, Calendar } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { MeetingSelection } from "./MeetingSelection";

const communicationSchema = z.object({
  communication_methods: z.string()
    .min(10, "Communication methods must be at least 10 characters long")
    .max(1000, "Communication methods must not exceed 1000 characters"),
  toolbox_meetings: z.string()
    .min(10, "Toolbox meetings description must be at least 10 characters long")
    .max(1000, "Toolbox meetings description must not exceed 1000 characters"),
  reporting_procedures: z.string()
    .min(10, "Reporting procedures must be at least 10 characters long")
    .max(1000, "Reporting procedures must not exceed 1000 characters"),
  communication_protocols: z.string()
    .min(10, "Communication protocols must be at least 10 characters long")
    .max(1000, "Communication protocols must not exceed 1000 characters")
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
      communication_methods: formData.communication_methods || "",
      toolbox_meetings: formData.toolbox_meetings || "",
      reporting_procedures: formData.reporting_procedures || "",
      communication_protocols: formData.communication_protocols || ""
    }
  });

  useEffect(() => {
    setValue("communication_methods", formData.communication_methods || "");
    setValue("toolbox_meetings", formData.toolbox_meetings || "");
    setValue("reporting_procedures", formData.reporting_procedures || "");
    setValue("communication_protocols", formData.communication_protocols || "");
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

  const handleMeetingsChange = (meetings: any[]) => {
    setFormData({ ...formData, meetings_schedule: meetings });
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
              <Label htmlFor="communication_methods" className="text-base font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication Methods
              </Label>
              <QuickFillButton
                fieldId="communication_methods"
                fieldName="Communication Methods"
                onSelect={(value) => handleFieldChange("communication_methods", value)}
              />
            </div>
            <Textarea
              id="communication_methods"
              {...register("communication_methods")}
              className={`min-h-[100px] resize-none ${errors.communication_methods ? "border-destructive" : ""}`}
              placeholder="Detail communication methods used on site..."
              onChange={(e) => handleFieldChange("communication_methods", e.target.value)}
            />
            {errors.communication_methods && (
              <p className="text-sm text-destructive mt-1">{errors.communication_methods.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="toolbox_meetings" className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Toolbox Meetings
              </Label>
              <QuickFillButton
                fieldId="toolbox_meetings"
                fieldName="Toolbox Meetings"
                onSelect={(value) => handleFieldChange("toolbox_meetings", value)}
              />
            </div>
            <Textarea
              id="toolbox_meetings"
              {...register("toolbox_meetings")}
              className={`min-h-[100px] resize-none ${errors.toolbox_meetings ? "border-destructive" : ""}`}
              placeholder="Describe toolbox meetings schedule and procedures..."
              onChange={(e) => handleFieldChange("toolbox_meetings", e.target.value)}
            />
            {errors.toolbox_meetings && (
              <p className="text-sm text-destructive mt-1">{errors.toolbox_meetings.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reporting_procedures" className="text-base font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Reporting Procedures
              </Label>
              <QuickFillButton
                fieldId="reporting_procedures"
                fieldName="Reporting Procedures"
                onSelect={(value) => handleFieldChange("reporting_procedures", value)}
              />
            </div>
            <Textarea
              id="reporting_procedures"
              {...register("reporting_procedures")}
              className={`min-h-[100px] resize-none ${errors.reporting_procedures ? "border-destructive" : ""}`}
              placeholder="Outline reporting procedures..."
              onChange={(e) => handleFieldChange("reporting_procedures", e.target.value)}
            />
            {errors.reporting_procedures && (
              <p className="text-sm text-destructive mt-1">{errors.reporting_procedures.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="communication_protocols" className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Communication Protocols
              </Label>
              <QuickFillButton
                fieldId="communication_protocols"
                fieldName="Communication Protocols"
                onSelect={(value) => handleFieldChange("communication_protocols", value)}
              />
            </div>
            <Textarea
              id="communication_protocols"
              {...register("communication_protocols")}
              className={`min-h-[100px] resize-none ${errors.communication_protocols ? "border-destructive" : ""}`}
              placeholder="Describe communication protocols..."
              onChange={(e) => handleFieldChange("communication_protocols", e.target.value)}
            />
            {errors.communication_protocols && (
              <p className="text-sm text-destructive mt-1">{errors.communication_protocols.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Scheduled Meetings</Label>
            <MeetingSelection
              previousMeetings={formData.meetings_schedule || []}
              onSelect={handleMeetingsChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
