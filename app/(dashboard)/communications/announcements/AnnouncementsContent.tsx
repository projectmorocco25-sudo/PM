"use client";

/**
 * Wireframe: task-0.5.1.28-system-announcements.md
 * System announcements: list, Create Announcement modal (MOH only). View → conversation detail.
 * APIs: communications_list_announcements, communications_create_announcement. Tables: conversations, messages.
 */

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";
import {
  useAnnouncementsList,
  useCreateAnnouncement,
  type AnnouncementRow,
} from "@/hooks/use-communications";
import { Megaphone } from "lucide-react";

const MOH_ANNOUNCEMENT_ROLES = ["tier1", "tier2_officer", "tier2_registrar", "system_admin"];

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function AnnouncementsContent() {
  const { user } = useSession();
  const { data: perms } = usePermissions(user);
  const isMoh =
    perms &&
    !("error" in perms) &&
    MOH_ANNOUNCEMENT_ROLES.includes((perms as { role?: string }).role ?? "");

  const { items, status, error, refetch } = useAnnouncementsList();
  const { create, status: createStatus, error: createError } = useCreateAnnouncement(() => {
    setModalOpen(false);
    setSubject("");
    setContent("");
    setExpiresAt("");
    refetch();
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    await create({
      subject: subject.trim(),
      content: content.trim(),
      expires_at: expiresAt || null,
    });
  };

  if (!isMoh) {
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
          <span className="text-[#111827]">System Announcements</span>
        </nav>
        <div className="rounded-lg border border-[#f59e0b] bg-[#fffbeb] p-6 text-[#92400e]">
          <p className="font-medium">Access denied</p>
          <p className="mt-1 text-sm">System announcements are available to MOH users only.</p>
        </div>
      </div>
    );
  }

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
          <span className="text-[#111827]">System Announcements</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">System Announcements</h1>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]"
              aria-hidden
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
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
          <span className="text-[#111827]">System Announcements</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">System Announcements</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load announcements.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        <span className="text-[#111827]">System Announcements</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">System Announcements</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
        >
          Create Announcement
        </button>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
            <Megaphone className="h-16 w-16 text-[#9ca3af]" aria-hidden />
            <p className="text-base font-medium text-[#6b7280]">No announcements</p>
            <p className="text-sm text-[#9ca3af]">Create one to broadcast to users.</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              Create Announcement
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[#e5e7eb]">
            {items.map((a) => (
              <li key={a.id}>
                <AnnouncementItem row={a} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#111827]">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="ann-subject" className="block text-sm font-medium text-[#111827]">
                  Title <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  id="ann-subject"
                  type="text"
                  placeholder="Enter announcement title..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="ann-content" className="block text-sm font-medium text-[#111827]">
                  Content <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  id="ann-content"
                  placeholder="Enter content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="ann-expires" className="block text-sm font-medium text-[#111827]">
                  Expires at (optional)
                </label>
                <input
                  id="ann-expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                />
              </div>
              <div className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e40af]">
                <p>Announcements are retained for 7 years per regulatory requirements (Law No. 09-08) and form part of the communication audit trail.</p>
              </div>
              {createError && <p className="text-sm text-[#ef4444]">{createError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createStatus === "loading" || !subject.trim() || !content.trim()}
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  {createStatus === "loading" ? "Broadcasting…" : "Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function AnnouncementItem({ row }: { row: AnnouncementRow }) {
  const exp = row.announcement_expires_at
    ? new Date(row.announcement_expires_at)
    : null;
  const isExpired = exp ? exp.getTime() < Date.now() : false;

  return (
    <div className="flex flex-col gap-1 px-4 py-3 hover:bg-[#f9fafb]">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/communications/inbox/${row.id}`}
          className="font-semibold text-[#111827] hover:underline"
        >
          {row.subject || "—"}
        </Link>
        <span className="shrink-0 text-xs text-[#6b7280]">
          ✓ Sent · {formatTimeAgo(row.created_at)}
        </span>
      </div>
      <p className="text-sm text-[#6b7280]">To: All Users</p>
      <p className="line-clamp-2 text-sm text-[#6b7280]">{row.subject || "No preview"}</p>
      {isExpired && (
        <span className="inline-flex w-fit rounded px-1.5 py-0.5 text-xs font-semibold bg-[#fef3c7] text-[#b45309]">
          Expired
        </span>
      )}
      <div className="mt-1 flex gap-2">
        <Link
          href={`/communications/inbox/${row.id}`}
          className="text-sm font-medium text-[#2563eb] hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}
