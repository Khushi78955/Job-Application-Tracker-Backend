import { z } from "zod";

export const createApplicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name cannot exceed 255 characters"),

  role: z
    .string()
    .trim()
    .min(2, "Role must be at least 2 characters")
    .max(255, "Role cannot exceed 255 characters"),

  status: z.enum([
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Wishlist",
  ]),

  applied_date: z.string(),

  follow_up_date: z
    .string()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
});

export const updateApplicationSchema =
  createApplicationSchema.partial();