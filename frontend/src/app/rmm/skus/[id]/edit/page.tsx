"use client";

// Wireframe binding: /rmm/skus/[id]/edit -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { SkuForm } from "@/components/rmm/SkuForm";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useProduct } from "@/hooks/useProduct";
import { useSku } from "@/hooks/useSku";
import { useUpdateSku } from "@/hooks/useSkuMutations";
import { useUserRole } from "@/hooks/useUserRole";

type SkuRow = {
  id: string;
  product_id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  atc_code_id: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function EditSkuPage({ params }: { params: { id: string } }) {
  const skuId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canEdit = role !== "auditor";
  const showMohFlag = role === "tier1" || role === "system_admin";

  const skuQ = useSku(skuId);
  const sku = (skuQ.data ?? null) as SkuRow | null;

  const productQ = useProduct(sku?.product_id ?? null);
  const atcQ = useAtcCodes();
  const update = useUpdateSku(skuId);

  const productName = (productQ.data as { name?: string } | null)?.name ?? "Product";

  const products = useMemo(() => {
    if (!sku) return [];
    return [{ id: sku.product_id, name: productName }];
  }, [productName, sku]);

  const inheritedAtc = useMemo(() => {
    // Best-effort "inherited": show the currently selected SKU ATC (since product-level ATC isn't persisted in DB).
    if (!sku) return null;
    if (!sku.atc_code_id) return null;
    return (atcQ.data ?? []).find((a) => a.id === sku.atc_code_id)?.code ?? null;
  }, [atcQ.data, sku]);

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; SKUs &gt; Edit SKU</span>} title="Edit SKU">
        {!canEdit ? (
          <div className="text-sm text-zinc-600">You do not have permission to edit SKUs.</div>
        ) : skuQ.isLoading || atcQ.isLoading || productQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : skuQ.isError || !sku ? (
          <div className="text-sm text-zinc-600">Unable to load SKU information.</div>
        ) : (
          <SkuForm
            mode="edit"
            skuId={skuId}
            title="Edit SKU"
            products={products}
            atcCodes={atcQ.data ?? []}
            enforceProductId={sku.product_id}
            inheritedAtcLabel={inheritedAtc}
            showMohAuthorizedFlag={showMohFlag}
            metadata={{ createdAt: sku.created_at, updatedAt: sku.updated_at }}
            defaultValues={{
              product_id: sku.product_id,
              sku_code: sku.sku_code,
              name: sku.name,
              dosage_strength: sku.dosage_strength,
              dosage_form: sku.dosage_form,
              pack_size: sku.pack_size,
              unit_of_measure: sku.unit_of_measure,
              atc_code_id: sku.atc_code_id ?? "",
              is_moh_authorized_unregistered: Boolean(sku.is_moh_authorized_unregistered),
              is_active: Boolean(sku.is_active),
            }}
            onSubmit={(input) =>
              update.mutateAsync({
                sku_code: input.sku_code,
                name: input.name,
                dosage_strength: input.dosage_strength,
                dosage_form: input.dosage_form,
                pack_size: input.pack_size,
                unit_of_measure: input.unit_of_measure,
                atc_code_id: input.atc_code_id ?? null,
                is_moh_authorized_unregistered: showMohFlag ? input.is_moh_authorized_unregistered : null,
                is_active: input.is_active,
              })
            }
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

