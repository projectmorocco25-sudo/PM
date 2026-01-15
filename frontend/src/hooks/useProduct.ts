"use client";

import { useQuery } from "@tanstack/react-query";

import { getProduct } from "@/lib/supabase/queries";

export function useProduct(productId: string | null | undefined) {
  return useQuery({
    queryKey: ["product", { productId: productId ?? null }],
    queryFn: async () => {
      const res = await getProduct(productId as string);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(productId),
  });
}

