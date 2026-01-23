# Quick Reference Card / Thẻ Tham chiếu Nhanh

> Cheat sheet for Copilot Workflow commands and phases.
> Thẻ tóm tắt các lệnh và phase của Copilot Workflow.

---

## 🎯 Purpose / Mục đích

Display a concise reference card with all commands, phases, and navigation.
Hiển thị thẻ tham chiếu ngắn gọn với tất cả lệnh, phases, và navigation.

---

## Trigger / Kích hoạt

- User says: `help`, `commands`, `cheat sheet`, `quick ref`, `?`
- User seems confused about what to do next
- User asks "what commands are available?"

---

## Output / Kết quả

```markdown
## 📚 Copilot Workflow Quick Reference

### 🚀 Session Commands / Lệnh Phiên
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `init` | Start/refresh session | `bắt đầu` |
| `resume` | Continue from saved state | `tiếp tục` |
| `status` | Show current progress | `trạng thái` |
| `help` / `?` | Show this reference | `trợ giúp` |

### 📝 Work Commands / Lệnh Công việc
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `<describe work>` | Start new work | `<mô tả công việc>` |
| `update` | Handle requirement changes | `cập nhật` |
| `lite: <desc>` | Start lite mode (skip phases) | `nhanh: <mô tả>` |

### ✅ Approval Commands / Lệnh Duyệt
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `approved` | Approve current phase | `duyệt` |
| `go` | Proceed to next action | `tiếp` |
| `skip` | Skip optional step | `bỏ qua` |
| `feedback: <text>` | Provide feedback | `góp ý: <text>` |

### 🔍 Review Commands / Lệnh Review
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `review` | Run review for current phase | `review` |
| `next task` | Move to next task (Phase 3) | `task tiếp` |
| `next batch` | Next test batch (Phase 4) | `batch tiếp` |

### 📤 PR Commands / Lệnh PR
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `pr` | Generate PR description | `tạo pr` |
| `notify` | Generate reviewer message | `thông báo` |

### ⚠️ Safety Commands / Lệnh An toàn
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `rollback` | Undo last implementation | `hoàn tác` |
| `reset context` | Clear confused state | `reset` |
| `abort` | Cancel current operation | `hủy` |

---

### 📊 Workflow Phases / Các Phase

```
┌─────┬─────────────────┬──────────────┬─────────────────────────┐
│  #  │ Phase           │ Output       │ Next Prompt             │
├─────┼─────────────────┼──────────────┼─────────────────────────┤
│  0  │ Analysis        │ analysis.md  │ phase-1-spec            │
│  1  │ Specification   │ spec.md      │ phase-2-tasks           │
│  2  │ Task Planning   │ tasks.md     │ phase-3-impl            │
│  3  │ Implementation  │ impl-log.md  │ phase-4-tests           │
│  4  │ Testing         │ tests.md     │ phase-5-done            │
│  5  │ Done Check      │ done.md      │ pr-description          │
└─────┴─────────────────┴──────────────┴─────────────────────────┘
```

---

### 🔄 Common Flows / Các Luồng Phổ biến

**New Feature:**
```
init → <describe> → approved → phase-0 → ... → phase-5 → pr
```

**Quick Fix (Lite Mode):**
```
lite: <describe> → implement → review → done
```

**Resume Work:**
```
resume → go → (continue where left off)
```

**Requirement Change:**
```
update → <describe change> → approved → (restart from affected phase)
```

**Undo Mistake:**
```
rollback → (choose what to undo) → continue
```

---

### 📁 Key Paths / Đường dẫn Chính

| Path | Purpose |
|------|---------|
| `copilot-flow/` | impl_root (all docs here) |
| `docs/runs/<branch>/` | Current workflow artifacts |
| `.workflow-state.yaml` | State file (AI reads/writes) |
| `docs/templates/` | Phase templates |

---

### 💡 Tips / Mẹo

1. **Always on feature branch** — Not main/master
2. **State auto-saves** — Resume anytime with `resume`
3. **Bilingual OK** — Commands work in EN or VI
4. **Say `status` anytime** — See where you are
5. **Approval required** — Copilot STOPs at each phase gate

---

**Current Status:** <show current phase and next action>
```

---

## Context-Aware Display / Hiển thị Theo Ngữ cảnh

When showing quick ref, also include:

```yaml
context_footer:
  if: workflow_active
  show: |
    ---
    ### 📍 Your Current Position
    | Phase | <current_phase> |
    | Task | <current_task or N/A> |
    | Next | <next_action> |
    
    **Quick action:** Say `go` to proceed.
```

---

## Compact Version / Phiên bản Ngắn

When user says `help short` or `? short`:

```markdown
## ⚡ Quick Commands
| `init` | Start | `resume` | Continue | `status` | Progress |
| `approved` | Approve | `go` | Next | `review` | Review |
| `pr` | Make PR | `rollback` | Undo | `help` | Full ref |

**Phases:** 0-Analysis → 1-Spec → 2-Tasks → 3-Impl → 4-Tests → 5-Done

**Now:** Phase <X>, say `<next_command>` to continue.
```

---

## Integration / Tích hợp

This prompt can be called from any other prompt when:
- User seems lost
- User asks for help
- Error occurred and user needs guidance

```yaml
integration:
  callable_from: any prompt
  trigger_phrases:
    - "help"
    - "?"
    - "what do I do"
    - "commands"
    - "how to"
    - "làm sao"
    - "trợ giúp"
```
