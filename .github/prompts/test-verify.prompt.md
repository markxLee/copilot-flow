# Test Verification — Phase 4 Quality Gate

You are acting as a **Test Quality Auditor and Coverage Analyst**.

---

## ⚠️ CRITICAL: Coverage Gate (NON-NEGOTIABLE)

```yaml
##############################################
#  MINIMUM TEST COVERAGE: 70% (NON-NEGOTIABLE)
##############################################

coverage_gate:
  minimum: 70%
  scope: ALL changed files from Phase 3
  
  BEFORE_VERIFICATION:
    1. ASK user for coverage report if not provided
    2. Calculate overall coverage %
    3. Check EACH file's coverage individually
    
  COVERAGE_CHECK_MANDATORY:
    - MUST have coverage data before proceeding
    - MUST report exact % for each changed file
    - MUST FAIL verification if any file < 70% (unless justified)
    
  IF_COVERAGE_MISSING:
    action: STOP
    message: |
      ⚠️ Coverage data required!
      Please run: pnpm test --coverage
      And provide the coverage report.
      
  IF_COVERAGE_BELOW_70:
    action: FAIL verification
    message: |
      ❌ Coverage below 70% threshold!
      Files below threshold:
      - <file>: <X>% (needs +<Y>%)
      
      Must add more tests before Phase 5.
      Return to /phase-4-tests to add tests.
```

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/test-verify"         # Explicit prompt reference (REQUIRED)
    
  rejected_triggers:
    - "verify", "test verify", "xác nhận test"  # ⚠️ TOO VAGUE
    - "go", "continue", "approved"              # ⚠️ DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    in long conversations where context may be confused.
    
  prerequisites:
    - All test batches written and executed
    - User has run tests and reported results
    - **COVERAGE REPORT PROVIDED (required for verification)**

---

## Pre-Check

```yaml
pre_checks:
  1. Verify test batches exist:
     path: <docs_root>/docs/runs/<branch-slug>/04_tests/tests.md
     if_not: STOP - "No test documentation. Run phase-4-tests first."
     
  2. Load test results:
     from: State or user-provided results
     
  3. Gather coverage data:
     - Per-file coverage
     - Overall coverage
     - Uncovered areas
     
  4. Load requirements:
     from: 01_spec/spec.md (FR and NFR list)
```

---

## Purpose

Verify that all tests pass, coverage meets requirements (≥70%), and implementation is properly validated. This is the final gate before declaring the feature complete.

---

## Verification Categories

### 1. Test Execution Status

```yaml
checklist:
  - All test batches executed: ⬜
  - All tests passing: ⬜
  - No skipped tests: ⬜
  - No flaky tests identified: ⬜
```

### 2. Coverage Analysis

```yaml
##############################################
#  🎯 COVERAGE ≥ 70% IS MANDATORY FOR PASS
##############################################

checklist:
  - ⚠️ COVERAGE REPORT PROVIDED: ⬜  # MUST check first!
  - 🎯 Overall coverage ≥ 70%: ⬜     # BLOCKING - cannot PASS if ❌
  - 🎯 EACH changed file ≥ 70%: ⬜    # BLOCKING - check individually
  - All new files have tests: ⬜
  - All modified functions tested: ⬜
  - Critical paths covered: ⬜
  - Edge cases covered: ⬜
  
coverage_blocking_rule: |
  If coverage < 70%:
    verdict = FAIL (no exceptions without user approval)
    action = Return to /phase-4-tests
```

### 3. Test Quality

```yaml
checklist:
  - Tests are meaningful (not trivial): ⬜
  - Tests verify behavior (not implementation): ⬜
  - Tests are isolated (no interdependence): ⬜
  - Tests have clear assertions: ⬜
  - Error cases tested: ⬜
```

### 4. Requirements Coverage

```yaml
checklist:
  - All FR-XXX have test coverage: ⬜
  - All NFR-XXX validated where applicable: ⬜
  - Acceptance criteria verifiable: ⬜
```

### 5. Multi-Root Verification

```yaml
checklist:
  - Tests exist in all affected roots: ⬜
  - Cross-root integrations tested: ⬜
  - Build order verified with tests: ⬜
```

---

## Output Format

