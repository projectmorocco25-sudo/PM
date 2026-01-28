# Wireframes CRUD/Deletion Review: 00-core-foundation

**Prepared for:** Emma (UI/UX) and Fatima (Compliance/Review)  
**Date:** 2026-01-28  
**Purpose:** List all wireframes in `/00-core-foundation` that need to be addressed with CRUD/deletion issues identified in [RMM-CRUD-DELETION-REVIEW.md](./RMM-CRUD-DELETION-REVIEW.md).

**Review Basis:** [RMM-CRUD-DELETION-REVIEW.md](./RMM-CRUD-DELETION-REVIEW.md) - Required deletion logic: Tier 2 Officer requests → Tier 1 approves & issues command → Tier 2 Registrar implements; all deletions kept for audit.

---

## Summary

**Total wireframes reviewed:** 42 files in `/00-core-foundation`  
**Wireframes needing CRUD/deletion updates:** 7 wireframes

---

## Wireframes Requiring Updates

### 1. **task-0.5.1.19-moh-tier1-dashboard.md** ⚠️ **NEEDS UPDATE**

**Issue:** Dashboard shows "Pending Approvals" but does not explicitly show **deletion requests** that need Tier 1 approval.

**Required Updates:**
- **Pending Approvals widget:** Add deletion-specific approval items:
  - Show deletion requests (submission_type = company_delete, product_delete, sku_delete) in pending approvals list
  - Display: "Company Deletion Request - Company ABC" with status "Awaiting Tier 1 Approval"
  - Show entity type (Company/Product/SKU) and entity name
  - Show who requested (Tier 2 Officer name)
  - Show regulatory deadline if applicable
  - Action buttons: "[Approve & Issue Command]", "[Reject]", "[View Details]"
- **Enforcement Tab:** May need to show deletion-related enforcement actions if applicable
- **Compliance Tab:** May need to show deletion requests in compliance context

**CRUD Issue Reference:** Section 3.1, 3.4, 3.5 (Company, Product, SKU deletion workflow)

---

### 2. **task-0.5.1.20-moh-tier2-dashboard.md** ⚠️ **NEEDS UPDATE**

**Issue:** Dashboard shows "Verification Queue" but does not show **deletion request actions** for Tier 2 Officer.

**Required Updates:**
- **Verification Tab:** Add deletion request creation:
  - Add action button: "[Request Deletion]" (for Company, Product, SKU entities)
  - Show deletion requests in verification queue with status "Deletion Request - Pending Verification"
  - After Tier 2 Officer verifies deletion request, it moves to "Awaiting Tier 1 Approval"
- **Overview Tab:** May need to show deletion requests in pending verifications widget
- **Quick Actions:** Add "[Request Deletion]" option (opens modal to create deletion submission)

**CRUD Issue Reference:** Section 3.1, 3.4, 3.5 (Tier 2 Officer can request deletion)

---

### 3. **task-0.5.1.22-profile-page.md** ⚠️ **NEEDS UPDATE**

**Issue:** Has "Delete Account" button but does not specify the **deletion workflow** (who can request, who approves, who implements, audit requirement).

**Required Updates:**
- **Account Actions Section:** Update "Delete Account" button:
  - Add tooltip/help text: "Account deletion requires Tier 2 Officer request → Tier 1 approval → Tier 2 Registrar implementation. All deletions are kept for audit."
  - For Company users: Show "Request Account Deactivation" (if self-service) or "Contact MOH" (if MOH-only)
  - For MOH users: Show appropriate workflow based on decision (separate workflow or Tier-1-only with two-person rule)
  - Add confirmation modal that explains: deletion is kept for audit, soft delete (deactivation), cannot be undone
  - Show audit trail link after deletion request submitted
- **Note:** User deletion/deactivation is **not currently in registry submission workflow** (gap identified in review). Wireframe should reflect the **decided workflow** once documented.

**CRUD Issue Reference:** Section 3.2 (Users deletion/deactivation gap - workflow not yet defined)

---

### 4. **task-0.5.1.35-system-configuration.md** ⚠️ **NEEDS UPDATE**

**Issue:** Shows module activation but **no user management section**. If user deletion/deactivation is handled here (Tier 1 only), it needs to be added.

