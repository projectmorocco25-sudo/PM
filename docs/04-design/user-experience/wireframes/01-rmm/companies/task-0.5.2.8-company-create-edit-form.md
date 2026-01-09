# Task 0.5.2.8: Company Create/Edit Form Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/companies/new` (create) or `/rmm/companies/[id]/edit` (edit)  
**File:** `task-0.5.2.8-company-create-edit-form.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern form pattern for creating or editing company information with validation, draft auto-save, and role-based access. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Companies > [New Company | Edit Company]     │
│                                                             │
│ Create Company                    [Save Draft] [Cancel]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Company Information                                       ││
│ │                                                          ││
│ │ Company Name *                                           ││
│ │ [____________________________________________]          ││
│ │                                                          ││
│ │ Registration Number *                                    ││
│ │ [____________________________________________]          ││
│ │ Format: REG-YYYY-NNNNN (e.g., REG-2024-001)            ││
│ │ ℹ️ Must match official registration documents           ││
│ │                                                          ││
│ │ Company Type *                                           ││
│ │ ○ IPC (Industrial Pharmaceutical Company)               ││
│ │ ○ Wholesaler                                            ││
│ │                                                          ││
│ │ Status                                                  ││
│ │ ☑ Active                                                ││
│ │ ☐ Inactive                                              ││
│ │                                                          ││
│ │ ℹ️ Company type cannot be changed after creation.      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Contact Information                                      ││
│ │                                                          ││
│ │ Address                                                 ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │                                                     │ ││
│ │ │ [Enter company address...]                         │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Tax ID                                                   ││
│ │ [____________________________________________]          ││
│ │                                                          ││
│ │ Email                                                   ││
│ │ [____________________________________________]          ││
│ │                                                          ││
│ │ Phone                                                   ││
│ │ [____________________________________________]          ││
│ │                                                          ││
│ │ ℹ️ At least one contact method (Email OR Phone) is     ││
│ │    required for regulatory communications               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Metadata (Display Only - Edit Mode)                     ││
│ │                                                          ││
│ │ Created At: January 15, 2024 at 10:30 AM                ││
│ │ Created By: MOH Tier 1 - Dr. Samir Hassan              ││
│ │ Last Updated: January 20, 2024 at 2:45 PM              ││
│ │ Updated By: MOH Tier 2 - Ahmed Benali                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Draft Auto-Save Indicator                               ││
│ │                                                          ││
│ │ 💾 Draft saved automatically - Last saved: 2 minutes ago││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                                                             │
│ [Cancel]                          [Save Draft] [Create Company]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Companies > New Company" or "Home > RMM > Companies > Edit Company"
- **Title:** "Create Company" (new) or "Edit Company" (edit)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Cancel Button:** Secondary button (navigate back)
  - **Create Button:** Primary button (new mode, disabled until all required fields valid)
  - **Update Button:** Primary button (edit mode, disabled until all required fields valid)

### Company Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Company Name:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter company name..."
     - **Validation:** Required, min 2 characters, max 200 characters
     - **Error Message:** "Company name is required" or "Company name must be between 2 and 200 characters"
  
  2. **Registration Number:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter registration number (e.g., REG-2024-001)..."
     - **Format:** REG-YYYY-NNNNN where:
       - REG: Literal prefix
       - YYYY: 4-digit year (e.g., 2024)
       - NNNNN: 3-5 digit sequential number (e.g., 001)
     - **Format Example:** REG-2024-001
     - **Format Validation:** Must match pattern `^REG-\d{4}-\d{3,5}$`
     - **Validation:** Required, unique, format validation
     - **Error Message:** 
       - "Registration number is required"
       - "Registration number already exists"
       - "Invalid format. Expected: REG-YYYY-NNNNN (e.g., REG-2024-001)"
     - **Helper Text:** "Format: REG-YYYY-NNNNN (e.g., REG-2024-001). Must match official registration documents."
     - **Uniqueness Check:** Real-time check on blur (async validation)
     - **Info Icon:** ℹ️ icon with tooltip explaining format
  
  3. **Company Type:**
     - **Type:** Radio buttons
     - **Required:** Yes (marked with *)
     - **Options:**
       - IPC (Industrial Pharmaceutical Company)
       - Wholesaler
     - **Default:** None (must select)
     - **Edit Mode:** Read-only (cannot change after creation) - shows current type as text
     - **Info Message:** "Company type cannot be changed after creation"
  
  4. **Status:**
     - **Type:** Checkbox or toggle
     - **Required:** No
     - **Default:** Active (checked)
     - **Options:**
       - Active
       - Inactive
     - **Note:** Only MOH users can change status

### Contact Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Address:**
     - **Type:** Textarea
     - **Required:** No
     - **Placeholder:** "Enter company address..."
     - **Height:** Auto (min 80px, max 200px)
     - **Resizable:** Yes (vertical)
     - **Validation:** Max 500 characters
     - **Error Message:** "Address must not exceed 500 characters"
  
  2. **Tax ID:**
     - **Type:** Text input
     - **Required:** No (optional)
     - **Placeholder:** "Enter tax identification number..."
     - **Validation:** Format validation (if provided, as per Moroccan tax ID requirements)
     - **Error Message:** "Please enter a valid tax ID format"
     - **Helper Text:** "Optional: Tax identification number for regulatory purposes"
  
  3. **Email:**
     - **Type:** Email input
     - **Required:** No (but at least one contact method required)
     - **Placeholder:** "Enter contact email..."
     - **Validation:** Valid email format if provided
     - **Error Message:** "Please enter a valid email address"
  
  4. **Phone:**
     - **Type:** Tel input
     - **Required:** No (but at least one contact method required)
     - **Placeholder:** "Enter contact phone (e.g., +212 5XX XXX XXX)..."
     - **Validation:** Valid phone format if provided (optional formatting)
     - **Error Message:** "Please enter a valid phone number"
     - **Format:** International format support (e.g., +212 5XX XXX XXX)
  
  **Contact Method Validation:**
  - **Rule:** At least one contact method (Email OR Phone) is required for regulatory communications
  - **Validation:** Check on submit - if both Email and Phone are empty, show error
  - **Error Message:** "At least one contact method (Email OR Phone) is required for regulatory communications"
  - **Warning Message:** "Warning: No contact information provided. Regulatory communications may be delayed." (if both empty but form still allows draft save)

### Metadata Section (Edit Mode Only)
- **Layout:** Card with read-only key-value pairs
- **Displayed When:** Edit mode (not shown in create mode)
- **Fields:**
  - **Created At:** Creation timestamp with formatted date/time
  - **Created By:** User who created (name and role)
  - **Last Updated:** Last update timestamp with formatted date/time
  - **Updated By:** User who last updated (name and role)
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 14px, color: #111827
  - **Background:** Light gray (#f9fafb) to indicate read-only

### Draft Auto-Save Indicator
- **Display:** Persistent indicator at bottom of form (when draft exists)
- **Visual:** Icon + text message
- **Content:**
  - "💾 Draft saved automatically - Last saved: [timestamp]"
  - Updates on successful auto-save
- **Styling:**
  - **Background:** Light blue (#eff6ff)
  - **Text:** Blue (#2563eb)
  - **Icon:** Save icon (💾 or icon component)
- **Behavior:**
  - Shows after first auto-save
  - Updates timestamp on each auto-save
  - Hides when form is submitted or cancelled
  - Shows error state if auto-save fails

### Action Buttons (Bottom)
- **Layout:** Right-aligned button group
- **Buttons:**
  1. **Cancel Button:**
     - **Style:** Secondary button
     - **Action:** Navigate back (with unsaved changes warning if form is dirty)
     - **Always Available:** Yes
  
  2. **Save Draft Button:**
     - **Style:** Secondary button
     - **Action:** Save form as draft (explicit save)
     - **Always Available:** Yes
     - **Loading State:** Show spinner when saving
  
  3. **Create/Update Button:**
     - **Style:** Primary button
     - **Text:** "Create Company" (new mode) or "Update Company" (edit mode)
     - **Action:** Submit form (create or update company)
     - **Disabled:** Until all required fields valid
     - **Loading State:** Show spinner when submitting
     - **Confirmation:** Show confirmation modal before create (optional)

---

## Role-Based Access

### Company Users
- **Create:** Cannot create companies (no access)
- **Edit:** Cannot edit companies (no access)
- **View:** Can only view their own company (read-only)

### MOH Tier 1
- **Create:** Can create companies (full access)
- **Edit:** Can edit all companies (full access)
- **Status Change:** Can change company status (active/inactive)

### MOH Tier 2
- **Create:** Can create companies (limited access)
- **Edit:** Can edit companies (limited access)
- **Status Change:** Cannot change company status (status field read-only)

---

## Validation

### Real-time Validation
- **Field-level:**
  - Red border if invalid
  - Green checkmark if valid (on blur)
  - Error message below field
- **Form-level:**
  - Validation summary at top (if multiple errors)
  - Submit button disabled until all validations pass

### Field Validation Rules
1. **Company Name:**
   - Required
   - Min length: 2 characters
   - Max length: 200 characters
   - Cannot be empty or whitespace only

2. **Registration Number:**
   - Required
   - Must be unique (async check on blur)
   - Format validation: Must match pattern `^REG-\d{4}-\d{3,5}$` (REG-YYYY-NNNNN)
   - Format example: REG-2024-001
   - Cannot be empty or whitespace only
   - Must match official registration documents

3. **Company Type:**
   - Required (must select one option)
   - Cannot be changed after creation (edit mode)

4. **Tax ID:**
   - Optional (not required)
   - Format validation (if provided, as per Moroccan tax ID requirements)
   - Max length: 50 characters

5. **Email:**
   - Optional (but at least one contact method required)
   - Valid email format if provided
   - Max length: 255 characters

6. **Phone:**
   - Optional (but at least one contact method required)
   - Valid phone format if provided (optional formatting)
   - International format support

7. **Address:**
   - Optional (not required)
   - Max length: 500 characters

8. **Contact Method:**
   - At least one contact method (Email OR Phone) required for regulatory communications
   - Validation: Check on submit - show error if both empty

### Validation Error Messages
- **Inline Errors:** Display below each field
- **Summary:** Display at top if multiple errors
- **ARIA:** Announce errors to screen readers
- **Color:** Red (#ef4444) for errors, green (#10b981) for valid

---

## Draft Auto-Save

### Auto-Save Behavior
- **Frequency:** Auto-save every 30 seconds (if form has unsaved changes)
- **Trigger:** After user stops typing for 2 seconds (debounced)
- **Draft Location:** Saved to server and local storage (backup)
- **Recovery:** Restore draft on page reload

### Auto-Save Indicator
- **Display:** Shows "Draft saved automatically - Last saved: [timestamp]"
- **Update:** Updates timestamp on each successful auto-save
- **Error State:** Shows error message if auto-save fails
- **Visual:** Icon + text message, subtle background color

### Draft Recovery
- **On Page Reload:** Automatically restore draft data
- **Confirmation:** Show message "Draft found. Restore draft?" if draft exists
- **Clear Draft:** Clear draft after successful submit or explicit cancel

### Local Storage Backup
- **Backup:** Cache draft in browser local storage
- **Key:** `company_form_draft_[id]` (edit mode) or `company_form_draft_new` (create mode)
- **Expiry:** Draft expires after 7 days (optional cleanup)

---

## State Variations

### New Company (Empty)
- **Form:** All fields empty
- **Company Type:** Not selected (must select)
- **Status:** Active (checked by default)
- **Metadata Section:** Hidden
- **Submit Button:** "Create Company" (disabled until valid)

### New Company (Draft)
- **Form:** Partially filled with draft data
- **Auto-Save Indicator:** Shows draft saved message
- **Validation:** Shows validation errors for incomplete required fields
- **Submit Button:** Disabled until all required fields valid

### New Company (Complete)
- **Form:** All required fields filled and valid
- **Validation:** All validations pass
- **Submit Button:** "Create Company" (enabled)
- **Auto-Save Indicator:** Still shows (draft exists)

### Edit Company (Loaded)
- **Form:** Pre-filled with existing company data
- **Company Type:** Read-only (shows current type, cannot change)
- **Metadata Section:** Visible with creation/update information
- **Status:** Can be changed (MOH Tier 1) or read-only (MOH Tier 2)
- **Submit Button:** "Update Company" (disabled until changes made and valid)

### Edit Company (Dirty)
- **Form:** Has unsaved changes (form is dirty)
- **Auto-Save Indicator:** Shows draft saved message
- **Validation:** Shows validation errors if any
- **Submit Button:** "Update Company" (enabled if valid)

### Loading State
- **Skeleton:** Form skeleton with shimmer effect (loading existing company data)
- **Disable:** All fields disabled during load
- **Spinner:** Show loading spinner in submit button

### Error State
- **Network Error:** Show error message, allow retry
- **Validation Error:** Show inline errors, summary at top
- **Submit Error:** Show error message, allow retry
- **Auto-Save Error:** Show error in auto-save indicator, allow manual save

### Success State
- **Create Success:** Show success message, navigate to company detail page
- **Update Success:** Show success message, refresh form with updated data
- **Draft Saved:** Show "Draft saved" notification (toast)

---

## Responsive Design

### Desktop (≥1024px)
- **Form Width:** Max-width 800px, centered
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned
- **Metadata Section:** Full width

### Tablet (768px - 1023px)
- **Form Width:** Full width minus 32px margin
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned or stacked
- **Metadata Section:** Full width

### Mobile (<768px)
- **Form Width:** Full width minus 16px margin
- **Full Layout:** All sections visible, stacked vertically
- **Action Buttons:** Full width, stacked vertically
- **Radio Buttons:** Stacked vertically
- **Metadata Section:** Full width

---

## Interactions

### Click Actions
- **Company Type Radio:** Select company type
- **Status Checkbox/Toggle:** Toggle active status
- **Save Draft:** Explicitly save draft
- **Cancel:** Navigate back (with unsaved changes warning)
- **Create/Update:** Submit form (with validation)

### Input Interactions
- **Text Inputs:**
  - Real-time validation on blur
  - Debounced auto-save (2 seconds after typing stops)
  - Format on blur (phone number, email)
- **Textarea:**
  - Auto-resize (min/max height)
  - Character count (if max length specified)
- **Email Input:**
  - Email format validation
  - Auto-format (lowercase)
- **Phone Input:**
  - Phone format validation (optional formatting)
  - International format support

### Keyboard Navigation
- **Tab:** Navigate through fields
- **Enter:** Move to next field or submit (if all valid)
- **Escape:** Cancel form (with unsaved changes warning)

### Unsaved Changes Warning
- **Trigger:** User tries to navigate away with unsaved changes
- **Message:** "You have unsaved changes. Are you sure you want to leave?"
- **Actions:** "Stay" (cancel navigation) or "Leave" (discard changes)

---

## Design System References

### Components Used
- **Form Component:** Form container (shadcn/ui form)
- **Input Component:** Text inputs (shadcn/ui input)
- **Textarea Component:** Address textarea (shadcn/ui textarea)
- **Radio Group Component:** Company type selection (shadcn/ui radio-group)
- **Checkbox Component:** Status checkbox (shadcn/ui checkbox)
- **Button Component:** Action buttons (shadcn/ui button)
- **Card Component:** Form sections (shadcn/ui card)
- **Alert Component:** Validation messages, auto-save indicator (shadcn/ui alert)
- **Badge Component:** Status badges (shadcn/ui badge)
- **Icon Component:** Icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional form patterns
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern data entry, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Input Border:** #d1d5db (border-default) - Default state
- **Input Border Focus:** #3b82f6 (primary-500) - Focus state
- **Input Border Error:** #ef4444 (error-500) - Error state
- **Input Border Valid:** #10b981 (success-500) - Valid state
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Auto-Save Background:** #eff6ff (blue-50) - Light blue
- **Auto-Save Text:** #2563eb (blue-600) - Blue text

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600, color: #111827
- **Input Text:** 14px, font-weight: 400
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Required Indicator:** Asterisk (*) in red (#ef4444)
- **Validation Message:** 12px, font-weight: 400, color: #ef4444
- **Button Text:** 14px, font-weight: 500
- **Auto-Save Text:** 12px, font-weight: 400, color: #2563eb

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 24px (3 × 8px) between sections
- **Field Spacing:** 16px (2 × 8px) between fields
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Spacing:** 16px (2 × 8px) between buttons

### Transitions & Animations
- **Input Focus:** 200ms ease-in-out
- **Validation State Change:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Auto-Save Indicator:** Fade in/out animation (300ms)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Debounced Validation:** Debounce validation checks (300ms)
- **Debounced Auto-Save:** Debounce auto-save (2 seconds after typing stops)
- **Async Validation:** Registration number uniqueness check on blur (not on every keystroke)
- **Lazy Loading:** Load company data on demand (edit mode)

### State Management
- **Form State:** Track all input values, validation status, dirty state
- **Draft State:** Save draft to local storage and server
- **Validation State:** Track field-level and form-level validation
- **Auto-Save State:** Track auto-save status (saving, saved, error)

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **Network Errors:** Graceful handling of save/submit failures
- **Retry Logic:** Automatic retry for failed saves with exponential backoff
- **Offline Support:** Queue auto-saves if offline, sync when online

### Data Persistence
- **Draft Auto-Save:** Save draft automatically every 30 seconds (if form has changes)
- **Local Storage:** Cache draft in local storage as backup
- **Server Sync:** Sync draft with server on save
- **Recovery:** Restore draft on page reload

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/rmm/companies/new` or `/rmm/companies/[id]/edit`
- [Database Schema](../../../../02-architecture/database/schema-design.md) - Companies table structure
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, data entry patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Companies List](task-0.5.2.2-companies-list.md) - Companies list page
- [Company Detail](task-0.5.2.3-company-detail.md) - Company detail page
- [RMM Overview](../overview/task-0.5.2.1-rmm-overview.md) - RMM module overview

---

**Next:** [Companies List](task-0.5.2.2-companies-list.md)

