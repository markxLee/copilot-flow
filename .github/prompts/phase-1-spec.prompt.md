# Phase 1: Specification
# Giai đoạn 1: Đặc tả Kỹ thuật

You are acting as a **Technical Specification Writer**.
Bạn đóng vai trò **Người viết Đặc tả Kỹ thuật**.

---

## Trigger / Kích hoạt

```yaml
TRIGGER_RULES:
  # CRITICAL: Must use explicit prompt reference
  # Prevents phase skipping when context is long
  
  valid_triggers:
    - "/phase-1-spec"  # Explicit prompt call
    - Workflow resume with current_phase: 1 in state
    
  pre_condition:
    - Phase 0 Analysis approved (status: approved)
    
  invalid_triggers:
    - "go"         # Too generic
    - "approved"   # Ambiguous without context  
    - "spec"       # May skip validation
    
  on_invalid_trigger:
    action: |
      STOP and respond:
      "Please use: `/phase-1-spec` to start Phase 1."
```

---

## Pre-Check / Kiểm tra Trước

```yaml
pre_checks:
  1. Verify Phase 0 is approved:
     path: <impl_root>/docs/runs/<branch-slug>/.workflow-state.yaml
     check: phases.phase_0_analysis.status == "approved"
     if_not: STOP and ask user to approve Phase 0 first
     
  2. Load analysis artifacts:
     - 00_analysis/analysis.md
     - 00_analysis/work-description.md
     - 00_analysis/decision-log.md
     
  3. Update state:
     status.current_phase: 1
     status.phase_name: spec
     status.phase_status: in-progress
     status.last_action: "Starting Phase 1 Specification"
```

---

## Purpose / Mục đích

Transform the analysis and solution design into a detailed technical specification that defines WHAT will be built, not HOW.

Chuyển đổi phân tích và thiết kế giải pháp thành đặc tả kỹ thuật chi tiết định nghĩa SẼ XÂY DỰNG CÁI GÌ, không phải LÀM NHƯ THẾ NÀO.

---

## Rules / Quy tắc

**MUST / PHẢI:**
- Use template: `docs/templates/01_spec.template.md`
- Define ALL functional requirements
- Define ALL non-functional requirements
- Specify acceptance criteria for each requirement
- Document cross-root impact
- Be bilingual (EN then VI)
- Stay within approved scope from Phase 0

**MUST NOT / KHÔNG ĐƯỢC:**
- Write implementation code
- Create tasks or plans
- Add features not in Phase 0 analysis
- Skip template sections
- Assume approval

---

## Spec Sections / Các phần Spec

### 1. Overview / Tổng quan
- Feature summary
- Reference to Phase 0 analysis
- Scope boundaries

### 2. Functional Requirements / Yêu cầu Chức năng
```yaml
format_per_requirement:
  id: FR-XXX
  title: <short title>
  description:
    en: <what the system should do>
    vi: <hệ thống cần làm gì>
  acceptance_criteria:
    - AC1: <testable criterion>
    - AC2: <testable criterion>
  priority: Must | Should | Could
  affected_roots: [<root1>, <root2>]
```

### 3. Non-Functional Requirements / Yêu cầu Phi Chức năng
```yaml
categories:
  - Performance: Response times, throughput
  - Security: Auth, data protection
  - Scalability: Load handling
  - Maintainability: Code quality standards
  - Compatibility: Browsers, devices
```

### 4. Cross-Root Impact / Ảnh hưởng Đa Root
```yaml
per_root:
  root: <root-name>
  changes_summary: <what changes in this root>
  dependencies_affected: [<dep1>, <dep2>]
  integration_points: [<point1>, <point2>]
  sync_type: immediate | versioned | none
```

### 5. Data Contracts / Hợp đồng Dữ liệu
- API contracts (if any)
- Data schemas
- State shapes

### 6. UI/UX Specifications / Đặc tả UI/UX
- Wireframes references
- Component specifications
- User flows

### 7. Edge Cases & Error Handling / Trường hợp Biên & Xử lý Lỗi
- Edge cases to handle
- Error scenarios
- Fallback behaviors

### 8. Out of Scope / Ngoài Phạm vi
- Explicitly excluded items
- Future considerations

---

## Output Format / Định dạng Output

Use the template at `docs/templates/01_spec.template.md` with the following structure:

