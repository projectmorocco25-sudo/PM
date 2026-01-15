"use client";

// Wireframe binding: /rmm/companies -> docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md

import Link from "next/link";
import { useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCompanies } from "@/hooks/useCompanies";
import { useUserRole } from "@/hooks/useUserRole";

type CompanyRow = {
  id: string;
  name: string;
  registration_number: string;
  company_type: "ipc" | "wholesaler";
  is_active: boolean;
  created_at: string;
};

export default function CompaniesListPage() {
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canCreate = role === "tier1" || role === "system_admin" || role === "tier2_officer";

  const q = useCompanies();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "ipc" | "wholesaler">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const rows = useMemo(() => (q.data ?? []) as CompanyRow[], [q.data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((c) => {
      if (typeFilter !== "all" && c.company_type !== typeFilter) return false;
      if (statusFilter === "active" && c.is_active === false) return false;
      if (statusFilter === "inactive" && c.is_active !== false) return false;
      if (!s) return true;
      return (
        c.name.toLowerCase().includes(s) ||
        (c.registration_number ?? "").toLowerCase().includes(s)
      );
    });
  }, [rows, search, typeFilter, statusFilter]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <DashboardLayout>
      <MainContent
        breadcrumbs={<span>Home &gt; RMM &gt; Companies</span>}
        title="Companies"
        actions={
          canCreate ? (
            <Link href="/rmm/companies/new">
              <Button>New Company</Button>
            </Link>
          ) : null
        }
      >
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                aria-label="Search companies"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                onClick={() => setTypeFilter("all")}
              >
                All types
              </Button>
              <Button
                variant={typeFilter === "ipc" ? "default" : "outline"}
                onClick={() => setTypeFilter("ipc")}
              >
                IPC
              </Button>
              <Button
                variant={typeFilter === "wholesaler" ? "default" : "outline"}
                onClick={() => setTypeFilter("wholesaler")}
              >
                Wholesaler
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All status
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStatusFilter("active");
                  setVisibleCount(pageSize);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {q.isLoading ? (
              <div className="text-sm text-zinc-600">Loading…</div>
            ) : q.isError ? (
              <div className="text-sm text-zinc-600">
                Unable to load companies.{" "}
                <button type="button" className="text-blue-700 hover:underline" onClick={() => void q.refetch()}>
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-zinc-600">
                {rows.length === 0 ? "No companies found." : "No companies match your filters."}
              </div>
            ) : (
              <>
                <div className="mb-2 text-sm text-zinc-600">
                  Showing 1-{shown.length} of {filtered.length} companies
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-zinc-700">
                        <th className="border-b border-zinc-200 px-3 py-2">Name</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Reg. Number</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Type</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-50">
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/companies/${c.id}`}>
                              {c.name}
                            </Link>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">
                            {c.registration_number}
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Badge variant="secondary">{c.company_type === "ipc" ? "IPC" : "Wholesaler"}</Badge>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Badge variant={c.is_active ? "success" : "secondary"}>{c.is_active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <div className="flex gap-2">
                              <Link className="text-sm text-blue-700 hover:underline" href={`/rmm/companies/${c.id}`}>
                                View
                              </Link>
                              {(role === "tier1" || role === "system_admin" || role === "company_admin") ? (
                                <Link className="text-sm text-blue-700 hover:underline" href={`/rmm/companies/${c.id}/edit`}>
                                  Edit
                                </Link>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-2 md:hidden">
                  {shown.map((c) => (
                    <Link
                      key={c.id}
                      href={`/rmm/companies/${c.id}`}
                      className="block rounded-md border border-zinc-200 p-3 hover:bg-zinc-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-900">{c.name}</div>
                          <div className="mt-1 font-mono text-xs text-zinc-700">{c.registration_number}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary">{c.company_type === "ipc" ? "IPC" : "Wholesaler"}</Badge>
                            <Badge variant={c.is_active ? "success" : "secondary"}>{c.is_active ? "Active" : "Inactive"}</Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {shown.length < filtered.length ? (
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setVisibleCount((c) => c + pageSize)}>
                      Load more
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

