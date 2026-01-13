'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Types
export type AAMSStatus = 'draft' | 'submitted' | 'verified' | 'approved' | 'completed' | 'rejected'

export interface AAMSSubmissionItem {
  sku_id: string
  quantity: number
}

export interface AAMSSubmission {
  id: string
  company_id: string
  company_name?: string
  year: number
  aams_value: number
  submission_data: AAMSSubmissionItem[]
  status: AAMSStatus
  is_late: boolean
  correction_of: string | null
  submitted_by: string
  submitted_by_name?: string
  submitted_at: string
  verified_by: string | null
  verified_by_name?: string
  verified_at: string | null
  approved_by: string | null
  approved_by_name?: string
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface Threshold {
  id: string
  sku_id: string
  sku_name?: string
  sku_code?: string
  dosage_strength?: string
  dosage_form?: string
  product_name?: string
  company_name?: string
  is_critical_medicine?: boolean
  threshold_type: string
  threshold_value: number
  multiplier_b: number
  aams_value: number
  effective_from: string
  effective_to: string | null
  is_current: boolean
  duration_type: string | null
  revert_date: string | null
  revert_to_multiplier: number | null
  revert_to_threshold_value: number | null
  created_by: string
  created_by_name?: string
  created_at: string
}

export interface MultiplierAdvisory {
  type: 'warning' | 'suggestion' | 'info'
  message: string
}

// AAMS Submissions Hooks
export function useAAMSSubmissions(filters?: {
  company_id?: string
  year?: number
  status?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'aams', 'submissions', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_list_aams_submissions', {
        p_company_id: filters?.company_id || null,
        p_year: filters?.year || null,
        p_status: filters?.status || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; submissions: AAMSSubmission[]; total: number }
    },
  })
}

export function useAAMSSubmission(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'aams', 'submission', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('vci_get_aams_submission', { p_submission_id: id })
      if (error) throw error
      return data as { success: boolean; submission: AAMSSubmission; thresholds: Threshold[] }
    },
    enabled: !!id,
  })
}

// Thresholds Hooks
export function useThresholds(filters?: {
  sku_id?: string
  company_id?: string
  is_current?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'thresholds', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_list_thresholds', {
        p_sku_id: filters?.sku_id || null,
        p_company_id: filters?.company_id || null,
        p_is_current: filters?.is_current ?? null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; thresholds: Threshold[]; total: number }
    },
  })
}

export function useMultiplierAdvisory(skuId: string | null, proposedB?: number, proposedC?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'multiplier-advisory', skuId, proposedB, proposedC],
    queryFn: async () => {
      if (!skuId) return null
      const { data, error } = await supabase.rpc('vci_get_multiplier_advisory', {
        p_sku_id: skuId,
        p_proposed_b: proposedB || null,
        p_proposed_c: proposedC || null,
      })
      if (error) throw error
      return data as {
        success: boolean
        sku_id: string
        is_critical_medicine: boolean
        default_b: number
        default_c: number
        suggestions: MultiplierAdvisory[]
      }
    },
    enabled: !!skuId,
  })
}

