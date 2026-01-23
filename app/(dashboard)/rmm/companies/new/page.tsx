/**
 * Wireframe: task-0.5.2.8-create-edit-company.md
 * Route: /rmm/companies/new
 * Implements: Placeholder for create company form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.8-create-edit-company.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateCompanyPage() {
  return (
    <PlaceholderPage
      title="Create Company"
      description="Create new company registration form. This page will allow authorized users to register a new company in the system."
      route="/rmm/companies/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.8-create-edit-company.md"
      backHref="/rmm/companies"
    />
  );
}
