"use client";

/**
 * Wireframe: task-0.5.1.15-header-component.md
 * Implements: Fixed header 64px, logo, module badge, search, notifications, user menu.
 * Data: shared_get_user_permissions (users), shared_get_notifications (hosted Supabase only).
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md
 */

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NotificationCenter } from "./NotificationCenter";
import { useNotifications } from "@/hooks/use-notifications";
import type { User } from "@supabase/supabase-js";
import type { PermissionsResult } from "@/hooks/use-permissions";

const MODULE_MAP: Record<string, { label: string; color: string }> = {
  "/rmm": { label: "RMM", color: "bg-[#3b82f6] text-white" },
  "/vci": { label: "VCI", color: "bg-[#22c55e] text-white" },
  "/ecs": { label: "ECS", color: "bg-[#f59e0b] text-white" },
  "/cmc": { label: "CMC", color: "bg-[#8b5cf6] text-white" },
  "/enforcement": { label: "Enforcement", color: "bg-[#ef4444] text-white" },
};

type HeaderProps = {
  user: User | null;
  permissions: PermissionsResult | null;
  onMenuClick?: () => void;
};

export function Header({ user, permissions, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement>(null);

  const { data: notifications, status, unreadCount, refetch } = useNotifications(
    user?.id ?? null,
    15
  );

  const module = Object.entries(MODULE_MAP).find(([path]) =>
    pathname.startsWith(path)
  )?.[1];

  const initials = user?.email
    ?.slice(0, 2)
    .toUpperCase()
    ?.replace(/[^A-Z]/g, "X") ?? "?";

  return (
    <header
      className="fixed left-0 right-0 top-0 z-[1000] flex h-[64px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-[#f9fafb] md:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5 text-[#6b7280]" aria-hidden />
          </button>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 focus:opacity-80"
          aria-label="Return to dashboard"
        >
          <span className="text-lg font-bold text-[#111827]">MOH</span>
        </Link>
        {module && (
          <span
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide ${module.color}`}
            title={module.label}
          >
            {module.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-[#f9fafb]"
          aria-label="Open search (Ctrl+K)"
          title="Search (Ctrl+K)"
        >
          <Search className="h-5 w-5 text-[#6b7280]" aria-hidden />
        </button>

        <div className="relative">
          <button
            ref={notifBtnRef}
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-[#f9fafb]"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          >
            <Bell className="h-5 w-5 text-[#6b7280]" aria-hidden />
            {unreadCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#dc2626] px-1 text-[11px] font-semibold text-white"
                aria-hidden
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            anchorRef={notifBtnRef}
            notifications={notifications}
            status={status}
            unreadCount={unreadCount}
            refetch={refetch}
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md p-1 hover:bg-[#f9fafb]"
            aria-expanded={userMenuOpen}
            aria-label="User menu"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-sm font-semibold text-white"
              aria-hidden
            >
              {initials}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-[#6b7280] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          {userMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-[1055]"
                onClick={() => setUserMenuOpen(false)}
              />
              <div
                className="absolute right-0 top-full z-[1060] mt-2 w-[200px] rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg"
                role="menu"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <div className="my-1 border-t border-[#e5e7eb]" />
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#111827] hover:bg-[#f9fafb] hover:text-[#dc2626]"
                  role="menuitem"
                  onClick={async () => {
                    setUserMenuOpen(false);
                    await createClient().auth.signOut();
                    router.push("/login");
                    router.refresh();
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
