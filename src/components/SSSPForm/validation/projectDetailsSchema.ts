import { z } from "zod";

export const projectDetailsSchema = z.object({
  projectName: z.string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),
  siteAddress: z.string()
    .min(5, "Site address must be at least 5 characters")
    .max(200, "Site address must not exceed 200 characters"),
  startDate: z.string()
    .min(1, "Start date is required")
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Start date must not be in the past"
    }),
  endDate: z.string()
    .min(1, "End date is required")
    .refine((date) => new Date(date) > new Date(), {
      message: "End date must be in the future"
    }),
  projectDescription: z.string()
    .min(20, "Project description must be at least 20 characters")
    .max(1000, "Project description must not exceed 1000 characters")
});

export type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;