# Wireframe Remediation Plan

**Created:** 2026-01-14  
**Owner:** Yasmine (Project Manager), Emma (UI/UX Specialist)  
**Status:** 🟡 IN PROGRESS - Phase 1 Underway  
**Duration:** 4 Weeks  
**Reference:** [Wireframe Compliance Audit](wireframe-compliance-audit.md)
**Last Updated:** 2026-01-14

### Progress Summary
- ✅ Phase 1: Core Foundation (Day 1-3) - IN PROGRESS
  - Dashboard: ~80% complete
  - Layout Components: ~60% complete
  - Auth Pages: ~70% complete
  - Communications: ~75% complete

---

## Executive Summary

This plan addresses the systematic wireframe compliance failures identified in the audit. All 62 frontend pages require remediation to match their corresponding wireframe specifications and database requirements.

**Goal:** Achieve 100% wireframe compliance for all Phase 1.1 frontend pages.

---

## Phase 1: Core Foundation (Week 1)

**Priority:** 🔴 CRITICAL  
**Pages:** 15  
**Estimated Effort:** 5 days

### Day 1-2: Dashboard (Highest Priority)

The dashboard is the most visible page with the worst compliance (~5%). It requires the most work.

#### Task 1.1: Dashboard Structure & Tabs
- [ ] **1.1.1** Create 5-tab component (Overview, Compliance, Enforcement, Modules, Reports)
- [ ] **1.1.2** Add URL sync for tabs (`?tab=overview`)
- [ ] **1.1.3** Create sticky Quick Actions bar below tabs
- [ ] **1.1.4** Add Date Range picker and Refresh button to header
- [ ] **1.1.5** Implement tab content lazy loading

**Wireframe Reference:** [task-0.5.1.19-moh-tier1-dashboard.md](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md)

#### Task 1.2: Overview Tab - Emergency State
- [x] **1.2.1** Create Emergency Alert Banner component (full-width, red background) ✅
- [x] **1.2.2** Query `%SC` (Submission Compliance) from database ✅
- [x] **1.2.3** Add conditional rendering: show banner when %SC < 75% ✅
- [x] **1.2.4** Add "Schedule Emergency Meeting" button on banner ✅
- [x] **1.2.5** Create %SC gauge widget with color coding (red/yellow/green) ✅

**Database Query:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
  COUNT(*) as total,
  (COUNT(*) FILTER (WHERE status = 'submitted')::float / COUNT(*)::float * 100) as sc_percentage