**Required Updates:**
- **Add User Management Section (if user deletion handled here):**
  - Section: "User Management"
  - List of users (MOH and Company users)
  - Actions: "[Request Deactivation]" (Tier 2 Officer), "[Approve Deactivation]" (Tier 1), "[Implement Deactivation]" (Tier 2 Registrar or Tier 1)
  - Show deletion workflow: Request → Approve → Implement
  - Show audit trail for user deactivations
  - Show deactivation reason (mandatory)
  - Show cascade effects (if user deactivation affects company access)
- **Alternative:** If user deletion is handled elsewhere, add note: "User management handled in [location]. See [link]."

**CRUD Issue Reference:** Section 3.2 (Users deletion/deactivation - workflow needs to be decided and documented)

---

### 5. **task-0.5.1.32-audit-logs-list.md** ⚠️ **NEEDS UPDATE**

**Issue:** Shows audit logs but does not explicitly show **deletion audit entries** or the **deletion workflow** in the audit trail.

**Required Updates:**
- **Audit Log Table:**
  - Ensure DELETE operations are clearly visible (operation_type = delete)
  - Show deletion workflow steps:
    - "DELETE_REQUEST" - Tier 2 Officer requested deletion
    - "DELETE_APPROVED" - Tier 1 approved deletion and issued command
    - "DELETE_IMPLEMENTED" - Tier 2 Registrar implemented deletion (soft delete/deactivation)
  - Show entity type (Company/Product/SKU) in Details column
  - Show old_values preserved (for deletions, old_values must be shown)
  - Show deactivation details: deactivated_at, deactivated_by, deactivated_reason
- **Filters:**
  - Add "Action: DELETE" filter option
  - Add "Entity Type: Company/Product/SKU" filter
  - Add "Deletion Workflow Status" filter (Requested, Approved, Implemented)
- **Regulatory Reference Display:**
  - Show regulatory basis for deletions (if applicable)
  - Show audit retention period (7 years) for deletion entries

**CRUD Issue Reference:** Section 4 (Deletion workflow), Section 5 (Audit requirements - deletions kept for audit)

---

### 6. **task-0.5.1.33-audit-log-detail.md** ⚠️ **NEEDS UPDATE**

**Issue:** Shows audit log detail but does not explicitly show **deletion detail** with old_values and deactivation information.

**Required Updates:**
- **Log Entry Details:**
  - For DELETE operations, prominently show:
    - "Action: DELETE (Soft Delete/Deactivation)"
    - "Entity Type: [Company/Product/SKU]"
    - "Old Values:" (must be preserved and displayed - this is the audit requirement)
    - "Deactivation Details:" (if soft delete)
      - deactivated_at timestamp
      - deactivated_by (user who implemented)
      - deactivated_reason (mandatory justification)
    - "Cascade Effects:" (if company deletion cascaded to products/SKUs)
  - Show deletion workflow steps:
    - Who requested (Tier 2 Officer)
    - Who approved (Tier 1)
    - Who implemented (Tier 2 Registrar)
    - Timestamps for each step
- **Compliance Information:**
  - Emphasize: "This deletion is kept for audit per regulatory requirements (Law No. 09-08). Old values preserved for 7-year retention period."

**CRUD Issue Reference:** Section 4 (Deletion workflow), Section 5 (Audit requirements - old_values preserved)

---

### 7. **task-0.5.1.30-history-overview.md** ⚠️ **NEEDS UPDATE**

**Issue:** Shows history timeline but does not explicitly show **deletion history** or **deletion workflow steps** in the timeline.

**Required Updates:**
- **History Timeline:**
  - Add deletion history items:
    - "Company Deletion Requested" - Shows Tier 2 Officer requested deletion
    - "Company Deletion Approved" - Shows Tier 1 approved and issued command
    - "Company Deletion Implemented" - Shows Tier 2 Registrar implemented (soft delete)
  - Show entity type (Company/Product/SKU) in deletion items
  - Show old_values link (link to audit log detail showing preserved old_values)
  - Show deactivation details (deactivated_at, deactivated_by, deactivated_reason)
- **Filters:**
  - Add "Type: Deletion" filter option
  - Add "Entity Type: Company/Product/SKU" filter for deletions
