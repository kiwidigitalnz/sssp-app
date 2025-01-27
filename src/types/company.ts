import { z } from "zod";

export type CompanyRole = 'owner' | 'admin' | 'editor' | 'viewer';

// Base schema for company member form
export const companyMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['owner', 'admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

// Direct type for form values
export type CompanyMemberFormValues = {
  email: string;
  role: CompanyRole;
};

// Company access interface
export interface CompanyAccess {
  id: string;
  company_id: string;
  user_id: string;
  role: CompanyRole;
  company_profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}