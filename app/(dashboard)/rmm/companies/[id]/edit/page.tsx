/**
 * Wireframe: task-0.5.2.8-company-create-edit-form.md
 * Route: /rmm/companies/[id]/edit
 * Implements: Company edit form — Company Information, Contact Information, Metadata, draft auto-save, validation.
 * Task: 1.1.2.19
 * API: rmm_get_company_for_detail, rmm_update_company (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md
 */

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CompanyFormContent, type CompanyFormInitial } from "../../CompanyFormContent";

export default async function CompanyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("rmm_get_company_for_detail", { p_id: id });
  const raw = data as { company?: Record<string, unknown>; error?: string } | null;

  if (!raw?.company || raw.error) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/rmm/companies" className="text-[#2563eb] hover:underline">Companies</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <span className="text-[#111827] font-medium">Edit Company</span>
        </nav>
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">Unable to load company</p>
          <p className="mt-1 text-sm text-[#991b1b]">
            {raw?.error === "not_found" ? "Company not found." : "You may not have access to this company."}
          </p>
          <Link href="/rmm/companies" className="mt-4 inline-block text-sm text-[#2563eb] hover:underline">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const c = raw.company as Record<string, unknown>;
  const initial: CompanyFormInitial = {
    id: String(c.id),
    name: String(c.name),
    registration_number: String(c.registration_number),
    company_type: String(c.company_type),
    is_active: Boolean(c.is_active),
    address: c.address != null ? String(c.address) : null,
    contact_email: c.contact_email != null ? String(c.contact_email) : null,
    contact_phone: c.contact_phone != null ? String(c.contact_phone) : null,
    created_at: c.created_at != null ? String(c.created_at) : undefined,
    updated_at: c.updated_at != null ? String(c.updated_at) : undefined,
  };

  return <CompanyFormContent mode="edit" companyId={id} initial={initial} />;
}
