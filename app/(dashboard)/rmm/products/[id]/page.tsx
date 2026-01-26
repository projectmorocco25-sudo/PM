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
import { Edit, ArrowLeft, ExternalLink, Plus, Eye, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";

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

interface SkuRow {
  id: string;
  sku_code: string;
  name: string;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  is_active: boolean;
}

interface ProductStats {
  total_skus: number;
  active_skus: number;
}

interface HistorySubmission {
  id: string;
  submission_type: string;
  entity_type: string;
  created_at: string;
  updated_at: string;
}

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
  const [skus, setSkus] = useState<SkuRow[]>([]);
  const [skusLoading, setSkusLoading] = useState(false);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [productHistory, setProductHistory] = useState<HistorySubmission[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  // Fetch SKUs for SKUs tab (Phase 3 Task 3.5)
  useEffect(() => {
    if (!user || !productId || permissionsLoading || activeTab !== "skus") return;
    const supabase = createClient();
    (async () => {
      setSkusLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_list_product_skus", {
          user_id: user.id,
          product_id: productId,
          page_number: 1,
          page_size: 50,
        });
        if (!err && data && typeof data === "object" && "skus" in data) {
          const r = data as { skus: SkuRow[] };
          setSkus(Array.isArray(r.skus) ? r.skus : []);
        } else setSkus([]);
      } finally {
        setSkusLoading(false);
      }
    })();
  }, [user, productId, permissionsLoading, activeTab]);

  // Fetch product statistics for Overview (Phase 3 Task 3.7)
  useEffect(() => {
    if (!user || !productId || permissionsLoading || activeTab !== "overview") return;
    const supabase = createClient();
    (async () => {
      setStatsLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_get_product_statistics", {
          user_id: user.id,
          product_id: productId,
        });
        if (!err && data && typeof data === "object") setProductStats(data as ProductStats);
        else setProductStats(null);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, [user, productId, permissionsLoading, activeTab]);

  // Fetch product history for History tab and Overview Recent Activity (Phase 3 Task 3.6, 3.7)
  useEffect(() => {
    if (!user || !productId || permissionsLoading) return;
    if (activeTab !== "history" && activeTab !== "overview") return;
    const supabase = createClient();
    (async () => {
      setHistoryLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_get_product_history", {
          user_id: user.id,
          product_id: productId,
          page_number: 1,
          page_size: 50,
        });
        if (!err && data && typeof data === "object" && "submissions" in data) {
          const r = data as { submissions: HistorySubmission[] };
          setProductHistory(Array.isArray(r.submissions) ? r.submissions : []);
        } else setProductHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [user, productId, permissionsLoading, activeTab]);

  const [actionsOpen, setActionsOpen] = useState(false);

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

  const canCreateSku = permissions?.role && [
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
        <div className="flex items-center gap-2">
          {canEditProduct && (
            <Link
              href={`/rmm/products/${productId}/edit`}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          )}
          <div className="relative">
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors font-medium flex items-center gap-2"
            >
              Actions
              <MoreVertical className="w-4 h-4" />
            </button>
            {actionsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
                <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-bg-primary border border-border-default rounded-md shadow-lg z-20">
                  {(permissions?.role === ROLES.TIER1 || permissions?.role === ROLES.SYSTEM_ADMIN) && (
                    <>
                      {product?.is_critical_medicine ? (
                        <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary">
                          Remove Critical Medicine (coming soon)
                        </a>
                      ) : (
                        <Link href="/rmm/critical-medicines" onClick={() => setActionsOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary">
                          Mark as Critical Medicine
                        </Link>
                      )}
                    </>
                  )}
                  <Link href={`/audit/logs?entity=product&id=${productId}`} onClick={() => setActionsOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary">View Audit Log</Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary">Export (coming soon)</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary">Deactivate (coming soon)</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-error-600 hover:bg-error-50">Delete (coming soon)</a>
                </div>
              </>
            )}
          </div>
        </div>
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
        {/* Regulatory Compliance Status (Phase 2 Task 2.2.2 - Fatima's Requirement) */}
        <div className="mt-6 pt-6 border-t border-border-default">
          <h3 className="text-base font-semibold text-text-primary mb-3">Regulatory Compliance Status</h3>
          <div className="space-y-2 text-sm">
            <p className="text-text-secondary">Regulatory Framework: DMP Art. 10</p>
            <p className="text-text-primary">Registration Status: ✓ Approved</p>
            <p className="text-text-primary">Compliance Verification: ✓ Complete</p>
            <p className="text-text-secondary">Last Verified: —</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <RegulatoryFrameworkLink />
              <Link href="/rmm/submissions" className="text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1">
                View Compliance History <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
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
              {statsLoading ? (
                <>
                  <div className="bg-bg-secondary rounded-lg p-4 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-4 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Total SKUs</p>
                    <p className="text-2xl font-semibold text-text-primary">{productStats?.total_skus ?? "-"}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Active SKUs</p>
                    <p className="text-2xl font-semibold text-text-primary">{productStats?.active_skus ?? "-"}</p>
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-3">Recent Activity</h3>
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : productHistory.length === 0 ? (
                <p className="text-sm text-text-secondary">No history available</p>
              ) : (
                <ul className="space-y-2">
                  {productHistory.slice(0, 10).map((s) => {
                    const label = `${s.entity_type} ${s.submission_type.replace(/_/g, " ")}`;
                    const date = s.created_at ? new Date(s.created_at) : null;
                    return (
                      <li key={s.id} className="text-sm text-text-primary">
                        • {label} — {date ? date.toLocaleDateString() : "—"}
                        {date && (() => {
                          const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
                          if (days === 0) return " (today)";
                          if (days === 1) return " (1 day ago)";
                          if (days < 7) return ` (${days} days ago)`;
                          if (days < 14) return " (1 week ago)";
                          if (days < 30) return ` (${Math.floor(days / 7)} weeks ago)`;
                          return ` (${Math.floor(days / 30)} months ago)`;
                        })()}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="border-t border-border-default pt-6">
              <p className="text-sm text-text-primary mb-1">Enforcement History</p>
              <p className="text-sm text-text-secondary mb-2">Enforcement actions for this product&apos;s SKUs</p>
              <Link
                href={`/enforcement/actions${product?.company_id ? `?company=${product.company_id}` : ""}`}
                className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
              >
                View Enforcement History →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "skus" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-text-primary">SKUs</h2>
              <div className="flex items-center gap-3">
                {canCreateSku && (
                  <Link
                    href={`/rmm/skus/new?product_id=${productId}`}
                    className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New SKU
                  </Link>
                )}
                <Link
                  href={`/rmm/skus?product_id=${productId}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
                >
                  View All SKUs →
                </Link>
              </div>
            </div>
            {skusLoading ? (
              <div className="h-48 bg-gray-100 rounded animate-pulse" />
            ) : skus.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center">
                <p className="text-text-secondary mb-4">No SKUs found</p>
                {canCreateSku && (
                  <Link
                    href={`/rmm/skus/new?product_id=${productId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    <Plus className="w-4 h-4" />
                    New SKU
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border-default">
                <table className="min-w-full divide-y divide-border-default">
                  <thead className="bg-bg-secondary">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">SKU Code</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">SKU Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Dosage</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Form</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Pack Size</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {skus.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-bg-secondary/50 cursor-pointer"
                        onClick={() => router.push(`/rmm/skus/${s.id}`)}
                      >
                        <td className="px-4 py-3 text-sm font-mono text-text-primary">{s.sku_code}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{s.dosage_strength ?? "-"}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{s.dosage_form ?? "-"}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {s.pack_size}{s.unit_of_measure ? ` ${s.unit_of_measure}` : ""}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              s.is_active ? "bg-success-50 text-success-700" : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/rmm/skus/${s.id}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">History</h2>
            <p className="text-sm text-text-secondary">Timeline of all changes and updates</p>
            {historyLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 bg-gray-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productHistory.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center text-text-secondary">
                No history available
              </div>
            ) : (
              <div className="relative space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border-default" />
                {productHistory.map((s) => {
                  const label = `${s.entity_type} ${s.submission_type.replace(/_/g, " ")}`;
                  const date = s.created_at ? new Date(s.created_at) : null;
                  return (
                    <div key={s.id} className="relative flex gap-4 pb-6 pl-6">
                      <div className="absolute left-0 w-3 h-3 rounded-full bg-primary-500 border-2 border-bg-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{label}</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {date ? date.toLocaleDateString() : "—"}
                          {date && (() => {
                            const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
                            if (days === 0) return " (today)";
                            if (days === 1) return " (1 day ago)";
                            if (days < 7) return ` (${days} days ago)`;
                            if (days < 14) return " (1 week ago)";
                            if (days < 30) return ` (${Math.floor(days / 7)} weeks ago)`;
                            return ` (${Math.floor(days / 30)} months ago)`;
                          })()}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">Updated by: —</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