FROM wsl_submissions
WHERE week_ending >= NOW() - INTERVAL '7 days';
```

#### Task 1.3: Overview Tab - Card Row 1
- [ ] **1.3.1** Create System Health card - query companies count, active submissions
- [ ] **1.3.2** Create Pending Approvals card - query pending AAMS/thresholds
- [ ] **1.3.3** Create Critical Breaches card - query active breaches with priority
- [ ] **1.3.4** Add "View All →" links to each card
- [ ] **1.3.5** Add real-time badge counts

**Database Tables:** `companies`, `aams_submissions`, `thresholds`, `breaches`

#### Task 1.4: Overview Tab - Card Row 2
- [x] **1.4.1** Create Pending Threshold Reversions card ✅
- [x] **1.4.2** Query thresholds with `duration_type` = 'temporary_auto_revert' or 'temporary_manual_review' ✅
- [x] **1.4.3** Add color coding based on days until reversion ✅
- [x] **1.4.4** Create Enforcement Actions card - query this month's actions ✅
- [x] **1.4.5** Create Follow-up Tracking card - query `follow_ups` table ✅
- [x] **1.4.6** Add quick action links on each card ✅

**Database Tables:** `thresholds`, `enforcement_actions`, `follow_ups`

#### Task 1.5: Overview Tab - Card Row 3
- [ ] **1.5.1** Create Audit Trail card - query recent audit logs
- [ ] **1.5.2** Create Tracking card - query active follow-ups with due dates
- [ ] **1.5.3** Create Verification card - show last hash chain verification
- [ ] **1.5.4** Add collapsible section functionality
- [ ] **1.5.5** Save collapse state to localStorage

**Database Tables:** `audit_logs`, `follow_ups`

#### Task 1.6: Compliance Tab
- [ ] **1.6.1** Create Critical Medicine Compliance section
- [ ] **1.6.2** Query breaches for critical medicines with priority
- [ ] **1.6.3** Create Unsubmitted Companies section with filters
- [ ] **1.6.4** Create CMC Low Scores section with spider graph
- [ ] **1.6.5** Add bulk selection checkboxes
- [ ] **1.6.6** Add bulk action buttons (Alert Selected, Assign Follow-up, Create Enforcement)
- [ ] **1.6.7** Add "Load More" pagination

**Database Tables:** `breaches`, `critical_medicines`, `companies`, `wsl_submissions`, `compliance_scores`

#### Task 1.7: Enforcement Tab
- [ ] **1.7.1** Create This Month summary card (Warnings, Fines, Suspensions counts)
- [ ] **1.7.2** Create Pending Approvals list
- [ ] **1.7.3** Create Recent Executions list
- [ ] **1.7.4** Create Enforcement Actions List with filters
- [ ] **1.7.5** Create Follow-up Tracking card
- [ ] **1.7.6** Create Appeals card
- [ ] **1.7.7** Create Audit Trail Verification card

**Database Tables:** `enforcement_actions`, `enforcement_action_appeals`, `follow_ups`, `audit_logs`

#### Task 1.8: Modules Tab
- [ ] **1.8.1** Create RMM Issues card
- [ ] **1.8.2** Create VCI - SKUs card (Action Required, Under Monitor)
- [ ] **1.8.3** Create ECS - Export Requests card (conditional on module activation)
- [ ] **1.8.4** Create CMC - Low Scores card (conditional on module activation)
- [ ] **1.8.5** Check `system_config` for module activation status

**Database Tables:** `registry_submissions`, `skus`, `breaches`, `export_requests`, `compliance_scores`, `system_config`

#### Task 1.9: Reports Tab
- [ ] **1.9.1** Create Governance Dashboard section with charts
- [ ] **1.9.2** Create Stock Sufficiency Overview chart
- [ ] **1.9.3** Create Breach Status Overview chart
- [ ] **1.9.4** Create Action Recommendations list
- [ ] **1.9.5** Create Quick Links card
- [ ] **1.9.6** Create Recent Reports card with download links

**Database Tables:** `wsl_submissions`, `breaches`, `regulatory_reports`

#### Task 1.10: Dashboard Modals
- [ ] **1.10.1** Create Alert Company modal (template selector, message editor, preview)
- [ ] **1.10.2** Create Assign Follow-up modal (officer selector, priority, due date)
- [ ] **1.10.3** Create Schedule Emergency Meeting modal (date/time, attendees, agenda)
- [ ] **1.10.4** Create Quick Preview slide-over panel
- [ ] **1.10.5** Create Bulk Actions modal (for selected companies)

**Database Tables:** `users`, `follow_ups`, `meetings`, `meeting_attendees`

#### Task 1.11: Dashboard Role Variants
- [x] **1.11.1** Create MOH Tier 2 dashboard variant (0.5.1.20) ✅
- [x] **1.11.2** Create Company dashboard variant (0.5.1.18) ✅
- [x] **1.11.3** Add role detection using `useUserRole` hook ✅
- [x] **1.11.4** Conditionally render tabs and cards based on role ✅
- [ ] **1.11.5** Test all 3 role variants

---

### Day 3: Layout Components

#### Task 1.12: Header Component
- [x] **1.12.1** Query `users.avatar_url` for user avatar display ✅
- [x] **1.12.2** Query notifications for real unread count ✅
- [x] **1.12.3** Add notification badge with count ✅
- [ ] **1.12.4** Add search input (if specified in wireframe)
- [x] **1.12.5** Add user menu dropdown ✅

**Wireframe Reference:** [task-0.5.1.15-header-component.md](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md)

**Database Tables:** `users`, `notifications`

#### Task 1.13: Sidebar Component
- [ ] **1.13.1** Query `system_config` for module activation status
- [ ] **1.13.2** Hide/show module menu items based on activation
- [ ] **1.13.3** Query pending counts for badge indicators (pending submissions, breaches, etc.)
- [ ] **1.13.4** Add role-based menu filtering
- [ ] **1.13.5** Add collapsed state with icons only

**Wireframe Reference:** [task-0.5.1.16-sidebar-navigation.md](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)

**Database Tables:** `system_config`, various for counts

#### Task 1.14: Notification Center
- [x] **1.14.1** Query `notifications` table for real notifications ✅
- [x] **1.14.2** Group by notification type (submission, compliance, enforcement, system) ✅
- [x] **1.14.3** Add mark as read functionality ✅
- [x] **1.14.4** Add mark all as read ✅
- [x] **1.14.5** Add real-time subscription for new notifications ✅

**Wireframe Reference:** [task-0.5.1.17-notification-center-component.md](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md)

**Database Tables:** `notifications`

---

### Day 4: Auth Pages

#### Task 1.15: Login Page
- [ ] **1.15.1** Add password visibility toggle
- [ ] **1.15.2** Add "Remember me" checkbox
- [ ] **1.15.3** Add loading state during authentication
- [ ] **1.15.4** Add error states with clear messages
- [ ] **1.15.5** Add MFA support (if applicable)

**Wireframe Reference:** [task-0.5.1.11-login-page.md](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md)

#### Task 1.16: Registration Page
- [ ] **1.16.1** Add company selection dropdown (query `companies` table)
- [ ] **1.16.2** Add email verification workflow indicator
- [ ] **1.16.3** Add password strength indicator
- [ ] **1.16.4** Add terms acceptance checkbox
- [ ] **1.16.5** Add loading and success states

**Wireframe Reference:** [task-0.5.1.12-registration-page.md](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md)

**Database Tables:** `companies`

#### Task 1.17: Forgot/Reset Password
- [ ] **1.17.1** Add email sent confirmation screen
- [ ] **1.17.2** Add resend timer (60 seconds)
- [ ] **1.17.3** Add password strength indicator on reset
- [ ] **1.17.4** Add success state with redirect
- [ ] **1.17.5** Add error handling for invalid/expired tokens

**Wireframe Reference:** [task-0.5.1.13-forgot-reset-password.md](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md)

#### Task 1.18: Profile Page
- [x] **1.18.1** Add avatar upload using `users.avatar_url` ✅
- [ ] **1.18.2** Add timezone selector using `users.timezone`
- [ ] **1.18.3** Add language selector using `users.language`
- [ ] **1.18.4** Add notification preferences using `users.notification_preferences`
- [ ] **1.18.5** Add password change section
- [ ] **1.18.6** Add data export functionality

**Wireframe Reference:** [task-0.5.1.22-profile-page.md](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md)

**Database Tables:** `users`

---

### Day 5: Communications

#### Task 1.19: Communications Inbox
- [ ] **1.19.1** Query `conversations` with `lifecycle_state`
- [ ] **1.19.2** Display lifecycle state badges (CREATED, SENT, DELIVERED, READ, etc.)
- [ ] **1.19.3** Add read receipts display (✓✓ format)
- [ ] **1.19.4** Add filters: type, status, entity, company, date range
- [ ] **1.19.5** Add unread indicators
- [ ] **1.19.6** Add threading support

**Wireframe Reference:** [task-0.5.1.24-communications-inbox-list.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md)

**Database Tables:** `conversations`, `messages`

#### Task 1.20: Conversation Detail
- [ ] **1.20.1** Display message thread
- [ ] **1.20.2** Show read receipts (✓✓) using `messages.delivered_at`
- [ ] **1.20.3** Display workflow context (linked entity)
- [ ] **1.20.4** Show lifecycle state visualization
- [ ] **1.20.5** Add archive functionality
- [ ] **1.20.6** Show 7-year retention indicator

**Wireframe Reference:** [task-0.5.1.25-conversation-detail.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md)

**Database Tables:** `conversations`, `messages`

#### Task 1.21: Compose Message
- [ ] **1.21.1** Add recipient picker (users, companies, roles)
- [ ] **1.21.2** Add workflow entity linking (submission_id, breach_id, etc.)
- [ ] **1.21.3** Add attachment upload
- [ ] **1.21.4** Add message preview
- [ ] **1.21.5** Add send confirmation

**Wireframe Reference:** [task-0.5.1.26-compose-message.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md)

**Database Tables:** `users`, `companies`, `messages`

#### Task 1.22: Sent Messages
- [ ] **1.22.1** Query sent messages with status
- [ ] **1.22.2** Display `delivered_at` timestamp
- [ ] **1.22.3** Show status indicators (✓ sent, ✓✓ delivered, ✓✓ read)
- [ ] **1.22.4** Add filters
- [ ] **1.22.5** Add message status aggregation

**Wireframe Reference:** [task-0.5.1.27-sent-messages.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md)

**Database Tables:** `messages`

#### Task 1.23: System Announcements (MOH Tier 1 only)
- [ ] **1.23.1** Add announcement creation interface
- [ ] **1.23.2** Add broadcast controls (role-based, company-based)
- [ ] **1.23.3** Add expiration date picker
- [ ] **1.23.4** Add recipient tracking
- [ ] **1.23.5** Add read/unread status per recipient

**Wireframe Reference:** [task-0.5.1.28-system-announcements.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md)

**Database Tables:** `messages`

#### Task 1.24: Archived Conversations
- [ ] **1.24.1** Query archived conversations
- [ ] **1.24.2** Add archive/unarchive functionality
- [ ] **1.24.3** Show 7-year retention status
- [ ] **1.24.4** Add restore capability
- [ ] **1.24.5** Add retention indicators

**Wireframe Reference:** [task-0.5.1.36-archived-conversations.md](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md)

**Database Tables:** `conversations`

#### Task 1.25: Notifications Page
- [ ] **1.25.1** Query all notifications with pagination
- [ ] **1.25.2** Add filters: type, read/unread, date
- [ ] **1.25.3** Add notification settings interface
- [ ] **1.25.4** Add mark all as read
- [ ] **1.25.5** Add notification preferences editor

**Wireframe Reference:** [task-0.5.1.31-notifications-page.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md)

**Database Tables:** `notifications`, `users.notification_preferences`

---

## Phase 2: RMM Module (Week 2)

**Priority:** 🔴 CRITICAL  
**Pages:** 16  
**Estimated Effort:** 5 days

### Day 1: Companies

#### Task 2.1: Companies List
- [ ] **2.1.1** Query `companies` table with real data
- [ ] **2.1.2** Add DataTable component with sorting
- [ ] **2.1.3** Add filters: type (IPC/Wholesaler), status, registration date
- [ ] **2.1.4** Add search by name/registration number
- [ ] **2.1.5** Add pagination
- [ ] **2.1.6** Add empty state
- [ ] **2.1.7** Add loading skeleton

**Wireframe Reference:** [task-0.5.2.2-companies-list.md](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)

**Database Tables:** `companies`

#### Task 2.2: Company Detail
- [ ] **2.2.1** Query company by ID with full details
- [ ] **2.2.2** Add Tabs component (Overview, Products, History)
- [ ] **2.2.3** Display company information on Overview tab
- [ ] **2.2.4** Query and display related products on Products tab
- [ ] **2.2.5** Query and display history timeline on History tab
- [ ] **2.2.6** Add action buttons (Edit, Submit for Review)
- [ ] **2.2.7** Add workflow status indicator

**Wireframe Reference:** [task-0.5.2.3-company-detail.md](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md)

**Database Tables:** `companies`, `products`, `registry_submissions`, `audit_logs`

#### Task 2.3: Company Create/Edit Form
- [ ] **2.3.1** Add all form fields matching `companies` table
- [ ] **2.3.2** Add registration number validation (uniqueness, format)
- [ ] **2.3.3** Add company type selector (IPC/Wholesaler)
- [ ] **2.3.4** Add form validation with error messages
- [ ] **2.3.5** Add draft auto-save functionality
- [ ] **2.3.6** Add loading and success states

**Wireframe Reference:** [task-0.5.2.8-company-create-edit-form.md](../../04-design/user-experience/wireframes/01-rmm/forms/task-0.5.2.8-company-create-edit-form.md)

**Database Tables:** `companies`

---

### Day 2: Products

#### Task 2.4: Products List
- [ ] **2.4.1** Query `products` table with real data
- [ ] **2.4.2** Join with `companies` for company name display
- [ ] **2.4.3** Join with `atc_codes` for ATC code display
- [ ] **2.4.4** Add company filter dropdown
- [ ] **2.4.5** Add search functionality
- [ ] **2.4.6** Add pagination
- [ ] **2.4.7** Add sorting by name, company, ATC code

**Wireframe Reference:** [task-0.5.2.4-products-list.md](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md)

**Database Tables:** `products`, `companies`, `atc_codes`

#### Task 2.5: Product Detail
- [ ] **2.5.1** Query product by ID with full details
- [ ] **2.5.2** Add Tabs component (Overview, SKUs, History)
- [ ] **2.5.3** Display product information with ATC code on Overview
- [ ] **2.5.4** Query and display related SKUs on SKUs tab
- [ ] **2.5.5** Query and display history timeline on History tab
- [ ] **2.5.6** Add action buttons

**Wireframe Reference:** [task-0.5.2.5-product-detail.md](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md)

**Database Tables:** `products`, `skus`, `atc_codes`, `audit_logs`

#### Task 2.6: Product Create/Edit Form
- [ ] **2.6.1** Add all form fields matching `products` table
- [ ] **2.6.2** Add ATC code selector (dropdown from `atc_codes` table)
- [ ] **2.6.3** Add company selector (for MOH creating products)
- [ ] **2.6.4** Add form validation
- [ ] **2.6.5** Add draft auto-save

**Wireframe Reference:** [task-0.5.2.9-product-create-edit-form.md](../../04-design/user-experience/wireframes/01-rmm/forms/task-0.5.2.9-product-create-edit-form.md)

**Database Tables:** `products`, `atc_codes`, `companies`

---

### Day 3: SKUs

#### Task 2.7: SKUs List
- [ ] **2.7.1** Query `skus` table with real data
- [ ] **2.7.2** Include pharmaceutical attributes: `dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure`
- [ ] **2.7.3** Join with `products` and `companies`
- [ ] **2.7.4** Add filters: product, company, dosage form
- [ ] **2.7.5** Add search functionality
- [ ] **2.7.6** Add pagination
- [ ] **2.7.7** Add sorting

**Wireframe Reference:** [task-0.5.2.6-skus-list.md](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md)

**Database Tables:** `skus`, `products`, `companies`

#### Task 2.8: SKU Detail
- [ ] **2.8.1** Query SKU by ID with full details
- [ ] **2.8.2** Display pharmaceutical attributes prominently
- [ ] **2.8.3** Add Tabs component (Overview, History, Submissions)
- [ ] **2.8.4** Query and display submission history
- [ ] **2.8.5** Query and display threshold changes
- [ ] **2.8.6** Add action buttons

**Wireframe Reference:** [task-0.5.2.7-sku-detail.md](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md)

**Database Tables:** `skus`, `products`, `aams_submissions`, `wsl_submissions`, `thresholds`, `audit_logs`

#### Task 2.9: SKU Create/Edit Form
- [ ] **2.9.1** Add all form fields including pharmaceutical attributes
- [ ] **2.9.2** Add `dosage_strength` input
- [ ] **2.9.3** Add `dosage_form` dropdown
- [ ] **2.9.4** Add `pack_size` input
- [ ] **2.9.5** Add `unit_of_measure` dropdown
- [ ] **2.9.6** Add product selector
- [ ] **2.9.7** Add form validation

**Wireframe Reference:** [task-0.5.2.10-sku-create-edit-form.md](../../04-design/user-experience/wireframes/01-rmm/forms/task-0.5.2.10-sku-create-edit-form.md)

**Database Tables:** `skus`, `products`

---

### Day 4: Registry Submissions & MOH Pages

#### Task 2.10: Registry Submissions List
- [ ] **2.10.1** Query `registry_submissions` table
- [ ] **2.10.2** Add status filters (draft, submitted, verified, approved, etc.)
- [ ] **2.10.3** Add type filters (company, product, SKU registration)
- [ ] **2.10.4** Add date range filter
- [ ] **2.10.5** Add workflow status badges
- [ ] **2.10.6** Add pagination

**Wireframe Reference:** [task-0.5.2.11-registry-submission-list.md](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md)

**Database Tables:** `registry_submissions`, `companies`

#### Task 2.11: Registry Submission Detail
- [ ] **2.11.1** Query submission by ID with full details
- [ ] **2.11.2** Display workflow status prominently
- [ ] **2.11.3** Show approval chain (Tier 2 → Tier 1 → Tier 2 implementation)
- [ ] **2.11.4** Query and display approval history
- [ ] **2.11.5** Add workflow action buttons based on role and status
- [ ] **2.11.6** Add history timeline

**Wireframe Reference:** [task-0.5.2.12-registry-submission-detail.md](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md)

**Database Tables:** `registry_submissions`, `approvals`, `users`

#### Task 2.12: ATC Codes List (MOH only)
- [ ] **2.12.1** Query `atc_codes` table
- [ ] **2.12.2** Add search functionality
- [ ] **2.12.3** Add filters by level and category
- [ ] **2.12.4** Display hierarchical structure
- [ ] **2.12.5** Add pagination

**Wireframe Reference:** [task-0.5.2.14-atc-codes-list.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md)

**Database Tables:** `atc_codes`

#### Task 2.13: Critical Medicines List (MOH Tier 1 only)
- [ ] **2.13.1** Query `critical_medicines` with joined SKU data
- [ ] **2.13.2** Add designation interface for Tier 1
- [ ] **2.13.3** Add filters by ATC code, designation date
- [ ] **2.13.4** Display SKU pharmaceutical attributes
- [ ] **2.13.5** Add designation history

**Wireframe Reference:** [task-0.5.2.15-critical-medicines-list.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md)

**Database Tables:** `critical_medicines`, `skus`, `products`

---

### Day 5: RMM Overview

#### Task 2.14: RMM Overview Page
- [ ] **2.14.1** Query counts: companies, products, SKUs
- [ ] **2.14.2** Display overview metrics cards
- [ ] **2.14.3** Query recent activity timeline
- [ ] **2.14.4** Add quick links to main sections
- [ ] **2.14.5** Add pending items summary

**Wireframe Reference:** [task-0.5.2.1-rmm-overview.md](../../04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md)

**Database Tables:** `companies`, `products`, `skus`, `registry_submissions`

---

## Phase 3: VCI Module (Week 3)

**Priority:** 🔴 CRITICAL  
**Pages:** 17  
**Estimated Effort:** 5 days

### Day 1: AAMS

#### Task 3.1: AAMS Submissions List
- [ ] **3.1.1** Query `aams_submissions` table
- [ ] **3.1.2** Add year filter
- [ ] **3.1.3** Add status filter
- [ ] **3.1.4** Add late submission indicators
- [ ] **3.1.5** Add company filter (for MOH)
- [ ] **3.1.6** Add pagination

**Wireframe Reference:** [task-0.5.3.1-aams-submissions-list.md](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md)

**Database Tables:** `aams_submissions`, `companies`

#### Task 3.2: AAMS Submission Detail
- [ ] **3.2.1** Query submission by ID with full data
- [ ] **3.2.2** Display calculated threshold (B × threshold_base)
- [ ] **3.2.3** Show workflow status with timeline
- [ ] **3.2.4** Display duration type (permanent, temporary_auto_revert, temporary_manual_review)
- [ ] **3.2.5** Show revert date for temporary thresholds
- [ ] **3.2.6** Add workflow action buttons

**Wireframe Reference:** [task-0.5.3.3-aams-submission-detail.md](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md)

**Database Tables:** `aams_submissions`, `thresholds`

#### Task 3.3: AAMS Submission Form
- [ ] **3.3.1** Add year selector
- [ ] **3.3.2** Add SKU selector with autocomplete
- [ ] **3.3.3** Create 12-month data entry grid (Jan-Dec)
- [ ] **3.3.4** Add CSV import functionality
- [ ] **3.3.5** Add CSV export functionality
- [ ] **3.3.6** Add draft auto-save
- [ ] **3.3.7** Add deadline indicator
- [ ] **3.3.8** Add validation (quantity >= 0, SKU exists)

**Wireframe Reference:** [task-0.5.3.2-aams-submission-form.md](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md)

**Database Tables:** `aams_submissions`, `skus`

---

### Day 2: MSQ

#### Task 3.4: MSQ Submissions List
- [ ] **3.4.1** Query `msq_submissions` table
- [ ] **3.4.2** Add month filter
- [ ] **3.4.3** Add flagged for review indicator
- [ ] **3.4.4** Add correction tracking (`correction_of` field)
- [ ] **3.4.5** Add status filter
- [ ] **3.4.6** Add pagination

**Wireframe Reference:** [task-0.5.3.7-msq-submissions-list.md](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.7-msq-submissions-list.md)

**Database Tables:** `msq_submissions`, `companies`

#### Task 3.5: MSQ Submission Detail
- [ ] **3.5.1** Query submission by ID
- [ ] **3.5.2** Display validation status (passed/failed)
- [ ] **3.5.3** Add review actions (flag for review, approve)
- [ ] **3.5.4** Add 7-day grace period indicator with countdown
- [ ] **3.5.5** Show correction history if this is a correction
- [ ] **3.5.6** Add workflow action buttons

**Wireframe Reference:** [task-0.5.3.9-msq-submission-detail.md](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submission-detail.md)

**Database Tables:** `msq_submissions`

#### Task 3.6: MSQ Submission Form
- [ ] **3.6.1** Add month selector
- [ ] **3.6.2** Add SKU entry table (SKU_ID + Quantity)
- [ ] **3.6.3** Add validation (quantity >= 0, SKU exists)
- [ ] **3.6.4** Add bulk upload functionality
- [ ] **3.6.5** Add draft auto-save

**Wireframe Reference:** [task-0.5.3.8-msq-submission-form.md](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.8-msq-submission-form.md)

**Database Tables:** `msq_submissions`, `skus`

#### Task 3.7: MSQ Correction Interface
- [ ] **3.7.1** Display original submission data
- [ ] **3.7.2** Add editable fields
- [ ] **3.7.3** Add 7-day grace period countdown
- [ ] **3.7.4** Track `correction_of` reference
- [ ] **3.7.5** Add validation

**Wireframe Reference:** [task-0.5.3.10-msq-correction-interface.md](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-correction-interface.md)

**Database Tables:** `msq_submissions`

---

### Day 3: WSL & Breaches

#### Task 3.8: WSL Submissions List
- [ ] **3.8.1** Query `wsl_submissions` table
- [ ] **3.8.2** Add week filter (YYYY-WW format)
- [ ] **3.8.3** Add deadline indicators (due, overdue)
- [ ] **3.8.4** Display threshold compliance %
- [ ] **3.8.5** Display replenishment date
- [ ] **3.8.6** Add violation reason display (if compliance < 80%)
- [ ] **3.8.7** Add pagination

**Wireframe Reference:** [task-0.5.3.11-wsl-submissions-list.md](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.11-wsl-submissions-list.md)

**Database Tables:** `wsl_submissions`, `companies`

#### Task 3.9: WSL Submission Detail
- [ ] **3.9.1** Query submission by ID
- [ ] **3.9.2** Display stock level vs threshold comparison (visualization)
- [ ] **3.9.3** Show compliance violation indicators (if < 80%)
- [ ] **3.9.4** Display breach reason
- [ ] **3.9.5** Display replenishment date
- [ ] **3.9.6** Link to related breach if one was created
- [ ] **3.9.7** Add workflow action buttons

**Wireframe Reference:** [task-0.5.3.13-wsl-submission-detail.md](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md)

**Database Tables:** `wsl_submissions`, `breaches`, `thresholds`

#### Task 3.10: WSL Submission Form
- [ ] **3.10.1** Pre-populate with ALL company SKUs (requirement)
- [ ] **3.10.2** Add week ending date picker
- [ ] **3.10.3** Display current threshold for each SKU
- [ ] **3.10.4** Calculate and display threshold compliance %
- [ ] **3.10.5** Add conditional fields: `replenishment_date` (if < 80%)
- [ ] **3.10.6** Add conditional fields: `breach_reason` (if < 80%)
- [ ] **3.10.7** Add validation

**Wireframe Reference:** [task-0.5.3.12-wsl-submission-form.md](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md)

**Database Tables:** `wsl_submissions`, `skus`, `thresholds`

#### Task 3.11: Breaches List
- [ ] **3.11.1** Query `breaches` table
- [ ] **3.11.2** Add priority filter (normal, high, extreme)
- [ ] **3.11.3** Add active/resolved toggle
- [ ] **3.11.4** Add company filter (for MOH)
- [ ] **3.11.5** Add SKU filter
- [ ] **3.11.6** Add date range filter
- [ ] **3.11.7** Add pagination

**Wireframe Reference:** [task-0.5.3.14-compliance-violations-list.md](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md)

**Database Tables:** `breaches`, `companies`, `skus`

#### Task 3.12: Breach Detail
- [ ] **3.12.1** Query breach by ID with full details
- [ ] **3.12.2** Create stock level vs threshold visualization (chart)
- [ ] **3.12.3** Display breach reason
- [ ] **3.12.4** Display replenishment date if provided
- [ ] **3.12.5** Display priority with color coding
- [ ] **3.12.6** Show analysis history
- [ ] **3.12.7** Add analysis/approval action buttons (role-based)

**Wireframe Reference:** [task-0.5.3.15-breach-detail.md](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-breach-detail.md)

**Database Tables:** `breaches`, `breach_analyses`, `thresholds`

---

### Day 4: Governance & Thresholds

#### Task 3.13: Governance Dashboard
- [ ] **3.13.1** Create stock sufficiency charts (trend over time)
- [ ] **3.13.2** Create compliance violation status cards (active, resolved, pending)
- [ ] **3.13.3** Create action recommendations list
- [ ] **3.13.4** Add pending reversions metric
- [ ] **3.13.5** Add filters and date range

**Wireframe Reference:** [task-0.5.3.18-governance-dashboard.md](../../04-design/user-experience/wireframes/02-vci/governance-dashboard/task-0.5.3.18-governance-dashboard.md)

**Database Tables:** `wsl_submissions`, `breaches`, `thresholds`, `breach_analyses`

#### Task 3.14: Thresholds Management Page
- [ ] **3.14.1** Query `thresholds` table
- [ ] **3.14.2** Add filters: type (local/global), status (active/pending_reversion), duration
- [ ] **3.14.3** Display duration type (permanent, temporary_auto_revert, temporary_manual_review)
- [ ] **3.14.4** Display revert date
- [ ] **3.14.5** Add pending reversion indicators (color coding)
- [ ] **3.14.6** Add bulk actions (bulk revert, bulk extend)
- [ ] **3.14.7** Add modification modal

**Wireframe Reference:** [task-0.5.3.4-threshold-management.md](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md)

**Database Tables:** `thresholds`

---

### Day 5: VCI Overview & History

#### Task 3.15: VCI Overview Page
- [ ] **3.15.1** Query submission counts by type (AAMS, MSQ, WSL)
- [ ] **3.15.2** Display compliance status overview
- [ ] **3.15.3** Add compliance violation alerts
- [ ] **3.15.4** Add quick links

**Wireframe Reference:** [task-0.5.3.0-vci-overview.md](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.0-vci-overview.md)

**Database Tables:** `aams_submissions`, `msq_submissions`, `wsl_submissions`, `breaches`

#### Task 3.16: Submission History Page
- [ ] **3.16.1** Query all submission types with pagination
- [ ] **3.16.2** Add timeline visualization
- [ ] **3.16.3** Add filters by type, date, company
- [ ] **3.16.4** Add 7-year retention display

**Wireframe Reference:** [task-0.5.3.19-submission-history.md](../../04-design/user-experience/wireframes/02-vci/task-0.5.3.19-submission-history.md)

**Database Tables:** All submission tables

#### Task 3.17: Submission Trends Page
- [ ] **3.17.1** Create trend charts (month-over-month, year-over-year)
- [ ] **3.17.2** Add data aggregation
- [ ] **3.17.3** Add filters
- [ ] **3.17.4** Add export functionality

**Wireframe Reference:** [task-0.5.3.20-submission-trends.md](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends.md)

**Database Tables:** All submission tables

---

## Phase 4: Enforcement + Audit (Week 4)

**Priority:** 🟡 HIGH  
**Pages:** 12  
**Estimated Effort:** 5 days

### Day 1-2: Enforcement

#### Task 4.1: Enforcement Overview
- [ ] **4.1.1** Query dashboard metrics (total actions, pending, resolved)
- [ ] **4.1.2** Create recent actions timeline
- [ ] **4.1.3** Create pending approvals widget
- [ ] **4.1.4** Add action type breakdown chart

**Wireframe Reference:** [task-0.5.2.0-enforcement-dashboard.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.0-enforcement-dashboard.md)

**Database Tables:** `enforcement_actions`

#### Task 4.2: Enforcement Actions List
- [ ] **4.2.1** Query `enforcement_actions` table
- [ ] **4.2.2** Add filters: action_type, status, company, date range
- [ ] **4.2.3** Add sortable columns
- [ ] **4.2.4** Add pagination

**Wireframe Reference:** [task-0.5.2.1-enforcement-actions-list.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1-enforcement-actions-list.md)

**Database Tables:** `enforcement_actions`, `companies`

#### Task 4.3: Enforcement Action Detail
- [ ] **4.3.1** Query action by ID with full details
- [ ] **4.3.2** Display workflow status
- [ ] **4.3.3** Show approval chain
- [ ] **4.3.4** Display violation details
- [ ] **4.3.5** Show appeal status and link
- [ ] **4.3.6** Add action buttons based on role

**Wireframe Reference:** [task-0.5.2.1a-enforcement-action-detail.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1a-enforcement-action-detail.md)

**Database Tables:** `enforcement_actions`, `enforcement_action_appeals`, `breaches`

#### Task 4.4: Create Enforcement Action
- [ ] **4.4.1** Create multi-step wizard
- [ ] **4.4.2** Add company selector
- [ ] **4.4.3** Add action type selector
- [ ] **4.4.4** Add violation/breach selector
- [ ] **4.4.5** Add amount input with currency
- [ ] **4.4.6** Add legal basis input
- [ ] **4.4.7** Add justification text area
- [ ] **4.4.8** Add form validation

**Wireframe Reference:** [task-0.5.2.1b-create-enforcement-action-wizard.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1b-create-enforcement-action-wizard.md)

**Database Tables:** `enforcement_actions`, `companies`, `breaches`

#### Task 4.5: Pending Approvals
- [ ] **4.5.1** Query pending enforcement actions
- [ ] **4.5.2** Add approve/reject actions with justification
- [ ] **4.5.3** Add bulk approval functionality
- [ ] **4.5.4** Add workflow tracking

**Wireframe Reference:** [task-0.5.2.1c-pending-approvals.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1c-pending-approvals.md)

**Database Tables:** `enforcement_actions`

#### Task 4.6: Appeals List
- [ ] **4.6.1** Query `enforcement_action_appeals`
- [ ] **4.6.2** Add status filter
- [ ] **4.6.3** Add review interface
- [ ] **4.6.4** Add uphold/overturn actions

**Wireframe Reference:** [task-0.5.2.1e-appeal-review-interface.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1e-appeal-review-interface.md)

**Database Tables:** `enforcement_action_appeals`, `enforcement_actions`

#### Task 4.7: Enforcement Reports
- [ ] **4.7.1** Create enforcement analytics
- [ ] **4.7.2** Add trend charts
- [ ] **4.7.3** Add action type breakdown
- [ ] **4.7.4** Add company compliance tracking

**Wireframe Reference:** [task-0.5.2.1d-enforcement-reports.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.1d-enforcement-reports.md)

**Database Tables:** `enforcement_actions`

---

### Day 3-4: Audit

#### Task 4.8: Audit Overview
- [ ] **4.8.1** Create audit dashboard
- [ ] **4.8.2** Display hash chain status
- [ ] **4.8.3** Add recent logs summary

**Wireframe Reference:** [task-0.5.1.32-audit-logs-list.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md)

**Database Tables:** `audit_logs`

#### Task 4.9: Audit Logs List
- [ ] **4.9.1** Query `audit_logs` table
- [ ] **4.9.2** Add filters: date range, table, user, action
- [ ] **4.9.3** Display hash chain information
- [ ] **4.9.4** Add search functionality
- [ ] **4.9.5** Add pagination with virtual scroll for large datasets

**Wireframe Reference:** [task-0.5.1.32-audit-logs-list.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md)

**Database Tables:** `audit_logs`, `users`

#### Task 4.10: Audit Log Detail
- [ ] **4.10.1** Query log by ID
- [ ] **4.10.2** Display hash chain verification
- [ ] **4.10.3** Show related changes (same record_id)
- [ ] **4.10.4** Display user information
- [ ] **4.10.5** Display before/after values

**Wireframe Reference:** [task-0.5.1.33-audit-log-detail.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md)

**Database Tables:** `audit_logs`

#### Task 4.11: Audit Reports
- [ ] **4.11.1** Query `regulatory_reports` table
- [ ] **4.11.2** Add report generation interface
- [ ] **4.11.3** Add download actions (PDF, CSV)
- [ ] **4.11.4** Add filters by type and period

**Wireframe Reference:** [task-0.5.1.34-audit-reports.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.34-audit-reports.md)

**Database Tables:** `regulatory_reports`

---

### Day 5: History & Final Testing

#### Task 4.12: History Overview
- [ ] **4.12.1** Create unified history timeline
- [ ] **4.12.2** Add filters by type, entity, company, date range
- [ ] **4.12.3** Add 7-year retention display
- [ ] **4.12.4** Add export functionality

**Wireframe Reference:** [task-0.5.1.30-history-overview.md](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md)

**Database Tables:** Various

#### Task 4.13: Final Integration Testing
- [ ] **4.13.1** Test all pages with real database data
- [ ] **4.13.2** Verify all role variants work correctly
- [ ] **4.13.3** Test all states (loading, error, empty)
- [ ] **4.13.4** Test responsive design on all breakpoints
- [ ] **4.13.5** Verify accessibility (WCAG 2.1 AA)
- [ ] **4.13.6** Performance testing

---

## Phase 0.6 Database Integration Verification

**Reference:** [phase-0-6-databases.md](../05-project-management/phases/phase-0-6-databases.md)

All 14 Phase 0.6 schema changes must be utilized in the remediated pages. Use this checklist to verify integration.

### Phase 0.6 Coverage Matrix

| # | Table | Field/Change | Where Used | Task Reference |
|---|-------|--------------|------------|----------------|
| 1 | `users` | `avatar_url` | Header, Profile | 1.12.1, 1.18.1 |
| 2 | `users` | `timezone` | Profile settings | 1.18.2 |
| 3 | `users` | `language` | Profile settings | 1.18.3 |
| 4 | `users` | `notification_preferences` | Profile, Notifications | 1.18.4, 1.25 |
| 5 | `conversations` | `lifecycle_state` | Inbox, Conversation detail | 1.19.1, 1.20 |
| 6 | `messages` | `delivered_at` | Sent, Conversation detail | 1.20.2, 1.22.2 |
| 7 | `follow_ups` | New table | Dashboard, Modals | 1.4.5, 1.10.2 |
| 8 | `meetings` | New table | Dashboard modals | 1.10.3 |
| 9 | `meeting_attendees` | New table | Dashboard modals | 1.10.3 |
| 10 | `skus` | `dosage_strength` | SKU list/detail/forms | 2.7.2, 2.9.2 |
| 11 | `skus` | `dosage_form` | SKU list/detail/forms | 2.7.2, 2.9.3 |
| 12 | `skus` | `pack_size` | SKU list/detail/forms | 2.7.2, 2.9.4 |
| 13 | `skus` | `unit_of_measure` | SKU list/detail/forms | 2.7.2, 2.9.5 |
| 14 | Various | Performance indexes | All queries | Implicit |

### User Profile Fields Checklist

- [ ] **Header Component** displays user avatar from `users.avatar_url`
- [ ] **Profile Page** allows avatar upload to `users.avatar_url`
- [ ] **Profile Page** has timezone selector for `users.timezone`
- [ ] **Profile Page** has language selector for `users.language`
- [ ] **Profile Page** has notification preferences editor for `users.notification_preferences`
- [ ] **Notifications Page** respects `notification_preferences` settings

### Communication Fields Checklist

- [ ] **Inbox List** displays `conversations.lifecycle_state` as status badges
- [ ] **Inbox List** shows lifecycle states: CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED
- [ ] **Conversation Detail** displays lifecycle state visualization
- [ ] **Conversation Detail** shows read receipts (✓✓) using `messages.delivered_at`
- [ ] **Sent Messages** displays delivery status using `messages.delivered_at`
- [ ] **Sent Messages** shows status indicators: ✓ sent, ✓✓ delivered, ✓✓ read

### Governance Tables Checklist

- [ ] **Dashboard** queries `follow_ups` table for Follow-up Tracking card
- [ ] **Dashboard** displays active follow-ups with assigned officer and due date
- [ ] **Assign Follow-up Modal** creates records in `follow_ups` table
- [ ] **Schedule Meeting Modal** creates records in `meetings` table
- [ ] **Schedule Meeting Modal** creates attendee records in `meeting_attendees` table
- [ ] **Emergency Meeting Modal** pre-selects Tier 1 and Tier 2 attendees

### SKU Pharmaceutical Attributes Checklist

- [ ] **SKU List** displays `dosage_strength` column
- [ ] **SKU List** displays `dosage_form` column
- [ ] **SKU List** displays `pack_size` column
- [ ] **SKU List** displays `unit_of_measure` column
- [ ] **SKU Detail** prominently displays all 4 pharmaceutical attributes
- [ ] **SKU Create Form** has input for `dosage_strength`
- [ ] **SKU Create Form** has dropdown for `dosage_form`
- [ ] **SKU Create Form** has input for `pack_size`
- [ ] **SKU Create Form** has dropdown for `unit_of_measure`
- [ ] **SKU Edit Form** allows editing all 4 pharmaceutical attributes
- [ ] **SKU filters** include dosage form filter option

### Database Query Verification

For each page, verify the correct database query pattern:

```typescript
// Example: Header with avatar
const { data: user } = await supabase
  .from('users')
  .select('id, full_name, avatar_url, role')
  .eq('id', userId)
  .single();

