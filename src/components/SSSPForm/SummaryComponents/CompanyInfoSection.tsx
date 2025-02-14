
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "./EditableField";

interface CompanyInfoSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const CompanyInfoSection = ({ data, setFormData }: CompanyInfoSectionProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const fields = [
    { key: "companyName", label: "Company Name" },
    { key: "address", label: "Address" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "contactPhone", label: "Contact Phone" }
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
      {fields.map(({ key, label }) => (
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
        />
      ))}
    </div>
  );
};
