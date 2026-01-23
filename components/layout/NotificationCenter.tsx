/**
 * Notification Center Component
 * 
 * Wireframe: task-0.5.1.17-notification-center-component.md
 * Part of: Header component
 * Implements: Notification center dropdown with notifications list
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md
 * 
 * Database: notifications table
 * RPC Functions: shared_get_notifications(user_id, p_limit, p_offset), shared_mark_notification_read(notification_id, user_id)
 */

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

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

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onClose: () => void;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  loading,
  onClose,
}: NotificationCenterProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    if (dropdownRef.current) {
      const firstButton = dropdownRef.current.querySelector("button");
      firstButton?.focus();
    }
  }, []);

  const handleMarkAllRead = async () => {
    if (!notifications.length) return;

    const unreadNotifications = notifications.filter((n) => !n.is_read);
    for (const notification of unreadNotifications) {
      await supabase.rpc("shared_mark_notification_read", {
        notification_id: notification.id,
        user_id: notification.user_id,
      });
    }

    // Refresh notifications (parent component should handle this)
    window.location.reload();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await supabase.rpc("shared_mark_notification_read", {
        notification_id: notification.id,
        user_id: notification.user_id,
      });
    }

    // Navigate to link if available
    if (notification.link) {
      router.push(notification.link);
      onClose();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full right-0 mt-2 w-[400px] bg-bg-primary",
        "border border-border-default rounded-md shadow-medium",
        "max-h-[500px] overflow-hidden flex flex-col",
        "z-[1050]",
        "animate-in fade-in slide-in-from-top-1 duration-200"
      )}
      role="dialog"
      aria-label="Notification center"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <h2 className="text-base font-semibold text-text-primary">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className={cn(
              "text-sm text-primary-600 hover:underline",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            )}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4 text-center text-text-secondary">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4 text-text-tertiary">📭</div>
            <p className="text-base font-medium text-text-secondary">No notifications</p>
            <p className="text-sm text-text-tertiary mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "w-full text-left px-4 py-3 min-h-[64px]",
                  "hover:bg-bg-secondary transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
                  "flex items-start gap-3 relative"
                )}
                role="button"
                aria-label={`${notification.title}: ${notification.message}`}
              >
                {/* Unread Indicator */}
                {!notification.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 rounded-r" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      notification.is_read ? "text-text-secondary" : "text-text-primary font-semibold"
                    )}
                  >
                    {notification.title}
                  </div>
                  <div className="text-sm text-text-secondary line-clamp-2 mb-2">
                    {notification.message}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {formatTimestamp(notification.created_at)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border-default">
          <button
            onClick={() => {
              router.push("/dashboard/notifications");
              onClose();
            }}
            className={cn(
              "w-full px-4 py-3 text-sm font-medium text-primary-600",
              "hover:bg-bg-secondary transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
            )}
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
