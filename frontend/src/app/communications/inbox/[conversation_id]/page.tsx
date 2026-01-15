"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ConversationDetail } from "@/components/communications/ConversationDetail";

export default function ConversationPage({ params }: { params: { conversation_id: string } }) {
  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Communications &gt; Inbox &gt; Conversation</span>}>
        <ConversationDetail conversationId={params.conversation_id} />
      </MainContent>
    </DashboardLayout>
  );
}

