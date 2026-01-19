/**
 * Supabase Client Exports
 * Task: 1.1.1.12
 * 
 * Central export point for Supabase client utilities
 */

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { updateSession } from './middleware'
