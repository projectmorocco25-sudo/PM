'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Types
export interface Company {
  id: string
  name: string
  registration_number: string
  company_type: 'ipc' | 'wholesaler'
  address: string | null
  contact_email: string | null
  contact_phone: string | null
  is_active: boolean
  suspended_at: string | null
  suspended_by: string | null
  suspended_reason: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  company_id: string
  company_name?: string
  name: string
  description: string | null
  is_critical_medicine: boolean
  is_active: boolean
  deactivated_at: string | null
  deactivated_by: string | null
  deactivated_reason: string | null
  created_at: string
  updated_at: string
}

export interface SKU {
  id: string
  product_id: string
  product_name?: string
  company_id?: string
  company_name?: string
  sku_code: string
  name: string
  dosage_strength: string
  dosage_form: string
  pack_size: string
  unit_of_measure: string
  atc_code_id: string | null
  atc_code?: string
  atc_name?: string
  is_moh_authorized_unregistered: boolean
  is_active: boolean
  deactivated_at: string | null
  deactivated_by: string | null
  deactivated_reason: string | null
  created_at: string
  updated_at: string
}

export interface ATCCode {
  id: string
  code: string
  name: string
  level: number
  parent_code: string | null
}

export interface CriticalMedicine {
  id: string
  sku_id: string
  sku_code?: string
  sku_name?: string
  product_name?: string
  company_name?: string
  designation_date: string
  designated_by: string
  designated_by_name?: string
  reason: string | null
  is_active: boolean
  removed_at: string | null
  removed_by: string | null
  removed_reason: string | null
}

export interface RegistrySubmission {
  id: string
  submission_type: 'create' | 'update' | 'deactivate'
  entity_type: 'company' | 'product' | 'sku'
  entity_id: string | null
  company_id: string | null
  company_name?: string
  submission_data: Record<string, unknown>
  status: 'draft' | 'submitted' | 'tier2_verified' | 'tier2_peer_reviewed' | 'tier1_approved' | 'tier2_implemented' | 'completed' | 'rejected'
  submitted_by: string
  submitted_by_name?: string
  submitted_at: string | null
  verified_by: string | null
  verified_at: string | null
  approved_by: string | null
  approved_at: string | null
  implemented_by: string | null
  implemented_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Approval {
  id: string
  submission_id: string
  submission_type: string
  from_status: string
  to_status: string
  approver_id: string
  approver_name?: string
  approval_type: string
  comments: string | null
  created_at: string
}

// Hooks
export function useCompanies(filters?: {
  company_type?: string
  is_active?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'companies', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rmm_list_companies', {
        p_company_type: filters?.company_type || null,
        p_is_active: filters?.is_active ?? null,
        p_search: filters?.search || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; companies: Company[]; total: number }
    },
  })
}

export function useCompany(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'company', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('rmm_get_company', { p_company_id: id })
      if (error) throw error
      return data as { success: boolean; company: Company }
    },
    enabled: !!id,
  })
}

export function useProducts(filters?: {
  company_id?: string
  is_active?: boolean
  is_critical_medicine?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'products', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rmm_list_products', {
        p_company_id: filters?.company_id || null,
        p_is_active: filters?.is_active ?? null,
        p_is_critical_medicine: filters?.is_critical_medicine ?? null,
        p_search: filters?.search || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; products: Product[]; total: number }
    },
  })
}

export function useProduct(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'product', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('rmm_get_product', { p_product_id: id })
      if (error) throw error
      return data as { success: boolean; product: Product }
    },
    enabled: !!id,
  })
}

export function useSKUs(filters?: {
  product_id?: string
  company_id?: string
  is_active?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'skus', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rmm_list_skus', {
        p_product_id: filters?.product_id || null,
        p_company_id: filters?.company_id || null,
        p_is_active: filters?.is_active ?? null,
        p_search: filters?.search || null,
        p_limit: filters?.limit || 50,
        p_offset: filters?.offset || 0,
      })
      if (error) throw error
      return data as { success: boolean; skus: SKU[]; total: number }
    },
  })
}

