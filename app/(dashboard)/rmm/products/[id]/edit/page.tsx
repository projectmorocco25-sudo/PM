/**
 * Wireframe: task-0.5.2.9-product-create-edit-form.md
 * Route: /rmm/products/[id]/edit
 * Implements: Product edit form — Company, Name, ATC Code, Description, Status, Critical Medicine, Metadata, draft auto-save, validation.
 * Task: 1.1.2.22
 * API: rmm_get_product_for_detail, rmm_update_product, rmm_list_companies, rmm_list_atc_codes (hosted Supabase only).
 * Wireframe Link: ../../../../../../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductFormContent, type ProductFormInitial } from "../../ProductFormContent";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [productRes, companiesRes, atcRes] = await Promise.all([
    supabase.rpc("rmm_get_product_for_detail", { p_id: id }),
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

  const productData = productRes.data as { product?: Record<string, unknown>; error?: string } | null;
  if (!productData?.product || productData.error) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <Link href="/rmm/products" className="text-[#2563eb] hover:underline">Products</Link>
          <span className="mx-1 text-[#9ca3af]">/</span>
          <span className="text-[#111827] font-medium">Edit Product</span>
        </nav>
        <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
          <p className="font-medium text-[#dc2626]">Unable to load product</p>
          <p className="mt-1 text-sm text-[#991b1b]">
            {productData?.error === "not_found" ? "Product not found." : "You may not have access to this product."}
          </p>
          <Link href="/rmm/products" className="mt-4 inline-block text-sm text-[#2563eb] hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const p = productData.product as Record<string, unknown>;
  const initial: ProductFormInitial = {
    id: String(p.id),
    company_id: String(p.company_id),
    company_name: String(p.company_name ?? ""),
    name: String(p.name),
    description: p.description != null ? String(p.description) : null,
    atc_code_id: p.atc_code_id != null ? String(p.atc_code_id) : null,
    atc_code: p.atc_code != null ? String(p.atc_code) : null,
    is_active: Boolean(p.is_active),
    is_critical_medicine: Boolean(p.is_critical_medicine),
    created_at: p.created_at != null ? String(p.created_at) : undefined,
    updated_at: p.updated_at != null ? String(p.updated_at) : undefined,
  };

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
      mode="edit"
      productId={id}
      initial={initial}
      companies={companies}
      atcCodes={atcCodes}
    />
  );
}
