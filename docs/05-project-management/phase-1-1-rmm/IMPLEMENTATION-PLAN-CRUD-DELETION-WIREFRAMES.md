# Implementation Plan: CRUD/Deletion Wireframe Updates

**Prepared for:** Emma (UI/UX), Fatima (Compliance), Maya (Backend/API), Nadia (Database)  
**Date:** 2026-01-28  
**Purpose:** Comprehensive implementation plan to address all CRUD/deletion issues identified in [WIREFRAMES-CRUD-DELETION-REVIEW.md](./WIREFRAMES-CRUD-DELETION-REVIEW.md)

**Reference Documents:**
- [WIREFRAMES-CRUD-DELETION-REVIEW.md](./WIREFRAMES-CRUD-DELETION-REVIEW.md) - Wireframes requiring updates
- [RMM-CRUD-DELETION-REVIEW.md](./RMM-CRUD-DELETION-REVIEW.md) - Deletion logic requirements
- [feature-index.md](../../02-architecture/feature-index.md) - Feature tracking

---

## Overview

**Total Wireframes to Update:** 8 wireframes (7 critical/high, 1 minor)  
**Database Changes Required:** None (schema already supports deletion workflow)  
**API Changes Required:** Documentation updates only (functions already exist)  
**Feature Index Updates:** 3 feature sections need updates

**Estimated Effort:**
- Wireframe Updates: 8-12 hours (Emma)
- API Documentation: 1-2 hours (Maya)
- Feature Index Updates: 1 hour (Yasmine/Emma)
- Review & Approval: 2-4 hours (Fatima)

---

## Phase 1: Wireframe Markdown File Updates

### 1.1 task-0.5.1.19-moh-tier1-dashboard.md ⚠️ **CRITICAL**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md`

**Changes Required:**

#### 1.1.1 Update "Pending Approvals" Widget Section

**Location:** Around line 753-761 (Pending Approvals Widget section)

**Add to Component Specifications:**

```markdown
### Pending Approvals Widget (Enhanced for Deletion Workflow)
- **Layout:** Card widget
- **Content:** List of pending approvals (including deletion requests)
- **Deletion-Specific Approval Items (NEW):**
  - **Format:** "Company Deletion Request - [Company Name]" or "Product Deletion Request - [Product Name]" or "SKU Deletion Request - [SKU Code]"
  - **Status Badge:** "Awaiting Tier 1 Approval"
  - **Entity Information:**
    - Entity Type: Company/Product/SKU (badge)
    - Entity Name/Code: Display name or code
    - Entity ID: Link to entity detail page
  - **Workflow Information:**
    - Requested by: Tier 2 Officer name
    - Requested at: Timestamp
    - Verified by: Tier 2 Officer name (if verified)
    - Verified at: Timestamp (if verified)
  - **Regulatory Deadline:** Show if applicable (⚠️ [X]d deadline)
  - **Action Buttons:**
    - "[Approve & Issue Command]" - Primary button (green)
    - "[Reject]" - Secondary button (red)
    - "[View Details]" - Tertiary button (opens submission detail modal/page)
  - **Visual Distinction:** 
    - Deletion requests shown with ⚠️ warning icon
    - Red border or background tint to indicate critical action
    - "Deletion Request" badge in addition to entity type badge
- **Filtering:**
  - Filter by submission type: All, Create, Update, **Delete** (NEW)
  - Filter by entity type: All, Company, Product, SKU
  - Sort by: Priority (deletion requests first), Date, Entity Type
- **Priority Indicators:**
  - Deletion requests shown first (highest priority)
  - Regulatory deadline urgency indicators (🔴 <3 days, 🟡 3-7 days)
```

#### 1.1.2 Update Enforcement Tab Section

**Location:** Around line 297-366 (Enforcement Tab section)

**Add Note:**

```markdown
**Note:** Deletion requests may appear in enforcement context if deletion is related to enforcement actions. Deletion workflow follows registry submission workflow, not enforcement workflow.
```

#### 1.1.3 Update Compliance Tab Section

**Location:** Around line 198-293 (Compliance Tab section)

**Add Note:**

```markdown
**Note:** Deletion requests may be visible in compliance context for companies/products/SKUs with compliance issues. Deletion requests are tracked separately from compliance violations.
```

#### 1.1.4 Add Deletion Approval Modal Design

**Location:** After line 686 (after Bulk Actions Modal)

**Add New Modal:**

```markdown
### 6. Approve Deletion Request Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Approve Deletion Request                      [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ ⚠️ WARNING: This action will delete an entity    │  │
│     │                                                   │  │
│     │ Entity Type: Company                             │  │
│     │ Entity Name: ABC Pharma                          │  │
│     │ Entity ID: [Link to company detail]              │  │
│     │                                                   │  │
│     │ Deletion Request Details:                         │  │
│     │ • Requested by: Officer A (Tier 2 Officer)      │  │
│     │ • Requested at: 2025-01-15 10:30 AM             │  │
│     │ • Verified by: Officer B (Tier 2 Officer)       │  │
│     │ • Verified at: 2025-01-15 11:00 AM              │  │
│     │ • Reason: [Deletion reason from submission]      │  │
│     │                                                   │  │
│     │ Cascade Effects:                                  │  │
│     │ ⚠️ This deletion will cascade to:                │  │
│     │   • 5 Products                                    │  │
│     │   • 12 SKUs                                       │  │
│     │   All will be deactivated (soft delete)          │  │
│     │                                                   │  │
│     │ Audit Information:                                │  │
│     │ • All deletion steps will be logged              │  │
│     │ • Old values will be preserved in audit_logs    │  │
│     │ • Retention period: 7 years (Law No. 09-08)      │  │
│     │                                                   │  │
│     │ Approval Comments (Optional):                    │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Approved per regulatory requirements.         ││  │
│     │ │ Command issued to Tier 2 Registrar.          ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ I understand this action cannot be undone     │  │
│     │ ☑ I confirm the deletion is authorized          │  │
│     │                                                   │  │
│     │                      [Cancel]  [Approve & Issue Command]│  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Component Specifications:**
- **Warning Section:** Red border, warning icon, prominent display
- **Cascade Effects:** Show all entities that will be affected
- **Audit Information:** Emphasize audit trail and retention
- **Confirmation Checkboxes:** Required before approval
- **Action Button:** "Approve & Issue Command" (green, primary)
```

---

### 1.2 task-0.5.1.20-moh-tier2-dashboard.md ⚠️ **CRITICAL**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md`

**Changes Required:**

#### 1.2.1 Update Verification Tab Section

**Location:** Around line 127-184 (Verification Tab section)

**Add to Verification Queue:**

