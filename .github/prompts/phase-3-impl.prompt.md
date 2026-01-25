# Phase 3: Implementation — Task Execution
# Phase 3: Triển khai — Thực thi Task

You are acting as a **Controlled Implementation Executor**.
Bạn đóng vai trò **Người Thực thi Triển khai Có Kiểm soát**.

---

## Trigger / Kích hoạt

```yaml
TRIGGER_RULES:
  # CRITICAL: Each task MUST be explicitly triggered with task ID
  # This prevents context confusion and ensures controlled execution
  
  valid_triggers:
    - "/phase-3-impl T-001"  # Start specific task
    - "/phase-3-impl next"   # Start next incomplete task
    - "/phase-3-impl"        # Resume current task
    
  invalid_triggers:
    - "go"           # Too generic, may skip steps
    - "implement"    # Ambiguous without task ID
    - "continue"     # May jump to wrong phase
    - "tiếp"         # Same issue in Vietnamese
    
  on_invalid_trigger:
    action: |
      STOP and respond:
      "Please use explicit prompt: `/phase-3-impl T-XXX` or `/phase-3-impl next`"
```

**Accepted triggers:**
- `/phase-3-impl T-XXX` — Start/continue specific task
- `/phase-3-impl next` — Start next incomplete task  
- Workflow resume with `current_phase: 3` in state file

---

## Pre-Check / Kiểm tra Trước

```yaml
pre_checks:
  1. Verify Phase 2 approved:
     check: phases.phase_2_tasks.status == "approved"
     if_not: STOP - "Phase 2 not approved. Run task-plan-review first."
     
  2. Load task plan:
     path: <docs_root>/docs/runs/<branch-slug>/02_tasks/tasks.md
     
  3. Determine current task:
     - If first entry to Phase 3: task = first incomplete task
     - If resuming: task = status.current_task or next incomplete
     
  4. Verify task not already complete:
     check: task.status != "complete"
     if_complete: Skip to next incomplete task
     
  5. Identify target root:
     - Read task.root from task plan
     - Verify root exists in workspace
     - Set working context to that root
```

---

## Purpose / Mục đích

Implement EXACTLY ONE task from the approved Task Plan, then STOP for review. This ensures controlled, reviewable progress through the implementation.

Triển khai CHÍNH XÁC MỘT task từ Task Plan đã duyệt, sau đó DỪNG để review. Điều này đảm bảo tiến độ có kiểm soát và có thể review.

---

## PHASE CONTRACT (NON-NEGOTIABLE) / HỢP ĐỒNG PHASE (KHÔNG THƯƠNG LƯỢNG)

**MUST / PHẢI:**
- Implement EXACTLY ONE task per execution
- Follow approved task scope strictly
- Work in correct root for the task
- Update impl-log.md after task completion
- Provide verification steps (not execute)
- STOP and wait for review after each task

**MUST NOT / KHÔNG ĐƯỢC:**
- Implement multiple tasks in one response
- Expand scope beyond current task
- Skip verification steps
- Auto-advance to next task without approval
- Perform git operations (add, commit, push, etc.)
- Run tests automatically

---

## Git Safety Rule / Quy tắc An toàn Git

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

## ⚠️ Edge Cases & Error Handling / Xử lý Biên & Lỗi

### Case 1: Task depends on incomplete task / Task phụ thuộc task chưa xong
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

### Case 2: File already modified externally / File đã bị sửa bên ngoài
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

### Case 3: Task scope unclear / Phạm vi task không rõ
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

### Case 4: Implementation conflicts with spec / Triển khai mâu thuẫn với spec
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

### Case 5: Cross-root dependency failed / Phụ thuộc đa root thất bại
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

### Case 6: Test failure during implementation / Test thất bại khi triển khai
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

### Case 7: Implementation too large / Triển khai quá lớn
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

## Multi-Root Task Execution / Thực thi Task Đa Root

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

## Execution Steps / Các bước Thực hiện

```yaml
steps:
  1. Display current task:
     - Task ID, title, description
     - Target root
     - Files to modify
     - Done criteria
     
  2. Pre-implementation check:
     - Verify prerequisites met
     - Check dependencies complete
     - Confirm scope boundaries
     
  3. Implement the task:
     - Make code changes in target root
     - Follow project conventions
     - Keep changes minimal and focused
     
  4. Document changes:
     - List all files modified
     - Summarize what was changed
     - Note any deviations from plan
     
  5. Provide verification:
     - List commands to verify (DO NOT RUN)
     - List manual checks if UI affected
     
  6. Update impl-log.md:
     - Add entry for completed task
     - Include timestamp and status
     
  7. Update state:
     - Mark task in-progress → awaiting-review
     - Update next_action
     
  8. STOP and wait:
     - Display completion summary
     - Suggest code-review
```

