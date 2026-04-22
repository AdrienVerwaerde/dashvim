import { z } from "zod";

/* ---------- Component schemas ---------- */

const StatCardSchema = z.object({
  type: z.literal("stat_card"),
  label: z.string(),
  endpoint: z.string(),
  trendKey: z.string().optional(),
});

const ChartSchema = z.object({
  type: z.literal("chart"),
  chartType: z.enum(["line", "bar", "area", "pie"]),
  title: z.string(),
  endpoint: z.string(),
  xKey: z.string(),
  yKey: z.string(),
});

const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  sortable: z.boolean().optional(),
});

const TableSchema = z.object({
  type: z.literal("table"),
  title: z.string(),
  endpoint: z.string(),
  columns: z.array(TableColumnSchema).min(1),
});

/* ---------- Discriminated union ---------- */

const ComponentSchema = z.discriminatedUnion("type", [
  StatCardSchema,
  ChartSchema,
  TableSchema,
]);

/* ---------- Section & full dashboard ---------- */

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  components: z.array(ComponentSchema).min(1),
});

export const DashboardConfigSchema = z.object({
  dashboardName: z.string(),
  sections: z.array(SectionSchema).min(1),
});

/* ---------- Types ---------- */

export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;
export type DashboardSection = z.infer<typeof SectionSchema>;
export type DashboardComponent = z.infer<typeof ComponentSchema>;
