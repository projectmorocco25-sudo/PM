# Phase 0.6 Database Schema - Change Log

**Purpose:** Version history and change log for database schema updates

**Created:** 2025-01-21  
**Last Updated:** 2025-01-21  
**Owner:** Nadia (Database Specialist)

---

## Version History

| Version | Date | Author | Description | Status |
|---------|------|--------|-------------|--------|
| **1.0** | 2025-12-31 | Nadia | Initial schema design (Phase 0, Week 2) | ✅ Complete |
| **1.1** | 2025-01-21 | Nadia | Phase 0.6 Schema Audit - Critical and High Priority gaps addressed | ✅ Complete |

---

## Version 1.1 Changes (2025-01-21)

**Version:** 1.1  
**Date:** 2025-01-21  
**Author:** Nadia (Database Specialist)  
**Reason:** Phase 0.6 Database Schema Audit - Address wireframe gaps  
**Status:** ✅ Documentation Complete (Pending Migration Execution)

### Change Summary

- **New Fields:** 9 fields added (8 newly documented, 1 already present)
- **New Tables:** 3 tables added
- **New Indexes:** 19+ indexes added
- **Documents Updated:** schema-design.md, erd.md, data-dictionary.md

---

### Field Additions

#### users Table

1. **avatar_url** (text, NULLABLE)
   - **Added:** 2025-01-21
   - **Purpose:** Store user avatar image URL (Supabase Storage path)
   - **Priority:** Critical
   - **Migration:** `ALTER TABLE users ADD COLUMN avatar_url text NULLABLE;`

2. **timezone** (text, NOT NULL, DEFAULT 'UTC+01:00')
   - **Added:** 2025-01-21
   - **Purpose:** User timezone preference
   - **Priority:** Critical
   - **Migration:** `ALTER TABLE users ADD COLUMN timezone text NOT NULL DEFAULT 'UTC+01:00';`

3. **language** (text, NOT NULL, DEFAULT 'en')
   - **Added:** 2025-01-21
   - **Purpose:** User language preference
   - **Priority:** Critical
   - **Migration:** `ALTER TABLE users ADD COLUMN language text NOT NULL DEFAULT 'en';`

4. **notification_preferences** (jsonb, NULLABLE)
   - **Added:** 2025-01-21
   - **Purpose:** User notification preferences
   - **Priority:** Critical
   - **Migration:** `ALTER TABLE users ADD COLUMN notification_preferences jsonb NULLABLE;`
   - **Index:** Optional GIN index: `CREATE INDEX idx_users_notification_preferences ON users USING GIN (notification_preferences);`

#### conversations Table

5. **lifecycle_state** (text, NOT NULL, DEFAULT 'CREATED')
   - **Added:** 2025-01-21
   - **Purpose:** Communication lifecycle state tracking
   - **Priority:** Critical
   - **Migration:** `ALTER TABLE conversations ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'CREATED';`
   - **Index:** `CREATE INDEX idx_conversations_lifecycle_state ON conversations (lifecycle_state);`
   - **Constraint:** `CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED'))`

#### messages Table

6. **delivered_at** (timestamptz, NULLABLE)
   - **Added:** 2025-01-21
   - **Purpose:** Message delivery timestamp
   - **Priority:** High
   - **Migration:** `ALTER TABLE messages ADD COLUMN delivered_at timestamptz NULLABLE;`
   - **Index:** `CREATE INDEX idx_messages_delivered_at ON messages (delivered_at) WHERE delivered_at IS NOT NULL;`

#### compliance_scores Table

7. **previous_period_score** (numeric(5,2), NULLABLE)
   - **Added:** Prior to audit (already present)
   - **Purpose:** Previous period score for trend calculation
   - **Priority:** High
   - **Status:** ✅ Already present in schema

8. **score_change** (numeric(5,2), NULLABLE)
   - **Added:** Prior to audit (already present)
   - **Purpose:** Score change from previous period
   - **Priority:** High
   - **Status:** ✅ Already present in schema

#### disputes Table

9. **evidence** (jsonb, NULLABLE)
   - **Added:** 2025-01-21
   - **Purpose:** Evidence file storage for disputes
   - **Priority:** High
   - **Migration:** `ALTER TABLE disputes ADD COLUMN evidence jsonb NULLABLE;`
   - **Index:** Optional GIN index: `CREATE INDEX idx_disputes_evidence ON disputes USING GIN (evidence);`

---

### Table Additions

#### follow_ups Table

- **Added:** 2025-01-21
- **Purpose:** Track follow-up assignments for governance actions
- **Priority:** Critical
- **Dependencies:** companies table, users table
- **Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 4"
- **Indexes:** 7 indexes (company_id, assigned_to, due_date, status, priority, active_priority composite, issue_reference composite)
- **Constraints:** Priority validation, status validation, completed validation, reference table validation

#### meetings Table

- **Added:** 2025-01-21
- **Purpose:** Schedule and track governance meetings
- **Priority:** Critical
- **Dependencies:** users table
- **Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 5"
- **Indexes:** 5 indexes (scheduled_at, status, meeting_type, upcoming composite, related_reference composite)
- **Constraints:** Meeting type validation, status validation, cancelled validation, reference table validation

#### meeting_attendees Table

