/**
 * Wireframe: task-0.5.4.0-ecs-overview.md
 * Route: /ecs
 * Implements: Placeholder for ECS overview page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.0-ecs-overview.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ECSOverviewPage() {
  return (
    <PlaceholderPage
      title="ECS Overview"
      description="Export Control System Module overview page. This page will display ECS module statistics, recent export requests, and quick access to key ECS features."
      route="/ecs"
      wireframeLink="../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.0-ecs-overview.md"
      backHref="/dashboard"
    />
  );
}
