# Command Reference
<!-- Version: 1.0 | Last Updated: 2026-02-01 -->
<!-- This is the SINGLE SOURCE OF TRUTH for all commands -->

Complete reference for all copilot-flow commands.

---

## Quick Reference Card

### Session Management

| Command | Description |
|---------|-------------|
| `/cf-init` | Initialize session, load workspace context |
| `/workflow-status` | Show current workflow state |
| `/workflow-resume` | Resume from saved state |
| `/cf-context-reset` | Reset context if confused |
| `/quick-ref` | Show quick reference card |

### Workflow Orchestration

| Command | Description |
|---------|-------------|
| `/solo-orchestrator` | Auto-pick Lite vs Governed mode |
| `/lite-mode <desc>` | Quick task without full workflow |
| `/setup-workspace` | Full workspace setup |

### Work Intake (Pre-Phase 0)

| Command | Description |
|---------|-------------|
| `/work-intake` | Capture work description |
| `/work-review` | Review work readiness (READY/NOT READY) |
| `/work-update` | Handle requirement changes mid-workflow |

### Phase Commands

| Command | Phase | Description |
|---------|-------|-------------|
| `/phase-0-analysis` | 0 | Start analysis & design |
| `/phase-1-spec` | 1 | Start specification |
| `/spec-review` | 1 | Review spec quality |
| `/phase-2-tasks` | 2 | Start task planning |
| `/task-plan-review` | 2 | Review task plan |
| `/phase-3-impl T-XXX` | 3 | Implement specific task |
| `/phase-3-impl next` | 3 | Implement next pending task |
| `/impl go` | 3 | Proceed after plan approval |
| `/impl approved` | 3 | Mark task complete (skip AI review) |
| `/phase-4-tests` | 4 | Start testing phase |
| `/test-verify` | 4 | Verify test results |
| `/phase-5-done` | 5 | Start done check |

### Review Commands

| Command | Description |
|---------|-------------|
| `/code-review T-XXX` | Review specific task |
| `/code-review` | Batch review all completed tasks |
| `/strict-review` | Brutal honest review |
| `/verify-checks` | Run automated quality checks |

### Fix Commands

| Command | Description |
|---------|-------------|
| `/code-fix-plan` | Plan fixes for review findings |
| `/code-fix-apply` | Apply approved fixes |
| `/rollback` | Rollback changes if needed |

### Task Management

| Command | Description |
|---------|-------------|
| `/add-task` | Add new task mid-workflow |

### Deep Dive (Multi-Perspective Analysis)

| Command | Description |
|---------|-------------|
| `/deep-dive` | Start multi-perspective analysis session |

**Deep Dive Roles**:
- `architect` - System design perspective
- `critic` - Find weaknesses
- `security` - Security analysis
- `strict` - Strict code review
- `consensus` - Synthesize all perspectives

### PR & Release

| Command | Description |
|---------|-------------|
| `/pr-description` | Generate PR description |
| `/pr-notify-reviewers` | Notify reviewers |

### Setup Commands

| Command | Description |
|---------|-------------|
| `/setup-workspace` | Run full setup |
| `/workspace-discovery` | Scan workspace, create WORKSPACE_CONTEXT.md |
| `/workspace-update-root` | Update specific root config |
| `/cross-root-guide` | Configure cross-root relationships |
| `/sync-instructions` | Sync shared instructions |
| `/sync-vscode-settings` | Sync VS Code settings |
| `/generate-workspace-files` | Generate workspace files |

---

## Command Details

### Phase 3 Implementation Commands

```yaml
# Start specific task
/phase-3-impl T-001

# Start next incomplete task
/phase-3-impl next

# After planning approval, proceed with implementation
/impl go

# After manual testing, mark complete (skip AI review)
/impl approved
```

### Code Review Commands

```yaml
# Review single task (after implementation)
/code-review T-001

# Batch review all completed tasks
/code-review

# Options in review:
# - APPROVE: Task is good
# - REQUEST_CHANGES: Need fixes
```

### Approval Responses

| Response | Meaning |
|----------|---------|
| `approved` | Proceed to next phase/task |
| `revise: <feedback>` | Need changes before proceeding |
| `next` | Continue to next task (Phase 3) |
| `pause` | Stop implementation |

---

## Command Flow Diagram

```
/cf-init
  │
  ├─► /solo-orchestrator ─► Auto-pick mode
  │
  ├─► /lite-mode <desc> ─► Quick task (no phases)
  │
  └─► /work-intake ─► /work-review
        │
        ▼
      /phase-0-analysis ─► approved
        │
        ▼
      /phase-1-spec ─► /spec-review ─► approved
        │
        ▼
      /phase-2-tasks ─► /task-plan-review ─► approved
        │
        ▼
      /phase-3-impl T-001 ─► /impl go ─► /code-review T-001
        │                                      │
        ▼                                      ▼
      /phase-3-impl next ... (repeat) ─► approved
        │
        ▼
      /phase-4-tests ─► /test-verify ─► approved
        │
        ▼
      /phase-5-done ─► approved ─► ✅ Complete
```

---

## Invalid Commands (Don't Use)

These generic commands may cause phase skipping or context confusion:

| ❌ Don't Use | ✅ Use Instead |
|--------------|----------------|
| `go` | `/impl go` or `/phase-X-name` |
| `continue` | `/phase-3-impl next` |
| `next` | `/phase-3-impl next` |
| `implement` | `/phase-3-impl T-XXX` |
| `test` | `/phase-4-tests` |
| `done` | `/phase-5-done` |

---

## Troubleshooting

See [troubleshooting.md](troubleshooting.md) for common issues and solutions.

---

**Version**: 1.0  
**Last Updated**: 2026-02-01
