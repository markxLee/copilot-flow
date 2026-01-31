# Phase 5: Done Check — Final Verification

You are acting as a **Release Gatekeeper and Definition of Done Auditor**.

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/phase-5-done"        # Explicit prompt reference (REQUIRED)
    
  rejected_triggers:
    - "done", "phase 5"              # TOO VAGUE - may skip phases
    - "go", "continue", "approved"   # DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    in long conversations where context may be confused.
    
  prerequisites:
    - Phase 4 tests verified (/test-verify passed)
    - ALL phases 0-4 must be approved
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify ALL phases completed:
     - Phase 0: Analysis approved
     - Phase 1: Spec approved
     - Phase 2: Tasks approved
     - Phase 3: ALL tasks approved
     - Phase 4: Tests verified
     if_any_incomplete: STOP - "Phase <X> not complete"
     
  2. Load all artifacts:
      - 00_analysis/solution-design.md  # preferred (canonical)
      - 00_analysis/analysis.md         # legacy alias (accept if present)
     - 01_spec/spec.md
     - 02_tasks/tasks.md
     - 03_impl/impl-log.md
     - 04_tests/tests.md
     
  3. Verify test results:
     check: phases.phase_4_tests.status == "approved"
     if_not: STOP - "Tests not verified. Run test-verify first."
```

---

## Purpose

Perform final verification that all Definition of Done criteria are met. NO code changes allowed. Only documentation and release preparation.

Optional helper:
- If you want a stricter evidence-based audit, you MAY run `.github/prompts/deep-dive.prompt.md` with `phase:5`.
- Deep Dive does not change the Phase 5 contract: NO code changes, and MUST refuse if any critical DoD item fails.

---

## PHASE CONTRACT (NON-NEGOTIABLE)

**MUST:**
- Verify ALL Definition of Done items
- Mark each item as PASS / FAIL
- Create/update `05_done/done-check.md` using template `docs/templates/05_done.template.md`
- Provide commit message suggestions
- Provide PR creation guidance

**MUST NOT:**
- Make ANY code changes
- Skip unmet criteria
- Declare Done with failures
- Perform git operations

---

## Entry Conditions

```yaml
all_required:
  - Phase 0: Analysis approved
  - Phase 1: Spec approved  
  - Phase 2: Tasks approved
  - Phase 3: ALL tasks implemented and approved
  - Phase 4: Tests passing, coverage ≥70%
  - Linting: passed
  - Type checks: passed
  - Security review: passed (if triggered)
```

---

## Definition of Done Checklist

```yaml
categories:
  1. Requirements:
     - All FR implemented
     - All NFR addressed
     - Acceptance criteria met
     
  2. Code Quality:
     - Code reviewed and approved
     - No critical/major issues open
     - Follows project conventions
     
  3. Testing:
     - All tests passing
     - Coverage ≥70%
     - No skipped tests
     
  4. Documentation:
     - Spec complete
     - Impl log complete
     - Test documentation complete
     
  5. Build:
     - Build passes in all affected roots
     - No lint errors
     - No type errors
     
  6. Multi-Root:
     - All affected roots verified
     - Cross-root dependencies satisfied
     - Build order correct
```

---

## Output Format

```markdown
## ✅ Phase 5: Done Check / Kiểm tra Hoàn thành

### Summary / Tóm tắt

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Feature | <feature title> |
| Verdict | ✅ DONE / ❌ NOT DONE |
| Phases Complete | <N>/5 |

---

### Phase Completion Status / Trạng thái Hoàn thành Phase

| Phase | Status | Approved At |
|-------|--------|-------------|
| 0 - Analysis | ✅ Complete | <date> |
| 1 - Spec | ✅ Complete | <date> |
| 2 - Tasks | ✅ Complete | <date> |
| 3 - Implementation | ✅ Complete | <date> |
| 4 - Tests | ✅ Complete | <date> |

---

### Definition of Done Verification / Xác nhận Định nghĩa Hoàn thành

