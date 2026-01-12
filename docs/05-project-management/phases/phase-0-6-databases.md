# Phase 0.6: Database Schema Audit & Alignment

**Objective:** Conduct a comprehensive audit of all 102+ Phase 0.5 wireframes against the database schema to identify gaps and ensure complete alignment before Phase 1 implementation.

**Owner:** Nadia (Database Specialist) - Lead  
**Second Support:** Fatima (MOH Governance & Regulation SME)  
**Team Members:**
- Nadia (Database Specialist) - Lead
- Fatima (MOH Governance & Regulation SME) - Second Support, Business Rules Validation
- Oliver (Chief Architect) - Architecture Alignment
- Rafi (RLS/RBAC Specialist) - RLS Policy Design for New Tables
- Emma (UI/UX + Next.js Frontend Specialist) - Wireframe Requirements Clarification

**Estimated Duration:** 5-7 days (depending on findings complexity)  
**Status:** ✅ COMPLETE (January 21, 2026) - All phases complete, schema updated, ready for Phase 1  
**Created:** 2025-01-21  
**Last Updated:** 2026-01-12

**Progress Update:**
- ✅ **Phase 1: Core Foundation - COMPLETE** (33/33 wireframes - 100%)
- ✅ **Phase 2: RMM Module - COMPLETE** (23/23 wireframes - 100%)
- ✅ **Phase 3: VCI Module - COMPLETE** (27/27 wireframes - 100%)
- ✅ **Phase 4: ECS Module - COMPLETE** (9/9 wireframes - 100%)
- ✅ **Phase 5: CMC Module - COMPLETE** (13/13 wireframes - 100%)
- ✅ **Phase 6: Historical Data & Modals - COMPLETE** (16/16 wireframes - 100%)
- ✅ **Phase 7: Gap Consolidation & Analysis - COMPLETE** - Master gap list, impact analysis, dependency map, migration plan
- ✅ **Phase 8: Schema Design Update - COMPLETE** - schema-design.md, erd.md, and data-dictionary.md updated with all new fields and tables
- ✅ **Phase 9: Documentation & Handoff - COMPLETE** - Audit report, change log, implementation priorities, migration templates, team handoff document
- ✅ **Schema Update Specifications Created** - All 8 critical gaps fully specified
- ✅ **Schema Design Updated** - New fields and tables added to all schema design documents
- ✅ **All Documentation Complete** - Ready for Phase 1 implementation
- 📝 Gap Analysis Documents:
  - `phase-0-6-gap-analysis.md` - Detailed gap analysis by phase (Phases 1-6 complete)
  - `phase-0-6-consolidated-gaps.md` - Consolidated master gap list with recommendations (Phase 7 complete)

**Key Deliverables Completed:**
- ✅ `schema-updates-phase0-6-critical-gaps.md` - Complete specifications with migration scripts
- ✅ `schema-design.md` - Updated with all new fields and tables
- ✅ `phase-0-6-gap-analysis.md` - Gap tracking document
- ✅ Progress summaries (archived) - Interim progress tracking (see archive/)

---

## Schema Changes Summary

The following schema changes were implemented as part of Phase 0.6:

| Change # | Table | Field/Change | Type | Purpose |
|----------|-------|--------------|------|---------|
| 1 | users | avatar_url | New field | User profile avatar |
| 2 | users | timezone | New field | User timezone preference |
| 3 | users | language | New field | User language preference |
| 4 | users | notification_preferences | New field (JSONB) | User notification settings |
| 5 | conversations | lifecycle_state | New field | Communication lifecycle tracking |
| 6 | messages | delivered_at | New field | Delivery timestamp tracking |
| 7 | follow_ups | New table | New table | Governance follow-up tracking |
| 8 | meetings | New table | New table | Governance meeting scheduling |
| 9 | meeting_attendees | New table | New table | Meeting attendee tracking |
| 10 | skus | dosage_strength | New field | SKU pharmaceutical attribute |
| 11 | skus | dosage_form | New field | SKU pharmaceutical attribute |
| 12 | skus | pack_size | New field | SKU pharmaceutical attribute |
| 13 | skus | unit_of_measure | New field | SKU pharmaceutical attribute |
| 14 | Various | Indexes | Performance | Performance indexes for new fields |

**Reference:** [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md)

---

## Phase 1 Implementation Plan Integration

All Phase 0.6 schema changes have been integrated into the [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md):

### Migration Tasks Updated
- **Task 1.1.1.2:** Core tables migration includes new user profile fields (avatar_url, timezone, language, notification_preferences)
- **Task 1.1.1.2d:** Communication tables migration includes lifecycle_state, delivered_at
- **Task 1.1.1.2e:** Governance tables migration includes follow_ups, meetings, meeting_attendees
- **Task 1.1.1.7:** RMM tables migration includes SKU pharmaceutical attributes

### RLS Policies Added
- **Task 1.1.1.3f:** RLS policies for governance tables (follow_ups, meetings, meeting_attendees)

### RPC Functions Added
- **Task 1.1.1.10b-10d:** RPC functions for follow_ups, meetings, meeting_attendees CRUD operations

### Frontend Tasks Updated
- **Task 1.1.1.20d:** User profile page includes avatar, timezone, language, notification preferences
- **Task 1.1.1.16g-16n:** Communication components include lifecycle state handling

---

## Overview

This phase ensures the database schema (`schema-design.md`) is fully aligned with all wireframes created during Phase 0.5. The audit will systematically review every wireframe to identify missing tables, fields, indexes, relationships, and business logic requirements.

### Scope
- **Wireframes to Audit:** 102+ wireframes across all modules
- **Documents to Update:**
  - `docs/02-architecture/database/schema-design.md`
  - `docs/02-architecture/database/erd.md`
  - `docs/02-architecture/database/data-dictionary.md`
- **Deliverables:**
  - Complete gap analysis report
  - Updated schema design documents
  - Migration plan for identified changes
  - Implementation priorities document

---

## Phase 0: Preparation & Setup (Day 1, Morning)

**Duration:** 0.5 day  
**Priority:** Critical

### Task 0.1: Audit Framework Setup ✅ COMPLETE
- [x] Create audit checklist template for data requirements
- [x] Define data requirement categories (fields, tables, indexes, relationships, calculations, filters)
- [x] Create gap tracking spreadsheet/document
- [x] Set up audit tracking system (checklist format or issue tracker)

**Deliverable:** ✅ Standardized audit framework ready for use

### Task 0.2: Current Schema Review ✅ COMPLETE
- [x] Read complete `schema-design.md` to understand current state
- [x] Review `erd.md` for relationships understanding
- [x] Review `data-dictionary.md` for field definitions
- [x] Create schema summary document (quick reference)

**Deliverable:** ✅ Schema baseline documented and understood

### Task 0.3: Wireframe Index Creation ✅ COMPLETE
- [x] Create complete list of all wireframe task files (exclude READMEs/docs)
- [x] Organize by module and priority
- [x] Create audit checklist with checkboxes for each wireframe
- [x] Set up tracking for completed audits

**Deliverable:** ✅ Complete wireframe index prepared for systematic audit

**Phase 0 Deliverable:** ✅ Audit framework ready, schema baseline documented, wireframe index prepared

---

## Phase 1: Core Foundation - Critical Path (Day 1, Afternoon + Day 2, Morning)

**Duration:** 1.5 days  
**Priority:** Critical — These wireframes affect all modules

### Batch 1.1: Authentication & Profile (3 wireframes)

#### Task 1.1.1: Audit Login Page
- **Wireframe:** `task-0.5.1.11-login-page.md`
- **Checks:**
  - [ ] Auth fields (email, password)
  - [ ] Password reset requirements
  - [ ] Session management requirements
  - [ ] Multi-factor authentication support (if mentioned)
- **Document findings:** Create gap analysis entry

#### Task 1.1.2: Audit Registration Page
- **Wireframe:** `task-0.5.1.12-registration-page.md`
- **Checks:**
  - [ ] Registration fields (name, email, password, company selection)
  - [ ] Validation rules
  - [ ] Email verification workflow
  - [ ] Role assignment during registration
- **Document findings:** Create gap analysis entry

#### Task 1.1.3: Audit Profile Page ⚠️ (Partially done)
- **Wireframe:** `task-0.5.1.22-profile-page.md`
- **Checks:**
  - [ ] Verify: `avatar_url`, `timezone`, `language`, `notification_preferences` fields needed
  - [ ] Password change fields
  - [ ] Data export requirements
  - [ ] Profile update workflow
- **Document findings:** Create gap analysis entry

### Batch 1.2: Layout & Navigation (4 wireframes)

#### Task 1.2.1: Audit Dashboard Layout Structure
- **Wireframe:** `task-0.5.1.14-dashboard-layout-structure.md`
- **Checks:**
  - [ ] Layout data requirements (likely minimal/no DB requirements)
  - [ ] Responsive breakpoints (UI-only)
  - [ ] Module visibility based on role
- **Document findings:** Create gap analysis entry

#### Task 1.2.2: Audit Header Component
- **Wireframe:** `task-0.5.1.15-header-component.md`
- **Checks:**
  - [ ] User menu data (name, avatar, role)
  - [ ] Notification badge count (real-time)
  - [ ] Search requirements (if any)
  - [ ] Logout functionality
- **Document findings:** Create gap analysis entry

#### Task 1.2.3: Audit Sidebar Navigation
- **Wireframe:** `task-0.5.1.16-sidebar-navigation.md`
- **Checks:**
  - [ ] Module activation status (system_config)
  - [ ] Role-based menu items
  - [ ] Badge counts for pending items
  - [ ] Navigation state persistence
- **Document findings:** Create gap analysis entry

