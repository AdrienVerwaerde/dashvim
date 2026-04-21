"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/lib/wizard/store";
import { designSchema, type DesignData } from "@/lib/wizard/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { StepHandle } from "./types";

export const DesignStep = forwardRef<StepHandle>((_, ref) => {
  const { design, updateDesign } = useWizardStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DesignData>({
    resolver: zodResolver(designSchema),
    defaultValues: design ?? {
      theme: "system",
      primaryColor: "#3b82f6",
      layout: "sidebar",
      density: "comfortable",
    },
  });

  const theme = watch("theme");
  const layout = watch("layout");
  const density = watch("density");
  const primaryColor = watch("primaryColor");

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<boolean>((resolve) => {
        handleSubmit(
          (data) => {
            updateDesign(data);
            resolve(true);
          },
          () => resolve(false),
        )();
      }),
  }));

  const renderRadio = <T extends string>(
    field: "theme" | "layout" | "density",
    current: T,
    options: { id: T; label: string }[],
  ) => (
    <RadioGroup
      value={current}
      onValueChange={(v) =>
        setValue(field, v as never, { shouldValidate: true })
      }
      className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
          <RadioGroupItem value={o.id} />
          <span className="text-sm">{o.label}</span>
        </label>
      ))}
    </RadioGroup>
  );

  return (
    <form className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Design</h2>
        <p className="text-muted-foreground text-sm">
          Look & feel. You can change everything later.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        {renderRadio("theme", theme, [
          { id: "light", label: "Light" },
          { id: "dark", label: "Dark" },
          { id: "system", label: "System" },
        ])}
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary color</Label>
        <div className="flex items-center gap-3">
          <Input
            id="primaryColor"
            type="text"
            className="w-40"
            {...register("primaryColor")}
          />
          <div
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        {errors.primaryColor && (
          <p className="text-sm text-red-500">{errors.primaryColor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        {renderRadio("layout", layout, [
          { id: "sidebar", label: "Sidebar" },
          { id: "topbar", label: "Top bar" },
          { id: "compact", label: "Compact" },
        ])}
      </div>

      <div className="space-y-2">
        <Label>Density</Label>
        {renderRadio("density", density, [
          { id: "comfortable", label: "Comfortable" },
          { id: "compact", label: "Compact" },
        ])}
      </div>
    </form>
  );
});

DesignStep.displayName = "DesignStep";
