"use client";

/**
 * Wireframe: task-0.5.2.15-critical-medicines-list.md
 * Route: /rmm/critical-medicines
 * Implements: Critical Medicines list (MOH Tier 1) — search, filters (Status, Company, ATC, Date), table (SKU, Product, Company, Actions), Designate, Remove/Edit, info banner.
 * Task: 1.1.2.30
 * API: rmm_list_critical_medicines (9-arg), rmm_update_critical_medicine (hosted Supabase only). RLS applies. MOH Tier 1 can manage.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ATC_CATEGORY_OPTIONS = ["A", "B", "C", "D", "E", "G", "H", "J", "L", "M", "N", "P", "R", "S", "V"];

export type CriticalMedicineRow = {
  id: string;
  sku_id: string;
  sku_code: string;
  sku_name: string;
  dosage_strength: string;
  dosage_form: string;
  product_id: string;
  product_name: string;
  company_id: string;
  company_name: string;
  designated_at: string;
  is_active: boolean;
};

type CriticalMedicinesListContentProps = {
  rows: CriticalMedicineRow[];
  total: number;
  search: string;
  statusFilter: string;
  companyFilter: string;
  atcFilter: string;
  dateFilter: string;
  offset: number;
  pageSize: number;
  companies: { id: string; name: string }[];
  canManage: boolean;
  error: string | null;
};

export function CriticalMedicinesListContent({
  rows,
  total,
  search,
  statusFilter,
  companyFilter,
  atcFilter,
  dateFilter,
  offset,
  pageSize,
  companies,
  canManage,
  error,
}: CriticalMedicinesListContentProps) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

  function buildQueryString(updates: {
    search?: string;
    status?: string;
    company?: string;
    atc?: string;
    date?: string;
    offset?: string;
  }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined && updates.search) next.set("search", updates.search);
    else if (search) next.set("search", search);
    if (updates.status !== undefined && updates.status) next.set("status", updates.status);
    else if (statusFilter) next.set("status", statusFilter);
    if (updates.company !== undefined && updates.company) next.set("company", updates.company);
    else if (companyFilter) next.set("company", companyFilter);
    if (updates.atc !== undefined && updates.atc) next.set("atc", updates.atc);
    else if (atcFilter) next.set("atc", atcFilter);
    if (updates.date !== undefined && updates.date) next.set("date", updates.date);
    else if (dateFilter) next.set("date", dateFilter);
    if (updates.offset !== undefined && updates.offset !== "0") next.set("offset", updates.offset);
    else if (offset > 0) next.set("offset", String(offset));
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, offset: "0" });
    router.push(`/rmm/critical-medicines${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(
    type: "status" | "company" | "atc" | "date",
    value: string
  ) {
    const qs = buildQueryString({ [type]: value || undefined, offset: "0" });
    router.push(`/rmm/critical-medicines${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/rmm/critical-medicines");
  }

  function loadMore() {
    const nextOffset = offset + pageSize;
    const qs = buildQueryString({ offset: String(nextOffset) });
    router.push(`/rmm/critical-medicines?${qs}`);
  }

  async function handleRemoveClick(id: string) {
    setRemoveConfirmId(id);
  }

  async function confirmRemove() {
    if (!removeConfirmId) return;
    setRemovingId(removeConfirmId);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("rmm_update_critical_medicine", {
        p_id: removeConfirmId,
        p_is_active: false,
      });
      const payload = data as { error?: string; message?: string } | null;
      if (error || (payload && "error" in payload)) {
        alert(payload?.message ?? error?.message ?? "Failed to remove designation");
      } else {
        setRemoveConfirmId(null);
        router.refresh();
      }
    } catch (e) {
      alert("Failed to remove designation");
    } finally {
      setRemovingId(null);
    }
  }

  const hasFilters = !!(search || statusFilter || companyFilter || atcFilter || dateFilter);
  const hasMore = offset + rows.length < total;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">{error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 rounded-md border border-[#dc2626] bg-white px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#111827] md:text-[24px]">
            Critical Medicines (MOH Tier 1 Only)
          </h1>
          <span
            className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#fef2f2] text-[#dc2626]"
            aria-label="MOH Tier 1 only"
          >
            MOH Tier 1 Only
          </span>
        </div>
        {canManage && (
          <Link
            href="/rmm/critical-medicines/designate"
            className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
          >
            Designate
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="cm-search" className="sr-only">
          Search critical medicines
        </label>
        <input
          id="cm-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search critical medicines..."
          className="block w-full max-w-md rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          aria-label="Search by SKU, product name, or company"
        />
        <button
          type="submit"
          className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          aria-label="Search"
        >
          <span className="sr-only">Search</span>
          <span aria-hidden>🔍</span>
        </button>
      </form>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside
          className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-[240px]"
          aria-label="Filters"
        >
          <h2 className="text-sm font-semibold text-[#111827]">Filters</h2>
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Status</p>
              <div className="mt-1 space-y-1">
                {(["all", "active", "inactive"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === s}
                      onChange={() => handleFilterChange("status", s)}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    {s === "all" ? "All" : s === "active" ? "Active" : "Inactive"}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Company</p>
              <select
                value={companyFilter}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              >
                <option value="">All</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6b7280]">ATC</p>
              <div className="mt-1 max-h-32 overflow-y-auto space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="atc"
                    checked={!atcFilter}
                    onChange={() => handleFilterChange("atc", "")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                {ATC_CATEGORY_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="atc"
                      checked={atcFilter === c}
                      onChange={() => handleFilterChange("atc", c)}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Date</p>
              <div className="mt-1 space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="date"
                    checked={!dateFilter}
                    onChange={() => handleFilterChange("date", "")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="date"
                    checked={dateFilter === "7d"}
                    onChange={() => handleFilterChange("date", "7d")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Last 7 days
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="date"
                    checked={dateFilter === "30d"}
                    onChange={() => handleFilterChange("date", "30d")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Last 30 days
                </label>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            Clear
          </button>
        </aside>

        <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white">
          {rows.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-[#111827]">No critical medicines designated</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {hasFilters
                  ? "Try adjusting your search or filters."
                  : "Designate medicines as critical to apply higher threshold multipliers."}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-md border border-[#3b82f6] bg-white px-4 py-2 text-sm font-medium text-[#3b82f6] hover:bg-[#eff6ff]"
                >
                  Clear Filters
                </button>
              ) : (
                canManage && (
                  <Link
                    href="/rmm/critical-medicines/designate"
                    className="mt-4 inline-block rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
                  >
                    Designate Critical Medicine
                  </Link>
                )
              )}
            </div>
          ) : (
            <>
              <p className="border-b border-[#e5e7eb] px-4 py-2 text-sm text-[#6b7280]" aria-live="polite">
                {total} critical medicine{total !== 1 ? "s" : ""} found
              </p>
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-[#e5e7eb] text-sm"
                  role="grid"
                  aria-label="Critical Medicines"
                >
                  <thead>
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">
                        SKU
                      </th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                        Product
                      </th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                        Company
                      </th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                        Status
                      </th>
                      {canManage && (
                        <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#f9fafb]">
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 font-medium text-[#111827]">
                          <Link
                            href={`/rmm/skus/${row.sku_id}`}
                            className="font-mono text-[#2563eb] hover:underline"
                          >
                            {row.sku_code}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-[#111827]">
                          <Link
                            href={`/rmm/products/${row.product_id}`}
                            className="text-[#2563eb] hover:underline"
                          >
                            {row.product_name}
                          </Link>
                          <span className="text-[#6b7280]"> / {row.sku_name}</span>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">
                          <Link
                            href={`/rmm/companies/${row.company_id}`}
                            className="text-[#2563eb] hover:underline"
                          >
                            {row.company_name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              row.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                            }`}
                          >
                            {row.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {canManage && (
                          <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
                            <Link
                              href={`/rmm/skus/${row.sku_id}`}
                              className="text-[#2563eb] hover:underline mr-2"
                            >
                              View
                            </Link>
                            <Link
                              href={`/rmm/skus/${row.sku_id}/edit`}
                              className="text-[#2563eb] hover:underline mr-2"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveClick(row.id)}
                              disabled={removingId === row.id}
                              className="text-[#dc2626] hover:underline disabled:opacity-50"
                            >
                              {removingId === row.id ? "Removing…" : "Remove"}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="border-t border-[#e5e7eb] px-4 py-3">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <InfoBanner />

      {removeConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-title"
        >
          <div className="w-full max-w-md rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-xl">
            <h2 id="remove-title" className="text-lg font-semibold text-[#111827]">
              Remove critical medicine designation
            </h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              This will deactivate the critical medicine designation. The SKU will no longer receive the higher threshold multiplier. This action is logged for audit.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoveConfirmId(null)}
                className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                disabled={!!removingId}
                className="rounded-md border border-[#dc2626] bg-[#dc2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {removingId ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBanner() {
  return (
    <div
      className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4"
      role="region"
      aria-label="Information about critical medicines"
    >
      <p className="text-sm font-medium text-[#1e40af]">
        ℹ️ Critical medicines are designated by MOH Tier 1.
      </p>
      <p className="mt-1 text-sm text-[#1e3a8a]">
        These medicines receive higher threshold multipliers.
      </p>
      <p className="mt-2 text-xs text-[#1e3a8a]">
        Regulatory context: Critical medicine designations are regulatory decisions per DMP regulations. Designations affect threshold multipliers and compliance monitoring per DMP Art.15. All designation changes are logged for regulatory audit (7-year retention per Law No. 09-08).
      </p>
    </div>
  );
}
