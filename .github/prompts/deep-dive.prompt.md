# Deep Dive — Multi-Perspective Analysis Session
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

> **Triggers**: `/deep-dive`, `deep dive`, `think through`, `analyze from multiple perspectives`
> **Phases**: 0 (Analysis), 1 (Spec), 2 (Task Plan), 5 (Done Check)
> **Purpose**: User-controlled collaborative session with multiple analysis roles

---

## Overview

Deep Dive is a **user-controlled collaborative session** where you run multiple analysis perspectives (roles) to explore a problem. Unlike fixed pipelines, the user decides:

- Which role to run each turn
- How many turns to run
- When to add their own analysis
- When to synthesize findings

All turns append to a single session log file for full context.

---

## When to Use (and When NOT)

```yaml
use_deep_dive_when:
  - Complex problem with multiple concerns (security, perf, UX)
  - Unclear requirements needing exploration
  - High-risk changes requiring multiple perspectives
  - Disagreement or uncertainty about approach
  - Cross-cutting concerns spanning multiple systems

skip_deep_dive_when:
  - Simple, well-understood task
  - Clear requirements, obvious solution
  - Single file change or bug fix
  - Just need one perspective (ask directly instead)
  - Time-critical hotfix (use /lite-mode)
```

---

## Error Handling

```yaml
error_cases:
  run_without_start:
    trigger: "/deep-dive run <role>" before "/deep-dive start"
    response: "No active session. Run `/deep-dive start phase:<N>` first."

  invalid_phase:
    trigger: "/deep-dive start phase:3" (unsupported phase)
    response: "Phase 3 (impl) doesn't support deep-dive. Use phases 0, 1, 2, or 5."

  session_already_active:
    trigger: "/deep-dive start" when session exists
    response: "Session already active. Run `/deep-dive end` first or `/deep-dive status` to check."

  synthesis_disagreement:
    trigger: User disagrees with synthesis
    response: "Run more roles or `/deep-dive add` your perspective, then `/deep-dive synthesize` again."

  abort_session:
    trigger: User wants to cancel
    command: "/deep-dive end --discard"
    response: "Session discarded. No changes saved."

  missing_context:
    trigger: Required phase artifacts not found
    response: "Missing required input: <file>. Complete phase <N-1> first."
```

---

## Session Commands

```yaml
commands:
  /deep-dive start:
    args: [phase:<0|1|2|5>]
    creates: docs/runs/<branch-slug>/deep-dive-<timestamp>.md
    example: "/deep-dive start phase:0"

  /deep-dive run <role>:
    roles: [architect, critic, security, strict, custom:<role-name>]
    appends_to: current session log
    example: "/deep-dive run architect"

  /deep-dive add:
    purpose: User contributes own perspective
    format: User writes analysis after command, Copilot appends to log
    example: "/deep-dive add"

  /deep-dive status:
    shows: turns completed, roles used, pending questions
    example: "/deep-dive status"

  /deep-dive synthesize:
    purpose: Consensus summary of all turns
    output: Decision + rationale + action items
    example: "/deep-dive synthesize"

  /deep-dive end:
    purpose: Close session, update workflow state
    example: "/deep-dive end"
```

---

## Session Flow

```
User: /deep-dive start phase:0
  → Copilot creates session log, loads problem context

User: /deep-dive run architect
  → Copilot runs Architect role, appends to log

User: /deep-dive run critic
  → Copilot runs Critic role, appends to log

User: /deep-dive add
  → User writes own perspective
  → Copilot appends user's contribution to log

User: /deep-dive run security
  → Copilot runs Security role, appends to log

User: /deep-dive synthesize
  → Copilot generates consensus from all turns

User: /deep-dive end
  → Session closed, state updated
```

---

## Available Roles

| Role | Strength | When to Use |
|------|----------|-------------|
| `architect` | Technical design, components, tradeoffs | Need structure and approaches |
| `critic` | Find flaws, edge cases, risks | Stress-test a proposal |
| `security` | Threats, mitigations, compliance | Security-sensitive features |
| `strict` | Pass/fail verdict, non-negotiables | Gate decisions, cut scope |
| `consensus` | Merge perspectives, decide | Final synthesis |
| `custom:<name>` | User-defined role | Specialized perspective |

