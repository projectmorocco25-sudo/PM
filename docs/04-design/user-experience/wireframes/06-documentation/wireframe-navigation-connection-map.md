# Wireframe Navigation & Connection Map

**Purpose:** Complete mapping of all navigation connections between wireframes, showing how users move between pages through links, buttons, tabs, and workflow actions.

**Last Updated:** 2025-01-22  
**Status:** ✅ Complete  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This document maps all navigation connections between the 120 wireframes, showing:
- **Primary Navigation:** Sidebar/menu navigation
- **Dashboard Connections:** Links from dashboard pages
- **List-to-Detail:** Navigation from list pages to detail pages
- **Detail Page Actions:** Actions within detail pages
- **Workflow Connections:** State transitions and workflow navigation
- **Cross-Module Connections:** Links between different modules
- **Tab Navigation:** Tabs within detail pages

**Visual Flow Diagram:** See [Miro Flow Diagram](#miro-flow-diagram) section below.

---

## Navigation Categories

### 1. Primary Navigation (Sidebar/Menu)

All dashboard pages include sidebar navigation with these main sections:

**Global Section:**
- 🏠 Dashboard → `/dashboard` (role-based)
- 💬 Communications → `/communications/inbox`
- 📜 Regulatory Activity History → `/history`
- 🔔 Notifications → `/notifications`
- 🔍 Audit → `/audit/logs` (MOH/Auditors only)

**RMM Module:**
- 📊 Overview → `/rmm`
- 🏢 Companies → `/rmm/companies`
- 📦 Products → `/rmm/products`
- 🏷️ SKUs → `/rmm/skus`

**VCI Module:**
- 📊 Dashboard → `/vci`
- 📝 Submissions → `/vci/submissions/aams` (or `/msq`, `/wsl`)
- ⚙️ Thresholds → `/vci/thresholds` (MOH Tier 1 only)
- ⚠️ Compliance Violations → `/vci/breaches`
- 📈 Governance → `/vci/governance` (MOH only)

**ECS Module:**
- 📊 Overview → `/ecs`
- 📤 Export Authorization Requests → `/ecs/requests`
- ✅ Export Authorizations → `/ecs/authorizations`

**CMC Module:**
- 📊 Overview → `/cmc`
- 📊 Regulatory Compliance Ratings → `/cmc/scores`
- ⚖️ Compliance Disputes → `/cmc/disputes`
- 📄 Compliance Monitoring Reports → `/cmc/reports`

**Enforcement Module:**
- 📊 Dashboard → `/enforcement`
- ⚖️ Actions → `/enforcement/actions`
- ✅ Pending Regulatory Approvals → `/enforcement/pending-approvals`
- 📄 Enforcement Activity Reports → `/enforcement/reports`

**Help & Info:**
- ❓ Support Center → `/support`
- 📚 FAQ → `/support/faq`
- 📖 Documentation → `/support/documentation`
- 📞 Contact Support → `/support/contact`

---

### 2. Dashboard Connections

#### Company Dashboard (Task 0.5.1.18)
**Route:** `/dashboard` (Company role)

**Navigation Connections:**
- "View All Submissions" button → `/rmm/submissions`
- "View Pending Approvals" button → `/rmm/submissions?status=pending`
- Click on submission card → `/rmm/submissions/[id]`
- "View Enforcement Actions" button → `/enforcement/actions?company=my-company`
- "View All Enforcement Actions" link → `/enforcement/actions?company=my-company`
- Click on enforcement action card → `/enforcement/actions/[id]`
- "View Compliance Score" button → `/cmc/scores/my-score`
- "View All" links in widgets → Respective list pages
- "Quick Actions" dropdown → Various create/edit forms
- Tab: "Submissions" → Shows submission list inline
- Tab: "Enforcement" → Shows enforcement actions inline
- Tab: "Activity" → Shows activity timeline inline

#### MOH Tier 1 Dashboard (Task 0.5.1.19)
**Route:** `/dashboard` (MOH Tier 1 role)

**Navigation Connections:**
- "View Unsubmitted Companies" link → `/vci/submissions/wsl?status=unsubmitted`
- "View All" links in widgets → Respective list pages
- Click on approval item → Respective detail page
- "View All Pending Approvals" → `/rmm/submissions?status=pending` or `/enforcement/pending-approvals`
- "View All Compliance Violations" → `/vci/breaches`
- "View Pending Threshold Reversions" → `/vci/thresholds/pending-reversions`
- "Schedule Emergency Meeting" → Opens compose message modal with pre-filled recipients
- Tab: "Compliance" → Compliance overview
- Tab: "Enforcement" → Enforcement overview
- Tab: "Modules" → Module status overview
- Tab: "Reports" → Reports overview

#### MOH Tier 2 Dashboard (Task 0.5.1.20)
**Route:** `/dashboard` (MOH Tier 2 role)

**Navigation Connections:**
- "View All Pending Verifications" → `/rmm/submissions?status=awaiting_verification`
- "View Review Queue" → Respective module review pages
- "View All" links in widgets → Respective list pages
- Click on verification item → Respective detail page
- "View Pending Threshold Reversions" → `/vci/thresholds/pending-reversions`
- Tab navigation → Various overview sections

---

### 3. List-to-Detail Connections

#### RMM Module

**Companies List (Task 0.5.2.2) → Company Detail (Task 0.5.2.3)**
- Click on company row/card → `/rmm/companies/[id]`
- "Edit" action button → `/rmm/companies/[id]/edit`
- "View Products" action → `/rmm/companies/[id]?tab=products`
- "View History" action → `/rmm/companies/[id]?tab=history`

**Products List (Task 0.5.2.4) → Product Detail (Task 0.5.2.5)**
- Click on product row/card → `/rmm/products/[id]`
- "Edit" action button → `/rmm/products/[id]/edit`
- "View SKUs" action → `/rmm/products/[id]?tab=skus`
- "View History" action → `/rmm/products/[id]?tab=history`

**SKUs List (Task 0.5.2.6) → SKU Detail (Task 0.5.2.7)**
- Click on SKU row/card → `/rmm/skus/[id]`
- "Edit" action button → `/rmm/skus/[id]/edit`
- "View History" action → `/rmm/skus/[id]?tab=history`

**Registry Submissions List (Task 0.5.2.11) → Submission Detail (Task 0.5.2.12)**
- Click on submission row/card → `/rmm/submissions/[id]`
- "View Details" button → `/rmm/submissions/[id]`
- "Edit" button (if draft) → `/rmm/submissions/[id]/edit`

#### VCI Module

**AAMS Submissions List (Task 0.5.3.1) → Submission Detail (Task 0.5.3.3)**
- Click on submission row/card → `/vci/submissions/aams/[id]`
- "View Details" button → `/vci/submissions/aams/[id]`
- "Edit" button (if draft) → `/vci/submissions/aams/[id]/edit`

**WSL Submissions List (Task 0.5.3.13) → Submission Detail (Task 0.5.3.15)**
- Click on submission row/card → `/vci/submissions/wsl/[id]`
- "View Details" button → `/vci/submissions/wsl/[id]`

**MSQ Submissions List (Task 0.5.3.9) → Submission Detail (Task 0.5.3.11)**
- Click on submission row/card → `/vci/submissions/msq/[id]`
- "View Details" button → `/vci/submissions/msq/[id]`
- "Edit" button (if within grace period) → `/vci/submissions/msq/[id]/edit`

**Threshold Management List (Task 0.5.3.4) → Threshold Detail (Task 0.5.3.5)**
- Click on threshold row → `/vci/thresholds/[id]`
- "Modify" button → Opens threshold modification modal

**Compliance Violations List (Task 0.5.3.16) → Violation Detail (Task 0.5.3.17)**
- Click on violation row/card → `/vci/breaches/[id]`
- "View Details" button → `/vci/breaches/[id]`

#### ECS Module

**Export Requests List (Task 0.5.4.1) → Request Detail (Task 0.5.4.3)**
- Click on request row/card → `/ecs/requests/[id]`
- "View Details" button → `/ecs/requests/[id]`
- "Edit" button (if draft) → `/ecs/requests/[id]/edit`

**Export Authorizations List (Task 0.5.4.5) → Authorization Detail (Task 0.5.4.6)**
- Click on authorization row/card → `/ecs/authorizations/[id]`
- "View Details" button → `/ecs/authorizations/[id]`

#### CMC Module

**Compliance Scores List (Task 0.5.5.1) → Score Detail (Task 0.5.5.2)**
- Click on score row/card → `/cmc/scores/[id]`
- "View Details" button → `/cmc/scores/[id]`

**Compliance Disputes List (Task 0.5.5.6) → Dispute Detail (Task 0.5.5.7)**
- Click on dispute row/card → `/cmc/disputes/[id]`
- "View Details" button → `/cmc/disputes/[id]`

#### Enforcement Module

**Enforcement Actions List (Task 0.5.2.1) → Action Detail (Task 0.5.2.1a)**
- Click on action row/card → `/enforcement/actions/[id]`
- "View Details" button → `/enforcement/actions/[id]`
- "Edit" button (if draft) → `/enforcement/actions/[id]/edit`

---

### 4. Detail Page Actions & Tabs

#### Company Detail (Task 0.5.2.3)
**Route:** `/rmm/companies/[id]`

**Action Buttons:**
- "Edit" button → `/rmm/companies/[id]/edit`
- "Actions" dropdown → Various actions (Deactivate, Export, View Audit Log)

**Tabs:**
- **Overview Tab (Default):**
  - "View All Products" link → `/rmm/companies/[id]?tab=products`
  - "View Enforcement History" link → `/rmm/companies/[id]?tab=enforcement`
  - "View Full History" link → `/rmm/companies/[id]?tab=history`
  - Click on recent activity item → Respective detail page

- **Products Tab:**
  - "New Product" button → `/rmm/products/new?company=[id]`
  - Click on product row → `/rmm/products/[product_id]`
  - "View All Products" link → `/rmm/products?company=[id]`

- **Enforcement Tab:**
  - "View All Enforcement Actions" link → `/enforcement/actions?company=[id]`
  - Click on enforcement action card → `/enforcement/actions/[action_id]`
  - "View Full Details" button → `/enforcement/actions/[action_id]`
  - "Appeal" button (Company users only) → `/enforcement/actions/[action_id]/appeal`

- **History Tab:**
  - Timeline of all changes
  - Click on history item → Respective detail page or audit log

#### Product Detail (Task 0.5.2.5)
**Route:** `/rmm/products/[id]`

**Action Buttons:**
- "Edit" button → `/rmm/products/[id]/edit`
- "Actions" dropdown → Various actions

**Tabs:**
- **Overview Tab (Default):**
  - "View All SKUs" link → `/rmm/products/[id]?tab=skus`
  - "View Company" link → `/rmm/companies/[company_id]`
  - "View Related Submissions" link → `/rmm/submissions?product=[id]`

- **SKUs Tab:**
  - "New SKU" button → `/rmm/skus/new?product=[id]`
  - Click on SKU row → `/rmm/skus/[sku_id]`
  - "View All SKUs" link → `/rmm/skus?product=[id]`

- **History Tab:**
  - Timeline of all changes
  - Click on history item → Respective detail page

#### SKU Detail (Task 0.5.2.7)
**Route:** `/rmm/skus/[id]`

**Action Buttons:**
- "Edit" button → `/rmm/skus/[id]/edit`
- "Actions" dropdown → Various actions

**Tabs:**
- **Overview Tab (Default):**
  - "View Product" link → `/rmm/products/[product_id]`
  - "View Related Submissions" link → `/vci/submissions/wsl?sku=[id]`

- **History Tab:**
  - Timeline of all changes
  - Click on history item → Respective detail page

#### Registry Submission Detail (Task 0.5.2.12)
**Route:** `/rmm/submissions/[id]`

**Action Buttons:**
- "Edit" button (if draft) → `/rmm/submissions/[id]/edit`
- "Withdraw" button (if submitted) → Confirmation modal
- "Approve" button (MOH Tier 1) → Approval modal
- "Reject" button (MOH Tier 1) → Rejection modal with reason
- "Request Info" button (MOH) → Opens compose message modal
- "Verify" button (MOH Tier 2) → Verification modal

**Links:**
- "View Company" link → `/rmm/companies/[company_id]`
- "View Product" link → `/rmm/products/[product_id]` (if applicable)
- "View Enforcement Actions" link → `/enforcement/actions?submission=[id]`

#### AAMS Submission Detail (Task 0.5.3.3)
**Route:** `/vci/submissions/aams/[id]`

**Action Buttons:**
- "Edit" button (if draft) → `/vci/submissions/aams/[id]/edit`
- "Submit" button (if draft) → Confirmation modal
- "Verify" button (MOH Tier 2) → Verification modal
- "Approve" button (MOH Tier 1) → Approval modal
- "Reject" button (MOH Tier 1) → Rejection modal

**Links:**
- "View Threshold Details" link → `/vci/thresholds/[threshold_id]`
- "View Threshold Management" link (MOH Tier 1) → `/vci/thresholds`
- "View All Enforcement Actions" link → `/enforcement/actions?submission=[id]`
- "View Enforcement Action Detail" link → `/enforcement/actions/[action_id]`

**Tabs:**
- **Details Tab (Default):** Submission data and workflow status
- **History Tab:** Approval history timeline
- **Threshold Tab:** Threshold calculation and details

#### WSL Submission Detail (Task 0.5.3.15)
**Route:** `/vci/submissions/wsl/[id]`

**Action Buttons:**
- "Edit" button (if draft) → `/vci/submissions/wsl/[id]/edit`
- "Submit" button (if draft) → Confirmation modal

**Links:**
- "View SKU" link → `/rmm/skus/[sku_id]`
- "View Compliance Violation" link → `/vci/breaches/[violation_id]` (if violation exists)
- "View Related Enforcement" link → `/enforcement/actions?violation=[violation_id]`

**Tabs:**
- **Details Tab (Default):** Submission data and compliance status
- **History Tab:** Submission history

#### Compliance Violation Detail (Task 0.5.3.17)
**Route:** `/vci/breaches/[id]`

**Action Buttons:**
- "Analyze" button (MOH Tier 2) → `/vci/breaches/[id]/analyze`
- "Approve Action" button (MOH Tier 1) → `/vci/breaches/[id]/approve-action`
- "View Related Enforcement" link → `/enforcement/actions?violation=[id]`

**Links:**
- "View WSL Submission" link → `/vci/submissions/wsl/[submission_id]`
- "View SKU" link → `/rmm/skus/[sku_id]`
- "View Company" link → `/rmm/companies/[company_id]`
- "View Threshold" link → `/vci/thresholds/[threshold_id]`

#### Enforcement Action Detail (Task 0.5.2.1a)
**Route:** `/enforcement/actions/[id]`

**Action Buttons:**
- "Edit" button (if draft) → `/enforcement/actions/[id]/edit`
- "Submit Appeal" button (Company users, if appeal window open) → `/enforcement/actions/[id]/appeal`
- "Review Appeal" button (MOH Tier 1) → `/enforcement/actions/[id]/review-appeal`
- "Approve" button (MOH Tier 1) → Approval modal
- "Reject" button (MOH Tier 1) → Rejection modal
- "Execute" button (MOH Tier 1, if approved) → Execution confirmation

**Links:**
- "View Violation" link → `/vci/breaches/[violation_id]`
- "View Company" link → `/rmm/companies/[company_id]`
- "View WSL Submission" link → `/vci/submissions/wsl/[submission_id]`
- "View Regulatory Framework" link → External document or `/legal/regulations`

---

### 5. Workflow Connections

#### Registry Submission Workflow
1. **Create** → Companies/Products/SKUs detail pages → "New Submission" button → `/rmm/submissions/new?entity_type=[type]&entity_id=[id]`
2. **Draft** → Registry Submission Form (Task 0.5.2.12) → "Save Draft" → Remains on form
3. **Submit** → Registry Submission Form → "Submit" button → `/rmm/submissions/[id]` (submitted state)
4. **Tier 2 Verify** → Submission Detail → "Verify" button → `/rmm/submissions/[id]` (verified state)
5. **Tier 1 Approve** → Submission Detail → "Approve" button → `/rmm/submissions/[id]` (approved state)
6. **Tier 2 Implement** → Submission Detail → "Implement" button → `/rmm/submissions/[id]` (implemented state)
7. **Completed** → Submission Detail → "Mark Complete" button → `/rmm/submissions/[id]` (completed state)
8. **Rejected** → Submission Detail → "Reject" button → `/rmm/submissions/[id]` (rejected state) → "Resubmit" button → `/rmm/submissions/[id]/edit`

#### AAMS Submission Workflow
1. **Create** → VCI Overview or AAMS List → "New Submission" button → `/vci/submissions/aams/new`
2. **Draft** → AAMS Submission Form → "Save Draft" → Remains on form
3. **Submit** → AAMS Submission Form → "Submit" button → `/vci/submissions/aams/[id]` (submitted state)
4. **Tier 2 Verify** → Submission Detail → "Verify" button → `/vci/submissions/aams/[id]` (verified state, threshold visible)
5. **Tier 1 Approve** → Submission Detail → "Approve" button → `/vci/submissions/aams/[id]` (approved state)
6. **Rejected** → Submission Detail → "Reject" button → `/vci/submissions/aams/[id]` (rejected state) → "Resubmit" button → `/vci/submissions/aams/[id]/edit`

#### WSL Submission Workflow
1. **Create** → VCI Overview or WSL List → "New Submission" button → `/vci/submissions/wsl/new`
2. **Draft** → WSL Submission Form → "Save Draft" → Remains on form
3. **Submit** → WSL Submission Form → "Submit" button → `/vci/submissions/wsl/[id]` (submitted state)
4. **Violation Detection** → If threshold breach → Auto-creates Compliance Violation → `/vci/breaches/[id]`
5. **View Violation** → Submission Detail → "View Compliance Violation" link → `/vci/breaches/[violation_id]`

#### Enforcement Action Workflow
1. **Create** → Enforcement Dashboard or Actions List → "Create Action" button → `/enforcement/actions/new`
2. **Wizard Steps:**
   - Step 1: Action Type Selection → Next
   - Step 2: Violation Selection → `/enforcement/actions/new?step=2&violation=[id]`
   - Step 3: Amount/Details Input → `/enforcement/actions/new?step=3`
   - Step 4: Justification → `/enforcement/actions/new?step=4`
   - Step 5: Review → `/enforcement/actions/new?step=5`
3. **Submit** → Wizard → "Submit" button → `/enforcement/actions/[id]` (draft state)
4. **Tier 2 Review** → Action Detail → "Review" button → `/enforcement/actions/[id]` (reviewed state)
5. **Tier 1 Approve** → Action Detail → "Approve" button → `/enforcement/actions/[id]` (approved state)
6. **Execute** → Action Detail → "Execute" button → `/enforcement/actions/[id]` (executed state)
7. **Appeal Window** → Action Detail → "Submit Appeal" button (Company) → `/enforcement/actions/[id]/appeal`
8. **Appeal Review** → Action Detail → "Review Appeal" button (MOH Tier 1) → `/enforcement/actions/[id]/review-appeal`
9. **Resolution** → Action Detail → Uphold/Overturn decision → `/enforcement/actions/[id]` (resolved state)

---

### 6. Cross-Module Connections

#### VCI → RMM Connections
- AAMS Submission Detail → "View Company" link → `/rmm/companies/[company_id]`
- WSL Submission Detail → "View SKU" link → `/rmm/skus/[sku_id]`
- Compliance Violation Detail → "View Company" link → `/rmm/companies/[company_id]`
- Compliance Violation Detail → "View SKU" link → `/rmm/skus/[sku_id]`
- Threshold Detail → "View Related SKU" link → `/rmm/skus/[sku_id]`

#### VCI → Enforcement Connections
- Compliance Violation Detail → "View Related Enforcement" link → `/enforcement/actions?violation=[id]`
- Compliance Violation Detail → "Create Enforcement Action" button (MOH) → `/enforcement/actions/new?violation=[id]`
- AAMS Submission Detail → "View All Enforcement Actions" link → `/enforcement/actions?submission=[id]`
- Enforcement Action Detail → "View Violation" link → `/vci/breaches/[violation_id]`

#### ECS → VCI Connections
- Export Request Detail → "View Threshold Comparison" card → Shows VCI threshold data
- Export Request Detail → "View Related SKU" link → `/rmm/skus/[sku_id]` → Shows VCI submission history
- Export Authorization Detail → "View Threshold Status" link → `/vci/thresholds/[threshold_id]`

#### ECS → RMM Connections
- Export Request Detail → "View SKU" link → `/rmm/skus/[sku_id]`
- Export Request Detail → "View Company" link → `/rmm/companies/[company_id]`

#### CMC → RMM Connections
- Compliance Score Detail → "View Company" link → `/rmm/companies/[company_id]`
- Compliance Dispute Detail → "View Company" link → `/rmm/companies/[company_id]`
- Compliance Score Detail → Component breakdown → Links to related submissions/violations

#### Enforcement → RMM Connections
- Enforcement Action Detail → "View Company" link → `/rmm/companies/[company_id]`
- Enforcement Action Detail → "View WSL Submission" link → `/vci/submissions/wsl/[submission_id]`
- Company Detail → "Enforcement" tab → `/enforcement/actions?company=[id]`

---

### 7. Communication Integration

#### Communication Links in Workflow Pages
All detail pages include a communication button/section:
- **"Send Message" button** → Opens compose message modal (pre-filled with workflow entity link)
- **"View Conversations" link** → Shows related conversations list
- **Click on conversation** → `/communications/inbox/[conversation_id]`

#### Communication Workflow Integration
- **Inbox List (Task 0.5.1.24)** → Click conversation → `/communications/inbox/[conversation_id]`
- **Conversation Detail (Task 0.5.1.25)** → "View Linked Entity" link → Respective detail page
- **Compose Message (Task 0.5.1.26)** → "Link to Workflow Entity" → Select entity → Message includes link
- **Sent Messages (Task 0.5.1.27)** → Click conversation → `/communications/inbox/[conversation_id]`
- **Archived Conversations (Task 0.5.1.36)** → Click conversation → `/communications/inbox/[conversation_id]`

---

### 8. Tab Navigation Within Detail Pages

#### Company Detail Tabs
- **Overview Tab (Default):** Summary, recent activity, enforcement summary
- **Products Tab:** Products list filtered by company
- **Enforcement Tab:** Enforcement actions filtered by company
- **History Tab:** Complete history timeline

#### Product Detail Tabs
- **Overview Tab (Default):** Product information, SKU count, company link
- **SKUs Tab:** SKUs list filtered by product
- **History Tab:** Product history timeline

#### SKU Detail Tabs
- **Overview Tab (Default):** SKU information, pharmaceutical attributes, product link
- **History Tab:** SKU history timeline

#### AAMS Submission Detail Tabs
- **Details Tab (Default):** Submission data, workflow status, sales table
- **History Tab:** Approval history timeline
- **Threshold Tab:** Threshold calculation and details

#### Registry Submission Detail
- **Workflow Status Section:** Shows current state
- **Submission Data Section:** Entity and changes
- **Approval History Section:** Timeline of approvals

---

### 9. Modal & Drawer Connections

#### Modals (Task 0.5.8.x)
- **Confirmation Modal (Task 0.5.8.1):** Used for delete, archive, approve, reject actions
  - On confirm → Action executed → Parent page refreshed
  - On cancel → Modal closes → Returns to parent page

- **File Upload Modal (Task 0.5.8.2):** Used in forms (AAMS, WSL, export request)
  - After upload → Files added to form → Modal closes
  - Remains on form page

- **Threshold Modification Modal (Task 0.5.3.6):** Opens from Threshold Management
  - After modification → Threshold list refreshed → Modal closes
  - Returns to threshold list page

- **Workflow Status Modal (Task 0.5.8.10):** Opens from detail pages
  - Shows workflow progress → "View Full Details" button → Detail page
  - Modal closes → Returns to parent page

#### Message Compose Modal (Communication Integration)
- Opens from workflow pages → "Send Message" button
- After sending → Modal closes → Returns to workflow page
- Message sent notification → Can click to view conversation

---

### 10. Breadcrumb Navigation

All detail pages include breadcrumb navigation:

**Format:** Home > [Module] > [Section] > [Item Name]

**Examples:**
- Home > RMM > Companies > ABC Pharmaceuticals Inc.
- Home > VCI > AAMS > Submission #12345
- Home > VCI > Thresholds > SKU001 Threshold
- Home > Enforcement > Actions > ENF-2025-001

**Breadcrumb Links:**
- Click on "Home" → `/dashboard`
- Click on module name (e.g., "RMM") → Module overview page (`/rmm`)
- Click on section name (e.g., "Companies") → Section list page (`/rmm/companies`)
- Current page name is not clickable (text only)

---

### 11. Historical Data Navigation

#### History Overview (Task 0.5.1.30)
**Route:** `/history`

**Navigation:**
- "View Submission History" → `/vci/submissions/history`
- "View Export History" → `/ecs/authorizations/history`
- "View Compliance Scores History" → `/cmc/scores/history`
- "View Compliance Disputes History" → `/cmc/disputes/history`
- Click on history item → Respective detail page (if available)

#### Submission History (Task 0.5.3.28)
**Route:** `/vci/submissions/history`

**Navigation:**
- Click on submission → `/vci/submissions/[type]/[id]`
- Filters → Updates list
- "View Trends" link (MOH only) → `/vci/submissions/history/trends`

---

### 12. Analytics Navigation

#### ATC Treemap (Task 0.5.3.22)
**Route:** `/vci/analytics/atc-treemap`

**Navigation:**
- Click on ATC tile → `/vci/analytics/products-treemap?atc=[code]`
- "Back to Overview" button → `/vci/analytics/atc-treemap`

#### Products Treemap (Task 0.5.3.23)
**Route:** `/vci/analytics/products-treemap?atc=[code]`

**Navigation:**
- Click on product tile → Opens Dosage/Forms Modal
- "Back to ATC Treemap" button → `/vci/analytics/atc-treemap`
- Breadcrumb: ATC Treemap > Products

#### Dosage/Forms Modal (Task 0.5.3.24)
**Navigation:**
- Click on dosage/form row → Opens SKU List Expanded view
- "Back to Products" button → Products Treemap (closes modal)

#### SKU List Expanded (Task 0.5.3.25)
**Navigation:**
- Click on SKU row with external link icon → Opens SKU Detail in new tab → `/rmm/skus/[id]?from=analytics&atc=[code]`
- Modal stays open
- "Back to Dosage/Forms" button → Returns to Dosage/Forms Modal

#### SKU Action Page Integration (Task 0.5.3.27)
**Route:** `/rmm/skus/[id]?from=analytics&atc=[code]`

**Navigation:**
- Opens in new tab from Analytics
- "Back to Analytics" button → Returns to SKU List Expanded modal
- All normal SKU detail navigation available

---

### 13. Create/Edit Form Navigation

#### Create Forms
- Companies List → "New Company" button → `/rmm/companies/new`
- Products List → "New Product" button → `/rmm/products/new`
- SKUs List → "New SKU" button → `/rmm/skus/new`
- Registry Submissions List → "New Submission" button → `/rmm/submissions/new`
- AAMS List → "New Submission" button → `/vci/submissions/aams/new`
- WSL List → "New Submission" button → `/vci/submissions/wsl/new`
- MSQ List → "New Submission" button → `/vci/submissions/msq/new`
- Export Requests List → "New Request" button → `/ecs/requests/new`
- Enforcement Actions List → "Create Action" button → `/enforcement/actions/new`

**Form Navigation:**
- "Save Draft" button → Remains on form, shows "Draft saved" indicator
- "Cancel" button → Confirmation modal → Returns to list page
- "Submit" button → Validation → Success → Redirects to detail page
- "Back" button (if wizard) → Previous step

#### Edit Forms
- Company Detail → "Edit" button → `/rmm/companies/[id]/edit`
- Product Detail → "Edit" button → `/rmm/products/[id]/edit`
- SKU Detail → "Edit" button → `/rmm/skus/[id]/edit`
- Submission Detail (if draft) → "Edit" button → `/rmm/submissions/[id]/edit`

**Form Navigation:**
- "Save Changes" button → Validation → Success → Returns to detail page
- "Cancel" button → Confirmation modal → Returns to detail page
- "Delete" button → Confirmation modal → Success → Returns to list page

---

### 14. Search & Filter Navigation

#### List Pages with Search
- Search input → Real-time filtering → Updates list
- Clear search → "X" button → Returns to full list

#### List Pages with Filters
- Select filter → List updates → URL updates with query params
- "Clear Filters" button → All filters reset → Full list displayed
- Filters persist in URL → Refresh maintains filters

#### Advanced Filters
- "Filters" dropdown/button → Opens filter panel
- Apply filters → List updates → URL updates
- "Reset" button → All filters cleared

---

### 15. Role-Based Navigation Variations

#### Company Users
- Sidebar: No MOH-only sections (Enforcement, System Configuration)
- Dashboard: Company-specific widgets only
- Detail pages: View-only for MOH-managed entities
- Actions: Limited to own submissions and appeals

#### MOH Tier 2 Users
- Sidebar: All modules except System Configuration
- Dashboard: Verification and review widgets
- Detail pages: Verify and review actions available
- Actions: Can create enforcement actions, verify submissions

#### MOH Tier 1 Users
- Sidebar: All modules including System Configuration
- Dashboard: Governance and oversight widgets
- Detail pages: Approve and configuration actions available
- Actions: Can approve, configure, manage thresholds

---

## Navigation Patterns Summary

### Pattern 1: List → Detail → Edit
**Example:** Companies List → Company Detail → Company Edit Form
- Always include "Back" or breadcrumb navigation
- Edit form returns to detail page on save
- Detail page includes "Edit" button (role-based)

### Pattern 2: Dashboard → List → Detail
**Example:** Dashboard → Submissions List → Submission Detail
- Dashboard widgets link to filtered list pages
- List pages link to detail pages
- Detail pages link back to list or dashboard

### Pattern 3: Workflow State Transitions
**Example:** Submission Draft → Submit → Verified → Approved
- State transitions happen on detail page
- Status indicators show current state
- Action buttons available based on state and role

### Pattern 4: Cross-Module Linking
**Example:** Compliance Violation → Enforcement Action → Company
- Related entities linked in detail pages
- Links open in same tab (except analytics external links)
- Breadcrumbs maintain context

### Pattern 5: Tab Navigation
**Example:** Company Detail → Products Tab → Products List (filtered)
- Tabs within detail pages
- Tab content can be filtered lists or sections
- Tab state maintained in URL query params

---

## Miro Flow Diagram

**Miro Board:** [Phase 0.5 Wireframes - Master Board](https://miro.com/app/board/uXjVGUps93A=/)

**Flow Diagram:** [Navigation & Connection Map Diagram](https://miro.com/app/board/uXjVGUps93A=/?focusWidget=3458764654831369942)

**Diagram Structure:**
- Main entry point: Login Page → Public Homepage
- Authentication routing: Role-based branching to Company/Tier 1/Tier 2 Dashboards
- Navigation hub: Sidebar Navigation connects all modules
- Module sections (color-coded):
  - **RMM Module (Blue):** Overview → Companies → Products → SKUs → Submissions
  - **VCI Module (Green):** Overview → AAMS/WSL/MSQ → Thresholds → Compliance Violations
  - **ECS Module (Purple):** Overview → Export Requests → Authorizations
  - **CMC Module (Orange):** Overview → Compliance Scores → Disputes
  - **Enforcement (Red):** Dashboard → Actions → Details → Appeals
- Cross-module connections: Links between related pages across modules
- Communication integration: "Send Message" buttons from all detail pages

**Diagram Elements:**
- **Nodes:** Wireframe pages (shapes with module colors)
- **Edges:** Navigation connections (labeled arrows)
- **Labels:** Navigation actions (Click, Edit, View, Tab names, Workflow states)
- **Colors:** Module-based grouping (Blue=RMM, Green=VCI, Purple=ECS, Orange=CMC, Red=Enforcement)
- **Connection Types:**
  - Primary Navigation (Sidebar): Thick blue lines
  - List-to-Detail: Medium green lines labeled "Click"
  - Action Buttons: Red dotted lines with button names
  - Tab Navigation: Orange dashed lines with tab names
  - Workflow Transitions: Purple arrows with state labels
  - Cross-Module: Colored lines matching destination module
  - Communication: Yellow dotted lines labeled "Send Message"

**Diagram ID:** 3458764654831369942

**Access:** Direct link above or see [Design Tool Links](design-tool-links.md) for board access.

---

## Implementation Notes

### For Developers
1. **Route Structure:** Follow Next.js App Router structure in `routing-structure.md`
2. **Query Parameters:** Use for filtering and tab state (e.g., `?tab=products&status=active`)
3. **Deep Linking:** Support direct links to any detail page
4. **Breadcrumbs:** Generate from route structure automatically
5. **Navigation Guards:** Role-based access control on navigation

### For UX Review
1. **Navigation Consistency:** All list pages should have same navigation patterns
2. **Back Navigation:** Always provide clear way to go back
3. **Breadcrumbs:** Show full path for context
4. **Related Links:** Group related links in detail pages
5. **Workflow Indicators:** Show current step in workflows

---

## Related Documents

- [Wireframe Index](wireframe-index.md) - Complete list of all wireframes
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Next.js route structure
- [Navigation Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Navigation patterns
- [Component Mapping](wireframe-to-component-mapping.md) - UI component mappings
- [Design Tool Links](design-tool-links.md) - Miro board links

---

**Last Updated:** 2025-01-22  
**Status:** ✅ Complete  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

