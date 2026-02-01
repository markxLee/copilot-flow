# Code Fix Plan — Address Review Findings
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

You are acting as a **Senior Engineer and Remediation Planner**.

---

## Trigger

```yaml
TRIGGER_RULES:
  explicit_only: true
  accepted_triggers:
    - "/code-fix-plan"        # Fix all issues from last code review
    - "/code-fix-plan T-XXX"  # Fix issues for specific task only (optional filter)
    
  rejected_triggers:
    - "fix plan", "kế hoạch sửa"        # ⚠️ TOO VAGUE
    - "go", "continue", "approved"      # ⚠️ DANGEROUS in long conversations
    
  why: |
    Explicit prompt references prevent accidental phase skipping
    in long conversations where context may be confused.
    
  prerequisites:
    - Last code-review verdict = REQUEST CHANGES
    - Issues exist in state blockers or last review output
```

---

## Mode Detection

```yaml
mode_detection:
  if_has_task_id:
    mode: single_task
    source: |
      - Issues from last review for T-XXX only
      - state.tasks.T-XXX.issues (if saved)
    use_when: Want to fix one task at a time
    
  if_no_task_id:
    mode: all_review_findings
    source: |
      - ALL issues from last code review (single or batch)
      - state.status.blockers (code_review_findings)
      - May span multiple tasks if batch review
    use_when:
      - After batch review with issues in multiple tasks
      - Want to fix everything at once
      
  output_mode_in_context:
    required: true
    format: |
      | Mode | Value |
      |------|-------|
      | Fix Mode | All Review Findings / Single Task (T-XXX) |
      | Source | Last batch review / Last T-XXX review |
      | Tasks Affected | T-003, T-007 / T-XXX only |
```

---

## Pre-Check

```yaml
pre_checks:
  1. Verify review was done with issues:
     check: |
       - Last code review verdict == REQUEST_CHANGES
       - OR state.status.blockers contains code_review_findings
     if_not: STOP - "No review findings. Run `/code-review` first."
     
  2. Load review findings:
     sources_priority:
       1. Last code review output in conversation (most recent)
       2. state.status.blockers.code_review_findings
       3. state.tasks[*].issues (for affected tasks)
       
  3. Determine scope:
     if_task_id_provided:
       scope: Filter findings for T-XXX only
       context: Single task fix
     if_no_task_id:
       scope: ALL findings from last review
       context: May include multiple tasks
       
  4. Get affected context:
     - List of affected tasks (may be 1 or many)
     - Files changed across all affected tasks
     - Target roots
```

---

## Purpose

Produce a minimal, task-scoped fix plan to address issues from Code Review. Map each finding to a concrete fix without implementing.

---

## Rules (NON-NEGOTIABLE)

**MUST:**
- Propose fixes ONLY for issues in the review
- Keep fixes minimal and focused
- Map each finding to specific fix
- Stay within task scope
- Include verification steps

**MUST NOT:**
- Implement code changes in this response
- Propose broad refactors
- Add new features
- Change architecture
- Fix issues not in the review

---

## Fix Prioritization

```yaml
priority_order:
  1. Critical issues (must fix)
  2. Major issues (should fix)
  3. Minor issues (nice to fix)
  4. Nits (optional)

batch_strategy:
  - Group related fixes together
  - One logical batch per apply
  - Critical + Major in first batch
  - Minor + Nits in subsequent batches (optional)
```

---

## Output Format

