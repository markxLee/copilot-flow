# Implementation Log
# Template v3.0 - Hybrid Bilingual Format (Shared Data + Language Zones)

---

## 📊 SHARED DATA
<!-- Technical data - no translation needed / Dữ liệu kỹ thuật - không cần dịch -->

### TL;DR

| Aspect | Value |
|--------|-------|
| Feature | `<name>` |
| Current Task | T`<N>` - `<title>` |
| Progress | `<X>`/`<Total>` tasks completed |
| Status | 🟢 On Track / 🟡 At Risk / 🔴 Blocked |
| Last Updated | YYYY-MM-DD HH:mm |

### Progress Overview

| Task | Title | Root | Status | Completed |
|------|-------|------|--------|-----------|
| T1 | `<title>` | `<root>` | ✅ Done | YYYY-MM-DD |
| T2 | `<title>` | `<root>` | 🔄 In Progress | - |
| T3 | `<title>` | `<root>` | ⏳ Pending | - |
| T4 | `<title>` | `<root>` | ⏳ Pending | - |

**Legend:**
- ✅ Done
- 🔄 In Progress
- ⏳ Pending
- ❌ Blocked
- ⏭️ Skipped

---

### Task Implementation Details

#### Task T1 — `<Title>`

| Aspect | Value |
|--------|-------|
| Root | `<root-name>` |
| Started | YYYY-MM-DD HH:mm |
| Completed | YYYY-MM-DD HH:mm |
| Status | ✅ Done |

**Files Changed:**

| Action | Path | Lines |
|--------|------|-------|
| Created | `<file-path>` | +`<N>` |
| Modified | `<file-path>` | +`<N>`, -`<M>` |

**Key Code:**

```typescript
// Brief code snippet showing the key implementation
export const handler = async (input: Input): Promise<Output> => {
  // implementation
};
```

**Commands Run:**

```bash
# Commands executed
pnpm lint --fix
pnpm test
```

**Verification:**

| Check | Status | Notes |
|-------|--------|-------|
| Compiles | ✅ Pass | |
| Lint passes | ✅ Pass | |
| Tests pass | ✅ Pass | |
| Manual test | ✅ Pass | |

**Deviations from Plan:**

| Aspect | Planned | Actual | Reason |
|--------|---------|--------|--------|
| `<aspect>` | `<planned>` | `<actual>` | `<reason>` |

---

#### Task T2 — `<Title>`

| Aspect | Value |
|--------|-------|
| Root | `<root-name>` |
| Started | YYYY-MM-DD HH:mm |
| Completed | - |
| Status | 🔄 In Progress |

**Files Changed:**

| Action | Path | Lines |
|--------|------|-------|
| Created | `<file-path>` | +`<N>` |

**Key Code:**

```typescript
// Work in progress
```

**Verification:**

| Check | Status | Notes |
|-------|--------|-------|
| Compiles | ⏳ Pending | |
| Lint passes | ⏳ Pending | |

---

### Changes by Root

#### Root: `<root-name>`

| Metric | Value |
|--------|-------|
| Files created | `<N>` |
| Files modified | `<M>` |
| Files deleted | `<X>` |

| File | Task | Change Type |
|------|------|-------------|
| `<path>` | T1 | Created |
| `<path>` | T2 | Modified |

#### Root: `<root-name-2>`

| Metric | Value |
|--------|-------|
| Files created | `<N>` |
| Files modified | `<M>` |
| Files deleted | `<X>` |

| File | Task | Change Type |
|------|------|-------------|
| `<path>` | T3 | Created |

---

### Issues Encountered

#### Issue 1: `<Title>`

| Aspect | Value |
|--------|-------|
| Task | T`<N>` |
| Severity | Low / Medium / High / Critical |
| Status | 🔴 Open / ✅ Resolved |

**Error:**
```
<error message or stack trace>
```

**Resolution:**
```
<fix applied>
```

---

### Scope Changes

| Change | Type | Approved By | Date |
|--------|------|-------------|------|
| `<description>` | Added / Removed / Modified | `<name>` | YYYY-MM-DD |

### Current Blockers

| Blocker | Affects Task | Action Required |
|---------|--------------|-----------------|
| `<blocker>` | T`<N>` | `<action>` |

### Quality Checkpoints

| Check | Status |
|-------|--------|
| Code compiles without errors | ⬜/✅ |
| Lint passes | ⬜/✅ |
| No regression in existing features | ⬜/✅ |
| Changes match task plan | ⬜/✅ |

---

## 🇬🇧 ENGLISH

### 1. Implementation Summary

> High-level summary of what has been implemented so far.

### 2. Task Notes

#### T1 — `<Title>`

**What Was Implemented:**
> Description of what was actually built

**Challenges Faced:**
- Challenge 1: ...
- Challenge 2: ...

**Learnings:**
- Learning 1: ...

---

#### T2 — `<Title>`

**What Was Implemented:**
> ...

**Challenges Faced:**
- ...

---

### 3. Deviations Explanation

Explain any significant deviations from the original task plan and why they were necessary.

### 4. Issue Details

#### Issue 1: `<Title>`

**Description:** What went wrong and why.

**Root Cause:** The underlying reason for the issue.

**Resolution:** How it was fixed.

**Prevention:** How to prevent this in the future.

### 5. Notes for Next Session

- Note 1: ...
- Note 2: ...

---

## 🇻🇳 TIẾNG VIỆT

### 1. Tóm tắt Triển khai

> Tóm tắt cấp cao về những gì đã được triển khai đến nay.

### 2. Ghi chú Task

#### T1 — `<Tiêu đề>`

**Đã Triển khai:**
> Mô tả những gì thực sự đã xây dựng

**Thách thức Gặp phải:**
- Thách thức 1: ...
- Thách thức 2: ...

**Bài học:**
- Bài học 1: ...

---

#### T2 — `<Tiêu đề>`

**Đã Triển khai:**
> ...

**Thách thức Gặp phải:**
- ...

---

### 3. Giải thích Sai lệch

Giải thích các sai lệch đáng kể so với kế hoạch task ban đầu và tại sao chúng cần thiết.

### 4. Chi tiết Vấn đề

#### Vấn đề 1: `<Tiêu đề>`

**Mô tả:** Điều gì đã xảy ra và tại sao.

**Nguyên nhân Gốc:** Lý do cơ bản gây ra vấn đề.

**Giải pháp:** Cách đã sửa.

**Phòng ngừa:** Cách ngăn chặn điều này trong tương lai.

### 5. Ghi chú cho Phiên tiếp theo

- Ghi chú 1: ...
- Ghi chú 2: ...

---

## ⏭️ Next Action

| Action | Command |
|--------|---------|
| ▶️ Continue to next task | Reply `next` |
| ⏸️ Pause implementation | Reply `pause` |
| 🔄 Fix issue | Reply `fix: <issue>` |
| ✅ All tasks done → Phase 4 | Reply `phase-4` |
