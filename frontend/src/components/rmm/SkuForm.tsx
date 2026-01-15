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
import type { SkuUpsertInput } from "@/lib/supabase/queries";
import { DOSAGE_FORMS, DOSAGE_STRENGTH_REGEX, PACK_SIZE_REGEX, UNITS_OF_MEASURE } from "@/components/rmm/skuReferenceLists";

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const skuSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  sku_code: z.string().trim().min(1, "SKU code is required").max(50, "SKU code must not exceed 50 characters"),
  name: z.string().trim().min(5, "SKU name must be between 5 and 200 characters").max(200),
  dosage_strength: z
    .string()
    .trim()
    .min(1, "Dosage strength is required")
    .regex(DOSAGE_STRENGTH_REGEX, "Invalid dosage strength format (e.g., 500mg, 10mg/ml)"),
  dosage_form: z.enum(DOSAGE_FORMS, { message: "Dosage form is required" }),
  pack_size: z.string().trim().min(1, "Pack size is required").regex(PACK_SIZE_REGEX, "Invalid pack size format (e.g., 30 tablets, 100ml bottle)"),
  unit_of_measure: z.enum(UNITS_OF_MEASURE, { message: "Unit of measure is required" }),
  atc_code_id: z.string().optional().or(z.literal("")),
  is_moh_authorized_unregistered: z.boolean(),
  is_active: z.boolean(),
});

export type SkuFormValues = z.input<typeof skuSchema>;

function toInput(v: SkuFormValues): SkuUpsertInput {
  return {
    product_id: v.product_id,
    sku_code: v.sku_code.trim(),
    name: v.name.trim(),
    dosage_strength: v.dosage_strength.trim(),
    dosage_form: v.dosage_form,
    pack_size: v.pack_size.trim(),
    unit_of_measure: v.unit_of_measure,
    atc_code_id: v.atc_code_id?.trim() ? v.atc_code_id.trim() : null,
    is_moh_authorized_unregistered: v.is_moh_authorized_unregistered,
    is_active: v.is_active,
  };
}

