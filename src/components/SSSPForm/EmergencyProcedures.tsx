import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle, Phone, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { EmergencyContactSelection } from "./EmergencyContactSelection";

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

  const addMultipleContacts = (selectedContacts: any[]) => {
    const newContacts = [...contacts, ...selectedContacts];
    setContacts(newContacts);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Emergency Procedures and Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Emergency Response Plan
                </h3>
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
                placeholder="Document emergency response procedures..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency Contacts
                </h3>
              </div>
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Name</TableHead>
                        <TableHead className="w-[30%]">Role</TableHead>
                        <TableHead className="w-[30%]">Phone</TableHead>
                        <TableHead className="w-[10%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="space-y-2">
                              <QuickFillButton
                                fieldId={`contact-name-${index}`}
                                fieldName="Contact Name"
                                onSelect={(value) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].name = value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                              />
                              <Input
                                value={contact.name}
                                onChange={(e) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].name = e.target.value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                                placeholder="Contact name"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <QuickFillButton
                                fieldId={`contact-role-${index}`}
                                fieldName="Contact Role"
                                onSelect={(value) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].role = value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                              />
                              <Input
                                value={contact.role}
                                onChange={(e) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].role = e.target.value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                                placeholder="Contact role"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <QuickFillButton
                                fieldId={`contact-phone-${index}`}
                                fieldName="Contact Phone"
                                onSelect={(value) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].phone = value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                              />
                              <Input
                                value={contact.phone}
                                onChange={(e) => {
                                  const newContacts = [...contacts];
                                  newContacts[index].phone = e.target.value;
                                  setContacts(newContacts);
                                  setFormData({ ...formData, emergencyContacts: newContacts });
                                }}
                                placeholder="Contact phone"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newContacts = contacts.filter((_, i) => i !== index);
                                setContacts(newContacts);
                                setFormData({ ...formData, emergencyContacts: newContacts });
                              }}
                              className="hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No emergency contacts added yet. Click "Add Contact" to begin.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <div className="mt-4 space-x-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Assembly Points
                </h3>
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
                placeholder="List emergency assembly points..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};