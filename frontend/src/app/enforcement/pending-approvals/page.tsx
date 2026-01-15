"use client";

// Wireframe binding: /enforcement/pending-approvals -> docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { EnforcementActionsList } from "@/components/rmm/EnforcementActionsList";
import { useEnforcementActions } from "@/hooks/useEnforcementActions";
import { useUserRole } from "@/hooks/useUserRole";

type EnforcementActionRow = {
  id: string;
  company_id: string;
  action_type: "warning" | "fine" | "suspension";
  violation_type: string;
  status: string;
  amount: number | null;
  created_at: string;
  executed_at: string | null;
};

export default function PendingApprovalsPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;
  const isTier1 = roleInfo?.isTier1 ?? false;

  const actionsQ = useEnforcementActions();
  const actions = useMemo(() => (actionsQ.data ?? []) as EnforcementActionRow[], [actionsQ.data]);

  const pendingApprovals = useMemo(
    () => actions.filter((a) => a.status === "pending_approval" || a.status === "pending_review"),
    [actions],
  );

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Pending Approvals</span>} title="Pending Approvals">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Enforcement &gt; Pending Approvals</span>} title="Pending Approvals">
        <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-700">
            <span className="font-semibold">{pendingApprovals.length}</span> enforcement actions pending approval
          </div>
          {isTier1 ? (
            <div className="mt-2 text-xs text-zinc-600">Bulk approval actions will be available in future iterations.</div>
          ) : null}
        </div>

        <EnforcementActionsList />
      </MainContent>
    </DashboardLayout>
  );
}
