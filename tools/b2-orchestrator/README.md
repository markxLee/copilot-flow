# B2 Orchestrator — Deep Dive CLI for External LLM Execution

## Important Notice

This CLI calls an external LLM API (OpenAI or OpenAI-compatible via `OPENAI_BASE_URL`). It does **not** use the VS Code GitHub Copilot backend/subscription. You must provide your own API credentials and accept separate billing and data-sharing with your chosen provider.

For Copilot-only deep dive (no external API), use **Option A** via `/deep-dive` commands in chat.

---

## Features

- **Single Role Execution**: Run one perspective at a time
- **Parallel Execution**: Run multiple roles simultaneously  
- **Session Management**: Append turns to an existing session log
- **Per-Role Models**: Use different models for different roles
- **Synthesis**: Generate consensus from all session turns
- **Legacy Pipeline**: Full 5-worker pipeline (backward compatible)

---

## Quick Start

### 1. Configure Environment

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL_DEFAULT="gpt-4.1"  # Default model

# Optional: Per-role model overrides
export B2_MODEL_ARCHITECT="claude-sonnet"
export B2_MODEL_CRITIC="gpt-4o"
export B2_MODEL_SECURITY="claude-sonnet"
export B2_MODEL_STRICT="gpt-4.1"
export B2_MODEL_CONSENSUS="claude-sonnet"

# Optional: Custom API endpoint (for Azure, local models, etc.)
export OPENAI_BASE_URL="https://your-endpoint.com/v1"
```

### 2. Run Commands

```bash
# Start a new session with architect role
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --role architect \
  --append-to docs/runs/my-feature/deep-dive.md \
  --context docs/runs/my-feature/00_analysis/ \
  --title "My Feature Analysis"

# Add critic perspective
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --role critic \
  --append-to docs/runs/my-feature/deep-dive.md

# Run 3 roles in parallel with different models
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --roles architect,critic,security \
  --model architect:claude-sonnet \
  --model critic:gpt-4o \
  --model security:claude-sonnet \
  --append-to docs/runs/my-feature/deep-dive.md

# Synthesize all turns into consensus
node tools/b2-orchestrator/b2-orchestrator.mjs \
  --synthesize docs/runs/my-feature/deep-dive.md
```

---

## Commands Reference

### Single Role

```bash
node b2-orchestrator.mjs --role <role> [options]
```

| Option | Description |
|--------|-------------|
| `--role <name>` | Role to run: `architect`, `critic`, `security`, `strict`, `consensus`, `custom:<name>` |
| `--append-to <file>` | Append turn to existing session file |
| `--context <path>` | Load context from file/directory (repeatable) |
| `--model <role:model>` | Override model for this role |
| `--title <string>` | Title for new session |
| `--out <file>` | Output to standalone file (not appending) |

### Parallel Roles

```bash
node b2-orchestrator.mjs --roles <role1,role2,...> [options]
```

Runs multiple roles simultaneously. Same options as single role.

### Synthesize

```bash
node b2-orchestrator.mjs --synthesize <session-file>
```

Generates consensus from all turns in the session.

### Legacy Pipeline

```bash
node b2-orchestrator.mjs --phase <0|1|5> --title <title> --input <file> --out <file>
```

Runs the full 5-worker pipeline (architect → critic → security → strict → consensus).

---

## Available Roles

| Role | Description |
|------|-------------|
| `architect` | Technical design, components, tradeoffs |
| `critic` | Find flaws, edge cases, risks |
| `security` | Threats, mitigations, compliance |
| `strict` | Pass/fail verdict, non-negotiables |
| `consensus` | Merge perspectives, make decision |
| `custom:<name>` | User-defined role (e.g., `custom:performance-expert`) |

---

## Session Log Format

The orchestrator creates/appends to markdown session logs:

```markdown
# Deep Dive Session: My Feature
Phase: 0
Started: 2024-01-15T10:00:00Z
Problem: My Feature Analysis

---

## Turn 1: Architect
**Model**: claude-sonnet
**Timestamp**: 2024-01-15T10:05:00Z

<analysis content>

---

## Turn 2: Critic
**Model**: gpt-4o
**Timestamp**: 2024-01-15T10:10:00Z

<analysis content>

---

## Synthesis
**Generated**: 2024-01-15T10:20:00Z

<consensus content>
```

---

## Integration with Deep Dive Workflow

This CLI is the **Option B** backend for the `/deep-dive` prompt:

1. User starts session in chat: `/deep-dive start phase:0`
2. User runs CLI for external LLM: `./b2-orchestrator.mjs --role architect --append-to session.md`
3. User can mix Option A (in-chat) and Option B (CLI) turns
4. User synthesizes: `./b2-orchestrator.mjs --synthesize session.md`
5. User ends session in chat: `/deep-dive end`

---

## Examples

### Full Analysis Session

```bash
# 1. Run architect
node b2-orchestrator.mjs \
  --role architect \
  --append-to ./analysis.md \
  --context ./docs/work-description.md \
  --title "Payment Gateway Integration"

# 2. Add critic and security in parallel
node b2-orchestrator.mjs \
  --roles critic,security \
  --append-to ./analysis.md

# 3. Add strict review
node b2-orchestrator.mjs \
  --role strict \
  --append-to ./analysis.md

# 4. Synthesize
node b2-orchestrator.mjs --synthesize ./analysis.md
```

### Custom Role

```bash
node b2-orchestrator.mjs \
  --role custom:database-expert \
  --append-to ./analysis.md \
  --context ./schema.sql
```

### Different Models per Role

```bash
node b2-orchestrator.mjs \
  --roles architect,critic,security \
  --model architect:claude-3-opus \
  --model critic:gpt-4o \
  --model security:claude-3-sonnet \
  --append-to ./analysis.md
```

---

## Notes

- This CLI is a **skeleton** that can be adapted for Azure OpenAI, local models, or other providers
- The session format is compatible with the in-chat `/deep-dive` commands
- Custom roles work but don't have predefined prompts - provide good context
