/**
 * Wireframe: task-0.5.2.1-rmm-overview.md
 * Route: /rmm
 * Implements: RMM Overview page with statistics, quick links, compliance status, enforcement actions, recent activity, and submission deadlines
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md
 * 
 * Database: companies, products, skus, registry_submissions, enforcement_actions, approval_history tables
 * RPC Functions: 
 *   - rmm_get_statistics(user_id)
 *   - rmm_get_recent_activity(user_id, limit)
 *   - rmm_get_enforcement_actions(user_id, company_id, limit)
 *   - rmm_get_submission_deadlines(user_id)
 * 
 * Features:
 * - Statistics cards (Companies, Products, SKUs)
 * - Quick links section
 * - Regulatory compliance status (Fatima's Requirement)
 * - Active enforcement actions (Company users only - Fatima's Requirement)
 * - Recent activity timeline
 * - Registry submissions status with deadline tracking (Fatima's Requirement)
 * - Role-based filtering and access control
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { 
  Building2, Package, Box, FileText, FlaskConical, HeartPulse, Gavel,
  AlertTriangle, DollarSign, Ban, CheckCircle, Clock, ArrowRight, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RegulatoryFrameworkLink } from "@/components/RegulatoryFrameworkLink";
import type {
  RMMStatistics,
  RMMActivity,
  RMMEnforcementAction,
  RMMSubmissionDeadline,
  RMMListSubmissionsResponse,
} from "@/lib/types/rmm";

// Use shared type definitions from lib/types/rmm.ts
// These types are guaranteed to match RPC function return structures
// See: docs/02-architecture/database/rpc-contracts-rmm.md
type Statistics = RMMStatistics;
type Activity = RMMActivity;
type EnforcementAction = RMMEnforcementAction;
type SubmissionDeadline = RMMSubmissionDeadline;

export default function RMMOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [enforcementActions, setEnforcementActions] = useState<EnforcementAction[]>([]);
  const [submissionDeadlines, setSubmissionDeadlines] = useState<SubmissionDeadline[]>([]);
  const [submissionStats, setSubmissionStats] = useState<{ pending: number; approved: number; rejected: number } | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<{ status: string; violations: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch all data
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        // Fetch statistics
        const { data: statsData, error: statsError } = await supabase.rpc("rmm_get_statistics", {
          user_id: user.id,
        });

        if (statsError) throw new Error(statsError.message);
        setStatistics(statsData as Statistics);

        // Fetch recent activity
        const { data: activityData, error: activityError } = await supabase.rpc("rmm_get_recent_activity", {
          user_id: user.id,
          p_limit: 10,
        });

        if (activityError) throw new Error(activityError.message);
        setRecentActivity((activityData as Activity[]) || []);

        // Fetch enforcement actions (Company users only)
        if (isCompanyRole(permissions?.role as any) && permissions?.company_id) {
          const { data: enforcementData, error: enforcementError } = await supabase.rpc("rmm_get_enforcement_actions", {
            user_id: user.id,
            company_id: permissions.company_id,
            p_limit: 10,
          });

          if (enforcementError) throw new Error(enforcementError.message);
          setEnforcementActions((enforcementData as EnforcementAction[]) || []);

          // Calculate compliance status from enforcement actions
          const violations = (enforcementData as EnforcementAction[])?.filter(
            (a) => a.status === "executed" && a.action_type !== "warning"
          ).length || 0;
          setComplianceStatus({
            status: violations === 0 ? "compliant" : "non_compliant",
            violations,
          });
        } else {
          setEnforcementActions([]);
          setComplianceStatus({ status: "n/a", violations: 0 });
        }

        // Fetch submission deadlines
        const { data: deadlinesData, error: deadlinesError } = await supabase.rpc("rmm_get_submission_deadlines", {
          user_id: user.id,
        });

        if (deadlinesError) throw new Error(deadlinesError.message);
        setSubmissionDeadlines((deadlinesData as SubmissionDeadline[]) || []);

        // Fetch submission statistics
        // Note: rmm_list_submissions uses auth.uid() internally, doesn't need user_id parameter
        const { data: submissionsData, error: submissionsError } = await supabase.rpc("rmm_list_submissions", {
          p_limit: 1000,
          p_offset: 0,
          p_status: null,
          p_submission_type: null,
          p_entity_type: null,
          p_company_id: isCompanyRole(permissions?.role as any) ? permissions?.company_id : null,
          p_search: null,
          p_sort_by: "created_at",
          p_sort_order: "DESC",
        });

        if (submissionsError) throw new Error(submissionsError.message);
        const response = submissionsData as RMMListSubmissionsResponse;
        const submissions = response?.data || [];
        setSubmissionStats({
          pending: submissions.filter((s: any) => s.status === "submitted" || s.status === "tier2_verified").length,
          approved: submissions.filter((s: any) => s.status === "tier1_approved" || s.status === "completed").length,
          rejected: submissions.filter((s: any) => s.status === "rejected").length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load RMM overview");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, permissionsLoading, permissions]);

  // Format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Get enforcement action icon
  const getEnforcementIcon = (actionType: string) => {
    switch (actionType) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case "fine":
        return <DollarSign className="w-5 h-5 text-error-500" />;
      case "suspension":
        return <Ban className="w-5 h-5 text-error-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-text-secondary" />;
    }
  };

  // Get urgency indicator
  const getUrgencyIndicator = (daysRemaining: number | null): string => {
    if (daysRemaining === null) return "";
    if (daysRemaining < 7) return "🔴";
    if (daysRemaining < 14) return "🟡";
    return "";
  };

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-text-secondary mb-2">
            <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
            {" > RMM"}
          </nav>
          <h1 className="text-2xl font-semibold text-text-primary">Registry Management Module (RMM)</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">Unable to load RMM overview</p>
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
      <div>
        <nav className="text-sm text-text-secondary mb-2">
          <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
          {" > RMM"}
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-text-primary">Registry Management Module (RMM)</h1>
          <span className="px-2 py-1 text-xs font-medium rounded bg-primary-50 text-primary-700">
            Core Module
          </span>
        </div>
      </div>

      {/* Module Summary Card */}
      <div className="bg-bg-secondary rounded-lg p-4">
        <p className="text-text-primary">
          RMM manages company registrations, products, SKUs, and registry submissions. This module is the foundation for all other modules.
        </p>
      </div>

      {/* Statistics Cards (3-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Companies Card */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Companies</h2>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total:</span>
              <span className="font-semibold text-text-primary">{statistics?.companies.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active:</span>
              <span className="font-semibold text-success-600">{statistics?.companies.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Inactive:</span>
              <span className="font-semibold text-text-secondary">{statistics?.companies.inactive || 0}</span>
            </div>
          </div>
          <Link
            href="/rmm/companies"
            className="inline-block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {/* Products Card */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Products</h2>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total:</span>
              <span className="font-semibold text-text-primary">{statistics?.products.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active:</span>
              <span className="font-semibold text-success-600">{statistics?.products.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Inactive:</span>
              <span className="font-semibold text-text-secondary">{statistics?.products.inactive || 0}</span>
            </div>
          </div>
          <Link
            href="/rmm/products"
            className="inline-block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {/* SKUs Card */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">SKUs</h2>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total:</span>
              <span className="font-semibold text-text-primary">{statistics?.skus.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active:</span>
              <span className="font-semibold text-success-600">{statistics?.skus.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Inactive:</span>
              <span className="font-semibold text-text-secondary">{statistics?.skus.inactive || 0}</span>
            </div>
          </div>
          <Link
            href="/rmm/skus"
            className="inline-block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/rmm/companies"
            className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Companies
          </Link>
          <Link
            href="/rmm/products"
            className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Products
          </Link>
          <Link
            href="/rmm/skus"
            className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Box className="w-4 h-4" />
            SKUs
          </Link>
          <Link
            href="/rmm/submissions"
            className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Submissions
          </Link>
          {!isCompanyRole(permissions?.role as any) && (
            <>
              <Link
                href="/rmm/atc-codes"
                className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
              >
                <FlaskConical className="w-4 h-4" />
                ATC Codes
              </Link>
              <Link
                href="/rmm/critical-medicines"
                className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
              >
                <HeartPulse className="w-4 h-4" />
                Critical Medicines
              </Link>
            </>
          )}
          <Link
            href="/enforcement"
            className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-tertiary transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            Enforcement
          </Link>
        </div>
      </div>

      {/* Regulatory Compliance Status Section (Fatima's Requirement) */}
      {isCompanyRole(permissions?.role as any) && complianceStatus && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Regulatory Compliance Status</h2>
          <div className="flex items-center gap-4 mb-4">
            {complianceStatus.status === "compliant" ? (
              <span className="px-3 py-1 text-sm font-medium rounded bg-success-50 text-success-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                ✓ Compliant
              </span>
            ) : complianceStatus.status === "non_compliant" ? (
              <span className="px-3 py-1 text-sm font-medium rounded bg-error-50 text-error-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ⚠️ Non-Compliant ({complianceStatus.violations} violation{complianceStatus.violations !== 1 ? "s" : ""})
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium rounded bg-warning-50 text-warning-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                🟡 Under Review
              </span>
            )}
          </div>
          <Link
            href="/enforcement"
            className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center gap-1"
          >
            View Detailed Compliance Status
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Active Enforcement Actions Section (Company Users Only - Fatima's Requirement) */}
      {isCompanyRole(permissions?.role as any) && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Active Enforcement Actions</h2>
          {enforcementActions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-2" />
              <p className="text-text-primary font-medium">No active enforcement actions</p>
              <p className="text-text-secondary text-sm">Your company is in good standing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enforcementActions.map((action) => (
                <div
                  key={action.id}
                  className="border border-border-default rounded-lg p-4 hover:bg-bg-secondary transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {getEnforcementIcon(action.action_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text-primary capitalize">
                          {action.action_type === "fine" && action.amount
                            ? `Fine - ${action.amount} ${action.currency}`
                            : action.action_type === "warning"
                            ? "Warning"
                            : "Suspension"}
                        </span>
                        {action.violation_type && (
                          <span className="text-xs text-text-secondary capitalize">
                            - {action.violation_type.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-text-secondary">Legal Basis: </span>
                          <span className="text-text-primary font-medium">{action.legal_basis}</span>
                        </div>
                        {action.appeal_window_open && action.days_remaining !== null ? (
                          <div>
                            <span className="text-text-secondary">Appeal Deadline: </span>
                            <span className={cn(
                              "font-medium",
                              action.days_remaining < 7 ? "text-error-600" : "text-warning-600"
                            )}>
                              {getUrgencyIndicator(action.days_remaining)} {action.days_remaining} days remaining
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-text-secondary">Appeal Window: </span>
                            <span className="text-text-secondary">Closed</span>
                          </div>
                        )}
                        <div>
                          <span className="text-text-secondary">Required Action: </span>
                          <span className="text-text-primary">{action.required_action}</span>
                        </div>
                        {action.status && (
                          <div>
                            <span className="text-text-secondary">Status: </span>
                            <span className="text-text-primary capitalize">{action.status.replace(/_/g, " ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/enforcement/actions/${action.id}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center gap-1 mt-2"
                  >
                    View Enforcement Action
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
              <Link
                href="/enforcement/actions"
                className="block text-center text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium mt-4"
              >
                View All Enforcement Actions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-text-secondary text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className="text-text-secondary">•</span>
                <div className="flex-1">
                  <span className="text-text-primary">{activity.description}</span>
                  <span className="text-text-secondary ml-2">({formatRelativeTime(activity.timestamp)})</span>
                </div>
              </div>
            ))}
            <Link
              href="/history"
              className="block text-center text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium mt-4"
            >
              View Full History
            </Link>
          </div>
        )}
      </div>

      {/* Registry Submissions Status Card (Fatima's Requirement) */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Registry Submissions Status</h2>
        {submissionStats && (
          <div className="flex items-center gap-6 mb-6">
            <div>
              <span className="text-text-secondary text-sm">Pending: </span>
              <span className="font-semibold text-warning-600">{submissionStats.pending}</span>
            </div>
            <div>
              <span className="text-text-secondary text-sm">Approved: </span>
              <span className="font-semibold text-success-600">{submissionStats.approved}</span>
            </div>
            <div>
              <span className="text-text-secondary text-sm">Rejected: </span>
              <span className="font-semibold text-error-600">{submissionStats.rejected}</span>
            </div>
          </div>
        )}

        {submissionDeadlines.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-text-primary mb-3">Submission Deadlines:</h3>
            <div className="space-y-3">
              {submissionDeadlines.map((deadline, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary">{deadline.submission_type}</span>
                    <span className="text-text-secondary text-sm">
                      Due {new Date(deadline.due_date).toLocaleDateString()}
                    </span>
                    <span className={cn(
                      "font-medium text-sm",
                      deadline.days_remaining < 7 ? "text-error-600" : deadline.days_remaining < 14 ? "text-warning-600" : "text-text-primary"
                    )}>
                      {getUrgencyIndicator(deadline.days_remaining)} ({deadline.days_remaining} days remaining)
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    Regulatory: {deadline.regulatory_reference} - {deadline.regulatory_description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4">
          <RegulatoryFrameworkLink />
        </div>

        <Link
          href="/rmm/submissions"
          className="inline-block mt-6 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          View All Submissions
        </Link>
      </div>
    </div>
  );
}
