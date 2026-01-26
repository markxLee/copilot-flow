# Initialize Context / Khởi tạo Ngữ cảnh
# Entry point for every Copilot session in this workspace
# Điểm bắt đầu cho mỗi phiên Copilot trong workspace này

---

## Trigger / Kích hoạt

User says one of:
- "init" / "start" / "bắt đầu"
- "context" / "ngữ cảnh"
- Opens new chat session
- "help" / "hướng dẫn"

---

## Instructions / Hướng dẫn

### Step 1: Load Workspace Context / Đọc ngữ cảnh Workspace

```yaml
actions:
  1. Find WORKSPACE_CONTEXT.md:
     locations:
       - ./WORKSPACE_CONTEXT.md (current root)
       - ../copilot-flow/WORKSPACE_CONTEXT.md
       - Search all workspace roots
     
  2. If not found:
     - Suggest: "Run `setup workspace` to initialize"
     - This runs: discovery → cross-root → sync → generate files
     
  3. Extract key info:
     - meta.tooling_root → Where prompts/templates live (STATIC)
     - meta.default_docs_root → Default for workflow docs
     - meta.primary_root → Main codebase
     - roots → All available roots
     - relationships → Cross-root dependencies
```

### Step 2: Determine docs_root / Xác nhận docs_root

```yaml
determination:
  # tooling_root is STATIC - always copilot-flow
  tooling_root: copilot-flow  # From WORKSPACE_CONTEXT.md
  
  # docs_root is PER-FEATURE - determined here
  docs_root_resolution:
  
  1. If RESUMING existing workflow:
     - Read .workflow-state.yaml → meta.docs_root
     - Use that value (already chosen previously)
     
  2. If STARTING new workflow:
     a. Identify primary affected root from user request
     b. ASK user to confirm docs_root:
        "✋ Where should workflow docs live? / Lưu workflow docs ở đâu?
        
        Detected primary root: <primary-affected-root>
        
        Options:
        1. **<primary-root>/** (RECOMMENDED - code + docs in same PR)
        2. **<default_docs_root>/** (default from config)
        3. Other: ___
        
        Which root for docs?"
     c. Store choice in .workflow-state.yaml → meta.docs_root
     
  3. Verify docs_root is valid:
     - Path exists in workspace
     - Has write access
```

### Step 3: Load Cross-Root Workflows / Đọc Cấu hình Đa Root

```yaml
cross_root_detection:
  1. Read WORKSPACE_CONTEXT.md section:
     section: cross_root_workflows
     
  2. If section EXISTS:
     - Load library_consumer patterns
     - Load shared_packages patterns
     - Load api_integration patterns
     - Load multi_root_build_order
     - Load pr_strategies
     - Display in context summary (Step 6)
     
  3. If section NOT EXISTS:
     - Skip cross-root display
     - Suggest running `cross-root-guide` if multi-root task detected
     
  4. Store in session context:
     cross_root_config:
       patterns: <loaded patterns>
       build_order: <loaded build order>
       pr_strategies: <loaded strategies>
```

### Step 4: Check for Existing Workflow / Kiểm tra Workflow đang có

```yaml
CRITICAL_AUTO_DETECT_WORKFLOW:
  # ⚠️ AI KHÔNG có memory giữa sessions
  # PHẢI auto-detect workflow từ WORKSPACE_CONTEXT.md + git branch
  
  step_1_read_workspace_context_first:
    # ĐỌC WORKSPACE_CONTEXT.md TRƯỚC để biết default_docs_root
    file: copilot-flow/WORKSPACE_CONTEXT.md
    extract: meta.default_docs_root
    example: "apphub-vision"
    
  step_2_get_branch_from_docs_root:
    # QUAN TRỌNG: Chạy git TẠI default_docs_root, không phải tại tooling_root
    command: git -C <default_docs_root> rev-parse --abbrev-ref HEAD
    example: git -C apphub-vision rev-parse --abbrev-ref HEAD
    result: "feature/bp-32-add-payment-detail"
    
  step_3_extract_slug:
    # Strip common branch prefixes
    prefixes_to_strip:
      - "feature/"
      - "bugfix/"
      - "hotfix/"
      - "fix/"
      - "feat/"
      - "chore/"
      - "refactor/"
    
    example: |
      input:  "feature/bp-32-add-payment-detail"
      output: "bp-32-add-payment-detail"
      
  step_4_construct_path:
    pattern: "<default_docs_root>/docs/runs/<slug>/.workflow-state.yaml"
    example: "apphub-vision/docs/runs/bp-32-add-payment-detail/.workflow-state.yaml"
    
  step_5_check_and_act:
    if_file_exists:
      action: |
        1. READ .workflow-state.yaml
        2. Display workflow status (phase, task, progress)
        3. Suggest explicit next action prompt
        4. goto: Step 5A (Resume Mode)
        
    if_file_not_exists:
      action: |
        1. Inform user: "No workflow found for branch `<branch>` (slug: `<slug>`)"
        2. Ask: "Start new workflow? Describe your work or say `/work-intake`"
        3. goto: Step 5B (New Session Mode)
```

