
import { z } from "zod";
import type { SSSP } from "./base";

// Form-specific types
export interface SSSPFormData extends Partial<SSSP> {
  isDraft?: boolean;
  emergencyPlan?: string;
  emergency_plan?: string; // Add snake_case version
  emergencyContacts?: EmergencyContactFormData[];
  emergency_contacts?: EmergencyContactFormData[]; // Add snake_case version
  assemblyPoints?: string;
  assembly_points?: string; // Add snake_case version
  emergencyEquipment?: string;
  emergency_equipment?: string; // Add snake_case version
  incidentReporting?: string;
  incident_reporting?: string; // Add snake_case version
}

export interface ProjectDetailsFormData {
  projectName: string;
  siteAddress: string;
  startDate: string;
  endDate: string;
  projectDescription: string;
}

export interface HazardFormData {
  hazard: string;
  risk: string;
  controlMeasures: string;
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
}

export type Hazard = HazardFormData;

export interface EmergencyContactFormData {
  name: string;
  role: string;
  phone: string;
  email?: string;
}

export interface TrainingRequirementFormData {
  requirement: string;
  description: string;
  frequency: string;
}

export interface MonitoringReviewFormData {
  review_schedule: {
    frequency: string;
    last_review: string | null;
    next_review: string | null;
    responsible_person: string | null;
  };
  kpis: any[];
  corrective_actions: {
    process: string;
    tracking_method: string;
    responsible_person: string | null;
  };
  audits: any[];
  worker_consultation: {
    method: string;
    frequency: string;
    last_consultation: string | null;
  };
  review_triggers: any[];
  documentation: {
    storage_location: string;
    retention_period: string;
    access_details: string;
  };
}
