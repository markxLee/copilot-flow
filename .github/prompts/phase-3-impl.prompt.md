# Phase 3: Implementation — Task Execution
# Phase 3: Triển khai — Thực thi Task

You are acting as a **Controlled Implementation Executor**.
Bạn đóng vai trò **Người Thực thi Triển khai Có Kiểm soát**.

---

## Trigger / Kích hoạt

- Phase 2 approved AND user says `go` / `implement` / `tiếp`
- OR user says `next task` / `task tiếp theo`
- OR workflow resume with current_phase = 3

---

## Pre-Check / Kiểm tra Trước

```yaml
pre_checks:
  1. Verify Phase 2 approved:
     check: phases.phase_2_tasks.status == "approved"
     if_not: STOP - "Phase 2 not approved. Run task-plan-review first."
     
  2. Load task plan:
     path: <impl_root>/docs/runs/<branch-slug>/02_tasks/tasks.md
     
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

## Multi-Root Task Execution / Thực thi Task Đa Root

```yaml
execution_context:
  1. Read task's target root:
     from: task.root in tasks.md
     
  2. Set working context:
     - File paths relative to task root
     - Build commands for that root
     - Package manager for that root
     
  3. Cross-root awareness:
     - If task depends on another root's build:
       → Verify dependency is satisfied
       → Or note as prerequisite
     
  4. Example task roots:
     - apphub-vision: Main app code
     - reviews-assets: UI components
     - boost-pfs-backend: Backend services
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

### Task T-XXX implemented. Awaiting review.
### Task T-XXX đã triển khai. Đợi review.

**Progress / Tiến độ:**
| Completed | In Review | Remaining |
|-----------|-----------|-----------|
| <N> tasks | 1 task | <M> tasks |

**Next Steps / Bước tiếp theo:**
1. Run `review` to check this task's changes
2. If approved, run `next task` for T-YYY
3. Or run `status` to see full progress

Reply `review` to start code review.
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

After STOP:
```
→ Run: code-review.prompt.md
  - If APPROVED → Run: phase-3-impl.prompt.md (next task)
  - If REQUEST CHANGES → Run: code-fix-plan.prompt.md
→ When all tasks complete:
  - Run: phase-4-tests.prompt.md
```
