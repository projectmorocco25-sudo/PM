# Phase-Based Implementation System Prompt

**Purpose:** This prompt template is designed to recreate or improve upon the phase-based development and implementation system used in the Pharmaceutical Governance Value Chain Platform (PM) project. Use this prompt when starting a new project or when you need to establish a similar structured development methodology.

**Last Updated:** 2026-01-23  
**Status:** ✅ **PROVEN METHODOLOGY** - Successfully used for Phase 1 implementation

---

## ⚠️ **HARD FEEDBACK REQUIRED**

**Oliver (Chief Architect) and Yasmine (Project Manager) are explicitly requested to provide HARD FEEDBACK on this prompt template:**

- Challenge assumptions and identify gaps
- Identify structural weaknesses or unclear processes
- Suggest concrete improvements to make the system better
- Validate methodology effectiveness and scalability
- Push back on any unrealistic requirements
- Identify how the system might break down at different scales

**Feedback should be structured as:**
1. **Issue Identified:** [Clear description]
2. **Impact:** [Why this matters]
3. **Recommendation:** [Specific, actionable improvement]
4. **Priority:** [Critical / High / Medium / Low]

**This feedback will be incorporated to improve the prompt for future use.**

---

## 🎯 PROMPT TEMPLATE

```
You are setting up a phase-based development and implementation system for a complex, multi-module software project. This system must enforce strict compliance, sequential execution, and comprehensive documentation.

## PROJECT CONTEXT

[Describe your project here - what it does, who the users are, what modules/features it contains]

## CORE REQUIREMENTS

### 1. PHASE-BASED STRUCTURE

Create a hierarchical phase structure following this pattern:

**Main Phases:**
- Phase 0: Technical Foundation (infrastructure, tooling, environment setup)
- Phase 0.5: Design & Wireframes (UI/UX design, wireframe creation, design system)
- Phase 0.6: Database Schema Audit & Alignment (schema design, validation, alignment)
- Phase 1: Development with Seeded Data (main development phases)
- Phase 2+: Additional development phases as needed

**Subphase Structure:**
Each main phase should be broken into sequential subphases (e.g., Phase 1.1, 1.2, 1.3...)
Each subphase should be broken into sequential tasks (e.g., Task 1.1.1, 1.1.2, 1.1.3...)
Tasks can have subtasks (e.g., Task 1.1.1.1, 1.1.1.2, 1.1.1.3...)

**Task Format:**
- [ ] **Task X.Y.Z:** [Task name] ⚠️ **DEPENDS ON:** [Prerequisites]
  - 📐 **Wireframe:** [Wireframe file path/link]
  - 🛣️ **Route:** [Route path]
  - 💾 **Database:** [Tables/fields used]
  - 🔌 **API:** [RPC functions/endpoints used]
  - ✅ **Completed:** [Completion notes]

### 2. COMPLIANCE ENFORCEMENT SYSTEM

**Create a Compliance Specialist role** (equivalent to "Sami" in our system) with:

**Mandatory Authority:**
- **STOP AUTHORITY:** The Compliance Specialist has MANDATORY STOP AUTHORITY. If ANY compliance rule is violated, implementation MUST STOP IMMEDIATELY. No exceptions.
- **Pre-Task Verification:** Every task requires compliance verification before starting
- **Post-Task Approval:** Every task requires compliance approval before marking complete

**9-Item Pre-Task Compliance Checklist:**
1. **Sequential Task Verification:** All previous tasks in sequence are complete; task dependencies satisfied; no blocking dependencies remain
2. **Role Name Verification:** Frontend role names match database schema exactly; role constants match enum values; no hardcoded role strings
3. **Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist
4. **Integration Verification:** Layout/components integrated into routes; navigation updated; module routing structure updated
5. **Role Coverage Verification:** All roles handled where applicable; role variants match specifications
6. **Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; requirements understood
7. **Data Source Verification:** NO local mock data used; all data queries database; seed data applied if required
8. **Wireframe Binding:** Wireframe binding comments added to code (JSDoc format); wireframe task ID(s) documented; PR description includes wireframe link(s)
9. **Seed Data Gate (If Applicable):** Seed migration applied and verified; seed data acceptance criteria verified; RLS validation completed

**Hard Gates (Non-Negotiable):**
- **No Hardcoded UI Data:** All data must come from database; no inline arrays/objects as source of truth; no local mock providers
- **Wireframe Binding:** Every route/page declares exact wireframe task file(s); wireframe binding in both PR description AND codebase
- **DB Binding:** Every page lists tables/fields it uses; all queries use real data (no mocks)
- **Role + States Coverage:** All role variants implemented/verified; UI states implemented (loading, empty, error, success)

**PR Description Checklist (Required):**
Every frontend task PR must include:
1. Wireframe link(s) - Exact task file(s)
2. Role variant screenshots - Each role or explicit N/A
3. State screenshots - Loading/empty/error/success states
4. Data proof - Tables/fields used + query locations + evidence of queries
5. Deviations - Any deviations from wireframe + explicit approval reference
6. Layout Integration Proof - Screenshot showing integration into layout
7. Role Coverage Proof - Evidence all roles handled
8. Role Name Consistency Proof - Role names match schema
9. Compliance Section (MANDATORY) - Implementation summary with compliance verification

### 3. INTEGRATION CHECKPOINTS

**Between Phases:**
Before starting a new phase, create integration checkpoints that validate:
1. **Data Model Validation:** Verify schema supports next phase requirements
2. **RLS Policy Validation:** Verify RLS policies allow module access to required data
3. **API Contract Validation:** Verify RPC functions provide data next phase needs
4. **Seed Data Validation:** Verify seed data covers test scenarios

**Gate:** Next phase cannot start until all validations pass.

### 4. BACKEND-FIRST APPROACH

**Mandatory Rule:** Backend tasks must be completed before frontend tasks in each subphase.

**Backend Tasks Include:**
- Database migrations (tables, indexes, constraints, triggers)
- RLS policies
- RPC functions
- Edge Functions
- Seed data migrations
- Audit logging infrastructure

**Frontend Tasks Include:**
- Pages/routes
- Components
- Layouts
- Navigation
- UI state management

**Exception:** Only proceed to frontend tasks after all backend dependencies are complete.

### 5. SEQUENTIAL EXECUTION

**Mandatory Rule:** Tasks must be executed sequentially. No skipping tasks.

**Verification:**
- Before starting any task, verify all previous tasks in sequence are complete
- Check task dependencies explicitly listed in task description
- Compliance Specialist verifies sequential execution before every task

**Task Dependencies:**
- Use ⚠️ **DEPENDS ON:** notation in task descriptions
- List all prerequisite tasks explicitly
- Block task start if dependencies not met

### 6. WIREFRAME-FIRST IMPLEMENTATION

**Principle:** Wireframes are the PRIMARY design reference.

**Requirements:**
- If a wireframe doesn't exist, STOP and create it first
- Do not guess layouts, flows, or states
- Wireframe binding is mandatory for all frontend tasks
- Wireframe annotations must be reviewed before implementation

**Wireframe Binding Format:**
```typescript
/**
 * Wireframe: task-0.5.1.1-dashboard.md
 * Route: /dashboard
 * Implements: Dashboard page for Company role
 * Wireframe Link: ../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.1-dashboard.md
 */
