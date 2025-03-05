
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "./EditableField";
import { SSSPFormData } from "@/types/sssp/forms";

interface ProjectDetailsSectionProps {
  data: SSSPFormData;
  setFormData: (data: SSSPFormData) => void;
}

export const ProjectDetailsSection = ({ data, setFormData }: ProjectDetailsSectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const fields = [
    { key: "title", label: "Project Name", correspondingKey: "projectName" },
    { key: "site_address", label: "Site Address", correspondingKey: "siteAddress" },
    { key: "start_date", label: "Start Date", isDate: true, correspondingKey: "startDate" },
    { key: "end_date", label: "End Date", isDate: true, correspondingKey: "endDate" },
    { key: "description", label: "Project Description", isTextArea: true, correspondingKey: "projectDescription" }
  ];

  const handleEditClick = (key: string, value: any) => {
    setEditingField(key);
    setTempValue(value || "");
  };

  const handleSaveEdit = (key: string) => {
    const updatedData = { ...data };
    const field = fields.find(f => f.key === key);
    
    // Update both camelCase and snake_case versions
    updatedData[key] = tempValue;
    if (field?.correspondingKey) {
      updatedData[field.correspondingKey] = tempValue;
    }
    
    setFormData(updatedData);
    setEditingField(null);
    toast.success("Field updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, isDate, isTextArea }) => (
        <EditableField
          key={key}
          label={label}
          value={data[key]}
          fieldKey={key}
          isEditing={editingField === key}
          tempValue={tempValue}
          onEdit={handleEditClick}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onValueChange={setTempValue}
          isDate={isDate}
          isTextArea={isTextArea}
        />
      ))}
    </div>
  );
};
