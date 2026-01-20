# Task 0.5.2.9: Product Create/Edit Form Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/products/new` (create) or `/rmm/products/[id]/edit` (edit) or `/rmm/companies/[id]/products/new` (company-scoped)  
**File:** `task-0.5.2.9-product-create-edit-form.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern form pattern for creating or editing product information with ATC code selection, validation, draft auto-save, and role-based access. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products > [New Product | Edit Product]       │
│                                                             │
│ Create Product                     [Save Draft] [Cancel]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Product Information                                       ││
│ │                                                          ││
│ │ Company *                                                ││
│ │ [ABC Pharmaceuticals Inc. ▼] (auto-filled for companies)││
│ │                                                          ││
│ │ Product Name *                                           ││
│ │ [____________________________________________]          ││
│ │                                                          ││
│ │ ATC Code *                                               ││
│ │ [Select ATC Code ▼]                                      ││
│ │ Search: [________________]                              ││
│ │                                                          ││
│ │ • N02BE01 - Paracetamol                                 ││
│ │ • M01AE01 - Ibuprofen                                   ││
│ │ • J01CA04 - Amoxicillin                                 ││
│ │                                                          ││
│ │ Selected: N02BE01 - Paracetamol                        ││
│ │                                                          ││
│ │ Description                                              ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │                                                     │ ││
│ │ │ [Enter product description...]                     │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Status                                                  ││
│ │ ☑ Active                                                ││
│ │ ☐ Inactive                                              ││
│ │                                                          ││
│ │ ℹ️ ATC codes are MOH-controlled and read-only.       ││
│ │    Select the appropriate ATC code for classification. ││
│ │                                                          ││
│ │ Regulatory Notice (Fatima's Requirement):               ││
│ │ • Product registrations are subject to DMP regulations ││
│ │ • All product data is retained for 7 years per         ││
│ │   regulatory requirements (Law No. 09-08)              ││
│ │ • [View Regulatory Framework]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Critical Medicine Designation (MOH Tier 1 Only)         ││
│ │                                                          ││
│ │ Critical Medicine                                       ││
│ │ ☐ Yes - This product is designated as a critical medicine││
│ │ ☐ No - This product is not a critical medicine          ││
│ │                                                          ││
│ │ ℹ️ Critical medicine designation is for MOH Tier 1    ││
│ │    only. This designation affects compliance monitoring.││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Metadata (Display Only - Edit Mode)                     ││
│ │                                                          ││
│ │ Created At: January 15, 2024 at 10:30 AM                ││
│ │ Created By: Company Admin - John Doe                    ││
│ │ Last Updated: January 20, 2024 at 2:45 PM              ││
│ │ Updated By: Company Admin - John Doe                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Draft Auto-Save Indicator                               ││
│ │                                                          ││
│ │ 💾 Draft saved automatically - Last saved: 2 minutes ago││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                                                             │
│ [Cancel]                          [Save Draft] [Create Product]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Products > New Product" or "Home > RMM > Products > Edit Product" or "Home > RMM > Companies > [Company Name] > Products > New Product"
- **Title:** "Create Product" (new) or "Edit Product" (edit)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Cancel Button:** Secondary button (navigate back)
  - **Create Button:** Primary button (new mode, disabled until all required fields valid)
  - **Update Button:** Primary button (edit mode, disabled until all required fields valid)

### Product Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Company:**
     - **Type:** Dropdown/select (MOH) or read-only display (Company users)
     - **Required:** Yes (marked with *)
     - **Default:** Auto-filled from user's company (Company users)
     - **MOH Users:** Can select any company
     - **Company Users:** Read-only, shows their company
     - **Validation:** Must select a company (MOH) or must be user's company (Company)
  
  2. **Product Name:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter product name..."
     - **Validation:** Required, min 2 characters, max 200 characters
     - **Error Message:** "Product name is required" or "Product name must be between 2 and 200 characters"
  
  3. **ATC Code:**
     - **Type:** Searchable dropdown/combobox
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Select ATC Code..."
     - **Search:** Real-time search as user types
     - **Display Format:** "Code - Description" (e.g., "N02BE01 - Paracetamol")
     - **Source:** From ATC codes table (MOH-controlled, read-only)
     - **Validation:** Required, must select from available ATC codes
     - **Error Message:** "ATC code is required" or "Please select a valid ATC code"
     - **Helper Text:** "ATC codes are MOH-controlled and read-only. Select the appropriate ATC code for classification."
     - **Info Icon:** ℹ️ icon with tooltip explaining ATC code classification
  
  4. **Description:**
     - **Type:** Textarea
     - **Required:** No (optional)
     - **Placeholder:** "Enter product description..."
     - **Height:** Auto (min 80px, max 200px)
     - **Resizable:** Yes (vertical)
     - **Validation:** Max 1000 characters
     - **Error Message:** "Description must not exceed 1000 characters"
  
  5. **Status:**
     - **Type:** Checkbox or toggle
     - **Required:** No
     - **Default:** Active (checked)
     - **Options:**
       - Active
       - Inactive
     - **Note:** Only MOH users can change status for all companies. Company users can only change status for their own products.

### Critical Medicine Designation Section (MOH Tier 1 Only)
- **Layout:** Card with form fields
- **Displayed When:** MOH Tier 1 role only
- **Hidden For:** Company users, MOH Tier 2 (read-only in detail view)
- **Fields:**
  1. **Critical Medicine:**
     - **Type:** Radio buttons or toggle
     - **Required:** No
     - **Default:** No (unchecked)
     - **Options:**
       - Yes - This product is designated as a critical medicine
       - No - This product is not a critical medicine
     - **Validation:** Optional (no validation required)
     - **Helper Text:** "Critical medicine designation is for MOH Tier 1 only. This designation affects compliance monitoring."
     - **Info Icon:** ℹ️ icon with tooltip explaining critical medicine designation

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
     - **Text:** "Create Product" (new mode) or "Update Product" (edit mode)
     - **Action:** Submit form (create or update product)
     - **Disabled:** Until all required fields valid
     - **Loading State:** Show spinner when submitting
     - **Confirmation:** Show confirmation modal before create (optional)

---

## Role-Based Access

### Company Users
- **Create:** Can create products for their own company
- **Edit:** Can edit products for their own company
- **Company Field:** Read-only, auto-filled with their company
- **Critical Medicine:** Not visible (cannot designate)
- **Status Change:** Can change status for own company products only

### MOH Tier 1
- **Create:** Can create products for any company (full access)
- **Edit:** Can edit all products (full access)
- **Company Field:** Can select any company
- **Critical Medicine:** Can designate products as critical medicines
- **Status Change:** Can change status for all products

### MOH Tier 2
- **Create:** Can create products for any company (limited access)
- **Edit:** Can edit products (limited access)
- **Company Field:** Can select any company
- **Critical Medicine:** Not visible (cannot designate, read-only in detail view)
- **Status Change:** Can change status (limited)

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
1. **Company:**
   - Required
   - Must select a company (MOH) or must be user's company (Company)

2. **Product Name:**
   - Required
   - Min length: 2 characters
   - Max length: 200 characters
   - Cannot be empty or whitespace only

3. **ATC Code:**
   - Required (must select one)
   - Must be from available ATC codes list
   - Cannot be empty

4. **Description:**
   - Optional (not required)
   - Max length: 1000 characters

5. **Status:**
   - Optional (defaults to Active)
   - Boolean (Active/Inactive)

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
- **Key:** `product_form_draft_[id]` (edit mode) or `product_form_draft_new` (create mode)
- **Expiry:** Draft expires after 7 days (optional cleanup)

---

## State Variations

### New Product (Empty)
- **Form:** All fields empty
- **Company:** Auto-filled for company users, dropdown for MOH
- **ATC Code:** Not selected (must select)
- **Status:** Active (checked by default)
- **Critical Medicine:** No (unchecked) - MOH Tier 1 only
- **Metadata Section:** Hidden
- **Submit Button:** "Create Product" (disabled until valid)

### New Product (Draft)
- **Form:** Partially filled with draft data
- **Auto-Save Indicator:** Shows draft saved message
- **Validation:** Shows validation errors for incomplete required fields
- **Submit Button:** Disabled until all required fields valid

### New Product (Complete)
- **Form:** All required fields filled and valid
- **Validation:** All validations pass
- **Submit Button:** "Create Product" (enabled)
- **Auto-Save Indicator:** Still shows (draft exists)

### Edit Product (Loaded)
- **Form:** Pre-filled with existing product data
- **Company:** Read-only (shows current company, cannot change)
- **Critical Medicine:** Shows current designation (MOH Tier 1 only)
- **Metadata Section:** Visible with creation/update information
- **Status:** Can be changed (role-based)
- **Submit Button:** "Update Product" (disabled until changes made and valid)

### Edit Product (Dirty)
- **Form:** Has unsaved changes (form is dirty)
- **Auto-Save Indicator:** Shows draft saved message
- **Validation:** Shows validation errors if any
- **Submit Button:** "Update Product" (enabled if valid)

### Loading State
- **Skeleton:** Form skeleton with shimmer effect (loading existing product data)
- **Disable:** All fields disabled during load
- **Spinner:** Show loading spinner in submit button

### Error State
- **Network Error:** Show error message, allow retry
- **Validation Error:** Show inline errors, summary at top
- **Submit Error:** Show error message, allow retry
- **Auto-Save Error:** Show error in auto-save indicator, allow manual save

### Success State
- **Create Success:** Show success message, navigate to product detail page
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
- **Company Dropdown:** Select company (MOH users only)
- **ATC Code Search:** Open searchable dropdown/combobox
- **ATC Code Selection:** Select ATC code from list
- **Critical Medicine Toggle:** Toggle designation (MOH Tier 1 only)
- **Status Checkbox/Toggle:** Toggle active status
- **Save Draft:** Explicitly save draft
- **Cancel:** Navigate back (with unsaved changes warning)
- **Create/Update:** Submit form (with validation)

### Input Interactions
- **Text Inputs:**
  - Real-time validation on blur
  - Debounced auto-save (2 seconds after typing stops)
- **Textarea:**
  - Auto-resize (min/max height)
  - Character count (if max length specified)
- **ATC Code Search:**
  - Real-time search as user types
  - Filter available ATC codes
  - Display format: "Code - Description"
  - Keyboard navigation (arrow keys to select, Enter to confirm)

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
- **Textarea Component:** Description textarea (shadcn/ui textarea)
- **Select/Combobox Component:** Company and ATC code selection (shadcn/ui select or combobox)
- **Radio Group Component:** Critical medicine selection (shadcn/ui radio-group)
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
- **Async ATC Code Search:** Efficient search with debouncing
- **Lazy Loading:** Load product data on demand (edit mode)

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

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/rmm/products/new` or `/rmm/products/[id]/edit`
- [Database Schema](../../../../02-architecture/database/schema-design.md) - Products table structure
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, data entry patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [ATC Codes List](../task-0.5.2.14-atc-codes-list.md) - ATC codes reference

