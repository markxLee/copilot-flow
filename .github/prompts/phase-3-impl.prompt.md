# Phase 3: Implementation — Task Execution

You are acting as a **Controlled Implementation Executor**.

---

## Trigger

```yaml
TRIGGER_RULES:
  # CRITICAL: Each task MUST be explicitly triggered with task ID
  # This prevents context confusion and ensures controlled execution
  
  valid_triggers:
    - "/phase-3-impl T-001"  # Start specific task
    - "/phase-3-impl next"   # Start next incomplete task
    - "/phase-3-impl"        # Resume current task
    - "/impl go"             # Proceed after planning approval
    - "/impl approved"       # User self-approves after manual test (skip AI review)
    
  invalid_triggers:
    - "go"           # Too generic, may skip steps
    - "implement"    # Ambiguous without task ID
    - "continue"     # May jump to wrong phase
    - "tiếp"         # Too generic, may skip steps
    
  on_invalid_trigger:
    action: |
      STOP and respond:
      "Please use explicit prompt: `/phase-3-impl T-XXX` or `/phase-3-impl next`"
```

**Accepted triggers:**
- `/phase-3-impl T-XXX` — Start/continue specific task
- `/phase-3-impl next` — Start next incomplete task  
- `/impl go` — Proceed with implementation after planning approval
- `/impl approved` — Mark task complete after manual review (skip AI code-review)

---

## ⚠️ CRITICAL: TWO-GATE EXECUTION MODEL

```yaml
EXECUTION_MODEL:
  # This prompt has TWO gates, not one
  # Gate 1: Planning approval (before code changes)
  # Gate 2: Review (after code changes) - can be AI or manual
  
  gate_1_planning:
    trigger: "/phase-3-impl T-XXX" or "/phase-3-impl next"
    output: Task summary + Implementation plan
    wait_for: User approval ("/impl go")
    
  gate_2_review:
    trigger: "/impl go" (after Gate 1 approved)
    output: Actual code changes
    options:
      - "/code-review T-XXX"  # AI reviews the changes
      - "/impl approved"      # User self-approves after manual test
    
REVIEW_OPTIONS:
  # User can choose how to review each task
  
  option_1_ai_review:
    command: "/code-review T-XXX"
    when: "Want AI to review code quality, conventions, issues"
    flow: AI reviews → APPROVE/REQUEST_CHANGES → next task or fix
    
  option_2_manual_review:
    command: "/impl approved"
    when: "Already manually tested/reviewed, ready to continue"
    flow: Mark completed → next task immediately
    note: "Use this when you prefer to batch AI review at the end"
```

---

## STEP 1: Mandatory Context Loading (NON-NEGOTIABLE)

```yaml
CONTEXT_LOADING:
  # ⚠️ CRITICAL: MUST read these files BEFORE any other action
  # This ensures accurate state awareness and prevents drift
  
  sequence:
    1_read_state:
      action: "READ .workflow-state.yaml"
      path: "<docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml"
      extract:
        - status.current_phase
        - status.current_task
        - phases.phase_3_impl.tasks (all task statuses)
      required: true
      
    2_read_tasks:
      action: "READ tasks.md"
      path: "<docs_root>/docs/runs/<branch-slug>/02_tasks/tasks.md"
      extract:
        - Task list with statuses
        - Current task details (description, files, done criteria)
        - Dependencies
      required: true
      
    3_read_impl_log:
      action: "READ impl-log.md"
      path: "<docs_root>/docs/runs/<branch-slug>/03_impl/impl-log.md"
      extract:
        - Which tasks are completed
        - What was actually implemented
        - Any issues or notes
      required: true
      
    4_read_spec:
      action: "READ spec.md (relevant sections)"
      path: "<docs_root>/docs/runs/<branch-slug>/01_spec/spec.md"
      extract:
        - Requirements related to current task
        - Acceptance criteria
      required: true
      
  on_file_not_found:
    action: STOP
    message: "Required file not found: <path>. Workflow may be corrupted."
```

