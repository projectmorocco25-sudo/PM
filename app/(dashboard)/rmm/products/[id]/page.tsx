/**
 * Wireframe: task-0.5.2.5-product-detail.md
 * Route: /rmm/products/[id]
 * Implements: Product detail page with tabs (Overview, SKUs, History)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md
 * 
 * Database: products, skus, companies, registry_submissions tables
 * RPC Functions: 
 *   - rmm_get_product(user_id, product_id)
 *   - rmm_list_product_skus(user_id, product_id, page_number, page_size)
 *   - rmm_get_product_history(user_id, product_id, page_number, page_size)
 * 
 * Features:
 * - Product information display
 * - Tabbed interface: Overview, SKUs, History
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
import { Edit, ArrowLeft, Package, Box, History } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
}

type Tab = "overview" | "skus" | "history";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch product
  useEffect(() => {
    if (!user || !productId || permissionsLoading) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_product", {
          user_id: user.id,
          product_id: productId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setProduct(data as Product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [user, productId, permissionsLoading]);

  const canEditProduct = permissions?.role && [
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

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
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
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Product Details</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "Product not found"}
          </p>
          <Link
            href="/rmm/products"
            className="inline-block px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors mt-4"
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
              {" > "}
              <span className="text-text-primary">{product.name}</span>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">{product.name}</h1>
          </div>
        </div>
        {canEditProduct && (
          <Link
            href={`/rmm/products/${productId}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        )}
      </div>

      {/* Product Information Card */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary">Company</label>
            <p className="text-text-primary font-medium">
              {product.company_name ? (
                <Link
                  href={`/rmm/companies/${product.company_id}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {product.company_name}
                </Link>
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">ATC Code</label>
            <p className="font-mono text-text-primary">{product.atc_code || "-"}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Critical Medicine</label>
            <p>
              {product.is_critical_medicine ? (
                <span className="px-2 py-1 text-xs font-medium rounded bg-warning-50 text-warning-700">
                  Yes
                </span>
              ) : (
                <span className="text-text-secondary">No</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Status</label>
            <p>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  product.is_active
                    ? "bg-success-50 text-success-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          {product.description && (
            <div className="md:col-span-2">
              <label className="text-sm text-text-secondary">Description</label>
              <p className="text-text-primary">{product.description}</p>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Created</label>
            <p className="text-text-primary">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Last Updated</label>
            <p className="text-text-primary">
              {new Date(product.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-default">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "overview"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("skus")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "skus"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            SKUs
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "history"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Total SKUs</p>
                <p className="text-2xl font-semibold text-text-primary">-</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Active SKUs</p>
                <p className="text-2xl font-semibold text-text-primary">-</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              SKU statistics will be loaded from the SKUs tab data.
            </p>
          </div>
        )}

        {activeTab === "skus" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">SKUs</h2>
              <Link
                href={`/rmm/skus?product_id=${productId}`}
                className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
              >
                View All SKUs →
              </Link>
            </div>
            <p className="text-sm text-text-secondary">
              SKUs list will be implemented using `rmm_list_product_skus()` RPC function.
            </p>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">History</h2>
            <p className="text-sm text-text-secondary">
              Product history (registry submissions) will be loaded using `rmm_get_product_history()` RPC function.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