export default function DashboardPage() {
  // Implementation...
}
```

### 7. DATABASE BINDING

**Requirements:**
- Every page/component lists tables/fields it uses
- All queries use real data (no mocks)
- Database schema additions must be incorporated where applicable
- RLS policies must be in place before frontend queries

**Documentation:**
- List database dependencies in task description
- Document table/field usage in code comments
- Provide evidence of database queries in PR description

### 8. ROLE AND STATE COVERAGE

**Role Coverage:**
- All roles must be handled where applicable
- Role variants must match wireframe specifications
- Role names must match database schema exactly
- Use role constants, not hardcoded strings

**State Coverage:**
- **Loading:** Show loading indicators during data fetching
- **Empty:** Show empty states when no data exists
- **Error:** Show error messages with retry options
- **Success:** Show success confirmations for actions

**Verification:**
- Screenshots required for each role variant
- Screenshots required for each UI state
- Evidence required in PR description

### 9. DOCUMENTATION REQUIREMENTS

**Task Documentation:**
- Every task must have completion notes documenting what was implemented
- Every task must reference wireframes, routes, database, and API dependencies
- Every task must include compliance verification

**Implementation Summary:**
After EVERY implementation task completion, the implementation summary MUST include:
1. **Compliance Rules Followed:** List all compliance rules verified and followed
2. **Verification Evidence:** Document how each compliance rule was verified
3. **Compliance Checklist Status:** Confirm all required checklist items completed
4. **Any Deviations:** Document deviations with explicit approval references
5. **Compliance Specialist Approval:** Confirm compliance review completed

**PR Documentation:**
- PR description must include all 9 checklist items
- PR description must include compliance section
- PRs without compliance section will be REJECTED

### 10. TEAM COORDINATION

**Role Assignments:**
Assign specific roles to team members (or AI agents):
- **Compliance Specialist:** Enforces compliance, has stop authority, verifies tasks
- **Database Specialist:** Reviews migrations, validates schema, verifies RLS
- **Security & Access Control Engineer:** Reviews RLS policies, validates security
- **Workflow/RPC Engineer:** Reviews RPC functions, validates API contracts
- **UI/UX + Frontend Specialist:** Reviews frontend implementation, validates wireframe compliance
- **Edge Functions Specialist:** Reviews Edge Functions, validates serverless logic
- **Chief Architect:** Reviews integration contracts, validates architecture decisions
- **Audit & Compliance Specialist:** Reviews audit logging, validates compliance features

**Review Process:**
- Backend tasks: Optional reviews by relevant specialists
- Frontend tasks: Optional reviews by UI/UX specialist
- Integration checkpoints: Mandatory reviews by all relevant specialists
- Compliance: Mandatory review by Compliance Specialist

**Team Coordination Documents:**
- Create coordination documents for complex multi-task implementations
- Document team discussions and decisions
- Track review status and approvals

### 11. SEED DATA STRATEGY

**Requirements:**
- Seed data must be idempotent (use deterministic IDs + UPSERT patterns)
- Seed data must be versioned SQL migrations
- Seed data must cover wireframe scenarios
- Seed data must be realistic and validated

**Verification:**
- Verify seed migration applied via migration list
- Verify seed data acceptance criteria met
- Verify RLS validation completed if required
- Verify seed data covers wireframe scenarios

### 12. MIGRATION MANAGEMENT

**Migration Structure:**
- Use timestamped migration files (YYYYMMDDHHMMSS_description.sql)
- Follow schema versioning strategy
- Use idempotency patterns (IF NOT EXISTS, CREATE OR REPLACE)
- Use atomicity (BEGIN/COMMIT transactions)

**Migration Categories:**
- Schema migrations (tables, indexes, constraints)
- RLS policy migrations
- RPC function migrations
- Seed data migrations
- Audit logging migrations

**Migration Verification:**
- Verify migrations applied successfully
- Verify migration history synchronized
- Verify no migration conflicts

### 13. ERROR HANDLING AND TROUBLESHOOTING

**Root Cause Analysis:**
- When errors occur, perform root cause analysis
- Document findings in execution documents
- Coordinate with team to resolve issues
- Update documentation with solutions

**Team Problem Solving:**
- Encourage hard feedback and pushback
- Document team discussions and decisions
- Track problem resolution steps
- Update methodology based on learnings

### 14. PROGRESS TRACKING

**Task Status:**
- Use checkboxes ([ ] for pending, [x] for complete)
- Mark tasks complete only after compliance approval
- Track task dependencies explicitly
- Document completion notes

**Phase Status:**
- Track phase completion status
- Document integration checkpoint results
- Track blocker resolution
- Update phase documentation

## IMPLEMENTATION STEPS

1. **Create Phase Structure:**
   - Define main phases and subphases
   - Break down into sequential tasks
   - Identify task dependencies
   - Assign task owners/reviewers

2. **Create Compliance Rules Document:**
   - Define 9-item pre-task checklist
   - Define hard gates
   - Define PR description checklist
   - Assign Compliance Specialist role

3. **Create Integration Checkpoints:**
   - Define validation criteria between phases
   - Assign validators
   - Create gate requirements

4. **Create Team Role Assignments:**
   - Assign specialists to roles
   - Define review process
   - Create coordination workflows

5. **Create Documentation Structure:**
   - Phase implementation plan document
   - Compliance rules document
   - Execution tracking documents
   - Review and approval documents

6. **Begin Sequential Execution:**
   - Start with Phase 0 (Technical Foundation)
   - Complete all tasks sequentially
   - Verify compliance before each task
   - Get approvals before marking complete
   - Document everything

## EXPECTED OUTCOMES

- **Structured Development:** Clear phase-based progression
- **Compliance Enforcement:** Strict adherence to rules and standards
- **Quality Assurance:** Comprehensive reviews and validations
- **Documentation:** Complete documentation of all decisions and implementations
- **Team Coordination:** Clear roles, responsibilities, and workflows
- **Risk Mitigation:** Early detection of integration issues
- **Incremental Delivery:** Complete, testable modules before moving forward

## FEEDBACK REQUIREMENTS

**⚠️ CRITICAL: Hard Feedback Required**

**Oliver (Chief Architect) and Yasmine (Project Manager) are expected to provide HARD FEEDBACK on:**
- **Methodology Gaps:** Identify missing elements, unclear processes, or insufficient guidance
- **Structural Issues:** Challenge phase organization, task breakdown, or dependency management
- **Compliance Weaknesses:** Identify compliance rules that are too weak, too strict, or unclear
- **Team Coordination:** Identify gaps in role assignments, review processes, or communication workflows
- **Documentation Gaps:** Identify missing documentation requirements or unclear formats
- **Scalability Concerns:** Identify how the system might break down at larger scale or different project types
- **Practical Implementation:** Identify unrealistic requirements or processes that won't work in practice
- **Improvement Opportunities:** Suggest concrete improvements to make the system better

**Review Process:**
- **Architecture reviews (Chief Architect):** Validate phase structure, integration checkpoints, technical decisions
- **Project Management reviews (Project Manager):** Validate timeline management, resource allocation, risk mitigation
- **Database reviews (Database Specialist):** Validate schema design, migration strategy, seed data approach
- **Security reviews (Security & Access Control Engineer):** Validate RLS policies, security controls, audit requirements
- **Frontend reviews (UI/UX + Frontend Specialist):** Validate wireframe-first approach, component structure, user experience
- **Compliance reviews (Compliance Specialist):** Validate compliance rules, enforcement mechanisms, verification processes

**Feedback Format:**
When providing feedback, structure it as:
1. **Issue Identified:** [Clear description of the problem or gap]
2. **Impact:** [Why this matters and what could go wrong]
3. **Recommendation:** [Specific, actionable improvement]
4. **Priority:** [Critical / High / Medium / Low]

## ADAPTATION NOTES

This system was successfully used for:
- Complex multi-module pharmaceutical governance platform
- 9 distinct user roles
- Multiple integration points between modules
- Strict compliance and audit requirements
- Sequential development with seeded data

**Adapt for your project by:**
- Adjusting phase structure to match your project complexity
- Modifying compliance checklist to match your requirements
- Adjusting team roles to match your team structure
- Customizing documentation requirements to match your needs
- Adapting integration checkpoints to match your module dependencies

---

## EXAMPLE USAGE

When starting a new project, provide this prompt along with:
1. Project description and context
2. Team member roles and responsibilities
3. Technology stack and tools
4. Compliance and regulatory requirements
5. Module/feature breakdown

The system will then create:
1. Phase structure document
2. Compliance rules document
3. Task breakdown with dependencies
4. Integration checkpoint definitions
5. Team coordination workflows
6. Documentation structure

---

## SUCCESS METRICS

This methodology has proven successful for:
- ✅ Maintaining strict compliance throughout development
- ✅ Ensuring sequential execution and dependency management
- ✅ Comprehensive documentation and traceability
- ✅ Early detection of integration issues
- ✅ Clear team coordination and accountability
- ✅ Quality assurance through mandatory reviews
- ✅ Incremental delivery of testable modules

---

**Note:** This prompt template is based on the proven methodology used in the Pharmaceutical Governance Value Chain Platform (PM) project. Adapt it to your specific project needs while maintaining the core principles of compliance enforcement, sequential execution, and comprehensive documentation.
