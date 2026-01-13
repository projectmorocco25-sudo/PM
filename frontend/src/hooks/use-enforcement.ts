'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Types
export type ActionType = 'warning' | 'fine' | 'suspension' | 'license_revocation'
export type ActionStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'pending_approval' 
  | 'approved' 
  | 'executed' 
  | 'appealed' 
  | 'appeal_upheld' 
  | 'appeal_rejected' 
  | 'resolved' 
  | 'cancelled'

export interface EnforcementAction {
  id: string
  company_id: string
  company_name?: string
  action_type: ActionType
  violation_type: string
  violation_id: string | null
  status: ActionStatus
  legal_basis: string
  justification: string
  fine_amount: number | null
  fine_currency: string
  suspension_start_date: string | null
  suspension_end_date: string | null
  created_by: string
  created_by_name?: string
  created_at: string
  reviewed_by: string | null
  reviewed_by_name?: string
  reviewed_at: string | null
  review_notes: string | null
  approved_by: string | null
  approved_by_name?: string
  approved_at: string | null
  approval_notes: string | null
  executed_by: string | null
  executed_by_name?: string
  executed_at: string | null
  execution_notes: string | null
  appeal_submitted_at: string | null
  appeal_grounds: string | null
  appeal_explanation: string | null
  appeal_resolved_at: string | null
  appeal_resolved_by: string | null
  appeal_resolved_by_name?: string
  appeal_resolution: 'upheld' | 'rejected' | 'partially_upheld' | null
  appeal_resolution_notes: string | null
  updated_at: string
}

export interface EnforcementStatistics {
  total: number
  by_status: Record<string, number>
  by_type: Record<string, number>
  pending_review: number
  pending_approval: number
  pending_appeals: number
  this_month: number
  total_fines: number
}

// Hooks
export function useEnforcementActions(filters?: {
  company_id?: string
  status?: string
  action_type?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['enforcement', 'actions', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('enforcement_list_actions', {
        p_company_id: filters?.company_id || null,
        p_status: filters?.status || null,
        p_action_type: filters?.action_type || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; actions: EnforcementAction[]; total: number }
    },
  })
}

export function useEnforcementAction(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['enforcement', 'action', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('enforcement_get_action', { p_action_id: id })
      if (error) throw error
      return data as { success: boolean; action: EnforcementAction }
    },
    enabled: !!id,
  })
}

export function useEnforcementStatistics(companyId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['enforcement', 'statistics', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('enforcement_get_statistics', {
        p_company_id: companyId || null,
      })
      if (error) throw error
      return data as { success: boolean; statistics: EnforcementStatistics }
    },
  })
}

// Mutations
export function useEnforcementMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const submitForReview = useMutation({
    mutationFn: async (data: {
      company_id: string
      action_type: ActionType
      violation_type: string
      legal_basis: string
      justification: string
      fine_amount?: number
      suspension_start_date?: string
      suspension_end_date?: string
      violation_id?: string
    }) => {
      const { data: result, error } = await supabase.rpc('enforcement_submit_for_review', {
        p_company_id: data.company_id,
        p_action_type: data.action_type,
        p_violation_type: data.violation_type,
        p_legal_basis: data.legal_basis,
        p_justification: data.justification,
        p_fine_amount: data.fine_amount || null,
        p_suspension_start_date: data.suspension_start_date || null,
        p_suspension_end_date: data.suspension_end_date || null,
        p_violation_id: data.violation_id || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ title: 'Success', description: 'Enforcement action submitted for review' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const reviewAction = useMutation({
    mutationFn: async (data: { id: string; approve: boolean; review_notes: string }) => {
      const { data: result, error } = await supabase.rpc('enforcement_review_action', {
        p_action_id: data.id,
        p_approve: data.approve,
        p_review_notes: data.review_notes,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ 
        title: 'Success', 
        description: variables.approve ? 'Action reviewed and forwarded' : 'Action returned for revision' 
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const approveAction = useMutation({
    mutationFn: async (data: { id: string; approve: boolean; approval_notes: string }) => {
      const { data: result, error } = await supabase.rpc('enforcement_approve_action', {
        p_action_id: data.id,
        p_approve: data.approve,
        p_approval_notes: data.approval_notes,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ 
        title: 'Success', 
        description: variables.approve ? 'Action approved' : 'Action returned for review' 
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const executeAction = useMutation({
    mutationFn: async (data: { id: string; execution_notes?: string }) => {
      const { data: result, error } = await supabase.rpc('enforcement_execute_action', {
        p_action_id: data.id,
        p_execution_notes: data.execution_notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ title: 'Success', description: 'Enforcement action executed' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const appealAction = useMutation({
    mutationFn: async (data: { id: string; appeal_grounds: string; appeal_explanation: string }) => {
      const { data: result, error } = await supabase.rpc('enforcement_appeal_action', {
        p_action_id: data.id,
        p_appeal_grounds: data.appeal_grounds,
        p_appeal_explanation: data.appeal_explanation,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ title: 'Success', description: 'Appeal submitted successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const resolveAppeal = useMutation({
    mutationFn: async (data: { id: string; resolution: string; resolution_notes: string }) => {
      const { data: result, error } = await supabase.rpc('enforcement_resolve_appeal', {
        p_action_id: data.id,
        p_resolution: data.resolution,
        p_resolution_notes: data.resolution_notes,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enforcement'] })
      toast({ title: 'Success', description: 'Appeal resolved' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return {
    submitForReview,
    reviewAction,
    approveAction,
    executeAction,
    appealAction,
    resolveAppeal,
  }
}
