/**
 * Wireframe: task-0.5.1.17-notification-center-component.md
 * Implements: NotificationCenter component (dropdown/popover with notifications list)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Inbox, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationItem } from './notification-item'
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useNotificationRealtime,
} from '@/lib/hooks/use-notifications'
import { Skeleton } from '@/components/ui/loading/skeleton'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const notificationListRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const { data: notifications, isLoading, error } = useNotifications(15)
  const markAsRead = useMarkNotificationAsRead()
  const markAllAsRead = useMarkAllNotificationsAsRead()
  
  // Set up real-time updates
  useNotificationRealtime()
  
  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!isOpen || !containerRef.current) return
    
    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    // Arrow key navigation for notification items
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!notifications || notifications.length === 0) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev < notifications.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : notifications.length - 1))
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const notification = notifications[focusedIndex]
        if (notification && !notification.is_read) {
          markAsRead.mutate(notification.id)
        }
        if (notification?.link) {
          router.push(notification.link)
          onClose()
        }
      }
    }
    
    // Focus first element when opened
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 100)
    }
    
    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleArrowKeys)
    
    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleArrowKeys)
    }
  }, [isOpen, notifications, focusedIndex, markAsRead, router, onClose])
  
  // Reset focused index when notifications change
  useEffect(() => {
    setFocusedIndex(-1)
  }, [notifications])
  
  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  const handleNotificationClick = (notificationId: string) => {
    // Mark as read when clicked
    if (!notifications?.find(n => n.id === notificationId)?.is_read) {
      markAsRead.mutate(notificationId)
    }
  }
  
  const handleMarkAllRead = () => {
    markAllAsRead.mutate()
  }
  
  const handleViewAll = () => {
    router.push('/notifications')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-[1049] bg-black/20 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* ARIA Live Region for new notifications */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {notifications && notifications.filter(n => !n.is_read).length > 0 && (
          <span>{notifications.filter(n => !n.is_read).length} unread notifications</span>
        )}
      </div>
      
      {/* Notification Center Container */}
      <div
        ref={containerRef}
        className={cn(
          'absolute right-0 top-full z-[1050] mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
          // Responsive widths per wireframe
          'w-[calc(100vw-32px)] md:w-[320px] lg:w-[400px]',
          // Animations per wireframe: fade-in + slide-down (200ms ease-in-out, 4px offset)
          'animate-in',
          // Mobile: full-screen modal positioning
          'fixed md:absolute top-16 left-4 md:left-auto md:top-full',
          // Mobile: max height 80vh, tablet: 400px, desktop: 500px
          'max-h-[80vh] md:max-h-[400px] lg:max-h-[500px]'
        )}
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
        role="dialog"
        aria-label="Notifications"
        aria-modal="false"
      >
        {/* Header Section */}
        <div
          className="flex items-center justify-between border-b border-gray-200 px-4 py-3"
          style={{ padding: '12px 16px' }}
        >
          <h2
            className="text-base font-semibold text-gray-900"
            style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}
          >
            Notifications
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isPending || !notifications?.some(n => !n.is_read)}
              className="text-sm font-medium text-blue-600 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontSize: '14px', color: '#2563eb' }}
              aria-label="Mark all notifications as read"
            >
              Mark all read
            </button>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close notifications"
              style={{ width: '32px', height: '32px' }}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Notifications List */}
        <div
          ref={notificationListRef}
          className="overflow-y-auto"
          style={{
            maxHeight: 'calc(80vh - 112px)', // 80vh minus header + footer
          }}
        >
          {isLoading && (
            <div className="space-y-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 px-4 py-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-red-600">Failed to load notifications. Please try again.</p>
            </div>
          )}
          
          {!isLoading && !error && notifications && notifications.length === 0 && (
            <div
              className="flex flex-col items-center justify-center px-4 py-12 text-center"
              style={{ padding: '48px 16px' }}
            >
              <Inbox className="h-16 w-16 text-gray-400" style={{ width: '64px', height: '64px', color: '#9ca3af' }} />
              <p
                className="mt-4 text-base font-medium text-gray-600"
                style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}
              >
                No notifications
              </p>
              <p
                className="mt-1 text-sm text-gray-500"
                style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
              >
                You're all caught up!
              </p>
            </div>
          )}
          
          {!isLoading && !error && notifications && notifications.length > 0 && (
            <div className="space-y-0" role="list">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  role="listitem"
                  tabIndex={index === focusedIndex ? 0 : -1}
                  className={cn(
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    index === focusedIndex && 'bg-gray-50'
                  )}
                  onFocus={() => setFocusedIndex(index)}
                >
                  <NotificationItem
                    notification={notification}
                    onClick={() => handleNotificationClick(notification.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Section */}
        {!isLoading && !error && notifications && notifications.length > 0 && (
          <div
            className="border-t border-gray-200"
            style={{ borderTop: '1px solid #e5e7eb' }}
          >
            <button
              onClick={handleViewAll}
              className="w-full px-4 py-3 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                height: '48px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2563eb',
              }}
              aria-label="View all notifications"
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  )
}
