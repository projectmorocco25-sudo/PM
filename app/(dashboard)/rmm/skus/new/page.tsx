/**
 * Wireframe: task-0.5.2.10-sku-create-edit-form.md
 * Route: /rmm/skus/new
 * Implements: SKU create form — Product, SKU Code, Name, Pharmaceutical Attributes, ATC (read-only), MOH Authorized, Status, draft auto-save, validation.
 * Task: 1.1.2.25
 * API: rmm_list_products (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md
 */

import { createClient } from "@/lib/supabase/server";
import { SkuFormContent } from "../SkuFormContent";

export default async function SkuNewPage() {
  const supabase = await createClient();
  const { data: productsRes } = await supabase.rpc("rmm_list_products", {
    p_limit: 500,
    p_offset: 0,
    p_company_id: null,
  });

  const productsPayload = productsRes as { data?: Array<{ id: string; name: string }> } | null;
  const products = (productsPayload?.data ?? []).map((p) => ({
    id: String(p.id),
    name: String(p.name),
  }));

  return (
    <div className="space-y-4">
      <SkuFormContent mode="create" products={products} />
    </div>
  );
}
