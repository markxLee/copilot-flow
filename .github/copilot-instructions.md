# Copilot Workflow Instructions

> This file is read automatically by GitHub Copilot.
> It defines how Copilot MUST behave in this workspace.

---

## 🚀 Session Start - Run Init First

**On EVERY new conversation**, Copilot SHOULD:
1. Run [init-context.prompt.md](.github/prompts/init-context.prompt.md)
2. Or wait for user to say `init` / `start` / `resume`

This ensures:
- Workspace context is loaded
- `tooling_root` verified (where prompts/templates live)
- `docs_root` determined (where THIS feature's docs go)
- Existing workflow state is detected
- Session can resume seamlessly

---

## 🎯 This Workspace Uses Governed Workflow

This repository (`copilot-flow`) implements a **multi-phase governed workflow** for complex development tasks.

**Copilot MUST:**
1. Follow the workflow contract at [docs/workflow/contract.md](docs/workflow/contract.md)
2. Check for existing workflow state before starting new work
3. Use bilingual templates for all documentation
4. STOP for user approval at phase gates
5. **ALWAYS verify docs_root before creating ANY workflow artifacts**

**Copilot MUST NOT:**
- Skip phases or approval gates
- Create/switch git branches automatically
- Write workflow docs outside `docs/runs/<branch-slug>/`
- Start implementation without completing analysis
- **Create workflow docs in wrong root** - always use docs_root

---

## ⚠️ CRITICAL: Verify docs_root First

Before creating ANY workflow file, Copilot MUST:

```yaml
# Two separate concepts:
# - tooling_root: Where prompts, templates, instructions live (STATIC - always copilot-flow)
# - docs_root: Where THIS feature's workflow docs go (PER-FEATURE - flexible)

verification_steps:
  1. Check WORKSPACE_CONTEXT.md:
     - tooling_root → copilot-flow (for prompts/templates)
     - default_docs_root → fallback for workflow docs
     
  2. Determine docs_root for this feature:
     a. If resuming: read from .workflow-state.yaml → meta.docs_root
     b. If new workflow: ASK user where to store docs
        - Suggest: primary affected root (code + docs in same PR)
        - Alternative: default_docs_root from WORKSPACE_CONTEXT.md
     
  3. Store choice in .workflow-state.yaml → meta.docs_root
  
  4. Path for workflow docs:
     <docs_root>/docs/runs/<branch-slug>/
```

**Example Check:**
```
User requests feature work affecting apphub-vision

Copilot:
1. tooling_root: copilot-flow (prompts/templates)
2. Ask: "Where should workflow docs live?"
   - Recommend: apphub-vision (code + docs in same PR)
3. User confirms: apphub-vision
4. Workflow docs → apphub-vision/docs/runs/<branch>/
5. Code changes → apphub-vision/
6. Templates from → copilot-flow/docs/templates/
```

---

## 🔗 CRITICAL: Cross-Root Awareness (ALWAYS CHECK)

**Before ANY work that involves multiple roots or migration between roots:**

```yaml
MANDATORY_CHECK:
  trigger:
    - Work mentions "migrate", "move", "copy" between roots
    - Work involves components from different roots
    - Work mentions library → app integration (e.g., storybook → dashboard)
    - Work involves API provider → consumer
    - Any task touching files in multiple roots

  action:
    1. READ WORKSPACE_CONTEXT.md SECTION 9 (cross_root_workflows)
    2. Identify which pattern applies:
       - library_consumer: UI library → app
       - shared_packages: package → multiple apps
       - api_integration: backend → frontend
    3. Follow the documented workflow sequence
    4. Respect build order (multi_root_build_order)
    5. Use correct PR strategy (pr_strategies)

  example:
    request: "Migrate Button component from storybook to dashboard"
    
    MUST check:
    - reviews-assets.ui_library_path → "public/documentation/ui-library/"
    - library_consumer.workflow → build library → update consumer
    - multi_root_build_order → reviews-assets first, then apphub-vision
    
    MUST NOT:
    - Ignore build dependencies
    - Copy code without checking import patterns
    - Skip library rebuild after changes
```

**Key Cross-Root Patterns in WORKSPACE_CONTEXT.md:**

| Pattern | Source | Target | Key Config |
|---------|--------|--------|------------|
| `library_consumer` | reviews-assets | apphub-vision | @apphubdev/clearer-ui |
| `shared_packages` | packages/* | apps/* | @clearer/* |
| `api_integration` | boost-pfs-backend | apphub-vision | api.config.json |

**Copilot MUST:**
- ✅ Read Section 9 before cross-root work
- ✅ Follow documented workflow steps in order
- ✅ Check build dependencies
- ✅ Verify import patterns match config

**Copilot MUST NOT:**
- ❌ Guess relationships between roots
- ❌ Skip library rebuild when consumer needs it
- ❌ Ignore documented workflow sequences
- ❌ Mix up source/target roots

---

## �📋 Quick Reference

### Workflow Phases
| Phase | Name | Gate |
|-------|------|------|
| 0 | Analysis & Design | ⏸️ User approval required |
| 1 | Specification | ⏸️ User approval required |
| 2 | Task Planning | ⏸️ User approval required |
| 3 | Implementation | ⏸️ Per-task approval |
| 4 | Testing | ⏸️ User approval required |
| 5 | Done Check | ⏸️ Final approval |

### Key Files
| File | Purpose |
|------|---------|
| `WORKSPACE_CONTEXT.md` | Multi-root workspace info |
| `docs/workflow/contract.md` | Full workflow rules |
| `docs/templates/*.md` | Bilingual document templates |
| `docs/templates/workflow-state.template.yaml` | State tracking |
| `docs/runs/<branch-slug>/` | Active workflow artifacts |

### Quick Commands — EXPLICIT PROMPT REFERENCES (Recommended)

**⚠️ IMPORTANT:** Use explicit `/prompt-name` to prevent phase skipping in long conversations.

| Prompt Reference | Action |
|------------------|--------|
| `/work-intake` | Capture work description |
| `/work-review` | Review work readiness |
| `/work-update` | Handle requirement changes & iterations |
| `/phase-0-analysis` | Start Phase 0: Analysis |
| `/phase-1-spec` | Start Phase 1: Specification |
| `/spec-review` | Review spec quality |
| `/phase-2-tasks` | Start Phase 2: Task Planning |
| `/task-plan-review` | Review task plan quality |
| `/phase-3-impl T-XXX` | Plan specific task (shows approach first) |
| `/phase-3-impl next` | Plan next task (shows approach first) |
| `/impl go` | Proceed with implementation after plan approved |
| `/impl approved` | Mark complete after manual review (skip AI review) |
| `/code-review T-XXX` | Review task changes (AI review) |
| `/code-review` | Batch review all completed tasks |
| `/code-fix-plan` | Plan fixes for ALL review findings |
| `/code-fix-apply` | Apply approved fixes |
| `/phase-4-tests` | Start Phase 4: Testing |
| `/test-verify` | Verify test coverage & quality |
| `/phase-5-done` | Start Phase 5: Done Check |
| `/pr-description` | Generate PR description |
| `/pr-notify-reviewers` | Generate reviewer notification |
| `/workflow-resume` | Resume from saved state |
| `/rollback` | Undo implementation changes |
| `/lite-mode` | Start lite mode for simple tasks |

### Session Commands (Explicit Prompts)
| Prompt | Action |
|--------|--------|
| `/init` | Initialize session, load context |
| `/workflow-resume` | Continue from saved state |
| `/workflow-status` | Show current workflow status |
| `/quick-ref` | Show quick reference card |
| `/lite-mode <desc>` | Start lite mode for simple tasks |
| `/rollback` | Undo implementation changes |
| `/memory-context-hygiene` | Clear confused state |

### Setup Commands (Explicit Prompts)
| Prompt | Action |
|--------|--------|
| `/setup-workspace` | Run full setup (discovery → cross-root → sync → generate) |
| `/workspace-discovery` | Scan workspace and create WORKSPACE_CONTEXT.md |
| `/cross-root-guide` | Auto-config & save cross-root relationships |
| `/sync-instructions` | Sync shared instructions + detect tech stacks |
| `/sync-instructions-to <root>` | Sync to specific root only |
| `/suggest-instructions` | Analyze tech stacks & suggest missing instructions |
| `/sync-vscode-settings` | Sync VS Code settings to all roots |
| `/generate-workspace-file` | Generate .code-workspace from context |
| `/generate-architecture` | Generate ARCHITECTURE.md from context |

---

## 🚀 Workflow Detection

### On Every Conversation Start

```yaml
check_sequence:
  1. Determine current git branch:
     command: git rev-parse --abbrev-ref HEAD
     
  2. Normalize to branch-slug:
     rule: lowercase, hyphens only, [a-z0-9-]
     
  3. Check for existing workflow:
     path: docs/runs/<branch-slug>/.workflow-state.yaml
     
  4. If exists:
     action: Load state, report status, ask to continue
     
  5. If not exists AND user requests complex work:
     action: Ask if user wants to start workflow
```

### When to Use Workflow

**USE workflow for:**
- Features spanning multiple files/components
- Bug fixes requiring investigation
- Refactoring with broad impact
- Any request with unclear requirements
- Work affecting multiple workspace roots

**USE lite mode for:**
- Simple one-file edits
- Bug fixes with clear cause
- Small features (< 3 files)
- Configuration changes
- Say: `lite: <description>`

**SKIP workflow for:**
- Quick questions/explanations
- Code review comments
- Documentation typo fixes

When in doubt, ASK: "This seems complex. Should I use the governed workflow?"

---

## 📁 Artifact Location

All workflow documents go in `<docs_root>/docs/runs/<branch-slug>/`:
```
<docs_root>/docs/runs/<branch-slug>/
├── .workflow-state.yaml    # State tracking (YAML)
├── README.md               # Summary for reviewers
├── 00_analysis/            # Phase 0 docs
├── 01_spec/                # Phase 1 docs
├── 02_tasks/               # Phase 2 docs
├── 03_impl/                # Phase 3 docs
├── 04_tests/               # Phase 4 docs
└── 05_done/                # Phase 5 docs
```

Where `docs_root` is determined per-feature (typically the primary affected root).

---

## 🌐 Multi-Root Workspace

If this is part of a multi-root VS Code workspace:

1. Check `WORKSPACE_CONTEXT.md` for:
   - List of roots and relationships
   - `tooling_root` (where prompts/templates live)
   - `default_docs_root` (fallback for workflow docs)
   - Cross-root dependencies

2. Two key concepts:
   - `tooling_root` (`copilot-flow`): Static, contains prompts/templates
   - `docs_root` (per-feature): Where workflow docs for THIS feature go

3. Track affected roots in state file

---

## 🏠 Tooling Root vs Docs Root

### What is tooling_root?
The root containing all workflow TOOLING (prompts, templates, instructions).
This is STATIC and always the same: `copilot-flow/`

### What is docs_root?
The root where workflow DOCUMENTATION for a specific feature is stored.
This is PER-FEATURE and typically matches the primary affected root.

### Why separate?
- **Tooling stays centralized** - easy to maintain, version, share
- **Docs go with code** - reviewers see docs + code in same PR
- **Better context** - no need for separate "docs-only" PR

### Resolution Order (for docs_root)
```yaml
1. If resuming: .workflow-state.yaml → meta.docs_root
2. If new workflow: ASK user, suggest primary affected root
3. Fallback: WORKSPACE_CONTEXT.md → meta.default_docs_root
```

### In This Workspace
```yaml
tooling_root: copilot-flow              # Static - prompts, templates
default_docs_root: apphub-vision        # Default for new workflows

# Example for a feature affecting apphub-vision:
docs_root: apphub-vision                # Chosen for this feature
docs_path: apphub-vision/docs/runs/<branch-slug>/
```

### Cross-Root Changes
When changes span multiple roots:
```yaml
tooling_root (copilot-flow):
  - Prompts, templates (read-only during workflow)
  - Shared instructions

docs_root (e.g., apphub-vision):
  - Workflow docs for THIS feature
  - State file
  - PR includes both docs + code changes

other_roots (e.g., reviews-assets):
  - Code changes only
  - Separate PR if needed
```

---

## 📝 Documentation Standards

### Language
- Templates: Bilingual inline format (`EN: ... / VI: ...`)
- User-facing docs: Follow `user_preferences.language` in state
- Default: Both English and Vietnamese

### Format
- Workflow docs: Markdown (human + AI readable)
- State file: YAML (AI-optimized)
- Diagrams: Mermaid (for human review in Phase 0 only)

---

## ⚠️ Critical Rules

1. **Always update state** after significant actions
2. **Never skip approval gates** - STOP and wait
3. **Check blockers** before proceeding
4. **Log decisions** in state file for context continuity
5. **Use templates** from tooling_root - don't create docs from scratch

---

## 🔗 Related Prompts

| Prompt | Purpose |
|--------|---------|
| `.github/prompts/init-context.prompt.md` | Initialize session context |
| `.github/prompts/work-intake.prompt.md` | Capture work description |
| `.github/prompts/work-update.prompt.md` | Handle requirement changes & iterations |
| `.github/prompts/work-review.prompt.md` | Review readiness gate |
| `.github/prompts/phase-0-analysis.prompt.md` | Phase 0: Analysis & Design |
| `.github/prompts/phase-1-spec.prompt.md` | Phase 1: Specification |
| `.github/prompts/spec-review.prompt.md` | Phase 1: Spec quality review |
| `.github/prompts/phase-2-tasks.prompt.md` | Phase 2: Task Planning |
| `.github/prompts/task-plan-review.prompt.md` | Phase 2: Task plan quality review |
| `.github/prompts/phase-3-impl.prompt.md` | Phase 3: Implementation (per-task) |
| `.github/prompts/code-review.prompt.md` | Phase 3: Code review for task |
| `.github/prompts/code-fix-plan.prompt.md` | Phase 3: Fix plan for review issues |
| `.github/prompts/code-fix-apply.prompt.md` | Phase 3: Apply approved fixes |
| `.github/prompts/phase-4-tests.prompt.md` | Phase 4: Test implementation |
| `.github/prompts/test-verify.prompt.md` | Phase 4: Test verification gate |
| `.github/prompts/phase-5-done.prompt.md` | Phase 5: Done check & release prep |
| `.github/prompts/pr-description.prompt.md` | Generate PR description file |
| `.github/prompts/pr-notify-reviewers.prompt.md` | Friendly message to notify reviewers |
| `.github/prompts/workflow-resume.prompt.md` | Resume from saved state |
| `.github/prompts/memory-context-hygiene.prompt.md` | Reset context when confused |
| `.github/prompts/workspace-update-root.prompt.md` | Update workspace context |
| `.github/prompts/cross-root-guide.prompt.md` | **Auto-config & SAVE cross-root relationships** |
| `.github/prompts/sync-instructions.prompt.md` | **Sync shared instructions to all roots** |
| `.github/prompts/quick-ref.prompt.md` | Quick reference card / cheat sheet |
| `.github/prompts/rollback.prompt.md` | Undo implementation changes |
| `.github/prompts/lite-mode.prompt.md` | Streamlined workflow for simple tasks |

---

## Example Interaction

```
User: Add analytics tracking to the dashboard

Copilot: 
## 📍 Session Context
| Impl Root | copilot-flow |
| Branch | feature-add-analytics |
| Workflow | None (starting new) |

## ✅ Workflow Initialized

## 📋 Work Description (work-intake)

### Summary
| Work Type | FEATURE |
| Title | Add Analytics Tracking |
| Affected Roots | apphub-vision |

### Problem / Request
Track user behavior on dashboard...

### Missing Information
1. Which analytics provider?
2. Which events to track?

Please answer these questions.

---

User: Use GA4, track page views and button clicks

Copilot:
## 🔍 Work Review (work-review)

| Verdict | ✅ READY |
| Confidence | High |

### Acceptance Criteria
- [ ] GA4 integration configured
- [ ] Page view events sent
- [ ] Button click events tracked

Ready to proceed to Analysis & Design.
Reply `approved` to continue.

Please answer these questions before I continue.
```

---

**Contract Version:** 2.0 (Multi-Root + State Management)
**Last Updated:** 2026-01-23