#### Task 1.2.4: Audit Notification Center Component ⚠️ (Partially done)
- **Wireframe:** `task-0.5.1.17-notification-center-component.md`
- **Checks:**
  - [ ] Verify: Notification types (submission, compliance, enforcement, system)
  - [ ] Unread counts (real-time)
  - [ ] Threshold reversion notification support
  - [ ] Notification expiration/deletion
- **Document findings:** Create gap analysis entry

### Batch 1.3: Dashboards (3 wireframes) ⚠️ (Partially done)

#### Task 1.3.1: Audit Company Dashboard
- **Wireframe:** `task-0.5.1.18-company-dashboard.md`
- **Checks:**
  - [ ] "My submissions" data (all submission types)
  - [ ] Pending approvals count
  - [ ] Recent activity timeline
  - [ ] Metrics widgets (compliance score, pending items)
  - [ ] Quick action links
- **Document findings:** Create gap analysis entry

#### Task 1.3.2: Audit MOH Tier 1 Dashboard ⚠️ (Partially done)
- **Wireframe:** `task-0.5.1.19-moh-tier1-dashboard.md`
- **Checks:**
  - [ ] Verify: Follow-up tracking table needed (`follow_ups`)
  - [ ] Meetings scheduling table needed (`meetings`, `meeting_attendees`)
  - [ ] %SC calculation widget
  - [ ] Pending reversions widget (threshold reversions)
  - [ ] Enforcement actions summary
  - [ ] Compliance metrics overview
- **Document findings:** Create gap analysis entry

#### Task 1.3.3: Audit MOH Tier 2 Dashboard
- **Wireframe:** `task-0.5.1.20-moh-tier2-dashboard.md`
- **Checks:**
  - [ ] Pending verifications queue
  - [ ] Oversight metrics
  - [ ] Review queue data (submissions, scores, disputes)
  - [ ] Activity timeline
- **Document findings:** Create gap analysis entry

### Batch 1.4: Communications (7 wireframes) ⚠️ (Partially done)

#### Task 1.4.1: Audit Communications Inbox List ⚠️ (Partially done)
- **Wireframe:** `task-0.5.1.24-communications-inbox-list.md`
- **Checks:**
  - [ ] Verify: `lifecycle_state` field needed (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)
  - [ ] Filters: type, status, entity, company, date range
  - [ ] Unread indicators
  - [ ] Read receipts format (✓✓)
  - [ ] Threading support
- **Document findings:** Create gap analysis entry

#### Task 1.4.2: Audit Conversation Detail
- **Wireframe:** `task-0.5.1.25-conversation-detail.md`
- **Checks:**
  - [ ] Message thread display
  - [ ] Read receipts (✓✓ format)
  - [ ] Workflow context display
  - [ ] Lifecycle states visualization
  - [ ] Archive functionality
  - [ ] 7-year retention indicators
- **Document findings:** Create gap analysis entry

#### Task 1.4.3: Audit Compose Message
- **Wireframe:** `task-0.5.1.26-compose-message.md`
- **Checks:**
  - [ ] Recipient selection (users, companies, roles)
  - [ ] Workflow entity linking (submission_id, breach_id, etc.)
  - [ ] Attachment upload
  - [ ] File upload table exists for message attachments
- **Document findings:** Create gap analysis entry

#### Task 1.4.4: Audit Sent Messages
- **Wireframe:** `task-0.5.1.27-sent-messages.md`
- **Checks:**
  - [ ] Verify: Status indicators (✓✓ format)
  - [ ] Sent/delivered/read tracking
  - [ ] `delivered_at` timestamp field needed
  - [ ] Message status aggregation
- **Document findings:** Create gap analysis entry

#### Task 1.4.5: Audit System Announcements
- **Wireframe:** `task-0.5.1.28-system-announcements.md`
- **Checks:**
  - [ ] Announcement creation interface
  - [ ] Broadcast controls (role-based, company-based)
  - [ ] Expiration dates (`announcement_expires_at`)
  - [ ] Broadcast recipient tracking
  - [ ] Read/unread status per recipient
- **Document findings:** Create gap analysis entry

#### Task 1.4.6: Audit Communication Integration in Workflow
- **Wireframe:** `task-0.5.1.29-communication-integration-workflow.md`
- **Checks:**
  - [ ] Workflow entity linking (immutable references)
  - [ ] Workflow context display
  - [ ] Message threading by workflow entity
- **Document findings:** Create gap analysis entry

#### Task 1.4.7: Audit Archived Conversations
- **Wireframe:** `task-0.5.1.36-archived-conversations.md`
- **Checks:**
  - [ ] Archive functionality (`archived_at` timestamp)
  - [ ] 7-year retention tracking
  - [ ] Restore capability
  - [ ] Retention status indicators
- **Document findings:** Create gap analysis entry

### Batch 1.5: Global Pages (6 wireframes)

#### Task 1.5.1: Audit History Overview ⚠️ (Partially done)
- **Wireframe:** `task-0.5.1.30-history-overview.md`
- **Checks:**
  - [ ] History timeline data (all entity types)
  - [ ] Filters: type, entity, company, date range
  - [ ] Enforcement action history tracking
  - [ ] 7-year retention display
- **Document findings:** Create gap analysis entry

#### Task 1.5.2: Audit Notifications Page
- **Wireframe:** `task-0.5.1.31-notifications-page.md`
- **Checks:**
  - [ ] Notification filters (type, read/unread, date)
  - [ ] Notification settings interface
  - [ ] Threshold reversion notifications
  - [ ] Notification preferences storage (in users table or separate)
- **Document findings:** Create gap analysis entry

#### Task 1.5.3: Audit Audit Logs List
- **Wireframe:** `task-0.5.1.32-audit-logs-list.md`
- **Checks:**
  - [ ] Audit log fields (table_name, record_id, action, user_id, timestamp, hash)
  - [ ] Filters: date range, table, user, action
  - [ ] Hash chain display
  - [ ] All required fields present in `audit_logs` table
- **Document findings:** Create gap analysis entry

#### Task 1.5.4: Audit Audit Log Detail
- **Wireframe:** `task-0.5.1.33-audit-log-detail.md`
- **Checks:**
  - [ ] Hash chain verification display
  - [ ] Related changes display (same record_id)
  - [ ] User information display
  - [ ] Before/after values display
- **Document findings:** Create gap analysis entry

#### Task 1.5.5: Audit Audit Reports
- **Wireframe:** `task-0.5.1.34-audit-reports.md`
- **Checks:**
  - [ ] Report generation interface
  - [ ] Report types (compliance, enforcement, system)
  - [ ] Download actions
  - [ ] `regulatory_reports` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 1.5.6: Audit System Configuration
- **Wireframe:** `task-0.5.1.35-system-configuration.md`
- **Checks:**
  - [ ] Module activation interface (RMM, VCI, ECS, CMC)
  - [ ] System settings (thresholds, scoring weights, etc.)
  - [ ] Configuration data storage
  - [ ] `system_config` table supports all UI requirements
- **Document findings:** Create gap analysis entry

### Batch 1.6: Public Pages (10 wireframes - Lower Priority)

#### Task 1.6.1: Audit Public Pages Batch
- **Wireframes:**
  - `task-0.5.1.1-public-homepage.md`
  - `task-0.5.1.2-about-page.md`
  - `task-0.5.1.7-terms-of-service.md`
  - `task-0.5.1.8-privacy-policy.md`
  - `task-0.5.1.9-cookie-policy.md`
- **Checks:**
  - [ ] Static content pages (likely no DB requirements, but verify)
  - [ ] Content versioning (if needed)
  - [ ] Legal document tracking
- **Document findings:** Create gap analysis entry

#### Task 1.6.2: Audit Support Pages Batch
- **Wireframes:**
  - `task-0.5.1.37-support-center.md`
  - `task-0.5.1.38-faq-page.md`
  - `task-0.5.1.39-contact-support.md`
  - `task-0.5.1.40-documentation.md`
  - `task-0.5.1.41-system-status.md`
- **Checks:**
  - [ ] Contact form submissions (may need `support_tickets` table)
  - [ ] FAQ content storage (static or DB?)
  - [ ] System status data (uptime, incidents)
  - [ ] Documentation access tracking
- **Document findings:** Create gap analysis entry

**Phase 1 Deliverable:** Complete gap analysis for all Core Foundation wireframes, prioritized list of missing schema elements

---

## Phase 2: RMM Module (Day 2, Afternoon)

**Duration:** 0.5 day  
**Priority:** Critical — Foundation module

### Batch 2.1: Core RMM Entities (7 wireframes)

#### Task 2.1.1: Audit RMM Overview
- **Wireframe:** `task-0.5.2.1-rmm-overview.md`
- **Checks:**
  - [ ] Overview metrics (companies, products, SKUs counts)
  - [ ] Recent activity timeline
  - [ ] Quick links data
- **Document findings:** Create gap analysis entry

#### Task 2.1.2: Audit Companies List ⚠️ (Partially done)
- **Wireframe:** `task-0.5.2.2-companies-list.md`
- **Checks:**
  - [ ] Verify: Company fields (name, registration_number, type, status)
  - [ ] Filters: type, status, registration date
  - [ ] Registration number format validation
  - [ ] Search functionality
- **Document findings:** Create gap analysis entry

#### Task 2.1.3: Audit Company Detail
- **Wireframe:** `task-0.5.2.3-company-detail.md`
- **Checks:**
  - [ ] Company detail display (all fields)
  - [ ] Tabs: Overview | Products | History
  - [ ] Related products relationship
  - [ ] History timeline (submissions, approvals, compliance events)
- **Document findings:** Create gap analysis entry

