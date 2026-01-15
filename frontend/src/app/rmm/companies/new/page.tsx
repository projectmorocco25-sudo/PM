"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { CompanyForm } from "@/components/rmm/CompanyForm";
import { useCreateCompany } from "@/hooks/useCompanyMutations";
import { useModuleActive } from "@/hooks/useModuleActive";
import { useUserRole } from "@/hooks/useUserRole";

export default function NewCompanyPage() {
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? null;
  const canCreate = role === "tier1" || role === "tier2_registrar" || role === "system_admin";

  const { data: rmmActive } = useModuleActive("rmm");
  const create = useCreateCompany();

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Companies &gt; New Company</span>} title="Create Company">
        {!canCreate ? (
          <div className="text-sm text-zinc-600">You do not have permission to create companies.</div>
        ) : rmmActive === false && role !== "tier1" && role !== "system_admin" ? (
          <div className="text-sm text-zinc-600">RMM module is not active.</div>
        ) : (
          <CompanyForm
            mode="create"
            title="Create Company"
            allowStatusEdit={role === "tier1" || role === "system_admin"}
            defaultValues={{ company_type: "", is_active: true }}
            onSubmit={(input) => create.mutateAsync(input)}
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

