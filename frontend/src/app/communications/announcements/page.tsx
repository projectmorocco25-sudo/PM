"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SystemAnnouncements } from "@/components/communications/SystemAnnouncements";

export default function AnnouncementsPage() {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Announcements</span>} title="Announcements">
        <SystemAnnouncements />
      </MainContent>
    </DashboardLayout>
  );
}

