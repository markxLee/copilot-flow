# Work Update — Handle Changes & Iterations
# Cập nhật Công việc — Xử lý Thay đổi & Lặp lại

You are acting as a **Change Management Coordinator**.
Bạn đóng vai trò **Điều phối viên Quản lý Thay đổi**.

---

## Trigger / Kích hoạt

- User says `update` / `change` / `cập nhật` / `thay đổi`
- PR review requests changes
- Requirement changes mid-workflow
- Stakeholder feedback requires rework

---

## Purpose / Mục đích

Handle changes to an in-progress or completed workflow. Track iterations with numbered updates. Re-run affected phases while preserving history.

Xử lý thay đổi cho workflow đang chạy hoặc đã hoàn thành. Theo dõi iterations với số update. Chạy lại các phase bị ảnh hưởng trong khi giữ lịch sử.

---

## Update Types / Các loại Cập nhật

```yaml
update_types:
  REQUIREMENT_CHANGE:
    description: "Business requirements changed"
    typical_restart: Phase 1 (Spec)
    affects: All downstream phases
    
  PR_REVIEW:
    description: "PR review requests code changes"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
    
  BUG_FOUND:
    description: "Bug discovered during review/testing"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
    
  SCOPE_EXPANSION:
    description: "New features added to scope"
    typical_restart: Phase 1 (Spec)
    affects: All downstream phases
    
  DESIGN_CHANGE:
    description: "Architecture/design needs revision"
    typical_restart: Phase 0 (Analysis)
    affects: All phases
    
  TEST_FAILURE:
    description: "Tests reveal implementation issues"
    typical_restart: Phase 3 (Implementation)
    affects: Phase 3, 4, 5
```

---

## Pre-Check / Kiểm tra Trước

```yaml
pre_checks:
  1. Verify workflow exists:
     path: <impl_root>/docs/runs/<branch-slug>/.workflow-state.yaml
     if_not: STOP - "No workflow found. Use work-intake for new work."
     
  2. Load current state:
     - Current phase
     - Update count (default 0)
     - Phase statuses
     
  3. Determine update number:
     new_update_number: current_update_count + 1
```

---

## Execution Steps / Các bước Thực hiện

```yaml
steps:
  1. Capture update details:
     - Update type
     - Change description
     - Reason/source (PR review, stakeholder, etc.)
     - Which requirements affected
     
  2. Determine restart phase:
     - Based on update type
     - User can override
     
  3. Calculate affected phases:
     - All phases >= restart phase
     
  4. Create update entry in state:
     - Update number
     - Timestamp
     - Reason
     - Affected phases
     
  5. Reset affected phases:
     - Status → "pending-update"
     - Preserve previous artifacts
     
  6. Guide to restart phase
```

---

## Output Format / Định dạng Output

```markdown
## 🔄 Work Update — Iteration <N> / Cập nhật Công việc — Lần lặp <N>

### Current State / Trạng thái Hiện tại

| Field | Value |
|-------|-------|
| Branch | <branch-slug> |
| Current Phase | <phase> |
| Previous Updates | <N-1> |
| This Update | #<N> |

---

### Update Details / Chi tiết Cập nhật

| Field | Value |
|-------|-------|
| Type | <REQUIREMENT_CHANGE / PR_REVIEW / BUG_FOUND / etc.> |
| Source | <PR #123 / Stakeholder / Testing / etc.> |
| Description | <brief description> |

### Change Description / Mô tả Thay đổi

<Detailed description of what changed and why>

### Affected Requirements / Yêu cầu Bị ảnh hưởng

| Requirement | Change Type | Description |
|-------------|-------------|-------------|
| FR-001 | Modified | <what changed> |
| FR-005 | Added | <new requirement> |
| NFR-002 | Removed | <why removed> |

---

### Impact Analysis / Phân tích Ảnh hưởng

#### Restart From / Bắt đầu lại Từ

| Field | Value |
|-------|-------|
| Restart Phase | Phase <X>: <name> |
| Reason | <why this phase> |

#### Affected Phases / Các Phase Bị ảnh hưởng

| Phase | Previous Status | New Status | Action |
|-------|-----------------|------------|--------|
| 0 - Analysis | ✅ Approved | ✅ Keep | No change |
| 1 - Spec | ✅ Approved | 🔄 Update | Create spec-update-<N>.md |
| 2 - Tasks | ✅ Approved | 🔄 Update | Create tasks-update-<N>.md |
| 3 - Impl | ✅ Approved | 🔄 Update | Update impl-log |
| 4 - Tests | ✅ Approved | 🔄 Update | Update test docs |
| 5 - Done | ⏳ Pending | 🔄 Reset | Re-verify |

---

### File Naming for Update <N> / Đặt tên File cho Update <N>

| Phase | Original | Update <N> |
|-------|----------|------------|
| 0 | analysis.md | analysis-update-<N>.md |
| 1 | spec.md | spec-update-<N>.md |
| 2 | tasks.md | tasks-update-<N>.md |
| 3 | impl-log.md | impl-log-update-<N>.md |
| 4 | tests.md | tests-update-<N>.md |
| 5 | done.md | done-update-<N>.md |

---

### Update Log Entry / Bản ghi Cập nhật

Add to workflow state:

```yaml
updates:
  - number: <N>
    timestamp: <now>
    type: <update_type>
    source: <source>
    description: <description>
    restart_from: <phase>
    affected_phases: [<list>]
    affected_requirements:
      added: [FR-005]
      modified: [FR-001]
      removed: [NFR-002]
