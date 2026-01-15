import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

async function fetchUnreadCount(userId: string): Promise<number> {
  const supabase = createSupabaseBrowserClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
  return count ?? 0;
}

export function useUnreadNotificationsCount(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["notifications", "unreadCount", { userId: userId ?? null }],
    queryFn: () => fetchUnreadCount(userId as string),
    enabled: Boolean(userId),
    refetchInterval: 30_000,
  });
}

