/**
 * Wireframe: task-0.5.1.22-profile-page.md
 * Route: /profile
 * Implements: User profile — user info, avatar, change password, preferences, account actions.
 * APIs: shared_update_user_profile, shared_update_user_preferences. Tables: users.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md
 */

"use client";

import { ProfileContent } from "./ProfileContent";

export default function ProfilePage() {
  return <ProfileContent />;
}
