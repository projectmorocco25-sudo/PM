/**
 * usePendingApprovals Hook
 * Task: 0.5.1.19 - MOH Tier 1 Dashboard
 * Reference: Dashboard wireframes, Approvals workflow
 * 
 * Hook for fetching pending approvals with regulatory context
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface PendingApproval {
  id: string
  type: 'aams' | 'msq' | 'wsl' | 'threshold' | 'enforcement' | 'other'
  reference: string
  priority: 'high' | 'medium' | 'low'
  submittedAt: Date
  submittedAgo: string
  deadline: Date | null
  daysUntilDeadline: number | null
  legalBasisVerified: boolean
  regulatoryDeadline: number // days
  checklistCompleted: number
  checklistTotal: number
  isUrgent: boolean // < 3 days
  isWarning: boolean // < 7 days
}

/**
 * Fetch pending approvals for MOH Tier 1
 */
async function fetchPendingApprovals(): Promise<PendingApproval[]> {
  const supabase = createClient()
  const now = new Date()
  
  // Query approvals table for pending approvals
  // TODO: Replace with actual database query when approvals table structure is finalized
  // This would query: approvals WHERE status = 'pending_approval' AND approver_role = 'moh_tier1'
  
  // Placeholder - will be replaced with actual data fetching
  const approvals: PendingApproval[] = []
  
  // Example approval 1
  const deadline1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  approvals.push({
    id: '1',
    type: 'aams',
    reference: 'AAMS #12345',
    priority: 'high',
    submittedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    submittedAgo: '1h ago',
    deadline: deadline1,
    daysUntilDeadline: 2,
    legalBasisVerified: true,
    regulatoryDeadline: 2,
    checklistCompleted: 3,
    checklistTotal: 4,
    isUrgent: false,
    isWarning: true,
  })
  
  // Example approval 2
  const deadline2 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  approvals.push({
    id: '2',
    type: 'threshold',
    reference: 'Threshold Medium',
    priority: 'medium',
    submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    submittedAgo: '2h ago',
    deadline: deadline2,
    daysUntilDeadline: 3,
    legalBasisVerified: true,
    regulatoryDeadline: 3,
    checklistCompleted: 4,
    checklistTotal: 4,
    isUrgent: false,
    isWarning: true,
  })
  
  // Sort by deadline urgency (most urgent first)
  return approvals.sort((a, b) => {
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime()
    }
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })
}

/**
 * Hook to get pending approvals for MOH Tier 1 dashboard
 */
export function usePendingApprovals() {
  return useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: fetchPendingApprovals,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  })
}