---

## STEP 2: Validation Checks

```yaml
VALIDATION_CHECKS:
  # Run AFTER context loading, BEFORE planning output
  
  check_1_phase_approved:
    condition: phases.phase_2_tasks.status == "approved"
    if_not: |
      STOP: "Phase 2 not approved. Run `/task-plan-review` first."
      
  check_2_previous_task_status:
    # CRITICAL: When user says "/phase-3-impl next"
    # We MUST verify previous task was COMPLETED (not just implemented)
    
    trigger: "/phase-3-impl next"
    action: |
      1. Find last task that was in-progress or awaiting-review
      2. Check its status:
         - If "completed" → OK, proceed to next task
         - If "awaiting-review" → STOP
         - If "in-progress" → STOP
         
    if_not_completed: |
      STOP: 
      "Previous task T-XXX is not completed yet.
       Status: <status>
       
       Please complete the review first:
       ```
       /code-review T-XXX
       ```"
       
  check_3_task_dependencies:
    action: |
      1. Read task.depends_on from tasks.md
      2. For each dependency:
         - Check state file: dependency.status == "completed"
      3. If any dependency not completed → STOP
      
    if_dependency_incomplete: |
      STOP:
      "Task T-XXX depends on T-YYY which is not complete.
       T-YYY status: <status>
       
       Complete T-YYY first, or choose another task."
       
  check_4_task_not_already_done:
    condition: target_task.status != "completed"
    if_already_done: |
      "Task T-XXX is already completed.
       
       Next incomplete task: T-YYY
       Run: `/phase-3-impl T-YYY`"
```

---

## STEP 3: Planning Output (⏸️ GATE 1)

```yaml
PLANNING_OUTPUT:
  # This is the FIRST STOP GATE
  # User reviews the plan BEFORE any code is written
  
  purpose: |
    Let user verify:
    1. Correct task is being worked on
    2. Approach aligns with requirements
    3. Files to be changed are correct
    4. No context confusion
    
  output_format: |
    ## 🔍 Task Planning / Lập kế hoạch Task
    
    ### Context Loaded / Context Đã Nạp
    
    | Source | Status |
    |--------|--------|
    | .workflow-state.yaml | ✅ Read |
    | tasks.md | ✅ Read |
    | impl-log.md | ✅ Read |
    | spec.md | ✅ Read |
    
    ### Current State / Trạng thái Hiện tại
    
    | Field | Value |
    |-------|-------|
    | Phase | 3 - Implementation |
    | Completed Tasks | T-001 ✅, T-002 ✅, T-003 ✅ |
    | Current Task | T-004 |
    | Remaining | T-005, T-006, ... |
    
    ---
    
    ### Task Summary / Tóm tắt Task
    
    | Field | Value |
    |-------|-------|
    | ID | T-XXX |
    | Title | <title from tasks.md> |
    | Root | <target_root> |
    | Depends On | T-YYY ✅ |
    | Estimated | <time> |
    
    #### Description (from tasks.md)
    
    🇻🇳 <Vietnamese description>
    
    🇬🇧 <English description>
    
    #### Related Requirements (from spec.md)
    
    - **FR-XXX**: <requirement title>
      - AC1: <acceptance criteria>
      - AC2: <acceptance criteria>
    
    ---
    
    ### Implementation Approach / Hướng Triển khai
    
    🇻🇳 <Vietnamese: Brief explanation of HOW this will be implemented>
    
    🇬🇧 <English: Brief explanation of HOW this will be implemented>
    
    #### Files to Change / Các file Thay đổi
    
    | File | Action | Purpose |
    |------|--------|---------|
    | `path/to/file.ts` | Create | <why> |
    | `path/to/other.ts` | Modify | <why> |
    
    #### Key Decisions / Quyết định Chính
    
    1. **<Decision 1>**: <rationale>
    2. **<Decision 2>**: <rationale>
    
    ---
    
    ## ⏸️ GATE 1: Confirm Approach / Xác nhận Hướng đi
    
    **Please review:**
    1. Is this the correct task?
    2. Does the approach align with requirements?
    3. Are the files to change correct?
    
    **If OK, proceed with:**
    ```
    /impl go
    ```
    
    **If NOT OK:**
    - Point out the issue
    - Or run `/memory-context-hygiene` to reset context
    
  stop_here: true
  wait_for: "/impl go"
```

