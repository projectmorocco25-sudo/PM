"use client";

// Wireframe binding: /rmm/submissions -> docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { RegistrySubmissionsList } from "@/components/rmm/RegistrySubmissionsList";

export default function RegistrySubmissionsPage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Submissions</span>} title="Submissions">
        <RegistrySubmissionsList />
      </MainContent>
    </DashboardLayout>
  );
}

