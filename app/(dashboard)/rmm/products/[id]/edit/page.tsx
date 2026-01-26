/**
 * Wireframe: task-0.5.2.9-product-create-edit-form.md
 * Route: /rmm/products/[id]/edit
 * Implements: Edit product form
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md
 * 
 * Database: products, companies, atc_codes tables
 * RPC Functions: rmm_get_product(user_id, product_id), rmm_update_product(updater_user_id, product_id, name, description, is_critical_medicine, create_submission)
 * 
 * Features:
 * - Edit existing product
 * - Form validation
 * - Role-based access control
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Save } from "lucide-react";
import { useDraftForm } from "@/lib/hooks/use-draft-form";

interface Product {
  id: string;
  name: string;
  description: string | null;
  atc_code: string | null;
  company_id: string;
  company_name: string | null;
  is_critical_medicine: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

interface ATCCode {
  code: string;
  description: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [product, setProduct] = useState<Product | null>(null);
  const [atcCodes, setAtcCodes] = useState<ATCCode[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [atcCode, setAtcCode] = useState<string>("");
  const [isCriticalMedicine, setIsCriticalMedicine] = useState(false);
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const DRAFT_KEY = `draft_rmm_product_edit_${productId}`;
  const { saveDraft, loadDraft, clearDraft, lastSaved } = useDraftForm(
    DRAFT_KEY,
    () => ({ name, description, isCriticalMedicine }),
    { intervalMs: 30_000, enabled: !!productId }
  );

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load ATC codes
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchATCCodes() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_atc_codes", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });

        if (!error && data) {
          const response = data as any;
          setAtcCodes(response.atc_codes || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchATCCodes();
  }, [user, permissionsLoading]);

  // Load product data
  useEffect(() => {
    if (!user || !productId || permissionsLoading) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_product", {
          user_id: user.id,
          product_id: productId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const productData = data as Product;
        setProduct(productData);
        const draft = loadDraft() as Record<string, unknown> | null;
        if (draft && typeof draft === "object") {
          if (typeof draft.name === "string") setName(draft.name);
          if (typeof draft.description === "string") setDescription(draft.description);
          if (typeof draft.isCriticalMedicine === "boolean") setIsCriticalMedicine(draft.isCriticalMedicine);
        } else {
          setName(productData.name);
          setDescription(productData.description || "");
          setIsCriticalMedicine(productData.is_critical_medicine);
        }
      } catch (err) {
        setErrors({ fetch: err instanceof Error ? err.message : "Failed to load product" });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [user, productId, permissionsLoading, loadDraft]);

  // Check if user can edit
  const canEdit = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any) && (
    permissions.role === ROLES.COMPANY_ADMIN || permissions.role === ROLES.COMPANY_MANAGER
      ? permissions.company_id === product?.company_id
      : true
  );

  const canSetCriticalMedicine = permissions?.role === ROLES.TIER1;

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    } else if (name.trim().length < 2 || name.trim().length > 200) {
      newErrors.name = "Product name must be between 2 and 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !canEdit || !product) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_update_product", {
        updater_user_id: user.id,
        product_id: productId,
        name: name.trim() !== product.name ? name.trim() : null,
        description: description.trim() !== (product.description || "") ? description.trim() || null : null,
        is_critical_medicine: canSetCriticalMedicine && isCriticalMedicine !== product.is_critical_medicine ? isCriticalMedicine : null,
        create_submission: true,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      clearDraft();
      router.push(`/rmm/products/${productId}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to update product" });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading || loading) {
    return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
  }

  if (errors.fetch || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/products/${productId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Product</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {errors.fetch || "Product not found"}
          </p>
          <Link
            href={`/rmm/products/${productId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Product
          </Link>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/products/${productId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Product</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to edit products</p>
          <Link
            href={`/rmm/products/${productId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/products/${productId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/products" className="hover:text-text-primary">Products</Link>
              {" > "}
              <Link href={`/rmm/products/${productId}`} className="hover:text-text-primary">
                {product.name}
              </Link>
              {" > Edit"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Edit Product</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => saveDraft()}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <Link
            href={`/rmm/products/${productId}`}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {lastSaved && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-2 text-sm text-blue-800">
          💾 Draft saved automatically — Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Product Information</h2>
          
          {/* Company (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Company</label>
            <div className="px-3 py-2 bg-bg-secondary border border-border-default rounded-md text-text-primary">
              {product.company_name || "-"}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Product Name <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter product name..."
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
          </div>

          {/* ATC Code (Read-only display) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">ATC Code</label>
            <div className="px-3 py-2 bg-bg-secondary border border-border-default rounded-md font-mono text-text-primary">
              {product.atc_code || "-"}
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              ℹ️ ATC codes are MOH-controlled and read-only.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description..."
              rows={4}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Critical Medicine Designation (MOH Tier 1 Only) */}
        {canSetCriticalMedicine && (
          <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Critical Medicine Designation</h2>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCriticalMedicine}
                  onChange={(e) => setIsCriticalMedicine(e.target.checked)}
                  className="rounded border-border-default"
                />
                <span className="text-sm text-text-primary">
                  Yes - This product is designated as a critical medicine
                </span>
              </label>
            </div>
            <p className="text-xs text-text-secondary">
              ℹ️ Critical medicine designation is for MOH Tier 1 only. This designation affects compliance monitoring.
            </p>
          </div>
        )}

        {/* Metadata (Display Only) — Phase 6 Task 6.2 */}
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Created At: </span>
              <span className="text-text-primary">
                {new Date(product.created_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Created By: </span>
              <span className="text-text-primary">{product.created_by_name?.trim() || "—"}</span>
            </div>
            <div>
              <span className="text-text-secondary">Last Updated: </span>
              <span className="text-text-primary">
                {new Date(product.updated_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Updated By: </span>
              <span className="text-text-primary">{product.updated_by_name?.trim() || "—"}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/rmm/products/${productId}`}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => saveDraft()}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
