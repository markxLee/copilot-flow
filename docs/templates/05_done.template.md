# Done Check / Kiểm tra Hoàn thành
# Template v2.0 - Bilingual inline format

---

## 📋 TL;DR

| Aspect / Khía cạnh | Detail / Chi tiết |
|-------------------|-------------------|
| Feature / Tính năng | `<name>` |
| Branch / Nhánh | `<branch-slug>` |
| Implementation Root / Root Triển khai | `<impl-root>` |
| All Checks Pass / Tất cả kiểm tra đạt | ✅ Yes / ❌ No |
| Ready for Merge / Sẵn sàng Merge | ✅ Yes / ❌ No |

---

## 1. Definition of Done Checklist / Danh sách Điều kiện Hoàn thành

### 1.1 Documentation / Tài liệu

| Item | Status | Notes / Ghi chú |
|------|--------|-----------------|
| Phase 0: Analysis complete / Phân tích hoàn tất | ⬜/✅ | |
| Phase 1: Spec approved / Spec được duyệt | ⬜/✅ | |
| Phase 2: Tasks all done / Tất cả task hoàn tất | ⬜/✅ | |
| Phase 3: Impl log complete / Nhật ký impl đầy đủ | ⬜/✅ | |
| Phase 4: All tests pass / Tất cả test đạt | ⬜/✅ | |
| README updated / README đã cập nhật | ⬜/✅ | |
| API docs updated / API docs đã cập nhật | ⬜/✅ | N/A if no API change |

### 1.2 Code Quality / Chất lượng Code

| Item | Status | Notes / Ghi chú |
|------|--------|-----------------|
| No lint errors / Không lỗi lint | ⬜/✅ | |
| No type errors / Không lỗi type | ⬜/✅ | |
| Code reviewed / Code đã review | ⬜/✅ | |
| PR comments resolved / PR comments đã xử lý | ⬜/✅ | |
| No console.log / Không console.log | ⬜/✅ | |
| Error handling with tryCatch / Xử lý lỗi với tryCatch | ⬜/✅ | |

### 1.3 Testing / Kiểm thử

| Item | Status | Notes / Ghi chú |
|------|--------|-----------------|
| Unit tests pass / Unit test đạt | ⬜/✅ | |
| Integration tests pass / Integration test đạt | ⬜/✅ | |
| Coverage meets threshold / Độ phủ đạt ngưỡng | ⬜/✅ | |
| Manual testing done / Test thủ công hoàn tất | ⬜/✅ | |
| Edge cases tested / Test các trường hợp biên | ⬜/✅ | |

### 1.4 Cross-Root Sync / Đồng bộ Đa Root

| Item | Status | Notes / Ghi chú |
|------|--------|-----------------|
| All affected roots updated / Tất cả root liên quan đã cập nhật | ⬜/✅ | |
| Package versions synced / Phiên bản package đã đồng bộ | ⬜/✅ | |
| Breaking changes documented / Thay đổi breaking đã ghi chép | ⬜/✅ | |
| Dependent services notified / Dịch vụ phụ thuộc đã thông báo | ⬜/✅ | |

### 1.5 Build & Deploy / Build & Triển khai

| Item | Status | Notes / Ghi chú |
|------|--------|-----------------|
| Local build succeeds / Build local thành công | ⬜/✅ | |
| CI pipeline passes / CI pipeline đạt | ⬜/✅ | |
| No security vulnerabilities / Không lỗ hổng bảo mật | ⬜/✅ | |
| Performance acceptable / Hiệu năng chấp nhận được | ⬜/✅ | |

---

## 2. Pre-Merge Verification / Xác nhận Trước Merge

### 2.1 Branch Status / Trạng thái Nhánh

| Check | Status | Command / Lệnh |
|-------|--------|----------------|
| Up-to-date with base / Đã cập nhật với base | ⬜/✅ | `git fetch && git rebase origin/main` |
| No merge conflicts / Không conflict | ⬜/✅ | |
| Clean commit history / Lịch sử commit sạch | ⬜/✅ | `git log --oneline` |

### 2.2 Files Changed Summary / Tóm tắt File Thay đổi

| Root | Files Added | Files Modified | Files Deleted |
|------|-------------|----------------|---------------|
| `<root1>` | `<N>` | `<M>` | `<K>` |
| `<root2>` | `<N>` | `<M>` | `<K>` |
| **Total** | `<X>` | `<Y>` | `<Z>` |

### 2.3 Critical Files Review / Review File Quan trọng

| File | Change Type | Reviewed By | Status |
|------|-------------|-------------|--------|
| `<critical-file-path>` | Modified | `<reviewer>` | ⬜/✅ |

---

## 3. Release Notes / Ghi chú Phát hành

### Feature Summary / Tóm tắt Tính năng
**EN:** Brief description of what this feature does and why it was built.

**VI:** Mô tả ngắn gọn tính năng này làm gì và tại sao được xây dựng.

### What's New / Có gì Mới

- **EN:** Feature point 1 / **VI:** Điểm tính năng 1
- **EN:** Feature point 2 / **VI:** Điểm tính năng 2

### Breaking Changes / Thay đổi Breaking
> ⚠️ List any breaking changes that require migration / Liệt kê các thay đổi breaking cần migration

