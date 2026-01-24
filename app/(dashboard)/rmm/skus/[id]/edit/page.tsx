/**
 * Wireframe: task-0.5.2.10-sku-create-edit-form.md
 * Route: /rmm/skus/[id]/edit
 * Implements: Edit SKU form with pharmaceutical attributes
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md
 * 
 * Database: skus, products, companies, atc_codes tables
 * RPC Functions: rmm_get_sku(user_id, sku_id), rmm_update_sku(updater_user_id, sku_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_moh_authorized_unregistered, create_submission)
 * 
 * Features:
 * - Edit existing SKU
 * - Pharmaceutical attributes (Phase 0.6): dosage_strength, dosage_form, pack_size, unit_of_measure
 * - Form validation
 * - Role-based access control
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Save } from "lucide-react";

interface SKU {
  id: string;
  sku_code: string;
  name: string;
  product_id: string;
  product_name: string | null;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export default function EditSKUPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [sku, setSku] = useState<SKU | null>(null);
  const [skuCode, setSkuCode] = useState("");
  const [name, setName] = useState("");
  const [dosageStrength, setDosageStrength] = useState("");
  const [dosageForm, setDosageForm] = useState<string>("");
  const [packSize, setPackSize] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>("");
  const [isMohAuthorizedUnregistered, setIsMohAuthorizedUnregistered] = useState(false);
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load SKU data
  useEffect(() => {
    if (!user || !skuId || permissionsLoading) return;

    async function fetchSKU() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_sku", {
          user_id: user.id,
          sku_id: skuId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const skuData = data as SKU;
        setSku(skuData);
        setSkuCode(skuData.sku_code);
        setName(skuData.name);
        setDosageStrength(skuData.dosage_strength || "");
        setDosageForm(skuData.dosage_form || "");
        setPackSize(skuData.pack_size || "");
        setUnitOfMeasure(skuData.unit_of_measure || "");
        setIsMohAuthorizedUnregistered(skuData.is_moh_authorized_unregistered);
      } catch (err) {
        setErrors({ fetch: err instanceof Error ? err.message : "Failed to load SKU" });
      } finally {
        setLoading(false);
      }
    }

    fetchSKU();
  }, [user, skuId, permissionsLoading]);

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
      ? permissions.company_id === sku?.company_id
      : true
  );

  const canSetMohAuthorized = permissions?.role === ROLES.TIER1;

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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
    
    if (!validate() || !user || !canEdit || !sku) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_update_sku", {
        updater_user_id: user.id,
        sku_id: skuId,
        sku_code: skuCode.trim() !== sku.sku_code ? skuCode.trim() : null,
        name: name.trim() !== sku.name ? name.trim() : null,
        dosage_strength: dosageStrength.trim() !== (sku.dosage_strength || "") ? dosageStrength.trim() : null,
        dosage_form: dosageForm !== (sku.dosage_form || "") ? dosageForm : null,
        pack_size: packSize.trim() !== (sku.pack_size || "") ? packSize.trim() : null,
        unit_of_measure: unitOfMeasure !== (sku.unit_of_measure || "") ? unitOfMeasure : null,
        is_moh_authorized_unregistered: canSetMohAuthorized && isMohAuthorizedUnregistered !== sku.is_moh_authorized_unregistered ? isMohAuthorizedUnregistered : null,
        create_submission: true,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // Navigate to SKU detail page
      router.push(`/rmm/skus/${skuId}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to update SKU" });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading || loading) {
    return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
  }

  if (errors.fetch || !sku) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/skus/${skuId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit SKU</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {errors.fetch || "SKU not found"}
          </p>
          <Link
            href={`/rmm/skus/${skuId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to SKU
          </Link>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/skus/${skuId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit SKU</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to edit SKUs</p>
          <Link
            href={`/rmm/skus/${skuId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to SKU
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
          <Link href={`/rmm/skus/${skuId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/skus" className="hover:text-text-primary">SKUs</Link>
              {" > "}
              <Link href={`/rmm/skus/${skuId}`} className="hover:text-text-primary">
                {sku.name}
              </Link>
              {" > Edit"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Edit SKU</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SKU Basic Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">SKU Basic Information</h2>
          
          {/* Product (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Product</label>
            <div className="px-3 py-2 bg-bg-secondary border border-border-default rounded-md text-text-primary">
              {sku.product_name || "-"}
            </div>
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
              placeholder="500mg"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
            </div>
          )}
        </div>

        {/* Metadata (Display Only) */}
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Created At: </span>
              <span className="text-text-primary">
                {new Date(sku.created_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Last Updated: </span>
              <span className="text-text-primary">
                {new Date(sku.updated_at).toLocaleString()}
              </span>
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
            href={`/rmm/skus/${skuId}`}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Updating..." : "Update SKU"}
          </button>
        </div>
      </form>
    </div>
  );
}
