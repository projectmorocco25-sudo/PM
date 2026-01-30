"use client";

/**
 * Wireframe: task-0.5.2.4-products-list.md
 * Route: /rmm/products
 * Implements: Products list — search bar, filters (Company, Status, Critical, ATC), table (Name, Company, ATC, Critical, SKU Count, Status, Actions), pagination.
 * Task: 1.1.2.20
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

export type ProductRow = {
  id: string;
  company_id: string;
  name: string;
  company_name: string;
  atc_code: string | null;
  is_critical_medicine: boolean;
  sku_count: number;
  is_active: boolean;
};

type ProductsListContentProps = {
  products: ProductRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  search: string;
  companyFilter: string;
  statusFilter: string;
  criticalFilter: string;
  atcFilter: string;
  companies: { id: string; name: string }[];
  atcCodes: { id: string; code: string }[];
  error: string | null;
};

export function ProductsListContent({
  products,
  total,
  currentPage,
  totalPages,
  search,
  companyFilter,
  statusFilter,
  criticalFilter,
  atcFilter,
  companies,
  atcCodes,
  error,
}: ProductsListContentProps) {
  const router = useRouter();

  function buildQueryString(updates: {
    search?: string;
    company?: string;
    status?: string;
    critical?: string;
    atc?: string;
    page?: string;
  }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined) {
      if (updates.search) next.set("search", updates.search);
    } else if (search) next.set("search", search);
    if (updates.company !== undefined && updates.company) next.set("company", updates.company);
    else if (companyFilter) next.set("company", companyFilter);
    if (updates.status !== undefined) next.set("status", updates.status);
    else if (statusFilter) next.set("status", statusFilter);
    if (updates.critical !== undefined) next.set("critical", updates.critical);
    else if (criticalFilter) next.set("critical", criticalFilter);
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
    router.push(`/rmm/products${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(
    type: "company" | "status" | "critical" | "atc",
    value: string
  ) {
    const qs = buildQueryString({ [type]: value, page: "1" });
    router.push(`/rmm/products${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/rmm/products");
  }

  const hasFilters = !!(
    search ||
    companyFilter ||
    (statusFilter !== "active" && statusFilter !== "all") ||
    (criticalFilter !== "all" && criticalFilter !== "") ||
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
          <span className="text-[#111827] font-medium">Products</span>
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
        <span className="text-[#111827] font-medium">Products</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">Products</h1>
        <Link
          href="/rmm/products/new"
          className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
        >
          New Product
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="products-search" className="sr-only">Search products</label>
        <input
          id="products-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search products..."
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
            {companies.length > 1 && (
              <div>
                <p className="text-xs font-medium text-[#6b7280]">Company</p>
                <select
                  value={companyFilter}
                  onChange={(e) => handleFilterChange("company", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">All</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
              <p className="text-xs font-medium text-[#6b7280]">Critical Medicine</p>
              <div className="mt-1 space-y-1">
                {(["all", "true", "false"] as const).map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="critical"
                      checked={criticalFilter === c}
                      onChange={() => handleFilterChange("critical", c)}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    {c === "all" ? "All" : c === "true" ? "Yes" : "No"}
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
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-[#111827]">
                {hasFilters ? "No products match your filters" : "No products found"}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {hasFilters ? "Try clearing filters." : "Create your first product to get started."}
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
                  href="/rmm/products/new"
                  className="mt-4 inline-block rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
                >
                  New Product
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Products">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">Product Name</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Company</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">ATC Code</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Critical</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">SKUs</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Status</th>
                      <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f9fafb]">
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 font-medium text-[#111827]">
                          <Link href={`/rmm/products/${p.id}`} className="text-[#2563eb] hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">
                          <Link href={`/rmm/companies/${p.company_id}`} className="text-[#2563eb] hover:underline">
                            {p.company_name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 font-mono text-[#111827]">{p.atc_code ?? "—"}</td>
                        <td className="whitespace-nowrap py-3 px-3">
                          {p.is_critical_medicine ? (
                            <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#fef2f2] text-[#dc2626]">Critical</span>
                          ) : (
                            <span className="text-[#6b7280]">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{p.sku_count}</td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"}`}>
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
                          <Link href={`/rmm/products/${p.id}`} className="text-[#2563eb] hover:underline mr-2">View</Link>
                          <Link href={`/rmm/products/${p.id}/edit`} className="text-[#2563eb] hover:underline">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-3">
                <p className="text-sm text-[#6b7280]">
                  Showing {start}-{end} of {total} products
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/rmm/products?${buildQueryString({ page: String(currentPage - 1) })}`}
                      className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/rmm/products?${buildQueryString({ page: String(currentPage + 1) })}`}
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
