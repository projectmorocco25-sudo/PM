/**
 * Wireframe: task-0.5.2.15-critical-medicines-list.md (Designate flow)
 * Route: /rmm/critical-medicines/designate
 * Implements: Designate new critical medicine — select SKU, submit. MOH Tier 1 only.
 * Task: 1.1.2.30
 * API: rmm_list_skus_page, rmm_create_critical_medicine (hosted Supabase only). RLS applies.
 */

import { createClient } from "@/lib/supabase/server";
import { RmmPageBreadcrumbs } from "../../RmmPageBreadcrumbs";
import { DesignateCriticalMedicineContent } from "./DesignateCriticalMedicineContent";

const PAGE_SIZE = 30;

export default async function DesignateCriticalMedicinePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const offset = Math.max(0, parseInt(String(params.offset), 10) || 0);

  const supabase = await createClient();
  const listRes = await supabase.rpc("rmm_list_skus_page", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_search: search || null,
    p_product_id: null,
    p_status: "active",
    p_dosage_form: null,
    p_atc_code: null,
  });

  const payload = listRes.data as { data?: unknown[]; total?: number } | null;
  const rawRows = payload?.data ?? [];
  const total = typeof payload?.total === "number" ? payload.total : 0;

  const skus = rawRows.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    sku_code: String(r.sku_code ?? ""),
    name: String(r.name ?? ""),
    product_name: String(r.product_name ?? ""),
  }));

  return (
    <div className="space-y-4">
      <RmmPageBreadcrumbs tail={[{ label: "Critical Medicines", href: "/rmm/critical-medicines" }, "Designate"]} />
      <DesignateCriticalMedicineContent
        skus={skus}
        total={total}
        search={search}
        offset={offset}
        pageSize={PAGE_SIZE}
        error={listRes.error != null ? "Unable to load SKUs" : null}
      />
    </div>
  );
}
