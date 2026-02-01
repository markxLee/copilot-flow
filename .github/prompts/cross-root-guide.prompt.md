# Cross-Root Auto-Config
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

> **AUTO-ANALYZE** workspace roots, **ASK** if unclear, then **SAVE**.
>
> This prompt auto-detects what it can, and asks the user to clarify uncertain parts.

---

## 🎯 Purpose

When triggered, Copilot will:
1. **Auto-scan** all workspace roots
2. **Auto-detect** cross-root patterns (high confidence)
3. **Ask user** to clarify uncertain patterns (low confidence)
4. **Save** accurate config to WORKSPACE_CONTEXT.md (Section 9)

---

## Trigger

- User says: `cross-root`, `configure cross-root`, `setup roots`
- First time setting up workspace
- Need to refresh/update cross-root config

---

## Step 1: Scan All Roots

```yaml
actions:
  1. List all workspace roots:
     - Use VS Code workspace folders
     - Or scan parent directory for known roots
     
  2. For EACH root, gather:
     root_info:
       name: <folder name>
       path: <absolute path>
       type: <detect from files below>
       package_manager: <npm/pnpm/yarn>
       
  3. Detect root type by checking files:
     monorepo: pnpm-workspace.yaml OR turbo.json OR lerna.json
     library: has exports in package.json, has dist/ or build/
     backend: has routes/, api/, server files
     frontend: has next.config, vite.config, src/pages
     docs_only: mostly .md files, has docs/
```

---

## Step 2: Auto-Detect Patterns

For each pattern, assign a **confidence level**:
- ✅ **HIGH**: Clear evidence found → auto-include in config
- ⚠️ **MEDIUM**: Some evidence but unclear → ask user to confirm
- ❓ **LOW/NONE**: No clear evidence → ask user if pattern exists

### Pattern 1: Library → Consumer

```yaml
detection_logic:
  1. Find roots with publishable packages:
     - Check package.json for "name" starting with @
     - Check for "exports" or "main" field
     - Check for build output (dist/, build/, lib/)
     
  2. Find consumers:
     - Scan other roots' package.json dependencies
     - Match against library package names
     
  3. Assign confidence:
     HIGH: Found exact package name in both library and consumer
     MEDIUM: Found library but consumer dependency unclear
     LOW: No clear library/consumer relationship found

  4. If HIGH confidence:
     → Auto-include in config
     
  5. If MEDIUM confidence:
     → Ask: "I found `reviews-assets` exports `@apphubdev/clearer-ui`.
             Does `apphub-vision` consume this? Which apps? (dashboard, billing, ...)"
             
  6. If LOW confidence:
     → Ask: "Do any roots provide libraries that others import?
             Example: root-A provides @package/name → root-B uses it"

example_high_confidence:
  # Copilot finds clear evidence:
  # - reviews-assets/package.json: "name": "@apphubdev/clearer-ui"
  # - apphub-vision/apps/dashboard/package.json: "@apphubdev/clearer-ui": "^1.0.0"
  
  # Result: AUTO-INCLUDE
  library_consumer:
    - library:
        root: reviews-assets
        package: "@apphubdev/clearer-ui"
      consumers:
        - root: apphub-vision
          apps: ["dashboard"]  # Found in dashboard, ask about others
```

### Pattern 2: Shared Packages (Internal)

```yaml
detection_logic:
  1. Find monorepo with packages/ directory:
     - Check for workspace packages
     - Look for @<scope>/* pattern
     
  2. Assign confidence:
     HIGH: Found packages/ with clear workspace config
     MEDIUM: Found packages/ but unclear scope
     LOW: No packages/ directory
     
  3. If MEDIUM:
     → Ask: "I found these internal packages in `apphub-vision`:
             @clearer/utils, @clearer/core, @clearer/types
             Are there others I missed?"

example_high_confidence:
  # Copilot finds in apphub-vision/packages/:
  #   - utils/ (package: @clearer/utils)
  #   - core/ (package: @clearer/core)
  
  # Result: AUTO-INCLUDE
  shared_packages:
    - provider:
        root: apphub-vision
        packages: ["@clearer/utils", "@clearer/core"]
```

### Pattern 3: API Integration

```yaml
detection_logic:
  1. Find backend roots:
     - Has server files (app.ts, server.ts with express/fastify)
     - Has routes/ or api/ directory
     
  2. Find potential consumers:
     - Has fetch calls, API clients
     - Environment vars with API URLs
     
  3. Assign confidence:
     HIGH: Clear API routes + matching fetch calls in consumer
     MEDIUM: Backend found but consumer unclear
     LOW: No clear API integration pattern
     
  4. If MEDIUM/LOW:
     → Ask: "I found `boost-pfs-backend` has API endpoints.
             Which roots consume these APIs? (apphub-vision, others?)"

example_medium_confidence:
  # Copilot finds:
  # - boost-pfs-backend has routes/ directory
  # - But can't clearly trace which root calls these APIs
  
  # Result: ASK USER
  # "Does `apphub-vision` call APIs from `boost-pfs-backend`?
  #  Or are there other API relationships I should know about?"
```

---

## Step 3: Auto-Determine Build Order

