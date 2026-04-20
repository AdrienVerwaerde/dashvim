import { z } from "zod";

// What this file does: Each schema defines what valid input looks like. Zod throws clear error messages if the user submits something wrong. The z.infer<...> lines generate TypeScript types — we never have to write them by hand.//

// ---------- Step 1: Basics ----------
export const appTypes = [
  "saas",
  "ecommerce",
  "content",
  "internal",
  "other",
] as const;

export const basicsSchema = z.object({
  dashboardName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be under 50 characters"),
  appType: z.enum(appTypes, { message: "Please select an app type" }),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
});

// ---------- Step 2: Sections ----------
export const sectionsSchema = z.object({
  sections: z.array(z.string()).min(1, "Select at least one section"),
});

// ---------- Step 3: Data Sources ----------
export const dataSourceTypes = [
  "rest",
  "graphql",
  "supabase",
  "firebase",
  "mock",
] as const;

export const dataSourceSchema = z.object({
  sourceType: z.enum(dataSourceTypes),
  baseUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  authType: z.enum(["none", "bearer", "apiKey", "oauth"]).default("none"),
});

// ---------- Step 4: Design ----------
export const designSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  primaryColor: z.string().default("slate"),
  layout: z.enum(["sidebar", "topbar"]).default("sidebar"),
});

// ---------- Full wizard ----------
export const wizardSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  dataSource: dataSourceSchema,
  design: designSchema,
});

// TypeScript types auto-generated from Zod
export type Basics = z.infer<typeof basicsSchema>;
export type Sections = z.infer<typeof sectionsSchema>;
export type DataSource = z.infer<typeof dataSourceSchema>;
export type Design = z.infer<typeof designSchema>;
export type WizardData = z.infer<typeof wizardSchema>;
