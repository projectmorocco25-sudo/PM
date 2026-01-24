/**
 * Wireframe: task-0.5.2.4-products-list.md
 * Route: /rmm/products
 * Implements: Products list page with search, filters, table, and pagination
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md
 * 
 * Database: products, companies tables
 * RPC Functions: rmm_list_products(user_id, company_id, page_number, page_size, is_critical_medicine_filter, search_term, sort_by, sort_order)
 * 
 * Features:
 * - Search products by name, ATC code, description
 * - Filter by company, status, critical medicine, ATC code
 * - Sortable columns
 * - Pagination with "Load More"
 * - Role-based access control
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { Search, Filter, X, Eye, Edit, ChevronUp, ChevronDown, Package, Building2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Product {
  id: string;
  name: string;
  description: string | null;
  atc_code: string | null;
  company_id: string;
  company_name: string | null;
  is_critical_medicine: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more: boolean;
  };
}

type SortField = "name" | "company_name" | "atc_code" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive";
type CriticalFilter = "all" | "yes" | "no";

export default function ProductsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [criticalFilter, setCriticalFilter] = useState<CriticalFilter>("all");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
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

  // Fetch products
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_products", {
          user_id: user.id,
          company_id: companyFilter || null,
          page_number: pageNumber,
          page_size: pageSize,
          is_critical_medicine_filter: criticalFilter === "all" ? null : criticalFilter === "yes",
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as ProductsResponse;
        
        if (pageNumber === 1) {
          setProducts(response.products || []);
        } else {
          setProducts((prev) => [...prev, ...(response.products || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [user, permissionsLoading, pageNumber, pageSize, companyFilter, searchTerm, criticalFilter, sortBy, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setProducts([]);
  }, [companyFilter, searchTerm, criticalFilter, sortBy, sortOrder]);

  // Client-side status filtering
  const filteredProducts = products.filter((product) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return product.is_active;
    if (statusFilter === "inactive") return !product.is_active;
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
    setCompanyFilter(null);
    setStatusFilter("active");
    setCriticalFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setPageNumber(1);
  };

  const canCreateProduct = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any);

  const canEditProduct = (product: Product) => {
    if (!permissions?.role) return false;
    const role = permissions.role;
    
    // MOH and System Admin can edit any product
    if ([ROLES.TIER1, ROLES.TIER2_OFFICER, ROLES.TIER2_REGISTRAR, ROLES.SYSTEM_ADMIN].includes(role as any)) {
      return true;
    }
    
    // Company Admin/Manager can edit their own company's products
    if ([ROLES.COMPANY_ADMIN, ROLES.COMPANY_MANAGER].includes(role as any) && permissions.company_id === product.company_id) {
      return true;
    }
    
    return false;
  };

  if (permissionsLoading || loading && products.length === 0) {
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

  if (error && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > Products"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load products</p>
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
            {" > Products"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
        </div>
        {canCreateProduct && (
          <Link
            href="/rmm/products/new"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
          >
            New Product
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search products..."
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

          {/* Critical Medicine Filter */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Critical Medicine</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="critical"
                  checked={criticalFilter === "all"}
                  onChange={() => setCriticalFilter("all")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="critical"
                  checked={criticalFilter === "yes"}
                  onChange={() => setCriticalFilter("yes")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="critical"
                  checked={criticalFilter === "no"}
                  onChange={() => setCriticalFilter("no")}
                  className="border-border-default"
                />
                <span className="text-sm text-text-secondary">No</span>
              </label>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm"
          >
            Clear Filters
          </button>
        </aside>

        {/* Mobile Filters Drawer - Similar structure, hidden on desktop */}
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

        {/* Products Table */}
        <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
          {filteredProducts.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-2">
                {searchTerm || companyFilter || statusFilter !== "active" || criticalFilter !== "all"
                  ? "No products match your filters"
                  : "No products found"}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {searchTerm || companyFilter || statusFilter !== "active" || criticalFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first product to get started"}
              </p>
              {searchTerm || companyFilter || statusFilter !== "active" || criticalFilter !== "all" ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                canCreateProduct && (
                  <Link
                    href="/rmm/products/new"
                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    New Product
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
                          Product Name
                          {sortBy === "name" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      {!isCompanyRole(permissions?.role as any) && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                          <button
                            onClick={() => handleSort("company_name")}
                            className="flex items-center gap-2 hover:text-primary-500"
                          >
                            Company
                            {sortBy === "company_name" && (
                              sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                        <button
                          onClick={() => handleSort("atc_code")}
                          className="flex items-center gap-2 hover:text-primary-500"
                        >
                          ATC Code
                          {sortBy === "atc_code" && (
                            sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-bg-secondary cursor-pointer transition-colors"
                        onClick={() => router.push(`/rmm/products/${product.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/rmm/products/${product.id}`}
                              className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {product.name}
                            </Link>
                            {product.is_critical_medicine && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-warning-50 text-warning-700">
                                Critical
                              </span>
                            )}
                          </div>
                        </td>
                        {!isCompanyRole(permissions?.role as any) && (
                          <td className="px-4 py-3">
                            <Link
                              href={`/rmm/companies/${product.company_id}`}
                              className="text-text-secondary hover:text-primary-500 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {product.company_name || "-"}
                            </Link>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          {product.atc_code ? (
                            <span className="font-mono text-sm text-text-secondary">
                              {product.atc_code}
                            </span>
                          ) : (
                            <span className="text-text-secondary text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              product.is_active
                                ? "bg-success-50 text-success-700"
                                : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/rmm/products/${product.id}`}
                              className="p-2 text-text-secondary hover:text-primary-500 hover:bg-bg-secondary rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {canEditProduct(product) && (
                              <Link
                                href={`/rmm/products/${product.id}/edit`}
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
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => router.push(`/rmm/products/${product.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          href={`/rmm/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.name}
                        </Link>
                        {product.is_critical_medicine && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-warning-50 text-warning-700">
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/rmm/products/${product.id}`}
                          className="p-2 text-text-secondary hover:text-primary-500"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEditProduct(product) && (
                          <Link
                            href={`/rmm/products/${product.id}/edit`}
                            className="p-2 text-text-secondary hover:text-primary-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {!isCompanyRole(permissions?.role as any) && product.company_name && (
                        <div>
                          <span className="text-text-secondary">Company: </span>
                          <Link
                            href={`/rmm/companies/${product.company_id}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {product.company_name}
                          </Link>
                        </div>
                      )}
                      {product.atc_code && (
                        <div>
                          <span className="text-text-secondary">ATC Code: </span>
                          <span className="font-mono text-text-primary">{product.atc_code}</span>
                        </div>
                      )}
                      <div>
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded",
                            product.is_active
                              ? "bg-success-50 text-success-700"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-border-default p-4 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {filteredProducts.length} of {totalCount} products
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
