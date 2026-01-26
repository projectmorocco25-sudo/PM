/**
 * Wireframe: task-0.5.2.2-companies-list.md
 * Route: /rmm/companies
 * Implements: Companies list page with search, filters, table, and pagination
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md
 * 
 * Database: companies table
 * RPC Functions: rmm_list_companies(user_id, page_number, page_size, company_type_filter, search_term, sort_by, sort_order)
 * 
 * Features:
 * - Search companies by name or registration number
 * - Filter by company type (IPC, Wholesaler)
 * - Filter by status (Active, Inactive) - client-side filtering
 * - Sortable columns (Name, Registration Number, Type, Status)
 * - Compliance Status column (Fatima's Requirement): ✓ Compliant, ⚠️ [X] violations, 🟡 Under Review; 🔴 Enforcement: [X]; link to detailed compliance
 * - Pagination with "Load More" button
 * - Role-based access control
 * - Responsive design (table on desktop, cards on mobile)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { Search, Filter, X, Eye, Edit, ChevronUp, ChevronDown, Building2, CheckCircle, AlertTriangle, Clock, ExternalLink } from "lucide-react";
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
  /** Phase 2 Task 2.1 - Fatima's Requirement. From rmm_list_companies. */
  compliance_status?: "compliant" | "non_compliant" | "under_review";
  violation_count?: number;
  enforcement_count?: number;
}

interface CompaniesResponse {
  companies: Company[];
  pagination: {
    total?: number;
    total_count?: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more?: boolean;
  };
}

type SortField = "name" | "registration_number" | "company_type" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";
type CompanyTypeFilter = "ipc" | "wholesaler" | null;
type StatusFilter = "all" | "active" | "inactive";

