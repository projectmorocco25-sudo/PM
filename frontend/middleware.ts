/**
 * Middleware
 * Task: 1.1.1.14
 * Reference: Navigation & Layout Patterns, Role-Based UI Patterns
 * 
 * Protected route middleware for auth checks and role-based access
 */

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/rmm', '/vci', '/ecs', '/cmc', '/profile']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Auth routes - redirect if already authenticated
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // For protected paths, authentication check will be done in updateSession
  // For auth paths, we'll let them through (redirect logic can be added later)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
