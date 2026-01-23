/**
 * Dashboard Layout
 * 
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Route: All dashboard pages (/(dashboard)/*)
 * Implements: Dashboard layout with Header, Sidebar, and Main Content Area
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 * 
 * Database: users table, notifications table, system_config table
 * RPC Functions: shared_get_user_permissions(user_id), shared_get_notifications(user_id)
 * 
 * Features:
 * - Fixed header (64px height)
 * - Sidebar (280px expanded, 64px collapsed)
 * - Main content area (flexible width)
 * - Responsive: Desktop (1024px+), Tablet (768px-1023px), Mobile (<768px)
 * - Breadcrumbs, page header, content cards
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils/cn";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <Header onSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Layout Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-64px)]",
            "transition-all duration-300 ease-in-out",
            sidebarExpanded ? "md:ml-[280px]" : "md:ml-16"
          )}
        >
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
