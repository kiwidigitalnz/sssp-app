
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditableField } from "./EditableField";
import { useState } from "react";
import type { TrainingRequirementFormData } from "@/types/sssp/forms";

interface TrainingRequirementsSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const TrainingRequirementsSection = ({ data, setFormData }: TrainingRequirementsSectionProps) => {
  const navigate = useNavigate();
  const requiredTraining = data.required_training || [];
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const navigateToTrainingRequirements = () => {
    navigate(`/edit-sssp/32c7f60c-1756-4ff7-be14-4e0ac5c3297c/6`);
  };

  const handleEdit = (key: string, value: any) => {
    setEditingField(key);
    setTempValue(value || "");
  };

  const handleSave = (key: string) => {
    setFormData({
      ...data,
      [key]: tempValue
    });
    setEditingField(null);
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const fields = [
    { key: "competency_requirements", label: "Competency Requirements" },
    { key: "training_records", label: "Training Records" }
  ];

  return (
    <div className="space-y-6">
      {/* Required Training Table */}
      <div className="space-y-4">
        <h4 className="font-medium">Required Training</h4>
        {requiredTraining.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[30%]">Requirement</TableHead>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="w-[30%]">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requiredTraining.map((training: TrainingRequirementFormData, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{training.requirement}</TableCell>
                    <TableCell>{training.description}</TableCell>
                    <TableCell>{training.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No required training added</p>
        )}
      </div>

      {/* Training and Competency Fields */}
      <div className="space-y-4">
        <h4 className="font-medium">Training and Competency</h4>
        <div className="space-y-4">
          {fields.map((field) => (
            <EditableField
              key={field.key}
              label={field.label}
              value={data[field.key]}
              fieldKey={field.key}
              isEditing={editingField === field.key}
              tempValue={editingField === field.key ? tempValue : ""}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onValueChange={setTempValue}
              isTextArea
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToTrainingRequirements}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Training Requirements
        </Button>
      </div>
    </div>
  );
};