### Custom Roles

User can define ad-hoc roles inline:

```
/deep-dive run custom:performance-expert
Focus: latency, throughput, caching, database queries
```

Copilot will adopt that persona for the turn.

---

## Session Log Format

```markdown
# Deep Dive Session: <feature-name>
Phase: <0|1|2|5>
Started: <timestamp>
Problem: <brief description>

---

## Turn 1: Architect
**Model**: copilot (or specified model)
**Timestamp**: <ISO-8601>

<architect analysis content>

---

## Turn 2: Critic
**Model**: copilot
**Timestamp**: <ISO-8601>

<critic analysis content>

---

## Turn 3: User
**Added by**: User
**Timestamp**: <ISO-8601>

<user's own analysis>

---

## Turn 4: Security
**Model**: copilot
**Timestamp**: <ISO-8601>

<security analysis content>

---

## Synthesis
**Generated**: <timestamp>

### Decision
<chosen approach>

### Rationale
<why this approach wins>

### Top Risks & Mitigations
1. <risk> → <mitigation>
2. <risk> → <mitigation>

### Action Items
- [ ] <next step 1>
- [ ] <next step 2>

### Open Questions
- <question for user>
```

---

## Execution: Option A (In-Chat) vs Option B (External)

### Option A: In-Chat with Copilot

Copilot executes roles directly in conversation.

```yaml
on_command: "/deep-dive start phase:<N>"
steps:
  1. Load phase prompt from .github/prompts/phase-<N>-*.prompt.md
  2. Load required artifacts per Phase I/O Matrix
  3. Create session log file
  4. Store phase constraints for all subsequent turns

on_command: "/deep-dive run <role>"
steps:
  1. Load role definition from docs/guides/deep-dive/roles/<role>.md
  2. Load problem context from session + phase artifacts
  3. ⚠️ MANDATORY: Load actual source files in affected roots
     - Use semantic_search to find relevant files
     - Read at least 3-5 source files related to the work
     - Read WORKSPACE_CONTEXT.md for conventions
  4. APPLY phase constraints (forbidden actions)
  5. Execute role analysis WITH SPECIFIC FILE REFERENCES
  6. Append turn to session log
  7. Show "Turn N complete. Next: /deep-dive run <role> or /deep-dive synthesize"

on_command: "/deep-dive synthesize"
steps:
  1. Load all turns from session
  2. Load phase template (00_analysis.template.md or 05_done.template.md)
  3. Generate consensus following template structure
  4. Append synthesis to session log
```

### Option B: External LLM via CLI

For parallel execution or different models, use the orchestrator:

```bash
# Single role, append to existing session
./tools/b2-orchestrator/b2-orchestrator.mjs \
  --role architect \
  --append-to docs/runs/my-feature/deep-dive-2024-01-15.md \
  --context docs/runs/my-feature/00_analysis/

# Multiple roles in parallel
./tools/b2-orchestrator/b2-orchestrator.mjs \
  --roles architect,critic,security \
  --model architect:claude-sonnet,critic:gpt-4o,security:claude-sonnet \
  --append-to docs/runs/my-feature/deep-dive-2024-01-15.md

# Synthesize all turns
./tools/b2-orchestrator/b2-orchestrator.mjs \
  --synthesize docs/runs/my-feature/deep-dive-2024-01-15.md
```

---

## State Tracking

Session state tracked in `.workflow-state.yaml`:

```yaml
deep_dive_session:
  active: true
  phase: 0
  log_file: docs/runs/my-feature/deep-dive-2024-01-15.md
  started_at: 2024-01-15T10:00:00Z
  turns:
    - turn: 1
      role: architect
      model: copilot
      timestamp: 2024-01-15T10:05:00Z
    - turn: 2
      role: critic
      model: copilot
      timestamp: 2024-01-15T10:15:00Z
    - turn: 3
      role: user
      model: null
      timestamp: 2024-01-15T10:20:00Z
  synthesis_done: false
```

---

## Phase Context (CRITICAL)

Deep Dive is a helper for Phase 0 or Phase 5. All analysis MUST be grounded in the phase's rules and artifacts.

### Phase References

