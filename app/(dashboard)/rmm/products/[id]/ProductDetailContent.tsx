"use client";

/**
 * Wireframe: task-0.5.2.5-product-detail.md
 * Route: /rmm/products/[id]
 * Implements: Product detail — Product Information card, tabs Overview | SKUs | History.
 * Task: 1.1.2.21
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md
 */

import Link from "next/link";
import { useState } from "react";

export type ProductDetailProduct = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_critical_medicine: boolean;
  is_active: boolean;
  company_name: string;
  atc_code: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductDetailStats = {
  skus_total: number;
  skus_active: number;
};

export type ProductDetailSku = {
  id: string;
  sku_code: string;
  name: string;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  is_active: boolean;
};

export type ProductDetailHistoryItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  link?: string;
};

type ProductDetailContentProps = {
  product: ProductDetailProduct;
  stats: ProductDetailStats;
  skus: ProductDetailSku[];
  skusTotal: number;
  history: ProductDetailHistoryItem[];
  productId: string;
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

function dosageLabel(s: ProductDetailSku): string {
  const parts = [s.dosage_strength, s.dosage_form].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "skus", label: "SKUs" },
  { id: "history", label: "History" },
] as const;

export function ProductDetailContent({
  product,
  stats,
  skus,
  skusTotal,
  history,
  productId,
}: ProductDetailContentProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "skus" | "history">("overview");

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/products" className="text-[#2563eb] hover:underline">Products</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">{product.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/rmm/products/${productId}/edit`}
            className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Product Information</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#6b7280]">Company</dt>
            <dd className="mt-0.5">
              <Link href={`/rmm/companies/${product.company_id}`} className="text-[#2563eb] hover:underline">
                {product.company_name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">ATC Code</dt>
            <dd className="mt-0.5 font-mono text-[#111827]">{product.atc_code ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Critical Medicine</dt>
            <dd className="mt-0.5">
              {product.is_critical_medicine ? (
                <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                  Critical Medicine
                </span>
              ) : (
                <span className="text-[#111827]">No</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Status</dt>
            <dd className="mt-0.5">
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                  product.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-[#6b7280]">Description</dt>
            <dd className="mt-0.5 text-[#111827]">{product.description ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Created</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(product.created_at)}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Last Updated</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(product.updated_at)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-[#6b7280]">Regulatory Compliance Status</dt>
            <dd className="mt-0.5 text-[#111827]">—</dd>
          </div>
        </dl>
      </div>

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
            <div className="grid gap-4 sm:grid-cols-2">
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
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline text-left"
              >
                View Full History
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#111827]">Enforcement History</h4>
              <p className="mt-1 text-sm text-[#6b7280]">
                Enforcement actions for this product&apos;s SKUs are tracked in the enforcement module.
              </p>
              <Link
                href={`/enforcement/actions?product=${productId}`}
                className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View Enforcement History →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "skus" && (
          <div className="mt-4 space-y-4 rounded-lg border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827]">SKUs</h3>
              <div className="flex gap-2">
                <Link
                  href={`/rmm/products/${productId}/skus/new`}
                  className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-3 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
                >
                  New SKU
                </Link>
                <Link
                  href={`/rmm/products/${productId}/skus`}
                  className="text-sm font-medium text-[#2563eb] hover:underline"
                >
                  View All SKUs
                </Link>
              </div>
            </div>
            {skus.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No SKUs.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Product SKUs">
                  <thead>
                    <tr>
                      <th className="py-2 text-left font-medium text-[#6b7280]">SKU Code</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">SKU Name</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">Dosage</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">Pack Size</th>
                      <th className="py-2 text-left font-medium text-[#6b7280]">Status</th>
                      <th className="py-2 text-right font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {skus.map((s) => (
                      <tr key={s.id} className="hover:bg-[#f9fafb]">
                        <td className="py-2 font-mono text-[#111827]">{s.sku_code}</td>
                        <td className="py-2 font-medium text-[#111827]">
                          <Link href={`/rmm/skus/${s.id}`} className="text-[#2563eb] hover:underline">
                            {s.name}
                          </Link>
                        </td>
                        <td className="py-2 text-[#111827]">{dosageLabel(s)}</td>
                        <td className="py-2 text-[#111827]">
                          {[s.pack_size, s.unit_of_measure].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              s.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                            }`}
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <Link href={`/rmm/skus/${s.id}`} className="text-[#2563eb] hover:underline mr-2">
                            View
                          </Link>
                          <Link href={`/rmm/skus/${s.id}/edit`} className="text-[#2563eb] hover:underline">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {skusTotal > skus.length && (
              <Link
                href={`/rmm/products/${productId}/skus`}
                className="inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View All SKUs ({skusTotal})
              </Link>
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
              <ul id="history" className="space-y-4 border-l-2 border-[#e5e7eb] pl-4">
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
