"use client";

/**
 * Wireframe: task-0.5.2.3-company-detail.md (Products tab section)
 * Route: /rmm/companies/[id]/products
 * Implements: Products tab view — [New Product], table (Product Name, ATC Code, SKUs, Status, Actions [View]), search, pagination.
 * Task: 1.1.2.18.1
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

export type CompanyProductRow = {
  id: string;
  name: string;
  atc_code: string | null;
  sku_count: number;
  is_active: boolean;
  company_id: string;
};

type CompanyProductsContentProps = {
  companyId: string;
  companyName: string;
  products: CompanyProductRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  search: string;
};

export function CompanyProductsContent({
  companyId,
  companyName,
  products,
  total,
  currentPage,
  totalPages,
  search,
}: CompanyProductsContentProps) {
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    params.set("page", "1");
    router.push(`/rmm/companies/${companyId}/products?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs: Home > RMM > Companies > [Company Name] > Products */}
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">
          Home
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">
          RMM
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/companies" className="text-[#2563eb] hover:underline">
          Companies
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href={`/rmm/companies/${companyId}`} className="text-[#2563eb] hover:underline">
          {companyName}
        </Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Products</span>
      </nav>

      {/* Page title and [New Product] — wireframe: Products Tab header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">Products</h1>
        <Link
          href={`/rmm/products/new?company=${companyId}`}
          className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
        >
          New Product
        </Link>
      </div>

      {/* Search — wireframe: filters/search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="products-search" className="sr-only">
          Search products by name
        </label>
        <input
          id="products-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search by product name..."
          className="block w-full max-w-sm rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />
        <button
          type="submit"
          className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
        >
          Search
        </button>
      </form>

      {/* Products table — wireframe: Product Name, ATC Code, SKUs, Status, Actions */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white">
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6b7280]">
            {search ? "No products match your search." : "No products."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Company products">
              <thead>
                <tr>
                  <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">
                    Product Name
                  </th>
                  <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                    ATC Code
                  </th>
                  <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                    SKUs
                  </th>
                  <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">
                    Status
                  </th>
                  <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">
                    Actions
                  </th>
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
                    <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{p.atc_code ?? "—"}</td>
                    <td className="whitespace-nowrap py-3 px-3 text-[#111827]">{p.sku_count}</td>
                    <td className="whitespace-nowrap py-3 px-3">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          p.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"
                        }`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-4 py-3">
            <p className="text-sm text-[#6b7280]">
              Page {currentPage} of {totalPages} ({total} total)
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={
                    search
                      ? `/rmm/companies/${companyId}/products?search=${encodeURIComponent(search)}&page=${currentPage - 1}`
                      : `/rmm/companies/${companyId}/products?page=${currentPage - 1}`
                  }
                  className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                >
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={
                    search
                      ? `/rmm/companies/${companyId}/products?search=${encodeURIComponent(search)}&page=${currentPage + 1}`
                      : `/rmm/companies/${companyId}/products?page=${currentPage + 1}`
                  }
                  className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View All Products → back to company detail Products tab */}
      <div>
        <Link
          href={`/rmm/companies/${companyId}#products`}
          className="text-sm font-medium text-[#2563eb] hover:underline"
        >
          ← Back to company
        </Link>
      </div>
    </div>
  );
}
