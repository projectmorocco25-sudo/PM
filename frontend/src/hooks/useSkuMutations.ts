"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SkuUpsertInput } from "@/lib/supabase/queries";
import { rmmCreateSku, rmmUpdateSku } from "@/lib/supabase/queries";

export function useCreateSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SkuUpsertInput) => rmmCreateSku(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skus"] });
    },
  });
}

export function useUpdateSku(skuId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<SkuUpsertInput>) => rmmUpdateSku(skuId, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sku", { skuId }] });
      await qc.invalidateQueries({ queryKey: ["skus"] });
    },
  });
}

