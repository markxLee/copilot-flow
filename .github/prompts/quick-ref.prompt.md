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

## ⚠️ CRITICAL: Display Rules / Quy tắc Hiển thị

```yaml
display_rules:
  # DO NOT summarize or shorten the output
  # DO NOT skip sections unless user asks for specific topic
  # DO NOT add extra explanations beyond the template
  
  behavior:
    - Display the EXACT markdown template below
    - Include ALL sections in order
    - If user asks "help" → show FULL reference
    - If user asks "help <topic>" → show only that section
    - If user asks "help short" → show Compact Version only
    
  forbidden:
    - DO NOT say "Here's a summary..."
    - DO NOT say "The key commands are..."
    - DO NOT truncate tables
    - DO NOT add "Let me know if you need more details"
    
  required:
    - Copy the template EXACTLY as written
    - Preserve all formatting, emojis, tables
    - Include bilingual text (EN/VI)
```

---

## Output Template / Kết quả

**IMPORTANT: Display the following markdown EXACTLY as-is, do not summarize:**

```markdown
## 📚 Copilot Workflow Quick Reference

---

## PART 1: INTRODUCTION / GIỚI THIỆU

---

### 🌐 What is Multi-Root Workspace? / Workspace Đa Root là gì?

**Definition / Định nghĩa:**
A single VS Code window with multiple git repos (project folders) open together.
Một cửa sổ VS Code mở nhiều git repo (thư mục dự án) cùng lúc.

**Why use it? / Tại sao dùng?**
- Work across related projects without switching windows
- Làm việc xuyên suốt nhiều dự án liên quan không cần chuyển cửa sổ
- Share code, run cross-project searches, unified terminal
- Chia sẻ code, tìm kiếm xuyên dự án, terminal chung

**Example structure / Ví dụ cấu trúc:**
```
Your Workspace (1 VS Code window)
├── my-frontend/       ← Git repo 1: React app
├── my-backend/        ← Git repo 2: Node.js API  
├── shared-libs/       ← Git repo 3: Shared packages
└── workflow-docs/     ← Git repo 4: Workflow docs (impl_root)
```

**Key Terms / Thuật ngữ Chính:**

| Term | EN | VI |
|------|----|----|
| **impl_root** | Where ALL workflow docs live | Nơi chứa TẤT CẢ docs workflow |
| **affected_roots** | Roots where code changes happen | Roots bị thay đổi code |
| **WORKSPACE_CONTEXT.md** | Config file describing multi-root setup | File cấu hình đa root |

---

### 🔄 What is Governed Workflow? / Governed Workflow là gì?

**Definition / Định nghĩa:**
A structured 6-phase process for complex development tasks with human approval gates.
Quy trình 6 phase có cấu trúc cho các task phức tạp, có cổng duyệt bởi người dùng.

**Why use it? / Tại sao dùng?**
- Prevents AI from going off-track on complex tasks
- Ngăn AI đi lệch hướng với task phức tạp
- Human stays in control with approval at each phase
- Người dùng kiểm soát với duyệt ở mỗi phase
- All decisions documented for later reference
- Mọi quyết định được ghi lại để tham khảo sau

**The 6 Phases / 6 Phase:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRE-PHASE: WORK INPUT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  You describe work      →    Copilot asks questions    →    Scope locked   │
│  "Add analytics..."          "Which provider?"              "GA4, clicks"  │
│       (work-intake)              (clarify)                  (work-review)  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ approved
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MAIN PHASES (0-5)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Phase 0   →   Phase 1   →   Phase 2   →   Phase 3   →   Phase 4   →   5   │
│  Analysis      Spec          Tasks         Implement     Test          Done │
│  (design)      (criteria)    (plan)        (code)        (verify)      (PR) │
│     ⏸️            ⏸️            ⏸️            ⏸️            ⏸️           ⏸️   │
│  approval     approval      approval      per-task      approval     final │
└─────────────────────────────────────────────────────────────────────────────┘
```

**When to use Governed Workflow / Khi nào dùng:**
- ✅ Features spanning multiple files
- ✅ Bug fixes requiring investigation  
- ✅ Refactoring with broad impact
- ✅ Work affecting multiple repos

**When to use Lite Mode instead / Khi nào dùng Lite Mode:**
- ✅ Simple one-file edits
- ✅ Bug fixes with clear cause
- ✅ Small features (< 3 files)

---

## PART 2: WORKFLOW DETAILS / CHI TIẾT WORKFLOW

---

### 📊 Phase Details / Chi tiết Các Phase

