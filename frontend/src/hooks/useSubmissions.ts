import { useQuery } from "@tanstack/react-query";

import { listAamsSubmissions, listMsqSubmissions, listWslSubmissions } from "@/lib/supabase/queries";

export function useAamsSubmissions(params?: { companyId?: string }) {
  const companyId = params?.companyId;
  return useQuery({
    queryKey: ["submissions", "aams", { companyId: companyId ?? null }],
    queryFn: async () => {
      const res = await listAamsSubmissions(companyId);
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

export function useMsqSubmissions(params?: { companyId?: string }) {
  const companyId = params?.companyId;
  return useQuery({
    queryKey: ["submissions", "msq", { companyId: companyId ?? null }],
    queryFn: async () => {
      const res = await listMsqSubmissions(companyId);
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

export function useWslSubmissions(params?: { companyId?: string }) {
  const companyId = params?.companyId;
  return useQuery({
    queryKey: ["submissions", "wsl", { companyId: companyId ?? null }],
    queryFn: async () => {
      const res = await listWslSubmissions(companyId);
      if (res.error) throw res.error;
      return res.data;
    },
  });
}

