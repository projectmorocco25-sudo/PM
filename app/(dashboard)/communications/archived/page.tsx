/**
 * Wireframe: task-0.5.1.36-archived-conversations.md
 * Route: /communications/archived
 * Implements: Archived list, search, filters, Restore Selected, retention info.
 * APIs: communications_list_archived, communications_restore_conversation. Tables: conversations.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md
 */

"use client";

import { ArchivedContent } from "./ArchivedContent";

export default function CommunicationsArchivedPage() {
  return <ArchivedContent />;
}
