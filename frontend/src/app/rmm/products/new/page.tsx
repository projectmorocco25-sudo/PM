"use client";

// Wireframe binding: /rmm/products/new -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ProductForm } from "@/components/rmm/ProductForm";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useCreateProduct } from "@/hooks/useProductMutations";
import { useUserRole } from "@/hooks/useUserRole";

export default function NewProductPage() {
  const { data: roleInfo } = useUserRole();
  const companyId = roleInfo?.companyId ?? null;
  const isCompanyUser = Boolean(roleInfo?.isCompanyUser);
  const role = roleInfo?.role ?? "unknown";

  const companiesQ = useCompanies();
  const atcQ = useAtcCodes();
  const create = useCreateProduct();

  const canCreate = role !== "auditor";
  const showCritical = role === "tier1" || role === "system_admin";

  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Products &gt; New Product</span>} title="Create Product">
        {!canCreate ? (
          <div className="text-sm text-zinc-600">You do not have permission to create products.</div>
        ) : companiesQ.isLoading || atcQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : companiesQ.isError || atcQ.isError ? (
          <div className="text-sm text-zinc-600">Unable to load form dependencies.</div>
        ) : (
          <ProductForm
            mode="create"
            title="Create Product"
            companies={companies}
            atcCodes={atcQ.data ?? []}
            enforceCompanyId={isCompanyUser ? companyId : null}
            showCriticalMedicine={showCritical}
            defaultValues={{
              company_id: isCompanyUser ? companyId ?? "" : "",
              is_active: true,
              is_critical_medicine: false,
            }}
            onSubmit={(input) => create.mutateAsync(input)}
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

