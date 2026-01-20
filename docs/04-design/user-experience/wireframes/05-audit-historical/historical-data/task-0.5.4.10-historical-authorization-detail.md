# Task 0.5.4.10: Historical Authorization Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/history/[id]` or `/ecs/exports/history/[id]` (historical authorization details)  
**File:** `task-0.5.4.10-historical-authorization-detail.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Historical view of export authorization details. Read-only. Shows authorization information, validity period, completion status, and related data. Professional, accessible, and optimized for regulatory audit and historical reference.

**Guidance:** Fatima (MOH Regulatory Requirements) - Historical authorization details critical for regulatory audit trail and 7-year retention compliance. Dr. Samir (Business Process Validation) - Historical authorization data enables compliance verification and pattern analysis.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export History > EXP-2024-001                  │
│                                                             │
│ ← Back to Export History                                    │
│                                                             │
│ Export Authorization - EXP-2024-001                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Historical Data Indicator                                ││
│ │                                                          ││
│ │ ⓘ Historical Data - This authorization is from a past  ││
│ │   period. Data is read-only.                            ││
│ │                                                          ││
│ │ Authorization Date: January 15, 2024                     ││
│ │ Current Status: Completed                               ││
│ │                                                          ││
│ │ Regulatory Compliance Notice (Fatima's Requirement):      ││
│ │ • Historical export authorization data is retained for   ││
│ │   7 years per regulatory requirements (Law No. 09-08)    ││
│ │ • Data is immutable and part of regulatory audit trail  ││
│ │ • Regulatory Framework: DMP Art.[X] - Export Control   ││
│ │ • [View Regulatory Framework]                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Authorization Information                                ││
│ │                                                          ││
│ │ Request ID: EXP-2024-001                                 ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ SKU: SKU001 - Product A / 500mg / Tablet                ││
│ │                                                          ││
│ │ Requested Quantity: 500 units                            ││
│ │ Authorized Quantity: 500 units                           ││
│ │ Actual Exported: 480 units                               ││
│ │                                                          ││
│ │ Destination: Country Name                                ││
│ │ Purpose: Commercial Export                               ││
│ │                                                          ││
│ │ Requested Date: January 10, 2024                         ││
│ │ Authorized Date: January 15, 2024                        ││
│ │ Completion Date: February 28, 2024                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Validity Period                                          ││
│ │                                                          ││
│ │ Valid From: January 15, 2024                             ││
│ │ Valid Until: April 15, 2024 (90 days)                   ││
│ │ Status: ✓ Completed (Exported before expiration)       ││
│ │                                                          ││
│ │ [Validity Timeline Visualization]                       ││
│ │ [Jan 15] ──────────────── [Feb 28] ───── [Apr 15]      ││
│ │   Start                   Completed      Expired       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Comparison (Historical Snapshot)               ││
│ │                                                          ││
│ │ At time of authorization (Jan 15, 2024):                 ││
│ │ • Current Stock: 1,500 units                            ││
│ │ • VCI Threshold: 1,200 units                            ││
│ │ • ECS Threshold: 800 units                              ││
│ │ • Stock vs VCI: 125% ✓                                  ││
│ │ • Stock vs ECS: 187.5% ✓                                ││
│ │                                                          ││
│ │ Status: ✓ Approved (Stock levels sufficient)           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Completion Details (if completed)                        ││
│ │                                                          ││
│ │ Export Completion Report:                                ││
│ │ • Actual Exported: 480 units                            ││
│ │ • Export Date: February 28, 2024                         ││
│ │ • Shipping Information: [View Details]                  ││
│ │ • Documentation: [View Documents]                        ││
│ │                                                          ││
│ │ Status: ✓ Completed                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow History                                         ││
│ │                                                          ││
│ │ • Completed export - February 28, 2024                   ││
│ │   User: Company Admin                                    ││
│ │   Notes: Export completed successfully                  ││
│ │                                                          ││
│ │ • Authorization approved - January 15, 2024               ││
│ │   User: MOH Tier 1 - Fatima Alami                       ││
│ │   Notes: Stock levels sufficient for export             ││
│ │                                                          ││
│ │ • Tier 2 verified - January 12, 2024                     ││
│ │   User: MOH Tier 2 - Ahmed Benali                       ││
│ │   Notes: Verification completed                         ││
│ │                                                          ││
│ │ • Request submitted - January 10, 2024                   ││
│ │   User: Company Admin                                    ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Export Report] [View Related Exports] [Back to History]   │
```

