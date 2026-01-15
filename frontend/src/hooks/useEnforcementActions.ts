"use client";

import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient as sb } from "@/lib/supabase/browser";

export function useEnforcementActions(companyId?: string) {
  return useQuery({
    queryKey: ["enforcementActions", { companyId: companyId ?? null }],
    queryFn: async () => {
      const q = sb().from("enforcement_actions").select("*").order("created_at", { ascending: false });
      const { data, error } = companyId ? await q.eq("company_id", companyId) : await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEnforcementAction(actionId: string | null | undefined) {
  return useQuery({
    queryKey: ["enforcementAction", { actionId: actionId ?? null }],
    queryFn: async () => {
      const { data, error } = await sb().from("enforcement_actions").select("*").eq("id", actionId as string).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(actionId),
  });
}
