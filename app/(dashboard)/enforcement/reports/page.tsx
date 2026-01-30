/**
 * Wireframe: task-0.5.2.1d-enforcement-reports.md
 * Route: /enforcement/reports
 * Implements: Enforcement Reports — analytics, trends, action type breakdown, company compliance, fine analysis, appeal stats. MOH Tier 1 and Tier 2 only.
 * Task: 1.1.2.42
 * API: enforcement_get_reports, enforcement_get_analytics (hosted Supabase only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EnforcementReportsContent } from "./EnforcementReportsContent";
import { redirect } from "next/navigation";

const MOH_ROLES = ["tier1", "tier2_officer", "tier2_registrar", "system_admin"];

function parseDateRange(dateParam: string | undefined): { from: string; to: string } {
  const to = new Date();
  let from = new Date();
  const param = (dateParam ?? "30d").toLowerCase();
  if (param === "7d") {
    from.setDate(from.getDate() - 7);
  } else if (param === "90d") {
    from.setDate(from.getDate() - 90);
  } else if (param === "12m") {
    from.setFullYear(from.getFullYear() - 1);
  } else {
    from.setDate(from.getDate() - 30);
  }
  return { from: from.toISOString(), to: to.toISOString() };
}

export default async function EnforcementReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) redirect("/login");

  const permRes = await supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data);
  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "";
  if (!MOH_ROLES.includes(role)) redirect("/enforcement");

  const params = await searchParams;
  const { from, to } = parseDateRange(params.date);

  const [reportsRes, analyticsRes] = await Promise.all([
    supabase.rpc("enforcement_get_reports", { p_date_from: from, p_date_to: to }),
    supabase.rpc("enforcement_get_analytics", { p_date_from: from, p_date_to: to }),
  ]);

  const reportsPayload = reportsRes.data as Record<string, unknown> | null;
  const reportsError = reportsPayload && "error" in reportsPayload;
  const reports = reportsError ? null : reportsPayload;

  const analyticsPayload = analyticsRes.data as Record<string, unknown> | null;
  const analyticsError = analyticsPayload && "error" in analyticsPayload;
  const analytics = analyticsError ? null : analyticsPayload;

  const error =
    reportsRes.error?.message ??
    analyticsRes.error?.message ??
    (reportsError && reportsPayload && "message" in reportsPayload ? String(reportsPayload.message) : null) ??
    (analyticsError && analyticsPayload && "message" in analyticsPayload ? String(analyticsPayload.message) : null);

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
        <span className="text-[#111827] font-medium">Reports</span>
      </nav>

      <EnforcementReportsContent
        reports={reports}
        analytics={analytics}
        dateParam={params.date ?? "30d"}
        error={error}
      />
    </div>
  );
}
