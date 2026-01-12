# Phase 0.6: Database Schema Gap Analysis

**Purpose:** Track identified gaps between wireframes and current database schema

**Lead:** Nadia (Database Specialist)  
**Second Support:** Fatima (MOH Governance & Regulation SME)  
**Status:** In Progress  
**Created:** 2025-01-21

---

## Gap Categories

- **Critical:** Blocks Phase 1 implementation
- **High:** Needed for core functionality
- **Medium:** Nice to have, can be added later
- **Low:** Optional enhancements

---

## Phase 1: Core Foundation - Gap Analysis

### Batch 1.1: Authentication & Profile

#### Task 1.1.1: Login Page (`task-0.5.1.11-login-page.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Auth fields:** Schema supports email and password (via Supabase Auth)
- ✅ **Password reset:** Standard Supabase Auth flow (no schema changes needed)
- ✅ **Session management:** Handled by Supabase Auth (no schema changes needed)
- ✅ **Remember me:** Client-side cookie (no schema changes needed)
- ✅ **Multi-factor authentication:** Not mentioned in wireframe (not needed)

**Gaps:** None

---

#### Task 1.1.2: Registration Page (`task-0.5.1.12-registration-page.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Registration fields:** Schema supports via `users` table and Supabase Auth
- ✅ **Company Name:** Registration creates company record in `companies` table (via registration workflow)
- ✅ **Email verification:** Standard Supabase Auth flow (no schema changes needed)
- ✅ **Password requirements:** Client-side validation + Supabase Auth (no schema changes needed)
- ✅ **Terms acceptance:** Can be tracked in registration audit trail (via audit_logs)
- ⚠️ **Role assignment:** Wireframe shows company registration - role should default to `company_user` or `company_admin` for first user

**Gaps:** None

---

#### Task 1.1.3: Profile Page (`task-0.5.1.22-profile-page.md`)
**Status:** ✅ Audited  
**Findings:**
- ❌ **MISSING:** `users.avatar_url` field - Avatar upload functionality requires storage URL
- ❌ **MISSING:** `users.timezone` field - Timezone preference (default: 'UTC+01:00')
- ❌ **MISSING:** `users.language` field - Language preference (default: 'en')
- ❌ **MISSING:** `users.notification_preferences` field - JSONB field for notification settings:
  ```jsonb
  {
    "email_enabled": boolean,
    "submission_updates": boolean,
    "compliance_alerts": boolean,
    "enforcement_actions": boolean,
    "system_announcements": boolean
  }
  ```
- ✅ **Password change:** Handled by Supabase Auth (no schema changes needed)
- ✅ **Data export:** Can query user data from existing tables (no schema changes needed)
- ✅ **Account deletion:** Soft delete via `users.is_active` field (already exists)

**Gaps Identified:**
- **CRITICAL:** Add `avatar_url` (text, nullable) to `users` table
- **HIGH:** Add `timezone` (text, default 'UTC+01:00') to `users` table
- **HIGH:** Add `language` (text, default 'en') to `users` table
- **HIGH:** Add `notification_preferences` (jsonb, nullable) to `users` table
- **Index:** Consider `idx_users_timezone` if timezone-based queries needed

---

### Batch 1.2: Layout & Navigation

#### Task 1.2.1: Dashboard Layout Structure (`task-0.5.1.14-dashboard-layout-structure.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Layout structure:** Pure UI/layout component (no database requirements)
- ✅ **Module visibility:** Uses `system_config` table for module activation (already exists)
- ✅ **Role-based menu:** Uses `users.role` field (already exists)

**Gaps:** None

---

#### Task 1.2.2: Header Component (`task-0.5.1.15-header-component.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **User menu data:** Name, avatar, role - all supported:
  - `users.full_name` (exists), `users.avatar_url` (gap already identified), `users.role` (exists)
- ✅ **Notification badge count:** Query `notifications` table with `is_read = false` (already exists)
- ✅ **Search requirements:** No database requirements (client-side or search service)
- ✅ **Module indicator:** Route-based logic (no database requirements)

**Gaps:** None (avatar_url gap already identified)

---

#### Task 1.2.3: Sidebar Navigation (`task-0.5.1.16-sidebar-navigation.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Module activation:** Uses `system_config.is_active` (already exists)
- ✅ **Role-based menu:** Uses `users.role` (already exists)
- ✅ **Badge counts:** Can calculate from existing tables (approvals, notifications, submissions)
- ✅ **Navigation state:** Client-side localStorage (no database requirements)

**Gaps:** None

---

#### Task 1.2.4: Notification Center Component (`task-0.5.1.17-notification-center-component.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Notification types:** Supported by `notifications.type` field (already exists)
- ✅ **Unread counts:** Supported by `notifications.is_read` field (already exists)
- ✅ **Real-time updates:** Can use WebSocket/polling with existing table
- ✅ **Threshold reversion notifications:** Can create when threshold reversion scheduled
- ⚠️ **Note:** Verify all notification types covered (threshold_reversion, enforcement_action, etc.)

**Gaps:** None (verify notification types are comprehensive)

---

### Batch 1.3: Dashboards

#### Task 1.3.1: Company Dashboard (`task-0.5.1.18-company-dashboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **"My submissions":** Supported by submission tables (aams_submissions, msq_submissions, wsl_submissions, registry_submissions) filtered by company_id
- ✅ **Pending approvals:** Supported by `approvals` table (already exists)
- ✅ **Recent activity:** Can aggregate from submissions, approvals, notifications, enforcement_actions
- ✅ **Metrics widgets:** Compliance score from `compliance_scores`, pending/completed from various tables
- ✅ **Enforcement actions:** Supported by `enforcement_actions` table filtered by company_id
- ✅ **Appeal tracking:** Supported by `enforcement_action_appeals` table

**Gaps:** None

---

#### Task 1.3.2: MOH Tier 1 Dashboard (`task-0.5.1.19-moh-tier1-dashboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ❌ **MISSING:** `follow_ups` table - Follow-up Tracking widget requires:
  - Follow-up assignments (assigned_to, company_id, priority, due_date)
  - Issue tracking (issue_type, issue_reference_id, issue_reference_table)
  - Status tracking (pending, in_progress, completed, cancelled)
- ❌ **MISSING:** `meetings` table - Schedule Meeting functionality requires:
  - Meeting details (title, meeting_type, scheduled_at, location, agenda)
  - Meeting reason (e.g., "Submission Compliance Below Threshold")
  - Related reference tracking (related_reference_id, related_reference_table)
  - Status tracking (scheduled, cancelled, completed)
- ❌ **MISSING:** `meeting_attendees` table - Track meeting attendees:
  - Meeting ID, user ID, attendance status (invited, accepted, declined, attended)
  - Calendar invite tracking
- ✅ **%SC calculation:** Can be calculated from existing submission data (no schema changes)
- ✅ **Pending reversions widget:** References `thresholds` table (already exists, verify reversion tracking)
- ✅ **Enforcement actions summary:** References `enforcement_actions` table (already exists)
- ✅ **Compliance metrics:** Can be calculated from existing tables

**Gaps Identified:**
- **CRITICAL:** Create `follow_ups` table with all required fields
- **CRITICAL:** Create `meetings` table with all required fields
- **CRITICAL:** Create `meeting_attendees` table with all required fields

---

#### Task 1.3.3: MOH Tier 2 Dashboard (`task-0.5.1.20-moh-tier2-dashboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Pending verifications queue:** Supported by submission tables with status filters (submitted, tier2_verified)
- ✅ **Oversight metrics:** Can calculate from existing data (verification rate, average time, trends)
- ✅ **Review queue:** Submissions, scores (compliance_scores), disputes (disputes table)
- ✅ **Activity timeline:** Can aggregate from existing tables
- ✅ **%SC calculation:** Can calculate from submission data

**Gaps:** None

---

### Batch 1.4: Communications

#### Task 1.4.1: Communications Inbox List (`task-0.5.1.24-communications-inbox-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ❌ **MISSING:** `conversations.lifecycle_state` field - Required for lifecycle state filtering:
  - States: CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED
  - Default: 'CREATED'
  - Used for filtering: Unread, Read, Threaded, Workflow-Linked
- ✅ **Filters:** Type, Entity, Company, Date range - all supported by existing fields
- ✅ **Unread indicators:** Can be calculated from `message_read_receipts` table
- ✅ **Read receipts format (✓✓):** Can be displayed using `message_read_receipts` data
- ✅ **Threading support:** Already supported via `conversations` and `messages` tables

**Gaps Identified:**
- **CRITICAL:** Add `lifecycle_state` (text, NOT NULL, DEFAULT 'CREATED') to `conversations` table
- **Index:** Add `idx_conversations_lifecycle_state` on `lifecycle_state`

---

#### Task 1.4.2: Conversation Detail (`task-0.5.1.25-conversation-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Message thread display:** Supported by `messages` table filtered by conversation_id
- ✅ **Read receipts (✓✓ format):** Supported by `message_read_receipts` table
  - Can display "✓✓ Read" when read_at is set, "✓✓ Delivered" when delivered_at is set (gap already identified)
- ✅ **Workflow context display:** Supported by `conversations.workflow_entity_type` and `workflow_entity_id` (already exists)
- ✅ **Lifecycle states visualization:** Supported by `conversations.lifecycle_state` (gap already identified)
- ✅ **Archive functionality:** Supported by `conversations.archived_at` field (already exists)
- ✅ **Threading indicator:** Can count messages per conversation to determine THREADED state

**Gaps:** None (lifecycle_state and delivered_at gaps already identified)

---

#### Task 1.4.3: Compose Message (`task-0.5.1.26-compose-message.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Recipient selection:** Uses `users` and `companies` tables for recipient lookup (already exist)
- ✅ **Role-based filtering:** Uses `users.role` field (already exists)
- ✅ **Workflow entity linking:** Supported by `conversations.workflow_entity_type` and `workflow_entity_id` (already exists)
- ✅ **Attachment upload:** Supported by `message_attachments` table (already exists)

**Gaps:** None

---

#### Task 1.4.4: Sent Messages (`task-0.5.1.27-sent-messages.md`)
**Status:** ✅ Audited  
**Findings:**
- ❌ **MISSING:** `messages.delivered_at` field - Required for delivery status tracking (✓✓ format):
  - Shows when message delivered to recipient inbox (not just sent)
  - Different from `read_at` (in `message_read_receipts`)
  - Used for status indicators: Sent → Delivered (✓✓) → Read (✓✓)
- ✅ **Sent tracking:** `messages.created_at` provides sent timestamp
- ✅ **Read tracking:** `message_read_receipts.read_at` provides read timestamp
- ✅ **Status aggregation:** Can calculate from `created_at`, `delivered_at`, and `read_at`

**Gaps Identified:**
- **HIGH:** Add `delivered_at` (timestamptz, nullable) to `messages` table
- **Index:** Add `idx_messages_delivered_at` on `delivered_at` (WHERE delivered_at IS NOT NULL) for performance

---

#### Task 1.4.5: System Announcements (`task-0.5.1.28-system-announcements.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Announcement creation:** Supported by `conversations` table with `is_announcement = true` (already exists)
- ✅ **Broadcast controls:** Recipient selection uses `users` and `companies` tables (already exist)
- ✅ **Expiration dates:** Supported by `conversations.announcement_expires_at` field (already exists)
- ✅ **Broadcast recipient tracking:** Uses `conversation_participants` table (already exists)
- ✅ **Read/unread status:** Uses `message_read_receipts` table (already exists)
- ✅ **Lifecycle states:** Supported by `conversations.lifecycle_state` (gap already identified)
- ✅ **Retention tracking:** Can calculate from `archived_at` and `created_at` timestamps

**Gaps:** None (lifecycle_state gap already identified)

---

#### Task 1.4.6: Communication Integration in Workflow
**Status:** ✅ Audited  
**Findings:**
- ✅ **Workflow entity linking:** Supported by `conversations.workflow_entity_type` and `workflow_entity_id` (already exists)
- ✅ **Workflow context display:** Can join conversations to referenced entities using workflow_entity fields
- ✅ **Message threading by workflow entity:** Filter messages by conversation, filter conversations by workflow_entity
- ✅ **Immutable references:** Workflow entity references are immutable (once set, cannot be changed) - enforced by application logic

**Gaps:** None

