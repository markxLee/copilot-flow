# Copilot Workflow System

> A governed, multi-phase workflow for AI-assisted software development.
> Hệ thống workflow có kiểm soát, đa phase cho phát triển phần mềm với AI.

---

## 🎯 Overview / Tổng quan

This repository contains a complete workflow system for GitHub Copilot to manage complex development tasks across multi-root VS Code workspaces.

Repository này chứa hệ thống workflow hoàn chỉnh để GitHub Copilot quản lý các task phát triển phức tạp trên multi-root VS Code workspaces.

### Key Features / Tính năng Chính

- ✅ **6-Phase Workflow** — Analysis → Spec → Tasks → Impl → Tests → Done
- ✅ **Multi-Root Support** — Work across multiple repositories
- ✅ **State Management** — Resume work after session breaks
- ✅ **Review Gates** — Approval required at each phase
- ✅ **Iteration Support** — Handle requirement changes with versioned docs
- ✅ **Bilingual Docs** — English & Vietnamese inline format
- ✅ **PR Automation** — Generate PR descriptions and reviewer notifications

---

## 📁 Structure / Cấu trúc

```
copilot-flow/
├── .github/
│   ├── copilot-instructions.md      # Entry point (auto-read by Copilot)
│   └── prompts/                     # All workflow prompts
│       ├── init-context.prompt.md
│       ├── work-intake.prompt.md
│       ├── work-update.prompt.md
│       ├── work-review.prompt.md
│       ├── phase-0-analysis.prompt.md
│       ├── phase-1-spec.prompt.md
│       ├── spec-review.prompt.md
│       ├── phase-2-tasks.prompt.md
│       ├── task-plan-review.prompt.md
│       ├── phase-3-impl.prompt.md
│       ├── code-review.prompt.md
│       ├── code-fix-plan.prompt.md
│       ├── code-fix-apply.prompt.md
│       ├── phase-4-tests.prompt.md
│       ├── test-verify.prompt.md
│       ├── phase-5-done.prompt.md
│       ├── pr-description.prompt.md
│       ├── pr-notify-reviewers.prompt.md
│       ├── workflow-resume.prompt.md
│       ├── memory-context-hygiene.prompt.md
│       ├── workspace-discovery.prompt.md
│       ├── workspace-update-root.prompt.md
│       ├── quick-ref.prompt.md          # Quick reference / cheat sheet
│       ├── rollback.prompt.md           # Undo implementation changes
│       └── lite-mode.prompt.md          # Streamlined workflow for simple tasks
├── docs/
│   ├── workflow/
│   │   └── contract.md              # Workflow rules & contract
│   ├── templates/                   # Phase document templates
│   │   ├── 00_analysis.template.md
│   │   ├── 01_spec.template.md
│   │   ├── 02_tasks.template.md
│   │   ├── 03_impl.template.md
│   │   ├── 04_tests.template.md
│   │   ├── 05_done.template.md
│   │   └── workflow-state.template.yaml
│   └── runs/                        # Active workflow artifacts
│       └── <branch-slug>/           # Per-branch workflow docs
├── WORKSPACE_CONTEXT.md             # Multi-root workspace info
└── README.md                        # This file
```

---

## 🚀 Quick Start / Bắt đầu Nhanh

### 1. Open Multi-Root Workspace

```bash
# Open VS Code with multiple roots
code copilot-flow apphub-vision reviews-assets
```

### 2. Start a New Session

Say to Copilot:
```
init
```

Copilot will:
- Load workspace context
- Check for existing workflow
- Report current state

### 3. Start New Work

Say:
```
Add analytics tracking to dashboard
```

Copilot will:
- Run `work-intake` to capture requirements
- Run `work-review` to verify readiness
- Guide you through phases 0-5

### 4. Quick Fix (Lite Mode)

For simple tasks that don't need full workflow:
```
lite: fix typo in error message
```

Copilot will:
- Skip phases 0-2 (no analysis/spec/tasks)
- Implement directly
- Quick review and done

---

