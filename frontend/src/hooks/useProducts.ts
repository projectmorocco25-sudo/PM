import { useQuery } from "@tanstack/react-query";

import { listProducts } from "@/lib/supabase/queries";

export function useProducts(params?: { companyId?: string }) {
  const companyId = params?.companyId;
  return useQuery({
    queryKey: ["products", { companyId: companyId ?? null }],
    queryFn: async () => {
      const res = await listProducts(companyId);
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

