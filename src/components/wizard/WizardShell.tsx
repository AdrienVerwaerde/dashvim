"use client";

import { useRef, useState } from "react";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BasicsStep } from "./steps/BasicsStep";
import { SectionsStep } from "./steps/SectionsStep";
import { DataSourceStep } from "./steps/DataSourceStep";
import { DesignStep } from "./steps/DesignStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { StepHandle } from "./steps/types";
import { useRouter } from "next/navigation";
import { useSpecStore } from "@/lib/wizard/spec-store";
import { WizardDataSchema } from "@/lib/wizard/schemas";

const STEP_LABELS = [
  "Basics",
  "Sections",
  "Data Source",
  "Design",
  "Review",
] as const;

export function WizardShell() {
  // Pull only what we need from the store (re-render only when these change)
  const currentStep = useWizardStore((s) => s.currentStep);
  const nextStep = useWizardStore((s) => s.nextStep);
  const prevStep = useWizardStore((s) => s.prevStep);

  // One ref shared by whichever step is currently mounted.
  // Only one step is rendered at a time, so this is safe.
  const stepRef = useRef<StepHandle>(null);

  // Prevents double-clicks while submit() is in flight
  const [submitting, setSubmitting] = useState(false);

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEP_LABELS.length - 1;
  const progressValue = ((currentStep + 1) / STEP_LABELS.length) * 100;

  const router = useRouter();
  const setSpec = useSpecStore((s) => s.setSpec);

  async function handleNext() {
    if (!stepRef.current) return;
    setSubmitting(true);
    try {
      const ok = await stepRef.current.submit();
      if (!ok) return; // validation errors shown inside the step

      if (!isLast) {
        nextStep();
        return;
      }

      // Assemble + validate the full spec.
      const state = useWizardStore.getState();
      const candidate = {
        basics: state.basics,
        sections: state.sections,
        dataSource: state.dataSource,
        design: state.design,
      };

      const parsed = WizardDataSchema.safeParse(candidate);
      if (!parsed.success) {
        console.error("Spec validation failed:", parsed.error.flatten());
        alert(
          "Something is missing or invalid. Please go back through the steps.",
        );
        return;
      }

      setSpec(parsed.data);
      router.push("/result");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Step {currentStep + 1} of {STEP_LABELS.length}:{" "}
          <span className="text-foreground font-medium">
            {STEP_LABELS[currentStep]}
          </span>
        </p>

        <Progress value={progressValue} className="mt-4" />

        <ol className="text-muted-foreground mt-3 flex justify-between text-xs">
          {STEP_LABELS.map((label, i) => (
            <li
              key={label}
              className={
                i === currentStep
                  ? "text-foreground font-medium"
                  : i < currentStep
                    ? "text-foreground/70"
                    : ""
              }>
              {label}
            </li>
          ))}
        </ol>
      </header>

      {/* Step content */}
      <main className="mb-8 w-full">
        {currentStep === 0 && <BasicsStep ref={stepRef} />}
        {currentStep === 1 && <SectionsStep ref={stepRef} />}
        {currentStep === 2 && <DataSourceStep ref={stepRef} />}
        {currentStep === 3 && <DesignStep ref={stepRef} />}
        {currentStep === 4 && <ReviewStep ref={stepRef} />}
      </main>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirst || submitting}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={submitting}>
          {isLast ? "Generate Dashboard" : "Next"}
        </Button>
      </div>
    </div>
  );
}
