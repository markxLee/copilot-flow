# Done Check
# Template v3.0 - Hybrid Bilingual Format (Shared Data + Language Zones)

---

## 📊 SHARED DATA
<!-- Technical data - no translation needed / Dữ liệu kỹ thuật - không cần dịch -->

### TL;DR

| Aspect | Value |
|--------|-------|
| Feature | `<name>` |
| Branch | `<branch-slug>` |
| Docs Root | `<docs_root>` |
| All Checks Pass | ✅ Yes / ❌ No |
| Ready for Merge | ✅ Yes / ❌ No |

---

### Definition of Done Checklist

#### Documentation

| Item | Status | Notes |
|------|--------|-------|
| Phase 0: Analysis complete | ⬜/✅ | |
| Phase 1: Spec approved | ⬜/✅ | |
| Phase 2: Tasks all done | ⬜/✅ | |
| Phase 3: Impl log complete | ⬜/✅ | |
| Phase 4: All tests pass | ⬜/✅ | |
| README updated | ⬜/✅ | |
| API docs updated | ⬜/✅ | N/A if no API change |

#### Code Quality

| Item | Status | Notes |
|------|--------|-------|
| No lint errors | ⬜/✅ | |
| No type errors | ⬜/✅ | |
| Code reviewed | ⬜/✅ | |
| PR comments resolved | ⬜/✅ | |
| No console.log | ⬜/✅ | |
| Error handling with tryCatch | ⬜/✅ | |

#### Testing

| Item | Status | Notes |
|------|--------|-------|
| Unit tests pass | ⬜/✅ | |
| Integration tests pass | ⬜/✅ | |
| Coverage meets threshold | ⬜/✅ | |
| Manual testing done | ⬜/✅ | |
| Edge cases tested | ⬜/✅ | |

#### Cross-Root Sync

| Item | Status | Notes |
|------|--------|-------|
| All affected roots updated | ⬜/✅ | |
| Package versions synced | ⬜/✅ | |
| Breaking changes documented | ⬜/✅ | |
| Dependent services notified | ⬜/✅ | |

#### Build & Deploy

| Item | Status | Notes |
|------|--------|-------|
| Local build succeeds | ⬜/✅ | |
| CI pipeline passes | ⬜/✅ | |
| No security vulnerabilities | ⬜/✅ | |
| Performance acceptable | ⬜/✅ | |

---

### Commit Message

```bash
<type>(<scope>): <short description>
```

**Type Reference:**
| Type | Use When |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactoring |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Maintenance |

---

### Pre-Merge Verification

#### Branch Status

| Check | Status | Command |
|-------|--------|---------|
| Up-to-date with base | ⬜/✅ | `git fetch && git rebase origin/main` |
| No merge conflicts | ⬜/✅ | |
| Clean commit history | ⬜/✅ | `git log --oneline` |

#### Files Changed Summary

| Root | Files Added | Files Modified | Files Deleted |
|------|-------------|----------------|---------------|
| `<root1>` | `<N>` | `<M>` | `<K>` |
| `<root2>` | `<N>` | `<M>` | `<K>` |
| **Total** | `<X>` | `<Y>` | `<Z>` |

#### Critical Files Review

| File | Change Type | Reviewed By | Status |
|------|-------------|-------------|--------|
| `<critical-file-path>` | Modified | `<reviewer>` | ⬜/✅ |

---

### Breaking Changes

| Change | Migration Required |
|--------|-------------------|
| `<change>` | `<migration-steps>` |

### Deprecations

| Deprecated | Replacement | Removal Version |
|------------|-------------|-----------------|
| `<old-api>` | `<new-api>` | `<version>` |

### Known Issues

| Issue | Workaround | Planned Fix |
|-------|------------|-------------|
| `<issue>` | `<workaround>` | `<version>` |

---

### Rollback Plan

**Trigger Conditions:**
- Condition 1: ...
- Condition 2: ...

**Steps:**
```bash
# Rollback commands
git revert <commit-sha>
# or
git reset --hard <previous-sha>
```

**Verification:**
- [ ] Verify rollback worked

---

### Post-Merge Tasks

