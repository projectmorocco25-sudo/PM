'use client'

/**
 * Task 1.1.1.17e: Status Color System
 * Task 1.1.1.17h: Data Display Components - StatusBadge
 * 
 * Status badge component for displaying workflow and entity statuses.
 * 
 * @see docs/02-architecture/frontend/design-system.md
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 */

import { cn } from '@/lib/utils'
import { type StatusType, statusColors } from '@/lib/design-tokens'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertTriangle,
  Pause,
  Play,
  Ban,
  Send,
  Eye,
  Shield,
  Zap,
  Archive,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export type StatusVariant = StatusType | string

interface StatusBadgeProps {
  /** The status to display */
  status: StatusVariant
  /** Custom label (overrides default label) */
  label?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show icon */
  showIcon?: boolean
  /** Custom className */
  className?: string
}

// ============================================================================
// Status Configuration
// ============================================================================

interface StatusConfig {
  label: string
  icon: LucideIcon
  colors: {
    bg: string
    text: string
    border: string
  }
}

const statusConfig: Record<string, StatusConfig> = {
  // Workflow Status
  draft: {
    label: 'Draft',
    icon: FileText,
    colors: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    colors: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  },
  submitted: {
    label: 'Submitted',
    icon: Send,
    colors: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  },
  under_review: {
    label: 'Under Review',
    icon: Eye,
    colors: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  },
  tier2_verified: {
    label: 'Tier 2 Verified',
    icon: Shield,
    colors: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  },
  tier1_approved: {
    label: 'Tier 1 Approved',
    icon: CheckCircle2,
    colors: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    colors: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  cancelled: {
    label: 'Cancelled',
    icon: Ban,
    colors: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  },
  
  // Entity Status
  active: {
    label: 'Active',
    icon: Play,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  inactive: {
    label: 'Inactive',
    icon: Pause,
    colors: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  },
  suspended: {
    label: 'Suspended',
    icon: Ban,
    colors: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  },
  
  // Priority Status
  critical: {
    label: 'Critical',
    icon: Zap,
    colors: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  },
  high: {
    label: 'High',
    icon: AlertTriangle,
    colors: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  },
  standard: {
    label: 'Standard',
    icon: FileText,
    colors: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  },
  
  // Breach Status
  detected: {
    label: 'Detected',
    icon: AlertTriangle,
    colors: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  },
  analyzing: {
    label: 'Analyzing',
    icon: Eye,
    colors: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  
  // Export Status
  auto_approval_queue: {
    label: 'Auto-Approval Queue',
    icon: Clock,
    colors: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  },
  authorized: {
    label: 'Authorized',
    icon: CheckCircle2,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  expired: {
    label: 'Expired',
    icon: Archive,
    colors: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  },
  
  // Communication Status
  sent: {
    label: 'Sent',
    icon: Send,
    colors: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    colors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  },
  read: {
    label: 'Read',
    icon: Eye,
    colors: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    colors: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  },
}

// Default config for unknown status
const defaultConfig: StatusConfig = {
  label: 'Unknown',
  icon: FileText,
  colors: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
}

// ============================================================================
// Size Classes
// ============================================================================

const sizeClasses = {
  sm: {
    badge: 'text-xs px-2 py-0.5 gap-1',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'text-sm px-2.5 py-1 gap-1.5',
    icon: 'h-4 w-4',
  },
  lg: {
    badge: 'text-base px-3 py-1.5 gap-2',
    icon: 'h-5 w-5',
  },
}

// ============================================================================
// Component
// ============================================================================

/**
 * Status badge component for displaying workflow and entity statuses
 * 
 * @example
 * <StatusBadge status="approved" />
 * <StatusBadge status="pending" size="lg" showIcon />
 * <StatusBadge status="rejected" label="Custom Label" />
 */
export function StatusBadge({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  // Normalize status to lowercase and replace hyphens with underscores
  const normalizedStatus = status.toLowerCase().replace(/-/g, '_')
  
  // Get config for status or use default
  const config = statusConfig[normalizedStatus] || defaultConfig
  const Icon = config.icon
  const displayLabel = label || config.label
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.colors.bg,
        config.colors.text,
        config.colors.border,
        sizeClasses[size].badge,
        className
      )}
    >
      {showIcon && <Icon className={sizeClasses[size].icon} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </span>
  )
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get status colors for custom styling
 */
export function getStatusColors(status: StatusVariant) {
  const normalizedStatus = status.toLowerCase().replace(/-/g, '_')
  return statusConfig[normalizedStatus]?.colors || defaultConfig.colors
}

/**
 * Get status label
 */
export function getStatusLabel(status: StatusVariant): string {
  const normalizedStatus = status.toLowerCase().replace(/-/g, '_')
  return statusConfig[normalizedStatus]?.label || status
}

/**
 * Get status icon
 */
export function getStatusIcon(status: StatusVariant): LucideIcon {
  const normalizedStatus = status.toLowerCase().replace(/-/g, '_')
  return statusConfig[normalizedStatus]?.icon || defaultConfig.icon
}

export { statusConfig }
