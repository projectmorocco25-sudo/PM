/**
 * Wireframe: task-0.5.1.30-history-overview.md
 * Route: /history
 * Implements: Role-based history overview — date range, compliance banner, filters, timeline, load more.
 * API: shared_get_history. Tables: audit_logs, registry_submissions.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md
 */

"use client";

import { HistoryContent } from "./HistoryContent";

export default function HistoryPage() {
  return <HistoryContent />;
}
