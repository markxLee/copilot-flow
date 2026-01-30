# Setup Workspace — Full Initialization Pipeline
# Thiết lập Workspace — Quy trình Khởi tạo Đầy đủ

> Runs the full workspace setup pipeline:
> discovery → cross-root → sync instructions → generate workspace files
> 
> Chạy toàn bộ pipeline setup workspace:
> discovery → cross-root → sync instructions → tạo file workspace

---

## Trigger / Kích hoạt

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

## Purpose / Mục đích

- Ensure `WORKSPACE_CONTEXT.md` exists and is up-to-date
- Ensure cross-root workflows (Section 9) are configured
- Ensure per-root instructions are generated
- Ensure `.code-workspace` and related files are generated

---

## Rules / Quy tắc

**MUST / PHẢI:**
- Prefer explicit sub-prompts to avoid phase confusion
- Ask user before overwriting any existing important files
- Keep setup non-destructive by default (append/merge rather than delete)

**MUST NOT / KHÔNG ĐƯỢC:**
- Create/switch git branches
- Modify application code (setup only)

---

## Execution Plan / Kế hoạch Thực thi

### Step 1: Workspace Discovery / Khám phá Workspace

- Run:

```
/workspace-discovery
```

Expected outcome:
- `WORKSPACE_CONTEXT.md` exists/updated

### Step 2: Cross-Root Configuration / Cấu hình Cross-Root

- Run:

```
/cross-root-guide
```

Expected outcome:
- `WORKSPACE_CONTEXT.md` Section 9 is created/updated

### Step 3: Sync Instructions / Đồng bộ Instructions

- Run:

```
/sync-instructions
```

Expected outcome:
- Per-root `.github/instructions/*.md` are generated/updated (where applicable)

### Step 4: Generate Workspace Files / Tạo file Workspace

- Run:

```
/generate-workspace-files
```

Expected outcome:
- `.code-workspace` updated/generated
- Optional: architecture files updated if prompt supports it

---

## Output Format / Định dạng Output

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

## STOP Rules / Quy tắc Dừng

- If user rejects overwriting files → STOP and propose a safe alternative
- If multiple roots exist but cross-root info is ambiguous → STOP and ask clarifying questions
