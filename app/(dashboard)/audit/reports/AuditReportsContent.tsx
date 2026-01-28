"use client";

/**
 * Wireframe: task-0.5.1.34-audit-reports.md
 * Audit reports: Generate Report modal, filters, compliance notice, download.
 * API: shared_generate_audit_report. Table: audit_logs. MOH/Auditors only.
 */

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";
import { useGenerateAuditReport, type AuditLogRow } from "@/hooks/use-audit-logs";

const TABLE_OPTIONS = [
  { value: "", label: "All tables" },
  { value: "companies", label: "Companies" },
  { value: "products", label: "Products" },
  { value: "skus", label: "SKUs" },
  { value: "registry_submissions", label: "Registry submissions" },
  { value: "users", label: "Users" },
];

function downloadCsv(rows: AuditLogRow[], generatedAt: string) {
  const headers = ["id", "user_id", "operation_type", "table_name", "record_id", "reason", "created_at"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const cells = [
      r.id,
      r.user_id ?? "",
      (r.operation_type ?? "").replace(/"/g, '""'),
      (r.table_name ?? "").replace(/"/g, '""'),
      r.record_id ?? "",
      (r.reason ?? "").replace(/"/g, '""'),
      r.created_at ?? "",
    ];
    lines.push(cells.map((c) => `"${c}"`).join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-report-${generatedAt.slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AuditReportsContent() {
  const { user } = useSession();
  const { data: perms } = usePermissions(user);
  const canView = perms && !("error" in perms) && perms.permissions?.includes("view_audit_logs");

  const [modalOpen, setModalOpen] = useState(false);
  const [tableFilter, setTableFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [format, setFormat] = useState<"csv" | "pdf">("csv");

  const { data, status, error, generate } = useGenerateAuditReport(
    tableFilter,
    null,
    startDate,
    endDate
  );
  const [lastFilters, setLastFilters] = useState<{ start: string | null; end: string | null; table: string | null }>({ start: null, end: null, table: null });

  const handleGenerate = async () => {
    await generate();
    setLastFilters({ start: startDate, end: endDate, table: tableFilter });
    setModalOpen(false);
  };

  const handleDownload = () => {
    if (!data?.data) return;
    if (format === "csv") downloadCsv(data.data, data.generated_at ?? new Date().toISOString());
  };

  if (!canView) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Reports</span>
        </nav>
        <div className="rounded-lg border border-[#f59e0b] bg-[#fffbeb] p-6 text-[#92400e]">
          <p className="font-medium">Access denied.</p>
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
        <span className="text-[#111827]">Reports</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Audit Reports</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
        >
          Generate Report
        </button>
      </div>

      {data && (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#111827]">Generated Report</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Date range: {lastFilters.start ?? "—"} to {lastFilters.end ?? "—"}
            {lastFilters.table ? ` · Table: ${lastFilters.table}` : ""} · Generated: {data.generated_at ? new Date(data.generated_at).toLocaleString() : "—"}
          </p>
          <p className="mt-1 text-sm text-[#6b7280]">Total records: {data.total ?? 0}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              Download CSV
            </button>
          </div>
        </div>
      )}

      {!data && status !== "loading" && (
        <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-8 text-center">
          <p className="text-[#6b7280]">No report generated yet. Use &ldquo;Generate Report&rdquo; to create one.</p>
        </div>
      )}

      {modalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#111827]">Generate Report</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="report-table" className="block text-sm font-medium text-[#374151]">Table</label>
                <select
                  id="report-table"
                  value={tableFilter ?? ""}
                  onChange={(e) => setTableFilter(e.target.value || null)}
                  className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm"
                >
                  {TABLE_OPTIONS.map((o) => (
                    <option key={o.value || "all"} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="report-start" className="block text-sm font-medium text-[#374151]">Start date</label>
                  <input
                    id="report-start"
                    type="date"
                    value={startDate ?? ""}
                    onChange={(e) => setStartDate(e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="report-end" className="block text-sm font-medium text-[#374151]">End date</label>
                  <input
                    id="report-end"
                    type="date"
                    value={endDate ?? ""}
                    onChange={(e) => setEndDate(e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium text-[#374151]">Format</span>
                <div className="mt-1 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={format === "csv"} onChange={() => setFormat("csv")} />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={format === "pdf"} onChange={() => setFormat("pdf")} />
                    <span className="text-sm">PDF</span>
                  </label>
                </div>
              </div>
              <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e40af]">
                <p>Reports comply with Law No. 09-08 (CNDP) and DMP regulations. Retention: 7 years minimum.</p>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-[#ef4444]">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={status === "loading"}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {status === "loading" ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
