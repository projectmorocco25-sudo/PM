"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useApp } from "@/contexts/AppContext";
import { notify } from "@/lib/toast";
import {
  useArchiveConversation,
  useConversation,
  useConversationMessages,
  useMarkMessageRead,
  useSendMessage,
} from "@/hooks/useCommunications";

export function ConversationDetail({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { user } = useApp();

  const convo = useConversation(conversationId);
  const msgs = useConversationMessages(conversationId);
  const send = useSendMessage(conversationId);
  const archive = useArchiveConversation();
  const markRead = useMarkMessageRead(conversationId);

  const [draft, setDraft] = useState("");

  const messages = useMemo(() => msgs.data ?? [], [msgs.data]);

  useEffect(() => {
    // Best-effort: mark the latest message as read if it targets the current user.
    const last = messages[messages.length - 1];
    if (!last || !user?.id) return;
    if (last.recipient_id && last.recipient_id === user.id) {
      markRead.mutate(last.id);
    }
  }, [messages, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const subject = convo.data?.subject ?? "Conversation";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold text-zinc-900">{subject}</div>
          {convo.data?.workflow_entity_type ? (
            <div className="mt-1 text-sm text-zinc-600">
              Linked to: {convo.data.workflow_entity_type} {convo.data.workflow_entity_id ?? ""}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          disabled={archive.isPending}
          onClick={async () => {
            try {
              await archive.mutateAsync(conversationId);
              notify.success("Conversation archived");
              router.push("/communications/inbox");
            } catch {
              notify.error("Failed to archive conversation");
            }
          }}
        >
          Archive
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-zinc-200 bg-white">
        {msgs.isLoading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">No messages yet.</div>
        ) : (
          <div className="space-y-3 p-4">
            {messages.map((m) => {
              const mine = user?.id && m.sender_id === user.id;
              return (
                <div
                  key={m.id}
                  className={clsx(
                    "rounded-lg border border-zinc-200 p-4",
                    mine ? "bg-blue-50/60" : "bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-900">
                      {mine ? "You" : `User ${m.sender_id.slice(0, 8)}…`}
                    </div>
                    <div className="text-xs text-zinc-400">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{m.content}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="mb-2 text-sm font-semibold text-zinc-900">Reply</div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[120px] w-full resize-y rounded-md border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={send.isPending || draft.trim().length === 0}
            onClick={async () => {
              try {
                await send.mutateAsync({ content: draft.trim() });
                setDraft("");
                notify.success("Message sent");
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

