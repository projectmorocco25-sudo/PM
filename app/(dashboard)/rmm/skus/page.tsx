/**
 * Wireframe: task-0.5.2.6-skus-list.md
 * Route: /rmm/skus
 * Implements: SKUs list page with search, filters, table, and pagination
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md
 * 
 * Database: skus, products, companies tables
 * RPC Functions: rmm_list_skus(user_id, product_id, page_number, page_size, atc_code_id_filter, search_term, sort_by, sort_order)
 * 
 * Features:
 * - Search SKUs by code, name, dosage strength
 * - Filter by product, status, dosage form, ATC code
 * - Sortable columns
 * - Pagination with "Load More"
 * - Role-based access control
 * - Responsive design
 * - Pharmaceutical attributes display (Phase 0.6)
 */

"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { Search, Filter, X, Eye, Edit, ChevronUp, ChevronDown, Box, Package } from "lucide-react";
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
  atc_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SKUsResponse {
  skus: SKU[];
  pagination: {
    total?: number;
    total_count?: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more?: boolean;
  };
}

type SortField = "name" | "sku_code" | "product_name" | "dosage_strength" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive";

function SKUsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("product_id");
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [skus, setSkus] = useState<SKU[]>([]);
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState<string | null>(productIdParam || null);
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
  const [dosageFormFilter, setDosageFormFilter] = useState<string | null>(null);
  const [atcCodeFilter, setAtcCodeFilter] = useState<string | null>(null);
  const [atcCodes, setAtcCodes] = useState<Array<{ id: string; code: string }>>([]);

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

  const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops", "Spray"] as const;

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load products for filter
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_products", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });

        if (!error && data) {
          const response = data as any;
          setProducts(response.products || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchProducts();
  }, [user, permissionsLoading]);

  // Load ATC codes for filter (Phase 4 Task 4.3)
  useEffect(() => {
    if (!user || permissionsLoading) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_atc_codes", {
          user_id: user.id,
          page_number: 1,
          page_size: 500,
        });
        if (!error && data && typeof data === "object" && "atc_codes" in data) {
          const arr = (data as { atc_codes: Array<{ id: string; code: string }> }).atc_codes;
          setAtcCodes(Array.isArray(arr) ? arr.map((a) => ({ id: a.id, code: (a as any).code })) : []);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [user, permissionsLoading]);

  // Fetch SKUs
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchSKUs() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_skus", {
          user_id: user.id,
          product_id: productFilter || null,
          page_number: pageNumber,
          page_size: pageSize,
          atc_code_id_filter: atcCodeFilter || null,
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
          p_date_from: pDateFrom || null,
          p_date_to: pDateTo || null,
          p_dosage_form_filter: dosageFormFilter || null,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as SKUsResponse;
        
        if (pageNumber === 1) {
          setSkus(response.skus || []);
        } else {
          setSkus((prev) => [...prev, ...(response.skus || [])]);
        }
        
        const p = response.pagination;
        setTotalCount(p.total ?? p.total_count ?? 0);
        setHasMore(p.has_more ?? (pageNumber < (p.total_pages ?? 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load SKUs");
      } finally {
        setLoading(false);
      }
    }

    fetchSKUs();
  }, [user, permissionsLoading, pageNumber, pageSize, productFilter, searchTerm, sortBy, sortOrder, dosageFormFilter, atcCodeFilter, pDateFrom, pDateTo]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setSkus([]);
  }, [productFilter, searchTerm, sortBy, sortOrder, dosageFormFilter, atcCodeFilter, dateRangePreset, dateFrom, dateTo]);

  // Client-side status filtering
  const filteredSKUs = skus.filter((sku) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return sku.is_active;
    if (statusFilter === "inactive") return !sku.is_active;
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
    setProductFilter(productIdParam || null);
    setStatusFilter("active");
    setSortBy("name");
    setSortOrder("asc");
    setDateRangePreset(null);
    setDateFrom("");
    setDateTo("");
    setDosageFormFilter(null);
    setAtcCodeFilter(null);
    setPageNumber(1);
  };

  const canCreateSKU = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any);

  const canEditSKU = (sku: SKU) => {
    if (!permissions?.role) return false;
    const role = permissions.role;
    
    // MOH and System Admin can edit any SKU
    if ([ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.SYSTEM_ADMIN].includes(role as any)) {
      return true;
    }
    
    // Company Admin/Manager can edit their own company's SKUs
    if ([ROLES.COMPANY_ADMIN, ROLES.COMPANY_MANAGER].includes(role as any) && permissions.company_id === sku.company_id) {
      return true;
    }
    
    return false;
  };

  if (permissionsLoading || loading && skus.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
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

  if (error && skus.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > SKUs"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">SKUs</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load SKUs</p>
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
            {" > SKUs"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">SKUs</h1>
        </div>
        {canCreateSKU && (
          <Link
            href={productFilter ? `/rmm/skus/new?product_id=${productFilter}` : "/rmm/skus/new"}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
          >
            New SKU
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search SKUs..."
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

          {/* Product Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Product</label>
            <select
              value={productFilter || ""}
              onChange={(e) => setProductFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "all"} onChange={() => setStatusFilter("all")} className="border-border-default" />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "active"} onChange={() => setStatusFilter("active")} className="border-border-default" />
                <span className="text-sm text-text-secondary">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "inactive"} onChange={() => setStatusFilter("inactive")} className="border-border-default" />
                <span className="text-sm text-text-secondary">Inactive</span>
              </label>
            </div>
          </div>

          {/* Dosage Form Filter (Phase 4 Task 4.2) */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Form</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="form" checked={dosageFormFilter === null} onChange={() => setDosageFormFilter(null)} className="border-border-default" />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              {DOSAGE_FORMS.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="form" checked={dosageFormFilter === f} onChange={() => setDosageFormFilter(f)} className="border-border-default" />
                  <span className="text-sm text-text-secondary">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ATC Code Filter (Phase 4 Task 4.3) */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">ATC Code</label>
            <select
              value={atcCodeFilter || ""}
              onChange={(e) => setAtcCodeFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All</option>
              {atcCodes.map((a) => (
                <option key={a.id} value={a.id}>{a.code}</option>
              ))}
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
                <label className="text-sm font-medium text-text-primary mb-2 block">Product</label>
                <select value={productFilter || ""} onChange={(e) => setProductFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status-m" checked={statusFilter === "all"} onChange={() => setStatusFilter("all")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status-m" checked={statusFilter === "active"} onChange={() => setStatusFilter("active")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status-m" checked={statusFilter === "inactive"} onChange={() => setStatusFilter("inactive")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Form</label>
                <select value={dosageFormFilter || ""} onChange={(e) => setDosageFormFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All</option>
                  {DOSAGE_FORMS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">ATC Code</label>
                <select value={atcCodeFilter || ""} onChange={(e) => setAtcCodeFilter(e.target.value || null)} className="w-full px-3 py-2 border border-border-default rounded-md text-sm">
                  <option value="">All</option>
                  {atcCodes.map((a) => (
                    <option key={a.id} value={a.id}>{a.code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Date</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date-m" checked={dateRangePreset === null} onChange={() => setDateRangePreset(null)} className="border-border-default" />
                    <span className="text-sm text-text-secondary">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date-m" checked={dateRangePreset === "last7"} onChange={() => setDateRangePreset("last7")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Last 7 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date-m" checked={dateRangePreset === "last30"} onChange={() => setDateRangePreset("last30")} className="border-border-default" />
                    <span className="text-sm text-text-secondary">Last 30 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date-m" checked={dateRangePreset === "custom"} onChange={() => setDateRangePreset("custom")} className="border-border-default" />
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

        {/* SKUs Table */}
        <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
          {filteredSKUs.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <Box className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-2">
                {searchTerm || productFilter || statusFilter !== "active" || dosageFormFilter || atcCodeFilter || dateRangePreset
                  ? "No SKUs match your filters"
                  : "No SKUs found"}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {searchTerm || productFilter || statusFilter !== "active" || dosageFormFilter || atcCodeFilter || dateRangePreset
                  ? "Try adjusting your filters"
                  : "Create your first SKU to get started"}
              </p>
              {searchTerm || productFilter || statusFilter !== "active" || dosageFormFilter || atcCodeFilter || dateRangePreset ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                canCreateSKU && (
                  <Link
                    href="/rmm/skus/new"
                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    New SKU
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
                          onClick={() => handleSort("sku_code")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          SKU Code
                          {sortBy === "sku_code" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          SKU Name
                          {sortBy === "name" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      {!isCompanyRole(permissions?.role as any) && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                          <button
                            onClick={() => handleSort("product_name")}
                            className="flex items-center gap-2 hover:text-primary-500"
                          >
                            Product
                            {sortBy === "product_name" && (
                              sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Dosage</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Form</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Pack Size</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">ATC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredSKUs.map((sku) => (
                      <tr
                        key={sku.id}
                        className="hover:bg-bg-secondary cursor-pointer transition-colors"
                        onClick={() => router.push(`/rmm/skus/${sku.id}`)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-text-primary">{sku.sku_code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/rmm/skus/${sku.id}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sku.name}
                          </Link>
                        </td>
                        {!isCompanyRole(permissions?.role as any) && (
                          <td className="px-4 py-3">
                            {sku.product_name ? (
                              <Link
                                href={`/rmm/products/${sku.product_id}`}
                                className="text-text-secondary hover:text-primary-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {sku.product_name}
                              </Link>
                            ) : (
                              <span className="text-text-secondary text-sm">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-primary">{sku.dosage_strength || "-"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-primary">{sku.dosage_form || "-"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-text-primary">
                            {sku.pack_size ? `${sku.pack_size} ${sku.unit_of_measure || ""}`.trim() : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-text-primary">{sku.atc_code ?? "-"}</span>
                        </td>
                        <td className="px-4 py-3">
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
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/rmm/skus/${sku.id}`}
                              className="p-2 text-text-secondary hover:text-primary-500 hover:bg-bg-secondary rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {canEditSKU(sku) && (
                              <Link
                                href={`/rmm/skus/${sku.id}/edit`}
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
                {filteredSKUs.map((sku) => (
                  <div
                    key={sku.id}
                    className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => router.push(`/rmm/skus/${sku.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          href={`/rmm/skus/${sku.id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sku.name}
                        </Link>
                        <div className="text-xs font-mono text-text-secondary mt-1">{sku.sku_code}</div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/rmm/skus/${sku.id}`}
                          className="p-2 text-text-secondary hover:text-primary-500"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEditSKU(sku) && (
                          <Link
                            href={`/rmm/skus/${sku.id}/edit`}
                            className="p-2 text-text-secondary hover:text-primary-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {!isCompanyRole(permissions?.role as any) && sku.product_name && (
                        <div>
                          <span className="text-text-secondary">Product: </span>
                          <Link
                            href={`/rmm/products/${sku.product_id}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sku.product_name}
                          </Link>
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {sku.dosage_strength && (
                          <span className="text-text-secondary">
                            Dosage: <span className="text-text-primary">{sku.dosage_strength}</span>
                          </span>
                        )}
                        {sku.dosage_form && (
                          <span className="text-text-secondary">
                            Form: <span className="text-text-primary">{sku.dosage_form}</span>
                          </span>
                        )}
                        {sku.pack_size && (
                          <span className="text-text-secondary">
                            Pack: <span className="text-text-primary">
                              {sku.pack_size} {sku.unit_of_measure || ""}
                            </span>
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-text-secondary">ATC Code: </span>
                        <span className="font-mono text-text-primary">{sku.atc_code ?? "-"}</span>
                      </div>
                      <div>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-border-default p-4 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {filteredSKUs.length} of {totalCount} SKUs
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

export default function SKUsListPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12 text-text-secondary">Loading...</div>}>
      <SKUsListContent />
    </Suspense>
  );
}