### Step 4B: Detect Base Branch (ALWAYS CONFIRM) / Xác định Branch Gốc

```yaml
base_branch_detection:
  # Base branch is used by /code-review for diff comparison
  # ALWAYS confirm with user - never auto-decide
  # User may use feature branches as base for sub-features
  # Example: feature/big-feature → feature/big-feature-part-1
  
  1. If RESUMING existing workflow:
     source: .workflow-state.yaml → meta.base_branch
     action: Use saved value (already confirmed previously)
     
  2. If NEW workflow:
     a. Detect likely default branch (as SUGGESTION only):
        commands:
          # Try to get default branch from remote
          - git remote show origin 2>/dev/null | grep "HEAD branch" | cut -d: -f2 | tr -d ' '
          # Fallback: check if main exists
          - git rev-parse --verify origin/main 2>/dev/null && echo "main"
          # Fallback: check if master exists  
          - git rev-parse --verify origin/master 2>/dev/null && echo "master"
          # Fallback: check if develop exists
          - git rev-parse --verify origin/develop 2>/dev/null && echo "develop"
     
     b. ALWAYS ask user to confirm (không tự quyết định):
        "### 🎯 Base Branch / Branch Gốc
        
        Branch này sẽ merge vào đâu? / Where will this branch merge into?
        
        | Info | Value |
        |------|-------|
        | Current branch | `<current_branch>` |
        | Suggested | `<detected_branch>` |
        
        **Common patterns / Các mẫu thường gặp:**
        - `main` / `master` - Direct to main branch
        - `develop` - Feature → develop → main  
        - `feature/xxx` - Sub-feature → parent feature branch
        
        This affects `/code-review` diff comparison.
        
        **Enter base branch (or press Enter for `<detected_branch>`):**"
     
  3. Store in session context:
     base_branch: <user_confirmed_value>
     
  4. Save to state file when workflow starts:
     meta.base_branch: <user_confirmed_value>
```

### Step 5A: Resume Mode / Chế độ Tiếp tục

```yaml
resume_actions:
  1. Parse .workflow-state.yaml
  
  2. Display status:
     "## 🔄 Existing Workflow Found / Tìm thấy Workflow đang có
     
     | Aspect | Value |
     |--------|-------|
     | Branch | `<branch-slug>` |
     | Base Branch | `<base_branch>` |
     | Feature | <feature-name> |
     | Phase | <current_phase>: <phase_name> |
     | Status | <phase_status> |
     | Last Updated | <timestamp> |
     
     ### Last Action / Hành động cuối
     <last_action>
     
     ### Next Action / Hành động tiếp
     <next_action>
     
     ---
     
     **Options / Lựa chọn:**
     1. `resume` / `tiếp tục` - Continue this workflow
     2. `status` - Show detailed status
     3. `new` / `mới` - Start fresh (will archive current)
     4. `abort` / `hủy` - Discard current workflow"
     
  3. Wait for user choice
```

### Step 5B: New Session Mode / Chế độ Phiên mới

```yaml
new_session_actions:
  1. Display welcome:
     "## 👋 Welcome / Chào mừng
     
     **Workspace:** <workspace-name>
     **Tooling Root:** `<tooling_root>`
     **Docs Root:** `<docs_root>` (or ask user)
     **Branch:** `<branch-slug>`
     **Base Branch:** `<base_branch>` (for PR comparison)
     
     No active workflow found for this branch.
     Không tìm thấy workflow đang hoạt động cho branch này.
     
     ---
     
     **What would you like to do? / Bạn muốn làm gì?**
     
     1. **Start workflow** - Begin governed workflow for a feature/fix
        `start: <description>` or just describe your work
        
     2. **Quick task** - Simple change, no workflow needed
        Just describe what you need (simple edits)
        
     3. **Explore** - Browse codebase, ask questions
        Ask anything about the code
        
     4. **Help** - Show workflow guide
        `help workflow`"
     
  2. Wait for user input
```

### Step 6: Initialize Workflow (if requested) / Khởi tạo Workflow

