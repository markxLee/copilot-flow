# Phase 0: Analysis & Design
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

You are acting as a **Solution Architect and Technical Analyst**.

---

## Trigger

```yaml
TRIGGER_RULES:
  # CRITICAL: Must use explicit prompt reference
  # Prevents phase skipping when context is long
  
  valid_triggers:
    - "/phase-0-analysis"  # Explicit prompt call
    - Workflow resume with current_phase: 0 in state
    
  pre_condition:
    - work-review completed with READY verdict
    - User confirmed approval
    
  invalid_triggers:
    - "go"         # Too generic
    - "approved"   # Ambiguous without context
    - "analyze"    # May skip validation
    
  on_invalid_trigger:
    action: |
      STOP and respond:
      "Please use: `/phase-0-analysis` to start Phase 0."
```

---

## Purpose

Deeply understand the request, research existing patterns, design solution, and document with diagrams before any implementation.

Optional helper:
- If the problem is hard or high-risk, you MAY run `.github/prompts/deep-dive.prompt.md` with `phase:0` before finalizing the Phase 0 artifact.
- Deep Dive must not change Phase 0 rules (still no implementation, still requires approval).

---

## Rules

**MUST:**
- Research existing codebase before proposing solutions
- Consider all affected roots
- Document alternatives and rationale
- Create diagrams for human review
- Identify risks and mitigation
- Update state after each sub-phase
- Create/update the canonical artifact `00_analysis/solution-design.md` using the official template: `docs/templates/00_analysis.template.md`
- Follow the template’s structure and bilingual order for the final artifact

**MUST NOT:**
- Skip research phase
- Propose solution without understanding current state
- Start implementation
- Create tasks
- Ignore cross-root dependencies

---

## Sub-Phases

```
0.1 Request Analysis     → Understand deeply
0.2 Solution Research    → Find existing patterns
0.3 Solution Design      → Propose approach
0.4 Diagrams            → Visualize for review
```

---

## 0.1 Request Analysis

### Input
- Work description from `00_analysis/work-description.md`
- Acceptance criteria from work-review

### Actions

```yaml
analysis_steps:
  1. Clarify problem statement:
     - What exactly needs to change?
     - Why is current state insufficient?
     - What triggers this need?
     
  2. Understand context:
     - Current behavior / state
     - Desired behavior / state
     - Gap between them
     
  3. Identify affected areas:
     - Which roots?
     - Which components/modules?
     - Which files likely change?
     
  4. List open questions:
     - Technical unknowns
     - Business logic clarifications
     - Edge cases to confirm
     
  5. Document assumptions:
     - What we're assuming is true
     - What we're assuming won't change
```

### Output Format

```markdown
## 0.1 Request Analysis / Phân tích Yêu cầu

### Problem Statement / Vấn đề
**EN:** Clear description of what needs to change and why.
**VI:** Mô tả rõ ràng cần thay đổi gì và tại sao.

### Context / Ngữ cảnh

| Aspect | Current / Hiện tại | Desired / Mong muốn |
|--------|-------------------|---------------------|
| Behavior | ... | ... |
| Data flow | ... | ... |
| User experience | ... | ... |

### Gap Analysis / Phân tích Khoảng cách
- EN: What's missing / VI: Còn thiếu gì
- EN: What needs to change / VI: Cần thay đổi gì

### Affected Areas / Vùng Ảnh hưởng

| Root | Component | Impact |
|------|-----------|--------|
| <root1> | <component> | <what changes> |
| <root2> | <component> | <what changes> |

### Open Questions / Câu hỏi Mở
1. EN: ... / VI: ...

### Assumptions / Giả định
1. EN: ... / VI: ...
```

---

## 0.2 Solution Research

### Actions

```yaml
research_steps:
  1. Search existing patterns:
     - Similar features in codebase
     - Established patterns for this type of work
     - Reusable utilities/components
     
  2. Analyze dependencies:
     - Required packages (existing vs new)
     - Cross-root dependencies
     - External API dependencies
     
  3. CRITICAL - Check WORKSPACE_CONTEXT.md for cross-root work:
     IF work involves multiple roots:
       a. READ WORKSPACE_CONTEXT.md Section 9 (cross_root_workflows)
       b. Identify which pattern applies:
          - library_consumer: reviews-assets → apphub-vision
          - shared_packages: packages/* → apps/*
          - api_integration: boost-pfs-backend → apphub-vision
       c. Document the workflow sequence from WORKSPACE_CONTEXT
       d. Note build order dependencies
       e. Verify import patterns
       
     Example triggers:
       - "migrate from storybook" → check library_consumer
       - "use shared package" → check shared_packages
       - "call backend API" → check api_integration
     
  4. Review constraints:
     - Technical limitations
     - Performance requirements
     - Security considerations
     
  5. Document learnings:
     - What can be reused
     - What needs to be created
     - What patterns to follow
```

### Output Format

