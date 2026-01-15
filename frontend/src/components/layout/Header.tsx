"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";

import { useApp } from "@/contexts/AppContext";
import { UserMenu } from "@/components/layout/UserMenu";
import { useUnreadNotificationsCount } from "@/hooks/useUnreadNotificationsCount";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function Header() {
  const { user, mobileNavOpen, setMobileNavOpen } = useApp();
  const pathname = usePathname();
  const { data: unreadCount } = useUnreadNotificationsCount(user?.id);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const moduleInfo = (() => {
    if (pathname.startsWith("/rmm")) return { key: "rmm", label: "RMM", tooltip: "Registry Management (RMM)", href: "/rmm" };
    if (pathname.startsWith("/vci")) return { key: "vci", label: "VCI", tooltip: "Value Chain Intelligence (VCI)", href: "/vci" };
    if (pathname.startsWith("/ecs")) return { key: "ecs", label: "ECS", tooltip: "Export Control System (ECS)", href: "/ecs" };
    if (pathname.startsWith("/cmc")) return { key: "cmc", label: "CMC", tooltip: "Compliance Monitoring Center (CMC)", href: "/cmc" };
    if (pathname.startsWith("/enforcement")) return { key: "enforcement", label: "ENF", tooltip: "Enforcement", href: "/enforcement" };
    return null;
  })();

  const moduleClass =
    moduleInfo?.key === "rmm"
      ? "bg-blue-600"
      : moduleInfo?.key === "vci"
        ? "bg-green-600"
        : moduleInfo?.key === "ecs"
          ? "bg-amber-500"
          : moduleInfo?.key === "cmc"
            ? "bg-purple-600"
            : moduleInfo?.key === "enforcement"
              ? "bg-red-600"
              : "bg-zinc-600";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-label="Return to dashboard"
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Image src="/next.svg" alt="MOH Logo - Return to Dashboard" width={120} height={24} priority />
          </Link>

          {moduleInfo ? (
            <Link
              href={moduleInfo.href}
              title={moduleInfo.tooltip}
              aria-label={moduleInfo.tooltip}
              className={clsx(
                "h-6 rounded-md px-2 text-xs font-semibold uppercase tracking-wide text-white",
                "flex items-center",
                "transition-transform hover:scale-[1.03]",
                moduleClass,
              )}
            >
              {moduleInfo.label}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>

          <button
            type="button"
            aria-label="Open search"
            title="Search (Ctrl+K)"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => {
              // Search UI comes later; keep placeholder to match header pattern.
              console.log("Search UI not implemented yet.");
            }}
          >
            🔍
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={notificationsOpen}
              title="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5 text-zinc-700" />
              {(unreadCount ?? 0) > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[11px] font-semibold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </button>

            <NotificationCenter
              open={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              userId={user?.id}
            />
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

