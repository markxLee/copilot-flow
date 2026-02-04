# Deep Dive (Option A/B)

This guide defines the Deep Dive worker roles so outputs overlap less and each role leans into a distinct strength.

- **Option A**: Copilot-only (no external API). Copilot runs the roles in chat and writes a timestamped deep-dive log per phase.
- **Option B**: External CLI (LLM API). The runner produces a timestamped deep-dive log per phase.

## ⚠️ CRITICAL: Context Loading (Mandatory)

Before ANY role analysis, you MUST:

```yaml
STEP_1_LOAD_STATE:
  - Read: <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
  - Extract: current_phase, affected_roots, work_description
  
STEP_2_LOAD_ARTIFACTS:
  - Phase 0: Read work-intake, any existing analysis
  - Phase 1: Read solution-design.md, spec.md drafts
  - Phase 5: Read spec.md, tasks.md, impl-log.md, test results
  
STEP_3_LOAD_CODE:
  - Read files mentioned in artifacts
  - Read files in affected_roots relevant to the work
  - Use semantic_search if unsure what to read

FAILURE_MODE:
  - If context not loaded → Questions will be generic/irrelevant
  - If only reading artifacts without code → Miss implementation details
```

**Rule**: Every question/concern MUST reference specific files, functions, or artifact sections. Generic questions like "have you considered performance?" without pointing to actual code are FORBIDDEN.

## Where logs go
Store logs inside the relevant phase folder so they don't overwrite and remain reviewable:
- Phase 0: `00_analysis/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`
- Phase 1: `01_spec/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`
- Phase 5: `05_done/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`

Note (Option B): you can pass a stable output name like `deep-dive-B.md` to the runner; it will auto-append a timestamp and write `deep-dive-B-<YYYYMMDD-HHMMSS>.md` to avoid overwrites.

## Roles
See role definitions:
- [Architect](roles/architect.md)
- [Critic](roles/critic.md)
- [Security](roles/security.md)
- [Strict](roles/strict.md)
- [Consensus](roles/consensus.md)
