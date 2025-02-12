export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          company: string | null;
          job_title: string | null;
          phone: string | null;
          updated_at: string;
          bio: string | null;
          website: string | null;
          social_links: Json | null;
          preferences: Json | null;
          role: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          job_title?: string | null;
          phone?: string | null;
          updated_at?: string;
          bio?: string | null;
          website?: string | null;
          social_links?: Json | null;
          preferences?: Json | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          job_title?: string | null;
          phone?: string | null;
          updated_at?: string;
          bio?: string | null;
          website?: string | null;
          social_links?: Json | null;
          preferences?: Json | null;
          role?: string | null;
        };
      };
      template_version: {
        Row: {
          id: string;
          version: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          version: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          version?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      team_members: {
        Row: {
          id: string;
          company_id: string;
          member_id: string;
          role: "admin" | "editor" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          member_id: string;
          role?: "admin" | "editor" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          member_id?: string;
          role?: "admin" | "editor" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
      };
      sssps: {
        Row: {
          assembly_points: string | null
          communication_methods: string | null
          communication_protocols: string | null
          company_address: string | null
          company_contact_email: string | null
          company_contact_name: string | null
          company_contact_phone: string | null
          company_name: string
          competency_requirements: string | null
          considerations: string | null
          contractor_duties: string | null
          created_at: string
          created_by: string
          description: string | null
          drug_and_alcohol: string | null
          emergency_contacts: Json[] | null
          emergency_equipment: string | null
          emergency_plan: string | null
          end_date: string | null
          entry_exit_procedures: string | null
          fatigue_management: string | null
          hazards: Json[] | null
          id: string
          incident_reporting: string | null
          locations: string | null
          meetings_schedule: Json[] | null
          mobile_phone: string | null
          modified_by: string
          monitoring_review: Json | null
          parking_rules: string | null
          pcbu_duties: string | null
          ppe: string | null
          reporting_procedures: string | null
          required_training: Json[] | null
          services: string | null
          site_specific_ppe: string | null
          site_supervisor_duties: string | null
          speed_limits: string | null
          start_date: string | null
          status: string
          title: string
          toolbox_meetings: string | null
          training_records: string | null
          updated_at: string
          version: number
          version_history: Json[] | null
          visitor_rules: string | null
          worker_duties: string | null
          template_version: string | null;
        }
        Insert: {
          assembly_points?: string | null
          communication_methods?: string | null
          communication_protocols?: string | null
          company_address?: string | null
          company_contact_email?: string | null
          company_contact_name?: string | null
          company_contact_phone?: string | null
          company_name: string
          competency_requirements?: string | null
          considerations?: string | null
          contractor_duties?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          drug_and_alcohol?: string | null
          emergency_contacts?: Json[] | null
          emergency_equipment?: string | null
          emergency_plan?: string | null
          end_date?: string | null
          entry_exit_procedures?: string | null
          fatigue_management?: string | null
          hazards?: Json[] | null
          id?: string
          incident_reporting?: string | null
          locations?: string | null
          meetings_schedule?: Json[] | null
          mobile_phone?: string | null
          modified_by: string
          monitoring_review?: Json | null
          parking_rules?: string | null
          pcbu_duties?: string | null
          ppe?: string | null
          reporting_procedures?: string | null
          required_training?: Json[] | null
          services?: string | null
          site_specific_ppe?: string | null
          site_supervisor_duties?: string | null
          speed_limits?: string | null
          start_date?: string | null
          status?: string
          title: string
          toolbox_meetings?: string | null
          training_records?: string | null
          updated_at?: string
          version?: number
          version_history?: Json[] | null
          visitor_rules?: string | null
          worker_duties?: string | null
          template_version?: string | null;
        }
        Update: {
          assembly_points?: string | null
          communication_methods?: string | null
          communication_protocols?: string | null
          company_address?: string | null
          company_contact_email?: string | null
          company_contact_name?: string | null
          company_contact_phone?: string | null
          company_name?: string
          competency_requirements?: string | null
          considerations?: string | null
          contractor_duties?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          drug_and_alcohol?: string | null
          emergency_contacts?: Json[] | null
          emergency_equipment?: string | null
          emergency_plan?: string | null
          end_date?: string | null
          entry_exit_procedures?: string | null
          fatigue_management?: string | null
          hazards?: Json[] | null
          id?: string
          incident_reporting?: string | null
          locations?: string | null
          meetings_schedule?: Json[] | null
          mobile_phone?: string | null
          modified_by?: string
          monitoring_review?: Json | null
          parking_rules?: string | null
          pcbu_duties?: string | null
          ppe?: string | null
          reporting_procedures?: string | null
          required_training?: Json[] | null
          services?: string | null
          site_specific_ppe?: string | null
          site_supervisor_duties?: string | null
          speed_limits?: string | null
          start_date?: string | null
          status?: string
          title?: string
          toolbox_meetings?: string | null
          training_records?: string | null
          updated_at?: string
          version?: number
          version_history?: Json[] | null
          visitor_rules?: string | null
          worker_duties?: string | null
          template_version?: string | null;
        }
        Relationships: []
      }
    };
    Functions: {
      transfer_company_ownership: {
        Args: {
          new_owner_id: string;
          current_owner_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      team_member_role: "admin" | "editor" | "viewer";
    };
  };
}
