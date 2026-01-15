"use client";

import { useQuery } from "@tanstack/react-query";

import { listAtcCodes } from "@/lib/supabase/queries";

export type AtcCodeRow = {
  id: string;
  code: string;
  description: string | null;
  is_active: boolean;
};

export function useAtcCodes() {
  return useQuery({
    queryKey: ["atcCodes"],
    queryFn: async () => {
      const res = await listAtcCodes();
      if (res.error) throw res.error;
      return (res.data ?? []) as AtcCodeRow[];
    },
  });
}