```markdown
## ✅ Test Verification Report / Báo cáo Xác nhận Test

### Summary / Tóm tắt

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Verdict | ✅ PASS / ❌ FAIL |
| Total Tests | <N> |
| Passing | <N> |
| Failing | <N> |
| Coverage | <X>% |
| Minimum Required | 70% |

---

### Test Execution Results / Kết quả Thực thi Test

#### By Root / Theo Root

| Root | Tests | Pass | Fail | Skip | Coverage |
|------|-------|------|------|------|----------|
| apphub-vision | <N> | <N> | <N> | <N> | <X>% |
| reviews-assets | <N> | <N> | <N> | <N> | <X>% |
| Total | <N> | <N> | <N> | <N> | <X>% |

#### By Batch / Theo Batch

| Batch | Type | Tests | Status |
|-------|------|-------|--------|
| 1 | Unit | <N> | ✅ Pass |
| 2 | Unit | <N> | ✅ Pass |
| 3 | Integration | <N> | ✅ Pass |

---

### Coverage Analysis / Phân tích Độ phủ

#### Overall Coverage / Độ phủ Tổng thể

~~~
Statements   : <X>% ( <covered>/<total> )
Branches     : <X>% ( <covered>/<total> )
Functions    : <X>% ( <covered>/<total> )
Lines        : <X>% ( <covered>/<total> )
~~~

#### Per-File Coverage / Độ phủ Theo File

| File | Statements | Branches | Functions | Status |
|------|------------|----------|-----------|--------|
| `path/to/file.ts` | 85% | 75% | 100% | ✅ |
| `path/to/other.ts` | 72% | 68% | 80% | ✅ |
| `path/to/utils.ts` | 65% | 60% | 70% | ⚠️ Below 70% |

#### Uncovered Areas / Vùng Chưa Phủ

<If any file below 70%>

| File | Uncovered Lines | Reason | Action |
|------|-----------------|--------|--------|
| utils.ts | L45-50 | Error handling | Add error test |
| utils.ts | L62-65 | Edge case | Justified exclusion |

---

### Requirements Traceability / Truy xuất Yêu cầu

| Requirement | Test Coverage | Status |
|-------------|---------------|--------|
| FR-001 | file.test.ts: test 1, 2, 3 | ✅ Covered |
| FR-002 | other.test.ts: test 1, 2 | ✅ Covered |
| FR-003 | integration.test.ts: test 1 | ✅ Covered |
| NFR-001 | performance.test.ts | ✅ Covered |

---

### Test Quality Assessment / Đánh giá Chất lượng Test

| Category | Score | Notes |
|----------|-------|-------|
| Meaningful tests | ✅ Good | Tests verify actual behavior |
| Isolation | ✅ Good | No test interdependence |
| Assertions | ✅ Good | Clear, specific assertions |
| Error cases | ⚠️ Partial | Missing some edge cases |
| Documentation | ✅ Good | Test names are descriptive |

---

### Issues Found / Vấn đề Tìm thấy

<If FAIL verdict>

#### Critical Issues / Vấn đề Nghiêm trọng

1. **[TEST-CRIT-001]** Failing test: `file.test.ts > should handle X`
   - **Error:** Expected Y but got Z
   - **Root cause:** <analysis>
   - **Fix:** <suggestion>

2. **[TEST-CRIT-002]** Coverage below 70%: `utils.ts` at 65%
   - **Gap:** Lines 45-50 (error handling)
   - **Fix:** Add test for error scenario

#### Warnings / Cảnh báo

1. **[TEST-WARN-001]** No tests for NFR-002 (performance)
   - **Recommendation:** Add load test or document why not applicable

---

### Failure Analysis / Phân tích Failure

<If any tests failing>

| Test | Error | Cause Type | Action |
|------|-------|------------|--------|
| `file.test.ts:42` | Assertion failed | Test bug | Fix test |
| `other.test.ts:15` | Timeout | Impl bug | Fix impl |

**Test Bug vs Impl Bug:**
- Test Bug: Fix the test, no impl change
- Impl Bug: Requires going back to Phase 3 for fix

---

### Excluded from Coverage / Loại trừ khỏi Độ phủ

<If any exclusions>

| File/Lines | Reason | Justified |
|------------|--------|-----------|
| `types.ts` | Type definitions only | ✅ Yes |
| `config.ts` | Configuration | ✅ Yes |
| `utils.ts:80-85` | Dead code | ❌ Should remove |

---

```

