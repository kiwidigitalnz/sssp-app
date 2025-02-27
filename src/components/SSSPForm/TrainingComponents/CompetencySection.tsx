
import React from "react";
import { FileKey } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CompetencySectionProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
}

export const CompetencySection: React.FC<CompetencySectionProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <FileKey className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Competency Requirements</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Define competency standards for your workforce
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="competency-requirements">
          Competency Requirements
        </Label>
        <Textarea
          id="competency-requirements"
          className="min-h-[120px]"
          placeholder="Describe the competency requirements for tasks and roles in your project..."
          value={formData.competency_requirements || ""}
          onChange={(e) => onFieldChange("competency_requirements", e.target.value)}
        />
      </div>
    </div>
  );
};
