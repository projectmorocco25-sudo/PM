/**
 * Wireframe: task-0.5.2.5-product-detail.md
 * Route: /rmm/products/[id]
 * Implements: Product detail — Product Information card, tabs Overview | SKUs | History.
 * Task: 1.1.2.21
 * API: rmm_get_product_for_detail, rmm_list_product_skus, rmm_get_product_history (hosted Supabase only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md
 */

import { createClient } from "@/lib/supabase/server";
import { ProductDetailContent } from "./ProductDetailContent";
import { ProductDetailError } from "./ProductDetailError";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: productResult } = await supabase.rpc("rmm_get_product_for_detail", {
    p_id: id,
  });

  const productData = productResult as { product?: Record<string, unknown>; error?: string } | null;
  if (!productData?.product || productData.error) {
    return (
      <ProductDetailError
        message="Unable to load product"
        subMessage={productData?.error === "not_found" ? "Product not found." : "You may not have access to this product."}
      />
    );
  }

  const product = productData.product as Record<string, unknown>;
  const [skusResult, historyResult] = await Promise.all([
    supabase.rpc("rmm_list_product_skus", {
      p_product_id: id,
      p_limit: 20,
      p_offset: 0,
    }),
    supabase.rpc("rmm_get_product_history", {
      p_product_id: id,
      p_start_date: null,
      p_end_date: null,
      p_limit: 20,
      p_offset: 0,
    }),
  ]);

  const skusPayload = skusResult.data as { data?: unknown[]; total?: number } | null;
  const skuRows = (skusPayload?.data ?? []) as Array<{
    id: string;
    sku_code: string;
    name: string;
    dosage_strength: string | null;
    dosage_form: string | null;
    pack_size: string | null;
    unit_of_measure: string | null;
    is_active: boolean;
  }>;
  const skusTotal = typeof skusPayload?.total === "number" ? skusPayload.total : 0;

  const historyPayload = historyResult.data as {
    data?: Array<{ id: string; type: string; title: string; description: string; created_at: string; link?: string }>;
  } | null;
  const history = (historyPayload?.data ?? []).map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? "",
    created_at: item.created_at,
    link: item.link,
  }));

  const stats = {
    skus_total: typeof product.skus_total === "number" ? product.skus_total : 0,
    skus_active: typeof product.skus_active === "number" ? product.skus_active : 0,
  };

  return (
    <ProductDetailContent
      product={{
        id: String(product.id),
        company_id: String(product.company_id),
        name: String(product.name),
        description: product.description != null ? String(product.description) : null,
        is_critical_medicine: Boolean(product.is_critical_medicine),
        is_active: Boolean(product.is_active),
        company_name: String(product.company_name ?? ""),
        atc_code: product.atc_code != null ? String(product.atc_code) : null,
        created_at: product.created_at != null ? String(product.created_at) : undefined,
        updated_at: product.updated_at != null ? String(product.updated_at) : undefined,
      }}
      stats={stats}
      skus={skuRows.map((s) => ({
        id: String(s.id),
        sku_code: String(s.sku_code),
        name: String(s.name),
        dosage_strength: s.dosage_strength != null ? String(s.dosage_strength) : null,
        dosage_form: s.dosage_form != null ? String(s.dosage_form) : null,
        pack_size: s.pack_size != null ? String(s.pack_size) : null,
        unit_of_measure: s.unit_of_measure != null ? String(s.unit_of_measure) : null,
        is_active: Boolean(s.is_active),
      }))}
      skusTotal={skusTotal}
      history={history}
      productId={id}
    />
  );
}
