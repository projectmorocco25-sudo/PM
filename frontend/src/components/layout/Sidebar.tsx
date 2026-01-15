"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  History,
  LayoutDashboard,
  Mail,
  Package,
  Scale,
  Settings,
  Shield,
  Target,
  Upload,
  BadgeCheck,
  LifeBuoy,
  HelpCircle,
  Phone,
} from "lucide-react";

import { useApp } from "@/contexts/AppContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useUnreadNotificationsCount } from "@/hooks/useUnreadNotificationsCount";
import { useUnreadCommunicationsCount } from "@/hooks/useUnreadCommunicationsCount";
import { useModuleActive } from "@/hooks/useModuleActive";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles?: string[]; // allowed roles, if specified
};

type NavGroup = {
  title: string;
  abbr?: string;
  tooltip?: string;
  items: NavItem[];
  moduleKey?: string; // for activation checks
};

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
}

function SidebarItem({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  const badge = item.badge ?? 0;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={clsx(
        "relative flex h-10 items-center rounded-md transition-colors",
        collapsed ? "justify-center px-2" : "gap-3 px-3",
        active
          ? "bg-blue-50 font-semibold text-zinc-900 ring-1 ring-inset ring-blue-200"
          : "text-zinc-700 hover:bg-zinc-50",
      )}
    >
      <Icon className={clsx("h-5 w-5", active ? "text-blue-600" : "text-zinc-500")} />
      {!collapsed ? <span className="truncate text-sm">{item.label}</span> : null}
      {badge > 0 ? (
        <span
          className={clsx(
            "absolute right-2 top-1/2 -translate-y-1/2",
            collapsed && "right-1 top-1",
          )}
        >
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[11px] font-semibold leading-none text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        </span>
      ) : null}
    </Link>
  );
}