| Task | Owner | Due | Status |
|------|-------|-----|--------|
| Monitor logs for errors | `<owner>` | +1 day | ⬜ |
| Update CHANGELOG | `<owner>` | Immediate | ⬜ |
| Notify stakeholders | `<owner>` | Immediate | ⬜ |
| Update Jira ticket | `<owner>` | Immediate | ⬜ |
| Clean up feature branch | `<owner>` | +1 week | ⬜ |

---

### Final Approval

| Role | Name | Approval | Date |
|------|------|----------|------|
| Developer | ... | ⬜/✅ | ... |
| Tech Lead | ... | ⬜/✅ | ... |
| QA (if required) | ... | ⬜/✅ | ... |
| Product Owner (if required) | ... | ⬜/✅ | ... |

**Merge Decision:**
> ⬜ **APPROVED FOR MERGE**
> 
> OR
> 
> ⬜ **BLOCKED** - Reason: ...

---

### Completion

#### Merge Details

| Aspect | Value |
|--------|-------|
| Merged By | `<name>` |
| Merge Date | YYYY-MM-DD HH:mm |
| Merge Commit | `<sha>` |
| Target Branch | `main` / `develop` |

#### Post-Merge Verification

| Check | Status | Verified By |
|-------|--------|-------------|
| CI/CD passed on main | ⬜/✅ | |
| Deployment successful | ⬜/✅ | |
| Feature working in staging | ⬜/✅ | |
| No regression detected | ⬜/✅ | |

---

### Time Tracking

| Phase | Estimated | Actual | Variance |
|-------|-----------|--------|----------|
| Phase 0: Analysis | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 1: Spec | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 2: Tasks | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 3: Impl | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 4: Tests | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 5: Done | `<X>`h | `<Y>`h | `<Z>`h |
| **Total** | `<X>`h | `<Y>`h | `<Z>`h |

---

## 🇬🇧 ENGLISH

### 1. Release Notes

#### Feature Summary
> Brief description of what this feature does and why it was built.

#### What's New
- Feature point 1
- Feature point 2

#### Bug Fixes
- Bug fix 1

### 2. Breaking Changes Details

#### Change 1: `<Title>`

**What Changed:** Description of the breaking change.

**Why:** Reason for the change.

**Migration Guide:**
1. Step 1
2. Step 2

### 3. Rollback Details

**When to Rollback:** Conditions that would trigger a rollback.

**How to Verify Rollback:** Steps to confirm rollback was successful.

### 4. Retrospective

#### What Went Well
- Point 1
- Point 2

#### What Could Improve
- Point 1
- Point 2

#### Lessons Learned
- Lesson 1
- Lesson 2

### 5. Notes

- Additional context or information

---

## 🇻🇳 TIẾNG VIỆT

### 1. Ghi chú Phát hành

#### Tóm tắt Tính năng
> Mô tả ngắn gọn tính năng này làm gì và tại sao được xây dựng.

#### Có gì Mới
- Điểm tính năng 1
- Điểm tính năng 2

#### Sửa lỗi
- Sửa lỗi 1

### 2. Chi tiết Thay đổi Breaking

#### Thay đổi 1: `<Tiêu đề>`

**Thay đổi gì:** Mô tả thay đổi breaking.

**Tại sao:** Lý do cho thay đổi.

**Hướng dẫn Migration:**
1. Bước 1
2. Bước 2

### 3. Chi tiết Rollback

**Khi nào Rollback:** Điều kiện kích hoạt rollback.

**Cách Xác nhận Rollback:** Các bước xác nhận rollback thành công.

### 4. Hồi cứu

#### Điều làm Tốt
- Điểm 1
- Điểm 2

#### Điều có thể Cải thiện
- Điểm 1
- Điểm 2

#### Bài học Rút ra
- Bài học 1
- Bài học 2

### 5. Ghi chú

- Ngữ cảnh hoặc thông tin bổ sung

---

## ✅ Workflow Complete

> ✅ This feature has been completed according to the workflow contract.
> ✅ Tính năng này đã hoàn tất theo workflow contract.

**Final Status:**
- [ ] All phases complete
- [ ] All docs in `docs/runs/<branch-slug>/`
- [ ] Branch merged and cleaned
- [ ] Stakeholders notified
