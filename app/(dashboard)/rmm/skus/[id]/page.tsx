/**
 * Wireframe: task-0.5.2.7-sku-detail.md
 * Route: /rmm/skus/[id]
 * Implements: SKU detail — SKU Information, Pharmaceutical Attributes, tabs Overview | History.
 * Task: 1.1.2.24
 * API: rmm_get_sku_for_detail, rmm_get_sku_history (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md
 */

import { createClient } from "@/lib/supabase/server";
import { SkuDetailContent } from "./SkuDetailContent";
import { SkuDetailError } from "./SkuDetailError";

export default async function SkuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: skuResult } = await supabase.rpc("rmm_get_sku_for_detail", {
    p_id: id,
  });

  const skuData = skuResult as { sku?: Record<string, unknown>; error?: string } | null;
  if (!skuData?.sku || skuData.error) {
    return (
      <SkuDetailError
        message="Unable to load SKU"
        subMessage={skuData?.error === "not_found" ? "SKU not found." : "You may not have access to this SKU."}
      />
    );
  }

  const sku = skuData.sku as Record<string, unknown>;
  const { data: historyResult } = await supabase.rpc("rmm_get_sku_history", {
    p_sku_id: id,
    p_start_date: null,
    p_end_date: null,
    p_limit: 50,
    p_offset: 0,
  });

  const historyPayload = historyResult as { data?: Array<{ id: string; type: string; title: string; description?: string; created_at: string; link?: string }>; error?: string } | null;
  const historyRows = (historyPayload?.data ?? []) as Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    created_at: string;
    link?: string;
  }>;
  const history = historyRows.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? "",
    created_at: item.created_at,
    link: item.link,
  }));

  return (
    <SkuDetailContent
      sku={{
        id: String(sku.id),
        product_id: String(sku.product_id),
        company_id: String(sku.company_id ?? ""),
        product_name: String(sku.product_name ?? ""),
        company_name: String(sku.company_name ?? ""),
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
      }}
      history={history}
      skuId={id}
    />
  );
}