export function useSKU(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'sku', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.rpc('rmm_get_sku', { p_sku_id: id })
      if (error) throw error
      return data as { success: boolean; sku: SKU }
    },
    enabled: !!id,
  })
}

export function useATCCodes(filters?: {
  level?: number
  parent_code?: string
  search?: string
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'atc_codes', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rmm_list_atc_codes', {
        p_level: filters?.level || null,
        p_parent_code: filters?.parent_code || null,
        p_search: filters?.search || null,
      })
      if (error) throw error
      return data as { success: boolean; atc_codes: ATCCode[] }
    },
  })
}

export function useCriticalMedicines(is_active?: boolean) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'critical_medicines', is_active],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rmm_list_critical_medicines', {
        p_is_active: is_active ?? true,
      })
      if (error) throw error
      return data as { success: boolean; critical_medicines: CriticalMedicine[] }
    },
  })
}

export function useRegistrySubmissions() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'registry_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registry_submissions')
        .select(`
          *,
          company:companies(name),
          submitter:users!submitted_by(full_name)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.map(s => ({
        ...s,
        company_name: s.company?.name,
        submitted_by_name: s.submitter?.full_name,
      })) as RegistrySubmission[]
    },
  })
}

export function useRegistrySubmission(id: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'registry_submission', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('registry_submissions')
        .select(`
          *,
          company:companies(name),
          submitter:users!submitted_by(full_name)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        ...data,
        company_name: data.company?.name,
        submitted_by_name: data.submitter?.full_name,
      } as RegistrySubmission
    },
    enabled: !!id,
  })
}

export function useApprovalHistory(submissionId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rmm', 'approval_history', submissionId],
    queryFn: async () => {
      if (!submissionId) return []
      const { data, error } = await supabase
        .from('approvals')
        .select(`
          *,
          approver:users!approver_id(full_name)
        `)
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data.map(a => ({
        ...a,
        approver_name: a.approver?.full_name,
      })) as Approval[]
    },
    enabled: !!submissionId,
  })
}

