/**
 * Sidebar navigation config. Wireframe: task-0.5.1.16.
 * Role visibility: Audit (MOH T1&T2), Enforcement (MOH T1&T2), Governance (MOH T1&T2).
 * ECS/CMC: conditional on module active (simplified: show to all for layout; page-level guards apply).
 */

export type NavSection = {
  label: string;
  labelAbbr?: string;
  items: NavItem[];
  roles?: "all" | "moh";
};

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  roles?: "all" | "moh";
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Global",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: "all" },
      { label: "Communications", href: "/communications/inbox", icon: "MessageSquare", roles: "all" },
      { label: "Regulatory Activity History", href: "/history", icon: "History", roles: "all" },
      { label: "Notifications", href: "/notifications", icon: "Bell", roles: "all" },
      { label: "Audit Logs", href: "/audit/logs", icon: "Search", roles: "moh" },
      { label: "Audit Reports", href: "/audit/reports", icon: "FileText", roles: "moh" },
    ],
  },
  {
    label: "Registry Management",
    labelAbbr: "(RMM)",
    items: [
      { label: "Overview", href: "/rmm/overview", icon: "BarChart2", roles: "all" },
      { label: "Companies", href: "/rmm/companies", icon: "Building2", roles: "all" },
      { label: "Products", href: "/rmm/products", icon: "Package", roles: "all" },
      { label: "SKUs", href: "/rmm/skus", icon: "Tag", roles: "all" },
      { label: "Submissions", href: "/rmm/submissions", icon: "ClipboardList", roles: "all" },
      { label: "ATC Codes", href: "/rmm/atc-codes", icon: "ListOrdered", roles: "moh" },
      { label: "Critical Medicines", href: "/rmm/critical-medicines", icon: "Pill", roles: "moh" },
    ],
  },
  {
    label: "Value Chain Intelligence",
    labelAbbr: "(VCI)",
    items: [
      { label: "Dashboard", href: "/vci/dashboard", icon: "BarChart2", roles: "all" },
      { label: "Submissions", href: "/vci/submissions", icon: "FileEdit", roles: "all" },
      { label: "Thresholds", href: "/vci/thresholds", icon: "Slider", roles: "all" },
      { label: "Compliance Violations", href: "/vci/breaches", icon: "AlertTriangle", roles: "all" },
      { label: "Governance", href: "/vci/governance", icon: "TrendingUp", roles: "moh" },
    ],
  },
  {
    label: "Export Control System",
    labelAbbr: "(ECS)",
    items: [
      { label: "Overview", href: "/ecs/overview", icon: "BarChart2", roles: "all" },
      { label: "Export Authorization Requests", href: "/ecs/export-requests", icon: "Send", roles: "all" },
      { label: "Export Authorizations", href: "/ecs/authorizations", icon: "CheckCircle", roles: "all" },
    ],
  },
  {
    label: "Compliance Monitoring Center",
    labelAbbr: "(CMC)",
    items: [
      { label: "Overview", href: "/cmc/overview", icon: "BarChart2", roles: "all" },
      { label: "Regulatory Compliance Ratings", href: "/cmc/scores", icon: "BarChart2", roles: "all" },
      { label: "Compliance Disputes", href: "/cmc/disputes", icon: "Scale", roles: "all" },
      { label: "Compliance Monitoring Reports", href: "/cmc/reports", icon: "FileText", roles: "all" },
    ],
  },
  {
    label: "Enforcement",
    items: [
      { label: "Dashboard", href: "/enforcement", icon: "BarChart2", roles: "moh" },
      { label: "Actions", href: "/enforcement/actions", icon: "Scale", roles: "moh" },
      { label: "Pending Regulatory Approvals", href: "/enforcement/pending-approvals", icon: "CheckCircle", roles: "moh" },
      { label: "Enforcement Activity Reports", href: "/enforcement/reports", icon: "FileText", roles: "moh" },
    ],
  },
  {
    label: "Help & Info",
    items: [
      { label: "Support Center", href: "/help/support", icon: "HelpCircle", roles: "all" },
      { label: "FAQ", href: "/help/faq", icon: "BookOpen", roles: "all" },
      { label: "Documentation", href: "/help/docs", icon: "Book", roles: "all" },
      { label: "Contact Support", href: "/help/contact", icon: "Phone", roles: "all" },
      { label: "System Status", href: "/help/status", icon: "Activity", roles: "all" },
    ],
  },
];

export const MOH_ROLES = ["tier1", "tier2_officer", "tier2_registrar", "system_admin"] as const;

export function isMoh(role: string): boolean {
  return MOH_ROLES.includes(role as (typeof MOH_ROLES)[number]);
}
