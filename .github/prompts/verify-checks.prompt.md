# Verify Checks — Automated Quality Commands
# Verify Checks — Chạy Lệnh Chất lượng Tự động

> Run automated checks (typecheck/lint/build/test) in affected roots.
> Chạy các kiểm tra tự động (typecheck/lint/build/test) trong các root bị ảnh hưởng.

---

## Trigger / Kích hoạt

```yaml
TRIGGER_RULES:
  valid_triggers:
    - "/verify-checks"              # Explicit prompt reference
    - "/verify-checks <root>"       # Optional: force one root
    - "verify checks"              # Text fallback

  why: |
    Separates tooling verification from human code review.
    Keeps /code-review focused on correctness and requirement alignment.
```

---

## Purpose / Mục đích

- Detect package manager per root (pnpm/yarn/npm)
- Prefer repo scripts from `package.json` (typecheck/lint/build/test)
- Run the best available commands per root
- Summarize results in a consistent table for /code-review to reference

---

## Rules / Quy tắc

**MUST / PHẢI:**
- Read-only with respect to code: do not edit source files
- Prefer scripts over raw commands
- If scripts are missing, use reasonable fallbacks and explain them
- If root has no Node tooling, skip and mark as N/A

**MUST NOT / KHÔNG ĐƯỢC:**
- Change workflow phase/task statuses
- Create commits or branches

---

## Inputs / Đầu vào

```yaml
inputs:
  mode:
    - auto: infer affected roots from git diff (recommended)
    - explicit: user provides <root>

  base_branch:
    source: .workflow-state.yaml -> meta.base_branch
    fallback: main/master (ask user if ambiguous)
```

---

## Step 1: Determine Affected Roots / Xác định Root bị ảnh hưởng

```yaml
affected_roots_detection:
  auto:
    1. Compute diff vs base_branch (merge-base)
    2. List changed files
    3. Map changed paths to workspace roots
    4. If unclear mapping -> ask user to confirm

  explicit:
    - Use the provided root only
```

---

## Step 2: Detect Package Manager + Scripts / Detect Package Manager + Scripts

```yaml
tooling_detection:
  package_manager:
    - if pnpm-lock.yaml exists -> pnpm
    - else if yarn.lock exists -> yarn
    - else if package-lock.json exists -> npm
    - else -> npm

  scripts:
    file: package.json
    read:
      - scripts.typecheck
      - scripts.lint
      - scripts.build
      - scripts.test

  selection_policy:
    - Prefer running available scripts in this order:
      1) typecheck
      2) lint
      3) build
      4) test
    - If a script is missing:
      - typecheck fallback: "<pm> tsc --noEmit" (if tsc is available) or skip
      - test fallback: "<pm> test" (if test script exists), else skip
```

---

## Step 3: Run Commands / Chạy lệnh

```yaml
execution:
  for_each_root:
    - cd <root>
    - run selected commands
    - capture exit code + relevant output

  timeouts:
    guidance: "If build/test is slow, run only typecheck+lint unless asked."
```

---

## Output Format / Định dạng Output

```markdown
## 🔧 Verify Checks / Xác minh Chất lượng

| Root | Package Manager | Typecheck | Lint | Build | Test |
|------|------------------|----------|------|-------|------|
| <root> | <pnpm/yarn/npm> | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/⏭️ | ✅/❌/⏭️ |

### Commands Used
- <root>: <typecheck cmd>
- <root>: <lint cmd>
- <root>: <build cmd>
- <root>: <test cmd>

### Failures (if any)
- Root: <root>
  - Command: <cmd>
  - Exit: <code>
  - Output (summary): <short>

---

Next:
- Use `/code-review` (or `/code-review T-XXX`) and include this verification summary.
```
