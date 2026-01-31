# Setup Workspace — Full Initialization Pipeline

> Runs the full workspace setup pipeline:
> discovery → cross-root → sync instructions → generate workspace files

---

## Trigger

```yaml
TRIGGER_RULES:
  valid_triggers:
    - "/setup-workspace"   # Explicit prompt reference (REQUIRED)
    - "setup workspace"    # Text fallback
    - "init workspace"     # Text fallback

  why: |
    This is the canonical entry point to bootstrap WORKSPACE_CONTEXT.md
    and related multi-root configuration.
```

---

## Purpose

- Ensure `WORKSPACE_CONTEXT.md` exists and is up-to-date
- Ensure cross-root workflows (Section 9) are configured
- Ensure per-root instructions are generated
- Ensure `.code-workspace` and related files are generated

---

## Rules

**MUST:**
- Prefer explicit sub-prompts to avoid phase confusion
- Ask user before overwriting any existing important files
- Keep setup non-destructive by default (append/merge rather than delete)

**MUST NOT:**
- Create/switch git branches
- Modify application code (setup only)

---

## Execution Plan

### Step 1: Workspace Discovery

- Run:

```
/workspace-discovery
```

Expected outcome:
- `WORKSPACE_CONTEXT.md` exists/updated

### Step 2: Cross-Root Configuration

- Run:

```
/cross-root-guide
```

Expected outcome:
- `WORKSPACE_CONTEXT.md` Section 9 is created/updated

### Step 3: Sync Instructions

- Run:

```
/sync-instructions
```

Expected outcome:
- Per-root `.github/instructions/*.md` are generated/updated (where applicable)

### Step 4: Generate Workspace Files

- Run:

```
/generate-workspace-files
```

Expected outcome:
- `.code-workspace` updated/generated
- Optional: architecture files updated if prompt supports it

---

## Incremental Updates

After initial setup, use `/workspace-update-root` to incrementally update a single root without re-running full discovery.

---

## Output Format

```markdown
## 🧰 Setup Workspace / Thiết lập Workspace

### Pipeline Steps
1. ✅ Workspace discovery
2. ✅ Cross-root config
3. ✅ Sync instructions
4. ✅ Generate workspace files

### Files Created/Updated
- WORKSPACE_CONTEXT.md
- .code-workspace
- Root instructions (if applicable)

### Next
- If starting new work: run `/init` then `/work-intake`
```

---

## STOP Rules

- If user rejects overwriting files → STOP and propose a safe alternative
- If multiple roots exist but cross-root info is ambiguous → STOP and ask clarifying questions
