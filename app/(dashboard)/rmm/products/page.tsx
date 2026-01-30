/**
 * Wireframe: task-0.5.2.4-products-list.md
 * Route: /rmm/products
 * Implements: Products list — breadcrumbs, [New Product], search, filters (Company, Status, Critical, ATC), table, pagination.
 * Task: 1.1.2.20
 * API: rmm_list_products_page, rmm_list_companies, rmm_list_atc_codes (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { ProductsListContent } from "./ProductsListContent";

const PAGE_SIZE = 20;

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; company?: string; status?: string; critical?: string; atc?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const companyFilter = typeof params.company === "string" ? params.company : "";
  const statusFilter = typeof params.status === "string" ? params.status : "active";
  const criticalFilter = typeof params.critical === "string" ? params.critical : "all";
  const atcFilter = typeof params.atc === "string" ? params.atc : "";
  const page = Math.max(1, parseInt(String(params.page), 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const [productsRes, companiesRes, atcRes] = await Promise.all([
    supabase.rpc("rmm_list_products_page", {
      p_limit: PAGE_SIZE,
      p_offset: offset,
      p_search: search && search.trim() ? search.trim() : null,
      p_company_id: companyFilter && /^[0-9a-f-]{36}$/i.test(companyFilter) ? companyFilter : null,
      p_status: statusFilter === "all" || statusFilter === "inactive" ? statusFilter : "active",
      p_is_critical: criticalFilter === "true" || criticalFilter === "false" ? criticalFilter : "all",
      p_atc_code: atcFilter && atcFilter.trim() ? atcFilter.trim() : null,
    }),
    supabase.rpc("rmm_list_companies", {
      p_limit: 200,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
    supabase.rpc("rmm_list_atc_codes", {
      p_limit: 200,
      p_offset: 0,
      p_code_filter: null,
    }),
  ]);

  const productsPayload = productsRes.data as { data?: unknown[]; total?: number } | null;
  const products = (productsPayload?.data ?? []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    company_id: String(p.company_id),
    name: String(p.name),
    company_name: String(p.company_name ?? ""),
    atc_code: p.atc_code != null ? String(p.atc_code) : null,
    is_critical_medicine: Boolean(p.is_critical_medicine),
    sku_count: typeof p.sku_count === "number" ? p.sku_count : 0,
    is_active: Boolean(p.is_active),
  }));
  const total = typeof productsPayload?.total === "number" ? productsPayload.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));

  const atcPayload = atcRes.data as { data?: Array<{ id: string; code: string }> } | null;
  const atcCodes = (atcPayload?.data ?? []).map((a) => ({ id: String(a.id), code: String(a.code) }));

  return (
    <ProductsListContent
      products={products}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      search={search}
      companyFilter={companyFilter}
      statusFilter={statusFilter}
      criticalFilter={criticalFilter}
      atcFilter={atcFilter}
      companies={companies}
      atcCodes={atcCodes}
      error={productsRes.error != null ? "Unable to load products" : null}
    />
  );
}