```yaml
phase_0_analysis:
  prompt: .github/prompts/phase-0-analysis.prompt.md
  template: docs/templates/00_analysis.template.md
  purpose: Understand problem, design solution
  output: solution-design.md
  forbidden: [tasks, implementation, code changes]

phase_1_spec:
  prompt: .github/prompts/phase-1-spec.prompt.md
  template: docs/templates/01_spec.template.md
  purpose: Define requirements with testable acceptance criteria
  output: spec.md
  forbidden: [tasks, implementation, code changes]

phase_2_tasks:
  prompt: .github/prompts/phase-2-tasks.prompt.md
  template: docs/templates/02_tasks.template.md
  purpose: Break down into ordered, implementable tasks
  output: tasks.md
  forbidden: [implementation, code changes]

phase_5_done:
  prompt: .github/prompts/phase-5-done.prompt.md
  template: docs/templates/05_done.template.md
  purpose: Validate completion, release gate
  output: done-check.md
  forbidden: [code changes, new features, scope additions]
```

### Phase I/O Matrix (Hard Rules)

| Phase | Required Inputs (MUST load) | Forbidden Actions |
|-------|----------------------------|-------------------|
| **0** | `00_analysis/work-description.md` | Tasks, implementation, code |
| **1** | `work-description.md`, `solution-design.md` | Tasks, implementation, code |
| **2** | `work-description.md`, `solution-design.md`, `spec.md` | Implementation, code |
| **5** | `spec.md`, `tasks.md`, `impl-log.md`, `test-log.md` | Code changes, adding scope |

### On Session Start

When `/deep-dive start phase:<N>` is called:

```yaml
copilot_must:
  1. Load phase prompt from .github/prompts/phase-<N>-*.prompt.md
  2. Load required inputs per Phase I/O Matrix
  3. Remind all roles of phase constraints (forbidden actions)
  4. Set synthesis output target per phase template
```

### Conflict Resolution

If role output conflicts with phase rules:
1. **Phase prompt rules WIN** (highest priority)
2. Then template structure
3. Then this deep-dive prompt
4. Then role definition

---

## Role Definitions

Each role has a standalone definition in `docs/guides/deep-dive/roles/`:

```yaml
role_file_structure:
  required:
    - "# Role: <Name>"
    - "## Primary Strength"
    - "## Focus Areas"
    - "## Output Template"
  optional:
    - "## Avoid"
    - "## Phase Constraints"
    - "## Input Requirements"
```

### ⚠️ CRITICAL: Mandatory Context Loading (Before ANY Role)

**Problem**: Roles without project context produce generic, useless questions.

**Solution**: Every role MUST load actual project context before analysis.

```yaml
on_any_role_run:
  STEP_1_LOAD_WORKFLOW_STATE:
    read: <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
    extract: [current_phase, affected_roots, work_description, blockers]
    
  STEP_2_LOAD_PHASE_ARTIFACTS:
    phase_0: [work-description.md, any prior analysis]
    phase_1: [work-description.md, solution-design.md]
    phase_2: [solution-design.md, spec.md]
    phase_5: [spec.md, tasks.md, impl-log.md, test-log.md]
    
  STEP_3_LOAD_ACTUAL_CODE:
    action: Read files in affected_roots relevant to work
    tools: [read_file, semantic_search, grep_search]
    minimum: At least 3-5 relevant source files
    
  STEP_4_LOAD_WORKSPACE_CONTEXT:
    read: WORKSPACE_CONTEXT.md
    extract: [conventions for affected roots, relationships, build order]

FORBIDDEN_OUTPUTS:
  - Generic questions: "Have you considered performance?" (without pointing to code)
  - OWASP checklist items not tied to actual endpoints
  - Architecture suggestions ignoring existing structure
  - Risks not referencing specific files or components
  
REQUIRED_OUTPUT_FORMAT:
  every_concern_must_have:
    - Specific file/function reference: "In [src/auth.ts](src/auth.ts#L45)..."
    - Evidence from actual code: "The current implementation does X..."
    - Actionable suggestion: "Change Y in Z file to..."
```

### Example Role Execution

When running `/deep-dive run architect`:

```yaml
inputs:
  - Problem statement (from session log or Phase 0 work description)
  - Existing turns in session (for context)
  - ACTUAL source files in affected roots (MANDATORY)
  - WORKSPACE_CONTEXT.md conventions (MANDATORY)

process:
  1. Read .workflow-state.yaml to understand current context
  2. Read phase artifacts (work description, prior analysis)
  3. READ ACTUAL CODE FILES in affected roots (semantic_search, read_file)
  4. Read WORKSPACE_CONTEXT.md for conventions and relationships
  5. Adopt Architect persona
  6. Read role definition
  7. Analyze problem through Architect lens WITH SPECIFIC FILE REFERENCES
  8. Structure output per template

output:
  - Proposed approaches (2-3) with file references
  - Recommended approach citing actual code structure
  - Key design decisions based on existing patterns
  - Interfaces/contracts with specific file locations
  - Migration notes referencing actual affected files
```

---

## Integration with Workflow

### Phase 0 Integration

```yaml
typical_flow:
  1. "/phase-0-analysis" → Captures work request
  2. "/deep-dive start phase:0" → Opens analysis session
     - Copilot loads: phase-0-analysis.prompt.md
     - Copilot loads: 00_analysis/work-description.md
     - Copilot reminds: "No tasks, no implementation"
  3. Run roles as needed (all constrained by Phase 0 rules)
  4. "/deep-dive synthesize" → Creates solution-design.md draft
     - Output follows: 00_analysis.template.md
  5. "/deep-dive end" → Return to Phase 0 for approval

phase_0_constraints_for_all_roles:
  - Analysis and design ONLY
  - NO task breakdown (that's Phase 2)
  - NO implementation details (that's Phase 3)
  - Focus on: approaches, tradeoffs, risks, decisions
```

### Phase 1 Integration

```yaml
typical_flow:
  1. Phase 0 approved
  2. "/phase-1-spec" → Start spec writing
  3. "/deep-dive start phase:1" → Opens spec review session
     - Copilot loads: phase-1-spec.prompt.md
     - Copilot loads: work-description.md, solution-design.md
     - Copilot reminds: "Define WHAT, not HOW. No tasks, no code."
  4. Run roles as needed (focus on requirements quality)
  5. "/deep-dive synthesize" → Creates spec.md draft
     - Output follows: 01_spec.template.md
  6. "/deep-dive end" → Return to Phase 1 for approval

phase_1_constraints_for_all_roles:
  - Specification ONLY (WHAT, not HOW)
  - NO task breakdown (that's Phase 2)
  - NO implementation details (that's Phase 3)
  - Focus on: requirements, acceptance criteria, edge cases, NFRs
```

### Phase 2 Integration

```yaml
typical_flow:
  1. Phase 1 approved
  2. "/phase-2-tasks" → Start task planning
  3. "/deep-dive start phase:2" → Opens task planning session
     - Copilot loads: phase-2-tasks.prompt.md
     - Copilot loads: work-description.md, solution-design.md, spec.md
     - Copilot reminds: "Plan tasks, not implement. No code."
  4. Run roles as needed (focus on task ordering, dependencies)
  5. "/deep-dive synthesize" → Creates tasks.md draft
     - Output follows: 02_tasks.template.md
  6. "/deep-dive end" → Return to Phase 2 for approval

phase_2_constraints_for_all_roles:
  - Task planning ONLY
  - NO implementation (that's Phase 3)
  - NO code writing
  - Focus on: task breakdown, ordering, dependencies, estimates, risks
```

### Phase 5 Integration

```yaml
typical_flow:
  1. Implementation complete
  2. "/phase-5-done" → Start done check
  3. "/deep-dive start phase:5" → Deep review session
     - Copilot loads: phase-5-done.prompt.md
     - Copilot loads: spec.md, tasks.md, impl-log.md, test-log.md
     - Copilot reminds: "No code changes, evidence-based only"
  4. Run strict, security roles (validation focus)
  5. "/deep-dive synthesize" → Creates done-check.md draft
     - Output follows: 05_done.template.md
  6. "/deep-dive end" → Return to Phase 5 for final approval

phase_5_constraints_for_all_roles:
  - Release gate validation ONLY
  - NO code changes allowed
  - NO adding scope or features
  - Focus on: evidence, pass/fail, blockers, release readiness
```