```markdown
**Deletion Request Items (NEW):**
- **Format:** "Deletion Request - [Entity Type]: [Entity Name]"
- **Status Badge:** "Deletion Request - Pending Verification"
- **Entity Information:**
  - Entity Type: Company/Product/SKU (badge)
  - Entity Name/Code: Display name or code
  - Entity ID: Link to entity detail page
- **Request Information:**
  - Requested by: Tier 2 Officer name (self or other)
  - Requested at: Timestamp
  - Reason: Deletion reason (from submission_data)
- **Action Buttons:**
  - "[Verify]" - Verify deletion request
  - "[Flag]" - Flag for review
  - "[Request Info]" - Request additional information
  - "[View Details]" - View full submission details
- **Visual Distinction:**
  - ⚠️ Warning icon
  - Orange/yellow border or background tint
  - "Deletion Request" badge
```

#### 1.2.2 Update Quick Actions Bar

**Location:** Around line 139-143 (Quick Actions section)

**Add Action:**

```markdown
**Quick Actions:**
- [Verify Selected] [Flag Selected] [Request Info]
- **[Request Deletion]** (NEW) - Opens deletion request modal
- [Export] [Filters ▼]
```

#### 1.2.3 Add Request Deletion Modal

**Location:** After line 562 (after Escalate to Tier 1 Modal)

**Add New Modal:**

```markdown
### 6. Request Deletion Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Request Deletion                               [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Entity Type:                                     │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Company ▼]                                   ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options: Company, Product, SKU                   │  │
│     │                                                   │  │
│     │ Entity:                                          │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Select Entity ▼]                             ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Reason for Deletion (Required):                  │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Select Reason ▼]                             ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                         │  │
│     │ • Regulatory Non-Compliance                      │  │
│     │ • Data Quality Issues                            │  │
│     │ • Duplicate Entry                                │  │
│     │ • Company Closure                                │  │
│     │ • Product Discontinued                           │  │
│     │ • Other                                          │  │
│     │                                                   │  │
│     │ Detailed Explanation (Required):                │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Company has been closed and no longer         ││  │
│     │ │ operates. All products and SKUs should be     ││  │
│     │ │ deactivated.                                   ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ⚠️ Important Information:                        │  │
│     │ • This will create a deletion request            │  │
│     │ • Tier 1 must approve before deletion occurs     │  │
│     │ • Tier 2 Registrar will implement the deletion  │  │
│     │ • All deletions are kept for audit (7 years)    │  │
│     │ • Cascade effects will be applied automatically │  │
│     │                                                   │  │
│     │                      [Cancel]  [Request Deletion]│  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Component Specifications:**
- **Entity Selection:** Dropdown with search/filter
- **Reason Selection:** Dropdown with predefined reasons
- **Detailed Explanation:** Required textarea (minimum 50 characters)
- **Warning Section:** Info box explaining workflow and audit requirements
- **Action Button:** "Request Deletion" (orange/warning color)
```

#### 1.2.4 Update Overview Tab

**Location:** Around line 66-89 (Overview Tab - Pending Verifications widget)

**Add Note:**

```markdown
**Note:** Pending Verifications widget includes deletion requests. Deletion requests are shown with ⚠️ icon and "Deletion Request" badge.
```

---

### 1.3 task-0.5.1.32-audit-logs-list.md ⚠️ **CRITICAL**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md`

**Changes Required:**

#### 1.3.1 Update Audit Log Table Section

**Location:** Around line 89-122 (Audit Log Table section)

**Replace/Enhance:**

```markdown
### Audit Log Table (Enhanced per Fatima's Requirements)
- **Columns:** Timestamp, User, Action, Table, Record ID, Details
- **Sortable:** All columns
- **Pagination:** Page numbers or virtual scrolling
- **DELETE Operations Display (ENHANCED):**
  - **Operation Type:** Clearly show "DELETE" in Action column
  - **Deletion Workflow Steps:**
    - **DELETE_REQUEST:** "DELETE_REQUEST - [Entity Type] Deletion Requested"
      - Shows: Tier 2 Officer requested deletion
      - Details: "Requested by: [User], Entity: [Name], Reason: [Reason]"
    - **DELETE_APPROVED:** "DELETE_APPROVED - [Entity Type] Deletion Approved"
      - Shows: Tier 1 approved deletion and issued command
      - Details: "Approved by: [User], Command issued to Tier 2 Registrar"
    - **DELETE_IMPLEMENTED:** "DELETE_IMPLEMENTED - [Entity Type] Deletion Implemented"
      - Shows: Tier 2 Registrar implemented deletion (soft delete)
      - Details: "Implemented by: [User], Deactivated at: [Timestamp], Reason: [Reason]"
  - **Entity Type Display:**
    - Show entity type (Company/Product/SKU) prominently in Details column
    - Link to entity detail page (if entity still accessible)
  - **Old Values Display:**
    - For DELETE operations, show "Old Values: [View]" link
    - Clicking link expands to show preserved old_values JSON
    - Old values are mandatory for deletions (audit requirement)
  - **Deactivation Details:**
    - Show deactivated_at timestamp
    - Show deactivated_by (user who implemented)
    - Show deactivated_reason (mandatory justification)
  - **Cascade Effects:**
    - If company deletion, show: "Cascade: 5 products, 12 SKUs deactivated"
    - If product deletion, show: "Cascade: 3 SKUs deactivated"
- **Regulatory Reference Display (Fatima's Requirement):**
  - All entries show regulatory framework reference when applicable
  - Format: "DMP Art.[X]" or "Law No. 09-08" displayed in Details column
  - For deletions: Show regulatory basis if applicable
```

#### 1.3.2 Update Filters Section

**Location:** Around line 123-136 (Filters section)

**Add Filters:**

```markdown
### Filters (Enhanced per Fatima's Requirement)
- **Date Range:** Date picker
- **Table:** Dropdown (products, skus, companies, enforcement_actions, enforcement_action_appeals, regulatory_framework, etc.)
- **User:** User selector
- **Action:** CREATE, UPDATE, **DELETE** (NEW - explicit filter), APPROVE, EXECUTE, APPEAL, etc.
- **Entity Type Filter (NEW):** Filter by entity type (Company, Product, SKU) - for deletion operations
- **Deletion Workflow Status Filter (NEW):**
  - All
  - DELETE_REQUEST (Tier 2 Officer requested)
  - DELETE_APPROVED (Tier 1 approved)
  - DELETE_IMPLEMENTED (Tier 2 Registrar implemented)
- **Enforcement Filter (Optional):** Filter by enforcement action type (warning, fine, suspension) when table is enforcement_actions
- **Legal Basis Filter (Fatima's Requirement):** Filter by regulation article (DMP Art. 12, Art. 15, etc.)
- **Compliance Status Filter (Fatima's Requirement):** 
  - All
  - Compliant
  - Review Required
  - Non-Compliant
- **Regulatory Framework Change Filter (Fatima's Requirement):** Filter by regulatory framework updates
```

