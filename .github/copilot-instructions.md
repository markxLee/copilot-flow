# Copilot Workflow Instructions
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

This file is read automatically by GitHub Copilot.
It defines how Copilot MUST behave in this workspace.

---

## Session Continuity

```yaml
PROBLEM: AI has no memory between sessions
SOLUTION: Auto-detect workflow from WORKSPACE_CONTEXT.md + git branch

ON_EVERY_NEW_SESSION:
  1. READ WORKSPACE_CONTEXT.md:
     file: copilot-flow/WORKSPACE_CONTEXT.md
     extract: meta.default_docs_root
     
  2. GET current branch FROM default_docs_root:
     command: git -C <default_docs_root> rev-parse --abbrev-ref HEAD
     
  3. EXTRACT slug (strip prefix):
     prefixes: [feature/, bugfix/, hotfix/, fix/, feat/, chore/, refactor/]
     
  4. CHECK for existing workflow:
     path: "<default_docs_root>/docs/runs/<slug>/.workflow-state.yaml"
     
  5. IF EXISTS: READ state file and RESUME workflow
     IF NOT: ASK user to start new workflow
```

---

## Governed Workflow

This repository implements a **multi-phase governed workflow** for complex development tasks.

```yaml
COPILOT_MUST:
  - Follow workflow contract at docs/workflow/contract.md
  - Check for existing workflow state before starting new work
  - STOP for user approval at phase gates
  - Verify docs_root before creating ANY workflow artifacts

COPILOT_MUST_NOT:
  - Skip phases or approval gates
  - Create/switch git branches automatically
  - Write workflow docs outside docs/runs/<branch-slug>/
  - Start implementation without completing analysis
```

---

## Verify docs_root First

```yaml
CONCEPTS:
  tooling_root: Where prompts/templates live (STATIC: copilot-flow)
  docs_root: Where THIS feature's workflow docs go (PER-FEATURE)

VERIFICATION_STEPS:
  1. Check WORKSPACE_CONTEXT.md:
     - tooling_root -> copilot-flow
     - default_docs_root -> fallback for workflow docs
     
  2. Determine docs_root for this feature:
     - If resuming: read from .workflow-state.yaml -> meta.docs_root
     - If new workflow: ASK user where to store docs
     
  3. Store choice in .workflow-state.yaml -> meta.docs_root
  
  4. Path for workflow docs: <docs_root>/docs/runs/<branch-slug>/
```

---

## Cross-Root Awareness

```yaml
MANDATORY_CHECK:
  trigger:
    - Work mentions "migrate", "move", "copy" between roots
    - Work involves components from different roots
    - Work involves library -> app integration
    - Work involves API provider -> consumer
    - Any task touching files in multiple roots

  action:
    1. READ WORKSPACE_CONTEXT.md SECTION 9 (cross_root_workflows)
    2. Identify which pattern applies:
       - library_consumer: UI library -> app
       - shared_packages: package -> multiple apps
       - api_integration: backend -> frontend
    3. Follow documented workflow sequence
    4. Respect build order (multi_root_build_order)
    5. Use correct PR strategy (pr_strategies)

COPILOT_MUST:
  - Read Section 9 before cross-root work
  - Follow documented workflow steps in order
  - Check build dependencies
  - Verify import patterns match config

COPILOT_MUST_NOT:
  - Guess relationships between roots
  - Skip library rebuild when consumer needs it
  - Ignore documented workflow sequences
```

---

## Workflow Phases

| Phase | Name | Gate |
|-------|------|------|
| 0 | Analysis & Design | User approval required |
| 1 | Specification | User approval required |
| 2 | Task Planning | User approval required |
| 3 | Implementation | Per-task approval |
| 4 | Testing | User approval required |
| 5 | Done Check | Final approval |

---

## Key Files

| File | Purpose |
|------|---------|
| `WORKSPACE_CONTEXT.md` | Multi-root workspace info |
| `docs/workflow/contract.md` | Full workflow rules |
| `docs/templates/*.md` | Document templates |
| `docs/templates/workflow-state.template.yaml` | State tracking |
| `docs/runs/<branch-slug>/` | Active workflow artifacts |

---

## Commands Reference

### Workflow Commands
| Command | Action |
|---------|--------|
| `/cf-init` | Initialize session, load context |
| `/solo-orchestrator` | Auto-pick Lite vs Governed |
| `/lite-mode <desc>` | Start lite mode for simple tasks |
| `/workflow-resume` | Resume from saved state |
| `/workflow-status` | Show current workflow status |
| `/cf-context-reset` | Reset context if confused |

