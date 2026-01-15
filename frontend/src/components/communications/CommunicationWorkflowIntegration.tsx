"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

// Lightweight placeholder: on workflow pages, link to Communications.
// Later tasks can expand this into entity-linked conversations.
export function CommunicationWorkflowIntegration({
  entityLabel,
}: {
  entityLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Communications</div>
          <div className="mt-1 text-sm text-zinc-600">
            {entityLabel ? `Discuss this ${entityLabel} with stakeholders.` : "Discuss this item with stakeholders."}
          </div>
        </div>
        <Link
          href="/communications/inbox"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <MessageSquare className="h-4 w-4" />
          Open Inbox
        </Link>
      </div>
    </div>
  );
}

