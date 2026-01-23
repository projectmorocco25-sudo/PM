/**
 * Wireframe: task-0.5.3.10-create-msq-submission.md
 * Route: /vci/submissions/msq/new
 * Implements: Placeholder for create MSQ submission form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.10-create-msq-submission.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateMSQSubmissionPage() {
  return (
    <PlaceholderPage
      title="Create MSQ Submission"
      description="Create new MSQ submission form. This page will allow authorized users to submit a new MSQ submission."
      route="/vci/submissions/msq/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.10-create-msq-submission.md"
      backHref="/vci/submissions/msq"
    />
  );
}