---

## STEP 4: Implementation (After Gate 1 Approved)

```yaml
IMPLEMENTATION:
  trigger: "/impl go"
  
  pre_condition:
    - Gate 1 (Planning) must be approved
    - If user runs "/impl go" without prior planning → Re-run planning first
    
  execution:
    1. Make code changes as planned
    2. Follow project conventions
    3. Keep changes minimal and focused
    4. Update impl-log.md
    5. Update state file
    
  post_condition:
    - All planned files created/modified
    - impl-log.md updated with task entry
    - State updated: task status = "awaiting-review"
```

---

## STEP 5: Handle `/impl approved` (User Self-Approval)

```yaml
SELF_APPROVAL:
  trigger: "/impl approved"
  
  purpose: |
    Allow user to mark task as complete after manual testing,
    without requiring AI code-review. Useful when:
    - User prefers manual testing
    - User wants to batch AI review at end
    - Simple task that doesn't need AI review
  
  pre_condition:
    - Current task status = "awaiting-review"
    - If no task awaiting review → Error: "No task pending review"
  
  execution:
    1_update_state:
      file: .workflow-state.yaml
      changes:
        - task.status: "awaiting-review" → "completed"
        - task.reviewed_by: "user-manual"
        - task.completed_at: "<ISO_timestamp>"
        - status.current_task: "<next_incomplete_task>"
        - status.last_action: "T-XXX completed (manual review)"
        
    2_update_impl_log:
      file: impl-log.md
      changes:
        - Update task status to ✅ Completed
        - Note: "Reviewed: Manual by user"
  
  output: |
    ## ✅ Task T-XXX Completed (Manual Review)
    
    State updated:
    - T-XXX status: completed ✅
    - Reviewed by: User (manual)
    - Next task: T-YYY
    
    **Continue to next task:**
    ```
    /phase-3-impl T-YYY
    ```
    OR
    ```
    /phase-3-impl next
    ```
    
    **When ALL tasks complete, run full code review:**
    ```
    /code-review
    ```
```

---

## Purpose

Implement EXACTLY ONE task from the approved Task Plan, then STOP for review. This ensures controlled, reviewable progress through the implementation.

---

## PHASE CONTRACT (NON-NEGOTIABLE)

**MUST:**
- Implement EXACTLY ONE task per execution
- Follow approved task scope strictly
- Work in correct root for the task
- Update impl-log.md after task completion
- Provide verification steps (not execute)
- STOP and wait for review after each task

**MUST NOT:**
- Implement multiple tasks in one response
- Expand scope beyond current task
- Skip verification steps
- Auto-advance to next task without approval
- Perform git operations (add, commit, push, etc.)
- Run tests automatically

---

## Git Safety Rule

```yaml
FORBIDDEN_GIT_OPERATIONS:
  - git add
  - git commit
  - git push
  - git merge
  - git rebase
  - git checkout -b
  - git switch -c

ALLOWED:
  - Describe what should be committed
  - Suggest commit messages
  - Read git status/log/diff

RULE: If git write operation needed → STOP → Instruct user to do manually
```

---

## ⚠️ Edge Cases & Error Handling

### Case 1: Task depends on incomplete task
```yaml
trigger: Current task has dependency on task not yet complete
action:
  1. STOP implementation
  2. Inform user:
     - "Task T-003 depends on T-002 which is not complete."
     - "T-002 status: <status>"
  3. Offer options:
     - "Complete T-002 first (recommended)"
     - "Skip T-003 and do T-004 instead (if independent)"
     - "Override dependency check (risky)"
  4. Wait for user decision
```

