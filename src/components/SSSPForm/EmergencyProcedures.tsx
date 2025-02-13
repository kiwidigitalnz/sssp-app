
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Siren, Users } from "lucide-react";
import { EmergencyContactSelection } from "./EmergencyContactSelection";
import { EmergencyContactsTable } from "./EmergencyContactsTable";
import { EmergencyResponsePlan } from "./EmergencyComponents/EmergencyResponsePlan";
import { AssemblyPoints } from "./EmergencyComponents/AssemblyPoints";
import { EmergencyEquipment } from "./EmergencyComponents/EmergencyEquipment";
import { IncidentReporting } from "./EmergencyComponents/IncidentReporting";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import type { EmergencyContactFormData, SSSPFormData } from "@/types/sssp/forms";

interface EmergencyProceduresProps {
  formData: SSSPFormData;
  setFormData: (data: SSSPFormData) => void;
  isLoading?: boolean;
}

export const EmergencyProcedures: React.FC<EmergencyProceduresProps> = ({ 
  formData, 
  setFormData,
  isLoading = false
}) => {
  const { id } = useParams();
  const [contacts, setContacts] = useState<EmergencyContactFormData[]>(
    formData.emergencyContacts || []
  );
  const [previousContacts, setPreviousContacts] = useState<EmergencyContactFormData[]>([]);

  useEffect(() => {
    const fetchSSSPData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('sssps')
          .select('emergency_plan, emergency_contacts, assembly_points, emergency_equipment, incident_reporting')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching SSSP data:', error);
          return;
        }

        if (data) {
          const emergencyContacts = (data.emergency_contacts as any[] || []).map(contact => ({
            name: contact.name || '',
            role: contact.role || '',
            phone: contact.phone || '',
            email: contact.email
          }));

          setFormData({
            ...formData,
            emergencyPlan: data.emergency_plan || '',
            emergencyContacts,
            assemblyPoints: data.assembly_points || '',
            emergencyEquipment: data.emergency_equipment || '',
            incidentReporting: data.incident_reporting || ''
          });

          setContacts(emergencyContacts);
        }
      }
    };

    if (!formData.emergencyPlan) {
      fetchSSSPData();
    }
  }, [id]);

  useEffect(() => {
    const fetchPreviousContacts = async () => {
      const { data: sssps, error } = await supabase
        .from('sssps')
        .select('emergency_contacts')
        .not('id', 'eq', id)
        .not('emergency_contacts', 'is', null);

      if (error) {
        console.error('Error fetching previous contacts:', error);
        return;
      }

      const allContacts: EmergencyContactFormData[] = [];
      sssps.forEach((sssp: any) => {
        if (sssp.emergency_contacts) {
          const contacts = (sssp.emergency_contacts as any[]).map(contact => ({
            name: contact.name || '',
            role: contact.role || '',
            phone: contact.phone || '',
            email: contact.email
          }));
          allContacts.push(...contacts);
        }
      });

      setPreviousContacts(allContacts);
    };

    fetchPreviousContacts();
  }, [id]);

  const addContact = () => {
    const newContact: EmergencyContactFormData = {
      name: "",
      role: "",
      phone: ""
    };
    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const updateContact = (index: number, field: keyof EmergencyContactFormData, value: string) => {
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

  const addMultipleContacts = (selectedContacts: EmergencyContactFormData[]) => {
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
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Emergency Contacts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add key personnel to contact in case of emergency
              </p>
            </div>
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <EmergencyContactsTable
                  contacts={contacts}
                  onUpdate={updateContact}
                  onDelete={deleteContact}
                />
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={addContact}
                    className="gap-2 bg-background hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact
                  </Button>
                  <div className="h-6 w-px bg-muted" />
                  <EmergencyContactSelection
                    previousContacts={previousContacts}
                    onSelect={addMultipleContacts}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <EmergencyResponsePlan
            value={formData.emergencyPlan || ""}
            onChange={(value) => setFormData({ ...formData, emergencyPlan: value })}
          />

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
