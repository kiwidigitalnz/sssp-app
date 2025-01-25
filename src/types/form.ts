import { z } from 'zod';

export const CompanyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  website: z.string().url().optional(),
});

export type CompanyFormData = z.infer<typeof CompanyFormSchema>;

export const TeamMemberFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['owner', 'admin', 'editor', 'viewer'] as const, {
    required_error: "Please select a role",
  }),
});

export type TeamMemberFormData = z.infer<typeof TeamMemberFormSchema>;

export const ProfileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;