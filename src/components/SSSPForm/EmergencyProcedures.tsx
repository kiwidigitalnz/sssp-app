import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertOctagon, Ambulance, FireExtinguisher, ClipboardList } from "lucide-react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { EmergencyContactSelection } from "./EmergencyContactSelection";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  name: string;
  number: string;
  type: string;
}

export const EmergencyProcedures = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
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
    toast({
      title: "Contact Added",
      description: "New emergency contact field added",
    });
  };

  const removeContact = (index: number) => {
    const updatedContacts = emergencyContacts.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, emergencyContacts: updatedContacts });
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed",
    });
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
    toast({
      title: "Contacts Added",
      description: `${selectedContacts.length} contacts have been added`,
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 border-b pb-4">
        <AlertOctagon className="h-8 w-8 text-destructive" />
        <h2 className="text-2xl font-bold text-gray-900">Incident and Emergency Procedures</h2>
      </div>
      
      <Card className="border-muted">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Emergency Contacts
            </CardTitle>
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    Import Contacts
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
                variant="default"
                size="sm"
                onClick={addContact}
                className="shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact: EmergencyContact, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg relative group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Contact Name</Label>
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
                  className="bg-white"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Phone Number</Label>
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
                  className="bg-white"
                />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Type</Label>
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
                  className="bg-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContact(index)}
                  className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-orange-500" />
              Vehicle Accident Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="accidentProcedure">Procedure Details</Label>
                <QuickFillButton
                  fieldId="accidentProcedure"
                  fieldName="Vehicle Accident Procedure"
                  onSelect={(value) => setFormData({ ...formData, accidentProcedure: value })}
                />
              </div>
              <Textarea
                id="accidentProcedure"
                value={formData.accidentProcedure || ""}
                onChange={(e) => setFormData({ ...formData, accidentProcedure: e.target.value })}
                placeholder="Describe the procedure for handling vehicle accidents"
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-blue-500" />
              Medical Emergency Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="medicalProcedure">Procedure Details</Label>
                <QuickFillButton
                  fieldId="medicalProcedure"
                  fieldName="Medical Emergency Procedure"
                  onSelect={(value) => setFormData({ ...formData, medicalProcedure: value })}
                />
              </div>
              <Textarea
                id="medicalProcedure"
                value={formData.medicalProcedure || ""}
                onChange={(e) => setFormData({ ...formData, medicalProcedure: e.target.value })}
                placeholder="Describe the procedure for handling medical emergencies"
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FireExtinguisher className="h-5 w-5 text-red-500" />
              Fire or Hazardous Spills Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="spillProcedure">Procedure Details</Label>
                <QuickFillButton
                  fieldId="spillProcedure"
                  fieldName="Fire or Hazardous Spills Procedure"
                  onSelect={(value) => setFormData({ ...formData, spillProcedure: value })}
                />
              </div>
              <Textarea
                id="spillProcedure"
                value={formData.spillProcedure || ""}
                onChange={(e) => setFormData({ ...formData, spillProcedure: e.target.value })}
                placeholder="Describe the procedure for handling fires or hazardous spills"
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-green-500" />
              Incident Reporting Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reportingProcess">Process Details</Label>
                <QuickFillButton
                  fieldId="reportingProcess"
                  fieldName="Incident Reporting Process"
                  onSelect={(value) => setFormData({ ...formData, reportingProcess: value })}
                />
              </div>
              <Textarea
                id="reportingProcess"
                value={formData.reportingProcess || ""}
                onChange={(e) => setFormData({ ...formData, reportingProcess: e.target.value })}
                placeholder="Describe the process for reporting incidents, including WorkSafe notifications"
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};