'use client'

/**
 * Task 1.1.1.17k: Accessibility Features
 * Task 1.1.1.17l: Screen Reader Testing Setup
 * Task 1.1.1.17m: Focus Trap for Modals
 * Task 1.1.1.17n: Skip Navigation Link
 * 
 * Accessibility components and utilities for WCAG 2.1 AA compliance.
 * 
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// Skip Link Component (Task 1.1.1.17n)
// ============================================================================

interface SkipLinkProps {
  /** Target element ID to skip to */
  targetId?: string
  /** Link text */
  children?: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Skip navigation link for keyboard users
 * Becomes visible on focus, allows skipping to main content.
 * 
 * @example
 * // In layout.tsx
 * <SkipLink targetId="main-content" />
 * <Header />
 * <main id="main-content">...</main>
 */
export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to main content',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Hidden by default, visible on focus
        'sr-only focus:not-sr-only',
        // Positioning
        'fixed top-4 left-4 z-[9999]',
        // Styling
        'bg-primary text-primary-foreground',
        'px-4 py-2 rounded-md font-medium',
        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Animation
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </a>
  )
}

// ============================================================================
// Focus Trap Component (Task 1.1.1.17m)
// ============================================================================

interface FocusTrapProps {
  /** Whether the focus trap is active */
  active?: boolean
  /** Children to trap focus within */
  children: React.ReactNode
  /** Callback when escape is pressed */
  onEscape?: () => void
  /** Initial focus element selector */
  initialFocus?: string
  /** Return focus to trigger element on deactivate */
  returnFocus?: boolean
  /** Additional className for container */
  className?: string
}

/**
 * Focus trap component for modals and dialogs.
 * Traps keyboard focus within the container.
 * 
 * @example
 * <FocusTrap active={isOpen} onEscape={handleClose}>
 *   <DialogContent>...</DialogContent>
 * </FocusTrap>
 */
export function FocusTrap({
  active = true,
  children,
  onEscape,
  initialFocus,
  returnFocus = true,
  className,
}: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  // Store the previously focused element
  React.useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [active])

  // Set initial focus
  React.useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    
    // Focus initial element if specified
    if (initialFocus) {
      const initialElement = container.querySelector(initialFocus) as HTMLElement
      if (initialElement) {
        initialElement.focus()
        return
      }
    }

    // Otherwise focus first focusable element
    const focusableElements = getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }, [active, initialFocus])

  // Return focus on deactivate
  React.useEffect(() => {
    return () => {
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [returnFocus])

  // Handle keyboard events
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (!active || !containerRef.current) return

    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault()
      onEscape()
      return
    }

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(containerRef.current)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }, [active, onEscape])

  if (!active) {
    return <>{children}</>
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Visually Hidden Component
// ============================================================================

interface VisuallyHiddenProps {
  /** Content to hide visually but keep accessible to screen readers */
  children: React.ReactNode
  /** HTML element to render */
  as?: keyof JSX.IntrinsicElements
}

/**
 * Visually hidden content for screen readers
 * 
 * @example
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// ============================================================================
// Live Region Component
// ============================================================================

interface LiveRegionProps {
  /** Content to announce */
  children: React.ReactNode
  /** Politeness level */
  politeness?: 'polite' | 'assertive' | 'off'
  /** Whether the entire region should be announced */
  atomic?: boolean
  /** Additional className */
  className?: string
}

/**
 * Live region for announcing dynamic content to screen readers
 * 
 * @example
 * <LiveRegion politeness="polite">
 *   {message && <p>{message}</p>}
 * </LiveRegion>
 */
export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Focus Ring Component
// ============================================================================

interface FocusRingProps {
  /** Children to wrap with focus ring */
  children: React.ReactNode
  /** Focus ring color */
  color?: 'primary' | 'destructive' | 'warning' | 'success'
  /** Focus ring offset */
  offset?: 'none' | 'sm' | 'md'
  /** Additional className */
  className?: string
}

/**
 * Focus ring wrapper for custom focus styles
 * 
 * @example
 * <FocusRing color="primary">
 *   <CustomButton>...</CustomButton>
 * </FocusRing>
 */
export function FocusRing({
  children,
  color = 'primary',
  offset = 'sm',
  className,
}: FocusRingProps) {
  const colorClasses = {
    primary: 'focus-within:ring-primary',
    destructive: 'focus-within:ring-destructive',
    warning: 'focus-within:ring-warning',
    success: 'focus-within:ring-green-500',
  }

  const offsetClasses = {
    none: 'focus-within:ring-offset-0',
    sm: 'focus-within:ring-offset-1',
    md: 'focus-within:ring-offset-2',
  }

  return (
    <div
      className={cn(
        'focus-within:ring-2 focus-within:outline-none',
        colorClasses[color],
        offsetClasses[offset],
        'rounded-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Roving Tab Index Hook
// ============================================================================

/**
 * Hook for implementing roving tab index pattern
 * Used for toolbars, menus, and other composite widgets
 * 
 * @example
 * const { activeIndex, handleKeyDown, getTabIndex } = useRovingTabIndex(items.length)
 */
export function useRovingTabIndex(itemCount: number, options?: {
  orientation?: 'horizontal' | 'vertical' | 'both'
  loop?: boolean
  initialIndex?: number
}) {
  const { 
    orientation = 'horizontal', 
    loop = true,
    initialIndex = 0 
  } = options || {}
  
  const [activeIndex, setActiveIndex] = React.useState(initialIndex)

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    const isHorizontal = orientation === 'horizontal' || orientation === 'both'
    const isVertical = orientation === 'vertical' || orientation === 'both'
    
    let nextIndex = activeIndex

    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault()
          nextIndex = activeIndex - 1
        }
        break
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault()
          nextIndex = activeIndex + 1
        }
        break
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault()
          nextIndex = activeIndex - 1
        }
        break
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault()
          nextIndex = activeIndex + 1
        }
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = itemCount - 1
        break
      default:
        return
    }

    // Handle looping
    if (loop) {
      if (nextIndex < 0) nextIndex = itemCount - 1
      if (nextIndex >= itemCount) nextIndex = 0
    } else {
      nextIndex = Math.max(0, Math.min(itemCount - 1, nextIndex))
    }

    setActiveIndex(nextIndex)
  }, [activeIndex, itemCount, orientation, loop])

  const getTabIndex = React.useCallback((index: number) => {
    return index === activeIndex ? 0 : -1
  }, [activeIndex])

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getTabIndex,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  return getFocusableElements(element.parentElement || document.body).includes(element)
}

/**
 * Generate unique ID for accessibility purposes
 */
export function useAccessibleId(prefix?: string): string {
  const id = React.useId()
  return prefix ? `${prefix}-${id}` : id
}

// ============================================================================
// Screen Reader Announcer Hook
// ============================================================================

/**
 * Hook for announcing messages to screen readers
 * 
 * @example
 * const announce = useAnnounce()
 * announce('Form submitted successfully', 'polite')
 */
export function useAnnounce() {
  const [message, setMessage] = React.useState('')
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>('polite')

  const announce = React.useCallback((
    newMessage: string, 
    newPoliteness: 'polite' | 'assertive' = 'polite'
  ) => {
    setPoliteness(newPoliteness)
    // Clear and reset to trigger announcement
    setMessage('')
    requestAnimationFrame(() => {
      setMessage(newMessage)
    })
  }, [])

  const AnnouncerComponent = React.useCallback(() => (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  ), [message, politeness])

  return { announce, AnnouncerComponent }
}
