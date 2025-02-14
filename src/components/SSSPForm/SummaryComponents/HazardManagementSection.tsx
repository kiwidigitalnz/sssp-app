
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { HazardFormData } from "@/types/sssp/forms";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HazardManagementSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const HazardManagementSection = ({ data }: HazardManagementSectionProps) => {
  const navigate = useNavigate();
  const hazards = data.hazards || [];

  const navigateToHazardManagement = () => {
    navigate(`/edit-sssp/32c7f60c-1756-4ff7-be14-4e0ac5c3297c/4`); // Navigate to hazard management step
  };

  return (
    <div className="space-y-4">
      {hazards.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[30%]">Hazard/Risk Source</TableHead>
                  <TableHead className="w-[20%]">Risk Level</TableHead>
                  <TableHead className="w-[50%]">Control Measures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hazards.map((hazard: HazardFormData, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{hazard.hazard}</TableCell>
                    <TableCell className="text-muted-foreground">{hazard.riskLevel}</TableCell>
                    <TableCell>{hazard.controlMeasures}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToHazardManagement}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Hazards
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">No hazards have been added yet.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToHazardManagement}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Add Hazards
          </Button>
        </div>
      )}
    </div>
  );
};
