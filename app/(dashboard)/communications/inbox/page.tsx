/**
 * Wireframe: task-0.5.1.24-communications-inbox-list.md
 * Route: /communications/inbox
 * Implements: Inbox list — breadcrumbs, New Message, Filters, search, conversation list.
 * API: communications_list_conversations. Tables: conversations, messages.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md
 */

"use client";

import { InboxContent } from "./InboxContent";

export default function InboxPage() {
  return <InboxContent />;
}
