"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useWizardStore } from "@/lib/wizard/store";
import type { StepHandle } from "./types";

export const ReviewStep = forwardRef<StepHandle>((_, ref) => {
  const { basics, sections, dataSource, design } = useWizardStore();

  useImperativeHandle(ref, () => ({
    submit: async () => true,
  }));

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value ?? "—"}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Review</h2>
        <p className="text-muted-foreground text-sm">
          Double-check everything before we generate your dashboard.
        </p>
      </div>

      <section>
        <h3 className="font-semibold mb-1">Basics</h3>
        <Row label="Name" value={basics?.dashboardName} />
        <Row label="App type" value={basics?.appType} />
        <Row label="Description" value={basics?.description || "—"} />
      </section>

      <section>
        <h3 className="font-semibold mb-1">Sections</h3>
        <Row label="Selected" value={sections?.sections?.join(", ") || "—"} />
      </section>

      <section>
        <h3 className="font-semibold mb-1">Data source</h3>
        <Row label="Type" value={dataSource?.sourceType} />
        <Row label="Base URL" value={dataSource?.baseUrl || "—"} />
        <Row label="Auth" value={dataSource?.authType} />
      </section>

      <section>
        <h3 className="font-semibold mb-1">Design</h3>
        <Row label="Theme" value={design?.theme} />
        <Row
          label="Primary color"
          value={
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded border"
                style={{ backgroundColor: design?.primaryColor }}
              />
              {design?.primaryColor}
            </span>
          }
        />
        <Row label="Layout" value={design?.layout} />
        <Row label="Density" value={design?.density} />
      </section>
    </div>
  );
});

ReviewStep.displayName = "ReviewStep";
