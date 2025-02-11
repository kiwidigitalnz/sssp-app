
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { TrainingSelection } from "./TrainingSelection";
import { GraduationCap, BookOpen, Award, ClipboardCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const trainingSchema = z.object({
  competencyRequirements: z.string()
    .min(10, "Competency requirements must be at least 10 characters long")
    .max(1000, "Competency requirements must not exceed 1000 characters"),
  trainingRecords: z.string()
    .min(10, "Training records description must be at least 10 characters long")
    .max(1000, "Training records description must not exceed 1000 characters"),
  requiredTraining: z.array(z.object({
    requirement: z.string().min(1, "Training requirement is required"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    frequency: z.string().min(1, "Frequency is required"),
  })).optional(),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

export const TrainingRequirements = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const [newTraining, setNewTraining] = React.useState({
    requirement: "",
    description: "",
    frequency: "",
  });
  const [previousTrainings, setPreviousTrainings] = useState<any[]>([]);

  useEffect(() => {
    const fetchPreviousTrainings = async () => {
      const { data, error } = await supabase
        .from('sssps')
        .select('required_training')
        .not('id', 'eq', formData.id);

      if (!error && data) {
        const allTrainings = data.reduce((acc: any[], curr: any) => {
          if (curr.required_training) {
            return [...acc, ...curr.required_training];
          }
          return acc;
        }, []);
        setPreviousTrainings(allTrainings);
      }
    };

    fetchPreviousTrainings();
  }, [formData.id]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      competencyRequirements: formData.competency_requirements || "",
      trainingRecords: formData.training_records || "",
      requiredTraining: formData.required_training || [],
    }
  });

  const handleFieldChange = async (field: string, value: string) => {
    const updatedFormData = { ...formData };
    
    // Map component field names to database column names
    const fieldMapping: { [key: string]: string } = {
      competencyRequirements: 'competency_requirements',
      trainingRecords: 'training_records',
      requiredTraining: 'required_training'
    };

    const dbField = fieldMapping[field] || field;
    updatedFormData[dbField] = value;
    
    setFormData(updatedFormData);
    setValue(field as keyof TrainingFormData, value);
    const result = await trigger(field as keyof TrainingFormData);
    if (!result && errors[field as keyof TrainingFormData]) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[field as keyof TrainingFormData]?.message
      });
    }
  };

  const handleAddSingleTraining = async () => {
    if (newTraining.requirement && newTraining.description && newTraining.frequency) {
      const updatedTraining = [...(formData.required_training || []), newTraining];
      setFormData({ ...formData, required_training: updatedTraining });
      setValue("requiredTraining", updatedTraining);
      setNewTraining({ requirement: "", description: "", frequency: "" });
      
      const result = await trigger("requiredTraining");
      if (!result) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check the training requirements"
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All training fields are required"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            Training and Competency Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Training Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-4 w-4" />
              <h3 className="text-base font-medium">Required Training</h3>
            </div>
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Single Training
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Training Requirement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="requirement">Training Requirement</Label>
                          <Input
                            id="requirement"
                            value={newTraining.requirement}
                            onChange={(e) =>
                              setNewTraining({
                                ...newTraining,
                                requirement: e.target.value,
                              })
                            }
                            placeholder="Enter training requirement"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newTraining.description}
                            onChange={(e) =>
                              setNewTraining({
                                ...newTraining,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter training description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Frequency</Label>
                          <Input
                            id="frequency"
                            value={newTraining.frequency}
                            onChange={(e) =>
                              setNewTraining({
                                ...newTraining,
                                frequency: e.target.value,
                              })
                            }
                            placeholder="e.g., Annual, Monthly, One-time"
                          />
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={handleAddSingleTraining}
                        >
                          Add Training
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <TrainingSelection
                    previousTrainings={previousTrainings}
                    onSelect={(training) =>
                      setFormData({ ...formData, required_training: training })
                    }
                  />
                </div>
                {formData.required_training && formData.required_training.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {formData.required_training.map((training: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <h4 className="font-medium">{training.requirement}</h4>
                        <p className="text-sm text-muted-foreground">
                          {training.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Frequency: {training.frequency}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Competency Requirements Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Award className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Competency Requirements</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Specify required competencies and qualifications
                </p>
                <QuickFillButton
                  fieldId="competencyRequirements"
                  fieldName="Competency Requirements"
                  onSelect={(value) =>
                    handleFieldChange("competencyRequirements", value)
                  }
                />
              </div>
              <Textarea
                value={formData.competency_requirements || ""}
                onChange={(e) =>
                  handleFieldChange("competencyRequirements", e.target.value)
                }
                placeholder="List required certifications, licenses, and experience levels..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          {/* Training Records Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <ClipboardCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Training Records</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Document training record keeping procedures
                </p>
                <QuickFillButton
                  fieldId="trainingRecords"
                  fieldName="Training Records"
                  onSelect={(value) =>
                    handleFieldChange("trainingRecords", value)
                  }
                />
              </div>
              <Textarea
                value={formData.training_records || ""}
                onChange={(e) =>
                  handleFieldChange("trainingRecords", e.target.value)
                }
                placeholder="Describe how training records will be maintained and verified..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
