"use client";

/**
 * Wireframe: task-0.5.1.17-notification-center-component.md
 * Implements: Notification dropdown. Max 10–15 items, mark read, view all.
 * Data: shared_get_notifications, shared_mark_notification_read (hosted Supabase only).
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md
 */

import { useRef, useEffect } from "react";
import Link from "next/link";
import type { NotificationRow } from "@/hooks/use-notifications";
import { useMarkNotificationRead } from "@/hooks/use-notifications";
import { Inbox } from "lucide-react";

type NotificationCenterProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  notifications: NotificationRow[];
  status: "loading" | "empty" | "error" | "success";
  unreadCount: number;
  refetch: () => void;
};

export function NotificationCenter({
  open,
  onClose,
  anchorRef,
  notifications,
  status,
  unreadCount,
  refetch,
}: NotificationCenterProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    for (const n of unread) {
      await markRead(n.id);
    }
    refetch();
  };

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full z-[1060] mt-2 w-[400px] max-w-[calc(100vw-32px)] overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <h2 className="text-base font-semibold text-[#111827]">Notifications</h2>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-sm text-[#2563eb] hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {status === "loading" && (
          <div className="flex flex-col gap-2 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded bg-[#f3f4f6]"
                aria-hidden
              />
            ))}
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <p className="text-sm text-[#6b7280]">
              Failed to load notifications. Please try again.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="rounded bg-[#3b82f6] px-3 py-1.5 text-sm text-white hover:bg-[#2563eb]"
            >
              Retry
            </button>
          </div>
        )}
        {status === "empty" && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Inbox className="h-16 w-16 text-[#9ca3af]" aria-hidden />
            <p className="text-base font-medium text-[#6b7280]">No notifications</p>
            <p className="text-sm text-[#6b7280]">You&apos;re all caught up!</p>
          </div>
        )}
        {status === "success" && notifications.length > 0 && (
          <ul className="divide-y divide-[#e5e7eb]">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.link ?? "/notifications"}
                  onClick={() => {
                    if (!n.is_read) markRead(n.id).then(refetch);
                    onClose();
                  }}
                  className={`flex gap-3 px-4 py-3 hover:bg-[#f9fafb] ${!n.is_read ? "border-l-[3px] border-[#3b82f6] bg-[#f9fafb]/50" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${!n.is_read ? "font-semibold text-[#111827]" : "font-normal text-[#6b7280]"}`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-[#6b7280]">
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-[#9ca3af]">{formatTime(n.created_at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-[#e5e7eb]">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex h-12 items-center justify-center text-sm font-medium text-[#2563eb] hover:bg-[#f9fafb]"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}
