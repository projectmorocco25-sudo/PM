"use client";

/**
 * Wireframe: task-0.5.1.30-history-overview.md
 * History overview: date range, compliance banner, filters, timeline, load more.
 * API: shared_get_history. Role-based (MOH vs Company).
 */

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useHistory } from "@/hooks/use-history";
import { ChevronDown, ChevronUp, History, Info } from "lucide-react";

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

const DATE_RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "7y", label: "Last 7 years" },
] as const;

export function HistoryContent() {
  const { user } = useSession();
  const [dateRange, setDateRange] = useState("30");
  const [tableFilter, setTableFilter] = useState<string | null>(null);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);

  const { items, total, status, error, refetch, loadMore, hasMore, loadingMore } = useHistory(
    user?.id ?? null,
    dateRange,
    tableFilter
  );

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">History</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">History</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]" aria-hidden />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">History</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">History</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load history.</p>
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
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">History</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">History</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="history-date-range" className="sr-only">Date range</label>
          <select
            id="history-date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            {DATE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Regulatory compliance banner */}
      <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] overflow-hidden">
        <button
          type="button"
          onClick={() => setBannerCollapsed((c) => !c)}
          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#dbeafe]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-inset"
          aria-expanded={!bannerCollapsed}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[#1e40af]">
            <Info className="h-5 w-5" aria-hidden />
            Regulatory compliance
          </span>
          {bannerCollapsed ? (
            <ChevronDown className="h-5 w-5 text-[#1e40af]" aria-hidden />
          ) : (
            <ChevronUp className="h-5 w-5 text-[#1e40af]" aria-hidden />
          )}
        </button>
        {!bannerCollapsed && (
          <div className="border-t border-[#bfdbfe] px-4 py-3 text-sm text-[#1e40af] space-y-1">
            <p>Historical data is immutable per regulatory requirements (Law No. 09-08). No modifications allowed.</p>
            <p>Data retention: 7 years minimum (Law No. 09-08). All historical data compliant.</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="rounded-lg border border-[#e5e7eb] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#111827]">Filters</h2>
          <div className="mt-3 space-y-2">
            <label className="block text-xs font-medium text-[#6b7280]">Type</label>
            <select
              value={tableFilter ?? ""}
              onChange={(e) => setTableFilter(e.target.value || null)}
              className="w-full rounded border border-[#e5e7eb] bg-white px-2 py-1.5 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="">All</option>
              <option value="companies">Companies</option>
              <option value="products">Products</option>
              <option value="skus">SKUs</option>
              <option value="registry_submissions">Submissions</option>
            </select>
            <button
              type="button"
              onClick={() => { setTableFilter(null); setDateRange("30"); }}
              className="mt-2 w-full rounded border border-[#e5e7eb] bg-[#f9fafb] px-2 py-1.5 text-xs font-medium text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              Clear
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
            {status === "empty" || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-6" role="status">
                <History className="h-16 w-16 text-[#9ca3af]" aria-hidden />
                <p className="text-base font-medium text-[#6b7280]">No history found</p>
                <p className="text-sm text-[#9ca3af]">Try adjusting filters or date range.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#e5e7eb]">
                {items.map((it) => (
                  <li key={it.id}>
                    <Link
                      href={it.link}
                      className="flex gap-3 px-4 py-3 transition-colors hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-inset"
                    >
                      <span className="flex h-3 w-3 shrink-0 mt-1.5 rounded-full bg-[#3b82f6]" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#111827]">{it.title}</p>
                        {it.description && (
                          <p className="mt-0.5 text-sm text-[#6b7280] line-clamp-2">{it.description}</p>
                        )}
                        <p className="mt-1 text-xs text-[#9ca3af]">{formatTimeAgo(it.created_at)}</p>
                      </div>
                      <span className="shrink-0 self-center text-sm font-medium text-[#2563eb]">View</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {hasMore && items.length > 0 && (
              <div className="border-t border-[#e5e7eb] px-4 py-3">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] py-2 text-sm font-medium text-[#111827] hover:bg-[#f3f4f6] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
                >
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
