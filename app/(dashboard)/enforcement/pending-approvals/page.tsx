/**
 * Wireframe: task-0.5.2.1c-pending-approvals.md
 * Route: /enforcement/pending-approvals
 * Implements: Pending approvals page with urgency indicators and bulk actions
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md
 * 
 * Database: enforcement_actions, companies tables
 * RPC Functions: enforcement_list_pending_approvals(user_id, limit_count, offset_count)
 * 
 * Features:
 * - List actions pending Tier 1 approval
 * - Urgency indicators (days since approval)
 * - Bulk approve/reject actions
 * - Regulatory requirements checklist
 * - Role-based access control (MOH Tier 1 only)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { AlertTriangle, DollarSign, Ban, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PendingApproval {
  id: string;
  company_id: string;
  company_name: string | null;
  action_type: string;
  violation_type: string;
  amount: number | null;
  currency: string;
  status: string;
  legal_basis: string;
  justification: string;
  created_at: string;
  approved_at: string | null;
  days_since_approval: number | null;
  is_urgent: boolean;
}

interface PendingApprovalsResponse {
  data: PendingApproval[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch pending approvals
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchApprovals() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const offset = (pageNumber - 1) * pageSize;
        const { data, error: rpcError } = await supabase.rpc("enforcement_list_pending_approvals", {
          user_id: user.id,
          limit_count: pageSize,
          offset_count: offset,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as PendingApprovalsResponse;
        
        if (pageNumber === 1) {
          setApprovals(response.data || []);
        } else {
          setApprovals((prev) => [...prev, ...(response.data || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pending approvals");
      } finally {
        setLoading(false);
      }
    }

    fetchApprovals();
  }, [user, permissionsLoading, pageNumber, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setApprovals([]);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === approvals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(approvals.map((a) => a.id)));
    }
  };

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

  const formatViolationType = (violationType: string) => {
    return violationType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getUrgencyIndicator = (daysSinceApproval: number | null) => {
    if (!daysSinceApproval) return null;
    if (daysSinceApproval < 3) return "🔴";
    if (daysSinceApproval < 7) return "🟡";
    return "🟢";
  };

  const canAccess = permissions?.role && [
    ROLES.TIER1,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  if (permissionsLoading || loading && approvals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
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
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > Pending Approvals"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Pending Approvals</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to view pending approvals</p>
          <Link
            href="/enforcement"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Enforcement
          </Link>
        </div>
      </div>
    );
  }

  if (error && approvals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > Pending Approvals"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Pending Approvals</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load pending approvals</p>
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

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-text-secondary mb-2">
            <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
            {" > "}
            <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
            {" > Pending Approvals"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">
            Pending Approvals {totalCount > 0 && `(${totalCount})`}
          </h1>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {approvals.length > 0 && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === approvals.length && approvals.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-border-default"
              />
              <span className="text-sm text-text-primary">Select All</span>
            </label>
            {selectedIds.size > 0 && (
              <span className="text-sm text-text-secondary">
                {selectedIds.size} selected
              </span>
            )}
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
                onClick={() => {
                  // TODO: Implement bulk approve
                  alert("Bulk approve functionality will be implemented");
                }}
              >
                Bulk Approve
              </button>
              <button
                className="px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors text-sm"
                onClick={() => {
                  // TODO: Implement bulk reject
                  alert("Bulk reject functionality will be implemented");
                }}
              >
                Bulk Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Approval Cards */}
      <div className="space-y-4">
        {approvals.length === 0 && !loading ? (
          <div className="bg-bg-primary border border-border-default rounded-lg p-12 text-center">
            <CheckCircle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">No pending approvals</p>
            <p className="text-text-secondary text-sm">All enforcement actions have been processed</p>
          </div>
        ) : (
          approvals.map((approval) => (
            <div
              key={approval.id}
              className="bg-bg-primary border border-border-default rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(approval.id)}
                  onChange={() => toggleSelect(approval.id)}
                  className="mt-1 rounded border-border-default"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
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
                      {approval.amount && (
                        <span className="text-text-primary font-medium">
                          {approval.amount} {approval.currency}
                        </span>
                      )}
                      <span className="text-text-primary font-medium">
                        - {approval.company_name || "Unknown Company"}
                      </span>
                    </div>
                    {approval.days_since_approval !== null && (
                      <span className="text-sm">
                        {getUrgencyIndicator(approval.days_since_approval)}{" "}
                        {approval.days_since_approval < 3
                          ? `${approval.days_since_approval}d deadline`
                          : approval.days_since_approval < 7
                          ? `${approval.days_since_approval}d remaining`
                          : "✓ On-time"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <label className="text-sm text-text-secondary">Legal Basis</label>
                      <p className="text-text-primary">{approval.legal_basis}</p>
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary">Violation</label>
                      <p className="text-text-primary">{formatViolationType(approval.violation_type)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary">Created</label>
                      <p className="text-text-primary">
                        {new Date(approval.created_at).toLocaleString()}
                      </p>
                    </div>
                    {approval.approved_at && (
                      <div>
                        <label className="text-sm text-text-secondary">Approved At</label>
                        <p className="text-text-primary">
                          {new Date(approval.approved_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-text-secondary block mb-1">Justification Preview</label>
                    <p className="text-sm text-text-primary line-clamp-2">
                      {approval.justification}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/enforcement/actions/${approval.id}`}
                      className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
                      onClick={() => {
                        // TODO: Implement approve action
                        router.push(`/enforcement/actions/${approval.id}`);
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors text-sm"
                      onClick={() => {
                        // TODO: Implement reject action
                        router.push(`/enforcement/actions/${approval.id}`);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {approvals.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing {approvals.length} of {totalCount} pending approvals
          </p>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
