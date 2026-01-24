# Workspace Architecture Overview

> **AUTO-GENERATED** from WORKSPACE_CONTEXT.md
> Run `generate architecture` to regenerate
> Last updated: <GENERATED_DATE>

---

## 🗺️ Workspace Map

```
<WORKSPACE_NAME>/
<ROOT_TREE>
```

---

## 📦 Root Descriptions

<ROOT_DESCRIPTIONS>

---

## 🔗 Cross-Root Relationships

```
<RELATIONSHIP_DIAGRAM>
```

### Relationship Types

<RELATIONSHIP_TABLE>

---

## 🏗️ Key Architectural Decisions

<ADR_LIST>

---

## 📊 Data Flow

<DATA_FLOW_DIAGRAM>

---

## 🔧 Development Workflow

### Setup (One-time)
```bash
# 1. Open workspace
code <WORKSPACE_FILE>

# 2. Run setup
> setup workspace
# This runs: discovery → cross-root → sync instructions
```

### Daily Development
```bash
# 1. Start session
> init

# 2. Check for existing workflow
> status

# 3. Start new work
> lite: <description>  # Simple tasks
# OR
> <describe work>      # Complex tasks (full workflow)
```

---

## 📁 Key File Locations

| What | Where |
|------|-------|
| Workspace file | `<WORKSPACE_FILE>` |
| Workspace context | `<IMPL_ROOT>/WORKSPACE_CONTEXT.md` |
| Workflow contract | `<IMPL_ROOT>/docs/workflow/contract.md` |
| Shared instructions | `<IMPL_ROOT>/.github/instructions/shared/` |
| Prompts | `<IMPL_ROOT>/.github/prompts/` |

---

## 🚀 Quick Reference

### Commands
| Command | Action |
|---------|--------|
| `setup workspace` | Full setup (discovery + cross-root + sync) |
| `sync instructions` | Sync shared instructions + detect tech |
| `cross-root` | Configure cross-root patterns |
| `init` | Start working session |
| `status` | Check workflow status |

### Package Managers
<PACKAGE_MANAGER_TABLE>

---

## 📚 Related Documentation

- [Workflow Contract](<IMPL_ROOT>/docs/workflow/contract.md)
- [WORKSPACE_CONTEXT.md](<IMPL_ROOT>/WORKSPACE_CONTEXT.md)
<ROOT_README_LINKS>
