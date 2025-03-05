
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
    formData.emergencyContacts || formData.emergency_contacts || []
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
          console.log("Emergency data from DB:", data);
          
          const emergencyContacts = (data.emergency_contacts as any[] || []).map(contact => ({
            name: contact.name || '',
            role: contact.role || '',
            phone: contact.phone || '',
            email: contact.email
          }));

          setFormData({
            ...formData,
            // Store both snake_case (DB) and camelCase (frontend) versions
            emergency_plan: data.emergency_plan || '',
            emergencyPlan: data.emergency_plan || '',
            emergency_contacts: emergencyContacts,
            emergencyContacts: emergencyContacts,
            assembly_points: data.assembly_points || '',
            assemblyPoints: data.assembly_points || '',
            emergency_equipment: data.emergency_equipment || '',
            emergencyEquipment: data.emergency_equipment || '',
            incident_reporting: data.incident_reporting || '',
            incidentReporting: data.incident_reporting || ''
          });

          setContacts(emergencyContacts);
        }
      }
    };

    // Only fetch if the data isn't already loaded
    if (!formData.emergencyPlan && !formData.emergency_plan) {
      console.log("Fetching emergency procedures data from DB");
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
    setFormData({ 
      ...formData, 
      emergencyContacts: newContacts,
      emergency_contacts: newContacts 
    });
  };

  const deleteContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    setFormData({ 
      ...formData, 
      emergencyContacts: newContacts,
      emergency_contacts: newContacts 
    });
  };

  const addMultipleContacts = (selectedContacts: EmergencyContactFormData[]) => {
    const newContacts = [...contacts, ...selectedContacts];
    setContacts(newContacts);
    setFormData({ 
      ...formData, 
      emergencyContacts: newContacts,
      emergency_contacts: newContacts 
    });
  };

  // Get the proper value from either snake_case or camelCase field
  const getFieldValue = (snakeCase: string, camelCase: string) => {
    return formData[snakeCase] || formData[camelCase] || "";
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
                    onClick={() => {
                      const newContact: EmergencyContactFormData = {
                        name: "",
                        role: "",
                        phone: ""
                      };
                      const newContacts = [...contacts, newContact];
                      setContacts(newContacts);
                      setFormData({ 
                        ...formData, 
                        emergencyContacts: newContacts,
                        emergency_contacts: newContacts 
                      });
                    }}
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
            value={getFieldValue('emergency_plan', 'emergencyPlan')}
            onChange={(value) => setFormData({ 
              ...formData, 
              emergencyPlan: value,
              emergency_plan: value 
            })}
          />

          <AssemblyPoints
            value={getFieldValue('assembly_points', 'assemblyPoints')}
            onChange={(value) => setFormData({ 
              ...formData, 
              assemblyPoints: value,
              assembly_points: value 
            })}
          />

          <EmergencyEquipment
            value={getFieldValue('emergency_equipment', 'emergencyEquipment')}
            onChange={(value) => setFormData({ 
              ...formData, 
              emergencyEquipment: value,
              emergency_equipment: value 
            })}
          />

          <IncidentReporting
            value={getFieldValue('incident_reporting', 'incidentReporting')}
            onChange={(value) => setFormData({ 
              ...formData, 
              incidentReporting: value,
              incident_reporting: value 
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
};
