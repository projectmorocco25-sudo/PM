"use client";

// Wireframe binding: /rmm/companies/[companyId]/products/[productId] -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md

import { redirect } from "next/navigation";

export default function CompanyScopedProductDetail({
  params,
}: {
  params: { id: string; productId: string };
}) {
  // Alias route: keep the canonical detail at /rmm/products/[id]
  redirect(`/rmm/products/${params.productId}`);
}