- **Added:** 2025-01-21
- **Purpose:** Track meeting attendees
- **Priority:** Critical
- **Dependencies:** meetings table, users table
- **Migration Script:** See `schema-updates-phase0-6-critical-gaps.md` Section "Change 6"
- **Indexes:** 4 indexes (meeting_id, user_id, attendance_status, pending composite)
- **Constraints:** Attendance status validation, UNIQUE (meeting_id, user_id)

---

## Migration Script Outline

### Phase 1: Critical Gaps (Must Execute Before Phase 1)

**Estimated Time:** 11-22 hours  
**Execution Order:**

1. **users Table Fields** (Batch 1)
   - Migration: Add avatar_url, timezone, language, notification_preferences
   - Script: `schema-updates-phase0-6-critical-gaps.md` Section "Change 1"
   - Estimated Time: 1-2 hours

2. **conversations Table Field** (Batch 2)
   - Migration: Add lifecycle_state field and index
   - Script: `schema-updates-phase0-6-critical-gaps.md` Section "Change 2"
   - Estimated Time: 1-2 hours

3. **follow_ups Table** (Batch 3)
   - Migration: Create follow_ups table, indexes, constraints
   - Script: `schema-updates-phase0-6-critical-gaps.md` Section "Change 4"
   - Estimated Time: 3-4 hours

4. **meetings Table** (Batch 4)
   - Migration: Create meetings table, indexes, constraints
   - Script: `schema-updates-phase0-6-critical-gaps.md` Section "Change 5"
   - Estimated Time: 3-4 hours

5. **meeting_attendees Table** (Batch 5)
   - Migration: Create meeting_attendees table, indexes, constraints
   - Script: `schema-updates-phase0-6-critical-gaps.md` Section "Change 6"
   - Estimated Time: 2-3 hours

**Total Estimated Time:** 11-22 hours

---

### Phase 2: High Priority Gaps (Execute During Phase 1)

**Estimated Time:** 3-6 hours  
**Execution Order:**

1. **messages Table Field** (Batch 6)
   - Migration: Add delivered_at field and index
   - Script: See `schema-updates-phase0-6-critical-gaps.md` Section "Change 3" (adapted for messages table)
   - Estimated Time: 1-2 hours

2. **disputes Table Field** (Batch 7)
   - Migration: Add evidence field (and optional GIN index)
   - Script: `ALTER TABLE disputes ADD COLUMN evidence jsonb NULLABLE;`
   - Estimated Time: 1-2 hours

**Note:** compliance_scores.previous_period_score and score_change already present (no migration needed)

**Total Estimated Time:** 3-6 hours

---

### Phase 3: Medium Priority Gaps (Phase 1.1 or Phase 2)

**Estimated Time:** 2-4 hours  
**Execution Order:**

1. **compliance_scores Table Fields** (Batch 8)
   - Migration: Add anomaly_flagged, anomaly_reason, anomaly_flagged_by, anomaly_flagged_at fields
   - Script: See `phase-0-6-consolidated-gaps.md` Section "Medium Priority Gaps"
   - Estimated Time: 2-4 hours

---

## Migration Execution Checklist

### Pre-Migration

- [ ] Review all migration scripts
- [ ] Test migrations in development/staging environment
- [ ] Verify rollback scripts work correctly
- [ ] Schedule maintenance window (if needed)
- [ ] Notify team of migration schedule

### Migration Execution

- [ ] Execute Phase 1 migrations (Critical gaps)
  - [ ] Batch 1: users table fields
  - [ ] Batch 2: conversations.lifecycle_state
  - [ ] Batch 3: follow_ups table
  - [ ] Batch 4: meetings table
  - [ ] Batch 5: meeting_attendees table
- [ ] Execute Phase 2 migrations (High priority gaps)
  - [ ] Batch 6: messages.delivered_at
  - [ ] Batch 7: disputes.evidence
- [ ] Verify all migrations successful
- [ ] Verify indexes created
- [ ] Verify constraints created

### Post-Migration

- [ ] Update schema version number
- [ ] Update documentation (if needed)
- [ ] Verify application connectivity
- [ ] Run smoke tests
- [ ] Update change log (this document)

---

## Rollback Procedures

All migration scripts include rollback procedures. See `schema-updates-phase0-6-critical-gaps.md` for detailed rollback scripts.

**Rollback Order (Reverse of Migration Order):**
1. meeting_attendees table (DROP TABLE)
2. meetings table (DROP TABLE)
3. follow_ups table (DROP TABLE)
4. conversations.lifecycle_state (DROP COLUMN, DROP INDEX)
5. users table fields (DROP COLUMNS, DROP INDEXES)
6. messages.delivered_at (DROP COLUMN, DROP INDEX)
7. disputes.evidence (DROP COLUMN, DROP INDEX)

---

## Related Documents

- [Schema Design](schema-design.md) - Current schema specification
- [ERD](erd.md) - Entity relationship diagram
- [Data Dictionary](data-dictionary.md) - Field definitions
- [Schema Updates - Critical Gaps](schema-updates-phase0-6-critical-gaps.md) - Detailed migration scripts
- [Consolidated Gap Analysis](phase-0-6-consolidated-gaps.md) - Complete gap analysis
- [Audit Report](phase-0-6-audit-report.md) - Comprehensive audit report

---

**Change Log Maintained By:** Nadia (Database Specialist)  
**Next Review:** After migration execution
