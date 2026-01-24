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
import { Edit, Building2, ArrowLeft, Package, AlertTriangle, History } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type Tab = "overview" | "products" | "enforcement" | "history";

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
        {canEditCompany && (
          <Link
            href={`/rmm/companies/${companyId}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Total Products</p>
                <p className="text-2xl font-semibold text-text-primary">-</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-1">Active Products</p>
                <p className="text-2xl font-semibold text-text-primary">-</p>
              </div>
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
              Product and SKU statistics will be loaded from the Products tab data.
            </p>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Products</h2>
              <Link
                href={`/rmm/companies/${companyId}/products`}
                className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
              >
                View All Products →
              </Link>
            </div>
            <p className="text-sm text-text-secondary">
              Products list will be implemented in Task 1.1.2.18a (Company products page).
            </p>
          </div>
        )}

        {activeTab === "enforcement" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Enforcement</h2>
            <p className="text-sm text-text-secondary">
              Enforcement actions will be displayed here. This requires integration with the Enforcement module.
            </p>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">History</h2>
            <p className="text-sm text-text-secondary">
              Company history (registry submissions) will be loaded using `rmm_get_company_history()` RPC function.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
