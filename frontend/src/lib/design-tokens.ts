/**
 * Task 1.1.1.17a: Design System Tokens
 * 
 * TypeScript definitions for all design system tokens.
 * These match the CSS custom properties in globals.css.
 * 
 * @see docs/02-architecture/frontend/design-system.md
 */

// ============================================================================
// Color Tokens
// ============================================================================

export const colors = {
  // Primary - MOH Blue (Trust, Authority)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base primary
    600: '#2563eb',  // Hover states
    700: '#1d4ed8',  // Active states
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary - Professional Gray
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const

// ============================================================================
// Status Colors (Task 1.1.1.17e)
// ============================================================================

export const statusColors = {
  // Workflow Status
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  under_review: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  tier2_verified: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  tier1_approved: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  
  // Entity Status
  active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
  suspended: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  
  // Special Status
  critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  standard: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  
  // Breach Status
  detected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  analyzing: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  
  // Export Status
  auto_approval_queue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  authorized: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
} as const

export type StatusType = keyof typeof statusColors

// ============================================================================
// Typography Tokens
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

// ============================================================================
// Spacing Tokens
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const

// ============================================================================
// Border Radius Tokens
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// ============================================================================
// Shadow Tokens
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const

// ============================================================================
// Breakpoint Tokens
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// Z-Index Tokens
// ============================================================================

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
} as const

// ============================================================================
// Animation Tokens
// ============================================================================

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// Icon Size Tokens
// ============================================================================

export const iconSizes = {
  xs: '0.75rem',   // 12px
  sm: '1rem',      // 16px
  md: '1.25rem',   // 20px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
} as const

// ============================================================================
// Export all tokens
// ============================================================================

export const designTokens = {
  colors,
  statusColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  animation,
  iconSizes,
} as const

export default designTokens
