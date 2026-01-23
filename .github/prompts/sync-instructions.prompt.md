# Sync Instructions Across Roots / Đồng bộ Instructions

> Sync shared `.instructions.md` files from copilot-flow to all workspace roots.
> Đồng bộ files `.instructions.md` dùng chung từ copilot-flow sang các roots.

---

## 🎯 Purpose / Mục đích

Maintain shared coding standards across all workspace roots by:
1. Storing master copies in `copilot-flow/.github/instructions/shared/`
2. Syncing to other roots when triggered

Duy trì coding standards chung bằng cách:
1. Lưu bản gốc trong `copilot-flow/.github/instructions/shared/`
2. Đồng bộ sang các roots khi được trigger

---

## Trigger / Kích hoạt

- User says: `sync instructions`, `update instructions`
- After editing shared instructions in copilot-flow

---

## Step 1: Scan Source Files / Quét Files Nguồn

```yaml
source_location: <impl_root>/.github/instructions/shared/

actions:
  1. Scan directory for all *.instructions.md files:
     command: ls <impl_root>/.github/instructions/shared/*.instructions.md
     
  2. List found files:
     - coding-practices.instructions.md
     - typescript.instructions.md
     - testing.instructions.md
     - ... (any other files user has added)
     
  3. If directory empty or not exists:
     → Ask: "No shared instructions found. 
             Would you like to create some?
             Or specify a different source location?"

dynamic_source:
  # Whatever files exist in shared/ will be synced
  # User can add/remove files anytime
  # Just run `sync instructions` again to update
  
  files: <scan shared/ directory>
```

---

## Step 2: Get Target Roots from WORKSPACE_CONTEXT / Lấy Roots Đích từ WORKSPACE_CONTEXT

```yaml
source: WORKSPACE_CONTEXT.md

read_roots:
  1. Load WORKSPACE_CONTEXT.md from impl_root
  2. Extract all roots from Section 2 (WORKSPACE ROOTS)
  3. Exclude impl_root itself (copilot-flow) - it keeps source files
  4. Use remaining roots as sync targets

dynamic_targets:
  roots: <all roots from WORKSPACE_CONTEXT except impl_root>
  
  # Example: If WORKSPACE_CONTEXT has:
  # - copilot-flow (impl_root) → SKIP (source location)
  # - apphub-vision → SYNC
  # - reviews-assets → SYNC
  # - boost-pfs-backend → SYNC

target_path_in_each: .github/instructions/

filter_options:
  # User can specify which roots to sync to:
  # "sync instructions" → all roots
  # "sync instructions to apphub-vision" → specific root only
  # "sync instructions except reviews-assets" → exclude specific root
```

---

## Step 3: Sync Process / Quá trình Đồng bộ

```yaml
for_each_source_file:      # Dynamic from Step 1
  for_each_target_root:    # Dynamic from Step 2
    
    1. Ensure .github/instructions/ exists in target
    2. Read source file content (raw, no modification)
    3. Prepend sync header (plain markdown, NO code fences):
       ---
       # AUTO-SYNCED from copilot-flow/.github/instructions/shared/<filename>
       # Synced: <YYYY-MM-DD>
       # Do not edit directly - edit source and run `sync instructions`
       ---
    4. Write to target as RAW MARKDOWN file
    5. Track what was synced

⚠️ CRITICAL - FILE FORMAT:
  - Files MUST be written as raw markdown
  - DO NOT wrap content in code fences (```, ````, etc.)
  - DO NOT add any wrapper/container around content
  - The .instructions.md file IS the raw content
  - Copilot reads these as plain markdown, not code blocks
  
  # ✅ CORRECT file content:
  ---
  applyTo: '**'
  ---
  ## Section
  Content here...
  
  # ❌ WRONG file content (will break Copilot):
  ````instructions
  ---
  applyTo: '**'
  ---
  ## Section
  Content here...
  ````

output:
  "## ✅ Instructions Synced
  
  ### Source Files Found
  <list of files scanned from shared/>
  
  ### Target Roots (from WORKSPACE_CONTEXT)
  <list of roots excluding impl_root>
  
  ### Sync Results
  | File | Synced To |
  |------|-----------|
  | coding-practices.instructions.md | apphub-vision, reviews-assets, ... |
  | typescript.instructions.md | apphub-vision, reviews-assets, ... |
  | <any other files> | ... |
  
  All roots now have updated instructions."
