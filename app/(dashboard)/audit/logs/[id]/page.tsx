/**
 * Wireframe: task-0.5.1.33-audit-log-detail.md
 * Route: /audit/logs/[id]
 * Implements: Audit log detail — action, table, record, old/new values, hash chain, compliance.
 * API: shared_get_audit_log_detail. Table: audit_logs. MOH/Auditors only.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md
 */

"use client";

import { useParams } from "next/navigation";
import { AuditLogDetailContent } from "./AuditLogDetailContent";

export default function AuditLogDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  if (!id) return null;
  return <AuditLogDetailContent id={id} />;
}
