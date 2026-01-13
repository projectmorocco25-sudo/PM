/**
 * Task 1.1.1.23: Database Seeding Utilities
 * 
 * Shared utilities for seed scripts
 */

import { createClient } from '@supabase/supabase-js'

// ============================================================================
// Supabase Client Setup
// ============================================================================

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ============================================================================
// Logging Utilities
// ============================================================================

export function log(message: string, level: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const icons = {
    info: '📋',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  }
  console.log(`${icons[level]} ${message}`)
}

export function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  console.log(`  ${title}`)
  console.log('='.repeat(60))
}

// ============================================================================
// ID Generation
// ============================================================================

// Deterministic UUIDs for seed data (allows idempotent seeding)
export function seedUUID(namespace: string, index: number): string {
  // Simple deterministic UUID based on namespace and index
  const hash = hashCode(`${namespace}-${index}`)
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(0, 3)}-${hex.slice(0, 12).padEnd(12, '0')}`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

// ============================================================================
// Date Utilities
// ============================================================================

export function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function startOfWeek(weeksAgo: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() - (weeksAgo * 7))
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

export function startOfMonth(monthsAgo: number = 0): string {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo, 1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

// ============================================================================
// Random Data Utilities
// ============================================================================

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// ============================================================================
// Batch Insert Helper
// ============================================================================

export async function batchInsert<T extends Record<string, unknown>>(
  table: string,
  records: T[],
  options: { onConflict?: string; batchSize?: number } = {}
): Promise<void> {
  const { onConflict, batchSize = 100 } = options
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    
    let query = supabase.from(table).insert(batch)
    
    if (onConflict) {
      query = supabase.from(table).upsert(batch, { onConflict })
    }
    
    const { error } = await query
    
    if (error) {
      throw new Error(`Failed to insert into ${table}: ${error.message}`)
    }
  }
  
  log(`Inserted ${records.length} records into ${table}`, 'success')
}

// ============================================================================
// Cleanup Helper
// ============================================================================

export async function truncateTable(table: string): Promise<void> {
  const { error } = await supabase.rpc('truncate_table', { table_name: table })
  
  if (error) {
    log(`Failed to truncate ${table}: ${error.message}`, 'warn')
  } else {
    log(`Truncated ${table}`, 'info')
  }
}
