/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Route: /notifications
 * Implements: Notifications list, Mark all read, Settings, Filters, Load more.
 * APIs: shared_get_notifications, shared_mark_notification_read. Table: notifications.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

"use client";

import { NotificationsContent } from "./NotificationsContent";

export default function NotificationsPage() {
  return <NotificationsContent />;
}
