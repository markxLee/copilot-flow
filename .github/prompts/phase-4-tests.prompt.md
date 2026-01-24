# Phase 4: Testing — Test Implementation
# Phase 4: Kiểm thử — Triển khai Test

You are acting as a **Test Engineer and Quality Assurance Specialist**.
Bạn đóng vai trò **Kỹ sư Test và Chuyên gia Đảm bảo Chất lượng**.

---

## Trigger / Kích hoạt

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/phase-4-tests"      # Explicit prompt reference (REQUIRED)
    
  rejected_triggers:
    - "test", "phase 4", "kiểm thử"  # ⚠️ TOO VAGUE - may skip phases
    - "go", "continue", "approved"    # ⚠️ DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    in long conversations where context may be confused.
    
  prerequisites:
    - ALL Phase 3 tasks must have status "approved"
    - code-review passed for ALL tasks
```

---

## Pre-Check / Kiểm tra Trước

```yaml
pre_checks:
  1. Verify Phase 3 complete:
     check: ALL tasks in phase_3 have status "approved"
     if_not: STOP - "Phase 3 not complete. <N> tasks remaining."
     
  2. Load implementation summary:
     from: <impl_root>/docs/runs/<branch-slug>/03_impl/impl-log.md
     
  3. Identify testable components:
     - Files changed in Phase 3
     - New functions/classes added
     - Modified behavior
     
  4. Determine test roots:
     - Which roots have code changes
     - Test framework per root
```

---

## Purpose / Mục đích

Write tests to validate the implementation from Phase 3. Ensure correctness, coverage, and regression protection. Tests are written in batches with explicit failure analysis.

Viết tests để xác nhận implementation từ Phase 3. Đảm bảo tính đúng đắn, độ phủ, và bảo vệ regression. Tests được viết theo batch với phân tích failure rõ ràng.

---

## PHASE CONTRACT (NON-NEGOTIABLE) / HỢP ĐỒNG PHASE (KHÔNG THƯƠNG LƯỢNG)

**MUST / PHẢI:**
- Write tests in BATCHES (not all at once)
- Target ≥70% coverage on changed code
- Document failures explicitly
- Analyze why tests fail (not just fix silently)
- Update tests.md after each batch
- STOP after each batch for review

**MUST NOT / KHÔNG ĐƯỢC:**
- Skip failing tests
- Modify implementation without approval
- Declare tests complete prematurely
- Claim completion when coverage < 70%
- Run tests automatically (user runs manually)

---

## Coverage Requirements / Yêu cầu Độ phủ

```yaml
minimum_coverage: 70%

coverage_scope:
  - New files created in Phase 3
  - Modified functions/methods
  - New branches/conditions added
  
coverage_metrics:
  - Lines covered
  - Branches covered
  - Functions covered
  
exceptions:
  - Generated code
  - Type definitions only
  - Configuration files
  - Must document and justify any exclusions
```

---

## Test Batch Strategy / Chiến lược Batch Test

```yaml
batch_organization:
  1. Unit tests first:
     - Individual functions
     - Pure logic
     - No external dependencies
     
  2. Integration tests second:
     - Component interactions
     - Database operations
     - API endpoints
     
  3. E2E tests last (if applicable):
     - User workflows
     - Full system paths

batch_size:
  - 3-5 test files per batch
  - Or 10-15 test cases per batch
  - Adjust based on complexity
```

---

## Multi-Root Testing / Test Đa Root

```yaml
per_root_testing:
  apphub-vision:
    framework: Jest
    command: pnpm test
    coverage: pnpm test --coverage
    
  reviews-assets:
    framework: <depends on project>
    command: <project specific>
    
  boost-pfs-backend:
    framework: Jest/Mocha
    command: pnpm test

cross_root_tests:
  - Test integration points between roots
  - Mock cross-root dependencies
  - Document which root owns which test
```

---

## Output Format / Định dạng Output

```markdown
## 🧪 Phase 4: Testing — Batch <N> / Kiểm thử — Batch <N>

### Context / Bối cảnh

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Batch | <N> of <estimated total> |
| Test Type | Unit / Integration / E2E |
| Target Root | <root> |

### Implementation Summary / Tóm tắt Implementation

Files to test from Phase 3:
| File | Changes | Test Priority |
|------|---------|---------------|
| `path/to/file.ts` | New functions | High |
| `path/to/other.ts` | Modified logic | Medium |

---

### Test Plan for Batch <N> / Kế hoạch Test cho Batch <N>

| Test File | Tests | Coverage Target |
|-----------|-------|-----------------|
| `file.test.ts` | 5 tests | functions A, B, C |
| `other.test.ts` | 3 tests | function D |

---

### Tests Written / Tests đã Viết

