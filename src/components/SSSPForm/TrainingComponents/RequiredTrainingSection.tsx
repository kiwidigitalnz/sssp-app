import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { TrainingSelection } from "../TrainingSelection";
import { supabase } from "@/integrations/supabase/client";
import { AddTrainingDialog } from "./AddTrainingDialog";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const [editingTraining, setEditingTraining] = React.useState<{ index: number; training: TrainingRequirementFormData } | null>(null);

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

  const handleEditTraining = (index: number) => {
    const training = formData.required_training?.[index];
    if (training) {
      setEditingTraining({ index, training: { ...training } });
    }
  };

  const handleUpdateTraining = (updatedTraining: TrainingRequirementFormData) => {
    if (editingTraining === null) return;

    const updatedTrainings = [...(formData.required_training || [])];
    updatedTrainings[editingTraining.index] = updatedTraining;
    
    setFormData({
      ...formData,
      required_training: updatedTrainings
    });
    
    setEditingTraining(null);
    toast({
      title: "Training updated",
      description: "Training requirement has been updated successfully"
    });
  };

  const handleDeleteTraining = (index: number) => {
    const updatedTrainings = formData.required_training?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      required_training: updatedTrainings
    });
    
    toast({
      title: "Training deleted",
      description: "Training requirement has been removed"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Required Training</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Add or select training requirements
        </p>
      </div>
      <Card className="border-dashed">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 h-9">
              <AddTrainingDialog
                newTraining={editingTraining?.training || newTraining}
                setNewTraining={training => 
                  editingTraining 
                    ? setEditingTraining({ ...editingTraining, training }) 
                    : setNewTraining(training)
                }
                onAdd={editingTraining ? () => handleUpdateTraining(editingTraining.training) : handleAddSingleTraining}
                isEditing={!!editingTraining}
              />
              <div className="h-6 w-px bg-muted" />
              <TrainingSelection
                previousTrainings={previousTrainings}
                onSelect={(training) =>
                  setFormData({ ...formData, required_training: training })
                }
              />
            </div>
          </div>
          {formData.required_training && formData.required_training.length > 0 && (
            <div className="grid gap-3 mt-4">
              {formData.required_training.map((training: TrainingRequirementFormData, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-2 bg-muted/5 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium text-base">{training.requirement}</h4>
                      <p className="text-sm text-muted-foreground">
                        {training.description}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        Frequency: {training.frequency}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTraining(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTraining(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
