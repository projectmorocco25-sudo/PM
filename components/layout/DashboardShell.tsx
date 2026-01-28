"use client";

/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard shell (header + sidebar + main content area).
 * Route: All (dashboard) pages.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";

const SIDEBAR_STORAGE_KEY = "pm-sidebar-expanded";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const { data: permissions } = usePermissions(user);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      setSidebarExpanded(stored !== "false");
    }
  }, []);

  const persistSidebar = (value: boolean) => {
    setSidebarExpanded(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
  }, [user, sessionLoading, router]);

  if (sessionLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent" />
      </div>
    );
  }

  const role =
    permissions && !("error" in permissions) ? permissions.role : "company_user";

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header
        user={user}
        permissions={permissions ?? null}
        onMenuClick={() => setSidebarMobileOpen(true)}
      />
      <Sidebar
        role={role}
        mobileOpen={sidebarMobileOpen}
        onMobileClose={() => setSidebarMobileOpen(false)}
        expanded={sidebarExpanded}
        onExpandedChange={persistSidebar}
      />
      <main
        className={`min-h-[calc(100vh-var(--header-height))] pt-[var(--header-height)] transition-[padding] duration-300 pl-0 ${sidebarExpanded ? "md:pl-[280px]" : "md:pl-[64px]"}`}
      >
        <div className="mx-auto max-w-[1920px] p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
