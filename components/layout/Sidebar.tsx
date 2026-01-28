"use client";

/**
 * Wireframe: task-0.5.1.16-sidebar-navigation.md
 * Implements: Sidebar navigation. Width 280px expanded, 64px collapsed.
 * Route: All dashboard pages.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 */

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS, isMoh } from "@/lib/nav-config";
import { iconMap } from "./icon-map";

type SidebarProps = {
  role: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
};

export function Sidebar({
  role,
  mobileOpen,
  onMobileClose,
  expanded,
  onExpandedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const moh = isMoh(role);

  const toggle = useCallback(() => onExpandedChange(!expanded), [expanded, onExpandedChange]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-[1040] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`
          fixed left-0 top-[var(--header-height)] z-[1050] flex h-[calc(100vh-var(--header-height))] 
          w-[280px] flex-col overflow-y-auto border-r border-[#e5e7eb] bg-white 
          scrollbar-thin shadow-[1px_0_3px_0_rgba(0,0,0,0.1)]
          transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          md:flex
          ${expanded ? "w-[280px]" : "w-[64px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="flex flex-1 flex-col py-2">
          {NAV_SECTIONS.map((section) => {
            const isEnforcement = section.label === "Enforcement";
            if (isEnforcement && !moh) return null;

            const items = section.items.filter((item) => {
              if (item.roles === "moh" && !moh) return false;
              return true;
            });
            if (items.length === 0) return null;

            return (
              <div key={section.label} className="mt-4 first:mt-2">
                {expanded && (
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-[#111827]">
                      {section.label}
                    </p>
                    {section.labelAbbr && (
                      <p className="text-xs text-[#6b7280]">
                        {section.labelAbbr}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-0.5 px-2">
                  {items.map((item) => {
                    const Icon = iconMap[item.icon] ?? iconMap.LayoutDashboard;
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={onMobileClose}
                        className={`
                          flex h-10 items-center gap-3 rounded-md px-3
                          transition-colors duration-150
                          ${active
                            ? "border-l-[3px] border-[#3b82f6] bg-[#eff6ff] font-semibold text-[#111827] [&_svg]:text-[#3b82f6]"
                            : "border-l-[3px] border-transparent text-[#111827] hover:bg-[#f9fafb] [&_svg]:text-[#6b7280]"}
                        `}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                        {expanded && (
                          <span className="truncate text-sm">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-full items-center justify-center border-t border-[#e5e7eb] hover:bg-[#f9fafb]"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {(() => {
            const Icon = expanded ? iconMap.ChevronLeft : iconMap.ChevronRight;
            return <Icon className="h-5 w-5 text-[#6b7280]" aria-hidden />;
          })()}
        </button>
      </aside>
    </>
  );
}
