# Seed Data Playbook - Review Assignments

**Document:** `docs/05-project-management/phase-1-1-mockdata.md`  
**Coordinator:** Hassan  
**Status:** ⏳ **PENDING REVIEW**  
**Created:** 2026-01-XX

---

## 📋 Review Assignments

### 1. Database Integrity Review
**Reviewer:** Nadia (Database Architect)  
**Status:** ⏳ Pending  
**Due Date:** [To be set]  
**Priority:** High

**Review Focus:**
- [ ] UPSERT patterns are correct (ON CONFLICT handling)
- [ ] Foreign key relationships are valid
- [ ] Deterministic UUID allocation strategy is sound
- [ ] Database constraints are satisfied
- [ ] No orphaned records possible
- [ ] Idempotency patterns are safe to re-run

**Review Sections:**
- Idempotency Patterns (Lines 59-120)
- Deterministic UUID Generation Strategy (Lines 95-120)
- All 7 seed stages (Lines 140-270)

**Feedback Location:** [Review Template](./review-template-nadia.md)

---

### 2. Realism Validation Review
**Reviewer:** Farah (Business Analyst / Domain Expert)  
**Status:** ⏳ Pending  
**Due Date:** [To be set]  
**Priority:** High

**Review Focus:**
- [ ] Company names are realistic
- [ ] Product names are realistic
- [ ] Quantities and values are realistic
- [ ] Dates and timelines are realistic
- [ ] Scenario packs cover real-world cases
- [ ] Acceptance criteria match business requirements

**Review Sections:**
- Scenario Packs (Lines 37-52)
- All 7 seed stages - Acceptance Criteria (Lines 140-270)
- Minimum Data Requirements (Lines 153-159)

**Feedback Location:** [Review Template](./review-template-farah.md)

---

### 3. RLS Validation Review
**Reviewer:** Rafi (Security & RLS Specialist)  
**Status:** ⏳ Pending  
**Due Date:** [To be set]  
**Priority:** High

**Review Focus:**
- [ ] RLS validation procedures are correct
- [ ] Test scripts are accurate
- [ ] Role coverage is complete (all 9 roles)
- [ ] Policy verification steps are clear
- [ ] Data visibility matches wireframe requirements

**Review Sections:**
- RLS Realism Validation (Lines 81-100)
- Verification Checklist (Lines 124-137)
- All 7 seed stages - RLS validation sections

**Feedback Location:** [Review Template](./review-template-rafi.md)

---

### 4. Compliance Review
**Reviewer:** Sami (Implementation Compliance Specialist)  
**Status:** ⏳ Pending  
**Due Date:** [To be set]  
**Priority:** Critical

**Review Focus:**
- [ ] Idempotency requirements are met
- [ ] Wireframe coverage is complete
- [ ] Verification checklist is comprehensive
- [ ] Compliance with Phase 1 requirements
- [ ] All gates and checkpoints are documented

**Review Sections:**
- Entire playbook
- Verification Checklist (Lines 124-137)
- All 7 seed stages

**Feedback Location:** [Review Template](./review-template-sami.md)

---

## 📅 Review Timeline

**Week 1:**
- [ ] **Day 1:** Distribute playbook to all reviewers
- [ ] **Day 2-3:** Individual reviews (Nadia, Farah, Rafi, Sami)
- [ ] **Day 4:** Collect feedback
- [ ] **Day 5:** Review meeting (if needed)

**Week 2:**
- [ ] **Day 1-2:** Address feedback
- [ ] **Day 3:** Finalize playbook
- [ ] **Day 4:** Final approval
- [ ] **Day 5:** Ready for seed data work

---

## 📝 Review Status Tracker

| Reviewer | Status | Started | Completed | Feedback Submitted |
|----------|--------|---------|-----------|-------------------|
| Nadia | ⏳ Pending | - | - | - |
| Farah | ⏳ Pending | - | - | - |
| Rafi | ⏳ Pending | - | - | - |
| Sami | ⏳ Pending | - | - | - |

---

## 🔄 Review Process

1. **Distribution:** Hassan distributes playbook to all reviewers
2. **Individual Review:** Each reviewer completes their review using their template
3. **Feedback Collection:** Reviewers submit feedback via their template
4. **Feedback Review:** Hassan reviews all feedback
5. **Address Feedback:** Hassan addresses feedback in playbook
6. **Final Review:** Sami approves final version
7. **Completion:** Playbook finalized and ready for use

---

## 📧 Communication

**Reviewers should:**
- Complete review within 3 business days
- Submit feedback via their review template
- Flag any critical issues immediately
- Contact Hassan with questions

**Hassan will:**
- Coordinate review process
- Address all feedback
- Update playbook based on reviews
- Communicate status updates

---

## ✅ Completion Criteria

- [ ] All 4 reviewers have completed their reviews
- [ ] All feedback has been addressed
- [ ] Sami has approved final version
- [ ] Playbook is finalized and ready for use
- [ ] Team notified that playbook is ready

---

**Next Step:** Distribute playbook to reviewers and set due dates.
