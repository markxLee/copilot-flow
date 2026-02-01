# Workflow Status — Current State Summary
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

> Read-only status view of the current workflow (if any).

---

## Trigger

```yaml
TRIGGER_RULES:
  valid_triggers:
    - "/workflow-status"  # Explicit prompt reference
    - "workflow status"   # Text fallback
    - "status"            # When user explicitly asks workflow status

  why: |
    Provides a quick, safe summary without resuming or changing state.
```

---

## Purpose

- Detect whether a workflow exists for the current branch
- Summarize phase/task progress, blockers, and next recommended prompt
- Avoid making changes to docs/code

---

## Rules

**MUST:**
- Read-only: do not modify any file
- Use the same workflow auto-detect logic as cf-init:
  - Read `WORKSPACE_CONTEXT.md` → get `meta.default_docs_root`
  - Get branch from docs_root repo
  - Resolve branch slug
  - Look for `<docs_root>/docs/runs/<slug>/.workflow-state.yaml`
- If state found: summarize; if not found: explain and suggest `/work-intake`

**MUST NOT:**
- Start a new workflow automatically
- Advance phases or mark approvals

---

## Status Output

```markdown
## 📍 Workflow Status / Trạng thái Workflow

| Field | Value |
|------|-------|
| Docs Root | <docs_root> |
| Branch | <branch> |
| Slug | <branch-slug> |
| State File | <path or "not found"> |

### If workflow found

| Aspect | Value |
|--------|-------|
| Current Phase | <phase number>: <phase name> |
| Phase Status | <not-started/in-progress/awaiting-review/approved/blocked> |
| Current Task | <T-XXX or "-"> |
| Blockers | <none or list> |
| Last Action | <from state> |
| Next Action | <from state> |

### Recommended Next Prompt
- <explicit prompt reference>

### Notes
- This is read-only. To resume execution, use `/workflow-resume`.
```

---

## Common Outcomes

- **No workflow found:** suggest `/init` then `/work-intake`
- **Workflow found but blocked:** show blockers and suggest `/work-update` or the next relevant review prompt
- **Workflow awaiting review:** suggest the appropriate review prompt (e.g. `/spec-review`, `/task-plan-review`, `/code-review`)
