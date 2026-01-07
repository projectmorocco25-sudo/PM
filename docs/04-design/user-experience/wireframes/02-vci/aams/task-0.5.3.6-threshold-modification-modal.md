# Task 0.5.3.6: Threshold Modification Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (triggered from threshold management or detail page)  
**File:** `task-0.5.3.6-threshold-modification-modal.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern modal dialog for threshold multiplier modification with local vs global selector, advisory suggestions, and validation. Professional, accessible, and optimized for MOH Tier 1 threshold management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Modal Overlay - Darkened Background]                         │
│                                                             │
│         ┌─────────────────────────────────────────────┐     │
│         │ Modify Threshold                    [× Close]│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Threshold Information                     ││     │
│         │ │                                          ││     │
│         │ │ SKU: SKU001                              ││     │
│         │ │ Product: Product A / 500mg / Tablet     ││     │
│         │ │ Current Threshold: 1,234 units           ││     │
│         │ │ Current Multiplier: 1.0x (default)       ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Modification Scope *                     ││     │
│         │ │                                          ││     │
│         │ │ ○ Local (This SKU only)                 ││     │
│         │ │   Apply multiplier to this specific SKU ││     │
│         │ │                                          ││     │
│         │ │ ○ Global (All SKUs for this product)    ││     │
│         │ │   Apply multiplier to all SKUs under    ││     │
│         │ │   the same product                      ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Multiplier (B) *                         ││     │
│         │ │                                          ││     │
│         │ │ New Multiplier: [1.5] x                 ││     │
│         │ │                                          ││     │
│         │ │ Range: 0.1x to 5.0x                     ││     │
│         │ │ Default: 1.0x                           ││     │
│         │ │                                          ││     │
│         │ │ New Threshold: 1,851 units              ││     │
│         │ │ (Calculated: 1,234 × 1.5)               ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Duration Type *                         ││     │
│         │ │                                          ││     │
│         │ │ ○ Permanent                              ││     │
│         │ │   Threshold remains until manually       ││     │
│         │ │   modified                              ││     │
│         │ │                                          ││     │
│         │ │ ○ Temporary (Time-Bound)                 ││     │
│         │ │   Threshold will revert after specified  ││     │
│         │ │   period                                ││     │
│         │ │                                          ││     │
│         │ │ [If Temporary Selected]                  ││     │
│         │ │                                          ││     │
│         │ │ Reversion Type *                         ││     │
│         │ │ ○ Auto-Revert                           ││     │
│         │ │   Automatically reverts on end date      ││     │
│         │ │                                          ││     │
│         │ │ ○ Manual Review                          ││     │
│         │ │   Requires Tier 1 confirmation before     ││     │
│         │ │   reversion                             ││     │
│         │ │                                          ││     │
│         │ │ End Date *                               ││     │
│         │ │ [Date Picker: DD/MM/YYYY]                ││     │
│         │ │ Minimum: Tomorrow                        ││     │
│         │ │                                          ││     │
│         │ │ Revert To *                              ││     │
│         │ │ ○ Previous Value (1.0x default)          ││     │
│         │ │ ○ Custom Value: [1.0] x                  ││     │
│         │ │   Range: 0.1x to 5.0x                   ││     │
│         │ │                                          ││     │
│         │ │ ⚠️ Warning: Reversion will occur on      ││     │
│         │ │    [End Date]. Ensure companies are      ││     │
│         │ │    notified.                             ││     │
│         │ │    [Schedule Notification]               ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Advisory Suggestions                    ││     │
│         │ │                                          ││     │
│         │ │ ℹ️ Suggested multipliers based on:       ││     │
│         │ │   • Critical medicine status           ││     │
│         │ │   • Historical compliance violation patterns ││     │
│         │ │   • Regulatory requirements            ││     │
│         │ │                                          ││     │
│         │ │ Suggested: 1.5x (Critical Medicine)    ││     │
│         │ │ [Apply Suggestion]                      ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ┌─────────────────────────────────────────┐│     │
│         │ │ Justification *                          ││     │
│         │ │                                          ││     │
│         │ │ [Minimum 50 characters required]        ││     │
│         │ │                                          ││     │
│         │ │ ┌────────────────────────────────────┐ ││     │
│         │ │ │ Enter justification for modifying  │ ││     │
│         │ │ │ this threshold multiplier. Include │ ││     │
│         │ │ │ regulatory basis and reasoning.     │ ││     │
│         │ │ │                                      │ ││     │
│         │ │ │                                      │ ││     │
│         │ │ └────────────────────────────────────┘ ││     │
│         │ │                                          ││     │
│         │ │ Character count: 0 / 50 minimum         ││     │
│         │ └─────────────────────────────────────────┘│     │
│         │                                             │     │
│         │ ℹ️ Threshold modifications are logged in   ││     │
│         │    audit trail and require regulatory      ││     │
│         │    justification.                          ││     │
│         │    [View Regulatory Framework]             ││     │
│         │                                             ││     │
│         │ [Cancel]                    [Modify Threshold]│     │
│         └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Modal Container
- **Layout:** Centered modal dialog with overlay
- **Width:** 600px (desktop), full-width on mobile
- **Max Height:** 90vh with scrollable content
- **Background:** White (#ffffff)
- **Border Radius:** 8px
- **Shadow:** Large shadow for elevation
- **Overlay:** Darkened background (rgba(0, 0, 0, 0.5))

### Modal Header
- **Title:** "Modify Threshold"
  - **Typography:** 20px, font-weight: 600, color: #111827
- **Close Button:** X button in top-right corner
  - **Action:** Close modal (same as Cancel)
  - **Keyboard:** Escape key also closes

### Threshold Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **SKU:** SKU code/identifier
  - **Product:** Product description (Name/Dosage/Form)
  - **Current Threshold:** Current threshold value
  - **Current Multiplier:** Current multiplier value with status (default/modified)
- **Styling:** Read-only information, gray text for values

### Modification Scope Section
- **Input Type:** Radio buttons
- **Options:**
  - **Local:** Apply to this SKU only
  - **Global:** Apply to all SKUs under the same product
- **Default:** Local selected
- **Validation:** Required field
- **Help Text:** Explanation of each option

### Multiplier Input Section
- **Input Type:** Number input with "x" suffix
- **Label:** "Multiplier (B)"
- **Placeholder:** "1.0"
- **Validation:**
  - Required
  - Range: 0.1 to 5.0
  - Decimal precision: 1 decimal place (e.g., 1.5)
- **New Threshold Display:**
  - **Label:** "New Threshold"
  - **Value:** Calculated value (Current Threshold × New Multiplier)
  - **Calculation Display:** Shows formula (e.g., "1,234 × 1.5")
  - **Styling:** Read-only, highlighted to show change
- **Real-time Calculation:** Updates as multiplier changes

### Duration Type Section
- **Input Type:** Radio buttons with conditional fields
- **Label:** "Duration Type *"
- **Options:**
  - **Permanent (Default):** Threshold remains until manually modified
    - No additional fields shown
    - All revert fields are NULL in database
  - **Temporary (Time-Bound):** Threshold will revert after specified period
    - Shows conditional fields (Reversion Type, End Date, Revert To)
- **Default:** Permanent selected
- **Validation:** Required field
- **Conditional Fields (shown when Temporary selected):**
  
  **Reversion Type:**
  - **Input Type:** Radio buttons
  - **Options:**
    - **Auto-Revert:** Automatically reverts on end date
      - Sets `duration_type = 'temporary_auto_revert'`
      - Sets `requires_manual_review = false`
    - **Manual Review:** Requires Tier 1 confirmation before reversion
      - Sets `duration_type = 'temporary_manual_review'`
      - Sets `requires_manual_review = true`
  - **Default:** Auto-Revert selected
  - **Validation:** Required if Temporary selected
  
  **End Date:**
  - **Input Type:** Date picker (DD/MM/YYYY format)
  - **Label:** "End Date *"
  - **Validation:**
    - Required if Temporary selected
    - Must be in the future (minimum: tomorrow)
    - Must be > `effective_from` date
  - **Help Text:** "Minimum: Tomorrow"
  - **Purpose:** Date when threshold reverts
  
  **Revert To:**
  - **Input Type:** Radio buttons + number input (conditional)
  - **Options:**
    - **Previous Value:** Revert to default multiplier (1.0x)
      - Auto-fills `revert_to_multiplier = 1.0`
      - Calculates `revert_to_threshold_value = 1.0 × AAMS`
    - **Custom Value:** Specify custom multiplier to revert to
      - Shows number input: `[1.0] x`
      - Range: 0.1x to 5.0x
      - Calculates `revert_to_threshold_value = revert_to_multiplier × AAMS`
  - **Default:** Previous Value selected
  - **Validation:** Required if Temporary selected
  - **Real-time Calculation:** Updates `revert_to_threshold_value` as multiplier changes
  
  **Warning Message:**
  - **Display:** Warning alert (orange/yellow background)
  - **Content:** "⚠️ Warning: Reversion will occur on [End Date]. Ensure companies are notified."
  - **Action Button:** "Schedule Notification" (opens notification scheduling modal)
  - **Purpose:** Reminds user to schedule notifications for affected companies
  
- **Help Text:** Explains each duration type option
- **Business Rules:**
  - Permanent: Default behavior, no revert date
  - Temporary: Requires end date and revert values
  - Conflict Detection: Cannot create temporary threshold if another modification is scheduled before end date

### Advisory Suggestions Section
- **Layout:** Info card with suggestions
- **Content:**
  - **Info Message:** Explains basis for suggestions
  - **Suggested Multiplier:** Display suggested value with reason
  - **Apply Suggestion Button:** Secondary button to apply suggested value
- **Basis for Suggestions:**
  - Critical medicine status
  - Historical compliance violation patterns
  - Regulatory requirements
  - Product category
- **Styling:** Light blue background (#eff6ff), info icon

### Justification Section
- **Input Type:** Multi-line textarea
- **Label:** "Justification *"
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text on what to include
- **Validation:** Required, minimum 50 characters
- **Help Text:** "Include regulatory basis and reasoning for modification"

### Compliance Information
- **Display:** Info message below form
- **Content:**
  - Audit trail notice
  - Regulatory justification requirement
  - Regulatory framework link
- **Styling:** Info text, link to regulatory framework

### Action Buttons
- **Cancel:** Secondary button (left-aligned)
  - **Action:** Close modal without saving
- **Modify Threshold:** Primary button (right-aligned)
  - **Action:** Save modification
  - **Disabled State:** Disabled until all validations pass
- **Layout:** Right-aligned, 16px spacing between buttons

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can modify thresholds
- **Actions:** Modify, Apply Suggestions

### MOH Tier 2
- **No Access:** Cannot modify thresholds
- **View Only:** Can view thresholds but not modify

### Company Users
- **No Access:** This modal is not accessible to company users

---

## State Variations

### Initial State (Empty)
- **Multiplier:** Pre-filled with current multiplier
- **Duration Type:** Permanent selected (default)
- **Temporary Fields:** Hidden (not shown when Permanent selected)
- **Justification:** Empty
- **Submit Button:** Disabled

### Valid State
- **All Fields Valid:**
  - Multiplier in range
  - Justification meets minimum (50 characters)
  - If Temporary selected:
    - Reversion Type selected
    - End Date is future date (> effective_from)
    - Revert To value selected/entered
- **Submit Button:** Enabled
- **Visual Indicators:** Green checkmarks on valid fields

### Invalid State
- **Validation Errors:** Red borders on invalid fields
- **Error Messages:** Inline error messages
- **Submit Button:** Disabled
- **Error Types:**
  - Multiplier out of range
  - Justification too short (< 50 characters)
  - Required fields missing
  - **Temporary-specific errors:**
    - End Date not selected or in the past
    - End Date <= effective_from date
    - Reversion Type not selected
    - Revert To value not selected/entered
    - Revert To multiplier out of range (0.1-5.0)
    - Conflict: Another temporary modification scheduled before end date

### Loading State (After Submit)
- **Submit Button:** Shows loading spinner
- **Form:** Disabled during submission
- **Success:** Modal closes, success notification shown

---

## Responsive Design

### Desktop (≥1024px)
- **Modal Width:** 600px
- **Layout:** Full form visible
- **Buttons:** Horizontal layout

### Tablet (768px - 1023px)
- **Modal Width:** 90% of viewport
- **Layout:** Stacked sections
- **Buttons:** Full-width, stacked

### Mobile (<768px)
- **Modal Width:** Full-width (with padding)
- **Layout:** Single column, scrollable
- **Buttons:** Full-width, stacked
- **Inputs:** Full-width

---

## Interactions

### Click Actions
- **Close Button:** Close modal
- **Overlay Click:** Close modal (optional, can be disabled)
- **Apply Suggestion:** Fill multiplier with suggested value
- **Cancel:** Close modal without saving
- **Modify Threshold:** Submit form and close modal

### Input Interactions
- **Multiplier Input:**
  - Real-time validation
  - Auto-calculate new threshold
  - Format number (1 decimal place)
- **Duration Type Selection:**
  - Show/hide conditional fields based on selection
  - If Temporary selected: Show Reversion Type, End Date, Revert To fields
  - If Permanent selected: Hide all temporary fields
  - Real-time validation of conditional fields
- **Reversion Type Selection:**
  - Updates `requires_manual_review` flag
  - Shows different warning message for manual review type
- **End Date Input:**
  - Date picker with minimum date validation (tomorrow)
  - Real-time validation against `effective_from` date
  - Shows days until reversion (calculated)
- **Revert To Selection:**
  - If "Previous Value" selected: Auto-fill 1.0x
  - If "Custom Value" selected: Show number input
  - Real-time calculation of `revert_to_threshold_value`
- **Justification Input:**
  - Real-time character count
  - Validation on blur
- **Scope Selection:**
  - Update help text based on selection
  - Show affected SKUs count (if global)
- **Schedule Notification Button:**
  - Opens notification scheduling modal
  - Pre-fills with affected companies (if global scope)
  - Allows scheduling 7-day, 1-day, and reversion notifications

### Keyboard Navigation
- **Tab:** Navigate through form fields
- **Enter:** Submit form (if valid)
- **Escape:** Close modal
- **Arrow Keys:** Navigate radio buttons

---

## Design System References

### Components Used
- **Dialog/Modal Component:** Modal container (shadcn/ui dialog)
- **Input Component:** Number input for multiplier (shadcn/ui input)
- **Textarea Component:** Justification input (shadcn/ui textarea)
- **Radio Group Component:** Scope selection (shadcn/ui radio-group)
- **Button Component:** Action buttons (shadcn/ui button)
- **Alert Component:** Advisory suggestions, compliance info (shadcn/ui alert)
- **Icon Component:** Close, info icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional modal patterns
- **GitHub:** https://github.com - Clean modals, form validation
- **Linear App:** https://linear.app - Modern modals, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Modal Background:** #ffffff (white)
- **Overlay Background:** rgba(0, 0, 0, 0.5) - Darkened overlay
- **Input Border:** #d1d5db (border-default) - Default state
- **Input Border Focus:** #3b82f6 (primary-500) - Focus state
- **Input Border Error:** #ef4444 (error-500) - Error state
- **Input Border Valid:** #10b981 (success-500) - Valid state
- **Text Primary:** #111827 (text-primary)
- **Text Secondary:** #6b7280 (text-secondary)
- **Alert Background:** #eff6ff (info background)

### Typography (From Design System)
- **Modal Title:** 20px, font-weight: 600, color: #111827
- **Section Title:** 16px, font-weight: 600
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Input Text:** 14px, font-weight: 400
- **Help Text:** 12px, font-weight: 400, color: #6b7280
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Modal Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Spacing:** 16px (2 × 8px) between buttons

### Transitions & Animations
- **Modal Open/Close:** 200ms ease-in-out (fade + scale)
- **Input Focus:** 200ms ease-in-out
- **Validation State Change:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Focus Trap:** Focus trapped within modal when open
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)
- **Modal Title:** Proper ARIA labeling for modal dialog

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Calculation:** Calculate new threshold only when multiplier changes
- **Debounced Validation:** Debounce validation checks (300ms)
- **Modal Animation:** Hardware-accelerated CSS transitions

### State Management
- **Form State:** Track all input values, validation status
- **Modal State:** Track open/closed state
- **Validation State:** Track field-level and form-level validation

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **Submission Errors:** Display error message if submission fails
- **Retry Logic:** Allow retry on submission failure

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Modal overlay (no route)
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including threshold requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including threshold policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, modal patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Dialog, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Threshold Management](task-0.5.3.4-threshold-management.md) - Threshold management page
- [Threshold Detail](../overview/task-0.5.3.5-threshold-detail.md) - Threshold detail page
- [AAMS Submission Detail](task-0.5.3.3-aams-submission-detail.md) - AAMS submission with threshold

---

**Next:** WSL Submissions List (Task 0.5.3.11)

