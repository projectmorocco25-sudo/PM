# Phase 1 Implementation Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Phase:** Phase 1 - Development with Mock Data (Months 2-6)  
**Status:** Ready to Begin  
**Prerequisites:** 
- Phase 0 (Technical Foundation) ✅ COMPLETE
- Phase 0.5 (UI/UX Wireframes) ⚠️ RECOMMENDED (1-2 weeks before Phase 1.1) - See [Phase 0.5: UI/UX Wireframes & Design Validation](phase-0-5-ui-ux-wireframes.md)

---

## Phase 1 Overview

Phase 1 delivers the complete MVP with mock data, organized into 4 sequential subphases:
1. **Phase 1.1:** RMM + VCI Development (Months 2-3)
2. **Phase 1.2:** ECS Development (Month 4)
3. **Phase 1.3:** CMC Development (Month 5)
4. **Phase 1.4:** Holistic MVP Testing (Month 6)

---

# PHASE 1.1: RMM + VCI DEVELOPMENT (Months 2-3)

**Duration:** 8 weeks  
**Objective:** Build core modules (Registry Management and Value Chain Intelligence) with comprehensive mock data

## Subphase 1.1.1: Foundation & Infrastructure Setup (Week 1)

### Backend Setup Tasks
- [ ] **Task 1.1.1.1:** Initialize Supabase project structure (migrations, functions, storage buckets)
- [ ] **Task 1.1.1.1a:** Define module integration contracts (data flow specs between RMM→VCI, VCI→ECS, ECS→CMC)
- [ ] **Task 1.1.1.1b:** Set up shared database schema versioning strategy (migration numbering, rollback procedures)
- [ ] **Task 1.1.1.1c:** Define API contract documentation format (OpenAPI/Swagger for RPC functions)
- [ ] **Task 1.1.1.1d:** Set up Edge Functions project structure (Deno functions directory, deployment configuration)
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals)
- [ ] **Task 1.1.1.2d:** Create database migration for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
- [ ] **Task 1.1.1.2a:** Create all indexes per schema-design.md (performance indexes for foreign keys, query patterns)
- [ ] **Task 1.1.1.2b:** Implement database constraints (check constraints, unique constraints, foreign key constraints)
- [ ] **Task 1.1.1.2c:** Create timestamp update triggers (`updated_at` auto-update for all tables)
- [ ] **Task 1.1.1.3:** Implement RLS policies for core tables (users, system_config, audit_logs, notifications)
- [ ] **Task 1.1.1.3a:** Implement RLS policies for `users` table (company users see own record, MOH see all, self-service profile updates)
- [ ] **Task 1.1.1.3b:** Implement RLS policies for `system_config` table (Tier 1 only for module activation, read-only for others)
- [ ] **Task 1.1.1.3c:** Implement RLS policies for `audit_logs` table (MOH only, companies see own company's audit logs only)
- [ ] **Task 1.1.1.3d:** Implement RLS policies for `notifications` table (users see own notifications only)
- [ ] **Task 1.1.1.3e:** Implement RLS policies for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants - company isolation, MOH system-wide access, internal MOH conversations)
- [ ] **Task 1.1.1.4:** Create shared RPC functions (shared_get_user_permissions, shared_check_module_active, shared_create_audit_log, shared_create_notification)
- [ ] **Task 1.1.1.4a:** Implement `shared_get_user_permissions` RPC function (role-based permissions, permission matrix)
- [ ] **Task 1.1.1.4b:** Implement `shared_check_module_active` RPC function (module activation check, caching strategy)
- [ ] **Task 1.1.1.4c:** Implement `shared_create_audit_log` RPC function (hash chaining, audit log creation)
- [ ] **Task 1.1.1.4d:** Implement `shared_create_notification` RPC function (notification creation, batch notifications)
- [ ] **Task 1.1.1.4e:** Create Edge Function for email notifications (read from notifications table, send emails, mark as sent)
- [ ] **Task 1.1.1.4f:** Create communication RPC functions (communications_create_conversation, communications_send_message, communications_mark_read, communications_archive_conversation, communications_create_announcement) - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) for state transitions and validation rules
- [ ] **Task 1.1.1.4g:** Implement communication RPC function - Create conversation (communications_create_conversation - validates permissions, company access, workflow entity access, CREATED → SENT state transition)
- [ ] **Task 1.1.1.4h:** Implement communication RPC function - Send message (communications_send_message - validates user is participant, creates message, notification, audit log, SENT → DELIVERED state transition)
- [ ] **Task 1.1.1.4i:** Implement communication RPC function - Mark read (communications_mark_read - creates read receipt, updates notification, audit log, DELIVERED → READ state transition)
- [ ] **Task 1.1.1.4j:** Implement communication RPC function - Archive conversation (communications_archive_conversation - soft delete, validates permissions, audit log, ACTIVE → ARCHIVED state transition)
- [ ] **Task 1.1.1.4k:** Implement communication RPC function - Create announcement (communications_create_announcement - MOH Tier 1 only, creates conversation, message, notifications for all recipients)
- [ ] **Task 1.1.1.4l:** Create Edge Function for message email notifications (read from notifications table for new messages, send emails, mark as sent)
- [ ] **Task 1.1.1.5:** Implement audit logging triggers (audit_logs table triggers)
- [ ] **Task 1.1.1.5a:** Implement audit logging trigger function (hash chaining logic, previous_hash calculation, current_hash generation)
- [ ] **Task 1.1.1.5b:** Apply audit triggers to all audited tables (companies, products, skus, submissions, etc.)
- [ ] **Task 1.1.1.5c:** Implement audit log hash verification function (verify hash chain integrity, detect tampering)
- [ ] **Task 1.1.1.6:** Set up Supabase Auth configuration (email/password, password policies)
- [ ] **Task 1.1.1.6a:** Configure Supabase Auth password policies (minimum length, complexity requirements, password reset policies)
- [ ] **Task 1.1.1.6b:** Implement session management (session timeout, concurrent session limits, session invalidation)
- [ ] **Task 1.1.1.7:** Create database migration for RMM core tables (companies, products, skus, atc_codes, critical_medicines)
- [ ] **Task 1.1.1.7a:** Verify RMM schema completeness (all columns per schema-design.md, data types, nullable rules, **including SKU pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure**)
- [ ] **Task 1.1.1.7b:** Verify SKU pharmaceutical attributes implementation (ensure dosage_strength, dosage_form, pack_size, unit_of_measure are NOT NULL, add index on dosage_form)
- [ ] **Task 1.1.1.8:** Implement RLS policies for RMM tables
- [ ] **Task 1.1.1.8a:** Implement RLS policies for `companies` table (company isolation, MOH system-wide access, two-person rule enforcement)
- [ ] **Task 1.1.1.8b:** Implement RLS policies for `products` table (company-scoped, relationship-based via company_id)
- [ ] **Task 1.1.1.8c:** Implement RLS policies for `skus` table (relationship-based via products→companies)
- [ ] **Task 1.1.1.8d:** Implement RLS policies for `atc_codes` table (MOH write, company read-only)
- [ ] **Task 1.1.1.8e:** Implement RLS policies for `critical_medicines` table (MOH Tier 1 only)
- [ ] **Task 1.1.1.9:** Create database migration for VCI core tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses)
- [ ] **Task 1.1.1.9a:** Verify VCI schema completeness (all columns per schema-design.md, relationships)
- [ ] **Task 1.1.1.10:** Implement RLS policies for VCI tables
- [ ] **Task 1.1.1.10a:** Implement RLS policies for all VCI tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses) with company isolation

