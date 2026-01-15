"use client";

// Wireframe binding:
// - /rmm/products/[id]/skus
// - /rmm/skus
// docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useProducts } from "@/hooks/useProducts";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";

type ProductRow = { id: string; name: string };

type SkuRow = {
  id: string;
  product_id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  atc_code_id: string | null;
  is_active: boolean;
};

export function SkusList({
  productId,
  initialProductFilter,
}: {
  productId?: string | null;
  initialProductFilter?: string | null;
}) {
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const isMOHUser = roleInfo?.isMOHUser ?? false;

  const effectiveProductId = productId ?? null;

  const skusQ = useSkus({ productId: effectiveProductId ?? undefined });
  const productsQ = useProducts();
  const atcQ = useAtcCodes();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [dosageFormFilter, setDosageFormFilter] = useState<string>("all");
  const [atcFilter, setAtcFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>(initialProductFilter ?? "all");
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);

  const skus = useMemo(() => (skusQ.data ?? []) as SkuRow[], [skusQ.data]);
  const products = useMemo(() => (productsQ.data ?? []) as ProductRow[], [productsQ.data]);

  const productNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of products) m.set(p.id, p.name);
    return m;
  }, [products]);

  const atcCodeById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of atcQ.data ?? []) m.set(a.id, a.code);
    return m;
  }, [atcQ.data]);

  const dosageForms = useMemo(() => {
    const set = new Set<string>();
    for (const s of skus) {
      const v = (s.dosage_form ?? "").trim();
      if (v) set.add(v);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [skus]);

  const showProductColumn = !effectiveProductId;
  const showProductFilter = !effectiveProductId && isMOHUser;

  const canCreate = role !== "auditor";
  const canEdit =
    role === "tier1" ||
    role === "tier2_officer" ||
    role === "tier2_registrar" ||
    role === "system_admin" ||
    role === "company_admin";

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return skus.filter((row) => {
      if (showProductFilter && productFilter !== "all" && row.product_id !== productFilter) return false;

      if (statusFilter === "active" && row.is_active === false) return false;
      if (statusFilter === "inactive" && row.is_active !== false) return false;

      if (dosageFormFilter !== "all" && (row.dosage_form ?? "") !== dosageFormFilter) return false;
      if (atcFilter !== "all" && (row.atc_code_id ?? "") !== atcFilter) return false;

      if (!s) return true;
      const atc = row.atc_code_id ? atcCodeById.get(row.atc_code_id) ?? "" : "";
      return (
        row.sku_code.toLowerCase().includes(s) ||
        row.name.toLowerCase().includes(s) ||
        row.dosage_strength.toLowerCase().includes(s) ||
        atc.toLowerCase().includes(s)
      );
    });
  }, [atcCodeById, atcFilter, dosageFormFilter, productFilter, search, showProductFilter, skus, statusFilter]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKUs..." aria-label="Search SKUs" />
        </div>

        <div className="flex flex-wrap gap-2">
          {showProductFilter ? (
            <select
              className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              aria-label="Filter by product"
            >
              <option value="all">All products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
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

          <select
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
            value={dosageFormFilter}
            onChange={(e) => setDosageFormFilter(e.target.value)}
            aria-label="Filter by dosage form"
          >
            <option value="all">All forms</option>
            {dosageForms.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
            value={atcFilter}
            onChange={(e) => setAtcFilter(e.target.value)}
            aria-label="Filter by ATC code"
          >
            <option value="all">All ATC</option>
            {(atcQ.data ?? [])
              .filter((a) => a.is_active !== false)
              .slice()
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code}
                </option>
              ))}
          </select>

          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatusFilter("active");
              setDosageFormFilter("all");
              setAtcFilter("all");
              setProductFilter(initialProductFilter ?? "all");
              setVisibleCount(pageSize);
            }}
          >
            Clear
          </Button>

          {canCreate ? (
            effectiveProductId ? (
              <Link href={`/rmm/products/${effectiveProductId}/skus/new`}>
                <Button>New SKU</Button>
              </Link>
            ) : (
              <Button disabled title="Create SKU from a product context">
                New SKU
              </Button>
            )
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {skusQ.isLoading || productsQ.isLoading || atcQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : skusQ.isError ? (
          <div className="text-sm text-zinc-600">
            Unable to load SKUs.{" "}
            <button type="button" className="text-blue-700 hover:underline" onClick={() => void skusQ.refetch()}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-zinc-600">{skus.length === 0 ? "No SKUs found." : "No SKUs match your filters."}</div>
        ) : (
          <>
            <div className="mb-2 text-sm text-zinc-600">
              Showing 1-{shown.length} of {filtered.length} SKUs
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold text-zinc-700">
                    <th className="border-b border-zinc-200 px-3 py-2">SKU Code</th>
                    <th className="border-b border-zinc-200 px-3 py-2">SKU Name</th>
                    {showProductColumn ? <th className="border-b border-zinc-200 px-3 py-2">Product</th> : null}
                    <th className="border-b border-zinc-200 px-3 py-2">Dosage</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Form</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Pack Size</th>
                    <th className="border-b border-zinc-200 px-3 py-2">ATC Code</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                    <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => {
                    const atc = row.atc_code_id ? atcCodeById.get(row.atc_code_id) ?? "—" : "—";
                    const productName = productNameById.get(row.product_id) ?? "—";
                    return (
                      <tr key={row.id} className="hover:bg-zinc-50">
                        <td className="border-b border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">{row.sku_code}</td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm">
                          <Link className="font-medium text-blue-700 hover:underline" href={`/rmm/skus/${row.id}`}>
                            {row.name}
                          </Link>
                        </td>
                        {showProductColumn ? (
                          <td className="border-b border-zinc-100 px-3 py-2">
                            <Link className="text-sm text-blue-700 hover:underline" href={`/rmm/products/${row.product_id}`}>
                              {productName}
                            </Link>
                          </td>
                        ) : null}
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{row.dosage_strength}</td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{row.dosage_form}</td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">
                          {row.pack_size} {row.unit_of_measure}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">{atc}</td>
                        <td className="border-b border-zinc-100 px-3 py-2">
                          <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2">
                          <div className="flex gap-2">
                            <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/skus/${row.id}`}>
                              View
                            </Link>
                            {canEdit ? (
                              <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/skus/${row.id}/edit`}>
                                Edit
                              </Link>
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
              {shown.map((row) => {
                const atc = row.atc_code_id ? atcCodeById.get(row.atc_code_id) ?? "—" : "—";
                return (
                  <div key={row.id} className="rounded-md border border-zinc-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{row.sku_code}</div>
                        <Link className="mt-1 block text-sm font-medium text-blue-700 hover:underline" href={`/rmm/skus/${row.id}`}>
                          {row.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{row.dosage_strength}</Badge>
                          <Badge variant="secondary">{row.dosage_form}</Badge>
                          <Badge variant="secondary">
                            {row.pack_size} {row.unit_of_measure}
                          </Badge>
                          <Badge variant="secondary">{atc}</Badge>
                          <Badge variant={row.is_active ? "success" : "secondary"}>{row.is_active ? "Active" : "Inactive"}</Badge>
                        </div>
                      </div>
                      <Link className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50" href={`/rmm/skus/${row.id}`}>
                        View
                      </Link>
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

