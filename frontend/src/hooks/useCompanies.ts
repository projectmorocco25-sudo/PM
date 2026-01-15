import { useQuery } from "@tanstack/react-query";

import { listCompanies } from "@/lib/supabase/queries";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await listCompanies();
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