```

---

## Step 4: Verify / Xác nhận

```yaml
verification:
  - List synced files in each root
  - Confirm no conflicts
  - Remind user to commit changes in each root
```

---

## Shared Instructions Structure / Cấu trúc

```
copilot-flow/.github/instructions/
├── shared/                              # Master copies (sync to other roots)
│   ├── coding-practices.instructions.md
│   ├── typescript.instructions.md
│   └── testing.instructions.md
└── workflow-docs.instructions.md        # Only for copilot-flow itself

<other-roots>/.github/instructions/      # Dynamically from WORKSPACE_CONTEXT
├── coding-practices.instructions.md     # ← Synced from shared/
├── typescript.instructions.md           # ← Synced from shared/
├── testing.instructions.md              # ← Synced from shared/
└── <root-specific>.instructions.md      # ← Root-specific (not synced)
```

---

## Root-Specific Instructions / Instructions Riêng cho Root

Each root can have additional instructions that are NOT synced.
These are detected from existing files in each root's `.github/instructions/`.

```yaml
detection:
  1. After syncing, list files in each target root's .github/instructions/
  2. Files NOT in shared/ are root-specific
  3. Report what's root-specific vs synced

example_output:
  "### Root-Specific Instructions (not synced)
  
  | Root | Root-Specific Files |
  |------|---------------------|
  | apphub-vision | prisma.instructions.md, ai-api.instructions.md |
  | reviews-assets | storybook.instructions.md |
  | boost-pfs-backend | api-design.instructions.md |"
```

---

## 📌 Next Step / Bước tiếp theo

After syncing:
- Commit changes in each affected root
- Changes will apply on next Copilot session

**Related Prompts:**
- [cross-root-guide.prompt.md](cross-root-guide.prompt.md) - Configure cross-root relationships

---

## Step 5: Tech Stack Detection & Suggestions (Auto)

After syncing, automatically detect each root's tech stack and suggest missing instructions.

```yaml
detection_rules:
  python:
    indicators: [requirements.txt, pyproject.toml, setup.py, Pipfile, poetry.lock]
    suggest: python.instructions.md
    
  typescript:
    indicators: [tsconfig.json, "package.json with typescript"]
    suggest: typescript.instructions.md
    
  go:
    indicators: [go.mod, go.sum]
    suggest: go.instructions.md
    
  rust:
    indicators: [Cargo.toml]
    suggest: rust.instructions.md
    
  java:
    indicators: [pom.xml, build.gradle]
    suggest: java.instructions.md
    
  dotnet:
    indicators: ["*.csproj", "*.sln"]
    suggest: dotnet.instructions.md
    
  docker:
    indicators: [Dockerfile, docker-compose.yml]
    suggest: docker.instructions.md
    
  react:
    indicators: ["package.json with react"]
    suggest: react.instructions.md
    
  nextjs:
    indicators: [next.config.js, next.config.mjs]
    suggest: nextjs.instructions.md
    
  prisma:
    indicators: [prisma/schema.prisma]
    suggest: prisma.instructions.md

process:
  for_each_root:
    1. Scan for indicator files
    2. Build list of detected tech stacks
    3. Compare with existing shared/ instructions
    4. Identify missing instructions
    5. Report suggestions

output_format:
  "## 🔍 Tech Stack Analysis
  
  | Root | Detected Tech | Has Instruction? | Action |
  |------|---------------|------------------|--------|
  | apphub-vision | typescript, nextjs, prisma | ✅ ✅ ❌ | Suggest prisma |
  | python-service | python, docker | ❌ ✅ | Suggest python |
  | go-api | go, docker | ❌ ✅ | Suggest go |
  
  ### 💡 Suggested New Instructions
  
  Missing instructions detected. Create:
  
  1. **python.instructions.md** - Python best practices, pytest, type hints
  2. **prisma.instructions.md** - Schema design, migrations
     
  Reply: numbers (e.g., '1, 2'), 'all', or 'skip'"
