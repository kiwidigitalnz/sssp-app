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
      profiles: ProfilesTable;
      team_members: TeamMembersTable;
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