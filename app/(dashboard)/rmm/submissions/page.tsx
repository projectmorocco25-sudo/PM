/**
 * Wireframe: task-0.5.2.11-registry-submission-list.md
 * Route: /rmm/submissions
 * Implements: Registry submission list page — data from rmm_list_submissions_page (hosted Supabase only).
 * Task: 1.1.2.26
 * API: rmm_list_submissions_page (status, entity_type, date range filters; RLS applies).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md
 */

import { createClient } from "@/lib/supabase/server";
import { SubmissionsListContent } from "./SubmissionsListContent";

const PAGE_SIZE = 20;

export default async function RmmSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const statusFilter = typeof params.status === "string" ? params.status : "";
  const typeFilter = typeof params.type === "string" ? params.type : "";
  const dateFrom = typeof params.dateFrom === "string" ? params.dateFrom : "";
  const dateTo = typeof params.dateTo === "string" ? params.dateTo : "";
  const page = Math.max(1, parseInt(String(params.page), 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const fromDate = dateFrom ? new Date(dateFrom).toISOString() : null;
  const toDate = dateTo ? new Date(dateTo).toISOString() : null;

  const { data, error } = await supabase.rpc("rmm_list_submissions_page", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_status: statusFilter && statusFilter !== "all" ? statusFilter : null,
    p_entity_type: typeFilter && typeFilter !== "all" ? typeFilter : null,
    p_date_from: fromDate,
    p_date_to: toDate,
  });

  const payload = data as {
    data?: Array<{
      id: string;
      submission_type: string;
      entity_type: string;
      entity_id: string | null;
      entity_display_name: string | null;
      status: string;
      created_at: string;
      updated_at: string | null;
      days_until_deadline: number | null;
    }>;
    total?: number;
    view_type?: "company" | "moh";
  } | null;

  const submissions = (payload?.data ?? []).map((r) => ({
    id: String(r.id),
    submission_type: String(r.submission_type),
    entity_type: String(r.entity_type),
    entity_id: r.entity_id != null ? String(r.entity_id) : null,
    entity_display_name: r.entity_display_name != null ? String(r.entity_display_name) : null,
    status: String(r.status),
    created_at: String(r.created_at),
    updated_at: r.updated_at != null ? String(r.updated_at) : null,
    days_until_deadline: r.days_until_deadline != null ? Number(r.days_until_deadline) : null,
  }));
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const viewType = payload?.view_type === "moh" ? "moh" : "company";

  return (
    <SubmissionsListContent
      submissions={submissions}
      total={total}
      viewType={viewType}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      dateFrom={dateFrom}
      dateTo={dateTo}
      page={page}
      pageSize={PAGE_SIZE}
      error={error != null ? "Unable to load submissions" : null}
    />
  );
}
