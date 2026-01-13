import { redirect } from 'next/navigation'

// Redirect /dashboard/audit to /dashboard/audit/logs
export default function AuditPage() {
  redirect('/dashboard/audit/logs')
}
