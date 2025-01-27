import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  job_title: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;