
import React from "react";
import { ClipboardCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SSSPFormData } from "@/types/sssp/forms";

interface TrainingRecordsSectionProps {
  formData: SSSPFormData;
  onFieldChange: (field: string, value: string) => void;
}

export const TrainingRecordsSection = ({ formData, onFieldChange }: TrainingRecordsSectionProps) => {
  return (
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
            fieldId="training_records"
            fieldName="Training Records"
            onSelect={(value) =>
              onFieldChange("training_records", value)
            }
          />
        </div>
        <Textarea
          value={formData?.training_records || ""}
          onChange={(e) =>
            onFieldChange("training_records", e.target.value)
          }
          placeholder="Describe how training records will be maintained and verified..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};
