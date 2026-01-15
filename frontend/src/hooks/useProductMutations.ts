"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProductUpsertInput } from "@/lib/supabase/queries";
import { rmmCreateProduct, rmmUpdateProduct } from "@/lib/supabase/queries";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductUpsertInput) => rmmCreateProduct(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<ProductUpsertInput>) => rmmUpdateProduct(productId, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["product", { productId }] });
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

