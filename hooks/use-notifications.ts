"use client";

/**
 * Fetches notifications via shared_get_notifications RPC.
 * Data from hosted Supabase only. Tables: notifications.
 * Wireframe: task-0.5.1.17 (notification center), task-0.5.1.31 (notifications page).
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

type NotificationsResult = { data: NotificationRow[] };

export function useNotifications(userId: string | null, limit = 15) {
  const [data, setData] = useState<NotificationRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");

  const refetch = useCallback(() => {
    if (!userId) {
      setData([]);
      setStatus("empty");
      return;
    }
    setStatus("loading");
    const supabase = createClient();
    supabase
      .rpc("shared_get_notifications", { p_limit: limit, p_offset: 0 })
      .then(({ data: res, error }) => {
        if (error) {
          setData([]);
          setStatus("error");
          return;
        }
        const payload = (res as NotificationsResult)?.data ?? [];
        setData(Array.isArray(payload) ? payload : []);
        setStatus(payload?.length ? "success" : "empty");
      });
  }, [userId, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const unreadCount = data.filter((n) => !n.is_read).length;
  return { data, status, unreadCount, refetch };
}

export function useMarkNotificationRead() {
  const supabase = createClient();

  return async (notificationId: string) => {
    const { data } = await supabase.rpc("shared_mark_notification_read", {
      p_notification_id: notificationId,
    });
    return data as { success: boolean; error?: string };
  };
}

const PAGE_LIMIT = 50;

export function useNotificationsPage(userId: string | null) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const markReadRpc = useMarkNotificationRead();

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (!userId) {
        setItems([]);
        setStatus("empty");
        setError(null);
        return;
      }
      if (offset === 0) {
        setStatus("loading");
        setError(null);
      } else {
        setLoadingMore(true);
      }
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("shared_get_notifications", {
        p_limit: PAGE_LIMIT,
        p_offset: offset,
      });
      if (offset > 0) setLoadingMore(false);
      if (err) {
        setError(err.message);
        if (offset === 0) {
          setItems([]);
          setStatus("error");
        }
        return;
      }
      const payload = (res as NotificationsResult)?.data ?? [];
      const list = Array.isArray(payload) ? payload : [];
      setHasMore(list.length === PAGE_LIMIT);
      if (append) {
        setItems((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const newItems = list.filter((n) => !ids.has(n.id));
          return [...prev, ...newItems];
        });
      } else {
        setItems(list);
        setStatus(list.length ? "success" : "empty");
      }
    },
    [userId]
  );

  const refetch = useCallback(() => fetchPage(0, false), [fetchPage]);
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPage(items.length, true);
  }, [fetchPage, items.length, loadingMore, hasMore]);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  const markRead = useCallback(
    async (id: string) => {
      const result = await markReadRpc(id);
      if (result?.success) {
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
        );
      }
      return result;
    },
    [markReadRpc]
  );

  const markAllRead = useCallback(async () => {
    const unread = items.filter((n) => !n.is_read);
    for (const n of unread) {
      await markReadRpc(n.id);
    }
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: n.read_at ?? new Date().toISOString() })));
    refetch();
  }, [items, markReadRpc, refetch]);

  return {
    items,
    status,
    error,
    hasMore,
    loadingMore,
    refetch,
    loadMore,
    markRead,
    markAllRead,
  };
}