#### Task 2.1.4: Audit Products List
- **Wireframe:** `task-0.5.2.4-products-list.md`
- **Checks:**
  - [ ] Product fields (name, ATC code, company_id)
  - [ ] Company-scoped filtering
  - [ ] Search requirements
  - [ ] ATC code display
- **Document findings:** Create gap analysis entry

#### Task 2.1.5: Audit Product Detail
- **Wireframe:** `task-0.5.2.5-product-detail.md`
- **Checks:**
  - [ ] Product detail display
  - [ ] Tabs: Overview | SKUs | History
  - [ ] SKUs relationship (1:M)
  - [ ] History timeline (submissions related to product)
- **Document findings:** Create gap analysis entry

#### Task 2.1.6: Audit SKUs List
- **Wireframe:** `task-0.5.2.6-skus-list.md`
- **Checks:**
  - [ ] SKU fields (name, product_id, dosage_strength, dosage_form, pack_size)
  - [ ] Product-scoped filtering
  - [ ] Pharmaceutical attributes display
  - [ ] Verify: `dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure` fields
- **Document findings:** Create gap analysis entry

#### Task 2.1.7: Audit SKU Detail
- **Wireframe:** `task-0.5.2.7-sku-detail.md`
- **Checks:**
  - [ ] SKU detail display
  - [ ] Tabs: Overview | History | Submissions
  - [ ] Pharmaceutical attributes (all fields)
  - [ ] History timeline (submissions, threshold changes, compliance events)
- **Document findings:** Create gap analysis entry

### Batch 2.2: RMM Forms (3 wireframes)

#### Task 2.2.1: Audit Company Create/Edit Form
- **Wireframe:** `task-0.5.2.8-company-create-edit-form.md`
- **Checks:**
  - [ ] Form fields match `companies` table
  - [ ] Validation rules (registration number uniqueness, format)
  - [ ] Draft auto-save (if mentioned)
  - [ ] All required fields in schema
- **Document findings:** Create gap analysis entry

#### Task 2.2.2: Audit Product Create/Edit Form
- **Wireframe:** `task-0.5.2.9-product-create-edit-form.md`
- **Checks:**
  - [ ] Form fields match `products` table
  - [ ] ATC code selection (dropdown from `atc_codes` table)
  - [ ] Validation (ATC code exists, company_id valid)
  - [ ] All fields present
- **Document findings:** Create gap analysis entry

#### Task 2.2.3: Audit SKU Create/Edit Form
- **Wireframe:** `task-0.5.2.10-sku-create-edit-form.md`
- **Checks:**
  - [ ] Verify: Pharmaceutical attributes fields (`dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure`)
  - [ ] Form validation (required fields, data types)
  - [ ] ATC code selection (inherited from product or override?)
  - [ ] Product relationship
- **Document findings:** Create gap analysis entry

### Batch 2.3: RMM Workflow (3 wireframes)

#### Task 2.3.1: Audit Registry Submission List ⚠️ (Partially done)
- **Wireframe:** `task-0.5.2.11-registry-submission-list.md`
- **Checks:**
  - [ ] Submission list fields (company, product, SKU, status, submitted_at)
  - [ ] Status filters (draft, submitted, verified, approved, etc.)
  - [ ] Type filters (company, product, SKU registration)
  - [ ] Date filters (submission date range)
  - [ ] Verify: `registry_submissions` table supports all filter requirements
- **Document findings:** Create gap analysis entry

#### Task 2.3.2: Audit Registry Submission Detail
- **Wireframe:** `task-0.5.2.12-registry-submission-detail.md`
- **Checks:**
  - [ ] Submission detail fields
  - [ ] Workflow status display
  - [ ] Approval history timeline
  - [ ] Verify: `approvals` table relationship
  - [ ] Workflow status tracking (all states)
- **Document findings:** Create gap analysis entry

#### Task 2.3.3: Audit Registry Submission Workflow States
- **Wireframe:** `task-0.5.2.13-registry-submission-workflow-states.md`
- **Checks:**
  - [ ] Verify: All workflow states (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected)
  - [ ] State transition tracking
  - [ ] Approval chain (Tier 2 → Tier 1 → Tier 2 implementation)
  - [ ] Status history
- **Document findings:** Create gap analysis entry

### Batch 2.4: RMM MOH-Only Pages (2 wireframes)

#### Task 2.4.1: Audit ATC Codes List
- **Wireframe:** `task-0.5.2.14-atc-codes-list.md`
- **Checks:**
  - [ ] ATC codes list (read-only for most users)
  - [ ] Search functionality
  - [ ] Filters (level, category)
  - [ ] Verify: `atc_codes` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 2.4.2: Audit Critical Medicines List
- **Wireframe:** `task-0.5.2.15-critical-medicines-list.md`
- **Checks:**
  - [ ] Critical medicines list
  - [ ] Designation interface (Tier 1 only)
  - [ ] Filters (ATC code, designation date)
  - [ ] Verify: `critical_medicines` table supports all requirements
- **Document findings:** Create gap analysis entry

### Batch 2.5: Enforcement Module (8 wireframes) ⚠️ (Partially done)

#### Task 2.5.1: Audit Enforcement Dashboard
- **Wireframe:** `task-0.5.2.0-enforcement-dashboard.md`
- **Checks:**
  - [ ] Dashboard metrics (total actions, pending approvals, resolved actions)
  - [ ] Recent actions timeline
  - [ ] Pending approvals widget
  - [ ] Action type breakdown
  - [ ] Verify: `enforcement_actions` table supports all dashboard requirements
- **Document findings:** Create gap analysis entry

#### Task 2.5.2: Audit Enforcement Actions List
- **Wireframe:** `task-0.5.2.1-enforcement-actions-list.md`
- **Checks:**
  - [ ] Action list fields (company, action_type, status, amount, created_at)
  - [ ] Filters: action_type, status, company, date range
  - [ ] Sortable columns
  - [ ] All filter fields exist
- **Document findings:** Create gap analysis entry

#### Task 2.5.3: Audit Enforcement Action Detail
- **Wireframe:** `task-0.5.2.1a-enforcement-action-detail.md`
- **Checks:**
  - [ ] Action detail fields (all fields from `enforcement_actions` table)
  - [ ] Workflow status display
  - [ ] Approval chain display
  - [ ] Violation details link
  - [ ] Appeal status and link
  - [ ] Verify: `enforcement_action_appeals` relationship
- **Document findings:** Create gap analysis entry

#### Task 2.5.4: Audit Create Enforcement Action Wizard
- **Wireframe:** `task-0.5.2.1b-create-enforcement-action-wizard.md`
- **Checks:**
  - [ ] Action creation fields (company, action_type, amount, legal_basis, justification)
  - [ ] Violation selection (breach_id link)
  - [ ] Amount input with currency
  - [ ] Legal basis selection/input
  - [ ] Justification text area
  - [ ] Verify: All fields in `enforcement_actions` table
- **Document findings:** Create gap analysis entry

#### Task 2.5.5: Audit Pending Approvals
- **Wireframe:** `task-0.5.2.1c-pending-approvals.md`
- **Checks:**
  - [ ] Pending approvals list (actions awaiting Tier 1 approval)
  - [ ] Approval interface (approve/reject with justification)
  - [ ] Bulk approval actions
  - [ ] Approval workflow tracking
- **Document findings:** Create gap analysis entry

#### Task 2.5.6: Audit Enforcement Reports
- **Wireframe:** `task-0.5.2.1d-enforcement-reports.md`
- **Checks:**
  - [ ] Enforcement analytics (trends, totals, breakdowns)
  - [ ] Action type breakdown (chart data)
  - [ ] Company compliance tracking
  - [ ] Reporting data requirements (may need aggregations)
- **Document findings:** Create gap analysis entry

#### Task 2.5.7: Audit Appeal Review Interface
- **Wireframe:** `task-0.5.2.1e-appeal-review-interface.md`
- **Checks:**
  - [ ] Appeal review fields (appeal_id, original_action, appeal_reason, evidence)
  - [ ] Uphold/overturn decisions
  - [ ] Adjustment notes (if overturned, new amount)
  - [ ] Verify: `enforcement_action_appeals` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 2.5.8: Audit Appeal Submission Form
- **Wireframe:** `task-0.5.2.1f-appeal-submission-form.md`
- **Checks:**
  - [ ] Appeal submission fields (action_id, appeal_reason, evidence_upload)
  - [ ] Evidence file upload (may need file_uploads table reference)
  - [ ] Appeal reason text area
  - [ ] Appeal tracking (status, submitted_at, reviewed_at)
- **Document findings:** Create gap analysis entry

**Phase 2 Deliverable:** Complete gap analysis for RMM module wireframes

---

## Phase 3: VCI Module (Day 3 + Day 4, Morning)

**Duration:** 1.5 days  
**Priority:** Critical — Most complex module with many data relationships

### Batch 3.1: VCI Overview & AAMS (9 wireframes)

#### Task 3.1.1: Audit VCI Overview
- **Wireframe:** `task-0.5.3.0-vci-overview.md`
- **Checks:**
  - [ ] Overview metrics (submissions counts by type, compliance status)
  - [ ] Submission overview (AAMS, MSQ, WSL)
  - [ ] Compliance violation alerts
  - [ ] Quick links
- **Document findings:** Create gap analysis entry

#### Task 3.1.2: Audit AAMS Submissions List
- **Wireframe:** `task-0.5.3.1-aams-submissions-list.md`
- **Checks:**
  - [ ] AAMS list fields (year, company, status, submitted_at, due_date)
  - [ ] Filters: year, status, company, late submission flag
  - [ ] Late submission indicators
  - [ ] Verify: `aams_submissions` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 3.1.3: Audit AAMS Submission Form ⚠️ (Partially done)