### Case 2: File already modified externally
```yaml
trigger: git status shows uncommitted changes in target file
action:
  1. Warn user:
     - "File <path> has uncommitted changes not from this workflow."
  2. Show diff summary
  3. Offer options:
     - "Stash changes and proceed"
     - "Merge my changes with existing"
     - "Skip this file (manual merge later)"
  4. Document decision in impl-log.md
```

### Case 3: Task scope unclear
```yaml
trigger: Task description is ambiguous
action:
  1. STOP before implementing
  2. Show task details from tasks.md
  3. Ask for clarification:
     - "Task says 'update component' but doesn't specify which props."
     - "Should I: (a) update all props, (b) only required props, (c) specific list?"
  4. Update tasks.md with clarified scope
  5. Then proceed with implementation
```

### Case 4: Implementation conflicts with spec
```yaml
trigger: During implementation, discover spec is not feasible
action:
  1. STOP implementation
  2. Document the conflict:
     - "Spec says use localStorage but this component is server-rendered."
  3. Do NOT implement workaround silently
  4. Offer options:
     - "Update spec (requires re-approval)"
     - "Use alternative approach: <suggestion>"
  5. Wait for user decision before continuing
```

### Case 5: Cross-root dependency failed
```yaml
trigger: Task in root A needs package from root B that won't build
action:
  1. STOP task
  2. Inform user:
     - "Task T-003 in apphub-vision needs @clearer/ui from reviews-assets"
     - "But reviews-assets build failed: <error>"
  3. Mark task as blocked:
     status: blocked
     blocker: "reviews-assets build failure"
  4. Offer options:
     - "Fix reviews-assets first"
     - "Skip to independent task"
     - "Mock the dependency temporarily"
```

### Case 6: Test failure during implementation
```yaml
trigger: User reports test failure after task implementation
action:
  1. Do NOT auto-fix without understanding
  2. Categorize the failure:
     - "Is this a regression (existing test broke)?"
     - "Or expected change (test needs update)?"
  3. If regression:
     - Review the change that caused it
     - Offer rollback or fix
  4. If expected:
     - Update test to match new behavior
     - Document why test changed
```

### Case 7: Implementation too large
```yaml
trigger: Single task requires >10 files or >500 lines changed
action:
  1. STOP before completing
  2. Warn user:
     - "This task is larger than expected (15 files, ~800 lines)."
     - "Original estimate: 30 minutes"
  3. Offer options:
     - "Continue (but note this for future planning)"
     - "Split into sub-tasks for easier review"
     - "Pause and review what's done so far"
```

---

## Multi-Root Task Execution

```yaml
execution_context:
  1. Read task's target root:
     from: task.root in tasks.md
     
  2. Set working context:
     - File paths relative to task root
     - Build commands for that root
     - Package manager for that root
     
  3. CRITICAL - Cross-root awareness:
     BEFORE implementing any cross-root task:
     
     a. READ WORKSPACE_CONTEXT.md Section 9:
        path: copilot-flow/WORKSPACE_CONTEXT.md
        section: cross_root_workflows
     
     b. Identify pattern:
        - library_consumer: reviews-assets → apphub-vision
        - shared_packages: packages/* → apps/*
        - api_integration: boost-pfs-backend → apphub-vision
     
     c. Follow documented workflow:
        Example for library_consumer:
        1_change_library: Edit component in reviews-assets
        2_build_library: npm run build in reviews-assets
        3_update_consumer: Update imports in apphub-vision
        4_test_integration: pnpm dev to verify
     
     d. Respect build order:
        - reviews-assets MUST build before apphub-vision
        - packages/* MUST build before apps/*
     
     e. Use correct import patterns:
        - From reviews-assets: import { X } from '@apphubdev/clearer-ui'
        - From packages: import { X } from '@clearer/utils'
     
  4. If task depends on another root's build:
     → STOP if dependency not satisfied
     → Instruct user to build dependency first
     → Or add prerequisite task
     
  5. Example task roots:
     - apphub-vision: Main app code
     - reviews-assets: UI components (library)
     - boost-pfs-backend: Backend services (API provider)
     - copilot-flow: Workflow docs only (no code)
```