```

---

## Step 6: Create Suggested Instructions

When user accepts, create from built-in templates.

```yaml
templates:
  python.instructions.md: |
    ---
    applyTo: '**/*.py'
    ---
    # Python Standards
    
    ## Style Guide
    - Follow PEP 8
    - Use type hints for function signatures
    - Max line length: 88 (Black formatter)
    
    ## Error Handling
    ```python
    # ✅ Specific exceptions
    try:
        result = process_data(input)
    except ValueError as e:
        logger.error(f"Invalid input: {e}")
        raise
    
    # ❌ Bare except
    try:
        result = process_data(input)
    except:
        pass
    ```
    
    ## Imports
    ```python
    # 1. Standard library
    import os
    from pathlib import Path
    
    # 2. Third-party
    import pandas as pd
    from fastapi import FastAPI
    
    # 3. Local
    from .models import User
    ```
    
    ## Testing
    - Use pytest
    - Tests in `tests/` or `test_*.py`
    - Use fixtures for setup/teardown

  go.instructions.md: |
    ---
    applyTo: '**/*.go'
    ---
    # Go Standards
    
    ## Style Guide
    - Follow Effective Go
    - Use gofmt, golint
    
    ## Error Handling
    ```go
    // ✅ Check errors explicitly
    result, err := doSomething()
    if err != nil {
        return fmt.Errorf("failed: %w", err)
    }
    
    // ❌ Ignoring errors
    result, _ := doSomething()
    ```
    
    ## Package Layout
    /cmd        # Main apps
    /internal   # Private code
    /pkg        # Public libs

  prisma.instructions.md: |
    ---
    applyTo: '**/prisma/**,**/*.prisma'
    ---
    # Prisma Standards
    
    ## Schema Design
    - PascalCase model names
    - Use @map for snake_case columns
    - Always include createdAt, updatedAt
    
    ```prisma
    model User {
      id        String   @id @default(cuid())
      email     String   @unique
      createdAt DateTime @default(now()) @map("created_at")
      updatedAt DateTime @updatedAt @map("updated_at")
      @@map("users")
    }
    ```
    
    ## Migrations
    - Review before applying
    - `prisma migrate dev` for development
    - `prisma migrate deploy` for production

  java.instructions.md: |
    ---
    applyTo: '**/*.java'
    ---
    # Java Standards
    
    ## Style Guide
    - Follow Google Java Style Guide
    - Use meaningful names (camelCase methods, PascalCase classes)
    
    ## Error Handling
    ```java
    // ✅ Specific exceptions
    try {
        processData(input);
    } catch (IOException e) {
        logger.error("IO error", e);
        throw new ServiceException("Failed to process", e);
    }
    
    // ❌ Catching generic Exception
    catch (Exception e) { }
    ```

  rust.instructions.md: |
    ---
    applyTo: '**/*.rs'
    ---
    # Rust Standards
    
    ## Style Guide
    - Use rustfmt
    - Follow Rust API Guidelines
    
    ## Error Handling
    ```rust
    // ✅ Use Result and ?
    fn process() -> Result<Data, Error> {
        let data = fetch_data()?;
        Ok(transform(data))
    }
    
    // ✅ Custom error types
    #[derive(Debug, thiserror::Error)]
    enum AppError {
        #[error("IO error: {0}")]
        Io(#[from] std::io::Error),
    }
    ```

  dotnet.instructions.md: |
    ---
    applyTo: '**/*.cs'
    ---
    # .NET Standards
    
    ## Style Guide
    - Follow Microsoft C# Coding Conventions
    - Use PascalCase for public members
    - Use camelCase for private fields with _ prefix
    
    ## Async/Await
    ```csharp
    // ✅ Async all the way
    public async Task<User> GetUserAsync(string id)
    {
        return await _repository.FindByIdAsync(id);
    }
    
    // ❌ Blocking on async
    var user = GetUserAsync(id).Result;
    ```

create_process:
  1. User selects numbers or 'all'
  2. Write templates to shared/
  3. Ask user to review and customize
  4. Auto-run sync to distribute
```

---

## Quick Commands

| Command | Action |
|---------|--------|
| `sync instructions` | Sync all + analyze tech stacks |
| `sync instructions to <root>` | Sync to specific root only |
| `sync instructions --skip-analysis` | Sync without tech detection |
| `suggest instructions` | Only analyze, don't sync |
| `suggest instructions for <root>` | Analyze specific root |
````
