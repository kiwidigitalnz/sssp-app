
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
import type { EmergencyContactFormData } from "@/types/sssp/forms";

interface EmergencyProceduresSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const EmergencyProceduresSection = ({ data }: EmergencyProceduresSectionProps) => {
  const navigate = useNavigate();
  const emergencyContacts = data.emergencyContacts || [];

  const navigateToEmergencyProcedures = () => {
    navigate(`/edit-sssp/32c7f60c-1756-4ff7-be14-4e0ac5c3297c/5`);
  };

  const sections = [
    { title: "Emergency Response Plan", content: data.emergencyPlan },
    { title: "Assembly Points", content: data.assemblyPoints },
    { title: "Emergency Equipment", content: data.emergencyEquipment },
    { title: "Incident Reporting", content: data.incidentReporting },
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
        <div className="grid gap-4">
          {sections.map((section, index) => (
            <div key={index} className="rounded-md border p-4">
              <h5 className="font-medium text-sm mb-2">{section.title}</h5>
              {section.content ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {section.content}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No information provided</p>
              )}
            </div>
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
