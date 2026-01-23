/**
 * Hook to get user notifications
 * 
 * Fetches user notifications from Supabase using shared_get_notifications RPC function.
 * 
 * Database: notifications table
 * RPC Function: shared_get_notifications(user_id uuid, p_limit integer DEFAULT 10, p_offset integer DEFAULT 0)
 * 
 * Wireframe: task-0.5.1.17-notification-center-component.md
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Notification {
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

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc(
          "shared_get_notifications",
          {
            user_id: user.id,
            p_limit: limit,
            p_offset: 0,
          }
        );

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setNotifications(data || []);
        setUnreadCount(data?.filter((n: Notification) => !n.is_read).length || 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, limit]);

  return { notifications, unreadCount, loading, error };
}
