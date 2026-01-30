"use client";

/**
 * Designate new critical medicine — select SKU from list, submit. MOH Tier 1 only. Task 1.1.2.30.
 * API: rmm_create_critical_medicine (hosted Supabase only). RLS applies.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SkuRow = {
  id: string;
  sku_code: string;
  name: string;
  product_name: string;
};

type DesignateCriticalMedicineContentProps = {
  skus: SkuRow[];
  total: number;
  search: string;
  offset: number;
  pageSize: number;
  error: string | null;
};

export function DesignateCriticalMedicineContent({
  skus,
  total,
  search,
  offset,
  pageSize,
  error,
}: DesignateCriticalMedicineContentProps) {
  const router = useRouter();
  const [designatingId, setDesignatingId] = useState<string | null>(null);

  async function handleDesignate(skuId: string) {
    setDesignatingId(skuId);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_create_critical_medicine", {
        p_sku_id: skuId,
      });
      const payload = data as { error?: string; message?: string } | null;
      if (rpcError || (payload && "error" in payload)) {
        alert(payload?.message ?? rpcError?.message ?? "Failed to designate");
      } else {
        router.push("/rmm/critical-medicines");
        router.refresh();
      }
    } catch {
      alert("Failed to designate");
    } finally {
      setDesignatingId(null);
    }
  }

  function buildQueryString(updates: { search?: string; offset?: string }) {
    const next = new URLSearchParams();
    if (updates.search !== undefined && updates.search) next.set("search", updates.search);
    else if (search) next.set("search", search);
    if (updates.offset !== undefined && updates.offset !== "0") next.set("offset", updates.offset);
    else if (offset > 0) next.set("offset", String(offset));
    return next.toString();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement | null)?.value?.trim() ?? "";
    const qs = buildQueryString({ search: q, offset: "0" });
    router.push(`/rmm/critical-medicines/designate${qs ? `?${qs}` : ""}`);
  }

  const hasMore = offset + skus.length < total;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">{error}</p>
          <Link
            href="/rmm/critical-medicines"
            className="mt-4 inline-block rounded-md border border-[#dc2626] bg-white px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Back to Critical Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#111827] md:text-[24px]">
        Designate Critical Medicine
      </h1>
      <p className="text-sm text-[#6b7280]">
        Select an active SKU to designate as a critical medicine. Designation affects threshold multipliers and compliance monitoring (DMP Art.15).
      </p>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="designate-search" className="sr-only">Search SKUs</label>
        <input
          id="designate-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search SKU code or name..."
          className="block w-full max-w-md rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />
        <button
          type="submit"
          className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
        >
          Search
        </button>
      </form>

      {skus.length === 0 ? (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="font-medium text-[#111827]">No SKUs found</p>
          <p className="mt-1 text-sm text-[#6b7280]">Try a different search or ensure you have active SKUs.</p>
          <Link
            href="/rmm/critical-medicines"
            className="mt-4 inline-block rounded-md border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
          >
            Back to Critical Medicines
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#6b7280]" aria-live="polite">
            {total} SKU{total !== 1 ? "s" : ""} found. Select one to designate.
          </p>
          <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
            <table className="min-w-full divide-y divide-[#e5e7eb] text-sm" role="grid" aria-label="SKUs to designate">
              <thead>
                <tr>
                  <th scope="col" className="py-3 pl-4 pr-3 text-left font-medium text-[#6b7280]">SKU Code</th>
                  <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">SKU Name</th>
                  <th scope="col" className="py-3 px-3 text-left font-medium text-[#6b7280]">Product</th>
                  <th scope="col" className="py-3 pl-3 pr-4 text-right font-medium text-[#6b7280]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {skus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-[#f9fafb]">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 font-mono font-medium text-[#111827]">
                      {sku.sku_code}
                    </td>
                    <td className="py-3 px-3 text-[#111827]">{sku.name}</td>
                    <td className="py-3 px-3 text-[#111827]">{sku.product_name}</td>
                    <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDesignate(sku.id)}
                        disabled={designatingId === sku.id}
                        className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
                      >
                        {designatingId === sku.id ? "Designating…" : "Designate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Link
                href={`/rmm/critical-medicines/designate?${buildQueryString({ offset: String(offset + pageSize) })}`}
                className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Load More
              </Link>
            </div>
          )}
          <p className="text-sm text-[#6b7280]">
            <Link href="/rmm/critical-medicines" className="text-[#2563eb] hover:underline">
              ← Back to Critical Medicines
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
