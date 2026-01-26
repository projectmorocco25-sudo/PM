/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Route: /notifications
 * Implements: Notifications page with notification list, filters, and mark as read functionality.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { useNotifications } from '@/lib/hooks/use-notifications';
import type { User } from '@supabase/supabase-js';
import { BellOff, CheckCircle, AlertTriangle, MessageSquare, FileText, Info, Settings, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications(user, 50);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await createClient().auth.getUser();
      setUser(u);
    })();
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'submission_approved':
      case 'submission_rejected':
      case 'submission_action_required':
        return <FileText className="h-5 w-5 text-primary-500" />;
      case 'breach_alert':
      case 'threshold_exceeded':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'new_message':
      case 'message_reply':
        return <MessageSquare className="h-5 w-5 text-info-500" />;
      case 'workflow_action_required':
      case 'workflow_completed':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'enforcement_warning':
      case 'enforcement_fine':
      case 'enforcement_suspension':
        return <AlertTriangle className="h-5 w-5 text-error-500" />;
      default:
        return <Info className="h-5 w-5 text-secondary-500" />;
    }
  };

  const getPriorityClass = (type: string, notification: any) => {
    // Check for urgent notifications (enforcement with deadline < 7 days, etc.)
    if (type.includes('enforcement') || type.includes('appeal')) {
      return 'border-l-4 border-error-500';
    }
    if (type.includes('threshold') || type.includes('deadline')) {
      return 'border-l-4 border-warning-500';
    }
    return '';
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Notifications</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-text-primary">Notifications</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={markAllAsRead}
            disabled={notifications.filter((n) => !n.is_read).length === 0}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:text-text-tertiary disabled:cursor-not-allowed"
          >
            Mark all read
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <div className="relative">
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Filters">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-text-secondary hover:bg-bg-secondary'
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            filter === 'unread'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-text-secondary hover:bg-bg-secondary'
          )}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('read')}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            filter === 'read'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-text-secondary hover:bg-bg-secondary'
          )}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center text-text-secondary">Loading notifications...</div>
      ) : error ? (
        <div className="text-center text-error-500">Error: {error.message}</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-white p-12 text-center">
          <BellOff className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="mb-2 text-lg font-semibold text-text-primary">No notifications</p>
          <p className="text-text-secondary">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-1 rounded-lg border border-default bg-white shadow-sm">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'flex gap-4 border-b border-default p-4 transition-colors hover:bg-bg-secondary',
                !notification.is_read && 'bg-primary-50',
                getPriorityClass(notification.type, notification)
              )}
            >
              <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-grow">
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary-500" aria-label="Unread" />
                    )}
                    <h3
                      className={cn(
                        'text-base font-medium',
                        !notification.is_read ? 'text-text-primary' : 'text-text-secondary'
                      )}
                    >
                      {notification.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Mark read
                  </button>
                </div>
                <p className="mb-2 text-sm text-text-secondary">{notification.message}</p>
                <p className="text-xs text-text-tertiary">
                  {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
