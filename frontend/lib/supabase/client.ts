/**
 * Supabase Client Utilities
 * Task: 1.1.1.12
 * Reference: State Management UI Patterns
 * 
 * Client-side Supabase client for browser use
 * Uses modern publishable key when available, falls back to legacy anon key
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use modern publishable key if available, otherwise fall back to legacy anon key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseKey) {
    throw new Error('Missing Supabase API key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
