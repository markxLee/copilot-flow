# Solo Orchestrator — One-Command Flow for Solo Work
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

> A lightweight orchestrator that keeps the governed workflow rules,
> but reduces ceremony for a solo developer (one user story, one implementer).

---

## Trigger

```yaml
TRIGGER_RULES:
  valid_triggers:
    - "/solo-orchestrator"                 # Explicit prompt reference
    - "/solo-orchestrator start: <desc>"   # Optional: provide work summary
    - "/solo-orchestrator resume"          # If a workflow already exists
    - "solo orchestrator"                  # Text fallback

  why: |
    Provides a single entry point that:
    - detects whether we should use Lite vs Governed
    - proposes the minimal next prompt(s)
    - preserves approvals and audit trail
```

---

## Purpose

- Decide the best path for SOLO work (Lite vs Governed) based on scope/risks
- Keep user-facing steps minimal while preserving correctness
- Produce a short, actionable “Next Commands” block
- Avoid skipping approval gates

---

## Non-Negotiables

**MUST:**
- Respect approval gates (no skipping phases)
- Keep artifacts under `<docs_root>/docs/runs/<branch-slug>/` when using governed workflow
- Prefer `/verify-checks` for automation; `/code-review` for human review + work alignment

**MUST NOT:**
- Auto-start a workflow if one exists (must ask user to resume/new)
- Auto-create/switch git branches
- Implement code directly from this prompt (this is orchestration only)

---

## Inputs

```yaml
inputs:
  optional_work_summary:
    example: "start: Add payment detail screen"

  constraints:
    solo_default: true
    timebox:
      lite_mode: 15-30m
      governed_phase0: 15-30m
```

---

## Orchestration Algorithm

```yaml
steps:
  1. Load workspace context:
     - Ensure WORKSPACE_CONTEXT.md exists
     - If missing: recommend /setup-workspace

  2. Detect existing workflow state (same logic as /init):
     - Resolve docs_root
     - Resolve branch slug
     - Check for .workflow-state.yaml

  3. If workflow exists:
     - Show a concise status summary
     - Offer choices:
       - "resume" -> recommend /workflow-resume
       - "status" -> recommend /workflow-status
       - "new" -> recommend /work-intake (after user confirms)

  4. If no workflow exists:
     - If user provided start: <desc> -> recommend /work-intake
     - Else ask user for 2-line work summary

  5. After work-intake + work-review is READY:
     - Decide path using decision rules:

decision_rules:
  choose_lite_if_any_true:
    - "<= 3 files" (likely)
    - "single root" (no cross-root sync)
    - "low risk" (no schema/migrations, no auth/payments changes)
    - "clear acceptance criteria" (easy to test manually)

  choose_governed_if_any_true:
    - "multi-root"
    - "> 3-5 files"
    - "unclear requirements / many edge cases"
    - "high risk" (payments/auth/data migrations)

  solo_simplifications_when_governed:
    - Keep Phase 0/1/2 thin (timeboxed)
    - Keep Phase 2 tasks+plan in one file (02_tasks/tasks.md)
    - Always run /verify-checks before /code-review
```

---

## Output Format

```markdown
## 🧭 Solo Orchestrator / Điều phối Solo

### Situation / Tình trạng
| Field | Value |
|------|-------|
| Workflow Found | Yes/No |
| Suggested Mode | Lite / Governed |
| Reason | <1-2 bullets> |

### Next Commands (Copy/Paste)
<Minimal set of commands, in order>

### Notes
- EN: <short>
- VI: <short>
```

---

## Recommended Command Sequences

### A) Lite (solo, small)

```text
/init
/lite-mode <your work summary>
# implement
/verify-checks
# optional: /code-review
```

### B) Governed (solo, medium+)

```text
/init
/work-intake
/work-review
/phase-0-analysis
/phase-1-spec
/phase-2-tasks
/phase-3-impl T-001
/verify-checks
/code-review T-001
# repeat per task
```