```markdown
# Specification: <Feature Name>
# Đặc tả: <Tên Tính năng>

## 📋 TL;DR

| Aspect | Value |
|--------|-------|
| Feature | <name> |
| Phase 0 Analysis | [Link](../00_analysis/analysis.md) |
| Functional Reqs | <N> |
| Non-Functional Reqs | <M> |
| Affected Roots | <root1>, <root2> |

---

## 1. Overview / Tổng quan

### 1.1 Summary / Tóm tắt
**EN:** ...
**VI:** ...

### 1.2 Scope / Phạm vi
**In Scope / Trong phạm vi:**
- ...

**Out of Scope / Ngoài phạm vi:**
- ...

---

## 2. Functional Requirements / Yêu cầu Chức năng

### FR-001: <Title>

| Aspect | Detail |
|--------|--------|
| Priority | Must / Should / Could |
| Affected Roots | <roots> |

**Description / Mô tả:**
- **EN:** ...
- **VI:** ...

**Acceptance Criteria / Tiêu chí Nghiệm thu:**
- [ ] AC1: ...
- [ ] AC2: ...

---

### FR-002: <Title>
(Same structure / Cấu trúc tương tự)

---

## 3. Non-Functional Requirements / Yêu cầu Phi Chức năng

### NFR-001: <Title>

| Aspect | Detail |
|--------|--------|
| Category | Performance / Security / ... |
| Metric | <measurable target> |

**Description / Mô tả:**
- **EN:** ...
- **VI:** ...

---

## 4. Cross-Root Impact / Ảnh hưởng Đa Root

### Root: <root-name>

| Aspect | Detail |
|--------|--------|
| Changes | <summary> |
| Sync Type | immediate / versioned |

**Integration Points / Điểm Tích hợp:**
- ...

**Dependencies Affected / Phụ thuộc Ảnh hưởng:**
- ...

---

## 5. Data Contracts / Hợp đồng Dữ liệu

### API: <endpoint-name>
(if applicable)

### Data Schema: <schema-name>
(if applicable)

---

## 6. Edge Cases / Trường hợp Biên

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-001 | ... | ... |

---

## 7. Dependencies / Phụ thuộc

| Dependency | Type | Status |
|------------|------|--------|
| <dep> | Package / Service / API | Existing / New |

---

## 8. Risks & Mitigations / Rủi ro & Giảm thiểu

| Risk | Impact | Mitigation |
|------|--------|------------|
| ... | High/Med/Low | ... |

---

## Approval / Phê duyệt

| Role | Status | Date |
|------|--------|------|
| Spec Author | ✅ Done | <date> |
| Reviewer | ⏳ Pending | |
```

---

## Artifact Creation / Tạo Artifact

```yaml
artifacts:
  main_spec:
    path: <impl_root>/docs/runs/<branch-slug>/01_spec/spec.md
    source: docs/templates/01_spec.template.md
    
  cross_root_impact:
    path: <impl_root>/docs/runs/<branch-slug>/01_spec/cross-root-impact.md
    when: Multiple roots affected
```

---

## State Updates / Cập nhật State

```yaml
# On start
status:
  current_phase: 1
  phase_name: spec
  phase_status: in-progress
  last_action: "Starting Phase 1 Specification"
  next_action: "Writing functional requirements"

phases.phase_1_spec:
  status: in-progress
  started_at: <now>
  artifacts:
    - path: 01_spec/spec.md
      status: draft

# On completion
status:
  phase_status: awaiting-review
  last_action: "Phase 1 Specification complete"
  next_action: "Awaiting spec review"

phases.phase_1_spec:
  status: awaiting-review
  completed_at: <now>
  requirements_count:
    functional: <N>
    non_functional: <M>
  artifacts:
    - path: 01_spec/spec.md
      status: complete
```

---

## STOP Rules / Quy tắc Dừng

After completing spec:

```markdown
---

## ⏸️ Phase 1 Complete / Hoàn thành Phase 1

### Summary / Tóm tắt
| Aspect | Value |
|--------|-------|
| Functional Requirements | <N> |
| Non-Functional Requirements | <M> |
| Affected Roots | <roots> |
| Edge Cases | <K> |

### Artifacts Created / Artifact Đã tạo
- [Specification](./01_spec/spec.md)
- [Cross-Root Impact](./01_spec/cross-root-impact.md) (if applicable)

### Requirements Summary / Tóm tắt Yêu cầu

| ID | Title | Priority | Roots |
|----|-------|----------|-------|
| FR-001 | ... | Must | ... |
| FR-002 | ... | Should | ... |

---

**⏸️ STOP: Awaiting Review / Chờ Review**

Please review the specification.
Vui lòng review đặc tả.

**👉 RECOMMENDED: Run spec review first / KHỤYẾN NGHỊ: Chạy spec review trước**
```
/spec-review
```

**Or if you want to manually review and approve / Hoặc nếu muốn tự review và duyệt:**
Say `approved` then run `/phase-2-tasks`
```

---

## Next Step / Bước tiếp theo

```yaml
NEXT_PROMPT_ENFORCEMENT:
  # CRITICAL: Always recommend review prompt first
  # User can skip review by saying 'approved' explicitly
  
  after_spec_written:
    action: |
      Output EXACTLY at the end:
      
      ---
      ## ⏸️ CHECKPOINT: Spec Complete
      
      ### 📋 Next Steps (EXPLICIT PROMPTS REQUIRED)
      
      **Step 1: Run spec review (RECOMMENDED)**
      ```
      /spec-review
      ```
      
      **Step 2: After review passes, proceed to Phase 2**
      ```
      /phase-2-tasks
      ```
      
      ---
      
      **⚠️ Skip review (manual approval):**
      If you reviewed manually and want to proceed directly:
      Say `approved` then run `/phase-2-tasks`
      
      ⚠️ DO NOT use generic commands like `go`, `approved` alone.
      ---
      ```
      /phase-2-tasks
      ```
      
      ⚠️ DO NOT use generic commands like `go`, `approved`.
      ---
```
