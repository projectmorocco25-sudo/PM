/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Implements: Notification filters panel with all filter options per wireframe
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem } from '@/components/ui/select'
import type { NotificationFilters, NotificationType, NotificationStatus, NotificationPriority, DateRange, DeadlineStatus } from '@/app/notifications/page'
import { cn } from '@/lib/utils'

interface NotificationsFiltersProps {
  filters: NotificationFilters
  onFiltersChange: (filters: NotificationFilters) => void
  onClose: () => void
}

const NOTIFICATION_TYPES: { value: NotificationType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'submission_status', label: 'Submission' },
  { value: 'breach_alert', label: 'Breach' },
  { value: 'new_message', label: 'Message' },
  { value: 'approval_required', label: 'Workflow' },
  { value: 'enforcement_action_executed', label: 'Enforcement Action' },
  { value: 'appeal_submitted', label: 'Appeal' },
  { value: 'threshold_reversion_7d', label: 'Threshold Reversion' },
  { value: 'system_maintenance', label: 'System' },
]

export function NotificationsFilters({
  filters,
  onFiltersChange,
  onClose,
}: NotificationsFiltersProps) {
  const [localFilters, setLocalFilters] = useState<NotificationFilters>(filters)

  const updateFilter = <K extends keyof NotificationFilters>(
    key: K,
    value: NotificationFilters[K]
  ) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared: NotificationFilters = {
      type: 'all',
      status: 'all',
      dateRange: 'all',
      priority: 'all',
      deadlineStatus: 'all',
      searchQuery: '',
    }
    setLocalFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters = Object.values(localFilters).some(
    (v) => v !== 'all' && v !== ''
  )

  return (
    <div
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '16px', // Wireframe: 16px padding
      }}
      role="region"
      aria-label="Notification filters"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}
        >
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
              style={{ fontSize: '12px' }}
            >
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            style={{ width: '32px', height: '32px' }}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Type Filter */}
        <div>
          <Label htmlFor="filter-type" className="mb-2">
            Type
          </Label>
          <Select
            id="filter-type"
            value={localFilters.type}
            onValueChange={(value) => updateFilter('type', value as NotificationType | 'all')}
          >
            {NOTIFICATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="filter-status" className="mb-2">
            Status
          </Label>
          <Select
            id="filter-status"
            value={localFilters.status}
            onValueChange={(value) => updateFilter('status', value as NotificationStatus)}
          >
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Label htmlFor="filter-date-range" className="mb-2">
            Date Range
          </Label>
          <Select
            id="filter-date-range"
            value={localFilters.dateRange}
            onValueChange={(value) => updateFilter('dateRange', value as DateRange)}
          >
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="last_7_days">Last 7 days</SelectItem>
            <SelectItem value="last_30_days">Last 30 days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </Select>
        </div>

        {/* Priority Filter (Fatima's Requirement) */}
        <div>
          <Label htmlFor="filter-priority" className="mb-2">
            Priority
          </Label>
          <Select
            id="filter-priority"
            value={localFilters.priority}
            onValueChange={(value) => updateFilter('priority', value as NotificationPriority)}
          >
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent (deadline-critical)</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="normal">Normal Priority</SelectItem>
          </Select>
        </div>

        {/* Regulatory Deadline Status Filter (Fatima's Requirement) */}
        <div>
          <Label htmlFor="filter-deadline" className="mb-2">
            Deadline Status
          </Label>
          <Select
            id="filter-deadline"
            value={localFilters.deadlineStatus}
            onValueChange={(value) => updateFilter('deadlineStatus', value as DeadlineStatus)}
          >
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="critical">Deadline Critical (&lt;7 days)</SelectItem>
            <SelectItem value="approaching">Deadline Approaching (7-14 days)</SelectItem>
            <SelectItem value="safe">Deadline Safe (&gt;14 days)</SelectItem>
            <SelectItem value="none">No Deadline</SelectItem>
          </Select>
        </div>

        {/* Search Query */}
        <div>
          <Label htmlFor="filter-search" className="mb-2 block text-sm font-medium text-gray-700">
            Search
          </Label>
          <Input
            id="filter-search"
            type="text"
            placeholder="Search notifications..."
            value={localFilters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            style={{
              padding: '8px 12px', // Wireframe: 12px horizontal, 8px vertical
              fontSize: '14px',
            }}
          />
        </div>
      </div>
    </div>
  )
}
