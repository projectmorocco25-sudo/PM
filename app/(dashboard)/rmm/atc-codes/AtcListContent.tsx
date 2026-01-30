"use client";

/**
 * Wireframe: task-0.5.2.14-atc-codes-list.md
 * Route: /rmm/atc-codes
 * Implements: ATC Codes list (MOH-controlled reference) — search, filters (Level, Category), table (Code, Description, Level), info banner, Load More.
 * Task: 1.1.2.29
 * API: rmm_list_atc_codes (hosted Supabase only). RLS applies. Read-only for all users.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md
 */

import { useRouter } from "next/navigation";

const LEVEL_LABELS: Record<number, string> = {
  1: "Level 1 (Anatomical)",
  2: "Level 2 (Therapeutic)",
  3: "Level 3 (Pharmacological)",
  4: "Level 4 (Chemical)",
  5: "Level 5",
};

const LEVEL_BADGE_CLASS: Record<number, string> = {
  1: "bg-[#3b82f6] text-white",
  2: "bg-[#10b981] text-white",
  3: "bg-[#fbbf24] text-[#111827]",
  4: "bg-[#a855f7] text-white",
  5: "bg-[#6b7280] text-white",
};

const CATEGORY_OPTIONS = ["A", "B", "C", "D", "E", "G", "H", "J", "L", "M", "N", "P", "R", "S", "V"];

export type AtcRow = {
  id: string;
  code: string;
  description: string | null;
  is_active: boolean;
  level: number;
};

type AtcListContentProps = {
  atcCodes: AtcRow[];
  total: number;
  search: string;
  levelFilter: string;
  categoryFilter: string;
  offset: number;
  pageSize: number;
  error: string | null;
};

export function AtcListContent({
  atcCodes,
  total,
  search,
  levelFilter,
  categoryFilter,
  offset,
  pageSize,
  error,
}: AtcListContentProps) {
  const router = useRouter();

  function buildQueryString(updates: {
    search?: string;
    level?: string;
    category?: string;
    offset?: string;
  }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined) {
      if (updates.search) next.set("search", updates.search);
    } else if (search) next.set("search", search);
    if (updates.level !== undefined && updates.level) next.set("level", updates.level);
    else if (levelFilter) next.set("level", levelFilter);
    if (updates.category !== undefined && updates.category) next.set("category", updates.category);
    else if (categoryFilter) next.set("category", categoryFilter);
    if (updates.offset !== undefined && updates.offset !== "0") next.set("offset", updates.offset);
    else if (offset > 0) next.set("offset", String(offset));
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, offset: "0" });
    router.push(`/rmm/atc-codes${qs ? `?${qs}` : ""}`);
  }

  function handleLevelChange(level: string) {
    const qs = buildQueryString({ level: level || undefined, offset: "0" });
    router.push(`/rmm/atc-codes${qs ? `?${qs}` : ""}`);
  }

  function handleCategoryChange(category: string) {
    const qs = buildQueryString({ category: category || undefined, offset: "0" });
    router.push(`/rmm/atc-codes${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    router.push("/rmm/atc-codes");
  }

  function loadMore() {
    const nextOffset = offset + pageSize;
    const qs = buildQueryString({ offset: String(nextOffset) });
    router.push(`/rmm/atc-codes?${qs}`);
  }

  const hasFilters = !!(search || levelFilter || categoryFilter);
  const hasMore = offset + atcCodes.length < total;

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
            ATC Codes (MOH-Controlled Reference)
          </h1>
          <span
            className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-[#f3f4f6] text-[#6b7280]"
            aria-label="Read-only reference"
          >
            Read-Only
          </span>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="atc-search" className="sr-only">
          Search ATC codes
        </label>
        <input
          id="atc-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search ATC codes..."
          className="block w-full max-w-md rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          aria-label="Search ATC codes by code or description"
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
              <p className="text-xs font-medium text-[#6b7280]">Level</p>
              <div className="mt-1 space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="level"
                    checked={!levelFilter}
                    onChange={() => handleLevelChange("")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                {[1, 2, 3, 4].map((l) => (
                  <label key={l} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="level"
                      checked={levelFilter === String(l)}
                      onChange={() => handleLevelChange(String(l))}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    Level {l}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6b7280]">Category</p>
              <div className="mt-1 space-y-1 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="category"
                    checked={!categoryFilter}
                    onChange={() => handleCategoryChange("")}
                    className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  All
                </label>
                {CATEGORY_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === c}
                      onChange={() => handleCategoryChange(c)}
                      className="h-4 w-4 border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    {c}
                  </label>
                ))}
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
          {atcCodes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-[#111827]">No ATC codes found</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Try adjusting your search or filters.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-md border border-[#3b82f6] bg-white px-4 py-2 text-sm font-medium text-[#3b82f6] hover:bg-[#eff6ff]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="border-b border-[#e5e7eb] px-4 py-2 text-sm text-[#6b7280]" aria-live="polite">
                {total} ATC code{total !== 1 ? "s" : ""} found
              </p>
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-[#e5e7eb] text-sm"
                  role="grid"
                  aria-label="ATC Codes"
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]"
                      >
                        Code
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-3 text-left font-medium text-[#6b7280]"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="py-3 pl-3 pr-4 text-left font-medium text-[#6b7280]"
                      >
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {atcCodes.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-[#f9fafb]"
                      >
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 font-mono font-medium text-[#111827]">
                          {row.code}
                        </td>
                        <td className="py-3 px-3 text-[#111827]">
                          {row.description ?? "—"}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-4">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              LEVEL_BADGE_CLASS[row.level] ?? "bg-[#6b7280] text-white"
                            }`}
                          >
                            {LEVEL_LABELS[row.level] ?? `Level ${row.level}`}
                          </span>
                        </td>
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
    </div>
  );
}

function InfoBanner() {
  return (
    <div
      className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4"
      role="region"
      aria-label="Information about ATC codes"
    >
      <p className="text-sm font-medium text-[#1e40af]">
        ℹ️ ATC codes are MOH-controlled and read-only.
      </p>
      <p className="mt-1 text-sm text-[#1e3a8a]">
        These codes are used for product classification.
      </p>
      <p className="mt-2 text-xs text-[#1e3a8a]">
        Regulatory context: ATC codes are used for regulatory product classification per DMP Art.15.
        All ATC code data is retained for regulatory audit (7-year minimum per Law No. 09-08).
      </p>
    </div>
  );
}
