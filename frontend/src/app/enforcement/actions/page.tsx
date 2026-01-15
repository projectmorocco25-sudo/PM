"use client";

// Wireframe binding: /enforcement/actions -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Button } from "@/components/ui/button";
import { EnforcementActionsList } from "@/components/rmm/EnforcementActionsList";
import { useUserRole } from "@/hooks/useUserRole";

export default function EnforcementActionsPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Actions</span>} title="Enforcement Actions">
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
        breadcrumbs={<span>Home &gt; Enforcement &gt; Actions</span>}
        title="Enforcement Actions"
        actions={
          <Button disabled title="Create enforcement action wizard comes in Task 1.1.2.40">
            New Action
          </Button>
        }
      >
        <EnforcementActionsList />
      </MainContent>
    </DashboardLayout>
  );
}
