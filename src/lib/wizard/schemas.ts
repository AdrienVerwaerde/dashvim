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
  dashboardName: z.string().min(3).max(50),
  appType: z.enum(appTypes),
  description: z.string().max(500).optional(),
});
export type BasicsData = z.infer<typeof basicsSchema>;

// ---------- Step 2: Sections ----------
export const sectionsSchema = z.object({
  sections: z.array(z.string()).min(1, "Select at least one section"),
});
export type SectionsData = z.infer<typeof sectionsSchema>;

// ---------- Step 3: Data Source ----------
export const dataSourceSchema = z.object({
  sourceType: z.enum(["rest", "graphql", "mock", "other"]),
  baseUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  authType: z.enum(["none", "bearer", "apiKey", "cookie"]),
});
export type DataSourceData = z.infer<typeof dataSourceSchema>;

// ---------- Step 4: Design ----------
export const designSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Must be a hex color like #3b82f6"),
  layout: z.enum(["sidebar", "topbar", "compact"]),
  density: z.enum(["comfortable", "compact"]),
});
export type DesignData = z.infer<typeof designSchema>;

// ---------- Combined wizard schema ----------
// Aggregates all four steps into a single object.
// Used by the /api/generate route to validate the full payload.
export const WizardDataSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  dataSource: dataSourceSchema,
  design: designSchema,
});
export type WizardData = z.infer<typeof WizardDataSchema>;
