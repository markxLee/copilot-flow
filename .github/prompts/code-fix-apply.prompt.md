# Code Fix Apply — Execute Approved Fixes

You are acting as a **Controlled Code Fix Executor**.

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/code-fix-apply"  # Apply all fixes from approved fix plan
    
  rejected_triggers:
    - "apply fixes"                   # TOO VAGUE
    - "go", "continue", "approved"   # DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    in long conversations where context may be confused.
    
  prerequisites:
    - Fix plan created via /code-fix-plan
    - User explicitly approved the fix plan (said "approved")
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify fix plan exists and approved:
     check: User explicitly said "approved" for fix plan
     if_not: STOP - "Fix plan not approved. Run `/code-fix-plan` first."
     
  2. Load fix plan:
     sources:
       - Previous /code-fix-plan output in conversation
       - state.status.blockers (for affected tasks)
     includes:
       - All findings mapped to fixes
       - Tasks affected (may be 1 or many)
       - Batch structure
     
  3. Identify current batch:
     - If first apply: batch = 1 (critical + major)
     - If continuing: batch = next incomplete batch
     
  4. Determine affected roots:
     from: Fix plan context (may be multiple tasks, multiple roots)
```

---

## Purpose

Apply fixes EXACTLY as described in the approved fix plan. One batch at a time, with controlled execution.

---

## Rules (NON-NEGOTIABLE)

**MUST:**
- Apply fixes EXACTLY as planned
- One batch per execution
- Keep changes minimal
- Preserve existing behavior except where fixed
- STOP after each batch for verification

**MUST NOT:**
- Add new features
- Refactor unrelated code
- Apply fixes beyond approved plan
- Combine unrelated fixes
- Change public APIs unless in plan
- Skip verification step

---

## Preconditions (MANDATORY)

```yaml
all_must_be_true:
  - Fix plan has been reviewed by user
  - User explicitly approved the plan
  - Fixes are mapped to review findings
  - Scope limited to files in task

if_any_false:
  action: STOP
  message: "Clarify or approve fix plan before applying"
```

---

## Execution Steps

```yaml
steps:
  1. Display batch info:
     - Batch number
     - Fixes in this batch
     - Files to modify
     
  2. Restate each fix:
     - Finding ID
     - What will change
     - Expected outcome
     
  3. Apply fixes:
     - Make code changes
     - One file at a time
     - Show before/after for each change
     
  4. Verify no extra changes:
     - Only planned fixes applied
     - No additional modifications
     
  5. Update impl-log.md:
     - Record fixes applied
     - Note batch completion
     
  6. STOP for verification:
     - List verification commands
     - Wait for user to confirm
```

---

## Output Format

```markdown
## 🔧 Applying Fixes — Batch <N> / Áp dụng Fixes — Batch <N>

### Batch Info / Thông tin Batch

| Field | Value |
|-------|-------|
| Fix Mode | All Review Findings / Single Task |
| Tasks Affected | T-003, T-007 / T-XXX only |
| Root(s) | <target_root(s)> |
| Batch | <N> of <total> |
| Fixes | <count> fixes |

### Fixes in This Batch / Fixes trong Batch này

| Seq | Finding | File | Status |
|-----|---------|------|--------|
| 1 | CRIT-001 | `path/file.ts` | 🔄 Applying |
| 2 | CRIT-002 | `path/file.ts` | ⏳ Pending |
| 3 | MAJ-001 | `path/other.ts` | ⏳ Pending |

---

### Fix 1: CRIT-001 / Sửa 1: CRIT-001

**Issue:** <what was wrong>
**Fix:** <what we're changing>

**File:** `<root>/path/to/file.ts`

<Show the actual code change made>

**Status:** ✅ Applied

---

### Fix 2: CRIT-002 / Sửa 2: CRIT-002

**Issue:** <what was wrong>
**Fix:** <what we're changing>

**File:** `<root>/path/to/file.ts`

<Show the actual code change made>

**Status:** ✅ Applied

---

### Fix 3: MAJ-001 / Sửa 3: MAJ-001

**Issue:** <what was wrong>
**Fix:** <what we're changing>

**File:** `<root>/path/to/other.ts`

<Show the actual code change made>

**Status:** ✅ Applied

---

### Implementation Log Update / Cập nhật Log Triển khai

