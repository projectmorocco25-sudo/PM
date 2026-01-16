import { createSupabaseBrowserClient as sb } from "./browser";

export type SupabaseResult<T> = {
  data: T | null;
  error: Error | null;
};

export async function listCompanies(): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("companies").select("*").order("name", { ascending: true });
  console.log("[listCompanies] data:", data, "error:", error);
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function getCompany(companyId: string): Promise<SupabaseResult<unknown>> {
  const { data, error } = await sb().from("companies").select("*").eq("id", companyId).maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}

export async function isCompanyRegistrationAvailable(
  registrationNumber: string,
  excludeCompanyId?: string,
): Promise<SupabaseResult<boolean>> {
  let q = sb().from("companies").select("id").eq("registration_number", registrationNumber).limit(1);
  if (excludeCompanyId) q = q.neq("id", excludeCompanyId);
  const { data, error } = await q.maybeSingle();
  if (error) return { data: null, error };
  return { data: data === null, error: null };
}

export type CompanyUpsertInput = {
  name: string;
  registration_number: string;
  company_type: "ipc" | "wholesaler" | "";
  address: string;
  contact_email: string;
  contact_phone: string;
  tax_id?: string;
  is_active?: boolean;
};

export async function rmmCreateCompany(input: CompanyUpsertInput): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_create_company", {
    p_name: input.name,
    p_registration_number: input.registration_number,
    p_company_type: input.company_type || null,
    p_address: input.address,
    p_contact_email: input.contact_email,
    p_contact_phone: input.contact_phone,
    p_tax_id: input.tax_id || null,
    p_is_active: input.is_active ?? true,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to create company");
  return { id: (data as { data?: { id?: string } }).data?.id ?? "" };
}

export async function rmmUpdateCompany(companyId: string, patch: Partial<CompanyUpsertInput>): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_update_company", {
    p_company_id: companyId,
    p_name: patch.name ?? null,
    p_registration_number: patch.registration_number ?? null,
    p_company_type: patch.company_type ?? null,
    p_address: patch.address ?? null,
    p_contact_email: patch.contact_email ?? null,
    p_contact_phone: patch.contact_phone ?? null,
    p_tax_id: patch.tax_id ?? null,
    p_is_active: patch.is_active ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to update company");
  return { id: (data as { data?: { id?: string } }).data?.id ?? companyId };
}

export async function listProducts(companyId?: string): Promise<SupabaseResult<unknown[]>> {
  const q = sb().from("products").select("*").order("name", { ascending: true });
  const { data, error } = companyId ? await q.eq("company_id", companyId) : await q;
  console.log("[listProducts] companyId:", companyId, "data:", data, "error:", error);
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function getProduct(productId: string): Promise<SupabaseResult<unknown>> {
  const { data, error } = await sb().from("products").select("*").eq("id", productId).maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}

export type ProductUpsertInput = {
  company_id: string;
  name: string;
  description: string;
  atc_code_id: string | null;
  is_critical_medicine: boolean;
  is_active?: boolean;
};

export async function rmmCreateProduct(input: ProductUpsertInput): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_create_product", {
    p_company_id: input.company_id,
    p_name: input.name,
    p_description: input.description,
    p_atc_code_id: input.atc_code_id,
    p_is_critical_medicine: input.is_critical_medicine,
    p_is_active: input.is_active ?? true,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to create product");
  return { id: (data as { data?: { id?: string } }).data?.id ?? "" };
}

export async function rmmUpdateProduct(productId: string, patch: Partial<Omit<ProductUpsertInput, "company_id">>): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_update_product", {
    p_product_id: productId,
    p_name: patch.name ?? null,
    p_description: patch.description ?? null,
    p_atc_code_id: patch.atc_code_id ?? null,
    p_is_critical_medicine: patch.is_critical_medicine ?? null,
    p_is_active: patch.is_active ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to update product");
  return { id: (data as { data?: { id?: string } }).data?.id ?? productId };
}

export async function listSkus(productId?: string): Promise<SupabaseResult<unknown[]>> {
  const q = sb().from("skus").select("*").order("sku_code", { ascending: true });
  const { data, error } = productId ? await q.eq("product_id", productId) : await q;
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function getSku(skuId: string): Promise<SupabaseResult<unknown>> {
  const { data, error } = await sb().from("skus").select("*").eq("id", skuId).maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}

export type SkuUpsertInput = {
  product_id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  atc_code_id: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active?: boolean;
};

export async function rmmCreateSku(input: SkuUpsertInput): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_create_sku", {
    p_product_id: input.product_id,
    p_sku_code: input.sku_code,
    p_name: input.name,
    p_dosage_strength: input.dosage_strength,
    p_dosage_form: input.dosage_form,
    p_pack_size: input.pack_size,
    p_unit_of_measure: input.unit_of_measure,
    p_atc_code_id: input.atc_code_id,
    p_is_moh_authorized_unregistered: input.is_moh_authorized_unregistered,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to create SKU");
  return { id: (data as { data?: { id?: string } }).data?.id ?? "" };
}

