# Add Task — Add a New Task During Phase 3
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

You are acting as a **Task Addition Coordinator**.

---

## Trigger

```yaml
TRIGGER_RULES:
  accepted_triggers:
    - "/add-task"
    - "/add-task <description>"
    
  use_cases:
    - Discovered need for new task during implementation
    - Forgot to include a task in original plan
    - New requirement added but doesn't warrant full spec update
    - Breaking down a large task into smaller ones
    
  NOT_for:
    - Major scope changes → Use /work-update instead
    - New requirements affecting spec → Use /work-update with SCOPE_EXPANSION
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify in Phase 3:
     check: status.current_phase == 3
     if_not: WARN - "Not in Phase 3. Consider /work-update for earlier phases."
     
  2. Load current state:
     - tasks.md
     - .workflow-state.yaml
     - spec.md (to check related requirements)
     
  3. Get existing task count:
     - Last task ID (e.g., T-012)
     - Total tasks
```

---

## Execution Steps

```yaml
steps:
  1. Capture new task details:
     - Task description
     - Related requirements (FR-XXX if any)
     - Dependencies (depends on which tasks?)
     - Files to change
     - Done criteria
     - Estimated size (S/M/L)
     
  2. Determine task ID:
     new_id: T-<last_id + 1>
     example: T-013 (if last was T-012)
     
  3. Determine insertion point:
     - After which task? (based on dependencies)
     - Or at end of task list?
     
  4. Update ALL documents (SYNC):
     a. tasks.md → Add new task entry
     b. .workflow-state.yaml → Add task to phases.phase_3_impl.tasks
     c. spec.md → Add FR-XXX if new requirement (optional)
     
  5. Update state summary:
     - tasks_summary.total += 1
     - Track that task was added mid-phase
```

---

## Output Format

```markdown
## ➕ Add Task / Thêm Task

### Current State / Trạng thái Hiện tại

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Phase | 3 - Implementation |
| Current Tasks | <N> tasks |
| Last Task ID | T-<N> |
| Completed | <X>/<N> |

---

### New Task Details / Chi tiết Task Mới

| Field | Value |
|-------|-------|
| **ID** | T-<N+1> |
| **Title** | <task title> |
| **Root** | <target root> |
| **Related FR** | <FR-XXX or "N/A - implementation detail"> |
| **Depends On** | <T-XXX, T-YYY or "None"> |
| **Insert After** | <T-XXX or "End of list"> |
| **Estimated** | <S/M/L> |

#### Description / Mô tả

**EN:** <what needs to be done>

**VI:** <cần làm gì>

#### Files to Change / Files cần Thay đổi

| Action | File |
|--------|------|
| Create | <path> |
| Modify | <path> |

#### Done Criteria / Tiêu chí Hoàn thành

- [ ] <criterion 1>
- [ ] <criterion 2>

#### Verification / Kiểm tra

- <how to verify 1>
- <how to verify 2>

---

### Documents to Update

| Document | Action | Status |
|----------|--------|--------|
| `02_tasks/tasks.md` | Add task entry | ⏳ Pending |
| `.workflow-state.yaml` | Add to phase_3_impl.tasks | ⏳ Pending |
| `01_spec/spec.md` | Add FR-XXX (if needed) | ⏳ Pending / N/A |

---

## ⏸️ STOP — Confirm Before Adding

Review the task details above.

**Reply:**
- `approved` → Add task and update all documents
- `adjust` → Modify task details
- `cancel` → Don't add task

```

---

## Document Updates

### 1. Update tasks.md

```yaml
location: <docs_root>/docs/runs/<branch-slug>/02_tasks/tasks.md

action: |
  Add new task entry at appropriate position:
  
  ### T-<N+1>: <Task Title>
  
  | Field | Value |
  |-------|-------|
  | Root | <root> |
  | Depends On | <dependencies> |
  | Estimated | <S/M/L> |
  | Added | Mid-Phase 3 (via /add-task) |
  
  **Description:**
  - EN: ...
  - VI: ...
  
  **Files:**
  - Create: ...
  - Modify: ...
  
  **Done Criteria:**
  - [ ] ...
  
  **Verification:**
  - ...
```

### 2. Update .workflow-state.yaml

```yaml
location: <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml

updates:
  # Update summary
  phase_2_tasks.tasks_summary.total: <N+1>
  
  # Add to tasks list
  phases.phase_3_impl.tasks:
    - id: T-<N+1>
      title: "<task title>"
      root: <root>
      status: pending
      added_mid_phase: true
      added_at: "<timestamp>"
      depends_on: [<dependencies>]
      
  # Update history
  history:
    - timestamp: "<now>"
      action: "Added task T-<N+1> mid-phase via /add-task"
      phase: 3
```

### 3. Update spec.md (if new requirement)

```yaml
condition: Only if task represents new functional requirement

location: <docs_root>/docs/runs/<branch-slug>/01_spec/spec.md

action: |
  Add new FR entry:
  
  ### FR-<N+1>: <Requirement Title>
  
  | Aspect | Detail |
  |--------|--------|
  | Priority | Should |
  | Affected Roots | <roots> |
  | Added | Mid-workflow (via /add-task) |
  
  **Description / Mô tả:**
  - EN: ...
  - VI: ...
  
  **Acceptance Criteria / Tiêu chí Nghiệm thu:**
  - [ ] ...
```

---

## After Approval

```yaml
on_approved:
  1. Update tasks.md with new task entry
  2. Update .workflow-state.yaml:
     - Add task to tasks list
     - Update total count
     - Add history entry
  3. Update spec.md if new FR needed
  4. Confirm all updates
  5. Suggest next action:
     
     "✅ Task T-<N+1> added successfully!
     
     Documents updated:
     - ✅ tasks.md
     - ✅ .workflow-state.yaml
     - ✅/N/A spec.md
     
     **Next:** Run `/phase-3-impl T-<N+1>` to implement the new task."
```

---

## State Tracking

```yaml
# Mark tasks added mid-phase for audit
task_metadata:
  added_mid_phase: true
  added_at: "<timestamp>"
  added_reason: "<brief reason>"
  original_task_count: <N>
  new_task_count: <N+1>

# Track in history
history_entry:
  type: "task_addition"
  task_id: "T-<N+1>"
  reason: "<why added>"
  timestamp: "<now>"
```

---

## Edge Cases

### Task Dependencies on Pending Tasks

```yaml
scenario: New task depends on task not yet completed
handling: |
  - Allow if dependency is in pending/in-progress
  - Warn if dependency is completed (may need re-review)
  - Block if dependency doesn't exist
```

### Multiple Tasks at Once

```yaml
scenario: User wants to add multiple tasks
handling: |
  - Process one at a time
  - Or accept list and add sequentially
  - Each gets unique ID: T-013, T-014, etc.
```

### Task Breaks Down Existing Task

```yaml
scenario: Splitting T-005 into T-005a, T-005b
handling: |
  - Mark original T-005 as "split"
  - Create T-013, T-014 (don't reuse IDs)
  - Note relationship in description
```

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| Simple task addition | `/add-task <description>` |
| Task with new requirement | `/add-task` then confirm FR needed |
| Major scope change | Use `/work-update` instead |
| Breaking down task | `/add-task` for each sub-task |

---

## Related Prompts

| Prompt | When to Use |
|--------|-------------|
| `/work-update` | Major changes requiring spec revision |
| `/phase-2-tasks` | Re-planning all tasks from scratch |
| `/phase-3-impl T-XXX` | Implement the newly added task |
