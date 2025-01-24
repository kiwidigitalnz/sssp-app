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
    };
    Views: {
      [_ in never]: never;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}