```markdown
## 📋 Code Fix Plan / Kế hoạch Sửa Code

### Context / Bối cảnh

| Field | Value |
|-------|-------|
| Fix Mode | All Review Findings / Single Task (T-XXX) |
| Source Review | Batch review / Single task review |
| Tasks Affected | T-003, T-007 / T-XXX only |
| Root(s) | <target_root(s)> |
| Total Issues | <N> critical, <M> major, <P> minor |

---

### Fix Strategy / Chiến lược Sửa

1. <High-level approach>
2. <Order of fixes>
3. <Any dependencies between fixes>

---

### Finding → Fix Mapping / Ánh xạ Phát hiện → Sửa

<If multiple tasks affected, group by task first>

#### Task T-003: <task title>

##### Critical Fixes / Sửa Nghiêm trọng

| Finding | File | Proposed Fix | Risk |
|---------|------|--------------|------|
| T003-CRIT-001 | `path/file.ts:L42` | <fix description> | Low/Med/High |

**T003-CRIT-001: <Issue title>**
- **Issue:** <what's wrong>
- **Fix:** <exactly what to change>
- **Lines:** L42-L45
- **Risk:** <potential side effects>

##### Major Fixes / Sửa Chính

| Finding | File | Proposed Fix | Risk |
|---------|------|--------------|------|
| T003-MAJ-001 | `path/file.ts:L70` | <fix description> | Low |

---

#### Task T-007: <task title>

##### Critical Fixes / Sửa Nghiêm trọng

| Finding | File | Proposed Fix | Risk |
|---------|------|--------------|------|
| T007-CRIT-001 | `path/other.ts:L20` | <fix description> | Med |

---

#### Build/Lint Issues (Cross-task)

<If issues from automated checks, not specific to one task>

| Finding | Type | File | Proposed Fix |
|---------|------|------|--------------|
| BUILD-001 | TypeScript | `types.ts:L15` | <fix description> |
| LINT-001 | ESLint | `utils.ts:L30` | <fix description> |

---

<If single task mode, simpler format>

#### Critical Fixes / Sửa Nghiêm trọng

| Finding | File | Proposed Fix | Risk |
|---------|------|--------------|------|
| CRIT-001 | `path/file.ts:L42` | <fix description> | Low/Med/High |
| CRIT-002 | `path/file.ts:L55` | <fix description> | Low/Med/High |

**CRIT-001: <Issue title>**
- **Issue:** <what's wrong>
- **Fix:** <exactly what to change>
- **Lines:** L42-L45
- **Risk:** <potential side effects>

**CRIT-002: <Issue title>**
- **Issue:** <what's wrong>
- **Fix:** <exactly what to change>
- **Lines:** L55-L60
- **Risk:** <potential side effects>

#### Major Fixes / Sửa Chính

| Finding | File | Proposed Fix | Risk |
|---------|------|--------------|------|
| MAJ-001 | `path/file.ts:L70` | <fix description> | Low |

**MAJ-001: <Issue title>**
- **Issue:** <what's wrong>
- **Fix:** <exactly what to change>
- **Lines:** L70-L75
- **Risk:** <potential side effects>

#### Minor Fixes (Optional) / Sửa Nhỏ (Tùy chọn)

| Finding | File | Proposed Fix | Effort |
|---------|------|--------------|--------|
| MIN-001 | `path/file.ts:L80` | <fix description> | S |

---

### Fix Batches / Các Batch Sửa

#### Batch 1: Critical + Major (Required)
| Seq | Finding | Action |
|-----|---------|--------|
| 1 | CRIT-001 | <brief action> |
| 2 | CRIT-002 | <brief action> |
| 3 | MAJ-001 | <brief action> |

#### Batch 2: Minor (Optional)
| Seq | Finding | Action |
|-----|---------|--------|
| 1 | MIN-001 | <brief action> |

---

### Out of Scope / Ngoài Phạm vi

<If any findings cannot be fixed in this task>

| Finding | Reason | Alternative |
|---------|--------|-------------|
| <ID> | <why out of scope> | <what to do instead> |

---

### Verification Plan / Kế hoạch Xác nhận

After fixes applied, run:

```bash
cd <target_root>
pnpm build        # Must pass
pnpm lint         # Must pass
pnpm typecheck    # Must pass
pnpm test         # Must pass
```

<If UI changes>
#### Manual Checks / Kiểm tra Thủ công
- [ ] <Specific check for CRIT-001>
- [ ] <Specific check for CRIT-002>
- [ ] <Specific check for MAJ-001>

---

### Risk Assessment / Đánh giá Rủi ro

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| <Risk 1> | Low/Med/High | <mitigation> |
| <Risk 2> | Low/Med/High | <mitigation> |

---

## ⏸️ STOP — Fix Plan Complete / DỪNG — Kế hoạch Sửa Hoàn thành

### Fix plan ready
### Kế hoạch sửa sẵn sàng

**Summary:**
- Fix Mode: <All Review Findings / Single Task T-XXX>
- Tasks Affected: <T-003, T-007 / T-XXX>
- Critical fixes: <N>
- Major fixes: <M>
- Minor fixes: <P> (optional)
- Batches: <B>

**Next Steps:**
1. Review this fix plan
2. Reply `approved` to proceed with fixes
3. Or ask questions about specific fixes

Reply `approved` to apply fixes.
Reply `adjust <finding>` to modify a fix approach.
```

---

## State Updates

```yaml
# After fix plan created
status:
  last_action: "Created fix plan for review findings"
  next_action: "Awaiting fix plan approval"
  
# For each affected task
tasks:
  T-XXX:
    status: fix-planning
    fix_plan:
      created_at: <timestamp>
      issues_count: <N>
      approved: false
  T-YYY:
    status: fix-planning
    fix_plan:
      created_at: <timestamp>
      issues_count: <M>
      approved: false
```

---

## STOP Rules

```yaml
MUST_NOT:
  - Write code changes
  - Claim issues are fixed
  - Proceed without user approval
  - Skip any critical/major finding

MUST:
  - Map ALL critical and major findings
  - Provide concrete fix descriptions
  - Include verification steps
  - Wait for user approval before applying
```

---

## Next Step

| User Response | Next Action |
|---------------|-------------|
| `approved` | Proceed to apply fixes |
| `adjust <finding>` | Modify fix approach, re-present plan |
| `skip minor` | Proceed with critical + major only |
| Questions | Clarify fix approach |

---

## 📋 CHECKPOINT — Next Prompt

```yaml
NEXT_PROMPT_ENFORCEMENT:
  after_plan_approved:
    recommended: "/code-fix-apply"
    command: "Run: /code-fix-apply"
    note: "Will apply all fixes from the approved plan"
    
  DO_NOT_SAY:
    - "Reply approved to continue"
    - "Say go to proceed"
    
  MUST_SAY:
    - "Run `/code-fix-apply` to apply the approved fixes"
```
