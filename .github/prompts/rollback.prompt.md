# Rollback Prompt / Hoàn tác

> Undo implementation changes when something goes wrong.
> Hoàn tác các thay đổi implementation khi có lỗi xảy ra.

---

## 🎯 Purpose / Mục đích

Safely undo code changes from the current or previous task when:
- Implementation introduced bugs
- Wrong approach was taken
- User wants to try different solution
- Code review rejected with major issues

Hoàn tác an toàn các thay đổi code khi:
- Implementation gây ra bugs
- Approach sai
- User muốn thử solution khác
- Code review reject với issues lớn

---

## Trigger / Kích hoạt

- User says: `rollback`, `undo`, `revert`, `hoàn tác`, `quay lại`
- User says: `that didn't work`, `start over`, `try again`
- After failed implementation or test

---

## Prerequisites / Điều kiện Tiên quyết

```yaml
required:
  - Active workflow in Phase 3 (Implementation) or later
  - At least one task has been implemented
  - Changes not yet committed (preferred) or committed but not pushed
```

---

## Step 1: Assess Rollback Scope / Đánh giá Phạm vi

```yaml
actions:
  1. Read current state:
     - Current task and status
     - Files modified in this task
     - Files modified in previous tasks
     
  2. Check git status:
     command: git status --porcelain
     purpose: Identify uncommitted changes
     
  3. Check recent commits (if needed):
     command: git log --oneline -10
     purpose: Identify commits to potentially revert
```

---

## Step 2: Present Rollback Options / Trình bày Tùy chọn

```markdown
## 🔄 Rollback Options / Tùy chọn Hoàn tác

### Current Situation / Tình trạng Hiện tại

| Aspect | Value |
|--------|-------|
| Current Task | <task_id>: <task_name> |
| Task Status | <status> |
| Modified Files | <count> files |
| Git Status | <uncommitted/committed/pushed> |

### Files Modified in Current Task / Files đã Sửa trong Task Hiện tại

| # | File | Change Type | Lines |
|---|------|-------------|-------|
| 1 | <file_path> | <added/modified/deleted> | +X/-Y |
| 2 | <file_path> | <added/modified/deleted> | +X/-Y |

---

### Rollback Options / Các Tùy chọn

**Option 1: Rollback Current Task Only** ⭐ Recommended
```
Undo all changes from task <task_id>
Keep changes from previous tasks
```
Say: `rollback task` / `hoàn tác task`

**Option 2: Rollback Specific Files**
```
Choose which files to revert
Keep other changes
```
Say: `rollback files` / `hoàn tác files`

**Option 3: Rollback to Last Approved State**
```
Revert ALL implementation changes
Go back to end of Phase 2 (Task Planning)
```
Say: `rollback all` / `hoàn tác hết`

**Option 4: Rollback Last Commit** (if committed)
```
Revert the most recent commit
Keep working directory changes
```
Say: `rollback commit` / `hoàn tác commit`

---

Which option? / Chọn tùy chọn nào?
```

---

## Step 3: Execute Rollback / Thực hiện Hoàn tác

### Option 1: Rollback Current Task

```yaml
rollback_current_task:
  steps:
    1. Identify files changed in current task:
       source: impl-log.md or git diff
       
    2. For each file - provide command:
       - If file was ADDED: "rm <file>"
       - If file was MODIFIED: "git checkout HEAD -- <file>"
       - If file was DELETED: "git checkout HEAD -- <file>"
       
    3. Update state:
       current_task: <previous_task or same task>
       task_status: not-started (retry) or rolled-back
       
    4. Update impl-log.md:
       - Add rollback entry with reason
       - Mark task as rolled back
```

**Output:**
```markdown
## ⏪ Rollback: Task <task_id>

### Commands to Execute / Lệnh Cần Chạy

Run these commands to undo changes:
Chạy các lệnh này để hoàn tác:

```bash
# Revert modified files
git checkout HEAD -- <file1>
git checkout HEAD -- <file2>

# Remove added files
rm <new_file1>
rm <new_file2>

# Restore deleted files
git checkout HEAD -- <deleted_file>
```

### After Rollback / Sau khi Hoàn tác

| Aspect | Value |
|--------|-------|
| Task Status | Ready to retry |
| Files Reverted | <count> |
| Next Action | Re-implement with different approach |

---

**Options:**
1. `retry` — Re-implement this task with new approach
2. `skip task` — Skip this task, move to next
3. `change spec` — Go back to modify specification

Reply with your choice.
```

### Option 2: Rollback Specific Files

```markdown
## 📂 Select Files to Rollback / Chọn Files để Hoàn tác

| # | File | Change | Rollback? |
|---|------|--------|-----------|
| 1 | <file1> | modified | ❓ |
| 2 | <file2> | added | ❓ |
| 3 | <file3> | modified | ❓ |

Say: `rollback 1,3` to rollback files #1 and #3
Or: `rollback all except 2` to keep only file #2
```

### Option 3: Rollback All Implementation

