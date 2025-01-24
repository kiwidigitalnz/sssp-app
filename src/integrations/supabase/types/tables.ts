import type { Database } from './database';

export interface ProfilesTable {
  Row: Database['public']['Tables']['profiles']['Row'];
  Insert: Database['public']['Tables']['profiles']['Insert'];
  Update: Database['public']['Tables']['profiles']['Update'];
  Relationships: [];
}

export interface TeamMembersTable {
  Row: Database['public']['Tables']['team_members']['Row'];
  Insert: Database['public']['Tables']['team_members']['Insert'];
  Update: Database['public']['Tables']['team_members']['Update'];
  Relationships: [
    {
      foreignKeyName: "team_members_company_id_fkey";
      columns: ["company_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "team_members_member_id_fkey";
      columns: ["member_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}