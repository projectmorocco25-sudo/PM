"use client";

// Wireframe binding: /enforcement/actions/[id]/appeal -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";

export default function AppealSubmissionPage({ params }: { params: { id: string } }) {
  const actionId = params.id;

  const { data: roleInfo } = useUserRole();
  const isCompanyUser = roleInfo?.isCompanyUser ?? false;

  if (!isCompanyUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions &gt; {actionId} &gt; Appeal</span>} title="Submit Appeal">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: Company users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions &gt; {actionId} &gt; Appeal</span>} title="Submit Appeal">
        <Card>
          <CardHeader>
            <CardTitle>Appeal Submission Form (Company Users)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-700">
              Company appeal submission form will display here with appeal grounds, detailed explanation, and optional supporting documents.
            </div>
            <div className="mt-3 text-sm text-zinc-600">
              This form implements the 30-day appeal window validation and required fields per the enforcement cycle specification and wireframe
              task-0.5.2.1f.
            </div>
          </CardContent>
        </Card>
      </MainContent>
    </DashboardLayout>
  );
}
