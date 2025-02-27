
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
import type { EmergencyContactFormData } from "@/types/sssp/forms";

interface EmergencyProceduresSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const EmergencyProceduresSection = ({ data, setFormData }: EmergencyProceduresSectionProps) => {
  const navigate = useNavigate();
  const emergencyContacts = data.emergencyContacts || [];
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const navigateToEmergencyProcedures = () => {
    navigate(`/edit-sssp/32c7f60c-1756-4ff7-be14-4e0ac5c3297c/5`);
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

  // Map the database field names to frontend field names
  const fields = [
    { key: "emergency_plan", frontendKey: "emergencyPlan", label: "Emergency Response Plan" },
    { key: "assembly_points", frontendKey: "assemblyPoints", label: "Assembly Points" },
    { key: "emergency_equipment", frontendKey: "emergencyEquipment", label: "Emergency Equipment" },
    { key: "incident_reporting", frontendKey: "incidentReporting", label: "Incident Reporting" }
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Contacts Table */}
      <div className="space-y-4">
        <h4 className="font-medium">Emergency Contacts</h4>
        {emergencyContacts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead className="w-[30%]">Role</TableHead>
                  <TableHead className="w-[40%]">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergencyContacts.map((contact: EmergencyContactFormData, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.role}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No emergency contacts added</p>
        )}
      </div>

      {/* Emergency Procedures Sections */}
      <div className="space-y-4">
        <h4 className="font-medium">Emergency Procedures</h4>
        <div className="space-y-4">
          {fields.map((field) => (
            <EditableField
              key={field.key}
              label={field.label}
              value={data[field.frontendKey] || data[field.key]} // Try frontend key first, then fallback to DB key
              fieldKey={field.frontendKey}
              isEditing={editingField === field.frontendKey}
              tempValue={editingField === field.frontendKey ? tempValue : ""}
              onEdit={(key, value) => handleEdit(key, value)}
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
          onClick={navigateToEmergencyProcedures}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Emergency Procedures
        </Button>
      </div>
    </div>
  );
};
