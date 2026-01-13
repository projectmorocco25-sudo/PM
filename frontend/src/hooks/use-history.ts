'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TimelineEvent, TimelineEventType } from '@/components/history/timeline'

// Task 1.1.5.25-32: History hooks for detail pages

export interface AuditLogEntry {
  id: string
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_by: string
  changed_by_name?: string
  changed_by_role?: string
  changed_at: string
  ip_address?: string
  user_agent?: string
}

// Map audit actions to timeline event types
function mapActionToEventType(action: string, tableName: string): TimelineEventType {
  if (action === 'INSERT') return 'created'
  if (action === 'DELETE') return 'deleted'
  
  // Check for status changes in the new_data
  return 'updated'
}

// Generate a human-readable title for an audit entry
function generateTitle(entry: AuditLogEntry): string {
  const action = entry.action.toLowerCase()
  const tableFriendly = entry.table_name
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
  
  switch (entry.action) {
    case 'INSERT':
      return `${tableFriendly} created`
    case 'DELETE':
      return `${tableFriendly} deleted`
    case 'UPDATE':
      // Check for status changes
      if (entry.new_data?.status && entry.old_data?.status) {
        return `Status changed from "${entry.old_data.status}" to "${entry.new_data.status}"`
      }
      return `${tableFriendly} updated`
    default:
      return `${tableFriendly} ${action}`
  }
}

// Generate description from changes
function generateDescription(entry: AuditLogEntry): string | undefined {
  if (entry.action !== 'UPDATE') return undefined
  
  const changes: string[] = []
  if (entry.old_data && entry.new_data) {
    for (const key of Object.keys(entry.new_data)) {
      if (key === 'updated_at' || key === 'created_at') continue
      if (JSON.stringify(entry.old_data[key]) !== JSON.stringify(entry.new_data[key])) {
        changes.push(key.replace(/_/g, ' '))
      }
    }
  }
  
  if (changes.length === 0) return undefined
  if (changes.length === 1) return `Changed: ${changes[0]}`
  if (changes.length <= 3) return `Changed: ${changes.join(', ')}`
  return `Changed ${changes.length} fields`
}

// Convert audit log entries to timeline events
export function auditLogsToTimelineEvents(logs: AuditLogEntry[]): TimelineEvent[] {
  return logs.map((log) => ({
    id: log.id,
    type: mapActionToEventType(log.action, log.table_name),
    title: generateTitle(log),
    description: generateDescription(log),
    user: {
      id: log.changed_by,
      name: log.changed_by_name || 'Unknown User',
      role: log.changed_by_role,
    },
    timestamp: log.changed_at,
    details: log.action === 'UPDATE' ? {
      old: log.old_data,
      new: log.new_data,
    } : undefined,
    metadata: log.action === 'UPDATE' && log.old_data?.status && log.new_data?.status ? {
      field: 'status',
      oldValue: String(log.old_data.status),
      newValue: String(log.new_data.status),
    } : undefined,
  }))
}

interface UseEntityHistoryOptions {
  entityType: 'company' | 'product' | 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission' | 'breach' | 'compliance_score' | 'enforcement_action'
  entityId: string | null
  enabled?: boolean
  limit?: number
}

// Map entity types to table names
const ENTITY_TABLE_MAP: Record<string, string> = {
  company: 'companies',
  product: 'products',
  sku: 'skus',
  aams_submission: 'aams_submissions',
  msq_submission: 'msq_submissions',
  wsl_submission: 'wsl_submissions',
  breach: 'breaches',
  compliance_score: 'compliance_scores',
  enforcement_action: 'enforcement_actions',
}

export function useEntityHistory({ entityType, entityId, enabled = true, limit = 50 }: UseEntityHistoryOptions) {
  const supabase = createClient()
  const tableName = ENTITY_TABLE_MAP[entityType]

  return useQuery({
    queryKey: ['history', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return { events: [], total: 0 }

      // Try to get from audit_logs table
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .eq('table_name', tableName)
        .eq('record_id', entityId)
        .order('changed_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching history:', error)
        // Return empty if audit_logs doesn't exist or other error
        return { events: [], total: 0 }
      }

      const events = auditLogsToTimelineEvents(data || [])
      return { events, total: count || 0 }
    },
    enabled: enabled && !!entityId,
  })
}

// Hook for infinite scroll history
export function useEntityHistoryInfinite({ entityType, entityId, enabled = true }: Omit<UseEntityHistoryOptions, 'limit'>) {
  const supabase = createClient()
  const tableName = ENTITY_TABLE_MAP[entityType]
  const pageSize = 20

  return useInfiniteQuery({
    queryKey: ['history', 'infinite', entityType, entityId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!entityId) return { events: [], nextCursor: undefined }

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', tableName)
        .eq('record_id', entityId)
        .order('changed_at', { ascending: false })
        .range(pageParam, pageParam + pageSize - 1)

      if (error) {
        console.error('Error fetching history:', error)
        return { events: [], nextCursor: undefined }
      }

      const events = auditLogsToTimelineEvents(data || [])
      const nextCursor = events.length === pageSize ? pageParam + pageSize : undefined

      return { events, nextCursor }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && !!entityId,
  })
}

// Hook for related entity history (e.g., all SKUs for a product)
interface UseRelatedHistoryOptions {
  parentType: 'company' | 'product'
  parentId: string | null
  childType: 'product' | 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission'
  enabled?: boolean
  limit?: number
}

export function useRelatedHistory({ parentType, parentId, childType, enabled = true, limit = 20 }: UseRelatedHistoryOptions) {
  const supabase = createClient()
  const childTable = ENTITY_TABLE_MAP[childType]

  return useQuery({
    queryKey: ['history', 'related', parentType, parentId, childType],
    queryFn: async () => {
      if (!parentId) return { events: [], total: 0 }

      // First get the child IDs
      const foreignKey = parentType === 'company' ? 'company_id' : 'product_id'
      const { data: children, error: childError } = await supabase
        .from(childTable)
        .select('id')
        .eq(foreignKey, parentId)
        .limit(100)

      if (childError || !children?.length) {
        return { events: [], total: 0 }
      }

      const childIds = children.map((c) => c.id)

      // Then get audit logs for those children
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .eq('table_name', childTable)
        .in('record_id', childIds)
        .order('changed_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { events: [], total: 0 }
      }

      const events = auditLogsToTimelineEvents(data || [])
      return { events, total: count || 0 }
    },
    enabled: enabled && !!parentId,
  })
}

// Combined history for a company (company + products + SKUs + submissions)
export function useCompanyFullHistory(companyId: string | null, enabled = true) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['history', 'company', 'full', companyId],
    queryFn: async () => {
      if (!companyId) return { events: [], total: 0 }

      // Get company audit logs
      const { data: companyLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'companies')
        .eq('record_id', companyId)
        .order('changed_at', { ascending: false })
        .limit(20)

      // Get product IDs for this company
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('company_id', companyId)

      const productIds = products?.map((p) => p.id) || []

      // Get product audit logs
      const { data: productLogs } = productIds.length > 0 
        ? await supabase
            .from('audit_logs')
            .select('*')
            .eq('table_name', 'products')
            .in('record_id', productIds)
            .order('changed_at', { ascending: false })
            .limit(20)
        : { data: [] }

      // Combine and sort
      const allLogs = [...(companyLogs || []), ...(productLogs || [])]
        .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())
        .slice(0, 50)

      const events = auditLogsToTimelineEvents(allLogs)
      return { events, total: allLogs.length }
    },
    enabled: enabled && !!companyId,
  })
}
