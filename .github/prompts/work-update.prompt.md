# Work Update — Handle Changes & Iterations
<!-- Version: 1.1 | Contract: v1.0 | Last Updated: 2026-02-04 -->

You are acting as a **Change Management Coordinator**.

---

## ⛔ SCOPE LIMITATION (NON-NEGOTIABLE)

```yaml
##############################################################
#  🚨 THIS PROMPT DOES ANALYSIS + DOCS ONLY
#  🚨 IT DOES NOT IMPLEMENT OR MODIFY CODE
##############################################################

SCOPE:
  this_prompt_DOES:
    - Analyze what changed
    - Determine affected phases
    - Update .workflow-state.yaml
    - Create work-description-update-N.md
    - Create/append to work-updates.md
    - Show roadmap of prompts to run
    
  this_prompt_DOES_NOT:
    - Modify any source code
    - Update spec.md, tasks.md, impl-log.md, etc.
    - Run any phase prompts
    - Implement any changes
    - Write tests
    
FORBIDDEN_ACTIONS:
  - ❌ DO NOT modify files outside docs/runs/<branch-slug>/00_analysis/
  - ❌ DO NOT create spec-update-N.md (that's Phase 1's job)
  - ❌ DO NOT create tasks-update-N.md (that's Phase 2's job)
  - ❌ DO NOT touch any source code files
  - ❌ DO NOT auto-execute phase prompts after approval
  
ALLOWED_FILES_TO_CREATE:
  - ✅ .workflow-state.yaml (update)
  - ✅ 00_analysis/work-description-update-N.md (create)
  - ✅ 00_analysis/work-updates.md (append)
```

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/work-update"         # Explicit prompt reference (REQUIRED)
    
  rejected_triggers:
    - "update", "change"  # ⚠️ TOO VAGUE - could mean many things
    - "go", "continue", "approved"    # ⚠️ DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    and ensure user intentionally wants to register a work update.
    
  use_cases:
    - PR review requests changes
    - Requirement changes mid-workflow
    - Stakeholder feedback requires rework
    - Bug found during testing
```

---

## Purpose

Handle changes to an in-progress or completed workflow:
1. **Analyze** what changed and which phases are affected
2. **Document** the update in state file and work-description-update-N.md
3. **Guide** user to run the appropriate phase prompts manually

**This prompt is a COORDINATOR, not an EXECUTOR.**

---

## Update Types

```yaml
update_types:
  REQUIREMENT_CHANGE:
    description: "Business requirements changed"
    typical_restart: Phase 1 (Spec)
    affects: All downstream phases
    
  PR_REVIEW:
    description: "PR review requests code changes"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
    
  BUG_FOUND:
    description: "Bug discovered during review/testing"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
    
  SCOPE_EXPANSION:
    description: "New features added to scope"
    typical_restart: Phase 1 (Spec)
    affects: All downstream phases
    
  DESIGN_CHANGE:
    description: "Architecture/design needs revision"
    typical_restart: Phase 0 (Analysis)
    affects: All phases
    
  TEST_FAILURE:
    description: "Tests reveal implementation issues"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify workflow exists:
     path: <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
     if_not: STOP - "No workflow found. Use work-intake for new work."
     
  2. Load current state:
     - Current phase
     - Update count (default 0)
     - Phase statuses
     
  3. Determine update number:
     new_update_number: current_update_count + 1
```

---

## Execution Steps

```yaml
steps:
  1. Capture update details:
     - Update type
     - Change description
     - Reason/source (PR review, stakeholder, etc.)
     - Which requirements affected
     
  2. Determine restart phase:
     - Based on update type
     - User can override
     
  3. Calculate affected phases:
     - All phases >= restart phase
     
  4. Create update entry in state:
     - Update number
     - Timestamp
     - Reason
     - Affected phases
     
  5. Reset affected phases:
     - Status → "pending-update"
     - Preserve previous artifacts
     
  6. Guide to restart phase
```

---

## Output Format

```markdown
## 🔄 Work Update — Iteration <N> / Cập nhật Công việc — Lần lặp <N>

### Current State / Trạng thái Hiện tại

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Current Phase | <phase> |
| Previous Updates | <N-1> |
| This Update | #<N> |

---

### Update Details / Chi tiết Cập nhật

| Field | Value |
|-------|-------|
| Type | <REQUIREMENT_CHANGE / PR_REVIEW / BUG_FOUND / etc.> |
| Source | <PR #123 / Stakeholder / Testing / etc.> |
| Description | <brief description> |

### Change Description / Mô tả Thay đổi

<Detailed description of what changed and why>

### Affected Requirements / Yêu cầu Bị ảnh hưởng

