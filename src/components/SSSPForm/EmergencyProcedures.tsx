import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Phone, AlertCircle } from "lucide-react";

interface EmergencyContact {
  name: string;
  number: string;
  type: string;
}

export const EmergencyProcedures = ({ formData, setFormData }: any) => {
  const emergencyContacts = formData.emergencyContacts || [];

  const addContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...emergencyContacts, { name: "", number: "", type: "" }],
    });
  };

  const removeContact = (index: number) => {
    const updatedContacts = emergencyContacts.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updatedContacts = emergencyContacts.map((contact: EmergencyContact, i: number) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Incident and Emergency Procedures</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
          <div className="space-y-4">
            {emergencyContacts.map((contact: EmergencyContact, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Contact Name"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={contact.number}
                    onChange={(e) => updateContact(index, "number", e.target.value)}
                    placeholder="Phone Number"
                    type="tel"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={contact.type}
                    onChange={(e) => updateContact(index, "type", e.target.value)}
                    placeholder="Type (e.g., Police, Ambulance)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContact(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addContact}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Emergency Contact
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accidentProcedure">Vehicle Accident Procedure</Label>
            <Textarea
              id="accidentProcedure"
              value={formData.accidentProcedure || ""}
              onChange={(e) =>
                setFormData({ ...formData, accidentProcedure: e.target.value })
              }
              placeholder="Describe the procedure for handling vehicle accidents"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalProcedure">Medical Emergency Procedure</Label>
            <Textarea
              id="medicalProcedure"
              value={formData.medicalProcedure || ""}
              onChange={(e) =>
                setFormData({ ...formData, medicalProcedure: e.target.value })
              }
              placeholder="Describe the procedure for handling medical emergencies"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spillProcedure">Fire or Hazardous Spills Procedure</Label>
            <Textarea
              id="spillProcedure"
              value={formData.spillProcedure || ""}
              onChange={(e) =>
                setFormData({ ...formData, spillProcedure: e.target.value })
              }
              placeholder="Describe the procedure for handling fires or hazardous spills"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportingProcess">Incident Reporting Process</Label>
            <Textarea
              id="reportingProcess"
              value={formData.reportingProcess || ""}
              onChange={(e) =>
                setFormData({ ...formData, reportingProcess: e.target.value })
              }
              placeholder="Describe the process for reporting incidents, including WorkSafe notifications"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};