#### 1.3.3 Update Regulatory Compliance Information Section

**Location:** Around line 75-88 (Regulatory Compliance Information section)

**Add Note:**

```markdown
**Deletion Audit Information:**
- All deletion operations are logged with old_values preserved
- Deletion workflow steps (REQUEST, APPROVED, IMPLEMENTED) are tracked separately
- Deletion audit entries are retained for 7 years minimum (Law No. 09-08)
- No hard deletes are allowed for auditable records
```

---

### 1.4 task-0.5.1.33-audit-log-detail.md ⚠️ **CRITICAL**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md`

**Changes Required:**

#### 1.4.1 Update Log Entry Details Section

**Location:** Around line 68-80 (Log Entry Details section)

**Replace/Enhance:**

```markdown
### Log Entry Details (Enhanced for Deletion Operations)
- **Action:** CREATE, UPDATE, DELETE, APPROVE, EXECUTE, APPEAL
- **Table:** Table name (products, skus, companies, enforcement_actions, enforcement_action_appeals, etc.)
- **Record ID:** Record identifier
- **Old Values:** Previous state (JSON or formatted) - **MANDATORY for DELETE operations**
- **New Values:** New state (JSON or formatted) - For DELETE operations, shows deactivation fields
- **DELETE Operation Details (NEW - Prominently Displayed):**
  - **Action Badge:** "DELETE (Soft Delete/Deactivation)" - Red/warning color
  - **Entity Type:** [Company/Product/SKU] - Prominent badge
  - **Entity Name/Code:** Display name or code
  - **Old Values Section (REQUIRED):**
    - **Title:** "Old Values (Preserved for Audit)" - Emphasized
    - **Content:** Full JSON of entity before deletion
    - **Format:** Expandable JSON viewer with syntax highlighting
    - **Note:** "These values are preserved for 7-year audit retention (Law No. 09-08)"
  - **Deactivation Details Section:**
    - **deactivated_at:** Timestamp when deletion was implemented
    - **deactivated_by:** User who implemented deletion (Tier 2 Registrar)
    - **deactivated_reason:** Mandatory justification for deletion
  - **Cascade Effects Section (if applicable):**
    - **Title:** "Cascade Deactivation Effects"
    - **Content:**
      - If company deletion: "5 products deactivated, 12 SKUs deactivated"
      - If product deletion: "3 SKUs deactivated"
      - Links to cascade audit log entries
  - **Deletion Workflow Steps Section:**
    - **Title:** "Deletion Workflow Timeline"
    - **Steps:**
      1. **Request:** 
         - Who: Tier 2 Officer [Name]
         - When: [Timestamp]
         - Reason: [Reason from submission]
      2. **Verify:**
         - Who: Tier 2 Officer [Name]
         - When: [Timestamp]
         - Comments: [Verification comments]
      3. **Approve & Issue Command:**
         - Who: Tier 1 [Name]
         - When: [Timestamp]
         - Comments: [Approval comments]
         - Note: "Command issued to Tier 2 Registrar"
      4. **Implement:**
         - Who: Tier 2 Registrar [Name]
         - When: [Timestamp]
         - Action: Soft delete (deactivation) applied
         - Old values preserved in audit_logs
- **Related Entity Section (if enforcement_actions table):**
  - **Action Type:** Warning, Fine, Suspension
  - **Company:** Company name (link to company detail)
  - **Violation Type:** Brief description
  - **Status:** Workflow status (Draft, Pending Approval, Approved, Executed, etc.)
  - **Link:** "View Enforcement Action" button → Navigate to `/enforcement/actions/[id]`
```

#### 1.4.2 Update Compliance Information Section

**Location:** Around line 91-98 (Compliance Information section)

**Enhance:**

```markdown
### Compliance Information Section (Enhanced for Deletion Operations)
- **Retention Period:** Display retention period and expiration date (7 years from log entry date)
- **CNDP Compliance Notice:** "This audit log entry contains personal data protected under Law No. 09-08 (Protection of Personal Data)"
- **Data Subject Rights:** Information about data subject rights (if applicable to the log entry)
- **Regulatory Reference:** Link to regulatory framework document
- **Deletion-Specific Compliance Information (NEW):**
  - **Title:** "Deletion Audit Compliance"
  - **Content:**
    - "This deletion is kept for audit per regulatory requirements (Law No. 09-08)"
    - "Old values preserved for 7-year retention period"
    - "Soft delete (deactivation) applied - no hard delete performed"
    - "All deletion workflow steps are logged and immutable"
    - "Cascade deactivation effects are tracked in separate audit log entries"
  - **Visual:** Prominent info box with warning icon
- **Display:** Section within log detail card, below hash chain verification
- **Styling:** Info section with light background, clear labeling
```

---

### 1.5 task-0.5.1.30-history-overview.md ⚠️ **HIGH**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md`

**Changes Required:**

#### 1.5.1 Update History Timeline Section

**Location:** Around line 109-139 (History Timeline/List section)

**Add Deletion History Items:**

```markdown
**Deletion History Items (NEW):**
- **Format:** Timeline items for deletion workflow steps
- **Item 1: Deletion Requested**
  - **Title:** "Company Deletion Requested" or "Product Deletion Requested" or "SKU Deletion Requested"
  - **Icon:** ⚠️ Warning icon (red/orange)
  - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion"
  - **Details:**
    - Entity Type: Company/Product/SKU
    - Entity Name/Code: Display name or code
    - Requested by: Tier 2 Officer [Name]
    - Reason: [Deletion reason]
  - **Timestamp:** When deletion was requested
  - **Link:** "View Submission" → Navigate to `/rmm/submissions/[id]`
- **Item 2: Deletion Approved**
  - **Title:** "Company Deletion Approved" or "Product Deletion Approved" or "SKU Deletion Approved"
  - **Icon:** ✅ Approval icon (green)
  - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion Approval"
  - **Details:**
    - Entity Type: Company/Product/SKU
    - Entity Name/Code: Display name or code
    - Approved by: Tier 1 [Name]
    - Note: "Command issued to Tier 2 Registrar"
  - **Timestamp:** When deletion was approved
  - **Link:** "View Submission" → Navigate to `/rmm/submissions/[id]`
- **Item 3: Deletion Implemented**
  - **Title:** "Company Deletion Implemented" or "Product Deletion Implemented" or "SKU Deletion Implemented"
  - **Icon:** 🗑️ Delete icon (red)
  - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion Implementation"
  - **Details:**
    - Entity Type: Company/Product/SKU
    - Entity Name/Code: Display name or code
    - Implemented by: Tier 2 Registrar [Name]
    - Deactivation: Soft delete applied
    - Old Values: "[View Old Values]" → Link to audit log detail showing preserved old_values
    - Cascade Effects: "5 products, 12 SKUs deactivated" (if company deletion)
  - **Timestamp:** When deletion was implemented
  - **Links:**
    - "View Audit Log" → Navigate to `/audit/logs/[id]`
    - "View Old Values" → Navigate to audit log detail with old_values expanded
```

