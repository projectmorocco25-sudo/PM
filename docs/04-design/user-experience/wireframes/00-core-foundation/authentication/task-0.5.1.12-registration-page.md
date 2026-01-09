# Task 0.5.1.12: Registration Page Wireframe

**Status:** ✅ Complete  
**Route:** `/register`  
**File:** `task-0.5.1.12-registration-page.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform registration page with form fields, validation indicators, and terms acceptance. Accessible, secure, and regulatory-compliant.

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
│                    │  Create Account    │                     │
│                    │                     │                     │
│                    │  Company Name *    │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │               │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Company Email *   │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │               │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Contact Person *  │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │               │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Password *        │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │ ••••••••••    │ │ [👁]                │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Confirm Password *│                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │ ••••••••••    │ │ [👁]                │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Password Requirements:                   │
│                    │  • At least 8 characters                  │
│                    │  • One uppercase letter                   │
│                    │  • One lowercase letter                   │
│                    │  • One number                             │
│                    │  • One special character                  │
│                    │                     │                     │
│                    │  ☐ I agree to the Terms of Service       │
│                    │     and Privacy Policy                   │
│                    │                     │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │   Register    │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Already have an account?                │
│                    │  [Log In]                                │
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
  - **Click Action:** Navigate to `/` (homepage) or browser back
  - **Typography:** 14px, font-weight: 500
- **MOH Logo:** Centered, top of page
- **Size:** ~120px width
- **Position:** Centered horizontally, ~80px from top

### Registration Form Container
- **Width:** Max-width 480px
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb (light gray)
- **Border Radius:** 8px
- **Shadow:** Subtle shadow (elevation)
- **Padding:** 32px (24px on mobile)
- **Position:** Centered both horizontally and vertically

### Form Title
- **Text:** "Create Account"
- **Typography:** Heading (h2), 24px, font-weight: 600
- **Color:** #111827 (text-primary)
- **Spacing:** 24px below logo, 32px above form fields

### Form Fields

**Company Name Input:**
- **Label:** "Company Name" with required indicator (*)
- **Type:** text
- **Placeholder:** "Enter your company name"
- **Required:** Yes
- **Width:** Full width of container
- **Height:** 40px
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 6px
- **Padding:** 12px horizontal
- **Focus State:** Border color #3b82f6 (primary blue)
- **Error State:** Border color #ef4444 (error red), error message below

**Company Email Input:**
- **Label:** "Company Email" with required indicator (*)
- **Type:** email
- **Placeholder:** "your.company@example.com"
- **Required:** Yes
- **Validation:** Email format validation
- **Same styling as Company Name**

**Contact Person Input:**
- **Label:** "Contact Person" with required indicator (*)
- **Type:** text
- **Placeholder:** "Full name"
- **Required:** Yes
- **Same styling as Company Name**

**Password Input:**
- **Label:** "Password" with required indicator (*)
- **Type:** password
- **Placeholder:** "Enter your password"
- **Required:** Yes
- **Show/Hide Toggle:** Eye icon button on right side
- **Validation:** Real-time password strength validation
- **Same styling as Company Name**

**Confirm Password Input:**
- **Label:** "Confirm Password" with required indicator (*)
- **Type:** password
- **Placeholder:** "Confirm your password"
- **Required:** Yes
- **Show/Hide Toggle:** Eye icon button on right side
- **Validation:** Must match password field
- **Same styling as Company Name**

### Password Requirements Display
- **Background:** #f9fafb (light gray)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 6px
- **Padding:** 12px
- **List:** Bullet points showing requirements
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character
- **Validation Indicators:** Checkmarks (✓) or X marks (✗) next to each requirement as user types
- **Typography:** 14px, color: #4b5563

### Terms Acceptance Checkbox
- **Label:** "I agree to the Terms of Service and Privacy Policy"
- **Links:** "Terms of Service" and "Privacy Policy" are clickable links
- **Required:** Yes (must be checked to register)
- **Typography:** 14px, color: #111827
- **Link Color:** #2563eb (blue-600)
- **Spacing:** 24px below password fields

### Register Button
- **Text:** "Register"
- **Variant:** Primary (default)
- **Width:** Full width of container
- **Height:** 40px
- **Background:** #3b82f6 (primary-500)
- **Text Color:** White
- **Border Radius:** 6px
- **Spacing:** 24px below checkbox
- **Hover State:** Background #2563eb (primary-600)
- **Loading State:** Spinner icon, disabled, text "Registering..."
- **Disabled State:** Background #9ca3af, cursor not-allowed (disabled until all fields valid and terms accepted)

### Footer Link
- **Text:** "Already have an account? [Log In]"
- **Link:** Navigate to `/login`
- **Color:** #2563eb (text-link)
- **Position:** Centered, 16px below register button
- **Typography:** 14px

---

## Annotations

### Blue (Interactions)
- **Click "Back" button** → Navigate to `/` (homepage) or browser back
- **Click "Log In" link** → Navigate to `/login` page
- **Click "Register" button** → Submit form, show loading state, validate inputs
- **Click show/hide password toggle** → Toggle password visibility
- **Click Terms/Privacy links** → Navigate to respective legal pages
- **Click checkbox** → Toggle terms acceptance

### Orange (Validation)
- **Required field validation:** Show error if field empty (e.g., "Company Name is required")
- **Email format validation:** Show error if email format invalid (e.g., "Please enter a valid email address")
- **Password strength validation:** Show requirements with checkmarks/X marks as user types
- **Password match validation:** Show error if passwords don't match (e.g., "Passwords do not match")
- **Terms acceptance:** Register button disabled until checkbox checked
- **Real-time validation:** Validate as user types (for password, email, etc.)

### Green (States)
- **Loading state:** Button shows spinner icon, disabled, text "Registering..."
- **Success state:** Show success message, redirect to login or email verification page
- **Error state:** Error message displayed, form remains visible
- **Focus state:** Input border changes to primary blue (#3b82f6)
- **Hover state:** Button background darkens, links underline
- **Disabled state:** Register button disabled until all fields valid and terms accepted

---

## Responsive Behavior

### Desktop (1024px+)
- Form container: Max-width 480px, centered
- Padding: 32px
- Logo: Standard size

### Tablet (768px - 1023px)
- Form container: Max-width 480px, centered
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
- **Password Requirements:** 14px, color: #4b5563

### Spacing
- **Container Padding:** 32px (desktop), 24px (mobile)
- **Field Spacing:** 24px between fields
- **Button Spacing:** 24px above, 16px below
- **Link Spacing:** 16px below button

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move between form fields (company name → email → contact → password → confirm password → checkbox → button)
- **Enter/Space:** Submit form when on button, toggle checkbox
- **Escape:** Clear focus (if applicable)

### Screen Reader Support
- **Form Label:** Associated with input via `htmlFor`
- **Required Indicator:** Announced as "required" by screen reader
- **Error Messages:** Announced via ARIA live region
- **Password Requirements:** Announced when password field focused
- **Button:** Descriptive text "Register" (not just "Submit")
- **Checkbox:** Announced as "I agree to the Terms of Service and Privacy Policy"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Company name → Email → Contact → Password → Confirm Password → Checkbox → Button → Login link

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Registration must collect company information for regulatory compliance
- Terms of Service and Privacy Policy acceptance required
- Email verification may be required before account activation
- Contact person information required for MOH communication

**Guidance from Dr. Samir (Business Process Validation):**
- Registration form should be clear and easy to complete
- Password requirements should be clearly displayed
- Validation should be immediate and helpful
- Terms acceptance should be prominent

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/register`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns and validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button, Checkbox components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Terms of Service](../public-pages/task-0.5.1.7-terms-of-service.md) - Terms of Service page
- [Privacy Policy](../public-pages/task-0.5.1.8-privacy-policy.md) - Privacy Policy page

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

