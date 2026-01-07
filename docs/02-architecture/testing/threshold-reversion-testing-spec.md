# Threshold Reversion Testing Specification

**Purpose:** This document defines comprehensive testing specifications for time-bound threshold modifications and reversion workflows.

**Last Updated:** 2025-01-15  
**Status:** 🟡 In Progress  
**Owner:** Testing Team

## Overview

This testing specification covers all aspects of the time-bound threshold modification feature, including database operations, API functions, workflows, and UI/UX components.

## Test Categories

### 1. Database Tests

#### 1.1 Schema Validation Tests

**Test:** Verify migration applies correctly
- **Given:** Fresh database
- **When:** Migration `add_time_bound_threshold_modifications.sql` is applied
- **Then:**
  - All new columns exist in `thresholds` table
  - All indexes are created
  - All constraints are enforced
  - Default values are set correctly

**Test:** Verify existing thresholds default to permanent
- **Given:** Database with existing thresholds
- **When:** Migration is applied
- **Then:**
  - All existing thresholds have `duration_type = 'permanent'`
  - All existing thresholds have `revert_date = NULL`
  - All existing thresholds have `revert_to_multiplier = NULL`

#### 1.2 Constraint Tests

**Test:** Prevent temporary threshold without revert_date
- **Given:** Valid threshold data
- **When:** Creating threshold with `duration_type = 'temporary_auto_revert'` and `revert_date = NULL`
- **Then:** Constraint violation error is raised

**Test:** Prevent temporary threshold with past revert_date
- **Given:** Valid threshold data
- **When:** Creating threshold with `revert_date = '2024-01-01'` (past date)
- **Then:** Constraint violation error is raised

**Test:** Prevent temporary threshold without revert_to values
- **Given:** Valid threshold data
- **When:** Creating threshold with `duration_type = 'temporary_auto_revert'` and `revert_to_multiplier = NULL`
- **Then:** Constraint violation error is raised

**Test:** Validate revert_to_multiplier range
- **Given:** Valid threshold data
- **When:** Creating threshold with `revert_to_multiplier = 0.05` (below minimum)
- **Then:** Constraint violation error is raised
- **When:** Creating threshold with `revert_to_multiplier = 6.0` (above maximum)
- **Then:** Constraint violation error is raised

#### 1.3 Index Performance Tests

**Test:** Query pending reversions performance
- **Given:** 10,000 thresholds with 100 pending reversions
- **When:** Querying `SELECT * FROM thresholds WHERE revert_date >= CURRENT_DATE AND duration_type <> 'permanent'`
- **Then:** Query executes in < 100ms using `idx_thresholds_revert_date` index

### 2. RPC Function Tests

#### 2.1 Threshold Modification Tests

**Test:** Create permanent threshold modification
- **Given:** Tier 1 user, existing threshold
- **When:** Calling `vci_modify_threshold()` with `duration_type = 'permanent'`
- **Then:**
  - New threshold version created
  - Old threshold marked as `is_current = false`
  - Audit log entry created
  - Success response returned

**Test:** Create temporary auto-revert threshold
- **Given:** Tier 1 user, existing threshold
- **When:** Calling `vci_modify_threshold()` with `duration_type = 'temporary_auto_revert'`, `revert_date = future_date`, `revert_to_multiplier = 1.0`
- **Then:**
  - New threshold created with temporary type
  - `revert_date` set correctly
  - `revert_to_multiplier` and `revert_to_threshold_value` set
  - Notification flags initialized to false
  - Audit log entry created

**Test:** Create temporary manual review threshold
- **Given:** Tier 1 user, existing threshold
- **When:** Calling `vci_modify_threshold()` with `duration_type = 'temporary_manual_review'`, `requires_manual_review = true`
- **Then:**
  - New threshold created with manual review type
  - `requires_manual_review = true`
  - Audit log entry created

**Test:** Prevent overlapping temporary thresholds
- **Given:** Existing temporary threshold with `revert_date = '2025-06-30'`
- **When:** Creating new temporary threshold with `revert_date = '2025-06-15'` (overlaps)
- **Then:** Error raised: "An overlapping temporary threshold already exists"

**Test:** Validate justification length
- **Given:** Tier 1 user
- **When:** Calling `vci_modify_threshold()` with `justification = 'Short'` (< 50 characters)
- **Then:** Error raised: "Justification must be at least 50 characters"

#### 2.2 Threshold Reversion Tests

