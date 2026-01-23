# Test Plan & Log / Kế hoạch & Nhật ký Test
# Template v2.0 - Bilingual inline format

---

## 📋 TL;DR

| Aspect / Khía cạnh | Detail / Chi tiết |
|-------------------|-------------------|
| Feature / Tính năng | `<name>` |
| Test Types / Loại Test | Unit / Integration / E2E |
| Total Tests / Tổng số Test | `<N>` |
| Passed / Đạt | `<X>` |
| Failed / Thất bại | `<Y>` |
| Coverage / Độ phủ | `<Z>`% |
| Status / Trạng thái | 🟢 All Pass / 🔴 Has Failures |

---

## 1. Test Strategy / Chiến lược Test

### 1.1 What to Test / Test những gì

| Area / Lĩnh vực | Test Type / Loại Test | Priority / Ưu tiên |
|-----------------|----------------------|-------------------|
| EN: ... / VI: ... | Unit / Integration / E2E | Must / Should / Could |

### 1.2 What NOT to Test / Không Test những gì

| Area / Lĩnh vực | Reason / Lý do |
|-----------------|----------------|
| EN: ... / VI: ... | EN: ... / VI: ... |

### 1.3 Test Boundaries / Ranh giới Test

**Assumptions / Giả định:**
- EN: ...
- VI: ...

**Mocks / Stubs Required / Cần Mock:**
- `<dependency>`: EN: ... / VI: ...

---

## 2. Test Cases by Requirement / Test Case theo Yêu cầu

### Requirement: FR-001 — `<Title>`

| Test ID | Description / Mô tả | Type | Status |
|---------|---------------------|------|--------|
| TC-001 | EN: ... / VI: ... | Unit | ⏳ Pending |
| TC-002 | EN: ... / VI: ... | Integration | ⏳ Pending |

### Requirement: FR-002 — `<Title>`

| Test ID | Description / Mô tả | Type | Status |
|---------|---------------------|------|--------|
| TC-003 | EN: ... / VI: ... | Unit | ⏳ Pending |

---

## 3. Test Cases by Root / Test Case theo Root

### Root: `<root-name>`

**Framework:** Jest / Vitest / Pytest
**Config:** `<path-to-config>`
**Run Command:** `<command>`

#### TC-001: `<Test Name>`

| Aspect | Detail |
|--------|--------|
| File / Tệp | `<test-file-path>` |
| Covers / Phủ | FR-001 |
| Type / Loại | Unit |

**Description / Mô tả:**
- EN: ...
- VI: ...

**Setup / Thiết lập:**
```typescript
// Setup code
```

**Test / Kiểm tra:**
```typescript
// Test code
```

**Expected / Mong đợi:**
- EN: ...
- VI: ...

**Mocks Required / Mock cần thiết:**
- `<mock 1>`: ...

---

#### TC-002: `<Test Name>`

(Same structure / Cấu trúc tương tự)

---

### Root: `<root-name-2>`

(Same structure / Cấu trúc tương tự)

---

## 4. Edge Case Tests / Test Trường hợp Biên

| Test ID | Edge Case / Trường hợp biên | Expected / Mong đợi | Status |
|---------|----------------------------|---------------------|--------|
| TC-E01 | EN: ... / VI: ... | EN: ... / VI: ... | ⏳ |
| TC-E02 | EN: ... / VI: ... | EN: ... / VI: ... | ⏳ |

---

## 5. Integration Tests / Test Tích hợp

### Cross-Root Integration / Tích hợp Đa Root

| Test ID | From / Từ | To / Đến | Description / Mô tả | Status |
|---------|-----------|----------|---------------------|--------|
| TC-I01 | `<root1>` | `<root2>` | EN: ... / VI: ... | ⏳ |

---

## 6. Execution Log / Nhật ký Thực thi

### Run 1: YYYY-MM-DD HH:mm

| Aspect | Detail |
|--------|--------|
| Trigger / Kích hoạt | Manual / CI / Pre-commit |
| Environment / Môi trường | Local / CI |
| Duration / Thời gian | `<time>` |

**Command / Lệnh:**
```bash
<command>
```

**Results / Kết quả:**

| Test ID | Status | Duration | Notes / Ghi chú |
|---------|--------|----------|-----------------|
| TC-001 | ✅ Pass | 0.5s | |
| TC-002 | ❌ Fail | 1.2s | Error: ... |
| TC-003 | ✅ Pass | 0.3s | |

**Summary / Tóm tắt:**
- Total / Tổng: `<N>`
- Passed / Đạt: `<X>`
- Failed / Thất bại: `<Y>`
- Skipped / Bỏ qua: `<Z>`

**Coverage / Độ phủ:**
| Metric | Value |
|--------|-------|
| Statements | `<X>`% |
| Branches | `<Y>`% |
| Functions | `<Z>`% |
| Lines | `<W>`% |

---

### Run 2: YYYY-MM-DD HH:mm (After fixes / Sau khi sửa)

(Same structure / Cấu trúc tương tự)

---

## 7. Failure Analysis / Phân tích Thất bại

### Failure 1: TC-002

| Aspect | Detail |
|--------|--------|
| Test | TC-002 |
| Error Type / Loại lỗi | Assertion / Timeout / Exception |
| First Failed / Thất bại lần đầu | Run 1 |

**Error Message / Thông báo lỗi:**
```
<error message>
```

**Root Cause / Nguyên nhân gốc:**
- EN: ...
- VI: ...

**Fix Applied / Đã sửa:**
- EN: ...
- VI: ...

**Verified in / Đã xác nhận tại:** Run 2

---

## 8. Coverage Report / Báo cáo Độ phủ

### By Root / Theo Root

| Root | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| `<root1>` | `<X>`% | `<Y>`% | `<Z>`% | `<W>`% |
| `<root2>` | `<X>`% | `<Y>`% | `<Z>`% | `<W>`% |

### Uncovered Areas / Vùng chưa phủ

| File | Lines | Reason / Lý do |
|------|-------|----------------|
| `<path>` | 10-15 | EN: ... / VI: ... |

---

## 9. Quality Gates / Cổng Chất lượng

| Gate | Threshold / Ngưỡng | Actual / Thực tế | Status |
|------|-------------------|------------------|--------|
| All tests pass / Tất cả test đạt | 100% | `<X>`% | ✅/❌ |
| Coverage / Độ phủ | >`<Y>`% | `<Z>`% | ✅/❌ |
| No critical bugs / Không lỗi nghiêm trọng | 0 | `<N>` | ✅/❌ |

---

## Approval / Phê duyệt

| Role / Vai trò | Name / Tên | Status / Trạng thái | Date / Ngày |
|----------------|------------|---------------------|-------------|
| Test Author / Tác giả Test | ... | ✅ Done | ... |
| Reviewer | ... | ⏳ Pending | ... |

---

## Next Step / Bước tiếp theo

> After all tests pass, proceed to Phase 5 (Done Check)
> Sau khi tất cả test đạt, tiến hành Phase 5 (Kiểm tra Hoàn thành)

Reply / Trả lời: `approved` or `fix: <issue>`
