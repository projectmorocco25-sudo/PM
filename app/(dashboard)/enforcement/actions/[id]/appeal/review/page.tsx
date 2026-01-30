/**
 * Wireframe: task-0.5.2.1e-appeal-review-interface.md
 * Route: /enforcement/actions/[id]/appeal/review
 * Implements: Appeal Review — Tier 1 review interface: action summary, appeal info, uphold/overturn decision, justification (min 50 chars), adjustment note. MOH Tier 1 only.
 * Task: 1.1.2.43
 * API: enforcement_get_action, enforcement_get_appeal_status, enforcement_uphold_appeal, enforcement_overturn_appeal (hosted Supabase only).
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppealReviewContent } from "./AppealReviewContent";
import { redirect, notFound } from "next/navigation";

const REVIEWABLE_STATUSES = ["submitted", "tier2_reviewed", "tier1_reviewed"];

export default async function AppealReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: actionId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) redirect("/login");

  const permRes = await supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data);
  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "";
  if (role !== "tier1") redirect(`/enforcement/actions/${actionId}`);

  const [actionRes, appealRes] = await Promise.all([
    supabase.rpc("enforcement_get_action", { p_action_id: actionId }),
    supabase.rpc("enforcement_get_appeal_status", { p_action_id: actionId }),
  ]);

  const actionPayload = actionRes.data as Record<string, unknown> | null;
  const actionError = actionPayload && "error" in actionPayload;
  if (actionRes.error || actionError) {
    if (actionPayload && "error" in actionPayload && String(actionPayload.error) === "not_found") notFound();
    redirect(`/enforcement/actions/${actionId}`);
  }

  const action = (actionPayload?.action as Record<string, unknown>) ?? null;
  const companyName = actionPayload?.company_name != null ? String(actionPayload.company_name) : "";
  const executedByName = actionPayload?.executed_by_name != null ? String(actionPayload.executed_by_name) : "";

  const appealPayload = appealRes.data as {
    appeal?: Record<string, unknown> | null;
    appeal_window_remaining_days?: number | null;
    executed_at?: string | null;
  } | null;
  const appeal = appealPayload?.appeal ?? null;
  const appealWindowRemaining = appealPayload?.appeal_window_remaining_days ?? null;
  const executedAt = appealPayload?.executed_at != null ? String(appealPayload.executed_at) : null;

  if (!appeal || typeof appeal !== "object") redirect(`/enforcement/actions/${actionId}`);
  const appealStatus = String((appeal as Record<string, unknown>).status ?? "");
  if (!REVIEWABLE_STATUSES.includes(appealStatus)) redirect(`/enforcement/actions/${actionId}`);

  const appealId = String((appeal as Record<string, unknown>).id ?? "");

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
        <Link href={`/enforcement/actions/${actionId}`} className="text-[#2563eb] hover:underline truncate max-w-[120px]">
          {actionId.slice(0, 8)}…
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Appeal Review</span>
      </nav>

      <AppealReviewContent
        action={action}
        companyName={companyName}
        executedAt={executedAt}
        appeal={appeal}
        appealId={appealId}
        actionId={actionId}
        appealWindowRemaining={appealWindowRemaining}
      />
    </div>
  );
}
