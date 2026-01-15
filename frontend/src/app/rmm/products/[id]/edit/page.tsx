"use client";

// Wireframe binding: /rmm/products/[id]/edit -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ProductForm } from "@/components/rmm/ProductForm";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useProduct } from "@/hooks/useProduct";
import { useUpdateProduct } from "@/hooks/useProductMutations";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";

type ProductRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_critical_medicine: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type SkuRow = { id: string; atc_code_id: string | null };

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canEdit = role !== "auditor";
  const showCritical = role === "tier1" || role === "system_admin";

  const productQ = useProduct(productId);
  const companiesQ = useCompanies();
  const atcQ = useAtcCodes();
  const skusQ = useSkus({ productId });
  const update = useUpdateProduct(productId);

  const product = (productQ.data ?? null) as ProductRow | null;

  // ATC code is stored on SKUs; pick first SKU's ATC if present for initial selection.
  const initialAtcCodeId = useMemo(() => {
    const skus = (skusQ.data ?? []) as SkuRow[];
    return skus.find((s) => s.atc_code_id)?.atc_code_id ?? "";
  }, [skusQ.data]);

  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Products &gt; Edit Product</span>} title="Edit Product">
        {!canEdit ? (
          <div className="text-sm text-zinc-600">You do not have permission to edit products.</div>
        ) : productQ.isLoading || companiesQ.isLoading || atcQ.isLoading || skusQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : productQ.isError || !product ? (
          <div className="text-sm text-zinc-600">Unable to load product information.</div>
        ) : (
          <ProductForm
            mode="edit"
            productId={productId}
            title="Edit Product"
            companies={companies}
            atcCodes={atcQ.data ?? []}
            enforceCompanyId={product.company_id}
            showCriticalMedicine={showCritical}
            metadata={{ createdAt: product.created_at, updatedAt: product.updated_at }}
            defaultValues={{
              company_id: product.company_id,
              name: product.name,
              description: product.description ?? "",
              is_active: Boolean(product.is_active),
              is_critical_medicine: Boolean(product.is_critical_medicine),
              atc_code_id: initialAtcCodeId,
            }}
            onSubmit={(input) =>
              update.mutateAsync({
                name: input.name,
                description: input.description,
                is_active: input.is_active,
                is_critical_medicine: showCritical ? input.is_critical_medicine : null,
              })
            }
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

