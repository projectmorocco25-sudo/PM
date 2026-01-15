"use client";

// Wireframe binding: /rmm/companies/[id]/products -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ProductsList } from "@/components/rmm/ProductsList";
import { useCompany } from "@/hooks/useCompany";

export default function CompanyProductsPage({ params }: { params: { id: string } }) {
  const companyId = params.id;
  const companyQ = useCompany(companyId);
  const companyName = (companyQ.data as { name?: string } | null)?.name ?? "Company";

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Companies &gt; {companyName} &gt; Products</span>} title={`Products - ${companyName}`}>
        <ProductsList companyId={companyId} initialCompanyFilter={companyId} />
      </MainContent>
    </DashboardLayout>
  );
}