---

## Key Features

### Historical Data Indicator
- **Read-Only Badge:** Clear indication that this is historical data
- **Date Context:** Shows authorization date and current status
- **No Edit Actions:** Edit/update actions disabled for historical data

### Authorization Information
- **Request Details:** Request ID, company, SKU, quantities
- **Destination:** Export destination and purpose
- **Timeline:** Requested date, authorized date, completion date
- **Status:** Current status (Active, Expired, Completed, Cancelled)

### Validity Period
- **Validity Range:** Valid from and until dates (90-day window)
- **Timeline Visualization:** Visual representation of validity period
- **Status Indicator:** Shows if export was completed before expiration
- **Expiration Context:** Highlights expiration date and status

### Threshold Comparison (Historical Snapshot)
- **Snapshot Data:** Stock levels and thresholds at time of authorization
- **Comparison:** Current stock vs VCI threshold, vs ECS threshold
- **Status:** Approval status based on historical thresholds
- **Note:** Values reflect historical state, not current

### Completion Details (if completed)
- **Export Report:** Actual exported quantity and date
- **Shipping Information:** Shipping details (if available)
- **Documentation:** Related documents (if available)
- **Status:** Completion status

### Workflow History
- **Timeline:** Complete workflow history from request to completion
- **User Attribution:** Shows user and role for each action
- **Notes:** Comments and notes from each workflow step
- **Chronological Order:** Most recent first

---

## State Variations

### Active Authorization (not yet expired)
```
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Validity Period                                          ││
│ │                                                          ││
│ │ Valid From: January 15, 2024                             ││
│ │ Valid Until: April 15, 2024 (90 days remaining)        ││
│ │ Status: ✓ Active (Not yet expired)                      ││
│ │                                                          ││
│ │ [Validity Timeline Visualization]                       ││
│ │ [Jan 15] ──────────────── [Current] ─── [Apr 15]       ││
│ │   Start                   Now            Expires        ││
│ └─────────────────────────────────────────────────────────┘│
```

### Expired Authorization (not completed)
```
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Validity Period                                          ││
│ │                                                          ││
│ │ Valid From: January 15, 2024                             ││
│ │ Valid Until: April 15, 2024 (Expired)                   ││
│ │ Status: ⏳ Expired (Not completed before expiration)    ││
│ │                                                          ││
│ │ [Validity Timeline Visualization]                       ││
│ │ [Jan 15] ──────────────── [Apr 15] ─── [Current]       ││
│ │   Start                   Expired       Now             ││
│ └─────────────────────────────────────────────────────────┘│
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading authorization details...             │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full-width sections with side-by-side layout where appropriate
- Timeline visualization visible
- All details visible

### Tablet (768px - 1024px)
- Stacked sections
- Timeline visualization condensed
- Details in tabs if needed

### Mobile (< 768px)
- Full-width stacked sections
- Timeline visualization simplified
- Collapsible sections for details

---

## Interactions

1. **Click Back:** Navigate back to export history list
2. **Click Export Report:** Download authorization report (PDF/CSV)
3. **Click View Related Exports:** Navigate to related exports from same company/SKU
4. **Click View Details/Documents:** Open related documents or details
5. **No Edit Actions:** Historical data is read-only (no edit/update buttons)

---

## Data Requirements

- **Data Source:** Historical ECS export authorization from database (up to 7 years old)
- **Access Control:** Companies see own exports only, MOH sees all
- **Module Status:** Accessible even if ECS module is inactive (read-only)
- **Historical Snapshot:** Threshold and stock data reflect state at authorization time
- **Workflow History:** Complete workflow timeline with user attribution

---

## Accessibility

- **Keyboard Navigation:** Tab through sections, Enter to open links, ESC for modals
- **Screen Reader:** Announce authorization ID, company, SKU, status, validity period
- **Focus Management:** Focus on page title on load
- **ARIA Labels:** Historical data indicator, read-only status, timeline visualization

---

## Related Wireframes

- **List View:** [Export History](task-0.5.4.9-export-history.md) - Back navigation
- **Current View:** [Export Authorization Detail](../../03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md) - Current authorization (editable)
- **Integration:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Top-level history page

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

