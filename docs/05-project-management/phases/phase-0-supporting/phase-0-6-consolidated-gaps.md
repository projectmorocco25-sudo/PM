# Phase 0.6: Consolidated Gap Analysis & Recommendations

**Status:** ✅ **COMPLETE**  
**Created:** 2025-01-21  
**Last Updated:** 2025-01-21  
**Lead:** Nadia (Database Specialist)  
**Second Support:** Fatima (MOH Governance & Regulation SME)

---

## Executive Summary

This document consolidates all gaps identified during the comprehensive database schema audit across Phases 1-6 (121 wireframes total). The audit systematically reviewed all wireframes against the current database schema design to identify missing fields, tables, indexes, and relationships.

### Audit Coverage
- ✅ **Phase 1: Core Foundation** - 33 wireframes (100%)
- ✅ **Phase 2: RMM Module** - 23 wireframes (100%)
- ✅ **Phase 3: VCI Module** - 27 wireframes (100%)
- ✅ **Phase 4: ECS Module** - 9 wireframes (100%)
- ✅ **Phase 5: CMC Module** - 13 wireframes (100%)
- ✅ **Phase 6: Historical Data & Modals** - 16 wireframes (100%)
- **Total:** 121 wireframes audited

### Gap Summary by Priority

| Priority | Count | Status | Implementation Phase |
|----------|-------|--------|---------------------|
| **Critical** | 8 | Must Fix | Before Phase 1 |
| **High** | 4 | Should Fix | Phase 1 |
| **Medium** | 1 | Can Fix Later | Phase 1.1 or Phase 2 |
| **Low** | 3 | Optional | Backlog |
| **Total** | **16** | | |

---

## Master Gap List

### Critical Gaps (Must Fix Before Phase 1)

**Priority:** 🔴 Critical  
**Impact:** Blocks Phase 1 implementation  
**Wireframes Affected:** Multiple (Profile, Communications, Dashboards, Governance)

#### 1. users.avatar_url
- **Type:** Missing Field
- **Table:** `users`
- **Wireframe:** `task-0.5.1.22-profile-page.md`
- **Description:** Profile avatar image URL (Supabase Storage path)
- **Specification:** `text NULLABLE`
- **Dependencies:** None (users table exists)

#### 2. users.timezone
- **Type:** Missing Field
- **Table:** `users`
- **Wireframe:** `task-0.5.1.22-profile-page.md`
- **Description:** User timezone preference (default: UTC+01:00 for Morocco)
- **Specification:** `text NOT NULL DEFAULT 'UTC+01:00'`
- **Dependencies:** None (users table exists)

#### 3. users.language
- **Type:** Missing Field
- **Table:** `users`
- **Wireframe:** `task-0.5.1.22-profile-page.md`
- **Description:** User language preference (default: 'en')
- **Specification:** `text NOT NULL DEFAULT 'en'`
- **Dependencies:** None (users table exists)

#### 4. users.notification_preferences
- **Type:** Missing Field
- **Table:** `users`
- **Wireframe:** `task-0.5.1.22-profile-page.md`
- **Description:** Notification preferences (JSONB)
- **Specification:** `jsonb NULLABLE`
- **Dependencies:** None (users table exists)

#### 5. conversations.lifecycle_state
- **Type:** Missing Field
- **Table:** `conversations`
- **Wireframe:** `task-0.5.1.24-communications-inbox-list.md`
- **Description:** Communication lifecycle state (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)
- **Specification:** `text NOT NULL DEFAULT 'CREATED'`
- **Dependencies:** None (conversations table exists)

#### 6. follow_ups table
- **Type:** Missing Table
- **Wireframes:** `task-0.5.1.19-moh-tier1-dashboard.md`, Governance workflows
- **Description:** Follow-up tracking for governance actions
- **Dependencies:** `companies` table (exists), `users` table (exists)

#### 7. meetings table
- **Type:** Missing Table
- **Wireframes:** `task-0.5.1.19-moh-tier1-dashboard.md`, Governance workflows
- **Description:** Meeting scheduling for governance
- **Dependencies:** `users` table (exists)

