"use client";

// Wireframe binding: /rmm/products -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md

import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { ProductsList } from "@/components/rmm/ProductsList";
import { useUserRole } from "@/hooks/useUserRole";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { data: roleInfo } = useUserRole();
  const companyParam = searchParams.get("company") ?? null;

  const enforcedCompanyId = roleInfo?.isCompanyUser ? roleInfo.companyId : null;
  const initialCompanyFilter = companyParam && !enforcedCompanyId ? companyParam : null;

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Products</span>} title="Products">
        <ProductsList companyId={enforcedCompanyId} initialCompanyFilter={initialCompanyFilter} />
      </MainContent>
    </DashboardLayout>
  );
}

