"use client";

/**
 * Wireframe: task-0.5.2.1a-enforcement-action-detail.md
 * Route: /enforcement/actions/[id]
 * Implements: Enforcement Action detail — Enforcement Cycle Status, Action Information, Approval Chain, Appeal Status, Related Information. Tabs: Details, History, Appeal.
 * Task: 1.1.2.39
 * API: enforcement_get_action, enforcement_get_action_history, enforcement_get_appeal_status (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md
 */

import Link from "next/link";
import { useState } from "react";

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

const ROLE_LABEL: Record<string, string> = {
  tier1: "MOH Tier 1",
  tier2_officer: "MOH Tier 2 Officer",
  tier2_registrar: "MOH Tier 2 Registrar",
  auditor: "MOH Auditor",
  system_admin: "System Admin",
  company_admin: "Company Admin",
  company_user: "Company User",
  company_manager: "Company Manager",
};

const APPROVAL_TYPE_LABEL: Record<string, string> = {
  submit: "Submitted",
  review: "Reviewed",
  approval: "Approved",
  execute: "Executed",
};

type EnforcementActionDetailContentProps = {
  action: Record<string, unknown> | null;
  companyName: string;
  createdByName: string;
  createdByRole: string;
  reviewedByName: string;
  reviewedByRole: string;
  approvedByName: string;
  approvedByRole: string;
  executedByName: string;
  executedByRole: string;
  history: unknown[];
  appeal: Record<string, unknown> | null;
  appealWindowRemaining: number | null;
  executedAt: string | null;
  isMOH: boolean;
  isCompanyUser: boolean;
  canReviewAppeal?: boolean;
  actionId: string;
};

