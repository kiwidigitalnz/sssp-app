
// UI-specific type definitions
export interface FormStepProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  onStepChange: (step: number) => void;
  isLoading: boolean;
}

export interface Step {
  title: string;
  component: React.ComponentType<any>;
}

export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  isValid?: boolean;
  isLoading?: boolean;
}

export interface HazardTableProps {
  hazards: Array<{
    hazard: string;
    risk: string;
    controlMeasures: string;
  }>;
  previousHazards: any[];
  previousRisks: string[];
  previousControls: string[];
  updateHazard: (index: number, field: string, value: string) => void;
  removeHazard: (index: number) => void;
}

export interface EmergencyContactsTableProps {
  contacts: Array<{
    name: string;
    role: string;
    phone: string;
    email?: string;
  }>;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}
