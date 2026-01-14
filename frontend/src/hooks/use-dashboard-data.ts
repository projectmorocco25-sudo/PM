'use client'

import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'

const supabase = getSupabaseClient()

// Types for dashboard data
export interface SubmissionCompliance {
  onTime: number
  late: number
  unsubmitted: number
  total: number
  percentage: number
  threshold: number
  isEmergency: boolean
}

export interface DashboardMetrics {
  totalCompanies: number
  ipcCount: number
  wholesalerCount: number
  activeSkus: number
  newSkusThisMonth: number
  pendingSubmissions: number
  requireReview: number
  activeBreaches: number
  criticalBreaches: number
}

export interface PendingApproval {
  id: string
  type: 'aams' | 'threshold' | 'registry' | 'enforcement'
  title: string
  company: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

export interface ActiveBreach {
  id: string
  companyName: string
  skuCount: number
  priority: 'extreme' | 'high' | 'normal'
  createdAt: string
}

export interface PendingReversion {
  id: string
  skuName: string
  companyName: string
  revertDate: string
  daysUntil: number
  durationType: 'temporary_auto_revert' | 'temporary_manual_review'
}

export interface FollowUp {
  id: string
  companyName: string
  assignedTo: string
  dueDate: string
  priority: 'extreme' | 'high' | 'normal'
  status: 'active' | 'completed' | 'overdue'
}

export interface EnforcementSummary {
  warnings: number
  fines: number
  suspensions: number
  pendingApprovals: number
}

// Hook: Submission Compliance (%SC)
export function useSubmissionCompliance() {
  return useQuery({
    queryKey: ['dashboard', 'submission-compliance'],
    queryFn: async (): Promise<SubmissionCompliance> => {
      // Get companies that should have submitted this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: submissions, error } = await supabase
        .from('wsl_submissions')
        .select('id, status, submitted_at, company_id')
        .gte('week_ending', weekAgo.toISOString().split('T')[0])

      if (error) throw error

      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .eq('status', 'active')

      const totalCompanies = companies?.length || 0
      const submittedOnTime = submissions?.filter(s => s.status === 'accepted' || s.status === 'submitted').length || 0
      const submittedLate = submissions?.filter(s => s.status === 'late').length || 0
      const unsubmitted = totalCompanies - (submittedOnTime + submittedLate)
      const percentage = totalCompanies > 0 ? Math.round((submittedOnTime / totalCompanies) * 100) : 0
      const threshold = 75

      return {
        onTime: submittedOnTime,
        late: submittedLate,
        unsubmitted: Math.max(0, unsubmitted),
        total: totalCompanies,
        percentage,
        threshold,
        isEmergency: percentage < threshold,
      }
    },
    staleTime: 30000, // 30 seconds
  })
}

// Hook: Dashboard Metrics
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get company counts
      const { data: companies } = await supabase
        .from('companies')
        .select('id, type')
        .eq('status', 'active')

      const totalCompanies = companies?.length || 0
      const ipcCount = companies?.filter(c => c.type === 'ipc').length || 0
      const wholesalerCount = companies?.filter(c => c.type === 'wholesaler').length || 0

      // Get SKU counts
      const { count: activeSkus } = await supabase
        .from('skus')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')

      // Get new SKUs this month
      const monthStart = new Date()
      monthStart.setDate(1)
      const { count: newSkusThisMonth } = await supabase
        .from('skus')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())

      // Get pending submissions (all types)
      const { count: pendingAams } = await supabase
        .from('aams_submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted', 'pending_verification'])

      const { count: pendingMsq } = await supabase
        .from('msq_submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted', 'flagged_for_review'])

      const { count: pendingWsl } = await supabase
        .from('wsl_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'submitted')

      const pendingSubmissions = (pendingAams || 0) + (pendingMsq || 0) + (pendingWsl || 0)

      // Get submissions requiring review
      const { count: requireReview } = await supabase
        .from('msq_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'flagged_for_review')

      // Get active breaches
      const { data: breaches } = await supabase
        .from('breaches')
        .select('id, priority')
        .eq('status', 'active')

      const activeBreaches = breaches?.length || 0
      const criticalBreaches = breaches?.filter(b => b.priority === 'extreme' || b.priority === 'high').length || 0

      return {
        totalCompanies,
        ipcCount,
        wholesalerCount,
        activeSkus: activeSkus || 0,
        newSkusThisMonth: newSkusThisMonth || 0,
        pendingSubmissions,
        requireReview: requireReview || 0,
        activeBreaches,
        criticalBreaches,
      }
    },
    staleTime: 60000, // 1 minute
  })
}

