/**
 * Wireframe: task-0.5.3.13-create-wsl-submission.md
 * Route: /vci/submissions/wsl/new
 * Implements: Placeholder for create WSL submission form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.13-create-wsl-submission.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateWSLSubmissionPage() {
  return (
    <PlaceholderPage
      title="Create WSL Submission"
      description="Create new WSL submission form. This page will allow authorized users to submit a new WSL submission."
      route="/vci/submissions/wsl/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.13-create-wsl-submission.md"
      backHref="/vci/submissions/wsl"
    />
  );
}
