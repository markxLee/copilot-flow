# PR Description Generator — Create Pull Request

You are acting as a **PR Description Writer and Release Communicator**.

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/pr-description"          # Explicit prompt reference (REQUIRED)
    
  rejected_triggers:
    - "pr", "create pr"  # ⚠️ TOO VAGUE
    - "go", "continue"            # ⚠️ DANGEROUS in long conversations
    
  why: |
    PR creation is a significant action that should be explicit.
    
  prerequisites:
    - Phase 5 Done check passed (/phase-5-done completed)
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify workflow complete:
     check: phases.phase_5_done.status == "complete"
     if_not: WARN - "Phase 5 not complete. PR may be premature."
     
  2. Load all artifacts:
     - 01_spec/spec.md (requirements)
     - 02_tasks/tasks.md (task list)
     - 03_impl/impl-log.md (changes)
     - 04_tests/tests.md (coverage)
      - 05_done/done-check.md (summary)
     
  3. Get branch info:
     command: git rev-parse --abbrev-ref HEAD
     
  4. Get diff stats:
     command: git diff --stat origin/main
```

---

## Purpose

Generate a comprehensive PR description file that can be copied to GitHub/GitLab PR. Include all relevant context for reviewers.

---

## Information Gathering

```yaml
required_info:
  jira_ticket:
    prompt: "Jira ticket number (e.g., PROJ-123)?"
    default: Extract from branch name if possible
    
  pr_title:
    prompt: "PR title (or use feature title)?"
    default: From spec.md feature title
    
optional_info:
  related_prs:
    prompt: "Related PRs (if any)?"
    
  deployment_notes:
    prompt: "Special deployment notes?"
    
  rollback_plan:
    prompt: "Rollback plan if needed?"
```

---

## Output Format

```markdown
## 📝 PR Description Generated / Mô tả PR Đã tạo

### Output File / File Output

Created: `<docs_root>/docs/runs/<branch-slug>/PR_DESCRIPTION.md`

---

### Preview / Xem trước

<Content of PR_DESCRIPTION.md shown below>
```

---

## PR Description Template

Create file `PR_DESCRIPTION.md`:

```markdown
## 🎫 Jira Ticket / Ticket Jira