function SidebarGroup({
  group,
  collapsed,
  pathname,
  role,
}: {
  group: NavGroup;
  collapsed: boolean;
  pathname: string;
  role: string | null;
}) {
  return (
    <div className="mt-4">
      {!collapsed ? (
        <div className="px-3 py-2">
          <div className="text-sm font-semibold text-zinc-900">{group.title}</div>
          {group.abbr ? <div className="text-xs text-zinc-500">{group.abbr}</div> : null}
        </div>
      ) : null}

      <div className={clsx("space-y-1", collapsed ? "px-2" : "px-2")}>
        {group.items
          .filter((it) => {
            if (!it.roles || it.roles.length === 0) return true;
            return role ? it.roles.includes(role) : false;
          })
          .map((it) => (
            <SidebarItem
              key={it.href}
              item={it}
              collapsed={collapsed}
              active={isActive(pathname, it.href)}
            />
          ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, user } = useApp();
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? null;

  const { data: unreadCount } = useUnreadNotificationsCount(user?.id);
  const { data: unreadComms } = useUnreadCommunicationsCount(user?.id);

  const { data: ecsActive } = useModuleActive("ecs");
  const { data: cmcActive } = useModuleActive("cmc");

  const groups: NavGroup[] = [
    {
      title: "Global",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/communications/inbox", label: "Communications", icon: Mail, badge: unreadComms ?? 0 },
        { href: "/history", label: "Regulatory Activity History", icon: History },
        { href: "/notifications", label: "Notifications", icon: Bell, badge: unreadCount ?? 0 },
        {
          href: "/audit/logs",
          label: "Audit",
          icon: FileSearch,
          roles: ["tier1", "tier2_officer", "tier2_registrar", "auditor", "system_admin"],
        },
        {
          href: "/system-config",
          label: "System Configuration",
          icon: Settings,
          roles: ["tier1", "system_admin"],
        },
      ],
    },
    {
      title: "Registry Management",
      abbr: "(RMM)",
      tooltip: "Registry Management (RMM)",
      items: [
        { href: "/rmm", label: "Overview", icon: BarChart3 },
        { href: "/rmm/companies", label: "Companies", icon: Building2 },
        { href: "/rmm/products", label: "Products", icon: Package },
        { href: "/rmm/skus", label: "SKUs", icon: Boxes },
        { href: "/rmm/submissions", label: "Submissions", icon: Upload },
        {
          href: "/rmm/atc-codes",
          label: "ATC Codes",
          icon: BookOpen,
          roles: ["tier1", "tier2_officer", "tier2_registrar", "system_admin"],
        },
        {
          href: "/rmm/critical-medicines",
          label: "Critical Medicines",
          icon: BadgeCheck,
          roles: ["tier1", "tier2_officer", "tier2_registrar", "system_admin"],
        },
        { href: "/enforcement", label: "Enforcement", icon: Scale, roles: ["tier1", "tier2_officer", "system_admin"] },
      ],
    },
    {
      title: "Value Chain Intelligence",
      abbr: "(VCI)",
      tooltip: "Value Chain Intelligence (VCI)",
      items: [
        { href: "/vci/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/vci/submissions", label: "Submissions", icon: Upload },
        { href: "/vci/thresholds", label: "Thresholds", icon: Target },
        { href: "/vci/breaches", label: "Compliance Violations", icon: AlertTriangle },
        {
          href: "/vci/governance",
          label: "Governance",
          icon: Shield,
          roles: ["tier1", "tier2_officer", "tier2_registrar", "system_admin"],
        },
      ],
    },
  ];

  if (ecsActive) {
    groups.push({
      title: "Export Control System",
      abbr: "(ECS)",
      tooltip: "Export Control System (ECS)",
      items: [
        { href: "/ecs/overview", label: "Overview", icon: BarChart3 },
        { href: "/ecs/export-requests", label: "Export Authorization Requests", icon: Upload },
        { href: "/ecs/authorizations", label: "Export Authorizations", icon: BadgeCheck },
      ],
    });
  }

  if (cmcActive) {
    groups.push({
      title: "Compliance Monitoring Center",
      abbr: "(CMC)",
      tooltip: "Compliance Monitoring Center (CMC)",
      items: [
        { href: "/cmc/overview", label: "Overview", icon: BarChart3 },
        { href: "/cmc/ratings", label: "Regulatory Compliance Ratings", icon: BarChart3 },
        { href: "/cmc/disputes", label: "Compliance Disputes", icon: Scale },
        { href: "/cmc/reports", label: "Compliance Monitoring Reports", icon: BookOpen },
      ],
    });
  }

  groups.push(
    {
      title: "Enforcement",
      items: [
        { href: "/enforcement/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/enforcement/actions", label: "Actions", icon: Scale },
        { href: "/enforcement/pending-approvals", label: "Pending Regulatory Approvals", icon: BadgeCheck },
        { href: "/enforcement/reports", label: "Enforcement Activity Reports", icon: BookOpen },
      ],
    },
    {
      title: "Help & Info",
      items: [
        { href: "/support", label: "Support Center", icon: LifeBuoy },
        { href: "/faq", label: "FAQ", icon: HelpCircle },
        { href: "/docs", label: "Documentation", icon: BookOpen },
        { href: "/contact", label: "Contact Support", icon: Phone },
      ],
    },
  );

  const widthClass = sidebarCollapsed ? "w-16" : "w-[280px]";

  return (
    <aside
      className={clsx(
        "hidden border-r border-zinc-200 bg-white md:block",
        "transition-[width] duration-300 ease-in-out",
        widthClass,
      )}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <nav className="flex h-full flex-col overflow-y-auto">
        <div className="flex-1 px-1 py-2">
          {groups.map((g) => (
            <SidebarGroup key={g.title} group={g} collapsed={sidebarCollapsed} pathname={pathname} role={role} />
          ))}
        </div>

        <div className="border-t border-zinc-200 p-2">
          <button
            type="button"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse"}
            className={clsx(
              "flex h-12 w-full items-center rounded-md px-3 text-sm text-zinc-700 hover:bg-zinc-50",
              sidebarCollapsed ? "justify-center" : "justify-between",
            )}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {!sidebarCollapsed ? <span>◀ Collapse</span> : null}
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </nav>
    </aside>
  );
}

