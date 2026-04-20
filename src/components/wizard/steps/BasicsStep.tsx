"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicsSchema, type Basics } from "@/lib/wizard/schemas";
import { useWizardStore } from "@/lib/wizard/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StepHandle } from "./types";

export const BasicsStep = forwardRef<StepHandle>(function BasicsStep(_, ref) {
  const saved = useWizardStore((s) => s.basics);
  const updateBasics = useWizardStore((s) => s.updateBasics);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Basics>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      dashboardName: saved.dashboardName ?? "",
      appType: saved.appType,
      description: saved.description ?? "",
    },
  });

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<boolean>((resolve) => {
        handleSubmit(
          (data) => {
            updateBasics(data);
            resolve(true);
          },
          () => resolve(false),
        )();
      }),
  }));

  const appType = watch("appType");

  return (
    <form className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Basics</h2>
        <p className="text-muted-foreground text-sm">
          Give your dashboard a name and tell us what kind of app it's for.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dashboardName">Dashboard name</Label>
        <Input
          id="dashboardName"
          placeholder="My Admin Dashboard"
          {...register("dashboardName")}
        />
        {errors.dashboardName && (
          <p className="text-sm text-red-500">{errors.dashboardName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>App type</Label>
        <Select
          value={appType}
          onValueChange={(v) =>
            setValue("appType", v as Basics["appType"], {
              shouldValidate: true,
            })
          }>
          <SelectTrigger>
            <SelectValue placeholder="Choose an app type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saas">SaaS</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="content">Content platform</SelectItem>
            <SelectItem value="internal">Internal tool</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.appType && (
          <p className="text-sm text-red-500">{errors.appType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="A short description of what this dashboard is for..."
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
    </form>
  );
});