| Change | Migration / Cách chuyển đổi |
|--------|----------------------------|
| EN: ... / VI: ... | EN: ... / VI: ... |

### Deprecations / Ngừng hỗ trợ
> 📢 List deprecated APIs/features / Liệt kê API/tính năng ngừng hỗ trợ

| Deprecated | Replacement / Thay thế | Removal Version / Phiên bản loại bỏ |
|------------|------------------------|-------------------------------------|
| EN: ... / VI: ... | EN: ... / VI: ... | `<version>` |

### Bug Fixes / Sửa lỗi
- **EN:** Bug fix 1 / **VI:** Sửa lỗi 1

### Known Issues / Vấn đề Đã biết
| Issue | Workaround / Giải pháp tạm | Planned Fix / Kế hoạch sửa |
|-------|---------------------------|---------------------------|
| EN: ... / VI: ... | EN: ... / VI: ... | `<version>` |

---

## 4. Rollback Plan / Kế hoạch Rollback

### Rollback Trigger / Điều kiện Rollback
> Define conditions that would trigger a rollback
> Định nghĩa điều kiện kích hoạt rollback

- EN: ...
- VI: ...

### Rollback Steps / Các bước Rollback

1. **Step 1 / Bước 1:**
   - EN: ...
   - VI: ...

2. **Step 2 / Bước 2:**
   - EN: ...
   - VI: ...

### Rollback Verification / Xác nhận Rollback
- EN: How to verify rollback was successful
- VI: Cách xác nhận rollback thành công

---

## 5. Post-Merge Tasks / Việc cần làm Sau Merge

| Task | Owner / Chịu trách nhiệm | Due / Hạn | Status |
|------|--------------------------|-----------|--------|
| Monitor logs for errors / Theo dõi log lỗi | `<owner>` | +1 day | ⬜ |
| Update CHANGELOG / Cập nhật CHANGELOG | `<owner>` | Immediate | ⬜ |
| Notify stakeholders / Thông báo stakeholders | `<owner>` | Immediate | ⬜ |
| Update Jira ticket / Cập nhật Jira ticket | `<owner>` | Immediate | ⬜ |
| Clean up feature branch / Dọn branch | `<owner>` | +1 week | ⬜ |

---

## 6. Final Approval / Phê duyệt Cuối cùng

### Sign-off / Ký duyệt

| Role / Vai trò | Name / Tên | Approval / Phê duyệt | Date / Ngày |
|----------------|------------|----------------------|-------------|
| Developer / Dev | ... | ⬜/✅ | ... |
| Tech Lead | ... | ⬜/✅ | ... |
| QA (if required) | ... | ⬜/✅ | ... |
| Product Owner (if required) | ... | ⬜/✅ | ... |

### Merge Decision / Quyết định Merge

> ⬜ **APPROVED FOR MERGE** / ĐÃ DUYỆT ĐỂ MERGE
> 
> OR
> 
> ⬜ **BLOCKED** - Reason / Lý do: ...

---

## 7. Completion / Hoàn thành

### Merge Details / Chi tiết Merge

| Aspect | Value |
|--------|-------|
| Merged By / Merge bởi | `<name>` |
| Merge Date / Ngày Merge | `YYYY-MM-DD HH:mm` |
| Merge Commit / Commit Merge | `<sha>` |
| Target Branch / Nhánh đích | `main` / `develop` / `<branch>` |

### Post-Merge Verification / Xác nhận Sau Merge

| Check | Status | Verified By |
|-------|--------|-------------|
| CI/CD passed on main / CI/CD đạt trên main | ⬜/✅ | |
| Deployment successful / Triển khai thành công | ⬜/✅ | |
| Feature working in staging / Tính năng hoạt động trên staging | ⬜/✅ | |
| No regression detected / Không phát hiện regression | ⬜/✅ | |

---

## 8. Retrospective Notes / Ghi chú Hồi cứu

### What Went Well / Điều làm Tốt
- EN: ...
- VI: ...

### What Could Improve / Điều có thể Cải thiện
- EN: ...
- VI: ...

### Lessons Learned / Bài học Rút ra
- EN: ...
- VI: ...

### Time Spent / Thời gian Đã dùng

| Phase | Estimated / Ước lượng | Actual / Thực tế | Variance / Chênh lệch |
|-------|----------------------|------------------|----------------------|
| Phase 0: Analysis | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 1: Spec | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 2: Tasks | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 3: Impl | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 4: Tests | `<X>`h | `<Y>`h | `<Z>`h |
| Phase 5: Done | `<X>`h | `<Y>`h | `<Z>`h |
| **Total** | `<X>`h | `<Y>`h | `<Z>`h |

---

## Workflow Complete / Hoàn tất Workflow

> ✅ This feature has been completed according to the workflow contract.
> ✅ Tính năng này đã hoàn tất theo workflow contract.

**Final Status / Trạng thái Cuối:**
- [ ] All phases complete / Tất cả phase hoàn tất
- [ ] All docs in `docs/runs/<branch-slug>/` / Tất cả doc trong `docs/runs/<branch-slug>/`
- [ ] Branch merged and cleaned / Branch đã merge và dọn dẹp
- [ ] Stakeholders notified / Stakeholders đã được thông báo
