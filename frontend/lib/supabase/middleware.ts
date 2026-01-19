/**
 * Supabase Middleware Client
 * Task: 1.1.1.12
 * Reference: State Management UI Patterns, Navigation & Layout Patterns
 * 
 * Middleware Supabase client for Next.js middleware
 * Used for protected routes and auth checks
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Use modern publishable key if available, otherwise fall back to legacy anon key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected route logic will be implemented in Task 1.1.1.14
  // For now, just ensure session is refreshed

  return supabaseResponse
}
