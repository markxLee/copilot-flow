# Test Plan & Log
# Template v3.0 - Hybrid Bilingual Format (Shared Data + Language Zones)

---

## 📊 SHARED DATA
<!-- Technical data - no translation needed / Dữ liệu kỹ thuật - không cần dịch -->

### TL;DR

| Aspect | Value |
|--------|-------|
| Feature | `<name>` |
| Test Types | Unit / Integration / E2E |
| Total Tests | `<N>` |
| Passed | `<X>` |
| Failed | `<Y>` |
| Coverage | `<Z>`% |
| Status | 🟢 All Pass / 🔴 Has Failures |

### Test Matrix

| Test ID | Description | Type | FR Covered | Status |
|---------|-------------|------|------------|--------|
| TC-001 | `<description>` | Unit | FR-001 | ⏳ |
| TC-002 | `<description>` | Integration | FR-001 | ⏳ |
| TC-003 | `<description>` | Unit | FR-002 | ⏳ |
| TC-E01 | `<edge case>` | Unit | EC-001 | ⏳ |
| TC-I01 | `<integration>` | Integration | FR-001, FR-002 | ⏳ |

**Legend:**
- ✅ Pass
- ❌ Fail
- ⏳ Pending
- ⏭️ Skipped

### Test Boundaries

| Test | Mock |
|------|------|
| Database calls | `@prisma/client` mocked |
| External APIs | `fetch` mocked |
| Time-dependent | `jest.useFakeTimers()` |

---

### Tests by Root

#### Root: `<root-name>`

**Config:**
| Aspect | Value |
|--------|-------|
| Framework | Jest / Vitest / Pytest |
| Config File | `<path-to-config>` |
| Run Command | `pnpm --filter <pkg> test` |

##### TC-001: `<Test Name>`

| Aspect | Value |
|--------|-------|
| File | `<test-file-path>` |
| Covers | FR-001 |
| Type | Unit |

**Test Code:**

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

**Mocks Required:**
- `<mock-1>`: ...

---

##### TC-002: `<Test Name>`

| Aspect | Value |
|--------|-------|
| File | `<test-file-path>` |
| Covers | FR-001 |
| Type | Integration |

**Test Code:**

```typescript
describe('Integration: ComponentA + ComponentB', () => {
  it('should integrate correctly', async () => {
    // test code
  });
});
```

---

#### Root: `<root-name-2>`

**Config:**
| Aspect | Value |
|--------|-------|
| Framework | Vitest |
| Config File | `vitest.config.ts` |
| Run Command | `pnpm --filter <pkg> test` |

##### TC-003: `<Test Name>`

(Same structure as above)

---

### Edge Case Tests

| Test ID | Edge Case | Expected | Status |
|---------|-----------|----------|--------|
| TC-E01 | Empty input | Return empty array | ⏳ |
| TC-E02 | Very large input | Handle without timeout | ⏳ |
| TC-E03 | Concurrent requests | No race conditions | ⏳ |

### Cross-Root Integration Tests

| Test ID | From | To | Description | Status |
|---------|------|-----|-------------|--------|
| TC-I01 | `<root1>` | `<root2>` | `<description>` | ⏳ |

---

### Execution Log

#### Run 1: YYYY-MM-DD HH:mm

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
| TC-003 | ✅ Pass | 0.3s | |

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

#### Run 2: YYYY-MM-DD HH:mm (After fixes)

| Aspect | Value |
|--------|-------|
| Trigger | Manual |
| Environment | Local |
| Duration | `<time>` |

**Results:**

| Test ID | Status | Duration | Error |
|---------|--------|----------|-------|
| TC-001 | ✅ Pass | 0.5s | |
| TC-002 | ✅ Pass | 1.1s | |
| TC-003 | ✅ Pass | 0.3s | |

---

### Failure Analysis

#### Failure 1: TC-002

| Aspect | Value |
|--------|-------|
| Test | TC-002 |
| Error Type | Assertion / Timeout / Exception |
| First Failed | Run 1 |
| Fixed In | Run 2 |

