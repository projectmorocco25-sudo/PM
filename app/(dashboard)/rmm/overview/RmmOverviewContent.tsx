"use client";

/**
 * Wireframe: task-0.5.2.1-rmm-overview.md (task-0.5.2.16)
 * Route: /rmm/overview
 * Implements: RMM overview — Module Summary, Statistics cards, Quick Links, Registry Submissions Status, Recent Activity.
 * Task: 1.1.2.16.1
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md
 */

import Link from "next/link";
import { RmmPageBreadcrumbs } from "../RmmPageBreadcrumbs";

export type RmmOverviewStats = {
  companies_total: number;
  companies_active: number;
  companies_inactive: number;
  products_total: number;
  products_active: number;
  products_inactive: number;
  skus_total: number;
  skus_active: number;
  skus_inactive: number;
  submissions_pending: number;
  submissions_approved: number;
  submissions_rejected: number;
};

type RmmOverviewContentProps = {
  stats: RmmOverviewStats;
};

const QUICK_LINKS = [
  { label: "Companies", href: "/rmm/companies" },
  { label: "Products", href: "/rmm/products" },
  { label: "SKUs", href: "/rmm/skus" },
  { label: "Submissions", href: "/rmm/submissions" },
  { label: "ATC Codes", href: "/rmm/atc-codes" },
  { label: "Critical Medicines", href: "/rmm/critical-medicines" },
  { label: "Enforcement", href: "/enforcement" },
];

function StatCard({
  title,
  total,
  active,
  inactive,
  viewAllHref,
}: {
  title: string;
  total: number;
  active: number;
  inactive: number;
  viewAllHref: string;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-[#6b7280]">
        <p>Total: {total}</p>
        <p>Active: {active}</p>
        <p>Inactive: {inactive}</p>
      </div>
      <Link
        href={viewAllHref}
        className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
      >
        View All
      </Link>
    </div>
  );
}

export function RmmOverviewContent({ stats }: RmmOverviewContentProps) {
  return (
    <div className="space-y-6">
      <RmmPageBreadcrumbs tail={["Overview"]} />
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
          Registry Management Module (RMM)
        </h1>
        <span className="mt-2 inline-block rounded-md bg-[#3b82f6] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          Core Module
        </span>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
        <h2 className="text-sm font-semibold text-[#111827]">Module Summary</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          RMM manages company registrations, products, SKUs, and registry submissions. This module is the foundation for all other modules.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#111827]">Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Companies"
            total={stats.companies_total}
            active={stats.companies_active}
            inactive={stats.companies_inactive}
            viewAllHref="/rmm/companies"
          />
          <StatCard
            title="Products"
            total={stats.products_total}
            active={stats.products_active}
            inactive={stats.products_inactive}
            viewAllHref="/rmm/products"
          />
          <StatCard
            title="SKUs"
            total={stats.skus_total}
            active={stats.skus_active}
            inactive={stats.skus_inactive}
            viewAllHref="/rmm/skus"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Quick Links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Registry Submissions Status</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="text-[#6b7280]">Pending: <strong className="text-[#111827]">{stats.submissions_pending}</strong></span>
          <span className="text-[#6b7280]">Approved: <strong className="text-[#111827]">{stats.submissions_approved}</strong></span>
          <span className="text-[#6b7280]">Rejected: <strong className="text-[#111827]">{stats.submissions_rejected}</strong></span>
        </div>
        <Link
          href="/rmm/submissions"
          className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
        >
          View All Submissions
        </Link>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Recent Activity</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          View regulatory activity and submission history.
        </p>
        <Link
          href="/history"
          className="mt-3 inline-block text-sm font-medium text-[#2563eb] hover:underline"
        >
          View Full History
        </Link>
      </div>
    </div>
  );
}
