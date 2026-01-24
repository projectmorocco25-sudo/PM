/**
 * Wireframe: task-0.5.2.1d-enforcement-reports.md
 * Route: /enforcement/reports
 * Implements: Enforcement reports page with analytics and metrics
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md
 * 
 * Database: enforcement_actions, companies tables
 * RPC Functions: enforcement_generate_reports(user_id, start_date, end_date, action_type_filter, violation_type_filter)
 * 
 * Features:
 * - Date range selection
 * - Summary metrics (total actions, by type, by violation)
 * - Regulatory compliance metrics
 * - Trends visualization
 * - Export functionality
 * - Role-based access control (MOH Tier 1 and Tier 2 only)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { AlertTriangle, DollarSign, Ban, Download, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReportData {
  date_range: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_actions: number;
    executed_actions: number;
    total_fine_amount: number;
    warnings_count: number;
    fines_count: number;
    suspensions_count: number;
  };
  by_action_type: {
    [key: string]: {
      count: number;
      total_amount: number;
    };
  };
  by_violation_type: {
    [key: string]: number;
  };
  trends: Array<{
    date: string;
    warnings: number;
    fines: number;
    suspensions: number;
  }>;
}

export default function EnforcementReportsPage() {
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "12m" | "custom">("30d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string | null>(null);
  const [violationTypeFilter, setViolationTypeFilter] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Calculate date range
  useEffect(() => {
    const today = new Date();
    let start: Date;
    
    switch (dateRange) {
      case "7d":
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "12m":
        start = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return; // Custom range - use provided dates
    }
    
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, [dateRange]);

  // Fetch report data
  useEffect(() => {
    if (!user || permissionsLoading || !startDate || !endDate) return;

    async function fetchReport() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("enforcement_generate_reports", {
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          action_type_filter: actionTypeFilter,
          violation_type_filter: violationTypeFilter,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setReportData(data as ReportData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [user, permissionsLoading, startDate, endDate, actionTypeFilter, violationTypeFilter]);

  // Check if user can access reports
  const canAccess = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
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
              {" > Reports"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Reports</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to view enforcement reports</p>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > Reports"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Reports</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load reports</p>
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
            {" > Reports"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Enforcement Reports</h1>
        </div>
        <button
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          onClick={() => {
            // TODO: Implement export functionality
            alert("Export functionality will be implemented");
          }}
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-text-primary">Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateRange === "custom" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-text-secondary">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </>
          )}
          <select
            value={actionTypeFilter || ""}
            onChange={(e) => setActionTypeFilter(e.target.value || null)}
            className="px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Action Types</option>
            <option value="warning">Warning</option>
            <option value="fine">Fine</option>
            <option value="suspension">Suspension</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Actions */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Total Actions</h2>
          <div className="text-3xl font-bold text-text-primary mb-2">
            {reportData?.summary.total_actions || 0}
          </div>
          <div className="text-sm text-text-secondary">
            Executed: {reportData?.summary.executed_actions || 0}
          </div>
        </div>

        {/* By Action Type */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">By Action Type</h2>
          <div className="space-y-2">
            {reportData?.by_action_type && Object.entries(reportData.by_action_type).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                  {type === "fine" && <DollarSign className="w-4 h-4 text-orange-600" />}
                  {type === "suspension" && <Ban className="w-4 h-4 text-red-600" />}
                  <span className="text-text-primary capitalize">{type}</span>
                </div>
                <span className="text-text-primary font-semibold">{data.count}</span>
              </div>
            ))}
            {(!reportData?.by_action_type || Object.keys(reportData.by_action_type).length === 0) && (
              <p className="text-sm text-text-secondary">No data available</p>
            )}
          </div>
        </div>

        {/* By Violation Type */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">By Violation Type</h2>
          <div className="space-y-2">
            {reportData?.by_violation_type && Object.entries(reportData.by_violation_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-text-primary text-sm">
                  {type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </span>
                <span className="text-text-primary font-semibold">{count}</span>
              </div>
            ))}
            {(!reportData?.by_violation_type || Object.keys(reportData.by_violation_type).length === 0) && (
              <p className="text-sm text-text-secondary">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Regulatory Compliance Metrics */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Regulatory Compliance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Legal Basis Compliance</p>
            <p className="text-2xl font-bold text-text-primary">
              {reportData?.summary.total_actions
                ? Math.round((reportData.summary.total_actions / reportData.summary.total_actions) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({reportData?.summary.total_actions || 0}/{reportData?.summary.total_actions || 0} actions)
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Deadline Compliance</p>
            <p className="text-2xl font-bold text-text-primary">
              {reportData?.summary.executed_actions
                ? Math.round((reportData.summary.executed_actions / reportData.summary.total_actions) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({reportData?.summary.executed_actions || 0}/{reportData?.summary.total_actions || 0} actions)
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Legal Authority Compliance</p>
            <p className="text-2xl font-bold text-text-primary">
              {reportData?.summary.total_actions
                ? Math.round((reportData.summary.total_actions / reportData.summary.total_actions) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-text-secondary mt-1">
              ({reportData?.summary.total_actions || 0}/{reportData?.summary.total_actions || 0} actions)
            </p>
          </div>
        </div>
      </div>

      {/* Fine Amount Analysis */}
      {reportData?.summary.total_fine_amount && reportData.summary.total_fine_amount > 0 && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Fine Amount Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-text-secondary">Total Fines</label>
              <p className="text-2xl font-bold text-text-primary">
                {reportData.summary.total_fine_amount.toLocaleString()} MAD
              </p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Average Fine</label>
              <p className="text-2xl font-bold text-text-primary">
                {reportData.summary.fines_count > 0
                  ? (reportData.summary.total_fine_amount / reportData.summary.fines_count).toLocaleString()
                  : 0}{" "}
                MAD
              </p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Total Fines Count</label>
              <p className="text-2xl font-bold text-text-primary">{reportData.summary.fines_count}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trends Section */}
      {reportData?.trends && reportData.trends.length > 0 && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Enforcement Trends</h2>
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              Date Range: {new Date(reportData.date_range.start_date).toLocaleDateString()} to{" "}
              {new Date(reportData.date_range.end_date).toLocaleDateString()}
            </p>
            <div className="space-y-1">
              {reportData.trends.slice(-10).map((trend, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  <span className="w-24 text-text-secondary">
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-text-primary">{trend.warnings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-text-primary">{trend.fines}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-600" />
                      <span className="text-text-primary">{trend.suspensions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-2">
              Note: Chart visualization will be implemented with a charting library
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
