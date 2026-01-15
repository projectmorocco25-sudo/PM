"use client";

import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { CompanyForm } from "@/components/rmm/CompanyForm";
import { useCompany } from "@/hooks/useCompany";
import { useUpdateCompany } from "@/hooks/useCompanyMutations";
import { useModuleActive } from "@/hooks/useModuleActive";
import { useUserRole } from "@/hooks/useUserRole";

type CompanyRow = {
  id: string;
  name: string;
  registration_number: string;
  company_type: "ipc" | "wholesaler";
  is_active: boolean;
  address: string | null;
  tax_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export default function EditCompanyPage({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? null;
  const canEdit = role === "tier1" || role === "tier2_registrar" || role === "system_admin";

  const { data: rmmActive } = useModuleActive("rmm");
  const companyQ = useCompany(companyId);
  const update = useUpdateCompany(companyId);

  const defaults = useMemo(() => {
    const c = companyQ.data as CompanyRow | undefined;
    if (!c) return undefined;
    return {
      name: c.name ?? "",
      registration_number: c.registration_number ?? "",
      company_type: c.company_type,
      is_active: Boolean(c.is_active),
      address: c.address ?? "",
      tax_id: c.tax_id ?? "",
      contact_email: c.contact_email ?? "",
      contact_phone: c.contact_phone ?? "",
    };
  }, [companyQ.data]);

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; RMM &gt; Companies &gt; Edit Company</span>} title="Edit Company">
        {!canEdit ? (
          <div className="text-sm text-zinc-600">You do not have permission to edit companies.</div>
        ) : rmmActive === false && role !== "tier1" && role !== "system_admin" ? (
          <div className="text-sm text-zinc-600">RMM module is not active.</div>
        ) : companyQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : companyQ.isError ? (
          <div className="text-sm text-zinc-600">Unable to load company information.</div>
        ) : !defaults ? (
          <div className="text-sm text-zinc-600">Company not found.</div>
        ) : (
          <CompanyForm
            mode="edit"
            companyId={companyId}
            title="Edit Company"
            disableCompanyType
            allowStatusEdit={role === "tier1" || role === "system_admin"}
            defaultValues={defaults}
            metadata={{
              createdAt: (companyQ.data as CompanyRow | undefined)?.created_at,
              updatedAt: (companyQ.data as CompanyRow | undefined)?.updated_at,
            }}
            onSubmit={(input) =>
              update.mutateAsync({
                name: input.name,
                registration_number: input.registration_number,
                address: input.address,
                tax_id: input.tax_id,
                contact_email: input.contact_email,
                contact_phone: input.contact_phone,
                is_active: role === "tier1" || role === "system_admin" ? input.is_active : null,
              })
            }
          />
        )}
      </MainContent>
    </DashboardLayout>
  );
}

