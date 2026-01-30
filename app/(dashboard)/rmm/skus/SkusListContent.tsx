"use client";

/**
 * Wireframe: task-0.5.2.6-skus-list.md
 * Route: /rmm/skus
 * Implements: SKUs list — search bar, filters (Product, Status, Dosage Form, ATC), table (SKU Code, Name, Product, Dosage, Form, Pack Size, UoM, ATC, Status, Actions), pagination.
 * Task: 1.1.2.23
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

export type SkuRow = {
  id: string;
  product_id: string;
  company_id: string;
  product_name: string;
  sku_code: string;
  name: string;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  atc_code: string | null;
  is_active: boolean;
};

type SkusListContentProps = {
  skus: SkuRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  search: string;
  productFilter: string;
  statusFilter: string;
  formFilter: string;
  atcFilter: string;
  products: { id: string; name: string }[];
  atcCodes: { id: string; code: string }[];
  dosageForms: readonly string[];
  error: string | null;
};

export function SkusListContent({
  skus,
  total,
  currentPage,
  totalPages,
  search,
  productFilter,
  statusFilter,
  formFilter,
  atcFilter,
  products,
  atcCodes,
  dosageForms,
  error,
}: SkusListContentProps) {
  const router = useRouter();

  function buildQueryString(updates: {
    search?: string;
    product?: string;
    status?: string;
    form?: string;
    atc?: string;
    page?: string;
  }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined) {
      if (updates.search) next.set("search", updates.search);
    } else if (search) next.set("search", search);
    if (updates.product !== undefined && updates.product) next.set("product", updates.product);
    else if (productFilter) next.set("product", productFilter);
    if (updates.status !== undefined) next.set("status", updates.status);
    else if (statusFilter) next.set("status", statusFilter);
    if (updates.form !== undefined) next.set("form", updates.form);
    else if (formFilter && formFilter !== "all") next.set("form", formFilter);
    if (updates.atc !== undefined && updates.atc) next.set("atc", updates.atc);
    else if (atcFilter) next.set("atc", atcFilter);
    if (updates.page !== undefined && updates.page !== "1") next.set("page", updates.page);
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, page: "1" });
    router.push(`/rmm/skus${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(
    type: "product" | "status" | "form" | "atc",
    value: string
  ) {
    const qs = buildQueryString({ [type]: value, page: "1" });
    router.push(`/rmm/skus${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/rmm/skus");
  }

  const hasFilters = !!(
    search ||
    productFilter ||
    (statusFilter !== "active" && statusFilter !== "all") ||
    (formFilter && formFilter !== "all") ||
    atcFilter
  );
  const start = total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const end = Math.min(currentPage * 20, total);

  if (error) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <span className="text-[#111827] font-medium">SKUs</span>
        </nav>
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
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">SKUs</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">SKUs</h1>
        <Link
          href="/rmm/skus/new"
          className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
        >
          New SKU
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="skus-search" className="sr-only">Search SKUs</label>
        <input
          id="skus-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search SKUs..."
          className="block w-full max-w-md rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />
        <button
          type="submit"
          className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60" aria-label="Filters">
          <h2 className="text-sm font-semibold text-[#111827]">Filters</h2>
          <div className="mt-3 space-y-4">
            {products.length > 1 && (
              <div>
                <p className="text-xs font-medium text-[#6b7280]">Product</p>
                <select
                  value={productFilter}
                  onChange={(e) => handleFilterChange("product", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">All</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
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
              <p className="text-xs font-medium text-[#6b7280]">Dosage Form</p>
              <div className="mt-1 space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="form"
                    checked={formFilter === "all"}
                    onChange={() => handleFilterChange("form", "all")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                {dosageForms.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="form"
                      checked={formFilter === f}
                      onChange={() => handleFilterChange("form", f)}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            {atcCodes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[#6b7280]">ATC Code</p>
                <select
                  value={atcFilter}
                  onChange={(e) => handleFilterChange("atc", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">All</option>
                  {atcCodes.map((a) => (
                    <option key={a.id} value={a.code}>{a.code}</option>
                  ))}
                </select>
              </div>
            )}
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
          {skus.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-[#111827]">
                {hasFilters ? "No SKUs match your filters" : "No SKUs found"}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {hasFilters ? "Try clearing filters." : "Create your first SKU to get started."}
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
                <Link
                  href="/rmm/skus/new"
                  className="mt-4 inline-block rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
                >
                  New SKU
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="SKUs">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">SKU Code</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">SKU Name</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Product</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Dosage</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Form</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Pack Size</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">UoM</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">ATC Code</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Status</th>
                      <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {skus.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-[#f9fafb] cursor-pointer"
                        onClick={() => router.push(`/rmm/skus/${s.id}`)}
                      >
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 font-mono text-[#111827]">{s.sku_code}</td>
                        <td className="py-3 px-3 font-medium text-[#111827]">
                          <Link
                            href={`/rmm/skus/${s.id}`}
                            className="text-[#2563eb] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {s.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">
                          <Link
                            href={`/rmm/products/${s.product_id}`}
                            className="text-[#2563eb] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {s.product_name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{s.dosage_strength ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{s.dosage_form ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{s.pack_size ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{s.unit_of_measure ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3 font-mono text-[#111827]">{s.atc_code ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${s.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"}`}
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <Link href={`/rmm/skus/${s.id}`} className="text-[#2563eb] hover:underline mr-2">View</Link>
                          <Link href={`/rmm/skus/${s.id}/edit`} className="text-[#2563eb] hover:underline">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-3">
                <p className="text-sm text-[#6b7280]">
                  Showing {start}-{end} of {total} SKUs
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/rmm/skus?${buildQueryString({ page: String(currentPage - 1) })}`}
                      className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/rmm/skus?${buildQueryString({ page: String(currentPage + 1) })}`}
                      className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
