"use client";

import { useState } from "react";

import { useUserRole } from "@/hooks/useUserRole";
import { notify } from "@/lib/toast";
import { useCreateAnnouncement } from "@/hooks/useCommunications";

export function SystemAnnouncements() {
  const { data: role } = useUserRole();
  const create = useCreateAnnouncement();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  if (!role?.isTier1) {
    return <div className="text-sm text-zinc-600">System announcements are available to MOH Tier 1 only.</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 text-xl font-semibold text-zinc-900">System Announcements</div>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="text-sm text-zinc-600">
          Creates an announcement conversation and delivers notifications to recipients.
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Announcement subject…"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[160px] w-full resize-y rounded-md border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write the announcement…"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={create.isPending || subject.trim().length === 0 || content.trim().length === 0}
            onClick={async () => {
              try {
                await create.mutateAsync({ subject: subject.trim(), content: content.trim() });
                setSubject("");
                setContent("");
                notify.success("Announcement created");
              } catch {
                notify.error("Failed to create announcement");
              }
            }}
          >
            Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

