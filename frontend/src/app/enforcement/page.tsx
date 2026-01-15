"use client";

// Wireframe binding: /enforcement -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md

import Link from "next/link";
import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnforcementActions } from "@/hooks/useEnforcementActions";
import { useUserRole } from "@/hooks/useUserRole";

type EnforcementActionRow = {
  id: string;
  company_id: string;
  action_type: "warning" | "fine" | "suspension";
  status: string;
  amount: number | null;
  created_at: string;
  executed_at: string | null;
};

export default function EnforcementDashboardPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const actionsQ = useEnforcementActions();
  const actions = useMemo(() => (actionsQ.data ?? []) as EnforcementActionRow[], [actionsQ.data]);

  const recentActions = useMemo(() => actions.slice(0, 5), [actions]);

  const pendingApprovals = useMemo(
    () => actions.filter((a) => a.status === "pending_approval" || a.status === "pending_review"),
    [actions],
  );

  const metrics = useMemo(() => {
    const warnings = actions.filter((a) => a.action_type === "warning").length;
    const fines = actions.filter((a) => a.action_type === "fine").length;
    const suspensions = actions.filter((a) => a.action_type === "suspension").length;
    return { warnings, fines, suspensions, total: warnings + fines + suspensions };
  }, [actions]);

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement</span>} title="Enforcement">
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
        breadcrumbs={<span>Home &gt; Enforcement</span>}
        title="Enforcement Dashboard"
        actions={
          <Button disabled title="Create enforcement action wizard comes in Task 1.1.2.40">
            New Action
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 text-3xl font-bold text-zinc-900">{metrics.total}</div>
                {actionsQ.isLoading ? (
                  <div className="text-sm text-zinc-600">Loading…</div>
                ) : recentActions.length === 0 ? (
                  <div className="text-sm text-zinc-600">No recent actions.</div>
                ) : (
                  <ul className="space-y-2">
                    {recentActions.map((a) => (
                      <li key={a.id} className="rounded-md border border-zinc-200 p-2 text-sm">
                        <div className="font-medium text-zinc-900">{a.action_type.toUpperCase()}</div>
                        <div className="text-xs text-zinc-600">{new Date(a.created_at).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/enforcement/actions" className="mt-3 block text-sm font-medium text-blue-700 hover:underline">
                  View all →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 text-3xl font-bold text-red-600">{pendingApprovals.length}</div>
                <div className="text-sm text-zinc-700">
                  Urgency: <span className="font-semibold">{pendingApprovals.length > 5 ? "High" : "Low"}</span>
                </div>
                {pendingApprovals.length === 0 ? (
                  <div className="mt-3 text-sm text-zinc-600">No pending approvals.</div>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {pendingApprovals.slice(0, 3).map((a) => (
                      <li key={a.id} className="rounded-md border border-zinc-200 p-2 text-sm">
                        <div className="font-medium text-zinc-900">{a.action_type.toUpperCase()}</div>
                        {a.action_type === "fine" && a.amount ? <div className="text-xs text-zinc-600">MAD {a.amount.toLocaleString()}</div> : null}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/enforcement/pending-approvals" className="mt-3 block text-sm font-medium text-blue-700 hover:underline">
                  View all →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enforcement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">Warnings:</span>
                  <span className="font-semibold text-zinc-900">{metrics.warnings}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">Fines:</span>
                  <span className="font-semibold text-zinc-900">{metrics.fines}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">Suspensions:</span>
                  <span className="font-semibold text-zinc-900">{metrics.suspensions}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-2 text-sm">
                  <span className="font-semibold text-zinc-700">Total:</span>
                  <span className="text-lg font-bold text-zinc-900">{metrics.total}</span>
                </div>
                <Button variant="outline" className="mt-3 w-full" disabled title="Reports page comes in Task 1.1.2.42">
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Action Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                  <div className="text-xs font-medium text-yellow-700">Warning</div>
                  <div className="mt-1 text-2xl font-bold text-yellow-900">{metrics.warnings}</div>
                  <div className="text-xs text-yellow-600">
                    {metrics.total > 0 ? Math.round((metrics.warnings / metrics.total) * 100) : 0}%
                  </div>
                </div>
                <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
                  <div className="text-xs font-medium text-orange-700">Fine</div>
                  <div className="mt-1 text-2xl font-bold text-orange-900">{metrics.fines}</div>
                  <div className="text-xs text-orange-600">{metrics.total > 0 ? Math.round((metrics.fines / metrics.total) * 100) : 0}%</div>
                </div>
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="text-xs font-medium text-red-700">Suspension</div>
                  <div className="mt-1 text-2xl font-bold text-red-900">{metrics.suspensions}</div>
                  <div className="text-xs text-red-600">{metrics.total > 0 ? Math.round((metrics.suspensions / metrics.total) * 100) : 0}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </DashboardLayout>
  );
}
