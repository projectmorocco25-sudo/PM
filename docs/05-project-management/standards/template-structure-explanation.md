# Template Structure Explanation

**Date:** 2026-01-26  
**Purpose:** Clarify the relationship between phase file template and task templates  
**Status:** ✅ **CURRENT STRUCTURE**

---

## Template Files Overview

You have **4 template files** that serve different purposes:

### 1. Phase File Template (Main Registry)
**File:** `standards/phase-file-template.md`  
**Purpose:** Template for creating the main phase file (registry/index)  
**Usage:** When creating a new phase file (e.g., `phase-1-2-vci.md`)

**What it contains:**
- Phase header and metadata
- Compliance rules section
- Executive summary
- Subphase structure
- **Task registry entries** (links to task files, not full details)

**Key Point:** This is the **registry/index** - it links to task files, doesn't contain full task details.

---

### 2. Frontend Task Template
**File:** `standards/task-templates/frontend-task-template.md`  
**Purpose:** Template for creating individual frontend task files  
**Usage:** When creating a frontend implementation task file

**What it contains:**
- Complete structure for frontend tasks
- Verification tasks (a, b, c)
- Implementation task
- Compliance verification task
- All acceptance criteria and verification steps

**Key Point:** This is used to create task files in `phase-X-Y/tasks/frontend/`

---

### 3. Backend Task Template
**File:** `standards/task-templates/backend-task-template.md`  
**Purpose:** Template for creating individual backend task files  
**Usage:** When creating a backend implementation task file

**What it contains:**
- Simplified structure for backend tasks (no wireframe verification)
- Database/API verification (if applicable)
- Implementation task
- Compliance verification task

**Key Point:** This is used to create task files in `phase-X-Y/tasks/backend/`

---

### 4. Migration Task Template
**File:** `standards/task-templates/migration-task-template.md`  
**Purpose:** Template for creating individual migration task files  
**Usage:** When creating a database migration task file

**What it contains:**
- Three-step pattern: create → apply → verify
- Migration creation task
- Migration apply task
- Migration verify task

**Key Point:** This is used to create task files in `phase-X-Y/tasks/migrations/`

---

## How They Work Together

### Creating a New Phase File

1. **Use Phase File Template:**
   - Copy `standards/phase-file-template.md`
   - Create `phase-X-Y.md`
   - Fill in phase-specific content (header, summary, subphases)

2. **Create Directory Structure:**
   - Create `phase-X-Y/tasks/frontend/`
   - Create `phase-X-Y/tasks/backend/`
   - Create `phase-X-Y/tasks/migrations/`

3. **Create Task Files:**
   - For each task, copy appropriate template from `standards/task-templates/`
   - Create task file: `phase-X-Y/tasks/[category]/[task-id]-[name].md`
   - Fill in task-specific details

4. **Link Tasks in Phase File:**
   - Add task entry to phase file registry
   - Link to task file: `[tasks/frontend/X.Y.Z-feature-name.md](./phase-X-Y/tasks/frontend/X.Y.Z-feature-name.md)`

---

## Example Workflow

### Step 1: Create Phase File
```
Copy: standards/phase-file-template.md
To:   phase-1-2-vci.md
Fill: Phase header, summary, subphase structure
```

### Step 2: Create Task File
```
Copy: standards/task-templates/frontend-task-template.md
To:   phase-1-2-vci/tasks/frontend/1.2.1.1-msq-list.md
Fill: Task-specific details (wireframes, routes, database, API)
```

### Step 3: Link in Phase File
```
In phase-1-2-vci.md:
- [ ] Task 1.2.1.1: Implement MSQ list page
  - 📋 Details: [tasks/frontend/1.2.1.1-msq-list.md](./phase-1-2-vci/tasks/frontend/1.2.1.1-msq-list.md)
```

---

## File Size Comparison

### Old Approach (Monolithic)
```
phase-1-1-rmm.md: 694 lines (would be 2000+ with full compliance)
├── All task details inline
├── Hard to navigate
└── Merge conflicts
```

### New Approach (Modular)
```
phase-1-1-rmm.md: 313 lines (registry)
├── Links to task files
├── Easy to navigate
└── No merge conflicts

phase-1-1-rmm/tasks/frontend/
├── 1.1.1.9-core-layout.md (180 lines)
├── 1.1.1.10-authentication.md (180 lines)
└── 1.1.2.16.1-rmm-overview.md (180 lines)
```

---

## Template Hierarchy

```
standards/
├── phase-file-template.md          ← Main phase file structure (registry pattern)
└── task-templates/
    ├── frontend-task-template.md   ← Individual frontend task structure
    ├── backend-task-template.md    ← Individual backend task structure
    └── migration-task-template.md  ← Individual migration task structure
```

**Relationship:**
- **Phase File Template** = Structure for the main file (registry)
- **Task Templates** = Structure for individual task files
- **Phase File** links to **Task Files** created from **Task Templates**

---

## Summary

**Yes, having multiple templates is correct!**

1. **`phase-file-template.md`** - For creating the main phase file (registry/index)
2. **`task-templates/*.md`** - For creating individual task files

They serve different purposes:
- Phase template = Registry structure
- Task templates = Individual task structure

This separation enables:
- Scalability (main file stays small)
- Maintainability (easy to find/update tasks)
- Reusability (templates used across all phases)

---

**Last Updated:** 2026-01-26  
**Status:** ✅ **CURRENT STRUCTURE - CORRECT**
