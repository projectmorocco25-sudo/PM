/**
 * Wireframe: task-0.5.2.1c-pending-approvals.md
 * Route: /enforcement/pending-approvals
 * Implements: Pending Approvals — list of actions pending Tier 1 approval, approval/reject interface, two-person rule. MOH Tier 1 only.
 * Task: 1.1.2.41
 * API: enforcement_list_pending_approvals, enforcement_approve_action, enforcement_reject_action (hosted Supabase only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PendingApprovalsContent } from "./PendingApprovalsContent";
import { redirect } from "next/navigation";

const LIMIT = 100;

export default async function PendingApprovalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) redirect("/login");

  const permRes = await supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data);
  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "";
  if (role !== "tier1") redirect("/enforcement");

  const [listRes, companiesRes] = await Promise.all([
    supabase.rpc("enforcement_list_pending_approvals", { p_limit: LIMIT }),
    supabase.rpc("rmm_list_companies", {
      p_limit: 500,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
  ]);
  const listPayload = listRes.data as { data?: unknown[]; error?: string; message?: string } | null;
  const payload = listPayload;
  const hasError = payload && "error" in payload;
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const errorMessage =
    listRes.error?.message ?? (hasError && payload && "message" in payload ? String(payload.message) : null);

  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));

  const pendingApprovalOnly = list.filter(
    (r: unknown) => (r as Record<string, unknown>)?.status === "pending_approval"
  );

  const rows = pendingApprovalOnly.map((r: unknown) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row?.id ?? ""),
      company_id: String(row?.company_id ?? ""),
      company_name: String(row?.company_name ?? ""),
      action_type: String(row?.action_type ?? ""),
      violation_type: String(row?.violation_type ?? ""),
      status: String(row?.status ?? ""),
      amount: row?.amount != null ? Number(row.amount) : null,
      currency: String(row?.currency ?? "MAD"),
      legal_basis: String(row?.legal_basis ?? ""),
      created_at: String(row?.created_at ?? ""),
      updated_at: String(row?.updated_at ?? ""),
    };
  });

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
        <span className="text-[#111827] font-medium">Pending Approvals</span>
      </nav>

      <PendingApprovalsContent rows={rows} companies={companies} error={errorMessage} />
    </div>
  );
}
