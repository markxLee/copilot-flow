# Sync Instructions - Tech Stack Analysis & Generation

> Analyze each workspace root's tech stack and generate appropriate `.instructions.md` files.

---

## 🎯 Purpose

**OLD approach (deprecated):** Copy shared templates → All roots get same instructions
**NEW approach:** Analyze each root → Generate tailored instructions per tech stack

---

## Trigger

- User says: `sync instructions`, `generate instructions`, `/sync-instructions`
- User says: `sync instructions to <root>` - specific root only

---

## 🔍 Step 1: Scan & Analyze Each Root

```yaml
process:
  1. Read WORKSPACE_CONTEXT.md for list of roots
  2. For each root (except tooling_root):
     a. Scan root structure (package.json, config files, directories)
     b. Detect tech stack per app/package if monorepo
     c. Build tech profile

analysis_depth:
  # Level 1: Root level
  - package.json (dependencies, devDependencies, scripts)
  - Config files (tsconfig, next.config, vite.config, etc.)
  - Build tools (turbo.json, nx.json, lerna.json)
  
  # Level 2: App/Package level (for monorepos)
  - apps/*/package.json
  - packages/*/package.json
  - Each app's specific config files
  
  # Level 3: Framework detection
  - Next.js: next.config.* , app/ or pages/ directory
  - React: react in dependencies, jsx/tsx files
  - Fastify/Express: server files, routes structure
  - Prisma: prisma/ directory, schema.prisma
  - AWS CDK: cdk.json, bin/, lib/ with constructs

output_per_root:
  root: apphub-vision
  type: monorepo
  build_tool: turborepo + pnpm
  apps:
    - name: dashboard
      path: apps/dashboard
      stack: [next.js, react, typescript, tailwind]
    - name: ai-api
      path: apps/ai-api
      stack: [fastify, typescript, langchain, prisma]
    - name: shopify
      path: apps/shopify
      stack: [shopify-app, react, typescript]
  packages:
    - name: app-database
      stack: [prisma, typescript]
    - name: assistant
      stack: [langchain, typescript]
  shared_stack: [typescript, pnpm, turborepo]
```

---

## 📋 Step 2: Present Analysis to User

```yaml
format: |
  ## 🔍 Tech Stack Analysis Results
  
  ### Root: `<root_name>`
  | Aspect | Detected |
  |--------|----------|
  | Type | monorepo / single-app |
  | Build Tool | pnpm + turbo / npm / yarn |
  | Primary Language | TypeScript / JavaScript |
  
  #### Apps/Packages Detected
  | Name | Path | Tech Stack |
  |------|------|------------|
  | dashboard | apps/dashboard | Next.js, React, Tailwind |
  | ai-api | apps/ai-api | Fastify, Prisma, LangChain |
  
  #### Recommended Instructions
  | Instruction File | Applies To | Reason |
  |------------------|------------|--------|
  | nextjs.instructions.md | apps/dashboard/** | Next.js app router patterns |
  | fastify.instructions.md | apps/ai-api/** | Fastify routes, plugins |
  | prisma.instructions.md | **/prisma/** | Schema, migrations |
  | typescript.instructions.md | **/*.ts,**/*.tsx | Type safety |
  
  ---
  
  ### Root: `<next_root_name>`
  ... (repeat for each root)
  
  ---
  
  ## 🎯 Summary
  | Root | Instructions to Generate |
  |------|-------------------------|
  | apphub-vision | 5 files (nextjs, fastify, prisma, typescript, testing) |
  | boost-pfs-backend | 3 files (typescript, testing, api-design) |
  | reviews-assets | 1 file (scss) |
  
  Reply:
  - `all` - Generate all recommended instructions
  - `<root>` - Generate for specific root only  
  - `customize` - Review and modify recommendations first
```

---

## ⚙️ Step 3: Generate Instructions (AI-Driven)

**CRITICAL: AI generates content based on actual analysis, NOT from templates**

```yaml
generation_rules:
  1. Read actual code patterns from the root
  2. Check existing instructions (don't duplicate)
  3. Generate content tailored to:
     - Framework version detected
     - Project structure observed
     - Patterns found in codebase
     - Dependencies used

content_sources:
  # AI should reference these when generating:
  - Framework official docs best practices
  - Detected patterns in existing code
  - Package versions for compatibility
  - Project's existing code style

example_generation:
  # For apphub-vision/apps/dashboard (Next.js 14 detected)
  
  file: apps/dashboard/.github/instructions/nextjs.instructions.md
  content_based_on:
    - next.config.mjs settings
    - App router structure (app/ directory)
    - Server actions usage
    - Existing component patterns
  
  generated_sections:
    - App Router conventions (detected: using app/)
    - Server Actions patterns (detected: use server)
    - Data fetching (detected: fetch in server components)
    - NOT included: Pages router (not used)

location_strategy:
  monorepo:
    # Shared instructions at root level
    <root>/.github/instructions/
      typescript.instructions.md (applyTo: **/*.ts)
      testing.instructions.md (applyTo: **/*.test.ts)
    
    # App-specific at app level
    <root>/apps/<app>/.github/instructions/
      nextjs.instructions.md (applyTo: apps/dashboard/**)
      fastify.instructions.md (applyTo: apps/ai-api/**)
  
  single_app:
    # All at root level
    <root>/.github/instructions/
      all-instructions-here.md
```

