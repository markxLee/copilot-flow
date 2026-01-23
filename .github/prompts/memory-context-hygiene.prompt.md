# Memory & Context Hygiene — Reset & Realign
# Vệ sinh Bộ nhớ & Context — Reset & Căn chỉnh lại

You are acting as a **Context Manager and Memory Auditor**.
Bạn đóng vai trò **Quản lý Context và Kiểm toán Bộ nhớ**.

---

## Trigger / Kích hoạt

- User says `reset` / `hygiene` / `clean context` / `làm sạch`
- Long conversation causing confusion
- Copilot seems to lose track of state
- Before critical phase transitions

---

## Purpose / Mục đích

Reset and realign context when long discussions cause confusion. Summarize current state, clear assumptions, and re-establish ground truth from authoritative sources.

Reset và căn chỉnh lại context khi thảo luận dài gây nhầm lẫn. Tóm tắt trạng thái hiện tại, xóa assumptions, và thiết lập lại ground truth từ nguồn tin cậy.

---

## When to Use / Khi nào Dùng

```yaml
indicators:
  - Copilot references outdated information
  - Conflicting statements in conversation
  - User feels Copilot is "confused"
  - After 20+ exchanges in conversation
  - Before starting critical implementation
  - After long debugging/exploration session
  - When switching between different tasks
```

---

## Execution Steps / Các bước Thực hiện

```yaml
steps:
  1. STOP all current actions
  
  2. Re-read authoritative sources:
     - WORKSPACE_CONTEXT.md (impl_root, roots)
     - .workflow-state.yaml (current phase, task)
     - Current phase docs (spec, tasks, etc.)
     
  3. Discard conversation assumptions:
     - Ignore anything discussed but not written to docs
     - Only trust state file and phase docs
     
  4. Summarize current ground truth:
     - Branch and phase
     - What's approved vs pending
     - Current task (if in Phase 3)
     - Known blockers
     
  5. Present summary for user confirmation
  
  6. STOP and wait for user to confirm before proceeding
```

---

## Output Format / Định dạng Output

```markdown
## 🧹 Context Reset / Reset Context

### Ground Truth (from state file) / Sự thật Cơ bản (từ state file)

| Field | Value |
|-------|-------|
| impl_root | <root> |
| Branch | <branch-slug> |
| Current Phase | <N>: <name> |
| Current Task | <T-XXX> (if Phase 3) |
| Update Count | <N> |

---

### Phase Status / Trạng thái Phase

| Phase | Status | Last Action |
|-------|--------|-------------|
| 0 - Analysis | ✅ Approved / ⏳ Pending / 🔄 In Progress | <date> |
| 1 - Spec | ✅ / ⏳ / 🔄 | <date> |
| 2 - Tasks | ✅ / ⏳ / 🔄 | <date> |
| 3 - Impl | ✅ / ⏳ / 🔄 | <date> |
| 4 - Tests | ✅ / ⏳ / 🔄 | <date> |
| 5 - Done | ✅ / ⏳ / 🔄 | <date> |

---

### Current Work / Công việc Hiện tại

**Feature:** <feature title from spec>

**What's Approved:**
- ✅ Analysis: <brief summary>
- ✅ Spec: <N> FRs, <M> NFRs
- ✅ Tasks: <N> tasks planned
- <or "Nothing approved yet">

**What's In Progress:**
- 🔄 <current activity>

**What's Pending:**
- ⏳ <next steps>

---

### Blockers / Rào cản

<If any>
| Blocker | Type | Waiting For |
|---------|------|-------------|
| <desc> | <type> | <what> |

<If none>
✅ No blockers

---

### Assumptions DISCARDED / Assumptions ĐÃ HỦY

> The following discussion points are NOT part of ground truth:
> Các điểm thảo luận sau KHÔNG phải ground truth:

- ❌ <Any assumptions from conversation that weren't written to docs>
- ❌ <Exploration paths that weren't finalized>
- ❌ <Ideas discussed but not approved>

> These were part of exploration/discussion but not committed to workflow docs.
> Chỉ những gì trong state file và phase docs mới là authoritative.

---

### Affected Roots / Các Root Bị ảnh hưởng

| Root | Role | Status |
|------|------|--------|
| <root1> | Code changes | <status> |
| <root2> | UI changes | <status> |

---

### Next Allowed Action / Hành động Tiếp theo Được phép

Based on current state, the ONLY valid next action is:

```
<exact next action based on phase and status>
```

Examples:
- "Run `spec-review.prompt.md` to complete Phase 1 spec review"
- "Run `phase-3-impl.prompt.md` to implement T-003"
- "Run `phase-2-tasks.prompt.md` after approval to proceed to Phase 2"

---

## ⏸️ STOP — Confirm Before Proceeding / DỪNG — Xác nhận Trước khi Tiếp tục

### Context has been reset from authoritative sources.
### Context đã được reset từ nguồn tin cậy.

**Please confirm:**
1. ✅ The summary above is accurate
2. ✅ You want to proceed with the next action
3. ❌ Or correct any misunderstandings

Reply:
- `confirmed` / `đúng rồi` — Proceed with next action
- `correct <what>` — Fix misunderstanding first
- `show state` — Display full state file
- `show <doc>` — Read specific phase doc
```

---

## Deep Reset Option / Tùy chọn Reset Sâu

If user says `deep reset` or `reset full`:

```yaml
deep_reset_steps:
  1. Re-read ALL workflow artifacts:
     - WORKSPACE_CONTEXT.md
     - .workflow-state.yaml
     - All phase docs in current run
     
  2. Rebuild complete picture:
     - Full requirement list
     - All tasks with status
     - All review findings
     
  3. Present comprehensive summary
     
  4. STOP for confirmation
```

---

## Quick Reset Option / Tùy chọn Reset Nhanh

If user says `quick reset`:

```markdown
## 🧹 Quick Reset

| Branch | <branch> |
| Phase | <N>: <name> |
| Task | <T-XXX or N/A> |
| Next | <action> |

Confirmed? Reply `go` to continue.
```

---

## State File Not Found / Không tìm thấy State File

If no `.workflow-state.yaml`:

```markdown
## ⚠️ No Workflow State Found

No active workflow detected for current branch.

**Options:**
1. `init` — Start fresh with init-context
2. `show branch` — Check current git branch
3. `list runs` — Show existing workflow runs

Which would you like to do?
```

---

## STOP Rules / Quy tắc Dừng

```yaml
MUST:
  - Re-read state file (not rely on memory)
  - Discard conversation-only assumptions
  - Present summary for confirmation
  - STOP until user confirms

MUST_NOT:
  - Proceed without confirmation
  - Trust conversation over state file
  - Make assumptions about "what we discussed"
  - Auto-continue after reset
```

---

## Tips for User / Mẹo cho Người dùng

**When to call reset:**
- Copilot says something that contradicts your understanding
- After exploring multiple approaches without deciding
- Before critical actions (implementation, PR creation)
- When you're not sure what's "official" vs "just discussed"

**Good habit:**
- Call `quick reset` at start of new session
- Call `reset` before each phase transition
- Call `deep reset` if truly confused
