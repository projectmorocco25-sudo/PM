"use client";

import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/feedback/Skeleton";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  className?: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | boolean | null | undefined;
};

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "No results.",
  pageSize = 20,
  getRowId,
  enableRowSelection = false,
  enableVirtualization = true,
  virtualizeAfter = 100,
  virtualHeight = 520,
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  getRowId: (row: T) => string;
  enableRowSelection?: boolean;
  enableVirtualization?: boolean;
  virtualizeAfter?: number;
  virtualHeight?: number;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const sv = col.sortValue ?? ((row: T) => (row as Record<string, unknown>)[sortKey] as unknown);

    const arr = [...data];
    arr.sort((a, b) => {
      const av = sv(a);
      const bv = sv(b);
      const a0 = av ?? "";
      const b0 = bv ?? "";
      if (a0 < b0) return sortDir === "asc" ? -1 : 1;
      if (a0 > b0) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [columns, data, sortDir, sortKey]);

  const total = sorted.length;
  const shouldVirtualize = Boolean(enableVirtualization) && !isLoading && total > Math.max(virtualizeAfter, 0);
  const safePageSize = Math.max(1, pageSize);
  const maxPage = Math.max(0, Math.ceil(total / safePageSize) - 1);
  const pageSafe = Math.min(page, maxPage);

  const pageRows = sorted.slice(pageSafe * safePageSize, pageSafe * safePageSize + safePageSize);
  const showingStart = total === 0 ? 0 : pageSafe * safePageSize + 1;
  const showingEnd = Math.min(total, pageSafe * safePageSize + pageRows.length);

  function toggleSort(nextKey: string) {
    if (sortKey !== nextKey) {
      setSortKey(nextKey);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  const parentRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: total,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 10,
  });

  const gridTemplateColumns = useMemo(() => {
    const lead = enableRowSelection ? "44px " : "";
    return `${lead}${columns.map(() => "minmax(0, 1fr)").join(" ")}`.trim();
  }, [columns, enableRowSelection]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-600">
        Showing {showingStart}-{showingEnd} of {total}
      </div>

      {shouldVirtualize ? (
        <div className="rounded-md border border-zinc-200 bg-white">
          <div className="overflow-x-auto border-b border-zinc-200">
            <div
              role="row"
              className="grid min-w-[720px] gap-0 px-3 py-2 text-xs font-semibold text-zinc-700"
              style={{ gridTemplateColumns }}
            >
              {enableRowSelection ? <div role="columnheader" className="w-[44px]" /> : null}
              {columns.map((c) => (
                <div key={c.key} role="columnheader" className={cn("flex items-center", c.className)}>
                  {c.sortable ? (
                    <button type="button" className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort(c.key)}>
                      {c.header}
                      {sortKey === c.key ? <span className="text-xs text-zinc-500">{sortDir === "asc" ? "▲" : "▼"}</span> : null}
                    </button>
                  ) : (
                    c.header
                  )}
                </div>
              ))}
            </div>
          </div>

          <div ref={parentRef} className="overflow-auto" style={{ height: virtualHeight }}>
            {total === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-600">{emptyMessage}</div>
            ) : (
              <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
                {rowVirtualizer.getVirtualItems().map((v) => {
                  const row = sorted[v.index];
                  const id = getRowId(row);
                  const checked = Boolean(selected[id]);
                  return (
                    <div
                      key={id}
                      role="row"
                      className="grid min-w-[720px] gap-0 border-b border-zinc-100 px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-50"
                      style={{ gridTemplateColumns, position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${v.start}px)` }}
                    >
                      {enableRowSelection ? (
                        <div role="cell" className="flex items-center">
                          <input
                            type="checkbox"
                            aria-label="Select row"
                            checked={checked}
                            onChange={(e) => setSelected((s) => ({ ...s, [id]: e.target.checked }))}
                            className={cn("h-4 w-4")}
                          />
                        </div>
                      ) : null}
                      {columns.map((c) => (
                        <div key={c.key} role="cell" className="flex items-center">
                          {c.cell(row)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                {enableRowSelection ? <TableHead className="w-[44px]"> </TableHead> : null}
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.sortable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-left hover:underline"
                        onClick={() => toggleSort(c.key)}
                      >
                        {c.header}
                        {sortKey === c.key ? <span className="text-xs text-zinc-500">{sortDir === "asc" ? "▲" : "▼"}</span> : null}
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    {enableRowSelection ? (
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                    ) : null}
                    {columns.map((c) => (
                      <TableCell key={c.key}>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} className="py-8 text-center text-sm text-zinc-600">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => {
                  const id = getRowId(row);
                  const checked = Boolean(selected[id]);
                  return (
                    <TableRow key={id} className="hover:bg-zinc-50">
                      {enableRowSelection ? (
                        <TableCell>
                          <input
                            type="checkbox"
                            aria-label="Select row"
                            checked={checked}
                            onChange={(e) => setSelected((s) => ({ ...s, [id]: e.target.checked }))}
                            className={cn("h-4 w-4")}
                          />
                        </TableCell>
                      ) : null}
                      {columns.map((c) => (
                        <TableCell key={c.key}>{c.cell(row)}</TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          disabled={pageSafe <= 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <div className="text-sm text-zinc-600">
          Page {pageSafe + 1} of {maxPage + 1}
        </div>
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          disabled={pageSafe >= maxPage}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

