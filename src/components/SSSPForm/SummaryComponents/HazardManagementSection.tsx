
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { HazardFormData } from "@/types/sssp/forms";
import { useNavigate } from "react-router-dom";

interface HazardManagementSectionProps {
  data: any;
  setFormData: (data: any) => void;
}

export const HazardManagementSection = ({ data }: HazardManagementSectionProps) => {
  const navigate = useNavigate();
  const hazards = data.hazards || [];

  const navigateToHazardManagement = () => {
    navigate(`/edit-sssp/${data.id}/4`); // Navigate to hazard management step
  };

  return (
    <div className="space-y-4">
      {hazards.length > 0 ? (
        <>
          <ul className="list-disc list-inside space-y-2 pl-4">
            {hazards.map((hazard: HazardFormData, index: number) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{hazard.hazard}</span>
                {hazard.riskLevel && (
                  <span className="text-muted-foreground ml-2">
                    - Risk Level: {hazard.riskLevel}
                  </span>
                )}
              </li>
            ))}
          </ul>
          
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
