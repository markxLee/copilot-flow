# Test Plan & Log — `<Feature Name>`
<!-- Template Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->
<!-- 🇻🇳 Vietnamese first, 🇬🇧 English follows — for easy scanning -->

---

## Mode-Specific Role

<!-- Phase 4 có vai trò khác nhau tùy dev_mode -->

| Mode | Phase 4 Role |
|------|-------------|
| **Standard** | Write tests + Run tests + Log results |
| **TDD** | Run full suite + Integration/E2E tests + Coverage validation |

### TDD Mode Note
🇻🇳 Trong TDD mode, unit tests đã được viết ở Phase 3. Phase 4 tập trung vào:
- Chạy full test suite (tất cả tests từ Phase 3)
- Viết integration/E2E tests nếu cần
- Verify coverage đạt target
- Regression testing

🇬🇧 In TDD mode, unit tests were written in Phase 3. Phase 4 focuses on:
- Running full test suite (all tests from Phase 3)
- Writing integration/E2E tests if needed
- Verifying coverage meets target
- Regression testing

---

## TL;DR

| Aspect | Value |
|--------|-------|
| Feature | `<name>` |
| Dev Mode | Standard / TDD |
| Test Types | Unit / Integration / E2E |
| Total Tests | `<N>` |
| Passed | `<X>` |
| Failed | `<Y>` |
| Coverage | `<Z>`% |
| Status | 🟢 All Pass / 🔴 Has Failures |

---

## 1. Test Strategy

🇻🇳 Mô tả chiến lược test: những gì cần test, approach, và mức độ coverage mong muốn.

🇬🇧 Describe test strategy: what needs testing, approach, and target coverage level.

---

## 2. Test Matrix

| Test ID | Description | Type | FR Covered | Status |
|---------|-------------|------|------------|--------|
| TC-001 | `<description>` | Unit | FR-001 | ⏳ |
| TC-002 | `<description>` | Integration | FR-001 | ⏳ |
| TC-E01 | `<edge case>` | Unit | EC-001 | ⏳ |

**Legend:**
- ✅ Pass
- ❌ Fail
- ⏳ Pending
- ⏭️ Skipped

---

## 3. Test Boundaries

| What | Approach |
|------|----------|
| Database calls | `@prisma/client` mocked |
| External APIs | `fetch` mocked |
| Time-dependent | `jest.useFakeTimers()` |

---

## 4. Tests by Root

### Root: `<root-name>`

| Aspect | Value |
|--------|-------|
| Framework | Jest / Vitest / Pytest |
| Config File | `<path-to-config>` |
| Run Command | `pnpm --filter <pkg> test` |

---

#### TC-001: `<Test Name>`

| Aspect | Value |
|--------|-------|
| File | `<test-file-path>` |
| Covers | FR-001 |
| Type | Unit |

##### Description

🇻🇳 Mô tả test case này kiểm tra gì và tại sao quan trọng.

🇬🇧 Describe what this test case verifies and why it's important.

##### Test Code

```typescript
describe('ComponentName', () => {
  it('should do something', async () => {
    // Arrange
    const input = { ... };
    
    // Act
    const result = await functionUnderTest(input);
    
    // Assert
    expect(result).toEqual(expected);
  });
});
```

##### Mocks Required

🇻🇳 Liệt kê các mock cần thiết và lý do.

🇬🇧 List required mocks and why.

---

#### TC-002: `<Test Name>`

| Aspect | Value |
|--------|-------|
| File | `<test-file-path>` |
| Covers | FR-001, FR-002 |
| Type | Integration |

##### Description

🇻🇳 Mô tả integration test này.

🇬🇧 Describe this integration test.

##### Test Code

```typescript
describe('Integration: ComponentA + ComponentB', () => {
  it('should integrate correctly', async () => {
    // test code
  });
});
```

---

## 5. Edge Case Tests

| Test ID | Edge Case | Expected | Status |
|---------|-----------|----------|--------|
| TC-E01 | Empty input | Return empty array | ⏳ |
| TC-E02 | Very large input | Handle without timeout | ⏳ |

### TC-E01: `<Edge Case Name>`

🇻🇳 Mô tả edge case và tại sao cần test.

🇬🇧 Describe the edge case and why it needs testing.

---

## 6. Cross-Root Integration Tests

| Test ID | From | To | Description | Status |
|---------|------|-----|-------------|--------|
| TC-I01 | `<root1>` | `<root2>` | `<description>` | ⏳ |

### TC-I01: `<Integration Test Name>`

🇻🇳 Mô tả integration test giữa các roots.

🇬🇧 Describe cross-root integration test.

---

## 7. Execution Log

### Run 1: YYYY-MM-DD HH:mm

| Aspect | Value |
|--------|-------|
| Trigger | Manual / CI / Pre-commit |
| Environment | Local / CI |
| Duration | `<time>` |

**Command:**
```bash
pnpm test
```

**Results:**

| Test ID | Status | Duration | Error |
|---------|--------|----------|-------|
| TC-001 | ✅ Pass | 0.5s | |
| TC-002 | ❌ Fail | 1.2s | AssertionError: ... |

**Summary:**

| Metric | Value |
|--------|-------|
| Total | `<N>` |
| Passed | `<X>` |
| Failed | `<Y>` |
| Skipped | `<Z>` |

**Coverage:**

| Metric | Value |
|--------|-------|
| Statements | `<X>`% |
| Branches | `<Y>`% |
| Functions | `<Z>`% |
| Lines | `<W>`% |

---

## 8. Failure Analysis

### Failure: TC-002

| Aspect | Value |
|--------|-------|
| First Failed | YYYY-MM-DD HH:mm |
| Root Cause | `<cause>` |
| Fixed In | Run `<N>` |

#### Error

```
<error message>
```

#### Analysis

🇻🇳 Phân tích nguyên nhân lỗi.

🇬🇧 Analysis of error cause.

#### Fix Applied

🇻🇳 Mô tả fix đã áp dụng.

🇬🇧 Describe fix applied.

---

## 9. Test Coverage Analysis

🇻🇳 Phân tích coverage: những gì đã cover, những gì chưa, và lý do.

🇬🇧 Coverage analysis: what's covered, what's not, and why.

---

## 10. Notes

🇻🇳 Ghi chú về test strategy, lessons learned, hoặc cải tiến cho tương lai.

🇬🇧 Notes on test strategy, lessons learned, or future improvements.

---

## Next Step

🇻🇳 Sau khi tất cả tests pass, tiến hành **Phase 5: Done Check**.

🇬🇧 After all tests pass, proceed to **Phase 5: Done Check**.