**Pre-Phase: Work Input / Trước Phase: Nhập Công việc**

| Step | What Happens | Output | Gate |
|------|--------------|--------|------|
| **Work Intake** | You describe work, Copilot asks clarifying questions | Work description captured | ⏸️ Answer questions |
| **Work Review** | Review scope, confirm acceptance criteria | Scope locked, criteria agreed | ⏸️ Approval to start |

**Main Phases / Các Phase Chính:**

| Phase | What Happens | Output | Gate |
|-------|--------------|--------|------|
| **0 - Analysis** | Understand problem, research codebase, design approach | `analysis.md` with diagrams | ⏸️ Approval |
| **1 - Specification** | Define requirements, acceptance criteria, edge cases | `spec.md` with clear criteria | ⏸️ Approval |
| **2 - Task Planning** | Break into tasks, estimate, identify dependencies | `tasks.md` with ordered list | ⏸️ Approval |
| **3 - Implementation** | Code each task, run reviews per task | `impl-log.md` + code changes | ⏸️ Per-task |
| **4 - Testing** | Write tests, verify coverage, run test suite | `tests.md` with results | ⏸️ Approval |
| **5 - Done Check** | Verify all criteria met, prep for PR | `done.md` checklist | ⏸️ Final |

**What happens at each step / Mỗi bước làm gì:**

1. **Work Intake / Nhập công việc:**
   - You describe what you want (feature, bug fix, refactor)
   - Bạn mô tả việc cần làm (tính năng, sửa lỗi, refactor)
   - Copilot asks questions to understand scope
   - Copilot hỏi để hiểu rõ phạm vi

2. **Work Review / Xem xét công việc:**
   - Copilot summarizes understanding
   - Copilot tóm tắt hiểu biết
   - Lists acceptance criteria
   - Liệt kê tiêu chí chấp nhận
   - You confirm or clarify further
   - Bạn xác nhận hoặc làm rõ thêm

3. **Phase 0-5 / Các Phase 0-5:**
   - Each phase builds on previous
   - Mỗi phase xây dựng trên phase trước
   - Approval required between phases
   - Cần duyệt giữa các phase

---

### 🛠️ Setup Flow / Luồng Cài đặt

**How to set up multi-root workspace / Cách cài đặt workspace đa root:**

**Step 1: Create VS Code workspace / Tạo workspace VS Code:**
1. File → Open Folder → Select your first git repo
2. File → Add Folder to Workspace → Select another git repo (repeat for each)
3. File → Save Workspace As → `my-project.code-workspace`

**Step 2: Run Copilot setup / Chạy cài đặt Copilot:**
```
setup workspace
│
├── Step 1: workspace-discovery
│   ├── Scan all roots
│   ├── Detect tech stacks
│   └── Generate WORKSPACE_CONTEXT.md
│
├── Step 2: cross-root-guide
│   ├── Detect relationships between roots
│   ├── Identify shared dependencies
│   └── Save to Section 9 (cross_root_workflows)
│
├── Step 3: sync-instructions
│   ├── Sync shared coding standards
│   ├── Detect tech stacks per root
│   └── Suggest missing instructions
│
└── Step 4: generate-workspace-files
    ├── Generate .code-workspace file
    ├── Generate workspace ARCHITECTURE.md
    └── Review/create root-level ARCHITECTURE.md
```

---

### ➕ Adding a New Root / Thêm Root Mới

1. **Add to VS Code:** File → Add Folder to Workspace
2. **Update context:** Say `workspace-update-root`
3. **Configure relationships:** Say `cross-root`
4. **Sync instructions:** Say `sync instructions`
5. **Generate docs:** Say `generate architecture`

Or run all at once: `setup workspace`

---

### 📁 Key Paths / Đường dẫn Chính

| Path | Purpose |
|------|---------|
| `<impl_root>/` | All workflow docs stored here |
| `docs/runs/<branch>/` | Current workflow artifacts |
| `.workflow-state.yaml` | State file (AI reads/writes) |
| `docs/templates/` | Phase templates |
| `WORKSPACE_CONTEXT.md` | Multi-root config |

---

## PART 3: COMMANDS / CÁC LỆNH

---

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

### 🛠️ Setup Commands / Lệnh Cài đặt
| Command | Action | Lệnh VN |
|---------|--------|---------|
| `setup workspace` | Full setup (4 steps) | `cài đặt workspace` |
| `sync instructions` | Sync coding standards | `đồng bộ instructions` |
| `suggest instructions` | Analyze tech + suggest | `gợi ý instructions` |
| `sync vscode settings` | Sync VS Code settings | `đồng bộ settings` |
| `generate workspace file` | Create .code-workspace | `tạo workspace file` |
| `generate architecture` | Create ARCHITECTURE.md | `tạo architecture` |
| `cross-root` | Configure cross-root | `cấu hình đa root` |

