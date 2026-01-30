/**
 * Wireframe: task-0.5.2.15-critical-medicines-list.md
 * Route: /rmm/critical-medicines
 * Implements: Critical Medicines list page — data from rmm_list_critical_medicines (9-arg), companies for filter, MOH Tier 1 can manage.
 * Task: 1.1.2.30
 * API: rmm_list_critical_medicines (9-arg), rmm_list_companies, shared_get_user_permissions. RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { RmmPageBreadcrumbs } from "../RmmPageBreadcrumbs";
import { CriticalMedicinesListContent, type CriticalMedicineRow } from "./CriticalMedicinesListContent";

const PAGE_SIZE = 50;

function getDateRange(dateFilter: string): { from: Date | null; to: Date | null } {
  const now = new Date();
  if (dateFilter === "7d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { from, to: now };
  }
  if (dateFilter === "30d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return { from, to: now };
  }
  return { from: null, to: null };
}

export default async function RmmCriticalMedicinesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    company?: string;
    atc?: string;
    date?: string;
    offset?: string;
  }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const statusFilter = typeof params.status === "string" ? params.status : "active";
  const companyFilter = typeof params.company === "string" ? params.company : "";
  const atcFilter = typeof params.atc === "string" ? params.atc : "";
  const dateFilter = typeof params.date === "string" ? params.date : "";
  const offset = Math.max(0, parseInt(String(params.offset), 10) || 0);

  const { from: designatedFrom, to: designatedTo } = getDateRange(dateFilter);

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const [listRes, companiesRes, permRes] = await Promise.all([
    supabase.rpc("rmm_list_critical_medicines", {
      p_limit: PAGE_SIZE,
      p_offset: offset,
      p_sku_id: null,
      p_search: search || null,
      p_status: statusFilter === "all" || statusFilter === "inactive" ? statusFilter : "active",
      p_company_id: companyFilter && /^[0-9a-f-]{36}$/i.test(companyFilter) ? companyFilter : null,
      p_atc_first_letter: atcFilter && /^[A-Za-z]$/.test(atcFilter) ? atcFilter : null,
      p_designated_from: designatedFrom ? designatedFrom.toISOString() : null,
      p_designated_to: designatedTo ? designatedTo.toISOString() : null,
    }),
    supabase.rpc("rmm_list_companies", {
      p_limit: 200,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
    user?.id
      ? supabase.rpc("shared_get_user_permissions", { user_id: user.id }).then((r) => r.data)
      : Promise.resolve(null),
  ]);

  const payload = listRes.data as { data?: unknown[]; total?: number } | null;
  const rawRows = payload?.data ?? [];
  const total = typeof payload?.total === "number" ? payload.total : 0;

  const rows: CriticalMedicineRow[] = rawRows.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    sku_id: String(r.sku_id),
    sku_code: String(r.sku_code ?? ""),
    sku_name: String(r.sku_name ?? ""),
    dosage_strength: String(r.dosage_strength ?? ""),
    dosage_form: String(r.dosage_form ?? ""),
    product_id: String(r.product_id),
    product_name: String(r.product_name ?? ""),
    company_id: String(r.company_id),
    company_name: String(r.company_name ?? ""),
    designated_at: r.designated_at != null ? String(r.designated_at) : "",
    is_active: Boolean(r.is_active),
  }));

  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));

  const perm = permRes as { role?: string } | null;
  const role = perm?.role ?? "company_user";
  const canManage = role === "tier1" || role === "system_admin";

  return (
    <div className="space-y-4">
      <RmmPageBreadcrumbs tail={["Critical Medicines"]} />
      <CriticalMedicinesListContent
        rows={rows}
        total={total}
        search={search}
        statusFilter={statusFilter}
        companyFilter={companyFilter}
        atcFilter={atcFilter}
        dateFilter={dateFilter}
        offset={offset}
        pageSize={PAGE_SIZE}
        companies={companies}
        canManage={canManage}
        error={listRes.error != null ? "Unable to load critical medicines" : null}
      />
    </div>
  );
}
