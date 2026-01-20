/**
 * useSubmissionDeadlines Hook
 * Task: 0.5.1.18 - Company Dashboard
 * Reference: Dashboard wireframes, RMM Submissions
 * 
 * Hook for fetching submission deadlines with regulatory references
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface SubmissionDeadline {
  id: string
  submissionType: 'wsl' | 'msq' | 'aams'
  typeLabel: string
  deadline: Date
  daysRemaining: number
  regulatoryReference: string
  regulatoryArticle: string
  gracePeriodDays: number
  latePenalty: string
  isUrgent: boolean // < 7 days
  isCritical: boolean // < 3 days
}

/**
 * Fetch upcoming submission deadlines for the company
 */
async function fetchSubmissionDeadlines(companyId: string): Promise<SubmissionDeadline[]> {
  const supabase = createClient()
  const now = new Date()
  
  // This would query registry_submissions or a deadlines table
  // For now, return calculated deadlines based on submission types
  // TODO: Replace with actual database query when submission deadline tracking table is available
  
  const deadlines: SubmissionDeadline[] = []
  
  // WSL - Weekly Submission (every Monday)
  const nextMonday = new Date(now)
  const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7
  nextMonday.setDate(now.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  
  const wslDaysRemaining = Math.ceil((nextMonday.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  
  deadlines.push({
    id: 'wsl-next',
    submissionType: 'wsl',
    typeLabel: 'WSL Week 4',
    deadline: nextMonday,
    daysRemaining: wslDaysRemaining,
    regulatoryReference: 'DMP Art. 12 - Weekly Submission',
    regulatoryArticle: 'DMP Art. 12',
    gracePeriodDays: 1,
    latePenalty: 'Warning after grace period',
    isUrgent: wslDaysRemaining < 7,
    isCritical: wslDaysRemaining < 3,
  })
  
  // MSQ - Monthly Submission (1st of next month)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const msqDaysRemaining = Math.ceil((nextMonth.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  
  deadlines.push({
    id: 'msq-next',
    submissionType: 'msq',
    typeLabel: 'MSQ January',
    deadline: nextMonth,
    daysRemaining: msqDaysRemaining,
    regulatoryReference: 'DMP Art. 15 - Monthly Submission',
    regulatoryArticle: 'DMP Art. 15',
    gracePeriodDays: 2,
    latePenalty: 'Fine after grace period',
    isUrgent: msqDaysRemaining < 7,
    isCritical: msqDaysRemaining < 3,
  })
  
  // Sort by days remaining (urgent first)
  return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining)
}

/**
 * Hook to get submission deadlines for company dashboard
 */
export function useSubmissionDeadlines(companyId: string | null) {
  return useQuery({
    queryKey: ['submissionDeadlines', companyId],
    queryFn: () => fetchSubmissionDeadlines(companyId!),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
