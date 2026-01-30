/**
 * Wireframe: task-0.5.2.1a-enforcement-action-detail.md
 * Route: /enforcement/actions/[id]
 * Implements: Enforcement Action detail — workflow status, action information, approval chain, appeal status, related info. MOH Tier 1/2 and Company (own actions only).
 * Task: 1.1.2.39
 * API: enforcement_get_action, enforcement_get_action_history, enforcement_get_appeal_status (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EnforcementActionDetailContent } from "./EnforcementActionDetailContent";
import { notFound } from "next/navigation";

export default async function EnforcementActionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const [actionRes, historyRes, appealRes, permRes] = await Promise.all([
    supabase.rpc("enforcement_get_action", { p_action_id: id }),
    supabase.rpc("enforcement_get_action_history", { p_action_id: id }),
    supabase.rpc("enforcement_get_appeal_status", { p_action_id: id }),
    user?.id
      ? supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data)
      : Promise.resolve(null),
  ]);

  const actionPayload = actionRes.data as Record<string, unknown> | null;
  const hasError = actionPayload && "error" in actionPayload;
  const errorCode = hasError && actionPayload && "error" in actionPayload ? String(actionPayload.error) : null;

  if (actionRes.error || hasError) {
    if (errorCode === "not_found" || actionRes.error?.message?.includes("not found")) notFound();
    if (errorCode === "forbidden" || errorCode === "unauthorized") notFound();
  }

  const action = (actionPayload?.action as Record<string, unknown>) ?? null;
  const companyName = actionPayload?.company_name != null ? String(actionPayload.company_name) : "";
  const createdByName = actionPayload?.created_by_name != null ? String(actionPayload.created_by_name) : "";
  const createdByRole = actionPayload?.created_by_role != null ? String(actionPayload.created_by_role) : "";
  const reviewedByName = actionPayload?.reviewed_by_name != null ? String(actionPayload.reviewed_by_name) : "";
  const reviewedByRole = actionPayload?.reviewed_by_role != null ? String(actionPayload.reviewed_by_role) : "";
  const approvedByName = actionPayload?.approved_by_name != null ? String(actionPayload.approved_by_name) : "";
  const approvedByRole = actionPayload?.approved_by_role != null ? String(actionPayload.approved_by_role) : "";
  const executedByName = actionPayload?.executed_by_name != null ? String(actionPayload.executed_by_name) : "";
  const executedByRole = actionPayload?.executed_by_role != null ? String(actionPayload.executed_by_role) : "";

  const historyPayload = historyRes.data as { data?: unknown[] } | null;
  const historyList = Array.isArray(historyPayload?.data) ? historyPayload.data : [];

  const appealPayload = appealRes.data as {
    appeal?: Record<string, unknown> | null;
    appeal_window_remaining_days?: number | null;
    executed_at?: string | null;
  } | null;
  const appeal = appealPayload?.appeal ?? null;
  const appealWindowRemaining = appealPayload?.appeal_window_remaining_days ?? null;
  const executedAt = appealPayload?.executed_at != null ? String(appealPayload.executed_at) : null;

  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "company_user";
  const isMOH = ["tier1", "tier2_officer", "tier2_registrar", "auditor", "system_admin"].includes(role);
  const isCompanyUser = !isMOH;
  const appealStatus = appeal != null ? String((appeal as Record<string, unknown>).status ?? "") : "";
  const canReviewAppeal =
    role === "tier1" &&
    appeal != null &&
    ["submitted", "tier2_reviewed", "tier1_reviewed"].includes(appealStatus);

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
        <Link href="/enforcement/actions" className="text-[#2563eb] hover:underline">
          Actions
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium truncate max-w-[180px]" title={id}>
          {id.slice(0, 8)}…
        </span>
      </nav>

      <EnforcementActionDetailContent
        action={action}
        companyName={companyName}
        createdByName={createdByName}
        createdByRole={createdByRole}
        reviewedByName={reviewedByName}
        reviewedByRole={reviewedByRole}
        approvedByName={approvedByName}
        approvedByRole={approvedByRole}
        executedByName={executedByName}
        executedByRole={executedByRole}
        history={historyList}
        appeal={appeal}
        appealWindowRemaining={appealWindowRemaining}
        isMOH={isMOH}
        isCompanyUser={isCompanyUser}
        canReviewAppeal={canReviewAppeal}
        actionId={id}
      />
    </div>
  );
}
