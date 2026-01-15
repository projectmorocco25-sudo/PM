"use client";

// Wireframe binding: /enforcement/actions/new -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";

export default function NewEnforcementActionPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions &gt; New</span>} title="New Enforcement Action">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions &gt; New</span>} title="New Enforcement Action">
        <Card>
          <CardHeader>
            <CardTitle>Create Enforcement Action Wizard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-700">
              Multi-step wizard for creating enforcement actions (warnings, fines, suspensions) with action type selection, violation selection,
              amount input for fines, legal basis, and justification.
            </div>
            <div className="mt-3 text-sm text-zinc-600">
              This wizard implements the enforcement action creation workflow per the enforcement cycle specification and wireframe task-0.5.2.1b.
            </div>
          </CardContent>
        </Card>
      </MainContent>
    </DashboardLayout>
  );
}
