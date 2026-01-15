"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ComposeMessage } from "@/components/communications/ComposeMessage";

export default function ComposePage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Compose</span>} title="Compose">
        <ComposeMessage />
      </MainContent>
    </DashboardLayout>
  );
}