---

#### Task 1.4.7: Archived Conversations (`task-0.5.1.36-archived-conversations.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Archive functionality:** Supported by `conversations.archived_at` timestamp field (already exists)
- ✅ **7-year retention tracking:** Can calculate from `archived_at` timestamp (7 years = archived_at + 7 years)
- ✅ **Restore capability:** Can set `archived_at = NULL` to restore (soft delete pattern)
- ✅ **Retention status indicators:** Can calculate "Retained until" date from `archived_at + 7 years`
- ✅ **Filters:** Type, Entity, Date range - all supported by existing fields
- ✅ **Lifecycle state:** Should set `lifecycle_state = 'ARCHIVED'` when archived (gap already identified)

**Gaps:** None (lifecycle_state and archived_at already exist)

---

### Batch 1.5: Global Pages

#### Task 1.5.1: History Overview (`task-0.5.1.30-history-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical activity timeline:** Can aggregate from all existing tables:
  - Submissions: `aams_submissions`, `msq_submissions`, `wsl_submissions`, `registry_submissions` (created_at, updated_at)
  - Products/SKUs: `products`, `skus` (created_at, updated_at)
  - Breaches: `breaches` (created_at, detected_at)
  - Export requests: `export_requests` (created_at, updated_at)
  - Enforcement actions: `enforcement_actions` (created_at, executed_at)
  - Appeals: `enforcement_action_appeals` (created_at, updated_at)
- ✅ **Action types:** CREATE, UPDATE, EXECUTE - all supported by existing timestamp fields
- ✅ **Entity tracking:** Can identify entity type and ID from audit_logs or table structure
- ✅ **User tracking:** All tables have `created_by` or similar user tracking fields
- ✅ **Filters:** Type, Entity, Company, Date range - all supported by existing fields
- ✅ **Enforcement action display:** Can show action type (Warning/Fine/Suspension) from `enforcement_actions.action_type`

**Gaps:** None (all requirements met by existing schema and audit_logs table)

---

#### Task 1.5.2: Notifications Page (`task-0.5.1.31-notifications-page.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Notification types:** Supported by `notifications.type` field (already exists)
  - Types: submission_status, breach_alert, enforcement_action_created, enforcement_action_requires_approval, enforcement_action_executed, appeal_window_open, appeal_submitted, appeal_requires_review, appeal_status_update, appeal_deadline_reminder, threshold_reversion_warning, threshold_reversion_completed, threshold_reversion_review_required, etc.
- ✅ **Unread/read status:** Supported by `notifications.is_read` field (already exists)
- ✅ **Notification preferences:** Supported by `users.notification_preferences` (gap already identified)
- ✅ **Mark as read functionality:** Can update `notifications.is_read = true`
- ✅ **Filters:** Type, Status, Date range - all supported by existing fields
- ✅ **Enforcement action filters:** Can filter by enforcement_action-related notification types
- ✅ **Threshold reversion filters:** Can filter by threshold_reversion notification types

**Gaps:** None (notification_preferences gap already identified)

---

#### Task 1.5.3: Audit Logs List (`task-0.5.1.32-audit-logs-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Audit log entries:** Supported by `audit_logs` table (already exists with hash-chained structure)
- ✅ **Action types:** CREATE, UPDATE, DELETE, APPROVE, EXECUTE, APPEAL - all supported by `audit_logs.action_type` field
- ✅ **Table tracking:** Supported by `audit_logs.table_name` field (already exists)
- ✅ **Record ID tracking:** Supported by `audit_logs.record_id` field (already exists)
- ✅ **User tracking:** Supported by `audit_logs.user_id` field (already exists)
- ✅ **Timestamp tracking:** Supported by `audit_logs.created_at` field (already exists)
- ✅ **Hash chaining:** Supported by `audit_logs.previous_hash` and `audit_logs.current_hash` fields (already exists)
- ✅ **Filters:** Date range, Table, User, Action - all supported by existing fields
- ✅ **Export functionality:** Can export from `audit_logs` table with filters
- ✅ **Enforcement action display:** Can join `audit_logs` to `enforcement_actions` when table_name = 'enforcement_actions' to show action type

**Gaps:** None (all requirements met by existing audit_logs table)

---

#### Task 1.5.4: Audit Log Detail (`task-0.5.1.33-audit-log-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Log entry details:** Supported by `audit_logs` table (already exists)
  - Action, table_name, record_id, old_values, new_values, user_id, created_at all exist
- ✅ **Hash chain verification:** Supported by `audit_logs.previous_hash` and `current_hash` fields (already exists)
- ✅ **User information:** Can join to `users` table via `audit_logs.user_id`
- ✅ **Related entity display (enforcement_actions):** Can join `audit_logs` to `enforcement_actions` when table_name = 'enforcement_actions' to show action type, company, violation type, status
- ✅ **Compliance information:** Can calculate retention period from `created_at` timestamp (7 years)
- ✅ **Navigation:** Previous/Next log entries can query `audit_logs` by record_id or sequential order

**Gaps:** None (all requirements met by existing audit_logs table)

---

#### Task 1.5.5: Audit Reports (`task-0.5.1.34-audit-reports.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Report generation:** Can generate reports from `audit_logs` table with filters
- ✅ **Report types:** User Activity, System Changes, Compliance Audit, Enforcement Actions - all can be generated from audit_logs with appropriate filters
- ✅ **Date range filtering:** Supported by `audit_logs.created_at` field (already exists)
- ✅ **Report storage:** Reports can be generated on-demand (no need for storage table, generated from audit_logs)
  - If stored reports are needed, can use export_requests/export_completions tables or create a simple reports table
- ✅ **Enforcement actions report:** Can filter audit_logs where table_name = 'enforcement_actions' and join to enforcement_actions table
- ✅ **7-year retention compliance:** Reports generated from audit_logs which are retained for 7 years (already compliant)

**Gaps:** None (reports can be generated from audit_logs table, no schema changes needed)

---

#### Task 1.5.6: System Configuration (`task-0.5.1.35-system-configuration.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Module activation:** Supported by `system_config` table (already exists)
  - `system_config.config_key` and `config_value` can store module activation status (is_active)
  - Can query: `WHERE config_key = 'module_ecs_active'` or similar
- ✅ **Activation periods:** Can store activation period in config_value as JSON or separate fields
  - Alternatively, can add `activation_start_date` and `activation_end_date` fields to system_config if needed
- ✅ **System settings:** General settings, notification settings, security settings - all can be stored in `system_config` table
- ✅ **Timezone settings:** Can store in system_config (already flexible enough)
- ✅ **Cloud services compliance tracking:** Can store compliance status in system_config table
- ✅ **Regulatory compliance tracking:** Can store compliance status in system_config table
- ⚠️ **Note:** `system_config` table uses key-value pairs which is flexible but may need verification that all configuration needs are met

**Gaps:** None (system_config table is flexible enough to handle all configuration needs)

---

### Batch 1.6: Public Pages

#### Task 1.6.1: Public Pages Batch (`task-0.5.1.1-public-homepage.md`, `task-0.5.1.2-about-page.md`, `task-0.5.1.7-terms-of-service.md`, `task-0.5.1.8-privacy-policy.md`, `task-0.5.1.9-cookie-policy.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Public Homepage:** Static marketing content, no database requirements
- ✅ **About Page:** Static informational content, no database requirements
- ✅ **Terms of Service:** Static legal document, no database requirements
  - Terms acceptance can be tracked via `audit_logs` table if needed (already exists)
- ✅ **Privacy Policy:** Static legal document, no database requirements
- ✅ **Cookie Policy:** Static legal document, no database requirements
  - Cookie consent tracking can be handled client-side (cookies/localStorage)
  - If server-side tracking needed, can use `users` table preferences or `audit_logs`
- ✅ **Content versioning:** Legal documents show "Last updated" dates - can be managed in static content/CMS (no database requirement)
- ✅ **Legal document tracking:** Acceptance tracking can use `audit_logs` table (already exists)

**Gaps:** None (all static content pages, no database requirements)

---

#### Task 1.6.2: Support Pages Batch (`task-0.5.1.37-support-center.md`, `task-0.5.1.38-faq-page.md`, `task-0.5.1.39-contact-support.md`, `task-0.5.1.40-documentation.md`, `task-0.5.1.41-system-status.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Support Center:** Landing page with links, no database requirements
- ✅ **FAQ Page:** FAQ content display
  - Can be static content (markdown files, CMS) - no database requirement
  - If dynamic FAQ needed, could create `faq_items` table (but wireframe suggests static content)
  - Search functionality can be client-side or full-text search service (no database requirement)
- ⚠️ **Contact Support:** Contact form submissions
  - Wireframe shows contact form with fields: name, email, company, subject, category, message, attachments
  - May need `support_tickets` table if ticket tracking required
  - However, wireframe shows "Contact form" without ticket tracking UI - likely email-only
  - Recommendation: Start with email-only, add `support_tickets` table later if ticket tracking needed (Phase 1.1 or Phase 2)
- ✅ **Documentation:** Static documentation content, no database requirements
  - Access tracking possible but not required (can use analytics service)
- ⚠️ **System Status:** System status/uptime/incidents display
  - Wireframe shows: system status, uptime, incident history, maintenance schedule
  - May need `system_incidents` or `system_status` table if status tracking required
  - However, could use external status page service (e.g., Statuspage.io) - no database requirement
  - Recommendation: Use external status service initially, add tables later if needed (Phase 1.1 or Phase 2)

**Gaps Identified:**
- **MEDIUM:** Consider `support_tickets` table if contact form ticket tracking needed (Phase 1.1 or Phase 2)
- **MEDIUM:** Consider `system_incidents` or `system_status` table if status tracking needed (Phase 1.1 or Phase 2)
- **Note:** Both are optional - wireframes suggest email-only contact and external status service are acceptable

**Recommendation:** No database changes needed for Phase 1. Contact form can send emails directly, system status can use external service. Tables can be added later if ticket tracking or status tracking is prioritized.

---

## Phase 2: RMM Module - Gap Analysis

### Batch 2.1: Core RMM Entities

#### Task 2.1.1: RMM Overview (`task-0.5.2.1-rmm-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Overview metrics:** Can calculate from existing tables:
  - Companies count: `COUNT(*) FROM companies WHERE is_active = true/false`
  - Products count: `COUNT(*) FROM products WHERE is_active = true/false`
  - SKUs count: `COUNT(*) FROM skus WHERE is_active = true/false`
