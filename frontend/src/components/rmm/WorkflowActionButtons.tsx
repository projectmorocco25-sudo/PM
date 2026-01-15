"use client";

// Wireframe binding: docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md

import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useApproveRegistrySubmission,
  useCompleteRegistryUpdate,
  useImplementRegistryUpdate,
  usePeerReviewRegistrySubmission,
  useRejectRegistrySubmission,
  useVerifyRegistrySubmission,
} from "@/hooks/useRegistrySubmissionMutations";

type WorkflowActionButtonsProps = {
  submissionId: string;
  currentStatus: string;
  isMOHSubmission: boolean;
  userRole: string;
  isTier1: boolean;
  isTier2Officer: boolean;
  isTier2Registrar: boolean;
};

export function WorkflowActionButtons({
  submissionId,
  currentStatus,
  isMOHSubmission,
  isTier1,
  isTier2Officer,
  isTier2Registrar,
}: WorkflowActionButtonsProps) {
  const verifyM = useVerifyRegistrySubmission();
  const peerReviewM = usePeerReviewRegistrySubmission();
  const approveM = useApproveRegistrySubmission();
  const implementM = useImplementRegistryUpdate();
  const completeM = useCompleteRegistryUpdate();
  const rejectM = useRejectRegistrySubmission();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [comments, setComments] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handleVerify = async () => {
    setActionError(null);
    try {
      await verifyM.mutateAsync({ submissionId, comments: comments || undefined });
      setComments("");
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const handlePeerReview = async () => {
    setActionError(null);
    try {
      await peerReviewM.mutateAsync({ submissionId, comments: comments || undefined });
      setComments("");
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveM.mutateAsync({ submissionId, comments: comments || undefined });
      setComments("");
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const handleImplement = async () => {
    setActionError(null);
    try {
      await implementM.mutateAsync({ submissionId, comments: comments || undefined });
      setComments("");
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const handleComplete = async () => {
    setActionError(null);
    try {
      await completeM.mutateAsync({ submissionId, comments: comments || undefined });
      setComments("");
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const handleReject = async () => {
    setActionError(null);
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      setActionError("Rejection reason is required (min 10 characters)");
      return;
    }
    try {
      await rejectM.mutateAsync({ submissionId, rejectionReason, comments: comments || undefined });
      setRejectionReason("");
      setComments("");
      setShowRejectForm(false);
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  // Determine which actions are available based on role and status
  const canVerify = isTier2Officer && currentStatus === "submitted" && !isMOHSubmission;
  const canPeerReview = isTier2Officer && currentStatus === "submitted" && isMOHSubmission;
  const canApprove =
    isTier1 && (currentStatus === "tier2_verified" || currentStatus === "tier2_peer_reviewed");
  const canImplement = isTier2Registrar && currentStatus === "tier1_approved";
  const canComplete = isTier2Registrar && currentStatus === "tier2_implemented";
  const canReject =
    (isTier1 || isTier2Officer || isTier2Registrar) &&
    (currentStatus === "submitted" ||
      currentStatus === "tier2_verified" ||
      currentStatus === "tier2_peer_reviewed" ||
      currentStatus === "tier1_approved");

  const hasAnyAction = canVerify || canPeerReview || canApprove || canImplement || canComplete || canReject;

  if (!hasAnyAction) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Workflow Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError ? (
          <Alert variant="destructive">
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Comments (optional)</label>
            <Input
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments for this action..."
              disabled={verifyM.isPending || peerReviewM.isPending || approveM.isPending || implementM.isPending || completeM.isPending || rejectM.isPending}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {canVerify ? (
              <Button onClick={handleVerify} disabled={verifyM.isPending}>
                {verifyM.isPending ? "Verifying..." : "Verify (Tier 2)"}
              </Button>
            ) : null}

            {canPeerReview ? (
              <Button onClick={handlePeerReview} disabled={peerReviewM.isPending}>
                {peerReviewM.isPending ? "Peer Reviewing..." : "Peer Review (Tier 2)"}
              </Button>
            ) : null}

            {canApprove ? (
              <Button onClick={handleApprove} disabled={approveM.isPending}>
                {approveM.isPending ? "Approving..." : "Approve (Tier 1)"}
              </Button>
            ) : null}

            {canImplement ? (
              <Button onClick={handleImplement} disabled={implementM.isPending}>
                {implementM.isPending ? "Implementing..." : "Implement (Tier 2 Registrar)"}
              </Button>
            ) : null}

            {canComplete ? (
              <Button onClick={handleComplete} disabled={completeM.isPending}>
                {completeM.isPending ? "Completing..." : "Complete"}
              </Button>
            ) : null}

            {canReject ? (
              <Button variant="destructive" onClick={() => setShowRejectForm(!showRejectForm)} disabled={rejectM.isPending}>
                {showRejectForm ? "Cancel Reject" : "Reject"}
              </Button>
            ) : null}
          </div>

          {showRejectForm ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-zinc-700">Rejection Reason (required, min 10 chars)</label>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a clear reason for rejection..."
                  disabled={rejectM.isPending}
                />
              </div>
              <Button variant="destructive" onClick={handleReject} disabled={rejectM.isPending || rejectionReason.trim().length < 10}>
                {rejectM.isPending ? "Rejecting..." : "Confirm Reject"}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