---

## Related Wireframes

- [Products List](task-0.5.2.4-products-list.md) - Products list page
- [Product Detail](task-0.5.2.5-product-detail.md) - Product detail page
- [Company Create/Edit Form](../companies/task-0.5.2.8-company-create-edit-form.md) - Company form pattern reference
- [ATC Codes List](../task-0.5.2.14-atc-codes-list.md) - ATC codes reference list

---

## ATC Code Selection Implementation Notes

### ATC Code Searchable Dropdown/Combobox
- **Search Functionality:** Real-time search as user types
- **Search Fields:** ATC code, description
- **Display Format:** "Code - Description" (e.g., "N02BE01 - Paracetamol")
- **Keyboard Navigation:** Arrow keys to navigate, Enter to select, Escape to close
- **Empty State:** "No ATC codes found" if search yields no results
- **Loading State:** Show spinner while loading ATC codes
- **Error State:** Show error message if ATC codes cannot be loaded

### ATC Code Data Source
- **Source:** `atc_codes` table (MOH-controlled, read-only)
- **Fields:** `code`, `description`
- **Filter:** Only active ATC codes shown (if `is_active = true`)
- **Caching:** Cache ATC codes list for performance

---

**Next:** [SKU Create/Edit Form](../skus/task-0.5.2.10-sku-create-edit-form.md)

