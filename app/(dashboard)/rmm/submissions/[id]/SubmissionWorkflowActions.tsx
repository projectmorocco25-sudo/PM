"use client";

/**
 * Wireframe: task-0.5.2.13-registry-submission-workflow-states.md
 * Task: 1.1.2.28
 * Implements: Workflow action buttons and confirmation modals — Verify, Peer Review, Approve, Implement, Reject.
 * API: rmm_verify_registry_submission, rmm_peer_review_registry_submission, rmm_approve_registry_submission,
 *   rmm_implement_registry_update, rmm_reject_registry_submission (hosted Supabase only).
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SubmissionWorkflowActionsProps = {
  submissionId: string;
  allowedActions: string[];
};

type ModalKind = "verify" | "peer_review" | "approve" | "implement" | "reject" | null;

export function SubmissionWorkflowActions({
  submissionId,
  allowedActions,
}: SubmissionWorkflowActionsProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalKind>(null);
  const [comments, setComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const has = (action: string) => allowedActions.includes(action);

  async function handleVerify() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("rmm_verify_registry_submission", {
      submission_id: submissionId,
      comments: comments.trim() || null,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message ?? "Verification failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Verification failed.");
      return;
    }
    setModal(null);
    setComments("");
    router.refresh();
  }

  async function handlePeerReview() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("rmm_peer_review_registry_submission", {
      submission_id: submissionId,
      comments: comments.trim() || null,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message ?? "Peer review failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Peer review failed.");
      return;
    }
    setModal(null);
    setComments("");
    router.refresh();
  }

  async function handleApprove() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("rmm_approve_registry_submission", {
      submission_id: submissionId,
      comments: comments.trim() || null,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message ?? "Approval failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Approval failed.");
      return;
    }
    setModal(null);
    setComments("");
    router.refresh();
  }

  async function handleImplement() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("rmm_implement_registry_update", {
      submission_id: submissionId,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message ?? "Implementation failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Implementation failed.");
      return;
    }
    setModal(null);
    router.refresh();
  }

  async function handleReject() {
    const reason = rejectionReason.trim();
    if (reason.length < 10) {
      setError("Rejection reason must be at least 10 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("rmm_reject_registry_submission", {
      submission_id: submissionId,
      rejection_reason: reason,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message ?? "Rejection failed.");
      return;
    }
    const payload = data as { error?: string; message?: string };
    if (payload?.error) {
      setError(payload.message ?? payload.error ?? "Rejection failed.");
      return;
    }
    setModal(null);
    setRejectionReason("");
    router.refresh();
  }

  function closeModal() {
    if (!loading) {
      setModal(null);
      setComments("");
      setRejectionReason("");
      setError(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white p-4">
        <p className="text-sm font-medium text-[#6b7280]">Workflow actions (DMP Art. 10):</p>
        {has("verify") && (
          <button
            type="button"
            onClick={() => setModal("verify")}
            className="rounded-md border border-[#3b82f6] bg-[#3b82f6] px-3 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
          >
            Verify
          </button>
        )}
        {has("peer_review") && (
          <button
            type="button"
            onClick={() => setModal("peer_review")}
            className="rounded-md border border-[#eab308] bg-[#eab308] px-3 py-2 text-sm font-medium text-[#1f2937] hover:bg-[#ca8a04]"
          >
            Peer Review
          </button>
        )}
        {has("approve") && (
          <button
            type="button"
            onClick={() => setModal("approve")}
            className="rounded-md border border-[#16a34a] bg-[#16a34a] px-3 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
          >
            Approve
          </button>
        )}
        {has("implement") && (
          <button
            type="button"
            onClick={() => setModal("implement")}
            className="rounded-md border border-[#16a34a] bg-[#16a34a] px-3 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
          >
            Implement
          </button>
        )}
        {has("reject") && (
          <button
            type="button"
            onClick={() => setModal("reject")}
            className="rounded-md border border-[#dc2626] bg-white px-3 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Reject
          </button>
        )}
      </div>

      {/* Modals */}
      {modal === "verify" && (
        <WorkflowModal
          title="Verify submission"
          body="Confirm verification of this registry submission. Regulatory: DMP Art. 10."
          loading={loading}
          error={error}
          onClose={closeModal}
          onSubmit={handleVerify}
          submitLabel="Verify"
          submitClass="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
          comments={comments}
          onCommentsChange={setComments}
        />
      )}
      {modal === "peer_review" && (
        <WorkflowModal
          title="Peer review submission"
          body="Confirm peer review of this MOH-originated submission. Regulatory: DMP Art. 10."
          loading={loading}
          error={error}
          onClose={closeModal}
          onSubmit={handlePeerReview}
          submitLabel="Submit peer review"
          submitClass="bg-[#eab308] text-[#1f2937] hover:bg-[#ca8a04]"
          comments={comments}
          onCommentsChange={setComments}
        />
      )}
      {modal === "approve" && (
        <WorkflowModal
          title="Approve submission"
          body="Confirm approval of this registry submission. Regulatory: DMP Art. 10. Regulatory checklist must be complete."
          loading={loading}
          error={error}
          onClose={closeModal}
          onSubmit={handleApprove}
          submitLabel="Approve"
          submitClass="bg-[#16a34a] text-white hover:bg-[#15803d]"
          comments={comments}
          onCommentsChange={setComments}
        />
      )}
      {modal === "implement" && (
        <WorkflowModal
          title="Implement registry update"
          body="Confirm implementation of the approved registry update. For critical actions the two-person rule must be satisfied."
          loading={loading}
          error={error}
          onClose={closeModal}
          onSubmit={handleImplement}
          submitLabel="Implement"
          submitClass="bg-[#16a34a] text-white hover:bg-[#15803d]"
        />
      )}
      {modal === "reject" && (
        <WorkflowModal
          title="Reject submission"
          body="Reject this submission. A reason (min 10 characters) is required. Regulatory: DMP Art. 10."
          loading={loading}
          error={error}
          onClose={closeModal}
          onSubmit={handleReject}
          submitLabel="Reject"
          submitClass="bg-[#dc2626] text-white hover:bg-[#b91c1c]"
          rejectionReason={rejectionReason}
          onRejectionReasonChange={setRejectionReason}
          requireRejectionReason
        />
      )}
    </>
  );
}

