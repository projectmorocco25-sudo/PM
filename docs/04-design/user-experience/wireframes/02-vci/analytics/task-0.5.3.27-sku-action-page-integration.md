# Task 0.5.3.27: SKU Action Page Integration Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/skus/[id]?back=treemap&atc=J01&product=amoxicillin` (Level 5 - uses existing SKU detail route)  
**File:** `task-0.5.3.27-sku-action-page-integration.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Reuses existing SKU detail page route with query parameters for back navigation context. Opens in new tab. Role-based actions for Tier 1/Tier 2. Professional, accessible, and optimized for detailed SKU-level actions from treemap flow.

**Guidance:** Fatima (MOH Regulatory Requirements) - Direct access to SKU actions enables immediate regulatory response. Dr. Samir (Business Process Validation) - Seamless integration supports efficient workflow from visualization to action.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > SKUs > SKU001                                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Back Navigation Context                                  ││
│ │                                                          ││
│ │ ← Back to Treemap (Amoxicillin - J01)                   ││
│ │                                                          ││
│ │ Navigating from: VCI Treemap > Products > Dosage Forms  ││
│ │ ATC: J01 - Anti-infectives                              ││
│ │ Product: Amoxicillin                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Amoxicillin 500mg Tablet - 30-pack                [Edit]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SKU Information                                          ││
│ │                                                          ││
│ │ SKU: SKU001                                             ││
│ │ Product: Amoxicillin                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ Dosage Strength: 500mg                                   ││
│ │ Dosage Form: Tablet                                      ││
│ │ Pack Size: 30                                            ││
│ │ Unit of Measure: tablets                                 ││
│ │                                                          ││
│ │ Status: Active                                           ││
│ │ Created: 2024-01-15                                      ││
│ │ Last Updated: 2024-12-20                                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Status (from Treemap Context)                 ││
│ │                                                          ││
│ │ Current Compliance: 5% ⚠️                                ││
│ │ Threshold: 1,234 units                                   ││
│ │ Actual Stock: 62 units                                   ││
│ │ Last WSL Submission: December 31, 2024                   ││
│ │                                                          ││
│ │ ⚠️ Below threshold - Compliance violation detected       ││
│ │                                                          ││
│ │ Regulatory Framework (Fatima's Requirement):               ││
│ │ • Stock Level Compliance: DMP Art.15                    ││
│ │ • Threshold compliance is monitored per regulatory       ││
│ │   requirements                                           ││
│ │ • [View Regulatory Framework]                           ││
│ │                                                          ││
│ │ [View WSL Submissions] [View Compliance History]         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [History]                                  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Overview Tab (Default)                                   ││
│ │                                                          ││
│ │ Compliance Timeline (Last 3 months):                     ││
│ │ [Chart showing compliance % over time]                   ││
│ │                                                          ││
│ │ Recent Activity:                                         ││
│ │ • WSL submission received - December 31, 2024           ││
│ │ • Compliance violation detected - December 31, 2024     ││
│ │ • Stock level updated - December 30, 2024               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Role-Based Actions (MOH Tier 1/Tier 2)                   ││
│ │                                                          ││
│ │ [Create Enforcement Action] [Send Communication]        ││
│ │ [View Related Products] [Export Report]                 ││
│ │                                                          ││
│ │ Note: Actions available based on user role and          ││
│ │       regulatory permissions.                            ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Back Navigation Context
- **Back Link:** Returns to treemap with context preserved (ATC, Product)
- **Navigation Path:** Shows breadcrumb path: Treemap > Products > Dosage Forms > SKU
- **Context Info:** Displays ATC code and product name for reference
- **Query Params:** `?back=treemap&atc=J01&product=amoxicillin` enables back navigation

### Compliance Status Section
- **Current Compliance:** Shows compliance % from treemap context
- **Threshold Display:** Current threshold and actual stock levels
- **Last Submission:** Date of most recent WSL submission
- **Violation Alert:** Clear indication if compliance violation exists
- **Quick Actions:** Links to WSL submissions and compliance history

### Role-Based Actions
- **MOH Tier 1:** Create enforcement action, send communication, view related products, export report
- **MOH Tier 2:** Send communication, view related products, export report (read-only enforcement)
- **Company Users:** View only (read-only access to own SKUs)
- **Actions Contextual:** Actions available based on compliance status and user role

### Integration with Existing Page
- **Reuses Route:** Uses existing `/rmm/skus/[id]` route
- **Query Params:** Adds context via query parameters
- **No Duplication:** Existing SKU detail page enhanced, not duplicated
- **Backwards Compatible:** Works without query params (normal SKU detail view)

---

## State Variations

### Normal View (No Treemap Context)
```
│ Home > RMM > SKUs > SKU001                                   │
│                                                             │
│ Amoxicillin 500mg Tablet - 30-pack                [Edit]   │
│                                                             │
│ [No back navigation context shown]                          │
│ [Standard SKU detail page view]                             │
```

### With Treemap Context (Query Params Present)
```
│ Home > RMM > SKUs > SKU001                                   │
│                                                             │
│ ← Back to Treemap (Amoxicillin - J01)                       │
│                                                             │
│ Navigating from: VCI Treemap > Products > Dosage Forms     │
│ [Compliance status section shown]                           │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full page layout with side-by-side sections
- Back navigation context at top
- Compliance status and actions clearly visible

### Tablet (768px - 1024px)
- Stacked layout for sections
- Back navigation remains visible
- Actions in button group

### Mobile (< 768px)
- Full-width sections
- Back navigation at top
- Actions in collapsible menu

---

## Interactions

1. **Click Back Link:** Navigate back to treemap with context preserved (ATC, Product)
2. **Click Edit:** Navigate to SKU edit form (if permitted)
3. **Click Role-Based Actions:** Execute action (enforcement, communication, export)
4. **Click Tab:** Switch between Overview and History tabs
5. **Click Quick Actions:** Navigate to WSL submissions or compliance history

---

## Query Parameters

### Parameters
- `back=treemap` - Indicates navigation source (treemap)
- `atc=J01` - ATC code context for back navigation
- `product=amoxicillin` - Product name context for back navigation

### Usage
```typescript
// Current URL with query params
/rmm/skus/SKU001?back=treemap&atc=J01&product=amoxicillin

// Back navigation reconstructs treemap URL
/vci/treemap?atc=J01

// Or with full product context
/vci/treemap?atc=J01&product=amoxicillin
```

---

## Data Requirements

- **SKU Data:** Standard SKU detail information
- **Compliance Data:** Current compliance %, threshold, actual stock from WSL submissions
- **Submission History:** Recent WSL submissions for compliance timeline
- **Role Data:** User role and permissions for action availability

---

## Accessibility

- **Keyboard Navigation:** Tab through sections, Enter to activate actions, ESC for modals
- **Screen Reader:** Announce back navigation context, compliance status, available actions
- **Focus Management:** Focus on page title on load, maintain focus order
- **ARIA Labels:** Navigation context, compliance alerts, action buttons

---

## Related Wireframes

- **Opened From:** [SKU List Expanded View (Level 4)](task-0.5.3.25-sku-list-expanded.md) - External link
- **Reuses:** [SKU Detail Page](../../01-rmm/skus/task-0.5.2.7-sku-detail.md) - Existing route
- **Integration:** [Enforcement Action Creation](../../01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md) - Role-based action
- **Integration:** [Compliance Violation Detail](../../02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md) - Related compliance data

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

