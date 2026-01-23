# Workflow Resume Prompt
# Use this prompt to continue work from a saved state
# Dùng prompt này để tiếp tục công việc từ trạng thái đã lưu

---

## Trigger / Kích hoạt

User says one of:
- "resume" / "tiếp tục"
- "continue" / "tiếp"
- "where were we" / "đang làm gì"
- "status" / "trạng thái"
- "what's next" / "làm gì tiếp"

---

## Instructions / Hướng dẫn

### Step 1: Locate State File / Tìm file trạng thái

```yaml
search_order:
  1. Current branch's state file:
     - Run: git rev-parse --abbrev-ref HEAD
     - Normalize to branch-slug
     - Look for: <impl-root>/docs/runs/<branch-slug>/.workflow-state.yaml
     
  2. If not found, check WORKSPACE_CONTEXT.md for impl_root
  
  3. If still not found:
     - List available runs: <impl-root>/docs/runs/*/
     - Ask user which workflow to resume
```

### Step 2: Parse State / Đọc trạng thái

Read `.workflow-state.yaml` and extract:

```yaml
quick_status:
  branch: <branch-slug>
  phase: <current_phase> - <phase_name>
  phase_status: <status>
  current_task: <task-id if in impl phase>
  last_action: <what was done>
  next_action: <what to do>
  blockers: <any blockers>
```

### Step 3: Report Status / Báo cáo trạng thái

Output format (bilingual):

```markdown
## 🔄 Workflow Resume / Tiếp tục Workflow

| Aspect | Value |
|--------|-------|
| Branch | `<branch-slug>` |
| Feature | <feature-name> |
| Current Phase | Phase <N>: <phase-name> |
| Status | <phase_status> |
| Last Updated | <timestamp> |

### Last Action / Hành động cuối
<last_action>

### Next Action / Hành động tiếp theo
<next_action>

### Progress Summary / Tóm tắt tiến độ

| Phase | Status | Artifacts |
|-------|--------|-----------|
| 0. Analysis | ✅/⏳/⬜ | <N> files |
| 1. Spec | ✅/⏳/⬜ | <N> files |
| 2. Tasks | ✅/⏳/⬜ | <N> tasks |
| 3. Impl | ✅/⏳/⬜ | <X>/<Y> tasks |
| 4. Tests | ✅/⏳/⬜ | <pass>/<total> |
| 5. Done | ✅/⏳/⬜ | checklist |

### Blockers / Vướng mắc
<blockers or "None">

---

**Ready to continue? / Sẵn sàng tiếp tục?**
Reply `go` to proceed with: <next_action>
Or specify what you want to do.
```

### Step 4: Handle Different States / Xử lý các trạng thái

#### State: awaiting-review
```yaml
action: |
  STOP and remind user:
  "Phase <N> is awaiting your review.
  Please review: <artifact-path>
  Reply 'approved' to continue or provide feedback."
```

#### State: blocked
```yaml
action: |
  Show blockers and ask:
  "There are blockers that need resolution:
  <blocker-list>
  
  How would you like to proceed?
  1. Resolve blocker: <suggestion>
  2. Skip and continue
  3. Abort workflow"
```

#### State: in-progress (mid-task)
```yaml
action: |
  Resume from checkpoint:
  "Resuming task <task-id>: <task-title>
  
  Checkpoint:
  - Done: <checkpoint.description>
  - Files created: <files_created>
  - Next step: <checkpoint.next_step>
  
  Continuing..."
  
  Then execute next_step
```

#### State: in-progress (between tasks)
```yaml
action: |
  Start next task:
  "Task <prev-task> complete.
  Starting task <next-task>: <task-title>
  Root: <root-name>
  
  Proceeding..."
```

### Step 5: Update State After Each Action / Cập nhật trạng thái

After EVERY significant action, update `.workflow-state.yaml`:

```yaml
updates_required:
  - status.last_updated: <now>
  - status.last_action: <what was done>
  - status.next_action: <what's next>
  - history: append new entry
  
  # If task completed:
  - phases.phase_3_impl.tasks[current].status: done
  - phases.phase_3_impl.tasks[current].completed_at: <now>
  - status.current_task: <next-task-id>
  
  # If phase completed:
  - phases.<phase>.status: awaiting-review
  - phases.<phase>.completed_at: <now>
  
  # If files changed:
  - affected_roots[root].files.created/modified: append
  - affected_roots[root].git.has_uncommitted: true
```

---

## State Transitions / Chuyển trạng thái

```
not-started ──▶ in-progress ──▶ awaiting-review ──▶ approved ──▶ (next phase)
                    │                  │
                    ▼                  ▼
                 blocked           feedback
                    │                  │
                    ▼                  ▼
              (resolve) ◀──────── in-progress
```

---

## Quick Commands / Lệnh nhanh

| Command | Action |
|---------|--------|
| `resume` / `tiếp tục` | Continue from last state |
| `status` / `trạng thái` | Show current status only |
| `go` / `tiếp` | Execute next_action |
| `skip` / `bỏ qua` | Skip current task/blocker |
| `back` / `quay lại` | Go to previous phase |
| `restart` / `làm lại` | Restart current phase |
| `abort` / `hủy` | Cancel workflow |

---

## Error Recovery / Khôi phục lỗi

### State file corrupted or missing
```yaml
recovery:
  1. Check git history for previous version
  2. Reconstruct from artifacts in docs/runs/<branch-slug>/
  3. Ask user to confirm reconstructed state
  4. Create new state file
```

### Branch mismatch
```yaml
recovery:
  1. Warn user: "Current branch <X> doesn't match state file branch <Y>"
  2. Options:
     a. Switch to correct branch
     b. Update state file to current branch
     c. Start new workflow
```

### Stale state (>24h old)
```yaml
recovery:
  1. Warn: "State file is <N> hours old"
  2. Verify files still exist and match
  3. Check for external changes (git status)
  4. Offer to refresh state
```

---

## Output Format / Định dạng Output

Always use bilingual format for status reports:
- Headers: English / Vietnamese
- Content: Based on user_preferences.language in state file
- Default: Both languages

---

## Example Resume Session / Ví dụ phiên tiếp tục

```
User: resume

Copilot: 
## 🔄 Workflow Resume / Tiếp tục Workflow

| Aspect | Value |
|--------|-------|
| Branch | `feature-add-analytics` |
| Feature | Add Analytics Dashboard |
| Current Phase | Phase 3: Implementation |
| Status | in-progress |
| Last Updated | 2h ago |

### Last Action / Hành động cuối
Created `packages/analytics/src/tracker.ts` with event tracking logic

### Next Action / Hành động tiếp theo
Update dashboard component to integrate tracker (Task T-004)

### Progress Summary / Tóm tắt tiến độ

| Phase | Status | Artifacts |
|-------|--------|-----------|
| 0. Analysis | ✅ Done | 3 files |
| 1. Spec | ✅ Done | 1 file |
| 2. Tasks | ✅ Done | 6 tasks |
| 3. Impl | ⏳ 3/6 | T-001,T-002,T-003 done |
| 4. Tests | ⬜ Pending | - |
| 5. Done | ⬜ Pending | - |

### Blockers / Vướng mắc
None

---

**Ready to continue? / Sẵn sàng tiếp tục?**
Reply `go` to proceed with: Update dashboard component
Or specify what you want to do.

User: go

Copilot: Starting T-004: Integrate analytics tracker into dashboard...
[continues implementation]
```
