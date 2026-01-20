/**
 * useEnforcementActions Hook
 * Task: 1.1.1.18 - Company Dashboard
 * Reference: Dashboard wireframes, RMM Enforcement Actions
 * 
 * Hook for fetching and managing enforcement actions for dashboard widgets
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Enforcement Action type based on database schema
export interface EnforcementAction {
  id: string
  company_id: string
  action_type: 'warning' | 'fine' | 'suspension'
  violation_type: 'submission_non_compliance' | 'threshold_breach' | 'critical_medicine_non_compliance' | 'export_violation' | 'data_quality_issue' | 'repeated_offender'
  legal_basis: string
  justification: string
  amount: number | null
  status: 'draft' | 'pending_review' | 'pending_approval' | 'approved' | 'executed' | 'appealed' | 'resolved' | 'cancelled'
  requestor_id: string
  approver_id: string | null
  appeal_grounds: string | null
  appeal_submitted_at: string | null
  appeal_resolved_at: string | null
  appeal_resolution_notes: string | null
  submitted_at: string | null
  reviewed_at: string | null
  approved_at: string | null
  executed_at: string | null
  review_notes: string | null
  approval_notes: string | null
  execution_notes: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

export interface CompanyEnforcementActions {
  activeActions: EnforcementAction[]
  totalActions: number
  warnings: number
  fines: number
  suspensions: number
  actionsRequiringAppeal: number
}

/**
 * Fetch enforcement actions for the current company
 */
async function fetchCompanyEnforcementActions(companyId: string): Promise<CompanyEnforcementActions> {
  const supabase = createClient()

  // Fetch all enforcement actions for the company
  const { data, error } = await supabase
    .from('enforcement_actions')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching enforcement actions:', error)
    return {
      activeActions: [],
      totalActions: 0,
      warnings: 0,
      fines: 0,
      suspensions: 0,
      actionsRequiringAppeal: 0,
    }
  }

  const actions = data || []
  
  // Calculate appeal deadline (30 days from execution date per Law No. 09-08)
  const now = new Date()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  const actionsRequiringAppeal = actions.filter((action) => {
    if (action.status !== 'executed' || !action.executed_at) return false
    
    const executedDate = new Date(action.executed_at)
    const appealDeadline = new Date(executedDate.getTime() + thirtyDaysMs)
    
    return appealDeadline > now // Still within appeal window
  })

  // Count by action type
  const warnings = actions.filter((a) => a.action_type === 'warning').length
  const fines = actions.filter((a) => a.action_type === 'fine').length
  const suspensions = actions.filter((a) => a.action_type === 'suspension').length

  // Active actions (executed, not appealed/resolved)
  const activeActions = actions.filter(
    (a) => a.status === 'executed' && a.status !== 'appealed' && a.status !== 'resolved'
  )

  return {
    activeActions,
    totalActions: actions.length,
    warnings,
    fines,
    suspensions,
    actionsRequiringAppeal: actionsRequiringAppeal.length,
  }
}

/**
 * Hook to get enforcement actions for company dashboard
 */
export function useCompanyEnforcementActions(companyId: string | null) {
  return useQuery({
    queryKey: ['enforcementActions', companyId],
    queryFn: () => fetchCompanyEnforcementActions(companyId!),
    enabled: !!companyId,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  })
}

/**
 * Calculate days remaining until appeal deadline
 */
export function calculateAppealDeadlineRemaining(executedAt: string | null): {
  daysRemaining: number
  deadlineDate: Date | null
  isUrgent: boolean // < 7 days
  isCritical: boolean // < 3 days
} {
  if (!executedAt) {
    return { daysRemaining: 0, deadlineDate: null, isUrgent: false, isCritical: false }
  }

  const executedDate = new Date(executedAt)
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  const deadlineDate = new Date(executedDate.getTime() + thirtyDaysMs)
  const now = new Date()
  
  const msRemaining = deadlineDate.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000))

  return {
    daysRemaining: Math.max(0, daysRemaining),
    deadlineDate,
    isUrgent: daysRemaining < 7 && daysRemaining >= 0,
    isCritical: daysRemaining < 3 && daysRemaining >= 0,
  }
}
