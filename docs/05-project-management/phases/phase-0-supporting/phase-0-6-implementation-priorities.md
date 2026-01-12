# Phase 0.6 Database Schema - Implementation Priorities

**Purpose:** Prioritized implementation guide for database schema changes

**Created:** 2025-01-21  
**Last Updated:** 2025-01-21  
**Owner:** Nadia (Database Specialist)  
**Status:** Ready for Implementation

---

## Overview

This document provides a prioritized implementation plan for all database schema changes identified during Phase 0.6. Changes are organized by priority, with clear dependencies, time estimates, and implementation order recommendations.

---

## Priority Levels

- 🔴 **Critical:** Must be implemented before Phase 1 can begin
- 🟡 **High:** Should be implemented early in Phase 1
- 🟢 **Medium:** Can be implemented in Phase 1.1 or Phase 2
- ⚪ **Low:** Optional enhancements, backlog items

---

## Critical Priority Changes (Before Phase 1)

**Total Estimated Time:** 11-22 hours  
**Impact:** Blocks Phase 1 implementation  
**Dependencies:** None (all depend on existing tables)

### Implementation Order

#### 1. users Table - Profile Preferences (Estimated: 1-2 hours)

**Changes:**
- Add `avatar_url` (text, NULLABLE)
- Add `timezone` (text, NOT NULL, DEFAULT 'UTC+01:00')
- Add `language` (text, NOT NULL, DEFAULT 'en')
- Add `notification_preferences` (jsonb, NULLABLE)

**Dependencies:** None  
**Complexity:** Simple (field additions)  
**Quick Win:** ✅ Yes (low effort, high impact)

**Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 1"

**Testing Checklist:**
- [ ] Fields added successfully
- [ ] Default values work correctly
- [ ] Notification preferences JSON validation works
- [ ] Optional GIN index created (if needed)

---

#### 2. conversations Table - Lifecycle State (Estimated: 1-2 hours)

**Changes:**
- Add `lifecycle_state` (text, NOT NULL, DEFAULT 'CREATED')
- Add index: `idx_conversations_lifecycle_state`
- Add CHECK constraint for valid states

**Dependencies:** None  
**Complexity:** Simple (field + index + constraint)  
**Quick Win:** ✅ Yes (low effort, high impact)

**Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 2"

**Testing Checklist:**
- [ ] Field added successfully
- [ ] Index created
- [ ] CHECK constraint validates correctly
- [ ] Existing conversations set to appropriate state

---

#### 3. follow_ups Table (Estimated: 3-4 hours)

**Changes:**
- Create `follow_ups` table with all columns
- Create 7 indexes
- Create 4 CHECK constraints
- Add RLS policies (separate task)

**Dependencies:** `companies` table (exists), `users` table (exists)  
**Complexity:** Medium (table creation + indexes + constraints)  
**Quick Win:** ⚠️ Medium effort, high impact

**Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 4"

**Testing Checklist:**
- [ ] Table created successfully
- [ ] All indexes created
- [ ] All constraints validate correctly
- [ ] Foreign keys work correctly
- [ ] RLS policies implemented (separate task)

---

#### 4. meetings Table (Estimated: 3-4 hours)

**Changes:**
- Create `meetings` table with all columns
- Create 5 indexes
- Create 4 CHECK constraints
- Add RLS policies (separate task)

**Dependencies:** `users` table (exists)  
**Complexity:** Medium (table creation + indexes + constraints)  
**Quick Win:** ⚠️ Medium effort, high impact

**Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 5"

**Testing Checklist:**
- [ ] Table created successfully
- [ ] All indexes created
- [ ] All constraints validate correctly
- [ ] Foreign keys work correctly
- [ ] RLS policies implemented (separate task)

---

#### 5. meeting_attendees Table (Estimated: 2-3 hours)

**Changes:**
- Create `meeting_attendees` table with all columns
- Create 4 indexes
- Create 1 CHECK constraint
- Add UNIQUE constraint on (meeting_id, user_id)
- Add RLS policies (separate task)

