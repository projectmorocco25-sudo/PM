"use client";

/**
 * Wireframe: task-0.5.2.10-sku-create-edit-form.md
 * Routes: /rmm/skus/new, /rmm/skus/[id]/edit
 * Implements: SKU create/edit — Product, SKU Code, Name, Pharmaceutical Attributes (Dosage Strength, Form, Pack Size, UoM), ATC (read-only), MOH Authorized, Status, draft auto-save, validation, SKU name preview.
 * Task: 1.1.2.25
 * API: rmm_create_sku, rmm_update_sku, rmm_list_products (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops", "Spray", "Suppository"] as const;
const UNITS_OF_MEASURE = ["tablets", "ml", "capsules", "vials", "boxes", "units", "grams", "mg"] as const;

const DRAFT_KEY_NEW = "sku_form_draft_new";
const DRAFT_DEBOUNCE_MS = 2000;
const AUTOSAVE_INTERVAL_MS = 30000;

export type SkuFormInitial = {
  id: string;
  product_id: string;
  product_name: string;
  sku_code: string;
  name: string;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  atc_code: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type SkuFormContentProps = {
  mode: "create" | "edit";
  skuId?: string;
  initial?: SkuFormInitial | null;
  products: { id: string; name: string }[];
};

type FormState = {
  product_id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function defaultFormState(initial?: SkuFormInitial | null): FormState {
  if (!initial) {
    return {
      product_id: "",
      sku_code: "",
      name: "",
      dosage_strength: "",
      dosage_form: "",
      pack_size: "",
      unit_of_measure: "",
      is_moh_authorized_unregistered: false,
      is_active: true,
    };
  }
  return {
    product_id: initial.product_id ?? "",
    sku_code: initial.sku_code ?? "",
    name: initial.name ?? "",
    dosage_strength: initial.dosage_strength ?? "",
    dosage_form: initial.dosage_form ?? "",
    pack_size: initial.pack_size ?? "",
    unit_of_measure: initial.unit_of_measure ?? "",
    is_moh_authorized_unregistered: initial.is_moh_authorized_unregistered ?? false,
    is_active: initial.is_active ?? true,
  };
}

function validate(state: FormState, mode: "create" | "edit"): FieldErrors {
  const e: FieldErrors = {};
  if (mode === "create" && !state.product_id.trim()) e.product_id = "Product is required";
  const code = state.sku_code.trim();
  if (!code) e.sku_code = "SKU code is required";
  else if (code.length > 50) e.sku_code = "SKU code must not exceed 50 characters";
  const name = state.name.trim();
  if (!name) e.name = "SKU name is required";
  else if (name.length < 5 || name.length > 200) e.name = "SKU name must be between 5 and 200 characters";
  if (!state.dosage_strength.trim()) e.dosage_strength = "Dosage strength is required";
  if (!state.dosage_form) e.dosage_form = "Dosage form is required";
  if (!state.pack_size.trim()) e.pack_size = "Pack size is required";
  if (!state.unit_of_measure) e.unit_of_measure = "Unit of measure is required";
  return e;
}

function loadDraft(key: string): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(key);
    if (!s) return null;
    const j = JSON.parse(s) as FormState;
    return {
      product_id: j.product_id ?? "",
      sku_code: j.sku_code ?? "",
      name: j.name ?? "",
      dosage_strength: j.dosage_strength ?? "",
      dosage_form: j.dosage_form ?? "",
      pack_size: j.pack_size ?? "",
      unit_of_measure: j.unit_of_measure ?? "",
      is_moh_authorized_unregistered: j.is_moh_authorized_unregistered ?? false,
      is_active: j.is_active ?? true,
    };
  } catch {
    return null;
  }
}

function saveDraft(key: string, state: FormState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function buildSkuNamePreview(
  productName: string,
  dosageStrength: string,
  dosageForm: string,
  packSize: string
): string {
  const parts = [productName, dosageStrength, dosageForm, packSize].filter(Boolean);
  return parts.join(" ") || "";
}

export function SkuFormContent({
  mode,
  skuId,
  initial,
  products,
}: SkuFormContentProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => {
    const draft = mode === "create" ? loadDraft(DRAFT_KEY_NEW) : skuId ? loadDraft(`sku_form_draft_${skuId}`) : null;
    return draft ?? defaultFormState(initial);
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();
  const draftKey = mode === "create" ? DRAFT_KEY_NEW : skuId ? `sku_form_draft_${skuId}` : null;

  const productName = useMemo(
    () => (mode === "edit" && initial?.product_name) || products.find((p) => p.id === form.product_id)?.name || "",
    [mode, initial?.product_name, products, form.product_id]
  );

  const skuNamePreview = useMemo(
    () => buildSkuNamePreview(form.dosage_strength, form.dosage_form, form.pack_size)
      ? [productName, form.dosage_strength, form.dosage_form, form.pack_size].filter(Boolean).join(" ")
      : "",
    [productName, form.dosage_strength, form.dosage_form, form.pack_size]
  );

  const isDirty = useCallback(() => {
    const base = defaultFormState(initial);
    return (
      form.product_id !== base.product_id ||
      form.sku_code !== base.sku_code ||
      form.name !== base.name ||
      form.dosage_strength !== base.dosage_strength ||
      form.dosage_form !== base.dosage_form ||
      form.pack_size !== base.pack_size ||
      form.unit_of_measure !== base.unit_of_measure ||
      form.is_moh_authorized_unregistered !== base.is_moh_authorized_unregistered ||
      form.is_active !== base.is_active
    );
  }, [form, initial]);

  const performSave = useCallback(async () => {
    if (mode === "create") {
      saveDraft(DRAFT_KEY_NEW, form);
      setDraftSavedAt(new Date());
      return;
    }
    if (!skuId) return;
    setSaving(true);
    setSubmitError(null);
    const { data, error } = await supabase.rpc("rmm_update_sku", {
      p_id: skuId,
      p_sku_code: form.sku_code.trim() || null,
      p_name: form.name.trim() || null,
      p_dosage_strength: form.dosage_strength.trim() || null,
      p_dosage_form: form.dosage_form || null,
      p_pack_size: form.pack_size.trim() || null,
      p_unit_of_measure: form.unit_of_measure || null,
      p_atc_code_id: null,
      p_is_moh_authorized_unregistered: form.is_moh_authorized_unregistered,
      p_is_active: form.is_active,
    });
    setSaving(false);
    const payload = data as { sku?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      const msg = (payload?.message as string) || error?.message || "Save failed";
      setSubmitError(msg);
      return;
    }
    setDraftSavedAt(new Date());
    if (draftKey) saveDraft(draftKey, form);
    setSubmitError(null);
  }, [mode, skuId, form, supabase, draftKey]);

  useEffect(() => {
    if (!isDirty() || !draftKey) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (mode === "create") {
        saveDraft(draftKey, form);
        setDraftSavedAt(new Date());
      } else {
        performSave();
      }
      debounceRef.current = null;
    }, DRAFT_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, isDirty, draftKey, mode, performSave]);

  useEffect(() => {
    if (mode !== "edit" || !isDirty()) return;
    const id = setInterval(performSave, AUTOSAVE_INTERVAL_MS);
    autosaveRef.current = id;
    return () => {
      if (autosaveRef.current) clearInterval(autosaveRef.current);
    };
  }, [mode, isDirty, performSave]);

  useEffect(() => {
    if (mode === "create" && form.product_id && productName && !form.name.trim() && skuNamePreview) {
      setForm((f) => ({ ...f, name: skuNamePreview }));
    }
  }, [mode, form.product_id, form.name, productName, skuNamePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, mode);
    setErrors(errs);
    setTouched({
      product_id: true,
      sku_code: true,
      name: true,
      dosage_strength: true,
      dosage_form: true,
      pack_size: true,
      unit_of_measure: true,
    });
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    if (mode === "create") {
      const { data, error } = await supabase.rpc("rmm_create_sku", {
        p_product_id: form.product_id,
        p_sku_code: form.sku_code.trim(),
        p_name: form.name.trim(),
        p_dosage_strength: form.dosage_strength.trim(),
        p_dosage_form: form.dosage_form,
        p_pack_size: form.pack_size.trim(),
        p_unit_of_measure: form.unit_of_measure,
        p_atc_code_id: null,
        p_is_moh_authorized_unregistered: form.is_moh_authorized_unregistered,
      });
      setSubmitting(false);
      const payload = data as { sku?: { id?: string }; error?: string; message?: string } | null;
      if (error || payload?.error) {
        setSubmitError((payload?.message as string) || error?.message || "Create failed");
        return;
      }
      clearDraft(DRAFT_KEY_NEW);
      const id = payload?.sku?.id;
      if (id) router.replace(`/rmm/skus/${id}`);
      else router.replace("/rmm/skus");
      return;
    }
    if (!skuId) return;
    const { data, error } = await supabase.rpc("rmm_update_sku", {
      p_id: skuId,
      p_sku_code: form.sku_code.trim() || null,
      p_name: form.name.trim() || null,
      p_dosage_strength: form.dosage_strength.trim() || null,
      p_dosage_form: form.dosage_form || null,
      p_pack_size: form.pack_size.trim() || null,
      p_unit_of_measure: form.unit_of_measure || null,
      p_atc_code_id: null,
      p_is_moh_authorized_unregistered: form.is_moh_authorized_unregistered,
      p_is_active: form.is_active,
    });
    setSubmitting(false);
    const payload = data as { sku?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      setSubmitError((payload?.message as string) || error?.message || "Update failed");
      return;
    }
    if (draftKey) clearDraft(draftKey);
    router.replace(`/rmm/skus/${skuId}`);
  };

  const runValidation = useCallback(() => {
    setErrors(validate(form, mode));
  }, [form, mode]);

  const valid = Object.keys(validate(form, mode)).length === 0;
  const canSubmit = valid && (mode === "edit" ? isDirty() : true);

  const productReadOnly = mode === "edit" || products.length <= 1;

  function formField(
    name: keyof FormState,
    label: string,
    required: boolean,
    render: () => React.ReactNode
  ) {
    const err = touched[name] ? errors[name] : undefined;
    return (
      <div className="space-y-1">
        <label htmlFor={String(name)} className="block text-sm font-medium text-[#6b7280]">
          {label}
          {required && <span className="text-[#ef4444]"> *</span>}
        </label>
        {render()}
        {err && (
          <p className="text-xs text-[#ef4444]" role="alert">
            {err}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/skus" className="text-[#2563eb] hover:underline">SKUs</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">{mode === "create" ? "New SKU" : "Edit SKU"}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
          {mode === "create" ? "Create SKU" : "Edit SKU"}
        </h1>
        <div className="flex gap-2">
          <Link
            href={mode === "create" ? "/rmm/skus" : `/rmm/skus/${skuId}`}
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={async () => {
              runValidation();
              const errs = validate(form, mode);
              if (Object.keys(errs).length > 0) {
                setErrors(errs);
                setTouched({
                  product_id: true,
                  sku_code: true,
                  name: true,
                  dosage_strength: true,
                  dosage_form: true,
                  pack_size: true,
                  unit_of_measure: true,
                });
                return;
              }
              await performSave();
            }}
            disabled={saving}
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            type="submit"
            form="sku-form"
            disabled={!canSubmit || submitting}
            className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
          >
            {submitting ? "Saving…" : mode === "create" ? "Create SKU" : "Update SKU"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]" role="alert">
          {submitError}
        </div>
      )}

      <form id="sku-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">SKU Basic Information</h2>
          <div className="space-y-4">
            {formField("product_id", "Product", true, () =>
              productReadOnly ? (
                <p className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#111827]">
                  {productName || "—"}
                </p>
              ) : (
                <select
                  id="product_id"
                  value={form.product_id}
                  onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, product_id: true }));
                    runValidation();
                  }}
                  className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )
            )}
            {formField("sku_code", "SKU Code", true, () => (
              <input
                id="sku_code"
                name="sku_code"
                value={form.sku_code}
                onChange={(e) => setForm((f) => ({ ...f, sku_code: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, sku_code: true }));
                  runValidation();
                }}
                placeholder="Enter SKU code..."
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <p className="text-xs text-[#6b7280]">Company&apos;s internal SKU code/identifier</p>
            {formField("name", "SKU Name", true, () => (
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, name: true }));
                  runValidation();
                }}
                placeholder="Enter SKU name or auto-generated from attributes below"
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <p className="text-xs text-[#6b7280]">Full SKU name. Auto-generated from pharmaceutical attributes below if left empty.</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-[#f0fdf4] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Pharmaceutical Attributes <span className="text-[#ef4444]">*</span></h2>
          <div className="space-y-4">
            {formField("dosage_strength", "Dosage Strength", true, () => (
              <input
                id="dosage_strength"
                name="dosage_strength"
                value={form.dosage_strength}
                onChange={(e) => setForm((f) => ({ ...f, dosage_strength: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, dosage_strength: true }));
                  runValidation();
                }}
                placeholder="e.g. 500mg, 10mg/ml, 250mg/5ml"
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <p className="text-xs text-[#6b7280]">Enter dosage/strength in pharmaceutical notation</p>
            {formField("dosage_form", "Dosage Form", true, () => (
              <select
                id="dosage_form"
                value={form.dosage_form}
                onChange={(e) => setForm((f) => ({ ...f, dosage_form: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, dosage_form: true }));
                  runValidation();
                }}
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              >
                <option value="">Select form...</option>
                {DOSAGE_FORMS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            ))}
            {formField("pack_size", "Pack Size", true, () => (
              <input
                id="pack_size"
                name="pack_size"
                value={form.pack_size}
                onChange={(e) => setForm((f) => ({ ...f, pack_size: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, pack_size: true }));
                  runValidation();
                }}
                placeholder="e.g. 30 tablets, 100ml bottle"
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <p className="text-xs text-[#6b7280]">Enter pack size with quantity and description</p>
            {formField("unit_of_measure", "Unit of Measure", true, () => (
              <select
                id="unit_of_measure"
                value={form.unit_of_measure}
                onChange={(e) => setForm((f) => ({ ...f, unit_of_measure: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, unit_of_measure: true }));
                  runValidation();
                }}
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              >
                <option value="">Select unit...</option>
                {UNITS_OF_MEASURE.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ))}
            <p className="text-xs text-[#6b7280]">Used in submissions (AAMS, MSQ, WSL).</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <h3 className="text-sm font-semibold text-[#111827]">Preview: SKU Name (Auto-Generated)</h3>
          <p className="mt-2 font-medium text-[#111827]">{skuNamePreview || "—"}</p>
          <p className="mt-1 text-xs text-[#6b7280]">Updates as you enter pharmaceutical attributes. You can manually edit the SKU name above.</p>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6b7280]">ATC Code</label>
              <p className="mt-0.5 text-sm text-[#111827]">
                {mode === "edit" && initial?.atc_code ? `Inherited from Product: ${initial.atc_code}` : "—"}
                {mode === "create" && "—"}
              </p>
            </div>
            <div>
              <p className="block text-sm font-medium text-[#6b7280]">MOH Authorized Unregistered</p>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="moh_authorized"
                    checked={form.is_moh_authorized_unregistered === true}
                    onChange={() => setForm((f) => ({ ...f, is_moh_authorized_unregistered: true }))}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="moh_authorized"
                    checked={form.is_moh_authorized_unregistered === false}
                    onChange={() => setForm((f) => ({ ...f, is_moh_authorized_unregistered: false }))}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  No
                </label>
              </div>
            </div>
            <div>
              <p className="block text-sm font-medium text-[#6b7280]">Status</p>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                />
                Active
              </label>
            </div>
          </div>
        </div>

        {mode === "edit" && initial?.created_at && (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
            <h3 className="text-sm font-semibold text-[#111827]">Metadata</h3>
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-[#6b7280]">Created</dt>
                <dd className="text-[#111827]">{initial.created_at ? new Date(initial.created_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#6b7280]">Last Updated</dt>
                <dd className="text-[#111827]">{initial.updated_at ? new Date(initial.updated_at).toLocaleString() : "—"}</dd>
              </div>
            </dl>
          </div>
        )}

        {draftSavedAt && (
          <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#2563eb]">
            Draft saved automatically — Last saved: {draftSavedAt.toLocaleTimeString()}
          </div>
        )}
      </form>
    </div>
  );
}
