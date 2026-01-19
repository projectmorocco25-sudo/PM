/**
 * Wireframe: task-0.5.1.15-header-component.md
 * Implements: Header component (logo, user menu, notifications, search)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase'
import { useAppContext } from '@/lib/context/app-context'
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu as MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { useUnreadNotificationCount } from '@/lib/hooks/use-notifications'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppContext()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { data: unreadCount = 0 } = useUnreadNotificationCount()

  // Get current module from pathname
  const currentModule = pathname?.startsWith('/rmm')
    ? { name: 'RMM', fullName: 'Registry Management (RMM)', color: 'bg-blue-500' }
    : pathname?.startsWith('/vci')
      ? { name: 'VCI', fullName: 'Value Chain Intelligence (VCI)', color: 'bg-green-500' }
      : pathname?.startsWith('/ecs')
        ? { name: 'ECS', fullName: 'Export Control System (ECS)', color: 'bg-yellow-500' }
        : pathname?.startsWith('/cmc')
          ? { name: 'CMC', fullName: 'Compliance Monitoring Center (CMC)', color: 'bg-purple-500' }
          : pathname?.startsWith('/enforcement')
            ? { name: 'Enforcement', fullName: 'Enforcement', color: 'bg-red-500' }
            : null

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  // Get module overview route
  const getModuleRoute = () => {
    if (pathname?.startsWith('/rmm')) return '/rmm/overview'
    if (pathname?.startsWith('/vci')) return '/vci/dashboard'
    if (pathname?.startsWith('/ecs')) return '/ecs/overview'
    if (pathname?.startsWith('/cmc')) return '/cmc/overview'
    if (pathname?.startsWith('/enforcement')) return '/enforcement'
    return '/dashboard'
  }

  return (
    <header
      className="fixed top-0 z-[1000] flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm"
      style={{ height: '64px', padding: '12px 16px' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile/Tablet) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-6 w-6 text-gray-600" />
        </button>

        {/* MOH Logo - ~40px height, clickable to /dashboard */}
        <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Return to dashboard">
          <Image
            src="/moh-logo.svg"
            alt="MOH Logo - Return to Dashboard"
            width={40}
            height={40}
            className="h-auto w-auto"
            style={{ height: '40px' }}
            priority
          />
        </Link>

        {/* Module Indicator - Only visible when inside module */}
        {currentModule && (
          <Link
            href={getModuleRoute()}
            className={cn(
              'flex h-6 items-center rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:scale-105',
              currentModule.color
            )}
            style={{ height: '24px', padding: '4px 8px', fontSize: '12px', letterSpacing: '0.5px' }}
            aria-label={`${currentModule.fullName} module`}
            title={currentModule.fullName}
          >
            {currentModule.name}
          </Link>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Icon - 40px × 40px, tooltip "Search (Ctrl+K)" */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open search (Ctrl+K)"
          title="Search (Ctrl+K)"
          style={{ width: '40px', height: '40px' }}
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Notifications Icon - 40px × 40px, badge with count */}
        <div className="relative">
          <button
            onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            title="Notifications"
            style={{ width: '40px', height: '40px' }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white"
                style={{ top: '2px', right: '2px', width: '18px', height: '18px', fontSize: '11px', border: '2px solid white' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Center Dropdown */}
          <NotificationCenter
            isOpen={notificationCenterOpen}
            onClose={() => setNotificationCenterOpen(false)}
          />
        </div>

        {/* User Menu - 32px avatar, dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex h-10 items-center gap-2 rounded-md px-1 py-1 hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            style={{ height: '40px' }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
              style={{ width: '32px', height: '32px', fontSize: '14px', border: '2px solid white' }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown
              className={cn('h-4 w-4 text-gray-600 transition-transform', userMenuOpen && 'rotate-180')}
              style={{ width: '16px', height: '16px' }}
            />
          </button>

          {/* User Menu Dropdown - 200px width, Profile, Settings, Divider, Logout */}
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg"
              style={{ width: '200px', padding: '4px 0', zIndex: 1060 }}
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                style={{ height: '40px', padding: '8px 12px', fontSize: '14px' }}
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="h-4 w-4 text-gray-600" style={{ width: '16px', height: '16px' }} />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                style={{ height: '40px', padding: '8px 12px', fontSize: '14px' }}
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4 text-gray-600" style={{ width: '16px', height: '16px' }} />
                Settings
              </Link>
              <div className="my-2 border-t border-gray-200" style={{ margin: '8px 0', borderTop: '1px solid #e5e7eb' }} />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-red-600 transition-colors"
                style={{ height: '40px', padding: '8px 12px', fontSize: '14px' }}
              >
                <LogOut className="h-4 w-4 text-gray-600" style={{ width: '16px', height: '16px' }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
