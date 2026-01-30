"use client";

/**
 * Wireframe: task-0.5.2.12-registry-submission-detail.md
 * Route: /rmm/submissions/[id]
 * Implements: Registry submission detail — workflow status, submission data, approval history timeline,
 *   regulatory deadline tracking (DMP Art. 10), regulatory checklist (Fatima), MOH action buttons.
 * Task: 1.1.2.27
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md
 */

import Link from "next/link";
import { SubmissionWorkflowActions } from "./SubmissionWorkflowActions";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  tier2_verified: "Tier 2 Verified",
  tier2_peer_reviewed: "Tier 2 Verified",
  tier1_approved: "Tier 1 Approved",
  tier2_implemented: "Tier 2 Implemented",
  completed: "Completed",
  rejected: "Rejected",
};

const WORKFLOW_STEPS = [
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "tier2_verified", label: "Tier 2 Verified" },
  { id: "tier1_approved", label: "Tier 1 Approved" },
  { id: "tier2_implemented", label: "Tier 2 Implemented" },
  { id: "completed", label: "Completed" },
] as const;

const ENTITY_LABELS: Record<string, string> = {
  company: "Company",
  product: "Product",
  sku: "SKU",
};

const TYPE_LABELS: Record<string, string> = {
  company_create: "Create",
  company_update: "Update",
  company_delete: "Delete",
  product_create: "Create",
  product_update: "Update",
  product_delete: "Delete",
  sku_create: "Create",
  sku_update: "Update",
  sku_delete: "Delete",
};

export type SubmissionDetailSubmission = {
  id: string;
  submission_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_display_name: string | null;
  submission_data: Record<string, unknown> | null;
  status: string;
  submitted_by: string;
  verified_by: string | null;
  verified_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  implemented_by: string | null;
  implemented_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string | null;
  days_until_deadline: number | null;
  view_type: "company" | "moh";
  allowed_actions: string[];
};

export type SubmissionDetailHistoryItem = {
  id: string;
  from_status: string;
  to_status: string;
  approval_type: string;
  comments: string | null;
  created_at: string;
  approver_name: string | null;
  approver_role: string | null;
};

type SubmissionDetailContentProps = {
  submission: SubmissionDetailSubmission;
  history: SubmissionDetailHistoryItem[];
  submissionId: string;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return "—";
  }
}

function relativeTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(iso);
  } catch {
    return "—";
  }
}

function stepReached(stepId: string, currentStatus: string): boolean {
  const order = ["draft", "submitted", "tier2_verified", "tier2_peer_reviewed", "tier1_approved", "tier2_implemented", "completed"];
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepId);
  if (currentStatus === "rejected") return stepIdx <= order.indexOf("submitted");
  return stepIdx <= currentIdx;
}