export function SkuForm({
  mode,
  skuId,
  defaultValues,
  products,
  atcCodes,
  enforceProductId,
  inheritedAtcLabel,
  showMohAuthorizedFlag,
  onSubmit,
  title,
  metadata,
}: {
  mode: "create" | "edit";
  skuId?: string;
  defaultValues?: Partial<SkuFormValues>;
  products: Array<{ id: string; name: string }>;
  atcCodes: Array<{ id: string; code: string; description: string | null; is_active: boolean }>;
  enforceProductId?: string | null;
  inheritedAtcLabel?: string | null;
  showMohAuthorizedFlag?: boolean;
  onSubmit: (input: SkuUpsertInput) => Promise<{ id: string }>;
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
    const v: SkuFormValues = {
      product_id: defaultValues?.product_id ?? enforceProductId ?? "",
      sku_code: defaultValues?.sku_code ?? "",
      name: defaultValues?.name ?? "",
      dosage_strength: defaultValues?.dosage_strength ?? "",
      dosage_form: (defaultValues?.dosage_form as SkuFormValues["dosage_form"]) ?? "Tablet",
      pack_size: defaultValues?.pack_size ?? "",
      unit_of_measure: (defaultValues?.unit_of_measure as SkuFormValues["unit_of_measure"]) ?? "tablets",
      atc_code_id: defaultValues?.atc_code_id ?? "",
      is_moh_authorized_unregistered: defaultValues?.is_moh_authorized_unregistered ?? false,
      is_active: defaultValues?.is_active ?? true,
    };
    return v;
  }, [defaultValues, enforceProductId]);

  const form = useForm<SkuFormValues>({
    resolver: zodResolver(skuSchema),
    values,
    mode: "onBlur",
  });

  const productId = useWatch({ control: form.control, name: "product_id" });
  const dosageStrength = useWatch({ control: form.control, name: "dosage_strength" });
  const dosageForm = useWatch({ control: form.control, name: "dosage_form" });
  const packSize = useWatch({ control: form.control, name: "pack_size" });
  const skuName = useWatch({ control: form.control, name: "name" });
  const isActive = useWatch({ control: form.control, name: "is_active" });
  const mohFlag = useWatch({ control: form.control, name: "is_moh_authorized_unregistered" });
  const allValues = useWatch({ control: form.control });

  const productName = useMemo(() => products.find((p) => p.id === productId)?.name ?? "", [productId, products]);
  const previewName = useMemo(() => {
    const parts = [productName, dosageStrength, dosageForm, packSize].map((x) => (x ?? "").toString().trim()).filter(Boolean);
    return parts.join(" ").trim();
  }, [dosageForm, dosageStrength, packSize, productName]);

  // If user leaves SKU Name empty, auto-generate from attributes (debounced).
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);
  const nameGenTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!skuName.trim()) setNameManuallyEdited(false);
  }, [skuName]);
  useEffect(() => {
    if (nameManuallyEdited) return;
    if (!previewName) return;
    if (nameGenTimer.current) window.clearTimeout(nameGenTimer.current);
    nameGenTimer.current = window.setTimeout(() => {
      if (!form.getValues().name.trim()) {
        form.setValue("name", previewName, { shouldDirty: true, shouldValidate: true });
      }
    }, 500);
    return () => {
      if (nameGenTimer.current) window.clearTimeout(nameGenTimer.current);
    };
  }, [form, nameManuallyEdited, previewName]);

  const draftKey = useMemo(() => (mode === "edit" && skuId ? `sku_form_draft_${skuId}` : "sku_form_draft_new"), [mode, skuId]);
  const lastSavedRef = useRef<number | null>(null);
  const lastSavedHashRef = useRef<string | null>(null);

  function saveDraftLocal(nextValues: SkuFormValues, source: "manual" | "auto") {
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
      const parsed = JSON.parse(raw) as { ts?: number; values?: Partial<SkuFormValues> } | null;
      if (!parsed?.ts || !parsed.values) return;
      if (Date.now() - parsed.ts > DRAFT_TTL_MS) {
        localStorage.removeItem(draftKey);
        return;
      }
      const shouldRestore = window.confirm("Draft found. Restore draft?");
      if (!shouldRestore) return;
      form.reset({ ...form.getValues(), ...parsed.values } as SkuFormValues, { keepDirty: false });
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

  async function submit(values: SkuFormValues) {
    setSubmitError(null);
    try {
      const res = await onSubmit(toInput(values));
      clearDraftLocal();
      notify.success(mode === "create" ? "SKU created" : "SKU updated");
      router.push(`/rmm/skus/${res.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save SKU");
      notify.error(err instanceof Error ? err.message : "Failed to save SKU");
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
          if (first) form.setFocus(first as keyof SkuFormValues);
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
            <CardTitle>SKU Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Product" required error={form.formState.errors.product_id?.message}>
              {mode === "edit" || enforceProductId ? (
                <Input value={products.find((p) => p.id === form.getValues().product_id)?.name ?? ""} disabled />
              ) : (
                <select
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={form.watch("product_id")}
                  onChange={(e) => form.setValue("product_id", e.target.value, { shouldDirty: true, shouldValidate: true })}
                >
                  <option value="">Select product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="SKU Code" required htmlFor="sku_code" helperText="Company's internal SKU code/identifier" error={form.formState.errors.sku_code?.message}>
              <Input id="sku_code" placeholder="Enter SKU code..." {...form.register("sku_code")} />
            </FormField>

            <FormField
              label="SKU Name"
              required
              htmlFor="name"
              helperText="Full SKU name. This will be auto-generated from pharmaceutical attributes below if left empty."
              error={form.formState.errors.name?.message}
            >
              <Input
                id="name"
                placeholder='Auto-generated from attributes below if left empty (e.g., "Paracetamol 500mg Tablet 30 tablets")'
                {...form.register("name")}
                onChange={(e) => {
                  form.register("name").onChange(e);
                  if (e.target.value.trim().length > 0) setNameManuallyEdited(true);
                }}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pharmaceutical Attributes *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
              Pharmaceutical attributes are critical for regulatory submissions (AAMS, MSQ, WSL). Submissions reference SKU_ID + Quantity.
            </div>

            <FormField
              label="Dosage Strength"
              required
              htmlFor="dosage_strength"
              helperText="Examples: 500mg, 10mg/ml, 250mg/5ml"
              error={form.formState.errors.dosage_strength?.message}
            >
              <Input id="dosage_strength" placeholder="Enter dosage strength (e.g., 500mg)..." {...form.register("dosage_strength")} />
            </FormField>

            <FormField label="Dosage Form" required error={form.formState.errors.dosage_form?.message}>
              <select
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={form.watch("dosage_form")}
                onChange={(e) => form.setValue("dosage_form", e.target.value as SkuFormValues["dosage_form"], { shouldDirty: true, shouldValidate: true })}
              >
                {DOSAGE_FORMS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Pack Size"
              required
              htmlFor="pack_size"
              helperText="Examples: 30 tablets, 100ml bottle, 50 capsules"
              error={form.formState.errors.pack_size?.message}
            >
              <Input id="pack_size" placeholder="Enter pack size (e.g., 30 tablets)..." {...form.register("pack_size")} />
            </FormField>

            <FormField label="Unit of Measure" required error={form.formState.errors.unit_of_measure?.message} helperText="Used in submissions (AAMS, MSQ, WSL) for quantity entry.">
              <select
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={form.watch("unit_of_measure")}
                onChange={(e) =>
                  form.setValue("unit_of_measure", e.target.value as SkuFormValues["unit_of_measure"], { shouldDirty: true, shouldValidate: true })
                }
              >
                {UNITS_OF_MEASURE.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="ATC Code" helperText="Inherited from Product (if set). You may override for this SKU if needed.">
              <select
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={form.watch("atc_code_id")}
                onChange={(e) => form.setValue("atc_code_id", e.target.value, { shouldDirty: true })}
              >
                <option value="">{inheritedAtcLabel ? `Inherited from Product: ${inheritedAtcLabel}` : "No ATC code assigned to product"}</option>
                {atcOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.description ?? ""}
                  </option>
                ))}
              </select>
            </FormField>

            {showMohAuthorizedFlag ? (
              <FormField label="MOH Authorized Unregistered" helperText="MOH authorized unregistered flag is for MOH Tier 1 only. Indicates regulatory exception status.">
                <Checkbox
                  checked={Boolean(mohFlag)}
                  onChange={(v) => form.setValue("is_moh_authorized_unregistered", v, { shouldDirty: true })}
                  label={<span>{mohFlag ? "Yes" : "No"}</span>}
                />
              </FormField>
            ) : null}

            <FormField label="Status">
              <Checkbox checked={Boolean(isActive)} onChange={(v) => form.setValue("is_active", v, { shouldDirty: true })} label={<span>{isActive ? "Active" : "Inactive"}</span>} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview: SKU Name (Auto-Generated)</CardTitle>
          </CardHeader>
          <CardContent className="bg-zinc-50 text-sm text-zinc-800">
            <div className="font-mono">{previewName || "—"}</div>
            <div className="mt-2 text-xs text-zinc-600">
              This preview updates as you enter pharmaceutical attributes. You can manually edit the SKU name.
            </div>
          </CardContent>
        </Card>

        {mode === "edit" && (metadata?.createdAt || metadata?.updatedAt) ? (
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 bg-zinc-50">
              {metadata?.createdAt ? (
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Created At:</span> {new Date(metadata.createdAt).toLocaleString()}
                </div>
              ) : null}
              {metadata?.updatedAt ? (
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Last Updated:</span> {new Date(metadata.updatedAt).toLocaleString()}
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
            {mode === "create" ? "Create SKU" : "Update SKU"}
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

