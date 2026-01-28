"use client";

/**
 * Wireframe: task-0.5.1.25-conversation-detail.md
 * Conversation detail: subject, Archive, workflow context, thread, reply.
 * APIs: communications_get_conversation, communications_send_message, communications_archive_conversation.
 * Tables: conversations, messages.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import {
  useConversation,
  useSendMessage,
  useArchiveConversation,
  type MessageRow,
} from "@/hooks/use-communications";
import { Archive, MoreHorizontal } from "lucide-react";

const DRAFT_KEY_PREFIX = "communications-draft-";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function MessageItem({
  msg,
  currentUserId,
}: {
  msg: MessageRow;
  currentUserId: string | null;
}) {
  const isOwn = currentUserId && msg.sender_id === currentUserId;
  return (
    <div
      className={`rounded-lg border border-[#e5e7eb] p-4 ${
        isOwn ? "bg-[#eff6ff]" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#111827]">
          {msg.sender_id ? `${String(msg.sender_id).slice(0, 8)}…` : "System"}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-[#9ca3af]">{formatTime(msg.created_at)}</span>
          <span className="text-xs text-[#6b7280]" title="Sent">
            ✓ Sent
          </span>
        </div>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-[#111827]">{msg.content || "—"}</p>
    </div>
  );
}

export function ConversationDetailContent({ conversationId }: { conversationId: string }) {
  const { user } = useSession();
  const { conversation, messages, status, error, refetch } = useConversation(conversationId);
  const [reply, setReply] = useState("");
  const [archiveModal, setArchiveModal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const draftKey = `${DRAFT_KEY_PREFIX}${conversationId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(draftKey);
    if (stored) setReply(stored);
  }, [conversationId, draftKey]);

  const onSent = useCallback(() => {
    setReply("");
    if (typeof window !== "undefined") localStorage.removeItem(draftKey);
    refetch();
  }, [refetch, draftKey]);

  const { send, status: sendStatus, error: sendError } = useSendMessage(conversationId, onSent);
  const { archive, status: archiveStatus, error: archiveError } = useArchiveConversation(
    conversationId,
    () => {
      setArchiveModal(false);
      window.location.href = "/communications/inbox";
    }
  );

  const handleSaveDraft = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(draftKey, reply);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSend = async () => {
    if (!reply.trim()) return;
    await send(reply.trim(), null);
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav
          className="flex h-10 items-center text-sm text-[#6b7280]"
          aria-label="Breadcrumb"
        >
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">Inbox</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Conversation</span>
        </nav>
        <div className="h-8 w-64 animate-pulse rounded bg-[#f3f4f6]" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !conversation) {
    return (
      <div className="space-y-6">
        <nav
          className="flex h-10 items-center text-sm text-[#6b7280]"
          aria-label="Breadcrumb"
        >
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">Inbox</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Conversation</span>
        </nav>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load conversation.</p>
          <p className="mt-1 text-sm">{error ?? "Not found"}</p>
          <Link
            href="/communications/inbox"
            className="mt-4 inline-block rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
          >
            Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  const subject = conversation.subject || "Conversation";

  return (
    <div className="space-y-6">
      <nav
        className="flex h-10 items-center text-sm text-[#6b7280]"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
          Communications
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">Inbox</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827] truncate">{subject}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#111827] md:text-2xl">{subject}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setArchiveModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            <Archive className="h-4 w-4" aria-hidden />
            Archive
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-[#e5e7eb] bg-white p-2 text-[#111827] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {archiveModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setArchiveModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#111827]">Archive conversation?</h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              It will be moved to Archived folder but remain accessible for 7 years (regulatory
              requirement).
            </p>
            {archiveError && (
              <p className="mt-2 text-sm text-[#ef4444]">{archiveError}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setArchiveModal(false)}
                className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => archive()}
                disabled={archiveStatus === "loading"}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {archiveStatus === "loading" ? "Archiving…" : "Archive"}
              </button>
            </div>
          </div>
        </>
      )}

      {messages.length > 1 && (
        <p className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 text-sm text-[#6b7280]">
          Thread ({messages.length} messages)
        </p>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <MessageItem key={m.id} msg={m} currentUserId={user?.id ?? null} />
        ))}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <label htmlFor="reply-input" className="sr-only">
          Type your message
        </label>
        <textarea
          id="reply-input"
          placeholder="Type your message..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] min-h-[100px] max-h-[300px]"
        />
        {sendError && <p className="mt-2 text-sm text-[#ef4444]">{sendError}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            {draftSaved ? "Draft saved" : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!reply.trim() || sendStatus === "loading"}
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {sendStatus === "loading" ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
