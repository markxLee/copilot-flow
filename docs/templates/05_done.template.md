# Done Check — `<Feature Name>`
<!-- Template Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->
<!-- 🇻🇳 Vietnamese first, 🇬🇧 English follows — for easy scanning -->

---

## TL;DR

| Aspect | Value |
|--------|-------|
| Feature | `<name>` |
| Branch | `<branch-slug>` |
| All Checks Pass | ✅ Yes / ❌ No |
| Ready for Merge | ✅ Yes / ❌ No |

---

## 1. Definition of Done Checklist

### Documentation

| Item | Status | Notes |
|------|--------|-------|
| Phase 0: Analysis complete | ⬜/✅ | |
| Phase 1: Spec approved | ⬜/✅ | |
| Phase 2: Tasks all done | ⬜/✅ | |
| Phase 3: Impl log complete | ⬜/✅ | |
| Phase 4: All tests pass | ⬜/✅ | |
| README updated | ⬜/✅ | |
| API docs updated | ⬜/✅ | N/A if no API change |

### Code Quality

| Item | Status | Notes |
|------|--------|-------|
| No lint errors | ⬜/✅ | |
| No type errors | ⬜/✅ | |
| Code reviewed | ⬜/✅ | |
| PR comments resolved | ⬜/✅ | |
| No console.log | ⬜/✅ | |
| Error handling with tryCatch | ⬜/✅ | |

### Testing

| Item | Status | Notes |
|------|--------|-------|
| Unit tests pass | ⬜/✅ | |
| Integration tests pass | ⬜/✅ | |
| Coverage meets threshold | ⬜/✅ | |
| Manual testing done | ⬜/✅ | |
| Edge cases tested | ⬜/✅ | |

### Cross-Root Sync

| Item | Status | Notes |
|------|--------|-------|
| All affected roots updated | ⬜/✅ | |
| Package versions synced | ⬜/✅ | |
| Breaking changes documented | ⬜/✅ | |

### Build & Deploy

| Item | Status | Notes |
|------|--------|-------|
| Local build succeeds | ⬜/✅ | |
| CI pipeline passes | ⬜/✅ | |
| No security vulnerabilities | ⬜/✅ | |
| Performance acceptable | ⬜/✅ | |

---

## 2. Summary of Changes

🇻🇳 Tóm tắt những gì đã thay đổi trong feature này, bao gồm các quyết định quan trọng và impact.

🇬🇧 Summary of what changed in this feature, including key decisions and impact.

### Files Changed

| Root | Files Added | Files Modified | Files Deleted |
|------|-------------|----------------|---------------|
| `<root1>` | `<N>` | `<M>` | `<K>` |
| **Total** | `<X>` | `<Y>` | `<Z>` |

### Key Changes

🇻🇳
1. Thay đổi chính 1: ...
2. Thay đổi chính 2: ...

🇬🇧
1. Key change 1: ...
2. Key change 2: ...

---

## 3. Breaking Changes

| Change | Migration Required |
|--------|-------------------|
| `<change>` | `<migration-steps>` |

🇻🇳 Giải thích breaking changes và cách migrate.

🇬🇧 Explain breaking changes and migration steps.

---

## 4. Known Issues

| Issue | Workaround | Planned Fix |
|-------|------------|-------------|
| `<issue>` | `<workaround>` | `<version>` |

🇻🇳 Mô tả các issues đã biết và workarounds.

🇬🇧 Describe known issues and workarounds.

---

## 5. Rollback Plan

### Trigger Conditions

🇻🇳 Khi nào cần rollback.

🇬🇧 When to trigger rollback.

- Condition 1: ...
- Condition 2: ...

### Steps

```bash
# Rollback commands
git revert <commit-sha>
```

### Verification

🇻🇳 Cách verify rollback thành công.

🇬🇧 How to verify rollback succeeded.

---

## 6. Pre-Merge Verification

### Branch Status

| Check | Status | Command |
|-------|--------|---------|
| Up-to-date with base | ⬜/✅ | `git fetch && git rebase origin/main` |
| No merge conflicts | ⬜/✅ | |
| Clean commit history | ⬜/✅ | |

### Critical Files Review

| File | Change Type | Reviewed By | Status |
|------|-------------|-------------|--------|
| `<critical-file>` | Modified | `<reviewer>` | ⬜/✅ |

---

## 7. Post-Merge Tasks

| Task | Owner | Due | Status |
|------|-------|-----|--------|
| Monitor logs for errors | `<owner>` | +1 day | ⬜ |
| Update CHANGELOG | `<owner>` | Immediate | ⬜ |
| Notify stakeholders | `<owner>` | Immediate | ⬜ |
| Clean up feature branch | `<owner>` | +1 week | ⬜ |

---

## 8. Final Approval

| Role | Name | Approval | Date |
|------|------|----------|------|
| Developer | ... | ⬜/✅ | ... |
| Tech Lead | ... | ⬜/✅ | ... |
| QA (if required) | ... | ⬜/✅ | ... |

---

## 9. Merge Decision

🇻🇳 Quyết định cuối cùng về việc merge.

🇬🇧 Final decision on merging.

> ⬜ **APPROVED FOR MERGE**
> 
> OR
> 
> ⬜ **BLOCKED** - Reason: ...

---

## 10. Completion

### Merge Details

| Aspect | Value |
|--------|-------|
| Merged By | `<name>` |
| Merge Date | YYYY-MM-DD HH:mm |
| Merge Commit | `<sha>` |
| Target Branch | `main` / `develop` |

### Post-Merge Notes

🇻🇳 Ghi chú sau khi merge: lessons learned, điều cần theo dõi.

🇬🇧 Post-merge notes: lessons learned, things to monitor.
