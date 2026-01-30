/**
 * Wireframe: task-0.5.2.8-company-create-edit-form.md
 * Route: /rmm/companies/new
 * Implements: Company create form — Company Information, Contact Information, draft auto-save, validation.
 * Task: 1.1.2.19
 * API: rmm_create_company (hosted Supabase only). RLS applies (MOH only).
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md
 */

import { CompanyFormContent } from "../CompanyFormContent";

export default function CompanyNewPage() {
  return <CompanyFormContent mode="create" />;
}
