# Copilot Workflow Contract — Multi-Root Workspace Edition

This contract defines the mandatory delivery workflow when using Copilot in a **multi-root workspace**.

Designed for:
- Multi-repo/multi-root VS Code workspaces
- Complex features spanning multiple codebases
- Solutions requiring upfront analysis and design

Core principles:
- **Correctness** over speed
- **Review gates** at every phase
- **Cross-root awareness** for all changes
- **Auditable documentation** with diagrams
- **Branch-scoped artifacts** per root

---

## 0) Definitions

### Workspace Context
Before any work, Copilot MUST reference `WORKSPACE_CONTEXT.md` to understand:
- Available roots and their relationships
- Conventions per root
- Cross-root dependencies

If `WORKSPACE_CONTEXT.md` does not exist or is stale:
→ STOP and run `/setup-workspace` (or `/workspace-discovery` for partial setup)

**Setup Workspace** runs 4 steps:
1. Discovery → WORKSPACE_CONTEXT.md
2. Cross-root → Configure patterns
3. Sync instructions → Copy coding standards
4. Generate files → .code-workspace + ARCHITECTURE.md

### Branch Slug (MANDATORY)
All artifacts MUST be stored under a directory derived from the **current git branch name**.

Resolution:
1. `git rev-parse --abbrev-ref HEAD`
2. Normalize: lowercase, replace spaces/underscores with hyphens, keep only `[a-z0-9-]`

If branch cannot be determined → STOP and ask user

### Work Unit
A single requested change set: feature, bugfix, refactor, docs, tests.
Each work unit follows ALL phases below.

### Affected Roots
List of workspace roots that will be modified by this work unit.
MUST be identified in Phase 0.

### Tooling Root (tooling_root)
The root containing all workflow tooling: prompts, templates, shared instructions.
This is STATIC and does not change per-feature.

Resolution:
- Always: `copilot-flow/` (or `meta.tooling_root` in WORKSPACE_CONTEXT.md)

```yaml
# In WORKSPACE_CONTEXT.md
meta:
  tooling_root: copilot-flow  # Where prompts/templates live
```

### Docs Root (docs_root)
The root where workflow documentation for a specific feature is stored.
This is PER-FEATURE and can vary based on primary affected root.

Resolution order:
1. User choice when starting workflow (asked by Copilot)
2. `meta.default_docs_root` in `WORKSPACE_CONTEXT.md`
3. Primary affected root (where most code changes happen)

```yaml
# In WORKSPACE_CONTEXT.md
meta:
  default_docs_root: apphub-vision  # Default for new workflows

# In .workflow-state.yaml (per-feature)
meta:
  docs_root: apphub-vision  # This feature's docs location
```

**Why separate tooling vs docs?**
- **Tooling Root (static)**: Prompts, templates stay in one place
- **Docs Root (flexible)**: Workflow docs go with the code for better PR context
- Reviewers see docs + code changes in same PR
- No need for separate "docs PR"

---

## Templates Reference

All workflow documents MUST use the corresponding bilingual templates:

| Phase | Template | Purpose |
|-------|----------|---------|
| Phase 0 | [00_analysis.template.md](../templates/00_analysis.template.md) | Analysis & Solution Design |
| Phase 1 | [01_spec.template.md](../templates/01_spec.template.md) | Specification |
| Phase 2 | [02_tasks.template.md](../templates/02_tasks.template.md) | Task Planning |
| Phase 3 | [03_impl.template.md](../templates/03_impl.template.md) | Implementation Log |
| Phase 4 | [04_tests.template.md](../templates/04_tests.template.md) | Test Plan & Log |
| Phase 5 | [05_done.template.md](../templates/05_done.template.md) | Done Check & Release |
| State | [workflow-state.template.yaml](../templates/workflow-state.template.yaml) | Progress Tracking |

**Template Usage:**
1. Copy template to `docs/runs/<branch-slug>/` with appropriate naming
2. Fill in placeholders (marked with `<...>`)
3. Remove unused optional sections
4. Keep bilingual format for reviewability

---

## State Management (MANDATORY)

### State File
Every workflow MUST maintain a state file for resume capability:

```
<docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
```

### State File Purpose
- Track current phase and task
- Enable resume from any point
- Store checkpoints for mid-task recovery
- Record decisions and context for AI continuity
- Track changes per affected root

