"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";

export type RegistryWorkflowStatus =
  | "draft"
  | "submitted"
  | "tier2_verified"
  | "tier2_peer_reviewed"
  | "tier1_approved"
  | "tier2_implemented"
  | "completed"
  | "rejected";

function prettyStatus(status: RegistryWorkflowStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "tier2_verified":
      return "Tier 2 Verified";
    case "tier2_peer_reviewed":
      return "Tier 2 Peer Reviewed";
    case "tier1_approved":
      return "Tier 1 Approved";
    case "tier2_implemented":
      return "Tier 2 Implemented";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}

export function statusBadgeVariant(status: RegistryWorkflowStatus): "secondary" | "default" | "success" | "destructive" {
  switch (status) {
    case "draft":
      return "secondary";
    case "submitted":
      return "default";
    case "tier2_verified":
    case "tier2_peer_reviewed":
    case "tier2_implemented":
      return "default";
    case "tier1_approved":
    case "completed":
      return "success";
    case "rejected":
      return "destructive";
  }
}

export function WorkflowStatusIndicator({
  status,
  isMohWorkflow,
}: {
  status: RegistryWorkflowStatus;
  isMohWorkflow: boolean;
}) {
  const steps = useMemo(() => {
    return isMohWorkflow
      ? (["draft", "submitted", "tier2_peer_reviewed", "tier1_approved", "tier2_implemented", "completed"] as const)
      : (["draft", "submitted", "tier2_verified", "tier1_approved", "tier2_implemented", "completed"] as const);
  }, [isMohWorkflow]);

  const currentIdx = useMemo(() => steps.indexOf(status as (typeof steps)[number]), [status, steps]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <Badge variant={idx <= currentIdx ? "success" : "secondary"}>{prettyStatus(s)}</Badge>
            {idx < steps.length - 1 ? <span className="text-xs text-zinc-400">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-zinc-700">
        Current Status: <span className="font-medium text-zinc-900">{prettyStatus(status)}</span>
      </div>
    </div>
  );
}

