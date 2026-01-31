# Deep Dive — Option A/B (Optional)

> Use this when the problem is **hard** (system analysis, tricky bug, complex solution).
> This keeps your normal workflow, but adds a **multi-angle consensus** step.

## Options

Choose ONE:

### Option A — Copilot-only (No external API)

Copilot runs multiple internal “worker personas” inside the chat, then synthesizes as Architect + Tech Lead.
No external API keys required.

### Option B — External CLI (LLM API)

Runs a local CLI that calls an external LLM API (OpenAI or OpenAI-compatible via `OPENAI_BASE_URL`) and produces a deep-dive log.
This does NOT use the VS Code GitHub Copilot backend/subscription.

IMPORTANT (Option B only): You must provide your own API credentials and accept separate billing and data-sharing with your chosen provider.

---

## Trigger

```yaml
TRIGGER_RULES:
  valid_triggers:
    - "/deep-dive"                 # entry point
    - "/deep-dive option:A"         # Copilot-only deep dive
    - "/deep-dive option:B"         # external CLI deep dive
    - "/deep-dive phase:0"         # focus Phase 0 analysis
    - "/deep-dive phase:1"         # focus Phase 1 spec
    - "/deep-dive phase:5"         # focus Phase 5 done-check

  why: |
    For hard work, a single perspective is risky.
    Deep Dive runs multiple specialized workers and produces a consensus.
```

---

## When to Use

Use Deep Dive when any is true:
- Multi-root systems reasoning
- Complex cross-cutting concerns (security, perf, data correctness)
- Hard bug with unclear root cause
- Complex solution tradeoffs

Do NOT use for:
- Simple tasks (< 3 files, single root, low risk)

---

## How it Fits the Existing Workflow

- Normal flow remains default (Lite / Governed).
- Deep Dive is **optional** and does not replace approvals.
- Deep Dive produces one extra artifact per run, per phase, so it won't overwrite:
  - `deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md` (stored inside the phase folder)

---

## Phase Contract References (Must Follow)

Deep Dive is a helper for Phase 0/1/5. Workers MUST reason within the selected phase contract.

Before running any workers:
- Load and follow the phase prompt:
  - Phase 0 → `.github/prompts/phase-0-analysis.prompt.md`
  - Phase 1 → `.github/prompts/phase-1-spec.prompt.md`
  - Phase 5 → `.github/prompts/phase-5-done.prompt.md`
- Load and follow the canonical template:
  - Phase 0 → `docs/templates/00_analysis.template.md`
  - Phase 1 → `docs/templates/01_spec.template.md`
  - Phase 5 → `docs/templates/05_done.template.md`

If there is a conflict: phase prompt rules win → then template structure → then this Deep Dive prompt.

---

## Phase I/O Matrix (Hard Rules)

Use this as the non-negotiable checklist for what inputs MUST be loaded, what is FORBIDDEN, and what outputs MUST be produced for the selected phase.

| Phase | Required Inputs (MUST load) | Optional Inputs (if present) | Forbidden (MUST NOT) | Deep Dive Log Output | Canonical Output (template-based) |
|------:|-----------------------------|------------------------------|----------------------|----------------------|-----------------------------------|
| **0** | `00_analysis/work-description.md` | `00_analysis/work-updates.md` | Tasks planning, implementation, code changes | `00_analysis/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md` | `00_analysis/solution-design.md` via `docs/templates/00_analysis.template.md` |
| **1** | `00_analysis/work-description.md`, `00_analysis/solution-design.md` | `00_analysis/work-updates.md`, `01_spec/spec.md` (draft) | Tasks planning, implementation, code changes | `01_spec/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md` | `01_spec/spec.md` via `docs/templates/01_spec.template.md` |
| **5** | `01_spec/spec.md`, `02_tasks/tasks.md`, `03_impl/impl-log.md`, `04_tests/tests.md` | `00_analysis/work-description.md`, `05_done/done-check.md` (draft), any CI/build evidence docs | ANY code changes, adding scope, skipping failed DoD items | `05_done/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md` | `05_done/done-check.md` via `docs/templates/05_done.template.md` |

Notes:
- Option B: the CLI `--input` list must cover the phase’s Required Inputs.
- Option A: workers must be explicitly reminded of the phase’s Forbidden items.

---

## Copilot Role: Architect + Tech Lead (Post Deep Dive)

After the deep-dive log is generated, Copilot should switch to:
- **Architect**: choose the recommended technical approach and shape the design.
- **Technical Lead**: synthesize tradeoffs, risks, and implementation strategy into the canonical workflow artifacts.

Copilot responsibilities:
- Use `work-description.md` (and latest work updates) as the source of truth.
- Treat the deep-dive log as strong input, but do not blindly follow it.
- Resolve conflicts between workers, and make a clear decision.
- Produce the phase’s canonical artifact(s) with crisp acceptance criteria and next actions.
- IMPORTANT: The canonical artifact MUST follow the phase’s prompt rules AND be written using the corresponding template in `docs/templates/`:
  - Phase 0 → `docs/templates/00_analysis.template.md` → `00_analysis/solution-design.md`
  - Phase 1 → `docs/templates/01_spec.template.md` → `01_spec/spec.md`
  - Phase 5 → `docs/templates/05_done.template.md` → `05_done/done-check.md`
  - Follow the template’s bilingual order and structure (do not invent a new format).

Minimum synthesis outputs (by phase):
- **Phase 0**: write/update `00_analysis/solution-design.md` (and diagrams if used in your workflow).
- **Phase 1**: update `01_spec/spec.md` to match the chosen approach and constraints.
- **Phase 5**: update `05_done/done-check.md` with evidence + release notes decisions.