**Test:** Auto-revert temporary threshold
- **Given:** Temporary threshold with `revert_date = TODAY`, `duration_type = 'temporary_auto_revert'`
- **When:** Scheduled job calls reversion logic
- **Then:**
  - New permanent threshold created with `revert_to_*` values
  - Old threshold marked as `is_current = false`
  - `revert_notification_sent_on_revert = true`
  - Notifications sent to MOH and company
  - Audit log entry created

**Test:** Manual review threshold creates review task
- **Given:** Temporary threshold with `revert_date = TODAY`, `duration_type = 'temporary_manual_review'`
- **When:** Scheduled job detects reversion date
- **Then:**
  - Review task created for Tier 1
  - Notification sent to Tier 1
  - `revert_notification_sent_on_revert = true`
  - Threshold remains active until review

**Test:** Tier 1 confirms manual review reversion
- **Given:** Temporary threshold pending review, Tier 1 user
- **When:** Calling `vci_confirm_threshold_reversion()` with confirmation
- **Then:**
  - New permanent threshold created with `revert_to_*` values
  - Old threshold marked as `is_current = false`
  - `requires_manual_review = false`
  - Audit log entry created
  - Notifications sent

**Test:** Tier 1 cancels manual review reversion
- **Given:** Temporary threshold pending review, Tier 1 user
- **When:** Calling `vci_confirm_threshold_reversion()` with cancellation
- **Then:**
  - Threshold remains at current values
  - `requires_manual_review = false`
  - New revert date can be set
  - Audit log entry created

**Test:** Early manual reversion
- **Given:** Temporary threshold with `revert_date = '2025-06-30'` (future), Tier 1 user
- **When:** Calling `vci_revert_threshold()` before revert_date
- **Then:**
  - New permanent threshold created immediately
  - Old threshold marked as `is_current = false`
  - Audit log entry created with early reversion reason

#### 2.3 Query Function Tests

**Test:** Get pending reversions (MOH)
- **Given:** Multiple temporary thresholds with various revert dates
- **When:** Tier 1 calls `vci_get_pending_reversions(NULL)`
- **Then:**
  - Returns all pending reversions
  - Sorted by `revert_date` ascending
  - Includes all required fields (SKU, product, company, dates, multipliers)

**Test:** Get pending reversions (Company)
- **Given:** Company user, temporary thresholds for their company
- **When:** Company calls `vci_get_pending_reversions(company_id)`
- **Then:**
  - Returns only their company's pending reversions
  - RLS policies enforced
  - No access to other companies' data

### 3. Edge Function Tests

#### 3.1 Scheduled Reversion Job Tests

**Test:** Daily reversion check identifies due thresholds
- **Given:** Multiple temporary thresholds with various revert dates
- **When:** Edge function `vci-check-threshold-reverts` runs daily
- **Then:**
  - Identifies thresholds where `revert_date = TODAY`
  - Processes auto-revert types
  - Creates review tasks for manual review types
  - Sends appropriate notifications

**Test:** 7-day warning notifications
- **Given:** Temporary threshold with `revert_date = TODAY + 7 days`
- **When:** Edge function runs
- **Then:**
  - Notification sent to MOH and company
  - `revert_notification_sent_7d = true`
  - Audit log entry created

**Test:** 1-day warning notifications
- **Given:** Temporary threshold with `revert_date = TODAY + 1 day`
- **When:** Edge function runs
- **Then:**
  - Notification sent to MOH and company
  - `revert_notification_sent_1d = true`
  - Audit log entry created

**Test:** No duplicate notifications
- **Given:** Temporary threshold with `revert_notification_sent_7d = true`
- **When:** Edge function runs again
- **Then:**
  - No duplicate notification sent
  - Flag remains true

### 4. Workflow Tests

#### 4.1 Threshold Modification Workflow

**Test:** Complete permanent modification workflow
- **Given:** Tier 1 user, existing threshold
- **When:** User modifies threshold (permanent)
- **Then:**
  - Modal opens with all fields
  - User selects permanent duration
  - User enters multiplier and justification
  - Modification succeeds
  - Threshold management page updates
  - Audit log created

**Test:** Complete temporary modification workflow
- **Given:** Tier 1 user, existing threshold
- **When:** User modifies threshold (temporary)
- **Then:**
  - Modal opens with duration type selection
  - User selects temporary
  - Conditional fields appear (revert date, revert to values)
  - User completes all required fields
  - Modification succeeds
  - Pending reversions list updates
  - Notifications scheduled

#### 4.2 Reversion Workflow Tests

**Test:** Auto-revert workflow
- **Given:** Temporary auto-revert threshold reaching revert_date
- **When:** Scheduled job runs
- **Then:**
  - Threshold automatically reverts
  - New permanent threshold created
  - Notifications sent
  - Dashboard widgets update
  - Pending reversions list updates