#### 1.5.2 Update Filters Section

**Location:** Around line 102-108 (Filters Sidebar section)

**Add Filters:**

```markdown
**Filter Sections:**
- **Type Filter:**
  - Checkboxes: All, Submission, Breach, Export Request, Enforcement Action, **Deletion** (NEW), Appeal, etc.
  - Default: All selected
- **Entity Filter:**
  - Checkboxes: All, Product, SKU, Company, Enforcement Action, etc.
  - **Deletion Entity Filter (NEW):** When Type = Deletion, filter by:
    - All Deletions
    - Company Deletions
    - Product Deletions
    - SKU Deletions
- **Company Filter:**
  - Checkboxes: All companies (MOH) or own company (Company users)
- **Deletion Workflow Status Filter (NEW):**
  - All Deletion Steps
  - Deletion Requested
  - Deletion Approved
  - Deletion Implemented
```

---

### 1.6 task-0.5.1.22-profile-page.md ⚠️ **HIGH**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md`

**Changes Required:**

#### 1.6.1 Update Account Actions Section

**Location:** Around line 234-254 (Account Actions Section)

**Replace "Delete Account" Button Section:**

```markdown
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
```

#### 1.6.2 Add Account Deactivation Confirmation Modal

**Location:** After line 287 (after Annotations section, before Responsive Behavior)

**Add New Modal:**

```markdown
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
```

**Add Note in Implementation Notes:**

```markdown
**⚠️ IMPORTANT:** User deletion/deactivation workflow is not yet fully defined in the registry submission model. This wireframe reflects the intended workflow, but the actual implementation may vary based on the final workflow decision (see RMM-CRUD-DELETION-REVIEW.md Section 3.2).
```

---

### 1.7 task-0.5.1.35-system-configuration.md ⚠️ **HIGH**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.35-system-configuration.md`

**Changes Required:**

#### 1.7.1 Add User Management Section

**Location:** After line 141 (after Regulatory Compliance Section, before Action Buttons)

**Add New Section:**

```markdown
│ ┌─────────────────────────────────────────────────────────┐│
│ │ User Management (If User Deletion Handled Here)          ││
│ │                                                          ││
│ │ ⚠️ Note: User deletion/deactivation workflow is being   ││
│ │    finalized. This section will be implemented based on ││
│ │    the decided workflow.                                ││
│ │                                                          ││
│ │ [If User Deletion Workflow Decided:]                    ││
│ │                                                          ││
│ │ User List                                                ││
│ │ [Filter: All | MOH Users | Company Users | Active | Inactive]││
│ │ [Search Users...]                                        ││
│ │                                                          ││
│ │ User: John Doe (john.doe@company.com)                   ││
│ │   Role: Company User  Company: ABC Pharma               ││
│ │   Status: Active                                        ││
│ │   Actions: [View] [Edit] [Request Deactivation]         ││
│ │                                                          ││
│ │ User: Jane Smith (jane.smith@moh.gov.ma)                ││
│ │   Role: MOH Tier 2 Officer                             ││
│ │   Status: Active                                        ││
│ │   Actions: [View] [Edit] [Request Deactivation]         ││
│ │                                                          ││
│ │ Pending Deactivation Requests (3)                       ││
│ │ • User: John Doe                                        ││
│ │   Requested by: Officer A (Tier 2 Officer)             ││
│ │   Status: Awaiting Tier 1 Approval                      ││
│ │   [Approve] [Reject] [View Details]                     ││
│ │                                                          ││
│ │ • User: Jane Smith                                      ││
│ │   Requested by: Officer B (Tier 2 Officer)             ││
│ │   Status: Awaiting Tier 1 Approval                      ││
│ │   [Approve] [Reject] [View Details]                     ││
│ │                                                          ││
│ │ Deactivation History                                     ││
│ │ • User: Bob Johnson                                     ││
│ │   Deactivated: 2025-01-10                               ││
│ │   Implemented by: Registrar C (Tier 2 Registrar)      ││
│ │   Reason: User Request                                  ││
│ │   [View Audit Log]                                       ││
│ │                                                          ││
│ │ [View All Users] [Export User List]                      ││
│ └─────────────────────────────────────────────────────────┘│
```

**Component Specifications:**

```markdown
### User Management Section (Conditional - If User Deletion Handled Here)
- **Visibility:** Only if user deletion/deactivation is handled in system configuration
- **Layout:** Full-width card section
- **User List:**
  - Table/list of all users (MOH and Company)
  - Columns: Name, Email, Role, Company, Status, Actions
  - Filters: Role, Company, Status (Active/Inactive)
  - Search: Full-text search by name/email
- **Actions:**
  - **[Request Deactivation]:** Opens deletion request modal (Tier 2 Officer only)
  - **[Approve Deactivation]:** Approves pending deactivation request (Tier 1 only)
  - **[Implement Deactivation]:** Implements approved deactivation (Tier 2 Registrar only)
  - **[View]:** View user details
  - **[Edit]:** Edit user information
- **Pending Deactivation Requests:**
  - List of pending deactivation requests
  - Shows: User, Requested by, Status, Actions
  - Actions: Approve, Reject, View Details
- **Deactivation History:**
  - List of completed deactivations
  - Shows: User, Deactivated date, Implemented by, Reason
  - Link to audit log entry
- **Workflow Display:**
  - Shows deletion workflow: Request → Approve → Implement
  - Shows audit trail links
  - Shows deactivation reason (mandatory)
- **Cascade Effects:**
  - If user deactivation affects company access, show cascade information
- **Note:** This section is conditional based on workflow decision. If user deletion is handled elsewhere, show note: "User management handled in [location]. See [link]."
```

**Add Note in Wireframe:**

```markdown
**⚠️ IMPLEMENTATION NOTE:** User deletion/deactivation workflow is not yet fully defined. This section should be implemented only after the workflow decision is made (see RMM-CRUD-DELETION-REVIEW.md Section 3.2). If user deletion is handled elsewhere (e.g., separate user management module), this section should show a note directing users to the correct location.
```

---

### 1.8 task-0.5.1.31-notifications-page.md ⚠️ **MINOR**

