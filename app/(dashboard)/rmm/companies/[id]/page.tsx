/**
 * Wireframe: task-0.5.2.3-company-detail.md
 * Route: /rmm/companies/[id]
 * Implements: Company detail page — Company Information, tabs Overview | Products | History.
 * Task: 1.1.2.18
 * API: rmm_get_company_for_detail, rmm_get_overview_stats, rmm_get_company_history, rmm_list_company_products (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 */

import { createClient } from "@/lib/supabase/server";
import { CompanyDetailContent } from "./CompanyDetailContent";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
        <p className="mt-4 text-sm text-[#6b7280]">Data is loaded from hosted Supabase only. RLS applies.</p>
      </div>
    );
  }

  const company = companyData.company as Record<string, unknown>;
  const [statsResult, historyResult, productsResult] = await Promise.all([
    supabase.rpc("rmm_get_overview_stats", { p_company_id: id }),
    supabase.rpc("rmm_get_company_history", {
      p_company_id: id,
      p_start_date: null,
      p_end_date: null,
      p_limit: 20,
      p_offset: 0,
    }),
    supabase.rpc("rmm_list_company_products", {
      p_company_id: id,
      p_limit: 10,
      p_offset: 0,
      p_search: null,
    }),
  ]);

  const statsJson = statsResult.data as Record<string, number> | null;
  const historyData = historyResult.data as { data?: Array<{ id: string; type: string; title: string; description: string; created_at: string; link?: string }> } | null;
  const productsData = productsResult.data as {
    data?: Array<{ id: string; name: string; is_active: boolean; company_id: string; atc_code?: string | null; sku_count?: number }>;
  } | null;

  const stats = {
    products_total: statsJson?.products_total ?? 0,
    products_active: statsJson?.products_active ?? 0,
    products_inactive: statsJson?.products_inactive ?? 0,
    skus_total: statsJson?.skus_total ?? 0,
    skus_active: statsJson?.skus_active ?? 0,
    skus_inactive: statsJson?.skus_inactive ?? 0,
  };

  const history = (historyData?.data ?? []).map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? "",
    created_at: item.created_at,
    link: item.link,
  }));

  const products = (productsData?.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    is_active: p.is_active,
    company_id: p.company_id,
    atc_code: p.atc_code ?? null,
    sku_count: p.sku_count ?? 0,
  }));

  return (
    <CompanyDetailContent
      company={{
        id: String(company.id),
        name: String(company.name),
        registration_number: String(company.registration_number),
        company_type: String(company.company_type),
        contact_email: company.contact_email != null ? String(company.contact_email) : null,
        is_active: Boolean(company.is_active),
        address: company.address != null ? String(company.address) : null,
        contact_phone: company.contact_phone != null ? String(company.contact_phone) : null,
        created_at: company.created_at != null ? String(company.created_at) : undefined,
        updated_at: company.updated_at != null ? String(company.updated_at) : undefined,
      }}
      stats={stats}
      history={history}
      products={products}
      companyId={id}
    />
  );
}