export default function CompaniesListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyTypeFilter, setCompanyTypeFilter] = useState<CompanyTypeFilter>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRangePreset, setDateRangePreset] = useState<"last7" | "last30" | "custom" | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [companyOptions, setCompanyOptions] = useState<Array<{ id: string; name: string }>>([]);

  const isMOH = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  // Derive p_date_from, p_date_to for RPC (Phase 4 Task 4.1)
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

  // Fetch companies
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchCompanies() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_companies", {
          user_id: user.id,
          page_number: pageNumber,
          page_size: pageSize,
          company_type_filter: companyTypeFilter,
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
          p_date_from: pDateFrom || null,
          p_date_to: pDateTo || null,
          p_company_id: companyFilter || null,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as CompaniesResponse;
        
        if (pageNumber === 1) {
          setCompanies(response.companies || []);
        } else {
          setCompanies((prev) => [...prev, ...(response.companies || [])]);
        }
        
        const p = response.pagination;
        setTotalCount(p.total ?? p.total_count ?? 0);
        setHasMore(p.has_more ?? (p.page_number < (p.total_pages ?? 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load companies");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [user, permissionsLoading, pageNumber, pageSize, companyTypeFilter, searchTerm, sortBy, sortOrder, pDateFrom, pDateTo, companyFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setCompanies([]);
  }, [companyTypeFilter, searchTerm, sortBy, sortOrder, dateRangePreset, dateFrom, dateTo, companyFilter]);

  // Fetch company options for Company filter (MOH only) — Phase 6 Task 6.7
  useEffect(() => {
    if (!user || !isMOH || permissionsLoading) return;
    async function fetchCompanyOptions() {
      try {
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_companies", {
          user_id: user.id,
          page_number: 1,
          page_size: 500,
          company_type_filter: null,
          search_term: null,
          sort_by: "name",
          sort_order: "asc",
          p_date_from: null,
          p_date_to: null,
          p_company_id: null,
        });
        if (rpcError) return;
        const res = data as CompaniesResponse;
        const list = res?.companies ?? [];
        setCompanyOptions(list.map((c) => ({ id: c.id, name: c.name })));
      } catch {
        /* ignore */
      }
    }
    fetchCompanyOptions();
  }, [user, isMOH, permissionsLoading]);

  // Client-side status filtering
  const filteredCompanies = companies.filter((company) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return company.is_active;
    if (statusFilter === "inactive") return !company.is_active;
    return true;
  });

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
    setCompanyTypeFilter(null);
    setStatusFilter("active");
    setSortBy("name");
    setSortOrder("asc");
    setDateRangePreset(null);
    setDateFrom("");
    setDateTo("");
    setCompanyFilter(null);
    setPageNumber(1);
  };

  const canCreateCompany = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  const canEditCompany = (company: Company) => {
    if (!permissions?.role) return false;
    const role = permissions.role;
    
    // MOH and System Admin can edit any company
    if ([ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.SYSTEM_ADMIN].includes(role as any)) {
      return true;
    }
    
    // Company Admin can edit their own company
    if (role === ROLES.COMPANY_ADMIN && permissions.company_id === company.id) {
      return true;
    }
    
    return false;
  };

  if (permissionsLoading || loading && companies.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
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

  if (error && companies.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > Companies"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Companies</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load companies</p>
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
            {" > Companies"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Companies</h1>
        </div>
        {canCreateCompany && (
          <Link
            href="/rmm/companies/new"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
          >
            New Company
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search companies..."
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

          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={companyTypeFilter === null}
                  onChange={() => setCompanyTypeFilter(null)}
                  className="rounded border-border-default"
                />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={companyTypeFilter === "ipc"}
                  onChange={() => setCompanyTypeFilter(companyTypeFilter === "ipc" ? null : "ipc")}
                  className="rounded border-border-default"
                />
                <span className="text-sm text-text-secondary">IPC</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={companyTypeFilter === "wholesaler"}
                  onChange={() => setCompanyTypeFilter(companyTypeFilter === "wholesaler" ? null : "wholesaler")}
                  className="rounded border-border-default"
                />
                <span className="text-sm text-text-secondary">Wholesaler</span>
              </label>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === "all"}
                  onChange={() => setStatusFilter("all")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === "active"}
                  onChange={() => setStatusFilter("active")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === "inactive"}
                  onChange={() => setStatusFilter("inactive")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Inactive</span>
              </label>
            </div>
          </div>

          {/* Company Filter (Phase 6 Task 6.7 — MOH only) */}
          {isMOH && (
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Company</label>
              <select
                value={companyFilter ?? ""}
                onChange={(e) => setCompanyFilter(e.target.value || null)}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
              >
                <option value="">All</option>
                {companyOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filter (Phase 4 Task 4.1) */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Date</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  checked={dateRangePreset === null}
                  onChange={() => setDateRangePreset(null)}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  checked={dateRangePreset === "last7"}
                  onChange={() => setDateRangePreset("last7")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Last 7 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  checked={dateRangePreset === "last30"}
                  onChange={() => setDateRangePreset("last30")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Last 30 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  checked={dateRangePreset === "custom"}
                  onChange={() => setDateRangePreset("custom")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Custom</span>
              </label>
              {dateRangePreset === "custom" && (
                <div className="pl-5 space-y-2">
                  <div>
                    <label className="text-xs text-text-secondary">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm"
                    />
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
              {/* Same filter content as desktop */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={companyTypeFilter === null}
                      onChange={() => setCompanyTypeFilter(null)}
                      className="rounded border-border-default"
                    />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={companyTypeFilter === "ipc"}
                      onChange={() => setCompanyTypeFilter(companyTypeFilter === "ipc" ? null : "ipc")}
                      className="rounded border-border-default"
                    />
                    <span className="text-sm text-text-secondary">IPC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={companyTypeFilter === "wholesaler"}
                      onChange={() => setCompanyTypeFilter(companyTypeFilter === "wholesaler" ? null : "wholesaler")}
                      className="rounded border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Wholesaler</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status-mobile"
                      checked={statusFilter === "all"}
                      onChange={() => setStatusFilter("all")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status-mobile"
                      checked={statusFilter === "active"}
                      onChange={() => setStatusFilter("active")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status-mobile"
                      checked={statusFilter === "inactive"}
                      onChange={() => setStatusFilter("inactive")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Inactive</span>
                  </label>
                </div>
              </div>
              {isMOH && (
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Company</label>
                  <select
                    value={companyFilter ?? ""}
                    onChange={(e) => setCompanyFilter(e.target.value || null)}
                    className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
                  >
                    <option value="">All</option>
                    {companyOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Date</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange-mobile"
                      checked={dateRangePreset === null}
                      onChange={() => setDateRangePreset(null)}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange-mobile"
                      checked={dateRangePreset === "last7"}
                      onChange={() => setDateRangePreset("last7")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Last 7 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange-mobile"
                      checked={dateRangePreset === "last30"}
                      onChange={() => setDateRangePreset("last30")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Last 30 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange-mobile"
                      checked={dateRangePreset === "custom"}
                      onChange={() => setDateRangePreset("custom")}
                      className="border-border-default"
                    />
                    <span className="text-sm text-text-secondary">Custom</span>
                  </label>
                  {dateRangePreset === "custom" && (
                    <div className="pl-5 space-y-2">
                      <div>
                        <label className="text-xs text-text-secondary">From</label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-secondary">To</label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="mt-0.5 w-full rounded border border-border-default px-2 py-1 text-sm"
                        />
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
          </div>
        )}

        {/* Companies Table */}
        <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
          {filteredCompanies.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-2">
                {searchTerm || companyTypeFilter || statusFilter !== "active" || dateRangePreset
                  ? "No companies match your filters"
                  : "No companies found"}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {searchTerm || companyTypeFilter || statusFilter !== "active" || dateRangePreset
                  ? "Try adjusting your filters"
                  : "Create your first company to get started"}
              </p>
              {searchTerm || companyTypeFilter || statusFilter !== "active" || dateRangePreset ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                canCreateCompany && (
                  <Link
                    href="/rmm/companies/new"
                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    New Company
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Name
                          {sortBy === "name" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("registration_number")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Registration Number
                          {sortBy === "registration_number" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("company_type")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Type
                          {sortBy === "company_type" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("created_at")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          Status
                          {sortBy === "created_at" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Compliance Status</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="hover:bg-bg-secondary cursor-pointer transition-colors"
                        onClick={() => router.push(`/rmm/companies/${company.id}`)}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/rmm/companies/${company.id}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm(company.registration_number);
                              setPageNumber(1);
                              setCompanies([]);
                            }}
                            className="font-mono text-sm text-primary-600 hover:text-primary-700 hover:underline text-left"
                            title="Filter by this registration number"
                          >
                            {company.registration_number}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-primary-50 text-primary-700">
                            {company.company_type === "ipc" ? "IPC" : "Wholesaler"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
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
                        </td>
                        <td className="px-4 py-3">
                          {company.compliance_status === undefined ? (
                            <span className="text-xs text-text-secondary">Unknown</span>
                          ) : (
                            <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                              {company.compliance_status === "compliant" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-success-50 text-success-700 w-fit">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  ✓ Compliant
                                </span>
                              )}
                              {company.compliance_status === "non_compliant" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-error-50 text-error-700 w-fit">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  ⚠️ {company.violation_count ?? 0} violation{(company.violation_count ?? 0) !== 1 ? "s" : ""}
                                </span>
                              )}
                              {company.compliance_status === "under_review" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-warning-50 text-warning-700 w-fit">
                                  <Clock className="w-3.5 h-3.5" />
                                  🟡 Under Review
                                </span>
                              )}
                              {(company.enforcement_count ?? 0) > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-error-50 text-error-700 w-fit">
                                  🔴 Enforcement: {company.enforcement_count}
                                </span>
                              )}
                              <Link
                                href={`/rmm/companies/${company.id}`}
                                className="text-primary-600 hover:text-primary-700 hover:underline text-xs flex items-center gap-1 w-fit"
                              >
                                View detailed compliance
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/rmm/companies/${company.id}`}
                              className="p-2 text-text-secondary hover:text-primary-500 hover:bg-bg-secondary rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {canEditCompany(company) && (
                              <Link
                                href={`/rmm/companies/${company.id}/edit`}
                                className="p-2 text-text-secondary hover:text-primary-500 hover:bg-bg-secondary rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-border-default">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => router.push(`/rmm/companies/${company.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        href={`/rmm/companies/${company.id}`}
                        className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {company.name}
                      </Link>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/rmm/companies/${company.id}`}
                          className="p-2 text-text-secondary hover:text-primary-500"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEditCompany(company) && (
                          <Link
                            href={`/rmm/companies/${company.id}/edit`}
                            className="p-2 text-text-secondary hover:text-primary-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-text-secondary">Registration: </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm(company.registration_number);
                            setPageNumber(1);
                            setCompanies([]);
                            setFiltersOpen(false);
                          }}
                          className="font-mono text-primary-600 hover:text-primary-700 hover:underline"
                          title="Filter by this registration number"
                        >
                          {company.registration_number}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-primary-50 text-primary-700">
                          {company.company_type === "ipc" ? "IPC" : "Wholesaler"}
                        </span>
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
                        {company.compliance_status !== undefined && (
                          <>
                            {company.compliance_status === "compliant" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-success-50 text-success-700">
                                <CheckCircle className="w-3.5 h-3.5" /> ✓ Compliant
                              </span>
                            )}
                            {company.compliance_status === "non_compliant" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-error-50 text-error-700">
                                <AlertTriangle className="w-3.5 h-3.5" /> ⚠️ {company.violation_count ?? 0} violations
                              </span>
                            )}
                            {company.compliance_status === "under_review" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-warning-50 text-warning-700">
                                <Clock className="w-3.5 h-3.5" /> 🟡 Under Review
                              </span>
                            )}
                            {(company.enforcement_count ?? 0) > 0 && (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-error-50 text-error-700">
                                🔴 Enforcement: {company.enforcement_count}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {company.compliance_status !== undefined && (
                        <Link
                          href={`/rmm/companies/${company.id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline text-xs flex items-center gap-1 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View detailed compliance
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-border-default p-4 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {filteredCompanies.length} of {totalCount} companies
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
