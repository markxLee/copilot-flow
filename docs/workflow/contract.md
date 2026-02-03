# Copilot Workflow Contract — Multi-Root Workspace Edition

> **Version 1.0** — First Official Release. Governance-focused. Execution details are in individual phase prompts.

This contract defines the **mandatory governance rules** when using Copilot in a **multi-root workspace**.

---

## Core Principles

1. **Correctness over speed**
2. **Review gates at every phase**
3. **Cross-root awareness**
4. **Auditable documentation**
5. **Branch-scoped artifacts**

---

## Quick Rules Reference

> **One-stop lookup** — All MUST/MUST NOT rules in one place.

```yaml
COPILOT_MUST:
  workflow:
    - Follow phases in order (0 → 1 → 2 → 3 → 4 → 5)
    - STOP at every approval gate — wait for user
    - Update .workflow-state.yaml after significant actions
    - Read WORKSPACE_CONTEXT.md before cross-root work
    
  documentation:
    - Store workflow docs in: <docs_root>/docs/runs/<branch-slug>/
    - Use templates from: <tooling_root>/docs/templates/
    - Log all implementation in impl-log.md
    
  code:
    - Read root conventions before implementing
    - Follow root-specific error handling pattern
    - Review only diffs vs base_branch (diff-scoped discipline)
    
  multi_root:
    - Check Section 9 of WORKSPACE_CONTEXT.md for cross-root workflows
    - Follow documented build order
    - Respect sync type (immediate vs versioned)

COPILOT_MUST_NOT:
  workflow:
    - Skip phases or approval gates
    - Auto-create/switch git branches
    - Proceed without user approval at gates
    
  documentation:
    - Write workflow docs outside docs/runs/<branch-slug>/
    - Create docs from scratch — always use templates
    
  code:
    - Implement before Phase 0+1 approved
    - Guess cross-root relationships
    - Ignore root-specific conventions

PRIORITY_ORDER:  # When rules conflict
  1: User explicit instruction
  2: This contract (governance)
  3: Phase prompts (execution)
  4: WORKSPACE_CONTEXT.md (cross-root)
  5: Root copilot-instructions.md
  6: Conversation context
```

---

## Key Definitions

### Branch Slug
All artifacts stored under directory derived from git branch name.
- Command: `git rev-parse --abbrev-ref HEAD`
- Normalize: lowercase, hyphens only, `[a-z0-9-]`

### Work Unit
A single change set: feature, bugfix, refactor, docs, tests.
Each work unit follows ALL phases.

### Affected Roots
Workspace roots modified by this work unit. Identified in Phase 0.

### Tooling Root vs Docs Root
- **tooling_root**: Where prompts/templates live (static: `copilot-flow/`)
- **docs_root**: Where THIS feature's workflow docs go (per-feature, flexible)

→ See `WORKSPACE_CONTEXT.md` for configuration details.

---

## Templates Reference

| Phase | Template | Purpose |
|-------|----------|---------|
| 0 | [00_analysis.template.md](../templates/00_analysis.template.md) | Analysis & Design |
| 1 | [01_spec.template.md](../templates/01_spec.template.md) | Specification |
| 2 | [02_tasks.template.md](../templates/02_tasks.template.md) | Task Planning |
| 3 | [03_impl.template.md](../templates/03_impl.template.md) | Implementation Log |
| 4 | [04_tests.template.md](../templates/04_tests.template.md) | Test Plan & Log |
| 5 | [05_done.template.md](../templates/05_done.template.md) | Done Check & Release |
| State | [workflow-state.template.yaml](../templates/workflow-state.template.yaml) | Progress Tracking |

---

## State Management

### State File Location
```
<docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
```

### Purpose
- Track current phase and task
- Enable resume from any point
- Record decisions for AI continuity

### State Transitions
```
not-started ──▶ in-progress ──▶ awaiting-review ──▶ approved ──▶ (next phase)
                    │                  │
                    ▼                  ▼
                 blocked           feedback
                    │                  │
                    └──────────────────┘
```

→ Resume: Use `/workflow-resume` or say `resume`

---

## Artifact Layout

All workflow docs MUST live under:
```
<docs_root>/docs/runs/<branch-slug>/
├── README.md                # Summary for reviewers
├── .workflow-state.yaml     # State tracking
├── 00_analysis/             # Phase 0 outputs
├── 01_spec/                 # Phase 1 outputs
├── 02_tasks/                # Phase 2 outputs
├── 03_impl/                 # Phase 3 outputs
├── 04_tests/                # Phase 4 outputs
└── 05_done/                 # Phase 5 outputs
```

→ See templates for detailed structure per phase.

---

## Development Modes

```yaml
dev_mode:
  standard:
    description: "Traditional approach - tests after implementation"
    test_plan: "REQUIRED in Phase 2 (plan tests before impl)"
    phase_3: "Implementation only"
    phase_4: "Write tests (based on Test Plan) + Run + Verify coverage"
    
  tdd:
    description: "Test-Driven Development - tests before implementation"
    test_plan: "REQUIRED in Phase 2"
    phase_3: "For each task: Write failing test → Implement → Verify pass"
    phase_4: "Run full suite + Integration/E2E tests + Coverage validation"
```