// Mutations
export function useVCIMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const submitAAMS = useMutation({
    mutationFn: async (data: { year: number; submission_data: AAMSSubmissionItem[] }) => {
      const { data: result, error } = await supabase.rpc('vci_submit_aams', {
        p_year: data.year,
        p_submission_data: data.submission_data,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'aams'] })
      toast({ title: 'Success', description: 'AAMS submitted successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const verifyAAMS = useMutation({
    mutationFn: async (data: { id: string; approve: boolean; notes?: string }) => {
      const { data: result, error } = await supabase.rpc('vci_verify_aams', {
        p_submission_id: data.id,
        p_approve: data.approve,
        p_verification_notes: data.notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'aams'] })
      toast({
        title: 'Success',
        description: variables.approve ? 'AAMS verified and thresholds calculated' : 'AAMS returned for revision',
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const approveAAMS = useMutation({
    mutationFn: async (data: { id: string; approve: boolean; notes?: string }) => {
      const { data: result, error } = await supabase.rpc('vci_approve_aams_threshold', {
        p_submission_id: data.id,
        p_approve: data.approve,
        p_approval_notes: data.notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vci'] })
      toast({
        title: 'Success',
        description: variables.approve ? 'AAMS approved - thresholds are now active' : 'AAMS returned for verification',
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const rejectAAMS = useMutation({
    mutationFn: async (data: { id: string; reason: string }) => {
      const { data: result, error } = await supabase.rpc('vci_reject_aams_submission', {
        p_submission_id: data.id,
        p_rejection_reason: data.reason,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'aams'] })
      toast({ title: 'AAMS Rejected', description: 'The submission has been rejected' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const modifyThreshold = useMutation({
    mutationFn: async (data: {
      sku_id?: string
      new_multiplier_b: number
      effective_from: string
      effective_to?: string
      justification: string
      is_global: boolean
    }) => {
      const { data: result, error } = await supabase.rpc('vci_modify_threshold', {
        p_sku_id: data.sku_id || null,
        p_new_multiplier_b: data.new_multiplier_b,
        p_effective_from: data.effective_from,
        p_effective_to: data.effective_to || null,
        p_justification: data.justification,
        p_is_global: data.is_global,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'thresholds'] })
      toast({
        title: 'Threshold Modified',
        description: `${result.affected_count} threshold(s) updated`,
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return {
    submitAAMS,
    verifyAAMS,
    approveAAMS,
    rejectAAMS,
    modifyThreshold,
  }
}

// Deadline helpers
export function getAAMSDeadline(year: number): Date {
  return new Date(year, 0, 31) // January 31
}

export function getAAMSGracePeriodEnd(year: number): Date {
  return new Date(year, 1, 15) // February 15
}

export function getAAMSFallbackDate(year: number): Date {
  return new Date(year, 2, 1) // March 1
}

export function isWithinSubmissionWindow(year: number): boolean {
  const now = new Date()
  const deadline = getAAMSDeadline(year)
  return now <= deadline
}

export function isWithinGracePeriod(year: number): boolean {
  const now = new Date()
  const deadline = getAAMSDeadline(year)
  const graceEnd = getAAMSGracePeriodEnd(year)
  return now > deadline && now <= graceEnd
}

export function getDaysUntilDeadline(year: number): number {
  const now = new Date()
  const deadline = getAAMSDeadline(year)
  const diffTime = deadline.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// ============================================================================
// MSQ Types and Hooks
// ============================================================================

export type MSQStatus = 'submitted' | 'flagged_for_review' | 'accepted' | 'rejected'

export interface MSQSubmissionItem {
  sku_id: string
  quantity: number
}

export interface ValidationFlag {
  type: 'error' | 'warning' | 'anomaly' | 'info' | 'manual_flag' | 'rejection' | 'correction' | 'superseded'
  code: string
  message: string
  sku_id?: string
  deviation_percent?: number
  current_quantity?: number
  previous_quantity?: number
  msq_quantity?: number
  aams_monthly_avg?: number
  flagged_by?: string
  flagged_at?: string
  rejected_by?: string
  rejected_at?: string
}

export interface MSQSubmission {
  id: string
  company_id: string
  company_name?: string
  year: number
  month: number
  submission_data: MSQSubmissionItem[]
  status: MSQStatus
  validation_flags: ValidationFlag[]
  correction_of: string | null
  submitted_by: string
  submitted_by_name?: string
  submitted_at: string
  created_at: string
  updated_at: string
  within_grace_period?: boolean
  grace_period_end?: string
}

// MSQ Submissions Hooks
export function useMSQSubmissions(filters?: {
  company_id?: string
  year?: number
  month?: number
  status?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'msq', 'submissions', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_list_msq_submissions', {
        p_company_id: filters?.company_id || null,
        p_year: filters?.year || null,
        p_month: filters?.month || null,
        p_status: filters?.status || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; submissions: MSQSubmission[]; total: number }
    },
  })
}

export function useMSQSubmission(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'msq', 'submission', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('vci_get_msq_submission', { p_submission_id: id })
      if (error) throw error
      return data as { success: boolean; submission: MSQSubmission }
    },
    enabled: !!id,
  })
}

// MSQ Mutations
export function useMSQMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const submitMSQ = useMutation({
    mutationFn: async (data: { year: number; month: number; submission_data: MSQSubmissionItem[] }) => {
      const { data: result, error } = await supabase.rpc('vci_submit_msq', {
        p_year: data.year,
        p_month: data.month,
        p_submission_data: data.submission_data,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'msq'] })
      toast({
        title: result.has_anomalies ? 'MSQ Flagged for Review' : 'MSQ Submitted',
        description: result.has_anomalies
          ? 'Your submission has anomalies and will be reviewed by MOH'
          : 'Monthly Sales Quantity submitted successfully',
        variant: result.has_anomalies ? 'default' : 'default',
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const flagMSQ = useMutation({
    mutationFn: async (data: { id: string; reason: string; details?: Record<string, unknown> }) => {
      const { data: result, error } = await supabase.rpc('vci_flag_msq_for_review', {
        p_submission_id: data.id,
        p_reason: data.reason,
        p_flag_details: data.details || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'msq'] })
      toast({ title: 'MSQ Flagged', description: 'Submission flagged for review' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const acceptMSQ = useMutation({
    mutationFn: async (data: { id: string; notes?: string }) => {
      const { data: result, error } = await supabase.rpc('vci_accept_msq', {
        p_submission_id: data.id,
        p_notes: data.notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'msq'] })
      toast({ title: 'MSQ Accepted', description: 'Submission has been accepted' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const rejectMSQ = useMutation({
    mutationFn: async (data: { id: string; reason: string }) => {
      const { data: result, error } = await supabase.rpc('vci_reject_msq', {
        p_submission_id: data.id,
        p_rejection_reason: data.reason,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'msq'] })
      toast({ title: 'MSQ Rejected', description: 'Submission has been rejected' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const correctMSQ = useMutation({
    mutationFn: async (data: { originalId: string; correctedData: MSQSubmissionItem[] }) => {
      const { data: result, error } = await supabase.rpc('vci_correct_msq', {
        p_original_submission_id: data.originalId,
        p_corrected_data: data.correctedData,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'msq'] })
      toast({ title: 'MSQ Corrected', description: 'Correction submitted successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return {
    submitMSQ,
    flagMSQ,
    acceptMSQ,
    rejectMSQ,
    correctMSQ,
  }
}

// MSQ Helper functions
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1] || ''
}

export function getMSQGracePeriodEnd(submittedAt: string): Date {
  return new Date(new Date(submittedAt).getTime() + 7 * 24 * 60 * 60 * 1000)
}

export function isMSQWithinGracePeriod(submittedAt: string): boolean {
  const graceEnd = getMSQGracePeriodEnd(submittedAt)
  return new Date() <= graceEnd
}

export function getDaysRemainingInGracePeriod(submittedAt: string): number {
  const graceEnd = getMSQGracePeriodEnd(submittedAt)
  const diffTime = graceEnd.getTime() - new Date().getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

// ============================================================================
// WSL Types and Hooks
// ============================================================================

export type WSLStatus = 'submitted' | 'late' | 'non_compliant' | 'accepted'

export interface WSLSubmissionItem {
  sku_id: string
  stock_level: number
  breach_reason?: string
  replenishment_date?: string
}

export interface WSLSubmission {
  id: string
  company_id: string
  company_name?: string
  week_ending_date: string
  submission_data: WSLSubmissionItem[]
  status: WSLStatus
  is_late: boolean
  is_non_compliant: boolean
  sku_count?: number
  breach_count?: number
  submitted_by: string
  submitted_by_name?: string
  submitted_at: string
  created_at: string
  updated_at: string
}

export function useWSLSubmissions(filters?: {
  company_id?: string
  week_ending_date?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'wsl', 'submissions', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_list_wsl_submissions', {
        p_company_id: filters?.company_id || null,
        p_week_ending_date: filters?.week_ending_date || null,
        p_status: filters?.status || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; submissions: WSLSubmission[]; total: number }
    },
  })
}

export function useWSLMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const submitWSL = useMutation({
    mutationFn: async (data: { week_ending_date: string; submission_data: WSLSubmissionItem[] }) => {
      const { data: result, error } = await supabase.rpc('vci_submit_wsl', {
        p_week_ending_date: data.week_ending_date,
        p_submission_data: data.submission_data,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'wsl'] })
      queryClient.invalidateQueries({ queryKey: ['vci', 'breaches'] })
      toast({
        title: result.breaches_detected > 0 ? 'WSL Submitted - Breaches Detected' : 'WSL Submitted',
        description: result.breaches_detected > 0
          ? `${result.breaches_detected} breach(es) detected and will require attention`
          : 'Weekly Stock Levels submitted successfully',
        variant: result.breaches_detected > 0 ? 'default' : 'default',
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return { submitWSL }
}

// ============================================================================
// Breach Types and Hooks
// ============================================================================

export type BreachStatus = 'detected' | 'tier2_analyzing' | 'tier2_suggested' | 'tier1_reviewed' | 'action_taken' | 'completed'
export type BreachPriority = 'standard' | 'high' | 'critical'

export interface BreachAnalysis {
  id: string
  analyzed_by: string
  analyzed_by_name?: string
  suggested_action: string
  suggested_action_details?: string
  analysis_notes?: string
  analyzed_at: string
}

export interface Breach {
  id: string
  sku_id: string
  sku_name?: string
  sku_code?: string
  dosage_strength?: string
  dosage_form?: string
  company_id: string
  company_name?: string
  wsl_submission_id: string
  threshold_id: string
  stock_level: number
  threshold_value: number
  shortage_percent?: number
  breach_date: string
  breach_reason?: string
  replenishment_date?: string
  priority: BreachPriority
  status: BreachStatus
  is_critical_medicine?: boolean
  created_at: string
  updated_at: string
}

export interface BreachSuggestion {
  action: string
  reason: string
  confidence: string
}

export function useBreaches(filters?: {
  company_id?: string
  sku_id?: string
  status?: string
  priority?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'breaches', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_list_breaches', {
        p_company_id: filters?.company_id || null,
        p_sku_id: filters?.sku_id || null,
        p_status: filters?.status || null,
        p_priority: filters?.priority || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; breaches: Breach[]; total: number }
    },
  })
}

export function useBreach(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'breach', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('vci_get_breach', { p_breach_id: id })
      if (error) throw error
      return data as { success: boolean; breach: Breach; analyses: BreachAnalysis[]; deadline_info: Record<string, unknown> }
    },
    enabled: !!id,
  })
}

export function useBreachSuggestions(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['vci', 'breach', 'suggestions', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('vci_suggest_breach_action', { p_breach_id: id })
      if (error) throw error
      return data as {
        success: boolean
        breach_id: string
        priority: string
        is_critical: boolean
        shortage_percent: number
        prior_breaches: number
        suggestions: BreachSuggestion[]
      }
    },
    enabled: !!id,
  })
}

export function useBreachMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const analyzeBreach = useMutation({
    mutationFn: async (data: {
      breach_id: string
      suggested_action: string
      suggested_action_details?: string
      analysis_notes?: string
    }) => {
      const { data: result, error } = await supabase.rpc('vci_analyze_breach', {
        p_breach_id: data.breach_id,
        p_suggested_action: data.suggested_action,
        p_suggested_action_details: data.suggested_action_details || null,
        p_analysis_notes: data.analysis_notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'breaches'] })
      queryClient.invalidateQueries({ queryKey: ['vci', 'breach'] })
      toast({ title: 'Breach Analyzed', description: 'Analysis submitted for Tier 1 approval' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const analyzeBreachesBatch = useMutation({
    mutationFn: async (data: {
      breach_ids: string[]
      suggested_action: string
      suggested_action_details?: string
      analysis_notes?: string
    }) => {
      const { data: result, error } = await supabase.rpc('vci_analyze_breaches_batch', {
        p_breach_ids: data.breach_ids,
        p_suggested_action: data.suggested_action,
        p_suggested_action_details: data.suggested_action_details || null,
        p_analysis_notes: data.analysis_notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'breaches'] })
      toast({
        title: 'Batch Analysis Complete',
        description: `${result.analyzed} breach(es) analyzed`,
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const approveBreachAction = useMutation({
    mutationFn: async (data: {
      breach_id: string
      approve: boolean
      action_taken?: string
      notes?: string
    }) => {
      const { data: result, error } = await supabase.rpc('vci_approve_breach_action', {
        p_breach_id: data.breach_id,
        p_approve: data.approve,
        p_action_taken: data.action_taken || null,
        p_notes: data.notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'breaches'] })
      queryClient.invalidateQueries({ queryKey: ['vci', 'breach'] })
      toast({
        title: result.approved ? 'Action Approved' : 'Action Rejected',
        description: result.approved
          ? 'Breach action has been approved'
          : 'Sent back to Tier 2 for re-analysis',
      })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const tier1DirectAction = useMutation({
    mutationFn: async (data: {
      breach_id: string
      action: string
      action_details: string
      notes?: string
    }) => {
      const { data: result, error } = await supabase.rpc('vci_tier1_direct_action', {
        p_breach_id: data.breach_id,
        p_action: data.action,
        p_action_details: data.action_details,
        p_notes: data.notes || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vci', 'breaches'] })
      queryClient.invalidateQueries({ queryKey: ['vci', 'breach'] })
      toast({ title: 'Direct Action Taken', description: 'Tier 1 action has been recorded' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return {
    analyzeBreach,
    analyzeBreachesBatch,
    approveBreachAction,
    tier1DirectAction,
  }
}

// WSL Helper functions
export function getWeekEndingFriday(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day <= 5 ? 5 - day : 5 + 7 - day)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatWeekEnding(dateStr: string): string {
  const date = new Date(dateStr)
  return `Week ending ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}
