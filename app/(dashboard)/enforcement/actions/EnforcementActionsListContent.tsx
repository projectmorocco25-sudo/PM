"use client";

/**
 * Wireframe: task-0.5.2.1-enforcement-actions-list.md
 * Route: /enforcement/actions
 * Implements: Enforcement Actions list — search bar, filters (Action Type, Status, Company, Date Range), table (Type, Company, Violation, Legal Basis, Amount, Status, Date), Load More, status indicators.
 * Task: 1.1.2.38
 * API: enforcement_list_actions (hosted Supabase only). MOH Tier 1 and Tier 2 only.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

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

const STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending Approval",
  pending_approval: "Pending Approval",
  executed: "Executed",
  appealed: "Appealed",
  resolved: "Resolved",
  cancelled: "Cancelled",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending_review: "bg-[#fbbf24] text-[#111827]",
  pending_approval: "bg-[#fbbf24] text-[#111827]",
  executed: "bg-[#10b981] text-white",
  appealed: "bg-[#f97316] text-white",
  resolved: "bg-[#3b82f6] text-white",
  cancelled: "bg-[#6b7280] text-white",
};

export type EnforcementActionRow = {
  id: string;
  company_id: string;
  company_name: string;
  action_type: string;
  violation_type: string;
  legal_basis: string;
  amount: number | null;
  currency: string;
  status: string;
  executed_at: string | null;
  created_at: string;
  updated_at: string;
};

type EnforcementActionsListContentProps = {
  rows: EnforcementActionRow[];
  total: number;
  search: string;
  typeFilter: string;
  statusFilter: string;
  companyFilter: string;
  dateFilter: string;
  offset: number;
  pageSize: number;
  companies: { id: string; name: string }[];
  error: string | null;
};

export function EnforcementActionsListContent({
  rows,
  total,
  search,
  typeFilter,
  statusFilter,
  companyFilter,
  dateFilter,
  offset,
  pageSize,
  companies,
  error,
}: EnforcementActionsListContentProps) {
  const router = useRouter();

  function buildQueryString(updates: {
    search?: string;
    type?: string;
    status?: string;
    company?: string;
    date?: string;
    offset?: string;
  }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined && updates.search) next.set("search", updates.search);
    else if (search) next.set("search", search);
    if (updates.type !== undefined && updates.type !== "all") next.set("type", updates.type);
    else if (typeFilter && typeFilter !== "all") next.set("type", typeFilter);
    if (updates.status !== undefined && updates.status !== "all") next.set("status", updates.status);
    else if (statusFilter && statusFilter !== "all") next.set("status", statusFilter);
    if (updates.company !== undefined && updates.company) next.set("company", updates.company);
    else if (companyFilter) next.set("company", companyFilter);
    if (updates.date !== undefined && updates.date !== "all") next.set("date", updates.date);
    else if (dateFilter && dateFilter !== "all") next.set("date", dateFilter);
    if (updates.offset !== undefined && updates.offset !== "0") next.set("offset", updates.offset);
    else if (offset > 0) next.set("offset", String(offset));
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, offset: "0" });
    router.push(`/enforcement/actions${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(
    type: "type" | "status" | "company" | "date",
    value: string
  ) {
    const key = type === "type" ? "type" : type === "status" ? "status" : type === "company" ? "company" : "date";
    const qs = buildQueryString({ [key]: value || (type === "company" ? "" : "all"), offset: "0" });
    router.push(`/enforcement/actions${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/enforcement/actions");
  }

  function loadMore() {
    const nextOffset = offset + pageSize;
    const qs = buildQueryString({ offset: String(nextOffset) });
    router.push(`/enforcement/actions?${qs}`);
  }

  function formatRelative(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  }

  const statusDisplay = (s: string) => STATUS_LABEL[s] ?? s.replace(/_/g, " ");
  const violationDisplay = (v: string) => VIOLATION_LABEL[v] ?? v.replace(/_/g, " ");
  const hasMore = rows.length + offset < total;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + rows.length, total);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">Unable to load enforcement actions.</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[#111827]">Enforcement Actions</h1>
        <Link
          href="/enforcement/actions/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
        >
          New Action
        </Link>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Filters sidebar — wireframe: 240px desktop, drawer on mobile */}
        <aside className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60">
          <h2 className="mb-3 text-sm font-medium text-[#374151]">Filters</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6b7280]">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="mt-1 w-full rounded border border-[#e5e7eb] px-2 py-1.5 text-sm"
                aria-label="Action type filter"
              >
                <option value="all">All</option>
                <option value="warning">Warning</option>
                <option value="fine">Fine</option>
                <option value="suspension">Suspension</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280]">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="mt-1 w-full rounded border border-[#e5e7eb] px-2 py-1.5 text-sm"
                aria-label="Status filter"
              >
                <option value="all">All</option>
                <option value="pending">Pending Approval</option>
                <option value="executed">Executed</option>
                <option value="appealed">Appealed</option>
                <option value="resolved">Resolved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280]">Company</label>
              <select
                value={companyFilter}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="mt-1 w-full rounded border border-[#e5e7eb] px-2 py-1.5 text-sm"
                aria-label="Company filter"
              >
                <option value="">All</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280]">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                className="mt-1 w-full rounded border border-[#e5e7eb] px-2 py-1.5 text-sm"
                aria-label="Date range filter"
              >
                <option value="all">All</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 w-full rounded border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            Clear
          </button>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          {/* Search bar — wireframe: full-width, placeholder "Search actions..." */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search actions..."
              className="flex-1 rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              aria-label="Search actions"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#f3f4f6] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#e5e7eb]"
              aria-label="Search"
            >
              🔍
            </button>
          </form>

          {/* Table — wireframe: Type, Company, Violation, Legal Basis, Amount, Status, Date */}
          {rows.length === 0 ? (
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-12 text-center">
              <p className="text-[#374151]">
                {total === 0 && !search && !companyFilter && typeFilter === "all" && statusFilter === "all" && dateFilter === "all"
                  ? "No enforcement actions found"
                  : "No actions match your filters"}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {total === 0 && !search && !companyFilter && typeFilter === "all" && statusFilter === "all" && dateFilter === "all"
                  ? "Create your first enforcement action to get started"
                  : "Try clearing filters or changing your search"}
              </p>
              {(total === 0 && !search && !companyFilter && typeFilter === "all" && statusFilter === "all" && dateFilter === "all") ? (
                <Link
                  href="/enforcement/actions/new"
                  className="mt-4 inline-flex rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
                >
                  New Action
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <tr>
                      <th className="px-4 py-3 font-medium text-[#374151]">Type</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Company</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Violation</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Legal Basis</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Amount</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Status</th>
                      <th className="px-4 py-3 font-medium text-[#374151]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => router.push(`/enforcement/actions/${row.id}`)}
                        className="cursor-pointer border-b border-[#e5e7eb] hover:bg-[#f9fafb]"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/enforcement/actions/${row.id}`);
                          }
                        }}
                        aria-label={`View action ${row.id}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-[#111827]">
                            {ACTION_TYPE_ICON[row.action_type] ?? "—"} {ACTION_TYPE_LABEL[row.action_type] ?? row.action_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/rmm/companies/${row.company_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#2563eb] hover:underline"
                          >
                            {row.company_name || "—"}
                          </Link>
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-[#374151]" title={violationDisplay(row.violation_type)}>
                          {violationDisplay(row.violation_type) || "—"}
                        </td>
                        <td className="max-w-[140px] truncate px-4 py-3 text-[#374151]" title={row.legal_basis}>
                          {row.legal_basis || "—"}
                        </td>
                        <td className="px-4 py-3 text-[#374151]">
                          {row.action_type === "fine" && row.amount != null
                            ? `${Number(row.amount).toLocaleString()} ${row.currency}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[row.status] ?? "bg-[#e5e7eb] text-[#374151]"}`}
                          >
                            {statusDisplay(row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {formatRelative(row.executed_at ?? row.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-[#6b7280]">
                Showing {from}–{to} of {total} actions
              </p>

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
