"use client";

// Wireframe binding: /enforcement/actions/[id] -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md

import Link from "next/link";
import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanies } from "@/hooks/useCompanies";
import { useEnforcementAction } from "@/hooks/useEnforcementActions";
import { useUserRole } from "@/hooks/useUserRole";

type EnforcementActionRow = {
  id: string;
  company_id: string;
  action_type: "warning" | "fine" | "suspension";
  violation_type: string;
  status: string;
  amount: number | null;
  legal_basis: string;
  justification: string;
  evidence_references: unknown;
  created_at: string;
  executed_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  resolution: string | null;
};

function actionTypeBadgeVariant(actionType: "warning" | "fine" | "suspension"): "warning" | "destructive" | "secondary" {
  if (actionType === "warning") return "warning";
  if (actionType === "fine") return "destructive";
  return "secondary";
}

function statusBadgeVariant(status: string): "default" | "secondary" | "success" | "destructive" | "warning" {
  if (status === "draft") return "secondary";
  if (status === "pending_review" || status === "pending_approval") return "warning";
  if (status === "approved") return "default";
  if (status === "executed") return "success";
  if (status === "cancelled" || status === "rejected") return "destructive";
  return "secondary";
}

function kv(label: string, value: React.ReactNode) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="text-base text-zinc-900">{value}</div>
    </div>
  );
}

export default function EnforcementActionDetailPage({ params }: { params: { id: string } }) {
  const actionId = params.id;

  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const actionQ = useEnforcementAction(actionId);
  const companiesQ = useCompanies();

  const action = (actionQ.data ?? null) as EnforcementActionRow | null;
  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);

  const companyName = useMemo(() => {
    if (!action) return "—";
    return companies.find((c) => c.id === action.company_id)?.name ?? "—";
  }, [action, companies]);

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions</span>} title="Enforcement Action">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent
        breadcrumbs={<span>Home &gt; Enforcement &gt; Actions &gt; {actionId}</span>}
        title={action ? `${action.action_type.toUpperCase()} - ${companyName}` : "Enforcement Action"}
      >
        {actionQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : actionQ.isError || !action ? (
          <div className="text-sm text-zinc-600">Unable to load enforcement action.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={actionTypeBadgeVariant(action.action_type)} className="text-sm">
                {action.action_type.toUpperCase()}
              </Badge>
              <Badge variant={statusBadgeVariant(action.status)}>{action.status}</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Action Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {kv("Action Type", <Badge variant={actionTypeBadgeVariant(action.action_type)}>{action.action_type.toUpperCase()}</Badge>)}
                {kv(
                  "Company",
                  <Link className="text-blue-700 hover:underline" href={`/rmm/companies/${action.company_id}`}>
                    {companyName}
                  </Link>,
                )}
                {kv("Violation Type", <span className="text-sm">{action.violation_type}</span>)}
                {kv("Status", <Badge variant={statusBadgeVariant(action.status)}>{action.status}</Badge>)}
                {action.amount ? kv("Amount", <span className="text-sm font-semibold">MAD {action.amount.toLocaleString()}</span>) : null}
                {kv("Created", <span className="text-sm">{new Date(action.created_at).toLocaleString()}</span>)}
                {action.executed_at ? kv("Executed", <span className="text-sm">{new Date(action.executed_at).toLocaleString()}</span>) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Basis & Justification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {kv("Legal Basis", <div className="text-sm text-zinc-800">{action.legal_basis}</div>)}
                {kv("Justification", <div className="text-sm text-zinc-800 whitespace-pre-wrap">{action.justification}</div>)}
                {action.evidence_references ? (
                  <div>
                    <div className="text-sm font-medium text-zinc-500">Evidence References</div>
                    <pre className="mt-1 rounded-md bg-zinc-50 p-3 text-xs text-zinc-800">{JSON.stringify(action.evidence_references, null, 2)}</pre>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-600">Workflow timeline with approval chain will be displayed here (similar to ApprovalHistory component).</div>
              </CardContent>
            </Card>

            {action.status === "executed" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Appeal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-700">
                    Appeal window: 30 days from execution ({action.executed_at ? new Date(action.executed_at).toLocaleDateString() : "N/A"})
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">Appeal details and status will be displayed here when available.</div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </MainContent>
    </DashboardLayout>
  );
}
