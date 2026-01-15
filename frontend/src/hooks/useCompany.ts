import { useQuery } from "@tanstack/react-query";

import { getCompany } from "@/lib/supabase/queries";

export function useCompany(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["company", { companyId: companyId ?? null }],
    queryFn: async () => {
      const res = await getCompany(companyId as string);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(companyId),
  });
}

