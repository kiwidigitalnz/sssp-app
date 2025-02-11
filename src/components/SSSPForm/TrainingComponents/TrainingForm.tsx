
import React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

export type TrainingFormData = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const useTrainingForm = ({ formData, setFormData }: TrainingFormProps) => {
  const { toast } = useToast();

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

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    trigger,
    handleFieldChange
  };
};

