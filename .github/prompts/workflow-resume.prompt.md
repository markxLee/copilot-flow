# Workflow Resume Prompt
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->
# Use this prompt to continue work from a saved state

---

## Trigger

```yaml
TRIGGER_RULES:
  accepted_triggers:
    - "/workflow-resume"         # Explicit prompt reference (RECOMMENDED)
    - "resume"                   # Also accepted
    - "status"                   # Also accepted
    - "where were we"            # Also accepted
    
  why: |
    Resume is safe because it loads state and suggests explicit next prompt.
    It does NOT auto-execute next action.
```

---

## Instructions

### Step 1: Locate State File

```yaml
CRITICAL_WORKFLOW_DETECTION:
  # IMPORTANT: The assistant has no memory across sessions.
  # Workflow detection MUST be derived from WORKSPACE_CONTEXT.md + git branch.
  
  step_1_read_workspace_context_first:
    # Read WORKSPACE_CONTEXT.md first to get default_docs_root
    file: copilot-flow/WORKSPACE_CONTEXT.md
    extract: meta.default_docs_root
    example: "apphub-vision"
    
  step_2_get_branch_from_docs_root:
    # IMPORTANT: Run git in default_docs_root (not tooling_root),
    # because each root may be on a different branch.
    command: git -C <default_docs_root> rev-parse --abbrev-ref HEAD
    example: git -C apphub-vision rev-parse --abbrev-ref HEAD
    result: "feature/bp-32-add-payment-detail"
    
  step_3_extract_slug:
    # Strip common prefixes to get slug
    prefixes_to_strip:
      - "feature/"
      - "bugfix/"
      - "hotfix/"
      - "fix/"
      - "feat/"
      - "chore/"
      - "refactor/"
    
    logic: |
      branch = "feature/bp-32-add-payment-detail"
      slug = branch.replace(/^(feature|bugfix|hotfix|fix|feat|chore|refactor)\//, '')
      slug = "bp-32-add-payment-detail"
    
  step_4_construct_state_path:
    pattern: "<default_docs_root>/docs/runs/<slug>/.workflow-state.yaml"
    example: "apphub-vision/docs/runs/bp-32-add-payment-detail/.workflow-state.yaml"
    
  step_5_check_exists:
    if_exists:
      action: READ and RESUME workflow
      output: Show workflow status and suggest next action
      
    if_not_exists:
      action: ASK user
      message: |
        "No workflow found for branch `<branch>` (slug: `<slug>`)

        Options:
        1. Start a new workflow → `/work-intake`
        2. Look for a different workflow → tell me the branch name

        (VI)
        Không tìm thấy workflow cho branch `<branch>` (slug: `<slug>`)

        Lựa chọn:
        1. Bắt đầu workflow mới → `/work-intake`
        2. Tìm workflow khác → cho tôi biết branch name"
```

### Step 2: Parse State

Read `.workflow-state.yaml` and extract:

```yaml
quick_status:
  branch: <branch-slug>
  docs_root: <docs-root>          # Where this workflow's docs live
  tooling_root: <tooling-root>    # Where templates live
  phase: <current_phase> - <phase_name>
  phase_status: <status>
  current_task: <task-id if in impl phase>
  last_action: <what was done>
  next_action: <what to do>
  blockers: <any blockers>
```

### Step 3: Report Status

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

## 📋 Next Action — Explicit Prompt / Hành động Tiếp — Prompt Cụ thể

Based on current phase, run one of:

| Current State | Recommended Prompt |
|---------------|--------------------|
| **Pending update approval** | Reply `approved` or `cancel` |
| **Update approved, not started** | `/phase-X-...` (restart phase) |
| Phase 0 in progress | `/phase-0-analysis` |
| Phase 0 awaiting review | Review analysis, then `/phase-1-spec` |
| Phase 1 in progress | `/phase-1-spec` |
| Phase 1 awaiting review | `/spec-review` then `/phase-2-tasks` |
| Phase 2 in progress | `/phase-2-tasks` |
| Phase 2 awaiting review | `/task-plan-review` then `/phase-3-impl T-001` |
| Phase 3 task pending | `/phase-3-impl T-XXX` |
| Phase 3 task needs review | `/code-review T-XXX` |
| Phase 3 all tasks done | `/phase-4-tests` |
| Phase 4 in progress | `/phase-4-tests` |
| Phase 4 awaiting verify | `/test-verify` then `/phase-5-done` |
| Phase 5 in progress | `/phase-5-done` |

**⚠️ DO NOT say "Reply `go` to proceed"** - Use explicit prompt references above.
```

### Step 4: Handle Different States

#### State: pending-approval (Work Update)
```yaml
# ⚠️ HIGH PRIORITY: Check this FIRST
check: status.pending_approval exists and starts with "update-"
action: |
  Show pending update for approval:
  
  "## 🔄 Pending Work Update Found
  
  Found update #<N> awaiting approval:
  
  | Field | Value |
  |-------|-------|
  | Update Type | <updates[N].type> |
  | Source | <updates[N].source> |
  | Description | <updates[N].description> |
  | Restart From | Phase <updates[N].restart_from> |
  | Affected Phases | <updates[N].affected_phases> |
  
  Session was interrupted before you responded.
  
  **Reply:**
  - `approved` — Proceed with update #<N>
  - `cancel` — Discard this update and continue from previous state"
```

#### State: update-approved-not-started
```yaml
# Check: Update approved but restart phase not started yet
check: |
  updates[N].status == "approved" AND
  phases[restart_phase].status == "pending-update-<N>"
action: |
  Show ready to restart:
  
  "## 🔄 Update #<N> Approved — Ready to Restart
  
  Update #<N> was approved but Phase <X> hasn't started yet.
  
  **Next:** Run `/phase-<X>-...` to restart from Phase <X>"
```

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

### Step 5: Update State After Each Action

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

## State Transitions

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

## Quick Commands

| Command | Action | Risk |
|---------|--------|------|
| `resume` | Continue from last state | ✅ Safe |
| `status` | Show current status only | ✅ Safe |
| `/phase-X-...` | Run specific phase prompt | ✅ Safe |
| `skip` | Skip current task/blocker | ⚠️ Caution |
| `back` | Go to previous phase | ⚠️ Caution |
| `restart` | Restart current phase | ⚠️ Caution |
| `abort` | Cancel workflow | ⚠️ Caution |
| ~~`go`~~ | ~~Execute next_action~~ | ❌ RISKY - may skip phases |

---

## Error Recovery

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

## Output Format

Always use bilingual format for status reports:
- Headers: English / Vietnamese
- Content: Based on user_preferences.language in state file
- Default: Both languages

---

## Example Resume Session

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

## 📋 Next Action — Explicit Prompt

Based on current state (Phase 3, Task T-004 pending):

**Run:** `/phase-3-impl T-004`

This will implement: Update dashboard component to integrate tracker

User: /phase-3-impl T-004

Copilot: Starting T-004: Integrate analytics tracker into dashboard...
[continues implementation]
```
