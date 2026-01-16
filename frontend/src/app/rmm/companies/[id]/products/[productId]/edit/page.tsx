"use client";

// Wireframe binding: /rmm/companies/[id]/products/[product_id]/edit -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md

import { redirect } from "next/navigation";

export default function CompanyScopedEditProduct({
  params,
}: {
  params: { id: string; productId: string };
}) {
  redirect(`/rmm/products/${params.productId}/edit`);
}
