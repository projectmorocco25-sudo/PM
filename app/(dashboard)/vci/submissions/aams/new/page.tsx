/**
 * Wireframe: task-0.5.3.3-create-aams-submission.md
 * Route: /vci/submissions/aams/new
 * Implements: Placeholder for create AAMS submission form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.3-create-aams-submission.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateAAMSSubmissionPage() {
  return (
    <PlaceholderPage
      title="Create AAMS Submission"
      description="Create new AAMS submission form. This page will allow authorized users to submit a new AAMS submission."
      route="/vci/submissions/aams/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.3-create-aams-submission.md"
      backHref="/vci/submissions/aams"
    />
  );
}
