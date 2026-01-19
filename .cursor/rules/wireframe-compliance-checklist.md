# Wireframe Compliance Checklist (MANDATORY)

## ENFORCEMENT RULE

**BEFORE writing ANY code for a task with a wireframe link, you MUST:**

1. [ ] Read the ENTIRE wireframe file (not just first 100 lines)
2. [ ] Extract ALL specifications (layout, components, interactions, states)
3. [ ] Check wireframe annotations section
4. [ ] Identify ALL role-based variations
5. [ ] Verify responsive breakpoints
6. [ ] Check accessibility requirements
7. [ ] Document wireframe binding in code comments
8. [ ] THEN and ONLY THEN start implementation

## MANDATORY PRE-IMPLEMENTATION CHECKLIST

### Step 1: Read Wireframe (REQUIRED)
- [ ] Read complete wireframe file from start to end
- [ ] Note all component specifications
- [ ] Note all layout requirements
- [ ] Note all interaction requirements
- [ ] Note all state requirements (loading, error, empty, success)
- [ ] Note all role-based variations
- [ ] Note ALL responsive breakpoints (desktop, tablet, mobile) with exact measurements
- [ ] Note ALL animations (transitions, durations, easing functions)
- [ ] Note ALL accessibility requirements (ARIA labels, keyboard navigation, focus management, screen reader support)

### Step 2: Verify Requirements (REQUIRED)
- [ ] List all required components from wireframe
- [ ] List all required fields/inputs
- [ ] List all required buttons/actions
- [ ] List all required states
- [ ] List all required validations
- [ ] List all required accessibility features (ARIA labels, roles, live regions, focus trap, keyboard navigation, touch targets)
- [ ] List ALL responsive breakpoints (desktop width/height, tablet width/height, mobile width/height)
- [ ] List ALL animations (fade-in, slide-down, hover effects, transitions, durations, easing)

### Step 3: Create Implementation Plan (REQUIRED)
- [ ] Map wireframe sections to components
- [ ] Map wireframe fields to form inputs
- [ ] Map wireframe interactions to handlers
- [ ] Map wireframe states to React state/loading states
- [ ] Verify all requirements can be implemented

### Step 4: Add Wireframe Binding (REQUIRED)
- [ ] Add wireframe binding comment at top of file
- [ ] Format: `/** Wireframe: task-0.5.X.X-...md */`
- [ ] Include route and wireframe link
- [ ] Document which wireframe sections implemented

### Step 5: Implement (REQUIRED)
- [ ] Implement exactly as wireframe specifies
- [ ] Include ALL components from wireframe
- [ ] Include ALL fields from wireframe
- [ ] Include ALL interactions from wireframe
- [ ] Include ALL states from wireframe
- [ ] Include ALL validations from wireframe
- [ ] Include ALL accessibility features from wireframe
- [ ] Implement ALL responsive breakpoints (desktop, tablet, mobile) with exact measurements from wireframe
- [ ] Implement ALL animations (fade-in, slide-down, hover, transitions) with exact durations and easing from wireframe
- [ ] Implement full keyboard navigation (Tab, Enter, Arrow keys, Escape)
- [ ] Implement focus trap for modals/dropdowns
- [ ] Implement ARIA live regions for dynamic content updates
- [ ] Verify all touch targets meet minimum 40px × 40px requirement

### Step 6: Verify Before Completion (REQUIRED)
- [ ] Compare implementation to wireframe (section by section)
- [ ] Verify all components present
- [ ] Verify all fields present
- [ ] Verify all interactions work
- [ ] Verify all states implemented (loading, empty, error, success)
- [ ] Verify all validations work
- [ ] Verify all accessibility features present (ARIA labels, keyboard nav, focus trap, live regions, screen reader support)
- [ ] Verify ALL responsive breakpoints work (test at desktop, tablet, mobile sizes)
- [ ] Verify ALL animations work (fade-in, slide-down, hover effects, transitions)
- [ ] Verify keyboard navigation works (Tab, Enter, Arrow keys, Escape)
- [ ] Verify focus trap works (for modals/dropdowns)
- [ ] Verify ARIA live regions announce changes
- [ ] Only mark complete if 100% wireframe compliance achieved (including responsive, animations, accessibility)

## COMPLIANCE GATE

**STOP conditions (DO NOT PROCEED):**
- ❌ If wireframe not read completely (including responsive behavior and accessibility sections)
- ❌ If wireframe requirements unclear
- ❌ If wireframe file doesn't exist (STOP and request wireframe)
- ❌ If implementation deviates from wireframe (document deviation and get approval)
- ❌ If wireframe binding comment missing
- ❌ If any wireframe component/field/state missing
- ❌ If responsive breakpoints missing or incorrect
- ❌ If animations missing or incorrect (durations, easing, effects)
- ❌ If accessibility features missing (ARIA labels, keyboard nav, focus trap, live regions)

## VIOLATION PENALTY

**If compliance violated:**
1. Mark task as INCOMPLETE
2. Document all violations
3. Fix all violations before proceeding
4. Re-verify compliance
5. Do NOT mark task complete until fully compliant
