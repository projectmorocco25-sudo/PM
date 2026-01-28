/**
 * Wireframe: task-0.5.1.18 (Company), task-0.5.1.19 (MOH Tier 1), task-0.5.1.20 (MOH Tier 2).
 * Route: /dashboard
 * Implements: Role-based dashboard. APIs: shared_get_user_permissions, shared_get_notifications,
 * rmm_get_company, rmm_list_companies, rmm_list_products, rmm_list_skus. Hosted Supabase only.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { isMoh } from "@/lib/nav-config";
import {
  ChevronDown,
  Building2,
  Package,
  Tag,
  Bell,
  FileEdit,
  BarChart2,
  HelpCircle,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useSession();
  const {
    permissions,
    notifications,
    company,
    companiesCount,
    productsCount,
    skusCount,
    status,
    error,
    refetch,
  } = useDashboardData(user);

  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const role =
    permissions && !("error" in permissions) ? (permissions as { role: string }).role : "company_user";
  const isMOH = isMoh(role);
  const isTier1 = role === "tier1" || role === "system_admin";

  const welcomeLabel = company
    ? `Welcome, ${company.name}`
    : isTier1
      ? "Governance Overview"
      : isMOH
        ? "Verification Overview"
        : "Welcome";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">
          Home
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Dashboard</span>
      </nav>

      {/* Header: welcome + quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">{welcomeLabel}</h1>
        <div className="relative">
          <button
            type="button"
            onClick={() => setQuickActionsOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            aria-expanded={quickActionsOpen}
            aria-haspopup="true"
          >
            Quick Actions
            <ChevronDown className="h-4 w-4" />
          </button>
          {quickActionsOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-10"
                onClick={() => setQuickActionsOpen(false)}
              />
              <div
                className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg"
                role="menu"
              >
                <Link
                  href="/rmm/companies/new"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setQuickActionsOpen(false)}
                >
                  <FileEdit className="h-4 w-4" /> New Submission
                </Link>
                <Link
                  href="/vci/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setQuickActionsOpen(false)}
                >
                  <BarChart2 className="h-4 w-4" /> View Reports
                </Link>
                <Link
                  href="/communications/inbox"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setQuickActionsOpen(false)}
                >
                  <Bell className="h-4 w-4" /> Messages
                </Link>
                <Link
                  href="/help/support"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setQuickActionsOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" /> Help & Support
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  role="menuitem"
                  onClick={() => setQuickActionsOpen(false)}
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs (Overview active) */}
      <div className="flex gap-6 border-b border-[#e5e7eb]">
        <div className="flex h-12 items-center border-b-2 border-[#3b82f6] font-semibold text-[#111827]">
          Overview
        </div>
      </div>

      {/* Content */}
      {status === "loading" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f3f4f6]"
              aria-hidden
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-6 text-center">
          <p className="text-[#dc2626]">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
          >
            Retry
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title={company ? "My Companies" : "Companies"}
            value={companiesCount}
            icon={<Building2 className="h-5 w-5" />}
            viewAllHref="/rmm/companies"
          />
          <Card
            title={company ? "My Products" : "Products"}
            value={productsCount}
            icon={<Package className="h-5 w-5" />}
            viewAllHref="/rmm/products"
          />
          <Card
            title={company ? "My SKUs" : "SKUs"}
            value={skusCount}
            icon={<Tag className="h-5 w-5" />}
            viewAllHref="/rmm/skus"
          />
          <Card
            title="Recent Activity"
            value={notifications.length}
            icon={<Bell className="h-5 w-5" />}
            viewAllHref="/notifications"
            extra={
              notifications.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm text-[#6b7280]">
                  {notifications.slice(0, 3).map((n) => (
                    <li key={n.id} className="truncate">
                      {n.title}
                    </li>
                  ))}
                </ul>
              ) : null
            }
          />
        </div>
      )}

      {status === "empty" && (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="text-[#6b7280]">No dashboard data. Sign in to load.</p>
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  viewAllHref,
  extra,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  viewAllHref: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#6b7280]">{title}</span>
        <span className="text-[#6b7280]" aria-hidden>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-[#111827]">{value}</p>
      {extra}
      <Link
        href={viewAllHref}
        className="mt-4 inline-block text-sm font-medium text-[#2563eb] hover:underline"
      >
        View All →
      </Link>
    </div>
  );
}