**Test:** Manual review workflow
- **Given:** Temporary manual review threshold reaching revert_date
- **When:** Scheduled job runs
- **Then:**
  - Review task created
  - Tier 1 notified
  - Threshold remains active
  - Tier 1 can review and confirm/cancel/extend

### 5. UI/UX Tests

#### 5.1 Threshold Management Page Tests

**Test:** Display duration type in table
- **Given:** Thresholds with various duration types
- **When:** User views threshold management page
- **Then:**
  - Duration Type column displays correct badges
  - Permanent thresholds show "Permanent"
  - Temporary thresholds show "Temp Auto Revert" or "Temp Manual Review"

**Test:** Display revert date with countdown
- **Given:** Temporary threshold with `revert_date = TODAY + 7 days`
- **When:** User views threshold management page
- **Then:**
  - Revert Date column shows date (DD/MM/YY)
  - Shows "(7 days)" countdown
  - Color-coded by urgency (green/yellow/red)

**Test:** Filter by duration type
- **Given:** Thresholds with various duration types
- **When:** User filters by "Temporary"
- **Then:**
  - Only temporary thresholds displayed
  - Filter persists across page navigation

**Test:** View pending reversions button
- **Given:** Pending reversions exist
- **When:** User clicks "View Pending Reversions"
- **Then:**
  - Navigates to pending reversions list page
  - Shows all pending reversions

#### 5.2 Reversion Review Page Tests

**Test:** Display threshold information
- **Given:** Temporary threshold pending review
- **When:** Tier 1 opens reversion review page
- **Then:**
  - All threshold details displayed
  - Reversion details shown
  - Impact assessment displayed
  - Original justification shown

**Test:** Confirm reversion decision
- **Given:** Temporary threshold pending review
- **When:** Tier 1 selects "Confirm Reversion" and provides justification
- **Then:**
  - Reversion executes
  - Success message displayed
  - Redirects to threshold detail or pending list
  - Audit log created

**Test:** Cancel reversion decision
- **Given:** Temporary threshold pending review
- **When:** Tier 1 selects "Cancel Reversion" and provides justification
- **Then:**
  - Threshold remains at current values
  - Pending reversion status removed
  - Success message displayed
  - Audit log created

**Test:** Extend temporary period
- **Given:** Temporary threshold pending review
- **When:** Tier 1 selects "Extend Temporary Period" and sets new revert date
- **Then:**
  - New temporary threshold version created
  - New revert date set
  - Success message displayed
  - Audit log created

#### 5.3 Pending Reversions List Tests

**Test:** Display all pending reversions
- **Given:** Multiple pending reversions
- **When:** User views pending reversions list
- **Then:**
  - All pending reversions displayed in table
  - Sorted by revert_date (earliest first)
  - Color-coded by urgency

**Test:** Filter by type
- **Given:** Pending reversions of both types
- **When:** User filters by "Auto-Revert"
- **Then:**
  - Only auto-revert reversions displayed
  - Filter persists

**Test:** Filter by days until
- **Given:** Pending reversions with various dates
- **When:** User filters by "<7 days"
- **Then:**
  - Only urgent reversions displayed
  - Red highlighting visible

**Test:** Bulk review action
- **Given:** Multiple manual review reversions selected
- **When:** Tier 1 clicks "Bulk Review"
- **Then:**
  - Bulk review modal opens
  - All selected reversions listed
  - Can review multiple at once

### 6. Integration Tests

#### 6.1 Dashboard Integration Tests

**Test:** Pending reversions widget displays correctly
- **Given:** Pending reversions exist
- **When:** Tier 1 views dashboard
- **Then:**
  - Widget shows correct count
  - Breakdown by type displayed
  - Top items listed
  - Links to pending reversions list

**Test:** Widget updates on reversion
- **Given:** Pending reversions widget displayed
- **When:** Threshold reverts (auto or manual)
- **Then:**
  - Widget count updates
  - Item removed from list
  - Real-time update (if WebSocket enabled)

#### 6.2 Notification Integration Tests

**Test:** 7-day warning notification sent
- **Given:** Temporary threshold with `revert_date = TODAY + 7 days`
- **When:** Edge function runs
- **Then:**
  - Notification created for MOH Tier 1
  - Notification created for company
  - Notification appears in notification center
  - Email notification sent (if enabled)

**Test:** Reversion completion notification
- **Given:** Temporary threshold reverting
- **When:** Reversion completes
- **Then:**
  - Notification sent to threshold creator
  - Notification sent to company
  - Notification appears in notification center
  - Links to new threshold detail page

