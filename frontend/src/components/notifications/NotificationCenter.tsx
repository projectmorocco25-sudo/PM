"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Inbox } from "lucide-react";

import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";

export function NotificationCenter({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId: string | null | undefined;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { data: notifications, isLoading } = useNotifications(userId, 12);
  const markRead = useMarkNotificationRead(userId, 12);
  const markAll = useMarkAllNotificationsRead(userId, 12);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const items = notifications ?? [];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Notification center"
      className={clsx(
        "absolute right-0 top-full z-[1050] mt-2 w-[400px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg",
        "animate-in fade-in-0 slide-in-from-top-1 duration-200",
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div className="text-base font-semibold text-zinc-900">Notifications</div>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
          disabled={!userId || markAll.isPending || items.filter((n) => !n.is_read).length === 0}
          onClick={() => markAll.mutate()}
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
            <Inbox className="h-10 w-10 text-zinc-300" aria-hidden="true" />
            <div className="text-base font-semibold text-zinc-900">No notifications</div>
            <div className="text-sm text-zinc-600">You&apos;re all caught up!</div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={() => {
                  if (!n.is_read) markRead.mutate(n.id);
                  onClose();
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block h-12 px-4 text-center text-sm font-medium leading-[48px] text-blue-600 hover:bg-zinc-50"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}

