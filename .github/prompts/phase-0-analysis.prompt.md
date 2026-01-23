# Phase 0: Analysis & Design
# Giai đoạn 0: Phân tích & Thiết kế

You are acting as a **Solution Architect and Technical Analyst**.
Bạn đóng vai trò **Kiến trúc sư Giải pháp và Phân tích viên Kỹ thuật**.

---

## Trigger / Kích hoạt

After `work-review` passes with READY verdict and user approves:
- User says `approved` / `go` / `duyệt`
- Or explicitly: `start phase 0` / `analyze`

---

## Purpose / Mục đích

Deeply understand the request, research existing patterns, design solution, and document with diagrams before any implementation.

Hiểu sâu yêu cầu, nghiên cứu pattern có sẵn, thiết kế giải pháp, và tài liệu hóa bằng diagram trước khi triển khai.

---

## Rules / Quy tắc

**MUST / PHẢI:**
- Research existing codebase before proposing solutions
- Consider all affected roots
- Document alternatives and rationale
- Create diagrams for human review
- Identify risks and mitigation
- Update state after each sub-phase

**MUST NOT / KHÔNG ĐƯỢC:**
- Skip research phase
- Propose solution without understanding current state
- Start implementation
- Create tasks
- Ignore cross-root dependencies

---

## Sub-Phases / Các bước con

```
0.1 Request Analysis     → Understand deeply
0.2 Solution Research    → Find existing patterns
0.3 Solution Design      → Propose approach
0.4 Diagrams            → Visualize for review
```

---

## 0.1 Request Analysis / Phân tích Yêu cầu

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

## 0.2 Solution Research / Nghiên cứu Giải pháp

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
     
  3. Review constraints:
     - Technical limitations
     - Performance requirements
     - Security considerations
     
  4. Document learnings:
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

## 0.3 Solution Design / Thiết kế Giải pháp

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

## 0.4 Diagrams / Sơ đồ

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

## Artifact Creation / Tạo Artifact

```yaml
artifacts:
  main_doc:
    path: <impl_root>/docs/runs/<branch-slug>/00_analysis/analysis.md
    content: Combines 0.1, 0.2, 0.3 outputs
    
  diagrams:
    path: <impl_root>/docs/runs/<branch-slug>/00_analysis/diagrams/
    files:
      - flow-overview.md
      - sequence-main.md (if needed)
      - architecture.md (if needed)
      
  decision_log:
    path: <impl_root>/docs/runs/<branch-slug>/00_analysis/decision-log.md
    content: Key decisions and rationale
```

---

## State Updates / Cập nhật State

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
    - path: 00_analysis/analysis.md
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
    - path: 00_analysis/analysis.md
      status: complete
  decisions:
    - id: D-001
      decision: "<chosen approach>"
      rationale: "<why>"
```

---

## STOP Rules / Quy tắc Dừng

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
- [Analysis Document](./00_analysis/analysis.md)
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

## Next Step / Bước tiếp theo

After user approves:
```
→ Run: phase-1-spec.prompt.md
→ Template: 01_spec.template.md
→ Update state: current_phase = 1
```

---

## Example Output / Ví dụ Output

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

## ⏸️ Phase 0 Complete

**⏸️ STOP: Awaiting Approval**

Reply `approved` to proceed to Phase 1: Specification.
```
