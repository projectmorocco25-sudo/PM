/**
 * Wireframe: task-0.5.1.28-system-announcements.md
 * Route: /communications/announcements
 * Implements: System announcements list, Create Announcement (MOH only). View → conversation detail.
 * APIs: communications_list_announcements, communications_create_announcement. Tables: conversations, messages.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md
 */

"use client";

import { AnnouncementsContent } from "./AnnouncementsContent";

export default function CommunicationsAnnouncementsPage() {
  return <AnnouncementsContent />;
}
