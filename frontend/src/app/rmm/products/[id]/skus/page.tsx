"use client";

// Wireframe binding: /rmm/products/[id]/skus -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SkusList } from "@/components/rmm/SkusList";
import { useProduct } from "@/hooks/useProduct";

export default function ProductSkusPage({ params }: { params: { id: string } }) {
  const productId = params.id;
  const productQ = useProduct(productId);
  const productName = (productQ.data as { name?: string } | null)?.name ?? "Product";

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Products &gt; {productName} &gt; SKUs</span>} title={`SKUs - ${productName}`}>
        <SkusList productId={productId} initialProductFilter={productId} />
      </MainContent>
    </DashboardLayout>
  );
}

