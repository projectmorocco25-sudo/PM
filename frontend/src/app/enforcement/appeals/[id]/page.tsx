"use client";

// Wireframe binding: /enforcement/appeals/[id] -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";

export default function AppealReviewPage({ params }: { params: { id: string } }) {
  const appealId = params.id;

  const { data: roleInfo } = useUserRole();
  const isTier1 = roleInfo?.isTier1 ?? false;

  if (!isTier1) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Appeals &gt; {appealId}</span>} title="Appeal Review">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH Tier 1 only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Appeals &gt; {appealId}</span>} title="Appeal Review">
        <Card>
          <CardHeader>
            <CardTitle>Appeal Review Interface (Tier 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-700">
              Tier 1 appeal review interface will display appeal details, grounds, evidence, and resolution actions (uphold/overturn/adjust).
            </div>
            <div className="mt-3 text-sm text-zinc-600">
              This interface implements the appeal resolution workflow per the enforcement cycle specification and wireframe task-0.5.2.1e.
            </div>
          </CardContent>
        </Card>
      </MainContent>
    </DashboardLayout>
  );
}
