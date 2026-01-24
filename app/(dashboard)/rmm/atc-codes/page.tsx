/**
 * Wireframe: MOH-only ATC Codes list page
 * Route: /rmm/atc-codes
 * Implements: ATC Codes list page (MOH only)
 * 
 * Database: atc_codes table
 * RPC Functions: rmm_list_atc_codes(user_id, page_number, page_size, is_active_filter, search_term, sort_by, sort_order)
 * 
 * Features:
 * - List ATC codes
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
import { Search, X, FlaskConical, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ATCCode {
  id: string;
  code: string;
  description: string;
  level: number;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ATCCodesResponse {
  atc_codes: ATCCode[];
  pagination: {
    total: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more: boolean;
  };
}

type SortField = "code" | "description" | "created_at";
type SortOrder = "asc" | "desc";

export default function ATCCodesListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [atcCodes, setAtcCodes] = useState<ATCCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("code");
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

  // Fetch ATC codes
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchATCCodes() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_list_atc_codes", {
          user_id: user.id,
          page_number: pageNumber,
          page_size: pageSize,
          is_active_filter: null,
          search_term: searchTerm || null,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const response = data as ATCCodesResponse;
        
        if (pageNumber === 1) {
          setAtcCodes(response.atc_codes || []);
        } else {
          setAtcCodes((prev) => [...prev, ...(response.atc_codes || [])]);
        }
        
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ATC codes");
      } finally {
        setLoading(false);
      }
    }

    fetchATCCodes();
  }, [user, permissionsLoading, pageNumber, pageSize, searchTerm, sortBy, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
    setAtcCodes([]);
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

  if (permissionsLoading || loading && atcCodes.length === 0) {
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
              {" > ATC Codes"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">ATC Codes</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to view ATC Codes</p>
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

  if (error && atcCodes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > ATC Codes"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">ATC Codes</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load ATC codes</p>
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
            {" > ATC Codes"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">ATC Codes</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search ATC codes..."
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

      {/* ATC Codes Table */}
      <div className="bg-bg-primary border border-border-default rounded-lg overflow-hidden">
        {atcCodes.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <FlaskConical className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">No ATC codes found</p>
            <p className="text-text-secondary text-sm">
              {searchTerm ? "Try adjusting your search" : "ATC codes will appear here"}
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
                        onClick={() => handleSort("code")}
                        className="flex items-center gap-2 hover:text-primary-500"
                      >
                        ATC Code
                        {sortBy === "code" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      <button
                        onClick={() => handleSort("description")}
                        className="flex items-center gap-2 hover:text-primary-500"
                      >
                        Description
                        {sortBy === "description" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Level</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {atcCodes.map((atc) => (
                    <tr key={atc.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-text-primary font-medium">{atc.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-text-primary">{atc.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-secondary">Level {atc.level}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded",
                            atc.is_active
                              ? "bg-success-50 text-success-700"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {atc.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border-default">
              {atcCodes.map((atc) => (
                <div key={atc.id} className="p-4">
                  <div className="font-mono text-sm text-text-primary font-medium mb-1">{atc.code}</div>
                  <div className="text-text-primary mb-2">{atc.description}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Level {atc.level}</span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        atc.is_active
                          ? "bg-success-50 text-success-700"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {atc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-border-default p-4 flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Showing {atcCodes.length} of {totalCount} ATC codes
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
