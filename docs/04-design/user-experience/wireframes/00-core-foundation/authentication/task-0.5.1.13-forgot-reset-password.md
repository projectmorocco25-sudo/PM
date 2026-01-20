# Task 0.5.1.13: Forgot Password / Reset Password Flow Wireframe

**Status:** ✅ Complete  
**Routes:** `/forgot-password`, `/reset-password`  
**File:** `task-0.5.1.13-forgot-reset-password.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform password reset flow with forgot password page, reset password page, and email confirmation. Accessible, secure, and user-friendly.

---

## Wireframe Layout - Forgot Password Page

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
│                    │  Forgot Password?  │                     │
│                    │                     │                     │
│                    │  Enter your email   │                     │
│                    │  address and we'll  │                     │
│                    │  send you a link    │                     │
│                    │  to reset your      │                     │
│                    │  password.          │                     │
│                    │                     │                     │
│                    │  Email *            │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │               │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  ┌───────────────┐ │                     │
│                    │  │ Send Reset    │ │                     │
│                    │  │ Link          │ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    │  Remember your     │                     │
│                    │  password?         │                     │
│                    │  [Log In]          │                     │
│                    │                     │                     │
│                    └─────────────────────┘                     │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Wireframe Layout - Reset Password Page

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
│                    │  Reset Password    │                     │
│                    │                     │                     │
│                    │  Enter your new     │                     │
│                    │  password below.    │                     │
│                    │                     │                     │
│                    │  New Password *     │                     │
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
│                    │  ┌───────────────┐ │                     │
│                    │  │ Reset Password│ │                     │
│                    │  └───────────────┘ │                     │
│                    │                     │                     │
│                    └─────────────────────┘                     │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Wireframe Layout - Email Confirmation (Success State)

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
│                    │  ✓ Email Sent       │                     │
│                    │                     │                     │
│                    │  We've sent a       │                     │
│                    │  password reset     │                     │
│                    │  link to your email │                     │
│                    │  address. Please    │                     │
│                    │  check your inbox   │                     │
│                    │  and follow the     │                     │
│                    │  instructions.      │                     │
│                    │                     │                     │
│                    │  If you don't       │                     │
│                    │  receive the email  │                     │
│                    │  within a few       │                     │
│                    │  minutes, please    │                     │
│                    │  check your spam    │                     │
│                    │  folder or try      │                     │
│                    │  again.             │                     │
│                    │                     │                     │
│                    │  Data Protection:   │                     │
│                    │  Password reset requests are processed   │
│                    │  per Law No. 09-08 (CNDP) data           │
│                    │  protection requirements.                 │
│                    │                     │                     │
│                    │  [Back to Login]    │                     │
│                    │                     │                     │
│                    └─────────────────────┘                     │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Forgot Password Page (`/forgot-password`)

**Header Section:**
- **Back Button:** Top-left, navigate to `/login` or `/`
- **MOH Logo:** Centered, top of page
- Same styling as login page

**Form Container:**
- **Width:** Max-width 400px
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Shadow:** Subtle shadow
- **Padding:** 32px (24px on mobile)
- **Position:** Centered

**Form Title:**
- **Text:** "Forgot Password?"
- **Typography:** 24px, font-weight: 600, color: #111827

**Instructions Text:**
- **Text:** "Enter your email address and we'll send you a link to reset your password."
- **Typography:** 16px, color: #4b5563
- **Spacing:** 16px below title, 24px above form

**Email Input Field:**
- **Label:** "Email" with required indicator (*)
- **Type:** email
- **Placeholder:** "your.email@example.com"
- **Required:** Yes
- **Same styling as login page**

**Send Reset Link Button:**
- **Text:** "Send Reset Link"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Same styling as login button**
- **Loading State:** "Sending..."

**Footer Link:**
- **Text:** "Remember your password? [Log In]"
- **Link:** Navigate to `/login`
- **Typography:** 14px, color: #6b7280
- **Link Color:** #2563eb

### Reset Password Page (`/reset-password?token=...`)

**Header Section:**
- Same as forgot password page

**Form Container:**
- **Width:** Max-width 480px (wider for password requirements)
- Same styling as forgot password page

**Form Title:**
- **Text:** "Reset Password"
- Same styling as forgot password title

**Instructions Text:**
- **Text:** "Enter your new password below."
- Same styling as forgot password instructions

**New Password Input:**
- **Label:** "New Password" with required indicator (*)
- **Type:** password
- **Placeholder:** "Enter your new password"
- **Required:** Yes
- **Show/Hide Toggle:** Eye icon button
- **Validation:** Real-time password strength validation
- Same styling as registration page

**Confirm Password Input:**
- **Label:** "Confirm Password" with required indicator (*)
- **Type:** password
- **Placeholder:** "Confirm your new password"
- **Required:** Yes
- **Show/Hide Toggle:** Eye icon button
- **Validation:** Must match new password
- Same styling as registration page

**Password Requirements Display:**
- Same as registration page
- Shows checkmarks/X marks as user types

**Reset Password Button:**
- **Text:** "Reset Password"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Disabled:** Until password requirements met and passwords match
- **Loading State:** "Resetting..."

### Email Confirmation (Success State)

**Success Container:**
- **Width:** Max-width 400px
- **Background:** White (#ffffff)
- **Border:** 1px solid #10b981 (green-500)
- **Border Radius:** 8px
- **Padding:** 32px
- **Position:** Centered

**Success Icon:**
- **Icon:** ✓ (checkmark) or success icon
- **Color:** #10b981 (green-500)
- **Size:** 48px
- **Position:** Centered, top of container

**Success Title:**
- **Text:** "Email Sent"
- **Typography:** 24px, font-weight: 600, color: #111827
- **Spacing:** 16px below icon

**Success Message:**
- **Text:** "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
- **Typography:** 16px, color: #4b5563, line-height: 1.6
- **Spacing:** 24px below title

**Additional Instructions:**
- **Text:** "If you don't receive the email within a few minutes, please check your spam folder or try again."
- **Typography:** 14px, color: #6b7280, italic
- **Spacing:** 16px below message

**Back to Login Button:**
- **Text:** "Back to Login"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Click Action:** Navigate to `/login`

---

## Annotations

### Blue (Interactions)
- **Click "Back" button** → Navigate to `/login` or `/`
- **Click "Send Reset Link"** → Submit email, show success state
- **Click "Reset Password"** → Submit new password, redirect to login
- **Click "Back to Login"** → Navigate to `/login`
- **Click "Log In" link** → Navigate to `/login`
- **Click show/hide password toggle** → Toggle password visibility

### Orange (Validation)
- **Email format validation:** Show error if email format invalid
- **Email not found:** Show error if email not registered
- **Password strength validation:** Show requirements with checkmarks/X marks
- **Password match validation:** Show error if passwords don't match
- **Token validation:** Show error if reset token invalid or expired

### Green (States)
- **Loading state:** Button shows spinner, disabled, text "Sending..." or "Resetting..."
- **Success state (forgot password):** Show email confirmation message
- **Success state (reset password):** Redirect to login with success message
- **Error state:** Show error message, form remains visible
- **Focus state:** Input border changes to primary blue
- **Disabled state:** Reset password button disabled until requirements met

---

## Responsive Behavior

### Desktop (1024px+)
- Form container: Max-width 400px (forgot) or 480px (reset), centered
- Padding: 32px
- Logo: Standard size

### Tablet (768px - 1023px)
- Form container: Max-width 400px (forgot) or 480px (reset), centered
- Padding: 24px
- Logo: Standard size

### Mobile (<768px)
- Form container: Full width minus 32px margin
- Padding: 24px
- Logo: Slightly smaller
- Form fields: Full width
- Button: Full width

---

## Design System References

### Components Used
- **Back Button/Link Component:** Icon button or text link
- **Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - States: Default, Focus, Error
- **Button Component:** From UI Component Specifications
  - Variant: Primary
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Loading, Disabled

### Colors
- **Primary Button:** #3b82f6 (primary-500)
- **Primary Button Hover:** #2563eb (primary-600)
- **Success Border:** #10b981 (green-500)
- **Success Icon:** #10b981 (green-500)
- **Error Border:** #ef4444 (error-500)
- **Error Text:** #ef4444 (error-500)
- **Link Color:** #2563eb (text-link)

### Typography
- **Form Title:** 24px, font-weight: 600, color: #111827
- **Instructions:** 16px, color: #4b5563
- **Success Title:** 24px, font-weight: 600, color: #111827
- **Success Message:** 16px, color: #4b5563, line-height: 1.6

### Spacing
- **Container Padding:** 32px (desktop), 24px (mobile)
- **Field Spacing:** 24px between fields
- **Button Spacing:** 24px above
- **Section Spacing:** 16px-24px between elements

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through form fields and buttons
- **Enter/Space:** Submit form when on button
- **Escape:** Clear focus or navigate back

### Screen Reader Support
- **Form Labels:** Associated with inputs via `htmlFor`
- **Required Indicator:** Announced as "required"
- **Error Messages:** Announced via ARIA live region
- **Success Message:** Announced when email sent or password reset
- **Password Requirements:** Announced when password field focused

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Email → Button (forgot password) or New Password → Confirm Password → Button (reset password)

---

## Security Considerations

**Guidance from Fatima (MOH Regulatory Requirements):**
- Password reset tokens must expire (e.g., 1 hour)
- Tokens must be single-use only
- Email verification required before password reset
- Password requirements must meet security standards

**Guidance from Dr. Samir (Business Process Validation):**
- Password reset flow should be clear and easy to follow
- Success messages should provide clear next steps
- Error messages should be helpful and not reveal sensitive information

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Routes: `/forgot-password`, `/reset-password`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns and validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

