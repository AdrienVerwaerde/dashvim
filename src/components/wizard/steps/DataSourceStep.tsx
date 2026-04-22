"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/lib/wizard/store";
import { dataSourceSchema, type DataSourceData } from "@/lib/wizard/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { StepHandle } from "./types";

export const DataSourceStep = forwardRef<StepHandle>((_, ref) => {
  const { dataSource, updateDataSource } = useWizardStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DataSourceData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: dataSource ?? {
      sourceType: "rest",
      baseUrl: "",
      authType: "none",
    },
  });

  const sourceType = watch("sourceType");
  const authType = watch("authType");

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<boolean>((resolve) => {
        handleSubmit(
          (data) => {
            updateDataSource(data);
            resolve(true);
          },
          () => resolve(false),
        )();
      }),
  }));

  return (
    <form className="w-full space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Data Source</h2>
        <p className="text-muted-foreground text-sm">
          Where does your dashboard get its data? You can adjust endpoints
          later.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Source type</Label>
        <RadioGroup
          value={sourceType}
          onValueChange={(v) =>
            setValue("sourceType", v as DataSourceData["sourceType"], {
              shouldValidate: true,
            })
          }
          className="grid grid-cols-2 gap-2">
          {[
            { id: "rest", label: "REST API" },
            { id: "graphql", label: "GraphQL" },
            { id: "mock", label: "Mock data (for now)" },
            { id: "other", label: "Other / decide later" },
          ].map((o) => (
            <label
              key={o.id}
              className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
              <RadioGroupItem value={o.id} />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {sourceType !== "mock" && (
        <div className="space-y-2">
          <Label htmlFor="baseUrl">Base URL (optional)</Label>
          <Input
            id="baseUrl"
            placeholder="https://api.example.com"
            {...register("baseUrl")}
          />
          {errors.baseUrl && (
            <p className="text-sm text-red-500">{errors.baseUrl.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Authentication</Label>
        <RadioGroup
          value={authType}
          onValueChange={(v) =>
            setValue("authType", v as DataSourceData["authType"], {
              shouldValidate: true,
            })
          }
          className="grid grid-cols-2 gap-2">
          {[
            { id: "none", label: "None" },
            { id: "bearer", label: "Bearer token" },
            { id: "apiKey", label: "API key" },
            { id: "cookie", label: "Session cookie" },
          ].map((o) => (
            <label
              key={o.id}
              className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
              <RadioGroupItem value={o.id} />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </form>
  );
});

DataSourceStep.displayName = "DataSourceStep";
