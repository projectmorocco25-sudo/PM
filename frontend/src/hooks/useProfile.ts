"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  company_id: string | null;
  role: string;
  avatar_url: string | null;
  timezone: string;
  language: string;
  notification_preferences: Record<string, unknown> | null;
};

async function fetchProfile(userId: string): Promise<Profile> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id,email,full_name,company_id,role,avatar_url,timezone,language,notification_preferences",
    )
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Profile;
}

async function updateProfile(userId: string, patch: Partial<Profile>) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("users").update(patch).eq("id", userId);
  if (error) throw error;
}

export function useProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["profile", { userId: userId ?? null }],
    queryFn: () => fetchProfile(userId as string),
    enabled: Boolean(userId),
  });
}

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Profile>) => updateProfile(userId, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["profile", { userId }] });
      await qc.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}

