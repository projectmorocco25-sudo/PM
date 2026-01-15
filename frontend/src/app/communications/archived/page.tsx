"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ArchivedConversations } from "@/components/communications/ArchivedConversations";

export default function ArchivedPage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Archived</span>} title="Archived">
        <ArchivedConversations />
      </MainContent>
    </DashboardLayout>
  );
}

