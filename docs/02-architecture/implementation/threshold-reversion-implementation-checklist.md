# Threshold Reversion Implementation Checklist

**Purpose:** This document provides a comprehensive checklist for implementing the time-bound threshold modification feature.

**Last Updated:** 2025-01-15  
**Status:** 🟡 In Progress  
**Owner:** Development Team

## Overview

This checklist covers all aspects of implementing time-bound threshold modifications, from database setup to frontend integration.

## Pre-Implementation

### Documentation Review
- [x] Phase 1: Foundation (Database schema, RPC functions, Edge functions, triggers)
- [x] Phase 2: Workflows & Governance (Workflow architecture, governance workflows, regulatory policies)
- [x] Phase 3: UI/UX Completion (Wireframes, routing, form patterns, role-based UI)
- [x] Phase 4: Migration & Testing (Migration script, testing specs, integration examples)

### Requirements Validation
- [x] Business requirements reviewed and approved
- [x] Regulatory compliance requirements validated
- [x] Stakeholder approval obtained
- [x] Technical architecture reviewed

## Database Implementation

### Migration
- [ ] Create migration file: `add_time_bound_threshold_modifications.sql`
- [ ] Review migration script with database team
- [ ] Test migration on local development database
- [ ] Verify all constraints and indexes created correctly
- [ ] Verify existing thresholds default to 'permanent'
- [ ] Test rollback procedure (if needed)
- [ ] Apply migration to staging environment
- [ ] Verify migration in staging
- [ ] Apply migration to production (with backup)

### Database Validation
- [ ] Verify all new columns exist
- [ ] Verify all indexes are created and used
- [ ] Verify all constraints are enforced
- [ ] Test constraint violations (invalid data)
- [ ] Verify RLS policies work with new columns
- [ ] Test query performance with new indexes

## Backend Implementation

### RPC Functions
- [ ] Update `vci_modify_threshold()` function with new parameters
- [ ] Implement `vci_revert_threshold()` function
- [ ] Implement `vci_get_pending_reversions()` function
- [ ] Implement `vci_confirm_threshold_reversion()` function
- [ ] Test all RPC functions with various inputs
- [ ] Verify error handling and validation
- [ ] Test authorization checks (Tier 1 only)
- [ ] Verify audit logging for all operations

### Database Triggers
- [ ] Review trigger function `revert_temporary_threshold()`
- [ ] Test trigger logic (if using triggers)
- [ ] Verify trigger performance
- [ ] Test trigger error handling

### Edge Functions
- [ ] Update `vci-check-threshold-reverts` Edge Function
- [ ] Implement 7-day warning notification logic
- [ ] Implement 1-day warning notification logic
- [ ] Implement auto-revert logic
- [ ] Implement manual review task creation logic
- [ ] Implement reversion notification logic
- [ ] Test Edge Function with sample data
- [ ] Schedule Edge Function (daily at 00:00 UTC)
- [ ] Verify scheduled execution
- [ ] Test notification delivery

### API Testing
- [ ] Unit tests for all RPC functions
- [ ] Integration tests for workflows
- [ ] Performance tests for queries
- [ ] Security tests for authorization
- [ ] Error handling tests

## Frontend Implementation

### Components
- [ ] Update Threshold Management page component
  - [ ] Add Duration Type column
  - [ ] Add Revert Date column
  - [ ] Add Duration Type filter
  - [ ] Add pending reversion indicators
  - [ ] Add "View Pending Reversions" button
- [ ] Update Threshold Modification Modal component
  - [ ] Add Duration Type selection (radio buttons)
  - [ ] Add conditional fields for temporary type
  - [ ] Add Reversion Type selection
  - [ ] Add End Date picker
  - [ ] Add Revert To input fields
  - [ ] Add validation for temporary fields
  - [ ] Add warning messages
- [ ] Create Threshold Reversion Review page component
  - [ ] Display threshold information
  - [ ] Display reversion details
  - [ ] Add decision options (confirm/cancel/extend)
  - [ ] Add justification input
  - [ ] Add impact assessment display
  - [ ] Implement form validation
- [ ] Create Pending Reversions List page component
  - [ ] Display pending reversions table
  - [ ] Add filters (type, days until, company)
  - [ ] Add color coding by urgency
  - [ ] Add bulk actions
  - [ ] Add sorting functionality

### Hooks & Utilities
- [ ] Create `useModifyThreshold()` hook
- [ ] Create `usePendingReversions()` hook
- [ ] Create `useConfirmThresholdReversion()` hook
- [ ] Create `useManuallyRevertThreshold()` hook
- [ ] Create validation schemas (Zod)
- [ ] Create error handling utilities

### Dashboard Updates
- [ ] Update MOH Tier 1 Dashboard
  - [ ] Add Pending Threshold Reversions widget
  - [ ] Display count and breakdown
  - [ ] Add links to pending reversions list
- [ ] Update MOH Tier 2 Dashboard
  - [ ] Add Pending Reversions (View) widget
  - [ ] Display read-only information
- [ ] Update Governance Dashboard
  - [ ] Add Threshold Reversion Status section
  - [ ] Display metrics and statistics

