import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  email_sent_at?: string | null;
  email_attempts?: number;
  email_last_error?: string | null;
};

async function fetchNotifications(userId: string, limit: number): Promise<NotificationRow[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id,user_id,type,title,message,link,is_read,read_at,created_at,email_sent_at,email_attempts,email_last_error",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as NotificationRow[];
}

async function markNotificationRead(notificationId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) throw error;
}

async function markAllNotificationsRead(userId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) throw error;
}

export function useNotifications(userId: string | null | undefined, limit = 15) {
  return useQuery({
    queryKey: ["notifications", "list", { userId: userId ?? null, limit }],
    queryFn: () => fetchNotifications(userId as string, limit),
    enabled: Boolean(userId),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead(userId: string | null | undefined, limit = 15) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => markNotificationRead(notificationId),
    onMutate: async (notificationId) => {
      if (!userId) return;
      const key = ["notifications", "list", { userId, limit }] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<NotificationRow[]>(key);
      if (prev) {
        qc.setQueryData<NotificationRow[]>(
          key,
          prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)),
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (!userId) return;
      const key = ["notifications", "list", { userId, limit }] as const;
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: async () => {
      if (!userId) return;
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["notifications", "unreadCount", { userId }] }),
        qc.invalidateQueries({ queryKey: ["notifications", "list", { userId, limit }] }),
      ]);
    },
  });
}

export function useMarkAllNotificationsRead(userId: string | null | undefined, limit = 15) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => markAllNotificationsRead(userId as string),
    onMutate: async () => {
      if (!userId) return;
      const key = ["notifications", "list", { userId, limit }] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<NotificationRow[]>(key);
      if (prev) {
        const now = new Date().toISOString();
        qc.setQueryData<NotificationRow[]>(
          key,
          prev.map((n) => (n.is_read ? n : { ...n, is_read: true, read_at: now })),
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (!userId) return;
      const key = ["notifications", "list", { userId, limit }] as const;
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: async () => {
      if (!userId) return;
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["notifications", "unreadCount", { userId }] }),
        qc.invalidateQueries({ queryKey: ["notifications", "list", { userId, limit }] }),
      ]);
    },
  });
}

