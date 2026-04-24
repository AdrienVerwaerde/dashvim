import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WizardData } from "./schemas";

// Separate store from the wizard's in-progress state.
// Holds the *final, validated* spec produced when the user clicks "Generate".
// Persisted so a page refresh on /result doesn't lose it.

interface SpecState {
    spec: WizardData | null;
    setSpec: (spec: WizardData) => void;
    clearSpec: () => void;
}

export const useSpecStore = create<SpecState>()(
    persist(
        (set) => ({
            spec: null,
            setSpec: (spec) => set({ spec }),
            clearSpec: () => set({ spec: null }),
        }),
        { name: "dashvim-spec" },
    ),
);