- ✅ **Recent activity timeline:** Can aggregate from `audit_logs` table filtered by table_name (companies, products, skus, registry_submissions)
- ✅ **Registry submissions status:** Can query `registry_submissions` table with status filters (pending, approved, rejected)
- ✅ **Quick links data:** All links reference existing routes/tables

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.1.2: Companies List (`task-0.5.2.2-companies-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Company fields:** All required fields exist in `companies` table:
  - `name`, `registration_number`, `company_type`, `is_active` (status), `created_at`
- ✅ **Filters:** All filter requirements supported:
  - Type filter: `company_type` field (ipc, wholesaler)
  - Status filter: `is_active` field
  - Date filter: `created_at` field
  - Company filter: Can filter by company_id (for company users)
- ✅ **Search functionality:** Can search `name` and `registration_number` fields
- ✅ **Registration number format:** Format validation can be done application-side (no schema change needed)
- ✅ **Sortable columns:** All fields exist for sorting (name, registration_number, company_type, is_active, created_at)

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.1.3: Company Detail (`task-0.5.2.3-company-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Company detail display:** All fields exist in `companies` table:
  - `name`, `company_type`, `is_active` (status), `registration_number`, `address`, `contact_email`, `contact_phone`, `created_at`, `updated_at`
- ✅ **Tax ID:** Not in schema - but wireframe shows "Tax ID: TAX-123456789" - may need `tax_id` field
- ✅ **Overview tab - metrics:** Can calculate from related tables:
  - Total/Active products: Query `products` table filtered by `company_id`
  - Total/Active SKUs: Query `skus` table filtered by `product_id` (via products)
- ✅ **Products tab:** Can query `products` table filtered by `company_id`
- ✅ **Enforcement tab:** Can query `enforcement_actions` table filtered by `company_id`
- ✅ **History tab:** Can aggregate from `audit_logs` table filtered by `table_name = 'companies'` and `record_id`

**Gaps Identified:**
- **MEDIUM:** Consider adding `tax_id` field to `companies` table if Tax ID tracking required (verify with business requirements)

---

#### Task 2.1.4: Products List (`task-0.5.2.4-products-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Product fields:** All required fields exist in `products` table:
  - `name`, `company_id`, `is_active` (status), `created_at`
- ✅ **ATC code display:** Can join to `atc_codes` table via `skus.atc_code_id` (ATC codes are at SKU level, not product level)
  - Note: Wireframe may show product-level ATC code - need to verify if this is SKU-level aggregation or if products need ATC code
- ✅ **Company-scoped filtering:** Supported by `products.company_id` field
- ✅ **Search requirements:** Can search `products.name` field
- ✅ **Filters:** Type (company), status (is_active), date (created_at) - all supported

**Gaps:** None (ATC code can be displayed from related SKUs if needed, or may need product-level ATC code - verify with business requirements)

---

#### Task 2.1.5: Product Detail (`task-0.5.2.5-product-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Product detail display:** All fields exist in `products` table
- ✅ **Overview tab:** Can calculate metrics from related `skus` table
- ✅ **SKUs tab:** Can query `skus` table filtered by `product_id` (1:M relationship exists)
- ✅ **History tab:** Can aggregate from `audit_logs` table filtered by `table_name = 'products'` and `record_id`
- ✅ **Submissions related to product:** Can query submission tables filtered by product_id (if they reference products directly) or via SKU relationships

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.1.6: SKUs List (`task-0.5.2.6-skus-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **SKU fields:** All required fields exist in `skus` table:
  - `name`, `product_id`, `dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure`
- ✅ **Product-scoped filtering:** Supported by `skus.product_id` field
- ✅ **Pharmaceutical attributes display:** All fields exist:
  - `dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure`
- ✅ **Search requirements:** Can search `name`, `sku_code` fields
- ✅ **Filters:** Product, status (is_active), date (created_at) - all supported

**Gaps:** None (all pharmaceutical attribute fields exist in schema)

---

#### Task 2.1.7: SKU Detail (`task-0.5.2.7-sku-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **SKU detail display:** All pharmaceutical attributes exist in `skus` table
- ✅ **Overview tab:** All fields available
- ✅ **History tab:** Can aggregate from `audit_logs` table filtered by `table_name = 'skus'` and `record_id`
- ✅ **Submissions tab:** Can query submission tables filtered by `sku_id` (submissions reference SKUs)
- ✅ **Threshold changes:** Can query `thresholds` table filtered by `sku_id`
- ✅ **Compliance events:** Can query `breaches` table filtered by `sku_id`

**Gaps:** None (all requirements met by existing schema)

---

### Batch 2.2: RMM Forms

#### Task 2.2.1: Company Create/Edit Form (`task-0.5.2.8-company-create-edit-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Form fields match `companies` table:** All fields exist
- ✅ **Validation rules:** Registration number uniqueness supported by UNIQUE constraint on `registration_number`
- ✅ **Format validation:** Can be done application-side (no schema change needed)
- ✅ **Draft auto-save:** Not mentioned in wireframe, but can use `audit_logs` for draft tracking if needed
- ✅ **All required fields in schema:** All fields present

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.2.2: Product Create/Edit Form (`task-0.5.2.9-product-create-edit-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Form fields match `products` table:** All fields exist
- ✅ **ATC code selection:** Can query `atc_codes` table (already exists)
  - Note: ATC codes are at SKU level in schema, not product level - verify if products need ATC code field
- ✅ **Validation:** `company_id` foreign key constraint ensures valid company
- ✅ **All fields present:** All required fields exist

**Gaps:** None (ATC code selection available from `atc_codes` table - used at SKU level, not product level)

---

#### Task 2.2.3: SKU Create/Edit Form (`task-0.5.2.10-sku-create-edit-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Pharmaceutical attributes fields:** All fields exist:
  - `dosage_strength`, `dosage_form`, `pack_size`, `unit_of_measure`
- ✅ **Form validation:** All fields have appropriate types and constraints
- ✅ **ATC code selection:** Can query `atc_codes` table via `skus.atc_code_id` field (already exists)
- ✅ **Product relationship:** `product_id` foreign key ensures valid product
- ✅ **ATC code inheritance:** Wireframe suggests ATC code can be inherited from product - but schema has ATC codes at SKU level, not product level
  - This is acceptable - SKUs can have their own ATC codes

**Gaps:** None (all pharmaceutical attribute fields exist, ATC code at SKU level is correct)

---

### Batch 2.3: RMM Workflow

#### Task 2.3.1: Registry Submission List (`task-0.5.2.11-registry-submission-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission list fields:** All fields exist in `registry_submissions` table:
  - Company, product, SKU references, status, submitted_at
- ✅ **Status filters:** Supported by `status` field (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected)
- ✅ **Type filters:** Supported by `submission_type` field (company_registration, product_registration, sku_registration)
- ✅ **Date filters:** Supported by `submitted_at` field
- ✅ **All filter requirements met:** Schema supports all filtering needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.3.2: Registry Submission Detail (`task-0.5.2.12-registry-submission-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission detail fields:** All fields exist in `registry_submissions` table
- ✅ **Workflow status display:** Supported by `status` field
- ✅ **Approval history timeline:** Can query `approvals` table filtered by `entity_type = 'registry_submission'` and `entity_id`
- ✅ **`approvals` table relationship:** Relationship exists via `entity_type` and `entity_id` fields
- ✅ **Workflow status tracking:** All states supported (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected)

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.3.3: Registry Submission Workflow States (`task-0.5.2.13-registry-submission-workflow-states.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **All workflow states:** Supported by `status` field:
  - draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected
- ✅ **State transition tracking:** Can track via `audit_logs` table (state changes logged)
- ✅ **Approval chain:** Supported by `approvals` table with workflow tracking
- ✅ **Status history:** Can query `audit_logs` table for status change history

**Gaps:** None (all workflow states and transitions supported)

---

### Batch 2.4: RMM MOH-Only Pages

#### Task 2.4.1: ATC Codes List (`task-0.5.2.14-atc-codes-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **ATC codes list:** Supported by `atc_codes` table (already exists)
- ✅ **Search functionality:** Can search `code` and `description` fields
- ✅ **Filters:** Can filter by `is_active` field
- ✅ **Level/category filters:** Can filter by ATC code structure (hierarchical codes like N02BE01 can be parsed)
  - Level filtering can be done application-side (parse code structure)
- ✅ **Read-only access:** Companies have read-only access (enforced by RLS policies)

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.4.2: Critical Medicines List (`task-0.5.2.15-critical-medicines-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Critical medicines list:** Supported by `critical_medicines` table (already exists)
- ✅ **Designation interface:** Can create records in `critical_medicines` table (Tier 1 only, enforced by RLS)
- ✅ **Filters:** Can filter by:
  - ATC code: Join to `skus` table via `sku_id`, then to `atc_codes` via `atc_code_id`
  - Designation date: `designated_at` field exists
  - Active status: `is_active` field exists
- ✅ **SKU relationship:** `critical_medicines.sku_id` references `skus.id` (relationship exists)

**Gaps:** None (all requirements met by existing schema)

---

### Batch 2.5: Enforcement Module

#### Task 2.5.1: Enforcement Dashboard (`task-0.5.2.0-enforcement-dashboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Dashboard metrics:** Can calculate from `enforcement_actions` table:
  - Total actions: `COUNT(*) FROM enforcement_actions`
  - Pending approvals: `COUNT(*) WHERE status = 'pending_approval'`
  - Resolved actions: `COUNT(*) WHERE status = 'executed'`
- ✅ **Recent actions timeline:** Can query `enforcement_actions` table ordered by `created_at`
- ✅ **Pending approvals widget:** Can query `enforcement_actions` where `status = 'pending_approval'`
- ✅ **Action type breakdown:** Can group by `action_type` field (warning, fine, suspension)
- ✅ **All dashboard requirements:** Schema supports all metrics

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.2: Enforcement Actions List (`task-0.5.2.1-enforcement-actions-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Action list fields:** All fields exist in `enforcement_actions` table:
  - `company_id`, `action_type`, `status`, `amount`, `created_at`
- ✅ **Filters:** All filter requirements supported:
  - Action type: `action_type` field (warning, fine, suspension)
  - Status: `status` field
  - Company: `company_id` field
  - Date range: `created_at` field
- ✅ **Sortable columns:** All fields exist for sorting

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.3: Enforcement Action Detail (`task-0.5.2.1a-enforcement-action-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Action detail fields:** All fields exist in `enforcement_actions` table
- ✅ **Workflow status display:** Supported by `status` field
- ✅ **Approval chain display:** Can query `approvals` table filtered by `entity_type = 'enforcement_action'` and `entity_id`
- ✅ **Violation details link:** Can link to related breach via `breach_id` field (if exists)
- ✅ **Appeal status and link:** Can query `enforcement_action_appeals` table filtered by `enforcement_action_id`
- ✅ **`enforcement_action_appeals` relationship:** Relationship exists via `enforcement_action_id` field

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.4: Create Enforcement Action Wizard (`task-0.5.2.1b-create-enforcement-action-wizard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Action creation fields:** All fields exist in `enforcement_actions` table:
  - `company_id`, `action_type`, `amount`, `legal_basis`, `justification`
- ✅ **Violation selection:** Can link to breach via `breach_id` field (if breach-related)
- ✅ **Amount input:** Supported by `amount` field (numeric type)
- ✅ **Legal basis:** Supported by `legal_basis` field
- ✅ **Justification:** Supported by `justification` field
- ✅ **All fields in table:** All required fields exist

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.5: Pending Approvals (`task-0.5.2.1c-pending-approvals.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Pending approvals list:** Can query `enforcement_actions` where `status = 'pending_approval'`
- ✅ **Approval interface:** Can create records in `approvals` table
- ✅ **Bulk approval actions:** Can update multiple `enforcement_actions` records
- ✅ **Approval workflow tracking:** Supported by `approvals` table with workflow fields

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.6: Enforcement Reports (`task-0.5.2.1d-enforcement-reports.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Enforcement analytics:** Can aggregate from `enforcement_actions` table:
  - Trends: Group by date periods
  - Totals: SUM(amount), COUNT(*) by type
  - Breakdowns: Group by action_type, status, company
- ✅ **Action type breakdown:** Can group by `action_type` field (chart data)
- ✅ **Company compliance tracking:** Can aggregate by `company_id`
- ✅ **Reporting data requirements:** All aggregations can be calculated from existing data

**Gaps:** None (all reporting requirements met by existing schema)

---

#### Task 2.5.7: Appeal Review Interface (`task-0.5.2.1e-appeal-review-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Appeal review fields:** All fields exist in `enforcement_action_appeals` table:
  - `id`, `enforcement_action_id` (original_action), `appeal_reason`, evidence (can be stored as file references)
- ✅ **Uphold/overturn decisions:** Supported by `status` field (pending_review, upheld, overturned, etc.)
- ✅ **Adjustment notes:** Supported by `review_notes` or similar fields
- ✅ **New amount (if overturned):** Can update original `enforcement_actions.amount` or store adjusted amount in appeals table
- ✅ **All requirements met:** Schema supports appeal review workflow

**Gaps:** None (all requirements met by existing schema)

---

#### Task 2.5.8: Appeal Submission Form (`task-0.5.2.1f-appeal-submission-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Appeal submission fields:** All fields exist in `enforcement_action_appeals` table:
  - `enforcement_action_id` (action_id), `appeal_reason`, evidence upload (can use file storage)
- ✅ **Evidence file upload:** Can use file storage (Supabase Storage) and reference in appeals table
- ✅ **Appeal reason:** Supported by `appeal_reason` field
- ✅ **Appeal tracking:** Supported by `status`, `submitted_at`, `reviewed_at` fields

**Gaps:** None (all requirements met by existing schema)

---

## Summary of Gaps Identified

### Critical Gaps (Must Fix Before Phase 1)
- [ ] **users.avatar_url** - Profile avatar functionality
- [ ] **users.timezone** - User timezone preference
- [ ] **users.language** - User language preference
- [ ] **users.notification_preferences** - Notification settings (JSONB)
- [ ] **conversations.lifecycle_state** - Communication lifecycle tracking
- [ ] **follow_ups table** - Follow-up tracking for governance actions
- [ ] **meetings table** - Meeting scheduling for governance
- [ ] **meeting_attendees table** - Meeting attendee tracking

### High Priority Gaps (Should Fix in Phase 1)
- [ ] **messages.delivered_at** - Message delivery status tracking
- [ ] **compliance_scores.previous_period_score** - Previous period score for trend calculation
- [ ] **compliance_scores.score_change** - Score change from previous period (calculated or stored)

### Medium Priority Gaps (Can Fix Later)
- [ ] None identified yet

### Low Priority Gaps (Backlog)
- [ ] **idx_users_timezone** - Index on timezone (if timezone-based queries needed)

---

## Phase 3: VCI Module - Gap Analysis

### Batch 3.1: VCI Overview & AAMS

#### Task 3.1.1: VCI Overview (`task-0.5.3.0-vci-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission statistics:** Can calculate from existing tables:
  - AAMS: `COUNT(*) FROM aams_submissions WHERE year = 2025`
  - MSQ: `COUNT(*) FROM msq_submissions WHERE year = 2025 AND month = 1`
  - WSL: `COUNT(*) FROM wsl_submissions WHERE week_ending_date >= current_week_start`
- ✅ **Compliance violations alert:** Can query `breaches` table with `status = 'detected'` or `status = 'tier2_analyzing'`
- ✅ **Recent activity timeline:** Can aggregate from `audit_logs` table filtered by table_name (aams_submissions, msq_submissions, wsl_submissions, thresholds)
- ✅ **Threshold management metrics:** Can query `thresholds` table:
  - Active thresholds: `COUNT(*) WHERE is_current = true`
  - Pending reversions: `COUNT(*) WHERE revert_date IS NOT NULL AND revert_date > CURRENT_DATE`
- ✅ **All overview requirements:** Schema supports all metrics

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.2: AAMS Submissions List (`task-0.5.3.1-aams-submissions-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **List fields:** All fields exist in `aams_submissions` table:
  - `year`, `status`, `submitted_at`, `verified_at`, `approved_at`
- ✅ **Filters:** All filter requirements supported:
  - Year: `year` field
  - Status: `status` field (draft, submitted, tier2_verified, tier1_approved, completed, rejected)
  - Company: `company_id` field
- ✅ **Late submission indicator:** Supported by `is_late` field
- ✅ **Deadline countdown:** Can calculate from `year` field (deadline: January 31st, grace until February 15th)
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.3: AAMS Submission Form (`task-0.5.3.2-aams-submission-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission data structure:** Supported by `submission_data` JSONB field:
  - Format: `[{"sku_id": "uuid", "quantity": 10000}, ...]` (array of SKU quantities per month)
  - Note: Wireframe shows monthly data (Jan-Dec), but AAMS is annual average, so schema supports aggregated monthly data in JSONB
- ✅ **Year field:** Supported by `year` field
- ✅ **Company field:** Supported by `company_id` field (auto-filled from user)
- ✅ **Status field:** Supported by `status` field (draft, submitted, etc.)
- ✅ **Draft auto-save:** Supported by `status = 'draft'` and `updated_at` timestamp
- ✅ **Validation requirements:** Can validate:
  - SKU exists: Check against `skus` table
  - Quantities valid: Validate JSONB array structure
- ✅ **All form requirements:** Schema supports all data entry needs

**Note:** The wireframe shows monthly quantities (Jan-Dec columns), but AAMS is calculated as annual average. The schema's `submission_data` JSONB field can store the monthly breakdown for calculation, which is correct.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.4: AAMS Submission Detail (`task-0.5.3.3-aams-submission-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission detail fields:** All fields exist in `aams_submissions` table
- ✅ **Workflow status display:** Supported by `status` field with workflow states
- ✅ **Threshold visibility indicator:** Thresholds become visible after Tier 2 verification - can check `verified_at IS NOT NULL`
- ✅ **Calculated threshold display:** Can calculate threshold from AAMS value and multiplier B (from `thresholds` table)
- ✅ **Duration type display:** Can query `thresholds` table for `duration_type` and `revert_date`
- ✅ **Revert date visibility:** Supported by `thresholds.revert_date` field (for temporary thresholds)
- ✅ **Approval history timeline:** Can reconstruct from `submitted_at`, `verified_at`, `approved_at` fields, plus `audit_logs` table
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.5: Threshold Management (`task-0.5.3.4-threshold-management.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Threshold list fields:** All fields exist in `thresholds` table:
  - SKU: `sku_id` (NULL for global)
  - Product description: Can join via `sku_id` to `skus` table
  - Threshold value: `threshold_value`
  - Multiplier: `multiplier_b`
  - Duration type: `duration_type` (permanent, temporary_auto_revert, temporary_manual_review)
  - Revert date: `revert_date` (for temporary thresholds)
  - Status: Can determine from `is_current`, `revert_date`, `requires_manual_review`
- ✅ **Filters:** All filter requirements supported:
  - Type (local/global): `sku_id IS NULL` (global) vs `sku_id IS NOT NULL` (local)
  - Status: Can filter by `is_current`, `revert_date`, duration_type
  - Duration: `duration_type` field
  - Company: Can join via `sku_id` to `skus.company_id`
- ✅ **Bulk actions:** Can update multiple threshold records
- ✅ **Pending reversion indicators:** Can query `WHERE revert_date IS NOT NULL AND revert_date > CURRENT_DATE`
- ✅ **Color coding by days until revert:** Can calculate from `revert_date - CURRENT_DATE`
- ✅ **All management requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.6: Threshold Detail (`task-0.5.3.5-threshold-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Threshold detail fields:** All fields exist in `thresholds` table
- ✅ **Modification history timeline:** Can query `audit_logs` table filtered by `table_name = 'thresholds'` and `record_id = threshold.id`
  - Note: Version history is tracked via `is_current` and `effective_to` fields (non-retroactive changes create new records)
- ✅ **Related thresholds:** Can query `thresholds` table:
  - Global threshold: `WHERE sku_id IS NULL AND threshold_type = 'vci'`
  - Other SKU thresholds: `WHERE threshold_type = 'vci' AND sku_id != current_sku_id`
- ✅ **Version history tracking:** Supported by versioning approach (new records with `effective_from`/`effective_to`)
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.7: Threshold Modification Modal (`task-0.5.3.6-threshold-modification-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Local vs global selector:** Supported by `sku_id` field (NULL for global, UUID for local)
- ✅ **B multiplier input:** Supported by `multiplier_b` field
- ✅ **Duration type selection:** Supported by `duration_type` field (permanent, temporary_auto_revert, temporary_manual_review)
- ✅ **Time-bound options:** Supported by:
  - `revert_date` field (for both auto_revert and manual_review)
  - `revert_to_multiplier` field
  - `revert_to_threshold_value` field
  - `requires_manual_review` field (for manual_review type)
- ✅ **Justification input:** Can store in `audit_logs` table or as part of threshold modification workflow
- ✅ **All modification requirements:** Schema supports all form fields

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.8: Threshold Reversion Review (`task-0.5.3.7-threshold-reversion-review.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Review interface fields:** All fields exist in `thresholds` table:
  - Current threshold: `threshold_value`, `multiplier_b`
  - Original threshold: `revert_to_threshold_value`, `revert_to_multiplier`
  - Revert date: `revert_date`
- ✅ **Confirm/cancel/extend options:** Logic can be implemented via:
  - Confirm: Create new threshold record with reverted values, mark old as inactive (`is_current = false`)
  - Cancel: Update `revert_date = NULL` or remove reversion
  - Extend: Update `revert_date` to new date
- ✅ **Justification input:** Can store in `audit_logs` table
- ✅ **Manual review workflow:** Supported by `requires_manual_review` field
- ✅ **All review requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.1.9: Pending Reversions List (`task-0.5.3.8-pending-reversions-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Pending reversions list:** Can query `thresholds` WHERE `revert_date IS NOT NULL AND revert_date > CURRENT_DATE`
- ✅ **Filters:** All filter requirements supported:
  - Type (auto_revert/manual_review): `duration_type` field (temporary_auto_revert vs temporary_manual_review)
  - Days until revert: Can calculate from `revert_date - CURRENT_DATE`
  - Company: Can join via `sku_id` to `skus.company_id`
  - SKU: `sku_id` field
- ✅ **Color coding:** Can calculate days until from `revert_date`
- ✅ **Bulk actions:** Can update multiple threshold records
- ✅ **Reversion tracking:** Supported by `revert_date`, `revert_notification_sent_7d`, `revert_notification_sent_1d`, `revert_notification_sent_on_revert` fields
- ✅ **All list requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 3.2: MSQ Submissions

#### Task 3.2.1: MSQ Submissions List (`task-0.5.3.9-msq-submissions-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **List fields:** All fields exist in `msq_submissions` table:
  - Month: `month` field (1-12)
  - Year: `year` field
  - Status: `status` field (submitted, flagged_for_review, accepted, rejected)
  - Submitted: `submitted_at` field
  - Flagged for review: Can check `status = 'flagged_for_review'` or use `validation_flags` JSONB field
- ✅ **Filters:** All filter requirements supported:
  - Month: `month` field
  - Status: `status` field
  - Company: `company_id` field
- ✅ **Correction tracking:** Supported by `correction_of` field (references original submission)
- ✅ **7-day grace period indicator:** Can calculate from `submitted_at + 7 days`
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.2.2: MSQ Submission Form (`task-0.5.3.10-msq-submission-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Form structure:** Supported by `submission_data` JSONB field:
  - Format: Array of `{sku_id, quantity}` objects (simpler than AAMS, no monthly breakdown)
- ✅ **Month selection:** Supported by `month` field (1-12)
- ✅ **Year selection:** Supported by `year` field
- ✅ **Validation:** Can validate:
  - SKU exists: Check against `skus` table
  - Quantity >= 0: Validate JSONB array values
- ✅ **Draft auto-save:** Supported by `status = 'submitted'` (default) and `updated_at` timestamp
- ✅ **All form requirements:** Schema supports all data entry needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.2.3: MSQ Submission Detail (`task-0.5.3.11-msq-submission-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission detail fields:** All fields exist in `msq_submissions` table
- ✅ **Validation status:** Supported by `validation_flags` JSONB field and `status` field
- ✅ **Review actions:** Can update `status` field (flag for review, accept)
- ✅ **7-day grace period indicator:** Can calculate from `submitted_at + 7 days`
- ✅ **Correction tracking:** Supported by `correction_of` field
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.2.4: MSQ Correction Interface (`task-0.5.3.12-msq-correction-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Correction form:** Can create new submission with `correction_of` field pointing to original
- ✅ **Grace period countdown:** Can calculate from original `submitted_at + 7 days`
- ✅ **Correction tracking:** Supported by `correction_of` field (self-referential)
- ✅ **Correction workflow:** Logic can be implemented:
  - Original submission remains unchanged
  - New submission created with `correction_of = original.id`
  - Status workflow can track correction submissions
- ✅ **All correction requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 3.3: WSL Submissions

#### Task 3.3.1: WSL Submissions List (`task-0.5.3.11-wsl-submissions-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **List fields:** All fields exist in `wsl_submissions` table:
  - Week ending: `week_ending_date` field
  - Status: `status` field (submitted, late, non_compliant, accepted)
  - Submitted: `submitted_at` field
  - Verified: Can check workflow status (not explicitly in schema, but can be tracked via status or audit_logs)
- ✅ **Week filter:** Supported by `week_ending_date` field (can filter by date range)
- ✅ **Deadline indicators:** Can calculate from `week_ending_date` (deadline: Friday EOD)
- ✅ **Violation indicators:** Can query related `breaches` table filtered by `wsl_submission_id`
- ✅ **Replenishment date display:** Can extract from `submission_data` JSONB field (each SKU entry can have `replenishment_date`)
- ✅ **Violation reason display:** Can extract from `submission_data` JSONB field (each SKU entry can have `breach_reason`)
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.3.2: WSL Submission Form (`task-0.5.3.12-wsl-submission-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **All SKUs requirement:** Form requires all SKUs - this is a business rule, schema supports it via `submission_data` JSONB array
- ✅ **Stock quantity entry:** Supported by `submission_data` JSONB field:
  - Format: `[{"sku_id": "uuid", "quantity": 45000, "breach_reason": "...", "replenishment_date": "..."}, ...]`
- ✅ **Threshold display:** Can query `thresholds` table for each SKU (join via `sku_id`)
- ✅ **Threshold compliance % calculation:** Can calculate as `(stock / threshold) * 100` from submission data and thresholds
- ✅ **Conditional fields:** Supported by JSONB structure:
  - `replenishment_date`: Optional field in JSONB object (required if compliance < 80%)
  - `breach_reason`: Optional field in JSONB object (required if compliance < 80%, max 300 chars)
- ✅ **All form requirements:** Schema supports all data entry needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.3.3: WSL Submission Detail (`task-0.5.3.13-wsl-submission-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Submission detail fields:** All fields exist in `wsl_submissions` table
- ✅ **Compliance violation indicators:** Can query related `breaches` table filtered by `wsl_submission_id`
- ✅ **Stock level vs threshold comparison:** Can calculate from `submission_data` JSONB and `thresholds` table
- ✅ **Breach reason display:** Can extract from `submission_data` JSONB field
- ✅ **Replenishment date display:** Can extract from `submission_data` JSONB field
- ✅ **Threshold comparison display:** Can join with `thresholds` table
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

### Batch 3.4: Compliance Violations/Breaches

#### Task 3.4.1: Compliance Violations List (`task-0.5.3.14-compliance-violations-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Breach list fields:** All fields exist in `breaches` table:
  - Company: `company_id`
  - SKU: `sku_id`
  - Threshold: `threshold_value`
  - Stock level: `stock_level`
  - Compliance %: Can calculate as `(stock_level / threshold_value) * 100`
  - Priority: `priority` field (standard, high, critical)
  - Created: `breach_date` or `created_at`
- ✅ **Filters:** All filter requirements supported:
  - Priority: `priority` field (standard, high, critical)
  - Company: `company_id` field
  - SKU: `sku_id` field
  - Date range: `breach_date` or `created_at` field
  - Active vs resolved: `status` field
- ✅ **Enforcement action indicator:** Can query `enforcement_actions` table filtered by breach (if breach_id exists in enforcement_actions)
- ✅ **All list requirements:** Schema supports all display and filter needs

**Note:** Wireframe shows "replenishment_date" and "violation_reason" columns, but these come from the WSL submission JSONB data, not directly from breaches table. Can be joined/calculated.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.4.2: Compliance Violation Detail (`task-0.5.3.15-compliance-violation-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Breach detail fields:** All fields exist in `breaches` table
- ✅ **Stock level vs threshold comparison:** Can calculate and visualize from `stock_level` and `threshold_value` fields
- ✅ **Breach reason display:** Can extract from related `wsl_submissions.submission_data` JSONB field
- ✅ **Replenishment date:** Can extract from related `wsl_submissions.submission_data` JSONB field
- ✅ **Priority display:** Supported by `priority` field
- ✅ **Analysis status:** Can query `breach_analyses` table filtered by `breach_id`
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.4.3: Compliance Violation Analysis Interface (`task-0.5.3.16-compliance-violation-analysis-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Analysis form fields:** All fields exist in `breach_analyses` table:
  - `breach_id`, `suggested_action`, `analysis_notes`, `analyzed_by`, `analyzed_at`
- ✅ **Action suggestions dropdown:** Supported by `suggested_action` field (warning, require_replenishment_plan, require_production_plan, enhanced_monitoring, escalate)
- ✅ **Comments text area:** Supported by `analysis_notes` field
- ✅ **Batch analysis:** Can create multiple `breach_analyses` records
- ✅ **All analysis requirements:** Schema supports all form fields

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.4.4: Compliance Violation Action Approval Interface (`task-0.5.3.17-compliance-violation-action-approval-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Review interface:** Can query `breach_analyses` table for Tier 2 analysis
- ✅ **Approve/reject/independent action options:** Logic can be implemented via approval workflow (can use `approvals` table if needed, or track in enforcement_actions)
- ✅ **Justification input:** Can store in `audit_logs` table or as part of approval workflow
- ✅ **Approval workflow:** Can use existing `approvals` table pattern or track in enforcement_actions creation
- ✅ **All approval requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 3.5: VCI Analytics & Governance

#### Task 3.5.1: Governance Dashboard (`task-0.5.3.18-governance-dashboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Stock sufficiency charts:** Can aggregate from `wsl_submissions` and `thresholds` tables (calculate compliance % over time)
- ✅ **Compliance violation status:** Can query `breaches` table with status filters (active, resolved, pending action)
- ✅ **Action recommendations:** Can query `breach_analyses` table filtered by `suggested_action`
- ✅ **Pending reversions metric:** Can query `thresholds` WHERE `revert_date IS NOT NULL AND revert_date > CURRENT_DATE`
- ✅ **Submission status metrics:** Can aggregate from `aams_submissions`, `msq_submissions`, `wsl_submissions` tables
- ✅ **Company compliance ranking:** Can calculate from `compliance_scores` table
- ✅ **All dashboard data sources:** Schema supports all metrics

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.2: ATC Treemap (`task-0.5.3.22-atc-treemap.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **ATC treemap visualization:** Can aggregate compliance violations by ATC code:
  - Join `breaches` → `skus` → `products` → `atc_codes` to get ATC code
  - Aggregate violations by ATC code level
- ✅ **Date range picker:** Can filter `breaches` by `breach_date` or `created_at`
- ✅ **Stock level aggregation:** Can aggregate from `wsl_submissions.submission_data` JSONB and `thresholds` table
- ✅ **Data aggregation requirements:** All aggregations can be calculated from existing tables
- ✅ **All treemap requirements:** Schema supports all visualization needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.3: Products Treemap (`task-0.5.3.23-products-treemap.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Products treemap:** Can aggregate compliance violations by product:
  - Join `breaches` → `skus` → `products` to get product
  - Aggregate violations by product
- ✅ **Dosage/forms modal integration:** Can filter SKUs by `dosage_form` field in `skus` table
- ✅ **Stock level thresholds:** Can query `thresholds` table per product/SKU
- ✅ **Product aggregation data:** All aggregations can be calculated from existing tables
- ✅ **All treemap requirements:** Schema supports all visualization needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.4: Dosage/Forms Modal (`task-0.5.3.24-dosage-forms-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Dosage/forms breakdown:** Can aggregate by `skus.dosage_form` field (group by dosage_form + dosage_strength)
- ✅ **SKU list display:** Can filter `skus` by `dosage_form` field
- ✅ **SKU filtering and aggregation:** Supported by `dosage_form` field in `skus` table
- ✅ **All modal requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.5: SKU List Expanded (`task-0.5.3.25-sku-list-expanded.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **SKU list expanded view:** Can query `skus` table with filters (product, dosage_form, ATC code via joins)
- ✅ **Filtering requirements:** Can filter by:
  - Product: Join `skus` → `products`
  - Dosage form: `skus.dosage_form` field
  - ATC code: Join `skus` → `products` → `atc_codes`
- ✅ **Stock level display:** Can query latest `wsl_submissions.submission_data` JSONB for each SKU
- ✅ **All expanded view requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.6: SKU Action Page Integration (`task-0.5.3.27-sku-action-page-integration.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Integration with SKU detail page:** Reuses existing `/rmm/skus/[id]` route (from RMM module)
- ✅ **Query parameters:** Can pass context via query params (back, atc, product) - no schema changes needed
- ✅ **Context preservation:** Frontend-only feature, no schema requirements
- ✅ **All integration requirements:** No schema changes needed (uses existing RMM schema)

**Gaps:** None (all requirements met by existing schema)

---

#### Task 3.5.7: Submission History/Trends (Not explicitly defined in wireframes)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical data requirements:** All submission tables support historical data:
  - `aams_submissions`, `msq_submissions`, `wsl_submissions` tables store all submissions
  - Can query by date ranges for trend calculations
- ✅ **7-year retention:** Can be implemented via data retention policies (no schema changes)
- ✅ **Trend calculations:** Can calculate month-over-month, year-over-year from existing submission tables
- ✅ **Data aggregation for trends:** All aggregations can be calculated from existing tables

**Gaps:** None (all requirements met by existing schema)

---

## Summary of Gaps Identified

### Critical Gaps (Must Fix Before Phase 1)
- [ ] **users.avatar_url** - Profile avatar functionality
- [ ] **users.timezone** - User timezone preference
- [ ] **users.language** - User language preference
- [ ] **users.notification_preferences** - Notification settings (JSONB)
- [ ] **conversations.lifecycle_state** - Communication lifecycle tracking
- [ ] **follow_ups table** - Follow-up tracking for governance actions
- [ ] **meetings table** - Meeting scheduling for governance
- [ ] **meeting_attendees table** - Meeting attendee tracking

### High Priority Gaps (Should Fix in Phase 1)
- [ ] **messages.delivered_at** - Message delivery status tracking
- [ ] **compliance_scores.previous_period_score** - Previous period score for trend calculation
- [ ] **compliance_scores.score_change** - Score change from previous period (calculated or stored)

### Medium Priority Gaps (Can Fix Later)
- [ ] None identified yet

### Low Priority Gaps (Backlog)
- [ ] **idx_users_timezone** - Index on timezone (if timezone-based queries needed)

**Phase 3 Status:** ✅ **COMPLETE** - All 27 wireframes audited, no new gaps identified

---

## Phase 4: ECS Module - Gap Analysis

### Batch 4.1: ECS Overview & Export Requests

#### Task 4.1.1: ECS Overview (`task-0.5.4.0-ecs-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Overview metrics:** Can calculate from existing tables:
  - Export requests: `COUNT(*) FROM export_requests`
  - Pending: `COUNT(*) WHERE status IN ('submitted', 'auto_approval_queue', 'tier2_verification', 'tier1_review')`
  - Approved: `COUNT(*) WHERE status IN ('approved', 'authorized')`
  - Rejected: `COUNT(*) WHERE status = 'rejected'`
- ✅ **Export authorizations metrics:** Can query `export_authorizations` table:
  - Total: `COUNT(*) FROM export_authorizations`
  - Active: `COUNT(*) WHERE status = 'authorized' AND valid_until > CURRENT_DATE`
  - Expired: `COUNT(*) WHERE status = 'expired' OR valid_until < CURRENT_DATE`
  - Expiring soon: `COUNT(*) WHERE status = 'authorized' AND valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`
- ✅ **Pending requests alert:** Can query `export_requests` WHERE status IN pending states
- ✅ **Threshold status:** Can query `thresholds` table filtered by `threshold_type = 'ecs'`
- ✅ **Recent activity timeline:** Can aggregate from `audit_logs` table filtered by table_name (export_requests, export_authorizations)
- ✅ **All overview requirements:** Schema supports all metrics

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.1.2: Export Requests List (`task-0.5.4.1-export-requests-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **List fields:** All fields exist in `export_requests` table:
  - Company: `company_id`
  - SKU: `sku_id`
  - Destination: `destination_country`
  - Quantity: `quantity`
  - Status: `status` field (draft, submitted, auto_approval_queue, tier2_verification, tier1_review, approved, authorized, rejected, cancelled)
  - Created: `created_at`
  - Requested date: `requested_export_date`
- ✅ **Filters:** All filter requirements supported:
  - Status: `status` field
  - Company: `company_id` field
  - SKU: `sku_id` field
  - Destination: `destination_country` field
  - Date range: `created_at` or `requested_export_date` field
- ✅ **Status indicators:** All workflow states supported by `status` field
- ✅ **Intervention window indicator:** Can calculate from `intervention_window_end` field
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.1.3: Export Request Form (`task-0.5.4.2-export-request-form.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **SKU selection:** Supported by `sku_id` field (references `skus` table)
- ✅ **Destination country:** Supported by `destination_country` field
- ✅ **Quantity input:** Supported by `quantity` field
- ✅ **Export date selection:** Supported by `requested_export_date` field
- ✅ **Documentation upload:** Supported by `supporting_documentation` JSONB field (file references)
- ✅ **Threshold comparison display:** Can query `thresholds` table:
  - Current stock: Can query latest `wsl_submissions.submission_data` JSONB for SKU
  - VCI threshold: `thresholds` WHERE `threshold_type = 'vci'` AND `sku_id`
  - ECS threshold: `thresholds` WHERE `threshold_type = 'ecs'` AND `sku_id` (calculated after submission via XAMS)
- ✅ **Conditional validation status display:** Supported by `conditional_validation_result` JSONB field (CMC score check)
- ✅ **File upload table:** Can store file references in `supporting_documentation` JSONB field
- ✅ **All form requirements:** Schema supports all data entry needs

**Note:** ECS threshold is calculated after submission from XAMS (X-month average of MSQ data), so it will be NULL/N/A until calculated. This is correct behavior.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.1.4: Export Request Detail (`task-0.5.4.3-export-request-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Request detail fields:** All fields exist in `export_requests` table
- ✅ **Evaluation status:** Supported by `status` field with workflow states
- ✅ **Threshold comparison card:** Can query:
  - Current stock: Latest WSL submission data
  - VCI threshold: `thresholds` WHERE `threshold_type = 'vci'`
  - ECS threshold: `thresholds` WHERE `threshold_type = 'ecs'` OR calculated from XAMS
- ✅ **Three-way comparison:** All threshold values can be calculated/queried
- ✅ **Intervention window indicator:** Supported by `intervention_window_end` field (2 working days default)
- ✅ **Threshold switch indicator (if authorized):** Can query `export_authorizations.threshold_switch_date` and `threshold_revert_date` fields
- ✅ **All detail requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.1.5: Export Workflow Actions (`task-0.5.4.4-export-workflow-actions.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Workflow actions:** All actions supported by `status` field transitions:
  - Submit: `status = 'submitted'`
  - Verify (Tier 2): `status = 'tier2_verification'` → `verified_by`, `verified_at`
  - Approve (Tier 1): `status = 'approved'` → `approved_by`, `approved_at`
  - Reject: `status = 'rejected'` → `rejected_by`, `rejected_reason`
  - Intervene (if stock < ECS threshold): Logic can check threshold comparison, update status
- ✅ **Intervention window:** Supported by `intervention_window_end` field (2 working days default)
- ✅ **All workflow states and transitions:** Supported by `status` field and workflow timestamp fields
- ✅ **Action history tracking:** Can query `audit_logs` table filtered by `table_name = 'export_requests'` and `record_id`
- ✅ **All workflow requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 4.2: Export Authorizations

#### Task 4.2.1: Export Authorizations List (`task-0.5.4.5-export-authorizations-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Authorization list fields:** All fields exist in `export_authorizations` table:
  - Authorization number: `authorization_number` (UNIQUE)
  - Company: Can join via `export_request_id` to `export_requests.company_id`
  - SKU: Can join via `export_request_id` to `export_requests.sku_id`
  - Quantity: Can join via `export_request_id` to `export_requests.quantity`
  - Valid from: `valid_from` field
  - Valid until: `valid_until` field (90 calendar days)
  - Status: `status` field (authorized, completed, expired, revoked, cancelled)
- ✅ **Filters:** All filter requirements supported:
  - Active: `WHERE status = 'authorized' AND valid_until > CURRENT_DATE`
  - Expired: `WHERE status = 'expired' OR valid_until < CURRENT_DATE`
  - Validity period: Can filter by `valid_from` and `valid_until` date range
  - Company: Can join via `export_request_id` to `export_requests.company_id`
  - SKU: Can join via `export_request_id` to `export_requests.sku_id`
- ✅ **Authorization number format:** Supported by `authorization_number` field (text, UNIQUE)
- ✅ **Validity countdown:** Can calculate from `valid_until - CURRENT_DATE`
- ✅ **Expiration warnings:** Can calculate days remaining from `valid_until`
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.2.2: Export Authorization Detail (`task-0.5.4.6-export-authorization-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Authorization detail fields:** All fields exist in `export_authorizations` table
- ✅ **Validity period display:** Supported by `valid_from` and `valid_until` fields (90 calendar days)
- ✅ **90-day countdown display:** Can calculate from `valid_until - CURRENT_DATE`
- ✅ **Expiration warnings:** Can calculate from `valid_until` (30 days, 7 days, expired)
- ✅ **Threshold status:** Can query threshold information:
  - Current stock: Latest WSL submission data
  - Threshold switch date: `threshold_switch_date` field
  - Threshold revert date: `threshold_revert_date` field (3 months after authorization)
- ✅ **Threshold switch date:** Supported by `threshold_switch_date` field
- ✅ **Threshold revert date:** Supported by `threshold_revert_date` field (for temporary thresholds)
- ✅ **Completion status:** Can query `export_completions` table filtered by `export_authorization_id`
- ✅ **All detail requirements:** Schema supports all display needs

**Note:** Wireframe mentions "extension request" functionality, but there is no explicit `authorization_extensions` table in the schema. Extension functionality could be implemented by updating `valid_until` field directly, or may require a separate table if extension history tracking is needed. This is a potential gap if extension history/audit trail is required.

**Potential Gap (Minor):** If authorization extension history tracking is required (beyond just updating `valid_until`), consider adding an `authorization_extensions` table. However, if extensions are simply updates to `valid_until`, existing schema with audit_logs may be sufficient.

**Gaps:** None (assuming extension history can be tracked via audit_logs, otherwise minor gap for extension history table)

---

#### Task 4.2.3: Export Completion Reporting (`task-0.5.4.7-export-completion-reporting.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Completion form fields:** All fields exist in `export_completions` table:
  - Authorization ID: `export_authorization_id` (references `export_authorizations`)
  - Actual export date: `actual_export_date` field
  - Actual quantity: `actual_quantity` field
  - Shipping info: `shipping_details` field (text, can store structured data as JSON string or use JSONB)
- ✅ **Actual export details:** Supported by `actual_export_date` and `actual_quantity` fields (may differ from authorized)
- ✅ **Shipping information:** Supported by `shipping_details` field (can store carrier, tracking number, etc. as structured text or JSON)
- ✅ **7-day reporting window:** Can validate that `actual_export_date` is within 7 days of `reported_at` (business logic)
- ✅ **Destination confirmation:** Supported by `destination_confirmation` field
- ✅ **Report tracking:** Supported by `reported_by`, `reported_at`, `verified_by`, `verified_at` fields
- ✅ **All completion requirements:** Schema supports all functionality

**Note:** `shipping_details` is a text field, which can store structured shipping information (carrier, tracking number, method) as JSON string or structured text. If more structured storage is needed, could consider JSONB, but text field is sufficient.

**Gaps:** None (all requirements met by existing schema)

---

### Batch 4.3: Replenishment & History

#### Task 4.3.1: Replenishment Schedule Tracking (`task-0.5.4.8-replenishment-schedule-tracking.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Replenishment schedule timeline:** Can query `replenishment_schedules` table:
  - Planned replenishment date: `planned_replenishment_date` field
  - Export authorization: `export_authorization_id` (can join to get export date)
  - Authorization date: Can join via `export_authorization_id` to `export_authorizations.valid_from`
- ✅ **Delay indicators:** Supported by `delay_days` field and status field (on_time, delayed, completed, missed)
- ✅ **Escalation stages:** Supported by `escalation_stage` field (initial_alert, warning, escalation, critical)
- ✅ **Status tracking:** Supported by `status` field (pending, on_time, delayed, completed, missed)
- ✅ **Proof of replenishment:** Supported by `proof_of_replenishment` JSONB field (file references)
- ✅ **All schedule tracking requirements:** Schema supports all display needs

**Note:** Replenishment schedules are created from export authorizations. The wireframe shows timeline from authorization → export → replenishment date, which can be calculated from `export_authorizations` and `replenishment_schedules` tables.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 4.3.2: Export History (Not explicitly defined in wireframes)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical export data requirements:** All export tables support historical data:
  - `export_requests`, `export_authorizations`, `export_completions`, `replenishment_schedules` tables store all records
  - Can query by date ranges for trend calculations
- ✅ **7-year retention:** Can be implemented via data retention policies (no schema changes)
- ✅ **Historical authorization detail display:** Can query `export_authorizations` table with historical filters
- ✅ **Read-only access to historical data:** Can be enforced via RLS policies (no schema changes)
- ✅ **Historical data aggregation:** All aggregations can be calculated from existing tables

**Gaps:** None (all requirements met by existing schema)

---

## Summary of Gaps Identified

### Critical Gaps (Must Fix Before Phase 1)
- [ ] **users.avatar_url** - Profile avatar functionality
- [ ] **users.timezone** - User timezone preference
- [ ] **users.language** - User language preference
- [ ] **users.notification_preferences** - Notification settings (JSONB)
- [ ] **conversations.lifecycle_state** - Communication lifecycle tracking
- [ ] **follow_ups table** - Follow-up tracking for governance actions
- [ ] **meetings table** - Meeting scheduling for governance
- [ ] **meeting_attendees table** - Meeting attendee tracking

### High Priority Gaps (Should Fix in Phase 1)
- [ ] **messages.delivered_at** - Message delivery status tracking
- [ ] **compliance_scores.previous_period_score** - Previous period score for trend calculation
- [ ] **compliance_scores.score_change** - Score change from previous period (calculated or stored)

### Medium Priority Gaps (Can Fix Later)
- [ ] None identified yet

### Low Priority Gaps (Backlog)
- [ ] **idx_users_timezone** - Index on timezone (if timezone-based queries needed)
- [ ] **authorization_extensions table** - Optional: If authorization extension history/audit trail beyond audit_logs is required (minor gap)

**Phase 4 Status:** ✅ **COMPLETE** - All 9 wireframes audited, no critical/high priority gaps identified

**Note:** One minor potential gap identified for authorization extension history tracking (if required beyond audit_logs). However, current schema with audit_logs may be sufficient for extension tracking.

---

## Phase 5: CMC Module - Gap Analysis

### Batch 5.1: CMC Overview & Scores

#### Task 5.1.1: CMC Overview (`task-0.5.5.0-cmc-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Overview metrics:** Can calculate from existing tables:
  - Total scores: `COUNT(*) FROM compliance_scores`
  - Average score: `AVG(total_score) FROM compliance_scores WHERE score_period = CURRENT_PERIOD`
  - Score trend: Can calculate from `previous_period_score` and `score_change` fields
  - Active disputes: `COUNT(*) FROM disputes WHERE status IN ('submitted', 'tier2_reviewed', 'tier1_reviewed')`
- ✅ **Compliance overview:** Can aggregate score distribution from `compliance_scores.total_score` grouped by ranges (90-100, 80-89, 70-79, 60-69, <60)
- ✅ **Score trends:** Can query `compliance_scores` table filtered by `score_period` for month-over-month trends
- ✅ **Low scores alert:** Can query `compliance_scores` WHERE `total_score < 60`
- ✅ **Active disputes alert:** Can query `disputes` table for pending disputes
- ✅ **Recent activity timeline:** Can aggregate from `audit_logs` table for CMC-related activities
- ✅ **All overview requirements:** Schema supports all metrics

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.1.2: Compliance Scores List (`task-0.5.5.1-compliance-scores-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Score list fields:** All fields exist in `compliance_scores` table:
  - Company: `company_id` (can join to companies table)
  - Period: `score_period` (YYYY-MM format)
  - Total score: `total_score` (0-100)
  - Grade: Can calculate from `total_score` (Excellent: 90-100, Good: 80-89, Fair: 70-79, Poor: 60-69, Critical: <60)
  - Status: Can derive from `is_under_dispute`, `tier2_reviewed`, `tier1_approved` flags
  - Calculated at: `calculated_at` field
  - Trend: `score_change` field (vs previous period)
- ✅ **Filters:** All filter requirements supported:
  - Period: `score_period` field (YYYY-MM format)
  - Company: `company_id` field
  - Score range: Can filter by `total_score` ranges
  - Status: Can filter by `is_under_dispute`, `tier2_reviewed`, `tier1_approved` flags
- ✅ **Sortable columns:** All fields sortable (score, period, company)
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.1.3: Compliance Score Detail (`task-0.5.5.2-compliance-score-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Total score display:** Supported by `compliance_scores.total_score` field (numeric) and grade can be calculated
- ✅ **Component breakdown:** Supported by `compliance_score_components` table:
  - Component name: `component_name` field
  - Component score: `component_score` field
  - Component weight: `component_weight` field
  - Contribution: Can calculate (component_score × component_weight)
- ✅ **Component weights display:** Supported by `compliance_score_components.component_weight` field (stored per calculation)
- ✅ **Trend calculation:** Supported by `previous_period_score` and `score_change` fields
- ✅ **Percentile/rank band display:** Can calculate from leaderboard ranking (see leaderboard wireframe)
- ✅ **Grade classification:** Can calculate from `total_score` (Excellent: 90-100, Good: 80-89, Fair: 70-79, Poor: 60-69, Critical: <60)
- ✅ **Dispute window countdown:** Can calculate from `calculated_at + INTERVAL '30 days'`
- ✅ **History timeline:** Can query `compliance_score_adjustments` and `disputes` tables for score history
- ✅ **Adjustments tracking:** Supported by `compliance_score_adjustments` table
- ✅ **All detail requirements:** Schema supports all display needs

**Note:** Component weights are stored per calculation in `compliance_score_components.component_weight`. Master weights configuration could be in `system_config.config_data` JSONB for CMC module, which is acceptable.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.1.4: Leaderboard (`task-0.5.5.3-leaderboard.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Leaderboard ranking:** Can rank by `compliance_scores.total_score` DESC for a given period
- ✅ **Percentile calculation:** Can calculate from ranking position and total count
- ✅ **Rank bands:** Can calculate rank bands (0-25%, 25-50%, 50-75%, 75-100%) from percentile
- ✅ **Score change tracking:** Supported by `score_change` field (vs previous period)
- ✅ **Anonymization requirements:** Can be implemented via RLS policies (no schema changes)
- ✅ **Full leaderboard:** Can query all companies for MOH users
- ✅ **Previous period score:** Supported by `previous_period_score` field
- ✅ **Optional cache table:** `compliance_score_leaderboard_cache` mentioned in schema-updates-phase0-6-critical-gaps.md as optional performance optimization
- ✅ **All leaderboard requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.1.5: Score Review - Tier 2 Flag Anomalies (`task-0.5.5.4-score-review-tier2-flag-anomalies.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Flag anomalies modal fields:** Can track via audit_logs or separate anomaly tracking
- ⚠️ **Anomaly tracking storage:** No explicit field/table for anomaly tracking in compliance_scores
- ⚠️ **Anomaly flagging:** Wireframe shows Tier 2 can flag anomalies with type, description, evidence, but there's no storage for this

**Potential Gap (Medium):** Consider adding anomaly tracking fields to `compliance_scores` table or creating `score_anomalies` table if anomaly tracking beyond audit_logs is required. However, if anomalies are only logged via audit_logs, existing schema may be sufficient.

**Note:** Wireframe shows comprehensive anomaly tracking (type, component, description, evidence, priority), but schema doesn't have explicit storage. If detailed anomaly tracking/management is required, consider adding:
- `compliance_scores.anomaly_flagged` boolean flag
- `compliance_scores.anomaly_flagged_by` uuid reference
- `compliance_scores.anomaly_flagged_at` timestamptz
- OR separate `score_anomalies` table for detailed tracking

**Gaps:** Medium priority gap identified (anomaly tracking beyond audit_logs may be needed)

---

#### Task 5.1.6: Score Review - Tier 1 Override (`task-0.5.5.5-score-review-tier1-override.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Override modal fields:** All fields supported:
  - Score ID: `compliance_scores.id`
  - New score: Can be stored in `compliance_score_adjustments.adjusted_value`
  - Justification: `compliance_score_adjustments.adjustment_reason` field
  - Overridden by: `compliance_score_adjustments.adjusted_by` field
- ✅ **Justification input:** Supported by `adjustment_reason` field (required)
- ✅ **Adjustment creation:** Supported by `compliance_score_adjustments` table:
  - Adjustment type: `adjustment_type` field (correction, override)
  - Adjusted component: `adjusted_component` field (NULL for total score)
  - Original value: `original_value` field
  - Adjusted value: `adjusted_value` field
  - Adjustment reason: `adjustment_reason` field (required)
  - Adjusted by: `adjusted_by` field (Tier 1 only)
  - Adjusted at: `adjusted_at` field
- ✅ **Override flags:** Supported by `tier1_override`, `tier1_override_reason` fields in `compliance_scores` table
- ✅ **All override requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 5.2: CMC Disputes

#### Task 5.2.1: Compliance Disputes List (`task-0.5.5.6-compliance-disputes-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Dispute list fields:** All fields exist in `disputes` table:
  - Company: Can join via `compliance_score_id` to `compliance_scores.company_id`
  - Score period: Can join via `compliance_score_id` to `compliance_scores.score_period`
  - Disputed score: Can join via `compliance_score_id` to `compliance_scores.total_score`
  - Status: `status` field (submitted, tier2_reviewed, tier1_reviewed, upheld, rejected)
  - Submitted at: `submitted_at` field
  - Resolved at: `resolved_at` field
  - Dispute type: `dispute_type` field (total_score, component)
  - Disputed component: `disputed_component` field
- ✅ **Filters:** All filter requirements supported:
  - Status: `status` field (note: "pending_tier2_review" = "submitted", "pending_tier1_resolution" = "tier2_reviewed")
  - Date: `submitted_at`, `resolved_at` fields
  - Company: Can join via `compliance_score_id` to `compliance_scores.company_id`
  - Score period: Can join via `compliance_score_id` to `compliance_scores.score_period`
- ✅ **Status indicators:** All status values supported by `status` field
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.2.2: Dispute Detail (`task-0.5.5.7-dispute-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Dispute detail fields:** All fields exist in `disputes` table
- ⚠️ **Evidence display:** Wireframe shows evidence files (PDF, XLSX, PNG), but `disputes` table does NOT have `evidence` field
- ✅ **Review status:** Supported by `status`, `reviewed_by`, `reviewed_at`, `resolved_by`, `resolved_at` fields
- ✅ **Resolution display:** Supported by `resolution` field (upheld, partially_upheld, rejected)
- ⚠️ **Evidence file storage:** Missing `evidence` JSONB field in `disputes` table (similar to `enforcement_action_appeals.evidence`)

**Gap (High Priority):** `disputes` table is missing `evidence` JSONB field for storing evidence file references. Wireframes clearly show evidence upload/display functionality.

**Gaps:** High priority gap identified (missing evidence field in disputes table)

---

#### Task 5.2.3: Dispute Creation Interface (`task-0.5.5.8-dispute-creation-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Dispute form fields:** All fields exist in `disputes` table:
  - Score ID: `compliance_score_id` field
  - Disputed components: `disputed_component` field
  - Dispute reason: `dispute_reason` field
  - Dispute type: `dispute_type` field
- ✅ **30-day window indicator:** Can calculate from `compliance_scores.calculated_at + INTERVAL '30 days'`
- ✅ **Component selection:** Supported by `disputed_component` field
- ⚠️ **Evidence upload:** Missing `evidence` JSONB field in `disputes` table
- ✅ **Dispute creation workflow:** Supported by `submitted_by`, `submitted_at` fields
- ⚠️ **Evidence file handling:** Missing evidence storage

**Gap (High Priority):** `disputes` table is missing `evidence` JSONB field for storing evidence file references (similar to `enforcement_action_appeals.evidence`).

**Gaps:** High priority gap identified (missing evidence field in disputes table)

---

#### Task 5.2.4: Dispute Review Interface (`task-0.5.5.9-dispute-review-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Review interface fields:** All fields exist in `disputes` table:
  - Dispute ID: `id` field
  - Review notes: Can be stored in `resolution` field or audit_logs
  - Recommended resolution: Can be derived from workflow
  - Tier 2 review: `reviewed_by`, `reviewed_at` fields
  - Tier 1 resolution: `resolved_by`, `resolved_at`, `resolution` fields
- ✅ **Tier 2 review:** Supported by `reviewed_by`, `reviewed_at` fields (status = 'tier2_reviewed')
- ✅ **Tier 1 resolution:** Supported by `resolved_by`, `resolved_at`, `resolution` fields (status = 'tier1_reviewed', 'upheld', 'rejected')
- ✅ **Adjustment notes:** If dispute upheld, adjustments stored in `compliance_score_adjustments` table
- ✅ **Review workflow:** Supported by `status` field transitions
- ✅ **Resolution tracking:** Supported by `resolution`, `resolved_by`, `resolved_at` fields
- ✅ **All review requirements:** Schema supports all functionality

**Note:** Review notes could be stored in `resolution` field or tracked via audit_logs. If separate review notes field is needed, could add `review_notes` text field, but `resolution` field may be sufficient.

**Gaps:** None (all requirements met by existing schema, assuming review notes can be in resolution field or audit_logs)

---

### Batch 5.3: CMC Reports

#### Task 5.3.1: Reports List (`task-0.5.5.10-reports-list.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Reports list fields:** All fields exist in `regulatory_reports` table:
  - Report type: `report_type` field (monthly, quarterly, annual)
  - Period: `report_period` field
  - Status: `status` field (draft, tier2_reviewed, tier1_approved, released)
  - Generated at: `generated_at` field
  - Generated by: `generated_by` field
- ✅ **Report types:** Supported by `report_type` field
- ✅ **Status filters:** Supported by `status` field (note: wireframe mentions "pending_tier2_review" = "draft", "pending_tier1_approval" = "tier2_reviewed")
- ✅ **Download actions:** PDF download supported (file storage via report_data JSONB or file storage system)
- ✅ **Period filters:** Supported by `report_period` field (YYYY-MM format)
- ✅ **All list requirements:** Schema supports all display and filter needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.3.2: Report Detail (`task-0.5.5.11-report-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Report detail display:** All fields exist in `regulatory_reports` table
- ✅ **PDF viewer:** PDF storage can be via `report_data` JSONB (file references) or file storage system
- ✅ **Data tables:** Supported by `report_data` JSONB field (can store structured data)
- ✅ **Charts/visualizations:** Data for charts can be stored in `report_data` JSONB
- ✅ **Download action:** PDF download supported (file storage via report_data JSONB or file storage system)
- ✅ **All detail requirements:** Schema supports all display needs

**Note:** PDF files can be stored via file storage system with references in `report_data` JSONB, or file paths can be stored in `report_data` JSONB. This is acceptable.

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.3.3: Report Review/Approval Interface (`task-0.5.5.12-report-review-approval-interface.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Review checklist:** Can be tracked via application logic (data accuracy, completeness, formatting)
- ✅ **Approval actions:** Supported by `status` field (approve = 'tier1_approved', reject = workflow transition)
- ✅ **Tier 2 and Tier 1 workflows:** Supported by `reviewed_by`, `reviewed_at`, `approved_by`, `approved_at` fields
- ✅ **Review and approval tracking:** Supported by workflow fields
- ✅ **All review/approval requirements:** Schema supports all functionality

**Note:** Review checklist items are tracked via application logic (no schema changes needed). Approval notes could be stored in audit_logs or could add optional `approval_notes` field, but existing workflow fields may be sufficient.

**Gaps:** None (all requirements met by existing schema)

---

### Batch 5.4: CMC History

#### Task 5.4.1: Compliance Scores History (Not explicitly defined in wireframes)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical score display:** All scores stored in `compliance_scores` table (all past periods)
- ✅ **Trend visualization:** Can query `compliance_scores` table filtered by `company_id` and date ranges
- ✅ **Period filtering:** Can filter by `score_period` field (YYYY-MM format)
- ✅ **Historical data access requirements:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **All history requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 5.4.2: Compliance Disputes History (Not explicitly defined in wireframes)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical dispute display:** All disputes stored in `disputes` table (all past disputes)
- ✅ **Trend analysis:** Can query `disputes` table with date filters for trends over time
- ✅ **Historical data access requirements:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **All history requirements:** Schema supports all display needs

**Gaps:** None (all requirements met by existing schema)

---

## Summary of Gaps Identified

### Critical Gaps (Must Fix Before Phase 1)
- [ ] **users.avatar_url** - Profile avatar functionality
- [ ] **users.timezone** - User timezone preference
- [ ] **users.language** - User language preference
- [ ] **users.notification_preferences** - Notification settings (JSONB)
- [ ] **conversations.lifecycle_state** - Communication lifecycle tracking
- [ ] **follow_ups table** - Follow-up tracking for governance actions
- [ ] **meetings table** - Meeting scheduling for governance
- [ ] **meeting_attendees table** - Meeting attendee tracking

### High Priority Gaps (Should Fix in Phase 1)
- [ ] **messages.delivered_at** - Message delivery status tracking
- [ ] **compliance_scores.previous_period_score** - Previous period score for trend calculation (✅ Already added)
- [ ] **compliance_scores.score_change** - Score change from previous period (calculated or stored) (✅ Already added)
- [ ] **disputes.evidence** - Evidence file storage (JSONB field) - **NEW GAP IDENTIFIED**

### Medium Priority Gaps (Can Fix Later)
- [ ] **score_anomalies table OR compliance_scores.anomaly_flagged fields** - Anomaly tracking for Tier 2 flag anomalies (if detailed tracking beyond audit_logs is required)

### Low Priority Gaps (Backlog)
- [ ] **idx_users_timezone** - Index on timezone (if timezone-based queries needed)
- [ ] **authorization_extensions table** - Optional: If authorization extension history/audit trail beyond audit_logs is required (minor gap - current schema with audit_logs may be sufficient)
- [ ] **compliance_score_leaderboard_cache table** - Optional: For leaderboard performance optimization (already mentioned in schema-updates document)

**Phase 5 Status:** ✅ **COMPLETE** - All 13 wireframes audited, 1 high priority gap and 1 medium priority gap identified

**Note:** One high priority gap identified: `disputes` table is missing `evidence` JSONB field for storing evidence file references (similar to `enforcement_action_appeals.evidence`). One medium priority gap: Consider anomaly tracking fields/table if detailed anomaly management is required beyond audit_logs.

---

## Phase 6: Historical Data & Modals - Gap Analysis

### Batch 6.1: Historical Data Wireframes

#### Task 6.1.1: History Overview (`task-0.5.1.30-history-overview.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical data access patterns:** All historical data stored in existing tables (read-only access via RLS/application logic)
- ✅ **7-year retention display:** Can filter by date ranges (7-year lookback supported by querying existing tables)
- ✅ **Read-only requirements:** Enforced via RLS policies and application logic (no schema changes)
- ✅ **Historical data routing:** Routing handled at application level (no schema changes)
- ✅ **Access control:** Controlled via RLS policies (no schema changes)
- ✅ **Data aggregation:** All history items can be queried from existing tables:
  - Submissions: `aams_submissions`, `msq_submissions`, `wsl_submissions`
  - Breaches: `breaches`
  - Export requests: `export_requests`, `export_authorizations`
  - Enforcement actions: `enforcement_actions`
  - Audit logs: `audit_logs` table
- ✅ **All history overview requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.1.2: Submission History (`task-0.5.3.28-submission-history.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical submission display:** All submissions stored in `aams_submissions`, `msq_submissions`, `wsl_submissions` tables (all past periods)
- ✅ **Filters:** All filter requirements supported:
  - Type: Can filter by table (AAMS, MSQ, WSL)
  - Year: Can filter by `submission_period` or `submitted_at` date fields
  - Company: `company_id` field
  - Date range: Can filter by `submitted_at` or period fields
- ✅ **7-year retention:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **Read-only access:** Enforced via RLS policies and application logic
- ✅ **All submission history requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.1.3: Export History (`task-0.5.4.9-export-history.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical export authorization display:** All authorizations stored in `export_authorizations` table (all past periods)
- ✅ **Filters:** All filter requirements supported:
  - Status: `status` field (active, expired, completed, cancelled)
  - Company: Can join via `export_request_id` to `export_requests.company_id`
  - Date range: Can filter by `valid_from`, `valid_until`, `created_at` fields
- ✅ **7-year retention:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **Read-only access:** Enforced via RLS policies and application logic
- ✅ **All export history requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.1.4: Historical Authorization Detail (`task-0.5.4.10-historical-authorization-detail.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical authorization detail display:** All fields exist in `export_authorizations`, `export_requests`, `export_completions` tables
- ✅ **Read-only indicator:** Display-only (application logic, no schema changes)
- ✅ **Historical snapshot data:** All data stored in existing tables (can query by date)
- ✅ **Validity period display:** Supported by `valid_from`, `valid_until` fields
- ✅ **Threshold comparison (historical):** Can query threshold values at time of authorization (from `thresholds` table with date filters)
- ✅ **Completion details:** Supported by `export_completions` table
- ✅ **Workflow history:** Can query `audit_logs` table filtered by `table_name = 'export_authorizations'` and `record_id`
- ✅ **All historical authorization requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.1.5: Compliance Scores History (`task-0.5.5.13-compliance-scores-history.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical score display:** All scores stored in `compliance_scores` table (all past periods)
- ✅ **Filters:** All filter requirements supported:
  - Company: `company_id` field
  - Date range: Can filter by `score_period` or `calculated_at` fields
  - Period: Can filter by `score_period` field (YYYY-MM format)
- ✅ **Trend visualization:** Can query `compliance_scores` table with date ranges for trend calculations
- ✅ **7-year retention:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **Read-only access:** Enforced via RLS policies and application logic
- ✅ **All score history requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.1.6: Compliance Disputes History (`task-0.5.5.14-compliance-disputes-history.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Historical dispute display:** All disputes stored in `disputes` table (all past disputes)
- ✅ **Filters:** All filter requirements supported:
  - Status: `status` field (submitted, tier2_reviewed, tier1_reviewed, upheld, rejected)
  - Company: Can join via `compliance_score_id` to `compliance_scores.company_id`
  - Date range: Can filter by `submitted_at`, `resolved_at` fields
- ✅ **Trend analysis:** Can query `disputes` table with date filters for trends over time
- ✅ **7-year retention:** Can query all historical data (7-year retention via data retention policies, no schema changes)
- ✅ **Read-only access:** Enforced via RLS policies and application logic
- ✅ **All dispute history requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

### Batch 6.2: Modal Components

#### Task 6.2.1: Confirmation Modal (`task-0.5.8.1-confirmation-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Data requirements:** UI-only modal (no database requirements)
- ✅ **Entity ID passing:** Handled via application state/query params (no schema changes)
- ✅ **Action type:** Handled via application logic (no schema changes)
- ✅ **All confirmation modal requirements:** UI-only, no schema changes needed

**Gaps:** None (UI-only component)

---

#### Task 6.2.2: File Upload Modal (`task-0.5.8.2-file-upload-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **File upload functionality:** File storage handled via Supabase Storage (no database table required)
- ✅ **File references:** File references stored in JSONB fields in relevant tables (e.g., `supporting_documentation`, `evidence`, `attachments`)
- ✅ **File metadata:** File metadata (name, size, type) can be stored in JSONB fields
- ✅ **All file upload requirements:** File storage handled via Supabase Storage, references in JSONB fields

**Note:** File uploads are handled via Supabase Storage with file references stored in JSONB fields. No dedicated `file_uploads` table required (consistent with current schema design).

**Gaps:** None (file storage handled via Supabase Storage + JSONB references)

---

#### Task 6.2.3: Date Range Picker Modal (`task-0.5.8.3-date-range-picker-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Data requirements:** UI-only modal (no database requirements)
- ✅ **Date selection:** Handled via application state (no schema changes)
- ✅ **All date range picker requirements:** UI-only, no schema changes needed

**Gaps:** None (UI-only component)

---

#### Task 6.2.4: User/Company Picker Modal (`task-0.5.8.4-user-company-picker-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **User picker:** Can query `users` table (all fields exist)
- ✅ **Company picker:** Can query `companies` table (all fields exist)
- ✅ **Search/filter functionality:** Can query with search filters (name, email, etc.)
- ✅ **All picker requirements:** Schema supports all data needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.2.5: Export Options Modal (`task-0.5.8.5-export-options-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Data requirements:** UI-only modal (no database requirements)
- ✅ **Export format selection:** Handled via application logic (no schema changes)
- ✅ **All export options requirements:** UI-only, no schema changes needed

**Gaps:** None (UI-only component)

---

#### Task 6.2.6: Quick History Preview Modal (`task-0.5.8.6-quick-history-preview-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **History data:** Can query `audit_logs` table filtered by `table_name` and `record_id`
- ✅ **Recent changes timeline:** Can query `audit_logs` table with date filters and limit
- ✅ **Entity history:** All entity changes logged in `audit_logs` table
- ✅ **All quick history requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.2.7: Comparison Modal (`task-0.5.8.7-comparison-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Data requirements:** Needs two entity IDs (current and historical)
- ✅ **Entity data:** Can query entity tables for current and historical data
- ✅ **Historical data:** Can query entity tables with date filters or `audit_logs` for historical snapshots
- ✅ **Comparison logic:** Handled via application logic (no schema changes)
- ✅ **All comparison requirements:** Schema supports all data needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.2.8: Detail Inspection Modal (`task-0.5.8.8-detail-inspection-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Data requirements:** Needs entity_id (handled via application state)
- ✅ **Entity detail display:** Can query relevant entity tables based on entity type
- ✅ **All detail inspection requirements:** Schema supports all data needs

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.2.9: Message Attachment Viewer Modal (`task-0.5.8.9-message-attachment-viewer-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Attachment data:** Wireframe shows message attachments with file names, sizes, view/download actions
- ✅ **Current schema:** `message_attachments` table exists with all required fields:
  - `message_id` (references messages table)
  - `file_name`, `file_path`, `file_size`, `mime_type`
  - `uploaded_by`, `created_at`
- ✅ **File storage:** Attachments stored via Supabase Storage with paths in `file_path` field
- ✅ **Attachment metadata:** All metadata stored in `message_attachments` table
- ✅ **View/Download functionality:** Handled via file storage system (no schema changes)
- ✅ **All attachment viewer requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

#### Task 6.2.10: Workflow Status Modal (`task-0.5.8.10-workflow-status-modal.md`)
**Status:** ✅ Audited  
**Findings:**
- ✅ **Workflow state display:** Can query workflow status fields from relevant tables (`status` fields)
- ✅ **Workflow timeline:** Can query `audit_logs` table for workflow state changes
- ✅ **Status history:** All status changes logged in `audit_logs` table
- ✅ **All workflow status requirements:** Schema supports all functionality

**Gaps:** None (all requirements met by existing schema)

---

## Summary of Gaps Identified

### Critical Gaps (Must Fix Before Phase 1)
- [ ] **users.avatar_url** - Profile avatar functionality
- [ ] **users.timezone** - User timezone preference
- [ ] **users.language** - User language preference
- [ ] **users.notification_preferences** - Notification settings (JSONB)
- [ ] **conversations.lifecycle_state** - Communication lifecycle tracking
- [ ] **follow_ups table** - Follow-up tracking for governance actions
- [ ] **meetings table** - Meeting scheduling for governance
- [ ] **meeting_attendees table** - Meeting attendee tracking

### High Priority Gaps (Should Fix in Phase 1)
- [ ] **messages.delivered_at** - Message delivery status tracking
- [ ] **compliance_scores.previous_period_score** - Previous period score for trend calculation (✅ Already added)
- [ ] **compliance_scores.score_change** - Score change from previous period (calculated or stored) (✅ Already added)
- [ ] **disputes.evidence** - Evidence file storage (JSONB field) - **NEW GAP IDENTIFIED**

### Medium Priority Gaps (Can Fix Later)
- [ ] **score_anomalies table OR compliance_scores.anomaly_flagged fields** - Anomaly tracking for Tier 2 flag anomalies (if detailed tracking beyond audit_logs is required)

### Low Priority Gaps (Backlog)
- [ ] **idx_users_timezone** - Index on timezone (if timezone-based queries needed)
- [ ] **authorization_extensions table** - Optional: If authorization extension history/audit trail beyond audit_logs is required (minor gap - current schema with audit_logs may be sufficient)
- [ ] **compliance_score_leaderboard_cache table** - Optional: For leaderboard performance optimization (already mentioned in schema-updates document)

**Phase 6 Status:** ✅ **COMPLETE** - All 6 historical data wireframes + 10 modal wireframes audited, no new gaps identified

**Note:** All historical data wireframes and modal components are fully supported by existing schema. Historical data access is handled via existing tables with read-only enforcement via RLS policies. Modal components are mostly UI-only or use existing tables/queries. File uploads handled via Supabase Storage with JSONB references (no dedicated file_uploads table required).

---

**Last Updated:** 2025-01-21

