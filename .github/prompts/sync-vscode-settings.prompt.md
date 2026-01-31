# Sync VS Code Settings

> Sync `.vscode/settings.json` from template to workspace roots.

---

## Trigger

- User says: `sync vscode settings`, `sync settings`, `setup vscode`
- After editing vscode-settings.template.json

---

## Step 1: Load Template

```yaml
template_location: copilot-flow/docs/templates/vscode-settings.template.json

actions:
  1. Read template file
  2. Parse as JSON (strip comments for actual JSON)
  3. If not found → create from default
```

---

## Step 2: Get Target Roots

```yaml
source: WORKSPACE_CONTEXT.md

get_roots:
  1. Read all roots from WORKSPACE_CONTEXT.md
  2. Exclude copilot-flow (no code, no need)
  3. Filter by user request if specified

filter_options:
  - "sync vscode settings" → all roots
  - "sync vscode settings to apphub-vision" → specific root
```

---

## Step 3: Sync Process

```yaml
for_each_target_root:
  1. Check if .vscode/settings.json exists
  
  2. If EXISTS:
     action: MERGE (preserve root-specific, add Copilot settings)
     
     merge_strategy:
       - Keep existing non-Copilot settings
       - Update/add Copilot-related settings
       - Copilot keys to merge:
         - github.copilot.*
         - chat.*
       
  3. If NOT EXISTS:
     action: CREATE from template
     
  4. Adjust paths for root:
     - Update file references to match root structure
     - Check if referenced files exist

output:
  "## ✅ VS Code Settings Synced
  
  | Root | Action | Status |
  |------|--------|--------|
  | apphub-vision | Merged | ✅ |
  | reviews-assets | Created | ✅ |
  | boost-pfs-backend | Merged | ✅ |
  
  Copilot settings are now configured in all roots."
```

---

## Step 4: Validate References

```yaml
for_each_synced_root:
  check_references:
    - .github/copilot-instructions.md exists?
    - .github/instructions/testing.instructions.md exists?
    - .github/instructions/code-review.instructions.md exists?
    
  if_missing:
    warn: "⚠️ <root> is missing <file>. Run `sync instructions` first."
```

---

## Merge Example

```yaml
# Existing settings.json in apphub-vision:
{
  "editor.tabSize": 4,
  "typescript.preferences.quoteStyle": "single"
}

# After merge:
{
  "editor.tabSize": 4,                    # Preserved
  "typescript.preferences.quoteStyle": "single",  # Preserved
  
  # Added from template:
  "github.copilot.chat.codeGeneration.instructions": [...],
  "github.copilot.chat.testGeneration.instructions": [...],
  "github.copilot.enable": {...}
}
```

---

## Template Customization

Users can customize template before syncing:

```
copilot-flow/docs/templates/vscode-settings.template.json
```

Edit this file to change default Copilot settings for all roots.

---

## Quick Commands

| Command | Action |
|---------|--------|
| `sync vscode settings` | Sync to all roots |
| `sync vscode settings to <root>` | Sync to specific root |
| `reset vscode settings` | Overwrite (don't merge) |

---

## Related Prompts

- [sync-instructions.prompt.md](sync-instructions.prompt.md) - Sync instruction files
- [workspace-discovery.prompt.md](workspace-discovery.prompt.md) - Discovery step (part of /setup-workspace)