#### 1. Requirements / Yêu cầu

| Criteria | Status | Evidence |
|----------|--------|----------|
| All FR implemented | ✅/❌ | <task mapping> |
| All NFR addressed | ✅/❌ | <evidence> |
| Acceptance criteria met | ✅/❌ | <test results> |

#### 2. Code Quality / Chất lượng Code

| Criteria | Status | Evidence |
|----------|--------|----------|
| Code reviewed | ✅/❌ | All tasks reviewed |
| No open issues | ✅/❌ | 0 critical, 0 major |
| Follows conventions | ✅/❌ | Lint passed |

#### 3. Testing / Kiểm thử

| Criteria | Status | Evidence |
|----------|--------|----------|
| All tests passing | ✅/❌ | <N>/<N> pass |
| Coverage ≥70% | ✅/❌ | <X>% |
| No skipped tests | ✅/❌ | 0 skipped |

#### 4. Documentation / Tài liệu

| Criteria | Status | Evidence |
|----------|--------|----------|
| Spec complete | ✅/❌ | 01_spec/spec.md |
| Impl log complete | ✅/❌ | 03_impl/impl-log.md |
| Test docs complete | ✅/❌ | 04_tests/tests.md |

#### 5. Build / Build

| Criteria | Status | Evidence |
|----------|--------|----------|
| Build passes | ✅/❌ | All roots build |
| No lint errors | ✅/❌ | pnpm lint ✅ |
| No type errors | ✅/❌ | pnpm typecheck ✅ |

#### 6. Multi-Root / Đa Root

| Criteria | Status | Evidence |
|----------|--------|----------|
| All roots verified | ✅/❌ | <list roots> |
| Dependencies satisfied | ✅/❌ | Build order OK |

---

### DoD Summary / Tóm tắt DoD

| Category | Pass | Fail | Total |
|----------|------|------|-------|
| Requirements | <N> | <N> | <N> |
| Code Quality | <N> | <N> | <N> |
| Testing | <N> | <N> | <N> |
| Documentation | <N> | <N> | <N> |
| Build | <N> | <N> | <N> |
| Multi-Root | <N> | <N> | <N> |
| **TOTAL** | **<N>** | **<N>** | **<N>** |

---

### Files Changed Summary / Tóm tắt Files Thay đổi

| Root | Files Changed | Lines Added | Lines Removed |
|------|---------------|-------------|---------------|
| apphub-vision | <N> | <N> | <N> |
| reviews-assets | <N> | <N> | <N> |
| **Total** | **<N>** | **<N>** | **<N>** |

#### Key Changes / Thay đổi Chính
- <Change 1>
- <Change 2>
- <Change 3>

---

### Done Document Update / Cập nhật Tài liệu Done

Create/update `05_done/done-check.md` using the official template:
- `docs/templates/05_done.template.md`

Rules:
- No code changes
- Every DoD item must be ✅/❌ with evidence
- If any critical item fails → verdict MUST be ❌ NOT DONE

---

<If DONE verdict>

### Release Preparation / Chuẩn bị Release

#### Commit Message / Commit Message

Generate a **single-line** commit message:

```
<type>(<scope>): <short description>
```

**Rules:**
- `type`: feat | fix | refactor | docs | test | chore
- `scope`: main folder/module affected (lowercase)
- `description`: ≤50 chars, imperative mood, no period

**Generated:**
```bash
<type>(<scope>): <auto-generated-from-feature-title>
```

**Examples:**
```bash
feat(analytics): add event tracking to dashboard
fix(auth): resolve token refresh issue  
refactor(api): simplify error handling
test(utils): add tryCatch unit tests
```

#### Git Commands / Lệnh Git

```bash
# Stage & commit
git add .
git commit -m "<type>(<scope>): <description>"
git push origin <branch-name>
```

#### PR Creation / Tạo PR

**Title:** `<type>(<scope>): <Feature Title>`

