"use client";

/**
 * Wireframe: task-0.5.1.33-audit-log-detail.md
 * Audit log detail: action, table, record, user, timestamp, old/new values, hash chain, compliance.
 * API: shared_get_audit_log_detail. Table: audit_logs. MOH/Auditors only.
 */

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuditLogDetail, type AuditLogDetail as Detail } from "@/hooks/use-audit-logs";

function ActionBadge({ op }: { op: string }) {
  const green = ["create", "approve"].includes(op?.toLowerCase());
  const red = ["delete", "reject"].includes(op?.toLowerCase());
  const orange = ["execute"].includes(op?.toLowerCase());
  const style = green ? "bg-[#dcfce7] text-[#166534]" : red ? "bg-[#fee2e2] text-[#991b1b]" : orange ? "bg-[#fef3c7] text-[#b45309]" : "bg-[#dbeafe] text-[#1e40af]";
  return <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${style}`}>{op ?? "—"}</span>;
}

export function AuditLogDetailContent({ id }: { id: string }) {
  const { user } = useSession();
  const { data: perms } = usePermissions(user);
  const canView = perms && !("error" in perms) && perms.permissions?.includes("view_audit_logs");
  const { data, status, error } = useAuditLogDetail(id);
  const [oldExpanded, setOldExpanded] = useState(false);
  const [newExpanded, setNewExpanded] = useState(false);

  if (!canView) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Logs</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Log Detail</span>
        </nav>
        <div className="rounded-lg border border-[#f59e0b] bg-[#fffbeb] p-6 text-[#92400e]">
          <p className="font-medium">Access denied.</p>
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
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Logs</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Log Detail</span>
        </nav>
        <div className="h-64 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]" aria-hidden />
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Logs</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Log Detail</span>
        </nav>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load audit log.</p>
          <p className="mt-1 text-sm">{error ?? "Not found"}</p>
          <Link href="/audit/logs" className="mt-4 inline-block rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]">
            Back to Logs
          </Link>
        </div>
      </div>
    );
  }

  const d = data as Detail;
  const ts = d.created_at ? new Date(d.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" }) : "—";

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Audit</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/audit/logs" className="text-[#2563eb] hover:underline">Logs</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Log Detail</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Audit Log Entry</h1>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Action</p>
            <p className="mt-0.5"><ActionBadge op={d.operation_type} /></p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Table</p>
            <p className="mt-0.5 text-[#111827]">{d.table_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Record ID</p>
            <p className="mt-0.5 font-mono text-sm text-[#111827]">{d.record_id ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">User</p>
            <p className="mt-0.5 text-[#111827]">{d.user_id ? String(d.user_id) : "System"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Timestamp</p>
            <p className="mt-0.5 text-[#111827]">{ts}</p>
          </div>
        </div>
        {d.reason && (
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Reason</p>
            <p className="mt-0.5 text-[#111827]">{d.reason}</p>
          </div>
        )}

        {d.old_values != null && typeof d.old_values === "object" && Object.keys(d.old_values as Record<string, unknown>).length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setOldExpanded((e) => !e)}
              className="flex items-center gap-2 text-sm font-semibold text-[#111827]"
            >
              Old Values (Preserved for Audit) {oldExpanded ? "▼" : "▶"}
            </button>
            {oldExpanded && (
              <pre className="mt-2 overflow-auto rounded border border-[#e5e7eb] bg-[#f9fafb] p-3 text-xs text-[#374151]">
                {JSON.stringify(d.old_values, null, 2)}
              </pre>
            )}
            <p className="mt-1 text-xs text-[#6b7280]">Retained 7 years (Law No. 09-08).</p>
          </div>
        )}

        {d.new_values != null && typeof d.new_values === "object" && Object.keys(d.new_values as Record<string, unknown>).length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setNewExpanded((e) => !e)}
              className="flex items-center gap-2 text-sm font-semibold text-[#111827]"
            >
              New Values {newExpanded ? "▼" : "▶"}
            </button>
            {newExpanded && (
              <pre className="mt-2 overflow-auto rounded border border-[#e5e7eb] bg-[#f9fafb] p-3 text-xs text-[#374151]">
                {JSON.stringify(d.new_values, null, 2)}
              </pre>
            )}
          </div>
        )}

        {d.previous_hash != null && (
          <div>
            <p className="text-xs font-semibold uppercase text-[#6b7280]">Hash chain</p>
            <p className="mt-0.5 font-mono text-xs text-[#6b7280]">Previous: {String(d.previous_hash).slice(0, 16)}…</p>
            <p className="mt-0.5 font-mono text-xs text-[#6b7280]">Current: {String(d.current_hash ?? "").slice(0, 16)}…</p>
          </div>
        )}

        <div className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e40af]">
          <p>Data retention: 7 years minimum (Law No. 09-08). Audit data is immutable.</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            href="/audit/logs"
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            Back to Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
