/**
 * Wireframe: task-0.5.1.32-audit-logs-list.md
 * Route: /audit/logs
 * Implements: Audit logs list — filters, compliance banner, table, pagination, Export.
 * API: shared_get_audit_logs. Table: audit_logs. MOH/Auditors only.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md
 */

"use client";

import { AuditLogsContent } from "./AuditLogsContent";

export default function AuditLogsPage() {
  return <AuditLogsContent />;
}
