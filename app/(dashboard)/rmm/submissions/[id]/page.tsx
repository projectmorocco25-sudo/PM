/**
 * Wireframe: task-0.5.2.12-registry-submission-detail.md
 * Route: /rmm/submissions/[id]
 * Implements: Registry submission detail page with workflow status, approval history, and actions
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md
 * 
 * Database: registry_submissions, approval_history tables
 * RPC Functions: 
 *   - rmm_get_submission(user_id, submission_id)
 *   - rmm_get_approval_history(user_id, submission_id)
 * 
 * Features:
 * - Workflow status timeline
 * - Submission data display
 * - Approval history
 * - Role-based actions
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Submission {
  id: string;
  submission_type: string;
  entity_type: string;
  entity_id: string;
  submission_data: any;
  status: string;
  submitted_by: string;
  submitted_by_name: string | null;
  verified_by: string | null;
  verified_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  implemented_by: string | null;
  implemented_at: string | null;
  rejection_reason: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

interface ApprovalHistoryEntry {
  id: string;
  submission_id: string;
  action: string;
  performed_by: string;
  performed_by_name: string | null;
  performed_at: string;
  notes: string | null;
  regulatory_basis: string | null;
}

export default function RegistrySubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryEntry[]>([]);
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

  // Fetch submission and history
  useEffect(() => {
    if (!user || !submissionId || permissionsLoading) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        
        // Fetch submission
        const { data: submissionData, error: submissionError } = await supabase.rpc("rmm_get_submission", {
          p_submission_id: submissionId,
        });

        if (submissionError) {
          throw new Error(submissionError.message);
        }

        setSubmission(submissionData as Submission);

        // Fetch approval history
        const { data: historyData, error: historyError } = await supabase.rpc("rmm_get_approval_history", {
          p_submission_id: submissionId,
        });

        if (!historyError && historyData) {
          setApprovalHistory(historyData as ApprovalHistoryEntry[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submission");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, submissionId, permissionsLoading]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-50 text-blue-700";
      case "tier2_verified":
      case "tier2_peer_reviewed":
        return "bg-yellow-50 text-yellow-700";
      case "tier1_approved":
        return "bg-green-50 text-green-700";
      case "completed":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const workflowSteps = [
    { key: "draft", label: "Draft" },
    { key: "submitted", label: "Submitted" },
    { key: "tier2_verified", label: "Tier 2 Verified" },
    { key: "tier1_approved", label: "Tier 1 Approved" },
    { key: "completed", label: "Completed" },
  ];

  const getCurrentStepIndex = () => {
    if (!submission) return -1;
    const status = submission.status;
    if (status === "rejected") return -1;
    return workflowSteps.findIndex((step) => step.key === status);
  };

  if (permissionsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/rmm/submissions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/submissions" className="hover:text-text-primary">Submissions</Link>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Submission Details</h1>
          </div>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {error || "Submission not found"}
          </p>
          <Link
            href="/rmm/submissions"
            className="inline-block px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors mt-4"
          >
            Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/rmm/submissions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/submissions" className="hover:text-text-primary">Submissions</Link>
              {" > "}
              <span className="text-text-primary">{submission.id.substring(0, 8)}...</span>
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">
              Registry Submission - {submission.entity_type} {submission.submission_type.replace("_", " ")}
            </h1>
          </div>
        </div>
      </div>

      {/* Workflow Status */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Workflow Status</h2>
        <div className="space-y-4">
          {/* Workflow Timeline */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {workflowSteps.map((step, index) => {
              const isCompleted = currentStepIndex >= index;
              const isCurrent = currentStepIndex === index;
              return (
                <div key={step.key} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isCompleted
                          ? "bg-primary-500 border-primary-500 text-white"
                          : "bg-bg-secondary border-border-default text-text-secondary"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn("text-xs mt-1", isCurrent ? "font-medium text-primary-600" : "text-text-secondary")}>
                      {step.label}
                    </span>
                  </div>
                  {index < workflowSteps.length - 1 && (
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
            <p className="text-sm text-text-secondary">Current Status:</p>
            <span
              className={cn(
                "px-3 py-1 text-sm font-medium rounded mt-1 inline-block",
                getStatusBadgeColor(submission.status)
              )}
            >
              {formatStatus(submission.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Submission Data */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Submission Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary">Entity Type</label>
            <p className="text-text-primary font-medium capitalize">{submission.entity_type}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Entity</label>
            <p className="text-text-primary font-medium">{submission.company_name || submission.entity_id}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Action</label>
            <p className="text-text-primary font-medium capitalize">
              {submission.submission_type.replace("_", " ")}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Submitted By</label>
            <p className="text-text-primary">{submission.submitted_by_name || "Unknown"}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Submitted At</label>
            <p className="text-text-primary">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {submission.submission_data && (
          <div className="mt-4">
            <label className="text-sm text-text-secondary block mb-2">Changes</label>
            <pre className="bg-bg-secondary p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(submission.submission_data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Approval History */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Approval History</h2>
        {approvalHistory.length === 0 ? (
          <p className="text-sm text-text-secondary">No approval history available</p>
        ) : (
          <div className="space-y-4">
            {approvalHistory.map((entry, index) => (
              <div key={entry.id} className="border-l-2 border-primary-500 pl-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">
                      {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      by {entry.performed_by_name || "Unknown"} • {new Date(entry.performed_at).toLocaleString()}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-text-primary mt-2">{entry.notes}</p>
                    )}
                    {entry.regulatory_basis && (
                      <p className="text-xs text-text-secondary mt-1">
                        Regulatory Basis: {entry.regulatory_basis}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Reason */}
      {submission.rejection_reason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h2>
          <p className="text-red-700">{submission.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}
