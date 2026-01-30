"use client";

/**
 * Wireframe: task-0.5.2.3-company-detail.md
 * Route: /rmm/companies/[id]
 * Implements: Company detail — Company Information card, tabs Overview | Products | History.
 * Task: 1.1.2.18
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type CompanyDetailCompany = {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  contact_email?: string | null;
  is_active: boolean;
  address?: string | null;
  contact_phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CompanyDetailStats = {
  products_total: number;
  products_active: number;
  products_inactive: number;
  skus_total: number;
  skus_active: number;
  skus_inactive: number;
};

export type CompanyDetailHistoryItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  link?: string;
};

export type CompanyDetailProduct = {
  id: string;
  name: string;
  is_active: boolean;
  company_id: string;
  atc_code?: string | null;
  sku_count?: number;
};

type CompanyDetailContentProps = {
  company: CompanyDetailCompany;
  stats: CompanyDetailStats;
  history: CompanyDetailHistoryItem[];
  products: CompanyDetailProduct[];
  companyId: string;
};

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return "—";
  }
}

function relativeTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(iso);
  } catch {
    return "—";
  }
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "history", label: "History" },
] as const;

export function CompanyDetailContent({
  company,
  stats,
  history,
  products,
  companyId,
}: CompanyDetailContentProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "history">("overview");

  const companyTypeLabel = company.company_type === "ipc" ? "IPC (Industrial Pharmaceutical Company)" : "Wholesaler";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs: Home > RMM > Companies > [Company Name] */}
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/companies" className="text-[#2563eb] hover:underline">Companies</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">{company.name}</span>
      </nav>

      {/* Page header: title + Edit */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">
          {company.name}
        </h1>
        <Link
          href={`/rmm/companies/${companyId}/edit`}
          className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
        >
          Edit
        </Link>
      </div>

      {/* Company Information Card */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Company Information</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#6b7280]">Type</dt>
            <dd className="mt-0.5 text-[#111827]">{companyTypeLabel}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Status</dt>
            <dd className="mt-0.5">
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                  company.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {company.is_active ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Registration Number</dt>
            <dd className="mt-0.5 text-[#111827]">{company.registration_number}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Address</dt>
            <dd className="mt-0.5 text-[#111827]">{company.address ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Contact (Email)</dt>
            <dd className="mt-0.5 text-[#111827]">{company.contact_email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Contact (Phone)</dt>
            <dd className="mt-0.5 text-[#111827]">{company.contact_phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Created</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(company.created_at)}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Last Updated</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(company.updated_at)}</dd>
          </div>
        </dl>
      </div>

      {/* Tabs: Overview | Products | History */}
      <div>
        <div className="flex gap-1 border-b border-[#e5e7eb]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[#3b82f6] text-[#111827]"
                  : "border-transparent text-[#6b7280] hover:border-[#d1d5db] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-4 space-y-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#111827]">Overview</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#6b7280]">Total Products</p>
                <p className="text-xl font-semibold text-[#111827]">{stats.products_total}</p>
              </div>
              <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#6b7280]">Active Products</p>
                <p className="text-xl font-semibold text-[#111827]">{stats.products_active}</p>
              </div>
              <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#6b7280]">Total SKUs</p>
                <p className="text-xl font-semibold text-[#111827]">{stats.skus_total}</p>
              </div>
              <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#6b7280]">Active SKUs</p>
                <p className="text-xl font-semibold text-[#111827]">{stats.skus_active}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#111827]">Recent Activity</h4>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-[#6b7280]">No recent activity.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {history.slice(0, 5).map((item) => (
                    <li key={item.id} className="text-sm text-[#6b7280]">
                      • {item.title} — {relativeTime(item.created_at)}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`#history`}
                onClick={() => setActiveTab("history")}
                className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View Full History
              </Link>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="mt-4 space-y-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827]">Products</h3>
              <Link
                href={`/rmm/companies/${companyId}/products`}
                className="text-sm font-medium text-[#2563eb] hover:underline"
              >
                View All Products
              </Link>
            </div>
            {products.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No products.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Company products">
                  <thead>
                    <tr>
                      <th className="py-2 text-left font-medium text-[#6b7280]">Product Name</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">ATC Code</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">SKUs</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">Status</th>
                      <th className="py-2 text-right font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f9fafb]">
                        <td className="py-2 font-medium text-[#111827]">
                          <Link href={`/rmm/products/${p.id}`} className="text-[#2563eb] hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="py-2 text-[#111827]">{p.atc_code ?? "—"}</td>
                        <td className="py-2 text-[#111827]">{p.sku_count ?? 0}</td>
                        <td className="py-2">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              p.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                            }`}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <Link href={`/rmm/products/${p.id}`} className="text-[#2563eb] hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="mt-4 space-y-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#111827]">History</h3>
            <p className="text-sm text-[#6b7280]">Timeline of all changes and updates.</p>
            {history.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No history entries.</p>
            ) : (
              <ul className="space-y-4 border-l-2 border-[#e5e7eb] pl-4">
                {history.map((item) => (
                  <li key={item.id} className="relative -left-[21px]">
                    <span className="absolute left-0 h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                    <div className="pl-4">
                      <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-[#6b7280]">{item.description}</p>
                      )}
                      <p className="mt-0.5 text-xs text-[#9ca3af]">{relativeTime(item.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
