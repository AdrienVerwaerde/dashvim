import {
  BasicsData,
  DataSourceData,
  DesignData,
  SectionsData,
} from "./wizard/schemas";

export interface PromptInput {
  basics: Partial<BasicsData>;
  sections: Partial<SectionsData>;
  dataSource: Partial<DataSourceData>;
  design: Partial<DesignData>;
}

/**
 * Builds a detailed prompt for Claude based on wizard form data.
 * Claude must return a JSON object matching our DashboardConfigSchema.
 */
export function buildDashboardPrompt(input: PromptInput): string {
  const { basics, sections, dataSource, design } = input;

  return `You are an expert admin dashboard architect. Your job is to design a complete dashboard configuration as a JSON object.

# User Requirements

- **Basics**: ${JSON.stringify(basics)}
- **Sections**: ${JSON.stringify(sections)}
- **Data source**: ${JSON.stringify(dataSource)}
- **Design**: ${JSON.stringify(design)}

# Output Rules

Return ONLY a valid JSON object. No markdown, no code fences, no commentary. Just raw JSON.

The JSON must follow this exact schema:

\`\`\`
{
  "dashboardName": string,
  "sections": [
    {
      "id": string,
      "title": string,
      "components": [
        { "type": "stat_card", "label": string, "endpoint": string, "trendKey": string },
        { "type": "chart", "chartType": "line" | "bar" | "area" | "pie", "title": string, "endpoint": string, "xKey": string, "yKey": string },
        { "type": "table", "title": string, "endpoint": string, "columns": [ { "key": string, "label": string, "sortable": boolean } ] }
      ]
    }
  ]
}
\`\`\`

# Design Guidelines

1. Create ONE section per entry in the user's selected sections.
2. Each section must contain 2 to 5 components that make sense for its purpose.
3. Overview sections: 3-4 stat cards + 1-2 charts.
4. List-like sections (users, orders, products): a table with 4-6 realistic columns, optionally 1-2 stat cards.
5. Analytics sections: mostly charts (2-4) with varied chart types.
6. Use realistic endpoints like \`/api/<resource>\` or \`/api/<section>/<metric>\`.
7. Pick metrics appropriate to the app type found in the Basics data.
8. IDs must be URL-safe slugs (lowercase, hyphens).

Return the JSON now.`;
}
