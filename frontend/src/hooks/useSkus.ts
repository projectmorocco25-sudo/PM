import { useQuery } from "@tanstack/react-query";

import { listSkus } from "@/lib/supabase/queries";

export function useSkus(params?: { productId?: string }) {
  const productId = params?.productId;
  return useQuery({
    queryKey: ["skus", { productId: productId ?? null }],
    queryFn: async () => {
      const res = await listSkus(productId);
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