---

## 📝 Step 4: Generate Content by Category

AI generates instructions based on detected stack. Reference patterns:

### TypeScript (if tsconfig.json found)
```yaml
analyze:
  - tsconfig.json → strict mode? paths? target?
  - Existing type patterns in codebase
  
generate_sections:
  - Type safety rules (based on strict settings)
  - Import patterns (based on paths config)
  - Generic patterns (if used in codebase)
  
applyTo: "**/*.ts,**/*.tsx"
```

### Next.js (if next.config.* found)
```yaml
analyze:
  - App router vs Pages router
  - next.config settings
  - Existing page/layout patterns
  
generate_sections:
  - File conventions (based on detected structure)
  - Data fetching (server components, actions)
  - Client vs Server components
  
applyTo: "apps/<app-name>/**" # scoped to specific app
```

### Fastify (if fastify in dependencies)
```yaml
analyze:
  - Plugin structure
  - Route patterns
  - Existing hooks usage
  
generate_sections:
  - Route definition patterns
  - Plugin best practices
  - Error handling (from existing code)
  
applyTo: "apps/<app-name>/**"
```

### Prisma (if prisma/ directory exists)
```yaml
analyze:
  - schema.prisma models
  - Existing query patterns
  - Client usage patterns
  
generate_sections:
  - Schema conventions (from existing models)
  - Query patterns (from existing code)
  - Migration rules
  
applyTo: "**/prisma/**,**/*.prisma"
```

### React (if react in dependencies)
```yaml
analyze:
  - Component patterns (functional, hooks)
  - State management used
  - Styling approach
  
generate_sections:
  - Component structure
  - Hooks usage (based on existing hooks)
  - State management patterns
  
applyTo: "**/*.tsx,**/*.jsx"
```

### Testing (if jest/vitest/pytest found)
```yaml
analyze:
  - Test framework used
  - Existing test patterns
  - Coverage setup
  
generate_sections:
  - Test structure (from existing tests)
  - Mocking patterns
  - Coverage requirements
  
applyTo: "**/*.test.ts,**/*.spec.ts"
```

### SCSS/CSS (if scss files found)
```yaml
analyze:
  - File structure
  - Naming conventions
  - Variable usage
  
generate_sections:
  - File organization
  - Naming conventions
  - Responsive patterns
  
applyTo: "**/*.scss,**/*.css"
```

---

## 📄 Step 5: Write Files

```yaml
file_format:
  header: |
    ---
    applyTo: '<glob-pattern>'
    ---
    # <Title> - Generated from Tech Stack Analysis
    # Generated: <YYYY-MM-DD>
    # Based on: <what was analyzed>
    # Regenerate: Run `/sync-instructions` to update
    
  body: |
    <AI-generated content based on analysis>

write_strategy:
  - Check if file exists
  - If exists: Show diff, ask to overwrite or merge
  - If new: Create file
  - After writing: List all created/updated files

output: |
  ## ✅ Instructions Generated
  
  ### Created/Updated Files
  | Root | File | Status |
  |------|------|--------|
  | apphub-vision | .github/instructions/typescript.instructions.md | Created |
  | apphub-vision | apps/dashboard/.github/instructions/nextjs.instructions.md | Created |
  | apphub-vision | apps/ai-api/.github/instructions/fastify.instructions.md | Created |
  | reviews-assets | .github/instructions/scss.instructions.md | Created |
  
  ### Next Steps
  1. Review generated files and customize if needed
  2. Commit changes to each affected root
  3. Run `/sync-instructions` again after major dependency changes
```

---

## 🔄 Incremental Updates

```yaml
update_mode:
  trigger: "sync instructions --update" or "update instructions"
  
  process:
    1. Read existing instruction files
    2. Re-analyze current tech stack
    3. Detect changes:
       - New dependencies added
       - Configs changed
       - New apps/packages added
    4. Show diff of what would change
    5. Ask user to approve updates

preserve:
  - User customizations (sections marked # CUSTOM)
  - Manual additions
  - Only update generated sections
```

---

## Quick Commands

| Command | Action |
|---------|--------|
| `sync instructions` | Full analysis + generate all |
| `sync instructions to <root>` | Analyze + generate for one root |
| `sync instructions --update` | Update existing only |
| `sync instructions --dry-run` | Show what would be generated |
| `analyze tech stack` | Analysis only, no generation |

---

## ⚠️ Important Notes

```yaml
DO:
  - Analyze actual code patterns before generating
  - Scope applyTo patterns to specific apps/packages
  - Consider monorepo structure
  - Preserve user customizations
  - Show what will be created before writing

DO_NOT:
  - Use generic templates for all roots
  - Assume all roots have same stack
  - Overwrite user customizations
  - Generate instructions for tech not detected
  - Apply root-level instructions to all files in monorepo
```

---

## 📌 Related Prompts

- [suggest-instructions.prompt.md](suggest-instructions.prompt.md) - Analysis only, no generation
- [workspace-discovery.prompt.md](workspace-discovery.prompt.md) - Discover workspace structure
