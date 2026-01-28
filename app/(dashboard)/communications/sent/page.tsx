/**
 * Wireframe: task-0.5.1.27-sent-messages.md
 * Route: /communications/sent
 * Implements: Sent list — Filters, Search, To/Subject/Preview, status, timestamp.
 * API: communications_list_sent. Tables: conversations, messages.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md
 */

"use client";

import { SentContent } from "./SentContent";

export default function CommunicationsSentPage() {
  return <SentContent />;
}