---

## Recommended Roles per Phase

```yaml
phase_role_mapping:
  phase_0_analysis:
    recommended: [architect, critic, security]
    focus: "Design approaches, tradeoffs, risks"
    typical_order: architect → critic → security → synthesize

  phase_1_spec:
    recommended: [critic, strict, security]
    focus: "Requirements quality, edge cases, NFRs"
    typical_order: critic → strict → security → synthesize

  phase_2_tasks:
    recommended: [architect, critic]
    focus: "Task breakdown, dependencies, ordering"
    typical_order: architect → critic → synthesize

  phase_5_done:
    recommended: [strict, security, critic]
    focus: "Evidence validation, release gate"
    typical_order: strict → security → critic → synthesize
```

---

## Best Practices

```yaml
recommendations:
  role_order:
    exploration: [architect, critic, security]
    validation: [strict, security, critic]
    custom: user decides

  when_to_synthesize:
    - After 3-5 turns for focused problems
    - When perspectives start repeating
    - When ready to make a decision

  user_contributions:
    - Add domain knowledge Copilot lacks
    - Provide business constraints
    - Share prior art or preferences

  session_length:
    - Keep focused: 3-7 turns typical
    - Longer for complex architecture decisions
    - Shorter for validation checks
```

---

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `/deep-dive start phase:0` | Start session for analysis/design |
| `/deep-dive start phase:1` | Start session for spec review |
| `/deep-dive start phase:2` | Start session for task planning |
| `/deep-dive start phase:5` | Start session for done check |
| `/deep-dive run architect` | Run Architect perspective |
| `/deep-dive run critic` | Run Critic perspective |
| `/deep-dive run security` | Run Security perspective |
| `/deep-dive run strict` | Run Strict reviewer |
| `/deep-dive run custom:<name>` | Run custom role |
| `/deep-dive add` | User adds own analysis |
| `/deep-dive status` | Show session progress |
| `/deep-dive synthesize` | Generate consensus |
| `/deep-dive end` | Close session |
| `/deep-dive end --discard` | Abort and discard session |

---

## Example Session (Phase 0)

```
User: /deep-dive start phase:0
Copilot: ✅ Session started for Phase 0 (Analysis)
         Loaded: work-description.md
         Constraints: No tasks, no implementation
         Log: docs/runs/my-feature/deep-dive-20240115-100000.md
         
         Ready. Suggested first role: `/deep-dive run architect`

User: /deep-dive run architect
Copilot: ## Turn 1: Architect
         [Architect analysis: 2-3 approaches, recommendation, tradeoffs...]
         
         Turn 1 complete. Next: `/deep-dive run critic` or another role.

User: /deep-dive run critic  
Copilot: ## Turn 2: Critic
         [Critic analysis: risks, edge cases, missing assumptions...]
         
         Turn 2 complete. Next: `/deep-dive run security` or `/deep-dive synthesize`.

User: /deep-dive run security
Copilot: ## Turn 3: Security
         [Security analysis: threats, mitigations, NFRs...]
         
         Turn 3 complete. 3 turns done. Ready to synthesize?

User: /deep-dive synthesize
Copilot: ## Synthesis
         **Decision**: [chosen approach]
         **Rationale**: [why]
         **Risks**: [top 3 with mitigations]
         **Action Items**: [next steps]
         
         Synthesis complete. Run `/deep-dive end` to close session.

User: /deep-dive end
Copilot: ✅ Session closed.
         Log saved: docs/runs/my-feature/deep-dive-20240115-100000.md
         
         Next: Review synthesis, then continue Phase 0 → `/phase-0-analysis`
```

---

## See Also

- [Role: Architect](../../docs/guides/deep-dive/roles/architect.md)
- [Role: Critic](../../docs/guides/deep-dive/roles/critic.md)
- [Role: Security](../../docs/guides/deep-dive/roles/security.md)
- [Role: Strict](../../docs/guides/deep-dive/roles/strict.md)
- [Role: Consensus](../../docs/guides/deep-dive/roles/consensus.md)
- [B2 Orchestrator](../../tools/b2-orchestrator/README.md)
