"use client";

// Wireframe binding: /rmm/products/[id]/skus/[sku_id]/edit -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md

import { redirect } from "next/navigation";

export default function ProductScopedEditSku({
  params,
}: {
  params: { productId: string; skuId: string };
}) {
  redirect(`/rmm/skus/${params.skuId}/edit`);
}