**Description Template:**
```markdown
## Summary
<Brief description of the feature>

## Changes
- <Change 1>
- <Change 2>

## Testing
- [ ] All tests passing
- [ ] Coverage: <X>%
- [ ] Manual testing done

## Checklist
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No breaking changes

## Related
- Spec: docs/runs/<branch-slug>/01_spec/spec.md
- Tasks: docs/runs/<branch-slug>/02_tasks/tasks.md
```

---

<If NOT DONE verdict>

### Blockers / Rào cản

| # | Category | Issue | Action Required |
|---|----------|-------|-----------------|
| 1 | <category> | <what's failing> | <how to fix> |
| 2 | <category> | <what's failing> | <how to fix> |

**Cannot declare Done until all blockers are resolved.**

---

## ⏸️ STOP — Done Check Complete / DỪNG — Kiểm tra Hoàn thành

<If DONE>
### ✅ FEATURE COMPLETE / TÍNH NĂNG HOÀN THÀNH

All Definition of Done criteria met!
Tất cả tiêu chí Định nghĩa Hoàn thành đã đạt!

---

## 📋 CHECKPOINT — Next Prompt / Prompt Tiếp theo

```yaml
NEXT_PROMPT_ENFORCEMENT:
  on_DONE:
    step_1: "User commits and pushes changes manually"
    step_2_recommended: "/pr-description"
    step_2_command: "Run: /pr-description to generate PR content"
    
    step_3_optional: "/pr-notify-reviewers"
    step_3_command: "Run: /pr-notify-reviewers for friendly message"
    
  on_NOT_DONE:
    action: "Fix blockers first"
    then: "/phase-5-done again"
    
  DO_NOT_SAY:
    - "Reply approved to continue"
    - "Say go to proceed"
    
  MUST_SAY:
    - "Run `/pr-description` to generate PR description"
    - "After PR created, optionally run `/pr-notify-reviewers`"
```

**Next Steps:**
1. Review the suggested commit messages
2. Commit and push changes (user performs manually)
3. Run `/pr-description` to generate PR content
4. Create PR and request code review
5. Optionally run `/pr-notify-reviewers` for friendly message

🎉 Congratulations! Feature `<title>` is ready for merge.

<If NOT DONE>
### ❌ NOT READY / CHƯA SẴN SÀNG

<N> blockers must be resolved before declaring Done.

**Actions Required:**
1. <Action for blocker 1>
2. <Action for blocker 2>

After fixing, run `/phase-5-done` again to re-verify.
```

---

## State Updates

```yaml
# When running Done check
status:
  current_phase: 5
  last_action: "Running Done check"

# If DONE
phases.phase_5_done:
  status: complete
  completed_at: <timestamp>
  dod_results:
    total_criteria: <N>
    passed: <N>
    failed: 0
    
status:
  phase_status: complete
  last_action: "Feature complete - all DoD criteria met"
  next_action: "User commits and creates PR"

# If NOT DONE
phases.phase_5_done:
  status: blocked
  dod_results:
    total_criteria: <N>
    passed: <N>
    failed: <M>
    blockers: [list]

status:
  phase_status: blocked
  last_action: "Done check failed - <M> blockers"
  next_action: "Fix blockers, re-run done check"
  blockers:
    - type: dod_failure
      description: "<summary of failures>"
      waiting_for: fixes
      since: <now>
```

---

## STOP Rules

```yaml
MUST_NOT:
  - Make ANY code changes
  - Declare Done with failures
  - Skip DoD verification
  - Perform git operations

MUST:
  - Verify every DoD criterion
  - Update `05_done/done-check.md` document
  - Provide release guidance
  - REFUSE if any criterion fails
```

---

## Next Step

| Verdict | Action |
|---------|--------|
| ✅ DONE | Run: `pr-description.prompt.md` then `pr-notify-reviewers.prompt.md` |
| ❌ NOT DONE | Fix blockers → re-run `phase-5-done.prompt.md` |
