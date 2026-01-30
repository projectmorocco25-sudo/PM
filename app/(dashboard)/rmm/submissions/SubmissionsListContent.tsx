"use client";

/**
 * Wireframe: task-0.5.2.11-registry-submission-list.md
 * Route: /rmm/submissions
 * Implements: Registry submission list — breadcrumbs, title (My Submissions / All Submissions),
 *   filters (Status, Type, Date Range), Submission Deadlines banner (DMP Art. 10), table with
 *   Entity, Type, Status, Date, Deadline, Actions; Load More.
 * Task: 1.1.2.26
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

export type SubmissionRow = {
  id: string;
  submission_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_display_name: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  days_until_deadline: number | null;
};

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

const ENTITY_LABELS: Record<string, string> = {
  company: "Company",
  product: "Product",
  sku: "SKU",
};

function statusBadgeClass(status: string): string {
  switch (status) {
    case "draft":
      return "bg-[#6b7280] text-white";
    case "submitted":
      return "bg-[#3b82f6] text-white";
    case "tier2_verified":
    case "tier2_peer_reviewed":
      return "bg-[#eab308] text-[#1f2937]";
    case "tier1_approved":
    case "tier2_implemented":
    case "completed":
      return "bg-[#16a34a] text-white";
    case "rejected":
      return "bg-[#dc2626] text-white";
    default:
      return "bg-[#6b7280] text-white";
  }
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

type SubmissionsListContentProps = {
  submissions: SubmissionRow[];
  total: number;
  viewType: "company" | "moh";
  statusFilter: string;
  typeFilter: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
  error: string | null;
};

export function SubmissionsListContent({
  submissions,
  total,
  viewType,
  statusFilter,
  typeFilter,
  dateFrom,
  dateTo,
  page,
  pageSize,
  error,
}: SubmissionsListContentProps) {
  const router = useRouter();
  const hasMore = page * pageSize < total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function buildQueryString(updates: {
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
  }) {
    const next = new URLSearchParams();
    if (updates.status !== undefined && updates.status) next.set("status", updates.status);
    else if (statusFilter) next.set("status", statusFilter);
    if (updates.type !== undefined && updates.type) next.set("type", updates.type);
    else if (typeFilter) next.set("type", typeFilter);
    if (updates.dateFrom !== undefined && updates.dateFrom) next.set("dateFrom", updates.dateFrom);
    else if (dateFrom) next.set("dateFrom", dateFrom);
    if (updates.dateTo !== undefined && updates.dateTo) next.set("dateTo", updates.dateTo);
    else if (dateTo) next.set("dateTo", dateTo);
    if (updates.page !== undefined && updates.page > 1) next.set("page", String(updates.page));
    return next.toString();
  }

  function handleFilterChange(
    key: "status" | "type",
    value: string
  ) {
    const qs = buildQueryString({ [key]: value, page: 1 });
    router.push(`/rmm/submissions${qs ? `?${qs}` : ""}`);
  }

  function handleDateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const from = (form.elements.namedItem("dateFrom") as HTMLInputElement | null)?.value ?? "";
    const to = (form.elements.namedItem("dateTo") as HTMLInputElement | null)?.value ?? "";
    const qs = buildQueryString({ dateFrom: from, dateTo: to, page: 1 });
    router.push(`/rmm/submissions${qs ? `?${qs}` : ""}`);
  }

  function loadMore() {
    const qs = buildQueryString({ page: page + 1 });
    router.push(`/rmm/submissions${qs ? `?${qs}` : ""}`);
  }

  const hasFilters = !!(statusFilter || typeFilter || dateFrom || dateTo);

  if (error) {
    return (
      <div className="space-y-6">
        <RmmPageBreadcrumbs />
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

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Submissions</span>
      </nav>

      <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
        {viewType === "company" ? "My Submissions" : "All Submissions"}
      </h1>

      {/* Filters Bar — wireframe: Status, Type, Date Range */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="filter-status" className="sr-only">Status</label>
            <select
              id="filter-status"
              value={statusFilter || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="tier2_verified">Tier 2 Verified</option>
              <option value="tier1_approved">Tier 1 Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="sr-only">Type</label>
            <select
              id="filter-type"
              value={typeFilter || "all"}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="all">All Types</option>
              <option value="company">Company</option>
              <option value="product">Product</option>
              <option value="sku">SKU</option>
            </select>
          </div>
          <form onSubmit={handleDateSubmit} className="flex items-center gap-2">
            <label htmlFor="dateFrom" className="sr-only">Date from</label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              defaultValue={dateFrom}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
            <span className="text-[#6b7280]">–</span>
            <label htmlFor="dateTo" className="sr-only">Date to</label>
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              defaultValue={dateTo}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
            <button
              type="submit"
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {/* Submission Deadlines Banner — Fatima's requirement, DMP Art. 10 */}
      <div className="rounded-lg border border-[#93c5fd] bg-[#eff6ff] p-4" role="region" aria-label="Submission deadlines">
        <p className="font-medium text-[#1e40af]">Submission Deadlines</p>
        <p className="mt-1 text-sm text-[#1e3a8a]">
          Regulatory: DMP Regulation Article 10 – Registry Submission Requirements
        </p>
        <Link
          href="/docs/regulatory-framework"
          className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline"
        >
          View Regulatory Framework
        </Link>
      </div>

      {/* Submissions Table */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white">
        {submissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-[#111827]">
              {hasFilters ? "No submissions match your filters" : "No submissions yet"}
            </p>
            <p className="mt-1 text-sm text-[#6b7280]">
              {hasFilters ? "Try clearing filters." : "Submissions will appear here when created."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Registry submissions">
                <thead>
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">Entity</th>
                    <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Type</th>
                    <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Status</th>
                    <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Date</th>
                    <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Deadline</th>
                    <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {submissions.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f9fafb]">
                      <td className="py-3 pl-4 pr-3">
                        <span className="font-medium text-[#111827]">{row.entity_display_name ?? "—"}</span>
                        <span className="ml-1 text-[#6b7280]">({ENTITY_LABELS[row.entity_type] ?? row.entity_type})</span>
                      </td>
                      <td className="py-3 px-3 text-[#111827]">
                        {TYPE_LABELS[row.submission_type] ?? row.submission_type}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
                          {STATUS_LABELS[row.status] ?? row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#6b7280]">{formatRelativeTime(row.created_at)}</td>
                      <td className="py-3 px-3">
                        {row.days_until_deadline != null ? (
                          row.days_until_deadline <= 3 ? (
                            <span className="text-[#dc2626]" title="Regulatory: DMP Art. 10">⚠️ {row.days_until_deadline}d</span>
                          ) : row.days_until_deadline <= 7 ? (
                            <span className="text-[#ca8a04]" title="Regulatory: DMP Art. 10">🟡 {row.days_until_deadline}d</span>
                          ) : (
                            <span className="text-[#16a34a]" title="Regulatory: DMP Art. 10">✓ {row.days_until_deadline}d</span>
                          )
                        ) : row.status === "completed" || row.status === "rejected" ? (
                          <span className="text-[#6b7280]">—</span>
                        ) : (
                          <span className="text-[#16a34a]" title="Regulatory: DMP Art. 10">✓ On-time</span>
                        )}
                        <span className="ml-1 text-xs text-[#6b7280]">Regulatory: DMP Art.10</span>
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right">
                        <Link
                          href={`/rmm/submissions/${row.id}`}
                          className="font-medium text-[#2563eb] hover:underline"
                        >
                          View
                        </Link>
                        <span className="mx-1 text-[#9ca3af]">|</span>
                        <Link
                          href={`/rmm/submissions/${row.id}`}
                          className="font-medium text-[#2563eb] hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(hasMore || page > 1) && (
              <div className="border-t border-[#e5e7eb] p-4 text-center">
                <p className="text-xs text-[#6b7280] mb-2">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
                </p>
                {hasMore && (
                  <button
                    type="button"
                    onClick={loadMore}
                    className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RmmPageBreadcrumbs() {
  return (
    <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
      <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
      <span className="mx-1 text-[#9ca3af]">/</span>
      <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
      <span className="mx-1 text-[#9ca3af]">/</span>
      <span className="text-[#111827] font-medium">Submissions</span>
    </nav>
  );
}
