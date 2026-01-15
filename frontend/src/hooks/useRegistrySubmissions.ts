import { useQuery } from "@tanstack/react-query";

import { listRegistrySubmissions } from "@/lib/supabase/queries";

export function useRegistrySubmissions() {
  return useQuery({
    queryKey: ["registrySubmissions"],
    queryFn: async () => {
      const res = await listRegistrySubmissions();
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

