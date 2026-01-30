"use client";

/**
 * Wireframe: task-0.5.2.1d-enforcement-reports.md
 * Route: /enforcement/reports
 * Implements: Enforcement Reports — analytics, trends, action type breakdown, company compliance, fine analysis, appeal stats. MOH Tier 1 and Tier 2 only.
 * Task: 1.1.2.42
 * API: enforcement_get_reports, enforcement_get_analytics (hosted Supabase only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

const VIOLATION_LABEL: Record<string, string> = {
  submission_non_compliance: "Submission Non-Compliance",
  threshold_breach: "Threshold Breach",
  critical_medicine_non_compliance: "Critical Medicine Non-Compliance",
  export_violation: "Export Violation",
  data_quality_issue: "Data Quality Issue",
  repeated_offender: "Repeated Offender",
};

type ReportsData = {
  total_actions?: number;
  previous_period_total?: number;
  trend_pct?: number;
  by_action_type?: { warning?: number; fine?: number; suspension?: number };
  by_violation_type?: { violation_type: string; count: number }[];
  compliance?: {
    legal_basis_pct?: number;
    legal_basis_count?: number;
    total_count?: number;
    deadline_pct?: number;
    legal_authority_pct?: number;
    legal_authority_count?: number;
  };
  top_companies?: { company_id: string; company_name: string; action_count: number }[];
  fine_analysis?: { total_fines?: number; average_fine?: number; highest_fine?: number; fine_count?: number };
  appeal_stats?: { total_appeals?: number; upheld_count?: number; rejected_count?: number };
};

type AnalyticsData = {
  trends?: { month: string; month_label: string; warning?: number; fine?: number; suspension?: number; total?: number }[];
  fines_by_month?: { month_label: string; total_amount?: number; count?: number }[];
};

type EnforcementReportsContentProps = {
  reports: ReportsData | null;
  analytics: AnalyticsData | null;
  dateParam: string;
  error: string | null;
};

const DATE_OPTIONS = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "12m", label: "Last 12 Months" },
];

export function EnforcementReportsContent({
  reports,
  analytics,
  dateParam,
  error,
}: EnforcementReportsContentProps) {
  const router = useRouter();
  const currentDate = dateParam?.toLowerCase() || "30d";

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-[#b91c1c]">
        <p className="font-medium">Unable to load enforcement reports</p>
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

  const totalActions = reports?.total_actions ?? 0;
  const trendPct = reports?.trend_pct ?? 0;
  const byType = reports?.by_action_type ?? { warning: 0, fine: 0, suspension: 0 };
  const byViolation = reports?.by_violation_type ?? [];
  const compliance = reports?.compliance ?? {};
  const topCompanies = reports?.top_companies ?? [];
  const fineAnalysis = reports?.fine_analysis ?? {};
  const appealStats = reports?.appeal_stats ?? {};
  const trends = analytics?.trends ?? [];

  const isEmpty = totalActions === 0 && byType.warning === 0 && byType.fine === 0 && byType.suspension === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[#111827]">Enforcement Reports</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6b7280]">Export:</span>
          <button
            type="button"
            className="rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
            aria-label="Export report (PDF)"
          >
            PDF
          </button>
          <button
            type="button"
            className="rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
            aria-label="Export report (Excel)"
          >
            Excel
          </button>
          <button
            type="button"
            className="rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
            aria-label="Export report (CSV)"
          >
            CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[#374151]">Date Range:</span>
        {DATE_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`/enforcement/reports?date=${opt.value}`}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              currentDate === opt.value
                ? "bg-[#2563eb] text-white"
                : "bg-[#e5e7eb] text-[#374151] hover:bg-[#d1d5db]"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="text-lg font-medium text-[#111827]">No enforcement data for selected period</p>
          <p className="mt-1 text-sm text-[#6b7280]">Change the date range to see reports.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <h2 className="text-sm font-medium text-[#6b7280]">Total Actions</h2>
              <p className="mt-1 text-3xl font-bold text-[#111827]">{totalActions}</p>
              <p className={`mt-1 text-sm ${trendPct >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {trendPct >= 0 ? "↗" : "↘"} {trendPct >= 0 ? "+" : ""}
                {trendPct}% vs previous period
              </p>
            </div>
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <h2 className="text-sm font-medium text-[#6b7280]">By Action Type</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#111827]">
                <li>Warning: {byType.warning ?? 0}</li>
                <li>Fine: {byType.fine ?? 0}</li>
                <li>Suspension: {byType.suspension ?? 0}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <h2 className="text-sm font-medium text-[#6b7280]">By Violation Type</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#111827]">
                {byViolation.length === 0 ? (
                  <li className="text-[#6b7280]">—</li>
                ) : (
                  byViolation.map((v) => (
                    <li key={v.violation_type}>
                      {VIOLATION_LABEL[v.violation_type] ?? v.violation_type}: {v.count}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#111827]">Regulatory Compliance Metrics</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <span className="font-medium">Legal Basis Compliance Rate:</span>{" "}
                {compliance.legal_basis_pct ?? 0}% ({compliance.legal_basis_count ?? 0}/
                {compliance.total_count ?? 0} actions)
              </li>
              <li>
                <span className="font-medium">Deadline Compliance Rate:</span>{" "}
                {compliance.deadline_pct ?? 0}% ({compliance.total_count ?? 0} actions)
              </li>
              <li>
                <span className="font-medium">Legal Authority Compliance:</span>{" "}
                {compliance.legal_authority_pct ?? 0}% ({compliance.legal_authority_count ?? 0}/
                {compliance.total_count ?? 0} actions)
              </li>
            </ul>
            <Link
              href="/enforcement/actions"
              className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
            >
              View Compliance Details
            </Link>
          </div>

          {trends.length > 0 && (
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-[#111827]">Enforcement Trends (Last 12 Months)</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-left text-[#6b7280]">
                      <th className="pb-2 pr-4">Month</th>
                      <th className="pb-2 pr-4">Warning</th>
                      <th className="pb-2 pr-4">Fine</th>
                      <th className="pb-2 pr-4">Suspension</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trends.map((t) => (
                      <tr key={t.month} className="border-b border-[#e5e7eb]">
                        <td className="py-2 pr-4 font-medium">{t.month_label}</td>
                        <td className="py-2 pr-4">{t.warning ?? 0}</td>
                        <td className="py-2 pr-4">{t.fine ?? 0}</td>
                        <td className="py-2 pr-4">{t.suspension ?? 0}</td>
                        <td className="py-2">{t.total ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {topCompanies.length > 0 && (
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-[#111827]">Top Companies by Enforcement Actions</h2>
              <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-[#111827]">
                {topCompanies.slice(0, 5).map((c, i) => (
                  <li key={c.company_id}>
                    {c.company_name} — {c.action_count} actions
                  </li>
                ))}
              </ol>
              <Link
                href="/enforcement/actions"
                className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View All Companies
              </Link>
            </div>
          )}

          <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#111827]">Fine Amount Analysis</h2>
            <ul className="mt-3 space-y-1 text-sm text-[#111827]">
              <li>
                <span className="font-medium">Total Fines:</span>{" "}
                {Number(fineAnalysis.total_fines ?? 0).toLocaleString()} MAD
              </li>
              <li>
                <span className="font-medium">Average Fine:</span>{" "}
                {Number(fineAnalysis.average_fine ?? 0).toLocaleString()} MAD
              </li>
              <li>
                <span className="font-medium">Highest Fine:</span>{" "}
                {Number(fineAnalysis.highest_fine ?? 0).toLocaleString()} MAD
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#111827]">Appeal Statistics</h2>
            <ul className="mt-3 space-y-1 text-sm text-[#111827]">
              <li>
                <span className="font-medium">Total Appeals:</span> {appealStats.total_appeals ?? 0}
              </li>
              <li>
                <span className="font-medium">Upheld:</span> {appealStats.upheld_count ?? 0}{" "}
                ({appealStats.total_appeals ? Math.round(((appealStats.upheld_count ?? 0) / appealStats.total_appeals) * 100) : 0}
                %)
              </li>
              <li>
                <span className="font-medium">Rejected:</span> {appealStats.rejected_count ?? 0}{" "}
                ({appealStats.total_appeals ? Math.round(((appealStats.rejected_count ?? 0) / appealStats.total_appeals) * 100) : 0}
                %)
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
