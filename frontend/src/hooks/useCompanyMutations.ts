"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CompanyUpsertInput } from "@/lib/supabase/queries";
import { rmmCreateCompany, rmmUpdateCompany } from "@/lib/supabase/queries";

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CompanyUpsertInput) => rmmCreateCompany(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany(companyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<CompanyUpsertInput>) => rmmUpdateCompany(companyId, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["company", { companyId }] });
      await qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

