"use client";

import { useQuery } from "@tanstack/react-query";

import { getSku } from "@/lib/supabase/queries";

export function useSku(skuId: string | null | undefined) {
  return useQuery({
    queryKey: ["sku", { skuId: skuId ?? null }],
    queryFn: async () => {
      const res = await getSku(skuId as string);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(skuId),
  });
}

