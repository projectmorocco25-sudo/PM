"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  FileText,
  Info,
  MessageSquare,
  Scale,
  ShieldAlert,
} from "lucide-react";

import type { NotificationRow } from "@/hooks/useNotifications";

function formatRelativeTime(iso: string) {
  const ts = new Date(iso).getTime();
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function iconForType(type: string) {
  const t = type.toLowerCase();
  if (t.includes("breach") || t.includes("threshold")) return { Icon: AlertTriangle, className: "text-amber-600" };
  if (t.includes("message") || t.includes("communication")) return { Icon: MessageSquare, className: "text-blue-600" };
  if (t.includes("workflow") || t.includes("approval")) return { Icon: BadgeCheck, className: "text-green-600" };
  if (t.includes("enforcement")) return { Icon: ShieldAlert, className: "text-red-600" };
  if (t.includes("appeal")) return { Icon: Scale, className: "text-purple-600" };
  if (t.includes("submission")) return { Icon: FileText, className: "text-blue-600" };
  return { Icon: Info, className: "text-zinc-500" };
}

export function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationRow;
  onClick?: () => void;
}) {
  const { Icon, className } = iconForType(notification.type);
  const href = notification.link ?? "/notifications";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "relative block px-4 py-3 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "hover:bg-zinc-50",
      )}
    >
      {!notification.is_read ? (
        <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" aria-hidden="true" />
      ) : null}

      <div className="flex items-start gap-3">
        <div className={clsx("mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-zinc-50", className)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={clsx(
              "text-sm",
              notification.is_read ? "font-medium text-zinc-700" : "font-semibold text-zinc-900",
            )}
          >
            {notification.title}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-zinc-600">{notification.message}</div>
          <div className="mt-2 text-xs text-zinc-400">{formatRelativeTime(notification.created_at)}</div>
        </div>
      </div>
    </Link>
  );
}

