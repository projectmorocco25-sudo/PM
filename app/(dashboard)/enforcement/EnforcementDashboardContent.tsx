"use client";

/**
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md
 * Route: /enforcement
 * Implements: Enforcement Dashboard — metrics, recent actions, pending approvals, compliance widget, action type breakdown.
 * Task: 1.1.2.37
 * API: enforcement_get_dashboard_stats, enforcement_list_recent_actions, enforcement_list_pending_approvals (hosted Supabase only). MOH only.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

const ACTION_TYPE_LABEL: Record<string, string> = {
  warning: "Warning",
  fine: "Fine",
  suspension: "Suspension",
};

const ACTION_BADGE_CLASS: Record<string, string> = {
  warning: "bg-[#fbbf24] text-[#111827]",
  fine: "bg-[#f97316] text-white",
  suspension: "bg-[#dc2626] text-white",
};

type Stats = {
  recent_count: number;
  pending_count: number;
  warnings: number;
  fines: number;
  suspensions: number;
  total: number;
  legal_basis_compliance_pct: number;
  deadline_compliance_pct: number;
  regulatory_requirements_pct: number;
};

type RecentRow = {
  id: string;
  company_id: string;
  company_name: string;
  action_type: string;
  violation_type: string;
  status: string;
  amount: number | null;
  currency: string;
  legal_basis: string;
  executed_at: string | null;
  updated_at: string;
};

type PendingRow = {
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

type EnforcementDashboardContentProps = {
  stats: Stats | null;
  recentActions: RecentRow[];
  pendingApprovals: PendingRow[];
  error: string | null;
};

export function EnforcementDashboardContent({
  stats,
  recentActions,
  pendingApprovals,
  error,
}: EnforcementDashboardContentProps) {
  const router = useRouter();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">{error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 rounded-md border border-[#dc2626] bg-white px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const s = stats ?? {
    recent_count: 0,
    pending_count: 0,
    warnings: 0,
    fines: 0,
    suspensions: 0,
    total: 0,
    legal_basis_compliance_pct: 100,
    deadline_compliance_pct: 100,
    regulatory_requirements_pct: 100,
  };
  const warningPct = s.total > 0 ? Math.round((100 * s.warnings) / s.total) : 0;
  const finePct = s.total > 0 ? Math.round((100 * s.fines) / s.total) : 0;
  const suspensionPct = s.total > 0 ? Math.round((100 * s.suspensions) / s.total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-[24px]">
          Enforcement Dashboard
        </h1>
        <Link
          href="/enforcement/actions/new"
          className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
        >
          New Action
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-h-[200px] rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-[#6b7280]">Recent Actions</h2>
          <p className="mt-2 text-3xl font-bold text-[#111827]" aria-live="polite">
            {s.recent_count}
          </p>
          <ul className="mt-4 space-y-2" aria-label="Recent enforcement actions">
            {recentActions.slice(0, 5).map((row) => (
              <li key={row.id}>
                <Link
                  href={`/enforcement/actions/${row.id}`}
                  className="block rounded p-2 text-sm hover:bg-[#f9fafb]"
                >
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${ACTION_BADGE_CLASS[row.action_type] ?? "bg-[#6b7280] text-white"}`}
                  >
                    {ACTION_TYPE_LABEL[row.action_type] ?? row.action_type}
                  </span>
                  <span className="ml-2 text-[#111827]">
                    {row.company_name}
                    {row.amount != null && row.action_type === "fine" ? ` — ${row.amount} ${row.currency}` : ""}
                  </span>
                  <span className="ml-2 text-[#6b7280]">
                    {row.executed_at
                      ? formatRelative(row.executed_at)
                      : formatRelative(row.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/enforcement/actions"
            className="mt-3 block text-sm text-[#2563eb] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="min-h-[200px] rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-[#6b7280]">Pending Approvals</h2>
          <p className="mt-2 text-3xl font-bold text-[#dc2626]" aria-live="polite">
            {s.pending_count}
          </p>
          <ul className="mt-4 space-y-2" aria-label="Pending approvals">
            {pendingApprovals.slice(0, 5).map((row) => (
              <li key={row.id}>
                <Link
                  href={`/enforcement/actions/${row.id}`}
                  className="block rounded p-2 text-sm hover:bg-[#f9fafb]"
                >
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${ACTION_BADGE_CLASS[row.action_type] ?? "bg-[#6b7280] text-white"}`}
                  >
                    {ACTION_TYPE_LABEL[row.action_type] ?? row.action_type}
                  </span>
                  <span className="ml-2 text-[#111827]">
                    {row.company_name}
                    {row.amount != null && row.action_type === "fine" ? ` — ${row.amount} ${row.currency}` : ""}
                  </span>
                  {row.legal_basis && (
                    <span className="ml-2 text-[#6b7280]">{row.legal_basis}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/enforcement/pending-approvals"
            className="mt-3 block text-sm text-[#2563eb] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="min-h-[200px] rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-[#6b7280]">Enforcement Metrics</h2>
          <ul className="mt-4 space-y-2 text-base font-medium text-[#111827]">
            <li>Warnings: {s.warnings}</li>
            <li>Fines: {s.fines}</li>
            <li>Suspensions: {s.suspensions}</li>
            <li>Total: {s.total}</li>
          </ul>
          <Link
            href="/enforcement/reports"
            className="mt-4 inline-block rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            View Reports
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-[#6b7280]">Regulatory Compliance Widget</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className={complianceColor(s.legal_basis_compliance_pct)}>
            <p className="text-sm font-medium">Legal Basis Compliance</p>
            <p className="text-2xl font-bold">{s.legal_basis_compliance_pct}%</p>
            <p className="text-xs">({Math.round((s.legal_basis_compliance_pct / 100) * s.total)}/{s.total} actions)</p>
          </div>
          <div className={complianceColor(s.deadline_compliance_pct)}>
            <p className="text-sm font-medium">Deadline Compliance</p>
            <p className="text-2xl font-bold">{s.deadline_compliance_pct}%</p>
            <p className="text-xs">({Math.round((s.deadline_compliance_pct / 100) * s.total)}/{s.total} actions)</p>
          </div>
          <div className={complianceColor(s.regulatory_requirements_pct)}>
            <p className="text-sm font-medium">Regulatory Requirements</p>
            <p className="text-2xl font-bold">{s.regulatory_requirements_pct}%</p>
            <p className="text-xs">({Math.round((s.regulatory_requirements_pct / 100) * s.total)}/{s.total} actions)</p>
          </div>
        </div>
        <Link
          href="/enforcement/reports"
          className="mt-4 inline-block text-sm text-[#2563eb] hover:underline"
        >
          View Compliance Details
        </Link>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-[#6b7280]">Action Type Breakdown</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#fef3c7] bg-[#fef3c7] p-4">
            <p className="text-sm font-medium text-[#111827]">⚠️ Warning</p>
            <p className="text-2xl font-bold text-[#111827]">{s.warnings}</p>
            <p className="text-sm text-[#6b7280]">({warningPct}%)</p>
          </div>
          <div className="rounded-lg border border-[#fed7aa] bg-[#fed7aa] p-4">
            <p className="text-sm font-medium text-[#111827]">💰 Fine</p>
            <p className="text-2xl font-bold text-[#111827]">{s.fines}</p>
            <p className="text-sm text-[#6b7280]">({finePct}%)</p>
          </div>
          <div className="rounded-lg border border-[#fee2e2] bg-[#fee2e2] p-4">
            <p className="text-sm font-medium text-[#111827]">🚫 Suspension</p>
            <p className="text-2xl font-bold text-[#111827]">{s.suspensions}</p>
            <p className="text-sm text-[#6b7280]">({suspensionPct}%)</p>
          </div>
        </div>
        <Link
          href="/enforcement/reports"
          className="mt-4 inline-block text-sm text-[#2563eb] hover:underline"
        >
          View Detailed Breakdown
        </Link>
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

function complianceColor(pct: number): string {
  if (pct >= 90) return "rounded-lg border border-[#dcfce7] bg-[#dcfce7] p-4";
  if (pct >= 70) return "rounded-lg border border-[#fef9c3] bg-[#fef9c3] p-4";
  return "rounded-lg border border-[#fecaca] bg-[#fecaca] p-4";
}
