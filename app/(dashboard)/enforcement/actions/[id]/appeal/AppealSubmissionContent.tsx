"use client";

/**
 * Wireframe: task-0.5.2.1f-appeal-submission-form.md
 * Route: /enforcement/actions/[id]/appeal
 * Implements: Appeal Submission — grounds, detailed explanation (min 50 chars), optional supporting documents. 30-day window. Company users only.
 * Task: 1.1.2.44
 * API: enforcement_submit_appeal (hosted Supabase only). 30-day window from execution; RPC enforces min 20 chars for appeal_reason.
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ACTION_TYPE_LABEL: Record<string, string> = {
  warning: "Warning",
  fine: "Fine",
  suspension: "Suspension",
};

const ACTION_TYPE_ICON: Record<string, string> = {
  warning: "⚠️",
  fine: "💰",
  suspension: "🚫",
};

const VIOLATION_LABEL: Record<string, string> = {
  submission_non_compliance: "Submission Non-Compliance",
  threshold_breach: "Threshold Breach",
  critical_medicine_non_compliance: "Critical Medicine Non-Compliance",
  export_violation: "Export Violation",
  data_quality_issue: "Data Quality Issue",
  repeated_offender: "Repeated Offender",
};

const GROUNDS_OPTIONS: { value: string; label: string }[] = [
  { value: "technical_error", label: "Technical Error" },
  { value: "procedural_issue", label: "Procedural Issue" },
  { value: "factual_inaccuracy", label: "Factual Inaccuracy" },
  { value: "mitigating_circumstances", label: "Mitigating Circumstances" },
  { value: "other", label: "Other" },
];

const MIN_EXPLANATION = 50;

type AppealSubmissionContentProps = {
  action: Record<string, unknown> | null;
  companyName: string;
  actionId: string;
  appealWindowRemaining: number;
  executedAt: string | null;
};

function formatRelativeDate(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  } catch {
    return iso.slice(0, 10);
  }
}

export function AppealSubmissionContent({
  action,
  companyName,
  actionId,
  appealWindowRemaining,
  executedAt,
}: AppealSubmissionContentProps) {
  const router = useRouter();
  const [grounds, setGrounds] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explanationTrim = explanation.trim();
  const isValid = grounds !== "" && explanationTrim.length >= MIN_EXPLANATION;

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const evidence = { grounds };
    const { data, error: rpcError } = await supabase.rpc("enforcement_submit_appeal", {
      p_action_id: actionId,
      p_appeal_reason: explanationTrim,
      p_evidence: evidence,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message ?? "Submission failed.");
      return;
    }
    const payload = data as { error?: string; message?: string; appeal_window_expired?: boolean; already_appealed?: boolean };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Submission failed.");
      return;
    }
    router.push(`/enforcement/actions/${actionId}`);
    router.refresh();
  }

  if (!action) return null;

  const actionType = String(action.action_type ?? "");
  const violationType = String(action.violation_type ?? "");
  const legalBasis = String(action.legal_basis ?? "");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#111827]">
        Submit Appeal — {actionId.slice(0, 8)}…
      </h1>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Enforcement Action Summary</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#374151]">
          <li><span className="font-medium">Action ID:</span> {actionId.slice(0, 8)}…</li>
          <li>
            <span className="font-medium">Type:</span> {ACTION_TYPE_ICON[actionType] ?? ""}{" "}
            {ACTION_TYPE_LABEL[actionType] ?? actionType}
          </li>
          <li><span className="font-medium">Company:</span> {companyName}</li>
          <li><span className="font-medium">Violation:</span> {VIOLATION_LABEL[violationType] ?? violationType}</li>
          <li><span className="font-medium">Executed:</span> {formatRelativeDate(executedAt)}</li>
          {legalBasis && <li><span className="font-medium">Legal Basis:</span> {legalBasis}</li>}
          <li>
            <span className="font-medium">Appeal Deadline:</span>{" "}
            <span className={appealWindowRemaining <= 7 ? "text-[#b91c1c] font-medium" : ""}>
              {appealWindowRemaining} days remaining
            </span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-[#6b7280]">30-day window per DMP regulations.</p>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Appeal Form</h2>

        <label className="mt-3 block text-sm font-medium text-[#374151]">
          Grounds for Appeal <span className="text-[#ef4444]">*</span>
        </label>
        <select
          value={grounds}
          onChange={(e) => setGrounds(e.target.value)}
          className="mt-1 w-full max-w-md rounded border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827]"
          aria-label="Grounds for appeal"
        >
          <option value="">Select Grounds for Appeal</option>
          {GROUNDS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[#6b7280]">Select the primary reason for your appeal.</p>

        <label className="mt-4 block text-sm font-medium text-[#374151]">
          Detailed Explanation <span className="text-[#ef4444]">*</span>
        </label>
        <p className="mt-1 text-xs text-[#6b7280]">Minimum {MIN_EXPLANATION} characters required.</p>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Enter detailed explanation of your appeal. Include specific details about why you believe the enforcement action should be reconsidered."
          rows={6}
          className="mt-2 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
          aria-label="Detailed explanation"
        />
        <p className="mt-1 text-xs text-[#6b7280]">
          Character count: {explanationTrim.length} / {MIN_EXPLANATION} minimum
        </p>
        <p className="mt-1 text-xs text-[#6b7280]">Your explanation will be reviewed by MOH Tier 1. Be as detailed and specific as possible.</p>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#374151]">Supporting Documents (Optional)</h2>
        <p className="mt-1 text-xs text-[#6b7280]">
          Upload evidence, documentation, or other materials that support your appeal grounds. Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10 MB per file, 5 files). File upload will be available in a future release.
        </p>
      </div>

      <div className="rounded-lg border border-[#e0e7ff] bg-[#eff6ff] p-4">
        <h2 className="text-sm font-semibold text-[#1e40af]">Important Information</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#374151]">
          <li>Appeals are reviewed by MOH Tier 1</li>
          <li>You will be notified of the decision within 14 business days</li>
          <li>The appeal decision is final</li>
          <li>All appeal information is preserved in the audit trail</li>
        </ul>
      </div>

      {error && (
        <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-sm text-[#b91c1c]" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link
          href={`/enforcement/actions/${actionId}`}
          className="rounded border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Appeal"}
        </button>
      </div>
    </div>
  );
}