// Hook: Pending Approvals
export function usePendingApprovals() {
  return useQuery({
    queryKey: ['dashboard', 'pending-approvals'],
    queryFn: async (): Promise<PendingApproval[]> => {
      const approvals: PendingApproval[] = []

      // AAMS pending approval
      const { data: aamsSubmissions } = await supabase
        .from('aams_submissions')
        .select('id, year, company_id, created_at, companies(name)')
        .eq('status', 'pending_tier1_approval')
        .order('created_at', { ascending: false })
        .limit(5)

      aamsSubmissions?.forEach(s => {
        approvals.push({
          id: s.id,
          type: 'aams',
          title: `AAMS ${s.year}`,
          company: (s.companies as any)?.name || 'Unknown',
          priority: 'high',
          createdAt: s.created_at,
        })
      })

      // Threshold pending approval
      const { data: thresholds } = await supabase
        .from('thresholds')
        .select('id, sku_id, created_at, skus(name, products(companies(name)))')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false })
        .limit(5)

      thresholds?.forEach(t => {
        approvals.push({
          id: t.id,
          type: 'threshold',
          title: `Threshold: ${(t.skus as any)?.name || 'SKU'}`,
          company: (t.skus as any)?.products?.companies?.name || 'Unknown',
          priority: 'medium',
          createdAt: t.created_at,
        })
      })

      return approvals.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 10)
    },
    staleTime: 30000,
  })
}

// Hook: Active Breaches
export function useActiveBreaches() {
  return useQuery({
    queryKey: ['dashboard', 'active-breaches'],
    queryFn: async (): Promise<ActiveBreach[]> => {
      const { data: breaches } = await supabase
        .from('breaches')
        .select(`
          id, 
          priority, 
          created_at,
          company_id,
          companies(name)
        `)
        .eq('status', 'active')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(10)

      if (!breaches) return []

      // Group by company
      const byCompany = breaches.reduce((acc, breach) => {
        const companyId = breach.company_id
        if (!acc[companyId]) {
          acc[companyId] = {
            id: breach.id,
            companyName: (breach.companies as any)?.name || 'Unknown',
            skuCount: 0,
            priority: breach.priority as 'extreme' | 'high' | 'normal',
            createdAt: breach.created_at,
          }
        }
        acc[companyId].skuCount++
        // Keep highest priority
        if (breach.priority === 'extreme') acc[companyId].priority = 'extreme'
        else if (breach.priority === 'high' && acc[companyId].priority !== 'extreme') {
          acc[companyId].priority = 'high'
        }
        return acc
      }, {} as Record<string, ActiveBreach>)

      return Object.values(byCompany)
    },
    staleTime: 30000,
  })
}

