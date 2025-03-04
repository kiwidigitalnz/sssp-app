
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ClipboardList, Users, Calendar } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { MeetingSelection } from "./MeetingSelection";
import { PreviousMeetingSelection } from "./PreviousMeetingSelection";
import type { CommunicationProps } from "@/types/sssp/ui";
import type { Meeting } from "@/types/meetings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const Communication = ({ formData, setFormData, isLoading = false }: CommunicationProps) => {
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

  // Fetch previous meetings from all SSSPs
  const { data: previousMeetings = [] } = useQuery({
    queryKey: ['previousMeetings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('sssps')
          .select('meetings_schedule')
          .not('meetings_schedule', 'is', null);
        
        if (error) {
          throw error;
        }
        
        // Extract all meetings from all SSSPs and ensure they match the Meeting interface
        const allMeetings: Meeting[] = [];
        data?.forEach(sssp => {
          if (Array.isArray(sssp.meetings_schedule)) {
            sssp.meetings_schedule.forEach(meetingData => {
              // First convert to unknown, then to our specific type
              const rawMeeting = meetingData as unknown;
              
              // Now check if it matches our Meeting interface shape
              if (
                rawMeeting !== null &&
                typeof rawMeeting === 'object' &&
                'type' in rawMeeting &&
                'frequency' in rawMeeting &&
                'participants' in rawMeeting
              ) {
                // It's safe to create a Meeting from this data
                const typedMeeting = rawMeeting as Record<string, any>;
                
                // Construct a properly typed Meeting object
                const meeting: Meeting = {
                  type: typeof typedMeeting.type === 'string' ? typedMeeting.type : "",
                  frequency: typeof typedMeeting.frequency === 'string' ? 
                    (typedMeeting.frequency as any) : "weekly",
                  participants: Array.isArray(typedMeeting.participants) ? 
                    typedMeeting.participants.filter(p => typeof p === 'string') : [],
                  description: typeof typedMeeting.description === 'string' ? 
                    typedMeeting.description : ""
                };
                
                allMeetings.push(meeting);
              }
            });
          }
        });
        
        return allMeetings;
      } catch (error) {
        console.error("Error fetching previous meetings:", error);
        return [];
      }
    },
    staleTime: 60000 // 1 minute
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

  const handleMeetingsChange = (meetings: Meeting[]) => {
    setFormData({ ...formData, meetings_schedule: meetings });
  };

  const handleAddPreviousMeetings = (selectedMeetings: Meeting[]) => {
    const currentMeetings = Array.isArray(formData.meetings_schedule) 
      ? formData.meetings_schedule 
      : [];
    
    setFormData({
      ...formData,
      meetings_schedule: [...currentMeetings, ...selectedMeetings]
    });
    
    toast({
      title: "Meetings Added",
      description: `Added ${selectedMeetings.length} meeting${selectedMeetings.length === 1 ? '' : 's'}`
    });
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
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Scheduled Meetings</Label>
              <div className="flex gap-2">
                <PreviousMeetingSelection
                  previousMeetings={previousMeetings}
                  onSelect={handleAddPreviousMeetings}
                />
              </div>
            </div>
            <MeetingSelection
              meetings={formData.meetings_schedule || []}
              onMeetingsChange={handleMeetingsChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
