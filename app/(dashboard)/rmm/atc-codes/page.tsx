/**
 * Wireframe: task-0.5.2.14-atc-codes-list.md
 * Route: /rmm/atc-codes
 * Implements: ATC Codes list page — data from rmm_list_atc_codes (hosted Supabase only). Read-only for all users.
 * Task: 1.1.2.29
 * API: rmm_list_atc_codes(p_limit, p_offset, p_code_filter, p_level, p_category). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { RmmPageBreadcrumbs } from "../RmmPageBreadcrumbs";
import { AtcListContent } from "./AtcListContent";

const PAGE_SIZE = 50;

export default async function RmmAtcCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; level?: string; category?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const levelFilter = typeof params.level === "string" ? params.level : "";
  const categoryFilter = typeof params.category === "string" ? params.category : "";
  const offset = Math.max(0, parseInt(String(params.offset), 10) || 0);

  const supabase = await createClient();

  const res = await supabase.rpc("rmm_list_atc_codes", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_code_filter: search || null,
    p_level: levelFilter && /^[1-4]$/.test(levelFilter) ? parseInt(levelFilter, 10) : null,
    p_category: categoryFilter && /^[A-Za-z]$/.test(categoryFilter) ? categoryFilter : null,
  });

  const payload = res.data as { data?: unknown[]; total?: number } | null;
  const rawRows = payload?.data ?? [];
  const total = typeof payload?.total === "number" ? payload.total : 0;

  const atcCodes = rawRows.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    code: String(r.code ?? ""),
    description: r.description != null ? String(r.description) : null,
    is_active: Boolean(r.is_active),
    level: typeof r.level === "number" ? r.level : (r.level != null ? Number(r.level) : 5),
  }));

  return (
    <div className="space-y-4">
      <RmmPageBreadcrumbs tail={["ATC Codes"]} />
      <AtcListContent
        atcCodes={atcCodes}
        total={total}
        search={search}
        levelFilter={levelFilter}
        categoryFilter={categoryFilter}
        offset={offset}
        pageSize={PAGE_SIZE}
        error={res.error != null ? "Unable to load ATC codes" : null}
      />
    </div>
  );
}
