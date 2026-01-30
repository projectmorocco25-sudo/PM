/**
 * Wireframe: task-0.5.2.12-registry-submission-detail.md
 * Route: /rmm/submissions/[id]
 * Implements: Registry submission detail — workflow status, submission data, approval history, regulatory checklist, MOH actions.
 * Task: 1.1.2.27
 * API: rmm_get_submission, rmm_get_submission_approval_history (hosted Supabase only). RLS enforced via RPC access.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md
 */

import { createClient } from "@/lib/supabase/server";
import { SubmissionDetailContent } from "./SubmissionDetailContent";
import { SubmissionDetailError } from "./SubmissionDetailError";

export default async function RegistrySubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submissionResult } = await supabase.rpc("rmm_get_submission", { p_id: id });
  const submissionPayload = submissionResult as Record<string, unknown> | null;

  if (!submissionPayload || (submissionPayload.error === "not_found")) {
    return (
      <SubmissionDetailError
        message="Unable to load submission"
        subMessage={submissionPayload?.error === "not_found" ? "Submission not found." : "You may not have access to this submission."}
      />
    );
  }

  const { data: historyResult } = await supabase.rpc("rmm_get_submission_approval_history", {
    p_submission_id: id,
  });
  const historyPayload = historyResult as { data?: Array<Record<string, unknown>> } | null;
  const historyRows = (historyPayload?.data ?? []) as Array<{
    id: string;
    from_status: string;
    to_status: string;
    approval_type: string;
    comments: string | null;
    created_at: string;
    approver_name: string | null;
    approver_role: string | null;
  }>;

  const submission = {
    id: String(submissionPayload.id),
    submission_type: String(submissionPayload.submission_type ?? ""),
    entity_type: String(submissionPayload.entity_type ?? ""),
    entity_id: submissionPayload.entity_id != null ? String(submissionPayload.entity_id) : null,
    entity_display_name: submissionPayload.entity_display_name != null ? String(submissionPayload.entity_display_name) : null,
    submission_data: submissionPayload.submission_data as Record<string, unknown> | null,
    status: String(submissionPayload.status ?? ""),
    submitted_by: String(submissionPayload.submitted_by ?? ""),
    verified_by: submissionPayload.verified_by != null ? String(submissionPayload.verified_by) : null,
    verified_at: submissionPayload.verified_at != null ? String(submissionPayload.verified_at) : null,
    approved_by: submissionPayload.approved_by != null ? String(submissionPayload.approved_by) : null,
    approved_at: submissionPayload.approved_at != null ? String(submissionPayload.approved_at) : null,
    implemented_by: submissionPayload.implemented_by != null ? String(submissionPayload.implemented_by) : null,
    implemented_at: submissionPayload.implemented_at != null ? String(submissionPayload.implemented_at) : null,
    rejection_reason: submissionPayload.rejection_reason != null ? String(submissionPayload.rejection_reason) : null,
    created_at: String(submissionPayload.created_at ?? ""),
    updated_at: submissionPayload.updated_at != null ? String(submissionPayload.updated_at) : null,
    days_until_deadline: submissionPayload.days_until_deadline != null ? Number(submissionPayload.days_until_deadline) : null,
    view_type: submissionPayload.view_type === "moh" ? "moh" as const : "company" as const,
    allowed_actions: Array.isArray(submissionPayload.allowed_actions)
      ? (submissionPayload.allowed_actions as string[]).filter((a): a is string => typeof a === "string")
      : [],
  };

  const history = historyRows.map((row) => ({
    id: String(row.id),
    from_status: String(row.from_status),
    to_status: String(row.to_status),
    approval_type: String(row.approval_type),
    comments: row.comments != null ? String(row.comments) : null,
    created_at: String(row.created_at),
    approver_name: row.approver_name != null ? String(row.approver_name) : null,
    approver_role: row.approver_role != null ? String(row.approver_role) : null,
  }));

  return (
    <SubmissionDetailContent
      submission={submission}
      history={history}
      submissionId={id}
    />
  );
}