### Notification Updates
- [ ] Update Notification Center component
  - [ ] Add threshold reversion notification types
  - [ ] Add notification templates
- [ ] Update Notifications page
  - [ ] Add threshold reversion filter
  - [ ] Add notification type examples
- [ ] Implement notification delivery
  - [ ] 7-day warning notifications
  - [ ] 1-day warning notifications
  - [ ] Reversion completion notifications
  - [ ] Review required notifications

### Routing
- [ ] Add route: `/vci/thresholds/pending-reversions`
- [ ] Add route: `/vci/thresholds/[id]/revert-review`
- [ ] Update route protection (Tier 1 only for review)
- [ ] Test route navigation
- [ ] Test route authorization

## Integration Testing

### End-to-End Workflows
- [ ] Test complete permanent modification workflow
- [ ] Test complete temporary auto-revert workflow
  - [ ] Create temporary threshold
  - [ ] Verify notifications scheduled
  - [ ] Verify 7-day warning sent
  - [ ] Verify 1-day warning sent
  - [ ] Verify auto-reversion on revert_date
  - [ ] Verify completion notification sent
- [ ] Test complete temporary manual review workflow
  - [ ] Create temporary threshold (manual review)
  - [ ] Verify review task created on revert_date
  - [ ] Test Tier 1 review and confirmation
  - [ ] Test Tier 1 review and cancellation
  - [ ] Test Tier 1 review and extension
- [ ] Test early manual reversion workflow
- [ ] Test pending reversions list display
- [ ] Test dashboard widget updates

### Cross-Module Integration
- [ ] Verify threshold changes affect breach detection
- [ ] Verify threshold changes affect compliance scoring (if CMC active)
- [ ] Verify audit logging integration
- [ ] Verify notification system integration

## Security & Compliance

### Authorization
- [ ] Verify only Tier 1 can modify thresholds
- [ ] Verify only Tier 1 can confirm reversions
- [ ] Verify Tier 2 can view pending reversions (read-only)
- [ ] Verify company users cannot access reversion features
- [ ] Test RLS policies with new columns

### Audit Logging
- [ ] Verify all modifications logged
- [ ] Verify all reversions logged
- [ ] Verify all notifications logged
- [ ] Verify hash chain maintained
- [ ] Test audit log queries

### Data Validation
- [ ] Verify client-side validation
- [ ] Verify server-side validation
- [ ] Verify database constraints
- [ ] Test invalid input handling

## Performance & Optimization

### Database Performance
- [ ] Verify indexes improve query performance
- [ ] Test query performance with large datasets
- [ ] Optimize slow queries (if any)
- [ ] Verify scheduled job performance

### Frontend Performance
- [ ] Test page load times
- [ ] Test table rendering with many rows
- [ ] Test modal performance
- [ ] Optimize re-renders (if needed)

## Documentation

### Technical Documentation
- [x] Database schema updated
- [x] API documentation updated
- [x] Testing specifications created
- [x] Integration examples created
- [ ] Code comments added
- [ ] README files updated

### User Documentation
- [ ] User guide for threshold modifications
- [ ] User guide for reversion review
- [ ] Admin guide for managing reversions
- [ ] FAQ section updated

## Deployment

### Staging Deployment
- [ ] Apply database migration to staging
- [ ] Deploy backend changes to staging
- [ ] Deploy frontend changes to staging
- [ ] Run smoke tests
- [ ] Run integration tests
- [ ] Get stakeholder approval

### Production Deployment
- [ ] Create production backup
- [ ] Apply database migration to production
- [ ] Deploy backend changes to production
- [ ] Deploy frontend changes to production
- [ ] Monitor for errors
- [ ] Verify scheduled jobs running
- [ ] Verify notifications sending

## Post-Deployment

### Monitoring
- [ ] Monitor error rates
- [ ] Monitor query performance
- [ ] Monitor scheduled job execution
- [ ] Monitor notification delivery
- [ ] Set up alerts for failures

### Validation
- [ ] Verify feature works in production
- [ ] Verify all workflows functional
- [ ] Verify notifications delivered
- [ ] Verify audit logs created
- [ ] Get user feedback

### Maintenance
- [ ] Document known issues
- [ ] Create maintenance procedures
- [ ] Schedule regular reviews
- [ ] Update documentation as needed

## Rollback Plan

### If Issues Detected
- [ ] Stop scheduled jobs
- [ ] Revert frontend deployment
- [ ] Revert backend deployment
- [ ] Assess database rollback (data loss considerations)
- [ ] Communicate with stakeholders
- [ ] Document issues and lessons learned

## Success Criteria

- ✅ All database migrations applied successfully
- ✅ All RPC functions working correctly
- ✅ All Edge Functions scheduled and executing
- ✅ All UI components implemented and functional
- ✅ All workflows tested and validated
- ✅ All security checks passing
- ✅ All performance requirements met
- ✅ All documentation complete
- ✅ Stakeholder approval obtained
- ✅ Production deployment successful

---

**Last Updated:** 2025-01-15  
**Owner:** Development Team

