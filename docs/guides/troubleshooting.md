# Troubleshooting Guide
<!-- Version: 1.0 | Last Updated: 2026-02-01 -->

Common issues and solutions when using copilot-flow.

---

## Quick Diagnostics

```bash
# Check workflow state
/workflow-status

# Verify context is loaded
/cf-init

# Reset if context seems corrupted
/cf-context-reset
```

---

## Common Issues

### 1. "File not found" Errors

**Symptom**: Copilot says it can't find `spec.md`, `tasks.md`, or other workflow files.

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Wrong `docs_root` | Check `.workflow-state.yaml` → `meta.docs_root` |
| Branch mismatch | Verify you're on correct git branch |
| Workflow not initialized | Run `/init` then start workflow |
| Typo in path | Check exact path in state file |

**Quick Fix**:
```bash
# Re-initialize context
/init

# If still broken, check state file manually
cat <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
```

---

### 2. Phase Skipping / Wrong Phase

**Symptom**: Copilot tries to skip phases or work on wrong phase.

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Generic commands used | Use explicit prompts: `/phase-X-name` |
| Context window overflow | Run `/cf-context-reset` |
| State file out of sync | Check `status.current_phase` in state file |

**Prevention**:
- ❌ Don't say: "go", "continue", "next"
- ✅ Do say: `/phase-2-tasks`, `/phase-3-impl T-001`

---

### 3. Task Dependencies Not Respected

**Symptom**: Copilot tries to implement T-003 before T-001 is complete.

**Solution**:
1. Check `tasks.md` for dependency graph
2. Verify in state file: `phases.phase_3_impl.tasks[].status`
3. Complete dependencies first: `/phase-3-impl T-001`

---

### 4. Cross-Root Build Order Wrong

**Symptom**: Consumer app fails because library wasn't rebuilt.

**Solution**:
1. Check `WORKSPACE_CONTEXT.md` Section 9: `multi_root_build_order`
2. Follow build order: library → consumer
3. Add explicit sync tasks in Phase 2

**Example**:
```yaml
# Wrong order
T-001: Update dashboard (apphub-vision)
T-002: Update Button (reviews-assets)

# Correct order
T-001: Update Button (reviews-assets)
T-002: Build reviews-assets: npm run build
T-003: Update dashboard (apphub-vision)
```

---

### 5. Code Review Shows Too Many Changes

**Symptom**: `/code-review` shows unrelated files or entire codebase.

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Wrong `base_branch` | Update `meta.base_branch` in state file |
| Uncommitted changes from other work | Stash or commit unrelated changes |
| Long-running branch | Rebase on latest base branch |

**Quick Fix**:
```bash
# Check what base branch is set
grep base_branch .workflow-state.yaml

# Update if wrong (in state file)
meta:
  base_branch: develop  # Change from 'main' if needed
```

---

### 6. TDD Mode Not Working

**Symptom**: Phase 3 doesn't ask for tests first.

**Solution**:
1. Check `meta.dev_mode` in state file - should be `tdd`
2. If wrong, update manually or restart workflow
3. Ensure Test Plan exists in `02_tasks/tasks.md` Section 7

---

### 7. Context Window Overflow

**Symptom**: 
- Copilot starts hallucinating
- Responses become inconsistent
- Files get mixed up

**Solution**:
```bash
# Run context hygiene
/cf-context-reset

# Or manually:
1. Start new chat session
2. Run /cf-init to reload context
3. Run /workflow-resume to continue
```

**Prevention**:
- Keep conversations focused
- Use explicit prompts
- Commit and start fresh chat periodically

---

### 8. State File Corrupted

**Symptom**: YAML parse errors or missing fields.

**Solution**:
1. Validate YAML syntax:
   ```bash
   # Online: yamllint.com
   # Or install: pip install yamllint && yamllint .workflow-state.yaml
   ```
2. Compare with template: `docs/templates/workflow-state.template.yaml`
3. Fix or regenerate corrupted sections

---

### 9. Wrong Artifact Names

**Symptom**: Looking for `analysis.md` but file is `solution-design.md`.

**Background**: 
- **Canonical name**: `solution-design.md` (Phase 0 output)
- **Legacy alias**: `analysis.md` (older workflows)

**Solution**: Use `solution-design.md` for new workflows. Legacy alias is accepted for backward compatibility.

---

### 10. Approval Gate Not Stopping

**Symptom**: Copilot continues without waiting for approval.

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Ambiguous response | Say explicitly: `approved` or `revise: <feedback>` |
| Context confusion | Use explicit prompts after approval |

**Example**:
```
# After Phase 2 complete
You: approved
You: /phase-3-impl T-001   ← Explicit next step
```

---

## Recovery Commands

| Situation | Command |
|-----------|---------|
| Lost context | `/cf-init` |
| Resume workflow | `/workflow-resume` |
| Check status | `/workflow-status` |
| Reset context | `/cf-context-reset` |
| Fix state issues | Edit `.workflow-state.yaml` manually |

---

## Getting Help

1. **Check this guide** for common issues
2. **Run `/workflow-status`** to see current state
3. **Check state file** for actual values
4. **Compare with templates** in `docs/templates/`
5. **Read workflow-example.md** for expected flow

---

## Reporting Issues

If you find a bug in copilot-flow:

1. Note the exact error/behavior
2. Save the state file
3. Note which prompt was running
4. Check if issue is reproducible
5. Create issue with details

---

**Version**: 1.0  
**Last Updated**: 2026-02-01
