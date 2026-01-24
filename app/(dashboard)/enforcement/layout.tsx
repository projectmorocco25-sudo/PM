/**
 * Enforcement Module Layout
 *
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md (overall enforcement layout)
 * Route: /enforcement/*
 * Implements: Layout for all Enforcement module pages, including a header and main content area.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md
 *
 * This layout ensures that all Enforcement pages inherit the standard dashboard structure,
 * including the global header and sidebar, and provides a consistent context for Enforcement-specific content.
 * Access Control: MOH Tier 1 and Tier 2 only
 */

import React from 'react';

export default function EnforcementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      {children}
    </div>
  );
}