**Dependencies:** `meetings` table (from change #4), `users` table (exists)  
**Complexity:** Medium (table creation + indexes + constraints)  
**Quick Win:** ⚠️ Medium effort, high impact

**Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 6"

**Testing Checklist:**
- [ ] Table created successfully
- [ ] All indexes created
- [ ] All constraints validate correctly
- [ ] UNIQUE constraint prevents duplicates
- [ ] Foreign keys work correctly
- [ ] RLS policies implemented (separate task)

---

### Critical Priority Summary

| Change | Estimated Time | Dependencies | Quick Win |
|--------|---------------|--------------|-----------|
| users table fields | 1-2 hours | None | ✅ Yes |
| conversations.lifecycle_state | 1-2 hours | None | ✅ Yes |
| follow_ups table | 3-4 hours | companies, users | ⚠️ Medium |
| meetings table | 3-4 hours | users | ⚠️ Medium |
| meeting_attendees table | 2-3 hours | meetings, users | ⚠️ Medium |
| **Total** | **11-22 hours** | | |

**Recommended Order:** Execute in order listed (dependencies respected)

---

## High Priority Changes (Phase 1)

**Total Estimated Time:** 3-6 hours  
**Impact:** Needed for core functionality  
**Dependencies:** None (all depend on existing tables)

### Implementation Order

#### 1. messages Table - Delivery Tracking (Estimated: 1-2 hours)

**Changes:**
- Add `delivered_at` (timestamptz, NULLABLE)
- Add partial index: `idx_messages_delivered_at` (WHERE delivered_at IS NOT NULL)

**Dependencies:** None  
**Complexity:** Simple (field + index)  
**Quick Win:** ✅ Yes (low effort, high impact)

**Migration Script:**
```sql
ALTER TABLE messages ADD COLUMN delivered_at timestamptz NULLABLE;
CREATE INDEX idx_messages_delivered_at ON messages (delivered_at) WHERE delivered_at IS NOT NULL;
```

**Testing Checklist:**
- [ ] Field added successfully
- [ ] Partial index created
- [ ] Queries for delivered messages perform well

---

#### 2. disputes Table - Evidence Storage (Estimated: 1-2 hours)

**Changes:**
- Add `evidence` (jsonb, NULLABLE)
- Add optional GIN index: `idx_disputes_evidence` (if querying by evidence needed)

**Dependencies:** None  
**Complexity:** Simple (field + optional index)  
**Quick Win:** ✅ Yes (low effort, high impact)

**Migration Script:**
```sql
ALTER TABLE disputes ADD COLUMN evidence jsonb NULLABLE;
CREATE INDEX idx_disputes_evidence ON disputes USING GIN (evidence); -- Optional
```

**Testing Checklist:**
- [ ] Field added successfully
- [ ] GIN index created (if needed)
- [ ] JSONB structure validated

---

#### 3. compliance_scores Fields (Estimated: 0 hours - Already Present)

**Changes:**
- `previous_period_score` (numeric(5,2), NULLABLE) - ✅ Already present
- `score_change` (numeric(5,2), NULLABLE) - ✅ Already present

**Dependencies:** None  
**Complexity:** N/A (already implemented)  
**Quick Win:** ✅ N/A (already done)

**Status:** ✅ No migration needed - fields already present in schema

---

### High Priority Summary

| Change | Estimated Time | Dependencies | Quick Win |
|--------|---------------|--------------|-----------|
| messages.delivered_at | 1-2 hours | None | ✅ Yes |
| disputes.evidence | 1-2 hours | None | ✅ Yes |
| compliance_scores fields | 0 hours | None | ✅ Already done |
| **Total** | **3-6 hours** | | |

**Recommended Order:** Execute in order listed (no dependencies)

---

## Medium Priority Changes (Phase 1.1 or Phase 2)

**Total Estimated Time:** 2-4 hours  
**Impact:** Nice-to-have feature  
**Dependencies:** None

### Implementation Order

#### 1. compliance_scores Table - Anomaly Tracking (Estimated: 2-4 hours)

**Changes:**
- Add `anomaly_flagged` (boolean, DEFAULT false)
- Add `anomaly_reason` (text, NULLABLE)
- Add `anomaly_flagged_by` (uuid, REFERENCES users(id), NULLABLE)
- Add `anomaly_flagged_at` (timestamptz, NULLABLE)

**Dependencies:** None  
**Complexity:** Simple (field additions)  
**Quick Win:** ✅ Yes (low effort, medium impact)

**Migration Script:**
```sql
ALTER TABLE compliance_scores ADD COLUMN anomaly_flagged boolean DEFAULT false;
ALTER TABLE compliance_scores ADD COLUMN anomaly_reason text NULLABLE;
ALTER TABLE compliance_scores ADD COLUMN anomaly_flagged_by uuid REFERENCES users(id) NULLABLE;
ALTER TABLE compliance_scores ADD COLUMN anomaly_flagged_at timestamptz NULLABLE;
```

**Testing Checklist:**
- [ ] Fields added successfully
- [ ] Foreign key constraint works correctly
- [ ] Anomaly tracking workflow functional

---

### Medium Priority Summary

| Change | Estimated Time | Dependencies | Quick Win |
|--------|---------------|--------------|-----------|
| compliance_scores anomaly fields | 2-4 hours | None | ✅ Yes |
| **Total** | **2-4 hours** | | |

**Recommended Order:** Implement when Tier 2 anomaly flagging feature is prioritized

---

## Low Priority Changes (Backlog)

**Total Estimated Time:** 2-4 hours total  
**Impact:** Performance optimization or optional enhancement  
**Status:** Backlog items for future consideration

### Backlog Items

1. **idx_users_timezone index** (Estimated: 0.5 hours)
   - Add index if timezone-based queries become frequent
   - Performance optimization only

2. **authorization_extensions table** (Estimated: 2-3 hours)
   - Optional enhancement if detailed extension audit trail needed beyond audit_logs
   - Low priority (current audit_logs may be sufficient)

3. **compliance_score_leaderboard_cache table** (Estimated: 2-3 hours)
   - Performance optimization for leaderboard queries
   - Only needed if on-the-fly calculation becomes slow

**Recommended Action:** Monitor performance and implement if needed

---

## Implementation Timeline Recommendations

### Pre-Phase 1 (Week 0)

**Duration:** 1-2 days  
**Priority:** 🔴 Critical

1. Execute all Critical priority changes (11-22 hours)
2. Test migrations in staging environment
3. Execute migrations in production
4. Verify RLS policies implemented
5. Team review and sign-off

### Phase 1 (Early - Week 1-2)

**Duration:** 0.5-1 day  
**Priority:** 🟡 High

1. Execute High priority changes (3-6 hours)
2. Test in development/staging
3. Deploy to production
4. Verify functionality

### Phase 1.1 or Phase 2 (As Needed)

**Duration:** 0.5 day  
**Priority:** 🟢 Medium

1. Execute Medium priority changes (2-4 hours)
2. Test and deploy
3. Verify functionality

---

## Quick Wins (Recommended First)

These changes provide high impact with low effort:

1. ✅ **users table fields** (1-2 hours) - Simple field additions
2. ✅ **conversations.lifecycle_state** (1-2 hours) - Simple field + index
3. ✅ **messages.delivered_at** (1-2 hours) - Simple field + index
4. ✅ **disputes.evidence** (1-2 hours) - Simple field + optional index

**Total Quick Wins Time:** 4-8 hours  
**Impact:** High (core functionality enabled)

---

## Dependencies Map

```
users table fields
  └─> No dependencies

conversations.lifecycle_state
  └─> No dependencies

messages.delivered_at
  └─> No dependencies

disputes.evidence
  └─> No dependencies

follow_ups table
  ├─> companies table (exists)
  └─> users table (exists)

meetings table
  └─> users table (exists)

meeting_attendees table
  ├─> meetings table (depends on change #4)
  └─> users table (exists)

compliance_scores anomaly fields
  ├─> users table (exists)
  └─> compliance_scores table (exists)
```

**Critical Path:** No blocking dependencies - all changes can proceed in recommended order

---

## Risk Assessment

### Low Risk Changes
- ✅ users table fields (field additions only)
- ✅ conversations.lifecycle_state (field + index)
- ✅ messages.delivered_at (field + index)
- ✅ disputes.evidence (field + optional index)

### Medium Risk Changes
- ⚠️ follow_ups table (new table, requires RLS policies)
- ⚠️ meetings table (new table, requires RLS policies)
- ⚠️ meeting_attendees table (new table, depends on meetings)

### Mitigation Strategies
- Test all migrations in staging environment first
- Implement RLS policies as separate, tested step
- Have rollback scripts ready
- Schedule maintenance window for production migrations

---

## Success Criteria

### Critical Priority Changes
- [ ] All migrations executed successfully
- [ ] All indexes created and performing well
- [ ] All constraints validated
- [ ] RLS policies implemented and tested
- [ ] No breaking changes to existing functionality
- [ ] Application connectivity verified

### High Priority Changes
- [ ] All migrations executed successfully
- [ ] New functionality tested and working
- [ ] Performance impact assessed
- [ ] No breaking changes

---

## Related Documents

- [Audit Report](phase-0-6-audit-report.md) - Comprehensive audit findings
- [Change Log](phase-0-6-schema-change-log.md) - Version history
- [Consolidated Gap Analysis](phase-0-6-consolidated-gaps.md) - Complete gap details
- [Schema Updates - Critical Gaps](schema-updates-phase0-6-critical-gaps.md) - Detailed migration scripts

---

**Implementation Guide Maintained By:** Nadia (Database Specialist)  
**Next Review:** After Phase 1 implementation begins
