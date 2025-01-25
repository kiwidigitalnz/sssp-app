import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Siren } from "lucide-react";
import { EmergencyContactSelection } from "./EmergencyContactSelection";
import { EmergencyContactsTable } from "./EmergencyContactsTable";
import { EmergencyResponsePlan } from "./EmergencyComponents/EmergencyResponsePlan";
import { AssemblyPoints } from "./EmergencyComponents/AssemblyPoints";
import { EmergencyEquipment } from "./EmergencyComponents/EmergencyEquipment";
import { IncidentReporting } from "./EmergencyComponents/IncidentReporting";

export const EmergencyProcedures = ({ formData, setFormData }: any) => {
  const [contacts, setContacts] = useState(formData.emergencyContacts || []);
  const [previousContacts, setPreviousContacts] = useState([]);

  useEffect(() => {
    const storedSSSPs = localStorage.getItem("sssps");
    if (storedSSSPs) {
      const sssps = JSON.parse(storedSSSPs);
      const allContacts = [];
      
      sssps.forEach((sssp: any) => {
        if (sssp.emergencyContacts) {
          allContacts.push(...sssp.emergencyContacts);
        }
      });
      
      setPreviousContacts(allContacts);
    }
  }, []);

  const addContact = () => {
    const newContacts = [...contacts, { name: "", role: "", phone: "" }];
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const deleteContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const addMultipleContacts = (selectedContacts: any[]) => {
    const newContacts = [...contacts, ...selectedContacts];
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <Siren className="h-6 w-6 text-primary" />
            Incident and Emergency Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmergencyResponsePlan
            value={formData.emergencyPlan || ""}
            onChange={(value) => setFormData({ ...formData, emergencyPlan: value })}
          />

          <div className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <EmergencyContactsTable
                  contacts={contacts}
                  onUpdate={updateContact}
                  onDelete={deleteContact}
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={addContact}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact
                  </Button>
                  <EmergencyContactSelection
                    previousContacts={previousContacts}
                    onSelect={addMultipleContacts}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <AssemblyPoints
            value={formData.assemblyPoints || ""}
            onChange={(value) => setFormData({ ...formData, assemblyPoints: value })}
          />

          <EmergencyEquipment
            value={formData.emergencyEquipment || ""}
            onChange={(value) => setFormData({ ...formData, emergencyEquipment: value })}
          />

          <IncidentReporting
            value={formData.incidentReporting || ""}
            onChange={(value) => setFormData({ ...formData, incidentReporting: value })}
          />
        </CardContent>
      </Card>
    </div>
  );
};