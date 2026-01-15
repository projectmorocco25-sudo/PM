"use client";

// Wireframe binding: /enforcement/reports -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";

export default function EnforcementReportsPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Reports</span>} title="Enforcement Reports">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Reports</span>} title="Enforcement Reports">
        <Card>
          <CardHeader>
            <CardTitle>Enforcement Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-700">
              Enforcement reports, analytics, trends, action type breakdown, and company compliance tracking will be displayed here.
            </div>
            <div className="mt-3 text-sm text-zinc-600">
              Charts, graphs, and detailed enforcement statistics will be implemented in Phase 1 iterations following this wireframe.
            </div>
          </CardContent>
        </Card>
      </MainContent>
    </DashboardLayout>
  );
}
