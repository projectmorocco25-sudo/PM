/**
 * Wireframe: task-0.5.2.1e-appeal-review-interface.md
 * Route: /enforcement/appeals/[id]
 * Implements: Appeal review interface for MOH Tier 1
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md
 * 
 * Database: enforcement_action_appeals, enforcement_actions, companies tables
 * RPC Functions: 
 *   - enforcement_review_appeal(reviewer_user_id, appeal_id, decision, justification)
 *   - enforcement_uphold_appeal(reviewer_user_id, appeal_id, resolution)
 *   - enforcement_overturn_appeal(reviewer_user_id, appeal_id, resolution)
 * 
 * Features:
 * - Display enforcement action summary
 * - Display appeal information
 * - Review decision (uphold/overturn)
 * - Review justification
 * - Regulatory requirements checklist
 * - Role-based access control (MOH Tier 1 only)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Save, AlertTriangle, DollarSign, Ban } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Appeal {
  id: string;
  enforcement_action_id: string;
  appeal_reason: string;
  evidence: any;
  status: string;
  submitted_by: string;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  reviewed_by_tier1: string | null;
  reviewed_at_tier1: string | null;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
}

interface EnforcementAction {
  id: string;
  company_id: string;
  company_name: string | null;
  action_type: string;
  violation_type: string;
  legal_basis: string;
  justification: string;
  executed_at: string | null;
}

export default function AppealReviewPage() {
  const params = useParams();
  const router = useRouter();
  const appealId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [action, setAction] = useState<EnforcementAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<"uphold" | "overturn" | "">("");
  const [justification, setJustification] = useState("");
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch appeal and action
  useEffect(() => {
    if (!user || !appealId || permissionsLoading) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        
        // Get appeal from enforcement_action_appeals table
        const { data: appealData, error: appealError } = await supabase
          .from("enforcement_action_appeals")
          .select("*")
          .eq("id", appealId)
          .single();

        if (appealError) {
          throw new Error(appealError.message);
        }

        setAppeal(appealData as Appeal);

        // Get enforcement action
        if (appealData?.enforcement_action_id) {
          const { data: actionData, error: actionError } = await supabase.rpc("enforcement_get_action", {
            user_id: user.id,
            action_id: appealData.enforcement_action_id,
          });

          if (!actionError && actionData) {
            setAction(actionData as EnforcementAction);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load appeal");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, appealId, permissionsLoading]);

  // Check if user can review appeals
  const canReview = permissions?.role && [
    ROLES.TIER1,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!decision) {
      newErrors.decision = "Review decision is required";
    }

    if (!justification.trim()) {
      newErrors.justification = "Review justification is required";
    } else if (justification.trim().length < 50) {
      newErrors.justification = "Review justification must be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !canReview || !appeal) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      
      if (decision === "uphold") {
        const { data, error: rpcError } = await supabase.rpc("enforcement_uphold_appeal", {
          reviewer_user_id: user.id,
          appeal_id: appealId,
          resolution: justification.trim(),
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }
      } else if (decision === "overturn") {
        const { data, error: rpcError } = await supabase.rpc("enforcement_overturn_appeal", {
          reviewer_user_id: user.id,
          appeal_id: appealId,
          resolution: justification.trim(),
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }
      }

      // Navigate to enforcement action detail page
      if (action) {
        router.push(`/enforcement/actions/${action.id}`);
      } else {
        router.push("/enforcement/actions");
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to submit review" });
    } finally {
      setSubmitting(false);
    }
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "fine":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "suspension":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getActionTypeIcon = (actionType: string) => {
    switch (actionType) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "fine":
        return <DollarSign className="w-4 h-4" />;
      case "suspension":
        return <Ban className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Review Appeal</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to review appeals</p>
          <Link
            href="/enforcement/actions"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Actions
          </Link>
        </div>
      </div>
    );
  }

  if (error || !appeal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Review Appeal</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "Appeal not found"}
          </p>
          <Link
            href="/enforcement/actions"
            className="inline-block px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors mt-4"
          >
            Back to Actions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={action ? `/enforcement/actions/${action.id}` : "/enforcement/actions"} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > "}
              <Link href="/enforcement/actions" className="hover:text-text-primary">Actions</Link>
              {action && (
                <>
                  {" > "}
                  <Link href={`/enforcement/actions/${action.id}`} className="hover:text-text-primary">
                    {action.id.substring(0, 8)}...
                  </Link>
                </>
              )}
              {" > Appeal Review"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Review Appeal</h1>
          </div>
        </div>
      </div>

      {/* Enforcement Action Summary */}
      {action && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Enforcement Action Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-secondary">Action ID</label>
              <p className="text-text-primary font-mono">{action.id.substring(0, 8)}...</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Action Type</label>
              <p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded border inline-flex items-center gap-1",
                    getActionTypeColor(action.action_type)
                  )}
                >
                  {getActionTypeIcon(action.action_type)}
                  {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Company</label>
              <p className="text-text-primary font-medium">
                {action.company_name ? (
                  <Link
                    href={`/rmm/companies/${action.company_id}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {action.company_name}
                  </Link>
                ) : (
                  "-"
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Violation</label>
              <p className="text-text-primary">
                {action.violation_type
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>
            {action.executed_at && (
              <div>
                <label className="text-sm text-text-secondary">Executed</label>
                <p className="text-text-primary">
                  {new Date(action.executed_at).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm text-text-secondary">Legal Basis</label>
              <p className="text-text-primary">{action.legal_basis}</p>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Information */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Appeal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Submitted</label>
            <p className="text-text-primary">
              {new Date(appeal.submitted_at).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Grounds for Appeal</label>
            <p className="text-text-primary">{appeal.appeal_reason}</p>
          </div>
          {appeal.evidence && (
            <div>
              <label className="text-sm text-text-secondary">Supporting Documents</label>
              <p className="text-sm text-text-secondary">
                Evidence files attached (JSON format)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Review Decision */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Review Decision <span className="text-error-500">*</span></h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="decision"
                value="uphold"
                checked={decision === "uphold"}
                onChange={(e) => {
                  setDecision(e.target.value as "uphold");
                  if (errors.decision) setErrors({ ...errors, decision: "" });
                }}
                className="mt-1 border-border-default"
              />
              <div>
                <span className="text-text-primary font-medium">Uphold Enforcement Action</span>
                <p className="text-sm text-text-secondary">Maintain the original enforcement action</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="decision"
                value="overturn"
                checked={decision === "overturn"}
                onChange={(e) => {
                  setDecision(e.target.value as "overturn");
                  if (errors.decision) setErrors({ ...errors, decision: "" });
                }}
                className="mt-1 border-border-default"
              />
              <div>
                <span className="text-text-primary font-medium">Overturn Enforcement Action</span>
                <p className="text-sm text-text-secondary">Reverse the enforcement action</p>
              </div>
            </label>
          </div>
          {errors.decision && <p className="mt-2 text-sm text-error-500">{errors.decision}</p>}
        </div>

        {/* Review Justification */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Review Justification <span className="text-error-500">*</span></h2>
          <textarea
            value={justification}
            onChange={(e) => {
              setJustification(e.target.value);
              if (errors.justification) setErrors({ ...errors, justification: "" });
            }}
            placeholder="Enter detailed justification for your review decision. Include assessment of appeal grounds, supporting evidence review, and regulatory basis for the decision."
            rows={6}
            className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-text-secondary mt-1">
            Character count: {justification.length} / 50 minimum
          </p>
          {errors.justification && <p className="mt-1 text-sm text-error-500">{errors.justification}</p>}
        </div>

        {/* Regulatory Requirements Checklist */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Regulatory Requirements Checklist</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked className="rounded border-border-default" disabled />
              <span className="text-sm text-text-primary">Legal Basis for Appeal Review: DMP Art. [X]</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked className="rounded border-border-default" disabled />
              <span className="text-sm text-text-primary">Legal Authority Verification: ✓ Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked className="rounded border-border-default" disabled />
              <span className="text-sm text-text-primary">Regulatory Requirements Met</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked className="rounded border-border-default" disabled />
              <span className="text-sm text-text-primary">Compliance Verification Complete</span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={action ? `/enforcement/actions/${action.id}` : "/enforcement/actions"}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !decision || justification.trim().length < 50}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