**File Path:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md`

**Changes Required:**

#### 1.8.1 Update Notification List Section

**Location:** Around line 126-151 (Notification List section)

**Add Deletion Notification Types:**

```markdown
**Deletion Notifications (NEW):**
- **Deletion Request Created:**
  - **Title:** "Deletion Request Created - [Entity Type]: [Entity Name]"
  - **Message:** "A deletion request has been created for [Entity Type] [Entity Name] by [Tier 2 Officer Name]"
  - **Priority:** 🟡 HIGH (yellow border)
  - **Action:** Navigate to `/rmm/submissions/[id]` (Tier 1 users)
  - **Timestamp:** When deletion request was created
- **Deletion Request Verified:**
  - **Title:** "Deletion Request Verified - [Entity Type]: [Entity Name]"
  - **Message:** "Deletion request for [Entity Type] [Entity Name] has been verified by [Tier 2 Officer Name]"
  - **Priority:** 🟡 HIGH (yellow border)
  - **Action:** Navigate to `/rmm/submissions/[id]` (Tier 1 users)
  - **Timestamp:** When deletion request was verified
- **Deletion Request Approved:**
  - **Title:** "Deletion Request Approved - [Entity Type]: [Entity Name]"
  - **Message:** "Deletion request for [Entity Type] [Entity Name] has been approved by [Tier 1 Name]. Command issued to Tier 2 Registrar."
  - **Priority:** 🔴 URGENT (red border)
  - **Action:** Navigate to `/rmm/submissions/[id]` (Tier 2 Registrar users)
  - **Timestamp:** When deletion request was approved
- **Deletion Request Implemented:**
  - **Title:** "Deletion Implemented - [Entity Type]: [Entity Name]"
  - **Message:** "Deletion for [Entity Type] [Entity Name] has been implemented by [Tier 2 Registrar Name]. Entity deactivated (soft delete)."
  - **Priority:** ⚪ NORMAL
  - **Action:** Navigate to `/audit/logs/[id]` (all users)
  - **Timestamp:** When deletion was implemented
  - **Audit Link:** "View Audit Log" button
```

#### 1.8.2 Update Filters Section

**Location:** Around line 152-184 (Filters section)

**Add Filter:**

```markdown
- **Type:** Submission, Breach, Message, Workflow, Enforcement Action, Appeal, Threshold Reversion, **Deletion** (NEW), System
```

---

## Phase 2: Database Changes

### 2.1 Database Schema Review

**Status:** ✅ **NO CHANGES REQUIRED**

**Verification:**
- `registry_submissions.submission_type` already includes `company_delete`, `product_delete`, `sku_delete` ✅
- `companies`, `products`, `skus` tables already have `deactivated_at`, `deactivated_by`, `deactivated_reason` columns ✅
- `audit_logs` table already supports DELETE operations with `old_values` ✅
- Cascade deactivation logic is already specified in Task 1.1.2.13 ✅

**Action Required:** None - database schema already supports deletion workflow.

---

## Phase 3: API Changes

### 3.1 RPC Function Documentation Updates

**File Path:** `docs/02-architecture/api/rpc-functions.md`

**Changes Required:**

#### 3.1.1 Update rmm_submit_registry_update Documentation

**Location:** Around line 120-135

**Add Deletion Subsection:**

```markdown
### rmm_submit_registry_update(...)

**Purpose:** Submit registry update (company, product, SKU) **including deletion requests**.

**Parameters:**
- `submission_type` (text) - Submission type (company_create, company_update, company_delete, product_create, product_update, product_delete, sku_create, sku_update, sku_delete)
- `entity_type` (text) - Entity type (company, product, sku)
- `entity_id` (uuid) - Entity ID (for updates/deletes) - **Required for deletion requests**
- `submission_data` (jsonb) - Submission data (JSON) - **For deletion requests, must include:**
  - `reason` (text, required) - Reason for deletion
  - `detailed_explanation` (text, optional) - Detailed explanation

**Returns:** JSON with submission data

**State Transition:** `draft` → `submitted`

**Deletion Requests:**
- **Who can create:** Tier 2 Officer (or Company for their own entities, if allowed)
- **Submission Type:** `company_delete`, `product_delete`, or `sku_delete`
- **Required Fields:**
  - `entity_id`: Must reference existing entity
  - `submission_data.reason`: Mandatory reason for deletion
- **Workflow:** Deletion request follows same workflow as other submissions:
  1. Created in `draft` status
  2. Submitted → `submitted` status
  3. Tier 2 Officer verifies → `tier2_verified` status
  4. Tier 1 approves → `tier1_approved` status (issues command)
  5. Tier 2 Registrar implements → `tier2_implemented` status → applies soft delete
  6. Completed → `completed` status
- **Audit:** All steps logged; final deletion logged with old_values preserved
```

#### 3.1.2 Update rmm_verify_registry_submission Documentation

**Location:** Around line 136-152

**Add Note:**

```markdown
**Deletion Requests:**
- Tier 2 Officer can verify deletion requests
- Verification confirms deletion request is valid and properly documented
- After verification, deletion request moves to Tier 1 for approval
```

#### 3.1.3 Update rmm_approve_registry_submission Documentation

**Location:** Around line 154-169

**Add Note:**

```markdown
**Deletion Requests:**
- Tier 1 approval of deletion request is the "issue the command" step
- Approval authorizes Tier 2 Registrar to implement the deletion
- After approval, deletion request moves to Tier 2 Registrar for implementation
```

#### 3.1.4 Update rmm_implement_registry_update Documentation

**Location:** Around line 172-177

**Enhance Documentation (Already Updated in Previous Review):**

```markdown
### rmm_implement_registry_update(submission_id uuid)

**Purpose:** Tier 2 Registrar implements registry update (including approved deletions).

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** JSON with updated submission

**State Transition:** `tier1_approved` → `tier2_implemented`

**Validation:**
- User must be Tier 2 Registrar
- Submission must be in `tier1_approved` status

**Deletion Implementation:**
When `submission_type` is `company_delete`, `product_delete`, or `sku_delete`:
1. **Soft Delete Applied:**
   - Sets `deactivated_at` = current timestamp
   - Sets `deactivated_by` = implementing user (Tier 2 Registrar)
   - Sets `deactivated_reason` = reason from submission_data
2. **Cascade Deactivation:**
   - Company deletion → deactivates all products and SKUs for that company
   - Product deletion → deactivates all SKUs for that product
   - SKU deletion → no cascade (leaf entity)
