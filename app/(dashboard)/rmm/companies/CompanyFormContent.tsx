"use client";

/**
 * Wireframe: task-0.5.2.8-company-create-edit-form.md
 * Routes: /rmm/companies/new, /rmm/companies/[id]/edit
 * Implements: Company create/edit form — Company Information, Contact Information, Metadata (edit), draft auto-save, validation.
 * Task: 1.1.2.19
 * API: rmm_create_company, rmm_update_company (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const REG_FORMAT = /^REG-\d{4}-\d{3,5}$/;
const DRAFT_KEY_NEW = "company_form_draft_new";
const DRAFT_DEBOUNCE_MS = 2000;
const AUTOSAVE_INTERVAL_MS = 30000;

export type CompanyFormInitial = {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  is_active: boolean;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at?: string;
  updated_at?: string;
};

type CompanyFormContentProps = {
  mode: "create" | "edit";
  companyId?: string;
  initial?: CompanyFormInitial | null;
};

type FormState = {
  name: string;
  registration_number: string;
  company_type: string;
  is_active: boolean;
  address: string;
  contact_email: string;
  contact_phone: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function defaultFormState(initial?: CompanyFormInitial | null): FormState {
  if (!initial) {
    return {
      name: "",
      registration_number: "",
      company_type: "",
      is_active: true,
      address: "",
      contact_email: "",
      contact_phone: "",
    };
  }
  return {
    name: initial.name ?? "",
    registration_number: initial.registration_number ?? "",
    company_type: initial.company_type ?? "",
    is_active: initial.is_active ?? true,
    address: initial.address ?? "",
    contact_email: initial.contact_email ?? "",
    contact_phone: initial.contact_phone ?? "",
  };
}

function validate(state: FormState, mode: "create" | "edit"): FieldErrors {
  const e: FieldErrors = {};
  const n = state.name.trim();
  if (!n) e.name = "Company name is required";
  else if (n.length < 2 || n.length > 200) e.name = "Company name must be between 2 and 200 characters";
  const r = state.registration_number.trim();
  if (!r) e.registration_number = "Registration number is required";
  else if (!REG_FORMAT.test(r)) e.registration_number = "Invalid format. Expected: REG-YYYY-NNNNN (e.g., REG-2024-001)";
  if (mode === "create" && !state.company_type) e.company_type = "Company type is required";
  if (state.address.length > 500) e.address = "Address must not exceed 500 characters";
  const hasEmail = !!state.contact_email.trim();
  const hasPhone = !!state.contact_phone.trim();
  if (!hasEmail && !hasPhone) e.contact_email = "At least one contact method (Email OR Phone) is required for regulatory communications.";
  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact_email)) e.contact_email = "Please enter a valid email address";
  return e;
}

function loadDraft(key: string): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(key);
    if (!s) return null;
    const j = JSON.parse(s) as FormState;
    return {
      name: j.name ?? "",
      registration_number: j.registration_number ?? "",
      company_type: j.company_type ?? "",
      is_active: j.is_active ?? true,
      address: j.address ?? "",
      contact_email: j.contact_email ?? "",
      contact_phone: j.contact_phone ?? "",
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

export function CompanyFormContent({ mode, companyId, initial }: CompanyFormContentProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => {
    const draft = mode === "create" ? loadDraft(DRAFT_KEY_NEW) : companyId ? loadDraft(`company_form_draft_${companyId}`) : null;
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
  const draftKey = mode === "create" ? DRAFT_KEY_NEW : companyId ? `company_form_draft_${companyId}` : null;

  const isDirty = useCallback(() => {
    const base = defaultFormState(initial);
    return (
      form.name !== base.name ||
      form.registration_number !== base.registration_number ||
      form.company_type !== base.company_type ||
      form.is_active !== base.is_active ||
      form.address !== base.address ||
      form.contact_email !== base.contact_email ||
      form.contact_phone !== base.contact_phone
    );
  }, [form, initial]);

  const performSave = useCallback(async () => {
    if (mode === "create") {
      saveDraft(DRAFT_KEY_NEW, form);
      setDraftSavedAt(new Date());
      return;
    }
    if (!companyId) return;
    setSaving(true);
    setSubmitError(null);
    const { data, error } = await supabase.rpc("rmm_update_company", {
      p_id: companyId,
      p_name: form.name.trim() || null,
      p_registration_number: form.registration_number.trim() || null,
      p_company_type: mode === "edit" ? null : (form.company_type || null),
      p_address: form.address.trim() || null,
      p_contact_email: form.contact_email.trim() || null,
      p_contact_phone: form.contact_phone.trim() || null,
      p_is_active: form.is_active,
    });
    setSaving(false);
    const payload = data as { company?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      const msg = (payload?.message as string) || error?.message || "Save failed";
      setSubmitError(msg);
      return;
    }
    setDraftSavedAt(new Date());
    if (draftKey) saveDraft(draftKey, form);
    setSubmitError(null);
  }, [mode, companyId, form, supabase, draftKey]);

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
    setTouched({ name: true, registration_number: true, company_type: true, address: true, contact_email: true, contact_phone: true });
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    if (mode === "create") {
      const { data, error } = await supabase.rpc("rmm_create_company", {
        p_name: form.name.trim(),
        p_registration_number: form.registration_number.trim(),
        p_company_type: form.company_type as "ipc" | "wholesaler",
        p_address: form.address.trim() || null,
        p_contact_email: form.contact_email.trim() || null,
        p_contact_phone: form.contact_phone.trim() || null,
      });
      setSubmitting(false);
      const payload = data as { company?: { id?: string }; error?: string; message?: string } | null;
      if (error || payload?.error) {
        setSubmitError((payload?.message as string) || error?.message || "Create failed");
        return;
      }
      clearDraft(DRAFT_KEY_NEW);
      const id = (payload?.company as { id?: string })?.id;
      if (id) router.replace(`/rmm/companies/${id}`);
      else router.replace("/rmm/companies");
      return;
    }
    if (!companyId) return;
    const { data, error } = await supabase.rpc("rmm_update_company", {
      p_id: companyId,
      p_name: form.name.trim() || null,
      p_registration_number: form.registration_number.trim() || null,
      p_company_type: null,
      p_address: form.address.trim() || null,
      p_contact_email: form.contact_email.trim() || null,
      p_contact_phone: form.contact_phone.trim() || null,
      p_is_active: form.is_active,
    });
    setSubmitting(false);
    const payload = data as { company?: unknown; error?: string; message?: string } | null;
    if (error || payload?.error) {
      setSubmitError((payload?.message as string) || error?.message || "Update failed");
      return;
    }
    if (draftKey) clearDraft(draftKey);
    router.replace(`/rmm/companies/${companyId}`);
  };

  const runValidation = useCallback(() => {
    setErrors(validate(form, mode));
  }, [form, mode]);

  const valid = Object.keys(validate(form, mode)).length === 0;
  const canSubmit = valid && (mode === "edit" ? isDirty() : true);

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
        {err && <p className="text-xs text-[#ef4444]" role="alert">{err}</p>}
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
        <Link href="/rmm/companies" className="text-[#2563eb] hover:underline">Companies</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">{mode === "create" ? "New Company" : "Edit Company"}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
          {mode === "create" ? "Create Company" : "Edit Company"}
        </h1>
        <div className="flex gap-2">
          <Link
            href={mode === "create" ? "/rmm/companies" : `/rmm/companies/${companyId}`}
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
                setTouched({ name: true, registration_number: true, company_type: true, address: true, contact_email: true, contact_phone: true });
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
            form="company-form"
            disabled={!canSubmit || submitting}
            className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
          >
            {submitting ? "Saving…" : mode === "create" ? "Create Company" : "Update Company"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]" role="alert">
          {submitError}
        </div>
      )}

      <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Company Information</h2>
          <div className="space-y-4">
            {formField("name", "Company Name", true, () => (
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => { setTouched((t) => ({ ...t, name: true })); runValidation(); }}
                placeholder="Enter company name..."
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            {formField("registration_number", "Registration Number", true, () => (
              <>
                <input
                  id="registration_number"
                  name="registration_number"
                  value={form.registration_number}
                  onChange={(e) => setForm((f) => ({ ...f, registration_number: e.target.value }))}
                  onBlur={() => { setTouched((t) => ({ ...t, registration_number: true })); runValidation(); }}
                  placeholder="Enter registration number (e.g., REG-2024-001)..."
                  className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 font-mono text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
                <p className="text-xs text-[#6b7280]">Format: REG-YYYY-NNNNN (e.g., REG-2024-001). Must match official registration documents.</p>
              </>
            ))}
            {formField("company_type", "Company Type", mode === "create", () =>
              mode === "edit" ? (
                <p className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#111827]">
                  {form.company_type === "ipc" ? "IPC (Industrial Pharmaceutical Company)" : form.company_type === "wholesaler" ? "Wholesaler" : form.company_type || "—"}
                </p>
              ) : (
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="company_type"
                      value="ipc"
                      checked={form.company_type === "ipc"}
                      onChange={() => setForm((f) => ({ ...f, company_type: "ipc" }))}
                      onBlur={() => { setTouched((t) => ({ ...t, company_type: true })); runValidation(); }}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    IPC (Industrial Pharmaceutical Company)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="company_type"
                      value="wholesaler"
                      checked={form.company_type === "wholesaler"}
                      onChange={() => setForm((f) => ({ ...f, company_type: "wholesaler" }))}
                      onBlur={() => { setTouched((t) => ({ ...t, company_type: true })); runValidation(); }}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    Wholesaler
                  </label>
                </div>
              )
            )}
            {mode === "edit" && (
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
            )}
            {mode === "edit" && <p className="text-xs text-[#6b7280]">Company type cannot be changed after creation.</p>}
          </div>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Contact Information</h2>
          <div className="space-y-4">
            {formField("address", "Address", false, () => (
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                onBlur={() => { setTouched((t) => ({ ...t, address: true })); runValidation(); }}
                placeholder="Enter company address..."
                rows={3}
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            {formField("contact_email", "Email", false, () => (
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                onBlur={() => { setTouched((t) => ({ ...t, contact_email: true })); runValidation(); }}
                placeholder="Enter contact email..."
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            {formField("contact_phone", "Phone", false, () => (
              <input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={form.contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
                onBlur={() => { setTouched((t) => ({ ...t, contact_phone: true })); runValidation(); }}
                placeholder="Enter contact phone (e.g., +212 5XX XXX XXX)..."
                className="block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            ))}
            <p className="text-xs text-[#6b7280]">At least one contact method (Email OR Phone) is required for regulatory communications.</p>
          </div>
        </div>

        {mode === "edit" && initial && (initial.created_at || initial.updated_at) && (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#111827]">Metadata</h2>
            <dl className="grid gap-2 text-sm">
              {initial.created_at && (
                <>
                  <dt className="font-medium text-[#6b7280]">Created</dt>
                  <dd className="text-[#111827]">{new Date(initial.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</dd>
                </>
              )}
              {initial.updated_at && (
                <>
                  <dt className="font-medium text-[#6b7280]">Last Updated</dt>
                  <dd className="text-[#111827]">{new Date(initial.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</dd>
                </>
              )}
            </dl>
          </div>
        )}

        {draftSavedAt && (
          <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#2563eb]">
            Draft saved — Last saved: {draftSavedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </div>
        )}
      </form>

      <div className="flex justify-end gap-2">
        <Link
          href={mode === "create" ? "/rmm/companies" : `/rmm/companies/${companyId}`}
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
              setTouched({ name: true, registration_number: true, company_type: true, address: true, contact_email: true, contact_phone: true });
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
          form="company-form"
          disabled={!canSubmit || submitting}
          className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create Company" : "Update Company"}
        </button>
      </div>
    </div>
  );
}
