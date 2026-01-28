/**
 * Wireframe: task-0.5.1.34-audit-reports.md
 * Route: /audit/reports
 * Implements: Audit reports — Generate Report modal, filters, compliance notice, download.
 * API: shared_generate_audit_report. Table: audit_logs. MOH/Auditors only.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.34-audit-reports.md
 */

"use client";

import { AuditReportsContent } from "./AuditReportsContent";

export default function AuditReportsPage() {
  return <AuditReportsContent />;
}