```yaml
init_workflow:
  trigger: User says "start: <description>" or describes a feature/fix
  
  actions:
    1. Determine docs_root (if not already):
       - Ask user to confirm (see Step 2)
       - Default: primary affected root
       
    2. Create branch directory:
       path: <docs_root>/docs/runs/<branch-slug>/
       
    3. Create state file from template:
       source: <tooling_root>/docs/templates/workflow-state.template.yaml
       target: <docs_root>/docs/runs/<branch-slug>/.workflow-state.yaml
       
    4. Initialize state:
       meta:
         branch_slug: <branch-slug>
         docs_root: <docs_root>
         tooling_root: <tooling_root>
         feature_name: <from user description>
         created_at: <now>
         last_updated: <now>
         affected_roots:
           - root: <primary-root>
             role: primary
           - root: <secondary-root>  # if any
             role: secondary
       status:
         current_phase: 0
         phase_name: analysis
         phase_status: not-started
         last_action: "Workflow initialized"
         next_action: "Capture work description"
         blockers: []
         
    5. Create README.md for reviewers:
       path: <docs_root>/docs/runs/<branch-slug>/README.md
       
    6. Announce:
       "
       ## ✅ Workflow Initialized / Workflow đã khởi tạo
       
       | Aspect | Value |
       |--------|----- -|
       | Feature | <feature-name> |
       | Branch | `<branch-slug>` |
       | Docs Location | `<docs_root>/docs/runs/<branch-slug>/` |
       | Templates From | `<tooling_root>/docs/templates/` |
       | Affected Roots | <list of roots> |
       
       ---
       
       **Next step: Run work intake / Bước tiếp theo: Chạy work intake**
       ```
       /work-intake
       ```
       "
       
    7. STOP and wait for user to run /work-intake
       # DO NOT auto-run work-intake, let user trigger explicitly
```

### Step 7: Work Description Flow / Luồng Mô tả Công việc

```yaml
work_flow:
  sequence:
    1. work-intake.prompt.md
       - Capture raw request
       - Structure into Work Description
       - Identify missing info
       - Output: 00_analysis/work-description.md
       
    2. work-review.prompt.md
       - Review completeness
       - Verify scope and ACs
       - Verdict: READY / NOT READY
       
    3. If NOT READY:
       - Show blockers
       - Wait for user answers
       - Re-run work-review
       
    4. If READY:
       - Wait for user approval
       - Proceed to solution design
       
  state_updates:
    after_intake:
      last_action: "Work description captured"
      next_action: "Review work description"
      
    after_review_ready:
      last_action: "Work review passed - READY"
      next_action: "Awaiting approval to proceed to analysis"
      phase_status: awaiting-review
      
    after_review_not_ready:
      last_action: "Work review - NOT READY"
      next_action: "User to provide missing information"
      phase_status: blocked
```

---

## Context Summary Output / Tóm tắt Ngữ cảnh

After initialization, always show:

```markdown
## 📍 Session Context / Ngữ cảnh Phiên

| Aspect | Value |
|--------|-------|
| Tooling Root | `<tooling_root>` |
| Docs Root | `<docs_root>` |
| Primary Root | `<primary_root>` |
| Current Branch | `<branch-slug>` |
| Workflow Status | <Active / None> |

### Workspace Roots / Các Root
| Root | Type | Role |
|------|------|------|
| <root1> | <type> | <tooling_root / docs_root / code / ui / ...> |
| <root2> | <type> | <role> |

### Cross-Root Relationships / Quan hệ Đa Root
(If cross_root_workflows exists in WORKSPACE_CONTEXT.md)

| Pattern | Source | Target | Type |
|---------|--------|--------|------|
| Library→Consumer | reviews-assets | apphub-vision | @apphubdev/clearer-ui |
| Shared Packages | apphub-vision | internal | @clearer/* |
| API Integration | boost-pfs-backend | apphub-vision | API calls |

**Build Order:** reviews-assets → apphub-vision

---

**Ready. What would you like to do?**
**Sẵn sàng. Bạn muốn làm gì?**
```

If cross_root_workflows NOT configured, instead show:
```markdown
### Cross-Root Relationships / Quan hệ Đa Root
⚠️ Not configured. Run `cross-root-guide` to set up cross-root patterns.
```

---

## Quick Reference Card / Thẻ Tham chiếu Nhanh

Show when user says "help" / Hiển thị khi user nói "help":

