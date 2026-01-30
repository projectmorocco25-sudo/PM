/**
 * Wireframe: task-0.5.2.10-sku-create-edit-form.md
 * Route: /rmm/skus/[id]/edit
 * Implements: SKU edit form — Product (read-only), SKU Code, Name, Pharmaceutical Attributes, ATC (read-only), MOH Authorized, Status, draft auto-save, validation.
 * Task: 1.1.2.25
 * API: rmm_get_sku_for_detail, rmm_list_products (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SkuFormContent } from "../../SkuFormContent";
import type { SkuFormInitial } from "../../SkuFormContent";

export default async function SkuEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [skuRes, productsRes] = await Promise.all([
    supabase.rpc("rmm_get_sku_for_detail", { p_id: id }),
    supabase.rpc("rmm_list_products", {
      p_limit: 500,
      p_offset: 0,
      p_company_id: null,
    }),
  ]);

  const skuData = skuRes.data as { sku?: Record<string, unknown>; error?: string } | null;
  if (skuRes.error || !skuData?.sku || skuData.error) {
    return (
      <div className="space-y-4 rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6">
        <h1 className="text-lg font-semibold text-[#991b1b]">Unable to load SKU</h1>
        <p className="text-sm text-[#b91c1c]">
          {skuData?.error === "not_found" ? "SKU not found." : "You may not have access to this SKU."}
        </p>
        <Link href="/rmm/skus" className="text-sm text-[#2563eb] hover:underline">
          ← Back to SKUs
        </Link>
      </div>
    );
  }

  const sku = skuData.sku as Record<string, unknown>;
  const initial: SkuFormInitial = {
    id: String(sku.id),
    product_id: String(sku.product_id),
    product_name: String(sku.product_name ?? ""),
    sku_code: String(sku.sku_code ?? ""),
    name: String(sku.name ?? ""),
    dosage_strength: sku.dosage_strength != null ? String(sku.dosage_strength) : null,
    dosage_form: sku.dosage_form != null ? String(sku.dosage_form) : null,
    pack_size: sku.pack_size != null ? String(sku.pack_size) : null,
    unit_of_measure: sku.unit_of_measure != null ? String(sku.unit_of_measure) : null,
    atc_code: sku.atc_code != null ? String(sku.atc_code) : null,
    is_moh_authorized_unregistered: Boolean(sku.is_moh_authorized_unregistered),
    is_active: Boolean(sku.is_active),
    created_at: sku.created_at != null ? String(sku.created_at) : undefined,
    updated_at: sku.updated_at != null ? String(sku.updated_at) : undefined,
  };

  const productsPayload = productsRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const products = (productsPayload?.data ?? []).map((p) => ({
    id: String(p.id),
    name: String(p.name),
  }));

  return (
    <div className="space-y-4">
      <SkuFormContent mode="edit" skuId={id} initial={initial} products={products} />
    </div>
  );
}
