"use client";

import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectionsSchema, type SectionsData } from "@/lib/wizard/schemas";
import { useWizardStore } from "@/lib/wizard/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { StepHandle } from "./types";
import { BASE_SECTIONS, EXTRA_BY_APP } from "@/lib/wizard/sections-catalog";

export const SectionsStep = forwardRef<StepHandle>(
  function SectionsStep(_, ref) {
    const saved = useWizardStore((s) => s.sections);
    const appType = useWizardStore((s) => s.basics.appType);
    const updateSections = useWizardStore((s) => s.updateSections);

    const available = useMemo(() => {
      const extras = appType ? (EXTRA_BY_APP[appType] ?? []) : [];
      return [...BASE_SECTIONS, ...extras];
    }, [appType]);

    const {
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<SectionsData>({
      resolver: zodResolver(sectionsSchema),
      defaultValues: {
        sections: saved.sections ?? [],
      },
    });

    const selected = watch("sections") ?? [];

    const toggle = (id: string) => {
      const next = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
      setValue("sections", next, { shouldValidate: true });
    };

    useImperativeHandle(ref, () => ({
      submit: () =>
        new Promise<boolean>((resolve) => {
          handleSubmit(
            (data) => {
              updateSections(data);
              resolve(true);
            },
            () => resolve(false),
          )();
        }),
    }));

    return (
      <form className="w-full space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">Sections</h2>
          <p className="text-muted-foreground text-sm">
            Pick the sections you want in your dashboard. Suggestions adapt to
            the app type you chose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {available.map((s) => {
            const checked = selected.includes(s.id);
            return (
              <label
                key={s.id}
                className="flex items-center gap-3 border rounded-md p-3 cursor-pointer hover:bg-accent">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(s.id)}
                />
                <span className="text-sm">{s.label}</span>
              </label>
            );
          })}
        </div>

        {errors.sections && (
          <p className="text-sm text-red-500">{errors.sections.message}</p>
        )}

        <p className="text-xs text-muted-foreground">
          {selected.length} section{selected.length === 1 ? "" : "s"} selected
        </p>
      </form>
    );
  },
);
