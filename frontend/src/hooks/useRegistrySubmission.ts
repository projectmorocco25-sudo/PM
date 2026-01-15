"use client";

import { useQuery } from "@tanstack/react-query";

import { getRegistrySubmission, listRegistryApprovals } from "@/lib/supabase/queries";

export function useRegistrySubmission(submissionId: string | null | undefined) {
  return useQuery({
    queryKey: ["registrySubmission", { submissionId: submissionId ?? null }],
    queryFn: async () => {
      const res = await getRegistrySubmission(submissionId as string);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(submissionId),
  });
}

export function useRegistryApprovals(submissionId: string | null | undefined) {
  return useQuery({
    queryKey: ["registryApprovals", { submissionId: submissionId ?? null }],
    queryFn: async () => {
      const res = await listRegistryApprovals(submissionId as string);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(submissionId),
  });
}

