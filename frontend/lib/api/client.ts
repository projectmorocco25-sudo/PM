/**
 * API Client Base
 * Task: 1.1.1.12b
 * Reference: State Management UI Patterns, RPC Functions
 * 
 * Base API client for Supabase queries and RPC calls
 */

import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export type Database = any // Will be typed properly when types are generated

export function getSupabaseClient(): SupabaseClient<Database> {
  return createClient()
}

/**
 * Base query function for Supabase RPC calls
 */
export async function rpcQuery<T = any>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.rpc(functionName, params || {})
  
  if (error) {
    throw new Error(`RPC ${functionName} failed: ${error.message}`)
  }
  
  return data as T
}

/**
 * Base query function for Supabase table queries
 */
export async function tableQuery<T = any>(
  tableName: string,
  query?: (query: any) => any
): Promise<T[]> {
  const supabase = getSupabaseClient()
  
  let builder = supabase.from(tableName).select('*')
  
  if (query) {
    builder = query(builder)
  }
  
  const { data, error } = await builder
  
  if (error) {
    throw new Error(`Table query ${tableName} failed: ${error.message}`)
  }
  
  return (data || []) as T[]
}

/**
 * Base mutation function for Supabase table operations
 */
export async function tableMutation<T = any>(
  operation: 'insert' | 'update' | 'upsert' | 'delete',
  tableName: string,
  data: any,
  filter?: (query: any) => any
): Promise<T> {
  const supabase = getSupabaseClient()
  
  let builder: any
  
  switch (operation) {
    case 'insert':
      builder = supabase.from(tableName).insert(data).select()
      break
    case 'update':
      builder = supabase.from(tableName).update(data)
      if (filter) builder = filter(builder)
      builder = builder.select()
      break
    case 'upsert':
      builder = supabase.from(tableName).upsert(data).select()
      break
    case 'delete':
      builder = supabase.from(tableName).delete()
      if (filter) builder = filter(builder)
      builder = builder.select()
      break
  }
  
  const { data: result, error } = await builder
  
  if (error) {
    throw new Error(`Table ${operation} ${tableName} failed: ${error.message}`)
  }
  
  return result as T
}
