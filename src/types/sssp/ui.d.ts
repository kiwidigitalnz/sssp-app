
// UI-specific type definitions
import type { Meeting } from '../meetings';

export type { Meeting };

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

export interface SectionComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export interface TextSectionProps {
  title: string;
  fieldId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export interface CommunicationProps {
  formData: {
    communication_methods?: string;
    toolbox_meetings?: string;
    reporting_procedures?: string;
    communication_protocols?: string;
    meetings_schedule?: Meeting[];
  };
  setFormData: (data: any) => void;
  isLoading?: boolean;
}

export interface HealthAndSafetyPoliciesProps {
  formData: {
    drug_and_alcohol?: string;
    fatigue_management?: string;
    ppe?: string;
    mobile_phone?: string;
  };
  setFormData: (data: any) => void;
  isLoading?: boolean;
}
