/**
 * Wireframe: task-0.5.2.10-sku-create-edit-form.md
 * Route: /rmm/skus/new
 * Implements: Create SKU form with pharmaceutical attributes
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md
 * 
 * Database: skus, products, companies, atc_codes tables
 * RPC Functions: rmm_create_sku(creator_user_id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_moh_authorized_unregistered)
 * 
 * Features:
 * - Create new SKU
 * - Pharmaceutical attributes (Phase 0.6): dosage_strength, dosage_form, pack_size, unit_of_measure
 * - Form validation
 * - Role-based access control
 */

"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { ArrowLeft, Save } from "lucide-react";
import { useDraftForm } from "@/lib/hooks/use-draft-form";

interface Product {
  id: string;
  name: string;
  atc_code: string | null;
}

const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Spray",
  "Suspension",
  "Solution",
  "Powder",
  "Other",
];

const UNIT_OF_MEASURE = [
  "tablets",
  "capsules",
  "ml",
  "vials",
  "boxes",
  "units",
  "grams",
  "mg",
  "pieces",
  "other",
];

function CreateSKUContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("product_id");
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>(productIdParam || "");
  const [skuCode, setSkuCode] = useState("");
  const [name, setName] = useState("");
  const [dosageStrength, setDosageStrength] = useState("");
  const [dosageForm, setDosageForm] = useState<string>("");
  const [packSize, setPackSize] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>("");
  const [isMohAuthorizedUnregistered, setIsMohAuthorizedUnregistered] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const DRAFT_KEY = "draft_rmm_sku_new";
  const { saveDraft, loadDraft, clearDraft, lastSaved } = useDraftForm(
    DRAFT_KEY,
    () => ({
      productId,
      skuCode,
      name,
      dosageStrength,
      dosageForm,
      packSize,
      unitOfMeasure,
      isMohAuthorizedUnregistered,
      isActive,
    }),
    { intervalMs: 30_000, enabled: true }
  );

  useEffect(() => {
    const d = loadDraft() as Record<string, unknown> | null;
    if (d && typeof d === "object") {
      if (typeof d.productId === "string") setProductId(d.productId);
      if (typeof d.skuCode === "string") setSkuCode(d.skuCode);
      if (typeof d.name === "string") setName(d.name);
      if (typeof d.dosageStrength === "string") setDosageStrength(d.dosageStrength);
      if (typeof d.dosageForm === "string") setDosageForm(d.dosageForm);
      if (typeof d.packSize === "string") setPackSize(d.packSize);
      if (typeof d.unitOfMeasure === "string") setUnitOfMeasure(d.unitOfMeasure);
      if (typeof d.isMohAuthorizedUnregistered === "boolean") setIsMohAuthorizedUnregistered(d.isMohAuthorizedUnregistered);
      if (typeof d.isActive === "boolean") setIsActive(d.isActive);
    }
  }, [loadDraft]);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load products
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_products", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });

        if (!error && data) {
          const response = data as any;
          setProducts(response.products || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchProducts();
  }, [user, permissionsLoading]);

  // Check if user can create SKUs
  const canCreate = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any);

  const canSetMohAuthorized = permissions?.role === ROLES.TIER1;

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!productId) {
      newErrors.productId = "Product is required";
    }

    if (!skuCode.trim()) {
      newErrors.skuCode = "SKU code is required";
    }

    if (!name.trim()) {
      newErrors.name = "SKU name is required";
    } else if (name.trim().length < 2 || name.trim().length > 200) {
      newErrors.name = "SKU name must be between 2 and 200 characters";
    }

    if (!dosageStrength.trim()) {
      newErrors.dosageStrength = "Dosage strength is required";
    }

    if (!dosageForm) {
      newErrors.dosageForm = "Dosage form is required";
    }

    if (!packSize.trim()) {
      newErrors.packSize = "Pack size is required";
    }

    if (!unitOfMeasure) {
      newErrors.unitOfMeasure = "Unit of measure is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !canCreate) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_create_sku", {
        creator_user_id: user.id,
        product_id: productId,
        sku_code: skuCode.trim(),
        name: name.trim(),
        dosage_strength: dosageStrength.trim(),
        dosage_form: dosageForm,
        pack_size: packSize.trim(),
        unit_of_measure: unitOfMeasure,
        atc_code_id: null, // ATC code inherited from product
        is_moh_authorized_unregistered: canSetMohAuthorized ? isMohAuthorizedUnregistered : false,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      clearDraft();
      router.push(`/rmm/skus/${(data as any).id}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to create SKU" });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading) {
    return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
  }

  if (!canCreate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/rmm/skus" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Create SKU</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to create SKUs</p>
          <Link
            href="/rmm/skus"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to SKUs
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
          <Link href="/rmm/skus" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/skus" className="hover:text-text-primary">SKUs</Link>
              {" > New SKU"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Create SKU</h1>
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
            href="/rmm/skus"
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
        {/* SKU Basic Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">SKU Basic Information</h2>
          
          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Product <span className="text-error-500">*</span>
            </label>
            <select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                if (errors.productId) setErrors({ ...errors, productId: "" });
              }}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.productId && <p className="mt-1 text-sm text-error-500">{errors.productId}</p>}
          </div>

          {/* SKU Code */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              SKU Code <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={skuCode}
              onChange={(e) => {
                setSkuCode(e.target.value);
                if (errors.skuCode) setErrors({ ...errors, skuCode: "" });
              }}
              placeholder="SKU001"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <p className="mt-1 text-xs text-text-secondary">
              ℹ️ Company's internal SKU code/identifier
            </p>
            {errors.skuCode && <p className="mt-1 text-sm text-error-500">{errors.skuCode}</p>}
          </div>

          {/* SKU Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              SKU Name <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Paracetamol 500mg Tablets 30-pack"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-text-secondary">
              ℹ️ Full SKU name (e.g., "Paracetamol 500mg Tablets 30-pack")
            </p>
            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
          </div>
        </div>

        {/* Pharmaceutical Attributes */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Pharmaceutical Attributes <span className="text-error-500">*</span></h2>
          
          {/* Dosage Strength */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Dosage Strength <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={dosageStrength}
              onChange={(e) => {
                setDosageStrength(e.target.value);
                if (errors.dosageStrength) setErrors({ ...errors, dosageStrength: "" });
              }}
              placeholder="500mg, 10mg/ml, 250mg/5ml"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Examples: 500mg, 10mg/ml, 250mg/5ml
            </p>
            {errors.dosageStrength && <p className="mt-1 text-sm text-error-500">{errors.dosageStrength}</p>}
          </div>

          {/* Dosage Form */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Dosage Form <span className="text-error-500">*</span>
            </label>
            <select
              value={dosageForm}
              onChange={(e) => {
                setDosageForm(e.target.value);
                if (errors.dosageForm) setErrors({ ...errors, dosageForm: "" });
              }}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Form</option>
              {DOSAGE_FORMS.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
            {errors.dosageForm && <p className="mt-1 text-sm text-error-500">{errors.dosageForm}</p>}
          </div>

          {/* Pack Size */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Pack Size <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={packSize}
              onChange={(e) => {
                setPackSize(e.target.value);
                if (errors.packSize) setErrors({ ...errors, packSize: "" });
              }}
              placeholder="30"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Examples: 30 (for 30 tablets), 100 (for 100ml bottle)
            </p>
            {errors.packSize && <p className="mt-1 text-sm text-error-500">{errors.packSize}</p>}
          </div>

          {/* Unit of Measure */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Unit of Measure <span className="text-error-500">*</span>
            </label>
            <select
              value={unitOfMeasure}
              onChange={(e) => {
                setUnitOfMeasure(e.target.value);
                if (errors.unitOfMeasure) setErrors({ ...errors, unitOfMeasure: "" });
              }}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Unit</option>
              {UNIT_OF_MEASURE.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unitOfMeasure && <p className="mt-1 text-sm text-error-500">{errors.unitOfMeasure}</p>}
          </div>

          <p className="text-xs text-text-secondary">
            ℹ️ Pharmaceutical attributes are critical for regulatory submissions (AAMS, MSQ, WSL). Submissions reference SKU_ID + Quantity.
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Additional Information</h2>
          
          {/* MOH Authorized Unregistered (MOH Tier 1 Only) */}
          {canSetMohAuthorized && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMohAuthorizedUnregistered}
                  onChange={(e) => setIsMohAuthorizedUnregistered(e.target.checked)}
                  className="rounded border-border-default"
                />
                <span className="text-sm text-text-primary">
                  Yes - This SKU is MOH-authorized unregistered product
                </span>
              </label>
              <p className="mt-1 text-xs text-text-secondary">
                ℹ️ MOH authorized unregistered flag is for MOH Tier 1 only. Indicates regulatory exception status.
              </p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border-default"
              />
              <span className="text-sm text-text-primary">Active</span>
            </label>
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
            href="/rmm/skus"
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
            {submitting ? "Creating..." : "Create SKU"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateSKUPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12 text-text-secondary">Loading...</div>}>
      <CreateSKUContent />
    </Suspense>
  );
}