[<JIRA-XXX>](https://jira.company.com/browse/<JIRA-XXX>)

---

## 📋 Summary / Tóm tắt

### What does this PR do? / PR này làm gì?

<Brief 2-3 sentence description of the feature/fix>

### Why is this change needed? / Tại sao cần thay đổi này?

<Business context and problem being solved>

---

## 🎯 Requirements Addressed / Yêu cầu Được giải quyết

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | <requirement description> | ✅ Implemented |
| FR-002 | <requirement description> | ✅ Implemented |
| NFR-001 | <requirement description> | ✅ Addressed |

---

## 💡 Solution Overview / Tổng quan Giải pháp

### Approach / Cách tiếp cận

<High-level description of the solution approach>

### Key Design Decisions / Quyết định Thiết kế Chính

1. **<Decision 1>**: <rationale>
2. **<Decision 2>**: <rationale>

### Architecture Changes / Thay đổi Kiến trúc

<If any architecture changes, describe here with diagram if helpful>

```
<Optional: Simple ASCII or reference to diagram>
```

---

## 📁 Changes / Thay đổi

### Files Changed / Files Thay đổi

| Root | Files | Additions | Deletions |
|------|-------|-----------|-----------|
| apphub-vision | <N> | +<N> | -<N> |
| reviews-assets | <N> | +<N> | -<N> |
| **Total** | **<N>** | **+<N>** | **-<N>** |

### Key Changes by Area / Thay đổi Chính theo Vùng

#### <Area 1: e.g., API Layer>
- `path/to/file.ts` - <what changed>
- `path/to/other.ts` - <what changed>

#### <Area 2: e.g., UI Components>
- `path/to/component.tsx` - <what changed>

#### <Area 3: e.g., Database>
- `path/to/migration.sql` - <what changed>

---

## ⚠️ Breaking Changes / Thay đổi Không Tương thích

### Has Breaking Changes? / Có Breaking Changes không?

- [ ] **YES** - This PR contains breaking changes
- [x] **NO** - This PR is backward compatible

<If YES, describe:>

### Breaking Change Details / Chi tiết Breaking Changes

| Change | Impact | Migration Path |
|--------|--------|----------------|
| <change> | <who/what is affected> | <how to migrate> |

### Migration Guide / Hướng dẫn Migration

<If breaking changes, provide step-by-step migration>

---

## 🧪 Testing / Kiểm thử

### Test Coverage / Độ phủ Test

| Metric | Value | Threshold |
|--------|-------|-----------|
| Statements | <X>% | ≥70% |
| Branches | <X>% | ≥70% |
| Functions | <X>% | ≥70% |
| Lines | <X>% | ≥70% |

### Tests Added / Tests Đã thêm

| Test File | Tests | Type |
|-----------|-------|------|
| `file.test.ts` | <N> | Unit |
| `integration.test.ts` | <N> | Integration |
| **Total** | **<N>** | |

### Manual Testing Done / Test Thủ công Đã làm

- [x] <Test scenario 1>
- [x] <Test scenario 2>
- [x] <Test scenario 3>

### How to Test / Cách Test

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm test path/to/file.test.ts

# Run with coverage
pnpm test --coverage
```

---

## 🚀 Deployment / Triển khai

### Deployment Notes / Ghi chú Triển khai

<Any special deployment considerations>

### Environment Variables / Biến Môi trường

| Variable | Required | Description |
|----------|----------|-------------|
| <VAR_NAME> | Yes/No | <description> |

### Database Migrations / Migrations Database

- [ ] No migrations required
- [ ] Migrations included (see below)

<If migrations:>
```sql
-- Migration description
<migration preview>
```

### Feature Flags / Cờ Tính năng

- [ ] No feature flags
- [ ] Behind feature flag: `<FLAG_NAME>`

---

## 📸 Screenshots / Ảnh chụp màn hình

<If UI changes, add before/after screenshots>

### Before / Trước

<screenshot or "N/A">

### After / Sau

<screenshot or "N/A">

---

## ✅ Checklist / Danh sách Kiểm tra

### Code Quality / Chất lượng Code

- [x] Code follows project conventions
- [x] No lint errors
- [x] No type errors
- [x] Self-reviewed code
- [x] Comments added for complex logic

### Testing / Kiểm thử

- [x] Unit tests added/updated
- [x] Integration tests added/updated (if applicable)
- [x] All tests passing
- [x] Coverage meets threshold (≥70%)

### Documentation / Tài liệu

- [x] Code comments updated
- [x] README updated (if applicable)
- [x] API docs updated (if applicable)

### Security / Bảo mật

- [x] No secrets committed
- [x] Input validation added
- [x] No SQL injection risks
- [x] Auth/permissions verified

---

## 🔗 Related / Liên quan

### Related PRs / PRs Liên quan

- <Link to related PR if any>

### Related Issues / Issues Liên quan

- <Link to related issues if any>

### Documentation / Tài liệu

- Spec: `docs/runs/<branch-slug>/01_spec/spec.md`
- Tasks: `docs/runs/<branch-slug>/02_tasks/tasks.md`
- Impl Log: `docs/runs/<branch-slug>/03_impl/impl-log.md`

---

## 👥 Reviewers / Người Review

### Suggested Reviewers / Gợi ý Reviewers

- @<reviewer1> - <reason: e.g., API changes>
- @<reviewer2> - <reason: e.g., UI changes>

### Review Focus Areas / Vùng Cần Review Kỹ

1. <Area needing careful review>
2. <Area needing careful review>

---

## 🔙 Rollback Plan / Kế hoạch Rollback

<If something goes wrong, how to rollback>

```bash
# Rollback steps
git revert <commit-hash>
# or
kubectl rollout undo deployment/<name>
```

---

## 📝 Additional Notes

<Any other context reviewers should know>
```

---

## State Updates

```yaml
status:
  last_action: "Generated PR description"
  next_action: "User creates PR on GitHub/GitLab"
  
artifacts:
  pr_description:
    path: PR_DESCRIPTION.md
    created_at: <timestamp>
```

---

## ⏸️ STOP — PR Description Ready

### Created: `docs/runs/<branch-slug>/PR_DESCRIPTION.md`

**Next Steps:**
1. Review the generated PR description
2. Add screenshots if UI changes
3. Copy content to GitHub/GitLab when creating PR
4. Or use: `gh pr create --body-file PR_DESCRIPTION.md`

**Quick Commands:**
```bash
# GitHub CLI
gh pr create --title "<title>" --body-file docs/runs/<branch-slug>/PR_DESCRIPTION.md

# Or copy to clipboard (macOS)
cat docs/runs/<branch-slug>/PR_DESCRIPTION.md | pbcopy
```

---

## Customization

User can say:
- `pr minimal` → Short version without all sections
- `pr full` → Full version (default)
- `pr update` → Update existing PR_DESCRIPTION.md