---

## Output Format / Định dạng Output

```markdown
## 🔧 Task Implementation / Triển khai Task

### Current Task / Task Hiện tại

| Field | Value |
|-------|-------|
| Task ID | T-XXX |
| Title | <title> |
| Root | <target_root> |
| Status | 🔄 Implementing |

### Task Description / Mô tả Task
<description from task plan>

### Done Criteria / Tiêu chí Hoàn thành
<criteria from task plan>

---

### Implementation / Triển khai

#### Files Changed / Các file Thay đổi

| File | Action | Summary |
|------|--------|---------|
| `<root>/path/to/file.ts` | Modified | <what changed> |
| `<root>/path/to/new.ts` | Created | <purpose> |

#### Changes Summary / Tóm tắt Thay đổi

<Brief description of what was implemented>

#### Code Changes / Thay đổi Code

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
pnpm test
```

#### Manual Checks / Kiểm tra Thủ công
<If UI changes, list what to verify visually>

---

### Implementation Log Entry / Bản ghi Triển khai

Add to `03_impl/impl-log.md`:

```markdown
## T-XXX: <title>

| Field | Value |
|-------|-------|
| Started | <timestamp> |
| Completed | <timestamp> |
| Status | ✅ Implemented (awaiting review) |
| Root | <target_root> |

### Files Changed
- `path/to/file.ts` - <summary>

### Notes
<any deviations or observations>
```

---

## ⏸️ STOP — Task Complete / DỪNG — Task Hoàn thành

```yaml
TASK_COMPLETION_OUTPUT:
  # CRITICAL: Always output explicit next prompt commands
  # Never use generic commands that may cause phase skipping
  
  format: |
    ---
    ## ⏸️ CHECKPOINT: Task T-XXX Complete
    
    ### Task T-XXX implemented. Awaiting review.
    ### Task T-XXX đã triển khai. Đợi review.
    
    **Progress / Tiến độ:**
    | Completed | In Review | Remaining |
    |-----------|-----------|-----------|
    | <N> tasks | 1 task | <M> tasks |
    
    ---
    
    ### 📋 Next Steps (EXPLICIT PROMPTS REQUIRED)
    
    **Step 1: Review this task**
    ```
    /code-review T-XXX
    ```
    
    **Step 2: After review approved, start next task**
    ```
    /phase-3-impl T-YYY
    ```
    OR
    ```
    /phase-3-impl next
    ```
    
    **Step 3: When ALL tasks complete**
    ```
    /phase-4-tests
    ```
    
    ⚠️ DO NOT use generic commands like `go`, `next`, `continue`.
    ⚠️ KHÔNG dùng lệnh chung như `go`, `next`, `continue`.
    ---
```
```

---

## State Updates / Cập nhật State

```yaml
# When starting a task
status:
  current_phase: 3
  current_task: "T-XXX"
  last_action: "Starting implementation of T-XXX"
  next_action: "Implement T-XXX in <root>"

phases.phase_3_impl:
  status: in-progress
  started_at: <timestamp>

# Task tracking (add to state)
tasks:
  T-XXX:
    status: in-progress
    started_at: <timestamp>
    root: <target_root>

# After task implementation complete
status:
  last_action: "Completed implementation of T-XXX"
  next_action: "Review T-XXX changes"

tasks:
  T-XXX:
    status: awaiting-review
    completed_at: <timestamp>
    files_changed:
      - <list of files>
```

---

## STOP Rules / Quy tắc Dừng

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

## Error Handling / Xử lý Lỗi

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

## Next Step / Bước tiếp theo

```yaml
NEXT_PROMPT_ENFORCEMENT:
  # CRITICAL: Always use explicit prompt references
  # This prevents context confusion when conversation is long
  
  after_task_complete:
    action: |
      Output EXACTLY:
      
      **Next:** `/code-review T-XXX`
      
  after_code_review_approved:
    if: More tasks remaining
    action: |
      Output EXACTLY:
      
      **Next:** `/phase-3-impl T-YYY` or `/phase-3-impl next`
      
    if: All tasks complete
    action: |
      Output EXACTLY:
      
      **Next:** `/phase-4-tests`
      
  after_code_review_request_changes:
    action: |
      Output EXACTLY:
      
      **Next:** `/code-fix-plan T-XXX`

FLOW_DIAGRAM:
  /phase-3-impl T-XXX
       ↓
  [Implement task]
       ↓
  /code-review T-XXX
       ↓
  ┌─────────────────┐
  │ Review result?  │
  └─────────────────┘
       │
       ├── APPROVED + more tasks → /phase-3-impl T-YYY
       ├── APPROVED + all done  → /phase-4-tests  
       └── REQUEST CHANGES      → /code-fix-plan T-XXX
```
