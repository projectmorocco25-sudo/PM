/**
 * Wireframe: task-0.5.2.1-enforcement-actions-list.md
 * Route: /enforcement/actions
 * Implements: Enforcement Actions list — search, filters (action type, status, company, date range), table, Load More, status indicators. MOH Tier 1 and Tier 2 only.
 * Task: 1.1.2.38
 * API: enforcement_list_actions, rmm_list_companies (hosted Supabase only). MOH only.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EnforcementActionsListContent } from "./EnforcementActionsListContent";

const PAGE_SIZE = 20;

export default async function EnforcementActionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; status?: string; company?: string; date?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const typeParam = params.type?.trim().toLowerCase() ?? "all";
  const statusParam = params.status?.trim().toLowerCase() ?? "all";
  const companyId = params.company?.trim() || null;
  const dateFilter = params.date?.trim().toLowerCase() ?? "all";
  const offset = Math.max(0, parseInt(params.offset ?? "0", 10) || 0);

  const actionTypes: string[] | null =
    typeParam === "all" || !typeParam
      ? null
      : typeParam === "warning"
        ? ["warning"]
        : typeParam === "fine"
          ? ["fine"]
          : typeParam === "suspension"
            ? ["suspension"]
            : null;

  let dateFrom: string | null = null;
  let dateTo: string | null = null;
  if (dateFilter === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateFrom = d.toISOString();
  } else if (dateFilter === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateFrom = d.toISOString();
  }

  const supabase = await createClient();

  const limit = offset + PAGE_SIZE;

  const [actionsRes, companiesRes] = await Promise.all([
    supabase.rpc("enforcement_list_actions", {
      p_search: search || null,
      p_action_types: actionTypes,
      p_status: statusParam === "all" ? "all" : statusParam,
      p_company_id: companyId || null,
      p_date_from: dateFrom,
      p_date_to: dateTo,
      p_limit: limit,
      p_offset: 0,
    }),
    supabase.rpc("rmm_list_companies", {
      p_limit: 500,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
  ]);

  const payload = actionsRes.data as { data?: unknown[]; total?: number; error?: string; message?: string } | null;
  const isError = payload && "error" in payload;
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));

  const error =
    actionsRes.error?.message ?? (isError && payload && "message" in payload ? String(payload.message) : null);

  const rows = list.map(normalizeRow);

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">
          Home
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/enforcement" className="text-[#2563eb] hover:underline">
          Enforcement
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Actions</span>
      </nav>

      <EnforcementActionsListContent
        rows={rows}
        total={total}
        search={search}
        typeFilter={typeParam}
        statusFilter={statusParam}
        companyFilter={companyId ?? ""}
        dateFilter={dateFilter}
        offset={offset}
        pageSize={PAGE_SIZE}
        companies={companies}
        error={error}
      />
    </div>
  );
}

function normalizeRow(r: unknown): {
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
} {
  const row = r as Record<string, unknown>;
  return {
    id: String(row?.id ?? ""),
    company_id: String(row?.company_id ?? ""),
    company_name: String(row?.company_name ?? ""),
    action_type: String(row?.action_type ?? ""),
    violation_type: String(row?.violation_type ?? ""),
    legal_basis: String(row?.legal_basis ?? ""),
    amount: row?.amount != null ? Number(row.amount) : null,
    currency: String(row?.currency ?? "MAD"),
    status: String(row?.status ?? ""),
    executed_at: row?.executed_at != null ? String(row.executed_at) : null,
    created_at: String(row?.created_at ?? ""),
    updated_at: String(row?.updated_at ?? ""),
  };
}
