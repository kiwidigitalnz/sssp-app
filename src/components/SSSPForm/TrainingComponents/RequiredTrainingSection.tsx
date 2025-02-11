
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { TrainingSelection } from "../TrainingSelection";
import { supabase } from "@/integrations/supabase/client";
import { AddTrainingDialog } from "./AddTrainingDialog";
import { useToast } from "@/hooks/use-toast";

interface RequiredTrainingSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const RequiredTrainingSection = ({ formData, setFormData }: RequiredTrainingSectionProps) => {
  const [previousTrainings, setPreviousTrainings] = useState<any[]>([]);
  const { toast } = useToast();
  const [newTraining, setNewTraining] = React.useState({
    requirement: "",
    description: "",
    frequency: "",
  });

  useEffect(() => {
    const fetchPreviousTrainings = async () => {
      // Only fetch if we have a valid ID
      if (formData?.id) {
        const { data, error } = await supabase
          .from('sssps')
          .select('required_training')
          .neq('id', formData.id);

        if (!error && data) {
          const allTrainings = data.reduce((acc: any[], curr: any) => {
            if (curr.required_training) {
              return [...acc, ...curr.required_training];
            }
            return acc;
          }, []);
          setPreviousTrainings(allTrainings);
        }
      } else {
        // If no ID (new form), fetch all training data
        const { data, error } = await supabase
          .from('sssps')
          .select('required_training');

        if (!error && data) {
          const allTrainings = data.reduce((acc: any[], curr: any) => {
            if (curr.required_training) {
              return [...acc, ...curr.required_training];
            }
            return acc;
          }, []);
          setPreviousTrainings(allTrainings);
        }
      }
    };

    fetchPreviousTrainings();
  }, [formData?.id]);

  const handleAddSingleTraining = async () => {
    if (newTraining.requirement && newTraining.description && newTraining.frequency) {
      const updatedTraining = [...(formData.required_training || []), newTraining];
      setFormData({ ...formData, required_training: updatedTraining });
      setNewTraining({ requirement: "", description: "", frequency: "" });
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
  );
};
