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
     - meta.impl_root → Where workflow docs go
     - meta.primary_root → Main codebase
     - roots → All available roots
     - relationships → Cross-root dependencies
```

### Step 2: Verify impl_root / Xác nhận impl_root

```yaml
verification:
  1. Read meta.impl_root from WORKSPACE_CONTEXT.md
  
  2. If impl_root is set:
     - Confirm path exists
     - Confirm has docs/workflow/contract.md
     - Confirm has docs/templates/
     
  3. If impl_root NOT set or invalid:
     - ASK user:
       "I need to know where to store workflow documentation.
       Tôi cần biết nơi lưu trữ tài liệu workflow.
       
       Options:
       1. copilot-flow/ (recommended if exists)
       2. <current-root>/
       3. Other: ___
       
       Which root should be the impl_root?"
     
  4. Update WORKSPACE_CONTEXT.md with answer
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
workflow_detection:
  1. Get current branch:
     command: git rev-parse --abbrev-ref HEAD
     normalize: lowercase, hyphens only
     result: <branch-slug>
     
  2. Check for state file:
     path: <impl_root>/docs/runs/<branch-slug>/.workflow-state.yaml
     
  3. If state file EXISTS:
     action: Load and show resume prompt
     goto: Step 5A (Resume Mode)
     
  4. If state file NOT EXISTS:
     action: Ask what user wants to do
     goto: Step 5B (New Session Mode)
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
     **Impl Root:** `<impl_root>`
     **Branch:** `<branch-slug>`
     
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
    1. Create branch directory:
       path: <impl_root>/docs/runs/<branch-slug>/
       
    2. Create state file from template:
       source: <impl_root>/docs/templates/workflow-state.template.yaml
       target: <impl_root>/docs/runs/<branch-slug>/.workflow-state.yaml
       
    3. Initialize state:
       meta:
         branch_slug: <branch-slug>
         impl_root: <impl_root>
         feature_name: <from user description>
         created_at: <now>
         last_updated: <now>
       status:
         current_phase: 0
         phase_name: analysis
         phase_status: not-started
         last_action: "Workflow initialized"
         next_action: "Capture work description"
         blockers: []
         
    4. Create README.md for reviewers:
       path: <impl_root>/docs/runs/<branch-slug>/README.md
       
    5. Announce:
       "## ✅ Workflow Initialized / Workflow đã khởi tạo
       
       | Aspect | Value |
       |--------|-------|
       | Feature | <feature-name> |
       | Branch | `<branch-slug>` |
       | Docs Location | `<impl_root>/docs/runs/<branch-slug>/` |
       
       ---"
       
    6. Run work-intake.prompt.md to capture work description
    
    7. After work description captured, run work-review.prompt.md
    
    8. If READY, proceed to Phase 0 Analysis (solution design)
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
| Impl Root | `<impl_root>` |
| Primary Root | `<primary_root>` |
| Current Branch | `<branch-slug>` |
| Workflow Status | <Active / None> |

### Workspace Roots / Các Root
| Root | Type | Role |
|------|------|------|
| <root1> | <type> | <impl_root / code / ui / ...> |
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
| `go` / `tiếp` | Execute next action |
| `approved` / `duyệt` | Approve current phase |
| `skip` / `bỏ qua` | Skip current item |
| `help` | Show this reference |

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
- Contract: `<impl_root>/docs/workflow/contract.md`
- Templates: `<impl_root>/docs/templates/`
- This workflow: `<impl_root>/docs/runs/<branch-slug>/`
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

### No impl_root defined
```yaml
action: |
  "⚠️ impl_root not defined in WORKSPACE_CONTEXT.md
  
  I need to know where to store workflow documentation.
  
  Which root should be the implementation root?
  (This is where all workflow docs will be stored)
  
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
| Impl Root | `copilot-flow` |
| Primary Root | `apphub-vision` |
| Current Branch | `feature-add-analytics` |
| Workflow Status | Active (Phase 3) |

### Workspace Roots / Các Root
| Root | Type | Role |
|------|------|------|
| copilot-flow | docs | impl_root |
| apphub-vision | monorepo | primary code |
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