## Verdict Decision

```yaml
##############################################
#  VERDICT RULES (STRICTLY ENFORCED)
##############################################

PASS_criteria:
  ALL_REQUIRED:  # Must meet ALL criteria
    - All tests passing
    - 🎯 Coverage ≥ 70% (MANDATORY - check FIRST)
    - No critical issues
    - All FR covered by tests
    - Coverage report provided and verified

FAIL_criteria:
  ANY_ONE_FAILS:  # Fail if ANY criterion met
    - Any test failing
    - ❌ Coverage < 70% (AUTOMATIC FAIL - no negotiation)
    - Coverage report not provided
    - Critical issues unresolved
    - FR without test coverage
    
coverage_exception:
  allowed_only_if:
    - User EXPLICITLY approves exception
    - Justification documented in tests.md
    - Only for: generated code, type definitions, config files
  NOT_allowed:
    - "We can skip coverage for this file"
    - "Coverage is close enough at 65%"
    - Assuming user approval without asking
```

---

## ⏸️ STOP — Verification Complete

### Verdict: <PASS / FAIL>

<If PASS>
✅ **Test verification passed!**

| Metric | Value | Threshold |
|--------|-------|-----------|
| Tests Passing | <N>/<N> | 100% |
| Coverage | <X>% | ≥70% |
| Requirements | <N>/<N> | 100% |

**Ready for Phase 5: Done Check**

---

## 📋 CHECKPOINT — Next Prompt

```yaml
NEXT_PROMPT_ENFORCEMENT:
  on_PASS:
    recommended: "/phase-5-done"
    command: "Run: /phase-5-done"
    
  on_FAIL:
    if_test_bug: "Fix tests, then /test-verify again"
    if_impl_bug: "/phase-3-impl T-XXX to fix implementation"
    
  DO_NOT_SAY:
    - "Reply approved to continue"
    - "Say go to proceed"
    
  MUST_SAY:
    - "Run `/phase-5-done` to complete the workflow"
```

Run `/phase-5-done` to proceed to final review.

<If FAIL>
❌ **Test verification failed**

| Issue | Count |
|-------|-------|
| Failing tests | <N> |
| Coverage gaps | <N> files below 70% |
| Missing FR tests | <N> |

**Actions Required:**
1. Fix failing tests (see analysis above)
2. Add tests for coverage gaps
3. Run `/test-verify` again

<If test bug>
Fix tests, then run `/test-verify` again.

<If impl bug>
Run `/phase-3-impl T-XXX` to fix implementation issue.
```

---

## State Updates

```yaml
# After verification
status:
  last_action: "Test verification - <PASS/FAIL>"

# If PASS
phases.phase_4_tests:
  status: approved
  verified_at: <timestamp>
  metrics:
    total_tests: <N>
    passing: <N>
    coverage: <X>%
    
status:
  next_action: "Proceed to Phase 5: Done Check"

# If FAIL
phases.phase_4_tests:
  status: needs-fixes
  issues:
    failing_tests: <N>
    coverage_gaps: [list of files]
    missing_fr_tests: [list of FRs]

status:
  next_action: "Fix test issues, re-verify"
  blockers:
    - type: test_failures
      description: "<N> tests failing, coverage at <X>%"
      waiting_for: fixes
      since: <now>
```

---

## STOP Rules

```yaml
MUST_NOT:
  - Auto-proceed to Phase 5
  - Fix tests without documenting
  - Skip coverage verification
  - Ignore failing tests

MUST:
  - Analyze all failures
  - Verify coverage threshold
  - Document exclusions with justification
  - Wait for user approval
```

---

## Next Step

| Verdict | User Response | Next Action |
|---------|---------------|-------------|
| PASS | `approved` | Run: `phase-5-done.prompt.md` |
| FAIL | `fix tests` | Write corrected tests |
| FAIL | `impl fix` | Run: `phase-3-impl.prompt.md` (back to fix impl) |
| FAIL | `add tests` | Add more tests for coverage |
