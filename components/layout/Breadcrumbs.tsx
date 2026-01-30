"use client";

/**
 * Wireframe: task-0.5.1.14 (layout-level breadcrumbs). §3.1 outstanding-scope-and-sequencing.
 * Renders path-derived breadcrumbs for all dashboard pages.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  rmm: "RMM",
  vci: "VCI",
  ecs: "ECS",
  cmc: "CMC",
  enforcement: "Enforcement",
  companies: "Companies",
  company: "Company",
  products: "Products",
  product: "Product",
  skus: "SKU",
  sku: "SKU",
  overview: "Overview",
  actions: "Actions",
  action: "Action",
  "pending-approvals": "Pending Approvals",
  reports: "Reports",
  report: "Report",
  audit: "Audit",
  logs: "Logs",
  communications: "Communications",
  inbox: "Inbox",
  sent: "Sent",
  compose: "Compose",
  announcements: "Announcements",
  archived: "Archived",
  history: "History",
  notifications: "Notifications",
  notificationsContent: "Notifications",
  profile: "Profile",
  ProfileContent: "Profile",
  settings: "Settings",
  "system-config": "System Config",
  help: "Help",
  support: "Support",
  contact: "Contact",
  docs: "Documentation",
  faq: "FAQ",
  status: "Status",
  new: "New",
  edit: "Edit",
  appeal: "Appeal",
  review: "Review",
  submissions: "Submissions",
  submission: "Submission",
  breaches: "Breaches",
  breach: "Breach",
  thresholds: "Thresholds",
  governance: "Governance",
  disputes: "Disputes",
  dispute: "Dispute",
  scores: "Scores",
  "atc-codes": "ATC Codes",
  "critical-medicines": "Critical Medicines",
  "export-requests": "Export Requests",
  authorizations: "Authorizations",
  authorization: "Authorization",
};

function labelForSegment(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
      <Link href="/dashboard" className="text-[#2563eb] hover:underline">
        Home
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = labelForSegment(segment);
        return (
          <span key={href} className="flex items-center gap-2">
            <span className="mx-2 text-[#9ca3af]">/</span>
            {isLast ? (
              <span className="text-[#111827]">{label}</span>
            ) : (
              <Link href={href} className="text-[#2563eb] hover:underline">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
