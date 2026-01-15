"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  rmmApproveRegistrySubmission,
  rmmCompleteRegistryUpdate,
  rmmImplementRegistryUpdate,
  rmmPeerReviewRegistrySubmission,
  rmmRejectRegistrySubmission,
  rmmVerifyRegistrySubmission,
} from "@/lib/supabase/queries";

export function useVerifyRegistrySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, comments }: { submissionId: string; comments?: string }) =>
      rmmVerifyRegistrySubmission(submissionId, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}

export function usePeerReviewRegistrySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, comments }: { submissionId: string; comments?: string }) =>
      rmmPeerReviewRegistrySubmission(submissionId, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}

export function useApproveRegistrySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, comments }: { submissionId: string; comments?: string }) =>
      rmmApproveRegistrySubmission(submissionId, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}

export function useImplementRegistryUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, comments }: { submissionId: string; comments?: string }) =>
      rmmImplementRegistryUpdate(submissionId, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}

export function useCompleteRegistryUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, comments }: { submissionId: string; comments?: string }) =>
      rmmCompleteRegistryUpdate(submissionId, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}

export function useRejectRegistrySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, rejectionReason, comments }: { submissionId: string; rejectionReason: string; comments?: string }) =>
      rmmRejectRegistrySubmission(submissionId, rejectionReason, comments),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registrySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["registrySubmission"] });
      void qc.invalidateQueries({ queryKey: ["submissionApprovals"] });
    },
  });
}