- **Wireframe:** `task-0.5.3.2-aams-submission-form.md`
- **Checks:**
  - [ ] Verify: Submission data structure (SKU_ID + Quantity per month)
  - [ ] CSV import/export functionality
  - [ ] Monthly sales (Jan-Dec) data storage
  - [ ] Draft auto-save
  - [ ] Validation requirements (total quantities, SKU exists)
- **Document findings:** Create gap analysis entry

#### Task 3.1.4: Audit AAMS Submission Detail
- **Wireframe:** `task-0.5.3.3-aams-submission-detail.md`
- **Checks:**
  - [ ] Submission detail display
  - [ ] Calculated threshold display (B * threshold_base)
  - [ ] Workflow status
  - [ ] Duration type display (permanent, temporary_auto_revert, temporary_manual_review)
  - [ ] Revert date visibility (for temporary thresholds)
  - [ ] Verify: Threshold calculation display, time-bound modifications support
- **Document findings:** Create gap analysis entry

#### Task 3.1.5: Audit Threshold Management ⚠️ (Partially done)
- **Wireframe:** `task-0.5.3.4-threshold-management.md`
- **Checks:**
  - [ ] Threshold list fields (type, company, SKU, value, duration_type, revert_date)
  - [ ] Filters: type (local/global), status (active/pending_reversion), duration, company, SKU
  - [ ] Bulk actions (bulk revert, bulk extend)
  - [ ] Duration type display (permanent, temporary_auto_revert, temporary_manual_review)
  - [ ] Revert date display
  - [ ] Pending reversion indicators (color coding, days until)
- **Document findings:** Create gap analysis entry

#### Task 3.1.6: Audit Threshold Detail
- **Wireframe:** `task-0.5.3.5-threshold-detail.md`
- **Checks:**
  - [ ] Threshold detail display (all fields)
  - [ ] Modification history timeline
  - [ ] Related thresholds (same SKU, different types)
  - [ ] Threshold version history tracking
- **Document findings:** Create gap analysis entry

#### Task 3.1.7: Audit Threshold Modification Modal
- **Wireframe:** `task-0.5.3.6-threshold-modification-modal.md`
- **Checks:**
  - [ ] Local vs global selector
  - [ ] B multiplier input (for global thresholds)
  - [ ] Duration type selection (permanent, temporary_auto_revert, temporary_manual_review)
  - [ ] Time-bound options (revert_date for auto_revert, review_date for manual_review)
  - [ ] Verify: All threshold modification fields present
- **Document findings:** Create gap analysis entry

#### Task 3.1.8: Audit Threshold Reversion Review
- **Wireframe:** `task-0.5.3.7-threshold-reversion-review.md`
- **Checks:**
  - [ ] Review interface (current threshold, original threshold, revert date)
  - [ ] Confirm/cancel/extend options
  - [ ] Justification input (for manual review)
  - [ ] Manual review reversion workflow support
- **Document findings:** Create gap analysis entry

#### Task 3.1.9: Audit Pending Reversions List
- **Wireframe:** `task-0.5.3.8-pending-reversions-list.md`
- **Checks:**
  - [ ] Pending reversions list (thresholds scheduled to revert)
  - [ ] Filters: type, days until revert, company, SKU
  - [ ] Color coding (red/yellow/green based on days until)
  - [ ] Bulk actions (bulk review, bulk extend)
  - [ ] Reversion tracking and notification flags
- **Document findings:** Create gap analysis entry

### Batch 3.2: MSQ Submissions (4 wireframes)

#### Task 3.2.1: Audit MSQ Submissions List
- **Wireframe:** `task-0.5.3.9-msq-submissions-list.md`
- **Checks:**
  - [ ] MSQ list fields (month, company, status, submitted_at, flagged_for_review)
  - [ ] Filters: month, status, company
  - [ ] Flagged for review indicator
  - [ ] Correction tracking (correction_of field)
  - [ ] Verify: `msq_submissions` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 3.2.2: Audit MSQ Submission Form
- **Wireframe:** `task-0.5.3.10-msq-submission-form.md`
- **Checks:**
  - [ ] MSQ form structure (SKU_ID + Quantity only, simpler than AAMS)
  - [ ] Month selection (single month)
  - [ ] Validation (SKU exists, quantity >= 0)
  - [ ] Verify: `submission_data` JSONB structure supports requirements
- **Document findings:** Create gap analysis entry

#### Task 3.2.3: Audit MSQ Submission Detail
- **Wireframe:** `task-0.5.3.11-msq-submission-detail.md`
- **Checks:**
  - [ ] Submission detail display
  - [ ] Validation status (passed/failed)
  - [ ] Review actions (flag for review, approve)
  - [ ] 7-day grace period indicator
  - [ ] Verify: `correction_of` field, grace period tracking
- **Document findings:** Create gap analysis entry

#### Task 3.2.4: Audit MSQ Correction Interface
- **Wireframe:** `task-0.5.3.12-msq-correction-interface.md`
- **Checks:**
  - [ ] Correction form (editable submitted data)
  - [ ] Grace period countdown (days remaining)
  - [ ] Correction tracking (`correction_of` field)
  - [ ] Correction workflow support
- **Document findings:** Create gap analysis entry

### Batch 3.3: WSL Submissions (3 wireframes) ⚠️ (Partially done)

#### Task 3.3.1: Audit WSL Submissions List
- **Wireframe:** `task-0.5.3.11-wsl-submissions-list.md` (Note: filename shows 0.5.3.11 but should be WSL list)
- **Checks:**
  - [ ] WSL list fields (week, company, status, deadline, threshold_compliance_pct, violation_reason)
  - [ ] Week filter (YYYY-WW format)
  - [ ] Deadline indicators (due, overdue)
  - [ ] Threshold compliance % display
  - [ ] Replenishment date display
  - [ ] Violation reason display (if compliance < 80%)
  - [ ] Verify: All displayed fields exist or can be calculated
- **Document findings:** Create gap analysis entry

#### Task 3.3.2: Audit WSL Submission Form ⚠️ (Partially done)
- **Wireframe:** `task-0.5.3.12-wsl-submission-form.md`
- **Checks:**
  - [ ] Verify: All SKUs requirement (must submit for all SKUs)
  - [ ] Stock quantity entry (SKU_ID + Quantity)
  - [ ] Threshold display (current threshold for each SKU)
  - [ ] Threshold compliance % calculation (stock / threshold * 100)
  - [ ] Conditional fields: `replenishment_date` (if compliance < 80%), `breach_reason` (if compliance < 80%)
  - [ ] Verify: `submission_data` JSONB structure supports SKU_ID + Quantity + optional fields
- **Document findings:** Create gap analysis entry

#### Task 3.3.3: Audit WSL Submission Detail
- **Wireframe:** `task-0.5.3.13-wsl-submission-detail.md`
- **Checks:**
  - [ ] Submission detail display
  - [ ] Compliance violation indicators (if < 80%)
  - [ ] Stock level vs threshold comparison visualization
  - [ ] Breach reason display
  - [ ] Replenishment date display
  - [ ] Threshold comparison display
- **Document findings:** Create gap analysis entry

### Batch 3.4: Compliance Violations/Breaches (4 wireframes)

#### Task 3.4.1: Audit Compliance Violations List
- **Wireframe:** `task-0.5.3.14-compliance-violations-list.md`
- **Checks:**
  - [ ] Breach list fields (company, SKU, threshold, stock_level, compliance_pct, priority, created_at)
  - [ ] Filters: priority (normal, high, extreme), company, SKU, date range, active vs resolved
  - [ ] Active vs resolved status
  - [ ] Verify: `breaches` table supports all filter and display requirements
- **Document findings:** Create gap analysis entry

#### Task 3.4.2: Audit Compliance Violation Detail
- **Wireframe:** `task-0.5.3.15-compliance-violation-detail.md`
- **Checks:**
  - [ ] Breach detail (all fields)
  - [ ] Stock level vs threshold comparison visualization
  - [ ] Breach reason display
  - [ ] Replenishment date (if provided)
  - [ ] Priority display (normal, high, extreme)
  - [ ] All breach fields present
- **Document findings:** Create gap analysis entry

#### Task 3.4.3: Audit Compliance Violation Analysis Interface
- **Wireframe:** `task-0.5.3.16-compliance-violation-analysis-interface.md`
- **Checks:**
  - [ ] Analysis form fields (breach_id, analysis_notes, recommended_action)
  - [ ] Action suggestions dropdown (no_action, enforcement_action, threshold_review)
  - [ ] Comments text area
  - [ ] Batch analysis (analyze multiple breaches)
  - [ ] Verify: `breach_analyses` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 3.4.4: Audit Compliance Violation Action Approval Interface
- **Wireframe:** `task-0.5.3.17-compliance-violation-action-approval-interface.md`
- **Checks:**
  - [ ] Review interface (breach details, recommended action, analysis notes)
  - [ ] Approve/reject/independent action options
  - [ ] Justification input (required for all actions)
  - [ ] Approval workflow for breach actions
- **Document findings:** Create gap analysis entry

### Batch 3.5: VCI Analytics & Governance (7 wireframes)

#### Task 3.5.1: Audit Governance Dashboard
- **Wireframe:** `task-0.5.3.18-governance-dashboard.md`
- **Checks:**
  - [ ] Stock sufficiency charts (trend over time)
  - [ ] Compliance violation status (active, resolved, pending action)
  - [ ] Action recommendations (from breach analyses)
  - [ ] Pending reversions metric (threshold reversions)
  - [ ] All dashboard data sources exist
- **Document findings:** Create gap analysis entry