**Mode Selection**: Asked during workflow initialization (`/init`).

---

## Phase Workflow Overview

### Standard Mode Flow
```
Phase 2 (Tasks) → Phase 3 (Impl) → Phase 4 (Write & Run Tests) → Phase 5
```

### TDD Mode Flow
```
Phase 2 (Tasks + Test Plan) → Phase 3 (Test → Impl → Verify) → Phase 4 (Validate) → Phase 5
```

### Detailed Flow
```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: ANALYSIS & DESIGN                                      │
│ Understand → Research → Design → Diagram                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: SPECIFICATION                                          │
│ Requirements → Cross-root impact → Edge cases                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: TASK PLANNING                                          │
│ Break down → Order by root → Test Plan (required for TDD)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: IMPLEMENTATION                                         │
│ Standard: Implement → Log → Review                              │
│ TDD: Write test (🔴) → Implement (🟢) → Refactor (🔵)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL (per task)
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: TESTING                                                │
│ Standard: Write tests → Run → Log results                       │
│ TDD: Run full suite → Integration tests → Verify coverage       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: DONE CHECK                                             │
│ Validate DoD → Quality gates → Release notes                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ ⏸️ USER APPROVAL
                         ✅ COMPLETE
```

### Phase Execution Details

| Phase | Prompt | Key Output |
|-------|--------|------------|
| 0 | [/phase-0-analysis](../../.github/prompts/phase-0-analysis.prompt.md) | solution-design.md, diagrams |
| 1 | [/phase-1-spec](../../.github/prompts/phase-1-spec.prompt.md) | spec.md, cross-root-impact.md |
| 2 | [/phase-2-tasks](../../.github/prompts/phase-2-tasks.prompt.md) | tasks.md, test-plan (TDD) |
| 3 | [/phase-3-impl](../../.github/prompts/phase-3-impl.prompt.md) | impl-log.md, code + tests (TDD) |
| 4 | [/phase-4-tests](../../.github/prompts/phase-4-tests.prompt.md) | test-log.md, coverage report |
| 5 | [/phase-5-done](../../.github/prompts/phase-5-done.prompt.md) | done-check.md, release-notes.md |

> **Note**: See individual prompts for detailed execution steps, YAML schemas, and STOP points.

---

## Non-Negotiable Rules

### Documentation Rules
- ✅ All workflow docs in `<docs_root>/docs/runs/<branch-slug>/`
- ✅ All templates from `<tooling_root>/docs/templates/`
- ✅ Update state file after every significant action

### Workflow Rules
- ❌ NO phase skipping
- ❌ NO implementation before Phase 0+1 approval
- ❌ NO auto git branch creation by Copilot

### Code Rules
- ✅ Cross-root awareness for every change
- ✅ Diff-scoped discipline (review only diffs vs base branch)
- ✅ Follow root-specific conventions from `WORKSPACE_CONTEXT.md`

---

## Multi-Root Rules

### Root Convention Compliance
Before implementing in any root:
1. Read root's conventions from `WORKSPACE_CONTEXT.md`
2. Follow error handling pattern for that root
3. Use correct import style for that root

### Cross-Root Changes
When changes span multiple roots:
1. Identify sync requirements (immediate vs versioned)
2. Plan build order per `WORKSPACE_CONTEXT.md`
3. Update all roots in correct sequence

### Package Updates
1. Update source package first
2. Build/publish if versioned
3. Update consumers
4. Verify all consumers work

---

## Conflict Resolution

Priority order (highest first):
1. **This contract** (governance rules)
2. **Phase prompts** (execution details)
3. **`WORKSPACE_CONTEXT.md`** (cross-root rules)
4. **Root-specific `copilot-instructions.md`**
5. **Conversation context**

---

## Quick Reference

### Workflow Commands
| Command | Action |
|---------|--------|
| `/cf-init` | Initialize session |
| `/solo-orchestrator` | Auto-pick Lite vs Governed |
| `/lite-mode <desc>` | Quick task (skip full workflow) |
| `/workflow-resume` | Resume from saved state |
| `/workflow-status` | Show current status |
| `/cf-context-reset` | Reset context if confused |

### Phase Commands
| Command | Action |
|---------|--------|
| `/work-intake` | Capture work description |
| `/work-review` | Review work readiness |
| `/phase-0-analysis` | Start Phase 0 |
| `/phase-1-spec` | Start Phase 1 |
| `/spec-review` | Review spec quality |
| `/phase-2-tasks` | Start Phase 2 |
| `/task-plan-review` | Review task plan |
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

### Approval Responses
| Response | Meaning |
|----------|---------|
| `approved` | Proceed to next phase |
| `revise: <feedback>` | Update current phase |
| `next` | Continue to next task (Phase 3) |
| `pause` | Stop implementation |

---

## See Also

- [copilot-instructions.md](../../.github/copilot-instructions.md) — Entry point instructions
- [cf-init.prompt.md](../../.github/prompts/cf-init.prompt.md) — Session initialization
- [WORKSPACE_CONTEXT.md](../../WORKSPACE_CONTEXT.md) — Workspace configuration
- [Templates](../templates/) — All document templates

---

**Contract Version**: 1.0  
**Last Updated**: 2026-02-01
