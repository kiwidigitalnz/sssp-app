
import { ReactNode } from "react";
import { ProjectDetails } from "./ProjectDetails";
import { CompanyInfo } from "./CompanyInfo";
import { ScopeOfWork } from "./ScopeOfWork";
import { HealthAndSafety } from "./HealthAndSafety";
import { HazardManagement } from "./HazardManagement";
import { EmergencyProcedures } from "./EmergencyProcedures";
import TrainingRequirements from "./TrainingRequirements";
import { HealthAndSafetyPolicies } from "./HealthAndSafetyPolicies";
import { SiteSafetyRules } from "./SiteSafetyRules";
import { Communication } from "./Communication";
import { MonitoringReview } from "./MonitoringReview";
import { SummaryScreen } from "./SummaryScreen";

export interface Step {
  title: string;
  component: React.ComponentType<any>;
}

export const formSteps: Step[] = [
  { title: "Project Details", component: ProjectDetails },
  { title: "Company Information", component: CompanyInfo },
  { title: "Scope of Work", component: ScopeOfWork },
  { title: "Health and Safety Responsibilities", component: HealthAndSafety },
  { title: "Hazard and Risk Management", component: HazardManagement },
  { title: "Incident and Emergency Procedures", component: EmergencyProcedures },
  { title: "Training and Competency Requirements", component: TrainingRequirements },
  { title: "Health and Safety Policies", component: HealthAndSafetyPolicies },
  { title: "Site-Specific Safety Rules", component: SiteSafetyRules },
  { title: "Communication and Consultation", component: Communication },
  { title: "Monitoring and Review", component: MonitoringReview },
  { title: "Review and Submit", component: SummaryScreen }
];

interface FormStepsProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  onStepChange: (step: number) => void;
  isLoading: boolean;
}

export const FormSteps = ({ 
  currentStep, 
  formData, 
  setFormData, 
  onStepChange,
  isLoading 
}: FormStepsProps) => {
  const CurrentStepComponent = formSteps[currentStep].component;

  return (
    <CurrentStepComponent
      formData={formData}
      setFormData={setFormData}
      onStepChange={onStepChange}
      isLoading={isLoading}
    />
  );
};