## 📊 Workflow Diagram / Sơ đồ Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SESSION START                                │
├─────────────────────────────────────────────────────────────────────┤
│  init-context  →  Check existing workflow  →  Resume or New?        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │   RESUME     │               │   NEW WORK   │
            │ workflow-    │               │ work-intake  │
            │ resume       │               │ work-review  │
            └──────────────┘               └──────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 0: ANALYSIS                            │
├─────────────────────────────────────────────────────────────────────┤
│  phase-0-analysis  →  analysis.md  →  ⏸️ STOP (approval required)   │
└─────────────────────────────────────────────────────────────────────┘
                                    │ approved
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 1: SPECIFICATION                         │
├─────────────────────────────────────────────────────────────────────┤
│  phase-1-spec  →  spec.md  →  spec-review  →  ⏸️ STOP               │
└─────────────────────────────────────────────────────────────────────┘
                                    │ approved
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: TASK PLANNING                        │
├─────────────────────────────────────────────────────────────────────┤
│  phase-2-tasks  →  tasks.md  →  task-plan-review  →  ⏸️ STOP        │
└─────────────────────────────────────────────────────────────────────┘
                                    │ approved
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: IMPLEMENTATION                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  FOR EACH TASK:                                              │   │
│  │  phase-3-impl (1 task) → ⏸️ STOP                             │   │
│  │       │                                                      │   │
│  │       ▼                                                      │   │
│  │  code-review → APPROVE? ──yes──→ next task                   │   │
│  │       │                                                      │   │
│  │       │ REQUEST CHANGES                                      │   │
│  │       ▼                                                      │   │
│  │  code-fix-plan → code-fix-apply → code-review (re-review)    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │ all tasks done
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 4: TESTING                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  FOR EACH BATCH:                                             │   │
│  │  phase-4-tests (batch) → user runs tests → report results    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  test-verify (coverage ≥70%) → ⏸️ STOP                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │ approved
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 5: DONE CHECK                          │
├─────────────────────────────────────────────────────────────────────┤
│  phase-5-done  →  DoD verification  →  done.md  →  ⏸️ STOP          │
└─────────────────────────────────────────────────────────────────────┘
                                    │ approved
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          POST-COMPLETION                            │
├─────────────────────────────────────────────────────────────────────┤
│  pr-description  →  PR_DESCRIPTION.md                               │
│  pr-notify-reviewers  →  Slack/Teams message                        │
│  User: git commit, push, create PR                                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │   MERGED ✅   │               │ PR CHANGES   │
            │   Complete!   │               │ work-update  │
            └──────────────┘               │ (iteration)  │
                                           └──────────────┘
                                                   │
                                                   ▼
                                           Restart from
                                           affected phase
```

---

## 🎮 Commands / Các Lệnh

### Session Commands

| Say | Action |
|-----|--------|
| `init` / `start` | Initialize session, load context |
| `resume` / `tiếp tục` | Continue from saved state |
| `status` / `trạng thái` | Show current workflow status |
| `help` / `?` | Show quick reference card |

### Work Commands

| Say | Action |
|-----|--------|
| `<describe work>` | Start work-intake for new work |
| `lite: <desc>` | Start lite mode for simple tasks |
| `update` / `change` | Handle requirement changes |
| `approved` / `duyệt` | Approve current phase |

### Phase Commands

| Say | Action |
|-----|--------|
| `go` / `tiếp` | Proceed to next action |
| `review` | Run review for current phase |
| `next task` | Move to next task (Phase 3) |
| `next batch` | Move to next test batch (Phase 4) |

### Safety Commands

| Say | Action |
|-----|--------|
| `rollback` | Undo implementation changes |
| `reset context` | Clear confused state |
| `abort` | Cancel current operation |

### PR Commands

| Say | Action |
|-----|--------|
| `pr` / `create pr` | Generate PR description |
| `notify` / `ping reviewers` | Generate reviewer notification |

---

## 📝 Workflow Artifacts / Artifacts Workflow

All artifacts are stored in `docs/runs/<branch-slug>/`:

```
docs/runs/feature-add-analytics/
├── .workflow-state.yaml       # State tracking (AI reads/writes)
├── README.md                  # Summary for human reviewers
├── 00_analysis/
│   └── analysis.md
├── 01_spec/
│   └── spec.md
├── 02_tasks/
│   └── tasks.md
├── 03_impl/
│   └── impl-log.md
├── 04_tests/
│   └── tests.md
├── 05_done/
│   └── done.md
└── PR_DESCRIPTION.md
```

### Iteration Naming

When requirements change, new docs use suffix:
```
spec.md          → Original
spec-update-1.md → First iteration
spec-update-2.md → Second iteration
```

---

## 🌐 Multi-Root Workspace / Workspace Đa Root

This system is designed for multi-root VS Code workspaces:

| Root | Purpose |
|------|---------|
| `copilot-flow` | **impl_root** — All workflow docs stored here |
| `apphub-vision` | Main application code |
| `reviews-assets` | UI component library |
| `boost-pfs-backend` | Backend services |

### Key Concept: impl_root

All workflow documents are stored in `copilot-flow`, regardless of which roots have code changes. This ensures:

- Single location for reviewers
- One PR for workflow docs
- Code doesn't get cluttered with workflow artifacts

---

## ⚙️ Configuration / Cấu hình

### WORKSPACE_CONTEXT.md

Update this file when workspace structure changes:
```yaml
meta:
  impl_root: copilot-flow  # Where workflow docs go

