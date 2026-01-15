"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/forms/FormField";
import { Checkbox } from "@/components/forms/Checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/lib/toast";
import type { ProductUpsertInput } from "@/lib/supabase/queries";

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const productSchema = z.object({
  company_id: z.string().min(1, "Company is required"),
  name: z.string().trim().min(2, "Product name must be between 2 and 200 characters").max(200),
  atc_code_id: z.string().min(1, "ATC code is required"),
  description: z.string().trim().max(1000, "Description must not exceed 1000 characters").optional().or(z.literal("")),
  is_active: z.boolean(),
  is_critical_medicine: z.boolean(),
});

export type ProductFormValues = z.input<typeof productSchema>;

function toInput(values: ProductFormValues): ProductUpsertInput {
  return {
    company_id: values.company_id,
    name: values.name.trim(),
    atc_code_id: values.atc_code_id,
    description: values.description?.trim() ? values.description.trim() : null,
    is_active: values.is_active,
    is_critical_medicine: values.is_critical_medicine,
  };
}

export function ProductForm({
  mode,
  productId,
  defaultValues,
  companies,
  atcCodes,
  enforceCompanyId,
  showCriticalMedicine,
  onSubmit,
  title,
  metadata,
}: {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  companies: Array<{ id: string; name: string }>;
  atcCodes: Array<{ id: string; code: string; description: string | null; is_active: boolean }>;
  enforceCompanyId?: string | null;
  showCriticalMedicine?: boolean;
  onSubmit: (input: ProductUpsertInput) => Promise<{ id: string }>;
  title: string;
  metadata?: { createdAt?: string; updatedAt?: string };
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [draftStatus, setDraftStatus] = useState<
    | { state: "idle" }
    | { state: "saving" }
    | { state: "saved"; lastSavedAt: number }
    | { state: "error"; message: string }
  >({ state: "idle" });

  const values = useMemo(() => {
    const v: ProductFormValues = {
      company_id: defaultValues?.company_id ?? enforceCompanyId ?? "",
      name: defaultValues?.name ?? "",
      atc_code_id: defaultValues?.atc_code_id ?? "",
      description: defaultValues?.description ?? "",
      is_active: defaultValues?.is_active ?? true,
      is_critical_medicine: defaultValues?.is_critical_medicine ?? false,
    };
    return v;
  }, [defaultValues, enforceCompanyId]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    values,
    mode: "onBlur",
  });

  const isActive = useWatch({ control: form.control, name: "is_active" });
  const isCritical = useWatch({ control: form.control, name: "is_critical_medicine" });
  const allValues = useWatch({ control: form.control });

  const draftKey = useMemo(() => {
    return mode === "edit" && productId ? `product_form_draft_${productId}` : "product_form_draft_new";
  }, [mode, productId]);

  const lastSavedRef = useRef<number | null>(null);
  const lastSavedHashRef = useRef<string | null>(null);

  function saveDraftLocal(nextValues: ProductFormValues, source: "manual" | "auto") {
    try {
      setDraftStatus({ state: "saving" });
      const payload = { ts: Date.now(), values: nextValues, source };
      const hash = JSON.stringify(payload.values);
      localStorage.setItem(draftKey, JSON.stringify(payload));
      lastSavedRef.current = payload.ts;
      lastSavedHashRef.current = hash;
      setDraftStatus({ state: "saved", lastSavedAt: payload.ts });
    } catch (e) {
      setDraftStatus({ state: "error", message: e instanceof Error ? e.message : "Failed to save draft" });
    }
  }

  function clearDraftLocal() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { ts?: number; values?: Partial<ProductFormValues> } | null;
      if (!parsed?.ts || !parsed.values) return;
      if (Date.now() - parsed.ts > DRAFT_TTL_MS) {
        localStorage.removeItem(draftKey);
        return;
      }
      const shouldRestore = window.confirm("Draft found. Restore draft?");
      if (!shouldRestore) return;
      form.reset(
        {
          ...form.getValues(),
          ...parsed.values,
        } as ProductFormValues,
        { keepDirty: false },
      );
      setDraftStatus({ state: "saved", lastSavedAt: parsed.ts });
      lastSavedRef.current = parsed.ts;
      lastSavedHashRef.current = JSON.stringify(parsed.values);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    if (!form.formState.isDirty) return;
    const timer = window.setTimeout(() => {
      const current = form.getValues();
      const hash = JSON.stringify(current);
      if (hash === lastSavedHashRef.current) return;
      saveDraftLocal(current, "auto");
    }, 2000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValues, form.formState.isDirty, draftKey]);

  useEffect(() => {
    if (!form.formState.isDirty) return;
    const interval = window.setInterval(() => {
      const last = lastSavedRef.current;
      if (last && Date.now() - last < 30_000) return;
      const current = form.getValues();
      const hash = JSON.stringify(current);
      if (hash === lastSavedHashRef.current) return;
      saveDraftLocal(current, "auto");
    }, 30_000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.isDirty, draftKey]);

  const companyOptions = useMemo(() => {
    return companies.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [companies]);

  const atcOptions = useMemo(() => {
    return (atcCodes ?? [])
      .filter((a) => a.is_active !== false)
      .slice()
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [atcCodes]);

  async function handleSaveDraft() {
    saveDraftLocal(form.getValues(), "manual");
    notify.success("Draft saved");
  }

  async function submit(values: ProductFormValues) {
    setSubmitError(null);
    try {
      const res = await onSubmit(toInput(values));
      clearDraftLocal();
      notify.success(mode === "create" ? "Product created" : "Product updated");
      router.push(`/rmm/products/${res.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save product");
      notify.error(err instanceof Error ? err.message : "Failed to save product");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[800px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (form.formState.isDirty) {
                const ok = window.confirm("You have unsaved changes. Are you sure you want to leave?");
                if (!ok) return;
              }
              router.back();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(submit, (errs) => {
          setSubmitError("Please correct the highlighted fields.");
          const first = Object.keys(errs)[0];
          if (first) form.setFocus(first as keyof ProductFormValues);
        })}
      >
        {submitError || Object.keys(form.formState.errors).length > 0 ? (
          <Alert variant="destructive">
            <AlertTitle>{submitError ?? "Please correct the following errors:"}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-5">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>
                    {typeof (error as { message?: unknown })?.message === "string"
                      ? ((error as { message?: unknown }).message as string)
                      : `Invalid ${field}`}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Company" required error={form.formState.errors.company_id?.message}>
              {mode === "edit" || enforceCompanyId ? (
                <Input value={companyOptions.find((c) => c.id === form.getValues().company_id)?.name ?? ""} disabled />
              ) : (
                <select
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={form.watch("company_id")}
                  onChange={(e) => form.setValue("company_id", e.target.value, { shouldDirty: true, shouldValidate: true })}
                >
                  <option value="">Select company…</option>
                  {companyOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Product Name" required htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" placeholder="Enter product name..." {...form.register("name")} />
            </FormField>

            <FormField
              label="ATC Code"
              required
              error={form.formState.errors.atc_code_id?.message}
              helperText="ATC codes are MOH-controlled and read-only. Select the appropriate ATC code for classification."
            >
              <select
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={form.watch("atc_code_id")}
                onChange={(e) => form.setValue("atc_code_id", e.target.value, { shouldDirty: true, shouldValidate: true })}
              >
                <option value="">Select ATC Code…</option>
                {atcOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.description ?? ""}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Description" htmlFor="description" error={form.formState.errors.description?.message}>
              <textarea
                id="description"
                rows={4}
                className={[
                  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900",
                  "placeholder:text-zinc-400",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
                placeholder="Enter product description..."
                {...form.register("description")}
              />
            </FormField>

            <FormField label="Status">
              <Checkbox
                checked={Boolean(isActive)}
                onChange={(v) => form.setValue("is_active", v, { shouldDirty: true })}
                label={<span>{isActive ? "Active" : "Inactive"}</span>}
              />
            </FormField>
          </CardContent>
        </Card>

        {showCriticalMedicine ? (
          <Card>
            <CardHeader>
              <CardTitle>Critical Medicine Designation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Critical Medicine" helperText="Critical medicine designation is for MOH Tier 1 only. This designation affects compliance monitoring.">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="radio"
                      checked={Boolean(isCritical) === true}
                      onChange={() => form.setValue("is_critical_medicine", true, { shouldDirty: true })}
                    />
                    Yes - This product is designated as a critical medicine
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="radio"
                      checked={Boolean(isCritical) === false}
                      onChange={() => form.setValue("is_critical_medicine", false, { shouldDirty: true })}
                    />
                    No - This product is not a critical medicine
                  </label>
                </div>
              </FormField>
            </CardContent>
          </Card>
        ) : null}

        {mode === "edit" && (metadata?.createdAt || metadata?.updatedAt) ? (
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 bg-zinc-50">
              {metadata?.createdAt ? (
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Created At:</span>{" "}
                  {new Date(metadata.createdAt).toLocaleString()}
                </div>
              ) : null}
              {metadata?.updatedAt ? (
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Last Updated:</span>{" "}
                  {new Date(metadata.updatedAt).toLocaleString()}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="submit" disabled={!form.formState.isValid}>
            {mode === "create" ? "Create Product" : "Update Product"}
          </Button>
        </div>

        {draftStatus.state === "saved" ? (
          <Alert variant="info">
            <AlertTitle>Draft saved automatically</AlertTitle>
            <AlertDescription>Last saved: {new Date(draftStatus.lastSavedAt).toLocaleString()}</AlertDescription>
          </Alert>
        ) : draftStatus.state === "saving" ? (
          <Alert variant="info">
            <AlertTitle>Saving draft…</AlertTitle>
            <AlertDescription>Saving your changes.</AlertDescription>
          </Alert>
        ) : draftStatus.state === "error" ? (
          <Alert variant="destructive">
            <AlertTitle>Draft auto-save failed</AlertTitle>
            <AlertDescription>{draftStatus.message}</AlertDescription>
          </Alert>
        ) : null}
      </form>
    </div>
  );
}

