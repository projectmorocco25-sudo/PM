/**
 * usePendingVerifications Hook
 * Task: 0.5.1.20 - MOH Tier 2 Dashboard
 * Reference: Dashboard wireframes, Verification workflow
 * 
 * Hook for fetching pending verifications with regulatory deadlines
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface PendingVerification {
  id: string
  submissionId: string
  companyId: string
  companyName: string
  priority: 'high' | 'medium' | 'low'
  submittedAt: Date
  submittedAgo: string
  deadline: Date
  daysRemaining: number
  regulatoryDeadline: string
  isUrgent: boolean // < 7 days
  isCritical: boolean // < 3 days
}

/**
 * Fetch pending verifications for MOH Tier 2
 */
async function fetchPendingVerifications(): Promise<PendingVerification[]> {
  const supabase = createClient()
  const now = new Date()
  
  // Query registry_submissions or approvals table for pending verifications
  // TODO: Replace with actual database query when verification workflow is implemented
  // This would query: registry_submissions WHERE status = 'pending_verification' AND assigned_to_role = 'moh_tier2'
  
  // Calculate regulatory deadline (typically 3 days from submission per DMP Art. 12)
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000
  
  // Placeholder data - will be replaced with actual data fetching
  const verifications: PendingVerification[] = []
  
  // Example verification 1
  const submittedAt1 = new Date(now.getTime() - 1 * 60 * 60 * 1000) // 1 hour ago
  const deadline1 = new Date(submittedAt1.getTime() + threeDaysMs)
  const daysRemaining1 = Math.ceil((deadline1.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  
  verifications.push({
    id: '1',
    submissionId: '#12345',
    companyId: 'company-1',
    companyName: 'Company ABC',
    priority: 'high',
    submittedAt: submittedAt1,
    submittedAgo: '1h ago',
    deadline: deadline1,
    daysRemaining: daysRemaining1,
    regulatoryDeadline: 'DMP Art. 12 - 3-day verification window',
    isUrgent: daysRemaining1 < 7,
    isCritical: daysRemaining1 < 3,
  })
  
  // Example verification 2
  const submittedAt2 = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
  const deadline2 = new Date(submittedAt2.getTime() + threeDaysMs)
  const daysRemaining2 = Math.ceil((deadline2.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  
  verifications.push({
    id: '2',
    submissionId: '#12346',
    companyId: 'company-2',
    companyName: 'Company XYZ',
    priority: 'medium',
    submittedAt: submittedAt2,
    submittedAgo: '2h ago',
    deadline: deadline2,
    daysRemaining: daysRemaining2,
    regulatoryDeadline: 'DMP Art. 12 - 3-day verification window',
    isUrgent: daysRemaining2 < 7,
    isCritical: daysRemaining2 < 3,
  })
  
  // Sort by deadline urgency (critical first)
  return verifications.sort((a, b) => {
    if (a.isCritical && !b.isCritical) return -1
    if (!a.isCritical && b.isCritical) return 1
    if (a.isUrgent && !b.isUrgent) return -1
    if (!a.isUrgent && b.isUrgent) return 1
    return a.deadline.getTime() - b.deadline.getTime()
  })
}

/**
 * Hook to get pending verifications for MOH Tier 2 dashboard
 */
export function usePendingVerifications() {
  return useQuery({
    queryKey: ['pendingVerifications'],
    queryFn: fetchPendingVerifications,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  })
}
