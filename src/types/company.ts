import { z } from "zod";

export type CompanyRole = 'owner' | 'admin' | 'editor' | 'viewer';

export const companyMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['owner', 'admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

export type CompanyMemberFormValues = z.infer<typeof companyMemberSchema>;

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

// Simplified type for the onSubmit handler
export type OnSubmitHandler = (values: CompanyMemberFormValues) => Promise<void>;