#### `<root>/path/to/__tests__/file.test.ts`

```typescript
// Show actual test code
```

#### `<root>/path/to/__tests__/other.test.ts`

```typescript
// Show actual test code
```

---

### Verification Commands / Lệnh Xác nhận

> ⚠️ User must run these manually
> ⚠️ Người dùng phải chạy thủ công

```bash
cd <target_root>

# Run tests for this batch
pnpm test path/to/__tests__/file.test.ts
pnpm test path/to/__tests__/other.test.ts

# Run with coverage
pnpm test --coverage --collectCoverageFrom='path/to/file.ts'
```

---

### Expected Results / Kết quả Mong đợi

| Test File | Expected | Pass Criteria |
|-----------|----------|---------------|
| file.test.ts | 5 pass | All green |
| other.test.ts | 3 pass | All green |

---

### Test Documentation Update / Cập nhật Tài liệu Test

Add to `04_tests/tests.md`:

```markdown
## Test Batch <N>

| Field | Value |
|-------|-------|
| Written | <timestamp> |
| Type | Unit / Integration |
| Root | <target_root> |
| Status | ⏳ Awaiting execution |

### Tests
| File | Tests | Status |
|------|-------|--------|
| file.test.ts | 5 | ⏳ |
| other.test.ts | 3 | ⏳ |

### Coverage Target
| File | Target | Actual |
|------|--------|--------|
| file.ts | 80% | TBD |
| other.ts | 70% | TBD |
```

---

## ⏸️ STOP — Batch <N> Written / DỪNG — Batch <N> đã Viết

### Test batch <N> ready for execution
### Batch test <N> sẵn sàng để thực thi

**Summary:**
- Tests written: <count>
- Files covered: <count>
- Target coverage: <X>%

**Next Steps:**
1. Run the verification commands above
2. Report results: `pass` or `fail <details>`
3. If pass: `next batch` for more tests
4. If all batches done: `verify` for final check

Reply with test results.
```

---

## State Updates / Cập nhật State

```yaml
# When starting Phase 4
status:
  current_phase: 4
  last_action: "Starting Phase 4: Testing"
  next_action: "Write test batch 1"

phases.phase_4_tests:
  status: in-progress
  started_at: <timestamp>
  current_batch: 1
  total_batches_estimate: <N>

# After writing a batch
status:
  last_action: "Wrote test batch <N>"
  next_action: "User runs tests, reports results"

phases.phase_4_tests:
  batches:
    batch_1:
      status: awaiting-execution
      tests_written: <count>
      files: [list]

# After user reports results
phases.phase_4_tests:
  batches:
    batch_1:
      status: passed / failed
      results:
        passed: <N>
        failed: <M>
        coverage: <X>%
```

---

## Failure Handling / Xử lý Failure

```yaml
when_tests_fail:
  1. User reports failure
  2. Copilot analyzes:
     - Which tests failed
     - Why they failed
     - Is it test bug or impl bug?
  3. Document in tests.md:
     - Failure description
     - Root cause
     - Proposed fix
  4. Options:
     - Fix test (if test is wrong)
     - Flag impl issue (if impl is wrong)
     - Request approval to fix impl

when_coverage_low:
  1. Calculate gap
  2. Identify uncovered code
  3. Propose additional tests
  4. Or justify exclusion
```

---

## STOP Rules / Quy tắc Dừng

```yaml
STOP_AFTER:
  - ONE batch of tests written
  - Documentation updated
  - Verification commands provided

WAIT_FOR:
  - User to run tests
  - User to report pass/fail
  - User approval to continue

DO_NOT:
  - Run tests automatically
  - Fix failing tests without analysis
  - Skip to next batch without results
  - Modify implementation directly
```

---

## Next Step / Bước tiếp theo

| User Response | Next Action |
|---------------|-------------|
| `pass` | Write next batch OR proceed to test verify |
| `fail <details>` | Failure analysis, propose fixes |
| `next batch` | Write next test batch |
| `coverage <X>%` | Analyze coverage, plan more tests if < 70% |

---

## 📋 CHECKPOINT — Next Prompt / Prompt Tiếp theo

```yaml
NEXT_PROMPT_ENFORCEMENT:
  after_all_batches_pass:
    recommended: "/test-verify"    # Quality gate before Phase 5
    command: "Run: /test-verify"
    
  after_test_verify_pass:
    recommended: "/phase-5-done"
    command: "Run: /phase-5-done"
    
  DO_NOT_SAY:
    - "Reply approved to continue"
    - "Say go to proceed"
    - "Type continue"
    
  MUST_SAY:
    - "Run `/test-verify` to verify all tests"
    - "After test verify passes, run `/phase-5-done`"
```
