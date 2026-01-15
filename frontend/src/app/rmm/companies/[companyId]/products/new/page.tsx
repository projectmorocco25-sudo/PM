"use client";

// Wireframe binding: /rmm/companies/[id]/products/new -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ProductForm } from "@/components/rmm/ProductForm";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useCompany } from "@/hooks/useCompany";
import { useCreateProduct } from "@/hooks/useProductMutations";
import { useUserRole } from "@/hooks/useUserRole";

export default function CompanyScopedNewProduct({ params }: { params: { companyId: string } }) {
  const companyId = params.companyId;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canCreate = role !== "auditor";
  const showCritical = role === "tier1" || role === "system_admin";

  const companiesQ = useCompanies();
  const atcQ = useAtcCodes();
  const companyQ = useCompany(companyId);
  const create = useCreateProduct();

  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);
  const companyName = (companyQ.data as { name?: string } | null)?.name ?? "Company";

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Companies &gt; {companyName} &gt; Products &gt; New Product</span>} title={`Create Product - ${companyName}`}>
        {!canCreate ? (
          <div className="text-sm text-zinc-600">You do not have permission to create products.</div>
        ) : companiesQ.isLoading || atcQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <ProductForm
            mode="create"
            title="Create Product"
            companies={companies}
            atcCodes={atcQ.data ?? []}
            enforceCompanyId={companyId}
            showCriticalMedicine={showCritical}
            defaultValues={{ company_id: companyId, is_active: true, is_critical_medicine: false }}
            onSubmit={(input) => create.mutateAsync({ ...input, company_id: companyId })}
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

