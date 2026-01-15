"use client";

// Wireframe binding:
// - /rmm/products
// - /rmm/companies/[id]/products
// docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useProducts } from "@/hooks/useProducts";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";

type CompanyRow = { id: string; name: string };
type ProductRow = {
  id: string;
  company_id: string;
  name: string;
  is_active: boolean;
  is_critical_medicine: boolean;
  created_at: string;
};
type SkuRow = { id: string; product_id: string; atc_code_id: string | null };

export function ProductsList({
  companyId,
  initialCompanyFilter,
}: {
  companyId?: string | null;
  initialCompanyFilter?: string | null;
}) {
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const enforcedCompanyId = roleInfo?.companyId ?? null;
  const isCompanyUser = Boolean(roleInfo?.isCompanyUser);

  const effectiveCompanyId = companyId ?? (isCompanyUser ? enforcedCompanyId : null);

  const qCompanies = useCompanies();
  const qProducts = useProducts({ companyId: effectiveCompanyId ?? undefined });
  const qSkus = useSkus();
  const qAtc = useAtcCodes();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [criticalFilter, setCriticalFilter] = useState<"all" | "yes" | "no">("all");
  const [companyFilter, setCompanyFilter] = useState<string>(initialCompanyFilter ?? "all");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const companies = useMemo(() => (qCompanies.data ?? []) as CompanyRow[], [qCompanies.data]);
  const products = useMemo(() => (qProducts.data ?? []) as ProductRow[], [qProducts.data]);
  const skus = useMemo(() => (qSkus.data ?? []) as SkuRow[], [qSkus.data]);

  const companyNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of companies) m.set(c.id, c.name);
    return m;
  }, [companies]);

  const atcCodeById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of qAtc.data ?? []) m.set(a.id, a.code);
    return m;
  }, [qAtc.data]);

  const skuCountByProductId = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of skus) m.set(s.product_id, (m.get(s.product_id) ?? 0) + 1);
    return m;
  }, [skus]);

  const atcCodeByProductId = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of skus) {
      if (!s.atc_code_id) continue;
      const code = atcCodeById.get(s.atc_code_id);
      if (!code) continue;
      if (!m.has(s.product_id)) m.set(s.product_id, code);
    }
    return m;
  }, [atcCodeById, skus]);

  const showCompanyColumn = !effectiveCompanyId;
  const showCompanyFilter = !effectiveCompanyId && (roleInfo?.isMOHUser ?? false);

  const canCreate = role !== "auditor";
  const canEdit =
    role === "tier1" ||
    role === "tier2_officer" ||
    role === "tier2_registrar" ||
    role === "system_admin" ||
    role === "company_admin";

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      if (showCompanyFilter && companyFilter !== "all" && p.company_id !== companyFilter) return false;

      if (statusFilter === "active" && p.is_active === false) return false;
      if (statusFilter === "inactive" && p.is_active !== false) return false;

      if (criticalFilter === "yes" && p.is_critical_medicine !== true) return false;
      if (criticalFilter === "no" && p.is_critical_medicine === true) return false;

      if (!s) return true;
      const companyName = companyNameById.get(p.company_id) ?? "";
      const atc = atcCodeByProductId.get(p.id) ?? "";
      return p.name.toLowerCase().includes(s) || companyName.toLowerCase().includes(s) || atc.toLowerCase().includes(s);
    });
  }, [
    atcCodeByProductId,
    companyFilter,
    companyNameById,
    criticalFilter,
    products,
    search,
    showCompanyFilter,
    statusFilter,
  ]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" />
        </div>

        <div className="flex flex-wrap gap-2">
          {showCompanyFilter ? (
            <select
              className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              aria-label="Filter by company"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : null}

          <Button variant={statusFilter === "active" ? "default" : "outline"} onClick={() => setStatusFilter("active")}>
            Active
          </Button>
          <Button variant={statusFilter === "inactive" ? "default" : "outline"} onClick={() => setStatusFilter("inactive")}>
            Inactive
          </Button>
          <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
            All status
          </Button>

          <Button variant={criticalFilter === "all" ? "default" : "outline"} onClick={() => setCriticalFilter("all")}>
            All critical
          </Button>
          <Button variant={criticalFilter === "yes" ? "default" : "outline"} onClick={() => setCriticalFilter("yes")}>
            Critical
          </Button>
          <Button variant={criticalFilter === "no" ? "default" : "outline"} onClick={() => setCriticalFilter("no")}>
            Not critical
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatusFilter("active");
              setCriticalFilter("all");
              setCompanyFilter(initialCompanyFilter ?? "all");
              setVisibleCount(pageSize);
            }}
          >
            Clear
          </Button>

          {canCreate ? (
            <Button disabled title="Product create form comes in Task 1.1.2.22">
              New Product
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {qProducts.isLoading || qCompanies.isLoading || qSkus.isLoading || qAtc.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : qProducts.isError ? (
          <div className="text-sm text-zinc-600">
            Unable to load products.{" "}
            <button type="button" className="text-blue-700 hover:underline" onClick={() => void qProducts.refetch()}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-zinc-600">
            {products.length === 0 ? "No products found." : "No products match your filters."}
          </div>
        ) : (
          <>
            <div className="mb-2 text-sm text-zinc-600">
              Showing 1-{shown.length} of {filtered.length} products
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold text-zinc-700">
                    <th className="border-b border-zinc-200 px-3 py-2">Product Name</th>
                    {showCompanyColumn ? <th className="border-b border-zinc-200 px-3 py-2">Company</th> : null}
                    <th className="border-b border-zinc-200 px-3 py-2">ATC Code</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Critical</th>
                    <th className="border-b border-zinc-200 px-3 py-2">SKU Count</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => {
                    const companyName = companyNameById.get(p.company_id) ?? "—";
                    const atc = atcCodeByProductId.get(p.id) ?? "—";
                    const skuCount = skuCountByProductId.get(p.id) ?? 0;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50">
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900">{p.name}</td>
                        {showCompanyColumn ? (
                          <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{companyName}</td>
                        ) : null}
                        <td className="border-b border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">{atc}</td>
                        <td className="border-b border-zinc-100 px-3 py-2">
                          {p.is_critical_medicine ? <Badge variant="destructive">Critical</Badge> : <span className="text-xs text-zinc-500">—</span>}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{skuCount}</td>
                        <td className="border-b border-zinc-100 px-3 py-2">
                          <Badge variant={p.is_active ? "success" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2">
                          <div className="flex gap-2">
                            <Button variant="link" className="h-auto p-0 text-sm" disabled title="Product detail comes in Task 1.1.2.21">
                              View
                            </Button>
                            {canEdit ? (
                              <Button
                                variant="link"
                                className="h-auto p-0 text-sm"
                                disabled
                                title="Product edit form comes in Task 1.1.2.22"
                              >
                                Edit
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {shown.map((p) => {
                const companyName = companyNameById.get(p.company_id) ?? "—";
                const atc = atcCodeByProductId.get(p.id) ?? "—";
                return (
                  <div key={p.id} className="rounded-md border border-zinc-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {showCompanyColumn ? <Badge variant="secondary">{companyName}</Badge> : null}
                          <Badge variant="secondary">{atc}</Badge>
                          <Badge variant={p.is_active ? "success" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge>
                          {p.is_critical_medicine ? <Badge variant="destructive">Critical</Badge> : null}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled title="Product detail comes in Task 1.1.2.21">
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
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
  );
}

