"use client";

/**
 * Wireframe: task-0.5.2.9-product-create-edit-form.md
 * Routes: /rmm/products/new, /rmm/products/[id]/edit
 * Implements: Product create/edit — Company, Name, ATC Code, Description, Status, Critical Medicine, Metadata (edit), draft auto-save, validation.
 * Task: 1.1.2.22
 * API: rmm_create_product, rmm_update_product, rmm_list_atc_codes (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DRAFT_KEY_NEW = "product_form_draft_new";
const DRAFT_DEBOUNCE_MS = 2000;
const AUTOSAVE_INTERVAL_MS = 30000;

export type ProductFormInitial = {
  id: string;
  company_id: string;
  company_name: string;
  name: string;
  description: string | null;
  atc_code_id: string | null;
  atc_code?: string | null;
  is_active: boolean;
  is_critical_medicine: boolean;
  created_at?: string;
  updated_at?: string;
};

type ProductFormContentProps = {
  mode: "create" | "edit";
  productId?: string;
  initial?: ProductFormInitial | null;
  companies: { id: string; name: string }[];
  atcCodes: { id: string; code: string; description?: string | null }[];
};

type FormState = {
  company_id: string;
  name: string;
  atc_code_id: string;
  description: string;
  is_active: boolean;
  is_critical_medicine: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function defaultFormState(initial?: ProductFormInitial | null): FormState {
  if (!initial) {
    return {
      company_id: "",
      name: "",
      atc_code_id: "",
      description: "",
      is_active: true,
      is_critical_medicine: false,
    };
  }
  return {
    company_id: initial.company_id ?? "",
    name: initial.name ?? "",
    atc_code_id: initial.atc_code_id ?? "",
    description: initial.description ?? "",
    is_active: initial.is_active ?? true,
    is_critical_medicine: initial.is_critical_medicine ?? false,
  };
}

function validate(state: FormState, mode: "create" | "edit"): FieldErrors {
  const e: FieldErrors = {};
  if (!state.company_id.trim()) e.company_id = "Company is required";
  const n = state.name.trim();
  if (!n) e.name = "Product name is required";
  else if (n.length < 2 || n.length > 200) e.name = "Product name must be between 2 and 200 characters";
  if (!state.atc_code_id) e.atc_code_id = "ATC code is required";
  if (state.description.length > 1000) e.description = "Description must not exceed 1000 characters";
  return e;
}

function loadDraft(key: string): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(key);
    if (!s) return null;
    const j = JSON.parse(s) as FormState;
    return {
      company_id: j.company_id ?? "",
      name: j.name ?? "",
      atc_code_id: j.atc_code_id ?? "",
      description: j.description ?? "",
      is_active: j.is_active ?? true,
      is_critical_medicine: j.is_critical_medicine ?? false,
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

function atcLabel(a: { code: string; description?: string | null }) {
  return a.description ? `${a.code} - ${a.description}` : a.code;
}

export function ProductFormContent({
  mode,
  productId,
  initial,
  companies,
  atcCodes,
}: ProductFormContentProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => {
    const draft = mode === "create" ? loadDraft(DRAFT_KEY_NEW) : productId ? loadDraft(`product_form_draft_${productId}`) : null;
    return draft ?? defaultFormState(initial);
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [atcSearch, setAtcSearch] = useState("");
  const [atcOpen, setAtcOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();
  const draftKey = mode === "create" ? DRAFT_KEY_NEW : productId ? `product_form_draft_${productId}` : null;

  const isDirty = useCallback(() => {
    const base = defaultFormState(initial);
    return (
      form.company_id !== base.company_id ||
      form.name !== base.name ||
      form.atc_code_id !== base.atc_code_id ||
      form.description !== base.description ||
      form.is_active !== base.is_active ||
      form.is_critical_medicine !== base.is_critical_medicine
    );
  }, [form, initial]);

  const filteredAtc = useMemo(() => {
    const q = atcSearch.trim().toLowerCase();
    if (!q) return atcCodes;
    return atcCodes.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }, [atcCodes, atcSearch]);

  const selectedAtc = useMemo(
    () => atcCodes.find((a) => a.id === form.atc_code_id),
    [atcCodes, form.atc_code_id]
  );

  const performSave = useCallback(async () => {
    if (mode === "create") {
      saveDraft(DRAFT_KEY_NEW, form);
      setDraftSavedAt(new Date());
      return;
    }
    if (!productId) return;
    setSaving(true);
    setSubmitError(null);
    const { data, error } = await supabase.rpc("rmm_update_product", {
      p_id: productId,
      p_name: form.name.trim() || null,
      p_description: form.description.trim() || null,
      p_is_critical_medicine: form.is_critical_medicine,
      p_is_active: form.is_active,
      p_atc_code_id: form.atc_code_id || null,
    });
    setSaving(false);
    const payload = data as { product?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      const msg = (payload?.message as string) || error?.message || "Save failed";
      setSubmitError(msg);
      return;
    }
    setDraftSavedAt(new Date());
    if (draftKey) saveDraft(draftKey, form);
    setSubmitError(null);
  }, [mode, productId, form, supabase, draftKey]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, mode);
    setErrors(errs);
    setTouched({
      company_id: true,
      name: true,
      atc_code_id: true,
      description: true,
    });
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    if (mode === "create") {
      const { data, error } = await supabase.rpc("rmm_create_product", {
        p_company_id: form.company_id,
        p_name: form.name.trim(),
        p_description: form.description.trim() || null,
        p_is_critical_medicine: form.is_critical_medicine,
        p_atc_code_id: form.atc_code_id || null,
      });
      setSubmitting(false);
      const payload = data as { product?: { id?: string }; error?: string; message?: string } | null;
      if (error || payload?.error) {
        setSubmitError((payload?.message as string) || error?.message || "Create failed");
        return;
      }
      clearDraft(DRAFT_KEY_NEW);
      const id = payload?.product?.id;
      if (id) router.replace(`/rmm/products/${id}`);
      else router.replace("/rmm/products");
      return;
    }
    if (!productId) return;
    const { data, error } = await supabase.rpc("rmm_update_product", {
      p_id: productId,
      p_name: form.name.trim() || null,
      p_description: form.description.trim() || null,
      p_is_critical_medicine: form.is_critical_medicine,
      p_is_active: form.is_active,
      p_atc_code_id: form.atc_code_id || null,
    });
    setSubmitting(false);
    const payload = data as { product?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      setSubmitError((payload?.message as string) || error?.message || "Update failed");
      return;
    }
    if (draftKey) clearDraft(draftKey);
    router.replace(`/rmm/products/${productId}`);
  };

  const runValidation = useCallback(() => {
    setErrors(validate(form, mode));
  }, [form, mode]);

  const valid = Object.keys(validate(form, mode)).length === 0;
  const canSubmit = valid && (mode === "edit" ? isDirty() : true);

  const companySingle = companies.length === 1;
  const companyReadOnly = mode === "edit" || companySingle;

  function formField(
    name: keyof FormState,
    label: string,
    required: boolean,
    render: () => React.ReactNode
  ) {
    const err = touched[name] ? errors[name] : undefined;
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-[#6b7280]">
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
        <Link href="/rmm/products" className="text-[#2563eb] hover:underline">Products</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">{mode === "create" ? "New Product" : "Edit Product"}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h1>
        <div className="flex gap-2">
          <Link
            href={mode === "create" ? "/rmm/products" : `/rmm/products/${productId}`}
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
                setTouched({ company_id: true, name: true, atc_code_id: true, description: true });
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
            form="product-form"
            disabled={!canSubmit || submitting}
            className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
          >
            {submitting ? "Saving…" : mode === "create" ? "Create Product" : "Update Product"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]" role="alert">
          {submitError}
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Product Information</h2>
          <div className="space-y-4">
            {formField("company_id", "Company", true, () =>
              companyReadOnly ? (
                <p className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#111827]">
                  {(mode === "edit" && initial?.company_name) || companies.find((c) => c.id === form.company_id)?.name ?? form.company_id || "—"}
                </p>
              ) : (
                <select
                  id="company_id"
                  value={form.company_id}
                  onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, company_id: true }));
                    runValidation();
                  }}
                  className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">Select company...</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )
            )}
            {formField("name", "Product Name", true, () => (
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, name: true }));
                  runValidation();
                }}
                placeholder="Enter product name..."
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            {formField("atc_code_id", "ATC Code", true, () => (
              <div className="space-y-1">
                <input
                  id="atc_code_id"
                  type="text"
                  value={atcOpen ? atcSearch : selectedAtc ? atcLabel(selectedAtc) : ""}
                  onChange={(e) => {
                    setAtcSearch(e.target.value);
                    setAtcOpen(true);
                  }}
                  onFocus={() => {
                    setAtcOpen(true);
                    setAtcSearch("");
                  }}
                  onBlur={() => setTimeout(() => setAtcOpen(false), 200)}
                  placeholder="Select ATC Code..."
                  className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                  aria-describedby="atc-helper"
                />
                {atcOpen && (
                  <ul
                    className="max-h-48 overflow-auto rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg"
                    role="listbox"
                  >
                    {filteredAtc.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-[#6b7280]">No ATC codes found</li>
                    ) : (
                      filteredAtc.map((a) => (
                        <li
                          key={a.id}
                          role="option"
                          aria-selected={form.atc_code_id === a.id}
                          className="cursor-pointer px-3 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const next = { ...form, atc_code_id: a.id };
                            setForm(next);
                            setAtcSearch("");
                            setAtcOpen(false);
                            setTouched((t) => ({ ...t, atc_code_id: true }));
                            setErrors(validate(next, mode));
                          }}
                        >
                          {atcLabel(a)}
                        </li>
                      ))
                    )}
                  </ul>
                )}
                <p id="atc-helper" className="text-xs text-[#6b7280]">
                  ATC codes are MOH-controlled and read-only. Select the appropriate ATC code for classification.
                </p>
              </div>
            ))}
            {formField("description", "Description", false, () => (
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                onBlur={() => {
                  setTouched((t) => ({ ...t, description: true }));
                  runValidation();
                }}
                placeholder="Enter product description..."
                rows={4}
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <div className="space-y-1">
              <span className="block text-sm font-medium text-[#6b7280]">Status</span>
              <label className="flex items-center gap-2 text-sm">
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

        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Critical Medicine Designation</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="critical"
                checked={form.is_critical_medicine === true}
                onChange={() => setForm((f) => ({ ...f, is_critical_medicine: true }))}
                className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
              />
              Yes — This product is designated as a critical medicine
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="critical"
                checked={form.is_critical_medicine === false}
                onChange={() => setForm((f) => ({ ...f, is_critical_medicine: false }))}
                className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
              />
              No — This product is not a critical medicine
            </label>
            <p className="text-xs text-[#6b7280]">
              Critical medicine designation is for MOH Tier 1 only. This designation affects compliance monitoring.
            </p>
          </div>
        </div>

        {mode === "edit" && initial && (initial.created_at || initial.updated_at) && (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#111827]">Metadata</h2>
            <dl className="grid gap-2 text-sm">
              {initial.created_at && (
                <>
                  <dt className="font-medium text-[#6b7280]">Created</dt>
                  <dd className="text-[#111827]">
                    {new Date(initial.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </>
              )}
              {initial.updated_at && (
                <>
                  <dt className="font-medium text-[#6b7280]">Last Updated</dt>
                  <dd className="text-[#111827]">
                    {new Date(initial.updated_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </>
              )}
            </dl>
          </div>
        )}

        {draftSavedAt && (
          <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#2563eb]">
            Draft saved — Last saved:{" "}
            {draftSavedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </div>
        )}
      </form>

      <div className="flex justify-end gap-2">
        <Link
          href={mode === "create" ? "/rmm/products" : `/rmm/products/${productId}`}
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
              setTouched({ company_id: true, name: true, atc_code_id: true, description: true });
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
          form="product-form"
          disabled={!canSubmit || submitting}
          className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create Product" : "Update Product"}
        </button>
      </div>
    </div>
  );
}