| Requirement | Change Type | Description |
|-------------|-------------|-------------|
| FR-001 | Modified | <what changed> |
| FR-005 | Added | <new requirement> |
| NFR-002 | Removed | <why removed> |

---

### Impact Analysis / Phân tích Ảnh hưởng

#### Restart From / Bắt đầu lại Từ

| Field | Value |
|-------|-------|
| Restart Phase | Phase <X>: <name> |
| Reason | <why this phase> |

#### Affected Phases / Các Phase Bị ảnh hưởng

| Phase | Previous Status | New Status | Action |
|-------|-----------------|------------|--------|
| 0 - Analysis | ✅ Approved | ✅ Keep | No change |
| 1 - Spec | ✅ Approved | 🔄 Update | Create spec-update-<N>.md |
| 2 - Tasks | ✅ Approved | 🔄 Update | Create tasks-update-<N>.md |
| 3 - Impl | ✅ Approved | 🔄 Update | Update impl-log |
| 4 - Tests | ✅ Approved | 🔄 Update | Update test docs |
| 5 - Done | ⏳ Pending | 🔄 Reset | Re-verify |

---

### File Naming for Update <N> / Đặt tên File cho Update <N>

| Phase | Original | Update <N> |
|-------|----------|------------|
| 0 | solution-design.md | solution-design-update-<N>.md |
| 1 | spec.md | spec-update-<N>.md |
| 2 | tasks.md | tasks-update-<N>.md |
| 3 | impl-log.md | impl-log-update-<N>.md |
| 4 | tests.md | tests-update-<N>.md |
| 5 | done.md | done-update-<N>.md |

Additional traceability docs (recommended):
- If requirements/scope changed: create `00_analysis/work-description-update-<N>.md`
- Always append a short entry to `00_analysis/work-updates.md`

---

### Update Log Entry / Bản ghi Cập nhật

Add to workflow state:

```yaml
updates:
  - number: <N>
    timestamp: <now>
    type: <update_type>
    source: <source>
    description: <description>
    restart_from: <phase>
    affected_phases: [<list>]
    affected_requirements:
      added: [FR-005]
      modified: [FR-001]
      removed: [NFR-002]
```

---

### Previous Artifacts Preserved / Artifacts Trước được Giữ lại

| Phase | Original File | Status |
|-------|---------------|--------|
| 1 | spec.md | 📁 Preserved |
| 1 | spec-update-1.md | 📁 Preserved (if exists) |
| 2 | tasks.md | 📁 Preserved |
| ... | ... | ... |

> All previous versions are kept for audit trail
> Tất cả phiên bản trước được giữ để theo dõi

---

## ⚠️ CRITICAL: State Must Be Updated BEFORE Stop

```yaml
##############################################################
#  🚨 NON-NEGOTIABLE: UPDATE STATE FILE BEFORE STOPPING
#  This ensures session can resume correctly if interrupted
##############################################################

STATE_UPDATE_RULE:
  timing: IMMEDIATELY after analysis, BEFORE showing STOP message
  reason: |
    If session is interrupted after STOP but before user responds,
    the state file MUST contain all update information so that
    /workflow-resume can restore the exact state.
    
  MUST_DO:
    1. Write update entry to .workflow-state.yaml
    2. Set update status to "pending-approval"
    3. Record restart_from phase
    4. Record affected_phases
    5. THEN show STOP message
    
  MUST_NOT:
    - Show STOP message before updating state
    - Wait for user approval before recording update details
    - Rely on conversation context for state recovery
```

---

## ⏸️ STOP — Update Registered / DỪNG — Cập nhật Đã đăng ký

> ⚠️ **BEFORE showing this message**: State file MUST already be updated with:
> - `updates[N].status: pending-approval`
> - `status.next_action: "Awaiting approval for update #N"`

### Update #<N> registered. Ready to restart from Phase <X>.
### Cập nhật #<N> đã đăng ký. Sẵn sàng bắt đầu lại từ Phase <X>.

**Summary:**
- Update type: <type>
- Restart from: Phase <X>
- Phases to re-run: <count>
- New docs will use suffix: `-update-<N>`

**State saved**: ✅ Can resume with `/workflow-resume` if session interrupted

**Responses:**
- `approved` — Create update docs and show roadmap
- `adjust phase <X>` — Change restart phase
- `cancel` — Discard this update

---

## After Approval: Create Docs + Show Roadmap

