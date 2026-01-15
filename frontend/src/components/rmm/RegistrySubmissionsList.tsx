"use client";

// Wireframe binding: /rmm/submissions -> docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md

import { useMemo, useState } from "react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { statusBadgeVariant } from "@/components/rmm/WorkflowStatusIndicator";
import { useRegistrySubmissions } from "@/hooks/useRegistrySubmissions";
import { useUserRole } from "@/hooks/useUserRole";

type RegistrySubmissionRow = {
  id: string;
  company_id: string | null;
  submission_type: string;
  entity_type: "company" | "product" | "sku";
  entity_id: string | null;
  submission_data: unknown;
  status:
    | "draft"
    | "submitted"
    | "tier2_verified"
    | "tier2_peer_reviewed"
    | "tier1_approved"
    | "tier2_implemented"
    | "completed"
    | "rejected";
  created_at: string;
  submitted_at: string | null;
};

function prettyStatus(status: RegistrySubmissionRow["status"]) {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "tier2_verified":
      return "Tier 2 Verified";
    case "tier2_peer_reviewed":
      return "Tier 2 Peer Reviewed";
    case "tier1_approved":
      return "Tier 1 Approved";
    case "tier2_implemented":
      return "Tier 2 Implemented";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}

function prettyChangeType(submissionType: string): "Create" | "Update" | "Delete" | "—" {
  if (submissionType.endsWith("_create")) return "Create";
  if (submissionType.endsWith("_update")) return "Update";
  if (submissionType.endsWith("_delete")) return "Delete";
  return "—";
}

function entityLabel(row: RegistrySubmissionRow): string {
  // Best-effort display: use name from submission_data if present; fallback to entity_id.
  const data = (row.submission_data ?? {}) as Record<string, unknown>;
  const name =
    (typeof data.name === "string" && data.name) ||
    (typeof (data.company_name as unknown) === "string" && (data.company_name as string)) ||
    (typeof (data.product_name as unknown) === "string" && (data.product_name as string)) ||
    (typeof (data.sku_name as unknown) === "string" && (data.sku_name as string));
  if (name) return name;
  return row.entity_id ?? row.id;
}

export function RegistrySubmissionsList() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const q = useRegistrySubmissions();

  const [status, setStatus] = useState<"all" | RegistrySubmissionRow["status"]>("all");
  const [entityType, setEntityType] = useState<"all" | RegistrySubmissionRow["entity_type"]>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const rows = useMemo(() => (q.data ?? []) as RegistrySubmissionRow[], [q.data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate + "T00:00:00Z").getTime() : null;
    const to = toDate ? new Date(toDate + "T23:59:59Z").getTime() : null;

    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (entityType !== "all" && r.entity_type !== entityType) return false;

      const ts = new Date((r.submitted_at ?? r.created_at) as string).getTime();
      if (from !== null && ts < from) return false;
      if (to !== null && ts > to) return false;

      if (!s) return true;
      const label = entityLabel(r).toLowerCase();
      return (
        label.includes(s) ||
        r.entity_type.toLowerCase().includes(s) ||
        r.submission_type.toLowerCase().includes(s) ||
        prettyStatus(r.status).toLowerCase().includes(s)
      );
    });
  }, [entityType, fromDate, rows, search, status, toDate]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-900">{isMOHUser ? "All Submissions" : "My Submissions"}</div>
          <div className="mt-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search submissions..." aria-label="Search submissions" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="tier2_verified">Tier 2 Verified</option>
            <option value="tier2_peer_reviewed">Tier 2 Peer Reviewed</option>
            <option value="tier1_approved">Tier 1 Approved</option>
            <option value="tier2_implemented">Tier 2 Implemented</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as typeof entityType)}
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="company">Company</option>
            <option value="product">Product</option>
            <option value="sku">SKU</option>
          </select>

          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} aria-label="From date" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} aria-label="To date" />
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              setStatus("all");
              setEntityType("all");
              setFromDate("");
              setToDate("");
              setSearch("");
              setVisibleCount(pageSize);
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {q.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : q.isError ? (
          <div className="text-sm text-zinc-600">
            Unable to load submissions.{" "}
            <button type="button" className="text-blue-700 hover:underline" onClick={() => void q.refetch()}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-zinc-600">{rows.length === 0 ? "No submissions found." : "No submissions match your filters."}</div>
        ) : (
          <>
            <div className="mb-2 text-sm text-zinc-600">
              Showing 1-{shown.length} of {filtered.length} submissions
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold text-zinc-700">
                    <th className="border-b border-zinc-200 px-3 py-2">Entity</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Type</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Date</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50">
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <div className="text-sm font-medium text-zinc-900">{entityLabel(row)}</div>
                        <div className="text-xs text-zinc-600">{row.entity_type.toUpperCase()}</div>
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{prettyChangeType(row.submission_type)}</td>
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <Badge variant={statusBadgeVariant(row.status)}>{prettyStatus(row.status)}</Badge>
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">
                        {new Date(row.submitted_at ?? row.created_at).toLocaleString()}
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/submissions/${row.id}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 md:hidden">
              {shown.map((row) => (
                <div key={row.id} className="rounded-md border border-zinc-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{entityLabel(row)}</div>
                      <div className="mt-1 text-xs text-zinc-600">
                        {row.entity_type.toUpperCase()} • {prettyChangeType(row.submission_type)}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant={statusBadgeVariant(row.status)}>{prettyStatus(row.status)}</Badge>
                        <Badge variant="secondary">{new Date(row.submitted_at ?? row.created_at).toLocaleDateString()}</Badge>
                      </div>
                    </div>
                    <Link className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50" href={`/rmm/submissions/${row.id}`}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {shown.length < filtered.length ? (
              <div className="mt-4">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + pageSize)}>
                  Load More
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

