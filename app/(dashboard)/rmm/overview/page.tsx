/**
 * Wireframe: task-0.5.2.1-rmm-overview.md (task-0.5.2.16)
 * Route: /rmm/overview
 * Implements: RMM overview page — stats from rmm_get_overview_stats (hosted Supabase only).
 * Task: 1.1.2.16.1
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md
 */

import { createClient } from "@/lib/supabase/server";
import { RmmPageBreadcrumbs } from "../RmmPageBreadcrumbs";
import { RmmOverviewContent } from "./RmmOverviewContent";

export default async function RmmOverviewPage() {
  const supabase = await createClient();
  const { data: statsJson, error } = await supabase.rpc("rmm_get_overview_stats", {
    p_company_id: null,
  });

  if (error) {
    return (
      <div className="space-y-4">
        <RmmPageBreadcrumbs tail={["Overview"]} />
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">Unable to load RMM overview</p>
          <p className="mt-1 text-sm text-[#991b1b]">{error.message}</p>
          <p className="mt-4 text-sm text-[#6b7280]">Data is loaded from hosted Supabase only.</p>
        </div>
      </div>
    );
  }

  const stats = (statsJson ?? {}) as {
    companies_total?: number;
    companies_active?: number;
    companies_inactive?: number;
    products_total?: number;
    products_active?: number;
    products_inactive?: number;
    skus_total?: number;
    skus_active?: number;
    skus_inactive?: number;
    submissions_pending?: number;
    submissions_approved?: number;
    submissions_rejected?: number;
  };

  return (
    <RmmOverviewContent
      stats={{
        companies_total: stats.companies_total ?? 0,
        companies_active: stats.companies_active ?? 0,
        companies_inactive: stats.companies_inactive ?? 0,
        products_total: stats.products_total ?? 0,
        products_active: stats.products_active ?? 0,
        products_inactive: stats.products_inactive ?? 0,
        skus_total: stats.skus_total ?? 0,
        skus_active: stats.skus_active ?? 0,
        skus_inactive: stats.skus_inactive ?? 0,
        submissions_pending: stats.submissions_pending ?? 0,
        submissions_approved: stats.submissions_approved ?? 0,
        submissions_rejected: stats.submissions_rejected ?? 0,
      }}
    />
  );
}
