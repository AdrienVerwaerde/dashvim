"use client";
import { useWizardStore } from "@/lib/wizard/store";

export function ReviewStep() {
  const { basics, sections, dataSource, design } = useWizardStore();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Step 5 — Review</h2>
      <p className="text-muted-foreground">
        Review your choices before generating the dashboard.
      </p>
      <pre className="bg-muted p-4 rounded text-xs overflow-auto">
        {JSON.stringify({ basics, sections, dataSource, design }, null, 2)}
      </pre>
    </div>
  );
}