### 7. Security Tests

#### 7.1 Authorization Tests

**Test:** Only Tier 1 can modify thresholds
- **Given:** Tier 2 user
- **When:** Attempting to call `vci_modify_threshold()`
- **Then:** Authorization error raised

**Test:** Only Tier 1 can confirm reversions
- **Given:** Tier 2 user, pending review threshold
- **When:** Attempting to call `vci_confirm_threshold_reversion()`
- **Then:** Authorization error raised

**Test:** RLS policies enforce data isolation
- **Given:** Company user
- **When:** Querying `vci_get_pending_reversions()`
- **Then:**
  - Only sees their company's reversions
  - Cannot see other companies' data
  - RLS policies enforced

#### 7.2 Audit Logging Tests

**Test:** All modifications logged
- **Given:** Tier 1 modifies threshold
- **When:** Modification completes
- **Then:**
  - Audit log entry created
  - Includes user ID, operation type, old/new values
  - Includes justification
  - Hash chain maintained

**Test:** All reversions logged
- **Given:** Threshold reverts
- **When:** Reversion completes
- **Then:**
  - Audit log entry created
  - Includes reversion type (auto/manual)
  - Includes confirmation details (if manual)
  - Hash chain maintained

### 8. Performance Tests

#### 8.1 Query Performance Tests

**Test:** Pending reversions query performance
- **Given:** 10,000 thresholds, 100 pending reversions
- **When:** Querying pending reversions
- **Then:**
  - Query executes in < 200ms
  - Indexes used efficiently
  - No full table scans

**Test:** Threshold modification performance
- **Given:** Large number of SKUs for global modification
- **When:** Tier 1 modifies threshold globally
- **Then:**
  - All SKU thresholds updated in < 5 seconds
  - Transaction completes successfully
  - No timeout errors

#### 8.2 Scheduled Job Performance Tests

**Test:** Daily reversion check performance
- **Given:** 1,000 temporary thresholds
- **When:** Edge function runs daily check
- **Then:**
  - Completes in < 30 seconds
  - Processes all due reversions
  - Sends all notifications
  - No errors or timeouts

### 9. Error Handling Tests

#### 9.1 Validation Error Tests

**Test:** Invalid revert_date error handling
- **Given:** User attempts to create temporary threshold with past date
- **When:** Validation fails
- **Then:**
  - Clear error message displayed
  - Form highlights invalid field
  - User can correct and retry

**Test:** Missing required fields error handling
- **Given:** User attempts to create temporary threshold without revert_to values
- **When:** Validation fails
- **Then:**
  - Clear error message displayed
  - All missing fields highlighted
  - User can complete and retry

#### 9.2 System Error Tests

**Test:** Database connection failure during reversion
- **Given:** Temporary threshold due for reversion
- **When:** Database connection fails during reversion
- **Then:**
  - Error logged
  - Reversion retried on next scheduled run
  - Notification sent to system administrators

**Test:** Notification service failure
- **Given:** Threshold reverting
- **When:** Notification service unavailable
- **Then:**
  - Reversion completes successfully
  - Error logged
  - Notifications retried later
  - User can manually check status

## Test Data Requirements

### Test Thresholds

1. **Permanent Thresholds:**
   - Standard permanent threshold (default)
   - Modified permanent threshold (custom multiplier)

2. **Temporary Auto-Revert Thresholds:**
   - Due today (immediate reversion)
   - Due in 7 days (warning notification)
   - Due in 1 day (urgent warning)
   - Due in 30 days (future reversion)

3. **Temporary Manual Review Thresholds:**
   - Due today (requires review)
   - Due in 7 days (future review)
   - With requires_manual_review = true

### Test Users

1. **Tier 1 User:** Full access to all threshold operations
2. **Tier 2 User:** Read-only access to pending reversions
3. **Company User:** View-only access to own company's thresholds

## Test Execution Plan

### Phase 1: Unit Tests
- Database constraint tests
- RPC function tests
- Edge function tests

### Phase 2: Integration Tests
- Workflow tests
- UI/UX tests
- Dashboard integration tests

### Phase 3: System Tests
- Performance tests
- Security tests
- Error handling tests

### Phase 4: User Acceptance Tests
- End-to-end workflows
- Real-world scenarios
- Stakeholder validation

## Success Criteria

- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ Performance meets requirements (< 200ms for queries, < 30s for scheduled jobs)
- ✅ Security tests confirm proper authorization
- ✅ Error handling graceful and informative
- ✅ User acceptance tests approved by stakeholders

---

**Last Updated:** 2025-01-15  
**Owner:** Testing Team

