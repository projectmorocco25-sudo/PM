# Task 0.5.1.11: Login Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/login`  
**File:** `task-0.5.1.11-login-page.png`  
**Priority:** 🔴 Critical Foundation

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back]                                                         │
│                                                                 │
│                    ┌─────────────────────┐                     │
│                    │                     │                     │
│                    │    [MOH Logo]       │                     │
│                    │                     │                     │
│                    └─────────────────────┘                     │
│                                                                 │
│                    ┌─────────────────────┐                     │
│                    │                     │                     │
│                    │  Login to PM       │                     │
│                    │                     │                     │
│                    │  Email *           │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │               │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Password *        │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │ ••••••••••    │ │ [👁]                │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  ☐ Remember me    │                     │
│                    │                     │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │   Log In      │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Forgot password? │                     │
│                    │  Register account │                     │
│                    │                     │                     │
│                    └─────────────────────┘                     │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Header Section
- **Back Button:**
  - **Position:** Top-left corner, 24px from top, 24px from left
  - **Icon:** Left arrow (←) or chevron left icon
  - **Text:** "Back" (optional, icon-only also acceptable)
  - **Style:** Text link or icon button
  - **Color:** #6b7280 (text-secondary) or #2563eb (text-link)
  - **Hover:** Underline (if text) or darker color
  - **Click Action:** Navigate to `/` (homepage) or browser back (if available)
  - **Typography:** 14px, font-weight: 500
  - **Spacing:** 24px from top and left edges
- **MOH Logo:** Centered, top of page
- **Size:** ~120px width (or appropriate logo size)
- **Position:** Centered horizontally, ~80px from top

### Login Form Container
- **Width:** Max-width 400px
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb (light gray)
- **Border Radius:** 8px
- **Shadow:** Subtle shadow (elevation)
- **Padding:** 32px (24px on mobile)
- **Position:** Centered both horizontally and vertically

### Form Title
- **Text:** "Login to PM" or "Sign In"
- **Typography:** Heading (h2), 24px, font-weight: 600
- **Color:** #111827 (text-primary)
- **Spacing:** 24px below logo, 32px above form fields

### Email Input Field
- **Label:** "Email" with required indicator (*)
- **Type:** email
- **Placeholder:** "your.email@example.com"
- **Required:** Yes (indicated by *)
- **Width:** Full width of container
- **Height:** 40px
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 6px
- **Padding:** 12px horizontal
- **Focus State:** Border color #3b82f6 (primary blue)
- **Error State:** Border color #ef4444 (error red), error message below

### Password Input Field
- **Label:** "Password" with required indicator (*)
- **Type:** password
- **Placeholder:** "Enter your password"
- **Required:** Yes
- **Show/Hide Toggle:** Eye icon button on right side of input
- **Width:** Full width of container
- **Height:** 40px
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 6px
- **Padding:** 12px horizontal, 12px right (space for toggle)
- **Focus State:** Border color #3b82f6
- **Error State:** Border color #ef4444, error message below

### Remember Me Checkbox
- **Label:** "Remember me"
- **Position:** Below password field
- **Optional:** Yes (no required indicator)
- **Spacing:** 16px below password field

### Login Button
- **Text:** "Log In"
- **Variant:** Primary (default)
- **Width:** Full width of container
- **Height:** 40px
- **Background:** #3b82f6 (primary-500)
- **Text Color:** White
- **Border Radius:** 6px
- **Spacing:** 24px below checkbox
- **Hover State:** Background #2563eb (primary-600)
- **Loading State:** Spinner icon, disabled, text "Logging in..."
- **Disabled State:** Background #9ca3af, cursor not-allowed

### Footer Links
- **Forgot Password Link:**
  - Text: "Forgot password?"
  - Link: `/forgot-password`
  - Color: #2563eb (text-link)
  - Position: Centered, 16px below login button
- **Register Account Link:**
  - Text: "Register account"
  - Link: `/register`
  - Color: #2563eb (text-link)
  - Position: Centered, 8px below forgot password link

---

## Annotations

### Blue (Interactions)
- **Click "Back" button** → Navigate to `/` (homepage) or browser back (if previous page exists)
- **Click "Forgot password?"** → Navigate to `/forgot-password` page
- **Click "Register account"** → Navigate to `/register` page
- **Click "Log In" button** → Submit form, show loading state, validate inputs
- **Click show/hide password toggle** → Toggle password visibility (show/hide)
- **Click "Remember me" checkbox** → Toggle remember me state

### Orange (Validation)
- **Email format validation:** Show error if email format invalid (e.g., "Please enter a valid email address")
- **Required field validation:** Show error if email or password empty (e.g., "Email is required")
- **Invalid credentials:** Show error message below form (e.g., "Invalid email or password")
- **Error message styling:** Red text (#ef4444), 14px, below input field or below form

### Green (States)
- **Loading state:** Button shows spinner icon, disabled, text changes to "Logging in..."
- **Success state:** Redirect to `/dashboard` after successful login
- **Error state:** Error message displayed, form remains visible
- **Focus state:** Input border changes to primary blue (#3b82f6)
- **Hover state:** Button background darkens, links underline

---

## Responsive Behavior

### Desktop (1024px+)
- Form container: Max-width 400px, centered
- Padding: 32px
- Logo: Standard size

### Tablet (768px - 1023px)
- Form container: Max-width 400px, centered
- Padding: 24px
- Logo: Standard size

### Mobile (<768px)
- Form container: Full width minus 32px margin (16px each side)
- Padding: 24px
- Logo: Slightly smaller
- Form fields: Full width
- Button: Full width

---

## Design System References

### Components Used
- **Back Button/Link Component:** Icon button or text link
  - Variant: Secondary/Text link
  - Icon: Left arrow (←) or chevron left
  - States: Default, Hover
- **Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - States: Default, Focus, Error
- **Button Component:** From UI Component Specifications
  - Variant: Default (Primary)
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Loading, Disabled
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked

### Colors
- **Back Button:** #6b7280 (text-secondary) or #2563eb (text-link)
- **Back Button Hover:** #111827 (text-primary) or #1d4ed8 (primary-700)
- **Primary Button:** #3b82f6 (primary-500)
- **Primary Button Hover:** #2563eb (primary-600)
- **Error Border:** #ef4444 (error-500)
- **Error Text:** #ef4444 (error-500)
- **Link Color:** #2563eb (text-link)
- **Border Default:** #e5e7eb (border-default)
- **Border Focus:** #3b82f6 (border-focus)

### Typography
- **Form Title:** 24px, font-weight: 600, color: #111827
- **Labels:** 14px, font-weight: 500, color: #111827
- **Input Text:** 16px, color: #111827
- **Link Text:** 14px, color: #2563eb
- **Error Text:** 14px, color: #ef4444

### Spacing
- **Container Padding:** 32px (desktop), 24px (mobile)
- **Field Spacing:** 24px between fields
- **Button Spacing:** 24px above, 16px below
- **Link Spacing:** 8px between links

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move between form fields (email → password → checkbox → button)
- **Enter/Space:** Submit form when on button, toggle checkbox
- **Escape:** Clear focus (if applicable)

### Screen Reader Support
- **Form Label:** Associated with input via `htmlFor`
- **Required Indicator:** Announced as "required" by screen reader
- **Error Messages:** Announced via ARIA live region
- **Button:** Descriptive text "Log In" (not just "Submit")

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Logical tab order (email → password → checkbox → button → links)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/login`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns and validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button, Checkbox components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review