```markdown
## 📚 Copilot Workflow Quick Reference

### Commands / Lệnh
| Command | Action |
|---------|--------|
| `init` | Initialize/refresh context |
| `start: <desc>` | Start new workflow |
| `resume` / `tiếp tục` | Continue existing workflow |
| `status` / `trạng thái` | Show current status |
| `help` | Show this reference |

### ⚠️ Explicit Prompt References (RECOMMENDED)
| Prompt | When to Use |
|--------|-------------|
| `/work-intake` | Capture work description |
| `/work-review` | Review work readiness |
| `/phase-0-analysis` | Start Phase 0 |
| `/phase-1-spec` | Start Phase 1 |
| `/spec-review` | Review spec |
| `/phase-2-tasks` | Start Phase 2 |
| `/task-plan-review` | Review task plan |
| `/phase-3-impl T-XXX` | Implement task |
| `/code-review T-XXX` | Review task code |
| `/phase-4-tests` | Start Phase 4 |
| `/phase-5-done` | Start Phase 5 |

### ⚠️ Risky Commands (Avoid)
| Command | Risk |
|---------|------|
| ~~`go`~~ / ~~`tiếp`~~ | May skip phases |
| ~~`approved`~~ / ~~`duyệt`~~ | May skip phases |

### Workflow Phases / Các Phase
| # | Phase | Gate |
|---|-------|------|
| 0 | Analysis & Design | ⏸️ Approval |
| 1 | Specification | ⏸️ Approval |
| 2 | Task Planning | ⏸️ Approval |
| 3 | Implementation | ⏸️ Per-task |
| 4 | Testing | ⏸️ Approval |
| 5 | Done Check | ⏸️ Final |

### Key Paths / Đường dẫn Chính
- Contract: `<tooling_root>/docs/workflow/contract.md`
- Templates: `<tooling_root>/docs/templates/`
- This workflow: `<docs_root>/docs/runs/<branch-slug>/`
- State file: `.workflow-state.yaml`

### Tips / Mẹo
- Always work on a feature branch, not main
- Copilot will STOP at phase gates for approval
- Say `status` anytime to see progress
- State is auto-saved after each action
```

---

## Error Handling / Xử lý Lỗi

### No WORKSPACE_CONTEXT.md
```yaml
action: |
  "⚠️ No WORKSPACE_CONTEXT.md found.
  
  This file is needed to understand the workspace structure.
  
  Options:
  1. Run workspace discovery: `discover workspace`
  2. Create manually
  3. Point me to existing context file"
```

### No tooling_root defined
```yaml
action: |
  "⚠️ tooling_root not defined in WORKSPACE_CONTEXT.md
  
  I need to know where workflow tooling (prompts/templates) are stored.
  This is usually the repo containing the copilot-flow system.
  
  Which root contains the workflow tooling?
  (This is where prompts and templates live)
  
  Available roots:
  - copilot-flow/ (recommended)
  - apphub-vision/
  - <other roots...>"
```

### Branch is main/master
```yaml
action: |
  "⚠️ You're on the main/master branch.
  
  Workflow requires a feature branch.
  
  Options:
  1. Create new branch: `git checkout -b feature/<name>`
  2. Continue without workflow (quick task only)
  3. Switch to existing branch"
```

### State file corrupted
```yaml
action: |
  "⚠️ State file appears corrupted or invalid.
  
  Options:
  1. Attempt recovery from artifacts
  2. Reset workflow (keep docs, new state)
  3. Start fresh (archive current)"
```

---

## Session Persistence Notes / Ghi chú Lưu trữ Phiên

```yaml
what_persists:
  - .workflow-state.yaml (all progress)
  - All docs in docs/runs/<branch-slug>/
  - Git commits
  
what_is_lost:
  - Copilot conversation history
  - In-memory context
  
recovery:
  - State file has all needed info to resume
  - context.session_decisions preserves key decisions
  - context.important_notes preserves critical info
  - history tracks all actions
  
best_practice:
  - Copilot updates state after EVERY significant action
  - User can resume anytime with "init" or "resume"
  - State file is the source of truth
```

---

## Example Session / Ví dụ Phiên

```
User: init

Copilot: 
## 📍 Session Context / Ngữ cảnh Phiên

| Aspect | Value |
|--------|-------|
| Tooling Root | `copilot-flow` |
| Docs Root | `apphub-vision` |
| Primary Root | `apphub-vision` |
| Current Branch | `feature-add-analytics` |
| Workflow Status | Active (Phase 3) |

### Workspace Roots / Các Root
| Root | Type | Role |
|------|------|------|
| copilot-flow | tooling | tooling_root |
| apphub-vision | monorepo | docs_root, primary code |
| reviews-assets | library | UI components |

---

## 🔄 Existing Workflow Found

| Aspect | Value |
|--------|-------|
| Feature | Add Analytics Dashboard |
| Phase | 3: Implementation |
| Status | in-progress |
| Progress | 3/6 tasks done |

### Last Action
Created tracker.ts with event tracking logic

### Next Action  
Update dashboard component (Task T-004)

---

**Options:**
1. `resume` - Continue this workflow
2. `status` - Show detailed status
3. `new` - Start fresh

User: resume

Copilot: Continuing Task T-004: Update dashboard component...
```