### Auto-Update Rules
Copilot MUST update state file after:
- Starting a new phase
- Completing a task
- Encountering a blocker
- Receiving user approval
- Making significant changes to any file

### Resume Workflow
To resume work, use the [workflow-resume.prompt.md](../../.github/prompts/workflow-resume.prompt.md) or say:
- `resume` / `tiếp tục`
- `status` / `trạng thái`
- `go` / `tiếp`

### State Transitions
```
not-started ──▶ in-progress ──▶ awaiting-review ──▶ approved ──▶ (next phase)
                    │                  │
                    ▼                  ▼
                 blocked           feedback
                    │                  │
                    ▼                  ▼
              (resolve) ◀──────── in-progress
```

---

## 1) Artifact Layout (MANDATORY)

All docs for the current work unit MUST live under:

```
<docs_root>/docs/runs/<branch-slug>/
```

Where `<docs_root>` is determined per-feature (typically the primary affected root).

### Branch Naming Convention
The branch should be created in the `<docs_root>` repository.
If changes span multiple roots, each root may have its own branch with same name.

### Required Structure

```
<docs_root>/
└── docs/
    └── runs/
        └── <branch-slug>/
            ├── README.md                # Quick summary for reviewers
            ├── 00_analysis/
            │   ├── request-analysis.md  # Problem understanding
            │   ├── solution-design.md   # Proposed solution
            │   ├── diagrams/            # Flowcharts, sequence diagrams
            │   │   ├── flow-overview.md
            │   │   ├── sequence-*.md
            │   │   └── architecture-*.md
            │   └── decision-log.md      # Why this solution
            ├── 01_spec/
            │   ├── spec.md              # Detailed specification
            │   └── cross-root-impact.md # Impact per root
            ├── 02_tasks/
            │   ├── tasks.md             # Task breakdown
            │   └── task-per-root/       # Tasks grouped by root
            │       ├── <root1>-tasks.md
            │       └── <root2>-tasks.md
            ├── 03_impl/
            │   ├── impl-log.md          # Implementation journal
            │   └── changes-per-root/    # Changes grouped by root
            │       ├── <root1>-changes.md
            │       └── <root2>-changes.md
            ├── 04_tests/
            │   ├── test-plan.md
            │   └── test-log.md
            └── 05_done/
                ├── done-check.md
                └── release-notes.md
```

### README.md for Reviewers

Every work unit MUST have a `README.md` at the branch-slug root:

```markdown
# <Feature/Task Name>

## Status: <phase-name> | <in-progress|awaiting-review|done>

## Summary
<1-2 sentence description>

## Affected Roots
| Root | Changes | PR Link |
|------|---------|---------|
| <root1> | <summary> | <link> |
| <root2> | <summary> | <link> |

## Quick Links
- [Analysis](./00_analysis/solution-design.md)
- [Spec](./01_spec/spec.md)
- [Tasks](./02_tasks/tasks.md)
- [Implementation Log](./03_impl/impl-log.md)
- [Release Notes](./05_done/release-notes.md)

## Review Checklist
- [ ] Analysis approved
- [ ] Spec approved
- [ ] Tasks approved
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Ready for merge
```

### Cross-Root PR Strategy

When changes span multiple roots (separate git repos):

```yaml
pr_strategy:
  # When docs_root == primary affected root (RECOMMENDED)
  # Code + docs in same PR for better context
  single_pr:
    repo: <docs_root>  # e.g., apphub-vision
    branch: <branch-slug>
    contains: Code changes + workflow docs (docs/runs/<branch>/)
    reviewers: [<team>]
    
  # When changes span multiple roots
  multi_pr:
    primary_pr:
      repo: <docs_root>  # Contains docs + primary code changes
      branch: <branch-slug>
      contains: Workflow docs + primary code changes
      
    secondary_prs:
      - repo: <other-root>
        branch: <branch-slug>
        contains: Code changes for other-root
        linked_to: primary_pr

  merge_order:
    1. Review all PRs together
    2. Merge primary_pr first (has docs)
    3. Merge secondary_prs in dependency order
```

---

## 2) Phase Workflow (STRICT)

