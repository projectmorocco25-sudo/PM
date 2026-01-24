/**
 * Wireframe: task-0.5.2.1-enforcement-actions-list.md
 * Route: /enforcement/actions
 * Implements: Enforcement actions list page with search, filters, table, and pagination
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md
 * 
 * Database: enforcement_actions, companies tables
 * RPC Functions: enforcement_list_actions(user_id, limit_count, offset_count, status_filter, action_type_filter, company_id_filter, search_term, sort_by, sort_order)
 * 
 * Features:
 * - Search enforcement actions
 * - Filter by status, action type, company
 * - Sortable columns
 * - Pagination
 * - Role-based access control (MOH Tier 1, Tier 2, Company users see own)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { Search, Filter, X, Eye, AlertTriangle, DollarSign, Ban, ChevronUp, ChevronDown, Gavel } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EnforcementAction {
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
  updated_at: string;
  executed_at: string | null;
}

interface ActionsResponse {
  data: EnforcementAction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

type SortField = "created_at" | "updated_at" | "executed_at" | "action_type" | "status" | "amount";
type SortOrder = "asc" | "desc";

export default function EnforcementActionsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [actions, setActions] = useState<EnforcementAction[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [actionTypeFilter, setActionTypeFilter] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load companies for filter (MOH users only)
  useEffect(() => {
    if (!user || permissionsLoading) return;
    if (isCompanyRole(permissions?.role as any)) return; // Company users don't need company filter

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
  }, [user, permissionsLoading, permissions?.role]);

  // Fetch actions
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchActions() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const offset = (pageNumber - 1) * pageSize;
        const { data, error: rpcError } = await supabase.rpc("enforcement_list_actions", {
          user_id: user.id,
          limit_count: pageSize,
          offset_count: offset,
          status_filter: statusFilter,
          action_type_filter: actionTypeFilter,
          company_id_filter: companyFilter,
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as ActionsResponse;
        
        if (pageNumber === 1) {
          setActions(response.data || []);
        } else {
          setActions((prev) => [...prev, ...(response.data || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enforcement actions");
      } finally {
        setLoading(false);
      }
    }

    fetchActions();
  }, [user, permissionsLoading, pageNumber, pageSize, statusFilter, actionTypeFilter, companyFilter, searchTerm, sortBy, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setActions([]);
  }, [statusFilter, actionTypeFilter, companyFilter, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setActionTypeFilter(null);
    setCompanyFilter(null);
    setSortBy("created_at");
    setSortOrder("desc");
    setPageNumber(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-50 text-blue-700";
      case "tier2_reviewed":
        return "bg-yellow-50 text-yellow-700";
      case "tier1_approved":
        return "bg-green-50 text-green-700";
      case "executed":
        return "bg-green-50 text-green-700";
      case "appealed":
        return "bg-purple-50 text-purple-700";
      case "resolved":
        return "bg-gray-50 text-gray-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  const canAccess = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
    ROLES.COMPANY_USER,
  ].includes(permissions.role as any);

  if (permissionsLoading || loading && actions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
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
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > Actions"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Actions</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to view enforcement actions</p>
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

  if (error && actions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > Actions"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Actions</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load enforcement actions</p>
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
            {" > Actions"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Enforcement Actions</h1>
        </div>
        {!isCompanyRole(permissions?.role as any) && (
          <Link
            href="/enforcement/actions/new"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
          >
            New Action
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search enforcement actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(
            "px-4 py-2 border border-border-default rounded-md flex items-center gap-2",
            "hover:bg-bg-secondary transition-colors",
            filtersOpen && "bg-bg-secondary"
          )}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filters Sidebar and Table */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside
          className={cn(
            "w-60 bg-bg-primary border border-border-default rounded-lg p-4 space-y-4",
            "hidden md:block",
            !filtersOpen && "md:hidden"
          )}
        >
          <h2 className="font-semibold text-text-primary">Filters</h2>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="tier2_reviewed">Tier 2 Reviewed</option>
              <option value="tier1_approved">Tier 1 Approved</option>
              <option value="executed">Executed</option>
              <option value="appealed">Appealed</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Action Type</label>
            <select
              value={actionTypeFilter || ""}
              onChange={(e) => setActionTypeFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="warning">Warning</option>
              <option value="fine">Fine</option>
              <option value="suspension">Suspension</option>
            </select>
          </div>

          {/* Company Filter (MOH only) */}
          {!isCompanyRole(permissions?.role as any) && (
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Company</label>
              <select
                value={companyFilter || ""}
                onChange={(e) => setCompanyFilter(e.target.value || null)}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm"
          >
            Clear Filters
          </button>
        </aside>

        {/* Mobile Filters Drawer */}
        {filtersOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-60 bg-bg-primary border-r border-border-default p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Same filter content as desktop */}
            </aside>
          </div>
        )}

        {/* Actions Table */}
        <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
          {actions.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <Gavel className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-2">
                {searchTerm || statusFilter || actionTypeFilter || companyFilter
                  ? "No actions match your filters"
                  : "No enforcement actions found"}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {searchTerm || statusFilter || actionTypeFilter || companyFilter
                  ? "Try adjusting your filters"
                  : "Enforcement actions will appear here once created"}
              </p>
              {searchTerm || statusFilter || actionTypeFilter || companyFilter ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                !isCompanyRole(permissions?.role as any) && (
                  <Link
                    href="/enforcement/actions/new"
                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    New Action
                  </Link>
                )
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-secondary border-b border-border-default">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Action</th>
                      {!isCompanyRole(permissions?.role as any) && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Company</th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Status
                          {sortBy === "status" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Legal Basis</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("created_at")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Date
                          {sortBy === "created_at" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {actions.map((action) => (
                      <tr
                        key={action.id}
                        className="hover:bg-bg-secondary cursor-pointer transition-colors"
                        onClick={() => router.push(`/enforcement/actions/${action.id}`)}
                      >
                        <td className="px-4 py-3">
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
                            {action.amount && (
                              <span className="text-sm text-text-primary">
                                {action.amount} {action.currency}
                              </span>
                            )}
                          </div>
                        </td>
                        {!isCompanyRole(permissions?.role as any) && (
                          <td className="px-4 py-3">
                            {action.company_name ? (
                              <Link
                                href={`/rmm/companies/${action.company_id}`}
                                className="text-text-secondary hover:text-primary-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {action.company_name}
                              </Link>
                            ) : (
                              <span className="text-text-secondary text-sm">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              getStatusBadgeColor(action.status)
                            )}
                          >
                            {formatStatus(action.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-primary">{action.legal_basis}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-text-primary">
                            {new Date(action.created_at).toLocaleDateString()}
                          </div>
                          {action.executed_at && (
                            <div className="text-xs text-text-secondary">
                              Executed: {new Date(action.executed_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/enforcement/actions/${action.id}`}
                              className="p-2 text-text-secondary hover:text-primary-500 hover:bg-bg-secondary rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-border-default">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => router.push(`/enforcement/actions/${action.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded border flex items-center gap-1",
                              getActionTypeColor(action.action_type)
                            )}
                          >
                            {getActionTypeIcon(action.action_type)}
                            {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)}
                          </span>
                          {action.amount && (
                            <span className="text-sm text-text-primary font-medium">
                              {action.amount} {action.currency}
                            </span>
                          )}
                        </div>
                        {!isCompanyRole(permissions?.role as any) && action.company_name && (
                          <div className="text-sm text-text-primary">
                            <Link
                              href={`/rmm/companies/${action.company_id}`}
                              className="text-primary-600 hover:text-primary-700 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {action.company_name}
                            </Link>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/enforcement/actions/${action.id}`}
                        className="p-2 text-text-secondary hover:text-primary-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded",
                          getStatusBadgeColor(action.status)
                        )}
                      >
                        {formatStatus(action.status)}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(action.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">{action.legal_basis}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-border-default p-4 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {actions.length} of {totalCount} actions
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
