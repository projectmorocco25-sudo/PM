'use client'

import { redirect } from 'next/navigation'

// Redirect VCI root to AAMS
export default function VCIPage() {
  redirect('/dashboard/vci/aams')
}
