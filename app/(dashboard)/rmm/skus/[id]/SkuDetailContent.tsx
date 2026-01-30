"use client";

/**
 * Wireframe: task-0.5.2.7-sku-detail.md
 * Route: /rmm/skus/[id]
 * Implements: SKU detail — breadcrumbs, title, Edit; SKU Information card; Pharmaceutical Attributes card; tabs Overview | History.
 * Task: 1.1.2.24
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md
 */

import Link from "next/link";
import { useState } from "react";

export type SkuDetailSku = {
  id: string;
  product_id: string;
  company_id: string;
  product_name: string;
  company_name: string;
  sku_code: string;
  name: string;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  atc_code: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SkuDetailHistoryItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  link?: string;
};

type SkuDetailContentProps = {
  sku: SkuDetailSku;
  history: SkuDetailHistoryItem[];
  skuId: string;
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
  { id: "history", label: "History" },
] as const;

export function SkuDetailContent({
  sku,
  history,
  skuId,
}: SkuDetailContentProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/skus" className="text-[#2563eb] hover:underline">SKUs</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium truncate max-w-[12rem] sm:max-w-none" title={sku.name}>{sku.name}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">{sku.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/rmm/skus/${skuId}/edit`}
            className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">SKU Information</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#6b7280]">SKU Code</dt>
            <dd className="mt-0.5 font-mono text-[#111827]">{sku.sku_code}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Product</dt>
            <dd className="mt-0.5">
              <Link href={`/rmm/products/${sku.product_id}`} className="text-[#2563eb] hover:underline">
                {sku.product_name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Company</dt>
            <dd className="mt-0.5">
              <Link href={`/rmm/companies/${sku.company_id}`} className="text-[#2563eb] hover:underline">
                {sku.company_name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">ATC Code</dt>
            <dd className="mt-0.5 font-mono text-[#111827]">{sku.atc_code ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Status</dt>
            <dd className="mt-0.5">
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                  sku.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {sku.is_active ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-[#6b7280]">Full Name</dt>
            <dd className="mt-0.5 text-[#111827]">{sku.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Created</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(sku.created_at)}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Last Updated</dt>
            <dd className="mt-0.5 text-[#111827]">{formatDate(sku.updated_at)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-sm font-semibold text-[#111827]">Pharmaceutical Attributes</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#6b7280]">Dosage Strength</dt>
            <dd className="mt-0.5 font-medium text-[#111827]">{sku.dosage_strength ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Dosage Form</dt>
            <dd className="mt-0.5 font-medium text-[#111827]">{sku.dosage_form ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Pack Size</dt>
            <dd className="mt-0.5 font-medium text-[#111827]">{sku.pack_size ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">Unit of Measure</dt>
            <dd className="mt-0.5 font-medium text-[#111827]">{sku.unit_of_measure ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#6b7280]">MOH Authorized Unregistered</dt>
            <dd className="mt-0.5 font-medium text-[#111827]">
              {sku.is_moh_authorized_unregistered ? (
                <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#fef3c7] text-[#92400e]">
                  Yes
                </span>
              ) : (
                "No"
              )}
            </dd>
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
            <div>
              <h4 className="text-sm font-medium text-[#111827]">Related Submissions</h4>
              <p className="mt-1 text-sm text-[#6b7280]">
                AAMS, MSQ, and WSL submissions including this SKU are listed in Registry Submissions.
              </p>
              <Link
                href="/rmm/submissions"
                className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View Registry Submissions →
              </Link>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#111827]">Enforcement Actions</h4>
              <p className="mt-1 text-sm text-[#6b7280]">
                Enforcement actions related to this SKU are tracked in the enforcement module.
              </p>
              <Link
                href={`/enforcement/actions?sku=${skuId}`}
                className="mt-2 inline-block text-sm font-medium text-[#2563eb] hover:underline"
              >
                View Enforcement History →
              </Link>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#111827]">Regulatory Compliance</h4>
              <p className="mt-1 text-sm text-[#6b7280]">Regulatory framework: DMP Art.15 — Stock Monitoring.</p>
              <span className="mt-2 inline-block text-sm text-[#6b7280]">—</span>
            </div>
            {history.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#111827]">Recent Activity</h4>
                <ul className="mt-2 space-y-2">
                  {history.slice(0, 5).map((item) => (
                    <li key={item.id} className="text-sm text-[#6b7280]">
                      • {item.title} — {relativeTime(item.created_at)}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className="mt-2 inline-block text-left text-sm font-medium text-[#2563eb] hover:underline"
                >
                  View Full History
                </button>
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
              <ul className="space-y-4 border-l-2 border-[#e5e7eb] pl-4" aria-label="SKU history timeline">
                {history.map((item) => (
                  <li key={item.id} className="relative -left-[21px]">
                    <span className="absolute left-0 h-2.5 w-2.5 rounded-full bg-[#3b82f6]" aria-hidden />
                    <div className="pl-4">
                      <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-[#6b7280]">{item.description}</p>
                      )}
                      <p className="mt-0.5 text-xs text-[#9ca3af]">{relativeTime(item.created_at)}</p>
                      {item.link && (
                        <Link href={item.link} className="mt-1 inline-block text-xs font-medium text-[#2563eb] hover:underline">
                          View details
                        </Link>
                      )}
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
