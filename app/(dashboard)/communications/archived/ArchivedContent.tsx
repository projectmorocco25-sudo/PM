"use client";

/**
 * Wireframe: task-0.5.1.36-archived-conversations.md
 * Archived list: search, filters, list, Restore Selected, retention info.
 * APIs: communications_list_archived, communications_restore_conversation. Tables: conversations.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useArchivedList,
  useRestoreConversation,
  type ArchivedRow,
} from "@/hooks/use-communications";
import { Filter, ChevronDown, Search, X, Inbox } from "lucide-react";

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

type DateFilter = "7" | "30" | "90" | "all";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All" },
];

function filterArchived(
  items: ArchivedRow[],
  search: string,
  typeFilter: string,
  dateFilter: DateFilter
): ArchivedRow[] {
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
    list = list.filter((c) => new Date(c.archived_at) >= cutoff);
  }
  return list;
}

export function ArchivedContent() {
  const { items, status, error, refetch } = useArchivedList();
  const { restore, error: restoreError } = useRestoreConversation();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const filtered = useMemo(
    () => filterArchived(items, search, typeFilter, dateFilter),
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
  const selectedList = filtered.filter((c) => selected.has(c.id));
  const canRestore = selectedList.length > 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRestoreSelected = async () => {
    if (selectedList.length === 0) return;
    setRestoring(true);
    for (const c of selectedList) {
      await restore(c.id);
    }
    setSelected(new Set());
    setRestoreModalOpen(false);
    await refetch();
    setRestoring(false);
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Archived</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Archived Conversations</h1>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg border border-[#e5e7eb] bg-[#f9fafb]"
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
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
            Communications
          </Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Archived</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Archived Conversations</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load archived conversations.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
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
        <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
          Communications
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Archived</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">Archived Conversations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            aria-expanded={filtersOpen}
          >
            <Filter className="h-4 w-4" /> Filters <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => canRestore && setRestoreModalOpen(true)}
            disabled={!canRestore}
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Restore Selected
          </button>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="archived-search" className="sr-only">Search archived</label>
        <input
          id="archived-search"
          type="search"
          placeholder="Search archived conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2.5 pl-4 pr-10 text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
          {search ? (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-4 w-4" aria-hidden />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {filtersOpen && (
          <aside className="w-full shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60" aria-label="Filters">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-[#6b7280]">Type</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {types.map((t) => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="radio"
                        name="arch-type"
                        checked={typeFilter === t}
                        onChange={() => setTypeFilter(t)}
                        className="rounded border-[#e5e7eb] text-[#2563eb]"
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
                        name="arch-date"
                        checked={dateFilter === o.value}
                        onChange={() => setDateFilter(o.value)}
                        className="rounded border-[#e5e7eb] text-[#2563eb]"
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
                  className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-sm font-medium hover:bg-[#f9fafb]"
                >
                  Clear
                </button>
              )}
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                <Inbox className="h-16 w-16 text-[#9ca3af]" aria-hidden />
                <p className="text-base font-medium text-[#6b7280]">
                  {hasActiveFilters ? "No archived conversations match your filters" : "No archived conversations"}
                </p>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="text-sm text-[#2563eb] hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-[#e5e7eb]">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#f9fafb]">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        aria-label={`Select ${c.subject || "conversation"}`}
                        className="mt-1 rounded border-[#e5e7eb] text-[#2563eb]"
                      />
                      <div className="min-w-0 flex-1">
                        <Link href={`/communications/inbox/${c.id}`} className="block">
                          <p className="font-semibold text-[#111827]">{c.subject || "—"}</p>
                          <p className="text-sm text-[#6b7280]">
                            From: {c.created_by ? `${String(c.created_by).slice(0, 8)}…` : "—"}
                          </p>
                          <p className="line-clamp-2 text-sm text-[#6b7280]">{c.subject || "No preview"}</p>
                          <p className="mt-1 text-sm italic text-[#9ca3af]">Archived: {formatTimeAgo(c.archived_at)}</p>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e40af]">
        <p className="font-medium">Data retention compliance</p>
        <p className="mt-1">
          Data retained until 7 years from archive. Retention: 7 years minimum (Law No. 09-08). Historical data cannot be modified. After 7 years, conversations are removed from active archive but remain in audit logs. No hard deletes.
        </p>
      </div>

      {restoreModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" aria-hidden onClick={() => !restoring && setRestoreModalOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#111827]">Restore conversations?</h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              Restore {selectedList.length} conversation{selectedList.length !== 1 ? "s" : ""}? They will be moved back to your inbox. The original archive timestamp is preserved in the audit trail (immutable).
            </p>
            {restoreError && <p className="mt-2 text-sm text-[#ef4444]">{restoreError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => !restoring && setRestoreModalOpen(false)}
                disabled={restoring}
                className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium hover:bg-[#f9fafb] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreSelected}
                disabled={restoring}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {restoring ? "Restoring…" : "Restore"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
