/**
 * Wireframe: task-0.5.1.26-compose-message.md
 * Route: /communications/compose
 * Implements: Compose — To, Subject*, Message*, Type, lifecycle info, Cancel / Send / Draft.
 * API: communications_create_conversation. Tables: conversations, messages.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md
 */

"use client";

import { ComposeContent } from "./ComposeContent";

export default function CommunicationsComposePage() {
  return <ComposeContent />;
}
