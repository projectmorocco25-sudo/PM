/**
 * Wireframe: task-0.5.2.2-companies-list.md
 * Route: /rmm/companies
 * Implements: Companies list — breadcrumbs, [New Company], search, filters (Type, Status), table, pagination.
 * Task: 1.1.2.17
 * API: rmm_list_companies (hosted Supabase only). RLS applies (company users see own company only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { CompaniesListContent } from "./CompaniesListContent";

const PAGE_SIZE = 20;

export default async function CompaniesListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const typeFilter = typeof params.type === "string" ? params.type : "";
  const statusFilter = typeof params.status === "string" ? params.status : "active";
  const page = Math.max(1, parseInt(String(params.page), 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("rmm_list_companies", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_search: search && search.trim() ? search.trim() : null,
    p_company_type: typeFilter && typeFilter.trim() ? typeFilter.trim() : null,
    p_status: statusFilter === "all" || statusFilter === "inactive" ? statusFilter : "active",
  });

  const payload = data as { data?: unknown[]; total?: number } | null;
  const companies = (payload?.data ?? []).map((c: Record<string, unknown>) => ({
    id: String(c.id),
    name: String(c.name),
    registration_number: String(c.registration_number),
    company_type: String(c.company_type),
    is_active: Boolean(c.is_active),
    created_at: c.created_at != null ? String(c.created_at) : undefined,
  }));
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <CompaniesListContent
      companies={companies}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      search={search}
      typeFilter={typeFilter}
      statusFilter={statusFilter}
      error={error != null ? "Unable to load companies" : null}
    />
  );
}
