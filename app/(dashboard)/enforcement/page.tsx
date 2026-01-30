/**
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md
 * Route: /enforcement
 * Implements: Enforcement Dashboard — stats, recent actions, pending approvals. MOH Tier 1 and Tier 2 only.
 * Task: 1.1.2.37
 * API: enforcement_get_dashboard_stats, enforcement_list_recent_actions, enforcement_list_pending_approvals (hosted Supabase only). MOH only.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EnforcementDashboardContent } from "./EnforcementDashboardContent";

const LIMIT_RECENT = 5;
const LIMIT_PENDING = 5;

export default async function EnforcementPage() {
  const supabase = await createClient();

  const [statsRes, recentRes, pendingRes] = await Promise.all([
    supabase.rpc("enforcement_get_dashboard_stats"),
    supabase.rpc("enforcement_list_recent_actions", { p_limit: LIMIT_RECENT }),
    supabase.rpc("enforcement_list_pending_approvals", { p_limit: LIMIT_PENDING }),
  ]);

  const statsPayload = statsRes.data as Record<string, unknown> | null;
  const statsError = statsPayload && "error" in statsPayload;
  const stats = statsError ? null : (statsPayload as EnforcementStats | null);

  const recentPayload = recentRes.data as { data?: unknown[] } | null;
  const recentList = Array.isArray(recentPayload?.data) ? recentPayload.data : [];
  const recentActions = recentList.map(normalizeRecentRow);

  const pendingPayload = pendingRes.data as { data?: unknown[] } | null;
  const pendingList = Array.isArray(pendingPayload?.data) ? pendingPayload.data : [];
  const pendingApprovals = pendingList.map(normalizePendingRow);

  const error =
    statsRes.error?.message ??
    (statsError && statsPayload && "message" in statsPayload
      ? String(statsPayload.message)
      : null);

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">
          Home
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Enforcement</span>
      </nav>

      <EnforcementDashboardContent
        stats={stats}
        recentActions={recentActions}
        pendingApprovals={pendingApprovals}
        error={error}
      />
    </div>
  );
}

type EnforcementStats = {
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

function normalizeRecentRow(r: unknown): {
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
} {
  const row = r as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    company_id: String(row.company_id ?? ""),
    company_name: String(row.company_name ?? ""),
    action_type: String(row.action_type ?? ""),
    violation_type: String(row.violation_type ?? ""),
    status: String(row.status ?? ""),
    amount: row.amount != null ? Number(row.amount) : null,
    currency: String(row.currency ?? "MAD"),
    legal_basis: String(row.legal_basis ?? ""),
    executed_at: row.executed_at != null ? String(row.executed_at) : null,
    updated_at: String(row.updated_at ?? ""),
  };
}

function normalizePendingRow(r: unknown): {
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
} {
  const row = r as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    company_id: String(row.company_id ?? ""),
    company_name: String(row.company_name ?? ""),
    action_type: String(row.action_type ?? ""),
    violation_type: String(row.violation_type ?? ""),
    status: String(row.status ?? ""),
    amount: row.amount != null ? Number(row.amount) : null,
    currency: String(row.currency ?? "MAD"),
    legal_basis: String(row.legal_basis ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}
