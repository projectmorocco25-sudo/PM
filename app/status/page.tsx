/**
 * Wireframe: task-0.5.1.41-system-status.md
 * Route: /status
 * Implements: System status — overall, components, incident history, maintenance.
 * Data: system_get_status_public(). No DB direct; RPC only. Hosted Supabase only.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.41-system-status.md
 */

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { StatusContent } from "./StatusContent";

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main id="main" className="flex-1">
        <StatusContent />
      </main>

      <PublicFooter />
    </div>
  );
}
