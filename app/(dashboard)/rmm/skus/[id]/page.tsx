/**
 * Wireframe: task-0.5.2.7-sku-detail.md
 * Route: /rmm/skus/[id]
 * Implements: SKU detail page with tabs (Overview, History)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md
 * 
 * Database: skus, products, companies, registry_submissions tables
 * RPC Functions: 
 *   - rmm_get_sku(user_id, sku_id)
 *   - rmm_get_sku_history(user_id, sku_id, page_number, page_size)
 * 
 * Features:
 * - SKU information display (including pharmaceutical attributes)
 * - Tabbed interface: Overview, History
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
import { Edit, ArrowLeft, Box, History } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SKU {
  id: string;
  sku_code: string;
  name: string;
  product_id: string;
  product_name: string | null;
  company_id: string | null;
  company_name: string | null;
  dosage_strength: string | null;
  dosage_form: string | null;
  pack_size: string | null;
  unit_of_measure: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type Tab = "overview" | "history";

export default function SKUDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [sku, setSku] = useState<SKU | null>(null);
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

  // Fetch SKU
  useEffect(() => {
    if (!user || !skuId || permissionsLoading) return;

    async function fetchSKU() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_sku", {
          user_id: user.id,
          sku_id: skuId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setSku(data as SKU);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load SKU");
      } finally {
        setLoading(false);
      }
    }

    fetchSKU();
  }, [user, skuId, permissionsLoading]);

  const canEditSKU = permissions?.role && [
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

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="space-y-6">
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
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">SKU Details</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "SKU not found"}
          </p>
          <Link
            href="/rmm/skus"
            className="inline-block px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors mt-4"
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
              {" > "}
              <span className="text-text-primary">{sku.name}</span>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">{sku.name}</h1>
          </div>
        </div>
        {canEditSKU && (
          <Link
            href={`/rmm/skus/${skuId}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        )}
      </div>

      {/* SKU Information Card */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">SKU Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary">SKU Code</label>
            <p className="font-mono text-text-primary">{sku.sku_code}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Product</label>
            <p className="text-text-primary font-medium">
              {sku.product_name ? (
                <Link
                  href={`/rmm/products/${sku.product_id}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {sku.product_name}
                </Link>
              ) : (
                "-"
              )}
            </p>
          </div>
          {sku.company_name && (
            <div>
              <label className="text-sm text-text-secondary">Company</label>
              <p className="text-text-primary font-medium">
                <Link
                  href={`/rmm/companies/${sku.company_id}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {sku.company_name}
                </Link>
              </p>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Status</label>
            <p>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  sku.is_active
                    ? "bg-success-50 text-success-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {sku.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          {sku.dosage_strength && (
            <div>
              <label className="text-sm text-text-secondary">Dosage Strength</label>
              <p className="text-text-primary">{sku.dosage_strength}</p>
            </div>
          )}
          {sku.dosage_form && (
            <div>
              <label className="text-sm text-text-secondary">Dosage Form</label>
              <p className="text-text-primary">{sku.dosage_form}</p>
            </div>
          )}
          {sku.pack_size && (
            <div>
              <label className="text-sm text-text-secondary">Pack Size</label>
              <p className="text-text-primary">
                {sku.pack_size} {sku.unit_of_measure || ""}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Created</label>
            <p className="text-text-primary">
              {new Date(sku.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Last Updated</label>
            <p className="text-text-primary">
              {new Date(sku.updated_at).toLocaleDateString()}
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
            <p className="text-sm text-text-secondary">
              SKU overview information and statistics will be displayed here.
            </p>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">History</h2>
            <p className="text-sm text-text-secondary">
              SKU history (registry submissions) will be loaded using `rmm_get_sku_history()` RPC function.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
