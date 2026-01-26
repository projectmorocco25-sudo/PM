/**
 * Sidebar Navigation Component
 * 
 * Wireframe: task-0.5.1.16-sidebar-navigation.md
 * Route: All dashboard pages (via dashboard layout)
 * Implements: Collapsible sidebar navigation with module sections
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 * 
 * Database: users table (role, company_id), system_config table (module_name, is_active)
 * RPC Functions: shared_get_user_permissions(user_id)
 * 
 * Features:
 * - Width: 280px (expanded), 64px (collapsed)
 * - Navigation sections: Global, RMM, VCI, ECS (conditional), CMC (conditional), Enforcement (MOH only), Help & Info
 * - Section headers: Full name + abbreviation (expanded), tooltip (collapsed)
 * - Active state: Blue background, left border (3px), bold text
 * - Responsive: Drawer on mobile
 * - Accessibility: ARIA labels, keyboard navigation, focus management
 */

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Bell,
  FileSearch,
  Building2,
  Package,
  Box,
  BarChart3,
  FileText,
  Settings,
  AlertTriangle,
  TrendingUp,
  Plane,
  CheckCircle,
  Scale,
  FileCheck,
  HelpCircle,
  BookOpen,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { useModuleActivation } from "@/lib/hooks/use-module-activation";
import { ROLES, hasEnforcementAccess, type Role } from "@/lib/constants/roles";
import { MODULE_NAMES, MODULES, type Module } from "@/lib/constants/modules";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  roles?: string[];
}

