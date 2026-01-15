"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { useApp } from "@/contexts/AppContext";
import { notify } from "@/lib/toast";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { user } = useApp();
  const { data: items, isLoading } = useNotifications(user?.id, 50);
  const markOne = useMarkNotificationRead(user?.id, 50);
  const markAll = useMarkAllNotificationsRead(user?.id, 50);

  return (
    <DashboardLayout>
      <MainContent
        breadcrumbs={<span>Home &gt; Notifications</span>}
        title="Notifications"
        actions={
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            disabled={!user?.id || markAll.isPending || (items ?? []).filter((n) => !n.is_read).length === 0}
            onClick={async () => {
              try {
                await markAll.mutateAsync();
                notify.success("All notifications marked as read");
              } catch {
                notify.error("Failed to mark all as read");
              }
            }}
          >
            Mark all read
          </button>
        }
      >
        <div className="rounded-lg border border-zinc-200 bg-white">
          {isLoading ? (
            <div className="p-4 text-sm text-zinc-600">Loading…</div>
          ) : (items ?? []).length === 0 ? (
            <div className="p-6 text-sm text-zinc-600">No notifications.</div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {(items ?? []).map((n) => (
                <li key={n.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={n.is_read ? "text-sm font-medium text-zinc-700" : "text-sm font-semibold text-zinc-900"}>
                        {n.title}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">{n.message}</div>
                      <div className="mt-2 text-xs text-zinc-400">{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                    {!n.is_read ? (
                      <button
                        type="button"
                        className="shrink-0 rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                        disabled={markOne.isPending}
                        onClick={async () => {
                          try {
                            await markOne.mutateAsync(n.id);
                            notify.success("Marked as read");
                          } catch {
                            notify.error("Failed to mark as read");
                          }
                        }}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </MainContent>
    </DashboardLayout>
  );
}

