# Lite Mode
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

> Streamlined workflow for simple tasks that don't need all 6 phases.

---

## 🎯 Purpose

Skip unnecessary phases for small, well-defined tasks:
- Simple bug fixes with clear cause
- Small feature additions (< 3 files)
- Configuration changes
- Documentation updates
- Refactoring with limited scope



---

## Trigger

```yaml
TRIGGER_RULES:
  accepted_triggers:
    - "/lite-mode"               # Explicit prompt reference (RECOMMENDED)
    - "lite: <description>"      # Prefix syntax
    - "quick: <description>"     # Prefix syntax
    - "simple fix", "small change", "quick task"
    
  why: |
    Lite mode intent is clear from prefix or explicit request.
    The prompt validates appropriateness before proceeding.
```

---

## When to Use

```yaml
use_lite_mode:
  conditions:
    - Task is well-understood (no analysis needed)
    - Scope is small (≤ 3 files typically)
    - No architectural decisions required
    - Single developer work
    - Low risk change
    
  examples:
    - "lite: fix typo in error message"
    - "lite: add loading spinner to button"
    - "lite: update API endpoint URL"
    - "lite: rename variable for clarity"
    - "quick: add null check to prevent crash"

do_not_use_lite_mode:
  conditions:
    - Multiple components affected
    - New feature with unclear requirements
    - Architectural changes
    - Security-sensitive code
    - Breaking changes
    - Requires team discussion
    
  examples:
    - Adding new authentication flow
    - Database schema changes
    - API contract changes
    - Cross-cutting concerns
```

---

## Lite Mode Phases

```
┌─────────────────────────────────────────────────────────────┐
│                    LITE MODE WORKFLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   CAPTURE   │───▶│  IMPLEMENT  │───▶│   VERIFY    │    │
│   │   (quick)   │    │   (do it)   │    │   (check)   │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                             │                   │           │
│                             ▼                   ▼           │
│                      ⏸️ Review Gate      ⏸️ Done Gate       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Compared to Full Mode:
┌───────────────────────────────────────────────────────────────┐
│ Full:  0-Analysis → 1-Spec → 2-Tasks → 3-Impl → 4-Test → 5-Done │
│ Lite:  Capture ─────────────────────→ Impl ──→ Verify ──→ Done  │
└───────────────────────────────────────────────────────────────┘
```

---

## Step 1: Capture

When user triggers lite mode:

```yaml
capture_actions:
  1. Extract from user request:
     - What: The change to make
     - Where: Files/components affected
     - Why: Reason for change (optional)
     
  2. Validate lite mode appropriateness:
     - Is scope small enough?
     - Is task well-defined?
     - Are there hidden complexities?
     
  3. If NOT appropriate:
     - Suggest full workflow
     - Explain why
```

**Output:**
```markdown
## ⚡ Lite Mode: <task_title>

### Quick Capture / Nắm bắt Nhanh

| Aspect | Value |
|--------|-------|
| Task | <what to do> |
| Files | <expected files, or "TBD"> |
| Risk | Low / Medium |
| Estimated | <X minutes> |

### Scope Check / Kiểm tra Phạm vi

| Criterion | Status |
|-----------|--------|
| Well-defined? | ✅ / ⚠️ |
| Small scope (≤3 files)? | ✅ / ⚠️ |
| No arch decisions? | ✅ / ⚠️ |
| Low risk? | ✅ / ⚠️ |

<If all ✅>
✅ **Lite mode appropriate.** Proceeding with implementation.

<If any ⚠️>
⚠️ **Consider full workflow.** This task may be more complex than it appears.

Reasons:
- <reason 1>
- <reason 2>

Options:
1. `continue lite` — Proceed anyway (your call)
2. `full workflow` — Switch to full 6-phase workflow

---

Ready to implement? Say `go` or describe any constraints.
```

---

## Step 2: Implement

```yaml
implement_actions:
  1. Analyze current code:
     - Read relevant files
     - Understand context
     
  2. Make changes:
     - Edit files directly
     - Keep changes minimal and focused
     
  3. Document changes:
     - List what was changed
     - Note any considerations
```

**Output after implementation:**
```markdown
## ✏️ Implementation Complete / Triển khai Xong

### Changes Made / Các Thay đổi

| File | Change | Lines |
|------|--------|-------|
| <file1> | <description> | +X/-Y |
| <file2> | <description> | +X/-Y |

### Summary / Tóm tắt

<Brief description of what was done>

### Verification Commands / Lệnh Kiểm tra

```bash
# Build check
<build_command>

# Type check (if applicable)
<type_check_command>

# Run related tests
<test_command>
```

---

⏸️ **STOP — Review Changes**

Please verify:
1. [ ] Changes look correct
2. [ ] Build passes
3. [ ] Tests pass (if applicable)

Reply:
- `approved` / `ok` — Changes are good, proceed to done
- `issue: <description>` — Found a problem
- `rollback` — Undo these changes
```

---

## Step 3: Verify

After user approves:

