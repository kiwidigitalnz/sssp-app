import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;