/**
 * Header Component
 * 
 * Wireframe: task-0.5.1.15-header-component.md
 * Route: All dashboard pages (via dashboard layout)
 * Implements: Fixed header with logo, module indicator, search, notifications, user menu
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md
 * 
 * Database: users table (id, email, full_name, avatar_url, role, company_id)
 * RPC Functions: shared_get_user_permissions(user_id)
 * 
 * Features:
 * - Fixed header (64px height)
 * - Logo (MOH logo, clickable → /dashboard)
 * - Module indicator (badge, color-coded, tooltip)
 * - Search icon (40px × 40px, opens search modal)
 * - Notifications icon (40px × 40px, badge count, opens notification center)
 * - User menu (avatar, dropdown: Profile, Settings, Logout)
 * - Responsive: Hamburger menu on mobile
 * - Accessibility: ARIA labels, keyboard navigation, focus management
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { MODULE_NAMES, MODULE_COLORS, type Module } from "@/lib/constants/modules";
import { cn } from "@/lib/utils/cn";
import { NotificationCenter } from "./NotificationCenter";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { notifications, unreadCount, loading: notificationsLoading } = useNotifications(user);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Determine current module from pathname
  useEffect(() => {
    if (pathname?.startsWith("/rmm")) {
      setCurrentModule("rmm");
    } else if (pathname?.startsWith("/vci")) {
      setCurrentModule("vci");
    } else if (pathname?.startsWith("/ecs")) {
      setCurrentModule("ecs");
    } else if (pathname?.startsWith("/cmc")) {
      setCurrentModule("cmc");
    } else if (pathname?.startsWith("/enforcement")) {
      setCurrentModule(null); // Enforcement doesn't have abbreviation
    } else {
      setCurrentModule(null);
    }
  }, [pathname]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close modals/dropdowns
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    router.push("/dashboard");
  };

  const handleModuleClick = () => {
    if (currentModule === "rmm") {
      router.push("/rmm/overview");
    } else if (currentModule === "vci") {
      router.push("/vci/dashboard");
    } else if (currentModule === "ecs") {
      router.push("/ecs/overview");
    } else if (currentModule === "cmc") {
      router.push("/cmc/overview");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-bg-primary border-b border-border-default",
        "z-[1000] shadow-subtle backdrop-blur-sm",
        "flex items-center justify-between px-4",
        "transition-all duration-150"
      )}
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            onSidebarToggle?.();
          }}
          className={cn(
            "md:hidden w-10 h-10 flex items-center justify-center",
            "rounded-md hover:bg-bg-secondary transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          )}
          aria-label="Toggle sidebar navigation"
          aria-expanded={sidebarOpen}
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className={cn(
            "flex items-center h-10",
            "hover:opacity-80 transition-opacity duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
          )}
          aria-label="Return to dashboard"
        >
          <span className="text-xl font-bold text-primary-600">MOH</span>
        </button>

        {/* Module Indicator */}
        {currentModule && (
          <button
            onClick={handleModuleClick}
            className={cn(
              "hidden md:flex items-center px-2 py-1 rounded-md",
              "text-xs font-semibold uppercase tracking-wider text-white",
              MODULE_COLORS[currentModule],
              "hover:opacity-90 transition-opacity duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              "group relative"
            )}
            aria-label={`${MODULE_NAMES[currentModule].full} module (${MODULE_NAMES[currentModule].abbr})`}
            title={`${MODULE_NAMES[currentModule].full} (${MODULE_NAMES[currentModule].abbr})`}
          >
            {MODULE_NAMES[currentModule].abbr}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-md",
            "hover:bg-bg-secondary transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            "cursor-pointer"
          )}
          aria-label="Open search (Ctrl+K)"
          title="Search (Ctrl+K)"
        >
          <Search className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-md relative",
              "hover:bg-bg-secondary transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              "cursor-pointer"
            )}
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute top-1 right-1 w-4.5 h-4.5 rounded-full",
                  "bg-error-500 border-2 border-white",
                  "flex items-center justify-center",
                  "text-[11px] font-semibold text-white",
                  "animate-pulse"
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Center Dropdown */}
          {notificationsOpen && (
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </div>

        {/* User Menu */}
        <UserMenu
          user={user}
          permissions={permissions}
          loading={permissionsLoading}
          isOpen={userMenuOpen}
          onOpenChange={setUserMenuOpen}
          onCloseNotifications={() => setNotificationsOpen(false)}
        />
      </div>
    </header>
  );
}
