/**
 * Wireframe: task-0.5.2.1f-appeal-submission-form.md
 * Route: /enforcement/actions/[id]/appeal
 * Implements: Appeal Submission — company users submit appeal (grounds, explanation min 50 chars, optional evidence). 30-day window from execution. Company users only.
 * Task: 1.1.2.44
 * API: enforcement_get_action, enforcement_get_appeal_status, enforcement_submit_appeal (hosted Supabase only).
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppealSubmissionContent } from "./AppealSubmissionContent";
import { redirect, notFound } from "next/navigation";

const COMPANY_ROLES = ["company_admin", "company_manager", "company_user"];

export default async function AppealSubmissionPage({
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
  if (!COMPANY_ROLES.includes(role)) redirect(`/enforcement/actions/${actionId}`);

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
  const status = action ? String(action.status ?? "") : "";

  const appealPayload = appealRes.data as {
    appeal?: Record<string, unknown> | null;
    appeal_window_remaining_days?: number | null;
    executed_at?: string | null;
  } | null;
  const appeal = appealPayload?.appeal ?? null;
  const appealWindowRemaining = appealPayload?.appeal_window_remaining_days ?? null;
  const executedAt = appealPayload?.executed_at != null ? String(appealPayload.executed_at) : null;

  if (appeal != null) redirect(`/enforcement/actions/${actionId}`);

  if (status !== "executed" || appealWindowRemaining == null || appealWindowRemaining <= 0) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/enforcement" className="text-[#2563eb] hover:underline">Enforcement</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/enforcement/actions" className="text-[#2563eb] hover:underline">Actions</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href={`/enforcement/actions/${actionId}`} className="text-[#2563eb] hover:underline truncate max-w-[120px]">{actionId.slice(0, 8)}…</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <span className="text-[#111827] font-medium">Appeal</span>
        </nav>
        <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-[#b91c1c]">
          <p className="font-medium">Appeal window has expired</p>
          <p className="mt-1 text-sm">Appeals must be submitted within 30 days of execution.</p>
          <Link href={`/enforcement/actions/${actionId}`} className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline">View enforcement action</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/enforcement" className="text-[#2563eb] hover:underline">Enforcement</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/enforcement/actions" className="text-[#2563eb] hover:underline">Actions</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href={`/enforcement/actions/${actionId}`} className="text-[#2563eb] hover:underline truncate max-w-[120px]">{actionId.slice(0, 8)}…</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Appeal</span>
      </nav>

      <AppealSubmissionContent
        action={action}
        companyName={companyName}
        actionId={actionId}
        appealWindowRemaining={appealWindowRemaining}
        executedAt={executedAt}
      />
    </div>
  );
}
