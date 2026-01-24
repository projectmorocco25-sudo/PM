/**
 * Wireframe: MOH-only Critical Medicines list page
 * Route: /rmm/critical-medicines
 * Implements: Critical Medicines list page (MOH only)
 * 
 * Database: critical_medicines, products, companies tables
 * RPC Functions: rmm_list_critical_medicines(user_id, page_number, page_size, search_term, sort_by, sort_order)
 * 
 * Features:
 * - List critical medicines
 * - Search and filter
 * - Pagination
 * - MOH-only access
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { Search, X, HeartPulse, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CriticalMedicine {
  product_id: string;
  product_name: string;
  company_id: string;
  company_name: string | null;
  atc_code: string | null;
  designated_at: string;
  designated_by: string;
  designated_by_name: string | null;
}

interface CriticalMedicinesResponse {
  critical_medicines: CriticalMedicine[];
  pagination: {
    total: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more: boolean;
  };
}

type SortField = "product_name" | "company_name" | "designated_at";
type SortOrder = "asc" | "desc";

export default function CriticalMedicinesListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [criticalMedicines, setCriticalMedicines] = useState<CriticalMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("product_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(50);
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

  // Check if user is MOH
  const isMOH = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  // Fetch critical medicines
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchCriticalMedicines() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_critical_medicines", {
          user_id: user.id,
          page_number: pageNumber,
          page_size: pageSize,
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as CriticalMedicinesResponse;
        
        if (pageNumber === 1) {
          setCriticalMedicines(response.critical_medicines || []);
        } else {
          setCriticalMedicines((prev) => [...prev, ...(response.critical_medicines || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load critical medicines");
      } finally {
        setLoading(false);
      }
    }

    fetchCriticalMedicines();
  }, [user, permissionsLoading, pageNumber, pageSize, searchTerm, sortBy, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setCriticalMedicines([]);
  }, [searchTerm, sortBy, sortOrder]);

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

  if (permissionsLoading || loading && criticalMedicines.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!isMOH) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > Critical Medicines"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Critical Medicines</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to view Critical Medicines</p>
          <Link
            href="/rmm"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to RMM
          </Link>
        </div>
      </div>
    );
  }

  if (error && criticalMedicines.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > Critical Medicines"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Critical Medicines</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load critical medicines</p>
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
            {" > Critical Medicines"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Critical Medicines</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search critical medicines..."
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
      </div>

      {/* Critical Medicines Table */}
      <div className="bg-bg-primary border border-border-default rounded-lg overflow-hidden">
        {criticalMedicines.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">No critical medicines found</p>
            <p className="text-text-secondary text-sm">
              {searchTerm ? "Try adjusting your search" : "Critical medicines will appear here once designated"}
            </p>
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
                        onClick={() => handleSort("product_name")}
                        className="flex items-center gap-2 hover:text-primary-500"
                      >
                        Product Name
                        {sortBy === "product_name" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">ATC Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      <button
                        onClick={() => handleSort("designated_at")}
                        className="flex items-center gap-2 hover:text-primary-500"
                      >
                        Designated At
                        {sortBy === "designated_at" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Designated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {criticalMedicines.map((medicine) => (
                    <tr
                      key={medicine.product_id}
                      className="hover:bg-bg-secondary cursor-pointer transition-colors"
                      onClick={() => router.push(`/rmm/products/${medicine.product_id}`)}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/rmm/products/${medicine.product_id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {medicine.product_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {medicine.company_name ? (
                          <Link
                            href={`/rmm/companies/${medicine.company_id}`}
                            className="text-text-secondary hover:text-primary-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {medicine.company_name}
                          </Link>
                        ) : (
                          <span className="text-text-secondary text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {medicine.atc_code ? (
                          <span className="font-mono text-sm text-text-secondary">{medicine.atc_code}</span>
                        ) : (
                          <span className="text-text-secondary text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-primary">
                          {new Date(medicine.designated_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-secondary">
                          {medicine.designated_by_name || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border-default">
              {criticalMedicines.map((medicine) => (
                <div
                  key={medicine.product_id}
                  className="p-4 hover:bg-bg-secondary cursor-pointer transition-colors"
                  onClick={() => router.push(`/rmm/products/${medicine.product_id}`)}
                >
                  <Link
                    href={`/rmm/products/${medicine.product_id}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {medicine.product_name}
                  </Link>
                  <div className="space-y-1 text-sm mt-2">
                    {medicine.company_name && (
                      <div>
                        <span className="text-text-secondary">Company: </span>
                        <Link
                          href={`/rmm/companies/${medicine.company_id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {medicine.company_name}
                        </Link>
                      </div>
                    )}
                    {medicine.atc_code && (
                      <div>
                        <span className="text-text-secondary">ATC Code: </span>
                        <span className="font-mono text-text-primary">{medicine.atc_code}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-text-secondary">Designated: </span>
                      <span className="text-text-primary">
                        {new Date(medicine.designated_at).toLocaleDateString()}
                      </span>
                      {" by "}
                      <span className="text-text-secondary">{medicine.designated_by_name || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-border-default p-4 flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Showing {criticalMedicines.length} of {totalCount} critical medicines
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
