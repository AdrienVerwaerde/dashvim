import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Basics, Sections, DataSource, Design } from "./schemas";

// What this file does:
// Holds all wizard data in one place, accessible from any component
// persist middleware saves to localStorage — if the user refreshes the page, their progress is kept
// nextStep / prevStep handle navigation with bounds checking
// Each step has its own updater so we don't accidentally overwrite other steps

export type WizardStep = 0 | 1 | 2 | 3 | 4; // 0=basics, 4=review

interface WizardState {
  currentStep: WizardStep;
  basics: Partial<Basics>;
  sections: Partial<Sections>;
  dataSource: Partial<DataSource>;
  design: Partial<Design>;

  // actions
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBasics: (data: Partial<Basics>) => void;
  updateSections: (data: Partial<Sections>) => void;
  updateDataSource: (data: Partial<DataSource>) => void;
  updateDesign: (data: Partial<Design>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0 as WizardStep,
  basics: {},
  sections: { sections: [] },
  dataSource: { authType: "none" as const },
  design: {
    theme: "system" as const,
    primaryColor: "slate",
    layout: "sidebar" as const,
  },
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((s) => ({
          currentStep: Math.min(4, s.currentStep + 1) as WizardStep,
        })),
      prevStep: () =>
        set((s) => ({
          currentStep: Math.max(0, s.currentStep - 1) as WizardStep,
        })),
      updateBasics: (data) =>
        set((s) => ({ basics: { ...s.basics, ...data } })),
      updateSections: (data) =>
        set((s) => ({ sections: { ...s.sections, ...data } })),
      updateDataSource: (data) =>
        set((s) => ({ dataSource: { ...s.dataSource, ...data } })),
      updateDesign: (data) =>
        set((s) => ({ design: { ...s.design, ...data } })),
      reset: () => set(initialState),
    }),
    {
      name: "dashvim-wizard", // localStorage key
    },
  ),
);