Follow phases IN ORDER. STOP after each phase for user approval.

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: ANALYSIS & SOLUTION DESIGN                             │
│ Understand → Research → Design → Document → Diagram             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL]
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: SPECIFICATION                                          │
│ Detail requirements → Cross-root impact → Edge cases            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL]
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: TASK PLANNING                                          │
│ Break down → Order by root → Define contracts                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL]
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: IMPLEMENTATION                                         │
│ One task at a time → Log changes → Verify → STOP                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL per task]
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: TESTING                                                │
│ Write tests → Run → Log results → Fix failures                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL]
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: DONE CHECK                                             │
│ Validate DoD → Quality gates → Release notes                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [USER APPROVAL]
                         [COMPLETE]
```

---

## PHASE 0 — Analysis & Solution Design (NEW)

### Goal
- Deeply understand the request before any implementation
- Research existing code and patterns
- Design solution with clear rationale
- Document with diagrams for human review
- Identify all affected roots

### Sub-phases

#### 0.1 Request Analysis
```yaml
output: 00_analysis/request-analysis.md
content:
  problem_statement: <clear description of what user wants>
  
  context:
    current_behavior: <how it works now>
    desired_behavior: <how it should work>
    gap: <what's missing>
  
  clarifying_questions: 
    - <question 1>
    - <question 2>
  # ASK user these questions before proceeding
  
  assumptions:
    - <assumption 1>
    - <assumption 2>
  
  constraints:
    - <constraint 1>
    - <constraint 2>
  
  affected_roots:
    - root: <root-name>
      reason: <why this root is affected>
    - root: <root-name>
      reason: <why this root is affected>
```

#### 0.2 Solution Research
```yaml
research:
  existing_patterns:
    - location: <file-path>
      pattern: <description>
      applicable: <yes/no/partial>
  
  similar_implementations:
    - location: <file-path>
      description: <what it does>
      learnings: <what we can reuse>
  
  dependencies:
    - name: <package/module>
      purpose: <why needed>
      already_installed: <yes/no>
  
  cross_root_dependencies:
    - from: <root1>
      to: <root2>
      type: <relationship-type>
      impact: <what needs to change>
```

#### 0.3 Solution Design
```yaml
output: 00_analysis/solution-design.md
content:
  solution_overview: <1-2 paragraph description>
  
  approach:
    chosen: <approach name>
    rationale: <why this approach>
    alternatives_considered:
      - name: <alternative 1>
        pros: [<pro1>, <pro2>]
        cons: [<con1>, <con2>]
        rejected_because: <reason>
  
  components:
    - name: <component name>
      root: <which root>
      purpose: <what it does>
      inputs: [<input1>, <input2>]
      outputs: [<output1>, <output2>]
  
  data_flow:
    - step: 1
      action: <description>
      from: <component/root>
      to: <component/root>
  
  error_handling:
    - scenario: <error case>
      handling: <how to handle>
  
  rollback_plan: <how to undo if needed>
```

#### 0.4 Diagrams (For Human Review)
```yaml
output: 00_analysis/diagrams/
diagrams:
  - name: flow-overview.md
    type: flowchart
    purpose: Main execution flow
    format: mermaid  # Mermaid OK here - for HUMAN review, not AI
    
  - name: sequence-main.md
    type: sequence
    purpose: Component interactions
    format: mermaid
    
  - name: architecture-change.md
    type: architecture
    purpose: System changes visualization
    format: mermaid
```

**Diagram Templates:**

```markdown
# Flow Overview

## Current Flow
​```mermaid
flowchart TD
    A[Start] --> B[Current Step 1]
    B --> C[Current Step 2]
    C --> D[End]
​```

## Proposed Flow
​```mermaid
flowchart TD
    A[Start] --> B[Step 1]
    B --> C{Decision?}
    C -->|Yes| D[New Feature]
    C -->|No| E[Existing Path]
    D --> F[End]
    E --> F
​```

## Changes Highlighted
- Added: Decision point at C
- Added: New Feature component D
- Modified: Path from B
```

```markdown
# Sequence Diagram: <Feature Name>

