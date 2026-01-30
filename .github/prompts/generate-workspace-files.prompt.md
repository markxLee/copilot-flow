# Generate Workspace Files / Tạo Workspace Files

> Generate .code-workspace and ARCHITECTURE.md dynamically from WORKSPACE_CONTEXT.md
> Tạo các workspace files động từ WORKSPACE_CONTEXT.md

---

## Trigger / Kích hoạt

- User says: `generate workspace file`, `create workspace file`
- User says: `generate architecture`, `create architecture`
- Part of `/setup-workspace` flow

---

## Step 1: Load Context

```yaml
source: WORKSPACE_CONTEXT.md

extract:
  - meta.tooling_root           # Where prompts/templates live (static)
  - meta.default_docs_root      # Default for workflow docs
  - All roots (names, paths, types)
  - relationships
  - conventions
  - cross_root_workflows (if exists)
```

---

## Step 2: Generate .code-workspace File

```yaml
template: <tooling_root>/docs/templates/code-workspace.template.json

process:
  1. Read template
  2. Generate folders array from roots:
     
     for each root in WORKSPACE_CONTEXT.roots:
       folders.push({
         "name": root.name,
         "path": root.relative_path  # relative to workspace file location
       })
  
  3. Keep settings from template (Copilot config)
  4. Write to: <parent_of_tooling_root>/<workspace_name>.code-workspace

output_location:
  # If tooling_root is /path/to/copilot-flow
  # Workspace file goes to /path/to/<workspace_name>.code-workspace
  
  derive_workspace_name:
    - From parent folder name
    - Or ask user: "What should the workspace be named?"

example:
  # Given roots: copilot-flow, apphub-vision, reviews-assets
  # Parent folder: boostcommerce
  # Output: /path/to/boostcommerce/boostcommerce.code-workspace
  
  {
    "folders": [
      { "name": "copilot-flow", "path": "copilot-flow" },
      { "name": "apphub-vision", "path": "apphub-vision" },
      { "name": "reviews-assets", "path": "reviews-assets" }
    ],
    "settings": { ... from template ... }
  }
```

---

## Step 3: Generate ARCHITECTURE.md

```yaml
template: <tooling_root>/docs/templates/architecture.template.md

process:
  1. Read template
  2. Replace placeholders with data from WORKSPACE_CONTEXT:
  
     <GENERATED_DATE>: Current date (YYYY-MM-DD)
     <WORKSPACE_NAME>: Parent folder name
     
     <ROOT_TREE>: Generate from roots
       ├── copilot-flow/        # <description>
       ├── apphub-vision/       # <description>
       └── reviews-assets/      # <description>
     
     <ROOT_DESCRIPTIONS>: Generate table for each root
       ### <root_name>
       | Attribute | Value |
       |-----------|-------|
       | **Purpose** | <from conventions or detect> |
       | **Type** | <type from roots> |
       | **Tech** | <frameworks from roots> |
       | **Package Manager** | <pkg_manager from roots> |
     
     <RELATIONSHIP_DIAGRAM>: Generate from relationships
       ┌─────────────────┐
       │  reviews-assets │
       └────────┬────────┘
                │ <relationship_type>
                ▼
       ┌─────────────────┐
       │  apphub-vision  │
       └─────────────────┘
     
     <RELATIONSHIP_TABLE>: From relationships section
       | From | To | Type | Sync |
       |------|----|------|------|
       | ... | ... | ... | ... |
     
     <PACKAGE_MANAGER_TABLE>: From roots
       | Root | Manager |
       |------|---------|
       | ... | ... |
     
     <ROOT_README_LINKS>: For each root
       - [<root> README](../<root>/README.md)

  3. Write to: <tooling_root>/ARCHITECTURE.md

output:
  "## ✅ Generated Workspace Files
  
  | File | Location |
  |------|----------|
  | Workspace file | <path>.code-workspace |
  | Architecture | <tooling_root>/ARCHITECTURE.md |
  
  To open workspace:
  ```bash
  code <workspace_name>.code-workspace
  ```"
```

---

## Step 4: Review/Create Root-Level ARCHITECTURE.md

