"use client";

// Wireframe binding: /rmm/products/[id]/skus/new -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SkuForm } from "@/components/rmm/SkuForm";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCreateSku } from "@/hooks/useSkuMutations";
import { useProduct } from "@/hooks/useProduct";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";

export default function NewSkuForProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canCreate = role !== "auditor";
  const showMohFlag = role === "tier1" || role === "system_admin";

  const productQ = useProduct(productId);
  const skusQ = useSkus({ productId });
  const atcQ = useAtcCodes();
  const create = useCreateSku();

  const productName = (productQ.data as { name?: string } | null)?.name ?? "Product";

  const inheritedAtc = useMemo(() => {
    const skus = (skusQ.data ?? []) as Array<{ atc_code_id?: string | null }>;
    const first = skus.find((s) => s.atc_code_id)?.atc_code_id ?? null;
    if (!first) return null;
    return (atcQ.data ?? []).find((a) => a.id === first)?.code ?? null;
  }, [atcQ.data, skusQ.data]);

  const products = useMemo(() => [{ id: productId, name: productName }], [productId, productName]);

  return (
    <DashboardLayout>
      <MainContent
        breadcrumbs={<span>Home &gt; RMM &gt; Products &gt; {productName} &gt; SKUs &gt; New SKU</span>}
        title="Create SKU"
      >
        {!canCreate ? (
          <div className="text-sm text-zinc-600">You do not have permission to create SKUs.</div>
        ) : productQ.isLoading || atcQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : productQ.isError || !productQ.data ? (
          <div className="text-sm text-zinc-600">Unable to load product information.</div>
        ) : (
          <SkuForm
            mode="create"
            title="Create SKU"
            products={products}
            atcCodes={atcQ.data ?? []}
            enforceProductId={productId}
            inheritedAtcLabel={inheritedAtc}
            showMohAuthorizedFlag={showMohFlag}
            defaultValues={{ product_id: productId, is_active: true, is_moh_authorized_unregistered: false }}
            onSubmit={(input) => create.mutateAsync({ ...input, product_id: productId })}
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

