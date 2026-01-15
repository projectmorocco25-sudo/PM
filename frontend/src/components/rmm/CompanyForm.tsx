"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/forms/FormField";
import { Checkbox } from "@/components/forms/Checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import type { CompanyUpsertInput } from "@/lib/supabase/queries";
import { isCompanyRegistrationAvailable } from "@/lib/supabase/queries";

const regNo = /^REG-\d{4}-\d{3,5}$/;
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const companySchema = z.object({
  name: z.string().trim().min(2, "Company name must be between 2 and 200 characters").max(200),
  registration_number: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(regNo, "Invalid format. Expected: REG-YYYY-NNNNN (e.g., REG-2024-001)"),
  company_type: z
    .union([z.literal(""), z.literal("ipc"), z.literal("wholesaler")])
    .refine((v) => v !== "", { message: "Company type is required" }),
  is_active: z.boolean(),
  address: z.string().trim().max(500, "Address must not exceed 500 characters").optional().or(z.literal("")),
  tax_id: z.string().trim().max(50, "Tax ID must not exceed 50 characters").optional().or(z.literal("")),
  contact_email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  contact_phone: z.string().trim().max(30, "Please enter a valid phone number").optional().or(z.literal("")),
});

export type CompanyFormValues = z.input<typeof companySchema>;

function toInput(values: CompanyFormValues): CompanyUpsertInput {
  return {
    name: values.name.trim(),
    registration_number: values.registration_number.trim(),
    company_type: values.company_type as "ipc" | "wholesaler",
    is_active: values.is_active,
    address: values.address?.trim() ? values.address.trim() : null,
    tax_id: values.tax_id?.trim() ? values.tax_id.trim() : null,
    contact_email: values.contact_email?.trim() ? values.contact_email.trim().toLowerCase() : null,
    contact_phone: values.contact_phone?.trim() ? values.contact_phone.trim() : null,
  };
}

