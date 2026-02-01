---
mode: agent
description: Incrementally update WORKSPACE_CONTEXT.md when a new workspace root is added
---
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

# Workspace Context Update: New Root Added

## Objective

Incrementally update `WORKSPACE_CONTEXT.md` when a new workspace root is added. This is an **incremental update**, not a full re-scan. Only analyze the new root and its relationships to existing roots.

---

## Trigger Detection

This prompt should run when:
- User adds a new folder to multi-root workspace
- User explicitly requests: "update workspace context" or "add new root"
- Detected new folder not present in existing `WORKSPACE_CONTEXT.md`

---

## Execution Flow

```
1. READ existing WORKSPACE_CONTEXT.md
2. DETECT new root(s) not in context
3. SCAN new root only
4. DETECT relationships to existing roots
5. ASK if relationships unclear
6. MERGE into existing context
7. UPDATE staleness hashes
8. SAVE updated WORKSPACE_CONTEXT.md
```

---

## Phase 1: Load Existing Context

```yaml
# Read and parse existing WORKSPACE_CONTEXT.md
existing:
  roots: [<list from meta.roots>]
  systems: [<list from systems section>]
  relationships: <existing relationship map>
```

## Phase 2: Detect New Root

Compare workspace folders vs `existing.roots`:

```yaml
workspace_folders: [<current VS Code workspace roots>]
existing_roots: [<from WORKSPACE_CONTEXT.md>]
new_roots: [<folders in workspace but not in context>]
removed_roots: [<roots in context but not in workspace>]
```

If `new_roots` is empty and `removed_roots` is empty:
→ Output: "No changes detected. WORKSPACE_CONTEXT.md is up to date."

---

## Phase 3: Scan New Root

For each new root, extract:

```yaml
<new-root-name>:
  type: <monorepo|single-repo|library|static-assets|documentation>
  pkg_manager: <pnpm|npm|yarn|null>
  lang: <typescript|javascript|python|scss|markdown>
  runtime: <version-requirement|null>
  frameworks: [<detected-frameworks>]
  instructions: <path-to-copilot-instructions.md|null>
  dev_cmd: <from-package.json-scripts|null>
  build_cmd: <from-package.json-scripts|null>
  test_cmd: <from-package.json-scripts|null>
```

Scan checklist:
- [ ] `package.json` → name, scripts, dependencies
- [ ] Lockfile type → pkg_manager
- [ ] `tsconfig.json` / `jsconfig.json` → language
- [ ] `.github/copilot-instructions.md` → conventions
- [ ] `pnpm-workspace.yaml` / `turbo.json` → monorepo signals
- [ ] `docker-compose.yml` / `kubernetes/` → infra signals
- [ ] `/stories/` / `/storybook/` → design system signals

---

## Phase 4: Detect Relationships

Check new root against EACH existing root:

### 4.1 Signals to Check

| Signal | Check | Relationship Type |
|--------|-------|-------------------|
| Package imports | Does new root import `@org/*` from existing root? | `shared-package` |
| Package exports | Does existing root import from new root's packages? | `shared-package` |
| UI package | Does new root have `/stories/` and existing imports `@org/ui-*`? | `storybook-implementation` |
| API references | Does new root have API URLs pointing to existing root? | `api-consumer` |
| Docker links | Does docker-compose link new root to existing? | `microservice-peer` |
| Shared org | Does new root use same `@org/` namespace? | Likely same system |
| CDK/Terraform | Does new root's infra reference existing root? | `infra-target` |

### 4.2 Relationship Template

```yaml
new_relationships:
  <new-root>:
    - to: <existing-root>
      type: <relationship-type>
      sync: <immediate|versioned|none>
      via: <integration-point>
      confidence: <high|medium|low>
```

---

## Phase 5: Interactive Clarification

If any relationship has `confidence: low` or `confidence: medium`:

```
## 🔍 New Root Detected: `<new-root-name>`

### Scan Results
- Type: <detected-type>
- Language: <detected-lang>
- Frameworks: <detected-frameworks>

### Potential Relationships Detected

| Existing Root | Signal Found | Possible Type | Confidence |
|---------------|--------------|---------------|------------|
| <root1> | <signal> | <type> | <level> |
| <root2> | <signal> | <type> | <level> |

### Questions

**Q1: System Grouping**
Does `<new-root>` belong to an existing system?
- (a) Yes, add to system: `<system-name>`
- (b) Yes, create new system: [name?]
- (c) Independent, no system

**Q2: Relationship to `<existing-root>`**
Context: <what was detected>
- (a) <suggested-type>
- (b) Different: [describe]
- (c) No relationship

**Q3: Sync Requirements**
When `<new-root>` changes, does `<existing-root>` need update?
- (a) immediate
- (b) versioned
- (c) none
```

