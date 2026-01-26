/**
 * Hook to get user notifications
 * 
 * Fetches user notifications from Supabase using shared_get_notifications RPC function.
 * 
 * Database: notifications table
 * RPC Function: shared_get_notifications(user_id uuid, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
 * 
 * Wireframe: task-0.5.1.17-notification-center-component.md
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export function useNotifications(user: User | null, limit: number = 10) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "shared_get_notifications",
        { user_id: user.id, limit_count: limit, offset_count: 0 }
      );
      if (rpcError) {
        const msg = rpcError.message ?? "";
        const isMissing =
          rpcError.code === "PGRST202" ||
          msg.includes("404") ||
          msg.includes("not found") ||
          msg.includes("Could not find");
        if (isMissing) {
          setNotifications([]);
          setUnreadCount(0);
          return;
        }
        throw new Error(rpcError.message);
      }
      setNotifications(data || []);
      setUnreadCount(data?.filter((n: Notification) => !n.is_read).length || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user) return;
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("shared_mark_notification_read", {
        notification_id: notificationId,
        user_id: user.id,
      });
      if (!rpcError) {
        const now = new Date().toISOString();
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: now } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const unread = notifications.filter((n) => !n.is_read);
    for (const n of unread) {
      await supabase.rpc("shared_mark_notification_read", {
        notification_id: n.id,
        user_id: user.id,
      });
    }
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: n.read_at ?? now }))
    );
    setUnreadCount(0);
  }, [user, notifications]);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead };
}
