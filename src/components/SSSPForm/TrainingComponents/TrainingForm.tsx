
import React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TrainingRequirementFormData } from "@/types/sssp/forms";

const trainingSchema = z.object({
  competency_requirements: z.string()
    .min(10, "Competency requirements must be at least 10 characters long")
    .max(1000, "Competency requirements must not exceed 1000 characters"),
  training_records: z.string()
    .min(10, "Training records description must be at least 10 characters long")
    .max(1000, "Training records description must not exceed 1000 characters"),
  required_training: z.array(z.object({
    requirement: z.string().min(1, "Training requirement is required"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    frequency: z.string().min(1, "Frequency is required"),
  })).optional(),
});

export type TrainingFormData = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  formData: TrainingFormData;
  setFormData: (data: TrainingFormData) => void;
}

export const useTrainingForm = ({ formData, setFormData }: TrainingFormProps) => {
  const { toast } = useToast();
  console.log("TrainingForm - Received formData:", formData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      competency_requirements: formData?.competency_requirements || "",
      training_records: formData?.training_records || "",
      required_training: formData?.required_training || [],
    }
  });

  const handleFieldChange = async (field: string, value: string) => {
    console.log("TrainingForm - Updating field:", field, "with value:", value);
    const updatedFormData = { ...formData };
    updatedFormData[field] = value;
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
