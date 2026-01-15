"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  BadgeCheck,
  FileSearch,
  HelpCircle,
  History,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Package,
  Phone,
  Scale,
  Settings,
  Shield,
  Target,
  Upload,
  X,
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
  roles?: string[];
};

type NavGroup = {
  title: string;
  abbr?: string;
  items: NavItem[];
};

export function MobileSidebar() {
  const { mobileNavOpen, setMobileNavOpen, user } = useApp();
  const pathname = usePathname();
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
      items: [
        { href: "/rmm/overview", label: "Overview", icon: BarChart3 },
        { href: "/rmm/companies", label: "Companies", icon: Building2 },
        { href: "/rmm/products", label: "Products", icon: Package },
        { href: "/rmm/skus", label: "SKUs", icon: Boxes },
      ],
    },
    {
      title: "Value Chain Intelligence",
      abbr: "(VCI)",
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
      items: [
        { href: "/cmc/overview", label: "Overview", icon: BarChart3 },
        { href: "/cmc/ratings", label: "Regulatory Compliance Ratings", icon: BarChart3 },
        { href: "/cmc/disputes", label: "Compliance Disputes", icon: Scale },
        { href: "/cmc/reports", label: "Compliance Monitoring Reports", icon: BookOpen },
      ],
    });
  }

  groups.push({
    title: "Help & Info",
    items: [
      { href: "/support", label: "Support Center", icon: LifeBuoy },
      { href: "/faq", label: "FAQ", icon: HelpCircle },
      { href: "/docs", label: "Documentation", icon: BookOpen },
      { href: "/contact", label: "Contact Support", icon: Phone },
    ],
  });

  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 md:hidden",
        mobileNavOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/30 transition-opacity",
          mobileNavOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
      />

      <div
        className={clsx(
          "absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4">
          <div className="text-sm font-semibold text-zinc-900">Navigation</div>
          <button
            type="button"
            aria-label="Close navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100"
            onClick={() => setMobileNavOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-64px)] overflow-y-auto p-2">
          {groups.map((g) => (
            <div key={g.title} className="mt-3">
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-zinc-900">{g.title}</div>
                {g.abbr ? <div className="text-xs text-zinc-500">{g.abbr}</div> : null}
              </div>
              <div className="space-y-1">
                {g.items
                  .filter((it) => !it.roles || (role ? it.roles.includes(role) : false))
                  .map((it) => {
                    const Icon = it.icon;
                    const active = pathname === it.href || pathname.startsWith(it.href);
                    const badge = it.badge ?? 0;
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={clsx(
                          "relative flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                          active ? "bg-blue-50 font-semibold text-zinc-900" : "text-zinc-700 hover:bg-zinc-50",
                        )}
                      >
                        <Icon className={clsx("h-5 w-5", active ? "text-blue-600" : "text-zinc-500")} />
                        <span className="truncate">{it.label}</span>
                        {badge > 0 ? (
                          <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