### Phase Commands
| Command | Action |
|---------|--------|
| `/work-intake` | Capture work description |
| `/work-review` | Review work readiness |
| `/phase-0-analysis` | Start Phase 0 |
| `/phase-1-spec` | Start Phase 1 |
| `/phase-2-tasks` | Start Phase 2 |
| `/phase-3-impl T-XXX` | Implement specific task |
| `/phase-3-impl next` | Implement next task |
| `/impl go` | Proceed after plan approved |
| `/phase-4-tests` | Start Phase 4 |
| `/phase-5-done` | Start Phase 5 |

### Review Commands
| Command | Action |
|---------|--------|
| `/verify-checks` | Run automated checks |
| `/code-review T-XXX` | Review specific task |
| `/code-review` | Batch review all completed |
| `/strict-review` | Brutal honest review |
| `/code-fix-plan` | Plan fixes for review findings |
| `/code-fix-apply` | Apply approved fixes |

### Setup Commands
| Command | Action |
|---------|--------|
| `/setup-workspace` | Run full setup |
| `/workspace-discovery` | Scan workspace, create WORKSPACE_CONTEXT.md |
| `/cross-root-guide` | Auto-config cross-root relationships |
| `/sync-instructions` | Sync shared instructions |

---

## Workflow Detection

```yaml
ON_CONVERSATION_START:
  1. Determine current git branch:
     command: git rev-parse --abbrev-ref HEAD
     
  2. Normalize to branch-slug:
     rule: lowercase, hyphens only, [a-z0-9-]
     
  3. Check for existing workflow:
     path: docs/runs/<branch-slug>/.workflow-state.yaml
     
  4. If exists: Load state, report status, ask to continue
     If not exists AND complex work: Ask if user wants to start workflow
```

### When to Use Workflow

```yaml
USE_GOVERNED_WORKFLOW:
  - Features spanning multiple files/components
  - Bug fixes requiring investigation
  - Refactoring with broad impact
  - Unclear requirements
  - Work affecting multiple workspace roots

USE_LITE_MODE:
  - Simple one-file edits
  - Bug fixes with clear cause
  - Small features (< 3 files)
  - Configuration changes

SKIP_WORKFLOW:
  - Quick questions/explanations
  - Code review comments
  - Documentation typo fixes
```

---

## Artifact Location

```yaml
WORKFLOW_DOCS_PATH: <docs_root>/docs/runs/<branch-slug>/
STRUCTURE:
  - .workflow-state.yaml    # State tracking
  - README.md               # Summary for reviewers
  - 00_analysis/            # Phase 0 docs
  - 01_spec/                # Phase 1 docs
  - 02_tasks/               # Phase 2 docs
  - 03_impl/                # Phase 3 docs
  - 04_tests/               # Phase 4 docs
  - 05_done/                # Phase 5 docs

docs_root: Determined per-feature (typically primary affected root)
```

---

## Tooling Root vs Docs Root

```yaml
tooling_root:
  definition: Root containing workflow TOOLING (prompts, templates)
  value: copilot-flow (STATIC)
  
docs_root:
  definition: Root where workflow DOCUMENTATION for a feature is stored
  value: PER-FEATURE (typically primary affected root)

WHY_SEPARATE:
  - Tooling stays centralized (easy to maintain)
  - Docs go with code (reviewers see docs + code in same PR)

RESOLUTION_ORDER:
  1. If resuming: .workflow-state.yaml -> meta.docs_root
  2. If new workflow: ASK user, suggest primary affected root
  3. Fallback: WORKSPACE_CONTEXT.md -> meta.default_docs_root
```

---

## Critical Rules

```yaml
RULES:
  1. Always update state after significant actions
  2. Never skip approval gates - STOP and wait
  3. Check blockers before proceeding
  4. Log decisions in state file for context continuity
  5. Use templates from tooling_root - don't create docs from scratch
```

---

## See Also

- [docs/workflow/contract.md](../docs/workflow/contract.md) - Full workflow rules
- [WORKSPACE_CONTEXT.md](../WORKSPACE_CONTEXT.md) - Workspace configuration
- [docs/templates/](../docs/templates/) - All document templates
- [docs/guides/command-reference.md](../docs/guides/command-reference.md) - Full command reference
- [docs/guides/troubleshooting.md](../docs/guides/troubleshooting.md) - Troubleshooting guide

---

**Contract Version:** 1.0
**Last Updated:** 2026-02-01
