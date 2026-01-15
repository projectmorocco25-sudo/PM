"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useApp } from "@/contexts/AppContext";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { SkipLink } from "@/components/ui/skip-link";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();
  return (
    <div className="min-h-screen bg-zinc-50">
      <SkipLink />
      <Header />
      <MobileSidebar />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 p-6"
          style={{
            // Sidebar is present only at md+. This keeps layout stable.
            paddingLeft: 0,
          }}
          data-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