```yaml
rollback_all:
  warning: |
    ⚠️ WARNING: This will undo ALL implementation work!
    
    You will lose:
    - All task implementations (T-001 through T-XXX)
    - All code changes in Phase 3
    
    You will keep:
    - Analysis (Phase 0)
    - Specification (Phase 1)
    - Task Plan (Phase 2)
    
    Are you sure? Say `confirm rollback all` to proceed.
    
  on_confirm:
    1. Get list of all files changed since Phase 2
    2. Provide git commands to revert
    3. Update state to Phase 2 approved, Phase 3 not-started
    4. Clear task progress
```

### Option 4: Rollback Commit

```markdown
## 🔙 Rollback Last Commit

### Commit to Revert
```
<commit_hash> <commit_message>
<date> by <author>
```

### Command
```bash
# Soft reset (keep changes in working directory)
git reset --soft HEAD~1

# Or hard reset (discard changes completely)
git reset --hard HEAD~1
```

⚠️ **Note:** Only use if commit is NOT pushed to remote.
Nếu đã push, cần dùng `git revert` thay vì `git reset`.
```

---

## Step 4: Update State / Cập nhật State

```yaml
state_update_after_rollback:
  tasks:
    <task_id>:
      status: rolled-back  # or not-started if retrying
      rollback_reason: "<user provided reason>"
      rollback_at: "<timestamp>"
      
  history:
    - action: rollback
      task: <task_id>
      files_reverted: <count>
      reason: "<reason>"
      timestamp: "<now>"
      
  status:
    last_action: "Rolled back <task_id>"
    next_action: "<based on user choice>"
```

---

## Step 5: Document in impl-log.md / Ghi vào impl-log

Add entry:
```markdown
### ⏪ Rollback: <task_id>

| Aspect | Value |
|--------|-------|
| Timestamp | <datetime> |
| Reason | <user reason> |
| Files Reverted | <list> |
| Next Action | <retry/skip/change spec> |

#### Rollback Details
- <file1>: reverted to <commit>
- <file2>: deleted (was new)
```

---

## ⏸️ STOP — Rollback Complete / DỪNG — Hoàn tác Xong

```markdown
## ✅ Rollback Complete / Hoàn tác Hoàn tất

| Aspect | Value |
|--------|-------|
| Rolled Back | <task_id or "all"> |
| Files Reverted | <count> |
| Current State | <new state> |

### What was undone / Những gì đã hoàn tác
- <list of changes undone>

### Current Position / Vị trí Hiện tại
| Phase | <phase> |
| Task | <task or N/A> |
| Status | Ready for next action |

---

**Next Steps / Bước tiếp theo:**
| Option | Command | Action |
|--------|---------|--------|
| Retry task | `retry` | Re-implement with new approach |
| Skip task | `skip task` | Move to next task |
| Different approach | `change approach: <idea>` | Discuss new solution |
| Back to spec | `revise spec` | Modify specification |
```

---

## Safety Rules / Quy tắc An toàn

```yaml
safety:
  DO_NOT:
    - Execute git commands automatically
    - Delete files without user confirmation
    - Rollback pushed commits without warning
    - Lose user's work without explicit consent
    
  MUST:
    - Show all commands before execution
    - Confirm destructive operations
    - Update state after rollback
    - Document rollback reason
    - Provide recovery options
```

---

## Next Step / Bước tiếp theo

| User Choice | Next Action |
|-------------|-------------|
| `retry` | Run: `phase-3-impl.prompt.md` (same task) |
| `skip task` | Run: `phase-3-impl.prompt.md` (next task) |
| `change approach` | Discuss new approach, then implement |
| `revise spec` | Run: `work-update.prompt.md` |
| `abort workflow` | Archive workflow, start fresh |

---

## Example / Ví dụ

```
User: rollback

Copilot:
## 🔄 Rollback Options

### Current Situation
| Aspect | Value |
|--------|-------|
| Current Task | T-003: Add event listeners |
| Task Status | in-progress |
| Modified Files | 3 files |
| Git Status | uncommitted |

### Files Modified in Current Task
| # | File | Change | Lines |
|---|------|--------|-------|
| 1 | src/tracker.ts | modified | +45/-12 |
| 2 | src/events.ts | added | +120 |
| 3 | src/index.ts | modified | +5/-0 |

---

**Option 1: Rollback Current Task Only** ⭐
**Option 2: Rollback Specific Files**
**Option 3: Rollback All Implementation**

Which option?

User: rollback task

Copilot:
## ⏪ Rollback: Task T-003

### Commands to Execute
```bash
git checkout HEAD -- src/tracker.ts
git checkout HEAD -- src/index.ts
rm src/events.ts
```

Run these commands, then say `done` when complete.

User: done

Copilot:
## ✅ Rollback Complete

| Rolled Back | T-003 |
| Files Reverted | 3 |
| Current State | T-003 ready to retry |

**Next:** Say `retry` to re-implement T-003 with a different approach.
```
