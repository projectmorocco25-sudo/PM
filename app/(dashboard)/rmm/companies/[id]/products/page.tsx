/**
 * Wireframe: task-0.5.2.3-company-detail.md (Products tab section)
 * Route: /rmm/companies/[id]/products
 * Implements: Company products page (Products tab view) — product list filtered by company, search, pagination.
 * Task: 1.1.2.18.1
 * API: rmm_get_company_for_detail, rmm_list_company_products (hosted Supabase only).
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 */

import { createClient } from "@/lib/supabase/server";
import { CompanyProductsContent } from "./CompanyProductsContent";

const PAGE_SIZE = 20;

export default async function CompanyProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { id } = await params;
  const { search = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;
  const supabase = await createClient();

  const { data: companyResult } = await supabase.rpc("rmm_get_company_for_detail", {
    p_id: id,
  });

  const companyData = companyResult as { company?: Record<string, unknown>; error?: string } | null;
  if (!companyData?.company || companyData.error) {
    return (
      <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
        <p className="font-medium text-[#dc2626]">Unable to load company</p>
        <p className="mt-1 text-sm text-[#991b1b]">
          {companyData?.error === "not_found" ? "Company not found." : "You may not have access to this company."}
        </p>
      </div>
    );
  }

  const company = companyData.company as Record<string, unknown>;
  const companyName = String(company.name);

  const { data: productsResult } = await supabase.rpc("rmm_list_company_products", {
    p_company_id: id,
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_search: search && search.trim() ? search.trim() : null,
  });

  const productsPayload = productsResult as { data?: unknown[]; total?: number; error?: string } | null;
  const products = (productsPayload?.data ?? []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    name: String(p.name),
    atc_code: p.atc_code != null ? String(p.atc_code) : null,
    sku_count: typeof p.sku_count === "number" ? p.sku_count : 0,
    is_active: Boolean(p.is_active),
    company_id: String(p.company_id),
  }));
  const total = typeof productsPayload?.total === "number" ? productsPayload.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <CompanyProductsContent
      companyId={id}
      companyName={companyName}
      products={products}
      total={total}
      currentPage={pageNum}
      totalPages={totalPages}
      search={search}
    />
  );
}