- **Regulatory Reference:**
  - Show regulatory basis for deletions (if applicable)
  - Show audit retention information for deletion entries

**CRUD Issue Reference:** Section 4 (Deletion workflow), Section 5 (Audit requirements)

---

## Wireframes That May Need Minor Updates

### 8. **task-0.5.1.31-notifications-page.md** ⚠️ **MINOR UPDATE**

**Issue:** Shows enforcement and workflow notifications but does not explicitly show **deletion-related notifications**.

**Suggested Updates:**
- **Notification Types:**
  - Add "Deletion Request Created" notification (to Tier 1 when Tier 2 Officer requests deletion)
  - Add "Deletion Approved" notification (to Tier 2 Registrar when Tier 1 approves and issues command)
  - Add "Deletion Implemented" notification (to requester/Tier 1 when Tier 2 Registrar implements)
- **Enforcement Notifications:**
  - May already cover deletion if deletion is considered an enforcement action, but should be explicit

**CRUD Issue Reference:** Section 4 (Deletion workflow notifications)

---

## Wireframes That Do NOT Need Updates (No CRUD/Deletion Issues)

The following wireframes do **not** relate to RMM CRUD/deletion and do **not** need updates:

1. **task-0.5.1.1-public-homepage.md** - Public page, no CRUD
2. **task-0.5.1.2-about-page.md** - Public page, no CRUD
3. **task-0.5.1.7-terms-of-service.md** - Legal page, no CRUD
4. **task-0.5.1.8-privacy-policy.md** - Legal page, no CRUD
5. **task-0.5.1.9-cookie-policy.md** - Legal page, no CRUD
6. **task-0.5.1.11-login-page.md** - Authentication, no deletion
7. **task-0.5.1.12-registration-page.md** - Authentication, no deletion
8. **task-0.5.1.13-forgot-reset-password.md** - Authentication, no deletion
9. **task-0.5.1.14-dashboard-layout-structure.md** - Layout structure, no CRUD
10. **task-0.5.1.15-header-component.md** - Header component, no deletion actions
11. **task-0.5.1.16-sidebar-navigation.md** - Navigation, no deletion actions
12. **task-0.5.1.17-notification-center-component.md** - Notification dropdown, no deletion actions
13. **task-0.5.1.18-company-dashboard.md** - Company users cannot delete (read-only for their own data)
14. **task-0.5.1.24-communications-inbox-list.md** - Communications, no RMM deletion
15. **task-0.5.1.25-conversation-detail.md** - Communications, no RMM deletion
16. **task-0.5.1.26-compose-message.md** - Communications, no RMM deletion
17. **task-0.5.1.27-sent-messages.md** - Communications, no RMM deletion
18. **task-0.5.1.28-system-announcements.md** - Communications, no RMM deletion
19. **task-0.5.1.29-communication-integration-workflow.md** - Communications workflow, no RMM deletion
20. **task-0.5.1.34-audit-reports.md** - Reports generation, deletion entries should be included in reports but wireframe doesn't need structural changes
21. **task-0.5.1.36-archived-conversations.md** - Communications archive (soft delete), not RMM deletion
22. **task-0.5.1.37-support-center.md** - Support page, no CRUD
23. **task-0.5.1.38-faq-page.md** - FAQ page, no CRUD
24. **task-0.5.1.39-contact-support.md** - Contact page, no CRUD
25. **task-0.5.1.40-documentation.md** - Documentation page, no CRUD
26. **task-0.5.1.41-system-status.md** - System status page, no CRUD

---

## Priority Ranking

| Priority | Wireframe | Reason |
|----------|-----------|--------|
| **🔴 Critical** | task-0.5.1.19-moh-tier1-dashboard.md | Tier 1 must see and approve deletion requests |
| **🔴 Critical** | task-0.5.1.20-moh-tier2-dashboard.md | Tier 2 Officer must be able to request deletion |
| **🔴 Critical** | task-0.5.1.32-audit-logs-list.md | Deletion audit entries must be visible and searchable |
| **🔴 Critical** | task-0.5.1.33-audit-log-detail.md | Deletion detail must show old_values (audit requirement) |
| **🟡 High** | task-0.5.1.30-history-overview.md | Deletion history should be visible in timeline |
| **🟡 High** | task-0.5.1.22-profile-page.md | User deletion workflow needs to be documented |
| **🟡 High** | task-0.5.1.35-system-configuration.md | User management section needed if user deletion handled here |
| **🟢 Medium** | task-0.5.1.31-notifications-page.md | Deletion notifications should be explicit |

