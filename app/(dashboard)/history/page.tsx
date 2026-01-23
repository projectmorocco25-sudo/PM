/**
 * Wireframe: task-0.5.1.30-history-overview.md
 * Route: /history
 * Implements: History overview page (role-based) with historical data from all modules.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md
 */
'use client';

import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function HistoryPage() {
  return (
    <PlaceholderPage
      title="Regulatory Activity History"
      description="View historical data from all modules including submissions, compliance reports, export authorizations, and enforcement actions."
      wireframeLink="../../../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md"
      route="/history"
      backHref="/dashboard"
    />
  );
}