### Frontend Setup Tasks
- [ ] **Task 1.1.1.11:** Initialize Next.js project structure (app router, layout structure)
- [ ] **Task 1.1.1.12:** Set up Supabase client configuration (create client utilities, environment variables)
- [ ] **Task 1.1.1.12a:** Set up TanStack Query (React Query) for server state management (per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12b:** Create API client hooks (useCompanies, useProducts, useSubmissions, etc.)
- [ ] **Task 1.1.1.12c:** Implement loading state patterns (Skeleton, Spinner, ProgressBar - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12d:** Implement error state patterns (ErrorBoundary, error alerts, retry logic - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12e:** Implement empty state patterns (no data, no results, first-time experience - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12f:** Implement success state patterns (toast notifications, success messages - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12g:** Create React Context for client-side state (auth, theme, UI preferences)
- [ ] **Task 1.1.1.12h:** Implement ErrorBoundary component (catch React errors, display user-friendly error page)
- [ ] **Task 1.1.1.12i:** Implement API error handling (network errors, validation errors, permission errors - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12j:** Implement retry logic for failed API calls
- [ ] **Task 1.1.1.12k:** Implement code splitting (dynamic imports for routes, lazy loading)
- [ ] **Task 1.1.1.12l:** Implement image optimization (Next.js Image component, lazy loading)
- [ ] **Task 1.1.1.13:** Implement authentication pages (login, register, forgot-password, reset-password)
- [ ] **Task 1.1.1.14:** Create protected route middleware (auth check, role-based access)
- [ ] **Task 1.1.1.14a:** Create useUserRole hook (per role-based-ui-patterns.md - role detection, permissions, helper functions)
- [ ] **Task 1.1.1.14b:** Create RoleGuard component (protect routes/components based on role)
- [ ] **Task 1.1.1.14c:** Create PermissionGuard component (protect actions based on permissions)
- [ ] **Task 1.1.1.14d:** Implement module activation check UI (redirect/hide modules if not active)
- [ ] **Task 1.1.1.15:** Implement base layout components (dashboard layout, navigation, header, footer)
- [ ] **Task 1.1.1.15a:** Implement Header component (logo, user menu, notifications, search - per navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15b:** Implement Sidebar component (collapsible, module grouping, active states, badges - per navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15c:** Implement DashboardLayout component (header + sidebar + main content area)
- [ ] **Task 1.1.1.15d:** Implement MainContent component (breadcrumbs, page title, action buttons area)
- [ ] **Task 1.1.1.15e:** Implement Footer component (for public pages)
- [ ] **Task 1.1.1.15f:** Implement responsive breakpoints and mobile navigation (hamburger menu for tablet)
- [ ] **Task 1.1.1.15g:** Implement responsive breakpoints (mobile, tablet, desktop - per navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15h:** Implement mobile navigation (hamburger menu, bottom navigation for mobile)
- [ ] **Task 1.1.1.16:** Create notification center component (in-app notifications UI)
- [ ] **Task 1.1.1.16a:** Implement NotificationCenter component (dropdown/popover with notifications list)
- [ ] **Task 1.1.1.16b:** Implement NotificationItem component (notification types, icons, read/unread states)
- [ ] **Task 1.1.1.16c:** Implement notification badge (unread count in header)
- [ ] **Task 1.1.1.16d:** Create useNotifications hook (fetch, mark as read, real-time updates)
- [ ] **Task 1.1.1.16e:** Implement toast notification system (success, error, warning, info - for action feedback)
- [ ] **Task 1.1.1.16f:** Create communication components (inbox, conversation detail, compose message)
- [ ] **Task 1.1.1.16g:** Implement CommunicationsInbox component (conversation list, unread indicators, filters, search, role-based access)
- [ ] **Task 1.1.1.16h:** Implement ConversationDetail component (message thread, reply interface, attachments, read receipts, workflow context)
- [ ] **Task 1.1.1.16i:** Implement ComposeMessage component (recipient selection, subject, content, attachments, workflow entity linking)
- [ ] **Task 1.1.1.16j:** Implement SentMessages component (sent conversations list, status indicators)
- [ ] **Task 1.1.1.16k:** Implement SystemAnnouncements component (MOH Tier 1 only - announcement list, creation interface, broadcast controls)
- [ ] **Task 1.1.1.16l:** Implement CommunicationWorkflowIntegration component (message button, conversation list, context display on workflow pages)
- [ ] **Task 1.1.1.16m:** Create useCommunications hook (fetch conversations, messages, mark as read, real-time updates)
- [ ] **Task 1.1.1.16n:** Implement communication real-time updates (Supabase Realtime for new messages, read receipts, conversation updates)
- [ ] **Task 1.1.1.17:** Set up Tailwind CSS and shadcn/ui component library
- [ ] **Task 1.1.1.17a:** Implement design system tokens (colors, typography, spacing, shadows - per design-system.md)
- [ ] **Task 1.1.1.17b:** Configure Tailwind with design system customizations (tailwind.config.js)
- [ ] **Task 1.1.1.17c:** Install and configure shadcn/ui base components (button, input, select, etc.)
- [ ] **Task 1.1.1.17d:** Create custom theme configuration (color palette, typography scale)
- [ ] **Task 1.1.1.17e:** Implement status color system (pending, approved, rejected, draft, etc.)
- [ ] **Task 1.1.1.17f:** Implement base UI components from ui-component-specifications.md (Button, Input, Select, Checkbox, Radio, Textarea, DatePicker)
- [ ] **Task 1.1.1.17g:** Implement form components (FormField, FormGroup, FormLabel, FormError, FormHelperText)
- [ ] **Task 1.1.1.17h:** Implement data display components (Table, Card, Badge, StatusBadge, Avatar)
- [ ] **Task 1.1.1.17i:** Implement feedback components (Alert, Toast, LoadingSpinner, Skeleton, ProgressBar)
- [ ] **Task 1.1.1.17j:** Implement navigation components (Breadcrumbs, Sidebar, SidebarItem, SidebarGroup, Header, Footer)
- [ ] **Task 1.1.1.17k:** Implement accessibility features (ARIA labels, keyboard navigation, focus management)
- [ ] **Task 1.1.1.17l:** Set up screen reader testing and WCAG 2.1 AA compliance validation
- [ ] **Task 1.1.1.17m:** Implement focus trap for modals/dialogs
- [ ] **Task 1.1.1.17n:** Implement skip navigation link
- [ ] **Task 1.1.1.17o:** Ensure color contrast meets WCAG AA standards (per design-system.md)
- [ ] **Task 1.1.1.18:** Create routing structure (public routes, auth routes, dashboard routes)
- [ ] **Task 1.1.1.18g:** Implement communication routes (/communications/inbox, /communications/inbox/[conversation_id], /communications/sent, /communications/compose, /communications/announcements, /communications/archived)
- [ ] **Task 1.1.1.18a:** Set up React Hook Form + Zod validation (per form-design-patterns.md)
- [ ] **Task 1.1.1.18b:** Create FormField wrapper component (label, error, helper text, required indicator)
- [ ] **Task 1.1.1.18c:** Create FormGroup component (field grouping, sectioned forms)
- [ ] **Task 1.1.1.18d:** Implement form validation patterns (onBlur, onChange, error display per form-design-patterns.md)
- [ ] **Task 1.1.1.18e:** Set up date-fns and date-fns-tz (timezone handling for Morocco time)
- [ ] **Task 1.1.1.18f:** Create DatePicker component (per ui-component-specifications.md)
- [ ] **Task 1.1.1.19:** Implement homepage (public landing page with MOH mission focus)
- [ ] **Task 1.1.1.20:** Create dashboard home page (role-based dashboard view)
- [ ] **Task 1.1.1.20a:** Implement role-based dashboard views (Company Dashboard, MOH Tier 1 Dashboard, Tier 2 Dashboard - per role-based-ui-patterns.md)
- [ ] **Task 1.1.1.20b:** Implement role-based navigation menu (different sidebar items per role)
- [ ] **Task 1.1.1.20c:** Add Communications link to Global section in sidebar navigation (with unread badge count)

### Integration Tasks
- [ ] **Task 1.1.1.21:** Set up CI/CD pipeline (GitHub Actions or Vercel)
- [ ] **Task 1.1.1.21a:** Set up testing infrastructure (test database, test environment configuration, CI/CD test integration)
- [ ] **Task 1.1.1.22:** Configure environment variables (dev, staging, prod)
- [ ] **Task 1.1.1.23:** Set up database seeding script structure (mock data generation framework - TypeScript/JavaScript, seed files location, execution order)

---

## Subphase 1.1.2: RMM Module - Core Registry Management (Week 2-3)

### RMM Backend Tasks
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD (rmm_create_company, rmm_update_company, rmm_get_company, rmm_list_companies)
- [ ] **Task 1.1.2.1a:** Implement RMM CRUD functions with workflow state validation (prevent invalid state transitions, error handling patterns)
- [ ] **Task 1.1.2.2:** Create RMM RPC functions - Product CRUD (rmm_create_product, rmm_update_product, rmm_get_product, rmm_list_products)
- [ ] **Task 1.1.2.3:** Create RMM RPC functions - SKU CRUD (rmm_create_sku, rmm_update_sku, rmm_get_sku, rmm_list_skus)
- [ ] **Task 1.1.2.4:** Create RMM RPC functions - ATC Code management (rmm_list_atc_codes, rmm_get_atc_code) - MOH only
- [ ] **Task 1.1.2.5:** Create RMM RPC functions - Critical Medicine management (rmm_designate_critical_medicine, rmm_list_critical_medicines) - MOH only
- [ ] **Task 1.1.2.6:** Implement registry submission workflow - Create submission (rmm_submit_registry_update)
- [ ] **Task 1.1.2.6a:** Implement state machine validation in `rmm_submit_registry_update` (status transition validation, business rule checks)
- [ ] **Task 1.1.2.7:** Implement registry submission workflow - Tier 2 verification (rmm_verify_registry_submission)
- [ ] **Task 1.1.2.8:** Implement registry submission workflow - Tier 1 approval (rmm_approve_registry_submission)
- [ ] **Task 1.1.2.9:** Implement registry submission workflow - Tier 2 implementation (rmm_implement_registry_update)
- [ ] **Task 1.1.2.10:** Implement registry submission workflow - Completion (rmm_complete_registry_update)
- [ ] **Task 1.1.2.11:** Implement registry submission workflow - Rejection (rmm_reject_registry_submission)
- [ ] **Task 1.1.2.11a:** Implement rejection with feedback workflow (Tier 1 → Tier 2 for revision, max 2 iterations before Tier 1 direct action)
- [ ] **Task 1.1.2.11b:** Implement rejection iteration tracking (max 2 iterations before Tier 1 must take direct action)
- [ ] **Task 1.1.2.12:** Implement MOH submission workflow - Peer review (rmm_peer_review_registry_submission)
- [ ] **Task 1.1.2.13:** Implement cascade deactivation logic (company deactivation → products/SKUs cascade)
- [ ] **Task 1.1.2.14:** Implement soft delete safeguards (deletion workflow, pending period, reversal logic)
- [ ] **Task 1.1.2.15:** Implement two-person rule for critical actions (company suspension/deletion, critical medicine product deactivation/deletion)
- [ ] **Task 1.1.2.15a:** Implement mandatory justification capture for all Tier 1 enforcement actions (50+ chars, evidence references, regulatory basis - immutable audit trail)
- [ ] **Task 1.1.2.15b:** Implement RBAC permission checking in RPC functions (validate user permissions before state transitions)

### RMM Frontend Tasks
- [ ] **Task 1.1.2.16:** Create RMM module layout and navigation
- [ ] **Task 1.1.2.16a:** Implement module activation banner/indicator (if module inactive)
- [ ] **Task 1.1.2.17:** Implement Companies list page (table view, filters, search, pagination)
- [ ] **Task 1.1.2.17a:** Implement DataTable component (sorting, filtering, pagination, row selection - per ui-component-specifications.md)
- [ ] **Task 1.1.2.17b:** Implement SearchBar component (search input with filters dropdown)
- [ ] **Task 1.1.2.17c:** Implement responsive table (horizontal scroll, card view on mobile)
- [ ] **Task 1.1.2.17d:** Implement virtual scrolling for large tables (if >100 rows)
- [ ] **Task 1.1.2.18:** Implement Company detail page (company information display)
- [ ] **Task 1.1.2.18a:** Implement DetailPage layout (sections, tabs, action buttons)
- [ ] **Task 1.1.2.19:** Implement Company create/edit forms (form validation, submission workflow)
- [ ] **Task 1.1.2.19a:** Implement draft auto-save functionality (per form-design-patterns.md)
- [ ] **Task 1.1.2.19b:** Implement form sections (company information, contact information - per form-design-patterns.md)
- [ ] **Task 1.1.2.19c:** Implement form error display (field-level and form-level errors - per form-design-patterns.md)
- [ ] **Task 1.1.2.20:** Implement Products list page (company-scoped, filters, search)
- [ ] **Task 1.1.2.21:** Implement Product detail page (product information, SKUs list)
- [ ] **Task 1.1.2.22:** Implement Product create/edit forms (form validation, submission workflow)
- [ ] **Task 1.1.2.23:** Implement SKUs list page (product-scoped, filters, search)
- [ ] **Task 1.1.2.24:** Implement SKU detail page (SKU information)
- [ ] **Task 1.1.2.25:** Implement SKU create/edit forms (form validation, submission workflow, **include pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure**)
- [ ] **Task 1.1.2.25a:** Implement SKU pharmaceutical attributes input fields (dosage_strength input, dosage_form dropdown with standard forms, pack_size input, unit_of_measure dropdown with standard units)
- [ ] **Task 1.1.2.26:** Implement Registry submission list page (my submissions, pending approvals - role-based)
- [ ] **Task 1.1.2.27:** Implement Registry submission detail page (submission data, workflow status, approval history)
- [ ] **Task 1.1.2.27a:** Implement WorkflowStatusIndicator component (status badges, progress indicators)
- [ ] **Task 1.1.2.27b:** Implement ApprovalHistory component (timeline view of approvals - per ui-component-specifications.md)
- [ ] **Task 1.1.2.28:** Implement Registry submission workflow actions (submit, verify, approve, implement, reject buttons)
- [ ] **Task 1.1.2.28a:** Implement role-based action buttons (show/hide actions based on role/permissions)
- [ ] **Task 1.1.2.28b:** Implement WorkflowActionButtons component (conditional buttons based on status/role)
- [ ] **Task 1.1.2.29:** Implement ATC Codes list page (MOH only, read-only for companies)
- [ ] **Task 1.1.2.30:** Implement Critical Medicines list page (MOH only, designation interface)

---

## Subphase 1.1.3: VCI Module - AAMS Workflow (Week 4)

### VCI AAMS Backend Tasks
- [ ] **Task 1.1.3.1:** Create VCI RPC function - AAMS submission (vci_submit_aams)
- [ ] **Task 1.1.3.2:** Create VCI RPC function - AAMS verification (vci_verify_aams) - includes threshold calculation (B × AAMS)
- [ ] **Task 1.1.3.3:** Create VCI RPC function - AAMS approval (vci_approve_aams_threshold)
- [ ] **Task 1.1.3.4:** Create VCI RPC function - AAMS completion (vci_complete_aams_submission)
- [ ] **Task 1.1.3.5:** Create VCI RPC function - AAMS rejection (vci_reject_aams_submission)
- [ ] **Task 1.1.3.6:** Implement threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines, default B = C = 3 for standard, B_critical = C_critical = 3.5 for critical medicines)
- [ ] **Task 1.1.3.7:** Implement threshold modification logic (local per-SKU, global system-wide, non-retroactive)
- [ ] **Task 1.1.3.7a:** Implement advisory suggestions when configuring B/C multipliers (suggest matching values when one is configured)
- [ ] **Task 1.1.3.8:** Implement AAMS deadline validation (January 31 deadline, 15-day grace period until February 15, late submission handling)
- [ ] **Task 1.1.3.8a:** Implement AAMS grace period compliance logic (marked late but no compliance violation until after Feb 15, compliance impact after grace period)
- [ ] **Task 1.1.3.9:** Implement previous year AAMS fallback logic (if no submission by March 1)
- [ ] **Task 1.1.3.10:** Create scheduled trigger for AAMS deadline check (February 16)
- [ ] **Task 1.1.3.10a:** Implement pg_cron setup for AAMS deadline check (scheduled job configuration, timezone handling for Morocco)

### VCI AAMS Frontend Tasks
- [ ] **Task 1.1.3.11:** Create VCI module layout and navigation
- [ ] **Task 1.1.3.12:** Implement AAMS submissions list page (my submissions, all submissions for MOH)
- [ ] **Task 1.1.3.13:** Implement AAMS submission create/edit form (year selection, **SKU selector + quantity input only** - simplified submission structure)
- [ ] **Task 1.1.3.13a:** Implement SKU selector component (dropdown/autocomplete with full SKU description: name, dosage, form, pack size)
- [ ] **Task 1.1.3.13b:** Implement quantity input with unit display (show unit_of_measure from selected SKU, e.g., "Quantity (tablets)")
- [ ] **Task 1.1.3.13c:** Implement SKU data entry table (add/remove SKU rows, SKU_ID + Quantity only - per phase-0-schema-correction)
- [ ] **Task 1.1.3.13d:** Implement deadline indicators (AAMS deadlines with countdown)
- [ ] **Task 1.1.3.14:** Implement AAMS submission detail page (submission data, calculated threshold display, workflow status)
- [ ] **Task 1.1.3.14a:** Implement ThresholdDisplay component (calculated threshold visualization, visible to companies after Tier 2 verification but before Tier 1 approval)
- [ ] **Task 1.1.3.15:** Implement AAMS workflow actions (submit, verify, approve, reject buttons - role-based)
- [ ] **Task 1.1.3.16:** Implement Threshold management page (MOH Tier 1 - list thresholds, modify thresholds)
- [ ] **Task 1.1.3.16a:** Implement ThresholdTable component (list thresholds with filters, bulk actions)
- [ ] **Task 1.1.3.17:** Implement Threshold modification form (local vs global, B multiplier adjustment)
- [ ] **Task 1.1.3.17a:** Implement ThresholdModificationModal component (local vs global selector, B multiplier input with advisory suggestions)

---

## Subphase 1.1.4: VCI Module - MSQ Workflow (Week 5)

### VCI MSQ Backend Tasks
- [ ] **Task 1.1.4.1:** Create VCI RPC function - MSQ submission (vci_submit_msq)
- [ ] **Task 1.1.4.2:** Implement MSQ validation logic (completeness checks, format validation, historical pattern comparison)
- [ ] **Task 1.1.4.3:** Implement MSQ vs AAMS validation (20% threshold comparison, anomaly detection - note: AAMS and MSQ are independent, validation is for anomaly detection only, not for calculating AAMS)
- [ ] **Task 1.1.4.4:** Create VCI RPC function - MSQ flag for review (vci_flag_msq_for_review)
- [ ] **Task 1.1.4.5:** Create VCI RPC function - MSQ accept (vci_accept_msq)
- [ ] **Task 1.1.4.6:** Create VCI RPC function - MSQ reject (vci_reject_msq)
- [ ] **Task 1.1.4.7:** Implement 7-day grace period for MSQ corrections

### VCI MSQ Frontend Tasks
- [ ] **Task 1.1.4.8:** Implement MSQ submissions list page (my submissions, flagged for review for MOH)
- [ ] **Task 1.1.4.9:** Implement MSQ submission form (month selection, **SKU_ID + Quantity data entry only** - simplified submission structure)
- [ ] **Task 1.1.4.9a:** Implement SKUDataEntryTable component (SKU selector + quantity input per row, display full SKU description - per phase-0-schema-correction)
- [ ] **Task 1.1.4.9b:** Implement BulkUpload component (CSV template: SKU_ID,Quantity - file upload, parsing, validation preview with SKU details display)
- [ ] **Task 1.1.4.10:** Implement MSQ submission detail page (submission data, validation status, review actions)
- [ ] **Task 1.1.4.10a:** Implement ValidationStatusIndicator component (passed, flagged, rejected states)
- [ ] **Task 1.1.4.11:** Implement MSQ correction interface (7-day grace period, edit submitted data)
- [ ] **Task 1.1.4.11a:** Implement CorrectionInterface component (editable submitted data with grace period indicator)

---

## Subphase 1.1.5: VCI Module - WSL Workflow & Breach Detection (Week 6)

### VCI WSL Backend Tasks
- [ ] **Task 1.1.5.1:** Create VCI RPC function - WSL submission (vci_submit_wsl)
- [ ] **Task 1.1.5.2:** Implement WSL validation logic (all SKUs required, completeness check)
- [ ] **Task 1.1.5.3:** Implement WSL deadline validation (Friday EOD deadline 17:00 Morocco time, submission window Monday-Friday 17:00, late submission handling)
- [ ] **Task 1.1.5.3a:** Implement MOH request for WSL SKU adjustments (MOH requests adjustments → company submits separately)
- [ ] **Task 1.1.5.4:** Implement breach detection logic (stock level vs threshold comparison)
- [ ] **Task 1.1.5.5:** Create VCI RPC function - Breach creation (automatic on WSL submission)
- [ ] **Task 1.1.5.5a:** Implement automatic breach creation logic (trigger on WSL submission, threshold comparison logic)
- [ ] **Task 1.1.5.6:** Implement breach reason and replenishment date capture
- [ ] **Task 1.1.5.7:** Implement breach priority logic (critical medicine breaches, multiple SKUs, extended breaches)
- [ ] **Task 1.1.5.8:** Create VCI RPC function - Breach analysis (vci_analyze_breach)
- [ ] **Task 1.1.5.8a:** Implement batch breach analysis capability (Tier 2 can analyze multiple breaches together, suggest batch actions)
- [ ] **Task 1.1.5.9:** Create VCI RPC function - Breach action suggestion (vci_suggest_breach_action)
- [ ] **Task 1.1.5.10:** Create VCI RPC function - Breach action approval (vci_approve_breach_action)
- [ ] **Task 1.1.5.10a:** Implement rejection iteration limit logic (max 2 rejection iterations before Tier 1 must take direct action)
- [ ] **Task 1.1.5.11:** Implement breach analysis deadline logic (3 working days standard, 1 working day critical)
- [ ] **Task 1.1.5.12:** Create scheduled trigger for WSL deadline check (Friday 5 PM Morocco time)
- [ ] **Task 1.1.5.12a:** Implement pg_cron setup for WSL deadline check (Friday 5 PM Morocco time, cron expression)

### Historical Data Backend Tasks
- [ ] **Task 1.1.5.12b:** Create database indexes for historical queries (audit_logs: created_at, user_id+created_at, table_name+created_at; aams_submissions: company_id+year; msq_submissions: company_id+year+month; wsl_submissions: company_id+week_ending; compliance_scores: company_id+score_month; breaches: company_id+status+detected_at)
- [ ] **Task 1.1.5.12c:** Create RPC function - has_historical_ecs_data (check if historical ECS data exists for company or system-wide)
- [ ] **Task 1.1.5.12d:** Create RPC function - has_historical_cmc_data (check if historical CMC data exists for company or system-wide)
- [ ] **Task 1.1.5.12e:** Create RPC function - vci_get_historical_submissions (get historical AAMS/MSQ/WSL submissions with filtering and pagination, RLS applied)
- [ ] **Task 1.1.5.12f:** Create RPC function - cmc_get_historical_scores (get historical compliance scores with filtering and pagination, RLS applied)
- [ ] **Task 1.1.5.12g:** Create RPC function - audit_get_historical_logs (get historical audit logs with filtering and pagination, MOH/Auditors only, role check)
- [ ] **Task 1.1.5.12h:** Create RPC function - log_historical_data_access (log access to historical data for audit trail, called automatically by historical data RPC functions)

### VCI WSL Frontend Tasks
- [ ] **Task 1.1.5.13:** Implement WSL submissions list page (my submissions, all submissions for MOH)
- [ ] **Task 1.1.5.14:** Implement WSL submission form (week ending date, **all SKUs with stock quantity entry** - SKU_ID + Quantity structure)
- [ ] **Task 1.1.5.14a:** Implement WSLBulkEntryTable component (pre-populated with all company SKUs showing full description, quantity input only, optional breach reason/replenishment date fields)
- [ ] **Task 1.1.5.15:** Implement WSL submission detail page (submission data, breach indicators)
- [ ] **Task 1.1.5.16:** Implement Breaches list page (active breaches, resolved breaches, filters by priority/company/SKU)
- [ ] **Task 1.1.5.16a:** Implement BreachFilters component (priority, company, SKU, date range filters)
- [ ] **Task 1.1.5.17:** Implement Breach detail page (breach information, stock level vs threshold, reason, replenishment date)
- [ ] **Task 1.1.5.17a:** Implement BreachDetailCard component (threshold comparison, stock level visualization)
- [ ] **Task 1.1.5.18:** Implement Breach analysis interface (Tier 2 - analysis form, action suggestions)
- [ ] **Task 1.1.5.18a:** Implement BreachAnalysisForm component (action suggestions dropdown, comments)
- [ ] **Task 1.1.5.18b:** Implement BatchBreachAnalysis interface (select multiple breaches, batch actions)
- [ ] **Task 1.1.5.19:** Implement Breach action approval interface (Tier 1 - review suggestions, approve/reject/independent action)
- [ ] **Task 1.1.5.20:** Implement Governance Dashboard (MOH - real-time stock sufficiency, breach status, action recommendations)
- [ ] **Task 1.1.5.20a:** Set up charting library (Recharts or similar - for governance dashboard)
- [ ] **Task 1.1.5.20b:** Implement DashboardWidget component (reusable widget for metrics/charts)
- [ ] **Task 1.1.5.20c:** Implement responsive dashboard layout (widget stacking on tablet/mobile)
- [ ] **Task 1.1.5.20d:** Implement dashboard data prefetching and caching strategy
- [ ] **Task 1.1.5.20e:** Implement stock sufficiency charts (line charts, bar charts)

---

## Subphase 1.1.5.5: Historical Data Frontend Tasks

### Historical Data Component Implementation
- [ ] **Task 1.1.5.21:** Implement Timeline component (vertical timeline, date/user/action display, expandable details, filter by date range)
- [ ] **Task 1.1.5.22:** Implement DateRangePicker component (start/end date selection, quick filters: Last 7 days, 30 days, 3 months, year, 7 years, custom range, Morocco timezone support)
- [ ] **Task 1.1.5.23:** Implement ExportButton component (dropdown with PDF/Excel/CSV options, progress indicator, export metadata tracking)
- [ ] **Task 1.1.5.24:** Implement virtual scrolling component for large lists (using @tanstack/react-virtual, for audit logs)

### History Tabs on Detail Pages
- [ ] **Task 1.1.5.25:** Implement History tab on Company detail page (registry changes timeline, submission history, compliance history, lazy loading)
- [ ] **Task 1.1.5.26:** Implement History tab on Product detail page (product changes timeline, SKU history)
- [ ] **Task 1.1.5.27:** Implement History tab on SKU detail page (SKU changes timeline)
- [ ] **Task 1.1.5.28:** Implement History tab on AAMS submission detail page (corrections history, status changes)
- [ ] **Task 1.1.5.29:** Implement History tab on MSQ submission detail page (corrections history, status changes)
- [ ] **Task 1.1.5.30:** Implement History tab on WSL submission detail page (submission history)
- [ ] **Task 1.1.5.31:** Implement History tab on Breach detail page (resolution timeline, actions taken)
- [ ] **Task 1.1.5.32:** Implement History tab on Compliance Score detail page (score trends, component breakdown over time)

### Filtered List Views
- [ ] **Task 1.1.5.33:** Add year filter to AAMS submissions list page (query parameter ?year=2023, quick filter chips, default to current year)
- [ ] **Task 1.1.5.34:** Add year/month filters to MSQ submissions list page (query parameters ?year=2023&month=6, quick filter chips)
- [ ] **Task 1.1.5.35:** Add week filter to WSL submissions list page (query parameter ?week=2023-W01, quick filter chips)
- [ ] **Task 1.1.5.36:** Add status/year filters to Breaches list page (query parameters ?status=resolved&year=2023, filter tabs)
- [ ] **Task 1.1.5.37:** Add year filter to Compliance Scores list page (query parameter ?year=2023, quick filter chips)

### Dedicated History Routes
- [ ] **Task 1.1.5.38:** Implement `/history` route (role-based historical overview page, company users: personal, MOH: system-wide)
- [ ] **Task 1.1.5.39:** Implement `/audit/logs` route (audit log list page, MOH/Auditors only, virtual scrolling, search, date range filter)
- [ ] **Task 1.1.5.40:** Implement `/audit/logs/[id]` route (audit log detail page)
- [ ] **Task 1.1.5.41:** Implement `/audit/reports` route (audit reports page, MOH/Auditors only)
- [ ] **Task 1.1.5.42:** Implement `/vci/submissions/history` route (all past submissions, filterable by type, year, company)
- [ ] **Task 1.1.5.43:** Implement `/vci/submissions/history/trends` route (trend analysis charts, MOH Tier 1 only, AAMS/MSQ/WSL trends, multi-year comparisons)

### Modal Patterns for Historical Data
- [ ] **Task 1.1.5.44:** Implement Quick History Preview modal (recent 5-10 changes, timeline view, "View Full History" button)
- [ ] **Task 1.1.5.45:** Implement Comparison modal (current vs historical side-by-side, highlight differences)
- [ ] **Task 1.1.5.46:** Implement Export Options modal (format selection, date range picker, progress indicator)
- [ ] **Task 1.1.5.47:** Implement Detail Inspection modal (quick detail view from list, "View Full Page" button)

### Module Activation Impact
- [ ] **Task 1.1.5.48:** Implement inactive module indicators (informational banners, read-only badges, module activation period display)
- [ ] **Task 1.1.5.49:** Implement data existence checks for ECS/CMC routes (has_historical_ecs_data, has_historical_cmc_data RPC calls)
- [ ] **Task 1.1.5.50:** Update navigation to show ECS/CMC if active OR historical data exists (with "Historical" badge if inactive)
- [ ] **Task 1.1.5.51:** Implement route protection pattern for historical data (check data existence, not module status)

### Navigation Updates
- [ ] **Task 1.1.5.52:** Add History link to sidebar navigation (all roles, links to `/history`)
- [ ] **Task 1.1.5.53:** Add Audit link to sidebar navigation (MOH Tier 1/2, links to `/audit/logs`)
- [ ] **Task 1.1.5.54:** Add Submissions History link to VCI section (links to `/vci/submissions/history`)
- [ ] **Task 1.1.5.55:** Add Trends link to VCI section (Tier 1 only, links to `/vci/submissions/history/trends`)
- [ ] **Task 1.1.5.56:** Update breadcrumbs for historical routes (Home > History, Home > Audit > Logs, etc.)

### Trend Analysis Components (MOH Tier 1)
- [ ] **Task 1.1.5.57:** Implement AAMS trend analysis component (year-over-year comparison, seasonal patterns, line/bar charts)
- [ ] **Task 1.1.5.58:** Implement MSQ trend analysis component (monthly patterns, growth trends, anomaly detection)
- [ ] **Task 1.1.5.59:** Implement WSL trend analysis component (stock level patterns, stockout identification)
- [ ] **Task 1.1.5.60:** Implement cross-metric analysis component (AAMS vs MSQ vs WSL correlations)

---

## Subphase 1.1.6: Mock Data Generation & Population (Week 7)

### Mock Data Tasks
- [ ] **Task 1.1.6.1:** Create mock data generation script - Companies (75 companies: 15 IPCs + 60 Wholesalers, diverse profiles)
- [ ] **Task 1.1.6.2:** Create mock data generation script - Products (2-5 products per company, varied types)
- [ ] **Task 1.1.6.3:** Create mock data generation script - SKUs (3-10 SKUs per product, varied codes, **include pharmaceutical attributes: realistic dosage_strength, dosage_form, pack_size, unit_of_measure**)
- [ ] **Task 1.1.6.3a:** Generate realistic SKU pharmaceutical data (dosage_strength: "500mg", "10mg/ml", etc.; dosage_form: "Tablet", "Capsule", "Syrup", etc.; pack_size: "30 tablets", "100ml", etc.; unit_of_measure: "tablets", "ml", etc.)
- [ ] **Task 1.1.6.4:** Create mock data generation script - ATC Codes (comprehensive ATC code list)
- [ ] **Task 1.1.6.5:** Create mock data generation script - Critical Medicines (designate subset of SKUs as critical)
- [ ] **Task 1.1.6.6:** Create mock data generation script - AAMS (2-3 years historical AAMS data per company, **submission_data as array of {sku_id, quantity} objects**)
- [ ] **Task 1.1.6.7:** Create mock data generation script - MSQ (2-3 years historical monthly MSQ data, **submission_data as array of {sku_id, quantity} objects**)
- [ ] **Task 1.1.6.8:** Create mock data generation script - WSL (2-3 years historical weekly WSL data, **submission_data as array of {sku_id, quantity, breach_reason?, replenishment_date?} objects**, include breach scenarios)
- [ ] **Task 1.1.6.9:** Create mock data generation script - Thresholds (calculated thresholds for all SKUs)
- [ ] **Task 1.1.6.10:** Create mock data generation script - Users (company users for each company, MOH users)
- [ ] **Task 1.1.6.11:** Create mock data generation script - Registry submissions (historical submission workflows)
- [ ] **Task 1.1.6.12:** Create mock data generation script - Breaches (historical breach records with analyses)
- [ ] **Task 1.1.6.13:** Execute mock data population scripts (validate data integrity)
- [ ] **Task 1.1.6.14:** Verify mock data completeness and relationships
- [ ] **Task 1.1.6.15:** Create database seed data validation script (foreign key integrity, constraint validation, data quality checks)
- [ ] **Task 1.1.6.16:** Performance test seed data scripts (execution time, memory usage, transaction size limits)

---

## Subphase 1.1.7: Integration Testing & Documentation (Week 8)

### Testing Tasks
- [ ] **Task 1.1.7.1:** Create RMM module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.1a:** Create RPC function unit test framework (test database setup, transaction isolation, mock data helpers)
- [ ] **Task 1.1.7.2:** Create VCI module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.2a:** Set up frontend testing framework (Jest configuration, React Testing Library setup, Playwright configuration, test utilities)
- [ ] **Task 1.1.7.2b:** Create component unit tests (test base components, form components)
- [ ] **Task 1.1.7.2c:** Create integration tests for forms (form submission, validation)
- [ ] **Task 1.1.7.2d:** Create E2E tests for critical user flows (login, submission, approval workflows)
- [ ] **Task 1.1.7.2e:** Create accessibility tests (keyboard navigation, screen reader)
- [ ] **Task 1.1.7.2f:** Create visual regression testing setup (screenshot comparison, component visual tests)
- [ ] **Task 1.1.7.3:** Create integration tests - RMM workflows (end-to-end submission → approval → implementation)
- [ ] **Task 1.1.7.3a:** Create integration test data fixtures (realistic test scenarios, edge case data, workflow test data)
- [ ] **Task 1.1.7.4:** Create integration tests - VCI AAMS workflow (submission → verification → approval)
- [ ] **Task 1.1.7.5:** Create integration tests - VCI MSQ workflow (submission → validation → acceptance)
- [ ] **Task 1.1.7.6:** Create integration tests - VCI WSL workflow (submission → breach detection → analysis)
- [ ] **Task 1.1.7.7:** Create integration tests - Cross-module (RMM registry → VCI submissions)
- [ ] **Task 1.1.7.7a:** Create integration test framework setup (test database, test data isolation, parallel test execution)
- [ ] **Task 1.1.7.8:** Perform role-based access testing (company users, MOH users, permissions)
- [ ] **Task 1.1.7.9:** Perform RLS policy testing (data isolation, module activation checks)
- [ ] **Task 1.1.7.9a:** Create RLS policy test suite (test company data isolation, test MOH access, test module activation blocking)
- [ ] **Task 1.1.7.10:** Perform audit logging verification (all actions logged correctly)
- [ ] **Task 1.1.7.10a:** Create audit log verification test suite (hash chain integrity, completeness, tampering detection)

### Documentation Tasks
- [ ] **Task 1.1.7.11:** Create RMM module user documentation (company user guide, MOH user guide)
- [ ] **Task 1.1.7.12:** Create VCI module user documentation (AAMS, MSQ, WSL submission guides)
- [ ] **Task 1.1.7.13:** Create API documentation (RPC function documentation, request/response schemas)
- [ ] **Task 1.1.7.14:** Create developer documentation (setup guide, architecture overview)

### Phase 1.1 Sign-off
- [ ] **Task 1.1.7.15:** Phase 1.1 internal review and testing
- [ ] **Task 1.1.7.16:** Phase 1.1 sign-off and approval to proceed to Phase 1.2

---

# PHASE 1.2: ECS DEVELOPMENT (Month 4 - Weeks 9-12)

**Duration:** 4 weeks  
**Objective:** Build Export Control System module and integrate with RMM + VCI

## Subphase 1.2.1: ECS Backend Foundation (Week 9)

### ECS Backend Setup Tasks
- [ ] **Task 1.2.1.1:** Create database migration for ECS tables (export_requests, export_authorizations, replenishment_schedules)
- [ ] **Task 1.2.1.1a:** Verify ECS schema completeness (all columns, foreign key relationships to RMM/VCI)
- [ ] **Task 1.2.1.1b:** Define ECS integration points with RMM+VCI (threshold switching contract, data dependencies)
- [ ] **Task 1.2.1.2:** Implement RLS policies for ECS tables (module activation check, company isolation)
- [ ] **Task 1.2.1.2a:** Implement detailed RLS policies for ECS tables (export_requests, export_authorizations, replenishment_schedules) with module activation checks
- [ ] **Task 1.2.1.3:** Create ECS RPC function - Export request submission (ecs_submit_export_request)
- [ ] **Task 1.2.1.4:** Create ECS RPC function - Export request modification (ecs_modify_export_request)
- [ ] **Task 1.2.1.5:** Create ECS RPC function - Export request cancellation (ecs_cancel_export_request)
- [ ] **Task 1.2.1.6:** Implement XAMS calculation logic (X months average, default X=6, configurable 3-12 months, minimum 3 months required, adapt calculation if less than configured X)
- [ ] **Task 1.2.1.6a:** Implement XAMS seasonal-aware validation (when X=12, compare to AAMS/12 only when periods align in December, otherwise use trend analysis)
- [ ] **Task 1.2.1.7:** Implement ECS Threshold calculation logic (C × XAMS, default C=3 standard, 3.5 critical, default B = C = 3 for standard, B_critical = C_critical = 3.5 for critical medicines)
- [ ] **Task 1.2.1.8:** Implement conditional validation logic (CMC score-based if CMC active, risk factor assessment)
- [ ] **Task 1.2.1.9:** Create ECS RPC function - Export request evaluation (ecs_evaluate_export_request)

---

## Subphase 1.2.2: ECS Workflow & Threshold Switching (Week 10)

### ECS Workflow Backend Tasks
- [ ] **Task 1.2.2.1:** Create ECS RPC function - Export request auto-approval queue (ecs_queue_auto_approval)
- [ ] **Task 1.2.2.2:** Create ECS RPC function - Export request Tier 2 verification (ecs_verify_export_request)
- [ ] **Task 1.2.2.3:** Create ECS RPC function - Export request manual review (ecs_manual_review_export_request)
- [ ] **Task 1.2.2.4:** Create ECS RPC function - Export request approval (ecs_approve_export_request)
- [ ] **Task 1.2.2.5:** Create ECS RPC function - Export request rejection (ecs_reject_export_request)
- [ ] **Task 1.2.2.6:** Create ECS RPC function - Export authorization (ecs_authorize_export)
- [ ] **Task 1.2.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization)
- [ ] **Task 1.2.2.7a:** Implement threshold switching coordination (VCI→ECS threshold update, 3-month reversion tracking)
- [ ] **Task 1.2.2.8:** Create scheduled trigger for threshold reversion (3 months after authorization)
- [ ] **Task 1.2.2.8a:** Implement pg_cron setup for threshold reversion (3-month tracking, daily check job)
- [ ] **Task 1.2.2.9:** Implement intervention window logic (default 2 working days, configurable 1-5 days)
- [ ] **Task 1.2.2.9a:** Implement post-approval intervention logic (Tier 1 can intervene within 24 hours after auto-approval with stronger justification)
- [ ] **Task 1.2.2.10:** Create ECS RPC function - Export authorization expiration check (ecs_check_expiration) - 90 calendar days validity from authorization date
- [ ] **Task 1.2.2.10a:** Implement export authorization expiration reminders (automated reminders at 30, 15, and 7 days before expiration - email + in-app)
- [ ] **Task 1.2.2.10b:** Implement Edge Function for export expiration reminders (30, 15, 7 days before expiration)
- [ ] **Task 1.2.2.11:** Create scheduled trigger for export expiration checks (daily)
- [ ] **Task 1.2.2.11a:** Implement pg_cron setup for export expiration checks (daily job, timezone handling)
- [ ] **Task 1.2.2.12:** Create ECS RPC function - Export authorization extension (ecs_request_extension) - up to 30 additional days, subject to Tier 1 approval

---

## Subphase 1.2.3: ECS Post-Authorization & Replenishment (Week 11)

### ECS Post-Authorization Backend Tasks
- [ ] **Task 1.2.3.1:** Create ECS RPC function - Export completion report (ecs_report_export_completion)
- [ ] **Task 1.2.3.2:** Create ECS RPC function - Export cancellation/modification request (ecs_request_export_change)
- [ ] **Task 1.2.3.3:** Implement replenishment schedule tracking logic
- [ ] **Task 1.2.3.4:** Create ECS RPC function - Replenishment delay escalation (ecs_escalate_delay)
- [ ] **Task 1.2.3.5:** Create scheduled trigger for replenishment delay escalation (daily check)
- [ ] **Task 1.2.3.5a:** Implement pg_cron setup for replenishment delay escalation (daily check, escalation logic)
- [ ] **Task 1.2.3.11b:** Implement file upload security (file type validation, virus scanning, storage bucket RLS policies)
- [ ] **Task 1.2.3.6:** Implement tiered escalation process (day 1 alerts, days 2-7 warnings, days 8-14 escalation, 15+ critical)
- [ ] **Task 1.2.3.7:** Create ECS RPC function - Replenishment proof submission (ecs_submit_replenishment_proof)
- [ ] **Task 1.2.3.8:** Create ECS RPC function - Replenishment verification (ecs_verify_replenishment)

### ECS Frontend Tasks
- [ ] **Task 1.2.3.9:** Create ECS module layout and navigation (module activation check)
- [ ] **Task 1.2.3.9a:** Implement ECS module activation check UI (per routing-structure.md)
- [ ] **Task 1.2.3.10:** Implement Export requests list page (my requests, pending approvals for MOH)
- [ ] **Task 1.2.3.11:** Implement Export request form (SKU selection, destination, timeline, documentation upload)
- [ ] **Task 1.2.3.11a:** Implement ExportRequestForm sections (SKU selection, destination, timeline, documentation upload)
- [ ] **Task 1.2.3.11b:** Implement FileUpload component (drag-drop, progress, validation - per file-upload-storage-security.md)
- [ ] **Task 1.2.3.12:** Implement Export request detail page (request data, evaluation status, threshold comparison)
- [ ] **Task 1.2.3.12a:** Implement ThresholdComparisonCard component (current stock vs VCI threshold vs ECS threshold)
- [ ] **Task 1.2.3.13:** Implement Export workflow actions (submit, verify, approve, reject, intervene buttons - role-based)
- [ ] **Task 1.2.3.13a:** Implement InterventionWindowIndicator component (countdown timer, intervention actions)
- [ ] **Task 1.2.3.14:** Implement Export authorizations list page (active authorizations, expired authorizations)
- [ ] **Task 1.2.3.15:** Implement Export authorization detail page (authorization details, validity period, threshold status)
- [ ] **Task 1.2.3.15a:** Implement AuthorizationValidityIndicator component (90-day countdown, expiration warnings)
- [ ] **Task 1.2.3.15b:** Implement expiration countdown (export authorization 90-day countdown with reminders)
- [ ] **Task 1.2.3.16:** Implement Export completion reporting interface
- [ ] **Task 1.2.3.16a:** Implement ExportCompletionForm component (actual export details, shipping info)
- [ ] **Task 1.2.3.17:** Implement Replenishment schedule tracking interface
- [ ] **Task 1.2.3.17a:** Implement ReplenishmentScheduleTimeline component (schedule visualization, delay indicators)

---

## Subphase 1.2.4: ECS Integration Testing & Mock Data (Week 12)

### ECS Testing & Data Tasks
- [ ] **Task 1.2.4.1:** Create ECS module test suite (unit tests for RPC functions)
- [ ] **Task 1.2.4.1a:** Create ECS-specific test scenarios (threshold switching tests, conditional validation tests, intervention window tests)
- [ ] **Task 1.2.4.2:** Create integration tests - ECS workflow (submission → evaluation → approval → authorization)
- [ ] **Task 1.2.4.3:** Create integration tests - Threshold switching (VCI → ECS → VCI)
- [ ] **Task 1.2.4.4:** Create integration tests - Conditional validation (CMC score integration)
- [ ] **Task 1.2.4.5:** Create integration tests - Replenishment delay escalation
- [ ] **Task 1.2.4.6:** Create mock data generation script - Export requests (historical export request scenarios)
- [ ] **Task 1.2.4.7:** Create mock data generation script - Export authorizations (active and expired authorizations)
- [ ] **Task 1.2.4.8:** Create mock data generation script - Replenishment schedules (various scenarios including delays)
- [ ] **Task 1.2.4.9:** Execute ECS mock data population
- [ ] **Task 1.2.4.10:** Create ECS module user documentation
- [ ] **Task 1.2.4.11:** Phase 1.2 internal review and sign-off

---

# PHASE 1.3: CMC DEVELOPMENT (Month 5 - Weeks 13-16)

**Duration:** 4 weeks  
**Objective:** Build Compliance Monitoring Center module and integrate with all modules

## Subphase 1.3.1: CMC Scoring Engine (Week 13)

### CMC Backend Setup Tasks
- [ ] **Task 1.3.1.1:** Create database migration for CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports)
- [ ] **Task 1.3.1.1a:** Verify CMC schema completeness (all columns, score calculation fields, dispute workflow fields)
- [ ] **Task 1.3.1.1b:** Define CMC integration points with all modules (event triggers, score calculation dependencies)
- [ ] **Task 1.3.1.2:** Implement RLS policies for CMC tables (module activation check, score visibility rules)
- [ ] **Task 1.3.1.2a:** Implement detailed RLS policies for CMC tables (compliance_scores visibility rules, disputes, regulatory_reports) with module activation checks
- [ ] **Task 1.3.1.3:** Create CMC RPC function - Component score calculation (cmc_calculate_component_scores)
- [ ] **Task 1.3.1.4:** Implement Regulatory Reporting Compliance Rate calculation (percentage of mandatory weekly stock reports submitted within deadline over 12 months)
- [ ] **Task 1.3.1.4a:** Implement detailed Regulatory Reporting Compliance Rate formula (12-month rolling window, deadline calculation logic, percentage calculation)
- [ ] **Task 1.3.1.5:** Implement Stock Threshold Violation Frequency calculation (average count of SKUs per reporting cycle failing minimum stock requirements over 6 months)
- [ ] **Task 1.3.1.5a:** Implement detailed Stock Threshold Violation Frequency formula (6-month rolling average, SKU count per cycle, average calculation)
- [ ] **Task 1.3.1.6:** Implement Replenishment Plan Adherence calculation (composite of historical fulfillment and future commitment horizons, ECS module only, if active)
- [ ] **Task 1.3.1.6a:** Implement detailed Replenishment Plan Adherence formula (historical fulfillment percentage, future commitment horizon calculation, composite score)
- [ ] **Task 1.3.1.7:** Implement Aggregate Non-Compliance Exposure calculation (total SKU-days of threshold non-compliance over 12 months)
- [ ] **Task 1.3.1.7a:** Implement detailed Aggregate Non-Compliance Exposure formula (SKU-days calculation, 12-month rolling sum, exposure metric)
- [ ] **Task 1.3.1.8:** Implement Data Quality Signals calculation (formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.8a:** Define Data Quality Signals calculation formulas (completeness metrics, accuracy metrics, timeliness metrics, formula specifications)
- [ ] **Task 1.3.1.9:** Implement Critical Medicine Coverage calculation (formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.9a:** Define Critical Medicine Coverage calculation formulas (coverage percentage, critical SKU tracking, formula specifications)
- [ ] **Task 1.3.1.10:** Implement Export Compliance calculation (ECS module only, if active, formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.10a:** Define Export Compliance calculation formulas (export authorization compliance, replenishment adherence, formula specifications)
- [ ] **Task 1.3.1.11:** Create CMC RPC function - Total score calculation (cmc_calculate_total_score) - weighted average of component factors (0-100 scale)
- [ ] **Task 1.3.1.11a:** Implement weighted average calculation logic (component weight normalization, weighted sum calculation, 0-100 scale mapping)
- [ ] **Task 1.3.1.12:** Implement configurable component weights (Tier 1 configuration, module-specific components excluded when modules not active)
- [ ] **Task 1.3.1.12a:** Implement component weight configuration UI (Tier 1 weight configuration interface, weight validation, weight persistence, default component weights if not configured)
  - **Reference:** [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Default weights and rationale

---

## Subphase 1.3.2: CMC Monthly Calculation & Disputes (Week 14)

### CMC Calculation Backend Tasks
- [ ] **Task 1.3.2.1:** Create CMC RPC function - Monthly score calculation (cmc_calculate_monthly_scores)
- [ ] **Task 1.3.2.2:** Create scheduled trigger for monthly compliance score calculation (1st of month at 2 AM)
- [ ] **Task 1.3.2.2a:** Implement pg_cron setup for monthly CMC score calculation (1st of month at 2 AM, timezone handling)
- [ ] **Task 1.3.2.3:** Implement event-triggered score recalculation (high breaches, enforcement actions, ECS approvals)
- [ ] **Task 1.3.2.3a:** Implement event-triggered recalculation coordinator (ECS approval event → CMC recalculation trigger)
- [ ] **Task 1.3.2.3b:** Implement event-triggered recalculation logic (event detection, recalculation trigger, score update workflow)
- [ ] **Task 1.3.2.4:** Create CMC RPC function - Score freeze (cmc_freeze_score_snapshot) - create frozen snapshot
- [ ] **Task 1.3.2.5:** Create CMC RPC function - Tier 2 review flag (cmc_flag_score_for_review)
- [ ] **Task 1.3.2.6:** Create CMC RPC function - Tier 1 score override (cmc_override_score) - with mandatory justification
- [ ] **Task 1.3.2.7:** Implement adjustment notes system (Tier 1 only, preserves original snapshot, immutable audit trail)
- [ ] **Task 1.3.2.8:** Create CMC RPC function - Dispute creation (cmc_create_dispute) - can address total score or specific components
- [ ] **Task 1.3.2.9:** Create CMC RPC function - Dispute review (cmc_review_dispute) - Tier 2 reviews and forwards to Tier 1
- [ ] **Task 1.3.2.10:** Create CMC RPC function - Dispute resolution (cmc_resolve_dispute) - Tier 1 final decision, creates adjustment note if upheld
- [ ] **Task 1.3.2.11:** Implement 30-day dispute window logic (from score publication date, scores marked "Under Dispute" but remain visible during review)

### CMC Frontend Tasks
- [ ] **Task 1.3.2.12:** Create CMC module layout and navigation (module activation check)
- [ ] **Task 1.3.2.12a:** Implement CMC module activation check UI (per routing-structure.md)
- [ ] **Task 1.3.2.13:** Implement Compliance scores list page (my score for companies, all scores for MOH)
- [ ] **Task 1.3.2.14:** Implement Compliance score detail page (total score, component breakdown, category-level tips for companies - formulas/weights hidden to prevent gaming, companies see exact score + category-level tips)
- [ ] **Task 1.3.2.14a:** Implement ScoreVisualization component (score display, component breakdown chart/gauge)
- [ ] **Task 1.3.2.14b:** Implement ComponentBreakdownCard component (individual component scores, weights - hidden for companies)
- [ ] **Task 1.3.2.14c:** Implement compliance score charts (component breakdown visualization)
- [ ] **Task 1.3.2.15:** Implement Leaderboard page (anonymized for companies - percentile/rank band, full for Tier 1, oversight for Tier 2)
- [ ] **Task 1.3.2.15a:** Implement LeaderboardTable component (anonymized for companies, full for Tier 1, oversight for Tier 2)
- [ ] **Task 1.3.2.16:** Implement Score review interface (Tier 2 - flag anomalies, Tier 1 - override with justification)
- [ ] **Task 1.3.2.16a:** Implement ScoreOverrideModal component (justification input, override reason, immutable audit trail)
- [ ] **Task 1.3.2.17:** Implement Dispute creation interface (companies - 30-day window, dispute form)
- [ ] **Task 1.3.2.17a:** Implement DisputeForm component (dispute reason, component selection, evidence upload)
- [ ] **Task 1.3.2.17b:** Implement file upload for dispute evidence
- [ ] **Task 1.3.2.18:** Implement Dispute review interface (Tier 2 - review, Tier 1 - resolution with adjustment notes)
- [ ] **Task 1.3.2.18a:** Implement DisputeReviewInterface component (dispute details, resolution actions, adjustment notes)

---

## Subphase 1.3.3: CMC Reports & Integration (Week 15)

### CMC Reports Backend Tasks
- [ ] **Task 1.3.3.1:** Create CMC RPC function - Report generation (cmc_generate_regulatory_report)
- [ ] **Task 1.3.3.2:** Implement monthly report template
- [ ] **Task 1.3.3.3:** Implement quarterly report template
- [ ] **Task 1.3.3.4:** Implement annual report template
- [ ] **Task 1.3.3.5:** Create scheduled triggers for report generation (monthly, quarterly, annual)
- [ ] **Task 1.3.3.5a:** Implement pg_cron setup for report generation (monthly, quarterly, annual schedules)
- [ ] **Task 1.3.3.6:** Create CMC RPC function - Report review (cmc_review_report) - Tier 2 reviews for completeness and flags issues
- [ ] **Task 1.3.3.7:** Create CMC RPC function - Report approval (cmc_approve_report) - Tier 1 approves release
- [ ] **Task 1.3.3.8:** Implement report template customization (Tier 1 approval required for template changes)
- [ ] **Task 1.3.3.9:** Create CMC RPC function - Automated reminder trigger (cmc_send_regulatory_reminders)
- [ ] **Task 1.3.3.9a:** Implement Edge Function for regulatory reminders (7 days, 3 days, deadline day reminders)
- [ ] **Task 1.3.3.10:** Implement automated reminders (7 days, 3 days, deadline day - email + in-app notifications)
- [ ] **Task 1.3.3.14b:** Implement report analytics calculations (aggregate statistics, trend analysis, comparative analytics for reports)

### CMC Integration Tasks
- [ ] **Task 1.3.3.11:** Integrate CMC scores with ECS conditional validation (if ECS active)
- [ ] **Task 1.3.3.12:** Implement event-triggered CMC recalculation on ECS export approval
- [ ] **Task 1.3.3.13:** Create CMC Frontend Tasks - Reports list page
- [ ] **Task 1.3.3.13a:** Implement ReportsListTable component (report types, status, download actions)
- [ ] **Task 1.3.3.14:** Create CMC Frontend Tasks - Report detail page (view, download)
- [ ] **Task 1.3.3.14a:** Implement ReportViewer component (PDF viewer, data tables, charts)
- [ ] **Task 1.3.3.14b:** Implement report charts (data visualization in reports)
- [ ] **Task 1.3.3.15:** Create CMC Frontend Tasks - Report review/approval interface (Tier 2 review, Tier 1 approval)
- [ ] **Task 1.3.3.15a:** Implement ReportReviewInterface component (review checklist, approval actions)

---

## Subphase 1.3.4: CMC Testing & Mock Data (Week 16)

### CMC Testing & Data Tasks
- [ ] **Task 1.3.4.1:** Create CMC module test suite (unit tests for scoring calculations)
- [ ] **Task 1.3.4.1a:** Create CMC-specific test scenarios (score calculation accuracy tests, dispute workflow tests, report generation tests)
- [ ] **Task 1.3.4.2:** Create integration tests - Monthly score calculation (all components, weighted average)
- [ ] **Task 1.3.4.3:** Create integration tests - Dispute workflow (creation → review → resolution)
- [ ] **Task 1.3.4.4:** Create integration tests - Report generation (monthly, quarterly, annual templates)
- [ ] **Task 1.3.4.5:** Create integration tests - CMC-ECS integration (scores to ECS validation)
- [ ] **Task 1.3.4.6:** Create integration tests - Event-triggered recalculation (ECS approval triggers)
- [ ] **Task 1.3.4.7:** Create mock data generation script - Compliance scores (2-3 years monthly scores for all companies)
- [ ] **Task 1.3.4.8:** Create mock data generation script - Disputes (historical dispute scenarios)
- [ ] **Task 1.3.4.9:** Create mock data generation script - Regulatory reports (historical reports)
- [ ] **Task 1.3.4.10:** Execute CMC mock data population
- [ ] **Task 1.3.4.11:** Create CMC module user documentation
- [ ] **Task 1.3.4.12:** Phase 1.3 internal review and sign-off

---

# PHASE 1.4: HOLISTIC MVP TESTING (Month 6 - Weeks 17-20)

**Duration:** 4 weeks  
**Objective:** Comprehensive end-to-end testing, performance validation, and customer presentation preparation

## Subphase 1.4.1: End-to-End Integration Testing (Week 17)

### Integration Testing Tasks
- [ ] **Task 1.4.1.1:** Create end-to-end test scenarios - Complete RMM workflow (company submission → approval → implementation)
- [ ] **Task 1.4.1.2:** Create end-to-end test scenarios - Complete VCI workflow (AAMS → MSQ → WSL → breach detection → analysis)
- [ ] **Task 1.4.1.3:** Create end-to-end test scenarios - Complete ECS workflow (export request → approval → authorization → completion)
- [ ] **Task 1.4.1.4:** Create end-to-end test scenarios - Complete CMC workflow (monthly calculation → dispute → resolution)
- [ ] **Task 1.4.1.5:** Create cross-module test scenarios - ECS export → CMC score impact
- [ ] **Task 1.4.1.6:** Create cross-module test scenarios - CMC score → ECS conditional validation
- [ ] **Task 1.4.1.7:** Create cross-module test scenarios - ECS authorization → VCI threshold switching
- [ ] **Task 1.4.1.8:** Create cross-module test scenarios - VCI breach → CMC score impact
- [ ] **Task 1.4.1.9:** Test data flows between all modules (MSQ → XAMS, WSL → compliance scoring, etc.)
- [ ] **Task 1.4.1.9a:** Test data flow contracts (MSQ→XAMS calculation details, WSL→compliance scoring formulas)
- [ ] **Task 1.4.1.10:** Test module activation/deactivation scenarios
- [ ] **Task 1.4.1.11:** Test all scheduled triggers (monthly calculations, deadline checks, expiration checks)
- [ ] **Task 1.4.1.11a:** Test all scheduled jobs execution (manual trigger tests, timezone accuracy, job failure handling)
- [ ] **Task 1.4.1.12:** Test module activation sequence (RMM→VCI→ECS→CMC dependency chain)
- [ ] **Task 1.4.1.13:** Test module deactivation impact (what happens when optional modules are disabled mid-workflow)
- [ ] **Task 1.4.1.14:** Test cross-module workflow dependencies (RMM product update → VCI threshold recalculation, ECS export → CMC score impact)
- [ ] **Task 1.4.1.15:** Create test data cleanup strategy (test isolation, data cleanup between tests, parallel test execution)

---

## Subphase 1.4.2: Performance & Security Testing (Week 18)

### Performance Testing Tasks
- [ ] **Task 1.4.2.1:** Perform load testing - 75 companies concurrent access
- [ ] **Task 1.4.2.1a:** Set up load testing tools (k6, Artillery, or similar, test script creation, performance baseline)
- [ ] **Task 1.4.2.2:** Perform load testing - Large dataset queries (2-3 years historical data)
- [ ] **Task 1.4.2.3:** Perform load testing - Dashboard performance (governance dashboard with all companies)
- [ ] **Task 1.4.2.4:** Test RLS policy performance (company isolation queries)
- [ ] **Task 1.4.2.5:** Test database query optimization (index usage, query plans)
- [ ] **Task 1.4.2.5a:** Analyze and optimize slow queries (EXPLAIN ANALYZE, query plan review)
- [ ] **Task 1.4.2.5b:** Create missing indexes based on query patterns (composite indexes for common filters)
- [ ] **Task 1.4.2.6:** Test scheduled job performance (monthly score calculation, deadline checks)
- [ ] **Task 1.4.2.6a:** Performance test scheduled jobs (execution time, database load, concurrent job handling)
- [ ] **Task 1.4.2.7:** Measure response times (target: <2 seconds for standard operations)
- [ ] **Task 1.4.2.7a:** Define performance benchmarks (response time targets per operation, throughput targets, resource usage limits)
- [ ] **Task 1.4.2.8:** Test concurrent submission handling

### Security Testing Tasks
- [ ] **Task 1.4.2.9:** Perform security audit - Authentication and authorization
- [ ] **Task 1.4.2.10:** Perform security audit - RLS policy enforcement (company data isolation)
- [ ] **Task 1.4.2.10a:** Security audit - RLS policy coverage (all tables have RLS enabled, all policies tested)
- [ ] **Task 1.4.2.11:** Perform security audit - Input validation and sanitization
- [ ] **Task 1.4.2.11a:** Implement input sanitization validation (SQL injection prevention, XSS prevention, parameterized queries)
- [ ] **Task 1.4.2.12:** Perform security audit - Audit logging completeness
- [ ] **Task 1.4.2.13:** Perform security audit - API security (rate limiting, error handling)
- [ ] **Task 1.4.2.13a:** Implement API rate limiting (per-user rate limits, per-endpoint rate limits, rate limit error handling)
- [ ] **Task 1.4.2.14:** Test two-person rule enforcement
- [ ] **Task 1.4.2.14a:** Test two-person rule implementation (approval workflow, audit trail, enforcement logic)
- [ ] **Task 1.4.2.15:** Test role-based access control (all roles, all permissions)
- [ ] **Task 1.4.2.15a:** Create comprehensive RBAC test matrix (all roles × all permissions, test denial of access)

---

## Subphase 1.4.3: Edge Cases & Error Handling (Week 19)

### Edge Case Testing Tasks
- [ ] **Task 1.4.3.1:** Test edge cases - Late AAMS submissions (grace period, overdue handling)
- [ ] **Task 1.4.3.2:** Test edge cases - Missing AAMS (previous year fallback, manual threshold)
- [ ] **Task 1.4.3.3:** Test edge cases - WSL deadline violations (Friday EOD, Monday EOD)
- [ ] **Task 1.4.3.4:** Test edge cases - Multiple concurrent breaches
- [ ] **Task 1.4.3.5:** Test edge cases - Export authorization expiration (90 days, extension requests)
- [ ] **Task 1.4.3.6:** Test edge cases - Replenishment delay escalation (all stages)
- [ ] **Task 1.4.3.7:** Test edge cases - Threshold switching edge cases (ECS Threshold < VCI Threshold)
- [ ] **Task 1.4.3.8:** Test edge cases - CMC score calculation with missing data
- [ ] **Task 1.4.3.9:** Test edge cases - Module activation/deactivation during active workflows
- [ ] **Task 1.4.3.10:** Test error handling - Network failures, timeout scenarios
- [ ] **Task 1.4.3.11:** Test error handling - Invalid data submissions
- [ ] **Task 1.4.3.12:** Test error handling - Concurrent update conflicts
- [ ] **Task 1.4.3.13:** Test error recovery - Transaction rollbacks
- [ ] **Task 1.4.3.14:** Test audit log integrity - All operations logged correctly
- [ ] **Task 1.4.3.15:** Create test coverage reporting (code coverage metrics, coverage targets, coverage reporting in CI/CD)

---

## Subphase 1.4.4: Documentation & Customer Presentation (Week 20)

### Documentation Tasks
- [ ] **Task 1.4.4.1:** Create complete system documentation (architecture overview, module documentation)
- [ ] **Task 1.4.4.1a:** Create architecture decision records (ADRs) documentation for key technical decisions
- [ ] **Task 1.4.4.2:** Create user manuals (company user guide, MOH user guide, role-specific guides)
- [ ] **Task 1.4.4.3:** Create API documentation (complete RPC function documentation, request/response schemas)
- [ ] **Task 1.4.4.4:** Create administrator documentation (deployment guide, configuration guide, troubleshooting)
- [ ] **Task 1.4.4.5:** Create mock data documentation (data structure, usage instructions)

### Customer Presentation Tasks
- [ ] **Task 1.4.4.6:** Prepare demo scenarios (realistic workflows showcasing all modules)
- [ ] **Task 1.4.4.7:** Create presentation materials (PowerPoint, demo script, talking points)
- [ ] **Task 1.4.4.8:** Prepare demo environment (clean data set, pre-configured scenarios)
- [ ] **Task 1.4.4.9:** Create video walkthroughs (key workflows, module overviews)
- [ ] **Task 1.4.4.10:** Prepare Q&A document (anticipated questions and answers)
- [ ] **Task 1.4.4.11:** Conduct internal presentation rehearsal

### Phase 1.4 Sign-off
- [ ] **Task 1.4.4.12:** Final system review (all modules, all features)
- [ ] **Task 1.4.4.13:** Performance benchmarks validation (all targets met)
- [ ] **Task 1.4.4.14:** Security validation (all requirements met)
- [ ] **Task 1.4.4.15:** Phase 1.4 sign-off and approval for Phase 2 (MOH UAT)

---

## Phase 1 Success Criteria Summary

### Phase 1.1 (RMM + VCI)
✅ All RMM workflows functional (CRUD, approval chains, two-person rule)  
✅ All VCI workflows functional (submissions, threshold calculation, breach detection)  
✅ Mock data successfully populated (75 companies)  
✅ Internal testing passed  
✅ Documentation complete

### Phase 1.2 (ECS)
✅ All ECS workflows functional (export requests, approvals, threshold switching)  
✅ Integration with RMM + VCI working correctly  
✅ Mock export scenarios tested  
✅ Internal testing passed

### Phase 1.3 (CMC)
✅ All CMC workflows functional (scoring, disputes, reports)  
✅ Integration with all modules working correctly  
✅ Mock compliance scenarios tested  
✅ Internal testing passed

### Phase 1.4 (Holistic Testing)
✅ All modules working together correctly  
✅ Performance targets met  
✅ Security requirements validated  
✅ Customer presentation materials ready  
✅ System ready for MOH UAT

---

## Risk Mitigation

**Risk 1: Development Timeline Delays**
- **Mitigation:** Bite-size tasks enable parallel work, clear dependencies documented
- **Contingency:** Buffer time in Week 8, 12, 16, 20 for catch-up

**Risk 2: Integration Issues Between Modules**
- **Mitigation:** Clear module interfaces defined in Phase 0, integration tests at each phase
- **Contingency:** Additional integration testing time in Phase 1.4

**Risk 3: Mock Data Complexity**
- **Mitigation:** Mock data generation scripts created early, validated incrementally
- **Contingency:** Simplified data sets if needed, can expand later

**Risk 4: Performance Issues with 75 Companies**
- **Mitigation:** Performance testing early, query optimization, indexing strategy
- **Contingency:** Performance tuning in Phase 1.4, database optimization

---

## Team Assignments (Recommended)

**Note:** Phase 0.5 team assignments are in [Phase 0.5: UI/UX Wireframes & Design Validation](phase-0-5-ui-ux-wireframes.md)

**Phase 1.1:**
- **Oliver:** Architecture oversight, integration coordination
- **Nadia:** Database migrations, RLS policies
- **Rafi:** RLS implementation, security policies
- **Maya:** RPC functions, workflow implementation
- **Salim:** Security implementation, audit logging
- **Leila:** Scheduled triggers, background jobs
- **Emma:** Frontend development, UI/UX (using wireframes as reference)
- **Hassan:** Testing strategy, test implementation
- **Farah:** Mock data generation, data validation

**Phase 1.2-1.4:**
- Similar team assignments with module-specific focus

---

---

## Audit Notes

**Last Updated:** 2025-01-01  
**Audited By:** Fatima (MOH Governance & Regulation SME), Dr. Samir (Pharma Value Chain SME), Emma (UI/UX + Next.js Frontend Specialist), Oliver (Chief Architect), Nadia (Database Modeler), Rafi (RLS/RBAC Specialist), Maya (Workflow/RPC Engineer), Salim (Security & Audit Engineer), Leila (Edge Functions/Jobs Engineer), Hassan (QA/Assurance Engineer), Farah (Analytics/CMC Specialist)

### Key Additions from Audits

**Communication Channels (Approved 2025-01-01):**
- Communication tables added to database schema (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
- Communication RPC functions (create conversation, send message, mark read, archive, create announcement)
- Communication routes added to routing structure (/communications/inbox, /communications/compose, etc.)
- Communication components (inbox, conversation detail, compose, announcements)
- Communication wireframes added to Phase 0.5 Priority 1 (6 wireframe tasks)
- Communication navigation added to Global section in sidebar
- **Communication lifecycle defined** with state transitions, governance requirements, and regulatory compliance (see [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md))
- All communication requirements approved (governance, security, UI/UX, architecture)
- See [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) for complete specifications

**Governance & Regulatory (Fatima):**
- Mandatory justification for Tier 1 enforcement actions
- Rejection iteration tracking (max 2 iterations)
- AAMS grace period compliance logic
- Threshold modification advisory suggestions
- MOH WSL adjustment requests
- Enforcement action documentation requirements
- Regulatory report review workflow (Tier 2 → Tier 1)

**Value Chain Business Processes (Dr. Samir):**
- XAMS seasonal awareness and minimum months validation
- Batch breach analysis capability
- Export expiration reminders (30, 15, 7 days)
- Post-approval intervention logic
- CMC component calculation details
- Score and leaderboard visibility rules
- AAMS vs MSQ independence clarification
- Export authorization validity (90 calendar days)
- SKU pharmaceutical attributes specification (dosage_strength, dosage_form, pack_size, unit_of_measure)
- Simplified submission structure (SKU_ID + Quantity only)

**Frontend & UI/UX (Emma):**
- Design system implementation (tokens, theme, components)
- Base component library (80+ UI components)
- Layout and navigation components
- Role-based UI patterns and hooks
- Form patterns and validation
- State management (TanStack Query, error/loading/empty states)
- Notification system (in-app + toast)
- Module-specific UI components
- Accessibility (WCAG 2.1 AA compliance)
- Responsive design patterns
- Performance optimization
- Frontend testing framework
- Historical data components (Timeline, DateRangePicker, ExportButton)
- Historical data routing and access patterns (history tabs, filtered lists, dedicated routes, modals)
- Module activation impact on historical data (inactive module indicators, data existence checks)

**Architecture & Integration (Oliver):**
- Module integration contracts (data flow specs between modules)
- Database schema versioning strategy
- API contract documentation format
- Integration test framework setup
- Module activation sequence testing
- Architecture decision records (ADRs)

**Database & Schema (Nadia):**
- Complete index implementation (performance indexes, foreign keys)
- Database constraints (check, unique, foreign key constraints)
- Timestamp update triggers
- Schema completeness verification (including SKU pharmaceutical attributes)
- SKU pharmaceutical attributes implementation (dosage_strength, dosage_form, pack_size, unit_of_measure)
- Submission data structure as JSONB arrays (SKU_ID + Quantity)
- Seed data validation scripts
- Query optimization and index analysis

**RLS/RBAC (Rafi):**
- Detailed RLS policies for all tables (users, system_config, audit_logs, notifications, companies, products, skus, atc_codes, critical_medicines, all VCI/ECS/CMC tables)
- Company isolation policies
- Module activation check policies
- RLS policy test suite
- RBAC permission checking in RPC functions

**RPC Functions & Workflows (Maya):**
- Shared RPC function implementation (permissions, module checks, audit logs, notifications)
- State machine validation in workflow functions
- Automatic breach creation logic
- Threshold switching coordination
- Event-triggered recalculation coordinator
- RPC function unit test framework
- Historical data RPC functions (vci_get_historical_submissions, cmc_get_historical_scores, audit_get_historical_logs, has_historical_ecs_data, has_historical_cmc_data, log_historical_data_access)

**Security & Audit (Salim):**
- Audit logging trigger function (hash chaining logic)
- Audit triggers applied to all audited tables
- Audit log hash verification function
- Supabase Auth password policies
- Session management
- File upload security
- Input sanitization validation
- API rate limiting
- Security testing (two-person rule, RBAC test matrix)

**Edge Functions & Scheduled Jobs (Leila):**
- Edge Functions project structure
- pg_cron setup for all scheduled triggers (AAMS deadline, WSL deadline, threshold reversion, export expiration, replenishment delay, monthly CMC calculation, report generation)
- Edge Function for email notifications
- Edge Functions for regulatory reminders and export expiration reminders
- Scheduled job performance testing

**Testing (Hassan):**
- Testing infrastructure setup
- RPC function unit test framework
- Expanded frontend testing framework (Jest, React Testing Library, Playwright)
- Visual regression testing setup
- Integration test data fixtures
- Integration test framework setup
- Module-specific test scenarios (ECS, CMC)
- Load testing tools setup
- Performance benchmarks definition
- Test coverage reporting
- Test data cleanup strategy

**CMC/Analytics (Farah):**
- Detailed CMC component calculation formulas (Regulatory Reporting Compliance Rate, Stock Threshold Violation Frequency, Replenishment Plan Adherence, Aggregate Non-Compliance Exposure, Data Quality Signals, Critical Medicine Coverage, Export Compliance)
- Weighted average calculation logic
- Component weight configuration UI
- Event-triggered recalculation logic
- Report analytics calculations
- Governance dashboard analytics

**Status:** ✅ Updated with All Audit Recommendations  
**Next Step:** Review this plan, adjust task breakdown as needed, assign team members, begin Phase 1.1

---

## Historical Data Implementation

**Status:** ✅ Historical data tasks added to Phase 1.1  
**Reference:** See [Historical Data Routing Proposal](../../02-architecture/frontend/historical-data-routing-proposal.md) for complete specifications

**Tasks Added:**
- **Backend:** Database indexes, RPC functions for historical data access, data existence checks
- **Frontend:** Timeline, DateRangePicker, ExportButton components, history tabs, filtered lists, dedicated routes, modal patterns
- **Navigation:** History/audit links, inactive module indicators, breadcrumb updates
- **Module Activation:** Data existence checks, inactive module UI indicators, route protection patterns
- **Trend Analysis:** AAMS/MSQ/WSL trend components (MOH Tier 1)

**Key Implementation Points:**
- Historical data accessible based on data existence and permissions, not module activation status
- All historical data is read-only (immutable for regulatory compliance)
- 7-year data retention requirement supported
- Access controlled via RLS policies through RPC functions