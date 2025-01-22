import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Phone, Users, Siren, FireExtinguisher, BellRing } from "lucide-react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { EmergencyContactSelection } from "./EmergencyContactSelection";
import { EmergencyContactsTable } from "./EmergencyContactsTable";

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
      <Card className="shadow-md border-l-4 border-l-destructive">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Siren className="h-7 w-7 text-destructive animate-pulse" />
            Incident and Emergency Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Emergency Response Plan Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Emergency Response Plan</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Document your emergency response procedures and protocols
                </p>
                <QuickFillButton
                  fieldId="emergencyPlan"
                  fieldName="Emergency Response Plan"
                  onSelect={(value) =>
                    setFormData({ ...formData, emergencyPlan: value })
                  }
                />
              </div>
              <Textarea
                value={formData.emergencyPlan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyPlan: e.target.value })
                }
                placeholder="Detail step-by-step emergency response procedures..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Phone className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            </div>
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

          {/* Assembly Points Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Assembly Points</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Specify emergency assembly points and evacuation routes
                </p>
                <QuickFillButton
                  fieldId="assemblyPoints"
                  fieldName="Assembly Points"
                  onSelect={(value) =>
                    setFormData({ ...formData, assemblyPoints: value })
                  }
                />
              </div>
              <Textarea
                value={formData.assemblyPoints || ""}
                onChange={(e) =>
                  setFormData({ ...formData, assemblyPoints: e.target.value })
                }
                placeholder="List primary and secondary assembly points..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Emergency Equipment Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <FireExtinguisher className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Emergency Equipment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  List available emergency equipment and their locations
                </p>
                <QuickFillButton
                  fieldId="emergencyEquipment"
                  fieldName="Emergency Equipment"
                  onSelect={(value) =>
                    setFormData({ ...formData, emergencyEquipment: value })
                  }
                />
              </div>
              <Textarea
                value={formData.emergencyEquipment || ""}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyEquipment: e.target.value })
                }
                placeholder="Document locations of first aid kits, fire extinguishers, etc..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Incident Reporting Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <BellRing className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Incident Reporting</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Outline the incident reporting and notification process
                </p>
                <QuickFillButton
                  fieldId="incidentReporting"
                  fieldName="Incident Reporting"
                  onSelect={(value) =>
                    setFormData({ ...formData, incidentReporting: value })
                  }
                />
              </div>
              <Textarea
                value={formData.incidentReporting || ""}
                onChange={(e) =>
                  setFormData({ ...formData, incidentReporting: e.target.value })
                }
                placeholder="Detail the steps for reporting and documenting incidents..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};