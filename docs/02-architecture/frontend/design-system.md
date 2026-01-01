# Design System - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive design system for the PM platform, including colors, typography, spacing, components, and visual guidelines.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

The PM platform design system is built on Tailwind CSS and shadcn/ui, providing a consistent, accessible, and maintainable UI foundation. The design system prioritizes clarity, regulatory compliance, and professional appearance suitable for government and pharmaceutical industry use.

## Design Principles

1. **Clarity First:** Information hierarchy and readability are paramount
2. **Regulatory Compliance:** Professional, trustworthy appearance
3. **Accessibility:** WCAG 2.1 AA compliance minimum
4. **Consistency:** Unified patterns across all modules
5. **Efficiency:** Streamlined workflows for frequent tasks
6. **Responsive:** Optimized for desktop and tablet devices

## Color System

### Primary Colors

```css
/* Primary - MOH Blue (Trust, Authority) */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Base primary */
--color-primary-600: #2563eb;  /* Hover states */
--color-primary-700: #1d4ed8;  /* Active states */
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;

/* Secondary - Professional Gray */
--color-secondary-50: #f9fafb;
--color-secondary-100: #f3f4f6;
--color-secondary-200: #e5e7eb;
--color-secondary-300: #d1d5db;
--color-secondary-400: #9ca3af;
--color-secondary-500: #6b7280;
--color-secondary-600: #4b5563;
--color-secondary-700: #374151;
--color-secondary-800: #1f2937;
--color-secondary-900: #111827;
```

### Semantic Colors

```css
/* Success - Green */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning - Amber */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Error - Red */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Info - Blue */
--color-info-50: #eff6ff;
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

### Status Colors

```css
/* Status Indicators */
--color-status-pending: #f59e0b;      /* Amber */
--color-status-approved: #22c55e;     /* Green */
--color-status-rejected: #ef4444;     /* Red */
--color-status-draft: #6b7280;        /* Gray */
--color-status-active: #22c55e;       /* Green */
--color-status-inactive: #9ca3af;     /* Light Gray */
--color-status-suspended: #dc2626;    /* Red */
--color-status-critical: #dc2626;     /* Red - Critical medicines */
```

### Background Colors

```css
/* Backgrounds */
--color-bg-primary: #ffffff;           /* White */
--color-bg-secondary: #f9fafb;        /* Light Gray */
--color-bg-tertiary: #f3f4f6;         /* Medium Gray */
--color-bg-overlay: rgba(0, 0, 0, 0.5); /* Modal overlay */

/* Surface Colors */
--color-surface-default: #ffffff;
--color-surface-elevated: #ffffff;
--color-surface-hover: #f9fafb;
--color-surface-active: #f3f4f6;
```

### Text Colors

```css
/* Text Colors */
--color-text-primary: #111827;         /* High contrast */
--color-text-secondary: #4b5563;      /* Medium contrast */
--color-text-tertiary: #9ca3af;       /* Low contrast */
--color-text-disabled: #d1d5db;       /* Disabled state */
--color-text-inverse: #ffffff;        /* On dark backgrounds */
--color-text-link: #2563eb;           /* Links */
--color-text-link-hover: #1d4ed8;     /* Link hover */
```

### Border Colors

```css
/* Borders */
--color-border-default: #e5e7eb;
--color-border-hover: #d1d5db;
--color-border-focus: #3b82f6;
--color-border-error: #ef4444;
--color-border-success: #22c55e;
```

## Typography

### Font Family

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Primary Font:** Inter (Google Fonts)  
**Monospace Font:** JetBrains Mono (for code, IDs, technical data)

### Font Sizes

```css
/* Font Sizes (rem) */
--font-size-xs: 0.75rem;    /* 12px - Labels, captions */
--font-size-sm: 0.875rem;   /* 14px - Secondary text */
--font-size-base: 1rem;     /* 16px - Body text */
--font-size-lg: 1.125rem;   /* 18px - Emphasized text */
--font-size-xl: 1.25rem;    /* 20px - Subheadings */
--font-size-2xl: 1.5rem;    /* 24px - Section headings */
--font-size-3xl: 1.875rem;  /* 30px - Page headings */
--font-size-4xl: 2.25rem;   /* 36px - Hero headings */
```

### Font Weights

```css
/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
/* Line Heights */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Typography Scale

| Element | Font Size | Weight | Line Height | Use Case |
|---------|-----------|--------|--------------|----------|
| Hero Heading | 2.25rem (36px) | 700 | 1.25 | Homepage hero |
| Page Heading | 1.875rem (30px) | 700 | 1.25 | Page titles |
| Section Heading | 1.5rem (24px) | 600 | 1.5 | Section titles |
| Subheading | 1.25rem (20px) | 600 | 1.5 | Card titles, subsections |
| Body Large | 1.125rem (18px) | 400 | 1.75 | Emphasized body text |
| Body | 1rem (16px) | 400 | 1.5 | Default body text |
| Body Small | 0.875rem (14px) | 400 | 1.5 | Secondary text, descriptions |
| Caption | 0.75rem (12px) | 400 | 1.5 | Labels, timestamps, metadata |

