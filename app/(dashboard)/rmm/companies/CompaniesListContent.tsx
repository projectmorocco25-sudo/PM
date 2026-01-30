"use client";

/**
 * Wireframe: task-0.5.2.2-companies-list.md
 * Route: /rmm/companies
 * Implements: Companies list — search bar, filters (Type, Status), table (Name, Reg Number, Type, Status, Compliance placeholder, Actions), pagination.
 * Task: 1.1.2.17
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

export type CompanyRow = {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  is_active: boolean;
  created_at?: string;
};

type CompaniesListContentProps = {
  companies: CompanyRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  search: string;
  typeFilter: string;
  statusFilter: string;
  error: string | null;
};

export function CompaniesListContent({
  companies,
  total,
  currentPage,
  totalPages,
  search,
  typeFilter,
  statusFilter,
  error,
}: CompaniesListContentProps) {
  const router = useRouter();

  function buildQueryString(updates: { search?: string; type?: string; status?: string; page?: string }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined) {
      if (updates.search) next.set("search", updates.search);
    } else if (search) next.set("search", search);
    if (updates.type !== undefined && updates.type) next.set("type", updates.type);
    else if (typeFilter) next.set("type", typeFilter);
    if (updates.status !== undefined) next.set("status", updates.status);
    else if (statusFilter) next.set("status", statusFilter);
    if (updates.page !== undefined && updates.page !== "1") next.set("page", updates.page);
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, page: "1" });
    router.push(`/rmm/companies${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(type: "type" | "status", value: string) {
    const qs = buildQueryString({ [type]: value, page: "1" });
    router.push(`/rmm/companies${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/rmm/companies");
  }

  const typeLabel = (t: string) => (t === "ipc" ? "IPC" : t === "wholesaler" ? "Wholesaler" : t);
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
          <span className="text-[#111827] font-medium">Companies</span>
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
      {/* Breadcrumbs: Home > RMM > Companies — wireframe Page Header */}
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Companies</span>
      </nav>

      {/* Title and [New Company] — wireframe Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827] md:text-3xl">Companies</h1>
        <Link
          href="/rmm/companies/new"
          className="inline-flex items-center rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]"
        >
          New Company
        </Link>
      </div>

      {/* Search bar — wireframe Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="companies-search" className="sr-only">Search companies</label>
        <input
          id="companies-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search companies..."
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
        {/* Filters sidebar — wireframe Filters Sidebar */}
        <aside className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60" aria-label="Filters">
          <h2 className="text-sm font-semibold text-[#111827]">Filters</h2>
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Type</p>
              <div className="mt-1 space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="type"
                    checked={!typeFilter}
                    onChange={() => handleFilterChange("type", "")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="type"
                    checked={typeFilter === "ipc"}
                    onChange={() => handleFilterChange("type", "ipc")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  IPC
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="type"
                    checked={typeFilter === "wholesaler"}
                    onChange={() => handleFilterChange("type", "wholesaler")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Wholesaler
                </label>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Status</p>
              <div className="mt-1 space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    checked={statusFilter === "all"}
                    onChange={() => handleFilterChange("status", "all")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    checked={statusFilter === "active"}
                    onChange={() => handleFilterChange("status", "active")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    checked={statusFilter === "inactive"}
                    onChange={() => handleFilterChange("status", "inactive")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  Inactive
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

        {/* Companies table — wireframe Companies Table */}
        <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white">
          {companies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-[#111827]">
                {search || typeFilter || (statusFilter !== "active" && statusFilter !== "all") ? "No companies match your filters" : "No companies found"}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {search || typeFilter || statusFilter ? "Try clearing filters." : "Create your first company to get started."}
              </p>
              {search || typeFilter || statusFilter ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-md border border-[#3b82f6] bg-white px-4 py-2 text-sm font-medium text-[#3b82f6] hover:bg-[#eff6ff]"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/rmm/companies/new"
                  className="mt-4 inline-block rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
                >
                  New Company
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="Companies">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">Name</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Registration Number</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Type</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Status</th>
                      <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Compliance</th>
                      <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {companies.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f9fafb]">
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 font-medium text-[#111827]">
                          <Link href={`/rmm/companies/${c.id}`} className="text-[#2563eb] hover:underline">
                            {c.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 font-mono text-[#111827]">{c.registration_number}</td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#f3f4f6] text-[#374151]">
                            {typeLabel(c.company_type)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${c.is_active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f3f4f6] text-[#6b7280]"}`}>
                            {c.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3 text-[#6b7280]">—</td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
                          <Link href={`/rmm/companies/${c.id}`} className="text-[#2563eb] hover:underline mr-2">View</Link>
                          <Link href={`/rmm/companies/${c.id}/edit`} className="text-[#2563eb] hover:underline">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination — wireframe: "Showing 1-20 of 150", Load More */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-3">
                <p className="text-sm text-[#6b7280]">
                  Showing {start}-{end} of {total} companies
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/rmm/companies?${buildQueryString({ page: String(currentPage - 1) })}`}
                      className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/rmm/companies?${buildQueryString({ page: String(currentPage + 1) })}`}
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
