"use client";

import { useRef } from "react";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicsStep } from "./steps/BasicsStep";
import { SectionsStep } from "./steps/SectionsStep";
import { DataSourceStep } from "./steps/DataSourceStep";
import { DesignStep } from "./steps/DesignStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { StepHandle } from "./steps/types";

const steps = [
  { label: "Basics", Component: BasicsStep },
  { label: "Sections", Component: SectionsStep },
  { label: "Data Source", Component: DataSourceStep },
  { label: "Design", Component: DesignStep },
  { label: "Review", Component: ReviewStep },
];

export function WizardShell() {
  const { currentStep, nextStep, prevStep } = useWizardStore();
  const stepRef = useRef<StepHandle>(null);

  const { Component, label } = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = async () => {
    // Review step has no form to validate
    if (isLast) {
      alert("Generation will be wired up in Phase 3 🚀");
      return;
    }
    const ok = await stepRef.current?.submit();
    if (ok) nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {steps.length} — {label}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="p-6 min-h-[320px]">
        <Component ref={stepRef} />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={isFirst}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {isLast ? "Generate Dashboard" : "Next"}
        </Button>
      </div>
    </div>
  );
}
