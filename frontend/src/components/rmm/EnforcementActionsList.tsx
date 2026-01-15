"use client";

// Wireframe binding: docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompanies } from "@/hooks/useCompanies";
import { useEnforcementActions } from "@/hooks/useEnforcementActions";
import { useUserRole } from "@/hooks/useUserRole";

type EnforcementActionRow = {
  id: string;
  company_id: string;
  action_type: "warning" | "fine" | "suspension";
  violation_type: string;
  status: string;
  amount: number | null;
  created_at: string;
  executed_at: string | null;
};

function actionTypeBadgeVariant(actionType: "warning" | "fine" | "suspension"): "warning" | "destructive" | "secondary" {
  if (actionType === "warning") return "warning";
  if (actionType === "fine") return "destructive";
  return "secondary";
}

function statusBadgeVariant(status: string): "default" | "secondary" | "success" | "destructive" | "warning" {
  if (status === "draft") return "secondary";
  if (status === "pending_review" || status === "pending_approval") return "warning";
  if (status === "approved") return "default";
  if (status === "executed") return "success";
  if (status === "cancelled" || status === "rejected") return "destructive";
  return "secondary";
}

export function EnforcementActionsList({ companyId }: { companyId?: string }) {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const actionsQ = useEnforcementActions(companyId);
  const companiesQ = useCompanies();

  const [search, setSearch] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState<"all" | "warning" | "fine" | "suspension">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const actions = useMemo(() => (actionsQ.data ?? []) as EnforcementActionRow[], [actionsQ.data]);
  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);

  const companyNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of companies) m.set(c.id, c.name);
    return m;
  }, [companies]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return actions.filter((row) => {
      if (actionTypeFilter !== "all" && row.action_type !== actionTypeFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (companyFilter !== "all" && row.company_id !== companyFilter) return false;

      if (!s) return true;
      const companyName = companyNameById.get(row.company_id) ?? "";
      return companyName.toLowerCase().includes(s) || row.violation_type.toLowerCase().includes(s);
    });
  }, [actions, actionTypeFilter, companyFilter, companyNameById, search, statusFilter]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enforcement actions..."
            aria-label="Search enforcement actions"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={actionTypeFilter === "all" ? "default" : "outline"} onClick={() => setActionTypeFilter("all")}>
            All Types
          </Button>
          <Button variant={actionTypeFilter === "warning" ? "default" : "outline"} onClick={() => setActionTypeFilter("warning")}>
            Warnings
          </Button>
          <Button variant={actionTypeFilter === "fine" ? "default" : "outline"} onClick={() => setActionTypeFilter("fine")}>
            Fines
          </Button>
          <Button variant={actionTypeFilter === "suspension" ? "default" : "outline"} onClick={() => setActionTypeFilter("suspension")}>
            Suspensions
          </Button>

          {isMOHUser ? (
            <select
              className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              aria-label="Filter by company"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : null}

          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setActionTypeFilter("all");
              setStatusFilter("all");
              setCompanyFilter("all");
              setVisibleCount(pageSize);
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {actionsQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : actionsQ.isError ? (
          <div className="text-sm text-zinc-600">
            Unable to load enforcement actions.{" "}
            <button type="button" className="text-blue-700 hover:underline" onClick={() => void actionsQ.refetch()}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-zinc-600">{actions.length === 0 ? "No enforcement actions found." : "No actions match your filters."}</div>
        ) : (
          <>
            <div className="mb-2 text-sm text-zinc-600">
              Showing 1-{shown.length} of {filtered.length} enforcement actions
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold text-zinc-700">
                    <th className="border-b border-zinc-200 px-3 py-2">Action Type</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Company</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Violation Type</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Amount</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Date</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50">
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <Badge variant={actionTypeBadgeVariant(row.action_type)}>{row.action_type.toUpperCase()}</Badge>
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-sm">
                        <Link className="text-blue-700 hover:underline" href={`/rmm/companies/${row.company_id}`}>
                          {companyNameById.get(row.company_id) ?? "—"}
                        </Link>
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{row.violation_type}</td>
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">
                        {row.amount ? `MAD ${row.amount.toLocaleString()}` : "—"}
                      </td>
                      <td className="border-b border-zinc-100 px-3 py-2 text-xs text-zinc-600">{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="border-b border-zinc-100 px-3 py-2">
                        <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/enforcement/actions/${row.id}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {shown.map((row) => (
                <div key={row.id} className="rounded-md border border-zinc-200 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={actionTypeBadgeVariant(row.action_type)} className="mb-2">
                        {row.action_type.toUpperCase()}
                      </Badge>
                      <div className="text-sm font-medium text-zinc-900">{companyNameById.get(row.company_id) ?? "—"}</div>
                      <div className="mt-1 text-xs text-zinc-600">{row.violation_type}</div>
                      <div className="mt-2 flex gap-2">
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                        {row.amount ? <Badge variant="secondary">MAD {row.amount.toLocaleString()}</Badge> : null}
                      </div>
                    </div>
                    <Link className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50" href={`/enforcement/actions/${row.id}`}>
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