```yaml
##############################################################
#  🚨 AFTER APPROVAL: CREATE DOCS ONLY, DO NOT EXECUTE PHASES
##############################################################

ON_APPROVED:
  # Step 1: Update state
  update_state:
    file: .workflow-state.yaml
    changes:
      - updates[N].status: "approved"
      - updates[N].approved_at: <timestamp>
      - status.pending_approval: null
      - status.current_update: <N>
      - Reset affected phases to "pending-update-<N>"
      
  # Step 2: Create update documentation ONLY
  create_docs:
    MUST_CREATE:
      - 00_analysis/work-description-update-<N>.md
        content: |
          # Work Description — Update #<N>
          
          ## Update Context
          - Original work: <reference to original work-description.md>
          - Update type: <type>
          - Source: <source>
          
          ## What Changed
          <detailed description of changes>
          
          ## Affected Requirements
          | ID | Change | Description |
          |----|--------|-------------|
          | FR-001 | Modified | <what changed> |
          | FR-005 | Added | <new requirement> |
          
      - 00_analysis/work-updates.md (append entry)
        content: |
          ## Update #<N> — <timestamp>
          - Type: <type>
          - Description: <brief>
          - Affected phases: <list>
          - See: work-description-update-<N>.md
          
    MUST_NOT_CREATE:
      - ❌ spec-update-N.md (Phase 1 creates this)
      - ❌ tasks-update-N.md (Phase 2 creates this)
      - ❌ Any source code files
      
  # Step 3: Show roadmap (DO NOT EXECUTE)
  show_roadmap:
    output: |
      ## ✅ Update #<N> Approved — Docs Created
      
      **Files created:**
      - 00_analysis/work-description-update-<N>.md ✅
      - 00_analysis/work-updates.md (entry added) ✅
      
      ---
      
      ## 🗺️ Roadmap: Phases to Re-run
      
      Run these prompts IN ORDER to complete update #<N>:
      
      | Step | Phase | Prompt | Creates |
      |------|-------|--------|---------|
      | 1 | Phase <restart> | `/phase-<X>-...` | <artifact>-update-<N>.md |
      | 2 | Phase <next> | `/phase-<Y>-...` | <artifact>-update-<N>.md |
      | ... | ... | ... | ... |
      
      ### Start with:
      ```
      /phase-<restart>-...
      ```
      
      ⚠️ **I will NOT auto-execute these prompts.**
      ⚠️ **Run each prompt manually when ready.**
      
    MUST_NOT:
      - Auto-execute any phase prompt
      - Start implementation
      - Modify any files beyond 00_analysis/
```
```

---

## State Updates

```yaml
##############################################################
#  STATE UPDATE SEQUENCE (ORDER MATTERS!)
##############################################################

# STEP 1: Register update (BEFORE showing STOP)
# This MUST happen BEFORE the STOP message is shown to user
step_1_register_update:
  timing: "After analysis, BEFORE STOP message"
  file: .workflow-state.yaml
  changes:
    meta:
      update_count: <N>
      
    status:
      last_action: "Registered update #<N>"
      next_action: "Awaiting approval to restart from Phase <X>"
      pending_approval: "update-<N>"
      
    updates:
      - number: <N>
        timestamp: <timestamp>
        type: <update_type>
        source: <source>
        description: <description>
        restart_from: <phase_number>
        affected_phases: [1, 2, 3, 4, 5]  # example
        affected_requirements:
          added: [FR-005]
          modified: [FR-001]
          removed: [NFR-002]
        status: pending-approval  # Key for resume

# STEP 2: After user approves (BEFORE any implementation)
# This MUST happen immediately when user says "approved"
step_2_after_approval:
  timing: "Immediately after user says 'approved'"
  file: .workflow-state.yaml
  changes:
    updates:
      - number: <N>
        status: approved  # Changed from pending-approval
        approved_at: <timestamp>
        
    status:
      pending_approval: null  # Clear pending flag
      last_action: "Approved update #<N>"
      next_action: "Run Phase <X> for update #<N>"
      current_phase: <restart_phase>
      current_update: <N>
      
    # Reset affected phases
    phases:
      phase_1_spec:
        status: pending-update-<N>
        previous_status: approved
      phase_2_tasks:
        status: pending-update-<N>
        previous_status: approved
      # ... etc for all affected phases

# STEP 3: Create update docs (BEFORE showing next prompt)
step_3_create_docs:
  timing: "After state updated, BEFORE showing next prompt"
  create_files:
    - 00_analysis/work-updates.md (append entry)
    - 00_analysis/work-description-update-<N>.md (if scope changed)
  
  THEN: Show next prompt command

##############################################################
#  RESUME BEHAVIOR
##############################################################