interface NavSection {
  label: string;
  labelAbbr?: string;
  tooltip?: string;
  items: NavItem[];
  conditional?: boolean;
  conditionCheck?: () => boolean;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen: externalMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [expanded, setExpanded] = useState(true);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  
  const mobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;
  const setMobileOpen = onMobileClose ? (open: boolean) => { if (!open) onMobileClose(); } : setInternalMobileOpen;

  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  const ecsActive = useModuleActivation(MODULES.ECS);
  const cmcActive = useModuleActivation(MODULES.CMC);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null) {
      setExpanded(saved === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", expanded.toString());
  }, [expanded]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]);

  const userRole = permissions?.role as Role | null | undefined;

  // Check if user has access to enforcement
  const hasEnforcement = hasEnforcementAccess(userRole);

  // Navigation sections
  const navSections: NavSection[] = [
    {
      label: "Global",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/communications/inbox", label: "Communications", icon: MessageSquare },
        { href: "/history", label: "Regulatory Activity History", icon: History },
        { href: "/notifications", label: "Notifications", icon: Bell },
        {
          href: "/audit/logs",
          label: "Audit",
          icon: FileSearch,
          roles: [ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.AUDITOR],
        },
      ],
    },
    {
      label: "Registry Management",
      labelAbbr: "(RMM)",
      tooltip: "Registry Management (RMM)",
      items: [
        { href: "/rmm", label: "Overview", icon: BarChart3 },
        { href: "/rmm/companies", label: "Companies", icon: Building2 },
        { href: "/rmm/products", label: "Products", icon: Package },
        { href: "/rmm/skus", label: "SKUs", icon: Box },
        { href: "/rmm/submissions", label: "Submissions", icon: FileText },
        {
          href: "/rmm/atc-codes",
          label: "ATC Codes",
          icon: FileCheck,
          roles: [ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.SYSTEM_ADMIN],
        },
        {
          href: "/rmm/critical-medicines",
          label: "Critical Medicines",
          icon: AlertTriangle,
          roles: [ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.SYSTEM_ADMIN],
        },
      ],
    },
    {
      label: "Value Chain Intelligence",
      labelAbbr: "(VCI)",
      tooltip: "Value Chain Intelligence (VCI)",
      items: [
        { href: "/vci/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/vci/submissions", label: "Submissions", icon: FileText },
        { href: "/vci/thresholds", label: "Thresholds", icon: Settings },
        { href: "/vci/breaches", label: "Compliance Violations", icon: AlertTriangle },
        {
          href: "/vci/governance",
          label: "Governance",
          icon: TrendingUp,
          roles: [ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR],
        },
      ],
    },
    {
      label: "Export Control System",
      labelAbbr: "(ECS)",
      tooltip: "Export Control System (ECS)",
      conditional: true,
      conditionCheck: () => ecsActive.isActive,
      items: [
        { href: "/ecs/overview", label: "Overview", icon: BarChart3 },
        { href: "/ecs/export-requests", label: "Export Authorization Requests", icon: Plane },
        { href: "/ecs/authorizations", label: "Export Authorizations", icon: CheckCircle },
      ],
    },
    {
      label: "Compliance Monitoring Center",
      labelAbbr: "(CMC)",
      tooltip: "Compliance Monitoring Center (CMC)",
      conditional: true,
      conditionCheck: () => cmcActive.isActive,
      items: [
        { href: "/cmc/overview", label: "Overview", icon: BarChart3 },
        { href: "/cmc/scores", label: "Regulatory Compliance Ratings", icon: FileCheck },
        { href: "/cmc/disputes", label: "Compliance Disputes", icon: Scale },
        { href: "/cmc/reports", label: "Compliance Monitoring Reports", icon: FileText },
      ],
    },
    {
      label: "Enforcement",
      tooltip: "Enforcement",
      conditional: true,
      conditionCheck: () => hasEnforcement,
      items: [
        { href: "/enforcement", label: "Dashboard", icon: BarChart3 },
        { href: "/enforcement/actions", label: "Actions", icon: Scale },
        { href: "/enforcement/pending-approvals", label: "Pending Regulatory Approvals", icon: FileCheck },
        { href: "/enforcement/reports", label: "Enforcement Activity Reports", icon: FileText },
      ],
    },
    {
      label: "Help & Info",
      tooltip: "Help & Info",
      items: [
        { href: "/help/support", label: "Support Center", icon: HelpCircle },
        { href: "/help/faq", label: "FAQ", icon: BookOpen },
        { href: "/help/docs", label: "Documentation", icon: BookOpen },
        { href: "/help/contact", label: "Contact Support", icon: Phone },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const shouldShowSection = (section: NavSection) => {
    if (section.conditional && section.conditionCheck) {
      return section.conditionCheck();
    }
    return true;
  };

  const shouldShowItem = (item: NavItem) => {
    if (item.roles && userRole) {
      return item.roles.includes(userRole);
    }
    return true;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {navSections.map((section, sectionIndex) => {
          if (!shouldShowSection(section)) return null;

          const filteredItems = section.items.filter(shouldShowItem);
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.label} className={cn("mb-4", sectionIndex === 0 && "mt-0")}>
              {/* Section Header */}
              {expanded && (
                <div className="px-3 py-2 mb-2">
                  <div className="text-sm font-semibold text-text-primary leading-tight">
                    {section.label}
                  </div>
                  {section.labelAbbr && (
                    <div className="text-xs text-text-secondary leading-tight mt-0.5">
                      {section.labelAbbr}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center h-10 rounded-md transition-colors duration-150",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                        expanded ? "px-3 gap-3" : "px-2 justify-center",
                        active
                          ? "bg-primary-50 border-l-[3px] border-primary-500 text-text-primary font-semibold"
                          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                      )}
                      aria-label={expanded ? item.label : `${item.label}${section.tooltip ? ` - ${section.tooltip}` : ""}`}
                      title={!expanded ? `${item.label}${section.tooltip ? ` - ${section.tooltip}` : ""}` : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          active ? "text-primary-500" : "text-text-secondary"
                        )}
                      />
                      {expanded && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-semibold text-white bg-error-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border-default">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full h-12 flex items-center justify-center",
            "hover:bg-bg-secondary transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
            expanded ? "px-3" : "px-2"
          )}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <>
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
              {expanded && <span className="ml-2 text-sm text-text-secondary">Collapse</span>}
            </>
          ) : (
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-default",
          "z-[100] shadow-subtle transition-all duration-300 ease-in-out",
          "hidden md:block",
          expanded ? "w-[280px]" : "w-16"
        )}
        aria-label="Sidebar navigation"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1040] md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            className={cn(
              "fixed left-0 top-16 bottom-0 w-[280px] bg-bg-primary border-r border-border-default",
              "z-[1050] shadow-medium",
              "md:hidden animate-in slide-in-from-left duration-300"
            )}
            aria-label="Sidebar navigation"
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
