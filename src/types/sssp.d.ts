
export interface SSSP {
  id: string;
  title: string;
  description?: string;
  company_name: string;
  company_address?: string;
  company_contact_name?: string;
  company_contact_email?: string;
  company_contact_phone?: string;
  services?: string;
  locations?: string;
  considerations?: string;
  pcbu_duties?: string;
  site_supervisor_duties?: string;
  worker_duties?: string;
  contractor_duties?: string;
  emergency_plan?: string;
  assembly_points?: string;
  emergency_equipment?: string;
  incident_reporting?: string;
  emergency_contacts?: any[];
  competency_requirements?: string;
  training_records?: string;
  required_training?: any[];
  drug_and_alcohol?: string;
  fatigue_management?: string;
  ppe?: string;
  mobile_phone?: string;
  entry_exit_procedures?: string;
  speed_limits?: string;
  parking_rules?: string;
  site_specific_ppe?: string;
  communication_methods?: string;
  toolbox_meetings?: string;
  reporting_procedures?: string;
  communication_protocols?: string;
  visitor_rules?: string;
  hazards?: any[];
  meetings_schedule?: any[];
  monitoring_review?: {
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
  };
  status: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  version: number;
  version_history?: any[];
}
