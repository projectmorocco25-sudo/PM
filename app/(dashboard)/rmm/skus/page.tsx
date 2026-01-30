/**
 * Wireframe: task-0.5.2.6-skus-list.md
 * Route: /rmm/skus
 * Implements: SKUs list — breadcrumbs, [New SKU], search, filters (Product, Status, Dosage Form, ATC), table, pagination.
 * Task: 1.1.2.23
 * API: rmm_list_skus_page, rmm_list_products, rmm_list_atc_codes (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { SkusListContent } from "./SkusListContent";

const PAGE_SIZE = 20;

const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment"] as const;

export default async function SkusListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; product?: string; status?: string; form?: string; atc?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const productFilter = typeof params.product === "string" ? params.product : "";
  const statusFilter = typeof params.status === "string" ? params.status : "active";
  const formFilter = typeof params.form === "string" ? params.form : "all";
  const atcFilter = typeof params.atc === "string" ? params.atc : "";
  const page = Math.max(1, parseInt(String(params.page), 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const [skusRes, productsRes, atcRes] = await Promise.all([
    supabase.rpc("rmm_list_skus_page", {
      p_limit: PAGE_SIZE,
      p_offset: offset,
      p_search: search && search.trim() ? search.trim() : null,
      p_product_id: productFilter && /^[0-9a-f-]{36}$/i.test(productFilter) ? productFilter : null,
      p_status: statusFilter === "all" || statusFilter === "inactive" ? statusFilter : "active",
      p_dosage_form: formFilter && formFilter !== "all" ? formFilter : null,
      p_atc_code: atcFilter && atcFilter.trim() ? atcFilter.trim() : null,
    }),
    supabase.rpc("rmm_list_products", {
      p_limit: 500,
      p_offset: 0,
      p_company_id: null,
    }),
    supabase.rpc("rmm_list_atc_codes", {
      p_limit: 200,
      p_offset: 0,
      p_code_filter: null,
    }),
  ]);

  const skusPayload = skusRes.data as { data?: unknown[]; total?: number } | null;
  const skus = (skusPayload?.data ?? []).map((s: Record<string, unknown>) => ({
    id: String(s.id),
    product_id: String(s.product_id),
    company_id: String(s.company_id ?? ""),
    product_name: String(s.product_name ?? ""),
    sku_code: String(s.sku_code ?? ""),
    name: String(s.name ?? ""),
    dosage_strength: s.dosage_strength != null ? String(s.dosage_strength) : null,
    dosage_form: s.dosage_form != null ? String(s.dosage_form) : null,
    pack_size: s.pack_size != null ? String(s.pack_size) : null,
    unit_of_measure: s.unit_of_measure != null ? String(s.unit_of_measure) : null,
    atc_code: s.atc_code != null ? String(s.atc_code) : null,
    is_active: Boolean(s.is_active),
  }));
  const total = typeof skusPayload?.total === "number" ? skusPayload.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const productsPayload = productsRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const products = (productsPayload?.data ?? []).map((p) => ({ id: String(p.id), name: String(p.name) }));

  const atcPayload = atcRes.data as { data?: Array<{ id: string; code: string }> } | null;
  const atcCodes = (atcPayload?.data ?? []).map((a) => ({ id: String(a.id), code: String(a.code) }));

  return (
    <SkusListContent
      skus={skus}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      search={search}
      productFilter={productFilter}
      statusFilter={statusFilter}
      formFilter={formFilter}
      atcFilter={atcFilter}
      products={products}
      atcCodes={atcCodes}
      dosageForms={DOSAGE_FORMS}
      error={skusRes.error != null ? "Unable to load SKUs" : null}
    />
  );
}
