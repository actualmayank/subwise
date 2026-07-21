import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const CATEGORIES = ["streaming", "software", "fitness", "utilities", "other"] as const;
export const BILLING_CYCLES = ["weekly", "monthly", "quarterly", "yearly"] as const;
export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"] as const;

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  category: z.enum(CATEGORIES),
  cost: z.coerce.number().positive("Cost must be greater than 0").max(1_000_000),
  currency: z.enum(CURRENCIES).default("USD"),
  billingCycle: z.enum(BILLING_CYCLES),
  nextRenewalDate: z.coerce.date(),
  startDate: z.coerce.date(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  lastUsed: z.coerce.date().optional().nullable(),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  currencyPreference: z.enum(CURRENCIES),
});
