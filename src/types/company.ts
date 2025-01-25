import { z } from "zod";

export const companyMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['owner', 'admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

export type CompanyMemberFormValues = z.infer<typeof companyMemberSchema>;

export type CompanyRole = 'owner' | 'admin' | 'editor' | 'viewer';