For each root (except tooling_root), check and suggest root-specific architecture docs.

```yaml
for_each_root:
  root: <root_name> (skip tooling_root - it has workspace-level ARCHITECTURE.md)
  
  check: Does <root>/ARCHITECTURE.md exist?
  
  if NOT EXISTS:
    action: suggest_create
    output: |
      "### 📄 Missing: <root>/ARCHITECTURE.md
      
      This root doesn't have architecture documentation.
      Would you like me to create a starter from template?
      
      It will include:
      - Structure overview
      - Key components
      - Data flow (if applicable)
      - Development setup
      
      Reply: 'yes' / 'skip' / 'skip all'"
    
    if user says 'yes':
      1. Read root's package.json, README.md, folder structure
      2. Generate ARCHITECTURE.md from template + detected info
      3. Write to <root>/ARCHITECTURE.md
      4. Mark as "needs human review"
  
  if EXISTS:
    action: review_and_suggest
    
    review_checklist:
      1. Read existing ARCHITECTURE.md
      2. Compare with current codebase:
         - Are all major folders documented?
         - Are dependencies up to date?
         - Is tech stack accurate?
         - Are there new components not documented?
      3. Check freshness:
         - Look for date/version markers
         - Compare with recent significant changes (package.json, new folders)
    
    scoring:
      complete: All major sections filled, matches codebase
      outdated: Content exists but doesn't match current state
      incomplete: Missing major sections
    
    output_if_issues_found: |
      "### 📋 Review: <root>/ARCHITECTURE.md
      
      | Check | Status |
      |-------|--------|
      | Structure documented | ✅/⚠️/❌ |
      | Tech stack accurate | ✅/⚠️/❌ |
      | Components complete | ✅/⚠️/❌ |
      | Recently updated | ✅/⚠️/❌ |
      
      **Suggested updates:**
      1. <specific suggestion>
      2. <specific suggestion>
      
      Would you like me to apply these updates?
      Reply: 'yes' / 'show diff' / 'skip'"
    
    output_if_good: |
      "### ✅ <root>/ARCHITECTURE.md
      Architecture doc looks complete and up-to-date."

summary_output: |
  "## 📚 Root Architecture Status
  
  | Root | Status | Action |
  |------|--------|--------|
  | apphub-vision | ⚠️ Outdated | Updated tech stack |
  | reviews-assets | ❌ Missing | Created from template |
  | boost-pfs-backend | ✅ Good | No changes |
  
  **Note:** Generated/updated docs are marked for human review.
  Please verify accuracy before committing."
```

---

## Step 5: Regeneration

```yaml
when_to_regenerate:
  - After running workspace-discovery (roots changed)
  - After running cross-root-guide (relationships changed)
  - User says `regenerate workspace files`

auto_regenerate:
  # Part of /setup-workspace flow
  # After discovery completes, auto-generate these files
```

---

## Placeholders Reference

| Placeholder | Source |
|-------------|--------|
| `<GENERATED_DATE>` | Current date |
| `<WORKSPACE_NAME>` | Parent folder name |
| `<TOOLING_ROOT>` | meta.tooling_root |
| `<ROOT_TREE>` | roots section |
| `<ROOT_DESCRIPTIONS>` | roots + conventions |
| `<RELATIONSHIP_DIAGRAM>` | relationships section |
| `<RELATIONSHIP_TABLE>` | relationships section |
| `<ADR_LIST>` | Ask user or leave placeholder |
| `<DATA_FLOW_DIAGRAM>` | Ask user or leave placeholder |
| `<PACKAGE_MANAGER_TABLE>` | roots.pkg_manager |
| `<ROOT_README_LINKS>` | Generate from roots |

---

## Quick Commands

| Command | Action |
|---------|--------|
| `generate workspace file` | Create/update .code-workspace |
| `generate architecture` | Create/update ARCHITECTURE.md |
| `regenerate workspace files` | Regenerate both |

---

## Related Prompts

- [workspace-discovery.prompt.md](workspace-discovery.prompt.md) - Discover roots
- [cross-root-guide.prompt.md](cross-root-guide.prompt.md) - Configure relationships

