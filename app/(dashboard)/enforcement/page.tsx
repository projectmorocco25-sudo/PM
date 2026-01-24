/**
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md
 * Route: /enforcement
 * Implements: Enforcement dashboard page with summary, recent actions, pending approvals, and metrics
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md
 * 
 * Database: enforcement_actions, companies tables
 * RPC Functions: enforcement_get_dashboard_stats(user_id)
 * 
 * Features:
 * - Dashboard statistics (recent actions, pending approvals, metrics)
 * - Recent actions list
 * - Pending approvals with urgency indicators
 * - Enforcement metrics (warnings, fines, suspensions)
 * - Role-based access control (MOH Tier 1 and Tier 2 only)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { AlertTriangle, DollarSign, Ban, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DashboardStats {
  recent_actions_count: number;
  pending_approvals_count: number;
  total_warnings: number;
  total_fines: number;
  total_suspensions: number;
  total_enforcement_actions: number;
  pending_approvals_urgent: number;
  recent_actions: Array<{
    id: string;
    action_type: string;
    company_id: string;
    company_name: string | null;
    legal_basis: string;
    status: string;
    executed_at: string | null;
    created_at: string;
  }>;
  pending_approvals: Array<{
    id: string;
    action_type: string;
    company_id: string;
    company_name: string | null;
    amount: number | null;
    currency: string;
    legal_basis: string;
    status: string;
    created_at: string;
    approved_at: string | null;
    days_since_approval: number | null;
  }>;
}

export default function EnforcementDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("enforcement_get_dashboard_stats", {
          user_id: user.id,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setStats(data as DashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, permissionsLoading]);

  // Check if user can access enforcement
  const canAccess = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  const canCreateAction = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "fine":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "suspension":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getActionTypeIcon = (actionType: string) => {
    switch (actionType) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "fine":
        return <DollarSign className="w-4 h-4" />;
      case "suspension":
        return <Ban className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (daysSinceApproval: number | null) => {
    if (!daysSinceApproval) return "bg-gray-100 text-gray-700";
    if (daysSinceApproval < 3) return "bg-red-50 text-red-700";
    if (daysSinceApproval < 7) return "bg-yellow-50 text-yellow-700";
    return "bg-green-50 text-green-700";
  };

  const getUrgencyIndicator = (daysSinceApproval: number | null) => {
    if (!daysSinceApproval) return null;
    if (daysSinceApproval < 3) return "🔴";
    if (daysSinceApproval < 7) return "🟡";
    return "🟢";
  };

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > Enforcement"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Dashboard</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to access the Enforcement module</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > Enforcement"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Dashboard</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load dashboard</p>
          <p className="text-error-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const urgencyPercentage = stats?.pending_approvals_count
    ? Math.min((stats.pending_approvals_count / 10) * 100, 100)
    : 0;
  const urgencyLevel =
    urgencyPercentage >= 76 ? "High" : urgencyPercentage >= 51 ? "Medium" : "Low";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-text-secondary mb-2">
            <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
            {" > Enforcement"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Enforcement Dashboard</h1>
        </div>
        {canCreateAction && (
          <Link
            href="/enforcement/actions/new"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Action
          </Link>
        )}
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Actions Widget */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Actions</h2>
          <div className="text-3xl font-bold text-text-primary mb-4">
            {stats?.recent_actions_count || 0}
          </div>
          <div className="space-y-3 mb-4">
            {stats?.recent_actions && stats.recent_actions.length > 0 ? (
              stats.recent_actions.slice(0, 3).map((action) => (
                <div
                  key={action.id}
                  className="p-3 bg-bg-secondary rounded-md cursor-pointer hover:bg-bg-secondary/80 transition-colors"
                  onClick={() => router.push(`/enforcement/actions/${action.id}`)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded border flex items-center gap-1",
                          getActionTypeColor(action.action_type)
                        )}
                      >
                        {getActionTypeIcon(action.action_type)}
                        {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-text-primary font-medium">
                    {action.company_name || "Unknown Company"}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {action.legal_basis} • {new Date(action.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">No recent actions</p>
            )}
          </div>
          <Link
            href="/enforcement/actions"
            className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pending Approvals Widget */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Pending Approvals</h2>
          <div className="text-3xl font-bold text-red-600 mb-4">
            {stats?.pending_approvals_count || 0}
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Urgency</span>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  urgencyLevel === "High"
                    ? "bg-red-50 text-red-700"
                    : urgencyLevel === "Medium"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-green-50 text-green-700"
                )}
              >
                {urgencyLevel}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  urgencyPercentage >= 76
                    ? "bg-red-500"
                    : urgencyPercentage >= 51
                    ? "bg-yellow-500"
                    : "bg-green-500"
                )}
                style={{ width: `${urgencyPercentage}%` }}
              />
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {stats?.pending_approvals && stats.pending_approvals.length > 0 ? (
              stats.pending_approvals.slice(0, 3).map((approval) => (
                <div
                  key={approval.id}
                  className="p-3 bg-bg-secondary rounded-md cursor-pointer hover:bg-bg-secondary/80 transition-colors"
                  onClick={() => router.push(`/enforcement/actions/${approval.id}`)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded border flex items-center gap-1",
                          getActionTypeColor(approval.action_type)
                        )}
                      >
                        {getActionTypeIcon(approval.action_type)}
                        {approval.action_type.charAt(0).toUpperCase() + approval.action_type.slice(1)}
                      </span>
                    </div>
                    {approval.days_since_approval !== null && (
                      <span className="text-xs">
                        {getUrgencyIndicator(approval.days_since_approval)}{" "}
                        {approval.days_since_approval < 3
                          ? `${approval.days_since_approval}d deadline`
                          : approval.days_since_approval < 7
                          ? `${approval.days_since_approval}d remaining`
                          : "✓ On-time"}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-primary font-medium">
                    {approval.company_name || "Unknown Company"}
                  </div>
                  {approval.amount && (
                    <div className="text-sm text-text-secondary">
                      {approval.amount} {approval.currency}
                    </div>
                  )}
                  <div className="text-xs text-text-secondary mt-1">
                    {approval.legal_basis}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">No pending approvals</p>
            )}
          </div>
          <Link
            href="/enforcement/pending-approvals"
            className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Enforcement Metrics Widget */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Enforcement Metrics</h2>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-text-primary">Warnings</span>
              </div>
              <span className="text-text-primary font-semibold">{stats?.total_warnings || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-text-primary">Fines</span>
              </div>
              <span className="text-text-primary font-semibold">{stats?.total_fines || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                <span className="text-text-primary">Suspensions</span>
              </div>
              <span className="text-text-primary font-semibold">{stats?.total_suspensions || 0}</span>
            </div>
            <div className="border-t border-border-default pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-text-primary font-medium">Total</span>
                <span className="text-text-primary font-bold">{stats?.total_enforcement_actions || 0}</span>
              </div>
            </div>
          </div>
          <Link
            href="/enforcement/reports"
            className="w-full px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm text-center block"
          >
            View Reports
          </Link>
        </div>
      </div>

      {/* Regulatory Compliance Widget */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Regulatory Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Legal Basis Compliance</p>
            <p className="text-2xl font-bold text-text-primary">
              {stats?.total_enforcement_actions
                ? Math.round((stats.total_enforcement_actions / stats.total_enforcement_actions) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({stats?.total_enforcement_actions || 0}/{stats?.total_enforcement_actions || 0} actions)
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Deadline Compliance</p>
            <p className="text-2xl font-bold text-text-primary">
              {stats?.pending_approvals_count
                ? Math.round(
                    ((stats.pending_approvals_count - stats.pending_approvals_urgent) /
                      stats.pending_approvals_count) *
                      100
                  )
                : 100}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({stats?.pending_approvals_count || 0} pending)
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Regulatory Requirements</p>
            <p className="text-2xl font-bold text-text-primary">
              {stats?.total_enforcement_actions
                ? Math.round((stats.total_enforcement_actions / stats.total_enforcement_actions) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({stats?.total_enforcement_actions || 0}/{stats?.total_enforcement_actions || 0} actions)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