Recommended structure for the synthesis (EN/VI acceptable):
- **Decision**: what we will do (1-3 bullets)
- **Rationale**: why (tradeoffs)
- **Risks & Mitigations**: top 3-5
- **Open Questions**: what must be answered to proceed
- **Next Steps**: what to do in the workflow next (explicit commands)

Note: Even though the synthesis section above is a helpful thinking scaffold, the final written output for the canonical artifact must match the template for that phase.

---

## Guided Flow (Checkpointed)

Goal: make `/deep-dive` feel like a single smooth action while still keeping user control.

### Step 1: Confirm intent + phase
Ask:
- Which option? (`A|B`)
- Which phase? (`0|1|5`)
- What is the title?

If phase not provided, default to Phase 0.

If option not provided, default to **A**.

### Step 2: Safety + permission checkpoint
If option is **A**:
- Confirm you want Copilot to run multiple worker personas inside chat.

If option is **B**:
- Say explicitly: Option B will call an external LLM API (not Copilot backend).
- Say explicitly: this may incur separate billing and send input content to your provider.

Then ask (mode-dependent):

- A: "Do you want me to run the deep dive now (Architect/Critic/Security/Strict → consensus)? (yes/no)"
- B: "Do you want me to run the local deep-dive CLI now? (yes/no)"

Rules:
- If user says **no**:
  - A: stop after printing what you would do and the expected output files.
  - B: do not run the CLI; provide the exact command they can run, then stop.
- If user says **yes**: proceed to Step 3.

### Step 3: Collect paths (minimal questions)
Ask only what’s needed to run the command safely:
- `docs_root` (or confirm detected root)
- `branch-slug` (or confirm detected)
- Which input files to include (minimum depends on phase)

Default inputs (minimum set):
- Phase 0:
  - `00_analysis/work-description.md`
  - `00_analysis/work-updates.md` (if present)
- Phase 1:
  - `00_analysis/work-description.md` (scope + acceptance criteria source of truth)
  - `00_analysis/work-updates.md` (if present)
  - `00_analysis/solution-design.md` (approved approach)
  - `01_spec/spec.md` (current spec draft, if present)
- Phase 5:
  - `00_analysis/work-description.md` (scope confirmation)
  - `01_spec/spec.md`
  - `02_tasks/tasks.md`
  - `03_impl/impl-log.md`
  - `04_tests/tests.md`
  - `05_done/done-check.md` (current done-check draft, if present)

Output path:
- Always write a timestamped log file inside the phase folder:
  - `deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`

### Step 4: Run workers (Copilot executes)
If option is **A**:
- Do NOT run any CLI.
- Run the worker personas inside chat, each with distinct focus (see `docs/guides/deep-dive/roles/*.md`):
  - Worker 1: Architect (design approach)
  - Worker 2: Critic (find flaws, missing assumptions)
  - Worker 3: Security (risk + mitigations)
  - Worker 4: Strict (very strict, non-negotiables, says NO when needed)
  - Then: Consensus (merge, resolve conflicts)
- Write the combined deep-dive log to: `<phase-folder>/deep-dive-A-<YYYYMMDD-HHMMSS>.md`.

Phase-aware constraints for all workers:
- Phase 0: analysis/design only (no tasks, no implementation).
- Phase 1: specification only (define WHAT with testable ACs; no tasks, no implementation).
- Phase 5: release gate only (evidence-based ✅/❌; NO code changes; refuse if failures exist).

If option is **B**:
- If terminal/tooling access is available, run the command in the workspace terminal.
- If not available, print the command for the user to run.

Command template (Option B only):

```bash
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --phase <0|1|5> \
  --title "<feature title>" \
  --input <docs_root>/docs/runs/<branch-slug>/<phase-path>/<input-file-1> \
  --input <docs_root>/docs/runs/<branch-slug>/<phase-path>/<input-file-2> \
  --out <docs_root>/docs/runs/<branch-slug>/<phase-path>/deep-dive-B.md
```

Note: the runner will auto-append a timestamp so the actual file becomes `deep-dive-B-<YYYYMMDD-HHMMSS>.md`.

### Step 5: Read output + synthesize canonical artifacts
After the deep-dive log exists:
- Read `deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`.
- Then act as **Architect + Tech Lead** and write/update the canonical artifact for that phase USING the official template:
  - Phase 0: `00_analysis/solution-design.md`
  - Phase 1: `01_spec/spec.md`
  - Phase 5: `05_done/done-check.md`

### Step 6: Stop at the correct gate
Do not auto-advance phases. End by telling the user the next explicit command and ask for approval where required.

---

## Execution (Local CLI)

### Phase 0 (Analysis)
Input: `00_analysis/work-description.md` (+ any relevant context files)
Output: `00_analysis/deep-dive-B-<YYYYMMDD-HHMMSS>.md`

```bash
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --phase 0 \
  --title "<feature title>" \
  --input <docs_root>/docs/runs/<branch-slug>/00_analysis/work-description.md \
  --out <docs_root>/docs/runs/<branch-slug>/00_analysis/deep-dive-B.md
```

Then continue normal flow:
- Use the consensus to write `00_analysis/solution-design.md`.

### Phase 1 (Spec)
Input: `00_analysis/work-description.md` + `00_analysis/solution-design.md` + `01_spec/spec.md` (if present)
Output: `01_spec/deep-dive-B-<YYYYMMDD-HHMMSS>.md`

### Phase 5 (Done)
Input: `01_spec/spec.md` + `02_tasks/tasks.md` + `03_impl/impl-log.md` + `04_tests/tests.md` + `05_done/done-check.md` (if present)
Output: `05_done/deep-dive-B-<YYYYMMDD-HHMMSS>.md`

---

## Output Requirements

- Must include: chosen approach, tradeoffs, risks+mitigations, open questions.
- Must stay aligned with `work-description.md` and latest work updates.
