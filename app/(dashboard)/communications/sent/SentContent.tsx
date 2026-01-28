"use client";

/**
 * Wireframe: task-0.5.1.27-sent-messages.md
 * Sent list: breadcrumbs, Filters, Search, list (To, Subject, Preview, status, timestamp), Load More.
 * API: communications_list_sent. Tables: conversations, messages.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSentList, type SentRow } from "@/hooks/use-communications";
import { MessageSquare, Filter, ChevronDown, Search, X } from "lucide-react";

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

type DateFilter = "7" | "30" | "90" | "all";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All" },
];

function filterSent(
  items: SentRow[],
  search: string,
  typeFilter: string,
  dateFilter: DateFilter
): SentRow[] {
  let list = items;
  const q = search.trim().toLowerCase();
  if (q) list = list.filter((c) => (c.subject ?? "").toLowerCase().includes(q));
  if (typeFilter && typeFilter !== "all") {
    list = list.filter((c) => (c.type ?? "") === typeFilter);
  }
  if (dateFilter && dateFilter !== "all") {
    const days = parseInt(dateFilter, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    list = list.filter((c) => new Date(c.updated_at ?? c.created_at) >= cutoff);
  }
  return list;
}

export function SentContent() {
  const { items, status, error, refetch } = useSentList();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => filterSent(items, search, typeFilter, dateFilter),
    [items, search, typeFilter, dateFilter]
  );

  const types = useMemo(() => {
    const s = new Set<string>(items.map((c) => c.type || "workflow_related"));
    return ["all", ...Array.from(s)];
  }, [items]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters = search !== "" || typeFilter !== "all" || dateFilter !== "all";

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav
          className="flex h-10 items-center text-sm text-[#6b7280]"
          aria-label="Breadcrumb"
        >
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Sent Messages</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Sent Messages</h1>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[80px] animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]"
              aria-hidden
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6">
        <nav
          className="flex h-10 items-center text-sm text-[#6b7280]"
          aria-label="Breadcrumb"
        >
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Sent Messages</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Sent Messages</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load sent messages.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav
        className="flex h-10 items-center text-sm text-[#6b7280]"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
          Communications
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Sent Messages</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Sent Messages</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
            aria-expanded={filtersOpen}
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filters
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
          <div className="relative">
            <label htmlFor="sent-search" className="sr-only">Search</label>
            <input
              id="sent-search"
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 rounded-lg border border-[#e5e7eb] bg-white py-2 pl-3 pr-9 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9ca3af]">
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-[#111827]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {filtersOpen && (
          <aside
            className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60"
            aria-label="Filters"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Type</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {types.map((t) => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="radio"
                        name="sent-type"
                        checked={typeFilter === t}
                        onChange={() => setTypeFilter(t)}
                        className="rounded border-[#e5e7eb] text-[#2563eb] focus:ring-[#3b82f6]"
                      />
                      <span className="capitalize">{t === "all" ? "All" : t.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Date</span>
                <div className="mt-1 space-y-1">
                  {DATE_OPTIONS.map((o) => (
                    <label key={o.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="sent-date"
                        checked={dateFilter === o.value}
                        onChange={() => setDateFilter(o.value)}
                        className="rounded border-[#e5e7eb] text-[#2563eb] focus:ring-[#3b82f6]"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
                >
                  Clear
                </button>
              )}
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
          {status === "empty" || filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 px-6 py-16"
              role="status"
            >
              <MessageSquare className="h-16 w-16 text-[#9ca3af]" aria-hidden />
              <p className="text-base font-medium text-[#6b7280]">
                {hasActiveFilters ? "No sent messages match your filters" : "No sent messages"}
              </p>
              <p className="text-sm text-[#9ca3af]">
                {hasActiveFilters ? "Try adjusting filters or search." : ""}
              </p>
              {!hasActiveFilters && (
                <Link
                  href="/communications/compose"
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
                >
                  Compose Message
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-[#e5e7eb]">
              {filtered.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/communications/inbox/${c.id}`}
                    className="flex min-h-[80px] flex-col gap-1 px-4 py-3 transition-colors hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3b82f6]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#111827]">{c.subject || "—"}</p>
                      <span className="shrink-0 text-xs text-[#6b7280]">
                        ✓ Sent · {formatTimeAgo(c.updated_at ?? c.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7280]">
                      To: {c.company_id ? `${String(c.company_id).slice(0, 8)}…` : "—"}
                    </p>
                    <p className="line-clamp-2 text-sm text-[#6b7280]">
                      {c.subject || "No preview"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
