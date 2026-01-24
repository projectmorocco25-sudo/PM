/**
 * Wireframe: task-0.5.2.1f-appeal-submission-form.md
 * Route: /enforcement/actions/[id]/appeal
 * Implements: Appeal submission form for Company users
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md
 * 
 * Database: enforcement_actions, enforcement_action_appeals tables
 * RPC Functions: 
 *   - enforcement_get_action(user_id, action_id)
 *   - enforcement_submit_appeal(submitter_user_id, enforcement_action_id, appeal_reason, evidence)
 * 
 * Features:
 * - Display enforcement action summary
 * - Appeal grounds selection
 * - Detailed explanation textarea
 * - Supporting documents upload (optional)
 * - Appeal deadline tracking
 * - Regulatory requirements display
 * - Role-based access control (Company users only)
 * - Responsive design
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Upload, X, AlertTriangle, DollarSign, Ban, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EnforcementAction {
  id: string;
  company_id: string;
  company_name: string | null;
  action_type: string;
  violation_type: string;
  legal_basis: string;
  justification: string;
  executed_at: string | null;
  status: string;
}

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  progress: number;
  error?: string;
}

const APPEAL_GROUNDS = [
  { value: "technical_error", label: "Technical Error" },
  { value: "procedural_issue", label: "Procedural Issue" },
  { value: "factual_inaccuracy", label: "Factual Inaccuracy" },
  { value: "mitigating_circumstances", label: "Mitigating Circumstances" },
  { value: "other", label: "Other" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;
const SUPPORTED_FORMATS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"];

export default function AppealSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const actionId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // State
  const [action, setAction] = useState<EnforcementAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grounds, setGrounds] = useState("");
  const [explanation, setExplanation] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appealDeadline, setAppealDeadline] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Fetch enforcement action
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

        if (!data) {
          throw new Error("Enforcement action not found");
        }

        setAction(data as EnforcementAction);

        // Calculate appeal deadline (30 days from execution)
        if (data.executed_at) {
          const executedDate = new Date(data.executed_at);
          const deadline = new Date(executedDate);
          deadline.setDate(deadline.getDate() + 30);
          setAppealDeadline(deadline);
          
          const now = new Date();
          const diffTime = deadline.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysRemaining(diffDays);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enforcement action");
      } finally {
        setLoading(false);
      }
    }

    fetchAction();
  }, [user, actionId, permissionsLoading]);

  // Check if user can submit appeals
  const canSubmit = permissions?.role && [
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
    ROLES.COMPANY_USER,
  ].includes(permissions.role as any);

  // Validate file
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)} MB limit`;
    }

    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(extension)) {
      return `File format not supported. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      setErrors({ files: `Maximum ${MAX_FILES} files allowed` });
      return;
    }

    const newFiles: UploadedFile[] = selectedFiles.map((file) => {
      const error = validateFile(file);
      return {
        file,
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        progress: 0,
        error: error || undefined,
      };
    });

    setFiles([...files, ...newFiles]);
    if (errors.files) {
      setErrors({ ...errors, files: "" });
    }
  };

  // Remove file
  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!grounds) {
      newErrors.grounds = "Grounds for appeal is required";
    }

    if (!explanation.trim()) {
      newErrors.explanation = "Detailed explanation is required";
    } else if (explanation.trim().length < 50) {
      newErrors.explanation = "Detailed explanation must be at least 50 characters";
    }

    if (files.some((f) => f.error)) {
      newErrors.files = "Please fix file errors before submitting";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !canSubmit || !action) return;

    // Check if appeal deadline has passed
    if (appealDeadline && daysRemaining !== null && daysRemaining < 0) {
      setErrors({ submit: "Appeal deadline has passed. Appeals must be submitted within 30 days of execution." });
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      
      // Prepare evidence JSONB (file metadata)
      let evidence: any = null;
      if (files.length > 0) {
        evidence = {
          files: files.map((f) => ({
            name: f.name,
            size: f.size,
            type: f.file.type,
            // Note: In a production system, files would be uploaded to Supabase Storage
            // and URLs would be stored here. For now, we store metadata only.
            uploaded: false,
          })),
        };
      }

      const { data, error: rpcError } = await supabase.rpc("enforcement_submit_appeal", {
        submitter_user_id: user.id,
        enforcement_action_id: actionId,
        appeal_reason: `${grounds}: ${explanation.trim()}`,
        evidence: evidence,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // Navigate to enforcement action detail page
      router.push(`/enforcement/actions/${actionId}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to submit appeal" });
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

  if (!canSubmit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/enforcement/actions/${actionId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Submit Appeal</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to submit appeals</p>
          <Link
            href={`/enforcement/actions/${actionId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Action
          </Link>
        </div>
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
          <h1 className="text-2xl font-semibold text-text-primary">Submit Appeal</h1>
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

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/enforcement/actions/${actionId}`} className="text-text-secondary hover:text-text-primary">
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
              <Link href={`/enforcement/actions/${actionId}`} className="hover:text-text-primary">
                {actionId.substring(0, 8)}...
              </Link>
              {" > Appeal"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Submit Appeal - {actionId.substring(0, 8)}...</h1>
          </div>
        </div>
      </div>

      {/* Enforcement Action Summary */}
      <div className="bg-bg-primary border border-border-default rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Enforcement Action Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-text-secondary">Action ID</label>
            <p className="text-text-primary font-mono">{action.id.substring(0, 8)}...</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Type</label>
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
        </div>
        
        {/* Legal Basis */}
        <div className="border-t border-border-default pt-4 mt-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Legal Basis (Fatima's Requirement)</h3>
          <p className="text-sm text-text-secondary mb-2">{action.legal_basis}</p>
          <p className="text-xs text-text-secondary">
            Regulatory Framework Reference: DMP Regulation Article [X], Section [Y]
          </p>
        </div>

        {/* Appeal Deadline */}
        {appealDeadline && daysRemaining !== null && (
          <div className={cn(
            "border-t border-border-default pt-4 mt-4",
            daysRemaining <= 7 && "bg-warning-50 rounded-lg p-4"
          )}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                Appeal Deadline: {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Appeal Deadline Date: {appealDeadline.toLocaleDateString()}
            </p>
            <p className="text-xs text-text-secondary">
              (30-day window per DMP regulations)
            </p>
          </div>
        )}
      </div>

      {/* Appeal Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grounds for Appeal */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Grounds for Appeal <span className="text-error-500">*</span>
          </h2>
          <select
            value={grounds}
            onChange={(e) => {
              setGrounds(e.target.value);
              if (errors.grounds) setErrors({ ...errors, grounds: "" });
            }}
            className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Grounds for Appeal</option>
            {APPEAL_GROUNDS.map((ground) => (
              <option key={ground.value} value={ground.value}>
                {ground.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-secondary mt-2">
            ℹ️ Select the primary reason for your appeal.
          </p>
          {errors.grounds && <p className="mt-1 text-sm text-error-500">{errors.grounds}</p>}
        </div>

        {/* Detailed Explanation */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Detailed Explanation <span className="text-error-500">*</span>
          </h2>
          <textarea
            value={explanation}
            onChange={(e) => {
              setExplanation(e.target.value);
              if (errors.explanation) setErrors({ ...errors, explanation: "" });
            }}
            placeholder="Enter detailed explanation of your appeal. Include specific details about why you believe the enforcement action should be reconsidered. Provide context, timeline, and any relevant information that supports your appeal."
            rows={8}
            className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-text-secondary mt-1">
            Character count: {explanation.length} / 50 minimum
          </p>
          <p className="text-xs text-text-secondary mt-1">
            ℹ️ Your explanation will be reviewed by MOH Tier 1. Be as detailed and specific as possible.
          </p>
          {errors.explanation && <p className="mt-1 text-sm text-error-500">{errors.explanation}</p>}
        </div>

        {/* Supporting Documents */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Supporting Documents (Optional)</h2>
          <div className="border-2 border-dashed border-border-default rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept={SUPPORTED_FORMATS.join(",")}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-primary mb-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Upload Files
              </button>
              {" or Drag & Drop"}
            </p>
            <p className="text-xs text-text-secondary">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max {MAX_FILE_SIZE / (1024 * 1024)} MB per file, {MAX_FILES} files maximum)
            </p>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg",
                    file.error ? "border-error-200 bg-error-50" : "border-border-default bg-bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{file.name}</p>
                      <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                      {file.error && (
                        <p className="text-xs text-error-500 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-text-secondary hover:text-error-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.files && <p className="mt-2 text-sm text-error-500">{errors.files}</p>}
        </div>

        {/* Appeal Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Appeal Information</h2>
          <div className="space-y-2 text-sm text-text-primary">
            <p className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span>Appeals are reviewed by MOH Tier 1</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span>You will be notified of the decision within 14 business days</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span>The appeal decision is final</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span>All appeal information is preserved in audit trail</span>
            </p>
          </div>
          <Link
            href="#"
            className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700 hover:underline"
          >
            View Appeal Process Guide
          </Link>
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
            href={`/enforcement/actions/${actionId}`}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !grounds || explanation.trim().length < 50 || files.some((f) => f.error)}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Appeal"}
          </button>
        </div>
      </form>
    </div>
  );
}