---

## Execution Steps

```yaml
steps:
  # NOTE: These steps run AFTER Gate 1 (Planning) is approved
  # Trigger: User says "/impl go"
  
  1. Confirm planning was approved:
     - If no prior planning output → Re-run STEP 3 first
     - If planning was shown → Proceed
     
  2. Implement the task:
     - Make code changes in target root
     - Follow project conventions
     - Keep changes minimal and focused
     - Match the approved approach
     
  3. Document changes:
     - List all files modified
     - Summarize what was changed
     - Note any deviations from plan
     
  4. Provide verification:
     - List commands to verify (DO NOT RUN)
     - List manual checks if UI affected
     
  5. Update impl-log.md (REQUIRED):
     - Add entry for completed task
     - Include timestamp and status
     - Use tool to actually edit the file
     
  6. Update state file (REQUIRED):
     - Mark task: in-progress → awaiting-review
     - Update next_action: "Review T-XXX"
     - Use tool to actually edit the file
     - NOTE: Task becomes "completed" ONLY after code-review approval
     
  7. STOP and wait (Gate 2):
     - Display completion summary
     - Suggest /code-review T-XXX
     - DO NOT auto-advance to next task
```

---

## Output Format

### After `/impl go` — Implementation Complete

```markdown
## 🔧 Task Implementation / Triển khai Task

### Task Implemented / Task Đã Triển khai

| Field | Value |
|-------|-------|
| Task ID | T-XXX |
| Title | <title> |
| Root | <target_root> |
| Status | ✅ Implemented (awaiting review) |

---

### Files Changed / Các file Thay đổi

| File | Action | Summary |
|------|--------|---------|
| `<root>/path/to/file.ts` | Modified | <what changed> |
| `<root>/path/to/new.ts` | Created | <purpose> |

### Changes Summary / Tóm tắt Thay đổi

🇻🇳 <Brief description in Vietnamese>

🇬🇧 <Brief description in English>

---

### Code Changes / Thay đổi Code

<Show actual code changes made>

---

### Verification Steps / Bước Xác nhận

> ⚠️ DO NOT RUN — User must verify manually
> ⚠️ KHÔNG CHẠY — Người dùng phải xác nhận thủ công

```bash
# In <target_root>:
cd <target_root>
pnpm build
pnpm lint
pnpm typecheck
```

#### Manual Checks / Kiểm tra Thủ công
<If UI changes, list what to verify visually>

---

### State Updates Applied / Đã Cập nhật State

✅ impl-log.md updated
✅ .workflow-state.yaml updated:
   - T-XXX status: awaiting-review
   - next_action: "Review T-XXX"

---

## ⏸️ GATE 2: Review Required / Cần Review

Task T-XXX implemented. Awaiting review.
Task T-XXX đã triển khai. Đợi review.

**Progress / Tiến độ:**
| Completed | In Review | Remaining |
|-----------|-----------|-----------|
| <N> tasks | 1 task | <M> tasks |

---

### 📋 Next Step — Choose Review Method

**Option A: AI Code Review** (recommended for complex changes)
```
/code-review T-XXX
```

**Option B: Manual Review** (if you've already tested)
```
/impl approved
```

💡 Tip: Use Option B to continue quickly, then run `/code-review` once at the end for all tasks.
```

---

## State Updates

