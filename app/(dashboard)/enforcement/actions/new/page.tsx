/**
 * Wireframe: task-0.5.2.1b-create-enforcement-action-wizard.md
 * Route: /enforcement/actions/new
 * Implements: Create Enforcement Action wizard — Step 1 (Action Details), Step 2 (Legal Basis & Justification), Step 3 (Review & Submit). MOH Tier 1 and Tier 2 only.
 * Task: 1.1.2.40
 * API: enforcement_create_action, enforcement_submit_action, rmm_list_companies (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateEnforcementActionWizard } from "./CreateEnforcementActionWizard";

export default async function EnforcementActionNewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) redirect("/login");

  const [companiesRes, permRes] = await Promise.all([
    supabase.rpc("rmm_list_companies", {
      p_limit: 500,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
    supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data),
  ]);

  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "";
  const isMOH = ["tier1", "tier2_officer", "tier2_registrar", "system_admin"].includes(role);
  if (!isMOH) redirect("/enforcement/actions");

  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));

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
        <span className="text-[#111827] font-medium">New</span>
      </nav>

      <CreateEnforcementActionWizard companies={companies} />
    </div>
  );
}
