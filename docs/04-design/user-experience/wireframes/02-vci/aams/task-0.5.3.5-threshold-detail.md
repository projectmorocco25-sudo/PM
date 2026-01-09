# Task 0.5.3.5: Threshold Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/thresholds/[id]`  
**File:** `task-0.5.3.5-threshold-detail.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Comprehensive threshold detail view with threshold information, modification history, related thresholds, and time-bound reversion details. Professional, accessible, and optimized for threshold review and audit.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Thresholds > SKU001 Threshold                 │
│                                                             │
│ Threshold Detail - SKU001                                  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Status: [Active] [Permanent] [Modify] (MOH Tier 1)     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [History] [Related]                          ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Threshold Information                               ││
│ │ │                                                      ││
│ │ │ SKU: SKU001 - Product A / 500mg Tablet              ││
│ │ │ Company: ABC Pharmaceuticals Inc.                   ││
│ │ │ Threshold Type: VCI                                 ││
│ │ │                                                      ││
│ │ │ Current Threshold Value: 45,000 units               ││
│ │ │ Multiplier B: 3.0                                   ││
│ │ │ AAMS Value Used: 15,000 units                       ││
│ │ │ Effective From: January 1, 2025                     ││
│ │ │ Effective To: - (Current)                           ││
│ │ │                                                      ││
│ │ │ Duration Type: Permanent                            ││
│ │ │ Revert Date: -                                       ││
│ │ │ Revert To Multiplier: -                              ││
│ │ │ Requires Manual Review: No                          ││
│ │ │                                                      ││
│ │ │ Created: January 1, 2025 at 10:00                  ││
│ │ │ Created By: MOH Tier 1 User                        ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Related Thresholds                                  ││
│ │ │                                                      ││
│ │ │ • Global Threshold (VCI) - 30,000 units            ││
│ │ │ • SKU002 Threshold (VCI) - 50,000 units            ││
│ │ │                                                      ││
│ │ │ [View All Related]                                  ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [Export] [Print] [Modify] (MOH Tier 1)                 ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Thresholds > [SKU/Global] Threshold"
- **Title:** "Threshold Detail - [SKU Code or 'Global']"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Status Badge:** Current status (Active, Inactive, Pending Reversion)
- **Duration Badge:** Duration type (Permanent, Temporary)
- **Actions (Right-aligned):**
  - **Modify Button:** Primary button (MOH Tier 1 only)
  - **Export Button:** Secondary button
  - **Print Button:** Secondary button

### Status Banner
- **Layout:** Horizontal bar below header
- **Status Badge:** Current threshold status
- **Duration Badge:** Duration type indicator
- **Modify Button:** Quick action button (MOH Tier 1 only)
- **Color Coding:**
  - Green: Active and permanent
  - Yellow: Active with pending reversion
  - Gray: Inactive

### Tab Navigation
- **Tabs:**
  1. **Overview:** Threshold information and related thresholds (default)
  2. **History:** Modification history timeline
  3. **Related:** Related thresholds (global, other SKUs)
- **Active Tab:** Highlighted with underline
- **Tab Content:** Changes based on selected tab

### Overview Tab Content

#### Threshold Information Card
- **SKU Information:**
  - SKU code and description
  - Product name, dosage, form
  - Company name
- **Threshold Details:**
  - Threshold type (VCI or ECS)
  - Current threshold value (units)
  - Multiplier B value
  - AAMS value used for calculation
  - Effective from date
  - Effective to date (if not current)
- **Duration Information:**
  - Duration type (Permanent, Temporary Auto-Revert, Temporary Manual Review)
  - Revert date (if temporary)
  - Revert to multiplier (if temporary)
  - Requires manual review flag
- **Metadata:**
  - Created date and time
  - Created by user
  - Last modified date and time
  - Last modified by user

#### Related Thresholds Card
- **Global Threshold:** Link to global threshold (if SKU-specific)
- **Other SKU Thresholds:** Links to thresholds for related SKUs
- **Actions:**
  - "View All Related" link
- **Layout:** List of related thresholds with links

### History Tab Content
- **Timeline View:** Chronological list of threshold modifications
- **Entries:**
  - Created (initial threshold)
  - Modified (each modification)
  - Reverted (if temporary threshold reverted)
- **Each Entry Shows:**
  - Date and time
  - Modification type (Created, Modified, Reverted)
  - Old values (if modification)
  - New values
  - User who made change
  - Justification/reason (if provided)
- **Version History:** Shows all threshold versions

### Related Tab Content
- **Global Threshold:** Global threshold information (if SKU-specific threshold)
- **Other SKU Thresholds:** List of thresholds for related SKUs
- **Comparison:** Side-by-side comparison option
- **Filters:** Filter by threshold type, company, etc.

---

## Role-Based Access

### Company Users
- **View:** Can view thresholds for own company SKUs
- **Read-Only:** Cannot modify thresholds
- **Actions:**
  - View threshold details
  - View history
  - Export threshold information
  - Print threshold details

### MOH Tier 1
- **View:** Can view all thresholds
- **Actions:**
  - View threshold details
  - Modify thresholds
  - View history
  - Export threshold information
  - Print threshold details
  - Review pending reversions

### MOH Tier 2
- **View:** Can view all thresholds
- **Read-Only:** Cannot modify thresholds
- **Actions:**
  - View threshold details
  - View history
  - Export threshold information
  - Print threshold details
  - Review pending reversions (read-only)

---

## State Variations

### Permanent Threshold State
- **Duration Badge:** "Permanent"
- **Reversion Fields:** Hidden or shown as "-"
- **Modify Button:** Available (MOH Tier 1)

### Temporary Auto-Revert State
- **Duration Badge:** "Temporary (Auto-Revert)"
- **Reversion Fields:** Visible with revert date and revert to multiplier
- **Countdown:** Days until reversion (if applicable)
- **Modify Button:** Available (MOH Tier 1)

### Temporary Manual Review State
- **Duration Badge:** "Temporary (Manual Review)"
- **Reversion Fields:** Visible with revert date and revert to multiplier
- **Review Required:** Warning badge if reversion date approaching
- **Modify Button:** Available (MOH Tier 1)

### Pending Reversion State
- **Status Badge:** "Pending Reversion"
- **Warning:** Prominent warning about upcoming reversion
- **Review Button:** "Review Reversion" button (MOH Tier 1)
- **Countdown:** Days/hours until reversion

### Inactive State
- **Status Badge:** "Inactive"
- **Effective To:** Shows end date
- **History:** Shows when and why threshold was deactivated

---

## Business Rules

1. **Threshold Types:** VCI or ECS thresholds
2. **Scope:** SKU-specific or global thresholds
3. **Duration Types:** Permanent, Temporary Auto-Revert, Temporary Manual Review
4. **Reversion Tracking:** All reversion details tracked for temporary thresholds
5. **History:** Complete modification history preserved
6. **Related Thresholds:** Links to related thresholds (global, other SKUs)
7. **Modification:** Only MOH Tier 1 can modify thresholds

---

## Related Documents

- [Threshold Management Wireframe](./task-0.5.3.4-threshold-management.md)
- [Threshold Modification Modal Wireframe](./task-0.5.3.6-threshold-modification-modal.md)
- [Pending Reversions List Wireframe](./task-0.5.3.8-pending-reversions-list.md)
- [Threshold Reversion Review Wireframe](./task-0.5.3.7-threshold-reversion-review.md)
- [Data Dictionary](../../../../02-architecture/database/data-dictionary.md) - Threshold fields and time-bound modifications
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Threshold routes

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