```yaml
verify_actions:
  1. Create minimal documentation:
     - Add entry to lite-log.md (if exists)
     - Or create brief record
     
  2. Update state (if workflow was active):
     - Mark as lite-mode completion
     
  3. Provide commit guidance
```

**Output:**
```markdown
## ✅ Lite Mode Complete

### Task Summary / Tóm tắt Task

| Aspect | Value |
|--------|-------|
| Task | <task_title> |
| Files Changed | <count> |
| Mode | Lite (skipped phases 0-2) |
| Duration | <estimated time> |

### Changes / Thay đổi
- <file1>: <change summary>
- <file2>: <change summary>

---

### Commit Suggestion / Gợi ý Commit

```bash
git add <files>
git commit -m "<type>(<scope>): <description>"
```

Example:
```bash
git add src/components/Button.tsx
git commit -m "fix(ui): add loading state to submit button"
```

---

### Next Steps / Bước tiếp theo

| Option | Action |
|--------|--------|
| `another lite` | Start another lite task |
| `pr` | Generate PR description |
| `done` | End session |

---

**Quick PR Description:**

```markdown
## What
<task_title>

## Changes
- <change 1>
- <change 2>

## Testing
- [ ] Build passes
- [ ] Manual verification done
```
```

---

## State Management

Lite mode creates minimal state:

```yaml
# .workflow-state.yaml (if exists)
lite_tasks:
  - id: lite-001
    title: "<task_title>"
    started_at: "<timestamp>"
    completed_at: "<timestamp>"
    files_changed:
      - <file1>
      - <file2>
    status: completed
```

Or standalone (no state file needed for truly quick tasks).

---

## Escalation to Full Mode

If during lite mode, complexity is discovered:

```markdown
## ⚠️ Complexity Detected

While implementing, I found this task is more complex than expected:

### Issues Found / Vấn đề Phát hiện
- <issue 1: e.g., "Affects 5+ files">
- <issue 2: e.g., "Requires API change">
- <issue 3: e.g., "Has security implications">

### Recommendation / Khuyến nghị

Switch to **Full Workflow** for proper:
- Analysis of all impacts
- Specification of requirements
- Task breakdown
- Code review gates

---

**Options:**
1. `escalate` — Switch to full workflow (recommended)
2. `continue lite` — Proceed anyway (at your risk)
3. `pause` — Stop and think about it
```

---

## Integration with Full Workflow

```yaml
integration:
  # Lite task within active workflow
  if_workflow_active:
    action: |
      Add lite task to impl-log as "lite task"
      Don't disrupt main workflow state
      
  # Standalone lite task
  if_no_workflow:
    action: |
      No state file needed
      Just implement and commit
      
  # Lite task that escalates
  if_escalated:
    action: |
      Create workflow state
      Initialize at Phase 0
      Preserve any work done
```

---

## Safety Rules

```yaml
safety:
  DO_NOT:
    - Skip review gate (user must verify)
    - Use lite mode for risky changes
    - Implement without understanding context
    - Make changes beyond stated scope
    
  MUST:
    - Validate lite mode appropriateness
    - Show all changes before completion
    - Offer escalation if complexity found
    - Provide rollback option
```

---

## Quick Commands in Lite Mode

| Command | Action |
|---------|--------|
| `go` | Proceed to next step |
| `ok` / `approved` | Approve and continue |
| `issue: <text>` | Report a problem |
| `rollback` | Undo changes |
| `escalate` | Switch to full workflow |
| `done` | Complete and exit |

---

## Next Step

| Stage | Next Prompt |
|-------|-------------|
| After Capture | Implementation (inline) |
| After Implementation | User verification |
| After Verification | Done OR `pr-description.prompt.md` |
| If Escalated | `work-intake.prompt.md` → Full workflow |

---

## Example

```
User: lite: fix the typo in the login error message

Copilot:
## ⚡ Lite Mode: Fix Login Error Typo

### Quick Capture
| Aspect | Value |
|--------|-------|
| Task | Fix typo in login error message |
| Files | TBD (likely 1 file) |
| Risk | Low |
| Estimated | 2 minutes |

### Scope Check
| Criterion | Status |
|-----------|--------|
| Well-defined? | ✅ |
| Small scope? | ✅ |
| No arch decisions? | ✅ |
| Low risk? | ✅ |

✅ Lite mode appropriate. Let me find and fix the typo...

[Copilot searches for error messages, finds the typo, makes the fix]

## ✏️ Implementation Complete

### Changes Made
| File | Change | Lines |
|------|--------|-------|
| src/auth/messages.ts | Fixed typo: "authetication" → "authentication" | +1/-1 |

### Verification
```bash
pnpm build
```

⏸️ **STOP — Review Changes**

Please verify the change looks correct.
Reply `ok` to complete.

User: ok

Copilot:
## ✅ Lite Mode Complete

| Task | Fix Login Error Typo |
| Files | 1 |
| Mode | Lite |

### Commit Suggestion
```bash
git add src/auth/messages.ts
git commit -m "fix(auth): correct typo in login error message"
```

Done! 🎉
```
