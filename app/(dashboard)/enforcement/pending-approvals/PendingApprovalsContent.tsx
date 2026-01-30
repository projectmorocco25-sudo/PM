"use client";

/**
 * Wireframe: task-0.5.2.1c-pending-approvals.md
 * Route: /enforcement/pending-approvals
 * Implements: Pending Approvals — list of actions pending Tier 1 approval, approval/reject modals, two-person rule. MOH Tier 1 only.
 * Task: 1.1.2.41
 * API: enforcement_list_pending_approvals, enforcement_approve_action, enforcement_reject_action (hosted Supabase only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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

export type PendingApprovalRow = {
  id: string;
  company_id: string;
  company_name: string;
  action_type: string;
  violation_type: string;
  status: string;
  amount: number | null;
  currency: string;
  legal_basis: string;
  created_at: string;
  updated_at: string;
};

type PendingApprovalsContentProps = {
  rows: PendingApprovalRow[];
  companies: { id: string; name: string }[];
  error: string | null;
};

const MIN_APPROVAL_NOTES = 50;
const MIN_REJECTION_REASON = 20;

export function PendingApprovalsContent({
  rows,
  companies,
  error,
}: PendingApprovalsContentProps) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [approveModal, setApproveModal] = useState<{ id: string; companyName: string } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; companyName: string } | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    let list = [...rows];
    if (typeFilter && typeFilter !== "all") {
      list = list.filter((r) => r.action_type === typeFilter);
    }
    if (companyFilter && companyFilter !== "all") {
      list = list.filter((r) => r.company_id === companyFilter);
    }
    if (sortBy === "date") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "company") {
      list.sort((a, b) => a.company_name.localeCompare(b.company_name));
    } else if (sortBy === "type") {
      list.sort((a, b) => a.action_type.localeCompare(b.action_type));
    }
    return list;
  }, [rows, typeFilter, companyFilter, sortBy]);

  async function handleApprove() {
    if (!approveModal) return;
    const notes = approvalNotes.trim();
    if (notes.length < MIN_APPROVAL_NOTES) {
      setActionError(`Approval notes must be at least ${MIN_APPROVAL_NOTES} characters (required for audit).`);
      return;
    }
    setSubmitting(true);
    setActionError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("enforcement_approve_action", {
      p_action_id: approveModal.id,
      p_approval_notes: notes,
    });
    setSubmitting(false);
    if (rpcError) {
      setActionError(rpcError.message ?? "Approval failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setActionError(payload.message ?? payload.error ?? "Approval failed.");
      return;
    }
    setApproveModal(null);
    setApprovalNotes("");
    router.refresh();
  }

  async function handleReject() {
    if (!rejectModal) return;
    const reason = rejectionReason.trim();
    if (reason.length < MIN_REJECTION_REASON) {
      setActionError(`Rejection reason must be at least ${MIN_REJECTION_REASON} characters.`);
      return;
    }
    setSubmitting(true);
    setActionError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("enforcement_reject_action", {
      p_action_id: rejectModal.id,
      p_rejection_reason: reason,
    });
    setSubmitting(false);
    if (rpcError) {
      setActionError(rpcError.message ?? "Rejection failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setActionError(payload.message ?? payload.error ?? "Rejection failed.");
      return;
    }
    setRejectModal(null);
    setRejectionReason("");
    router.refresh();
  }

  function formatDate(iso: string) {
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

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-[#b91c1c]">
        <p className="font-medium">Unable to load pending approvals</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-3 rounded bg-[#dc2626] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#b91c1c]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Pending Approvals
          <span className="ml-2 rounded-full bg-[#fbbf24] px-2.5 py-0.5 text-sm font-medium text-[#111827]">
            {filteredRows.length}
          </span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Action Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded border border-[#d1d5db] bg-white px-2 py-1.5 text-sm text-[#111827]"
          >
            <option value="all">All Types</option>
            <option value="warning">Warning</option>
            <option value="fine">Fine</option>
            <option value="suspension">Suspension</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Company</span>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded border border-[#d1d5db] bg-white px-2 py-1.5 text-sm text-[#111827]"
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Sort</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-[#d1d5db] bg-white px-2 py-1.5 text-sm text-[#111827]"
          >
            <option value="date">Date</option>
            <option value="company">Company</option>
            <option value="type">Type</option>
          </select>
        </label>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="text-lg font-medium text-[#111827]">No pending approvals</p>
          <p className="mt-1 text-sm text-[#6b7280]">All enforcement actions have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {ACTION_TYPE_ICON[row.action_type] ?? "📋"}
                  </span>
                  <h2 className="text-lg font-semibold text-[#111827]">
                    {ACTION_TYPE_LABEL[row.action_type] ?? row.action_type}
                    {row.action_type === "fine" && row.amount != null
                      ? ` - ${row.currency} ${row.amount.toLocaleString()}`
                      : ""}{" "}
                    - {row.company_name}
                  </h2>
                </div>
              </div>
              {row.legal_basis ? (
                <p className="mt-2 text-sm text-[#374151]">
                  <span className="font-medium">Legal Basis:</span> {row.legal_basis}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-[#6b7280]">
                <span className="font-medium">Violation:</span>{" "}
                {VIOLATION_LABEL[row.violation_type] ?? row.violation_type}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">Created: {formatDate(row.created_at)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/enforcement/actions/${row.id}`}
                  className="rounded bg-[#e5e7eb] px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#d1d5db]"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setApproveModal({ id: row.id, companyName: row.company_name });
                    setApprovalNotes("");
                  }}
                  className="rounded bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#059669]"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setRejectModal({ id: row.id, companyName: row.company_name });
                    setRejectionReason("");
                  }}
                  className="rounded bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#dc2626]"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve modal */}
      {approveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-labelledby="approve-modal-title"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="approve-modal-title" className="text-lg font-semibold text-[#111827]">
              Approve enforcement action
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Approve this action for {approveModal.companyName}. Approval notes (min {MIN_APPROVAL_NOTES} characters)
              are required for audit.
            </p>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Enter approval notes (min 50 characters)..."
              rows={4}
              className="mt-3 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
              aria-label="Approval notes"
            />
            <p className="mt-1 text-xs text-[#6b7280]">
              {approvalNotes.trim().length} / {MIN_APPROVAL_NOTES} characters
            </p>
            {actionError && (
              <p className="mt-2 text-sm text-[#b91c1c]" role="alert">
                {actionError}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setApproveModal(null);
                  setApprovalNotes("");
                  setActionError(null);
                }}
                className="rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={submitting || approvalNotes.trim().length < MIN_APPROVAL_NOTES}
                className="rounded bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#059669] disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Confirm Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-labelledby="reject-modal-title"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="reject-modal-title" className="text-lg font-semibold text-[#111827]">
              Reject enforcement action
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Reject this action for {rejectModal.companyName}. Rejection reason (min {MIN_REJECTION_REASON}{" "}
              characters) is required and will be sent to the creator (Tier 2 officer).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (min 20 characters)..."
              rows={4}
              className="mt-3 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm text-[#111827]"
              aria-label="Rejection reason"
            />
            <p className="mt-1 text-xs text-[#6b7280]">
              {rejectionReason.trim().length} / {MIN_REJECTION_REASON} characters
            </p>
            {actionError && (
              <p className="mt-2 text-sm text-[#b91c1c]" role="alert">
                {actionError}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectionReason("");
                  setActionError(null);
                }}
                className="rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={submitting || rejectionReason.trim().length < MIN_REJECTION_REASON}
                className="rounded bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#dc2626] disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