export function CompanyForm({
  mode,
  companyId,
  defaultValues,
  onSubmit,
  disableCompanyType,
  allowStatusEdit,
  metadata,
  title,
}: {
  mode: "create" | "edit";
  companyId?: string;
  defaultValues?: Partial<CompanyFormValues>;
  onSubmit: (input: CompanyUpsertInput) => Promise<{ id: string }>;
  disableCompanyType?: boolean;
  allowStatusEdit?: boolean;
  metadata?: { createdAt?: string; updatedAt?: string };
  title: string;
}) {
  const router = useRouter();
  const [draftStatus, setDraftStatus] = useState<
    | { state: "idle" }
    | { state: "saving" }
    | { state: "saved"; lastSavedAt: number }
    | { state: "error"; message: string }
  >({ state: "idle" });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const values = useMemo(() => {
    const v: CompanyFormValues = {
      name: defaultValues?.name ?? "",
      registration_number: defaultValues?.registration_number ?? "",
      company_type: (defaultValues?.company_type as CompanyFormValues["company_type"]) ?? "",
      is_active: defaultValues?.is_active ?? true,
      address: defaultValues?.address ?? "",
      tax_id: defaultValues?.tax_id ?? "",
      contact_email: defaultValues?.contact_email ?? "",
      contact_phone: defaultValues?.contact_phone ?? "",
    };
    return v;
  }, [defaultValues]);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    values,
    mode: "onBlur",
  });

  const companyType = useWatch({ control: form.control, name: "company_type" });
  const isActive = useWatch({ control: form.control, name: "is_active" });
  const allValues = useWatch({ control: form.control });

  const draftKey = useMemo(() => {
    return mode === "edit" && companyId ? `company_form_draft_${companyId}` : "company_form_draft_new";
  }, [companyId, mode]);

  const lastSavedRef = useRef<number | null>(null);
  const lastSavedHashRef = useRef<string | null>(null);

  function saveDraftLocal(nextValues: CompanyFormValues, source: "manual" | "auto") {
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

  // Draft recovery prompt on load (if valid + not expired).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { ts?: number; values?: Partial<CompanyFormValues> } | null;
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
        } as CompanyFormValues,
        { keepDirty: false },
      );
      setDraftStatus({ state: "saved", lastSavedAt: parsed.ts });
      lastSavedRef.current = parsed.ts;
      lastSavedHashRef.current = JSON.stringify(parsed.values);
    } catch {
      // ignore parse/storage issues
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Debounced auto-save (2s after changes), only when dirty.
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

  // Periodic auto-save (every 30s) while dirty.
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

  async function validateRegNoUnique(registration: string) {
    if (!registration.trim() || !regNo.test(registration.trim())) return true;
    try {
      const res = await isCompanyRegistrationAvailable(registration.trim(), mode === "edit" ? companyId : undefined);
      if (res.error) return true; // fall back to server-side enforcement
      return res.data ? true : "Registration number already exists";
    } catch {
      return true;
    }
  }

  async function handleSaveDraft() {
    saveDraftLocal(form.getValues(), "manual");
    notify.success("Draft saved");
  }

  async function submit(values: CompanyFormValues) {
    setSubmitError(null);
    // Required at final submit: at least one contact method (Email OR Phone)
    const email = values.contact_email?.trim() ?? "";
    const phone = values.contact_phone?.trim() ?? "";
    if (!email && !phone) {
      form.setError("contact_email", {
        type: "validate",
        message: "At least one contact method (Email OR Phone) is required for regulatory communications",
      });
      form.setError("contact_phone", {
        type: "validate",
        message: "At least one contact method (Email OR Phone) is required for regulatory communications",
      });
      setSubmitError("Please correct the highlighted fields.");
      return;
    }

    try {
      const res = await onSubmit(toInput(values));
      clearDraftLocal();
      notify.success(mode === "create" ? "Company created" : "Company updated");
      router.push(`/rmm/companies/${res.id}`);
    } catch (err) {
      const e = err as (Error & { details?: unknown }) | unknown;
      const details = typeof e === "object" && e && "details" in e ? (e as { details?: unknown }).details : undefined;
      if (Array.isArray(details)) {
        for (const d of details) {
          if (!d || typeof d !== "object") continue;
          const field = (d as { field?: unknown }).field;
          const message = (d as { message?: unknown }).message;
          if (typeof field === "string" && typeof message === "string") {
            if (
              field === "name" ||
              field === "registration_number" ||
              field === "company_type" ||
              field === "address" ||
              field === "tax_id" ||
              field === "contact_email" ||
              field === "contact_phone" ||
              field === "is_active"
            ) {
              form.setError(field as keyof CompanyFormValues, { type: "server", message });
            }
          }
        }
        const first = Object.keys(form.formState.errors)[0];
        if (first) form.setFocus(first as keyof CompanyFormValues);
        setSubmitError("Please correct the highlighted fields.");
      } else {
        setSubmitError(err instanceof Error ? err.message : "Failed to save company");
      }
      notify.error(err instanceof Error ? err.message : "Failed to save company");
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
          if (first) form.setFocus(first as keyof CompanyFormValues);
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
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Company Name" required htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" placeholder="Enter company name..." {...form.register("name")} />
            </FormField>

            <FormField
              label="Registration Number"
              required
              htmlFor="registration_number"
              helperText="Format: REG-YYYY-NNNNN (e.g., REG-2024-001). Must match official registration documents."
              error={form.formState.errors.registration_number?.message}
            >
              <Input
                id="registration_number"
                placeholder="Enter registration number (e.g., REG-2024-001)..."
                {...form.register("registration_number", { validate: validateRegNoUnique })}
              />
            </FormField>

            <div>
              <div className="mb-1 block text-sm font-medium text-zinc-700">
                Company Type <span className="ml-1 text-red-600">*</span>
              </div>
              {disableCompanyType ? (
                <Input
                  value={values.company_type === "ipc" ? "IPC" : values.company_type === "wholesaler" ? "Wholesaler" : ""}
                  disabled
                />
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="radio"
                      value="ipc"
                      checked={companyType === "ipc"}
                      onChange={() => form.setValue("company_type", "ipc", { shouldDirty: true, shouldValidate: true })}
                    />
                    IPC (Industrial Pharmaceutical Company)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="radio"
                      value="wholesaler"
                      checked={companyType === "wholesaler"}
                      onChange={() =>
                        form.setValue("company_type", "wholesaler", { shouldDirty: true, shouldValidate: true })
                      }
                    />
                    Wholesaler
                  </label>
                </div>
              )}
              <div className="mt-1 text-xs text-zinc-500">Company type cannot be changed after creation.</div>
            </div>

            <FormField label="Status">
              <Checkbox
                checked={Boolean(isActive)}
                onChange={(v) => {
                  if (!allowStatusEdit) return;
                  form.setValue("is_active", v, { shouldDirty: true });
                }}
                label={
                  <span className={!allowStatusEdit ? "text-zinc-500" : ""}>
                    {isActive ? "Active" : "Inactive"}{" "}
                    {!allowStatusEdit ? "(MOH Tier 1 only)" : null}
                  </span>
                }
              />
            </FormField>
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

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Address" htmlFor="address" error={form.formState.errors.address?.message}>
              <textarea
                id="address"
                rows={4}
                className={[
                  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900",
                  "placeholder:text-zinc-400",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
                placeholder="Enter company address..."
                {...form.register("address")}
              />
            </FormField>

            <FormField label="Tax ID" htmlFor="tax_id" helperText="Optional: Tax identification number for regulatory purposes" error={form.formState.errors.tax_id?.message}>
              <Input id="tax_id" placeholder="Enter tax identification number..." {...form.register("tax_id")} />
            </FormField>

            <FormField label="Email" htmlFor="contact_email" error={form.formState.errors.contact_email?.message}>
              <Input id="contact_email" type="email" placeholder="Enter contact email..." {...form.register("contact_email")} />
            </FormField>

            <FormField label="Phone" htmlFor="contact_phone" helperText="At least one contact method (Email OR Phone) is required for regulatory communications" error={form.formState.errors.contact_phone?.message}>
              <Input id="contact_phone" type="tel" placeholder="Enter contact phone (e.g., +212 5XX XXX XXX)..." {...form.register("contact_phone")} />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="submit" disabled={!form.formState.isValid}>
            {mode === "create" ? "Create Company" : "Update Company"}
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