```

---

### Previous Artifacts Preserved / Artifacts Trước được Giữ lại

| Phase | Original File | Status |
|-------|---------------|--------|
| 1 | spec.md | 📁 Preserved |
| 1 | spec-update-1.md | 📁 Preserved (if exists) |
| 2 | tasks.md | 📁 Preserved |
| ... | ... | ... |

> All previous versions are kept for audit trail
> Tất cả phiên bản trước được giữ để theo dõi

---

## ⏸️ STOP — Update Registered / DỪNG — Cập nhật Đã đăng ký

### Update #<N> registered. Ready to restart from Phase <X>.
### Cập nhật #<N> đã đăng ký. Sẵn sàng bắt đầu lại từ Phase <X>.

**Summary:**
- Update type: <type>
- Restart from: Phase <X>
- Phases to re-run: <N>
- New docs will use suffix: `-update-<N>`

**Next Steps:**
1. Review the impact analysis above
2. Reply `approved` to proceed with update
3. Or `adjust` to change restart phase

Reply `approved` to start Phase <X> with update #<N>.
```

---

## State Updates / Cập nhật State

```yaml
# Register update
meta:
  update_count: <N>
  
status:
  last_action: "Registered update #<N>"
  next_action: "Awaiting approval to restart from Phase <X>"
  
updates:
  - number: <N>
    timestamp: <timestamp>
    type: <update_type>
    source: <source>
    description: <description>
    restart_from: <phase_number>
    affected_phases: [1, 2, 3, 4, 5]  # example
    status: pending-approval

# After approval
updates:
  - number: <N>
    ...
    status: approved
    started_at: <timestamp>

# Reset affected phases
phases:
  phase_1_spec:
    status: pending-update-<N>
    previous_status: approved
  phase_2_tasks:
    status: pending-update-<N>
    previous_status: approved
  # ... etc for all affected phases

status:
  current_phase: <restart_phase>
  current_update: <N>
  next_action: "Run Phase <X> for update #<N>"
```

---

## Document Suffix Rules / Quy tắc Hậu tố Tài liệu

```yaml
naming_convention:
  pattern: "<original-name>-update-<N>.md"
  
  examples:
    update_1:
      - spec-update-1.md
      - tasks-update-1.md
      - impl-log-update-1.md
      
    update_2:
      - spec-update-2.md
      - tasks-update-2.md
      - impl-log-update-2.md

  rules:
    - Original files preserved (never overwritten)
    - Each update creates new suffixed file
    - State tracks which version is current
    - All versions kept for audit trail
```

---

## Phase Execution with Update / Thực thi Phase với Update

When running phases after update:

```yaml
phase_execution:
  1. Check current_update in state
  2. If current_update > 0:
     - Use suffix "-update-<N>" for new docs
     - Reference previous version for context
     - Note what changed from previous
  3. Update artifacts reference in state:
     artifacts:
       - path: spec-update-<N>.md
         status: complete
         replaces: spec.md  # or spec-update-<N-1>.md
```

---

## STOP Rules / Quy tắc Dừng

```yaml
MUST_NOT:
  - Delete previous artifacts
  - Overwrite original files
  - Skip impact analysis
  - Auto-proceed without approval

MUST:
  - Preserve all previous versions
  - Track update number in state
  - Use correct suffix for new docs
  - Get approval before restarting
```

---

## Next Step / Bước tiếp theo

| User Response | Next Action |
|---------------|-------------|
| `approved` | Run restart phase prompt (e.g., `phase-0-analysis.prompt.md`) |
| `adjust phase <X>` | Change restart phase |
| `cancel` | Cancel update, keep current state |
| `show history` | Display all updates history |
