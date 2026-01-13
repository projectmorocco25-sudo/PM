'use client'

import { redirect } from 'next/navigation'

// RMM index redirects to companies
export default function RMMPage() {
  redirect('/dashboard/rmm/companies')
}
