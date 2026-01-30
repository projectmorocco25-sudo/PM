"use client";

/**
 * Wireframe: task-0.5.2.1b-create-enforcement-action-wizard.md
 * Route: /enforcement/actions/new
 * Implements: Create Enforcement Action wizard — Step 1 (Action Details), Step 2 (Legal Basis & Justification), Step 3 (Review & Submit). MOH only.
 * Task: 1.1.2.40
 * API: enforcement_create_action, enforcement_submit_action (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const VIOLATION_OPTIONS: { value: string; label: string }[] = [
  { value: "submission_non_compliance", label: "Submission Non-Compliance" },
  { value: "threshold_breach", label: "Threshold Breach" },
  { value: "critical_medicine_non_compliance", label: "Critical Medicine Non-Compliance" },
  { value: "export_violation", label: "Export Violation" },
  { value: "data_quality_issue", label: "Data Quality Issue" },
  { value: "repeated_offender", label: "Repeated Offender" },
];

const LEGAL_BASIS_PRESETS = [
  "Article 15, Section 3 - Submission Requirements",
  "Article 22, Section 1 - Threshold Compliance",
  "Article 30, Section 2 - Critical Medicine Standards",
  "DMP Regulation Article 12",
  "DMP Regulation Article 15",
];

type WizardData = {
  actionType: "warning" | "fine" | "suspension";
  companyId: string;
  violationType: string;
  violationReferenceId: string;
  violationReferenceTable: string;
  amount: string;
  legalBasis: string;
  justification: string;
  notes: string;
  confirmAccurate: boolean;
  confirmAudit: boolean;
  confirmLegalBasis: boolean;
  confirmRetention: boolean;
};

const initialData: WizardData = {
  actionType: "warning",
  companyId: "",
  violationType: "",
  violationReferenceId: "",
  violationReferenceTable: "",
  amount: "",
  legalBasis: "",
  justification: "",
  notes: "",
  confirmAccurate: false,
  confirmAudit: false,
  confirmLegalBasis: false,
  confirmRetention: false,
};

type CreateEnforcementActionWizardProps = {
  companies: { id: string; name: string }[];
};

export function CreateEnforcementActionWizard({ companies }: CreateEnforcementActionWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [companySearch, setCompanySearch] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof WizardData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return companies.slice(0, 50);
    return companies.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 50);
  }, [companies, companySearch]);

  function update(field: keyof WizardData, value: string | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep1(): boolean {
    const e: Partial<Record<keyof WizardData, string>> = {};
    if (!data.companyId) e.companyId = "Company is required";
    if (!data.violationType) e.violationType = "Violation type is required";
    if (data.actionType === "fine") {
      const num = parseFloat(data.amount);
      if (!data.amount.trim() || isNaN(num) || num <= 0) e.amount = "Valid amount is required for fines";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof WizardData, string>> = {};
    if (!data.legalBasis.trim()) e.legalBasis = "Legal basis is required";
    if (!data.justification.trim()) e.justification = "Justification is required";
    else if (data.justification.trim().length < 50) e.justification = "Justification must be at least 50 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3(): boolean {
    const e: Partial<Record<keyof WizardData, string>> = {};
    if (!data.confirmAccurate) e.confirmAccurate = "Please confirm information is accurate";
    if (!data.confirmAudit) e.confirmAudit = "Please confirm you understand audit trail";
    if (!data.confirmLegalBasis) e.confirmLegalBasis = "Please confirm legal basis is correct";
    if (!data.confirmRetention) e.confirmRetention = "Please confirm retention requirements";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (step !== 3 || !validateStep3()) return;
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();
    const createPayload = {
      p_company_id: data.companyId,
      p_action_type: data.actionType,
      p_violation_type: data.violationType,
      p_legal_basis: data.legalBasis.trim(),
      p_justification: data.justification.trim(),
      p_amount: data.actionType === "fine" && data.amount ? parseFloat(data.amount) : null,
      p_currency: "MAD",
      p_notes: data.notes.trim() || null,
      p_violation_reference_id: data.violationReferenceId.trim() && /^[0-9a-f-]{36}$/i.test(data.violationReferenceId.trim()) ? data.violationReferenceId.trim() : null,
      p_violation_reference_table: data.violationReferenceTable.trim() || null,
    };

    const { data: createRes, error: createErr } = await supabase.rpc("enforcement_create_action", createPayload);
    const createResult = createRes as { action?: { id?: string }; error?: string; message?: string } | null;

    if (createErr || (createResult && "error" in createResult)) {
      setSubmitError((createResult && "message" in createResult ? createResult.message : createErr?.message) || "Failed to create action");
      setSubmitting(false);
      return;
    }

    const actionId = createResult?.action?.id;
    if (!actionId) {
      setSubmitError("Action was created but ID was not returned");
      setSubmitting(false);
      return;
    }

    const { data: submitRes, error: submitErr } = await supabase.rpc("enforcement_submit_action", { p_action_id: actionId });
    const submitResult = submitRes as { error?: string; message?: string } | null;

    if (submitErr || (submitResult && "error" in submitResult)) {
      setSubmitError((submitResult && "message" in submitResult ? submitResult.message : submitErr?.message) || "Action created but submit failed");
      setSubmitting(false);
      return;
    }

    router.push(`/enforcement/actions/${actionId}`);
  }

  const companyName = companies.find((c) => c.id === data.companyId)?.name ?? "";
  const violationLabel = VIOLATION_OPTIONS.find((o) => o.value === data.violationType)?.label ?? data.violationType;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-[#111827]">Create Enforcement Action</h1>

      <p className="text-sm text-[#6b7280]">
        Step {step} of 3: {step === 1 ? "Action Details" : step === 2 ? "Legal Basis & Justification" : "Review & Submit"}
      </p>

      {step === 1 && (
        <div className="space-y-6 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-[#374151]">Action Type *</label>
            <div className="mt-2 space-y-2">
              {(["warning", "fine", "suspension"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="actionType"
                    checked={data.actionType === t}
                    onChange={() => update("actionType", t)}
                    className="h-4 w-4"
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">Fines and suspensions require Tier 1 approval.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151]">Company *</label>
            <input
              type="text"
              placeholder="Search company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              onFocus={() => setCompanySearch((s) => s || (companies.find((c) => c.id === data.companyId)?.name ?? ""))}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
            <select
              value={data.companyId}
              onChange={(e) => update("companyId", e.target.value)}
              className="mt-2 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
              aria-label="Select company"
            >
              <option value="">Select Company</option>
              {filteredCompanies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151]">Violation Type *</label>
            <select
              value={data.violationType}
              onChange={(e) => update("violationType", e.target.value)}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
              aria-label="Violation type"
            >
              <option value="">Select Violation Type</option>
              {VIOLATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.violationType && <p className="mt-1 text-sm text-red-600">{errors.violationType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151]">Violation Reference (Optional)</label>
            <input
              type="text"
              placeholder="Entity type (e.g. registry_submissions)"
              value={data.violationReferenceTable}
              onChange={(e) => update("violationReferenceTable", e.target.value)}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Entity ID (UUID)"
              value={data.violationReferenceId}
              onChange={(e) => update("violationReferenceId", e.target.value)}
              className="mt-2 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
          </div>

          {data.actionType === "fine" && (
            <div>
              <label className="block text-sm font-medium text-[#374151]">Fine Amount * (MAD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={data.amount}
                onChange={(e) => update("amount", e.target.value)}
                className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-[#6b7280]">Currency: MAD (Moroccan Dirham)</p>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-[#374151]">Legal Basis *</label>
            <select
              value={LEGAL_BASIS_PRESETS.includes(data.legalBasis) ? data.legalBasis : ""}
              onChange={(e) => update("legalBasis", e.target.value || data.legalBasis)}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            >
              <option value="">Select or enter below</option>
              {LEGAL_BASIS_PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or enter custom legal basis (e.g. DMP Article 15, Section 3)"
              value={data.legalBasis}
              onChange={(e) => update("legalBasis", e.target.value)}
              className="mt-2 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-amber-700">Legal basis is REQUIRED and cannot be changed after creation.</p>
            {errors.legalBasis && <p className="mt-1 text-sm text-red-600">{errors.legalBasis}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151]">Justification * (min 50 characters)</label>
            <textarea
              placeholder="Enter detailed justification. Include violation details, previous warnings if applicable, and regulatory basis."
              value={data.justification}
              onChange={(e) => update("justification", e.target.value)}
              rows={5}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-[#6b7280]">Character count: {data.justification.trim().length} / 50 minimum</p>
            {errors.justification && <p className="mt-1 text-sm text-red-600">{errors.justification}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151]">Internal Notes (Optional - MOH Only)</label>
            <textarea
              placeholder="Internal notes visible only to MOH staff."
              value={data.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-[#e5e7eb] px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#374151]">Review Your Action</h2>
          <dl className="grid gap-2 text-sm">
            <div><dt className="text-[#6b7280]">Action Type</dt><dd className="text-[#111827] capitalize">{data.actionType}</dd></div>
            <div><dt className="text-[#6b7280]">Company</dt><dd className="text-[#111827]">{companyName || "—"}</dd></div>
            <div><dt className="text-[#6b7280]">Violation</dt><dd className="text-[#111827]">{violationLabel || "—"}</dd></div>
            <div><dt className="text-[#6b7280]">Legal Basis</dt><dd className="text-[#111827]">{data.legalBasis || "—"}</dd></div>
            {data.actionType === "fine" && data.amount && <div><dt className="text-[#6b7280]">Amount</dt><dd className="text-[#111827]">{data.amount} MAD</dd></div>}
            <div><dt className="text-[#6b7280]">Justification</dt><dd className="text-[#111827] max-h-24 overflow-y-auto">{data.justification.slice(0, 200)}{data.justification.length > 200 ? "…" : ""}</dd></div>
          </dl>
          <p className="text-xs text-[#6b7280]">
            {data.actionType === "warning" ? "Approval: Tier 2 can approve." : "Approval: Tier 1 approval required."}
          </p>
          <p className="text-xs text-[#6b7280]">
            This action will be retained for 7 years per regulatory requirements. Legal basis is immutable. All actions are logged in the audit trail.
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.confirmAccurate} onChange={(e) => update("confirmAccurate", e.target.checked)} />
              <span className="text-sm">I confirm that all information is accurate</span>
            </label>
            {errors.confirmAccurate && <p className="text-sm text-red-600">{errors.confirmAccurate}</p>}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.confirmAudit} onChange={(e) => update("confirmAudit", e.target.checked)} />
              <span className="text-sm">I understand this action will be logged in audit trail</span>
            </label>
            {errors.confirmAudit && <p className="text-sm text-red-600">{errors.confirmAudit}</p>}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.confirmLegalBasis} onChange={(e) => update("confirmLegalBasis", e.target.checked)} />
              <span className="text-sm">I confirm the legal basis is correct and aligned with DMP regulations</span>
            </label>
            {errors.confirmLegalBasis && <p className="text-sm text-red-600">{errors.confirmLegalBasis}</p>}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.confirmRetention} onChange={(e) => update("confirmRetention", e.target.checked)} />
              <span className="text-sm">I understand this action is subject to regulatory retention requirements (7 years minimum)</span>
            </label>
            {errors.confirmRetention && <p className="text-sm text-red-600">{errors.confirmRetention}</p>}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          {step === 1 ? (
            <Link href="/enforcement/actions" className="text-sm text-[#2563eb] hover:underline">Cancel</Link>
          ) : (
            <button type="button" onClick={handleBack} className="rounded border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
              ← Previous Step
            </button>
          )}
        </div>
        <div>
          {step < 3 ? (
            <button type="button" onClick={handleNext} className="rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]">
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Action"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