type WorkflowModalProps = {
  title: string;
  body: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitClass: string;
  comments?: string;
  onCommentsChange?: (v: string) => void;
  rejectionReason?: string;
  onRejectionReasonChange?: (v: string) => void;
  requireRejectionReason?: boolean;
};

function WorkflowModal({
  title,
  body,
  loading,
  error,
  onClose,
  onSubmit,
  submitLabel,
  submitClass,
  comments = "",
  onCommentsChange,
  rejectionReason = "",
  onRejectionReasonChange,
  requireRejectionReason,
}: WorkflowModalProps) {
  const canSubmit = requireRejectionReason ? rejectionReason.trim().length >= 10 : true;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workflow-modal-title"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="w-full max-w-md rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 id="workflow-modal-title" className="text-lg font-semibold text-[#111827]">{title}</h2>
        <p className="mt-2 text-sm text-[#6b7280]">{body}</p>
        {requireRejectionReason && (
          <div className="mt-4">
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-[#374151]">
              Rejection reason (min 10 characters) <span className="text-[#dc2626]">*</span>
            </label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange?.(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Enter reason for rejection..."
            />
          </div>
        )}
        {!requireRejectionReason && onCommentsChange && (
          <div className="mt-4">
            <label htmlFor="workflow-comments" className="block text-sm font-medium text-[#374151]">
              Comments (optional)
            </label>
            <textarea
              id="workflow-comments"
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Optional comments..."
            />
          </div>
        )}
        {error && (
          <p className="mt-3 text-sm font-medium text-[#dc2626]" role="alert">{error}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || (requireRejectionReason && !canSubmit)}
            className={`rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50 ${submitClass}`}
          >
            {loading ? "Processing…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