// Mutations
export function useCompanyMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createCompany = useMutation({
    mutationFn: async (data: {
      name: string
      registration_number: string
      company_type: string
      address?: string
      contact_email?: string
      contact_phone?: string
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_create_company', {
        p_name: data.name,
        p_registration_number: data.registration_number,
        p_company_type: data.company_type,
        p_address: data.address || null,
        p_contact_email: data.contact_email || null,
        p_contact_phone: data.contact_phone || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'companies'] })
      toast({ title: 'Success', description: 'Company created successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const updateCompany = useMutation({
    mutationFn: async (data: {
      id: string
      name?: string
      address?: string
      contact_email?: string
      contact_phone?: string
      is_active?: boolean
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_update_company', {
        p_company_id: data.id,
        p_name: data.name || null,
        p_address: data.address || null,
        p_contact_email: data.contact_email || null,
        p_contact_phone: data.contact_phone || null,
        p_is_active: data.is_active ?? null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'companies'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'company'] })
      toast({ title: 'Success', description: 'Company updated successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return { createCompany, updateCompany }
}

export function useProductMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createProduct = useMutation({
    mutationFn: async (data: {
      company_id: string
      name: string
      description?: string
      is_critical_medicine?: boolean
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_create_product', {
        p_company_id: data.company_id,
        p_name: data.name,
        p_description: data.description || null,
        p_is_critical_medicine: data.is_critical_medicine || false,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'products'] })
      toast({ title: 'Success', description: 'Product created successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const updateProduct = useMutation({
    mutationFn: async (data: {
      id: string
      name?: string
      description?: string
      is_critical_medicine?: boolean
      is_active?: boolean
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_update_product', {
        p_product_id: data.id,
        p_name: data.name || null,
        p_description: data.description || null,
        p_is_critical_medicine: data.is_critical_medicine ?? null,
        p_is_active: data.is_active ?? null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'product'] })
      toast({ title: 'Success', description: 'Product updated successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return { createProduct, updateProduct }
}

export function useSKUMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createSKU = useMutation({
    mutationFn: async (data: {
      product_id: string
      sku_code: string
      name: string
      dosage_strength: string
      dosage_form: string
      pack_size: string
      unit_of_measure: string
      atc_code_id?: string
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_create_sku', {
        p_product_id: data.product_id,
        p_sku_code: data.sku_code,
        p_name: data.name,
        p_dosage_strength: data.dosage_strength,
        p_dosage_form: data.dosage_form,
        p_pack_size: data.pack_size,
        p_unit_of_measure: data.unit_of_measure,
        p_atc_code_id: data.atc_code_id || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'skus'] })
      toast({ title: 'Success', description: 'SKU created successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const updateSKU = useMutation({
    mutationFn: async (data: {
      id: string
      name?: string
      dosage_strength?: string
      dosage_form?: string
      pack_size?: string
      unit_of_measure?: string
      atc_code_id?: string
      is_active?: boolean
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_update_sku', {
        p_sku_id: data.id,
        p_name: data.name || null,
        p_dosage_strength: data.dosage_strength || null,
        p_dosage_form: data.dosage_form || null,
        p_pack_size: data.pack_size || null,
        p_unit_of_measure: data.unit_of_measure || null,
        p_atc_code_id: data.atc_code_id || null,
        p_is_active: data.is_active ?? null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'skus'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'sku'] })
      toast({ title: 'Success', description: 'SKU updated successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return { createSKU, updateSKU }
}

export function useRegistrySubmissionMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const submitRegistryUpdate = useMutation({
    mutationFn: async (data: {
      entity_type: string
      entity_id?: string
      company_id?: string
      submission_type?: string
      submission_data?: Record<string, unknown>
    }) => {
      const { data: result, error } = await supabase.rpc('rmm_submit_registry_update', {
        p_entity_type: data.entity_type,
        p_entity_id: data.entity_id || null,
        p_company_id: data.company_id || null,
        p_submission_type: data.submission_type || 'update',
        p_submission_data: data.submission_data || {},
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      toast({ title: 'Success', description: 'Registry update submitted' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const verifySubmission = useMutation({
    mutationFn: async (data: { id: string; comments?: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_verify_registry_submission', {
        p_submission_id: data.id,
        p_comments: data.comments || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submission'] })
      toast({ title: 'Success', description: 'Submission verified' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const approveSubmission = useMutation({
    mutationFn: async (data: { id: string; comments?: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_approve_registry_submission', {
        p_submission_id: data.id,
        p_comments: data.comments || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submission'] })
      toast({ title: 'Success', description: 'Submission approved' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const implementSubmission = useMutation({
    mutationFn: async (data: { id: string; comments?: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_implement_registry_update', {
        p_submission_id: data.id,
        p_comments: data.comments || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submission'] })
      toast({ title: 'Success', description: 'Submission implemented' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const rejectSubmission = useMutation({
    mutationFn: async (data: { id: string; rejection_reason: string; feedback?: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_reject_registry_submission', {
        p_submission_id: data.id,
        p_rejection_reason: data.rejection_reason,
        p_feedback: data.feedback || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submission'] })
      toast({ title: 'Success', description: 'Submission rejected' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const peerReviewSubmission = useMutation({
    mutationFn: async (data: { id: string; comments?: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_peer_review_registry_submission', {
        p_submission_id: data.id,
        p_comments: data.comments || null,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'registry_submission'] })
      toast({ title: 'Success', description: 'Peer review completed' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return {
    submitRegistryUpdate,
    verifySubmission,
    approveSubmission,
    implementSubmission,
    rejectSubmission,
    peerReviewSubmission,
  }
}

export function useCriticalMedicineMutations() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const designateCriticalMedicine = useMutation({
    mutationFn: async (data: { sku_id: string; reason: string }) => {
      const { data: result, error } = await supabase.rpc('rmm_designate_critical_medicine', {
        p_sku_id: data.sku_id,
        p_reason: data.reason,
      })
      if (error) throw error
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmm', 'critical_medicines'] })
      queryClient.invalidateQueries({ queryKey: ['rmm', 'skus'] })
      toast({ title: 'Success', description: 'SKU designated as critical medicine' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return { designateCriticalMedicine }
}