​```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant A as API
    participant DB as Database
    
    U->>D: Action
    D->>A: Request
    A->>DB: Query
    DB-->>A: Result
    A-->>D: Response
    D-->>U: Display
​```
```

#### 0.5 Decision Log
```yaml
output: 00_analysis/decision-log.md
format: |
  # Decision Log
  
  ## Decision 1: <Title>
  - **Date**: <YYYY-MM-DD>
  - **Context**: <Why this decision was needed>
  - **Options Considered**:
    1. <Option A>: <pros/cons>
    2. <Option B>: <pros/cons>
  - **Decision**: <What was decided>
  - **Rationale**: <Why>
  - **Consequences**: <What this means going forward>
```

### Phase 0 Output Checklist

Before asking for approval:
- [ ] `request-analysis.md` complete
- [ ] All clarifying questions answered by user
- [ ] `solution-design.md` complete
- [ ] At least `flow-overview.md` diagram created
- [ ] `decision-log.md` has at least 1 entry
- [ ] All affected roots identified
- [ ] Cross-root dependencies mapped

### STOP Point
```
## ✅ Phase 0 Complete

### Summary
- Problem: <1-line summary>
- Solution: <1-line summary>
- Affected Roots: [<root1>, <root2>]
- Key Decisions: [<decision1>, <decision2>]

### Diagrams Created
- [flow-overview.md](./00_analysis/diagrams/flow-overview.md)
- [sequence-main.md](./00_analysis/diagrams/sequence-main.md)

### Ready for Phase 1?
Please review the analysis and diagrams, then reply:
- "approved" to proceed to Phase 1 (Specification)
- "revise: <feedback>" to update the analysis
```

---

## PHASE 1 — Specification

### Goal
- Translate solution design into detailed spec
- Document cross-root impact
- Define acceptance criteria
- List edge cases

### Outputs

#### spec.md
```yaml
output: 01_spec/spec.md
content:
  title: <feature name>
  version: "1.0"
  status: draft|approved
  
  overview:
    summary: <description>
    goals: [<goal1>, <goal2>]
    non_goals: [<non-goal1>, <non-goal2>]
  
  requirements:
    functional:
      - id: FR-001
        description: <requirement>
        priority: must|should|could
        acceptance_criteria:
          - <criterion 1>
          - <criterion 2>
    
    non_functional:
      - id: NFR-001
        description: <requirement>
        metric: <how to measure>
  
  edge_cases:
    - scenario: <description>
      expected_behavior: <what should happen>
  
  out_of_scope:
    - <item 1>
    - <item 2>
  
  dependencies:
    - <dependency 1>
    - <dependency 2>
```

#### cross-root-impact.md
```yaml
output: 01_spec/cross-root-impact.md
content:
  summary: <overview of cross-root changes>
  
  impact_per_root:
    <root-name>:
      changes_required:
        - type: <new|modify|delete>
          path: <file-path>
          description: <what changes>
      
      conventions_to_follow:
        - <convention from WORKSPACE_CONTEXT>
      
      build_impact:
        rebuild_required: <yes|no>
        build_order_position: <number>
      
      test_impact:
        new_tests: <number>
        modified_tests: <number>
  
  sync_requirements:
    - roots: [<root1>, <root2>]
      type: <immediate|versioned>
      reason: <why sync needed>
```

### STOP Point
```
## ✅ Phase 1 Complete

### Spec Summary
- Requirements: <N> functional, <M> non-functional
- Edge cases: <X> identified
- Cross-root impact: <list roots>

### Ready for Phase 2?
Reply "approved" or "revise: <feedback>"
```

---

## PHASE 2 — Task Planning

### Goal
- Break spec into executable tasks
- Group tasks by root
- Define execution order
- Specify contracts between tasks

### Outputs

#### tasks.md (Master List)
```yaml
output: 02_tasks/tasks.md
content:
  total_tasks: <number>
  estimated_effort: <time>
  execution_order: [T1, T2, T3, ...]
  
  tasks:
    - id: T1
      title: <task name>
      root: <which root>
      type: <new|modify|delete|test|doc>
      files:
        - path: <file-path>
          action: <create|modify|delete>
      dependencies: [<task-ids that must complete first>]
      verification: <how to verify done>
      done_criteria: <explicit done definition>
```

#### task-per-root/<root>-tasks.md
```yaml
output: 02_tasks/task-per-root/<root>-tasks.md
content:
  root: <root-name>
  conventions: <reference to WORKSPACE_CONTEXT>
  tasks:
    - id: T1
      # ... task details specific to this root
