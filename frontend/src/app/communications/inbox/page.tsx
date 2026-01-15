"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { CommunicationsInbox } from "@/components/communications/CommunicationsInbox";

export default function InboxPage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Inbox</span>} title="Communications">
        <CommunicationsInbox />
      </MainContent>
    </DashboardLayout>
  );
}

