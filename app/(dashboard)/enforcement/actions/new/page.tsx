/**
 * Wireframe: task-0.5.2.1b-create-enforcement-action.md
 * Route: /enforcement/actions/new
 * Implements: Placeholder for create enforcement action form (wizard).
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1b-create-enforcement-action.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateEnforcementActionPage() {
  return (
    <PlaceholderPage
      title="Create Enforcement Action"
      description="Create new enforcement action wizard form. This page will allow authorized users to create a new enforcement action through a step-by-step wizard."
      route="/enforcement/actions/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1b-create-enforcement-action.md"
      backHref="/enforcement/actions"
    />
  );
}
