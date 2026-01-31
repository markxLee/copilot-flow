# Copilot Governed Workflow

> 🇬🇧 A structured, multi-phase workflow system for GitHub Copilot that ensures quality, traceability, and control.
> 🇻🇳 Hệ thống workflow có cấu trúc cho GitHub Copilot, đảm bảo chất lượng, khả năng truy vết và kiểm soát.

---

## Table of Contents

1. [Quick Start](#-quick-start)
2. [Commands Reference](#-commands-reference)
3. [Workflow Phases](#-workflow-phases)
4. [Phase 3: Two-Gate Implementation](#-phase-3-two-gate-implementation)
5. [Project Structure](#-project-structure)
6. [Guides](#-guides) ← *Detailed documentation*
7. [Configuration](#%EF%B8%8F-configuration)
8. [Example: Full Workflow](#-example-full-workflow)
9. [Troubleshooting](#-troubleshooting)
10. [References](#-references)

---

## 🚀 Quick Start

### 📖 New to Copilot-Flow?

**Read the complete walkthrough first:**

👉 **[Workflow Example Guide](docs/guides/workflow-example.md)** — Full end-to-end example from setup to PR (~15 min read)

This guide covers:
- Workspace setup step-by-step
- Work intake and clarifying questions
- All phases (0-5) with real examples
- Self-review before PR
- Quick reference card

---

### 1. First-Time Setup (One-time)

**What is Multi-Root Workspace?**

A VS Code workspace containing multiple project folders (roots) that work together. This workflow system is designed for teams working across multiple repositories.

**Setup Steps:**

1. Open VS Code
2. Add folders: `File → Add Folder to Workspace...` (add each repo)
3. Save workspace: `File → Save Workspace As...`
4. Tell Copilot:
```
/setup-workspace
```

This runs 4 steps automatically:
| Step | Prompt | Creates |
|------|--------|--------|
| 1. Discovery | `/workspace-discovery` | `WORKSPACE_CONTEXT.md` |
| 2. Cross-root | `/cross-root-guide` | Updates `WORKSPACE_CONTEXT.md` |
| 3. Sync instructions | `/sync-instructions` | `.github/instructions/` in each root |
| 4. Generate files | `/generate-workspace-file` | `.code-workspace` + `ARCHITECTURE.md` |

### 2. Open Workspace

```bash
code <workspace-name>.code-workspace
```

### 3. Start a Session

```
/init
```
Copilot will load context, check for existing workflow, and report status.

### 4. Start New Work

Tell Copilot what you want to do:
```
Add analytics tracking to dashboard
```
Copilot automatically runs `/work-intake` → asks clarifying questions → `/work-review` → then guides you through phases 0-5.

### 5. Simple Tasks (Lite Mode)

```
/lite-mode fix typo in error message
```
Skips phases 0-2, implements directly.

### 6. Hard Problems (Deep Dive — Optional)

🇬🇧 Use Deep Dive when the problem is messy/high-risk (unclear requirements, architecture decisions, security concerns), and you want multiple perspectives before committing to implementation.

🇻🇳 Dùng Deep Dive khi bài toán khó/nhiều rủi ro (yêu cầu mơ hồ, cần quyết định kiến trúc, có yếu tố security), để lấy nhiều góc nhìn trước khi bắt tay implement.

**Session-based workflow:**
```
/deep-dive start phase:0       # Start session for Phase 0 (Analysis)
/deep-dive run architect       # Get Architect perspective
/deep-dive run critic          # Get Critic perspective  
/deep-dive run security        # Get Security perspective
/deep-dive synthesize          # Generate consensus from all turns
/deep-dive end                 # Close session
```

**Supported phases:** 0 (Analysis), 1 (Spec), 2 (Task Plan), 5 (Done Check)

**Option A (Copilot-only):** Run roles directly in chat
**Option B (External runner):** Use CLI + external LLM API

🇬🇧 Note: Option B calls an external LLM API (OpenAI or OpenAI-compatible). It does **not** use the VS Code GitHub Copilot backend/subscription. You must provide your own API key and accept provider billing/data-sharing.

🇻🇳 Lưu ý: Option B gọi API của một LLM bên ngoài (OpenAI hoặc OpenAI-compatible). Nó **không** dùng backend/subscription GitHub Copilot trong VS Code. Bạn cần tự cung cấp API key và chấp nhận chi phí/chia sẻ dữ liệu theo provider.

Deep Dive always writes a **timestamped log per session** under `docs/runs/<branch-slug>/` to avoid overwrites. After that, Copilot (as Architect + Tech Lead) synthesizes results into the canonical workflow artifacts.

### 🤔 Which Mode to Use?

```
Is this a quick fix (< 30 min, clear scope)?
├─ YES → /lite-mode <description>
└─ NO → Full workflow:
         Is the requirement clear?
         ├─ YES → Just describe work, Copilot handles intake
         └─ NO → /work-intake (explicit capture)
```

---

## 🎮 Commands Reference

### Setup Commands (One-time / Occasional)

| Prompt | Action |
|--------|--------|
| `/setup-workspace` | Run full setup (discovery → cross-root → sync → generate) |
| `/workspace-discovery` | Scan workspace and create WORKSPACE_CONTEXT.md |
| `/cross-root-guide` | Auto-config & save cross-root relationships |
| `/sync-instructions` | Sync shared instructions + detect tech stacks |
| `/sync-instructions-to <root>` | Sync to specific root only |
| `/sync-instructions-except <root>` | Sync to all except one root |
| `/suggest-instructions` | Analyze tech stacks & suggest missing instructions |
| `/sync-vscode-settings` | Sync VS Code settings to all roots |
| `/generate-workspace-file` | Generate .code-workspace from context |
| `/generate-architecture` | Generate ARCHITECTURE.md from context |

### Session Commands (Every Session)

| Prompt | Action |
|--------|--------|
| `/init` | Initialize session, load context |
| `/workflow-resume` | Continue from saved state |
| `/workflow-status` | Show current workflow status |
| `/quick-ref` | Show quick reference card (all commands) |

### 🔄 Session Recovery Guide

**When to use each command:**

| Scenario | Command | Why |
|----------|---------|-----|
| Start of day / new chat | `/init-context` | Loads context + checks for existing workflow |
| VS Code restarted | `/init-context` | Same - context needs reload |
| Changed device / computer | `/init-context` → `resume` | State is in git, just reload |
| Session lost mid-phase | `/workflow-resume` | Reads `.workflow-state.yaml` directly |
| Copilot giving wrong answers | `/memory-context-hygiene` | Clears confused context |
| Long conversation (50+ messages) | `/memory-context-hygiene` | Prevents context overflow |

**Recovery Flow:**
```
Session lost?
├─ Have uncommitted work? → Commit first, then `/init-context`
├─ Already committed? → `/init-context` → say `resume`
└─ Copilot confused? → `/memory-context-hygiene` → `/workflow-resume`
```

**Multi-device workflow:**
```
Device A: Working on Phase 3
    ↓ commit + push
Device B: git pull → /init → resume → continue Phase 3
```

### Workflow Phase Prompts

> ⚠️ **Use explicit `/prompt-name`** to prevent phase skipping in long conversations.

| Prompt | Phase | Action |
|--------|-------|--------|
| `/work-intake` | Pre | Capture work description |
| `/work-review` | Pre | Review work readiness |
| `/work-update` | Any | Handle requirement changes |
| `/phase-0-analysis` | 0 | Start Analysis & Design |
| `/phase-1-spec` | 1 | Start Specification |
| `/spec-review` | 1 | Review spec quality |
| `/phase-2-tasks` | 2 | Start Task Planning |
| `/task-plan-review` | 2 | Review task plan quality |
| `/phase-3-impl T-XXX` | 3 | Plan specific task (shows approach first) |
| `/phase-3-impl next` | 3 | Plan next incomplete task |
| `/impl go` | 3 | Proceed with implementation |
| `/impl approved` | 3 | Mark task complete (manual review) |
| `/code-review T-XXX` | 3 | AI review for specific task |
| `/code-review` | 3 | AI review all completed tasks (batch) |
| `/code-fix-plan` | 3 | Plan fixes for ALL review findings |
| `/code-fix-plan T-XXX` | 3 | Plan fixes for specific task only |
| `/code-fix-apply` | 3 | Apply approved fixes |
| `/phase-4-tests` | 4 | Start Testing phase |
| `/test-verify` | 4 | Verify test coverage |
| `/phase-5-done` | 5 | Start Done Check |
| `/pr-description` | Post | Generate PR description |
| `/pr-notify-reviewers` | Post | Generate reviewer notification |

### Optional: Deep Dive (Hard Problems)

| Prompt | Action |
|--------|--------|
| `/deep-dive start phase:<0\|1\|2\|5>` | Start deep-dive session for a phase |
| `/deep-dive run <role>` | Run a perspective (architect, critic, security, strict) |
| `/deep-dive run custom:<name>` | Run custom role with user-defined focus |
| `/deep-dive add` | User adds their own analysis to session |
| `/deep-dive status` | Show session progress (turns, roles run) |
| `/deep-dive synthesize` | Generate consensus from all turns |
| `/deep-dive end` | Close session and save log |
| `/deep-dive end --discard` | Abort session without saving |

### Safety & Quality Commands

| Prompt | Action |
|--------|--------|
| `/workflow-resume` | Resume from saved state |
| `/rollback` | Undo implementation changes |
| `/lite-mode` | Start lite mode |
| `/memory-context-hygiene` | Clear confused state |
| `/strict-review` | Self-review before PR (critical reviewer) |
| `/strict-review <file>` | Review specific file |
| `/strict-review --pr` | Full PR review with hater prediction |

### ⚠️ Avoid These Commands (May Skip Phases)

| Risky | Use Instead |
|-------|-------------|
| ~~`approved`~~ | Explicit `/phase-X-xxx` |
| ~~`go`~~ | `/impl go` |
| ~~`continue`~~ | Explicit `/phase-X-xxx` |
| ~~`review`~~ | `/spec-review`, `/code-review T-XXX` |

---

## 📊 Workflow Phases

```
┌─────────────────────────────────────────────────────────────────────┐
│ SETUP (one-time): /setup-workspace                                  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ SESSION: /init → resume OR new work OR lite mode                    │
└──────────────────────────────────┬──────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ WORK INTAKE: /work-intake → /work-review → ⏸️ READY?                │
└──────────────────────────────────┬──────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ P0: /phase-0-analysis → analysis.md            → ⏸️ APPROVAL        │
├─────────────────────────────────────────────────────────────────────┤
│ P1: /phase-1-spec     → spec.md → [/spec-review]     → ⏸️ APPROVAL  │
├─────────────────────────────────────────────────────────────────────┤
│ P2: /phase-2-tasks    → tasks.md → [/task-plan-review] → ⏸️ APPROVAL│
├─────────────────────────────────────────────────────────────────────┤
│ P3: /phase-3-impl T-XXX (Two-Gate Model per task)                   │
│     ├─ GATE 1: Plan → /impl go                                      │
│     └─ GATE 2: /impl approved OR [/code-review] → [/code-fix-*]     │
├─────────────────────────────────────────────────────────────────────┤
│ P4: /phase-4-tests    → tests.md → [/test-verify]  → ⏸️ APPROVAL    │
├─────────────────────────────────────────────────────────────────────┤
│ P5: /phase-5-done     → done.md                → ⏸️ APPROVAL        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ POST: /pr-description → /pr-notify-reviewers → git push             │
└─────────────────────────────────────────────────────────────────────┘

[...] = Optional review prompts - use when quality check needed
```

### Phase Summary

| Phase | Name | Output | Gate | Review Prompt |
|-------|------|--------|------|---------------|
| 0 | Analysis & Design | `analysis.md` | ⏸️ Approval | - |
| 1 | Specification | `spec.md` | ⏸️ Approval | `/spec-review` |
| 2 | Task Planning | `tasks.md` | ⏸️ Approval | `/task-plan-review` |
| 3 | Implementation | `impl-log.md` | ⏸️ Two-Gate | `/code-review`, `/code-fix-*` |
| 4 | Testing | `tests.md` | ⏸️ Coverage ≥70% | `/test-verify` |
| 5 | Done Check | `done.md` | ⏸️ DoD verification | - |

---

## 🔧 Phase 3: Two-Gate Implementation

Phase 3 has **two gates** to prevent wrong implementations:

### Gate 1: Planning Approval

```
/phase-3-impl T-XXX
      ↓
[Copilot reads: state → tasks.md → impl-log.md → spec.md]
      ↓
[Shows: task summary + requirements + approach + files]
      ↓
⏸️ STOP: "Confirm approach? /impl go"
```

**Why?** Lets you verify the approach BEFORE code is written.

### Gate 2: Review Options

After implementation completes:

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/impl approved` | Already tested manually | Mark complete → next task |
| `/code-review T-XXX` | Want AI review for one task | Reviews task changes only |
| `/code-review` | Review multiple completed tasks | Batch review + lint/tsc/build |

### Recommended Workflows

**Workflow A: Manual Review + Batch Check** ⭐ Recommended
```
/phase-3-impl T-001 → /impl go → [manual test] → /impl approved
/phase-3-impl T-002 → /impl go → [manual test] → /impl approved
/phase-3-impl T-003 → /impl go → [manual test] → /impl approved
/code-review         ← Batch review T-001 to T-003 + lint/tsc/build
/phase-3-impl T-004 → /impl go → [manual test] → /impl approved
...
/code-review         ← Final batch review
/phase-4-tests
```
✅ Fast: No waiting for AI review per task
✅ Checkpoint: Review batches as you go
✅ Automated: Runs lint/typecheck/build to find hidden errors

**Workflow B: AI Review Per Task**
```
/phase-3-impl T-001 → /impl go → /code-review T-001
/phase-3-impl T-002 → /impl go → /code-review T-002
...
/phase-4-tests
```

**Workflow C: Hybrid**
```
/phase-3-impl T-001 → /impl go → /impl approved      # Simple task
/phase-3-impl T-002 → /impl go → /code-review T-002  # Complex task
/code-review         ← Batch checkpoint
...
```

### `/code-review` Modes Explained

| Mode | Trigger | Scope | When to Use |
|------|---------|-------|-------------|
| Single Task | `/code-review T-XXX` | Files from T-XXX only | Immediate feedback on one task |
| Batch Review | `/code-review` | All completed tasks vs base branch | Checkpoint or final review |

**Base Branch Configuration:**
- Stored in `.workflow-state.yaml` → `meta.base_branch`
- Default: `main`
- Can be: `master`, `develop`, `feature/parent-branch`, etc.
- Set during workflow init or update manually

---

## 📁 Project Structure

```
copilot-flow/
├── .github/
│   ├── copilot-instructions.md   # Entry point for Copilot
│   ├── prompts/                  # All workflow prompts
│   │   ├── init-context.prompt.md
│   │   ├── work-intake.prompt.md
│   │   ├── phase-0-analysis.prompt.md
│   │   ├── phase-1-spec.prompt.md
│   │   ├── phase-2-tasks.prompt.md
│   │   ├── phase-3-impl.prompt.md
│   │   ├── phase-4-tests.prompt.md
│   │   ├── phase-5-done.prompt.md
│   │   ├── code-review.prompt.md
│   │   └── ...
│   └── instructions/
│       └── shared/               # Master copies of shared instructions
│           ├── coding-practices.instructions.md
│           ├── typescript.instructions.md
│           └── testing.instructions.md
├── docs/
│   ├── workflow/
│   │   └── contract.md           # Full workflow contract
│   ├── templates/                # Phase document templates (v4.0)
│   │   ├── analysis.template.md
│   │   ├── spec.template.md
│   │   ├── tasks.template.md
│   │   ├── impl-log.template.md
│   │   ├── tests.template.md
│   │   └── done.template.md
│   └── runs/
│       └── <branch-slug>/        # Per-branch workflow docs
├── WORKSPACE_CONTEXT.md          # Multi-root workspace info
└── README.md                     # This file
```

---

## 📚 Guides

Detailed documentation is available in separate guides:

| Guide | Description |
|-------|-------------|
| ⭐ [Workflow Example](docs/guides/workflow-example.md) | **Complete end-to-end example** from setup to PR |
| [Setup Guide](docs/guides/setup.md) | Step-by-step workspace setup, configuration, verification |
| [Multilingual Guide](docs/guides/multilingual.md) | Why bilingual, format rules, adding new languages |
| [Deep Dive Guide](docs/guides/deep-dive/README.md) | Session-based multi-perspective analysis for Phase 0/1/2/5 (roles, commands, synthesis) |
| [Option B Runner (B2 Orchestrator)](docs/guides/b2/README.md) | External API runner details + disclaimer (not Copilot backend) |
| [Workflow Contract](docs/workflow/contract.md) | Full workflow rules and specifications |

### Quick Reference

**Shared Instructions:** `copilot-flow/.github/instructions/shared/` → synced to all roots

**Multi-Root Concepts:**
- `tooling_root`: Where prompts/templates live (always `copilot-flow`)
- `docs_root`: Where workflow docs go (per-feature, typically primary affected root)

**Bilingual Format (v4.0):** See [Multilingual Guide](docs/guides/multilingual.md)
```markdown
## 🇬🇧 Title / 🇻🇳 Tiêu đề

🇬🇧 English content.

🇻🇳 Vietnamese content.
```

**Workflow Artifacts:** `<docs_root>/docs/runs/<branch-slug>/`

---

## ⚙️ Configuration

### WORKSPACE_CONTEXT.md

```yaml
meta:
  tooling_root: copilot-flow       # Where prompts/templates live
  default_docs_root: apphub-vision # Default for workflow docs

roots:
  apphub-vision:
    type: monorepo
    pkg_manager: pnpm
    # ...
```

### .workflow-state.yaml

```yaml
meta:
  branch_slug: feature-add-analytics
  docs_root: apphub-vision
  tooling_root: copilot-flow
  affected_roots:
    - root: apphub-vision
      role: primary

status:
  current_phase: 3
  current_task: T-002
  last_action: "Completed T-001"
  next_action: "Implement T-002"

phases:
  phase_0_analysis:
    status: approved
  # ...
```

---

## 📋 Example: Full Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ You: /init                                                              │
│                                                                         │
│ Copilot: 📍 Session initialized                                         │
│          tooling_root: copilot-flow                                     │
│          No active workflow found. Describe your work.                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ You: Add GA4 tracking to dashboard                                      │
│                                                                         │
│ Copilot: ## 📋 Work Description                                         │
│          | Type | FEATURE |                                             │
│          | Title | Add Analytics Tracking |                             │
│                                                                         │
│          ### Missing Information ⚠️                                     │
│          1. Which events to track?                                      │
│          2. PII handling?                                               │
│                                                                         │
│ You: Track page views and clicks, anonymous only                        │
│                                                                         │
│ Copilot: ✅ Ready. Running /work-review...                              │
│          | Verdict | ✅ READY |                                         │
│          Say "approved" to proceed.                                     │
│                                                                         │
│ You: approved                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 0: Analysis                                           │
│          - Dashboard uses Next.js App Router                            │
│          - Recommend: gtag.js with custom hook                          │
│          ⏸️ STOP: Approve to proceed.                                   │
│                                                                         │
│ You: approved                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 1: Specification                                      │
│          FR-001: Initialize GA4 on app load                             │
│          FR-002: Track page views on navigation                         │
│          ⏸️ STOP: Approve to proceed.                                   │
│                                                                         │
│ You: approved                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 2: Task Planning                                      │
│          | ID | Task | Est |                                            │
│          | T-001 | Create analytics hook | 30m |                        │
│          | T-002 | Add GA script | 15m |                                │
│          ⏸️ STOP: Approve to start implementation.                      │
│                                                                         │
│ You: approved                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 3: Implementation                                     │
│          Planning T-001: Create analytics hook                          │
│          Approach: Create useAnalytics.ts with...                       │
│          ⏸️ GATE 1: /impl go to proceed                                 │
│                                                                         │
│ You: /impl go                                                           │
│                                                                         │
│ Copilot: ✅ Created apps/dashboard/src/hooks/useAnalytics.ts            │
│          ⏸️ GATE 2: /impl approved or /code-review T-001                │
│                                                                         │
│ You: /impl approved                                                     │
│                                                                         │
│ (repeat for T-002...)                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 4: Testing                                            │
│          Created tests. Run: pnpm test                                  │
│          ⏸️ STOP: Report results.                                       │
│                                                                         │
│ You: Tests pass, 85% coverage                                           │
│                                                                         │
│ Copilot: ✅ Proceeding to Phase 5.                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ Copilot: ## Phase 5: Done Check                                         │
│          - [x] All criteria met                                         │
│          - [x] Tests pass                                               │
│          ⏸️ STOP: Approve to generate PR.                               │
│                                                                         │
│ You: approved                                                           │
│                                                                         │
│ Copilot: 📄 Generated PR_DESCRIPTION.md                                 │
│          Ready to commit and push!                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "No workflow found" | Run `/init`, then describe work |
| "Phase X not approved" | Complete review, then approve |
| "Wrong root for docs" | Check `docs_root` in `.workflow-state.yaml` |
| Session lost | Run `/workflow-resume` to reload state |
| Copilot confused | Run `/memory-context-hygiene` or start new chat |
| Wrong implementation | Run `/rollback` to undo |

---

## ❓ FAQ

<details>
<summary><b>Q: What if requirements change mid-Phase 3?</b></summary>

Use `/work-update` to:
1. Document the change
2. Update spec.md → creates `spec-update-1.md`
3. Add new tasks → creates `tasks-update-1.md`
4. Continue with `/phase-3-impl T-XXX`

</details>

<details>
<summary><b>Q: Can I skip Phase 2 for small features?</b></summary>

Not recommended. Even small features benefit from task breakdown.
**Alternative:** Use `/lite-mode` for truly simple changes.

</details>

<details>
<summary><b>Q: How to handle urgent hotfix?</b></summary>

```
/lite-mode HOTFIX: fix critical login bug
```
Lite mode skips analysis/spec/tasks, goes straight to implementation.
Still tracks changes in `.workflow-state.yaml`.

</details>

<details>
<summary><b>Q: What if Copilot gets confused or stuck?</b></summary>

```
/memory-context-hygiene
```
Resets Copilot's context. Then `/workflow-resume` to continue from state.

</details>

<details>
<summary><b>Q: Can multiple people work on same workflow?</b></summary>

Yes. State is in `.workflow-state.yaml`.
- Person A: `/phase-3-impl T-001` → `/impl approved`
- Person B: `/workflow-resume` → `/phase-3-impl T-002`

Commit state file frequently to keep in sync.

</details>

<details>
<summary><b>Q: I switched to another computer, how to continue?</b></summary>

```bash
# On new device:
git pull                    # Get latest state file
code workspace.code-workspace
```
Then in Copilot:
```
/init-context
```
Copilot will detect existing workflow and ask if you want to resume.

</details>

<details>
<summary><b>Q: What's the difference between /init-context and /workflow-resume?</b></summary>

| Command | Does What |
|---------|----------|
| `//init-context` | Full initialization: loads WORKSPACE_CONTEXT.md, checks branch, finds workflow state, shows options |
| `/workflow-resume` | Direct resume: reads `.workflow-state.yaml` immediately, shows current phase |

**Use `/init-context`** at start of session (recommended).
**Use `/workflow-resume`** when you know workflow exists and want quick resume.

</details>

<details>
<summary><b>Q: When should I use /memory-context-hygiene?</b></summary>

Use when Copilot:
- Repeats itself or gives contradictory answers
- Forgets what phase you're in
- Suggests wrong files or approaches
- Conversation is very long (50+ messages)

After running `/memory-context-hygiene`, follow with `/workflow-resume` to reload state.

</details>

---

## 📚 References

| Document | Purpose |
|----------|---------|
| ⭐ [Workflow Example](docs/guides/workflow-example.md) | Complete end-to-end example |
| [Setup Guide](docs/guides/setup.md) | Detailed workspace setup |
| [Multilingual Guide](docs/guides/multilingual.md) | Bilingual format, adding languages |
| [Deep Dive Guide (Option A/B)](docs/guides/deep-dive/README.md) | Optional deep-dive flow + role definitions |
| [Option B Runner (B2 Orchestrator)](docs/guides/b2/README.md) | External runner + API disclaimer |
| [Workflow Contract](docs/workflow/contract.md) | Full rules and specifications |
| [Templates](docs/templates/) | Phase document templates (v4.0) |
| [Copilot Instructions](.github/copilot-instructions.md) | Entry point for Copilot |
| [WORKSPACE_CONTEXT.md](WORKSPACE_CONTEXT.md) | Multi-root workspace config |

---

## 🔒 Safety Rules

**Copilot MUST:**
- ✅ STOP after each phase for approval
- ✅ Update state after each action
- ✅ Show plan before implementation (Gate 1)
- ✅ Get templates from tooling_root

**Copilot MUST NOT:**
- ❌ Run git write operations (add, commit, push)
- ❌ Skip approval gates
- ❌ Implement multiple tasks at once
- ❌ Run tests automatically

---

## 🏷️ Version

| Item | Version |
|------|---------|
| Workflow | 2.0 |
| Template Format | 4.0 (Inline Bilingual with Visual Flags) |
| Last Updated | 2026-01-25 |

---

**Happy coding with Copilot! 🚀**
