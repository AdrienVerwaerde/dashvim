// Single source of truth for all section IDs and labels.
// Imported by both the UI (SectionsStep) and the validator (schemas.ts).
// Add a new section here → it appears in the form and is accepted by the schema.

export const BASE_SECTIONS = [
    { id: "overview", label: "Overview (KPIs & summary)" },
    { id: "tables", label: "Data tables (sort/filter/paginate)" },
    { id: "charts", label: "Charts & analytics" },
    { id: "crud", label: "CRUD forms (create/edit/delete)" },
    { id: "users", label: "User management" },
    { id: "settings", label: "Settings page" },
    { id: "auth", label: "Authentication (login/signup)" },
    { id: "notifications", label: "Notifications / activity log" },
    { id: "export", label: "Export data (CSV, PDF)" },
    { id: "search", label: "Global search" },
] as const;

export const EXTRA_BY_APP = {
    saas: [
        { id: "subscriptions", label: "Subscriptions & billing" },
        { id: "plans", label: "Plans & pricing" },
    ],
    ecommerce: [
        { id: "products", label: "Products catalog" },
        { id: "orders", label: "Orders & fulfillment" },
        { id: "customers", label: "Customers" },
    ],
    content: [
        { id: "posts", label: "Posts / articles" },
        { id: "comments", label: "Comments moderation" },
        { id: "media", label: "Media library" },
    ],
    internal: [{ id: "audit", label: "Audit log" }],
    other: [],
} as const;

// Flatten all possible section IDs into a tuple literal.
// Zod needs a tuple like ["a", "b", ...] for z.enum(), not a plain string[].
const allExtras = Object.values(EXTRA_BY_APP).flat();
const allSections = [...BASE_SECTIONS, ...allExtras];

export const SECTION_IDS = allSections.map((s) => s.id) as [
    string,
    ...string[],
];

export type SectionId = (typeof SECTION_IDS)[number];
