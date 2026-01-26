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
import { Edit, ArrowLeft, ExternalLink, AlertCircle, DollarSign, Ban, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";

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

interface HistorySubmission {
  id: string;
  submission_type: string;
  entity_type: string;
  created_at: string;
  updated_at: string;
}

interface EnforcementAction {
  id: string;
  action_type: string;
  status: string;
  legal_basis?: string;
  executed_at: string | null;
  violation_type?: string;
}

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
  const [skuHistory, setSkuHistory] = useState<HistorySubmission[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [enforcementActions, setEnforcementActions] = useState<EnforcementAction[]>([]);

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

  // Fetch SKU history for History tab (Phase 3 Task 3.9)
  useEffect(() => {
    if (!user || !skuId || permissionsLoading || activeTab !== "history") return;
    const supabase = createClient();
    (async () => {
      setHistoryLoading(true);
      try {
        const { data, error: err } = await supabase.rpc("rmm_get_sku_history", {
          user_id: user.id,
          sku_id: skuId,
          page_number: 1,
          page_size: 50,
        });
        if (!err && data && typeof data === "object" && "submissions" in data) {
          const r = data as { submissions: HistorySubmission[] };
          setSkuHistory(Array.isArray(r.submissions) ? r.submissions : []);
        } else setSkuHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [user, skuId, permissionsLoading, activeTab]);

  // Fetch enforcement actions for Overview (Phase 3 Task 3.8) — company-level for SKU's company
  useEffect(() => {
    if (!user || !sku?.company_id || permissionsLoading || activeTab !== "overview") return;
    const supabase = createClient();
    (async () => {
      const { data, error: err } = await supabase.rpc("rmm_get_enforcement_actions", {
        user_id: user.id,
        company_id: sku.company_id,
        p_limit: 20,
      });
      if (!err && Array.isArray(data)) setEnforcementActions(data as EnforcementAction[]);
      else setEnforcementActions([]);
    })();
  }, [user, sku?.company_id, permissionsLoading, activeTab]);

  const [actionsOpen, setActionsOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          {canEditSKU && (
            <Link
              href={`/rmm/skus/${skuId}/edit`}
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
                  <Link href={`/audit/logs?entity=sku&id=${skuId}`} onClick={() => setActionsOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary">View Audit Log</Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary">Export (coming soon)</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary">Deactivate (coming soon)</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActionsOpen(false); }} className="block px-4 py-2 text-sm text-error-600 hover:bg-error-50">Delete (coming soon)</a>
                </div>
              </>
            )}
          </div>
        </div>
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

            {/* Related Submissions (Phase 3 Task 3.8) */}
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-2">Related Submissions</h3>
              <p className="text-sm text-text-secondary mb-2">AAMS, WSL, MSQ submissions including this SKU</p>
              <p className="text-sm text-text-secondary">No related submissions loaded. Use submissions list to filter by SKU.</p>
              <Link href="/rmm/submissions" className="text-primary-600 hover:text-primary-700 hover:underline text-sm mt-2 inline-block">
                View submissions →
              </Link>
            </div>

            {/* Export Requests (if ECS active) */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-2">Export Requests</h3>
              <p className="text-sm text-text-secondary">Export requests for this SKU (ECS module).</p>
              <p className="text-sm text-text-secondary mt-1">No export requests.</p>
            </div>

            {/* Compliance Violations */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-2">Compliance Violations</h3>
              <p className="text-sm text-text-secondary">Threshold breaches and other violations related to this SKU.</p>
              <p className="text-sm text-text-secondary mt-1">No compliance violations.</p>
            </div>

            {/* Enforcement Actions (Phase 3 Task 3.8) */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-2">Enforcement Actions</h3>
              <p className="text-sm text-text-secondary mb-3">Company-level enforcement actions (this SKU&apos;s company).</p>
              {enforcementActions.length === 0 ? (
                <p className="text-sm text-text-secondary">No enforcement actions.</p>
              ) : (
                <div className="space-y-3">
                  {enforcementActions.map((a) => (
                    <div key={a.id} className="rounded-lg border border-border-default p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {a.action_type === "warning" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                        {a.action_type === "fine" && <DollarSign className="w-4 h-4 text-amber-600" />}
                        {a.action_type === "suspension" && <Ban className="w-4 h-4 text-red-600" />}
                        <span className="font-medium text-sm capitalize">{a.action_type}</span>
                        <span className="text-xs text-text-secondary">— {a.id.slice(0, 8)}…</span>
                        <span className="text-xs text-text-secondary">
                          {a.executed_at ? new Date(a.executed_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      {a.legal_basis && (
                        <div className="text-sm text-text-primary mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span>Legal Basis: {a.legal_basis}</span>
                          <RegulatoryFrameworkLink className="text-primary-600" label="View Framework" />
                        </div>
                      )}
                      <Link
                        href={`/enforcement/actions/${a.id}`}
                        className="text-primary-600 hover:text-primary-700 hover:underline text-sm mt-1 inline-block"
                      >
                        View Enforcement Action Detail →
                      </Link>
                    </div>
                  ))}
                  <Link
                    href={sku?.company_id ? `/enforcement/actions?company=${sku.company_id}` : "/enforcement/actions"}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm inline-block"
                  >
                    View All Enforcement Actions →
                  </Link>
                </div>
              )}
            </div>

            {/* Regulatory Compliance (Phase 2 Task 2.2.3 - Fatima's Requirement) */}
            <div className="border-t border-border-default pt-6">
              <h3 className="text-base font-semibold text-text-primary mb-3">Regulatory Compliance</h3>
              <div className="space-y-2 text-sm">
                <p className="text-text-secondary">Regulatory Framework: DMP Art. 15 – Stock Monitoring</p>
                <p className="text-text-primary">
                  Compliance Status:{" "}
                  <Link href="/cmc/scores" className="text-primary-600 hover:text-primary-700 hover:underline">
                    View Compliance Score
                  </Link>
                </p>
                <div className="pt-2">
                  <RegulatoryFrameworkLink />
                </div>
              </div>
            </div>
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
            ) : skuHistory.length === 0 ? (
              <div className="rounded-lg border border-border-default p-8 text-center text-text-secondary">
                No history available
              </div>
            ) : (
              <div className="relative space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border-default" />
                {skuHistory.map((s) => {
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