```markdown
## 0.2 Solution Research / Nghiên cứu Giải pháp

### Existing Patterns Found / Pattern Có sẵn

| Location | Pattern | Applicable | Notes |
|----------|---------|------------|-------|
| `<file-path>` | <description> | Yes/Partial/No | ... |

### Similar Implementations / Triển khai Tương tự

| Location | What it does | Learnings |
|----------|--------------|-----------|
| `<file-path>` | ... | EN: ... / VI: ... |

### Dependencies / Phụ thuộc

| Dependency | Purpose | Status |
|------------|---------|--------|
| `<package>` | ... | Existing / Need to add |

### Cross-Root Dependencies / Phụ thuộc Đa Root

| From | To | Type | Impact |
|------|----|------|--------|
| <root1> | <root2> | <relationship> | ... |

### Reusable Components / Component Tái sử dụng
- `<path>`: EN: ... / VI: ...

### New Components Needed / Component Cần tạo Mới
- EN: ... / VI: ...
```

---

## 0.3 Solution Design

### Actions

```yaml
design_steps:
  1. Propose approach:
     - High-level solution overview
     - Key components and their responsibilities
     - Data flow between components
     
  2. Consider alternatives:
     - At least 2 alternatives
     - Pros/cons of each
     - Why chosen approach is best
     
  3. Define components:
     - Name, root, purpose
     - Inputs and outputs
     - Dependencies
     
  4. Plan error handling:
     - What can go wrong
     - How to handle each case
     
  5. Define rollback plan:
     - How to undo if needed
```

### Output Format

```markdown
## 0.3 Solution Design / Thiết kế Giải pháp

### Solution Overview / Tổng quan Giải pháp

**EN:** 1-2 paragraph description of the chosen approach.

**VI:** Mô tả 1-2 đoạn về phương pháp được chọn.

### Approach Comparison / So sánh Phương pháp

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Chosen:** <name> | ... | ... | ✅ Selected |
| Alternative 1 | ... | ... | ❌ Rejected: <reason> |
| Alternative 2 | ... | ... | ❌ Rejected: <reason> |

### Components / Các Component

| # | Name | Root | Purpose |
|---|------|------|---------|
| 1 | <name> | <root> | EN: ... / VI: ... |
| 2 | <name> | <root> | EN: ... / VI: ... |

### Component Details / Chi tiết Component

#### Component 1: `<name>`

| Aspect | Detail |
|--------|--------|
| Root | `<root>` |
| Location | `<file-path>` |
| Purpose | EN: ... / VI: ... |
| Inputs | `<input1>`, `<input2>` |
| Outputs | `<output1>` |
| Dependencies | `<dep1>`, `<dep2>` |

### Data Flow / Luồng Dữ liệu

| Step | From | To | Data | Action |
|------|------|----|------|--------|
| 1 | User | Component A | <data> | <action> |
| 2 | Component A | Component B | <data> | <action> |

### Error Handling / Xử lý Lỗi

| Scenario | Handling | User Impact |
|----------|----------|-------------|
| <error case> | EN: ... / VI: ... | ... |

### Rollback Plan / Kế hoạch Rollback

**EN:** How to undo this change if something goes wrong.

**VI:** Cách hoàn tác thay đổi nếu có vấn đề.
```

---

## 0.4 Diagrams

### Purpose
Visualize solution for **human review**. Mermaid diagrams are for reviewers, not AI.

### Required Diagrams

```yaml
diagrams:
  1. flow_overview:
     type: flowchart
     purpose: Main execution flow
     file: 00_analysis/diagrams/flow-overview.md
     
  2. sequence_main:
     type: sequence
     purpose: Component interactions
     file: 00_analysis/diagrams/sequence-main.md
     when: If multiple components interact
     
  3. architecture_change:
     type: architecture
     purpose: System changes visualization
     file: 00_analysis/diagrams/architecture.md
     when: If significant structural changes
```

### Diagram Templates

#### Flow Overview
```markdown
# Flow Overview / Tổng quan Luồng

## Current Flow / Luồng Hiện tại
​```mermaid
flowchart TD
    A[Start] --> B[Step 1]
    B --> C[Step 2]
    C --> D[End]
​```

## Proposed Flow / Luồng Đề xuất
​```mermaid
flowchart TD
    A[Start] --> B[Step 1]
    B --> C{New Decision?}
    C -->|Yes| D[New Feature]
    C -->|No| E[Existing Path]
    D --> F[End]
    E --> F
​```

## Changes Highlighted / Thay đổi Nổi bật
- Added: ...
- Modified: ...
- Removed: ...
```

#### Sequence Diagram
```markdown
# Sequence: <Feature Name>

​```mermaid
sequenceDiagram
    participant U as User
    participant C1 as Component1
    participant C2 as Component2
    participant DB as Database
    
    U->>C1: Action
    C1->>C2: Request
    C2->>DB: Query
    DB-->>C2: Result
    C2-->>C1: Response
    C1-->>U: Display
​```

## Notes / Ghi chú
- Step 1: ...
- Step 2: ...
```

---

## Artifact Creation