#### 8. meeting_attendees table
- **Type:** Missing Table
- **Wireframes:** `task-0.5.1.19-moh-tier1-dashboard.md`, Governance workflows
- **Description:** Meeting attendee tracking
- **Dependencies:** `meetings` table (gap #7), `users` table (exists)

---

### High Priority Gaps (Should Fix in Phase 1)

**Priority:** 🟡 High  
**Impact:** Needed for core functionality  
**Wireframes Affected:** Communications, CMC Scores, CMC Disputes

#### 9. messages.delivered_at
- **Type:** Missing Field
- **Table:** `messages`
- **Wireframe:** `task-0.5.1.24-communications-inbox-list.md`
- **Description:** Message delivery timestamp (when message delivered to recipient inbox)
- **Specification:** `timestamptz NULLABLE`
- **Dependencies:** None (messages table exists)

#### 10. compliance_scores.previous_period_score
- **Type:** Missing Field (Status: ✅ Already Added to schema-design.md)
- **Table:** `compliance_scores`
- **Wireframe:** `task-0.5.5.3-leaderboard.md`, `task-0.5.5.2-compliance-score-detail.md`
- **Description:** Previous period score (for trend calculation)
- **Specification:** `numeric(5,2) NULLABLE`
- **Dependencies:** None (compliance_scores table exists)
- **Status:** Already documented in schema-design.md

#### 11. compliance_scores.score_change
- **Type:** Missing Field (Status: ✅ Already Added to schema-design.md)
- **Table:** `compliance_scores`
- **Wireframe:** `task-0.5.5.3-leaderboard.md`, `task-0.5.5.2-compliance-score-detail.md`
- **Description:** Score change from previous period (calculated or stored)
- **Specification:** `numeric(5,2) NULLABLE`
- **Dependencies:** None (compliance_scores table exists)
- **Status:** Already documented in schema-design.md

#### 12. disputes.evidence
- **Type:** Missing Field
- **Table:** `disputes`
- **Wireframes:** `task-0.5.5.7-dispute-detail.md`, `task-0.5.5.8-dispute-creation-interface.md`
- **Description:** Evidence file storage (JSONB field) - similar to `enforcement_action_appeals.evidence`
- **Specification:** `jsonb NULLABLE`
- **Dependencies:** None (disputes table exists)

---

### Medium Priority Gaps (Can Fix Later)

**Priority:** 🟢 Medium  
**Impact:** Nice to have, can be added later  
**Wireframes Affected:** CMC Score Review

#### 13. Score Anomaly Tracking
- **Type:** Missing Field(s) or Missing Table
- **Table:** `compliance_scores` OR new `score_anomalies` table
- **Wireframe:** `task-0.5.5.4-score-review-tier2-flag-anomalies.md`
- **Description:** Tier 2 anomaly flagging (type, description, affected component, supporting evidence, priority)
- **Options:**
  - **Option A:** Add fields to `compliance_scores` table:
    - `anomaly_flagged BOOLEAN DEFAULT FALSE`
    - `anomaly_reason TEXT NULLABLE`
    - `anomaly_flagged_by UUID REFERENCES users(id) NULLABLE`
    - `anomaly_flagged_at TIMESTAMPTZ NULLABLE`
  - **Option B:** Create `score_anomalies` table (for detailed tracking, multiple anomalies per score, workflow)
- **Recommendation:** Option A (simpler, sufficient for current requirements)
- **Dependencies:** `compliance_scores` table (exists), `users` table (exists)

---

### Low Priority Gaps (Backlog)

**Priority:** 🔵 Low  
**Impact:** Optional enhancements  
**Wireframes Affected:** Various (optimization)

#### 14. idx_users_timezone
- **Type:** Missing Index
- **Table:** `users`
- **Wireframe:** General optimization
- **Description:** Index on `users.timezone` (if timezone-based queries needed)
- **Specification:** `CREATE INDEX idx_users_timezone ON users (timezone);`
- **Dependencies:** `users.timezone` field (gap #2)
- **Recommendation:** Add only if timezone-based queries are needed

#### 15. authorization_extensions table
- **Type:** Missing Table (Optional)
- **Wireframe:** `task-0.5.4.6-export-authorization-detail.md`
- **Description:** Authorization extension history/audit trail (beyond audit_logs)
- **Dependencies:** `export_authorizations` table (exists)
- **Recommendation:** Current schema with `audit_logs` may be sufficient. Add only if detailed extension tracking workflow is required.

#### 16. compliance_score_leaderboard_cache table
- **Type:** Missing Table (Optional)
- **Wireframe:** `task-0.5.5.3-leaderboard.md`
- **Description:** Leaderboard rankings cache for performance optimization
- **Dependencies:** `compliance_scores` table (exists), `companies` table (exists)
- **Recommendation:** Add only if leaderboard query performance becomes an issue. Can be calculated on-the-fly for now.

---

## Gap Categorization by Type

### Missing Tables (3 Critical, 3 Optional)

**Critical:**
1. `follow_ups` - Follow-up tracking for governance actions
2. `meetings` - Meeting scheduling for governance
3. `meeting_attendees` - Meeting attendee tracking

**Optional:**
4. `score_anomalies` - Anomaly tracking (alternative to adding fields to compliance_scores)
5. `authorization_extensions` - Authorization extension history (if needed)
6. `compliance_score_leaderboard_cache` - Leaderboard cache (performance optimization)

### Missing Fields (8 Critical, 4 High Priority)

**Critical:**
1. `users.avatar_url` - Profile avatar
2. `users.timezone` - User timezone preference
3. `users.language` - User language preference
4. `users.notification_preferences` - Notification settings
5. `conversations.lifecycle_state` - Communication lifecycle state

**High Priority:**
6. `messages.delivered_at` - Message delivery timestamp
7. `compliance_scores.previous_period_score` - Previous period score (✅ Already added)
8. `compliance_scores.score_change` - Score change (✅ Already added)
9. `disputes.evidence` - Dispute evidence files

**Medium Priority:**
10. `compliance_scores.anomaly_flagged` + related fields (if Option A chosen for gap #13)

### Missing Indexes (1 Low Priority)

1. `idx_users_timezone` - Index on users.timezone (optional)

### Missing Relationships

None - All relationships (foreign keys) are properly defined for new tables.

---

## Gap Verification & Duplicate Removal

### Verification Status

✅ **All gaps verified against current schema:** All identified gaps are confirmed as missing from the current schema design document (`schema-design.md`).

✅ **No duplicates found:** All gaps are unique. Some gaps reference the same wireframes (e.g., profile page, dashboard), but represent different required fields/tables.

✅ **No conflicts:** No conflicting requirements identified. All gaps are complementary.

### Already Implemented (Documented but Not Yet Migrated)

✅ **compliance_scores.previous_period_score** - Already documented in `schema-design.md` (needs migration script)
✅ **compliance_scores.score_change** - Already documented in `schema-design.md` (needs migration script)

**Note:** These fields are documented in the schema design but need migration scripts to be applied to the database.

---

## Impact Analysis

### Wireframe Impact Summary

| Wireframe Category | Gaps Affected | Impact Level |
|-------------------|---------------|--------------|
| **Profile Page** | 4 gaps (users fields) | Critical |
| **Communications** | 2 gaps (lifecycle_state, delivered_at) | Critical |
| **Dashboards** | 3 gaps (follow_ups, meetings, meeting_attendees) | Critical |
| **CMC Scores** | 2 gaps (previous_period_score, score_change) | High |
| **CMC Disputes** | 1 gap (evidence) | High |
| **CMC Score Review** | 1 gap (anomaly tracking) | Medium |

### Module Impact Summary

| Module | Critical Gaps | High Priority Gaps | Total Impact |
|--------|---------------|-------------------|--------------|
| **Core Foundation** | 8 | 1 | Critical |
| **CMC Module** | 0 | 3 | High |
| **RMM Module** | 0 | 0 | None |
| **VCI Module** | 0 | 0 | None |
| **ECS Module** | 0 | 0 | None |

### Implementation Complexity

| Complexity | Gap Count | Estimated Time | Gaps |
|-----------|-----------|----------------|------|
| **Simple** (Add field) | 8 | 1-2 hours each | users.avatar_url, users.timezone, users.language, users.notification_preferences, conversations.lifecycle_state, messages.delivered_at, disputes.evidence, compliance_scores fields |
| **Medium** (Add table + relationships) | 3 | 4-8 hours each | follow_ups, meetings, meeting_attendees |
| **Complex** (Major refactor) | 0 | N/A | None |
| **Total** | **11** | **~24-40 hours** | |

---

## Gap Dependency Map

### Dependency Graph

```
users table (exists)
  ├─ users.avatar_url (gap #1) ──────────┐
  ├─ users.timezone (gap #2) ────────────┤
  ├─ users.language (gap #3) ────────────┤ No dependencies
  └─ users.notification_preferences (gap #4) ─┘

conversations table (exists)
  └─ conversations.lifecycle_state (gap #5) ─── No dependencies

messages table (exists)
  └─ messages.delivered_at (gap #9) ─────────── No dependencies

compliance_scores table (exists)
  ├─ compliance_scores.previous_period_score (gap #10) ──── No dependencies
  └─ compliance_scores.score_change (gap #11) ───────────── No dependencies

disputes table (exists)
  └─ disputes.evidence (gap #12) ─────────────────────────── No dependencies

companies table (exists) ──────┐
users table (exists) ──────────┼─> follow_ups table (gap #6)
                               │
users table (exists) ──────────┼─> meetings table (gap #7)
                               │
meetings table (gap #7) ───────┼─> meeting_attendees table (gap #8)
users table (exists) ──────────┘
```

### Implementation Order Recommendations

**Batch 1: Independent Fields (No Dependencies)**
1. users.avatar_url
2. users.timezone
3. users.language
4. users.notification_preferences
5. conversations.lifecycle_state
6. messages.delivered_at
7. compliance_scores.previous_period_score (if not already migrated)
8. compliance_scores.score_change (if not already migrated)
9. disputes.evidence

**Batch 2: Dependent Tables**
10. follow_ups table (depends on: companies, users - both exist)
11. meetings table (depends on: users - exists)
12. meeting_attendees table (depends on: meetings table from Batch 2, users - exists)

**Batch 3: Optional Enhancements (Later)**
13. Score anomaly tracking (Medium priority)
14. idx_users_timezone (Low priority)
15. authorization_extensions table (Low priority, optional)
16. compliance_score_leaderboard_cache table (Low priority, optional)

---

## Detailed Schema Update Specifications

### Critical Gaps Specifications

Detailed specifications for all 8 critical gaps are already documented in:
- **File:** `docs/02-architecture/database/schema-updates-phase0-6-critical-gaps.md`
- **Status:** ✅ Complete
- **Includes:**
  - Field specifications (data types, constraints, defaults)
  - Table definitions (columns, indexes, foreign keys)
  - Migration scripts
  - Rollback scripts
  - RLS policy requirements
  - Validation rules

### High Priority Gaps Specifications

#### Gap #9: messages.delivered_at

```sql
ALTER TABLE messages 
ADD COLUMN delivered_at timestamptz NULLABLE;

COMMENT ON COLUMN messages.delivered_at IS 'Delivery timestamp (when message delivered to recipient inbox)';

CREATE INDEX idx_messages_delivered_at ON messages (delivered_at) WHERE delivered_at IS NOT NULL;
```

**Specifications:**
- **Type:** `timestamptz`
- **Nullable:** Yes
- **Default:** NULL
- **Index:** Partial index on `delivered_at IS NOT NULL`
- **RLS:** No changes needed (inherits from messages table RLS)
- **Validation:** None (timestamp value)

#### Gap #10 & #11: compliance_scores fields (Already Documented)

**Status:** ✅ Already documented in `schema-design.md`

**Verification:** These fields need to be verified in the actual schema design document and migration scripts created if not already migrated.

#### Gap #12: disputes.evidence

```sql
ALTER TABLE disputes 
ADD COLUMN evidence jsonb NULLABLE;

COMMENT ON COLUMN disputes.evidence IS 'Evidence files (file references stored as JSONB)';
```

**Specifications:**
- **Type:** `jsonb`
- **Nullable:** Yes
- **Default:** NULL
- **JSON Structure:**
  ```json
  [
    {
      "file_name": "evidence.pdf",
      "file_path": "disputes/evidence/{dispute_id}/{file_name}",
      "file_size": 1234567,
      "mime_type": "application/pdf",
      "uploaded_at": "2025-01-21T10:00:00Z",
      "uploaded_by": "user_id"
    }
  ]
  ```
- **Storage:** Supabase Storage bucket: `disputes/evidence/{dispute_id}/{file_name}`
- **Validation:** JSON must be array of file objects (optional CHECK constraint)
- **RLS:** No changes needed (inherits from disputes table RLS)
- **Index:** Consider GIN index if querying by evidence: `CREATE INDEX idx_disputes_evidence ON disputes USING GIN (evidence);`

---

## Migration Plan

### Migration Strategy Overview

**Approach:** Sequential migrations by priority (Critical → High → Medium → Low)

**Risk Level:** Low (all changes are additive - no breaking changes)

**Rollback Strategy:** Each migration has a rollback script

**Testing Strategy:** Test each migration in development/staging before production

---

### Migration Schedule

#### Phase 1: Critical Gaps (Before Phase 1 Implementation)

**Estimated Time:** 16-24 hours  
**Priority:** 🔴 Critical  
**Risk:** Low (additive changes)

**Migrations:**

1. **Migration 1.1: Users Profile Preferences** (Gaps #1-4)
   - **Files:** `schema-updates-phase0-6-critical-gaps.md` - Change 1
   - **Estimated Time:** 2-4 hours
   - **Dependencies:** None
   - **Rollback:** Yes (documented)

2. **Migration 1.2: Conversations Lifecycle State** (Gap #5)
   - **Files:** `schema-updates-phase0-6-critical-gaps.md` - Change 2
   - **Estimated Time:** 1-2 hours
   - **Dependencies:** None
   - **Rollback:** Yes (documented)

3. **Migration 1.3: Follow-ups Table** (Gap #6)
   - **Files:** `schema-updates-phase0-6-critical-gaps.md` - Change 3
   - **Estimated Time:** 4-8 hours
   - **Dependencies:** companies table, users table (both exist)
   - **Rollback:** Yes (documented)

4. **Migration 1.4: Meetings Tables** (Gaps #7-8)
   - **Files:** `schema-updates-phase0-6-critical-gaps.md` - Changes 4-5
   - **Estimated Time:** 4-8 hours
   - **Dependencies:** users table (exists), meetings table depends on users
   - **Rollback:** Yes (documented)

**Total Phase 1:** 11-22 hours

---

#### Phase 2: High Priority Gaps (During Phase 1 Implementation)

**Estimated Time:** 4-8 hours  
**Priority:** 🟡 High  
**Risk:** Low (additive changes)

**Migrations:**

5. **Migration 2.1: Messages Delivered At** (Gap #9)
   - **Estimated Time:** 1-2 hours
   - **Dependencies:** None
   - **Rollback:** Yes

6. **Migration 2.2: Compliance Scores Fields** (Gaps #10-11)
   - **Estimated Time:** 1-2 hours
   - **Dependencies:** None
   - **Status:** Already documented in schema-design.md (verify and create migration script)
   - **Rollback:** Yes

7. **Migration 2.3: Disputes Evidence** (Gap #12)
   - **Estimated Time:** 1-2 hours
   - **Dependencies:** None
   - **Rollback:** Yes

**Total Phase 2:** 3-6 hours

---

#### Phase 3: Medium Priority Gaps (Phase 1.1 or Phase 2)

**Estimated Time:** 2-4 hours  
**Priority:** 🟢 Medium  
**Risk:** Low (additive changes)

**Migrations:**

8. **Migration 3.1: Score Anomaly Tracking** (Gap #13)
   - **Estimated Time:** 2-4 hours
   - **Dependencies:** compliance_scores table (exists), users table (exists)
   - **Options:** Add fields to compliance_scores OR create score_anomalies table
   - **Recommendation:** Add fields to compliance_scores (simpler)
   - **Rollback:** Yes

**Total Phase 3:** 2-4 hours

---

#### Phase 4: Low Priority Gaps (Backlog)

**Estimated Time:** 2-4 hours  
**Priority:** 🔵 Low  
**Risk:** Low (additive changes)

**Migrations:**

9. **Migration 4.1: Optional Indexes and Tables** (Gaps #14-16)
   - **Estimated Time:** 2-4 hours (if all implemented)
   - **Dependencies:** Various
   - **Recommendation:** Implement only if needed (performance issues, business requirements)
   - **Rollback:** Yes

**Total Phase 4:** 2-4 hours (if implemented)

---

### Total Migration Estimate

| Phase | Gaps | Estimated Time | Priority |
|-------|------|----------------|----------|
| **Phase 1: Critical** | 8 | 11-22 hours | Before Phase 1 |
| **Phase 2: High** | 4 | 3-6 hours | During Phase 1 |
| **Phase 3: Medium** | 1 | 2-4 hours | Phase 1.1 or Phase 2 |
| **Phase 4: Low** | 3 | 2-4 hours | Backlog |
| **Total** | **16** | **18-36 hours** | |

---

## Next Steps

### Immediate Actions (Before Phase 1)

1. ✅ **Review this consolidated gap analysis** - Nadia (Lead), Fatima (Second Support)
2. ✅ **Verify compliance_scores fields** - Check if `previous_period_score` and `score_change` are already migrated
3. ⏳ **Create migration scripts for High Priority gaps** - Nadia
4. ⏳ **Review and approve migration plan** - Nadia, Fatima, Oliver (Chief Architect)
5. ⏳ **Schedule migration execution** - Before Phase 1 implementation starts

### Documentation Updates Required

1. ⏳ **Update schema-design.md** - Add all new fields and tables (Phase 8)
2. ⏳ **Update erd.md** - Add new tables and relationships (Phase 8)
3. ⏳ **Update data-dictionary.md** - Add field definitions (Phase 8)
4. ⏳ **Update RLS policy framework** - Define policies for new tables (Phase 8)
5. ⏳ **Update audit logging strategy** - Add new tables to audit list (Phase 8)

---

## Appendices

### Appendix A: Wireframe-to-Gap Mapping

Detailed mapping of which wireframes are affected by which gaps (see `phase-0-6-gap-analysis.md` for full details).

### Appendix B: Existing Specifications

Detailed specifications for Critical gaps are in:
- `docs/02-architecture/database/schema-updates-phase0-6-critical-gaps.md`

### Appendix C: Related Documents

- `docs/05-project-management/phases/phase-0-6-databases.md` - Full audit plan
- `docs/05-project-management/phases/phase-0-6-gap-analysis.md` - Detailed gap analysis by phase
- `docs/02-architecture/database/schema-design.md` - Current schema design
- `docs/02-architecture/database/erd.md` - Entity relationship diagram
- `docs/02-architecture/database/data-dictionary.md` - Data dictionary

---

**Document Status:** ✅ Complete  
**Review Status:** Pending review by Nadia (Lead), Fatima (Second Support), Oliver (Chief Architect)  
**Approval Status:** Pending approval  
**Next Phase:** Phase 8 - Schema Design Update
