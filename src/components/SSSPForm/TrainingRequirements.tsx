
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { RequiredTrainingSection } from "./TrainingComponents/RequiredTrainingSection";
import { CompetencySection } from "./TrainingComponents/CompetencySection";
import { TrainingRecordsSection } from "./TrainingComponents/TrainingRecordsSection";
import { useTrainingForm } from "./TrainingComponents/TrainingForm";

interface TrainingRequirementsProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading: boolean;
}

export const TrainingRequirements: React.FC<TrainingRequirementsProps> = ({ 
  formData, 
  setFormData,
  isLoading 
}) => {
  const { handleFieldChange } = useTrainingForm({ formData, setFormData });

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            Training and Competency Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <RequiredTrainingSection formData={formData} setFormData={setFormData} />
          <CompetencySection formData={formData} onFieldChange={handleFieldChange} />
          <TrainingRecordsSection formData={formData} onFieldChange={handleFieldChange} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRequirements;
