
import { z } from "zod";
import type { SSSP } from "./base";
import type { Json } from "@/integrations/supabase/types";

// Form-specific types
export interface SSSPFormData extends Partial<SSSP> {
  isDraft?: boolean;
  
  // Project details fields (both camelCase and snake_case)
  projectName?: string; // camelCase version
  title?: string; // snake_case version
  siteAddress?: string; // camelCase version
  site_address?: string; // snake_case version
  projectDescription?: string; // camelCase version  
  description?: string; // snake_case version
  startDate?: string; // camelCase version
  start_date?: string; // snake_case version
  endDate?: string; // camelCase version
  end_date?: string; // snake_case version
  
  // Emergency related fields (both camelCase and snake_case)
  emergencyPlan?: string; // camelCase version
  emergency_plan?: string; // snake_case version
  emergencyContacts?: EmergencyContactFormData[]; // camelCase version
  emergency_contacts?: EmergencyContactFormData[] | Json[]; // snake_case version - now allows Json[] type
  assemblyPoints?: string; // camelCase version
  assembly_points?: string; // snake_case version
  emergencyEquipment?: string; // camelCase version
  emergency_equipment?: string; // snake_case version
  incidentReporting?: string; // camelCase version
  incident_reporting?: string; // snake_case version
  
  // Company info fields (both camelCase and snake_case)
  companyName?: string; // camelCase version
  company_name?: string; // snake_case version
  companyAddress?: string; // camelCase version  
  company_address?: string; // snake_case version
  companyContactName?: string; // camelCase version
  company_contact_name?: string; // snake_case version
  companyContactEmail?: string; // camelCase version
  company_contact_email?: string; // snake_case version
  companyContactPhone?: string; // camelCase version
  company_contact_phone?: string; // snake_case version
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

// Make emergency contact compatible with Json by ensuring it's a simple object
export interface EmergencyContactFormData {
  [key: string]: string | number | null | undefined; // Add index signature for Json compatibility
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