## Spacing System

### Spacing Scale (8px base unit)

```css
/* Spacing Scale */
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Spacing Usage

- **Component Internal:** 0.5rem - 1rem (8px - 16px)
- **Component External:** 1rem - 1.5rem (16px - 24px)
- **Section Spacing:** 2rem - 3rem (32px - 48px)
- **Page Spacing:** 3rem - 4rem (48px - 64px)

## Border Radius

```css
/* Border Radius */
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px - Small elements */
--radius-md: 0.375rem;   /* 6px - Default */
--radius-lg: 0.5rem;     /* 8px - Cards, panels */
--radius-xl: 0.75rem;    /* 12px - Large cards */
--radius-full: 9999px;   /* Pills, badges */
```

## Shadows

```css
/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

## Icons

### Icon Library

**Primary:** Lucide React (via shadcn/ui)  
**Alternative:** Heroicons (if needed)

### Icon Sizes

```css
/* Icon Sizes */
--icon-xs: 0.75rem;   /* 12px */
--icon-sm: 1rem;      /* 16px */
--icon-md: 1.25rem;   /* 20px */
--icon-lg: 1.5rem;    /* 24px */
--icon-xl: 2rem;       /* 32px */
```

### Icon Usage Guidelines

- **Inline with text:** 1rem (16px) - matches body text
- **Buttons:** 1.25rem (20px) - standard button icons
- **Cards/Headers:** 1.5rem (24px) - section icons
- **Empty states:** 2rem (32px) - prominent icons

## Breakpoints (Responsive Design)

```css
/* Breakpoints */
--breakpoint-sm: 640px;   /* Tablet portrait */
--breakpoint-md: 768px;   /* Tablet landscape */
--breakpoint-lg: 1024px;  /* Desktop small */
--breakpoint-xl: 1280px;  /* Desktop medium */
--breakpoint-2xl: 1536px; /* Desktop large */
```

### Device Support

- **Desktop:** Primary target (1024px+)
- **Tablet:** Supported (768px - 1024px)
- **Mobile:** Not officially supported (but responsive design should work)

## Z-Index Scale

```css
/* Z-Index Layers */
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## Animation & Transitions

### Transition Durations

```css
/* Transition Durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### Transition Easing

```css
/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions

- **Hover states:** 150ms ease-out
- **Focus states:** 150ms ease-out
- **Modal open/close:** 200ms ease-in-out
- **Page transitions:** 200ms ease-in-out

## Accessibility

### Color Contrast

- **Text on background:** Minimum 4.5:1 (WCAG AA)
- **Large text (18px+):** Minimum 3:1 (WCAG AA)
- **Interactive elements:** Minimum 3:1 (WCAG AA)
- **Focus indicators:** 2px solid outline, high contrast

### Focus Management

- **Focus visible:** Always show focus indicators
- **Focus order:** Logical tab order
- **Skip links:** Available for keyboard navigation
- **Focus trap:** In modals and dialogs

### Touch Targets

- **Minimum size:** 44px × 44px (iOS/Android standard)
- **Spacing:** Minimum 8px between touch targets

## Implementation

### Tailwind CSS Configuration

The design system is implemented via Tailwind CSS configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        secondary: { /* ... */ },
        success: { /* ... */ },
        warning: { /* ... */ },
        error: { /* ... */ },
        // ... other colors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // ... other theme extensions
    },
  },
}
```

### shadcn/ui Integration

Components from shadcn/ui are customized using CSS variables:

```css
:root {
  --primary: 59 130 246; /* rgb(59, 130, 246) */
  --primary-foreground: 255 255 255;
  /* ... other variables */
}
```

## Design Tokens

All design tokens are available as:
- **CSS Custom Properties** (for runtime theming)
- **Tailwind CSS Classes** (for utility-first styling)
- **TypeScript Types** (for type-safe usage)

## Usage Guidelines

1. **Consistency:** Always use design system tokens, never hardcode values
2. **Accessibility:** Verify color contrast and keyboard navigation
3. **Responsive:** Test on desktop and tablet breakpoints
4. **Performance:** Use CSS variables for dynamic theming
5. **Documentation:** Document any customizations or extensions

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inter Font](https://rsms.me/inter/)
- [Lucide Icons](https://lucide.dev/)

---

**Next Steps:**
1. Create component library structure
2. Implement base components using design tokens
3. Document component usage patterns
4. Create design system documentation site (optional)