roots:
  apphub-vision:
    type: monorepo
    pkg_manager: pnpm
    # ...
```

### State File (.workflow-state.yaml)

Tracks current workflow progress:
```yaml
meta:
  branch_slug: feature-add-analytics
  update_count: 0

status:
  current_phase: 3
  current_task: T-002
  last_action: "Completed T-001"
  next_action: "Implement T-002"

phases:
  phase_0_analysis:
    status: approved
  phase_1_spec:
    status: approved
  # ...
```

---

## 📋 Phase Summary / Tóm tắt Phase

| Phase | Name | Output | Gate |
|-------|------|--------|------|
| 0 | Analysis & Design | analysis.md | ⏸️ Approval |
| 1 | Specification | spec.md | ⏸️ Approval + Review |
| 2 | Task Planning | tasks.md | ⏸️ Approval + Review |
| 3 | Implementation | impl-log.md | ⏸️ Per-task review |
| 4 | Testing | tests.md | ⏸️ Coverage ≥70% |
| 5 | Done Check | done.md | ⏸️ DoD verification |

---

## 🔒 Safety Rules / Quy tắc An toàn

Copilot MUST NOT:
- ❌ Perform git write operations (add, commit, push)
- ❌ Skip approval gates
- ❌ Implement multiple tasks at once
- ❌ Run tests automatically
- ❌ Create docs in wrong root

Copilot MUST:
- ✅ STOP after each phase for approval
- ✅ Update state after each action
- ✅ Verify impl_root before creating docs
- ✅ Provide verification commands (not run them)

---

## 🆘 Troubleshooting / Xử lý Sự cố

### "No workflow found"
```
Say: init
Then: <describe your work>
```

### "Phase X not approved"
```
Complete the review for Phase X first:
Say: review
Then: approved (if ready)
```

### "Wrong root for docs"
```
Check WORKSPACE_CONTEXT.md
Ensure impl_root is set correctly
```

### Resume lost session
```
Say: resume
Copilot will load state from .workflow-state.yaml
```

---

## 📚 Related Documents / Tài liệu Liên quan

| Document | Purpose |
|----------|---------|
| [Workflow Contract](docs/workflow/contract.md) | Full rules and contract |
| [Templates](docs/templates/) | Phase document templates |
| [Copilot Instructions](.github/copilot-instructions.md) | Entry point for Copilot |

---

## 🏷️ Version / Phiên bản

- **Workflow Version:** 2.0
- **Last Updated:** 2026-01-23
- **Features:** Multi-root, State Management, Bilingual, Iterations

---

## 📄 License / Giấy phép

Internal use only / Chỉ sử dụng nội bộ

---

**Happy coding with Copilot! 🚀**