/**
 * Wireframe: task-0.5.2.1a-enforcement-action-detail.md
 * Route: /enforcement/actions/[id]
 * Implements: Enforcement action detail page with workflow status, approval chain, and appeal information
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md
 * 
 * Database: enforcement_actions, enforcement_action_appeals, companies, approval_history tables
 * RPC Functions: 
 *   - enforcement_get_action(user_id, action_id)
 *   - enforcement_get_appeals() (if needed)
 * 
 * Features:
 * - Enforcement cycle status timeline
 * - Action information display
 * - Approval chain
 * - Appeal status and submission
 * - Role-based access control
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES, isCompanyRole } from "@/lib/constants/roles";
import { ArrowLeft, Edit, AlertTriangle, DollarSign, Ban, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EnforcementAction {
  id: string;
  company_id: string;
  company_name: string | null;
  action_type: string;
  violation_type: string;
  violation_reference_id: string | null;
  violation_reference_table: string | null;
  amount: number | null;
  currency: string;
  status: string;
  legal_basis: string;
  justification: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  approval_notes: string | null;
  executed_by: string | null;
  executed_at: string | null;
  execution_notes: string | null;
  appeal_id: string | null;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  updated_at: string;
}

type Tab = "details" | "history" | "appeal";

export default function EnforcementActionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const actionId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [action, setAction] = useState<EnforcementAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch action
  useEffect(() => {
    if (!user || !actionId || permissionsLoading) return;

    async function fetchAction() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("enforcement_get_action", {
          user_id: user.id,
          action_id: actionId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setAction(data as EnforcementAction);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enforcement action");
      } finally {
        setLoading(false);
      }
    }

    fetchAction();
  }, [user, actionId, permissionsLoading]);

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
        return <AlertTriangle className="w-5 h-5" />;
      case "fine":
        return <DollarSign className="w-5 h-5" />;
      case "suspension":
        return <Ban className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const formatViolationType = (violationType: string) => {
    return violationType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const canAppeal = isCompanyRole(permissions?.role as any) &&
    action?.status === "executed" &&
    action?.executed_at &&
    new Date(action.executed_at).getTime() + 30 * 24 * 60 * 60 * 1000 > Date.now() &&
    !action.appeal_id;

  const appealDaysRemaining = action?.executed_at
    ? Math.max(
        0,
        Math.floor(
          (new Date(action.executed_at).getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) /
            (24 * 60 * 60 * 1000)
        )
      )
    : null;

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > "}
              <Link href="/enforcement/actions" className="hover:text-text-primary">Actions</Link>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Enforcement Action Details</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "Enforcement action not found"}
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

  const workflowStages = [
    { key: "creation", label: "Creation", completed: !!action.created_at },
    { key: "review", label: "Review", completed: !!action.reviewed_at },
    { key: "approval", label: "Approval", completed: !!action.approved_at },
    { key: "execution", label: "Execution", completed: !!action.executed_at },
    { key: "appeal", label: "Appeal", completed: !!action.appeal_id },
    { key: "resolution", label: "Resolution", completed: !!action.resolved_at },
  ];

  const currentStage = workflowStages.findIndex((stage) => !stage.completed);
  const currentStageKey = currentStage >= 0 ? workflowStages[currentStage].key : "resolution";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > "}
              <Link href="/enforcement/actions" className="hover:text-text-primary">Actions</Link>
              {" > "}
              <span className="text-text-primary">{action.id.substring(0, 8)}...</span>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              {getActionTypeIcon(action.action_type)}
              {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)} - {formatViolationType(action.violation_type)}
            </h1>
          </div>
        </div>
        {!isCompanyRole(permissions?.role as any) && action.status === "draft" && (
          <Link
            href={`/enforcement/actions/${actionId}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        )}
      </div>

      {/* Enforcement Cycle Status */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Enforcement Cycle Status</h2>
        <div className="space-y-4">
          {/* Workflow Timeline */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {workflowStages.map((stage, index) => {
              const isCompleted = stage.completed;
              const isCurrent = !isCompleted && index === currentStage;
              return (
                <div key={stage.key} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isCompleted
                          ? "bg-primary-500 border-primary-500 text-white"
                          : isCurrent
                          ? "bg-yellow-500 border-yellow-500 text-white"
                          : "bg-bg-secondary border-border-default text-text-secondary"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn("text-xs mt-1", isCurrent ? "font-medium text-yellow-600" : "text-text-secondary")}>
                      {stage.label}
                    </span>
                  </div>
                  {index < workflowStages.length - 1 && (
                    <div
                      className={cn(
                        "w-16 h-0.5 mx-2",
                        isCompleted ? "bg-primary-500" : "bg-border-default"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <p className="text-sm text-text-secondary">Current Stage:</p>
            <span className="text-text-primary font-medium capitalize">{currentStageKey}</span>
            {action.executed_at && (
              <p className="text-sm text-text-secondary mt-1">
                Executed: {new Date(action.executed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Information */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Action Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="text-sm text-text-secondary">Violation Type</label>
            <p className="text-text-primary">{formatViolationType(action.violation_type)}</p>
          </div>
          {action.amount && (
            <div>
              <label className="text-sm text-text-secondary">Amount</label>
              <p className="text-text-primary font-medium">
                {action.amount} {action.currency}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Status</label>
            <p>
              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 capitalize">
                {action.status.replace("_", " ")}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Legal Basis</label>
            <p className="text-text-primary">{action.legal_basis}</p>
          </div>
          {action.justification && (
            <div className="md:col-span-2">
              <label className="text-sm text-text-secondary">Justification</label>
              <p className="text-text-primary">{action.justification}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Chain */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Approval Chain</h2>
        <div className="space-y-4">
          {action.created_at && (
            <div className="border-l-2 border-primary-500 pl-4">
              <p className="font-medium text-text-primary">Created</p>
              <p className="text-sm text-text-secondary">
                {new Date(action.created_at).toLocaleString()}
              </p>
            </div>
          )}
          {action.reviewed_at && (
            <div className="border-l-2 border-primary-500 pl-4">
              <p className="font-medium text-text-primary">Reviewed</p>
              <p className="text-sm text-text-secondary">
                {new Date(action.reviewed_at).toLocaleString()}
              </p>
              {action.review_notes && (
                <p className="text-sm text-text-primary mt-1">{action.review_notes}</p>
              )}
            </div>
          )}
          {action.approved_at && (
            <div className="border-l-2 border-primary-500 pl-4">
              <p className="font-medium text-text-primary">Approved</p>
              <p className="text-sm text-text-secondary">
                {new Date(action.approved_at).toLocaleString()}
              </p>
              {action.approval_notes && (
                <p className="text-sm text-text-primary mt-1">{action.approval_notes}</p>
              )}
            </div>
          )}
          {action.executed_at && (
            <div className="border-l-2 border-primary-500 pl-4">
              <p className="font-medium text-text-primary">Executed</p>
              <p className="text-sm text-text-secondary">
                {new Date(action.executed_at).toLocaleString()}
              </p>
              {action.execution_notes && (
                <p className="text-sm text-text-primary mt-1">{action.execution_notes}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appeal Status */}
      {action.executed_at && (
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Appeal Status</h2>
          <div className="space-y-4">
            {action.appeal_id ? (
              <div>
                <p className="text-text-primary">Appeal Submitted</p>
                <p className="text-sm text-text-secondary">
                  Appeal ID: {action.appeal_id.substring(0, 8)}...
                </p>
                <Link
                  href={`/enforcement/appeals/${action.appeal_id}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline text-sm mt-2 inline-block"
                >
                  View Appeal →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-text-primary">
                  {canAppeal ? "Appeal Window: Active" : "Appeal Window: Closed"}
                </p>
                {appealDaysRemaining !== null && (
                  <p className="text-sm text-text-secondary">
                    {appealDaysRemaining > 0
                      ? `${appealDaysRemaining} days remaining (30-day window)`
                      : "Appeal deadline has passed"}
                  </p>
                )}
                {canAppeal && (
                  <Link
                    href={`/enforcement/actions/${actionId}/appeal`}
                    className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Submit Appeal
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border-default">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "details"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors",
              activeTab === "history"
                ? "border-primary-500 text-primary-600 font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            History
          </button>
          {action.appeal_id && (
            <button
              onClick={() => setActiveTab("appeal")}
              className={cn(
                "px-4 py-2 border-b-2 transition-colors",
                activeTab === "appeal"
                  ? "border-primary-500 text-primary-600 font-medium"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              Appeal
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        {activeTab === "details" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Details</h2>
            <div className="space-y-2">
              {action.violation_reference_id && (
                <div>
                  <label className="text-sm text-text-secondary">Violation Reference</label>
                  <p className="text-text-primary">
                    {action.violation_reference_table}: {action.violation_reference_id.substring(0, 8)}...
                  </p>
                </div>
              )}
              {action.notes && (
                <div>
                  <label className="text-sm text-text-secondary">Notes</label>
                  <p className="text-text-primary">{action.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">History</h2>
            <div className="space-y-3">
              {action.executed_at && (
                <div className="border-l-2 border-primary-500 pl-4">
                  <p className="text-sm text-text-primary">
                    Status changed to "Executed" - {new Date(action.executed_at).toLocaleString()}
                  </p>
                </div>
              )}
              {action.approved_at && (
                <div className="border-l-2 border-primary-500 pl-4">
                  <p className="text-sm text-text-primary">
                    Approved - {new Date(action.approved_at).toLocaleString()}
                  </p>
                </div>
              )}
              {action.reviewed_at && (
                <div className="border-l-2 border-primary-500 pl-4">
                  <p className="text-sm text-text-primary">
                    Reviewed - {new Date(action.reviewed_at).toLocaleString()}
                  </p>
                </div>
              )}
              {action.created_at && (
                <div className="border-l-2 border-primary-500 pl-4">
                  <p className="text-sm text-text-primary">
                    Created - {new Date(action.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "appeal" && action.appeal_id && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Appeal</h2>
            <p className="text-sm text-text-secondary">
              Appeal details will be loaded here. Appeal ID: {action.appeal_id.substring(0, 8)}...
            </p>
            <Link
              href={`/enforcement/appeals/${action.appeal_id}`}
              className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
            >
              View Appeal Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
