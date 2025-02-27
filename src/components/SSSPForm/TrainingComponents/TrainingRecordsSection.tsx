
import React from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TrainingRecordsSectionProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
}

export const TrainingRecordsSection: React.FC<TrainingRecordsSectionProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Training Records Management</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Document your training record keeping procedures
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="training-records">Training Records</Label>
        <Textarea
          id="training-records"
          className="min-h-[120px]"
          placeholder="Describe how training records are maintained, where they are stored, and who is responsible for them..."
          value={formData.training_records || ""}
          onChange={(e) => onFieldChange("training_records", e.target.value)}
        />
      </div>
    </div>
  );
};
