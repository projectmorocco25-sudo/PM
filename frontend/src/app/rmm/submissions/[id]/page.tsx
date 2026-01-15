"use client";

// Wireframe binding: /rmm/submissions/[id] -> docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRegistryApprovals, useRegistrySubmission } from "@/hooks/useRegistrySubmission";
import { useUserRole } from "@/hooks/useUserRole";
import { ApprovalHistory } from "@/components/rmm/ApprovalHistory";
import { WorkflowActionButtons } from "@/components/rmm/WorkflowActionButtons";
import { WorkflowStatusIndicator, statusBadgeVariant } from "@/components/rmm/WorkflowStatusIndicator";

type RegistrySubmissionRow = {
  id: string;
  company_id: string | null;
  submission_type: string;
  entity_type: "company" | "product" | "sku";
  entity_id: string | null;
  submission_data: unknown;
  status:
    | "draft"
    | "submitted"
    | "tier2_verified"
    | "tier2_peer_reviewed"
    | "tier1_approved"
    | "tier2_implemented"
    | "completed"
    | "rejected";
  submitted_at: string | null;
  created_at: string;
  verified_at: string | null;
  approved_at: string | null;
  implemented_at: string | null;
  rejection_reason: string | null;
};

type ApprovalRow = {
  id: string;
  from_status: string;
  to_status: string;
  approver_id: string;
  approval_type: string;
  comments: string | null;
  created_at: string;
  approver?: { full_name: string | null; email: string; role: string } | null;
};

function prettyStatus(status: RegistrySubmissionRow["status"]) {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "tier2_verified":
      return "Tier 2 Verified";
    case "tier2_peer_reviewed":
      return "Tier 2 Peer Reviewed";
    case "tier1_approved":
      return "Tier 1 Approved";
    case "tier2_implemented":
      return "Tier 2 Implemented";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}

function prettyAction(submissionType: string): "Create" | "Update" | "Delete" | "—" {
  if (submissionType.endsWith("_create")) return "Create";
  if (submissionType.endsWith("_update")) return "Update";
  if (submissionType.endsWith("_delete")) return "Delete";
  return "—";
}

function entityLabel(row: RegistrySubmissionRow): string {
  const data = (row.submission_data ?? {}) as Record<string, unknown>;
  const name =
    (typeof data.name === "string" && data.name) ||
    (typeof (data.company_name as unknown) === "string" && (data.company_name as string)) ||
    (typeof (data.product_name as unknown) === "string" && (data.product_name as string)) ||
    (typeof (data.sku_name as unknown) === "string" && (data.sku_name as string));
  if (name) return name;
  return row.entity_id ?? row.id;
}

export default function RegistrySubmissionDetailPage({ params }: { params: { id: string } }) {
  const submissionId = params.id;

  const { data: roleInfo } = useUserRole();
  const userRole = roleInfo?.role ?? "unknown";
  const isTier1 = roleInfo?.isTier1 ?? false;
  const isTier2Officer = userRole === "tier2_officer";
  const isTier2Registrar = userRole === "tier2_registrar";

  const submissionQ = useRegistrySubmission(submissionId);
  const approvalsQ = useRegistryApprovals(submissionId);

  const row = (submissionQ.data ?? null) as RegistrySubmissionRow | null;
  const approvals = useMemo(() => (approvalsQ.data ?? []) as ApprovalRow[], [approvalsQ.data]);

  const isMohWorkflow = Boolean(row && row.company_id === null);

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Submissions &gt; {submissionId}</span>} title="Registry Submission">
        {submissionQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : submissionQ.isError || !row ? (
          <div className="text-sm text-zinc-600">Unable to load submission.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-zinc-900">
                Registry Submission - {row.entity_type.toUpperCase()} {prettyAction(row.submission_type)}
              </div>
              <Badge variant={statusBadgeVariant(row.status)}>{prettyStatus(row.status)}</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Status</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStatusIndicator status={row.status} isMohWorkflow={isMohWorkflow} />
                {row.status === "rejected" && row.rejection_reason ? (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTitle>Rejected</AlertTitle>
                    <AlertDescription>{row.rejection_reason}</AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Entity Type:</span> {row.entity_type.toUpperCase()}
                </div>
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Entity:</span> {entityLabel(row)}
                </div>
                <div className="text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Action:</span> {prettyAction(row.submission_type)}
                </div>

                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-xs font-semibold text-zinc-700">Raw submission payload</div>
                  <pre className="mt-2 overflow-x-auto text-xs text-zinc-800">{JSON.stringify(row.submission_data, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval History</CardTitle>
              </CardHeader>
              <CardContent>
                {approvalsQ.isLoading ? (
                  <div className="text-sm text-zinc-600">Loading…</div>
                ) : approvalsQ.isError ? (
                  <div className="text-sm text-zinc-600">Unable to load approval history.</div>
                ) : (
                  <ApprovalHistory items={approvals} />
                )}
              </CardContent>
            </Card>

            <WorkflowActionButtons
              submissionId={submissionId}
              currentStatus={row.status}
              isMOHSubmission={row.company_id === null}
              userRole={userRole}
              isTier1={isTier1}
              isTier2Officer={isTier2Officer}
              isTier2Registrar={isTier2Registrar}
            />
          </div>
        )}
      </MainContent>
    </DashboardLayout>
  );
}