**Error Message:**
```
AssertionError: Expected value to be X but received Y
  at Object.<anonymous> (test.ts:15:5)
```

**Root Cause:**
`<explanation>`

**Fix Applied:**
```typescript
// Code change that fixed the issue
```

---

### Coverage Report

#### By Root

| Root | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| `<root1>` | `<X>`% | `<Y>`% | `<Z>`% | `<W>`% |
| `<root2>` | `<X>`% | `<Y>`% | `<Z>`% | `<W>`% |

#### Uncovered Areas

| File | Lines | Reason |
|------|-------|--------|
| `<path>` | 10-15 | Error handling edge case |
| `<path>` | 25-30 | Deprecated code path |

### Quality Gates

| Gate | Threshold | Actual | Status |
|------|-----------|--------|--------|
| All tests pass | 100% | `<X>`% | ✅/❌ |
| Coverage | >`<Y>`% | `<Z>`% | ✅/❌ |
| No critical bugs | 0 | `<N>` | ✅/❌ |

---

## 🇬🇧 ENGLISH

### 1. Test Strategy

#### What to Test
> Explanation of testing priorities and approach

- **Critical paths:** Core business logic that must work
- **Error handling:** How the system handles failures
- **Edge cases:** Boundary conditions and unusual inputs

#### What NOT to Test
- Third-party libraries (trust their tests)
- UI styling (unless critical)
- ...

### 2. Test Descriptions

#### TC-001: `<Test Name>`

**Purpose:** What this test verifies and why it's important.

**Scenario:** Step-by-step description of the test scenario.

#### TC-002: `<Test Name>`

**Purpose:** ...

**Scenario:** ...

### 3. Failure Analysis Details

#### TC-002 Failure

**What Happened:** Detailed description of the failure.

**Investigation:** Steps taken to find root cause.

**Solution:** How the issue was resolved.

**Lessons Learned:** What we learned from this failure.

### 4. Coverage Analysis

Analysis of coverage results and explanation of any uncovered areas.

### 5. Recommendations

- Recommendation 1: ...
- Recommendation 2: ...

---

## 🇻🇳 TIẾNG VIỆT

### 1. Chiến lược Test

#### Test những gì
> Giải thích ưu tiên và cách tiếp cận test

- **Luồng quan trọng:** Logic nghiệp vụ cốt lõi phải hoạt động
- **Xử lý lỗi:** Cách hệ thống xử lý failures
- **Trường hợp biên:** Điều kiện biên và input bất thường

#### KHÔNG Test những gì
- Thư viện bên thứ ba (tin tưởng tests của họ)
- Styling UI (trừ khi quan trọng)
- ...

### 2. Mô tả Test

#### TC-001: `<Tên Test>`

**Mục đích:** Test này xác minh điều gì và tại sao quan trọng.

**Kịch bản:** Mô tả từng bước kịch bản test.

#### TC-002: `<Tên Test>`

**Mục đích:** ...

**Kịch bản:** ...

### 3. Chi tiết Phân tích Lỗi

#### Lỗi TC-002

**Điều gì xảy ra:** Mô tả chi tiết về lỗi.

**Điều tra:** Các bước thực hiện để tìm nguyên nhân gốc.

**Giải pháp:** Cách vấn đề được giải quyết.

**Bài học:** Những gì học được từ lỗi này.

### 4. Phân tích Coverage

Phân tích kết quả coverage và giải thích các vùng chưa được phủ.

### 5. Khuyến nghị

- Khuyến nghị 1: ...
- Khuyến nghị 2: ...

---

## ⏭️ Next Step

> After all tests pass and coverage meets threshold, proceed to Phase 5 (Done Check)
> Sau khi tất cả tests pass và coverage đạt ngưỡng, tiến hành Phase 5 (Kiểm tra Hoàn thành)

Reply: `approved` or `fix: <issue>`
