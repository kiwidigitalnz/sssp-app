
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { TrainingSelection } from "../TrainingSelection";
import { supabase } from "@/integrations/supabase/client";
import { AddTrainingDialog } from "./AddTrainingDialog";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import type { TrainingRequirementFormData, SSSPFormData } from "@/types/sssp/forms";

interface RequiredTrainingSectionProps {
  formData: SSSPFormData;
  setFormData: (data: SSSPFormData) => void;
}

export const RequiredTrainingSection = ({ formData, setFormData }: RequiredTrainingSectionProps) => {
  const [previousTrainings, setPreviousTrainings] = useState<TrainingRequirementFormData[]>([]);
  const { toast } = useToast();
  const { id } = useParams();
  const [newTraining, setNewTraining] = React.useState<TrainingRequirementFormData>({
    requirement: "",
    description: "",
    frequency: "",
  });

  useEffect(() => {
    const fetchPreviousTrainings = async () => {
      let query = supabase.from('sssps').select('required_training');
      
      if (id) {
        query = query.neq('id', id);
      }

      const { data, error } = await query;

      if (!error && data) {
        const allTrainings = data.reduce((acc: TrainingRequirementFormData[], curr: any) => {
          if (curr.required_training && Array.isArray(curr.required_training)) {
            return [...acc, ...curr.required_training];
          }
          return acc;
        }, []);
        setPreviousTrainings(allTrainings);
      }
    };

    const fetchCurrentTraining = async () => {
      if (id && (!formData.required_training || formData.required_training.length === 0)) {
        const { data, error } = await supabase
          .from('sssps')
          .select('required_training')
          .eq('id', id)
          .single();

        if (!error && data?.required_training) {
          setFormData({ 
            ...formData, 
            required_training: data.required_training 
          });
        }
      }
    };

    fetchPreviousTrainings();
    fetchCurrentTraining();
  }, [id, formData?.id]);

  const handleAddSingleTraining = async () => {
    if (newTraining.requirement && newTraining.description && newTraining.frequency) {
      const updatedTraining = [...(formData.required_training || []), newTraining];
      setFormData({ 
        ...formData, 
        required_training: updatedTraining 
      });
      setNewTraining({ requirement: "", description: "", frequency: "" });
      
      toast({
        title: "Training added",
        description: "New training requirement has been added successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All training fields are required"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <BookOpen className="h-4 w-4" />
        <h3 className="text-base font-medium">Required Training</h3>
      </div>
      <Card className="border-dashed">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <AddTrainingDialog
              newTraining={newTraining}
              setNewTraining={setNewTraining}
              onAdd={handleAddSingleTraining}
            />
            <TrainingSelection
              previousTrainings={previousTrainings}
              onSelect={(training) =>
                setFormData({ ...formData, required_training: training })
              }
            />
          </div>
          {formData.required_training && formData.required_training.length > 0 && (
            <div className="space-y-2 mt-4">
              {formData.required_training.map((training: TrainingRequirementFormData, index: number) => (
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
  );
};