export function EnforcementActionDetailContent({
  action,
  companyName,
  createdByName,
  createdByRole,
  reviewedByName,
  reviewedByRole,
  approvedByName,
  approvedByRole,
  executedByName,
  executedByRole,
  history,
  appeal,
  appealWindowRemaining,
  isMOH,
  isCompanyUser,
  actionId,
}: EnforcementActionDetailContentProps) {
  const [activeTab, setActiveTab] = useState<"details" | "history" | "appeal">("details");

  if (!action) return null;

  const companyId = String(action.company_id ?? "");
  const actionType = String(action.action_type ?? "");
  const violationType = String(action.violation_type ?? "");
  const status = String(action.status ?? "");
  const legalBasis = String(action.legal_basis ?? "");
  const justification = String(action.justification ?? "");
  const amount = action.amount != null ? Number(action.amount) : null;
  const currency = String(action.currency ?? "MAD");
  const violationRefId = action.violation_reference_id != null ? String(action.violation_reference_id) : null;
  const violationRefTable = action.violation_reference_table != null ? String(action.violation_reference_table) : null;
  const createdAt = action.created_at != null ? String(action.created_at) : "";
  const reviewedAt = action.reviewed_at != null ? String(action.reviewed_at) : null;
  const approvedAt = action.approved_at != null ? String(action.approved_at) : null;
  const executedAtAction = action.executed_at != null ? String(action.executed_at) : null;

  function formatRelative(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  }

  const title = `${ACTION_TYPE_ICON[actionType] ?? ""} ${ACTION_TYPE_LABEL[actionType] ?? actionType} - ${VIOLATION_LABEL[violationType] ?? violationType}`.trim();

  const cycleStages = [
    { key: "creation", label: "Creation", done: ["pending_review", "pending_approval", "approved", "executed", "appealed", "resolved"].includes(status) || status === "draft" },
    { key: "review", label: "Review", done: ["pending_approval", "approved", "executed", "appealed", "resolved"].includes(status) },
    { key: "approval", label: "Approval", done: ["approved", "executed", "appealed", "resolved"].includes(status) },
    { key: "execution", label: "Execution", done: ["executed", "appealed", "resolved"].includes(status) },
    { key: "appeal", label: "Appeal", done: status === "appealed" || status === "resolved" },
    { key: "resolution", label: "Resolution", done: status === "resolved" },
  ];

  const canShowSubmitAppeal = isCompanyUser && status === "executed" && !appeal && appealWindowRemaining != null && appealWindowRemaining > 0;
  const historyRows = history as Array<{ approval_type?: string; from_status?: string; to_status?: string; approver_name?: string; approver_role?: string; comments?: string; created_at?: string }>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[#111827]" style={{ fontSize: "24px" }}>
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {isMOH && ["draft", "pending_review", "pending_approval"].includes(status) && (
            <Link
              href={`/enforcement/actions/${actionId}/edit`}
              className="inline-flex items-center rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              Edit
            </Link>
          )}
          {canReviewAppeal && (
            <Link
              href={`/enforcement/actions/${actionId}/appeal/review`}
              className="inline-flex items-center justify-center rounded-lg bg-[#10b981] px-4 py-2 text-sm font-medium text-white hover:bg-[#059669]"
            >
              Review Appeal
            </Link>
          )}
          {canShowSubmitAppeal && (
            <Link
              href={`/enforcement/actions/${actionId}/appeal`}
              className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              Submit Appeal
            </Link>
          )}
        </div>
      </div>

      {/* Enforcement Cycle Status — wireframe: Creation → Review → Approval → Execution → Appeal → Resolution */}
      <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" aria-labelledby="cycle-status-heading">
        <h2 id="cycle-status-heading" className="mb-3 text-sm font-semibold text-[#374151]">
          Enforcement Cycle Status
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {cycleStages.map((stage, i) => (
            <span key={stage.key} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#9ca3af]">→</span>}
              <span className={stage.done ? "text-[#10b981]" : "text-[#9ca3af]"}>{stage.done ? "✓" : "—"}</span>
              <span className={stage.done ? "text-[#111827]" : "text-[#6b7280]"}>{stage.label}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-[#6b7280]">
          Current Stage: {status.replace(/_/g, " ")}
          {executedAtAction && status === "executed" && !appeal && appealWindowRemaining != null && (
            <> · Appeal Window: {appealWindowRemaining} days remaining</>
          )}
        </p>
        {executedAtAction && (
          <p className="mt-1 text-sm text-[#6b7280]">Executed: {formatRelative(executedAtAction)}</p>
        )}
      </section>

      {/* Tabs: Details | History | Appeal */}
      <div className="border-b border-[#e5e7eb]">
        <nav className="flex gap-4" aria-label="Detail tabs">
          {["details", "history", "appeal"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as "details" | "history" | "appeal")}
              className={`border-b-2 px-2 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-[#6b7280] hover:border-[#9ca3af] hover:text-[#374151]"
              }`}
              aria-selected={activeTab === tab}
              aria-controls={`tab-${tab}`}
              id={`tab-${tab}`}
            >
              {tab === "details" ? "Details" : tab === "history" ? "History" : "Appeal"}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "details" && (
        <>
          {/* Action Information — wireframe: Action Type, Company, Violation, Legal Basis, Justification */}
          <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" id="tab-details" aria-labelledby="action-info-heading">
            <h2 id="action-info-heading" className="mb-3 text-sm font-semibold text-[#374151]">
              Action Information
            </h2>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-[#6b7280] font-medium">Action Type</dt>
                <dd className="text-[#111827]">{ACTION_TYPE_ICON[actionType]} {ACTION_TYPE_LABEL[actionType] ?? actionType}</dd>
              </div>
              <div>
                <dt className="text-[#6b7280] font-medium">Company</dt>
                <dd>
                  <Link href={`/rmm/companies/${companyId}`} className="text-[#2563eb] hover:underline">
                    {companyName || "—"}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-[#6b7280] font-medium">Violation Type</dt>
                <dd className="text-[#111827]">{VIOLATION_LABEL[violationType] ?? violationType}</dd>
              </div>
              {(violationRefId || violationRefTable) && (
                <div>
                  <dt className="text-[#6b7280] font-medium">Violation Reference</dt>
                  <dd className="text-[#111827]">{violationRefTable ?? ""} {violationRefId ? `#${violationRefId.slice(0, 8)}` : ""}</dd>
                </div>
              )}
              <div>
                <dt className="text-[#6b7280] font-medium">Legal Basis</dt>
                <dd className="text-[#111827]">{legalBasis || "—"}</dd>
              </div>
              {actionType === "fine" && amount != null && (
                <div>
                  <dt className="text-[#6b7280] font-medium">Amount</dt>
                  <dd className="text-[#111827]">{amount.toLocaleString()} {currency}</dd>
                </div>
              )}
              <div>
                <dt className="text-[#6b7280] font-medium">Justification</dt>
                <dd className="text-[#111827] whitespace-pre-wrap max-w-2xl">{justification || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* Approval Chain — wireframe: Created by, Reviewed by, Approved by, Executed by */}
          <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" aria-labelledby="approval-chain-heading">
            <h2 id="approval-chain-heading" className="mb-3 text-sm font-semibold text-[#374151]">
              Approval Chain
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-[#6b7280]">Created by:</span>{" "}
                <span className="text-[#111827]">{createdByName || "—"} {createdByRole ? `(${ROLE_LABEL[createdByRole] ?? createdByRole})` : ""}</span>
                <br />
                <span className="text-[#6b7280]">Created: {formatRelative(createdAt)}</span>
              </li>
              {(reviewedByName || reviewedAt) && (
                <li>
                  <span className="text-[#6b7280]">Reviewed by:</span>{" "}
                  <span className="text-[#111827]">{reviewedByName || "—"} {reviewedByRole ? `(${ROLE_LABEL[reviewedByRole] ?? reviewedByRole})` : ""}</span>
                  <br />
                  <span className="text-[#6b7280]">Reviewed: {formatRelative(reviewedAt)}</span>
                </li>
              )}
              {(approvedByName || approvedAt) && (
                <li>
                  <span className="text-[#6b7280]">Approved by:</span>{" "}
                  <span className="text-[#111827]">{approvedByName || "—"} {approvedByRole ? `(${ROLE_LABEL[approvedByRole] ?? approvedByRole})` : ""}</span>
                  <br />
                  <span className="text-[#6b7280]">Approved: {formatRelative(approvedAt)}</span>
                </li>
              )}
              {(executedByName || executedAtAction) && (
                <li>
                  <span className="text-[#6b7280]">Executed by:</span>{" "}
                  <span className="text-[#111827]">{executedByName || "System"} {executedByRole ? `(${ROLE_LABEL[executedByRole] ?? executedByRole})` : ""}</span>
                  <br />
                  <span className="text-[#6b7280]">Executed: {formatRelative(executedAtAction)}</span>
                </li>
              )}
            </ul>
          </section>

          {/* Appeal Status — wireframe: No Appeal / appeal window remaining; Submit Appeal (company only) */}
          <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" aria-labelledby="appeal-status-heading">
            <h2 id="appeal-status-heading" className="mb-3 text-sm font-semibold text-[#374151]">
              Appeal Status
            </h2>
            {appeal ? (
              <div className="space-y-2 text-sm">
                <p><span className="text-[#6b7280]">Status:</span> <span className="text-[#111827]">{String(appeal.status ?? "").replace(/_/g, " ")}</span></p>
                {appeal.submitted_at != null && <p><span className="text-[#6b7280]">Submitted:</span> {formatRelative(String(appeal.submitted_at))}</p>}
                {appeal.appeal_reason != null && <p className="text-[#111827]">{String(appeal.appeal_reason)}</p>}
                {appeal.resolution != null && <p><span className="text-[#6b7280]">Resolution:</span> {String(appeal.resolution)}</p>}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-[#111827]">No Appeal</p>
                {appealWindowRemaining != null && status === "executed" && (
                  <>
                    <p className="text-[#6b7280]">Appeal Window: {appealWindowRemaining} days remaining (30-day window)</p>
                    <p className="text-[#6b7280]">Appeal period: 30 calendar days from execution date (per DMP regulations)</p>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Related Information — wireframe: Violation link, Company link, Related actions, Audit log */}
          <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-3 text-sm font-semibold text-[#374151]">
              Related Information
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <Link href={`/rmm/companies/${companyId}`} className="text-[#2563eb] hover:underline">
                  Company: {companyName || "—"}
                </Link>
              </li>
              <li>
                <Link href="/enforcement/actions" className="text-[#2563eb] hover:underline">
                  All enforcement actions
                </Link>
              </li>
            </ul>
          </section>
        </>
      )}

      {activeTab === "history" && (
        <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" id="tab-history" aria-labelledby="history-heading">
          <h2 id="history-heading" className="mb-3 text-sm font-semibold text-[#374151]">
            History
          </h2>
          <ul className="space-y-2 text-sm">
            {historyRows.length === 0 ? (
              <li className="text-[#6b7280]">No approval history yet.</li>
            ) : (
              historyRows.map((row, i) => (
                <li key={i}>
                  <span className="text-[#111827]">{APPROVAL_TYPE_LABEL[row.approval_type ?? ""] ?? row.approval_type}</span>
                  {row.approver_name && <> by {row.approver_name}</>}
                  {row.created_at && <> — {formatRelative(row.created_at)}</>}
                  {row.comments && <p className="mt-1 text-[#6b7280]">{row.comments}</p>}
                </li>
              ))
            )}
          </ul>
        </section>
      )}

      {activeTab === "appeal" && (
        <section className="rounded-lg border border-[#e5e7eb] bg-white p-4" id="tab-appeal" aria-labelledby="appeal-tab-heading">
          <h2 id="appeal-tab-heading" className="mb-3 text-sm font-semibold text-[#374151]">
            Appeal
          </h2>
          {appeal ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-[#6b7280]">Status:</span> {String(appeal.status ?? "").replace(/_/g, " ")}</p>
              <p><span className="text-[#6b7280]">Submitted:</span> {appeal.submitted_at != null ? formatRelative(String(appeal.submitted_at)) : "—"}</p>
              <p><span className="text-[#6b7280]">Reason:</span></p>
              <p className="text-[#111827] whitespace-pre-wrap">{String(appeal.appeal_reason ?? "")}</p>
              {appeal.resolution != null && <p><span className="text-[#6b7280]">Resolution:</span> {String(appeal.resolution)}</p>}
              {canReviewAppeal && (
                <p className="mt-3">
                  <Link href={`/enforcement/actions/${actionId}/appeal/review`} className="text-[#2563eb] hover:underline font-medium">
                    Review Appeal →
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div className="text-sm text-[#6b7280]">
              No appeal submitted.
              {canShowSubmitAppeal && (
                <p className="mt-2">
                  <Link href={`/enforcement/actions/${actionId}/appeal`} className="text-[#2563eb] hover:underline">
                    Submit Appeal
                  </Link> (within {appealWindowRemaining} days)
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