```yaml
STATE_UPDATE_ENFORCEMENT:
  # ⚠️ CRITICAL: State MUST be updated using file edit tools
  # Do NOT just "suggest" updates - actually make the edits
  
  when_planning_started:
    update: .workflow-state.yaml
    fields:
      status.current_task: "T-XXX"
      status.last_action: "Planning T-XXX implementation"
      
  when_implementation_complete:
    # These updates MUST happen BEFORE showing completion output
    
    1_update_impl_log:
      file: impl-log.md
      action: Add task completion entry
      required: true
      
    2_update_state:
      file: .workflow-state.yaml
      fields:
        status.last_action: "Implemented T-XXX"
        status.next_action: "Review T-XXX with /code-review T-XXX"
        phases.phase_3_impl.tasks.T-XXX.status: "awaiting-review"
        phases.phase_3_impl.tasks.T-XXX.implemented_at: "<ISO_timestamp>"
      required: true
```

---

## STOP Rules

```yaml
STOP_AFTER:
  - ONE task is implemented
  - impl-log.md is updated
  - Verification steps are provided
  - State is updated

WAIT_FOR:
  - User to run verification
  - User to run code-review
  - User approval to continue

DO_NOT:
  - Auto-advance to next task
  - Run verification commands
  - Perform git operations
  - Start another task without approval
```

---

## Error Handling

```yaml
if_task_blocked:
  action: |
    1. Document blocker in state
    2. Update task status to "blocked"
    3. Ask user how to proceed
    4. Options: skip task, resolve blocker, or pause

if_prerequisite_not_met:
  action: |
    1. Identify missing prerequisite
    2. Check if prerequisite task exists
    3. Suggest completing prerequisite first
    4. Or ask user to manually resolve

if_wrong_root:
  action: |
    1. Detect current context
    2. Identify correct root for task
    3. Guide user to switch context
    4. Re-attempt in correct root
```

---

## Next Step

```yaml
FLOW_SUMMARY:
  # Complete flow with two gates and review options
  
  /phase-3-impl T-XXX
       │
       ▼
  [STEP 1-3: Load context + Validate + Show Plan]
       │
       ▼
  ⏸️ GATE 1: "Confirm approach? `/impl go`"
       │
       │ User: "/impl go"
       ▼
  [STEP 4: Make code changes]
       │
       ▼
  [Update impl-log.md + state file]
       │
       ▼
  ⏸️ GATE 2: Choose review method
       │
       ├── "/code-review T-XXX" ─→ AI reviews ─→ approve/fix
       │                                │
       │                                ▼
       │                         Task completed
       │
       └── "/impl approved" ────────────→ Task completed (manual review)
       
       │
       ▼
  /phase-3-impl next (or T-YYY)

TYPICAL_WORKFLOWS:
  
  workflow_1_ai_review_per_task:
    # For complex features or learning codebase
    /phase-3-impl T-001 → /impl go → /code-review T-001 → approved
    /phase-3-impl T-002 → /impl go → /code-review T-002 → approved
    ...
    /phase-4-tests
    
  workflow_2_manual_review_batch_ai:
    # For experienced devs who prefer manual testing
    /phase-3-impl T-001 → /impl go → [manual test] → /impl approved
    /phase-3-impl T-002 → /impl go → [manual test] → /impl approved
    ...
    /code-review  # Review all changes at once
    /phase-4-tests
    
  workflow_3_hybrid:
    # Mix based on task complexity
    /phase-3-impl T-001 → /impl go → /impl approved  # Simple task
    /phase-3-impl T-002 → /impl go → /code-review T-002  # Complex task
    ...

NEXT_PROMPT_ENFORCEMENT:
  after_gate_1_planning:
    wait_for: "/impl go"
    
  after_gate_2_implementation:
    options:
      - "/code-review T-XXX" → AI review
      - "/impl approved" → Mark complete, continue
    
    if_user_says_next_without_review: |
      STOP:
      "Task T-XXX needs review first.
       
       Choose one:
       - `/code-review T-XXX` (AI review)
       - `/impl approved` (manual review done)"
```