---

## Required Updates Summary

### For Tier 1 Dashboard (task-0.5.1.19)
- ✅ Show deletion requests in "Pending Approvals" widget
- ✅ Show deletion approval actions: "[Approve & Issue Command]", "[Reject]"
- ✅ Show deletion workflow status (Requested → Approved → Implemented)

### For Tier 2 Dashboard (task-0.5.1.20)
- ✅ Add "[Request Deletion]" action button/modal
- ✅ Show deletion requests in verification queue
- ✅ Show deletion request workflow (Request → Verify → Await Approval)

### For Profile Page (task-0.5.1.22)
- ✅ Update "Delete Account" button with workflow explanation
- ✅ Add confirmation modal explaining deletion workflow and audit requirement
- ⚠️ **Note:** User deletion workflow needs to be decided first (see RMM-CRUD-DELETION-REVIEW.md Section 3.2)

### For System Configuration (task-0.5.1.35)
- ✅ Add "User Management" section (if user deletion handled here)
- ⚠️ **Note:** User deletion workflow needs to be decided first

### For Audit Logs List (task-0.5.1.32)
- ✅ Show DELETE operations clearly
- ✅ Show deletion workflow steps (REQUEST, APPROVED, IMPLEMENTED)
- ✅ Add deletion-specific filters
- ✅ Show old_values preserved (audit requirement)

### For Audit Log Detail (task-0.5.1.33)
- ✅ Show deletion detail with old_values prominently displayed
- ✅ Show deactivation details (deactivated_at, deactivated_by, deactivated_reason)
- ✅ Show deletion workflow steps (who requested, approved, implemented)
- ✅ Emphasize audit retention requirement

### For History Overview (task-0.5.1.30)
- ✅ Add deletion history items to timeline
- ✅ Show deletion workflow steps in timeline
- ✅ Add deletion filters
- ✅ Link to audit log detail showing old_values

### For Notifications Page (task-0.5.1.31)
- ✅ Add deletion-related notification types
- ✅ Show deletion workflow notifications (Request Created, Approved, Implemented)

---

## Implementation Notes

1. **Deletion Workflow UI Pattern:**
   - **Request:** Tier 2 Officer creates deletion request (modal/form) → Creates registry submission with submission_type = company_delete/product_delete/sku_delete
   - **Verify:** Tier 2 Officer verifies deletion request → Status: tier2_verified
   - **Approve:** Tier 1 approves deletion request → Status: tier1_approved (this is "issue the command")
   - **Implement:** Tier 2 Registrar implements deletion → Status: tier2_implemented → Applies soft delete (deactivated_at, deactivated_by, deactivated_reason)
   - **Audit:** All steps logged; final deletion logged with old_values preserved

2. **User Deletion/Deactivation:**
   - **Gap:** Not currently in registry submission workflow
   - **Action Required:** Decide workflow (separate workflow or Tier-1-only with two-person rule) and document before updating wireframes

3. **ATC Codes:**
   - **No deletion:** ATC codes are reference data; no deletion needed (wireframes already correct)

4. **Audit Requirement:**
   - All deletions must show in audit logs with old_values preserved
   - Deletion workflow steps must be visible in audit trail
   - 7-year retention applies to deletion audit entries

---

## References

- [RMM-CRUD-DELETION-REVIEW.md](./RMM-CRUD-DELETION-REVIEW.md) - Complete CRUD/deletion logic review
- [registry-workflow.md](../features/rmm/registry-workflow.md) - Registry submission workflow (includes deletion)
- [rpc-functions.md](../../02-architecture/api/rpc-functions.md) - RPC functions (includes deletion implementation)
- [audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md) - Audit logging requirements

---

**Last Updated:** 2026-01-28  
**Status:** Review complete; 7 wireframes need updates, 1 may need minor updates
