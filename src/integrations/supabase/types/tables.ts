import type { Json } from './database';

interface ProfilesTable {
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
  Relationships: [];
}

interface TeamMembersTable {
  Row: {
    id: string;
    company_id: string;
    member_id: string;
    role: Database["public"]["Enums"]["team_member_role"];
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    company_id: string;
    member_id: string;
    role?: Database["public"]["Enums"]["team_member_role"];
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    company_id?: string;
    member_id?: string;
    role?: Database["public"]["Enums"]["team_member_role"];
    created_at?: string;
    updated_at?: string;
  };
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

export type { ProfilesTable, TeamMembersTable };