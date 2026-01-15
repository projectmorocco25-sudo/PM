import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

async function fetchUnreadCommunicationsCount(userId: string): Promise<number> {
  const supabase = createSupabaseBrowserClient();

  // Unread = messages addressed to user without a read receipt.
  const { data: receipts, error: rErr } = await supabase
    .from("message_read_receipts")
    .select("message_id")
    .eq("user_id", userId);
  if (rErr) throw rErr;

  const readIds = (receipts ?? []).map((r) => (r as { message_id: string }).message_id);

  let q = supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("deleted_at", null);

  if (readIds.length > 0) {
    // PostgREST expects quoted values for UUID IN lists.
    const inList = `(${readIds.map((id) => `"${id}"`).join(",")})`;
    q = q.not("id", "in", inList);
  }

  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

export function useUnreadCommunicationsCount(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["communications", "unreadCount", { userId: userId ?? null }],
    queryFn: () => fetchUnreadCommunicationsCount(userId as string),
    enabled: Boolean(userId),
    refetchInterval: 30_000,
  });
}

