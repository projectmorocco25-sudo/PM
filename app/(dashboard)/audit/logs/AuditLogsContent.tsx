"use client";

/**
 * Wireframe: task-0.5.1.32-audit-logs-list.md
 * Audit logs list: filters, compliance banner, table, pagination, Export.
 * API: shared_get_audit_logs. Table: audit_logs. MOH/Auditors only.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuditLogs, type AuditLogRow } from "@/hooks/use-audit-logs";
import { ChevronDown, ChevronUp, FileSearch, Info } from "lucide-react";

const TABLE_OPTIONS = [
  { value: "", label: "All tables" },
  { value: "companies", label: "Companies" },
  { value: "products", label: "Products" },
  { value: "skus", label: "SKUs" },
  { value: "registry_submissions", label: "Registry submissions" },
  { value: "users", label: "Users" },
  { value: "notifications", label: "Notifications" },
];

function formatTs(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "medium" });
}

function ActionBadge({ op }: { op: string }) {
  const green = ["create", "approve"].includes(op?.toLowerCase());
  const red = ["delete", "reject"].includes(op?.toLowerCase());
  const orange = ["execute"].includes(op?.toLowerCase());
  const blue = ["update"].includes(op?.toLowerCase());
  const style = green
    ? "bg-[#dcfce7] text-[#166534]"
    : red
      ? "bg-[#fee2e2] text-[#991b1b]"
      : orange
        ? "bg-[#fef3c7] text-[#b45309]"
        : blue
          ? "bg-[#dbeafe] text-[#1e40af]"
          : "bg-[#f3f4f6] text-[#374151]";
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${style}`}>
      {op ?? "—"}
    </span>
  );
}

export function AuditLogsContent() {
  const { user } = useSession();
  const { data: perms } = usePermissions(user);
  const canView = perms && !("error" in perms) && perms.permissions?.includes("view_audit_logs");

  const [tableFilter, setTableFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);

  const { items, total, status, error, refetch } = useAuditLogs(
    tableFilter,
    null,
    startDate,
    endDate,
    offset
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (r) =>
        (r.reason ?? "").toLowerCase().includes(q) ||
        (r.operation_type ?? "").toLowerCase().includes(q) ||
        (r.table_name ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.floor(offset / pageSize) + 1;

  if (!canView) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Logs</span>
        </nav>
        <div className="rounded-lg border border-[#f59e0b] bg-[#fffbeb] p-6 text-[#92400e]">
          <p className="font-medium">Access denied</p>
          <p className="mt-1 text-sm">You do not have permission to view audit logs.</p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Logs</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Audit Logs</h1>
        <div className="h-64 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]" aria-hidden />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Logs</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Audit Logs</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load audit logs.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
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
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Logs</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Audit Logs</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/audit/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            Export
          </Link>
          <label htmlFor="audit-table-filter" className="sr-only">Filter by table</label>
          <select
            id="audit-table-filter"
            value={tableFilter ?? ""}
            onChange={(e) => { setTableFilter(e.target.value || null); setOffset(0); }}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827]"
          >
            {TABLE_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>{o.label}</option>
            ))}
          </select>
          <label htmlFor="audit-start-date" className="sr-only">Start date</label>
          <input
            id="audit-start-date"
            type="date"
            value={startDate ?? ""}
            onChange={(e) => { setStartDate(e.target.value || null); setOffset(0); }}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827]"
          />
          <label htmlFor="audit-end-date" className="sr-only">End date</label>
          <input
            id="audit-end-date"
            type="date"
            value={endDate ?? ""}
            onChange={(e) => { setEndDate(e.target.value || null); setOffset(0); }}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827]"
          />
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] w-40"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] overflow-hidden">
        <button
          type="button"
          onClick={() => setBannerCollapsed((c) => !c)}
          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#dbeafe]/50"
          aria-expanded={!bannerCollapsed}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[#1e40af]">
            <Info className="h-5 w-5" aria-hidden />
            Regulatory compliance
          </span>
          {bannerCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
        {!bannerCollapsed && (
          <div className="border-t border-[#bfdbfe] px-4 py-3 text-sm text-[#1e40af] space-y-1">
            <p>Data retention: 7 years minimum (Law No. 09-08). All logs retained. Deletion operations log old_values.</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        {status === "empty" || filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
            <FileSearch className="h-16 w-16 text-[#9ca3af]" aria-hidden />
            <p className="text-base font-medium text-[#6b7280]">No audit logs found</p>
            <p className="text-sm text-[#9ca3af]">Try adjusting filters or date range.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] uppercase tracking-wide text-[#6b7280]">
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Table</th>
                  <th className="px-4 py-3 font-semibold">Record</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 text-[#111827]">{formatTs(r.created_at)}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.user_id ? String(r.user_id).slice(0, 8) + "…" : "System"}</td>
                    <td className="px-4 py-3"><ActionBadge op={r.operation_type} /></td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.table_name ?? "—"}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.record_id ? String(r.record_id).slice(0, 8) + "…" : "—"}</td>
                    <td className="px-4 py-3 text-[#6b7280] max-w-[200px] truncate">{r.reason ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/audit/logs/${r.id}`}
                        className="font-medium text-[#2563eb] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e5e7eb] px-4 py-3">
                <button
                  type="button"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - pageSize))}
                  className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-[#6b7280]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={offset + pageSize >= total}
                  onClick={() => setOffset(offset + pageSize)}
                  className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
