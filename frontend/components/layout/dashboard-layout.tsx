/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout (header + sidebar + main content area)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 */

'use client'

import { type ReactNode } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { AppProvider, useAppContext } from '@/lib/context/app-context'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useAppContext()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-300',
            sidebarOpen ? 'ml-[280px]' : 'ml-16'
          )}
          style={{
            backgroundColor: '#f9fafb',
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            marginLeft: sidebarOpen ? '280px' : '64px',
            transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <DashboardContent>{children}</DashboardContent>
    </AppProvider>
  )
}
