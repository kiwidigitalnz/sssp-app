import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { EmergencyContactSelection } from "./EmergencyContactSelection";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface EmergencyContact {
  name: string;
  number: string;
  type: string;
}

export const EmergencyProcedures = ({ formData, setFormData }: any) => {
  const emergencyContacts = formData.emergencyContacts || [];
  const [previousContacts, setPreviousContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    // Load previous emergency contacts from localStorage
    const storedSSSPs = localStorage.getItem("sssps");
    if (storedSSSPs) {
      const sssps = JSON.parse(storedSSSPs);
      const allContacts = sssps
        .map((sssp: any) => sssp.emergencyContacts || [])
        .flat()
        .filter((contact: EmergencyContact) => contact.name && contact.number && contact.type);
      setPreviousContacts(allContacts);
    }
  }, []);

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

  const handleAddSelectedContacts = (selectedContacts: EmergencyContact[]) => {
    setFormData({
      ...formData,
      emergencyContacts: [...emergencyContacts, ...selectedContacts],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Incident and Emergency Procedures</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add from Previous
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EmergencyContactSelection
                    previousContacts={previousContacts}
                    onSelect={handleAddSelectedContacts}
                  />
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContact}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Contact
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact: EmergencyContact, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Contact Name</Label>
                    <QuickFillButton
                      fieldId={`emergency-contact-name-${index}`}
                      fieldName="Emergency Contact Name"
                      onSelect={(value) => updateContact(index, "name", value)}
                    />
                  </div>
                  <Input
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Contact Name"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Phone Number</Label>
                    <QuickFillButton
                      fieldId={`emergency-contact-number-${index}`}
                      fieldName="Emergency Contact Number"
                      onSelect={(value) => updateContact(index, "number", value)}
                    />
                  </div>
                  <Input
                    value={contact.number}
                    onChange={(e) => updateContact(index, "number", e.target.value)}
                    placeholder="Phone Number"
                    type="tel"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Type</Label>
                    <QuickFillButton
                      fieldId={`emergency-contact-type-${index}`}
                      fieldName="Emergency Contact Type"
                      onSelect={(value) => updateContact(index, "type", value)}
                    />
                  </div>
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="accidentProcedure">Vehicle Accident Procedure</Label>
              <QuickFillButton
                fieldId="accidentProcedure"
                fieldName="Vehicle Accident Procedure"
                onSelect={(value) =>
                  setFormData({ ...formData, accidentProcedure: value })
                }
              />
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="medicalProcedure">Medical Emergency Procedure</Label>
              <QuickFillButton
                fieldId="medicalProcedure"
                fieldName="Medical Emergency Procedure"
                onSelect={(value) =>
                  setFormData({ ...formData, medicalProcedure: value })
                }
              />
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="spillProcedure">Fire or Hazardous Spills Procedure</Label>
              <QuickFillButton
                fieldId="spillProcedure"
                fieldName="Fire or Hazardous Spills Procedure"
                onSelect={(value) =>
                  setFormData({ ...formData, spillProcedure: value })
                }
              />
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="reportingProcess">Incident Reporting Process</Label>
              <QuickFillButton
                fieldId="reportingProcess"
                fieldName="Incident Reporting Process"
                onSelect={(value) =>
                  setFormData({ ...formData, reportingProcess: value })
                }
              />
            </div>
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