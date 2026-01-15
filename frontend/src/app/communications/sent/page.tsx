"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SentMessages } from "@/components/communications/SentMessages";

export default function SentPage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Sent</span>} title="Sent">
        <SentMessages />
      </MainContent>
    </DashboardLayout>
  );
}

