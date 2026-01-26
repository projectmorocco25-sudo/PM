/**
 * Wireframe: task-0.5.2.11-registry-submission-list.md
 * Route: /rmm/submissions
 * Implements: Registry submission list page with workflow status, filters, and role-based views
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md
 * 
 * Database: registry_submissions, companies, products, skus tables
 * RPC Functions: rmm_list_submissions(user_id, limit, offset, status, submission_type, entity_type, company_id, search, sort_by, sort_order)
 * 
 * Features:
 * - List registry submissions with workflow status
 * - Filter by status, type, entity type
 * - Role-based views (Company users see own, MOH see all)
 * - Pagination
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { Search, Filter, X, Eye, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";

interface Submission {
  id: string;
  submission_type: string;
  entity_type: string;
  entity_id: string;
  submission_data: any;
  status: string;
  submitted_by: string;
  submitted_by_name: string | null;
  verified_by: string | null;
  verified_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  implemented_by: string | null;
  implemented_at: string | null;
  rejection_reason: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

interface SubmissionsResponse {
  data: Submission[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

type SortField = "created_at" | "updated_at" | "status" | "submission_type" | "entity_type";
type SortOrder = "asc" | "desc";
type StatusFilter = string | null;
type EntityTypeFilter = string | null;
type SubmissionTypeFilter = string | null;

export default function RegistrySubmissionsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityTypeFilter>(null);
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState<SubmissionTypeFilter>(null);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRangePreset, setDateRangePreset] = useState<"last7" | "last30" | "custom" | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getDateRange = () => {
    if (!dateRangePreset) return { from: null as string | null, to: null as string | null };
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    if (dateRangePreset === "last7") {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      return { from: d.toISOString().slice(0, 10), to };
    }
    if (dateRangePreset === "last30") {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      return { from: d.toISOString().slice(0, 10), to };
    }
    if (dateRangePreset === "custom" && dateFrom && dateTo) return { from: dateFrom, to: dateTo };
    return { from: null, to: null };
  };
  const { from: pDateFrom, to: pDateTo } = getDateRange();

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch submissions
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const offset = (pageNumber - 1) * pageSize;
        const { data, error: rpcError } = await supabase.rpc("rmm_list_submissions", {
          p_limit: pageSize,
          p_offset: offset,
          p_status: statusFilter,
          p_submission_type: submissionTypeFilter,
          p_entity_type: entityTypeFilter,
          p_company_id: null,
          p_search: searchTerm || null,
          p_sort_by: sortBy,
          p_sort_order: sortOrder,
          p_date_from: pDateFrom || null,
          p_date_to: pDateTo || null,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as SubmissionsResponse;
        
        if (pageNumber === 1) {
          setSubmissions(response.data || []);
        } else {
          setSubmissions((prev) => [...prev, ...(response.data || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [user, permissionsLoading, pageNumber, pageSize, statusFilter, entityTypeFilter, submissionTypeFilter, searchTerm, sortBy, sortOrder, pDateFrom, pDateTo]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setSubmissions([]);
  }, [statusFilter, entityTypeFilter, submissionTypeFilter, searchTerm, sortBy, sortOrder, dateRangePreset, dateFrom, dateTo]);

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
    setEntityTypeFilter(null);
    setSubmissionTypeFilter(null);
    setSortBy("created_at");
    setSortOrder("desc");
    setDateRangePreset(null);
    setDateFrom("");
    setDateTo("");
    setPageNumber(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-50 text-blue-700";
      case "tier2_verified":
      case "tier2_peer_reviewed":
        return "bg-yellow-50 text-yellow-700";
      case "tier1_approved":
        return "bg-green-50 text-green-700";
      case "completed":
        return "bg-green-50 text-green-700";
      case "rejected":
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

  if (permissionsLoading || loading && submissions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > Submissions"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isCompanyRole(permissions?.role as any) ? "My Submissions" : "All Submissions"}
            </h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load submissions</p>
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
            <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
            {" > Submissions"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">
            {isCompanyRole(permissions?.role as any) ? "My Submissions" : "All Submissions"}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search submissions..."
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

      {/* Submission Deadlines Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-600">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium mb-1">Submission Deadlines</p>
            <p className="text-xs text-blue-700">
              Regulatory: DMP Regulation Article 10 - Registry Submission Requirements
            </p>
            <RegulatoryFrameworkLink className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-flex items-center gap-1" />
          </div>
        </div>
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
              <option value="tier2_verified">Tier 2 Verified</option>
              <option value="tier2_peer_reviewed">Tier 2 Peer Reviewed</option>
              <option value="tier1_approved">Tier 1 Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Entity Type</label>
            <select
              value={entityTypeFilter || ""}
              onChange={(e) => setEntityTypeFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="company">Company</option>
              <option value="product">Product</option>
              <option value="sku">SKU</option>
            </select>
          </div>

          {/* Submission Type Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Submission Type</label>
            <select
              value={submissionTypeFilter || ""}
              onChange={(e) => setSubmissionTypeFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="company_create">Company Create</option>
              <option value="company_update">Company Update</option>
              <option value="product_create">Product Create</option>
              <option value="product_update">Product Update</option>
              <option value="sku_create">SKU Create</option>
              <option value="sku_update">SKU Update</option>
            </select>
          </div>

          {/* Date Range Filter (Phase 4 Task 4.1) */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Date</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateRange" checked={dateRangePreset === null} onChange={() => setDateRangePreset(null)} className="border-border-default" />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateRange" checked={dateRangePreset === "last7"} onChange={() => setDateRangePreset("last7")} className="border-border-default" />
                <span className="text-sm text-text-secondary">Last 7 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateRange" checked={dateRangePreset === "last30"} onChange={() => setDateRangePreset("last30")} className="border-border-default" />
                <span className="text-sm text-text-secondary">Last 30 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateRange" checked={dateRangePreset === "custom"} onChange={() => setDateRangePreset("custom")} className="border-border-default" />
                <span className="text-sm text-text-secondary">Custom</span>
              </label>
              {dateRangePreset === "custom" && (
                <div className="pl-5 space-y-2">
                  <div>
                    <label className="text-xs text-text-secondary">From</label>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">To</label>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

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
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
                <select value={statusFilter || ""} onChange={(e) => setStatusFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="tier2_verified">Tier 2 Verified</option>
                  <option value="tier2_peer_reviewed">Tier 2 Peer Reviewed</option>
                  <option value="tier1_approved">Tier 1 Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Entity Type</label>
                <select value={entityTypeFilter || ""} onChange={(e) => setEntityTypeFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All Types</option>
                  <option value="company">Company</option>
                  <option value="product">Product</option>
                  <option value="sku">SKU</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Submission Type</label>
                <select value={submissionTypeFilter || ""} onChange={(e) => setSubmissionTypeFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All Types</option>
                  <option value="company_create">Company Create</option>
                  <option value="company_update">Company Update</option>
                  <option value="product_create">Product Create</option>
                  <option value="product_update">Product Update</option>
                  <option value="sku_create">SKU Create</option>
                  <option value="sku_update">SKU Update</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Date</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dateRange-m" checked={dateRangePreset === null} onChange={() => setDateRangePreset(null)} className="border-border-default" />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dateRange-m" checked={dateRangePreset === "last7"} onChange={() => setDateRangePreset("last7")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Last 7 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dateRange-m" checked={dateRangePreset === "last30"} onChange={() => setDateRangePreset("last30")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Last 30 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dateRange-m" checked={dateRangePreset === "custom"} onChange={() => setDateRangePreset("custom")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Custom</span>
                  </label>
                  {dateRangePreset === "custom" && (
                    <div className="pl-5 space-y-2">
                      <div>
                        <label className="text-xs text-text-secondary">From</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-text-secondary">To</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={clearFilters} className="w-full px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm">
                Clear Filters
              </button>
            </aside>
          </div>
        )}

        {/* Submissions Table */}
        <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
          {submissions.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-2">
                {searchTerm || statusFilter || entityTypeFilter || submissionTypeFilter || dateRangePreset
                  ? "No submissions match your filters"
                  : "No submissions found"}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {searchTerm || statusFilter || entityTypeFilter || submissionTypeFilter || dateRangePreset
                  ? "Try adjusting your filters"
                  : "Submissions will appear here once created"}
              </p>
              {(searchTerm || statusFilter || entityTypeFilter || submissionTypeFilter || dateRangePreset) ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-secondary border-b border-border-default">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Entity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Type</th>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Deadline</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {submissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className="hover:bg-bg-secondary cursor-pointer transition-colors"
                        onClick={() => router.push(`/rmm/submissions/${submission.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-text-primary">
                              {submission.company_name || submission.entity_type}
                            </div>
                            <div className="text-xs text-text-secondary capitalize">
                              {submission.entity_type}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-primary capitalize">
                            {submission.submission_type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              getStatusBadgeColor(submission.status)
                            )}
                          >
                            {formatStatus(submission.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-text-primary">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {submission.submitted_by_name || "Unknown"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-secondary">—</span>
                          <div className="text-xs text-text-secondary">Regulatory: DMP Art. 10</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/rmm/submissions/${submission.id}`}
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
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => router.push(`/rmm/submissions/${submission.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-text-primary">
                          {submission.company_name || submission.entity_type}
                        </div>
                        <div className="text-xs text-text-secondary capitalize mt-1">
                          {submission.entity_type} • {submission.submission_type.replace("_", " ")}
                        </div>
                      </div>
                      <Link
                        href={`/rmm/submissions/${submission.id}`}
                        className="p-2 text-text-secondary hover:text-primary-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded",
                          getStatusBadgeColor(submission.status)
                        )}
                      >
                        {formatStatus(submission.status)}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-text-secondary">Deadline: —</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-border-default p-4 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {submissions.length} of {totalCount} submissions
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
