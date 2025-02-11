
import React from "react";
import { Award } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SSSPFormData } from "@/types/sssp/forms";

interface CompetencySectionProps {
  formData: SSSPFormData;
  onFieldChange: (field: string, value: string) => void;
}

export const CompetencySection = ({ formData, onFieldChange }: CompetencySectionProps) => {
  return (
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
            fieldId="competency_requirements"
            fieldName="Competency Requirements"
            onSelect={(value) =>
              onFieldChange("competency_requirements", value)
            }
          />
        </div>
        <Textarea
          value={formData?.competency_requirements || ""}
          onChange={(e) =>
            onFieldChange("competency_requirements", e.target.value)
          }
          placeholder="List required certifications, licenses, and experience levels..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};

