# Task 0.5.1.22: Profile Page Wireframe

**Status:** ✅ Complete  
**Route:** `/dashboard/profile` or `/profile`  
**File:** `task-0.5.1.22-profile-page.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform profile page with user information, account settings, password change, and preferences. Accessible, secure, and integrated with user menu. Modern enterprise pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Profile                                               │
│                                                             │
│  Profile                                                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌──────────┐                                      │   │
│  │  │          │                                      │   │
│  │  │  Avatar  │                                      │   │
│  │  │          │                                      │   │
│  │  │ [Upload] │                                      │   │
│  │  └──────────┘                                      │   │
│  │                                                     │   │
│  │  User Information                                  │   │
│  │                                                     │   │
│  │  Name *                                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ John Doe                                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Email *                                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ john.doe@company.com                        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Company                                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Company XYZ (Read-only)                     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Role                                               │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Company User (Read-only)                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Save Changes                      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Change Password                                    │   │
│  │                                                     │   │
│  │  Current Password *                                 │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ ••••••••••                          [👁]    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  New Password *                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ ••••••••••                          [👁]    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Confirm New Password *                             │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ ••••••••••                          [👁]    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Password Requirements:                             │   │
│  │  • At least 8 characters                            │   │
│  │  • One uppercase letter                             │   │
│  │  • One lowercase letter                             │   │
│  │  • One number                                       │   │
│  │  • One special character                            │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Update Password                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Preferences                                        │   │
│  │                                                     │   │
│  │  Language                                           │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [English]                            ▼      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Timezone                                           │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [UTC+01:00]                         ▼      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Email Notifications                                │   │
│  │  ☑ Receive email notifications                      │   │
│  │                                                     │   │
│  │  Notification Preferences                           │   │
│  │  ☑ Submission status updates                        │   │
│  │  ☑ Compliance alerts                                │   │
│  │  ☐ Enforcement actions                              │   │
│  │  ☑ System announcements                             │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Save Preferences                   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Account Actions                                    │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Export My Data                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Delete Account                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Profile"
- **Title:** "Profile"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### User Information Section
- **Max Width:** 600px (desktop), full width (mobile)
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Centered:** Yes (desktop)

**Avatar Section:**
- **Avatar Image:** Circular, ~120px diameter (desktop), ~80px (mobile)
- **Upload Button:** "Upload" button below avatar
  - **Variant:** Secondary
  - **Size:** Small
  - **Click Action:** Open file picker for image upload
- **Position:** Top of section, centered
- **Spacing:** 24px below avatar

**Form Fields:**
- **Name:** Required, text input, editable
- **Email:** Required, email input, editable (may require verification)
- **Company:** Read-only, text input (company users see their company)
- **Role:** Read-only, text input (user's role: Company User, MOH Tier 1, MOH Tier 2)

**Save Button:**
- **Text:** "Save Changes"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Loading State:** "Saving..."

### Change Password Section
- **Same styling as User Information Section**
- **Title:** "Change Password"
  - **Typography:** 24px, font-weight: 600, color: #111827

**Form Fields:**
- **Current Password:** Required, password input, show/hide toggle
- **New Password:** Required, password input, show/hide toggle, real-time validation
- **Confirm New Password:** Required, password input, show/hide toggle, must match new password

**Password Requirements Display:**
- Same as registration page
- Shows checkmarks/X marks as user types

**Update Button:**
- **Text:** "Update Password"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Disabled:** Until password requirements met and passwords match
- **Loading State:** "Updating..."

### Preferences Section
- **Same styling as User Information Section**
- **Title:** "Preferences"
  - **Typography:** 24px, font-weight: 600, color: #111827

**Language Select:**
- **Label:** "Language"
- **Dropdown:** Select component with language options
- **Default:** English (or user's preferred language)

**Timezone Select:**
- **Label:** "Timezone"
- **Dropdown:** Select component with timezone options
- **Default:** UTC+01:00 (or user's timezone)

**Email Notifications Checkbox:**
- **Label:** "Receive email notifications"
- **Default:** Checked
- **Typography:** 16px, color: #111827

**Notification Preferences:**
- **Title:** "Notification Preferences"
  - **Typography:** 18px, font-weight: 600, color: #111827
- **Checkboxes:**
  - Submission status updates (checked by default)
  - Compliance alerts (checked by default)
  - Enforcement actions (unchecked by default)
  - System announcements (checked by default)
- **Typography:** 16px, color: #111827

**Save Button:**
- **Text:** "Save Preferences"
- **Variant:** Primary
- **Width:** Full width
- **Height:** 40px
- **Loading State:** "Saving..."

### Account Actions Section
- **Same styling as User Information Section**
- **Title:** "Account Actions"
  - **Typography:** 24px, font-weight: 600, color: #111827

**Export My Data Button:**
- **Text:** "Export My Data"
- **Variant:** Secondary
- **Width:** Full width
- **Height:** 40px
- **Click Action:** Trigger data export (GDPR/CNDP right to data portability)
- **Loading State:** "Exporting..."

**Delete Account Button (ENHANCED):**
- **Text:** "Delete Account" or "Request Account Deactivation" (based on user role)
- **Variant:** Destructive (red)
- **Width:** Full width
- **Height:** 40px
- **Tooltip/Help Text (NEW):**
  - **For Company Users:** "Account deactivation requires MOH approval. Contact MOH support or request deactivation through your company administrator."
  - **For MOH Users:** "Account deactivation requires Tier 2 Officer request → Tier 1 approval → Tier 2 Registrar implementation. All deletions are kept for audit (7 years)."
- **Click Action:** Show confirmation modal with workflow explanation
- **Warning:** Must show confirmation with consequences
- **Workflow Explanation (NEW):**
  - **For Company Users:**
    - "Account deactivation is handled by MOH administrators"
    - "Contact MOH support for account deactivation requests"
    - "All account changes are logged for audit purposes"
  - **For MOH Users:**
    - "Account deactivation follows regulatory workflow:"
    - "1. Tier 2 Officer requests deactivation"
    - "2. Tier 1 approves and issues command"
    - "3. Tier 2 Registrar implements deactivation"
    - "All steps are logged and kept for audit (7 years)"
    - "⚠️ Note: User deletion/deactivation workflow is being finalized. This button may be disabled until workflow is documented."

---

## Annotations

### Blue (Interactions)
- **Click "Upload" avatar button** → Open file picker, upload avatar image
- **Click "Save Changes"** → Save user information updates
- **Click "Update Password"** → Update password (if current password correct)
- **Click "Save Preferences"** → Save preference changes
- **Click "Export My Data"** → Trigger data export download
- **Click "Delete Account"** → Show confirmation modal
- **Click show/hide password toggle** → Toggle password visibility
- **Select language/timezone** → Update preference
- **Toggle checkboxes** → Update notification preferences

### Orange (Validation)
- **Required field validation:** Show error if required field empty
- **Email format validation:** Show error if email format invalid
- **Email change:** May require email verification before change
- **Password strength validation:** Show requirements with checkmarks/X marks
- **Password match validation:** Show error if passwords don't match
- **Current password validation:** Show error if current password incorrect
- **File upload validation:** Show error if file too large or wrong format

### Green (States)
- **Loading state:** Buttons show spinner, disabled, text "Saving...", "Updating...", etc.
- **Success state:** Show success message (e.g., "Profile updated successfully")
- **Error state:** Show error message, form remains visible
- **Focus state:** Input border changes to primary blue
- **Disabled state:** Update password button disabled until requirements met
- **Saved state:** Show confirmation message after save

---

### Account Deactivation Confirmation Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Request Account Deactivation                   [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ ⚠️ WARNING: Account Deactivation                 │  │
│     │                                                   │  │
│     │ User: [User Name]                                 │  │
│     │ Email: [User Email]                               │  │
│     │ Role: [User Role]                                 │  │
│     │                                                   │  │
│     │ Workflow Information:                             │  │
│     │ • This request will be submitted to MOH           │  │
│     │ • Tier 2 Officer will review the request          │  │
│     │ • Tier 1 must approve before deactivation        │  │
│     │ • Tier 2 Registrar will implement deactivation   │  │
│     │                                                   │  │
│     │ Audit Information:                                │  │
│     │ • All account changes are logged                  │  │
│     │ • Account data retained for 7 years (audit)      │  │
│     │ • Soft delete (deactivation) - no hard delete   │  │
│     │                                                   │  │
│     │ Reason for Deactivation (Required):              │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Select Reason ▼]                             ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                          │  │
│     │ • User Request                                    │  │
│     │ • Role Change Required                            │  │
│     │ • Security Concern                                │  │
│     │ • Other                                           │  │
│     │                                                   │  │
│     │ Additional Notes (Optional):                      │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │                                                ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ I understand this action requires approval     │  │
│     │ ☑ I understand account data will be retained for audit│  │
│     │                                                   │  │
│     │                      [Cancel]  [Request Deactivation]│  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Component Specifications:**
- **Warning Section:** Red border, warning icon
- **Workflow Explanation:** Clear step-by-step workflow
- **Audit Information:** Emphasize audit trail and retention
- **Reason Selection:** Required dropdown
- **Confirmation Checkboxes:** Required before submission
- **Action Button:** "Request Deactivation" (orange/warning color)
- **Note:** This modal is shown for MOH users. Company users see different message directing them to contact MOH support.

**⚠️ IMPORTANT:** User deletion/deactivation workflow is not yet fully defined in the registry submission model. This wireframe reflects the intended workflow, but the actual implementation may vary based on the final workflow decision (see RMM-CRUD-DELETION-REVIEW.md Section 3.2).

---

## Responsive Behavior

### Desktop (1024px+)
- Sections: Max-width 600px, centered
- Avatar: Large size (~120px)
- Form fields: Full width within section
- Buttons: Full width

### Tablet (768px - 1023px)
- Sections: Full width minus 48px margins
- Avatar: Medium size (~100px)
- Form fields: Full width
- Buttons: Full width

### Mobile (<768px)
- Sections: Full width minus 32px margins
- Avatar: Small size (~80px)
- Form fields: Full width
- Buttons: Full width
- Typography: Smaller sizes

---

## Design System References

### Components Used
- **Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - States: Default, Focus, Error, Disabled (for read-only fields)
- **Select Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked
- **Button Component:** From UI Component Specifications
  - Variants: Primary, Secondary, Destructive
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Loading, Disabled
- **Avatar Component:** From UI Component Specifications
  - Size: Large (120px), Medium (100px), Small (80px)
  - Shape: Circular
- **File Input Component:** From UI Component Specifications
  - For avatar upload

### Colors
- **Background:** #ffffff (white)
- **Border:** #e5e7eb (gray-200)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Primary Button:** #3b82f6 (primary-500)
- **Destructive Button:** #ef4444 (error-500)
- **Error Border:** #ef4444 (error-500)
- **Error Text:** #ef4444 (error-500)
- **Success Border:** #10b981 (green-500)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 24px, font-weight: 600
- **Subsection Title:** 18px, font-weight: 600
- **Label:** 14px, font-weight: 500
- **Input Text:** 16px, color: #111827
- **Body Text:** 16px, color: #4b5563

### Spacing
- **Section Spacing:** 32px between sections
- **Section Padding:** 32px
- **Field Spacing:** 24px between fields
- **Button Spacing:** 24px above

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all form fields and buttons
- **Enter/Space:** Submit form when on button, toggle checkbox
- **Escape:** Clear focus or close modal (if open)

### Screen Reader Support
- **Form Labels:** Associated with inputs via `htmlFor`
- **Required Indicator:** Announced as "required"
- **Read-only Fields:** Announced as "read-only"
- **Error Messages:** Announced via ARIA live region
- **Success Messages:** Announced when save successful
- **Checkboxes:** Announced with descriptions

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** User Information → Password → Preferences → Account Actions

---

## Security Considerations

**Guidance from Fatima (MOH Regulatory Requirements):**
- Password change must require current password verification
- Email change may require email verification
- Data export must comply with GDPR/CNDP right to data portability
- Account deletion must be secure and require confirmation
- Read-only fields (company, role) cannot be modified by users

**Guidance from Dr. Samir (Business Process Validation):**
- Profile page should be clear and easy to use
- Preferences should be organized logically
- Account actions should be clearly separated and require confirmation
- Success/error messages should be clear and helpful

---

## Integration with User Menu

**User Menu Integration:**
- Profile page accessible from user menu in header
- User menu shows user name and avatar
- Clicking user menu → dropdown with "Profile" option
- Navigation: User Menu → Profile

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard/profile` or `/profile`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns and validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button, Checkbox, Select, Avatar components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Privacy Policy](../public-pages/task-0.5.1.8-privacy-policy.md) - Privacy Policy page (GDPR/CNDP rights)
- [Header Component](../layout-navigation/task-0.5.1.15-header-component.md) - User menu integration

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