```yaml
logic:
  1. Libraries/providers build FIRST
  2. Consumers/dependents build SECOND
  3. Docs roots don't need build order
  
  algorithm:
    - Start with roots that have no dependencies
    - Then roots that depend on those
    - Topological sort based on detected patterns
    
  confidence:
    HIGH: Clear dependency chain from detected patterns
    MEDIUM: Some dependencies unclear
    
  if_medium:
    → Ask: "Based on patterns, I suggest this build order:
            1. reviews-assets
            2. apphub-vision
            Is this correct? Should any other root be included?"

example:
  # Based on detected patterns:
  # - reviews-assets provides library
  # - apphub-vision consumes library
  
  # Result:
  multi_root_build_order:
    sequence:
      - reviews-assets    # Library first
      - apphub-vision     # Consumer second
    reason: "Libraries must build before consumers"
```

---

## Step 4: Auto-Determine PR Strategy

```yaml
logic:
  based_on_patterns:
    - If library→consumer exists: suggest "coordinated"
    - If API integration exists: suggest "coordinated"
    - If docs_root is separate from primary code: include "docs_separate"
    - Always include "independent" as fallback
    
example:
  # Detected: library→consumer, docs_root=apphub-vision
  
  # Result:
  pr_strategies:
    preferred:
      - coordinated    # For library→consumer changes
      - single_pr      # docs_root has code + docs together
      - independent    # For isolated changes
```

---

## Step 5: Generate & Show Config

```yaml
output_format:
  "## 🔍 Cross-Root Analysis Results
  
  ### Detected Roots
  | Root | Type | Package Manager |
  |------|------|-----------------|
  | copilot-flow | docs | - |
  | apphub-vision | monorepo | pnpm |
  | reviews-assets | library | npm |
  | boost-pfs-backend | backend | npm |
  
  ---
  
  ### ✅ High Confidence (Auto-detected)
  
  **Library → Consumer:**
  - `reviews-assets` (@apphubdev/clearer-ui) → `apphub-vision/apps/dashboard`
  
  **Shared Packages:**
  - `apphub-vision` provides: @clearer/utils, @clearer/core
  
  ---
  
  ### ⚠️ Need Clarification (Please confirm)
  
  1. **Library consumers:** I found `@apphubdev/clearer-ui` in dashboard.
     Are there other apps that use it? (billing, frontend, etc.)
     
  2. **API Integration:** Does `apphub-vision` call APIs from `boost-pfs-backend`?
     If yes, which services/apps make these calls?
  
  ---
  
  Please answer the questions above, then I'll finalize and save the config."

after_user_answers:
  "## 📋 Final Config (Ready to Save)
  
  ### Patterns
  | Pattern | Source | Target | Confidence |
  |---------|--------|--------|------------|
  | Library→Consumer | reviews-assets | apphub-vision (dashboard, billing) | ✅ Confirmed |
  | Shared Packages | apphub-vision | internal | ✅ Auto-detected |
  | API Integration | boost-pfs-backend | apphub-vision | ✅ Confirmed |
  
  ### Build Order
  1. reviews-assets (library)
  2. apphub-vision (consumer)
  
  ### PR Strategy
  - `coordinated` for cross-root changes
  - `docs_separate` for workflow docs
  
  ---
  
  **Save to WORKSPACE_CONTEXT.md?** Reply `yes` or `adjust: <feedback>`"
```

---

## Step 6: SAVE to WORKSPACE_CONTEXT.md

```yaml
on_user_confirms_yes:
  1. Read current WORKSPACE_CONTEXT.md
  
  2. Find or create Section 9:
     header: "# SECTION 9: CROSS-ROOT WORKFLOWS"
     
  3. Generate YAML content from detected patterns
  
  4. WRITE to file:
     path: <tooling_root>/WORKSPACE_CONTEXT.md
     action: Replace Section 9 content
     
  5. Confirm:
     "## ✅ Cross-Root Config Saved
     
     File: `WORKSPACE_CONTEXT.md` (Section 9)
     
     New sessions will auto-load this config via `cf-init`.
     Session mới sẽ tự động đọc config này qua `cf-init`."

on_user_says_adjust:
  - Parse user feedback
  - Modify detected config accordingly
  - Show updated config
  - Ask for confirmation again
```

---

## Quick Commands

| Command | Action |
|---------|--------|
| `cross-root` | Full auto-analysis and save |
| `cross-root view` | Show current saved config (no changes) |
| `cross-root refresh` | Re-analyze and update config |

---

## Reference: Implementation Workflows

When implementing cross-root changes, follow these patterns:

### Library → Consumer
```bash
# 1. Make changes in library
cd reviews-assets && <edit files>

# 2. Build library
npm run build

# 3. Test in consumer
cd apphub-vision && pnpm dev
```

### API Provider → Consumer
```bash
# 1. Update backend (maintain backward compat)
# 2. Deploy backend
# 3. Update frontend
# 4. Deploy frontend
```

### Build Order Verification
```bash
# Always build in order:
cd reviews-assets && npm run build
cd apphub-vision && pnpm build
```

---

## Tracking in Workflow State

When working on cross-root tasks, update `.workflow-state.yaml`:

```yaml
affected_roots:
  reviews-assets:
    changes: ["Updated component"]
    build_required: true
    
  apphub-vision:
    changes: ["Updated imports"]
    build_required: true
    depends_on: ["reviews-assets"]
```

---

## 📌 Next Step

After saving config:
- Run `init` to verify config loads correctly in new session
- Cross-root relationships will display automatically

**Related Prompts:**
- [cf-init.prompt.md](cf-init.prompt.md) - Auto-loads cross-root config
- [workspace-update-root.prompt.md](workspace-update-root.prompt.md) - Update workspace roots

````