export async function rmmUpdateSku(skuId: string, patch: Partial<Omit<SkuUpsertInput, "product_id">>): Promise<{ id: string }> {
  const { data, error } = await sb().rpc("rmm_update_sku", {
    p_sku_id: skuId,
    p_sku_code: patch.sku_code ?? null,
    p_name: patch.name ?? null,
    p_dosage_strength: patch.dosage_strength ?? null,
    p_dosage_form: patch.dosage_form ?? null,
    p_pack_size: patch.pack_size ?? null,
    p_unit_of_measure: patch.unit_of_measure ?? null,
    p_atc_code_id: patch.atc_code_id ?? null,
    p_is_moh_authorized_unregistered: patch.is_moh_authorized_unregistered ?? null,
    p_is_active: patch.is_active ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to update SKU");
  return { id: (data as { data?: { id?: string } }).data?.id ?? skuId };
}

export async function listAtcCodes(): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("atc_codes").select("*").order("code", { ascending: true });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listConversations(): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("conversations").select("*").order("created_at", { ascending: false });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listMessages(conversationId: string): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listFollowUps(): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("follow_ups").select("*").order("due_date", { ascending: true });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listAamsSubmissions(companyId?: string): Promise<SupabaseResult<unknown[]>> {
  const q = sb().from("aams_submissions").select("*").order("created_at", { ascending: false });
  const { data, error } = companyId ? await q.eq("company_id", companyId) : await q;
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listMsqSubmissions(companyId?: string): Promise<SupabaseResult<unknown[]>> {
  const q = sb().from("msq_submissions").select("*").order("created_at", { ascending: false });
  const { data, error } = companyId ? await q.eq("company_id", companyId) : await q;
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listWslSubmissions(companyId?: string): Promise<SupabaseResult<unknown[]>> {
  const q = sb().from("wsl_submissions").select("*").order("created_at", { ascending: false });
  const { data, error } = companyId ? await q.eq("company_id", companyId) : await q;
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listRegistrySubmissions(): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb().from("registry_submissions").select("*").order("created_at", { ascending: false });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function getRegistrySubmission(submissionId: string): Promise<SupabaseResult<unknown>> {
  const { data, error } = await sb().from("registry_submissions").select("*").eq("id", submissionId).maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}

export async function getSubmissionApprovals(submissionId: string): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb()
    .from("approvals")
    .select("*")
    .eq("submission_id", submissionId)
    .eq("submission_type", "registry")
    .order("created_at", { ascending: false });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function rmmVerifyRegistrySubmission(submissionId: string, comments?: string): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_verify_registry_submission", {
    p_submission_id: submissionId,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to verify submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "tier2_verified" };
}

export async function rmmPeerReviewRegistrySubmission(submissionId: string, comments?: string): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_peer_review_registry_submission", {
    p_submission_id: submissionId,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to peer review submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "tier2_peer_reviewed" };
}

export async function rmmApproveRegistrySubmission(submissionId: string, comments?: string): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_approve_registry_submission", {
    p_submission_id: submissionId,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to approve submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "tier1_approved" };
}

export async function rmmImplementRegistryUpdate(submissionId: string, comments?: string): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_implement_registry_update", {
    p_submission_id: submissionId,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to implement submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "tier2_implemented" };
}

export async function rmmCompleteRegistryUpdate(submissionId: string, comments?: string): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_complete_registry_update", {
    p_submission_id: submissionId,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to complete submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "completed" };
}

export async function rmmRejectRegistrySubmission(
  submissionId: string,
  rejectionReason: string,
  comments?: string,
): Promise<{ id: string; status: string }> {
  const { data, error } = await sb().rpc("rmm_reject_registry_submission", {
    p_submission_id: submissionId,
    p_rejection_reason: rejectionReason,
    p_comments: comments ?? null,
  });
  if (error) throw error;
  if (!data?.success) throw new Error((data as { error?: { message?: string } })?.error?.message ?? "Failed to reject submission");
  const result = (data as { data?: { id?: string; status?: string } }).data;
  return { id: result?.id ?? submissionId, status: result?.status ?? "rejected" };
}

export async function listAuditLogs(limit = 10): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb()
    .from("audit_logs")
    .select("id,operation_type,table_name,record_id,created_at")
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 50)));
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listCompanyAuditLogs(companyId: string, limit = 20): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb()
    .from("audit_logs")
    .select("id,operation_type,table_name,record_id,created_at,user_id,reason")
    .eq("table_name", "companies")
    .eq("record_id", companyId)
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listEnforcementActions(companyId: string): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb()
    .from("enforcement_actions")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function listRecordAuditLogs(tableName: string, recordId: string, limit = 20): Promise<SupabaseResult<unknown[]>> {
  const { data, error } = await sb()
    .from("audit_logs")
    .select("id,operation_type,table_name,record_id,created_at,user_id,reason")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}
