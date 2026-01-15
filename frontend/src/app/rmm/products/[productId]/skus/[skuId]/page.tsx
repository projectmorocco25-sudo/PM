"use client";

// Wireframe binding: /rmm/products/[id]/skus/[sku_id] -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md

import { redirect } from "next/navigation";

export default function ProductScopedSkuDetail({
  params,
}: {
  params: { productId: string; skuId: string };
}) {
  // Alias route: keep the canonical detail at /rmm/skus/[id]
  redirect(`/rmm/skus/${params.skuId}`);
}

