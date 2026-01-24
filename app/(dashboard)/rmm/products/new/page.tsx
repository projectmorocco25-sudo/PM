/**
 * Wireframe: task-0.5.2.9-product-create-edit-form.md
 * Route: /rmm/products/new
 * Implements: Create product form
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md
 * 
 * Database: products, companies, atc_codes tables
 * RPC Functions: rmm_create_product(creator_user_id, company_id, name, description, is_critical_medicine)
 * 
 * Features:
 * - Create new product
 * - Company selection (MOH) or auto-filled (Company users)
 * - ATC code selection
 * - Form validation
 * - Role-based access control
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { ArrowLeft, Save } from "lucide-react";

interface Company {
  id: string;
  name: string;
}

interface ATCCode {
  code: string;
  description: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get("company_id");
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [atcCodes, setAtcCodes] = useState<ATCCode[]>([]);
  const [companyId, setCompanyId] = useState<string>(companyIdParam || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [atcCode, setAtcCode] = useState<string>("");
  const [isCriticalMedicine, setIsCriticalMedicine] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  // Validation state
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

  // Load companies (MOH users only)
  useEffect(() => {
    if (!user || permissionsLoading) return;
    if (isCompanyRole(permissions?.role as any)) {
      // Company users: use their company
      if (permissions?.company_id) {
        setCompanyId(permissions.company_id);
      }
      return;
    }

    async function fetchCompanies() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_companies", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });

        if (!error && data) {
          const response = data as any;
          setCompanies(response.companies || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchCompanies();
  }, [user, permissionsLoading, permissions]);

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

  // Check if user can create products
  const canCreate = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any);

  const canSetCriticalMedicine = permissions?.role === ROLES.TIER1;

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyId) {
      newErrors.companyId = "Company is required";
    }

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
    
    if (!validate() || !user || !canCreate) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_create_product", {
        creator_user_id: user.id,
        company_id: companyId,
        name: name.trim(),
        description: description.trim() || null,
        is_critical_medicine: isCriticalMedicine,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // If ATC code is selected, update product with ATC code
      // Note: This might require a separate RPC function or update
      if (atcCode) {
        // TODO: Update product with ATC code if RPC function supports it
      }

      // Navigate to product detail page
      router.push(`/rmm/products/${(data as any).id}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to create product" });
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
          <Link href="/rmm/products" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Create Product</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to create products</p>
          <Link
            href="/rmm/products"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Products
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
          <Link href="/rmm/products" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/products" className="hover:text-text-primary">Products</Link>
              {" > New Product"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Create Product</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Product Information</h2>
          
          {/* Company (MOH users only) */}
          {!isCompanyRole(permissions?.role as any) && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Company <span className="text-error-500">*</span>
              </label>
              <select
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  if (errors.companyId) setErrors({ ...errors, companyId: "" });
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && <p className="mt-1 text-sm text-error-500">{errors.companyId}</p>}
            </div>
          )}

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

          {/* ATC Code */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">ATC Code</label>
            <select
              value={atcCode}
              onChange={(e) => setAtcCode(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select ATC Code</option>
              {atcCodes.map((atc) => (
                <option key={atc.code} value={atc.code}>
                  {atc.code} - {atc.description}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-secondary">
              ℹ️ ATC codes are MOH-controlled. Select the appropriate ATC code for classification.
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

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/rmm/products"
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
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
