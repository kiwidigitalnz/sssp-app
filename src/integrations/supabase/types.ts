export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          email: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      sssp_access: {
        Row: {
          access_level: string
          created_at: string
          id: string
          sssp_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          id?: string
          sssp_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          id?: string
          sssp_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sssp_access_sssp_id_fkey"
            columns: ["sssp_id"]
            isOneToOne: false
            referencedRelation: "sssps"
            referencedColumns: ["id"]
          },
        ]
      }
      sssp_activity: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          sssp_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          sssp_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          sssp_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sssp_activity_sssp_id_fkey"
            columns: ["sssp_id"]
            isOneToOne: false
            referencedRelation: "sssps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sssp_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sssp_invitations: {
        Row: {
          access_level: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          sssp_id: string
          status: string
        }
        Insert: {
          access_level: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          sssp_id: string
          status?: string
        }
        Update: {
          access_level?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          sssp_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sssp_invitations_sssp_id_fkey"
            columns: ["sssp_id"]
            isOneToOne: false
            referencedRelation: "sssps"
            referencedColumns: ["id"]
          },
        ]
      }
      sssp_versions: {
        Row: {
          created_at: string
          created_by: string
          data: Json
          id: string
          sssp_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          data: Json
          id?: string
          sssp_id: string
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          sssp_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sssp_versions_sssp_id_fkey"
            columns: ["sssp_id"]
            isOneToOne: false
            referencedRelation: "sssps"
            referencedColumns: ["id"]
          },
        ]
      }
      sssps: {
        Row: {
          annualreview: string | null
          assembly_points: string | null
          audits: Json[] | null
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
          correctiveactions: string | null
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
          worker_duties: string | null
        }
        Insert: {
          annualreview?: string | null
          assembly_points?: string | null
          audits?: Json[] | null
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
          correctiveactions?: string | null
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
          worker_duties?: string | null
        }
        Update: {
          annualreview?: string | null
          assembly_points?: string | null
          audits?: Json[] | null
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
          correctiveactions?: string | null
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
          worker_duties?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      company_role: "owner" | "admin" | "editor" | "viewer"
      meeting_frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "quarterly"
        | "asneeded"
      team_member_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
