"use client";

// Wireframe binding: /rmm/critical-medicines -> docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md

import Link from "next/link";
import { useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { useUserRole } from "@/hooks/useUserRole";

type ProductRow = {
  id: string;
  company_id: string;
  name: string;
  is_critical_medicine: boolean;
  is_active: boolean;
  created_at: string;
};

export default function CriticalMedicinesPage() {
  const { data: roleInfo } = useUserRole();
  const isMOHUser = roleInfo?.isMOHUser ?? false;
  const isTier1 = roleInfo?.isTier1 ?? false;

  const productsQ = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const products = useMemo(() => (productsQ.data ?? []) as ProductRow[], [productsQ.data]);

  const criticalOnly = useMemo(() => products.filter((p) => p.is_critical_medicine), [products]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return criticalOnly.filter((row) => {
      if (statusFilter === "active" && row.is_active === false) return false;
      if (statusFilter === "inactive" && row.is_active !== false) return false;

      if (!s) return true;
      return row.name.toLowerCase().includes(s);
    });
  }, [criticalOnly, search, statusFilter]);

  const shown = filtered.slice(0, visibleCount);

  if (!isMOHUser) {
    return (
      <DashboardLayout>
        <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Critical Medicines</span>} title="Critical Medicines">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Access restricted: MOH users only.</div>
          </div>
        </MainContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Critical Medicines</span>} title="Critical Medicines">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search critical medicines..."
                aria-label="Search critical medicines"
              />
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

              {isTier1 ? (
                <Button disabled title="Designate/Remove critical medicine comes in later tasks">
                  Manage Designation
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            {productsQ.isLoading ? (
              <div className="text-sm text-zinc-600">Loading…</div>
            ) : productsQ.isError ? (
              <div className="text-sm text-zinc-600">
                Unable to load critical medicines.{" "}
                <button type="button" className="text-blue-700 hover:underline" onClick={() => void productsQ.refetch()}>
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-zinc-600">
                {criticalOnly.length === 0 ? "No critical medicines designated." : "No critical medicines match your filters."}
              </div>
            ) : (
              <>
                <div className="mb-2 text-sm text-zinc-600">
                  Showing 1-{shown.length} of {filtered.length} critical medicines
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-zinc-700">
                        <th className="border-b border-zinc-200 px-3 py-2">Product Name</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Designated</th>
                        <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-50">
                          <td className="border-b border-zinc-100 px-3 py-2 text-sm font-medium text-blue-700">
                            <Link href={`/rmm/products/${row.id}`} className="hover:underline">
                              {row.name}
                            </Link>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-600">{new Date(row.created_at).toLocaleDateString()}</td>
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Link href={`/rmm/products/${row.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-2 md:hidden">
                  {shown.map((row) => (
                    <div key={row.id} className="rounded-md border border-zinc-200 p-3">
                      <Link href={`/rmm/products/${row.id}`} className="block font-medium text-blue-700 hover:underline">
                        {row.name}
                      </Link>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                        <span className="text-xs text-zinc-500">Designated {new Date(row.created_at).toLocaleDateString()}</span>
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
