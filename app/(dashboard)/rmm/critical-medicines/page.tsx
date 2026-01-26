/**
 * Wireframe: task-0.5.2.15-critical-medicines-list.md
 * Route: /rmm/critical-medicines
 * Implements: Critical Medicines list (MOH Tier 1 management), Phase 5 Task 5.1
 * 
 * Database: critical_medicines, products, skus, companies
 * RPC: rmm_list_critical_medicines, rmm_designate_critical_medicine, rmm_remove_critical_medicine, rmm_update_critical_medicine
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { Search, X, HeartPulse, ChevronUp, ChevronDown, Filter, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";

interface CriticalMedicine {
  product_id: string;
  product_name: string;
  company_id: string;
  company_name: string | null;
  atc_code: string | null;
  sku_id?: string;
  sku_code?: string;
  sku_name?: string;
  designated_at: string;
  designated_by: string;
  designated_by_name: string | null;
  is_active?: boolean;
}

interface CriticalMedicinesResponse {
  critical_medicines: CriticalMedicine[];
  pagination: {
    total?: number;
    total_count?: number;
    page_number: number;
    page_size: number;
    total_pages: number;
    has_more: boolean;
  };
}

type SortField = "product_name" | "company_name" | "designated_at" | "sku_code";
type SortOrder = "asc" | "desc";

const ATC_CATEGORIES = ["A", "B", "C", "D", "E", "G", "H", "J", "L", "M", "N", "P", "R", "S", "V"] as const;

export default function CriticalMedicinesListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [atcFilter, setAtcFilter] = useState<string | null>(null);
  const [dateRangePreset, setDateRangePreset] = useState<"last7" | "last30" | "custom" | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [designateOpen, setDesignateOpen] = useState(false);
  const [designateCompany, setDesignateCompany] = useState<string | null>(null);
  const [designateProduct, setDesignateProduct] = useState<string | null>(null);
  const [designateSku, setDesignateSku] = useState<string | null>(null);
  const [designateJustification, setDesignateJustification] = useState("");
  const [designateSubmitting, setDesignateSubmitting] = useState(false);
  const [designateError, setDesignateError] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
  const [skus, setSkus] = useState<Array<{ id: string; sku_code: string; name: string }>>([]);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [editJustification, setEditJustification] = useState("");
  const [removeOpen, setRemoveOpen] = useState<string | null>(null);
  const [removeJustification, setRemoveJustification] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refetchKey, setRefetchKey] = useState(0);
  const [infoBannerDismissed, setInfoBannerDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("critical_medicines_info_banner_dismissed") === "1";
  });

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  const isMOH = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  const isMOHTier1 = permissions?.role === ROLES.TIER1 || permissions?.role === ROLES.SYSTEM_ADMIN;

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

  useEffect(() => {
    if (!user || !isMOH) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("rmm_list_companies", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });
        const r = data as { companies?: Array<{ id: string; name: string }> };
        setCompanies(r?.companies || []);
      } catch { /* ignore */ }
    })();
  }, [user, isMOH]);

  useEffect(() => {
    if (!user || !designateCompany) {
      setProducts([]);
      setDesignateProduct(null);
      setDesignateSku(null);
      setSkus([]);
      return;
    }
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("rmm_list_products", {
          user_id: user.id,
          company_id: designateCompany,
          page_number: 1,
          page_size: 500,
        });
        const r = data as { products?: Array<{ id: string; name: string }> };
        setProducts(r?.products || []);
        setDesignateProduct(null);
        setDesignateSku(null);
        setSkus([]);
      } catch { setProducts([]); }
    })();
  }, [user, designateCompany]);

  useEffect(() => {
    if (!user || !designateProduct) {
      setSkus([]);
      setDesignateSku(null);
      return;
    }
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("rmm_list_skus", {
          user_id: user.id,
          product_id: designateProduct,
          page_number: 1,
          page_size: 500,
        });
        const r = data as { skus?: Array<{ id: string; sku_code: string; name: string }> };
        setSkus(r?.skus || []);
        setDesignateSku(null);
      } catch { setSkus([]); }
    })();
  }, [user, designateProduct]);

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
          p_status_filter: statusFilter === "all" ? null : statusFilter,
          p_company_id: companyFilter || null,
          p_atc_category: atcFilter || null,
          p_date_from: pDateFrom || null,
          p_date_to: pDateTo || null,
        });

        if (rpcError) throw new Error(rpcError.message);

        const response = data as CriticalMedicinesResponse;
        const list = response.critical_medicines || [];
        if (pageNumber === 1) {
          setCriticalMedicines(list);
        } else {
          setCriticalMedicines((prev) => [...prev, ...list]);
        }
        const p = response.pagination;
        setTotalCount(p?.total ?? p?.total_count ?? 0);
        setHasMore(p?.has_more ?? (pageNumber < (p?.total_pages ?? 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load critical medicines");
      } finally {
        setLoading(false);
      }
    }

    fetchCriticalMedicines();
  }, [user, permissionsLoading, pageNumber, pageSize, searchTerm, sortBy, sortOrder, statusFilter, companyFilter, atcFilter, pDateFrom, pDateTo, refetchKey]);

  useEffect(() => {
    setPageNumber(1);
    setCriticalMedicines([]);
  }, [searchTerm, sortBy, sortOrder, statusFilter, companyFilter, atcFilter, dateRangePreset, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("active");
    setCompanyFilter(null);
    setAtcFilter(null);
    setDateRangePreset(null);
    setDateFrom("");
    setDateTo("");
    setPageNumber(1);
  };

  const openDesignate = () => {
    setDesignateCompany(null);
    setDesignateProduct(null);
    setDesignateSku(null);
    setDesignateJustification("");
    setDesignateError(null);
    setDesignateOpen(true);
  };

  const submitDesignate = async () => {
    if (!user || !designateSku || !designateJustification.trim()) {
      setDesignateError("Please select an SKU and provide a justification.");
      return;
    }
    setDesignateSubmitting(true);
    setDesignateError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("rmm_designate_critical_medicine", {
        designator_user_id: user.id,
        sku_id: designateSku,
        p_justification: designateJustification.trim(),
      });
      if (rpcError) throw new Error(rpcError.message);
      setDesignateOpen(false);
      setPageNumber(1);
      setCriticalMedicines([]);
      setRefetchKey((k) => k + 1);
    } catch (e) {
      setDesignateError(e instanceof Error ? e.message : "Designation failed");
    } finally {
      setDesignateSubmitting(false);
    }
  };

  const removeDesignation = async (skuId: string, justification: string) => {
    if (!user || !justification.trim()) return;
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("rmm_remove_critical_medicine", {
        remover_user_id: user.id,
        sku_id: skuId,
        p_justification: justification.trim(),
      });
      if (rpcError) throw new Error(rpcError.message);
      setRemoveOpen(null);
      setRemoveJustification("");
      setPageNumber(1);
      setCriticalMedicines([]);
      setRefetchKey((k) => k + 1);
    } catch (e) {
      setDesignateError(e instanceof Error ? e.message : "Remove failed");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === criticalMedicines.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(criticalMedicines.map((m) => (m.sku_id ?? m.product_id) as string)));
    }
  };

  const bulkRemove = async () => {
    const j = "Bulk removal";
    for (const id of selectedIds) {
      await removeDesignation(id, j);
    }
    setSelectedIds(new Set());
  };

  const saveEdit = async () => {
    if (!user || !editOpen || !editJustification.trim()) return;
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("rmm_update_critical_medicine", {
        updater_user_id: user.id,
        sku_id: editOpen,
        p_justification: editJustification.trim(),
      });
      if (rpcError) throw new Error(rpcError.message);
      setEditOpen(null);
      setEditJustification("");
      setRefetchKey((k) => k + 1);
    } catch (e) {
      setDesignateError(e instanceof Error ? e.message : "Update failed");
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-text-secondary mb-2">
            <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
            {" > "}
            <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
            {" > Critical Medicines"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Critical Medicines (MOH Tier 1 Only)</h1>
        </div>
        {isMOHTier1 && (
          <button
            onClick={openDesignate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Designate
          </button>
        )}
      </div>

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
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(
            "px-4 py-2 border border-border-default rounded-md flex items-center gap-2 hover:bg-bg-secondary transition-colors",
            filtersOpen && "bg-bg-secondary"
          )}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside
          className={cn(
            "w-60 bg-bg-primary border border-border-default rounded-lg p-4 space-y-4",
            "hidden md:block",
            !filtersOpen && "md:hidden"
          )}
        >
          <h2 className="font-semibold text-text-primary">Filters</h2>
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
            <div className="space-y-2">
              {(["all", "active", "inactive"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={statusFilter === s}
                    onChange={() => setStatusFilter(s)}
                    className="border-border-default"
                  />
                  <span className="text-sm text-text-secondary">
                    {s === "all" ? "All" : s === "active" ? "Active" : "Inactive"}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Company</label>
            <select
              value={companyFilter ?? ""}
              onChange={(e) => setCompanyFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">ATC</label>
            <select
              value={atcFilter ?? ""}
              onChange={(e) => setAtcFilter(e.target.value || null)}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            >
              <option value="">All</option>
              {ATC_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
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
          <button onClick={clearFilters} className="w-full px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors text-sm">
            Clear Filters
          </button>
        </aside>

      {/* Critical Medicines Table */}
      <div className="flex-1 bg-bg-primary border border-border-default rounded-lg overflow-hidden">
        {criticalMedicines.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">
              {searchTerm || statusFilter !== "active" || companyFilter || atcFilter || dateRangePreset
                ? "No critical medicines match your filters"
                : "No critical medicines designated"}
            </p>
            <p className="text-text-secondary text-sm mb-4">
              {searchTerm || companyFilter || atcFilter || dateRangePreset
                ? "Try adjusting your search or filters"
                : "Designate medicines as critical to apply higher threshold multipliers"}
            </p>
            {isMOHTier1 && !searchTerm && !companyFilter && !atcFilter && !dateRangePreset && (
              <button
                onClick={openDesignate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Designate Critical Medicine
              </button>
            )}
            {(searchTerm || companyFilter || atcFilter || dateRangePreset) && (
              <button onClick={clearFilters} className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {isMOHTier1 && selectedIds.size > 0 && (
              <div className="px-4 py-2 border-b border-border-default flex items-center gap-2">
                <span className="text-sm text-text-secondary">{selectedIds.size} selected</span>
                <button
                  onClick={bulkRemove}
                  className="px-3 py-1.5 text-sm border border-error-300 text-error-600 rounded hover:bg-error-50 transition-colors"
                >
                  Remove selected
                </button>
              </div>
            )}
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-border-default">
                  <tr>
                    {isMOHTier1 && (
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={criticalMedicines.length > 0 && selectedIds.size === criticalMedicines.length}
                          onChange={toggleSelectAll}
                          className="rounded border-border-default"
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      <button onClick={() => handleSort("product_name")} className="flex items-center gap-2 hover:text-primary-500">
                        Product
                        {sortBy === "product_name" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      <button onClick={() => handleSort("company_name")} className="flex items-center gap-2 hover:text-primary-500">
                        Company
                        {sortBy === "company_name" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">ATC Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      <button onClick={() => handleSort("designated_at")} className="flex items-center gap-2 hover:text-primary-500">
                        Designated At
                        {sortBy === "designated_at" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {criticalMedicines.map((m) => {
                    const rowId = (m.sku_id ?? m.product_id) as string;
                    return (
                      <tr
                        key={rowId}
                        className="hover:bg-bg-secondary transition-colors"
                      >
                        {isMOHTier1 && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(rowId)}
                              onChange={() => toggleSelect(rowId)}
                              className="rounded border-border-default"
                            />
                          </td>
                        )}
                        <td className="px-4 py-3">
                          {m.sku_id ? (
                            <Link
                              href={`/rmm/skus/${m.sku_id}`}
                              className="font-mono text-sm text-primary-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {m.sku_code ?? m.sku_name ?? "-"}
                            </Link>
                          ) : (
                            <span className="text-sm text-text-secondary">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/rmm/products/${m.product_id}`}
                            className="text-primary-600 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {m.product_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {m.company_name ? (
                            <Link href={`/rmm/companies/${m.company_id}`} className="text-text-secondary hover:text-primary-500 hover:underline" onClick={(e) => e.stopPropagation()}>
                              {m.company_name}
                            </Link>
                          ) : (
                            <span className="text-text-secondary text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {m.atc_code ? <span className="font-mono text-sm text-text-secondary">{m.atc_code}</span> : <span className="text-text-secondary text-sm">-</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {new Date(m.designated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {m.sku_id && (
                              <Link
                                href={`/rmm/skus/${m.sku_id}`}
                                className="p-2 text-text-secondary hover:text-primary-500 rounded hover:bg-bg-secondary"
                                title="View"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                            {isMOHTier1 && m.sku_id && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setEditOpen(m.sku_id!); setEditJustification(""); }}
                                  className="p-2 text-text-secondary hover:text-primary-500 rounded hover:bg-bg-secondary"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setRemoveOpen(m.sku_id!); setRemoveJustification(""); }}
                                  className="p-2 text-text-secondary hover:text-error-500 rounded hover:bg-error-50"
                                  title="Remove"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

      {/* Info banner (Phase 6 Task 6.3) — dismissible */}
      {!infoBannerDismissed && (
        <div className="rounded-lg border border-blue-200 px-4 py-3 text-sm text-blue-800 flex items-start gap-2" style={{ backgroundColor: "#eff6ff" }}>
          <span className="flex-shrink-0">ℹ️</span>
          <div className="flex-1">
            <p><strong>Critical medicines</strong> are designated by MOH Tier 1. These medicines receive higher threshold multipliers.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setInfoBannerDismissed(true);
              try { localStorage.setItem("critical_medicines_info_banner_dismissed", "1"); } catch { /* ignore */ }
            }}
            className="flex-shrink-0 p-1 rounded hover:bg-blue-200/50 text-blue-800"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Regulatory Context (Fatima) */}
      <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
        <h3 className="font-semibold text-text-primary mb-2">Regulatory Context</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
          <li>Critical medicine designations are regulatory decisions per DMP regulations.</li>
          <li>Designations affect threshold multipliers and compliance monitoring per DMP Art.15.</li>
          <li>All designation changes are logged for regulatory audit (7-year retention per Law No. 09-08).</li>
        </ul>
        <div className="mt-3">
          <RegulatoryFrameworkLink className="text-primary-600 hover:underline" />
        </div>
      </div>

      {/* Designate modal */}
      {designateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDesignateOpen(false)} />
          <div className="relative bg-bg-primary rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Designate Critical Medicine</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Company</label>
              <select
                value={designateCompany ?? ""}
                onChange={(e) => setDesignateCompany(e.target.value || null)}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Product</label>
              <select
                value={designateProduct ?? ""}
                onChange={(e) => setDesignateProduct(e.target.value || null)}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
                disabled={!designateCompany}
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">SKU</label>
              <select
                value={designateSku ?? ""}
                onChange={(e) => setDesignateSku(e.target.value || null)}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
                disabled={!designateProduct}
              >
                <option value="">Select SKU</option>
                {skus.map((s) => (
                  <option key={s.id} value={s.id}>{s.sku_code} — {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Justification (required)</label>
              <textarea
                value={designateJustification}
                onChange={(e) => setDesignateJustification(e.target.value)}
                placeholder="Provide reason for designation..."
                rows={3}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
              />
            </div>
            {designateError && <p className="text-sm text-error-600">{designateError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setDesignateOpen(false)} className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary">
                Cancel
              </button>
              <button
                onClick={submitDesignate}
                disabled={designateSubmitting || !designateSku || !designateJustification.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
              >
                {designateSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(null)} />
          <div className="relative bg-bg-primary rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Edit designation</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Justification</label>
              <textarea
                value={editJustification}
                onChange={(e) => setEditJustification(e.target.value)}
                placeholder="Update justification..."
                rows={3}
                className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
              />
            </div>
            {designateError && <p className="text-sm text-error-600">{designateError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditOpen(null)} className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary">Cancel</button>
              <button onClick={saveEdit} disabled={!editJustification.trim()} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirmation modal */}
      {removeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRemoveOpen(null)} />
          <div className="relative bg-bg-primary rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Remove critical medicine designation</h2>
            <p className="text-sm text-text-secondary">Provide a reason for removal (required).</p>
            <textarea
              value={removeJustification}
              onChange={(e) => setRemoveJustification(e.target.value)}
              placeholder="Justification..."
              rows={3}
              className="w-full px-3 py-2 border border-border-default rounded-md text-sm"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRemoveOpen(null)} className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary">Cancel</button>
              <button
                onClick={() => removeDesignation(removeOpen, removeJustification)}
                disabled={!removeJustification.trim()}
                className="px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