```yaml
artifacts:
  main_doc:
    # Canonical Phase 0 artifact name (matches workflow contract + state template)
    path: <docs_root>/docs/runs/<branch-slug>/00_analysis/solution-design.md
    content: Combines 0.1, 0.2, 0.3 outputs
    
  diagrams:
    path: <docs_root>/docs/runs/<branch-slug>/00_analysis/diagrams/
    files:
      - flow-overview.md
      - sequence-main.md (if needed)
      - architecture.md (if needed)
      
  decision_log:
    path: <docs_root>/docs/runs/<branch-slug>/00_analysis/decision-log.md
    content: Key decisions and rationale
```

---

## State Updates

```yaml
# Starting Phase 0
status:
  current_phase: 0
  phase_name: analysis
  phase_status: in-progress
  last_action: "Starting Phase 0 Analysis"
  next_action: "Request Analysis (0.1)"

# After each sub-phase
phases.phase_0_analysis:
  status: in-progress
  artifacts:
    - path: 00_analysis/solution-design.md
      status: draft
    - path: 00_analysis/diagrams/flow-overview.md
      status: pending

# After completion
status:
  phase_status: awaiting-review
  last_action: "Phase 0 Analysis complete"
  next_action: "Awaiting user approval for Phase 1"

phases.phase_0_analysis:
  status: awaiting-review
  completed_at: <now>
  artifacts:
    - path: 00_analysis/solution-design.md
      status: complete
  decisions:
    - id: D-001
      decision: "<chosen approach>"
      rationale: "<why>"
```

---

## STOP Rules

After completing all sub-phases:

```markdown
---

## ⏸️ Phase 0 Complete / Hoàn thành Phase 0

### Summary / Tóm tắt
| Aspect | Value |
|--------|-------|
| Problem | <1-line summary> |
| Solution | <chosen approach> |
| Components | <N> components across <M> roots |
| Diagrams | <N> diagrams created |

### Artifacts Created / Artifact Đã tạo
- [Solution Design](./00_analysis/solution-design.md) (preferred)
- Legacy alias (if resuming older runs): `./00_analysis/analysis.md`
- [Flow Overview](./00_analysis/diagrams/flow-overview.md)
- [Decision Log](./00_analysis/decision-log.md)

### Key Decisions / Quyết định Chính
1. <decision 1>
2. <decision 2>

---

**⏸️ STOP: Awaiting Approval / Chờ Phê duyệt**

Please review the analysis and diagrams.
Vui lòng review phân tích và sơ đồ.

Reply / Trả lời:
- `approved` / `duyệt` → Proceed to Phase 1: Specification
- `feedback: <your feedback>` → Revise analysis
```

---

## Next Step

After user approves:
```
→ Run: phase-1-spec.prompt.md
→ Template: 01_spec.template.md
→ Update state: current_phase = 1
```

---

## Example Output

```markdown
## 0.1 Request Analysis

### Problem Statement
**EN:** Dashboard lacks analytics tracking. We need to understand user behavior to improve the product.

**VI:** Dashboard thiếu tracking analytics. Cần hiểu hành vi người dùng để cải thiện sản phẩm.

### Context

| Aspect | Current | Desired |
|--------|---------|---------|
| Tracking | None | GA4 events |
| Data | No insights | User behavior data |

### Affected Areas

| Root | Component | Impact |
|------|-----------|--------|
| apphub-vision | Dashboard | Add tracking hooks |
| apphub-vision | packages/utils | Add analytics utility |

---

## 0.2 Solution Research

### Existing Patterns Found

| Location | Pattern | Applicable |
|----------|---------|------------|
| `apps/dashboard/src/hooks/useAnalytics.ts` | Not found | Need to create |
| `packages/utils/src/tracking.ts` | Not found | Need to create |

### Similar Implementations
None found in codebase. Will follow GA4 best practices.

---

## 0.3 Solution Design

### Solution Overview
**EN:** Create a centralized analytics utility in packages/utils that wraps GA4. Dashboard components will use a custom hook to send events.

### Approach Comparison

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Centralized utility** | Reusable, testable | Initial setup | ✅ Selected |
| Direct GA4 calls | Quick | Scattered code | ❌ Hard to maintain |

### Components

| # | Name | Root | Purpose |
|---|------|------|---------|
| 1 | analytics.ts | packages/utils | GA4 wrapper |
| 2 | useAnalytics | apps/dashboard | React hook |
| 3 | AnalyticsProvider | apps/dashboard | Context provider |

---

## ⏸️ CHECKPOINT: Phase 0 Complete

**Analysis & Design finished. Awaiting approval.**

---

### 📋 Next Steps (EXPLICIT PROMPTS REQUIRED)

**To approve and proceed to Phase 1:**
```
/phase-1-spec
```

**To request changes:**
```
feedback: <your feedback>
```
Then re-run `/phase-0-analysis`

⚠️ DO NOT use generic commands like `go`, `approved`, `continue`.
⚠️ KHÔNG dùng lệnh chung như `go`, `approved`, `continue`.
```