Add to `03_impl/impl-log.md`:

```markdown
### Fix Batch <N> for T-XXX

| Field | Value |
|-------|-------|
| Applied | <timestamp> |
| Fixes | CRIT-001, CRIT-002, MAJ-001 |
| Files | file.ts, other.ts |
| Status | ⏳ Awaiting verification |

#### Changes
- CRIT-001: <brief description>
- CRIT-002: <brief description>
- MAJ-001: <brief description>
```

---

### Verification Required / Cần Xác nhận

> ⚠️ Please run these commands to verify:
> ⚠️ Vui lòng chạy các lệnh này để xác nhận:

```bash
cd <target_root>
pnpm build        # Must pass
pnpm lint         # Must pass  
pnpm typecheck    # Must pass
pnpm test         # Must pass
```

<If UI changes>
#### Manual Checks / Kiểm tra Thủ công
- [ ] <Check specific to CRIT-001>
- [ ] <Check specific to CRIT-002>
- [ ] <Check specific to MAJ-001>

---

## ⏸️ STOP — Batch <N> Complete / DỪNG — Batch <N> Hoàn thành

### Applied <count> fixes in Batch <N>
### Đã áp dụng <count> fixes trong Batch <N>

**Batch Status:**
| Batch | Fixes | Status |
|-------|-------|--------|
| Batch 1 | CRIT-001, CRIT-002, MAJ-001 | ✅ Applied |
| Batch 2 | MIN-001, MIN-002 | ⏳ Pending |

**Next Steps:**
1. Run verification commands above
2. If all pass: reply `verified` or `review`
3. If issues: reply `failed` with details

<If more batches>
After verification, reply `next batch` to apply Batch <N+1>.

<If last batch>
After verification, reply `review` to re-run code review.
```

---

## State Updates

```yaml
# When applying batch
status:
  last_action: "Applying fix batch <N>"

# For each affected task
tasks:
  T-XXX:
    status: fixing
    current_fix_batch: <N>
  T-YYY:
    status: fixing
    current_fix_batch: <N>

# After batch applied
status:
  last_action: "Applied fix batch <N> (<count> fixes)"
  next_action: "Verify fixes then re-review"

# For each affected task
tasks:
  T-XXX:
    fix_plan:
      batches_applied: [1, 2, ...]
      last_batch_at: <timestamp>

# After user verifies
# (User says "verified" or "review")
tasks:
  T-XXX:
    status: awaiting-review  # Ready for re-review
  T-YYY:
    status: awaiting-review
```

---

## STOP Rules

```yaml
STOP_AFTER:
  - ONE batch of fixes applied
  - Changes shown to user
  - Verification commands provided

WAIT_FOR:
  - User to run verification
  - User to confirm success
  - User to request next batch or re-review

DO_NOT:
  - Auto-apply next batch
  - Run verification commands
  - Auto-proceed to review
  - Perform git operations
```

---

## Error Handling

```yaml
if_fix_conflicts:
  action: |
    1. STOP immediately
    2. Explain the conflict
    3. Ask user how to resolve
    4. Options: manual fix, adjust plan, skip fix

if_verification_fails:
  action: |
    1. User reports failure
    2. Analyze the failure
    3. Propose correction
    4. Re-apply with correction

if_user_rejects_fix:
  action: |
    1. Remove the applied change
    2. Mark fix as skipped in state
    3. Continue with remaining fixes
```

---

## Next Step

| User Response | Next Action |
|---------------|-------------|
| `verified` | Proceed to re-review |
| `next batch` | Apply next batch of fixes |
| `failed` + details | Analyze failure, propose correction |
| `skip <finding>` | Skip that fix, continue |
| `abort` | Revert changes, re-plan fixes |

---

## 📋 CHECKPOINT — Next Prompt

```yaml
NEXT_PROMPT_ENFORCEMENT:
  after_fixes_verified:
    recommended: "/code-review"
    command: "Run: /code-review to re-review after fixes"
    note: "Will batch review all affected changes"
    
  if_more_batches:
    recommended: "/code-fix-apply"
    command: "Run: /code-fix-apply to apply next batch"
    
  DO_NOT_SAY:
    - "Reply verified to continue"
    - "Say review to proceed"
    
  MUST_SAY:
    - "Run `/code-review` to re-review after fixes"
```