// Example: Inbox with lifecycle_state
const { data: conversations } = await supabase
  .from('conversations')
  .select('id, subject, lifecycle_state, updated_at, participants:conversation_participants(*)')
  .order('updated_at', { ascending: false });

// Example: SKU with pharmaceutical attributes
const { data: skus } = await supabase
  .from('skus')
  .select('id, name, product_id, dosage_strength, dosage_form, pack_size, unit_of_measure')
  .eq('product_id', productId);

// Example: Follow-ups for dashboard
const { data: followUps } = await supabase
  .from('follow_ups')
  .select('id, company_id, assigned_to, priority, due_date, status, companies(name), users!assigned_to(full_name)')
  .eq('status', 'active')
  .order('due_date', { ascending: true });
```

---

## Success Criteria

### Per-Page Verification

For each page, verify:
- [ ] Layout matches wireframe 100%
- [ ] All data comes from database (no hardcoded values)
- [ ] All Phase 0.6 fields used appropriately
- [ ] Role-based variations implemented
- [ ] All states work (loading, error, empty, success)
- [ ] Responsive design verified
- [ ] Accessibility verified

### Overall Verification

- [ ] All 62 pages achieve 100% wireframe compliance
- [ ] All database tables queried correctly
- [ ] All Phase 0.6 fields utilized
- [ ] All 3 role variants tested
- [ ] No hardcoded data remains
- [ ] Performance acceptable (< 3s load time)

---

## Related Documents

- [Wireframe Compliance Audit](wireframe-compliance-audit.md)
- [Phase-1-Implementation-Plan.md](../05-project-management/phases/Phase-1-Implementation-Plan.md)
- [phase-0-5-ui-ux-wireframes.md](../05-project-management/phases/phase-0-5-ui-ux-wireframes.md)
- [phase-0-6-databases.md](../05-project-management/phases/phase-0-6-databases.md)
- [Wireframe Index](../04-design/user-experience/wireframes/06-documentation/wireframe-index.md)

---

**Created:** 2026-01-14  
**Last Updated:** 2026-01-14  
**Status:** 📋 READY FOR EXECUTION
