/**
 * Task 1.1.1.18g: Communications Layout
 * 
 * Shared layout for all communications pages.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Communications | PM Platform',
  description: 'Manage your messages and communications',
}

export default function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  )
}
