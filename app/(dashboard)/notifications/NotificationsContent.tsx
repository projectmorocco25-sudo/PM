"use client";

/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Notifications page: list, Mark all read, Settings, Filters, Load more.
 * APIs: shared_get_notifications, shared_mark_notification_read. Table: notifications.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import {
  useNotificationsPage,
  type NotificationRow,
} from "@/hooks/use-notifications";
import { Inbox, ChevronDown, Settings, Filter } from "lucide-react";

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

type FilterStatus = "all" | "unread" | "read";

function filterAndSort(
  items: NotificationRow[],
  status: FilterStatus
): NotificationRow[] {
  let list = items;
  if (status === "unread") list = list.filter((n) => !n.is_read);
  if (status === "read") list = list.filter((n) => n.is_read);
  return [...list].sort((a, b) => {
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function NotificationsContent() {
  const { user } = useSession();
  const {
    items,
    status,
    error,
    hasMore,
    loadingMore,
    refetch,
    loadMore,
    markRead,
    markAllRead,
  } = useNotificationsPage(user?.id ?? null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => filterAndSort(items, filterStatus),
    [items, filterStatus]
  );
  const unreadCount = items.filter((n) => !n.is_read).length;

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Notifications</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Notifications</h1>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]"
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
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Notifications</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Notifications</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load notifications.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Notifications</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Notifications</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            Mark all read
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
              aria-expanded={filtersOpen}
              aria-haspopup="listbox"
              aria-label="Filters"
            >
              <Filter className="h-4 w-4" aria-hidden />
              Filters
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
            {filtersOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setFiltersOpen(false)}
                />
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg"
                  role="listbox"
                >
                  {(["all", "unread", "read"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="option"
                      aria-selected={filterStatus === s}
                      onClick={() => {
                        setFilterStatus(s);
                        setFiltersOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#f9fafb] capitalize"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
        {status === "empty" || filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6" role="status">
            <Inbox className="h-16 w-16 text-[#9ca3af]" aria-hidden />
            <p className="text-base font-medium text-[#6b7280]">No notifications</p>
            <p className="text-sm text-[#9ca3af]">You&apos;re all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#e5e7eb]">
            {filtered.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={n}
                  onMarkRead={markRead}
                  formatTime={formatTimeAgo}
                />
              </li>
            ))}
          </ul>
        )}

        {hasMore && filtered.length > 0 && (
          <div className="border-t border-[#e5e7eb] px-4 py-3">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] py-2 text-sm font-medium text-[#111827] hover:bg-[#f3f4f6] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
            >
              {loadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  formatTime,
}: {
  notification: NotificationRow;
  onMarkRead: (id: string) => Promise<{ success?: boolean } | undefined>;
  formatTime: (iso: string) => string;
}) {
  const { id, title, message, link, is_read, created_at } = notification;
  const [marking, setMarking] = useState(false);

  const content = (
    <>
      <p
        className={`text-sm ${!is_read ? "font-semibold text-[#111827]" : "font-normal text-[#111827]"}`}
      >
        {title}
      </p>
      <p className="mt-0.5 line-clamp-2 text-sm text-[#6b7280]">{message}</p>
      <p className="mt-1 text-xs text-[#9ca3af]">{formatTime(created_at)}</p>
    </>
  );

  return (
    <div
      className={`flex gap-3 px-4 py-3 min-h-[64px] transition-colors hover:bg-[#f9fafb] ${
        !is_read ? "bg-[#eff6ff]" : ""
      }`}
    >
      <div className="flex shrink-0 pt-0.5" aria-hidden>
        {is_read ? (
          <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-[#3b82f6]" aria-label="Unread" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {link ? (
          <Link href={link} className="block">
            {content}
          </Link>
        ) : (
          <div className="block">{content}</div>
        )}
      </div>
      <div className="flex shrink-0 items-start">
        {!is_read && (
          <button
            type="button"
            disabled={marking}
            onClick={async () => {
              setMarking(true);
              await onMarkRead(id);
              setMarking(false);
            }}
            className="rounded px-2 py-1 text-xs font-medium text-[#2563eb] hover:bg-[#eff6ff] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-1"
          >
            {marking ? "…" : "Mark read"}
          </button>
        )}
      </div>
    </div>
  );
}
