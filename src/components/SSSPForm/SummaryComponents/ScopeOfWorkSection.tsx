
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "./EditableField";

interface ScopeOfWorkSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const ScopeOfWorkSection = ({ data, setFormData }: ScopeOfWorkSectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const fields = [
    { key: "services", label: "Services Provided", isTextArea: true },
    { key: "locations", label: "Key Locations and Routes", isTextArea: true },
    { key: "considerations", label: "Special Considerations", isTextArea: true }
  ];

  const handleEditClick = (key: string, value: any) => {
    setEditingField(key);
    setTempValue(value || "");
  };

  const handleSaveEdit = (key: string) => {
    const updatedData = { ...data };
    updatedData[key] = tempValue;
    setFormData({ ...data, [key]: tempValue });
    setEditingField(null);
    toast.success("Field updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, isTextArea }) => (
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
          isTextArea={isTextArea}
        />
      ))}
    </div>
  );
};