on_workflow_resume:
  check: status.pending_approval
  
  if_pending_approval_exists:
    # Session was interrupted after STOP but before user responded
    action: |
      Show:
      "Found pending update #<N> awaiting approval.
       
       Update details:
       - Type: <type>
       - Restart from: Phase <X>
       
       Reply:
       - `approved` to proceed with update
       - `cancel` to discard this update"
       
  if_update_approved_but_phase_not_started:
    # Session was interrupted after approval but before phase started
    action: |
      Show:
      "Update #<N> was approved. Ready to restart from Phase <X>.
       
       Run: `/phase-X-...`"
```

---

## Document Suffix Rules

```yaml
naming_convention:
  pattern: "<original-name>-update-<N>.md"
  
  examples:
    update_1:
      - spec-update-1.md
      - tasks-update-1.md
      - impl-log-update-1.md
      
    update_2:
      - spec-update-2.md
      - tasks-update-2.md
      - impl-log-update-2.md

  rules:
    - Original files preserved (never overwritten)
    - Each update creates new suffixed file
    - State tracks which version is current
    - All versions kept for audit trail
```

---

## Phase Execution with Update

When running phases after update:

```yaml
phase_execution:
  1. Check current_update in state
  2. If current_update > 0:
     - Use suffix "-update-<N>" for new docs
     - Reference previous version for context
     - Note what changed from previous
     - If update type is REQUIREMENT_CHANGE or SCOPE_EXPANSION:
       - Create `00_analysis/work-description-update-<N>.md`
       - Append an entry to `00_analysis/work-updates.md` linking to the update
  3. Update artifacts reference in state:
     artifacts:
       - path: spec-update-<N>.md
         status: complete
         replaces: spec.md  # or spec-update-<N-1>.md
```

---

## STOP Rules

```yaml
MUST_NOT:
  - Delete previous artifacts
  - Overwrite original files
  - Skip impact analysis
  - Auto-proceed without approval

MUST:
  - Preserve all previous versions
  - Track update number in state
  - Use correct suffix for new docs
  - Get approval before restarting
```

---

## Next Step

```yaml
##############################################################
#  RESPONSE HANDLING — DOCS ONLY, NO EXECUTION
##############################################################

RESPONSE_HANDLING:
  on_approved:
    DO:
      1. Update .workflow-state.yaml
      2. Create 00_analysis/work-description-update-N.md
      3. Append to 00_analysis/work-updates.md
      4. Show roadmap of prompts to run
      5. STOP and wait for user to run first phase prompt
      
    DO_NOT:
      - ❌ Create spec-update-N.md
      - ❌ Create tasks-update-N.md
      - ❌ Modify source code
      - ❌ Auto-execute phase prompts
      - ❌ Start implementation
      
  on_adjust_phase:
    DO:
      1. Update restart_from in state
      2. Recalculate affected_phases
      3. Show updated impact analysis
      4. Wait for approval
      
  on_cancel:
    DO:
      1. Remove pending update from state
      2. Restore previous status
      3. Confirm cancellation
```

| User Response | Action | Output |
|---------------|--------|--------|
| `approved` | Create docs → Show roadmap | "Run `/phase-X-...` to start" |
| `adjust phase <X>` | Recalculate → Show analysis | Updated impact analysis |
| `cancel` | Remove from state | "Update cancelled" |

---

## 📋 CHECKPOINT — End of work-update Scope

```yaml
##############################################################
#  🛑 THIS IS WHERE work-update PROMPT ENDS
#  🛑 USER MUST RUN PHASE PROMPTS MANUALLY
##############################################################

AFTER_SHOWING_ROADMAP:
  this_prompt_is_DONE: true
  
  user_must_now:
    - Read the roadmap
    - Run `/phase-X-...` manually to start first affected phase
    - Each phase prompt will create its own update artifacts
    
  copilot_must_not:
    - Auto-run any phase prompt
    - Start creating spec-update-N.md
    - Modify any code
    - "Continue" to next phase automatically
    
PROMPT_BOUNDARY:
  work-update_creates:
    - .workflow-state.yaml (update)
    - 00_analysis/work-description-update-N.md
    - 00_analysis/work-updates.md (append)
    
  phase-1-spec_creates:
    - 01_spec/spec-update-N.md
    
  phase-2-tasks_creates:
    - 02_tasks/tasks-update-N.md
    
  phase-3-impl_creates:
    - 03_impl/impl-log-update-N.md
    - Source code changes
    
  phase-4-tests_creates:
    - 04_tests/tests-update-N.md
    - Test files

NEXT_PROMPT_REFERENCE:
  restart_from_phase_0: "/phase-0-analysis"
  restart_from_phase_1: "/phase-1-spec"
  restart_from_phase_2: "/phase-2-tasks"
  restart_from_phase_3: "/phase-3-impl T-XXX"
  restart_from_phase_4: "/phase-4-tests"
```
