/**
 * Wireframe: task-0.5.2.3-company-detail.md
 * Route: /rmm/companies/[id]
 * Implements: Company detail page with tabs (Overview, Products, Enforcement, History)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 * 
 * Database: companies, products, skus, registry_submissions, enforcement_actions, approval_history tables
 * RPC Functions: 
 *   - rmm_get_company(user_id, company_id)
 *   - rmm_list_company_products(user_id, company_id, page_number, page_size)
 *   - rmm_get_company_history(user_id, company_id, page_number, page_size)
 * 
 * Features:
 * - Company information display
 * - Tabbed interface: Overview, Products, Enforcement, History
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
import { Edit, ArrowLeft, Package, AlertTriangle, CheckCircle, ExternalLink, Plus, Eye, DollarSign, Ban, AlertCircle, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  tax_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type Tab = "overview" | "products" | "enforcement" | "history";

interface ProductRow {
  id: string;
  name: string;
  atc_code: string | null;
  sku_count?: number;
  is_active: boolean;
}

interface CompanyStats {
  total_products: number;
  active_products: number;
  total_skus: number;
  active_skus: number;
}

interface HistorySubmission {
  id: string;
  submission_type: string;
  entity_type: string;
  created_at: string;
  updated_at: string;
  submitted_by: string | null;
  verified_by: string | null;
  approved_by: string | null;
}

interface EnforcementAction {
  id: string;
  action_type: string;
  status: string;
  legal_basis?: string;
  violation_type?: string;
  required_action?: string;
  executed_at: string | null;
  appeal_deadline?: string | null;
  appeal_window_open?: boolean;
  days_remaining?: number | null;
  amount?: number | null;
  currency?: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [enforcementActions, setEnforcementActions] = useState<EnforcementAction[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [companyHistory, setCompanyHistory] = useState<HistorySubmission[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [enforcementFilterType, setEnforcementFilterType] = useState<string>("all");
  const [enforcementFilterStatus, setEnforcementFilterStatus] = useState<string>("all");

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch company
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;

    async function fetchCompany() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_company", {
          user_id: user.id,
          company_id: companyId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setCompany(data as Company);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load company");
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [user, companyId, permissionsLoading]);

  // Fetch enforcement actions for Regulatory Compliance Status (Phase 2) and Enforcement tab (Phase 3)
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;
    const supabase = createClient();
    (async () => {
      const { data, error: err } = await supabase.rpc("rmm_get_enforcement_actions", {
        user_id: user.id,
        company_id: companyId,
        p_limit: 100,
      });
      if (!err && Array.isArray(data)) setEnforcementActions(data as EnforcementAction[]);
    })();
  }, [user, companyId, permissionsLoading]);

  // Fetch products for Products tab (Phase 3 Task 3.1)
  useEffect(() => {
    if (!user || !companyId || permissionsLoading || activeTab !== "products") return;
    const supabase = createClient();
    (async () => {
      setProductsLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_list_company_products", {
          user_id: user.id,
          company_id: companyId,
          page_number: 1,
          page_size: 50,
        });
        if (!err && data && typeof data === "object" && "products" in data) {
          const r = data as { products: ProductRow[] };
          setProducts(Array.isArray(r.products) ? r.products : []);
        }
      } finally {
        setProductsLoading(false);
      }
    })();
  }, [user, companyId, permissionsLoading, activeTab]);

  // Fetch company statistics for Overview tab (Phase 3 Task 3.4)
  useEffect(() => {
    if (!user || !companyId || permissionsLoading || activeTab !== "overview") return;
    const supabase = createClient();
    (async () => {
      setStatsLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_get_company_statistics", {
          user_id: user.id,
          company_id: companyId,
        });
        if (!err && data && typeof data === "object") setCompanyStats(data as CompanyStats);
        else setCompanyStats(null);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, [user, companyId, permissionsLoading, activeTab]);

  // Fetch company history for History tab and Overview Recent Activity (Phase 3 Task 3.3, 3.4)
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;
    if (activeTab !== "history" && activeTab !== "overview") return;
    const supabase = createClient();
    (async () => {
      setHistoryLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_get_company_history", {
          user_id: user.id,
          company_id: companyId,
          page_number: 1,
          page_size: 50,
        });
        if (!err && data && typeof data === "object" && "submissions" in data) {
          const r = data as { submissions: HistorySubmission[] };
          setCompanyHistory(Array.isArray(r.submissions) ? r.submissions : []);
        } else setCompanyHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [user, companyId, permissionsLoading, activeTab]);

  const violationCount = enforcementActions.filter(
    (a) => a.status === "executed" && a.action_type !== "warning"
  ).length;
  const enforcementCount = enforcementActions.length;
  const complianceStatus: "compliant" | "non_compliant" =
    violationCount > 0 ? "non_compliant" : "compliant";

  const [actionsOpen, setActionsOpen] = useState(false);

  const canEditCompany = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
  ].includes(permissions.role as any) && (
    permissions.role === ROLES.COMPANY_ADMIN 
      ? permissions.company_id === companyId 
      : true
  );

  const canCreateProduct = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any) && (
    permissions.role === ROLES.COMPANY_ADMIN || permissions.role === ROLES.COMPANY_MANAGER
      ? permissions.company_id === companyId
      : true
  );

  const filteredEnforcement = enforcementActions.filter((a) => {
    if (enforcementFilterType !== "all" && a.action_type !== enforcementFilterType) return false;
    if (enforcementFilterStatus !== "all" && a.status !== enforcementFilterStatus) return false;
    return true;
  });
  const enforcementByType = { warning: 0, fine: 0, suspension: 0 };
  enforcementActions.forEach((a) => {
    if (a.action_type in enforcementByType) (enforcementByType as any)[a.action_type]++;
  });
  const lastEnforcementDate = enforcementActions.length
    ? enforcementActions.reduce((latest, a) => {
        const t = a.executed_at ? new Date(a.executed_at).getTime() : 0;
        return t > latest ? t : latest;
      }, 0)
    : null;

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/rmm/companies"
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/companies" className="hover:text-text-primary">Companies</Link>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Company Details</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "Company not found"}
          </p>
          <Link
            href="/rmm/companies"
            className="inline-block px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors mt-4"
          >
            Back to Companies
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
          <Link
            href="/rmm/companies"
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/companies" className="hover:text-text-primary">Companies</Link>
              {" > "}
              <span className="text-text-primary">{company.name}</span>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">{company.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
        {canEditCompany && (
          <Link
            href={`/rmm/companies/${companyId}/edit`}
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
                  <Link
                    href={`/audit/logs?entity=company&id=${companyId}`}
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary"
                    onClick={() => setActionsOpen(false)}
                  >
                    View Audit Log
                  </Link>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActionsOpen(false); }}
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary"
                  >
                    Export (coming soon)
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActionsOpen(false); }}
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary"
                  >
                    Deactivate (coming soon)
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActionsOpen(false); }}
                    className="block px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                  >
                    Delete (coming soon)
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Company Information Card */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary">Type</label>
            <p className="text-text-primary font-medium">
              {company.company_type === "ipc" ? "IPC (Industrial Pharmaceutical Company)" : "Wholesaler"}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Status</label>
            <p>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  company.is_active
                    ? "bg-success-50 text-success-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {company.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Registration Number</label>
            <p className="font-mono text-text-primary">{company.registration_number}</p>
          </div>
          {company.tax_id != null && company.tax_id !== "" && (
            <div>
              <label className="text-sm text-text-secondary">Tax ID</label>
              <p className="text-text-primary">{company.tax_id}</p>
            </div>
          )}
          {company.address && (
            <div>
              <label className="text-sm text-text-secondary">Address</label>
              <p className="text-text-primary">{company.address}</p>
            </div>
          )}
          {company.contact_email && (
            <div>
              <label className="text-sm text-text-secondary">Email</label>
              <p className="text-text-primary">{company.contact_email}</p>
            </div>
          )}
          {company.contact_phone && (
            <div>
              <label className="text-sm text-text-secondary">Phone</label>
              <p className="text-text-primary">{company.contact_phone}</p>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Created</label>
            <p className="text-text-primary">
              {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Last Updated</label>
            <p className="text-text-primary">
              {new Date(company.updated_at).toLocaleDateString()}
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
            onClick={() => setActiveTab("products")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "products"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("enforcement")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "enforcement"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Enforcement
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-bg-secondary rounded-lg p-4 animate-pulse">
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-8 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                </>
              ) : (
                <>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Total Products</p>
                    <p className="text-2xl font-semibold text-text-primary">{companyStats?.total_products ?? "-"}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Active Products</p>
                    <p className="text-2xl font-semibold text-text-primary">{companyStats?.active_products ?? "-"}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Total SKUs</p>
                    <p className="text-2xl font-semibold text-text-primary">{companyStats?.total_skus ?? "-"}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Active SKUs</p>
                    <p className="text-2xl font-semibold text-text-primary">{companyStats?.active_skus ?? "-"}</p>
                  </div>
                </>
              )}
            </div>

            {/* Recent Activity (Phase 3 Task 3.4) */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-3">Recent Activity</h3>
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : companyHistory.length === 0 ? (
                <p className="text-sm text-text-secondary">No history available</p>
              ) : (
                <ul className="space-y-2">
                  {companyHistory.slice(0, 10).map((s) => {
                    const label = s.submission_type === "company_create" ? "Company created" : `${s.entity_type} ${s.submission_type.replace(/_/g, " ")}`;
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

            {/* Regulatory Compliance Status (Phase 2 Task 2.2.1 - Fatima's Requirement) */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-3">Regulatory Compliance Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {complianceStatus === "compliant" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded bg-success-50 text-success-700">
                      <CheckCircle className="w-4 h-4" />
                      ✓ Compliant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded bg-error-50 text-error-700">
                      <AlertTriangle className="w-4 h-4" />
                      ⚠️ Non-Compliant ({violationCount} violation{violationCount !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-primary">
                  Active Enforcement Actions: {enforcementCount}
                </p>
                <p className="text-sm text-text-secondary">
                  Regulatory Framework: DMP Regulations
                </p>
                <p className="text-sm text-text-secondary">
                  Compliance Verification: Last verified —
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={`/enforcement/actions${companyId ? `?company=${companyId}` : ""}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View Detailed Compliance Status
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <RegulatoryFrameworkLink />
                </div>
              </div>
            </div>

            {/* Enforcement History */}
            <div className="border-t border-border-default pt-6">
              <p className="text-sm text-text-primary mb-1">
                {enforcementCount} enforcement action{enforcementCount !== 1 ? "s" : ""} for this company
              </p>
              <Link
                href={`/enforcement/actions${companyId ? `?company=${companyId}` : ""}`}
                className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
              >
                View Enforcement History →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-text-primary">Products</h2>
              <div className="flex items-center gap-3">
                {canCreateProduct && (
                  <Link
                    href={`/rmm/products/new?company_id=${companyId}`}
                    className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Product
                  </Link>
                )}
              <Link
                href={`/rmm/companies/${companyId}/products`}
                className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
              >
                View All Products →
              </Link>
            </div>
            </div>
            {productsLoading ? (
              <div className="overflow-x-auto">
                <div className="h-48 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center">
                <p className="text-text-secondary mb-4">No products found</p>
                {canCreateProduct && (
                  <Link
                    href={`/rmm/products/new?company_id=${companyId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    <Plus className="w-4 h-4" />
                    New Product
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border-default">
                <table className="min-w-full divide-y divide-border-default">
                  <thead className="bg-bg-secondary">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Product Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">ATC Code</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">SKUs</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-bg-secondary/50 cursor-pointer"
                        onClick={() => router.push(`/rmm/products/${p.id}`)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-text-primary">{p.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-text-secondary">{p.atc_code ?? "-"}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">{p.sku_count ?? 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              p.is_active ? "bg-success-50 text-success-700" : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/rmm/products/${p.id}`}
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

        {activeTab === "enforcement" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Enforcement</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Action Type:</span>
                <select
                  value={enforcementFilterType}
                  onChange={(e) => setEnforcementFilterType(e.target.value)}
                  className="rounded border border-border-default px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="warning">Warnings</option>
                  <option value="fine">Fines</option>
                  <option value="suspension">Suspensions</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Status:</span>
                <select
                  value={enforcementFilterStatus}
                  onChange={(e) => setEnforcementFilterStatus(e.target.value)}
                  className="rounded border border-border-default px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="executed">Executed</option>
                  <option value="appealed">Appealed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            {filteredEnforcement.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center text-text-secondary">
                No enforcement actions
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnforcement.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border border-border-default p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {a.action_type === "warning" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                        {a.action_type === "fine" && <DollarSign className="w-5 h-5 text-amber-600" />}
                        {a.action_type === "suspension" && <Ban className="w-5 h-5 text-red-600" />}
                        <span className="font-medium text-text-primary capitalize">{a.action_type}</span>
                        {a.action_type === "fine" && a.amount != null && (
                          <span className="text-sm text-text-secondary">
                            {a.amount} {a.currency ?? "MAD"}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded capitalize",
                          a.status === "executed" && "bg-success-50 text-success-700",
                          a.status === "appealed" && "bg-amber-50 text-amber-700",
                          a.status === "resolved" && "bg-blue-50 text-blue-700",
                          !["executed", "appealed", "resolved"].includes(a.status) && "bg-gray-100 text-gray-700"
                        )}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">
                      Action ID: {a.id.slice(0, 8)}… • {a.executed_at ? new Date(a.executed_at).toLocaleDateString() : "—"}
                    </p>
                    {a.required_action && (
                      <p className="text-sm text-text-primary mb-1">Violation: {a.required_action}</p>
                    )}
                    {a.legal_basis && (
                      <p className="text-sm text-text-primary mb-1">
                        Legal Basis (Fatima&apos;s Requirement): {a.legal_basis}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      {a.appeal_window_open && a.days_remaining != null ? (
                        <span className={cn(
                          "text-sm font-medium",
                          a.days_remaining <= 7 ? "text-red-600" : "text-amber-600"
                        )}>
                          Appeal Window: Open ({a.days_remaining} days remaining)
                        </span>
                      ) : (
                        <span className="text-sm text-text-secondary">Appeal Window: Closed</span>
                      )}
                      <RegulatoryFrameworkLink className="text-sm" />
                      <Link
                        href={`/enforcement/actions/${a.id}`}
                        className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link
                    href={`/enforcement/actions${companyId ? `?company=${companyId}` : ""}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View All Enforcement Actions →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-default">
                  <div className="rounded-lg border border-border-default p-4">
                    <p className="text-sm text-text-secondary mb-1">Total Actions</p>
                    <p className="text-lg font-semibold text-text-primary">
                      Warnings: {enforcementByType.warning} • Fines: {enforcementByType.fine} • Suspensions: {enforcementByType.suspension}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">Total: {enforcementActions.length}</p>
                  </div>
                  <div className="rounded-lg border border-border-default p-4">
                    <p className="text-sm text-text-secondary mb-1">Active Appeals</p>
                    <p className="text-lg font-semibold text-text-primary">
                      Pending: {enforcementActions.filter((x) => x.status === "appealed").length} • Resolved: {enforcementActions.filter((x) => x.status === "resolved").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border-default p-4">
                    <p className="text-sm text-text-secondary mb-1">Compliance Status / Last Action</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {complianceStatus === "compliant" ? "Good" : "Non-compliant"}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Last Action: {lastEnforcementDate ? (() => {
                        const d = new Date(lastEnforcementDate);
                        const days = Math.floor((Date.now() - lastEnforcementDate) / (24 * 60 * 60 * 1000));
                        if (days === 0) return "Today";
                        if (days === 1) return "1 day ago";
                        if (days < 7) return `${days} days ago`;
                        return d.toLocaleDateString();
                      })() : "—"}
                    </p>
                  </div>
                </div>
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
            ) : companyHistory.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center text-text-secondary">
                No history available
              </div>
            ) : (
              <div className="relative space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border-default" />
                {companyHistory.map((s) => {
                  const label = s.submission_type === "company_create" ? "Company created" : `${s.entity_type} ${s.submission_type.replace(/_/g, " ")}`;
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