// Hook: Pending Threshold Reversions
export function usePendingReversions() {
  return useQuery({
    queryKey: ['dashboard', 'pending-reversions'],
    queryFn: async (): Promise<PendingReversion[]> => {
      const { data: thresholds } = await supabase
        .from('thresholds')
        .select(`
          id,
          revert_date,
          duration_type,
          skus(name, products(companies(name)))
        `)
        .in('duration_type', ['temporary_auto_revert', 'temporary_manual_review'])
        .not('revert_date', 'is', null)
        .gte('revert_date', new Date().toISOString().split('T')[0])
        .order('revert_date', { ascending: true })
        .limit(10)

      if (!thresholds) return []

      return thresholds.map(t => {
        const revertDate = new Date(t.revert_date!)
        const today = new Date()
        const daysUntil = Math.ceil((revertDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return {
          id: t.id,
          skuName: (t.skus as any)?.name || 'Unknown SKU',
          companyName: (t.skus as any)?.products?.companies?.name || 'Unknown',
          revertDate: t.revert_date!,
          daysUntil,
          durationType: t.duration_type as 'temporary_auto_revert' | 'temporary_manual_review',
        }
      })
    },
    staleTime: 60000,
  })
}

// Hook: Follow-ups
export function useFollowUps() {
  return useQuery({
    queryKey: ['dashboard', 'follow-ups'],
    queryFn: async (): Promise<FollowUp[]> => {
      const { data: followUps } = await supabase
        .from('follow_ups')
        .select(`
          id,
          due_date,
          priority,
          status,
          company_id,
          assigned_to,
          companies(name),
          users!assigned_to(full_name)
        `)
        .eq('status', 'active')
        .order('due_date', { ascending: true })
        .limit(10)

      if (!followUps) return []

      const today = new Date()
      return followUps.map(f => {
        const dueDate = new Date(f.due_date)
        const isOverdue = dueDate < today
        
        return {
          id: f.id,
          companyName: (f.companies as any)?.name || 'Unknown',
          assignedTo: (f.users as any)?.full_name || 'Unassigned',
          dueDate: f.due_date,
          priority: f.priority as 'extreme' | 'high' | 'normal',
          status: isOverdue ? 'overdue' : f.status as 'active' | 'completed',
        }
      })
    },
    staleTime: 30000,
  })
}

// Hook: Enforcement Summary
export function useEnforcementSummary() {
  return useQuery({
    queryKey: ['dashboard', 'enforcement-summary'],
    queryFn: async (): Promise<EnforcementSummary> => {
      const monthStart = new Date()
      monthStart.setDate(1)

      const { data: actions } = await supabase
        .from('enforcement_actions')
        .select('id, action_type, status')
        .gte('created_at', monthStart.toISOString())

      const warnings = actions?.filter(a => a.action_type === 'warning').length || 0
      const fines = actions?.filter(a => a.action_type === 'fine').length || 0
      const suspensions = actions?.filter(a => a.action_type === 'suspension').length || 0
      const pendingApprovals = actions?.filter(a => a.status === 'pending_approval').length || 0

      return { warnings, fines, suspensions, pendingApprovals }
    },
    staleTime: 60000,
  })
}

// Hook: Unsubmitted Companies
export function useUnsubmittedCompanies() {
  return useQuery({
    queryKey: ['dashboard', 'unsubmitted-companies'],
    queryFn: async () => {
      // Get all active companies
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, type')
        .eq('status', 'active')

      // Get companies that submitted this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: submissions } = await supabase
        .from('wsl_submissions')
        .select('company_id')
        .gte('week_ending', weekAgo.toISOString().split('T')[0])

      const submittedCompanyIds = new Set(submissions?.map(s => s.company_id) || [])
      
      // Get critical medicines count per company
      const { data: criticalMeds } = await supabase
        .from('critical_medicines')
        .select('sku_id, skus(product_id, products(company_id))')

      const criticalMedsPerCompany: Record<string, number> = {}
      criticalMeds?.forEach(cm => {
        const companyId = (cm.skus as any)?.products?.company_id
        if (companyId) {
          criticalMedsPerCompany[companyId] = (criticalMedsPerCompany[companyId] || 0) + 1
        }
      })

      // Get enforcement history
      const { data: enforcements } = await supabase
        .from('enforcement_actions')
        .select('company_id, action_type')

      const enforcementPerCompany: Record<string, { warnings: number; fines: number }> = {}
      enforcements?.forEach(e => {
        if (!enforcementPerCompany[e.company_id]) {
          enforcementPerCompany[e.company_id] = { warnings: 0, fines: 0 }
        }
        if (e.action_type === 'warning') enforcementPerCompany[e.company_id].warnings++
        if (e.action_type === 'fine') enforcementPerCompany[e.company_id].fines++
      })

      const unsubmitted = companies?.filter(c => !submittedCompanyIds.has(c.id)).map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        criticalMedicines: criticalMedsPerCompany[c.id] || 0,
        warnings: enforcementPerCompany[c.id]?.warnings || 0,
        fines: enforcementPerCompany[c.id]?.fines || 0,
        priority: criticalMedsPerCompany[c.id] > 0 ? 'extreme' : 'normal',
      })) || []

      // Sort by priority (extreme first) then by critical medicines count
      return unsubmitted.sort((a, b) => {
        if (a.priority === 'extreme' && b.priority !== 'extreme') return -1
        if (b.priority === 'extreme' && a.priority !== 'extreme') return 1
        return b.criticalMedicines - a.criticalMedicines
      })
    },
    staleTime: 60000,
  })
}