#### Task 3.5.2: Audit ATC Treemap
- **Wireframe:** `task-0.5.3.22-atc-treemap.md`
- **Checks:**
  - [ ] ATC treemap visualization (hierarchical stock levels by ATC code)
  - [ ] Date range picker (for historical data)
  - [ ] Stock level data aggregation (by ATC code, by SKU)
  - [ ] Verify: Data aggregation requirements (may be calculated, but verify)
- **Document findings:** Create gap analysis entry

#### Task 3.5.3: Audit Products Treemap
- **Wireframe:** `task-0.5.3.23-products-treemap.md`
- **Checks:**
  - [ ] Products treemap (stock levels by product)
  - [ ] Dosage/forms modal integration (click to drill down)
  - [ ] Stock level thresholds (color coding based on compliance)
  - [ ] Product aggregation data requirements
- **Document findings:** Create gap analysis entry

#### Task 3.5.4: Audit Dosage/Forms Modal
- **Wireframe:** `task-0.5.3.24-dosage-forms-modal.md`
- **Checks:**
  - [ ] Dosage/forms breakdown (dosage_form + dosage_strength combinations)
  - [ ] SKU list display (filtered by dosage_form)
  - [ ] Verify: SKU `dosage_form` filtering and aggregation
- **Document findings:** Create gap analysis entry

#### Task 3.5.5: Audit SKU List Expanded
- **Wireframe:** `task-0.5.3.25-sku-list-expanded.md`
- **Checks:**
  - [ ] SKU list expanded view (from treemap drill-down)
  - [ ] Filtering requirements (product, dosage_form, ATC code)
  - [ ] Stock level display
- **Document findings:** Create gap analysis entry

#### Task 3.5.6: Audit SKU Action Page Integration
- **Wireframe:** `task-0.5.3.27-sku-action-page-integration.md`
- **Checks:**
  - [ ] Integration with SKU detail page (`/rmm/skus/[id]`)
  - [ ] Query parameters (from treemap, pre-filtered view)
  - [ ] Context preservation
- **Document findings:** Create gap analysis entry

#### Task 3.5.7: Audit Submission History/Trends (if exists)
- **Wireframes:** Submission history/trends wireframes (if they exist in wireframe index)
- **Checks:**
  - [ ] Historical data requirements (7-year retention)
  - [ ] Trend calculations (month-over-month, year-over-year)
  - [ ] Data aggregation for trends
- **Document findings:** Create gap analysis entry

**Phase 3 Deliverable:** Complete gap analysis for VCI module wireframes

---

## Phase 4: ECS Module (Day 4, Afternoon)

**Duration:** 0.5 day  
**Priority:** High — Depends on RMM + VCI

### Batch 4.1: ECS Overview & Export Requests (5 wireframes)

#### Task 4.1.1: Audit ECS Overview
- **Wireframe:** `task-0.5.4.0-ecs-overview.md`
- **Checks:**
  - [ ] Overview metrics (total requests, pending, approved, in progress)
  - [ ] Export requests overview
  - [ ] Authorization status summary
- **Document findings:** Create gap analysis entry

#### Task 4.1.2: Audit Export Requests List
- **Wireframe:** `task-0.5.4.1-export-requests-list.md`
- **Checks:**
  - [ ] Export request list fields (company, SKU, destination, quantity, status, requested_date)
  - [ ] Filters: status, company, SKU, destination, date range
  - [ ] Status indicators (draft, submitted, tier2_verified, tier1_approved, rejected, in_progress, completed)
  - [ ] Verify: `export_requests` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 4.1.3: Audit Export Request Form ⚠️ (Partially done)
- **Wireframe:** `task-0.5.4.2-export-request-form.md`
- **Checks:**
  - [ ] Verify: SKU selection (all SKUs or filtered list?)
  - [ ] Destination country/region selection
  - [ ] Quantity input (per SKU)
  - [ ] Export date selection
  - [ ] Documentation upload (supporting_documentation)
  - [ ] Threshold comparison display (current stock vs VCI threshold vs ECS threshold)
  - [ ] Conditional validation status display (CMC score check - if score < 70%, show warning)
  - [ ] File upload table for supporting_documentation
- **Document findings:** Create gap analysis entry

#### Task 4.1.4: Audit Export Request Detail
- **Wireframe:** `task-0.5.4.3-export-request-detail.md`
- **Checks:**
  - [ ] Request detail (all fields)
  - [ ] Evaluation status (tier2_verified, tier1_approved, etc.)
  - [ ] Threshold comparison card (current stock vs VCI threshold vs ECS threshold - three-way comparison)
  - [ ] All threshold display fields
  - [ ] Intervention window indicator (if stock < ECS threshold)
- **Document findings:** Create gap analysis entry

#### Task 4.1.5: Audit Export Workflow Actions
- **Wireframe:** `task-0.5.4.4-export-workflow-actions.md`
- **Checks:**
  - [ ] Workflow actions: submit, verify (Tier 2), approve (Tier 1), reject, intervene (if stock < ECS threshold)
  - [ ] Intervention window (stock below ECS threshold)
  - [ ] All workflow states and transitions supported
  - [ ] Action history tracking
- **Document findings:** Create gap analysis entry

### Batch 4.2: Export Authorizations (3 wireframes)

#### Task 4.2.1: Audit Export Authorizations List
- **Wireframe:** `task-0.5.4.5-export-authorizations-list.md`
- **Checks:**
  - [ ] Authorization list fields (authorization_number, company, SKU, quantity, valid_from, valid_until, status)
  - [ ] Filters: active, expired, validity period, company, SKU
  - [ ] Authorization number format
  - [ ] Verify: `export_authorizations` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 4.2.2: Audit Export Authorization Detail
- **Wireframe:** `task-0.5.4.6-export-authorization-detail.md`
- **Checks:**
  - [ ] Authorization detail (all fields)
  - [ ] Validity period display (valid_from, valid_until)
  - [ ] 90-day countdown display (days remaining)
  - [ ] Expiration warnings (30 days, 7 days, expired)
  - [ ] Threshold status (current stock vs thresholds)
  - [ ] Threshold switch date (if threshold was changed during validity)
  - [ ] Threshold revert date (for temporary thresholds)
- **Document findings:** Create gap analysis entry

#### Task 4.2.3: Audit Export Completion Reporting
- **Wireframe:** `task-0.5.4.7-export-completion-reporting.md`
- **Checks:**
  - [ ] Completion form fields (authorization_id, actual_export_date, actual_quantity, shipping_info)
  - [ ] Actual export details (may differ from authorized)
  - [ ] Shipping information (carrier, tracking number, etc.)
  - [ ] 7-day reporting window (must report within 7 days of actual export)
  - [ ] Verify: `export_completions` table supports all requirements
- **Document findings:** Create gap analysis entry

### Batch 4.3: Replenishment & History (2 wireframes)

#### Task 4.3.1: Audit Replenishment Schedule Tracking
- **Wireframe:** `task-0.5.4.8-replenishment-schedule-tracking.md`
- **Checks:**
  - [ ] Replenishment schedule timeline (from WSL submission replenishment_date)
  - [ ] Delay indicators (replenishment overdue)
  - [ ] Escalation stages (if overdue > X days)
  - [ ] Verify: `replenishment_schedules` table supports all display requirements
- **Document findings:** Create gap analysis entry

#### Task 4.3.2: Audit Export History (if exists)
- **Wireframes:** Export history wireframes (0.5.4.9, 0.5.4.10) if they exist
- **Checks:**
  - [ ] Historical export data requirements (7-year retention)
  - [ ] Historical authorization detail display
  - [ ] Read-only access to historical data
- **Document findings:** Create gap analysis entry

**Phase 4 Deliverable:** Complete gap analysis for ECS module wireframes

---

## Phase 5: CMC Module (Day 5, Morning)

**Duration:** 0.5 day  
**Priority:** High — Depends on other modules

### Batch 5.1: CMC Overview & Scores (6 wireframes)

#### Task 5.1.1: Audit CMC Overview
- **Wireframe:** `task-0.5.5.0-cmc-overview.md`
- **Checks:**
  - [ ] Overview metrics (average compliance score, companies above/below thresholds)
  - [ ] Compliance overview (score distribution)
  - [ ] Score trends (month-over-month)
- **Document findings:** Create gap analysis entry

#### Task 5.1.2: Audit Compliance Scores List
- **Wireframe:** `task-0.5.5.1-compliance-scores-list.md`
- **Checks:**
  - [ ] Score list fields (company, period, total_score, grade, status, calculated_at)
  - [ ] Filters: period (YYYY-MM), company, score range, status (active, disputed, adjusted)
  - [ ] Sortable columns (score, period, company)
  - [ ] Verify: `compliance_scores` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 5.1.3: Audit Compliance Score Detail ⚠️ (Partially done)
- **Wireframe:** `task-0.5.5.2-compliance-score-detail.md`
- **Checks:**
  - [ ] Verify: Total score display (numeric + grade)
  - [ ] Component breakdown (submission_timeliness, threshold_compliance, export_compliance, etc.)
  - [ ] Component weights display (from component_weights table or system_config)
  - [ ] Trend calculation (score change from previous period)
  - [ ] Percentile/rank band display (from leaderboard calculation)
  - [ ] Grade classification (Excellent: 90-100, Good: 80-89, Fair: 70-79, Poor: 60-69, Critical: <60)
  - [ ] Dispute window countdown (30 days from calculation)
  - [ ] Component weights table (or system_config storage)
  - [ ] History timeline (score adjustments, disputes)
  - [ ] Adjustments tracking (compliance_score_adjustments table)
- **Document findings:** Create gap analysis entry

