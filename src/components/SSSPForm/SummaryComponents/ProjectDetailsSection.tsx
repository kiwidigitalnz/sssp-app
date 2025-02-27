
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "./EditableField";

interface ProjectDetailsSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const ProjectDetailsSection = ({ data, setFormData }: ProjectDetailsSectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const fields = [
    { key: "title", label: "Project Name" },
    { key: "site_address", label: "Site Address" }, // Updated to use site_address
    { key: "start_date", label: "Start Date", isDate: true },
    { key: "end_date", label: "End Date", isDate: true },
    { key: "description", label: "Project Description", isTextArea: true }
  ];

  const handleEditClick = (key: string, value: any) => {
    setEditingField(key);
    setTempValue(value || "");
  };

  const handleSaveEdit = (key: string) => {
    const updatedData = { ...data };
    updatedData[key] = tempValue;
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
