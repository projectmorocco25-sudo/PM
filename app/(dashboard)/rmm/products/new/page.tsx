/**
 * Wireframe: task-0.5.2.9-product-create-edit-form.md
 * Route: /rmm/products/new
 * Implements: Product create form — Company, Name, ATC Code, Description, Status, Critical Medicine, draft auto-save, validation.
 * Task: 1.1.2.22
 * API: rmm_list_companies, rmm_list_atc_codes (hosted Supabase only). RLS applies.
 * Wireframe Link: ../../../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md
 */

import { createClient } from "@/lib/supabase/server";
import { ProductFormContent } from "../ProductFormContent";

export default async function ProductNewPage() {
  const supabase = await createClient();
  const [companiesRes, atcRes] = await Promise.all([
    supabase.rpc("rmm_list_companies", {
      p_limit: 200,
      p_offset: 0,
      p_search: null,
      p_company_type: null,
      p_status: "all",
    }),
    supabase.rpc("rmm_list_atc_codes", {
      p_limit: 500,
      p_offset: 0,
      p_code_filter: null,
    }),
  ]);

  const companiesPayload = companiesRes.data as { data?: Array<{ id: string; name: string }> } | null;
  const companies = (companiesPayload?.data ?? []).map((c) => ({
    id: String(c.id),
    name: String(c.name),
  }));

  const atcPayload = atcRes.data as {
    data?: Array<{ id: string; code: string; description?: string | null }>;
  } | null;
  const atcCodes = (atcPayload?.data ?? []).map((a) => ({
    id: String(a.id),
    code: String(a.code),
    description: a.description != null ? String(a.description) : null,
  }));

  return (
    <ProductFormContent
      mode="create"
      companies={companies}
      atcCodes={atcCodes}
    />
  );
}