```

### STOP Point
```
## ✅ Phase 2 Complete

### Task Summary
| Root | Tasks | New Files | Modified Files |
|------|-------|-----------|----------------|
| <root1> | <N> | <X> | <Y> |

### Execution Order
1. T1: <title> (<root>)
2. T2: <title> (<root>)
...

### Ready for Phase 3?
Reply "approved" or "revise: <feedback>"
```

---

## PHASE 3 — Implementation

### Goal
- Execute ONE task at a time
- Log all changes
- Verify before proceeding
- STOP after each task

### Rules
1. **One task per response** - Never implement multiple tasks
2. **Log immediately** - Update impl-log.md after each change
3. **Verify** - Run verification steps before marking done
4. **No scope creep** - Don't add unplanned changes

### Outputs

#### impl-log.md
```yaml
output: 03_impl/impl-log.md
format: |
  # Implementation Log
  
  ## Task T1: <title>
  - **Started**: <timestamp>
  - **Root**: <root-name>
  - **Status**: in-progress|done|blocked
  
  ### Changes Made
  | File | Action | Description |
  |------|--------|-------------|
  | <path> | <create/modify/delete> | <what changed> |
  
  ### Verification
  - [ ] <verification step 1>
  - [ ] <verification step 2>
  
  ### Notes
  <any observations, issues encountered>
  
  ---
  
  ## Task T2: <title>
  ...
```

#### changes-per-root/<root>-changes.md
Track changes specific to each root for easier review.

### STOP Point (After Each Task)
```
## ✅ Task T<N> Complete

### Changes
| File | Action |
|------|--------|
| <path> | <action> |

### Verification Results
- [x] <step 1>: passed
- [x] <step 2>: passed

### Next Task
T<N+1>: <title> in <root>

Continue? Reply "next" or "pause"
```

---

## PHASE 4 — Testing

### Goal
- Write tests per spec requirements
- Run tests and log results
- Fix failures before proceeding

### Outputs

#### test-plan.md
```yaml
output: 04_tests/test-plan.md
content:
  strategy:
    unit_tests: <yes|no>
    integration_tests: <yes|no>
    e2e_tests: <yes|no>
  
  coverage_targets:
    - requirement: FR-001
      tests: [<test-name>]
  
  test_per_root:
    <root-name>:
      framework: <jest|vitest|pytest>
      location: <test file path>
      tests:
        - name: <test name>
          type: <unit|integration|e2e>
          covers: [<requirement-ids>]
```

#### test-log.md
```yaml
output: 04_tests/test-log.md
format: |
  # Test Log
  
  ## Run 1: <timestamp>
  
  ### Results
  | Test | Status | Duration |
  |------|--------|----------|
  | <name> | pass/fail | <time> |
  
  ### Failures
  - **Test**: <name>
    - **Error**: <message>
    - **Fix**: <what was done>
  
  ### Coverage
  - Statements: <X>%
  - Branches: <Y>%
```

### STOP Point
```
## ✅ Phase 4 Complete

### Test Results
- Total: <N>
- Passed: <X>
- Failed: <Y>
- Coverage: <Z>%

### Ready for Phase 5?
Reply "approved" or "fix: <issue>"
```

---

## PHASE 5 — Done Check

### Goal
- Validate Definition of Done
- Ensure all artifacts exist
- Quality gates pass
- Generate release notes

### Outputs

#### done-check.md
```yaml
output: 05_done/done-check.md
content:
  checklist:
    artifacts:
      - item: "00_analysis complete"
        status: <pass|fail>
      - item: "01_spec complete"
        status: <pass|fail>
      # ... all required artifacts
    
    quality:
      - item: "TypeScript compiles"
        status: <pass|fail>
        command: "<command run>"
      - item: "Lint passes"
        status: <pass|fail>
      - item: "Tests pass"
        status: <pass|fail>
    
    cross_root:
      - item: "All affected roots updated"
        status: <pass|fail>
      - item: "Sync requirements met"
        status: <pass|fail>
  
  summary:
    total_checks: <N>
    passed: <X>
    failed: <Y>
    ready_for_release: <yes|no>