#### Task 5.1.4: Audit Leaderboard ⚠️ (Partially done)
- **Wireframe:** `task-0.5.5.3-leaderboard.md`
- **Checks:**
  - [ ] Verify: Leaderboard ranking (by total_score, descending)
  - [ ] Percentile calculation (0-100)
  - [ ] Rank bands (0-25%, 25-50%, 50-75%, 75-100%)
  - [ ] Score change tracking (current score vs previous period)
  - [ ] Anonymization requirements (for companies - show rank but not name/score for non-MOH users)
  - [ ] Full leaderboard (for MOH - show all companies with scores)
  - [ ] Verify: Previous period score storage or calculation method
  - [ ] Optional: `compliance_score_leaderboard_cache` table for performance
- **Document findings:** Create gap analysis entry

#### Task 5.1.5: Audit Score Review - Tier 2 Flag Anomalies
- **Wireframe:** `task-0.5.5.4-score-review-tier2-flag-anomalies.md`
- **Checks:**
  - [ ] Flag anomalies modal fields (score_id, anomaly_reason, flagged_by, flagged_at)
  - [ ] Anomaly tracking (may be in compliance_scores table as flag or separate table)
  - [ ] Verify: Anomaly flagging storage (flag field or anomaly_tracking table)
- **Document findings:** Create gap analysis entry

#### Task 5.1.6: Audit Score Review - Tier 1 Override
- **Wireframe:** `task-0.5.5.5-score-review-tier1-override.md`
- **Checks:**
  - [ ] Override modal fields (score_id, new_score, justification, overridden_by)
  - [ ] Justification input (required)
  - [ ] Adjustment creation (creates entry in compliance_score_adjustments)
  - [ ] Verify: `compliance_score_adjustments` table supports all requirements
- **Document findings:** Create gap analysis entry

### Batch 5.2: CMC Disputes (4 wireframes)

#### Task 5.2.1: Audit Compliance Disputes List
- **Wireframe:** `task-0.5.5.6-compliance-disputes-list.md`
- **Checks:**
  - [ ] Dispute list fields (company, score_period, disputed_score, status, submitted_at, resolved_at)
  - [ ] Filters: status (pending_tier2_review, pending_tier1_resolution, resolved, rejected), date, company, score period
  - [ ] Status indicators
  - [ ] Verify: `disputes` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 5.2.2: Audit Dispute Detail
- **Wireframe:** `task-0.5.5.7-dispute-detail.md`
- **Checks:**
  - [ ] Dispute detail fields (all fields from disputes table)
  - [ ] Evidence display (file uploads, links)
  - [ ] Review status (Tier 2 review, Tier 1 resolution)
  - [ ] Resolution display (upheld, partially_upheld, rejected)
  - [ ] Verify: Evidence file storage (may need file_uploads table reference)
- **Document findings:** Create gap analysis entry

#### Task 5.2.3: Audit Dispute Creation Interface
- **Wireframe:** `task-0.5.5.8-dispute-creation-interface.md`
- **Checks:**
  - [ ] Dispute form fields (score_id, disputed_components, dispute_reason, evidence_upload)
  - [ ] 30-day window indicator (countdown from score calculation)
  - [ ] Component selection (which components to dispute)
  - [ ] Evidence upload (file upload functionality)
  - [ ] Dispute creation workflow
  - [ ] Evidence file handling
- **Document findings:** Create gap analysis entry

#### Task 5.2.4: Audit Dispute Review Interface
- **Wireframe:** `task-0.5.5.9-dispute-review-interface.md`
- **Checks:**
  - [ ] Review interface fields (dispute_id, evidence, recommended_resolution)
  - [ ] Tier 2 review (initial review, recommendation)
  - [ ] Tier 1 resolution (final decision, adjustment amount if any)
  - [ ] Adjustment notes (if score adjusted)
  - [ ] Review workflow (tier2_reviewed_at, tier1_resolved_at)
  - [ ] Resolution tracking
- **Document findings:** Create gap analysis entry

### Batch 5.3: CMC Reports (3 wireframes)

#### Task 5.3.1: Audit Reports List
- **Wireframe:** `task-0.5.5.10-reports-list.md`
- **Checks:**
  - [ ] Reports list fields (report_type, period, status, generated_at, generated_by)
  - [ ] Report types (compliance_summary, enforcement_summary, regulatory_submission)
  - [ ] Status filters (draft, pending_tier2_review, pending_tier1_approval, approved, rejected)
  - [ ] Download actions (PDF download)
  - [ ] Period filters (YYYY-MM)
  - [ ] Verify: `regulatory_reports` table supports all requirements
- **Document findings:** Create gap analysis entry

#### Task 5.3.2: Audit Report Detail
- **Wireframe:** `task-0.5.5.11-report-detail.md`
- **Checks:**
  - [ ] Report detail display (all fields)
  - [ ] PDF viewer (if PDF stored)
  - [ ] Data tables (report data display)
  - [ ] Charts/visualizations (if included in report)
  - [ ] Download action (PDF download)
  - [ ] Verify: Report data storage (`report_data` JSONB), file storage for PDFs
- **Document findings:** Create gap analysis entry

#### Task 5.3.3: Audit Report Review/Approval Interface
- **Wireframe:** `task-0.5.5.12-report-review-approval-interface.md`
- **Checks:**
  - [ ] Review checklist (data accuracy, completeness, formatting)
  - [ ] Approval actions (approve, reject, request_changes)
  - [ ] Tier 2 and Tier 1 workflows (tier2_reviewed_at, tier1_approved_at)
  - [ ] Review and approval tracking
- **Document findings:** Create gap analysis entry

### Batch 5.4: CMC History (2 wireframes - if they exist)

#### Task 5.4.1: Audit Compliance Scores History
- **Wireframe:** Compliance scores history wireframe (0.5.5.13) if it exists
- **Checks:**
  - [ ] Historical score display (all past periods)
  - [ ] Trend visualization (line chart over time)
  - [ ] Period filtering (date range)
  - [ ] Historical data access requirements (7-year retention)
- **Document findings:** Create gap analysis entry

#### Task 5.4.2: Audit Compliance Disputes History
- **Wireframe:** Compliance disputes history wireframe (0.5.5.14) if it exists
- **Checks:**
  - [ ] Historical dispute display (all past disputes)
  - [ ] Trend analysis (disputes over time)
  - [ ] Historical data access requirements (7-year retention)
- **Document findings:** Create gap analysis entry

**Phase 5 Deliverable:** Complete gap analysis for CMC module wireframes

---

## Phase 6: Historical Data & Modals (Day 5, Afternoon)

**Duration:** 0.5 day  
**Priority:** Medium — Supporting features

### Batch 6.1: Historical Data Wireframes

#### Task 6.1.1: Audit Historical Data Wireframes
- **Location:** `05-audit-historical/` (if directory exists)
- **Checks:**
  - [ ] Historical data access patterns (read-only, 7-year retention)
  - [ ] 7-year retention display (indicators, filters)
  - [ ] Read-only requirements (no editing of historical data)
  - [ ] Historical data routing (separate routes or query params)
  - [ ] Access control (who can view historical data)
- **Document findings:** Create gap analysis entry

### Batch 6.2: Modal Components (11 wireframes)

#### Task 6.2.1: Audit Modal Wireframes
- **Location:** `07-modals/` (if directory exists) or check wireframe index for modal wireframes
- **Modal Types to Check:**
  - [ ] Confirmation modal (data requirements: entity_id, action_type)
  - [ ] File upload modal (file_uploads table, storage requirements)
  - [ ] Date range picker (likely UI-only, but verify)
  - [ ] User/company picker (users, companies tables)
  - [ ] Export options modal (likely UI-only)
  - [ ] Quick history preview modal (historical data access)
  - [ ] Comparison modal (side-by-side comparison, needs two entity IDs)
  - [ ] Detail inspection modal (entity detail display, needs entity_id)
  - [ ] Message attachment viewer (message_attachments table)
  - [ ] Workflow status modal (workflow state display)
- **Checks:**
  - [ ] Data requirements for each modal (most may be UI-only, but verify)
  - [ ] Entity ID passing (query params, state management)
  - [ ] File upload requirements (if any modals allow file uploads)
- **Document findings:** Create gap analysis entry

**Phase 6 Deliverable:** Complete gap analysis for historical data and modal wireframes

---

## Phase 7: Gap Consolidation & Analysis (Day 6)

**Duration:** 1 day  
**Priority:** Critical — Synthesis phase

### Batch 7.1: Gap Consolidation

#### Task 7.1.1: Consolidate All Findings
- [ ] Create master list of all identified gaps from Phases 1-6
- [ ] Categorize gaps by priority:
  - **Critical:** Blocks Phase 1 implementation
  - **High:** Needed for core functionality
  - **Medium:** Nice to have, can be added later
  - **Low:** Optional enhancements
- [ ] Group by type:
  - Missing Tables
  - Missing Fields
  - Missing Indexes
  - Missing Relationships
  - Calculation Requirements
  - Business Logic Gaps

**Deliverable:** Master gap list with categorization

