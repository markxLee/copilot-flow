# Workspace Setup Guide

> 🇬🇧 Complete guide for setting up the Copilot workflow system
> 🇻🇳 Hướng dẫn đầy đủ để thiết lập hệ thống workflow Copilot

---

## 📖 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Quick Setup](#-quick-setup)
3. [Step-by-Step Setup](#-step-by-step-setup)
4. [Configuration Files](#-configuration-files)
5. [Verification](#-verification)
6. [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

### Required / Bắt buộc

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| VS Code | 1.85+ | `code --version` |
| GitHub Copilot | Latest | VS Code Extensions |
| Git | 2.30+ | `git --version` |
| Node.js | 18+ | `node --version` |

### Recommended / Khuyến nghị

| Tool | Purpose |
|------|---------|
| pnpm | Package manager (monorepo support) |
| GitHub Copilot Chat | Required for prompts |

---

## 🚀 Quick Setup

For experienced users, run this single command:

```
/setup-workspace
```

This automatically runs all 4 setup steps. For detailed control, see [Step-by-Step Setup](#-step-by-step-setup).

---

## 📝 Step-by-Step Setup

### Step 1: Workspace Discovery

```
/workspace-discovery
```

**What it does:**
- Scans all workspace roots
- Detects tech stacks (Node.js, Python, etc.)
- Identifies package managers
- Discovers project structures

**Creates:** `WORKSPACE_CONTEXT.md`

**Example output:**
```yaml
roots:
  apphub-vision:
    type: monorepo
    pkg_manager: pnpm
    frameworks:
      - next.js
      - fastify
    languages:
      - typescript
      
  boost-pfs-backend:
    type: monorepo
    pkg_manager: npm
    frameworks:
      - express
    languages:
      - typescript
```

### Step 2: Cross-Root Configuration

```
/cross-root-guide
```

**What it does:**
- Analyzes relationships between roots
- Identifies shared packages
- Detects API integrations
- Maps library consumers

**Updates:** `WORKSPACE_CONTEXT.md` (Section 9)

**Example patterns detected:**
```yaml
cross_root_workflows:
  library_consumer:
    source: reviews-assets
    target: apphub-vision
    pattern: UI library → app
    
  api_integration:
    source: boost-pfs-backend
    target: apphub-vision
    pattern: Backend → Frontend
```

### Step 3: Sync Instructions

```
/sync-instructions
```

**What it does:**
- Copies shared instructions to all roots
- Detects tech stack per root
- Suggests missing instructions
- Preserves root-specific instructions

**Creates in each root:**
```
<root>/.github/instructions/
├── coding-practices.instructions.md  # ← Synced
├── typescript.instructions.md        # ← Synced
├── testing.instructions.md           # ← Synced
└── <root-specific>.instructions.md   # ← Preserved
```

**Options:**
```bash
# Sync to specific root only
/sync-instructions-to apphub-vision

# Sync except one root
/sync-instructions-except reviews-assets

# Only analyze, don't sync
/suggest-instructions
```

### Step 4: Generate Files

```
/generate-workspace-file
```

**What it does:**
- Creates VS Code workspace file
- Configures multi-root settings
- Sets up recommended extensions

**Creates:** `<name>.code-workspace`

```json
{
  "folders": [
    { "path": "copilot-flow", "name": "🔧 Copilot Flow" },
    { "path": "apphub-vision", "name": "📱 AppHub Vision" },
    { "path": "boost-pfs-backend", "name": "⚙️ Backend" }
  ],
  "settings": {
    "github.copilot.enable": { "*": true }
  }
}
```

**Optional: Generate Architecture**
```
/generate-architecture
```

Creates `ARCHITECTURE.md` with:
- System overview diagram
- Component relationships
- Data flow
- Tech stack summary

---

## 📁 Configuration Files

### WORKSPACE_CONTEXT.md

**Location:** `copilot-flow/WORKSPACE_CONTEXT.md`

**Purpose:** Central configuration for multi-root workspace

**Key sections:**
```yaml
# Section 1: Meta
meta:
  tooling_root: copilot-flow       # Where prompts/templates live
  default_docs_root: apphub-vision # Default for workflow docs

# Section 2-8: Root configurations
roots:
  apphub-vision:
    type: monorepo
    # ...

# Section 9: Cross-root workflows
cross_root_workflows:
  library_consumer:
    # ...
```

### Shared Instructions

**Location:** `copilot-flow/.github/instructions/shared/`

**Files:**
| File | Purpose |
|------|---------|
| `coding-practices.instructions.md` | Error handling, code style |
| `typescript.instructions.md` | TS conventions, types |
| `testing.instructions.md` | Test patterns, coverage |

### Workflow Templates

**Location:** `copilot-flow/docs/templates/`

**Files:**
| Template | Phase |
|----------|-------|
| `analysis.template.md` | Phase 0 |
| `spec.template.md` | Phase 1 |
| `tasks.template.md` | Phase 2 |
| `impl-log.template.md` | Phase 3 |
| `tests.template.md` | Phase 4 |
| `done.template.md` | Phase 5 |

---

## ✔️ Verification

After setup, verify everything is configured:

### Check 1: Workspace Context

```
/workflow-status
```

Should show:
```
✅ WORKSPACE_CONTEXT.md found
✅ tooling_root: copilot-flow
✅ default_docs_root: apphub-vision
✅ 4 roots configured
```

### Check 2: Instructions Synced

Check each root has instructions:
```bash
ls -la <root>/.github/instructions/
```

Expected files:
- `coding-practices.instructions.md`
- `typescript.instructions.md`
- `testing.instructions.md`

### Check 3: Workspace File

Open the generated workspace:
```bash
code <name>.code-workspace
```

All roots should appear in sidebar.

### Check 4: Test a Session

```
/init
```

Should show:
```
📍 Session initialized
   tooling_root: copilot-flow
   default_docs_root: apphub-vision
   Ready for work.
```

---

## 🆘 Troubleshooting

### Problem: "WORKSPACE_CONTEXT.md not found"

**Solution:**
```
/workspace-discovery
```

### Problem: "Instructions not syncing"

**Check:**
1. Source files exist in `copilot-flow/.github/instructions/shared/`
2. Target root has `.github/instructions/` directory
3. Run `/sync-instructions` again

### Problem: "Wrong tooling_root"

**Solution:**
Edit `WORKSPACE_CONTEXT.md`:
```yaml
meta:
  tooling_root: copilot-flow  # Fix this line
```

### Problem: "Cross-root not detected"

**Solution:**
```
/cross-root-guide
```
This re-analyzes root relationships.

### Problem: "Workspace file won't open"

**Check:**
1. File exists: `ls *.code-workspace`
2. Valid JSON: Open in text editor
3. Paths are correct (relative to workspace file location)

---

## 📚 Related Documents

- [README](../../README.md) - Main documentation
- [Multilingual Guide](multilingual.md) - Bilingual format
- [Workflow Contract](../workflow/contract.md) - Full rules

---

**Last Updated:** 2026-01-25
