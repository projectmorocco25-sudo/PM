"use client";

// Wireframe binding: /rmm/skus -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SkusList } from "@/components/rmm/SkusList";
import { useProduct } from "@/hooks/useProduct";

export default function SkusPage({ searchParams }: { searchParams?: { product?: string } }) {
  const productId = searchParams?.product ?? null;
  const productQ = useProduct(productId);
  const productName = (productQ.data as { name?: string } | null)?.name ?? null;

  const title = productName ? `SKUs - ${productName}` : "SKUs";
  const crumbs = productName ? (
    <span>
      Home &gt; RMM &gt; Products &gt; {productName} &gt; SKUs
    </span>
  ) : (
    <span>Home &gt; RMM &gt; SKUs</span>
  );

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={crumbs} title={title}>
        <SkusList productId={productId} initialProductFilter={productId} />
      </MainContent>
    </DashboardLayout>
  );
}