---

## Phase 6: Generate Update Patch

Instead of regenerating entire file, generate a **patch** showing what to add/modify:

```yaml
# WORKSPACE_CONTEXT.md UPDATE PATCH
# Generated: <YYYY-MM-DD>
# Action: Add new root "<new-root-name>"

patch:
  meta:
    roots_count: <old + 1>
  
  roots:
    ADD:
      <new-root-name>:
        type: <type>
        pkg_manager: <pm>
        lang: <lang>
        runtime: <runtime>
        frameworks: [<frameworks>]
        instructions: <path|null>
        dev_cmd: <cmd>
        build_cmd: <cmd>
        test_cmd: <cmd>
  
  systems:
    MODIFY:
      <system-name>:
        roots: [<existing>, <new-root-name>]  # Added
    # OR
    ADD:
      <new-system-name>:
        roots: [<new-root-name>]
        primary: <new-root-name>
        description: <purpose>
  
  relationships:
    ADD:
      <new-root-name>:
        - to: <existing-root>
          type: <type>
          sync: <sync>
          via: <via>
          confidence: high  # After user confirmation
    MODIFY:
      <existing-root>:
        - to: <new-root-name>  # Add reverse relationship
          type: <reverse-type>
          sync: <sync>
          via: <via>
          confidence: high
  
  path_routing:
    ADD:
      - pattern: "<new-root>/**"
        root: <new-root-name>
        domain: <domain>
        rules: [<rules>]
        related_roots: [<related>]
  
  conventions:
    ADD:
      <new-root-name>:
        error_handling: <pattern>
        imports: <pattern>
        # ... extracted from instructions
  
  queries:
    pkg_manager:
      ADD: {<new-root-name>: <pm>}
    instructions_path:
      ADD: {<new-root-name>: <path|null>}
    change_impact:
      ADD:
        "<new-root>/**":
          rebuild: [<packages>]
          sync_roots: [<roots>]
  
  staleness:
    ADD:
      <new-root-name>:
        checked: <YYYY-MM-DD>
        hashes:
          package.json: <hash>
          copilot-instructions.md: <hash>
        watch: [package.json, tsconfig.json, .github/**]
```

---

## Phase 7: Apply Patch

After user confirms, apply patch to `WORKSPACE_CONTEXT.md`:

1. Read existing file
2. Parse YAML
3. Apply ADD/MODIFY operations
4. Update `meta.generated` date
5. Write back to file

---

## Handling Removed Roots

If `removed_roots` is not empty:

```
## ⚠️ Root Removed: `<removed-root>`

The root `<removed-root>` exists in WORKSPACE_CONTEXT.md but is no longer in workspace.

**Action**:
- (a) Remove from context (cleanup)
- (b) Keep in context (temporary removal)
```

If remove:
```yaml
patch:
  meta:
    roots_count: <old - 1>
  roots:
    REMOVE: [<removed-root>]
  systems:
    MODIFY:
      <system-name>:
        roots: [<remaining-roots>]  # Remove from list
  relationships:
    REMOVE: <removed-root>  # Remove all relationships involving this root
  # ... remove from all sections
```

---

## Constraints

### DO
- Only scan new root (not existing roots)
- Generate patch format (not full regeneration)
- Ask about relationships with low confidence
- Update staleness hashes

### DO NOT
- Re-scan existing roots
- Regenerate entire WORKSPACE_CONTEXT.md
- Assume relationships without signals

---

## Output Format

Final output should be the **updated WORKSPACE_CONTEXT.md** with all patches applied, maintaining the same YAML schema as the original.

---

## Quick Reference: Relationship Types

| Type | Direction | Sync | Example |
|------|-----------|------|---------|
| `storybook-implementation` | source→consumer | versioned | UI lib → App |
| `shared-package` | provider→consumer | versioned | utils → apps |
| `api-consumer` | backend→frontend | immediate | API → Dashboard |
| `microservice-peer` | bidirectional | none | Service A ↔ Service B |
| `monorepo-internal` | within-mono | immediate | packages → apps |
| `infra-target` | infra→app | none | CDK → Apps |
| `shared-data` | bidirectional | none | Services sharing DB |