#### Task 7.1.2: Remove Duplicates and Verify
- [ ] Cross-reference findings to remove duplicate entries
- [ ] Verify each gap against current schema (confirm it's a real gap, not already implemented)
- [ ] Check for conflicting requirements (same field needed in different ways)
- [ ] Resolve conflicts (document decisions)

**Deliverable:** Clean, verified gap list

#### Task 7.1.3: Prioritize Gaps by Impact
- [ ] Critical: Blocks Phase 1 implementation (must fix before Phase 1 starts)
- [ ] High: Needed for core functionality (should fix in Phase 1)
- [ ] Medium: Nice to have, can be added later (Phase 1.1 or Phase 2)
- [ ] Low: Optional enhancements (backlog)

**Deliverable:** Prioritized gap list

### Batch 7.2: Impact Analysis

#### Task 7.2.1: Analyze Impact of Each Gap
- [ ] Which wireframes are affected by each gap?
- [ ] Which modules are impacted?
- [ ] What's the implementation complexity?
  - Simple (add field): 1-2 hours
  - Medium (add table + relationships): 4-8 hours
  - Complex (major refactor): 1-2 days
- [ ] Are there dependencies between gaps? (Gap A must be fixed before Gap B)

**Deliverable:** Impact analysis document

#### Task 7.2.2: Create Gap Dependency Map
- [ ] Identify which gaps depend on others
  - Example: `follow_ups` table depends on `companies` and `users` tables (already exist)
  - Example: Threshold reversion workflow depends on `thresholds` table (already exists, but may need new fields)
- [ ] Create implementation order recommendations
- [ ] Identify quick wins vs complex changes

**Deliverable:** Dependency map and implementation order

### Batch 7.3: Schema Update Recommendations

#### Task 7.3.1: Create Detailed Schema Update Specifications
- [ ] For each gap, specify exact table/field additions needed
  - Table name (if new table)
  - Field name, data type, constraints
  - Default values
  - Indexes needed
  - Foreign keys
- [ ] Define relationships and foreign keys
- [ ] Define default values and business rules
- [ ] Specify validation rules (CHECK constraints, triggers if needed)

**Deliverable:** Detailed schema update specifications

#### Task 7.3.2: Create Migration Plan
- [ ] Order migrations by priority (Critical → High → Medium → Low)
- [ ] Identify breaking changes (if any)
- [ ] Plan migration scripts (one script per change or grouped by dependency)
- [ ] **MCP Requirement:** All migrations must use Supabase MCP (`mcp_supabase_apply_migration`) - not Supabase CLI
- [ ] Define rollback procedures (for each migration - using `mcp_supabase_execute_sql` if needed)
- [ ] Estimate migration time for each change
- [ ] Plan verification steps using MCP tools (`mcp_supabase_list_migrations`, `mcp_supabase_list_tables`, `mcp_supabase_execute_sql`)

**Deliverable:** Migration plan with scripts outline (all using Supabase MCP)

**Phase 7 Deliverable:** Complete gap analysis document with prioritized recommendations and migration plan

---

## Phase 8: Schema Design Update (Day 7)

**Duration:** 1 day  
**Priority:** Critical — Implementation

**⚠️ MCP Requirement:** All database migrations and schema updates in Phase 8 and Phase 1 implementation MUST use Supabase MCP (Model Context Protocol) tools. Do not use Supabase CLI.

**MCP Tools for Migrations:**
- `mcp_supabase_apply_migration` - Apply all database migrations (DDL operations)
- `mcp_supabase_list_migrations` - Verify migrations applied
- `mcp_supabase_list_tables` - Verify tables created
- `mcp_supabase_execute_sql` - Verify schema (columns, indexes, constraints)
- `mcp_supabase_get_advisors` - Check security and performance recommendations

### Batch 8.1: Schema Design Document Updates

#### Task 8.1.1: Update schema-design.md
- [ ] Add missing tables:
  - `follow_ups` table (if identified as needed)
  - `meetings` and `meeting_attendees` tables (if identified as needed)
  - `file_uploads` table (if identified as needed)
  - `compliance_score_leaderboard_cache` table (optional, if identified as needed)
- [ ] Add missing fields to existing tables:
  - `conversations.lifecycle_state` (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)
  - `messages.delivered_at` (timestamp)
  - `users.avatar_url`, `users.timezone`, `users.language`, `users.notification_preferences`
  - `compliance_scores.previous_period_score`, `compliance_scores.score_change`
  - Any other identified fields
- [ ] Update table documentation with new fields (description, constraints, indexes)
- [ ] Update indexes section (add new indexes for new fields/tables)

**Deliverable:** Updated `schema-design.md` with all critical gaps addressed

#### Task 8.1.2: Update erd.md
- [ ] Add new tables to ERD
- [ ] Update relationship diagrams (add new foreign keys)
- [ ] Add new cross-module data flows (if any)
- [ ] Update entity descriptions

**Deliverable:** Updated `erd.md` reflecting all new relationships

#### Task 8.1.3: Update data-dictionary.md
- [ ] Add definitions for all new fields
- [ ] Update existing field definitions if needed (if scope changed)
- [ ] Add business rules and constraints
- [ ] Update field naming conventions if needed

**Deliverable:** Updated `data-dictionary.md` with complete field definitions

### Batch 8.2: Supporting Documentation Updates

#### Task 8.2.1: Update Migration Strategy (if needed)
- [ ] Review `migration-strategy.md` (if it exists)
- [ ] Add new migrations to strategy
- [ ] Update versioning approach if needed
- [ ] Update rollback strategy if needed

**Deliverable:** Updated migration strategy (if document exists)

#### Task 8.2.2: Review and Update Related Architecture Docs
- [ ] Update RLS policy framework (if new tables need RLS)
  - Define RLS policies for new tables
  - Update RLS policy documentation
- [ ] Update audit logging strategy (if new tables need auditing)
  - Add new tables to audit logging list
  - Update audit log triggers if needed
- [ ] Update API specifications (if schema changes affect APIs)
  - Update API endpoint documentation
  - Update request/response schemas

**Deliverable:** Updated related architecture documentation

### Batch 8.3: Validation & Review

#### Task 8.3.1: Cross-Reference Updated Schema Against Wireframes
- [ ] Spot check: Verify critical wireframes against updated schema
  - Pick 5-10 critical wireframes (one from each module)
  - Verify all data requirements are met
- [ ] Ensure all critical gaps addressed
- [ ] Verify no new gaps introduced (check for typos, missing indexes, etc.)

**Deliverable:** Validation report

#### Task 8.3.2: Create Schema Review Checklist
- [ ] List all changes made (table additions, field additions, index additions)
- [ ] Verify consistency across documents (schema-design.md, erd.md, data-dictionary.md all match)
- [ ] Check for conflicts or contradictions
- [ ] Verify naming conventions are consistent

**Deliverable:** Schema review checklist (completed)

#### Task 8.3.3: Prepare for Team Review
- [ ] Document all changes made (change log)
- [ ] Create change summary (executive summary of changes)
- [ ] Prepare for Phase 1 implementation team review
  - Highlight critical changes that affect Phase 1 tasks
  - Prepare presentation/documentation for review meeting

**Deliverable:** Team review materials

**Phase 8 Deliverable:** Updated schema-design.md, erd.md, data-dictionary.md with all critical gaps addressed, validation complete, ready for team review

---

## Phase 9: Documentation & Handoff (Day 7, Afternoon)

**Duration:** 0.5 day  
**Priority:** Critical — Knowledge transfer

### Batch 9.1: Audit Report Creation

#### Task 9.1.1: Create Comprehensive Audit Report
- [ ] Executive summary of findings
  - Total wireframes audited: 102+
  - Total gaps identified: [count]
  - Critical gaps: [count]
  - High priority gaps: [count]
  - Medium/Low priority gaps: [count]
- [ ] Detailed gap analysis by module
  - Core Foundation gaps
  - RMM module gaps
  - VCI module gaps
  - ECS module gaps
  - CMC module gaps
- [ ] Prioritized list of changes made
- [ ] Wireframes audited checklist (all wireframes with status: audited ✅)

**Deliverable:** Complete audit report document

#### Task 9.1.2: Create Change Log
- [ ] Document all schema changes made (version history)
- [ ] Version the schema documents (add version number/date)
- [ ] Create migration script outline (list of scripts needed, in order)

**Deliverable:** Change log document

### Batch 9.2: Implementation Guidance

#### Task 9.2.1: Create Implementation Priorities Document
- [ ] Critical changes needed before Phase 1
  - Must be implemented before Phase 1 tasks can start
  - Estimated implementation time
- [ ] High priority changes for Phase 1.1
  - Should be implemented early in Phase 1
  - Estimated implementation time
- [ ] Medium priority for later phases
  - Can be implemented in Phase 1.2 or Phase 2
  - Estimated implementation time
- [ ] Implementation order recommendations
  - Order based on dependencies
  - Quick wins first (low effort, high impact)

**Deliverable:** Implementation priorities document

#### Task 9.2.2: Create Migration Script Templates
- [ ] Template for adding new tables
  ```sql
  -- Template structure
  CREATE TABLE [table_name] (
    -- fields
  );
  CREATE INDEX [index_name] ON [table_name] ([column]);
  -- Add foreign keys
  -- Add RLS policies
  ```
- [ ] Template for adding new fields
  ```sql
  -- Template structure
  ALTER TABLE [table_name] ADD COLUMN [column_name] [type] [constraints];
  CREATE INDEX [index_name] ON [table_name] ([column_name]);
  ```
- [ ] Template for adding indexes
- [ ] Template for data migrations (if any initial data needed)

**Deliverable:** Migration script templates

### Batch 9.3: Team Communication

#### Task 9.3.1: Prepare Summary for Phase 1 Team
- [ ] Key findings presentation (slides or document)
  - Overview of audit process
  - Key gaps identified
  - Changes made to schema
  - Impact on Phase 1 tasks
- [ ] Critical changes that affect Phase 1 tasks
  - List which Phase 1 tasks are affected
  - What changes were made
  - What developers need to know
- [ ] Wireframe compliance checklist for developers
  - Quick reference: which wireframes are now fully supported by schema
  - Which wireframes may need additional work (medium priority gaps)

**Deliverable:** Phase 1 team handoff document

#### Task 9.3.2: Update Phase 1 Implementation Plan References
- [ ] Verify all database-related tasks reference updated schema
- [ ] Update task descriptions if schema changed (if tasks reference specific tables/fields)
- [ ] Add new migration tasks if needed (if migrations are separate tasks)
- [ ] Update task dependencies if schema changes affect task order

**Deliverable:** Updated Phase 1 Implementation Plan (if needed)

**Phase 9 Deliverable:** Complete audit report, change log, implementation guidance, team handoff materials

---

## Audit Checklist Template (Per Wireframe)

For each wireframe file, use this checklist:

### Data Fields
- [ ] All displayed fields exist in schema
- [ ] All form input fields have corresponding database fields
- [ ] All calculated fields can be computed from schema
- [ ] All filter fields exist and are indexed

### Tables & Relationships
- [ ] All referenced entities have corresponding tables
- [ ] All relationships (1:1, 1:M, M:M) are correctly modeled
- [ ] Foreign keys exist for all referenced entities
- [ ] Join paths exist for all displayed relationships

### Business Logic
- [ ] Workflow states are supported (status fields, state machines)
- [ ] Status transitions are trackable (history tables, status fields)
- [ ] Business rules are enforceable via constraints (CHECK constraints, triggers)
- [ ] Validation requirements can be implemented (data types, constraints)

### Filters & Queries
- [ ] All filter options have corresponding fields
- [ ] All filters have appropriate indexes (for performance)
- [ ] Date range queries are supported (timestamptz fields, indexes)
- [ ] Search functionality has indexed fields (full-text search indexes if needed)

### UI Requirements
- [ ] Display formats are supported (timestamps, dates, numbers, percentages)
- [ ] Sortable columns have indexes (for performance)
- [ ] Pagination is possible (has ordering fields, indexed)
- [ ] Real-time updates are possible (has timestamps, can use triggers/listeners)

### Calculations & Aggregations
- [ ] All calculated metrics can be computed (from existing data)
- [ ] Trend calculations have historical data (previous periods stored or accessible)
- [ ] Percentile calculations have comparison data (all companies' scores available)
- [ ] Aggregations are performant (indexes exist, can use materialized views if needed)

---

## Risk Assessment

### High Risk Areas (Focus Extra Attention)

1. **Communications Lifecycle States**
   - Complex state machine (CREATED → SENT → DELIVERED → READ → THREADED → WORKFLOW_LINKED → ARCHIVED)
   - Must ensure all states are trackable
   - Must ensure state transitions are valid

2. **Threshold Time-Bound Modifications**
   - Complex business logic (permanent, temporary_auto_revert, temporary_manual_review)
   - Many edge cases (reversion workflows, notifications, approvals)
   - Must ensure all duration types are supported

3. **Follow-up Tracking**
   - New table (`follow_ups`)
   - May have many relationships (companies, users, submissions, breaches, etc.)
   - Must ensure all reference types are supported (generic reference_id + reference_table)

4. **Dashboard Metrics**
   - Aggregations may need optimization (counts, averages, trends)
   - May need caching for performance
   - Must ensure all metrics can be calculated

5. **Historical Data Access**
   - 7-year retention requirement
   - Read-only enforcement
   - Must ensure historical data routing is clear

### Medium Risk Areas

1. **Score Calculations**
   - Performance may need caching (`compliance_score_leaderboard_cache` table)
   - Complex calculations (weighted components, percentiles)
   - Must ensure calculations are performant

2. **Analytics/Treemaps**
   - Aggregations may be complex (by ATC code, by product, by dosage form)
   - May need materialized views for performance
   - Must ensure aggregations are supported

3. **File Uploads**
   - Security considerations (file type validation, size limits)
   - Storage considerations (Supabase Storage vs database)
   - Must ensure file uploads are properly tracked

---

## Success Criteria

### Phase Completion Criteria
- [ ] All wireframes audited (100% coverage)
- [ ] All gaps identified and documented
- [ ] All critical gaps resolved in schema
- [ ] Schema documents updated and consistent
- [ ] Team review completed and approved

### Quality Criteria
- [ ] No critical gaps remain unaddressed
- [ ] All schema changes documented (schema-design.md, erd.md, data-dictionary.md)
- [ ] ERD reflects all relationships
- [ ] Data dictionary is complete (all fields defined)
- [ ] Migration strategy is defined (for all changes)

---

## Dependencies

### Prerequisites
- Access to all wireframe files (`docs/04-design/user-experience/wireframes/`)
- Current `schema-design.md` document (`docs/02-architecture/database/schema-design.md`)
- Current `erd.md` document (`docs/02-architecture/database/erd.md`)
- Current `data-dictionary.md` document (`docs/02-architecture/database/data-dictionary.md`)
- Understanding of Phase 1 implementation requirements

### Blockers
- None identified - can start immediately

### Dependencies Created
- Phase 1 Implementation Plan may need updates based on findings
- Migration scripts will be needed after schema updates
- RLS policies may need updates for new tables
- API specifications may need updates (if schema changes affect APIs)

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 0: Preparation & Setup | 0.5 day | ✅ COMPLETE |
| Phase 1: Core Foundation | 1.5 days | ✅ COMPLETE |
| Phase 2: RMM Module | 0.5 day | ✅ COMPLETE |
| Phase 3: VCI Module | 1.5 days | ✅ COMPLETE |
| Phase 4: ECS Module | 0.5 day | ✅ COMPLETE |
| Phase 5: CMC Module | 0.5 day | ✅ COMPLETE |
| Phase 6: Historical Data & Modals | 0.5 day | ✅ COMPLETE |
| Phase 7: Gap Consolidation & Analysis | 1 day | ✅ COMPLETE |
| Phase 8: Schema Design Update | 1 day | ✅ COMPLETE |
| Phase 9: Documentation & Handoff | 0.5 day | ✅ COMPLETE |
| **TOTAL** | **7 days** | **✅ COMPLETE** |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Wireframes to Audit** | ~102+ |
| **Core Foundation** | ~35 |
| **RMM Module** | 15 |
| **VCI Module** | 26 |
| **ECS Module** | 11 |
| **CMC Module** | 15 |
| **Historical & Modals** | ~15 |

---

## Next Steps After Audit Completion

1. ✅ **Team Review Meeting** - Present findings to Phase 1 team - **COMPLETE**
   - Meeting held with Nadia, Yasmine, and Phase 1 team leads
   - Audit findings presented and approved
   - Schema changes and migration plan approved

2. ✅ **Schema Approval** - Get approval for schema changes - **COMPLETE**
   - Technical lead approval obtained
   - Project manager approval obtained
   - All critical changes signed off

3. ✅ **Migration Planning** - Create detailed migration scripts - **COMPLETE**
   - Migration scripts created in `schema-updates-phase0-6-critical-gaps.md`
   - **All migrations must use Supabase MCP (`mcp_supabase_apply_migration`)** - not Supabase CLI
   - Rollback procedures documented (using `mcp_supabase_execute_sql` if needed)

4. ✅ **Phase 1 Task Updates** - Update Phase 1 plan with schema changes - **COMPLETE**
   - Phase 1 Implementation Plan updated with all Phase 0.6 changes
   - Migration tasks added for new fields and tables
   - Task dependencies updated
   - See [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md)

5. ✅ **RLS Policy Updates** - Update RLS framework for new tables - **COMPLETE**
   - RLS policies defined for governance tables (follow_ups, meetings, meeting_attendees)
   - RLS policy tasks added to Phase 1 Implementation Plan (Task 1.1.1.3f)

6. ✅ **API Spec Updates** - Update API specifications if needed - **COMPLETE**
   - RPC function tasks updated in Phase 1 Implementation Plan
   - Edge Function specifications updated

---

## Related Documents

### Database & Schema
- [Schema Design](../../02-architecture/database/schema-design.md) - Complete database schema
- [Entity Relationship Diagram](../../02-architecture/database/erd.md) - Visual relationships
- [Data Dictionary](../../02-architecture/database/data-dictionary.md) - Field definitions
- [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Migration scripts

### Phase Documentation
- [Phase 0: Technical Foundation](phase-0-technical-foundation.md) - Foundational technical decisions
- [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) - Wireframe specifications (120 wireframes)
- [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) - Implementation plan with Phase 0.6 integration

### Implementation Standards
- [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md) - Core implementation directive
- [Implementation Standards](phase-1-implementation-standards.md) - Task format and Definition of Done

### Audit Documents
- [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md) - Pre-implementation audit status
- [Retroactive Update Plan](phase-0-0.5-0.6-retroactive-update-plan.md) - Phase integration documentation

---

**Last Updated:** 2026-01-12  
**Status:** ✅ COMPLETE - All 9 phases complete, schema updated, integrated into Phase 1

---

## Database Management with Supabase MCP

**⚠️ CRITICAL:** All database operations during Phase 1 implementation MUST use Supabase MCP (Model Context Protocol) tools.

**MCP Tools for Database Operations:**
- `mcp_supabase_apply_migration` - Apply all database migrations (DDL operations)
- `mcp_supabase_list_migrations` - List and verify applied migrations
- `mcp_supabase_list_tables` - List all tables in schema
- `mcp_supabase_execute_sql` - Execute SQL queries (verification, data operations)
- `mcp_supabase_get_advisors` - Get security and performance recommendations
- `mcp_supabase_list_extensions` - List installed database extensions
- `mcp_supabase_generate_typescript_types` - Generate TypeScript types from schema

**MCP Requirements for Phase 1:**
1. All migrations must use `mcp_supabase_apply_migration` (not Supabase CLI)
2. All schema verification must use `mcp_supabase_list_tables` and `mcp_supabase_execute_sql`
3. All migration tracking must use `mcp_supabase_list_migrations`
4. Security checks must use `mcp_supabase_get_advisors` after migrations
5. Schema validation queries must use `mcp_supabase_execute_sql`

**Reference:** See [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) for detailed MCP requirements on all database tasks.
