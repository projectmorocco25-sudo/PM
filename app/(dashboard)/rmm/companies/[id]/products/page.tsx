/**
 * Wireframe: task-0.5.2.3-company-detail.md (Products tab)
 * Route: /rmm/companies/[id]/products
 * Implements: Company products list page
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md
 * 
 * Database: products table
 * RPC Functions: rmm_list_company_products(user_id, company_id, page_number, page_size)
 * 
 * Features:
 * - List products for a specific company
 * - Pagination with "Load More"
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
import { ArrowLeft, Package, Eye, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Product {
  id: string;
  name: string;
  atc_code: string | null;
  company_id: string;
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

export default function CompanyProductsPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch company name
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;

    async function fetchCompany() {
      try {
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_company", {
          user_id: user.id,
          company_id: companyId,
        });

        if (!rpcError && data) {
          setCompanyName((data as any).name || "");
        }
      } catch (err) {
        // Ignore errors for company name
      }
    }

    fetchCompany();
  }, [user, companyId, permissionsLoading]);

  // Fetch products
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_company_products", {
          user_id: user.id,
          company_id: companyId,
          page_number: pageNumber,
          page_size: pageSize,
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
  }, [user, companyId, permissionsLoading, pageNumber, pageSize]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const canCreateProduct = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
  ].includes(permissions.role as any);

  if (permissionsLoading || loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/rmm/companies/${companyId}`}
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
              {companyName && (
                <>
                  {" > "}
                  <Link href={`/rmm/companies/${companyId}`} className="hover:text-text-primary">
                    {companyName}
                  </Link>
                </>
              )}
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
        <div className="flex items-center gap-4">
          <Link
            href={`/rmm/companies/${companyId}`}
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
              {companyName && (
                <>
                  {" > "}
                  <Link href={`/rmm/companies/${companyId}`} className="hover:text-text-primary">
                    {companyName}
                  </Link>
                </>
              )}
              {" > Products"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
          </div>
        </div>
        {canCreateProduct && (
          <Link
            href={`/rmm/products/new?company_id=${companyId}`}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Product
          </Link>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-bg-primary border border-border-default rounded-lg overflow-hidden">
        {products.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">No products found</p>
            <p className="text-text-secondary text-sm mb-4">
              {canCreateProduct
                ? "Create the first product for this company"
                : "This company has no products yet"}
            </p>
            {canCreateProduct && (
              <Link
                href={`/rmm/products/new?company_id=${companyId}`}
                className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                New Product
              </Link>
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
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      ATC Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-bg-secondary cursor-pointer transition-colors"
                      onClick={() => router.push(`/rmm/products/${product.id}`)}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/rmm/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.name}
                        </Link>
                      </td>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border-default">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                  onClick={() => router.push(`/rmm/products/${product.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      href={`/rmm/products/${product.id}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.name}
                    </Link>
                    <Link
                      href={`/rmm/products/${product.id}`}
                      className="p-2 text-text-secondary hover:text-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-1 text-sm">
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
                Showing {products.length} of {totalCount} products
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
  );
}
