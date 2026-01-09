# Task 0.5.2.10: SKU Create/Edit Form Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/products/[id]/skus/new` (create) or `/rmm/skus/[id]/edit` (edit)  
**File:** `task-0.5.2.10-sku-create-edit-form.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern form pattern for creating or editing SKU information with pharmaceutical attributes (dosage_strength, dosage_form, pack_size, unit_of_measure), validation, draft auto-save, and role-based access. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products > Paracetamol > SKUs > [New SKU | Edit SKU]│
│                                                             │
│ Create SKU                        [Save Draft] [Cancel]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SKU Basic Information                                    ││
│ │                                                          ││
│ │ Product *                                                ││
│ │ [Paracetamol ▼] (auto-filled if product-scoped)       ││
│ │                                                          ││
│ │ SKU Code *                                               ││
│ │ [____________________________________________]          ││
│ │ ℹ️ Company's internal SKU code/identifier              ││
│ │                                                          ││
│ │ SKU Name *                                               ││
│ │ [____________________________________________]          ││
│ │ ℹ️ Full SKU name (e.g., "Paracetamol 500mg Tablets 30-pack")││
│ │    This will be auto-generated from pharmaceutical      ││
│ │    attributes below if left empty.                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pharmaceutical Attributes *                              ││
│ │                                                          ││
│ │ Dosage Strength *                                        ││
│ │ [____________________________________________]          ││
│ │ Examples: 500mg, 10mg/ml, 250mg/5ml                    ││
│ │ ℹ️ Enter dosage/strength in pharmaceutical notation    ││
│ │                                                          ││
│ │ Dosage Form *                                            ││
│ │ [Select Form ▼]                                          ││
│ │                                                          ││
│ │ • Tablet                                                 ││
│ │ • Capsule                                                ││
│ │ • Syrup                                                  ││
│ │ • Injection                                              ││
│ │ • Cream                                                  ││
│ │ • Ointment                                               ││
│ │ • Drops                                                  ││
│ │ • Spray                                                  ││
│ │                                                          ││
│ │ Selected: Tablet                                         ││
│ │                                                          ││
│ │ Pack Size *                                              ││
│ │ [____________________________________________]          ││
│ │ Examples: 30 tablets, 100ml bottle, 50 capsules        ││
│ │ ℹ️ Enter pack size with quantity and description       ││
│ │                                                          ││
│ │ Unit of Measure *                                        ││
│ │ [Select Unit ▼]                                          ││
│ │                                                          ││
│ │ • tablets                                                ││
│ │ • ml                                                     ││
│ │ • capsules                                               ││
│ │ • vials                                                  ││
│ │ • boxes                                                  ││
│ │ • units                                                  ││
│ │ • grams                                                  ││
│ │                                                          ││
│ │ Selected: tablets                                        ││
│ │                                                          ││
│ │ ℹ️ Pharmaceutical attributes are critical for          ││
│ │    regulatory submissions (AAMS, MSQ, WSL).             ││
│ │    Submissions reference SKU_ID + Quantity.             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Additional Information                                   ││
│ │                                                          ││
│ │ ATC Code                                                 ││
│ │ [Inherited from Product: N02BE01] (read-only)          ││
│ │                                                          ││
│ │ MOH Authorized Unregistered                             ││
│ │ ☐ Yes - This SKU is MOH-authorized unregistered product││
│ │ ☐ No - This SKU is not MOH-authorized unregistered     ││
│ │                                                          ││
│ │ ℹ️ MOH authorized unregistered flag is for MOH Tier 1 ││
│ │    only. Indicates regulatory exception status.        ││
│ │                                                          ││
│ │ Status                                                  ││
│ │ ☑ Active                                                ││
│ │ ☐ Inactive                                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Preview: SKU Name (Auto-Generated)                      ││
│ │                                                          ││
│ │ [Product Name] [Dosage Strength] [Dosage Form] [Pack Size]││
│ │                                                          ││
│ │ Example: Paracetamol 500mg Tablet 30 tablets            ││
│ │                                                          ││
│ │ ℹ️ This preview updates as you enter pharmaceutical    ││
│ │    attributes. You can manually edit the SKU name.     ││
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
│ [Cancel]                          [Save Draft] [Create SKU]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Products > [Product Name] > SKUs > New SKU" or "Home > RMM > Products > [Product Name] > SKUs > Edit SKU"
- **Title:** "Create SKU" (new) or "Edit SKU" (edit)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Cancel Button:** Secondary button (navigate back)
  - **Create Button:** Primary button (new mode, disabled until all required fields valid)
  - **Update Button:** Primary button (edit mode, disabled until all required fields valid)

### SKU Basic Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Product:**
     - **Type:** Dropdown/select (MOH) or read-only display (if product-scoped)
     - **Required:** Yes (marked with *)
     - **Default:** Auto-filled if accessed from product detail page
     - **MOH Users:** Can select any product
     - **Company Users:** Can select products from their company only
     - **Validation:** Must select a product
     - **Error Message:** "Product is required"
  
  2. **SKU Code:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter SKU code..."
     - **Validation:** Required, min 1 character, max 50 characters
     - **Error Message:** "SKU code is required" or "SKU code must not exceed 50 characters"
     - **Helper Text:** "Company's internal SKU code/identifier"
     - **Uniqueness:** Should be unique per company (optional validation)
  
  3. **SKU Name:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter SKU name..." or "Auto-generated from attributes below"
     - **Auto-Generation:** Auto-generate from pharmaceutical attributes if empty
     - **Format:** "[Product Name] [Dosage Strength] [Dosage Form] [Pack Size]"
     - **Example:** "Paracetamol 500mg Tablet 30 tablets"
     - **Validation:** Required, min 5 characters, max 200 characters
     - **Error Message:** "SKU name is required" or "SKU name must be between 5 and 200 characters"
     - **Helper Text:** "Full SKU name. This will be auto-generated from pharmaceutical attributes below if left empty."
     - **Manual Override:** User can manually edit if needed

### Pharmaceutical Attributes Section
- **Layout:** Card with form fields (prominent display)
- **Title:** "Pharmaceutical Attributes *" (all required)
- **Fields:**
  1. **Dosage Strength:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter dosage strength (e.g., 500mg)..."
     - **Examples:** "500mg", "10mg/ml", "250mg/5ml", "0.5%"
     - **Validation:** 
       - Required
       - Must follow pharmaceutical notation standards
       - Format validation (regex pattern)
     - **Error Message:** "Dosage strength is required" or "Invalid dosage strength format"
     - **Helper Text:** "Enter dosage/strength in pharmaceutical notation"
     - **Info Icon:** ℹ️ icon with tooltip explaining pharmaceutical notation standards
  
  2. **Dosage Form:**
     - **Type:** Dropdown/select
     - **Required:** Yes (marked with *)
     - **Options:**
       - Tablet
       - Capsule
       - Syrup
       - Injection
       - Cream
       - Ointment
       - Drops
       - Spray
       - Suppository
       - Other (with text input for custom)
     - **Default:** None (must select)
     - **Validation:** Required, must select from list
     - **Error Message:** "Dosage form is required" or "Please select a valid dosage form"
     - **Helper Text:** "Select the pharmaceutical form"
  
  3. **Pack Size:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter pack size (e.g., 30 tablets)..."
     - **Examples:** "30 tablets", "100ml bottle", "50 capsules", "10 vials"
     - **Validation:**
       - Required
       - Must include quantity and description
       - Format validation (recommended pattern: "[number] [description]")
     - **Error Message:** "Pack size is required" or "Invalid pack size format"
     - **Helper Text:** "Enter pack size with quantity and description"
     - **Info Icon:** ℹ️ icon with tooltip explaining format
  
  4. **Unit of Measure:**
     - **Type:** Dropdown/select
     - **Required:** Yes (marked with *)
     - **Options:**
       - tablets
       - ml
       - capsules
       - vials
       - boxes
       - units
       - grams
       - mg
       - other (with text input for custom)
     - **Default:** None (must select)
     - **Validation:** Required, must select from list
     - **Error Message:** "Unit of measure is required" or "Please select a valid unit of measure"
     - **Helper Text:** "Select the unit of measure for quantities. Used in submissions (AAMS, MSQ, WSL)."
     - **Usage:** This unit is used when entering quantities in submissions
     - **Info Icon:** ℹ️ icon with tooltip explaining usage in submissions

**Pharmaceutical Attributes Help Text:**
- **Display:** Below the section title
- **Content:** "Pharmaceutical attributes are critical for regulatory submissions (AAMS, MSQ, WSL). Submissions reference SKU_ID + Quantity."
- **Styling:** Info text with background color (#eff6ff)

### SKU Name Auto-Generation
- **Trigger:** When pharmaceutical attributes are entered/changed
- **Format:** "[Product Name] [Dosage Strength] [Dosage Form] [Pack Size]"
- **Example:** "Paracetamol 500mg Tablet 30 tablets"
- **Display:** Preview section showing auto-generated name
- **Manual Override:** User can manually edit the SKU name field
- **Update:** Real-time preview updates as user enters attributes

### Preview Section (SKU Name Auto-Generated)
- **Layout:** Card showing preview of auto-generated SKU name
- **Display:** 
  - "Preview: SKU Name (Auto-Generated)"
  - Shows formatted preview: "[Product Name] [Dosage Strength] [Dosage Form] [Pack Size]"
  - Example display: "Paracetamol 500mg Tablet 30 tablets"
- **Update:** Real-time updates as pharmaceutical attributes change
- **Helper Text:** "This preview updates as you enter pharmaceutical attributes. You can manually edit the SKU name."
- **Styling:** 
  - **Background:** Light background (#f9fafb) to highlight preview
  - **Text:** Monospace or styled font for clarity

### Additional Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **ATC Code:**
     - **Type:** Read-only display
     - **Source:** Inherited from product's ATC code
     - **Display:** "Inherited from Product: [ATC Code]" or "No ATC code assigned to product"
     - **Styling:** Gray text to indicate read-only
  
  2. **MOH Authorized Unregistered:**
     - **Type:** Radio buttons or toggle
     - **Required:** No (optional)
     - **Default:** No (unchecked)
     - **Options:**
       - Yes - This SKU is MOH-authorized unregistered product
       - No - This SKU is not MOH-authorized unregistered
     - **Display:** MOH Tier 1 only (hidden for other roles or read-only)
     - **Validation:** Optional (no validation required)
     - **Helper Text:** "MOH authorized unregistered flag is for MOH Tier 1 only. Indicates regulatory exception status."
     - **Info Icon:** ℹ️ icon with tooltip explaining regulatory exception status
  
  3. **Status:**
     - **Type:** Checkbox or toggle
     - **Required:** No
     - **Default:** Active (checked)
     - **Options:**
       - Active
       - Inactive
     - **Note:** Only MOH users can change status for all companies. Company users can only change status for their own SKUs.

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
     - **Text:** "Create SKU" (new mode) or "Update SKU" (edit mode)
     - **Action:** Submit form (create or update SKU)
     - **Disabled:** Until all required fields valid
     - **Loading State:** Show spinner when submitting
     - **Confirmation:** Show confirmation modal before create (optional)

---

## Role-Based Access

### Company Users
- **Create:** Can create SKUs for their own company's products
- **Edit:** Can edit SKUs for their own company's products
- **Product Field:** Can select products from their company only
- **MOH Authorized Unregistered:** Not visible (cannot set, read-only in detail view)
- **Status Change:** Can change status for own company SKUs only

### MOH Tier 1
- **Create:** Can create SKUs for any product (full access)
- **Edit:** Can edit all SKUs (full access)
- **Product Field:** Can select any product
- **MOH Authorized Unregistered:** Can set/unset flag
- **Status Change:** Can change status for all SKUs

### MOH Tier 2
- **Create:** Can create SKUs for any product (limited access)
- **Edit:** Can edit SKUs (limited access)
- **Product Field:** Can select any product
- **MOH Authorized Unregistered:** Not visible (cannot set, read-only in detail view)
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
1. **Product:**
   - Required
   - Must select a product
   - Must be from user's company (Company users)

2. **SKU Code:**
   - Required
   - Min length: 1 character
   - Max length: 50 characters
   - Cannot be empty or whitespace only
   - Should be unique per company (optional validation)

3. **SKU Name:**
   - Required
   - Min length: 5 characters
   - Max length: 200 characters
   - Cannot be empty or whitespace only
   - Auto-generated if empty (from pharmaceutical attributes)

4. **Dosage Strength:**
   - Required
   - Must follow pharmaceutical notation standards
   - Format validation (regex pattern: supports mg, ml, %, ratios)
   - Examples: "500mg", "10mg/ml", "250mg/5ml", "0.5%"
   - Cannot be empty

5. **Dosage Form:**
   - Required (must select one)
   - Must be from predefined list
   - Cannot be empty

6. **Pack Size:**
   - Required
   - Must include quantity and description
   - Format validation (recommended: "[number] [description]")
   - Examples: "30 tablets", "100ml bottle", "50 capsules"
   - Cannot be empty

7. **Unit of Measure:**
   - Required (must select one)
   - Must be from predefined list
   - Cannot be empty

8. **Status:**
   - Optional (defaults to Active)
   - Boolean (Active/Inactive)

### Validation Error Messages
- **Inline Errors:** Display below each field
- **Summary:** Display at top if multiple errors
- **ARIA:** Announce errors to screen readers
- **Color:** Red (#ef4444) for errors, green (#10b981) for valid

### Pharmaceutical Attributes Validation
- **Combined Validation:** Ensure all pharmaceutical attributes are consistent
- **SKU Name Generation:** Validate that SKU name can be generated from attributes
- **Format Standards:** Ensure dosage strength follows pharmaceutical notation standards

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
- **Key:** `sku_form_draft_[id]` (edit mode) or `sku_form_draft_new` (create mode)
- **Expiry:** Draft expires after 7 days (optional cleanup)

---

## State Variations

### New SKU (Empty)
- **Form:** All fields empty
- **Product:** Auto-filled if product-scoped, dropdown if all products
- **SKU Name:** Empty (will auto-generate from pharmaceutical attributes)
- **Pharmaceutical Attributes:** All empty (must fill)
- **Status:** Active (checked by default)
- **MOH Authorized Unregistered:** No (unchecked) - MOH Tier 1 only
- **Metadata Section:** Hidden
- **Preview Section:** Shows placeholder or empty preview
- **Submit Button:** "Create SKU" (disabled until valid)

### New SKU (Draft)
- **Form:** Partially filled with draft data
- **Auto-Save Indicator:** Shows draft saved message
- **Preview Section:** Shows preview if pharmaceutical attributes filled
- **Validation:** Shows validation errors for incomplete required fields
- **Submit Button:** Disabled until all required fields valid

### New SKU (Complete)
- **Form:** All required fields filled and valid
- **Preview Section:** Shows final auto-generated SKU name
- **Validation:** All validations pass
- **Submit Button:** "Create SKU" (enabled)
- **Auto-Save Indicator:** Still shows (draft exists)

### Edit SKU (Loaded)
- **Form:** Pre-filled with existing SKU data
- **Product:** Read-only (shows current product, cannot change)
- **Pharmaceutical Attributes:** Pre-filled with current values
- **Preview Section:** Shows current SKU name
- **MOH Authorized Unregistered:** Shows current flag status (MOH Tier 1 only)
- **Metadata Section:** Visible with creation/update information
- **Status:** Can be changed (role-based)
- **Submit Button:** "Update SKU" (disabled until changes made and valid)

### Edit SKU (Dirty)
- **Form:** Has unsaved changes (form is dirty)
- **Auto-Save Indicator:** Shows draft saved message
- **Preview Section:** Updates preview if pharmaceutical attributes changed
- **Validation:** Shows validation errors if any
- **Submit Button:** "Update SKU" (enabled if valid)

### Loading State
- **Skeleton:** Form skeleton with shimmer effect (loading existing SKU data)
- **Disable:** All fields disabled during load
- **Spinner:** Show loading spinner in submit button

### Error State
- **Network Error:** Show error message, allow retry
- **Validation Error:** Show inline errors, summary at top
- **Submit Error:** Show error message, allow retry
- **Auto-Save Error:** Show error in auto-save indicator, allow manual save

### Success State
- **Create Success:** Show success message, navigate to SKU detail page
- **Update Success:** Show success message, refresh form with updated data
- **Draft Saved:** Show "Draft saved" notification (toast)

---

## Responsive Design

### Desktop (≥1024px)
- **Form Width:** Max-width 800px, centered
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned
- **Metadata Section:** Full width
- **Preview Section:** Full width

### Tablet (768px - 1023px)
- **Form Width:** Full width minus 32px margin
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned or stacked
- **Metadata Section:** Full width
- **Preview Section:** Full width

### Mobile (<768px)
- **Form Width:** Full width minus 16px margin
- **Full Layout:** All sections visible, stacked vertically
- **Action Buttons:** Full width, stacked vertically
- **Radio Buttons:** Stacked vertically
- **Metadata Section:** Full width
- **Preview Section:** Full width

---

## Interactions

### Click Actions
- **Product Dropdown:** Select product (MOH users or if not product-scoped)
- **Dosage Form Dropdown:** Select dosage form
- **Unit of Measure Dropdown:** Select unit of measure
- **MOH Authorized Unregistered Toggle:** Toggle flag (MOH Tier 1 only)
- **Status Checkbox/Toggle:** Toggle active status
- **Save Draft:** Explicitly save draft
- **Cancel:** Navigate back (with unsaved changes warning)
- **Create/Update:** Submit form (with validation)

### Input Interactions
- **Text Inputs:**
  - Real-time validation on blur
  - Debounced auto-save (2 seconds after typing stops)
  - SKU Name: Auto-generate from pharmaceutical attributes if empty
- **Dosage Strength Input:**
  - Format validation on blur
  - Format examples shown in placeholder
  - Real-time SKU name preview update
- **Pack Size Input:**
  - Format validation on blur
  - Format examples shown in placeholder
  - Real-time SKU name preview update
- **Dosage Form Selection:**
  - Real-time SKU name preview update
- **Unit of Measure Selection:**
  - No immediate preview impact (used in submissions, not SKU name)

### SKU Name Auto-Generation
- **Trigger:** When pharmaceutical attributes change
- **Format:** "[Product Name] [Dosage Strength] [Dosage Form] [Pack Size]"
- **Preview:** Real-time preview in Preview section
- **Update:** Preview updates as user types/changes attributes
- **Manual Override:** User can manually edit SKU name field
- **Clear:** If user manually edits, auto-generation pauses until field cleared

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
- **Select Component:** Dropdowns for Dosage Form, Unit of Measure, Product (shadcn/ui select)
- **Radio Group Component:** MOH authorized unregistered selection (shadcn/ui radio-group)
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
- **Preview Background:** #f9fafb (gray-50) - Light gray
- **Pharmaceutical Attributes Background:** #f0fdf4 (green-50) - Light green (subtle highlight)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600, color: #111827
- **Input Text:** 14px, font-weight: 400
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Required Indicator:** Asterisk (*) in red (#ef4444)
- **Validation Message:** 12px, font-weight: 400, color: #ef4444
- **Button Text:** 14px, font-weight: 500
- **Auto-Save Text:** 12px, font-weight: 400, color: #2563eb
- **Preview Text:** 14px, font-weight: 500, color: #111827

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
- **SKU Name Preview Update:** Smooth transition (200ms)

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
- **Debounced SKU Name Generation:** Debounce SKU name auto-generation (500ms)
- **Async Product Search:** Efficient product search with debouncing (if all products)
- **Lazy Loading:** Load SKU data on demand (edit mode)

### State Management
- **Form State:** Track all input values, validation status, dirty state
- **Draft State:** Save draft to local storage and server
- **Validation State:** Track field-level and form-level validation
- **Auto-Save State:** Track auto-save status (saving, saved, error)
- **SKU Name Generation State:** Track whether SKU name is auto-generated or manually edited

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

## Pharmaceutical Attributes Implementation Notes

### Dosage Strength Format
- **Supported Formats:**
  - Simple: "500mg", "10mg"
  - Ratio: "10mg/ml", "250mg/5ml"
  - Percentage: "0.5%", "1%"
- **Validation Pattern:** Flexible regex to support various pharmaceutical notations
- **Examples:** Display examples in placeholder and helper text

### Dosage Form Options
- **Standard Forms:** Tablet, Capsule, Syrup, Injection, Cream, Ointment, Drops, Spray, Suppository
- **Custom Option:** "Other" with text input for custom forms
- **Validation:** Must select from list or provide custom form name

### Pack Size Format
- **Format:** "[number] [description]"
- **Examples:** "30 tablets", "100ml bottle", "50 capsules", "10 vials"
- **Validation:** Must include both quantity and description
- **Flexible:** Accepts various descriptions

### Unit of Measure Options
- **Standard Units:** tablets, ml, capsules, vials, boxes, units, grams, mg
- **Custom Option:** "other" with text input for custom units
- **Usage:** Used in submissions (AAMS, MSQ, WSL) for quantity entry
- **Validation:** Must select from list or provide custom unit name

### SKU Name Auto-Generation Logic
- **Trigger:** When any pharmaceutical attribute changes
- **Format:** "[Product Name] [Dosage Strength] [Dosage Form] [Pack Size]"
- **Example:** "Paracetamol 500mg Tablet 30 tablets"
- **Manual Override:** User can manually edit SKU name
- **Update:** Real-time preview updates as user types

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/rmm/products/[id]/skus/new` or `/rmm/skus/[id]/edit`
- [Database Schema](../../../../02-architecture/database/schema-design.md) - SKUs table structure
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, data entry patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [SKUs List](task-0.5.2.6-skus-list.md) - SKUs list page
- [SKU Detail](task-0.5.2.7-sku-detail.md) - SKU detail page
- [Products List](../products/task-0.5.2.4-products-list.md) - Products list page
- [Product Detail](../products/task-0.5.2.5-product-detail.md) - Product detail page (SKUs tab)
- [Product Create/Edit Form](../products/task-0.5.2.9-product-create-edit-form.md) - Product form pattern reference

---

## Governance Notes (Fatima)

### Pharmaceutical Attributes Requirements
- **Dosage Strength:** Must follow pharmaceutical notation standards for regulatory compliance
- **Dosage Form:** Must use standard pharmaceutical forms for accurate classification
- **Pack Size:** Must be clear and unambiguous for regulatory submissions
- **Unit of Measure:** Must match standard pharmaceutical units for consistency in submissions

### Regulatory Compliance
- **SKU Name:** Must be unique and descriptive for regulatory tracking
- **MOH Authorized Unregistered:** Flag indicates regulatory exception status (MOH Tier 1 designation only)
- **ATC Code:** Inherited from product for consistent classification

---

**Next:** [SKUs List](task-0.5.2.6-skus-list.md)