---

## PART 4: QUICK REFERENCE / THAM CHIẾU NHANH

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

### 💡 Tips / Mẹo

1. **Always on feature branch** — Not main/master
2. **State auto-saves** — Resume anytime with `resume`
3. **Bilingual OK** — Commands work in EN or VI
4. **Say `status` anytime** — See where you are
5. **Approval required** — Copilot STOPs at each phase gate

---

## PART 5: TROUBLESHOOTING / XỬ LÝ SỰ CỐ

---

### 🔥 Common Issues / Các Lỗi Thường gặp

#### 1. "Copilot doesn't recognize commands" / Copilot không nhận lệnh

**Symptoms / Triệu chứng:**
- Copilot ignores `init`, `resume`, `status`
- Copilot không phản hồi các lệnh

**Fix / Cách sửa:**
```
1. Make sure you're in impl_root (copilot-flow/)
2. Check WORKSPACE_CONTEXT.md exists
3. Say: reset context
4. Then: init
```

---

#### 2. "Workflow state is corrupted" / State bị lỗi

**Symptoms / Triệu chứng:**
- Phase says "approved" but Copilot asks for approval again
- Current task doesn't match what you remember

**Fix / Cách sửa:**
```
1. Say: status (see current state)
2. If wrong, say: reset context
3. Manual fix: Edit docs/runs/<branch>/.workflow-state.yaml
4. Resume: init → resume
```

---

#### 3. "Copilot creates files in wrong root" / File tạo sai root

**Symptoms / Triệu chứng:**
- Workflow docs appear in apphub-vision/ instead of copilot-flow/
- Code changes appear in wrong project

**Fix / Cách sửa:**
```
1. Say: cross-root (reconfigure relationships)
2. Check WORKSPACE_CONTEXT.md → meta.impl_root
3. Delete wrong files manually
4. Say: init → resume
```

---

#### 4. "Can't resume after session break" / Không thể tiếp tục sau khi nghỉ

**Symptoms / Triệu chứng:**
- New chat doesn't know previous context
- Copilot starts from scratch

**Fix / Cách sửa:**
```
1. Say: init (loads workspace context)
2. Say: resume (loads workflow state)
3. If still lost: Say status to see current position
```

---

#### 5. "Phase outputs don't save" / Output phase không lưu

**Symptoms / Triệu chứng:**
- analysis.md, spec.md etc. not created
- State file missing entries

**Fix / Cách sửa:**
```
1. Check you're on a feature branch (not main)
2. Verify impl_root path is correct
3. Check docs/runs/<branch>/ exists
4. Say: status → then continue from current phase
```

---

#### 6. "Copilot implements too much / too little" / Copilot làm quá nhiều/ít

**Symptoms / Triệu chứng:**
- Implements multiple tasks at once
- Skips important steps
- Adds features not in spec

**Fix / Cách sửa:**
```
1. Say: rollback (undo changes)
2. Be more specific in your commands
3. Use explicit: "implement ONLY task T-001"
4. Use lite mode for simple tasks: lite: <description>
```

---

#### 7. "Cross-root changes not synced" / Thay đổi đa root không đồng bộ

**Symptoms / Triệu chứng:**
- Shared package updated but app doesn't see it
- Instructions not appearing in other roots

**Fix / Cách sửa:**
```
1. Say: sync instructions (resync shared files)
2. Check root-specific build order
3. Rebuild dependent packages first
4. Verify .github/instructions/ exists in target roots
```

---

### 🆘 Emergency Commands / Lệnh Khẩn cấp

| Situation | Command | What it does |
|-----------|---------|-------------|
| Everything broken | `reset context` | Clear all context, start fresh |
| Wrong code written | `rollback` | Undo implementation changes |
| Lost mid-workflow | `status` | Show where you are |
| State corrupted | `init` → `resume` | Reload all context |
| Need to start over | `abort` → `init` | Cancel current, start new |

---

### 📞 Escalation / Khi cần Hỗ trợ

If nothing works / Nếu không gì hoạt động:

1. **Check git status** — Make sure you have no uncommitted changes you care about
2. **Delete state file** — Remove `docs/runs/<branch>/.workflow-state.yaml`
3. **Start fresh** — Say `init` → describe work again
4. **Report issue** — Note what happened and file an issue

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
