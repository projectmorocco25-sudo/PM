'use client'

import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Task 1.1.1.12d: Error state patterns

interface ErrorAlertProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({ title = 'Error', message, onRetry, className }: ErrorAlertProps) {
  return (
    <div className={cn('rounded-lg border border-destructive/50 bg-destructive/10 p-4', className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-destructive">{title}</h4>
          <p className="text-sm text-destructive/80 mt-1">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface ErrorPageProps {
  title?: string
  message?: string
  onRetry?: () => void
  showHomeLink?: boolean
  showBackLink?: boolean
}

export function ErrorPage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showHomeLink = true,
  showBackLink = true,
}: ErrorPageProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-2 max-w-md">{message}</p>
      <div className="flex gap-3 mt-6">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {showBackLink && (
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        )}
        {showHomeLink && (
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

interface NotFoundPageProps {
  title?: string
  message?: string
  resourceType?: string
}

export function NotFoundPage({
  title = 'Not Found',
  message,
  resourceType = 'page',
}: NotFoundPageProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
      <div className="text-6xl font-bold text-muted-foreground/30 mb-4">404</div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-2">
        {message || `The ${resourceType} you're looking for doesn't exist or has been moved.`}
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

interface PermissionDeniedPageProps {
  message?: string
}

export function PermissionDeniedPage({ message }: PermissionDeniedPageProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
      <div className="text-6xl font-bold text-muted-foreground/30 mb-4">403</div>
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        {message || "You don't have permission to access this resource. Contact your administrator if you believe this is an error."}
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Task 1.1.1.12i: API error handling utilities
export interface ApiError {
  type: 'network' | 'validation' | 'permission' | 'not_found' | 'server' | 'unknown'
  message: string
  details?: Record<string, string[]>
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Network error
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
      }
    }

    // Try to parse structured error
    try {
      const parsed = JSON.parse(error.message)
      if (parsed.code === 'PGRST301') {
        return { type: 'permission', message: 'You do not have permission to perform this action.' }
      }
      if (parsed.code === 'PGRST116') {
        return { type: 'not_found', message: 'The requested resource was not found.' }
      }
      if (parsed.code?.startsWith('22') || parsed.code?.startsWith('23')) {
        return { type: 'validation', message: parsed.message || 'Invalid data provided.' }
      }
    } catch {
      // Not a JSON error
    }

    return { type: 'unknown', message: error.message }
  }

  return { type: 'unknown', message: 'An unexpected error occurred.' }
}

export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message
}