```

#### release-notes.md
```yaml
output: 05_done/release-notes.md
format: |
  # Release Notes: <feature-name>
  
  ## Summary
  <1-2 sentence description>
  
  ## Changes
  ### <root-name>
  - <change 1>
  - <change 2>
  
  ## Breaking Changes
  - <if any>
  
  ## Migration Required
  - <if any>
  
  ## Related
  - Spec: [spec.md](../01_spec/spec.md)
  - Tasks: [tasks.md](../02_tasks/tasks.md)
```

### STOP Point
```
## ✅ Phase 5 Complete

### Done Check Results
- All artifacts: ✅
- Quality gates: ✅
- Cross-root sync: ✅

### Release Notes
[View release-notes.md](./05_done/release-notes.md)

### PRs Created
| Root | PR Link | Status |
|------|---------|--------|
| <docs_root> | <link> | Ready for review |
| <other-root> | <link> | Ready for review |

### Next Steps
- [ ] Push docs_root branch with docs + code
- [ ] Create PRs for secondary roots (if any)
- [ ] Link all PRs together
- [ ] Request review
- [ ] Merge in order: docs_root → secondary roots

Work unit complete! 🎉
```

---

## 3) Non-Negotiable Rules

### Docs Root for Workflow Docs
All workflow artifacts MUST be stored in the designated `docs_root`.
- Per-feature choice (typically primary affected root)
- Fallback: `WORKSPACE_CONTEXT.md` → `meta.default_docs_root`
- Templates from: `tooling_root` (copilot-flow)
- Enables docs + code in same PR

### Templates from Tooling Root
All templates and prompts MUST come from `tooling_root`.
- Always: `copilot-flow/docs/templates/`
- Never copy templates to other roots

### No Auto Branch Creation
Copilot MUST NOT create git branches automatically.

### Branch-scoped Docs
All docs MUST live under `<docs_root>/docs/runs/<branch-slug>/`

### No Phase Skipping
Copilot MUST NOT skip phases or gates.

### No Implementation Before Approval
No code changes before Phase 0 and Phase 1 approvals.

### Cross-Root Awareness
Every change MUST consider impact on related roots per `WORKSPACE_CONTEXT.md`.

### Diff-scoped Discipline
When reviewing or fixing code, refer only to diffs vs main.

---

## 4) Multi-Root Specific Rules

### Root Convention Compliance
Before implementing in any root:
1. Read root's conventions from `WORKSPACE_CONTEXT.md`
2. Follow error handling pattern for that root
3. Use correct import style for that root
4. Run root-specific quality checks

### Cross-Root Changes
When changes span multiple roots:
1. Identify sync requirements (immediate vs versioned)
2. Plan build order
3. Update all roots in correct sequence
4. Verify cross-root integration

### Package Updates
When updating shared packages:
1. Update source package first
2. Build/publish if versioned
3. Update consumers
4. Verify all consumers work

---

## 5) Next Step Recommendations

At the end of every phase, recommend next action:

| After Phase | Recommend |
|-------------|-----------|
| Phase 0 | "Reply 'approved' to proceed to Phase 1 (Specification)" |
| Phase 1 | "Reply 'approved' to proceed to Phase 2 (Task Planning)" |
| Phase 2 | "Reply 'approved' to proceed to Phase 3 (Implementation)" |
| Each Task | "Reply 'next' to continue or 'pause' to stop" |
| Phase 4 | "Reply 'approved' to proceed to Phase 5 (Done Check)" |
| Phase 5 | "Work complete! Ready for PR/merge" |

---

## 6) Conflict Resolution

Priority order:
1. This contract
2. `WORKSPACE_CONTEXT.md` (for cross-root rules)
3. Root-specific `copilot-instructions.md`
4. Conversation context

---

## 7) Quick Reference

### Phase Summary
| Phase | Focus | Key Output |
|-------|-------|------------|
| 0 | Analysis & Design | Diagrams, decision log |
| 1 | Specification | Spec, cross-root impact |
| 2 | Task Planning | Tasks per root |
| 3 | Implementation | Code changes, impl log |
| 4 | Testing | Tests, test log |
| 5 | Done Check | Validation, release notes |

### Approval Commands
- `approved` - Proceed to next phase
- `revise: <feedback>` - Update current phase
- `next` - Continue to next task (Phase 3)
- `pause` - Stop implementation
- `skip-tests` - Skip Phase 4 (requires explicit approval)
