import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  job_title: z.string().optional(),
  website: z.string().url("Please enter a valid website URL (e.g., https://example.com)").optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;