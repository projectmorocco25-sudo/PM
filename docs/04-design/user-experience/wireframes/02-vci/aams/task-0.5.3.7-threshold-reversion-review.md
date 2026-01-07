# Task 0.5.3.7: Threshold Reversion Review Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/thresholds/[id]/revert-review`  
**File:** `task-0.5.3.7-threshold-reversion-review.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern review page for Tier 1 to confirm or cancel threshold reversion for temporary thresholds with manual review type. Professional, accessible, and optimized for regulatory compliance review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Thresholds > [SKU] > Reversion Review         │
│                                                             │
│ Threshold Reversion Review                                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Information                                    ││
│ │                                                          ││
│ │ SKU: SKU002                                              ││
│ │ Product: Product B / 250mg / Capsule                    ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │                                                          ││
│ │ Current Threshold: 600 units                            ││
│ │ Current Multiplier: 1.5x (modified)                     ││
│ │ Duration Type: Temporary (Manual Review)                 ││
│ │ Effective From: 15/01/2025                              ││
│ │ Revert Date: 30/01/2025 (Today)                         ││
│ │                                                          ││
│ │ ⚠️ This threshold is due to revert today.              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Reversion Details                                        ││
│ │                                                          ││
│ │ Revert To Multiplier: 1.0x (default)                    ││
│ │ Revert To Threshold: 400 units                          ││
│ │                                                          ││
│ │ Original Justification (from modification):            ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Temporary threshold increase due to supply chain   │ ││
│ │ │ disruption. Expected to resolve by end of month.   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Modification Date: 15/01/2025                          ││
│ │ Modified By: Tier 1 Officer - Ahmed Benali             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Decision *                                         ││
│ │                                                          ││
│ │ ○ Confirm Reversion                                      ││
│ │   Threshold will revert to 1.0x (400 units) today.     ││
│ │   Company will be notified.                             ││
│ │                                                          ││
│ │ ○ Cancel Reversion                                       ││
│ │   Threshold will remain at 1.5x (600 units).            ││
│ │   You can set a new revert date if needed.               ││
│ │                                                          ││
│ │ ○ Extend Temporary Period                                ││
│ │   Keep threshold at 1.5x and set new revert date.      ││
│ │   [New Revert Date: DD/MM/YYYY]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Justification *                                   ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter justification for your decision. Include      │ ││
│ │ │ regulatory basis and reasoning.                     │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 0 / 50 minimum                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Impact Assessment                                         ││
│ │                                                          ││
│ │ Current Stock Level: 550 units                          ││
│ │ Current Threshold: 600 units (1.5x)                     ││
│ │ Revert To Threshold: 400 units (1.0x)                   ││
│ │                                                          ││
│ │ Impact:                                                  ││
│ │ • Stock will be above threshold after reversion (550 > 400)││
│ │ • No compliance violation expected                       ││
│ │ • Company notified 7 days and 1 day in advance         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ This action will be logged in the audit trail.          ││
│    [View Regulatory Framework]                             ││
│                                                             │
│ [Cancel]                                    [Confirm Decision]│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Thresholds > [SKU] > Reversion Review"
- **Title:** "Threshold Reversion Review"
- **Actions:** None (review-only page)

### Threshold Information Section
- **Layout:** Card with key threshold details
- **Fields:**
  - SKU code (link to SKU detail)
  - Product description (Product Name / Dosage / Form)
  - Company name (link to company detail)
  - Current threshold value
  - Current multiplier
  - Duration type badge
  - Effective from date
  - Revert date (highlighted if today)
- **Warning Banner:** Orange/yellow banner if revert date is today
- **Styling:** Light background (#f9fafb), border (#e5e7eb)

### Reversion Details Section
- **Layout:** Card with reversion information
- **Fields:**
  - Revert to multiplier
  - Revert to threshold value
  - Original justification (read-only, from modification)
  - Modification date
  - Modified by (user name and role)
- **Styling:** Light background (#f9fafb), border (#e5e7eb)

### Review Decision Section
- **Layout:** Radio button group
- **Options:**
  1. **Confirm Reversion:**
     - Reverts threshold to revert_to values
     - Creates new threshold version
     - Marks old threshold as inactive
     - Sends notification to company
  2. **Cancel Reversion:**
     - Keeps threshold at current values
     - Removes pending reversion status
     - Allows setting new revert date
  3. **Extend Temporary Period:**
     - Keeps threshold at current values
     - Requires new revert date input
     - Creates new temporary threshold version
- **Validation:** One option must be selected
- **Styling:** Radio buttons with descriptions

### Review Justification Section
- **Layout:** Textarea with character counter
- **Validation:**
  - Minimum 50 characters required
  - Required for all decisions
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text for justification
- **Styling:** Standard textarea with validation states

### Impact Assessment Section
- **Layout:** Card with impact analysis
- **Content:**
  - Current stock level (if available)
  - Current threshold value
  - Revert to threshold value
  - Impact analysis:
    - Stock vs threshold comparison
    - Compliance violation risk
    - Notification status
- **Purpose:** Help Tier 1 make informed decision
- **Styling:** Info card with light blue background (#eff6ff)

### Action Buttons
- **Cancel:** Secondary button, closes page without action
- **Confirm Decision:** Primary button, submits review decision
- **Validation:** Disabled until:
  - Decision option selected
  - Justification provided (minimum 50 characters)
- **Styling:** Standard button variants

---

## State Variations

### Valid State
- **Decision Selected:** Radio button checked
- **Justification Provided:** Textarea has 50+ characters
- **Confirm Button:** Enabled, primary color
- **Validation Messages:** None

### Invalid State
- **No Decision Selected:**
  - Error message: "Please select a review decision"
  - Confirm button disabled
- **Justification Too Short:**
  - Error message: "Justification must be at least 50 characters"
  - Character counter shows error state (red)
  - Confirm button disabled

### Loading State
- **Submitting:** Confirm button shows loading spinner
- **All inputs disabled:** Prevent multiple submissions
- **Message:** "Processing review decision..."

### Success State
- **Confirmation:** Success toast notification
- **Redirect:** Navigate to threshold detail page or pending reversions list
- **Message:** "Reversion review completed successfully"

### Error State
- **Error Message:** Display error toast notification
- **Fields:** Keep user input (don't clear form)
- **Retry:** Allow user to retry submission

---

## Input Interactions

### Decision Selection
- **Click Radio Button:** Selects option, shows description
- **Keyboard Navigation:** Arrow keys to navigate options
- **Enter Key:** Selects option

### Justification Input
- **Focus:** Textarea border highlights
- **Typing:** Character counter updates in real-time
- **Validation:** Real-time validation feedback
- **Paste:** Supports paste with validation

### Date Input (if Extend Selected)
- **Date Picker:** Opens calendar picker
- **Validation:** Must be future date
- **Format:** DD/MM/YYYY
- **Keyboard:** Supports keyboard input

---

## Access Control

### Tier 1 Only
- **View Access:** Tier 1 can view and review
- **Actions:** Confirm, Cancel, Extend
- **Audit:** All actions logged

### Tier 2 (Read-Only)
- **View Access:** Tier 2 can view (read-only)
- **Actions:** None (cannot review)
- **Message:** "Only Tier 1 officers can review threshold reversions"

### Company Users
- **No Access:** Cannot access this page
- **Redirect:** Redirected to appropriate page

---

## Related Documents

- [Threshold Modification Modal](task-0.5.3.6-threshold-modification-modal.md)
- [Threshold Management](task-0.5.3.4-threshold-management.md)
- [Pending Reversions List](task-0.5.3.8-pending-reversions-list.md)
- [Governance Workflows](../../../../03-governance/governance-workflows.md)
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md)

---

**Last Updated:** 2025-01-15  
**Owner:** UX Design Team

