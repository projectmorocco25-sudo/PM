"use client";

// Wireframe binding: /rmm/atc-codes -> docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md

import { useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useUserRole } from "@/hooks/useUserRole";

type AtcCodeRow = {
  id: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export default function AtcCodesPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const atcQ = useAtcCodes();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [pageSize] = useState(50);
  const [visibleCount, setVisibleCount] = useState(50);

  const atcCodes = useMemo(() => (atcQ.data ?? []) as AtcCodeRow[], [atcQ.data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return atcCodes.filter((row) => {
      if (statusFilter === "active" && row.is_active === false) return false;
      if (statusFilter === "inactive" && row.is_active !== false) return false;

      if (!s) return true;
      return row.code.toLowerCase().includes(s) || row.description.toLowerCase().includes(s);
    });
  }, [atcCodes, search, statusFilter]);

  const shown = filtered.slice(0, visibleCount);

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; RMM &gt; ATC Codes</span>} title="ATC Codes">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; ATC Codes</span>} title="ATC Codes">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ATC codes..." aria-label="Search ATC codes" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant={statusFilter === "active" ? "default" : "outline"} onClick={() => setStatusFilter("active")}>
                Active
              </Button>
              <Button variant={statusFilter === "inactive" ? "default" : "outline"} onClick={() => setStatusFilter("inactive")}>
                Inactive
              </Button>
              <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
                All status
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("active");
                  setVisibleCount(pageSize);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {atcQ.isLoading ? (
              <div className="text-sm text-zinc-600">Loading…</div>
            ) : atcQ.isError ? (
              <div className="text-sm text-zinc-600">
                Unable to load ATC codes.{" "}
                <button type="button" className="text-blue-700 hover:underline" onClick={() => void atcQ.refetch()}>
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-zinc-600">{atcCodes.length === 0 ? "No ATC codes found." : "No ATC codes match your filters."}</div>
            ) : (
              <>
                <div className="mb-2 text-sm text-zinc-600">
                  Showing 1-{shown.length} of {filtered.length} ATC codes
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-zinc-700">
                        <th className="border-b border-zinc-200 px-3 py-2">ATC Code</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Description</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-50">
                          <td className="border-b border-zinc-100 px-3 py-2 font-mono text-sm font-semibold text-zinc-900">{row.code}</td>
                          <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{row.description}</td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-600">{new Date(row.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-2 md:hidden">
                  {shown.map((row) => (
                    <div key={row.id} className="rounded-md border border-zinc-200 p-3">
                      <div className="font-mono text-sm font-semibold text-zinc-900">{row.code}</div>
                      <div className="mt-1 text-sm text-zinc-700">{row.description}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                        <span className="text-xs text-zinc-500">{new Date(row.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {shown.length < filtered.length ? (
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setVisibleCount((c) => c + pageSize)}>
                      Load More
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </MainContent>
    </DashboardLayout>
  );
}
