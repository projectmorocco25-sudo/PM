# Authentication Wireframes

**Category:** Authentication  
**Priority:** 1 - Critical Foundation  
**Status:** ⚪ Not Started

## Wireframes

### Task 0.5.1.11: Login Page

**Route:** `/login`  
**File:** `task-0.5.1.11-login-page.png`

**Layout:**
- Centered form layout
- MOH logo at top
- Login form container (max-width ~400px)
- Links to forgot password and registration

**Components:**
- Email input field (required, type: email)
- Password input field (required, type: password, show/hide toggle)
- Remember me checkbox (optional)
- Login button (primary, full-width)
- "Forgot password?" link → `/forgot-password`
- "Register account" link → `/register`

**Annotations Required:**
- **Blue:** Click "Forgot password?" → Navigate to `/forgot-password`
- **Blue:** Click "Register account" → Navigate to `/register`
- **Blue:** Click "Log In" → Submit form, show loading state
- **Orange:** Email format validation, required field validation
- **Orange:** Error message display (e.g., "Invalid credentials")
- **Green:** Loading state (button spinner, disabled), Success redirect to `/dashboard`

**Design System References:**
- Input component (from UI Component Specifications)
- Button component (Primary variant)
- Form patterns (from Form Design Patterns)
- Colors: Primary blue for button, error red for validation

**Responsive:**
- Desktop: Centered form, max-width container
- Tablet: Form adjusts width, maintains centering
- Mobile: Full-width form, reduced padding (annotate)

---

**Related Documents:**
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md)
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md)
- [Design System](../../../../02-architecture/frontend/design-system.md)

