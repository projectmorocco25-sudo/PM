"use client";

/**
 * Wireframe: task-0.5.2.1e-appeal-review-interface.md
 * Route: /enforcement/actions/[id]/appeal/review
 * Implements: Appeal Review — Tier 1 review interface: action summary, appeal info, uphold/overturn decision, justification (min 50 chars), adjustment note. MOH Tier 1 only.
 * Task: 1.1.2.43
 * API: enforcement_uphold_appeal, enforcement_overturn_appeal (hosted Supabase only). 14 business days review target (SLA) documented.
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md
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

const MIN_JUSTIFICATION = 50;

type Decision = "uphold" | "uphold_adjustment" | "overturn";

type AppealReviewContentProps = {
  action: Record<string, unknown> | null;
  companyName: string;
  executedAt: string | null;
  appeal: Record<string, unknown>;
  appealId: string;
  actionId: string;
  appealWindowRemaining: number | null;
};

function formatRelativeDate(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (60 * 1000));
        return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  } catch {
    return iso.slice(0, 10);
  }
}

export function AppealReviewContent({
  action,
  companyName,
  executedAt,
  appeal,
  appealId,
  actionId,
  appealWindowRemaining,
}: AppealReviewContentProps) {
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | "">("");
  const [justification, setJustification] = useState("");
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actionType = action ? String(action.action_type ?? "") : "";
  const violationType = action ? String(action.violation_type ?? "") : "";
  const legalBasis = action ? String(action.legal_basis ?? "") : "";
  const appealReason = String(appeal?.appeal_reason ?? "");
  const submittedAt = appeal?.submitted_at != null ? String(appeal.submitted_at) : null;
  const submittedByName = appeal?.submitted_by_name != null ? String(appeal.submitted_by_name) : "Company user";

  const showAdjustment = decision === "uphold_adjustment";
  const resolutionText =
    showAdjustment && adjustmentNote.trim()
      ? `${justification.trim()}\n\nAdjustment note: ${adjustmentNote.trim()}`
      : justification.trim();
  const isValid =
    decision !== "" &&
    resolutionText.length >= MIN_JUSTIFICATION &&
    (decision !== "uphold_adjustment" || adjustmentNote.trim().length > 0);

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const rpcName =
      decision === "overturn"
        ? "enforcement_uphold_appeal"
        : "enforcement_overturn_appeal";
    const { data, error: rpcError } = await supabase.rpc(rpcName, {
      p_appeal_id: appealId,
      p_resolution: resolutionText,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message ?? "Submission failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Submission failed.");
      return;
    }
    router.push(`/enforcement/actions/${actionId}`);
    router.refresh();
  }

  if (!action) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#111827]">
        Review Appeal — {actionId.slice(0, 8)}…
      </h1>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Enforcement Action Summary</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#374151]">
          <li>
            <span className="font-medium">Action ID:</span> {actionId.slice(0, 8)}…
          </li>
          <li>
            <span className="font-medium">Type:</span> {ACTION_TYPE_ICON[actionType] ?? ""}{" "}
            {ACTION_TYPE_LABEL[actionType] ?? actionType}
          </li>
          <li>
            <span className="font-medium">Company:</span>{" "}
            <Link href={`/rmm/companies/${action.company_id}`} className="text-[#2563eb] hover:underline">
              {companyName}
            </Link>
          </li>
          <li>
            <span className="font-medium">Violation:</span> {VIOLATION_LABEL[violationType] ?? violationType}
          </li>
          <li>
            <span className="font-medium">Executed:</span> {formatRelativeDate(executedAt)}
          </li>
          {legalBasis && (
            <li>
              <span className="font-medium">Legal Basis:</span> {legalBasis}
            </li>
          )}
        </ul>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Appeal Information</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#374151]">
          <li>
            <span className="font-medium">Submitted:</span> {formatRelativeDate(submittedAt)}
          </li>
          <li>
            <span className="font-medium">Submitted by:</span> {submittedByName}
          </li>
          {appealWindowRemaining != null && (
            <li>
              <span className="font-medium">Appeal window:</span> {appealWindowRemaining} days remaining
            </li>
          )}
          <li>
            <span className="font-medium">Grounds for appeal:</span> —
          </li>
        </ul>
        {appealReason && (
          <div className="mt-3">
            <span className="font-medium text-[#374151]">Detailed explanation:</span>
            <p className="mt-1 rounded border border-[#e5e7eb] bg-[#f9fafb] p-3 text-sm text-[#111827] whitespace-pre-wrap">
              {appealReason}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">
          Review Decision <span className="text-[#ef4444]">*</span>
        </h2>
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="decision"
              value="uphold"
              checked={decision === "uphold"}
              onChange={() => setDecision("uphold")}
              className="mt-1 h-4 w-4 border-[#d1d5db] text-[#2563eb]"
            />
            <span className="text-sm text-[#111827]">
              <strong>Uphold Enforcement Action</strong> — Maintain the original enforcement action
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="decision"
              value="uphold_adjustment"
              checked={decision === "uphold_adjustment"}
              onChange={() => setDecision("uphold_adjustment")}
              className="mt-1 h-4 w-4 border-[#d1d5db] text-[#2563eb]"
            />
            <span className="text-sm text-[#111827]">
              <strong>Uphold with Adjustment Note</strong> — Maintain action but add adjustment note to record
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="decision"
              value="overturn"
              checked={decision === "overturn"}
              onChange={() => setDecision("overturn")}
              className="mt-1 h-4 w-4 border-[#d1d5db] text-[#2563eb]"
            />
            <span className="text-sm text-[#111827]">
              <strong>Overturn Enforcement Action</strong> — Reverse the enforcement action
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">
          Review Justification <span className="text-[#ef4444]">*</span>
        </h2>
        <p className="mt-1 text-xs text-[#6b7280]">
          Minimum {MIN_JUSTIFICATION} characters required. Include assessment of appeal grounds, evidence review, and
          regulatory basis. Justification must align with DMP regulations.
        </p>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Enter detailed justification for your review decision..."
          rows={5}
          className="mt-3 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
          aria-label="Review justification"
        />
        <p className="mt-1 text-xs text-[#6b7280]">
          Character count: {justification.trim().length} / {MIN_JUSTIFICATION} minimum
        </p>
      </div>

      {showAdjustment && (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827]">Adjustment Note</h2>
          <p className="mt-1 text-xs text-[#6b7280]">
            Note to be added to the record. Visible to the company and preserved in the audit trail.
          </p>
          <textarea
            value={adjustmentNote}
            onChange={(e) => setAdjustmentNote(e.target.value)}
            placeholder="Enter adjustment note..."
            rows={3}
            className="mt-3 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
            aria-label="Adjustment note"
          />
        </div>
      )}

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Internal Notes (MOH Only)</h2>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Internal notes visible only to MOH staff (optional)."
          rows={2}
          className="mt-3 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
          aria-label="Internal notes"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-sm text-[#b91c1c]" role="alert">
          {error}
        </div>
      )}

      <p className="text-xs text-[#6b7280]">
        ℹ️ Tier 1 review target: 14 business days (SLA). Per BUSINESS-LOGIC §8.
      </p>

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
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
