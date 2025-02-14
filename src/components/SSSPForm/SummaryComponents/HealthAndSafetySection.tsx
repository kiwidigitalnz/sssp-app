
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "./EditableField";

interface HealthAndSafetySectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const HealthAndSafetySection = ({ data, setFormData }: HealthAndSafetySectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const fields = [
    { key: "pcbu_duties", label: "PCBU (Company) Duties", isTextArea: true },
    { key: "site_supervisor_duties", label: "Site Manager/Supervisor Duties", isTextArea: true },
    { key: "worker_duties", label: "Worker Duties", isTextArea: true },
    { key: "contractor_duties", label: "Contractor/Subcontractor Duties", isTextArea: true },
    { key: "visitor_rules", label: "Visitor Rules", isTextArea: true }
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