3. **Audit Log Entry:**
   - Creates audit_log entry with:
     - `operation_type` = 'DELETE'
     - `table_name` = entity table (companies/products/skus)
     - `record_id` = entity ID
     - `old_values` = full entity data before deletion (JSONB) - **MANDATORY**
     - `new_values` = deactivation fields (deactivated_at, deactivated_by, deactivated_reason)
     - `user_id` = implementing user
     - `metadata` = submission_id, cascade effects, etc.
4. **Submission Status:**
   - Updates submission status to `tier2_implemented`
   - Marks submission as completed
5. **No Hard Deletes:**
   - Entity record remains in database
   - Only deactivation fields are set
   - All data preserved for audit (7-year retention)

**Deletions are kept for audit:** All deletion operations are logged with old_values preserved per audit-logging-spec.md requirements.
```

---

## Phase 4: Feature Index Updates

### 4.1 Update Company Management Feature Section

**File Path:** `docs/02-architecture/feature-index.md`

**Location:** Around line 193-208 (Company Management section)

**Add Deletion Feature:**

```markdown
### Company Management {#company-management}

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Companies List | `/rmm/companies` | task-0.5.2.2 ✅ | `companies` | `rmm_list_companies`, `rmm_get_company` | ⚠️ | Emma | 1.1.2 |
| Company Detail | `/rmm/companies/[id]` | task-0.5.2.3 ✅ | `companies`, `products`, `registry_submissions` | `rmm_get_company`, `rmm_list_company_products`, `rmm_get_company_history` | ⚠️ | Emma | 1.1.2 |
| Create Company | `/rmm/companies/new` | task-0.5.2.8 ✅ | `companies`, `registry_submissions` | `rmm_create_company`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit Company | `/rmm/companies/[id]/edit` | task-0.5.2.8 ✅ | `companies`, `registry_submissions` | `rmm_update_company`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| **Delete Company** | **N/A (Modal/Action)** | **task-0.5.1.19 ✅, task-0.5.1.20 ✅** | **`companies`, `registry_submissions`, `audit_logs`** | **`rmm_submit_registry_update` (company_delete), `rmm_verify_registry_submission`, `rmm_approve_registry_submission`, `rmm_implement_registry_update`** | **⚠️** | **Emma** | **1.1.2** |
| RMM Overview | `/rmm` | task-0.5.2.16 ✅ | `companies`, `products`, `skus`, `registry_submissions` | `rmm_get_overview_stats` | ⚠️ | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Company Wireframes](../../04-design/user-experience/wireframes/01-rmm/companies/)
- Database: [companies table](./database/data-dictionary.md#companies), [registry_submissions table](./database/data-dictionary.md#registry-submissions)
- APIs: [rmm_create_company](./api/rpc-functions.md#rmm_create_company), [rmm_submit_registry_update](./api/rpc-functions.md#rmm_submit_registry_update)
- **Deletion Workflow:** [RMM-CRUD-DELETION-REVIEW.md](../../05-project-management/phase-1-1-rmm/RMM-CRUD-DELETION-REVIEW.md#31-company)
```

### 4.2 Update Product Management Feature Section

**Location:** Around line 211-225 (Product Management section)

**Add Deletion Feature:**

```markdown
### Product Management

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Products List | `/rmm/products` | task-0.5.2.4 ✅ | `products`, `companies` | `rmm_list_products`, `rmm_get_product` | ⚠️ | Emma | 1.1.2 |
| Product Detail | `/rmm/products/[id]` | task-0.5.2.5 ✅ | `products`, `skus`, `registry_submissions` | `rmm_get_product`, `rmm_list_product_skus`, `rmm_get_product_history` | ⚠️ | Emma | 1.1.2 |
| Create Product | `/rmm/products/new` | task-0.5.2.9 ✅ | `products`, `registry_submissions` | `rmm_create_product`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit Product | `/rmm/products/[id]/edit` | task-0.5.2.9 ✅ | `products`, `registry_submissions` | `rmm_update_product`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| **Delete Product** | **N/A (Modal/Action)** | **task-0.5.1.19 ✅, task-0.5.1.20 ✅** | **`products`, `registry_submissions`, `audit_logs`** | **`rmm_submit_registry_update` (product_delete), `rmm_verify_registry_submission`, `rmm_approve_registry_submission`, `rmm_implement_registry_update`** | **⚠️** | **Emma** | **1.1.2** |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Product Wireframes](../../04-design/user-experience/wireframes/01-rmm/products/)
- Database: [products table](./database/data-dictionary.md#products)
- APIs: [rmm_create_product](./api/rpc-functions.md#rmm-module-functions)
- **Deletion Workflow:** [RMM-CRUD-DELETION-REVIEW.md](../../05-project-management/phase-1-1-rmm/RMM-CRUD-DELETION-REVIEW.md#34-products)
```

### 4.3 Update SKU Management Feature Section

**Location:** Around line 228-242 (SKU Management section)

**Add Deletion Feature:**

```markdown
### SKU Management {#sku-management}

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| SKUs List | `/rmm/skus` | task-0.5.2.6 ✅ | `skus`, `products` | `rmm_list_skus`, `rmm_get_sku` | ⚠️ | Emma | 1.1.2 |
| SKU Detail | `/rmm/skus/[id]` | task-0.5.2.7 ✅ | `skus`, `registry_submissions`, `thresholds` | `rmm_get_sku`, `rmm_get_sku_history`, `vci_get_sku_thresholds` | ⚠️ | Emma | 1.1.2 |
| Create SKU | `/rmm/skus/new` | task-0.5.2.10 ✅ | `skus`, `registry_submissions` | `rmm_create_sku`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit SKU | `/rmm/skus/[id]/edit` | task-0.5.2.10 ✅ | `skus`, `registry_submissions` | `rmm_update_sku`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| **Delete SKU** | **N/A (Modal/Action)** | **task-0.5.1.19 ✅, task-0.5.1.20 ✅** | **`skus`, `registry_submissions`, `audit_logs`** | **`rmm_submit_registry_update` (sku_delete), `rmm_verify_registry_submission`, `rmm_approve_registry_submission`, `rmm_implement_registry_update`** | **⚠️** | **Emma** | **1.1.2** |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [SKU Wireframes](../../04-design/user-experience/wireframes/01-rmm/skus/)
- Database: [skus table](./database/data-dictionary.md#skus)
- APIs: [rmm_create_sku](./api/rpc-functions.md#rmm-module-functions)
- **Deletion Workflow:** [RMM-CRUD-DELETION-REVIEW.md](../../05-project-management/phase-1-1-rmm/RMM-CRUD-DELETION-REVIEW.md#35-skus)
```

### 4.4 Update Registry Submission Workflow Feature Section

**Location:** Around line 245-260 (Registry Submission Workflow section)

**Add Deletion Workflow Note:**

```markdown
### Registry Submission Workflow

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Registry Submissions List | `/rmm/submissions` | task-0.5.2.11 ✅ | `registry_submissions` | `rmm_list_submissions`, `rmm_get_submission` | ⚠️ | Emma | 1.1.2 |
| Registry Submission Detail | `/rmm/submissions/[id]` | task-0.5.2.12 ✅ | `registry_submissions`, `approval_history` | `rmm_get_submission`, `rmm_get_approval_history` | ⚠️ | Emma | 1.1.2 |
| Verify Submission (Tier 2) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_verify_registry_submission` | ⚠️ | Emma | 1.1.2 |
| Approve Submission (Tier 1) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_approve_registry_submission` | ⚠️ | Emma | 1.1.2 |
| Implement Submission (Tier 2 Registrar) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_implement_registry_update` | ⚠️ | Emma | 1.1.2 |
| **Deletion Workflow** | **N/A (Integrated)** | **task-0.5.1.19 ✅, task-0.5.1.20 ✅** | **`registry_submissions`, `audit_logs`** | **Same as above (submission_type = *_delete)** | **⚠️** | **Emma** | **1.1.2** |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Registry Workflow Wireframes](../../04-design/user-experience/wireframes/01-rmm/workflow/)
- Database: [registry_submissions table](./database/data-dictionary.md#registry-submissions), [approval_history table](./database/data-dictionary.md#approval-history)
- APIs: [rmm workflow functions](./api/rpc-functions.md#rmm_verify_registry_submission), [workflow architecture](./workflow-architecture.md)
- **Deletion Workflow:** [RMM-CRUD-DELETION-REVIEW.md](../../05-project-management/phase-1-1-rmm/RMM-CRUD-DELETION-REVIEW.md#4-deletion-workflow-unified), [registry-workflow.md](../../05-project-management/features/rmm/registry-workflow.md#deletion-workflow-company-product-sku)
```

### 4.5 Update Global Pages Feature Section

**Location:** Around line 171-182 (Global Pages section)

**Enhance Audit Logs Features:**

```markdown
| Audit Logs List | `/audit/logs` | task-0.5.1.32 ✅ | `audit_logs` | `shared_get_audit_logs`, `shared_get_audit_log_detail` | ⚠️ | Emma | 1.1.7 |
| Audit Log Detail | `/audit/logs/[id]` | task-0.5.1.33 ✅ | `audit_logs` | `shared_get_audit_log_detail` | ⚠️ | Emma | 1.1.7 |
```

**Add Note:**

```markdown
**Note:** Audit Logs List and Detail pages now explicitly support deletion audit entries with old_values display, deletion workflow steps, and deactivation details. See [WIREFRAMES-CRUD-DELETION-REVIEW.md](../../05-project-management/phase-1-1-rmm/WIREFRAMES-CRUD-DELETION-REVIEW.md) for deletion-specific updates.
```

---

## Implementation Checklist

### Phase 1: Wireframe Updates (Emma) ✅ **COMPLETE**

- [x] **1.1** Update task-0.5.1.19-moh-tier1-dashboard.md
  - [x] Add deletion requests to Pending Approvals widget
  - [x] Add deletion approval modal design
  - [x] Update Enforcement and Compliance tab notes
- [x] **1.2** Update task-0.5.1.20-moh-tier2-dashboard.md
  - [x] Add deletion request creation to Verification tab
  - [x] Add Request Deletion modal design
  - [x] Update Quick Actions bar
  - [x] Update Overview tab notes
- [x] **1.3** Update task-0.5.1.32-audit-logs-list.md
  - [x] Enhance DELETE operations display
  - [x] Add deletion workflow filters
  - [x] Update regulatory compliance information
- [x] **1.4** Update task-0.5.1.33-audit-log-detail.md
  - [x] Enhance DELETE operation details
  - [x] Add deletion workflow steps display
  - [x] Update compliance information section
- [x] **1.5** Update task-0.5.1.30-history-overview.md
  - [x] Add deletion history items to timeline
  - [x] Add deletion filters
- [x] **1.6** Update task-0.5.1.22-profile-page.md
  - [x] Update Delete Account button with workflow explanation
  - [x] Add account deactivation confirmation modal
  - [x] Add implementation note about workflow gap
- [x] **1.7** Update task-0.5.1.35-system-configuration.md
  - [x] Add User Management section (conditional)
  - [x] Add implementation note about workflow decision
- [x] **1.8** Update task-0.5.1.31-notifications-page.md
  - [x] Add deletion notification types
  - [x] Update filters

### Phase 2: Database Changes (Nadia) ✅ **COMPLETE**

- [x] **2.1** Verify database schema supports deletion workflow
  - [x] Confirm `registry_submissions.submission_type` includes deletion types ✅
  - [x] Confirm `companies`, `products`, `skus` have deactivation fields ✅ (companies use suspended_*; products/skus have deactivated_*)
  - [x] Confirm `audit_logs` supports DELETE operations ✅
  - [x] **Result:** No changes required ✅

**Verification report:** [PHASE-2-DATABASE-VERIFICATION.md](./PHASE-2-DATABASE-VERIFICATION.md)

### Phase 3: API Documentation Updates (Maya) ✅ **COMPLETE**

- [x] **3.1** Update rpc-functions.md
  - [x] Enhance `rmm_submit_registry_update` documentation with deletion subsection
  - [x] Add deletion notes to `rmm_verify_registry_submission`
  - [x] Add deletion notes to `rmm_approve_registry_submission`
  - [x] Enhance `rmm_implement_registry_update` documentation (deletion implementation details)

**Completion report:** [PHASE-3-API-DOCUMENTATION-COMPLETE.md](./PHASE-3-API-DOCUMENTATION-COMPLETE.md)

### Phase 4: Feature Index Updates (Yasmine/Emma) ✅ **COMPLETE**

- [x] **4.1** Update Company Management section
  - [x] Add Delete Company feature row
  - [x] Add deletion workflow link to Related Documentation
- [x] **4.2** Update Product Management section
  - [x] Add Delete Product feature row
  - [x] Add deletion workflow link to Related Documentation
- [x] **4.3** Update SKU Management section
  - [x] Add Delete SKU feature row
  - [x] Add deletion workflow link to Related Documentation
- [x] **4.4** Update Registry Submission Workflow section
  - [x] Add Deletion Workflow feature row
  - [x] Add deletion workflow links to Related Documentation
- [x] **4.5** Update Global Pages section
  - [x] Add note about deletion support in audit logs

**Completion report:** [PHASE-4-FEATURE-INDEX-COMPLETE.md](./PHASE-4-FEATURE-INDEX-COMPLETE.md)

### Phase 5: Review & Approval (Fatima) ✅ **COMPLETE**

- [x] **5.1** Review all wireframe updates for compliance
  - [x] All 8 wireframes reviewed against compliance checklist
  - [x] All wireframes meet regulatory requirements
- [x] **5.2** Verify deletion workflow matches regulatory requirements
  - [x] Two-person rule verified (Tier 2 Officer → Tier 1 → Tier 2 Registrar)
  - [x] Audit requirements verified (old_values, 7-year retention)
  - [x] Soft delete verified (no hard deletes)
  - [x] Regulatory references verified (Law No. 09-08, DMP regulations)
- [x] **5.3** Approve implementation plan
  - [x] All phases completed successfully
  - [x] Implementation plan addresses all identified issues
- [x] **5.4** Sign off on wireframe changes
  - [x] All wireframe changes approved
  - [x] API documentation approved
  - [x] Feature index approved
  - [x] Conditional sections appropriately noted

**Review & Approval Report:** [PHASE-5-COMPLIANCE-REVIEW-APPROVAL.md](./PHASE-5-COMPLIANCE-REVIEW-APPROVAL.md)

---

## Dependencies & Prerequisites

### Before Starting Implementation

1. **User Deletion Workflow Decision** ⚠️ **BLOCKER for Profile Page and System Configuration**
   - **Status:** Not yet decided (see RMM-CRUD-DELETION-REVIEW.md Section 3.2)
   - **Action Required:** Decide workflow (separate workflow or Tier-1-only with two-person rule)
   - **Impact:** Blocks updates to task-0.5.1.22-profile-page.md and task-0.5.1.35-system-configuration.md
   - **Workaround:** Wireframes can be updated with conditional notes pending workflow decision

2. **Registry Submission Workflow Implementation**
   - **Status:** Functions exist, documentation needs enhancement
   - **Action Required:** Verify functions handle `*_delete` submission types correctly
   - **Impact:** Low - functions already support deletion types

3. **Audit Logging Implementation**
   - **Status:** Audit logging spec exists, implementation may need verification
   - **Action Required:** Verify audit_logs table and triggers support DELETE operations with old_values
   - **Impact:** Low - spec already requires old_values for deletions

---

## Testing & Validation

### Wireframe Review Checklist

For each updated wireframe, verify:
- [ ] Deletion workflow is clearly explained
- [ ] Role-based actions are correctly assigned (Tier 2 Officer → Tier 1 → Tier 2 Registrar)
- [ ] Audit requirements are emphasized (old_values, 7-year retention)
- [ ] Cascade effects are shown (if applicable)
- [ ] Regulatory compliance information is included
- [ ] Visual distinction for deletion actions (warning icons, colors)
- [ ] Confirmation modals include required information
- [ ] Links to audit logs and related entities are present

### API Documentation Review Checklist

- [ ] All RPC functions document deletion support
- [ ] Deletion workflow steps are clearly explained
- [ ] Required parameters for deletion requests are specified
- [ ] Audit requirements are mentioned
- [ ] Cascade effects are documented

### Feature Index Review Checklist

- [ ] All deletion features are added to appropriate sections
- [ ] Wireframe references are correct
- [ ] Database table references are correct
- [ ] API function references are correct
- [ ] Links to deletion workflow documentation are included

---

## Timeline Estimate

| Phase | Task | Owner | Estimated Time | Dependencies |
|-------|------|-------|----------------|--------------|
| **Phase 1** | Wireframe Updates (8 files) | Emma | 8-12 hours | None |
| **Phase 2** | Database Verification | Nadia | 0.5 hours | None (no changes) |
| **Phase 3** | API Documentation | Maya | 1-2 hours | None |
| **Phase 4** | Feature Index Updates | Yasmine/Emma | 1 hour | Phase 1 complete |
| **Phase 5** | Review & Approval | Fatima | 2-4 hours | All phases complete |
| **Total** | | | **12.5-19.5 hours** | |

---

## Risk Mitigation

### Risk 1: User Deletion Workflow Not Decided

**Impact:** Blocks Profile Page and System Configuration wireframe updates  
**Mitigation:** 
- Update wireframes with conditional notes
- Mark sections as "pending workflow decision"
- Proceed with other wireframes that don't depend on user deletion

### Risk 2: Deletion Workflow Implementation Gaps

**Impact:** Wireframes may not match actual implementation  
**Mitigation:**
- Review existing RPC function implementations
- Verify deletion types are handled in all workflow functions
- Update wireframes based on actual implementation if needed

### Risk 3: Audit Logging Gaps

**Impact:** Deletion audit entries may not show correctly  
**Mitigation:**
- Verify audit_logs table structure
- Test DELETE operation logging
- Ensure old_values are captured and stored

---

## Success Criteria

✅ **Wireframes Updated:**
- All 8 wireframes updated with deletion workflow details
- Deletion actions clearly visible and accessible
- Audit requirements emphasized

✅ **API Documentation Complete:**
- All RPC functions document deletion support
- Deletion workflow clearly explained

✅ **Feature Index Updated:**
- Deletion features added to Company, Product, SKU sections
- Registry Submission Workflow section includes deletion
- Audit Logs sections note deletion support

✅ **Compliance Verified:**
- Fatima approves all changes
- Regulatory requirements met
- Audit requirements satisfied

---

## Related Documents

- [WIREFRAMES-CRUD-DELETION-REVIEW.md](./WIREFRAMES-CRUD-DELETION-REVIEW.md) - Wireframe review findings
- [RMM-CRUD-DELETION-REVIEW.md](./RMM-CRUD-DELETION-REVIEW.md) - Deletion logic requirements
- [feature-index.md](../../02-architecture/feature-index.md) - Feature tracking
- [rpc-functions.md](../../02-architecture/api/rpc-functions.md) - API specifications
- [registry-workflow.md](../features/rmm/registry-workflow.md) - Registry workflow documentation
- [audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md) - Audit requirements

---

**Last Updated:** 2026-01-28  
**Status:** ✅ **ALL PHASES COMPLETE** — Implementation Fully Approved  
**Next Steps:** 
- ✅ Phase 1: Wireframe Updates - **COMPLETE** (2026-01-28)
- ✅ Phase 2: Database Verification (Nadia) - **COMPLETE** (2026-01-28) – No migration required
- ✅ Phase 3: API Documentation Updates (Maya) - **COMPLETE** (2026-01-28)
- ✅ Phase 4: Feature Index Updates (Yasmine/Emma) - **COMPLETE** (2026-01-28)
- ✅ Phase 5: Review & Approval (Fatima) - **COMPLETE** (2026-01-28) — All changes approved

**🎉 Implementation Complete:** All CRUD/deletion workflow changes have been implemented, verified, and approved. Ready for development.
