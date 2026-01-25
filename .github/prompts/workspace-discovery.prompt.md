---
mode: agent
description: Scan and document multi-root workspace with machine-readable YAML format optimized for AI agent consumption
---

# Workspace Discovery & Documentation

## Trigger / Kích hoạt

- User says: `setup workspace`, `discover workspace`, `scan workspace`
- First time setting up copilot-flow in a workspace
- Adding a new root to existing workspace

## Objective

Generate a **machine-optimized** `WORKSPACE_CONTEXT.md` file that AI agents can efficiently parse and reference. Output is YAML-only, no prose, no Mermaid diagrams, no markdown tables.

---

## Full Setup Mode (`setup workspace`)

When user says `setup workspace`, run ALL setup steps in sequence:

```yaml
setup_sequence:
  1. workspace-discovery (this prompt):
     - Scan all roots
     - Generate WORKSPACE_CONTEXT.md
     
  2. cross-root-guide:
     - Auto-detect cross-root patterns
     - Save to Section 9
     
  3. sync-instructions:
     - Sync shared instructions
     - Detect tech stacks
     - Suggest missing instructions
     
  4. generate-workspace-files:
     - Generate .code-workspace file
     - Generate ARCHITECTURE.md

output_after_all:
  "## ✅ Workspace Setup Complete!
  
  | Step | Status |
  |------|--------|
  | 1. Discovery | ✅ WORKSPACE_CONTEXT.md created |
  | 2. Cross-root | ✅ Patterns saved to Section 9 |
  | 3. Sync Instructions | ✅ Synced + tech stacks analyzed |
  | 4. Workspace Files | ✅ .code-workspace + ARCHITECTURE.md |
  
  To open workspace:
  \`\`\`bash
  code <workspace_name>.code-workspace
  \`\`\`
  
  Ready to start working. Say \`init\` to begin."
```

---

## Execution Mode: Interactive Discovery

1. **Auto-analyze** what can be detected from code/config
2. **Ask clarifying questions** when relationships are ambiguous
3. **Confirm assumptions** before finalizing
4. **Generate** YAML-only output

### When to Ask Questions

Ask user when:
- Relationship between roots is ambiguous
- Can't locate package source referenced in imports  
- Business/product grouping unclear
- Sync requirements between roots unknown
- Workflow across roots not detectable

### Question Format

```
## 🔍 Clarification Needed

### Q1: [Topic]
Context: [observation]
Question: [specific question]
Options:
- (a) [option]
- (b) [option]
- (c) Other: [describe]
```

---

## Output Schema

Generate `WORKSPACE_CONTEXT.md` with this exact YAML structure:

