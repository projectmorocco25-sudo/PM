"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { notify } from "@/lib/toast";
import { useCreateConversationAndSend } from "@/hooks/useCommunications";

export function ComposeMessage() {
  const router = useRouter();
  const createAndSend = useCreateConversationAndSend();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");

  return (
    <div className="max-w-2xl">
      <div className="mb-4 text-xl font-semibold text-zinc-900">Compose Message</div>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Recipient User ID (optional)</label>
          <input
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="UUID (optional)"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-1 text-xs text-zinc-500">
            If provided, the system will create an in-app notification for that user.
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject…"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message…"
            className="min-h-[160px] w-full resize-y rounded-md border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={createAndSend.isPending || subject.trim().length === 0 || content.trim().length === 0}
            onClick={async () => {
              try {
                const conversationId = await createAndSend.mutateAsync({
                  type: "direct_message",
                  subject: subject.trim(),
                  content: content.trim(),
                  recipientId: recipientId.trim() ? recipientId.trim() : null,
                });
                notify.success("Message sent");
                router.push(`/communications/inbox/${conversationId}`);
              } catch {
                notify.error("Failed to send message");
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