export function SubmissionDetailContent({
  submission,
  history,
  submissionId,
}: SubmissionDetailContentProps) {
  const title = `Registry Submission - ${submission.entity_display_name ?? submission.entity_type} ${TYPE_LABELS[submission.submission_type] ?? submission.submission_type}`;

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/submissions" className="text-[#2563eb] hover:underline">Submissions</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium truncate max-w-[12rem] sm:max-w-none" title={submissionId}>
          {submission.entity_display_name ?? submissionId.slice(0, 8)}
        </span>
      </nav>

      <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">{title}</h1>

      {/* Workflow Status — wireframe: horizontal timeline, current status badge, regulatory deadline */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Workflow Status</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          {WORKFLOW_STEPS.map((step, i) => (
            <span key={step.id} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#9ca3af]">→</span>}
              <span className={stepReached(step.id, submission.status) ? "font-medium text-[#111827]" : "text-[#9ca3af]"}>
                {step.label}
              </span>
              {stepReached(step.id, submission.status) && <span className="text-[#16a34a]" aria-hidden>✓</span>}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-[#6b7280]">
          Current Status: <span className="font-medium text-[#111827]">{STATUS_LABELS[submission.status] ?? submission.status}</span>
        </p>
        <div className="mt-3 rounded bg-[#eff6ff] p-3 text-sm">
          <p className="font-medium text-[#1e40af]">Regulatory Deadline Tracking (DMP Art. 10)</p>
          {submission.days_until_deadline != null ? (
            <p className="mt-1 text-[#1e3a8a]">
              {submission.days_until_deadline <= 3 ? "⚠️" : submission.days_until_deadline <= 7 ? "🟡" : "✓"}{" "}
              {submission.days_until_deadline}d remaining — Regulatory: DMP Art. 10
            </p>
          ) : submission.status === "completed" || submission.status === "rejected" ? (
            <p className="mt-1 text-[#6b7280]">—</p>
          ) : (
            <p className="mt-1 text-[#16a34a]">✓ On-time — Regulatory: DMP Art. 10</p>
          )}
        </div>
      </div>

      {/* Submission Data — wireframe: Entity Type, Entity name, Action, Changes */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Submission Data</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#6b7280]">Entity Type</dt>
            <dd className="mt-0.5 text-[#111827]">{ENTITY_LABELS[submission.entity_type] ?? submission.entity_type}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Entity</dt>
            <dd className="mt-0.5 text-[#111827]">{submission.entity_display_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Action</dt>
            <dd className="mt-0.5 text-[#111827]">{TYPE_LABELS[submission.submission_type] ?? submission.submission_type}</dd>
          </div>
        </dl>
        {submission.submission_data && Object.keys(submission.submission_data).length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-[#6b7280]">Changes / Data</p>
            <div className="mt-1 rounded border border-[#e5e7eb] bg-[#f9fafb] p-3 font-mono text-xs text-[#111827]">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(submission.submission_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Approval History — wireframe: vertical timeline */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Approval History</h2>
        <p className="mt-1 text-xs text-[#6b7280]">Regulatory Basis: DMP Art. 10 — Registry Approval</p>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-[#6b7280]">No approval history yet.</p>
        ) : (
          <ul className="mt-4 space-y-4 border-l-2 border-[#e5e7eb] pl-4" aria-label="Approval history timeline">
            {history.map((item) => (
              <li key={item.id} className="relative -left-[21px]">
                <span className="absolute left-0 h-2.5 w-2.5 rounded-full bg-[#3b82f6]" aria-hidden />
                <div className="pl-4">
                  <p className="text-sm font-medium text-[#111827]">
                    {item.to_status === "tier2_verified" || item.to_status === "tier2_peer_reviewed"
                      ? "Tier 2 Verified"
                      : item.to_status === "tier1_approved"
                        ? "Tier 1 Approved"
                        : item.to_status === "tier2_implemented"
                          ? "Tier 2 Implemented"
                          : item.to_status === "completed"
                            ? "Completed"
                            : item.to_status === "rejected"
                              ? "Rejected"
                              : item.to_status}
                    {item.approver_name && ` by ${item.approver_name}`}
                    {item.approver_role && ` (${item.approver_role})`}
                    {" — "}
                    {relativeTime(item.created_at)}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b7280]">Regulatory: DMP Art. 10</p>
                  {item.comments && <p className="mt-1 text-xs text-[#6b7280]">{item.comments}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Regulatory Requirement Checklist — Fatima's requirement */}
      <div className="rounded-lg border border-[#93c5fd] bg-[#eff6ff] p-4">
        <h2 className="text-sm font-semibold text-[#1e40af]">Regulatory Requirement Checklist (DMP Art. 10)</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#1e3a8a]">
          <li className="flex items-center gap-2">☑ Legal Basis Verified: DMP Art. 10</li>
          <li className="flex items-center gap-2">☑ Legal Authority Verified: Tier 1 Approval Authority</li>
          <li className="flex items-center gap-2">☑ Regulatory Requirements Met</li>
          <li className="flex items-center gap-2">☑ Compliance Verification Complete</li>
        </ul>
        <Link
          href="/docs/regulatory-framework"
          className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
        >
          View Regulatory Framework
        </Link>
      </div>

      {/* Workflow action buttons + modals — task-0.5.2.13; Verify, Approve, Implement, Reject (Task 1.1.2.28) */}
      {submission.view_type === "moh" && submission.allowed_actions.length > 0 && (
        <SubmissionWorkflowActions
          submissionId={submissionId}
          allowedActions={submission.allowed_actions}
        />
      )}
    </div>
  );
}