```yaml
# WORKSPACE_CONTEXT.md
# Generated: <YYYY-MM-DD>
# Schema: v3.0
# Purpose: AI agent workspace reference (not for human reading)

# ================================================================
# SECTION 1: METADATA & QUICK LOOKUP
# Direct key-value queries - O(1) lookup
# ================================================================

meta:
  generated: <YYYY-MM-DD>
  schema_version: "3.0"
  roots_count: <number>
  primary_root: <root-name>
  tooling_root: <root-name>           # Where prompts/templates live (STATIC)
  default_docs_root: <root-name>      # Default for workflow docs (can override per-feature)

roots:
  <root-name>:
    type: <monorepo|single-repo|library|static-assets|tooling>
    role: <tooling_root|null>         # Mark if this is tooling_root
    pkg_manager: <pnpm|npm|yarn|null>
    lang: <typescript|javascript|python|scss|markdown>
    runtime: <node>=20|python>=3.11|null>
    frameworks: [<framework1>, <framework2>]
    instructions: <path-to-copilot-instructions.md|null>
    dev_cmd: <command|null>
    build_cmd: <command|null>
    test_cmd: <command|null>

# ================================================================
# SECTION 2: SYSTEM GROUPING
# Which roots belong to same product/system
# ================================================================

systems:
  <system-name>:
    roots: [<root1>, <root2>]
    primary: <root-name>
    description: <one-line-purpose>

# ================================================================
# SECTION 3: RELATIONSHIPS (Adjacency List)
# Format: source.relationships[] = {to, type, sync, via}
# NO Mermaid diagrams - use adjacency list for graph queries
# ================================================================

relationships:
  <root-name>:
    - to: <target-root>
      type: <relationship-type>
      sync: <immediate|versioned|none>
      via: <integration-point>
      confidence: <high|medium|low>

# Relationship types:
# - storybook-implementation: Design system source → App consumer
# - shared-package: Library consumed by multiple roots
# - api-consumer: Frontend consuming backend API
# - microservice-peer: Services in same architecture
# - static-assets: Asset files served/bundled
# - monorepo-internal: Packages within same monorepo
# - infra-target: Infrastructure code deploying app
# - shared-data: Roots accessing same data source

# ================================================================
# SECTION 4: PATH ROUTING
# Given file path → which root, domain, rules, related roots
# ================================================================

path_routing:
  - pattern: "<glob-pattern>"
    root: <root-name>
    domain: <frontend|backend|shared-lib|design-system|infra|docs>
    rules: [<rule-key1>, <rule-key2>]
    related_roots: [<root1>, <root2>]
    on_change_rebuild: [<package1>, <package2>]

# ================================================================
# SECTION 5: CONVENTIONS BY ROOT
# Extracted from copilot-instructions.md - key rules only
# ================================================================

conventions:
  <root-name>:
    error_handling: <pattern-description>
    imports: <pattern-description>
    types: <pattern-description>
    testing: <pattern-description>
    async: <pattern-description>
    # Add other root-specific rules

# ================================================================
# SECTION 6: PRE-COMPUTED QUERIES
# Common questions with pre-computed answers
# ================================================================

queries:
  # Q: Package manager for root X?
  pkg_manager:
    <root1>: <pnpm|npm|yarn>
    <root2>: <pnpm|npm|yarn>

  # Q: Instructions file for root X?
  instructions_path:
    <root1>: <path|null>
    <root2>: <path|null>

  # Q: If I change files matching pattern X, what else needs update?
  change_impact:
    "<glob-pattern>":
      rebuild: [<package1>, <package2>]
      update_files: [<glob-pattern>]
      sync_roots: [<root1>, <root2>]

  # Q: Build order when changing package X?
  build_order:
    <package-name>: [<dep1>, <dep2>, <package-name>, <consumer1>]

# ================================================================
# SECTION 7: CONFLICT RESOLUTION
# When conventions differ between roots
# ================================================================

conflicts:
  pkg_manager:
    values: {<root1>: pnpm, <root2>: npm}
    rule: use-root-specific
  error_handling:
    values: {<root1>: tryCatch, <root2>: try-catch}
    rule: follow-root-instructions
  test_framework:
    values: {<root1>: jest, <root2>: vitest}
    rule: follow-root-instructions

# Rule types: use-root-specific | follow-root-instructions | prefer-primary

# ================================================================
# SECTION 8: STALENESS CHECK
# Hashes for detecting when to refresh
# ================================================================

staleness:
  <root-name>:
    checked: <YYYY-MM-DD>
    hashes:
      package.json: <short-hash>
      copilot-instructions.md: <short-hash>
    watch: [package.json, tsconfig.json, .github/**]

# ================================================================
# END - Total sections: 8
# Target size: <1500 tokens
# ================================================================
```

---

## Analysis Instructions

### Phase 1: Quick Scan

For each workspace root:
1. Read `package.json` → name, scripts, dependencies
2. Check lockfile type → determine pkg_manager
3. Read `tsconfig.json` → determine language
4. Find `.github/copilot-instructions.md` → extract conventions
5. Identify monorepo signals (pnpm-workspace.yaml, turbo.json)

### Phase 2: Relationship Detection

For each root pair, check signals:

| Type | Signals |
|------|---------|
| `storybook-implementation` | `/stories/` folder + `@org/ui-*` imports in other root |
| `shared-package` | `workspace:*` in dependencies |
| `api-consumer` | API client code, env vars with URLs |
| `microservice-peer` | docker-compose links, shared API specs |
| `monorepo-internal` | Same pnpm-workspace.yaml |
| `infra-target` | CDK/Terraform referencing app outputs |

### Phase 3: Path Routing Generation

1. Map folder patterns to domains
2. Identify which conventions apply to each pattern
3. Determine related roots for each pattern
4. Pre-compute change impact

### Phase 4: Convention Extraction

From each `copilot-instructions.md`:
1. Extract error handling pattern
2. Extract import conventions
3. Extract type rules
4. Extract testing approach
5. Store as key-value pairs (no prose)

### Phase 5: Interactive Discovery

If confidence < high for any relationship:

```
## 🔍 Clarification Needed

### Q1: System Grouping
Context: Found roots [list]
Question: Which belong to same system?
Options:
- (a) All one system: [name?]
- (b) Grouped: System A=[roots], System B=[roots]
- (c) All independent

### Q2: Relationship Type  
Context: [root1] has [signal], [root2] imports [package]
Question: Relationship type?
Options:
- (a) storybook-implementation
- (b) shared-package
- (c) independent
- (d) Other: [describe]

### Q3: Sync Requirement
Context: [root1] → [root2] via [integration]
Question: When [root1] changes, must [root2] update?
Options:
- (a) immediate - same PR
- (b) versioned - publish then update
- (c) none - independent
```

### Phase 6: Confirmation

Before generating final output:

```
## ✅ Confirm Understanding

roots: [list]
systems:
  - name: [relationships detected]
relationships:
  - [root1] → [root2]: [type] (confidence: [level])
  
Correct? Reply 'yes' or provide corrections.
```

### Phase 7: Generate Output

Create `WORKSPACE_CONTEXT.md` with YAML schema above.

### Phase 8: Post-Setup Actions

After generating WORKSPACE_CONTEXT.md, prompt user for next steps:

```
## ✅ Workspace Context Created!

### 📋 Recommended Next Steps:

1. **Configure cross-root patterns** (if multi-root):
   Say: `cross-root`
   → Auto-detect library/consumer, shared packages, API integrations
   → Saves config to WORKSPACE_CONTEXT.md Section 9

2. **Sync shared instructions** (recommended):
   Say: `sync instructions`
   → Copies coding standards from copilot-flow to all roots
   → Auto-detects tech stacks and suggests missing instructions
   → Creates Python, Go, Java instructions if needed

3. **Start working**:
   Say: `init` to begin a session

Which step would you like to do? (1, 2, 3, or 'all')
```

If user says 'all':
1. Run cross-root-guide.prompt.md
2. Run sync-instructions.prompt.md
3. Show init summary

---

## Constraints

### DO
- Output YAML only (no markdown tables, no Mermaid)
- Keep total output < 1500 tokens
- Use short keys (pkg_manager not package_manager)
- Pre-compute common queries
- Mark confidence levels

### DO NOT
- Generate Mermaid diagrams (AI can't visualize)
- Write prose descriptions (waste tokens)
- Duplicate information across sections
- Include implementation details
- Read node_modules, dist, build, .next folders

---

## Output Location

Save to: `<workspace-root>/WORKSPACE_CONTEXT.md`

For multi-root workspace, save to:
- Primary root, OR
- Shared folder like `copilot-flow/`

---

## Refresh Triggers

Re-run when:
- New workspace root added
- `package.json` changed significantly
- `copilot-instructions.md` modified
- Quarterly review
- Hash mismatch in staleness section

---

## Related Prompts

| Prompt | Purpose |
|--------|---------|
| [cross-root-guide.prompt.md](cross-root-guide.prompt.md) | Configure cross-root relationships |
| [sync-instructions.prompt.md](sync-instructions.prompt.md) | Sync shared instructions + detect tech stacks |
| [init-context.prompt.md](init-context.prompt.md) | Start working session |

````
