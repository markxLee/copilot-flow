# Complete Workflow Example

> 🇬🇧 A complete end-to-end example from workspace setup to PR submission
> 🇻🇳 Ví dụ hoàn chỉnh từ đầu đến cuối từ setup workspace đến tạo PR

---

## 📖 Table of Contents

1. [Scenario](#-scenario)
2. [Part 1: Workspace Setup](#-part-1-workspace-setup)
3. [Part 2: Work Intake & Review](#-part-2-work-intake--review)
4. [Part 3: Phase 0 - Analysis](#-part-3-phase-0---analysis)
5. [Part 4: Phase 1 - Specification](#-part-4-phase-1---specification)
6. [Part 5: Phase 2 - Task Planning](#-part-5-phase-2---task-planning)
7. [Part 6: Phase 3 - Implementation](#-part-6-phase-3---implementation)
8. [Part 7: Phase 4 - Testing](#-part-7-phase-4---testing)
9. [Part 8: Phase 5 - Done Check](#-part-8-phase-5---done-check)
10. [Part 8.5: Self-Review Before PR](#-part-85-self-review-before-pr-optional-but-recommended) ← **NEW**
11. [Part 9: PR & Notification](#-part-9-pr--notification)
12. [Bonus: Handling Changes](#-bonus-handling-changes)
13. [Quick Reference Card](#-quick-reference-card)

---

## 🎯 Scenario

**Feature Request:** Add real-time notification system to the dashboard

**Requirements:**
- Show toast notifications for new events
- Support different notification types (info, success, warning, error)
- Persist notification preferences
- Work across all dashboard pages

**Affected roots:** `apphub-vision` (primary), potentially `boost-pfs-backend` (API)

---

## 🔧 Part 1: Workspace Setup

> First-time setup only. Skip if already done.

### What is Multi-Root Workspace?

A VS Code workspace containing multiple project folders (roots) that work together. Example:

```
boostcommerce.code-workspace
├── copilot-flow/        # Workflow tooling (prompts, templates)
├── apphub-vision/       # Main application
├── boost-pfs-backend/   # Backend services
└── reviews-assets/      # UI library
```

**Benefits:**
- Work across multiple repos in one VS Code window
- Shared settings and extensions
- Cross-repo search and navigation
- Unified Copilot context

### Step 1.0: Create Multi-Root Workspace

**Option A: From copilot-flow (Recommended)**

1. Clone `copilot-flow` repo:
   ```bash
   git clone https://github.com/your-org/copilot-flow.git
   cd copilot-flow
   code .
   ```

2. Add other project folders:
   - `File → Add Folder to Workspace...`
   - Add `apphub-vision`, `boost-pfs-backend`, `reviews-assets`, etc.

3. Save workspace:
   - `File → Save Workspace As...`
   - Save as `boostcommerce.code-workspace` (in parent folder)

**Option B: From Scratch**

1. Open VS Code
2. `File → Add Folder to Workspace...` (add first repo)
3. Repeat for all repos
4. `File → Save Workspace As...`

**Workspace Structure:**
```
~/projects/
├── boostcommerce.code-workspace   # ← Open this file
├── copilot-flow/
├── apphub-vision/
├── boost-pfs-backend/
└── reviews-assets/
```

### Step 1.1: Run Full Setup

```
You: /setup-workspace

Copilot: 🔧 Running workspace setup...

         Step 1/4: /workspace-discovery
         ✅ Scanned 4 roots
         ✅ Created WORKSPACE_CONTEXT.md
         
         Step 2/4: /cross-root-guide
         ✅ Detected library_consumer pattern (reviews-assets → apphub-vision)
         ✅ Detected api_integration pattern (boost-pfs-backend → apphub-vision)
         ✅ Updated WORKSPACE_CONTEXT.md
         
         Step 3/4: /sync-instructions
         ✅ Synced coding-practices.instructions.md to 3 roots
         ✅ Synced typescript.instructions.md to 3 roots
         ✅ Synced testing.instructions.md to 3 roots
         💡 Suggestion: Create python.instructions.md for boost-pfs-backend
         
         Step 4/4: /generate-workspace-file
         ✅ Created boostcommerce.code-workspace
         ✅ Created ARCHITECTURE.md
         
         🎉 Setup complete!
         
         Next: Open workspace with:
         code boostcommerce.code-workspace
```

### Step 1.2: Verify Setup (Optional)

```
You: /workflow-status

Copilot: 📍 Workspace Status
         
         | Item | Status |
         |------|--------|
         | WORKSPACE_CONTEXT.md | ✅ Found |
         | tooling_root | copilot-flow |
         | default_docs_root | apphub-vision |
         | Roots configured | 4 |
         | Shared instructions | 3 synced |
         
         No active workflow. Ready for new work.
```

---

## 📋 Part 2: Work Intake & Review

### Step 2.1: Initialize Session

```
You: /cf-init

Copilot: 📍 Session Initialized
         
         tooling_root: copilot-flow
         default_docs_root: apphub-vision
         Current branch: main
         
         No active workflow found.
         Describe your work or say /work-intake to start.
```

### Step 2.2: Describe Work

```
You: Add real-time notification system to dashboard

Copilot: ## 📋 Work Intake
         
         | Field | Value |
         |-------|-------|
         | Work Type | FEATURE |
         | Title | Real-time Notification System |
         | Affected Roots | apphub-vision (primary) |
         
         ### 🇬🇧 Summary / 🇻🇳 Tóm tắt
         
         🇬🇧 Add a notification system to display real-time alerts to users 
         across all dashboard pages.
         
         🇻🇳 Thêm hệ thống thông báo để hiển thị cảnh báo real-time cho user 
         trên tất cả các trang dashboard.
         
         ### ⚠️ Missing Information
         
         1. What triggers notifications? (WebSocket, polling, SSE?)
         2. Should notifications persist after page refresh?
         3. Any sound/vibration for notifications?
         4. Maximum number of visible notifications?
         5. Auto-dismiss after how many seconds?
         
         Please answer these questions.
```

### Step 2.3: Provide Missing Details

```
You: 1. WebSocket for real-time
     2. Yes, persist unread notifications
     3. No sound, just visual
     4. Max 5 visible, others in notification center
     5. Auto-dismiss after 5 seconds, or manual dismiss

Copilot: ✅ Work description complete!
         
         ### Updated Requirements
         
         | Requirement | Value |
         |-------------|-------|
         | Delivery method | WebSocket |
         | Persistence | Yes (unread only) |
         | Sound | No |
         | Max visible | 5 |
         | Auto-dismiss | 5 seconds |
         
         Running /work-review...
```

### Step 2.4: Work Review Gate

```
Copilot: ## 🔍 Work Review
         
         | Verdict | ✅ READY |
         | Confidence | High |
         | Complexity | Medium |
         | Estimated Effort | 2-3 days |
         
         ### 🇬🇧 Acceptance Criteria / 🇻🇳 Tiêu chí Chấp nhận
         
         - 🇬🇧 Toast notifications appear for new events / 🇻🇳 Toast notifications xuất hiện cho events mới
         - 🇬🇧 4 notification types supported / 🇻🇳 Hỗ trợ 4 loại notification
         - 🇬🇧 Max 5 visible at once / 🇻🇳 Tối đa 5 hiển thị cùng lúc
         - 🇬🇧 Auto-dismiss after 5s / 🇻🇳 Tự đóng sau 5 giây
         - 🇬🇧 Unread notifications persist / 🇻🇳 Notifications chưa đọc được lưu lại
         - 🇬🇧 Works on all dashboard pages / 🇻🇳 Hoạt động trên tất cả trang dashboard
         
         ### 🇬🇧 Risks / 🇻🇳 Rủi ro
         
         - 🇬🇧 WebSocket connection management complexity / 🇻🇳 Phức tạp quản lý kết nối WebSocket
         - 🇬🇧 State synchronization across tabs / 🇻🇳 Đồng bộ state giữa các tab
         
         ### 🇬🇧 Suggestions / 🇻🇳 Đề xuất
         
         - 🇬🇧 Consider using Zustand for notification state / 🇻🇳 Cân nhắc dùng Zustand cho notification state
         - 🇬🇧 Add notification center component / 🇻🇳 Thêm component notification center
         
         ⏸️ STOP: Where should workflow docs go?
         
         Recommended: `apphub-vision` (code + docs in same PR)
         Alternative: `copilot-flow` (default_docs_root)

You: apphub-vision

Copilot: ✅ docs_root set to: apphub-vision
         📁 Workflow docs will be at: apphub-vision/docs/runs/feature-notification-system/
         
         ⏸️ STOP: Approve to proceed to Phase 0: Analysis
         
         Say `/phase-0-analysis` to continue.
```

---

## 🔬 Part 3: Phase 0 - Analysis

### Step 3.1: Start Analysis

```
You: /phase-0-analysis

Copilot: ## 🔬 Phase 0: Analysis & Design
         
         ### 🇬🇧 Current State / 🇻🇳 Trạng thái Hiện tại
         
         🇬🇧 The dashboard currently has no notification system. Users must 
         manually check for updates by refreshing pages.
         
         🇻🇳 Dashboard hiện tại không có hệ thống thông báo. User phải kiểm 
         tra updates thủ công bằng cách refresh trang.
         
         ### 🇬🇧 Research Summary / 🇻🇳 Tóm tắt Nghiên cứu
         
         **Existing Infrastructure:**
         | Component | Status | Notes |
         |-----------|--------|-------|
         | WebSocket | ✅ Available | Used by AI chat feature |
         | State management | Zustand | Already in dashboard |
         | Toast library | None | Need to add |
         
         **Technology Options:**
         | Option | Pros | Cons | Recommendation |
         |--------|------|------|----------------|
         | react-hot-toast | Simple, lightweight | Limited customization | ⭐ Recommended |
         | react-toastify | Feature-rich | Larger bundle | Good alternative |
         | Custom | Full control | More effort | Only if needed |
         
         ### 🇬🇧 Proposed Architecture / 🇻🇳 Kiến trúc Đề xuất
         
         ```
         ┌─────────────────────────────────────────────────────────────┐
         │                      Dashboard App                          │
         ├─────────────────────────────────────────────────────────────┤
         │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
         │  │ Toast       │◄───│ Notification │◄───│ WebSocket       │ │
         │  │ Component   │    │ Store       │    │ Hook            │ │
         │  └─────────────┘    │ (Zustand)   │    └─────────────────┘ │
         │                     └─────────────┘                        │
         │                           │                                │
         │                     ┌─────────────┐                        │
         │                     │ LocalStorage│                        │
         │                     │ (persist)   │                        │
         │                     └─────────────┘                        │
         └─────────────────────────────────────────────────────────────┘
         ```
         
         ### 🇬🇧 Design Decisions / 🇻🇳 Quyết định Thiết kế
         
         | Decision | Choice | Reason |
         |----------|--------|--------|
         | Toast library | react-hot-toast | Lightweight, good DX |
         | State | Zustand + persist | Already used, easy persistence |
         | WebSocket | Reuse existing | Avoid duplicate connections |
         
         📄 Created: `apphub-vision/docs/runs/feature-notification-system/00_analysis/solution-design.md`
         
         ⏸️ STOP: Review analysis and approve.
         
         Say `/phase-1-spec` to proceed to Specification.
```

### Step 3.2: Approve Analysis

```
You: /phase-1-spec
```

---

## 📝 Part 4: Phase 1 - Specification

### Step 4.1: Generate Specification

```
Copilot: ## 📝 Phase 1: Specification
         
         ### 🇬🇧 Functional Requirements / 🇻🇳 Yêu cầu Chức năng
         
         | ID | Requirement | Priority |
         |----|-------------|----------|
         | FR-001 | Display toast notifications for new events | Must |
         | FR-002 | Support 4 types: info, success, warning, error | Must |
         | FR-003 | Auto-dismiss after 5 seconds | Must |
         | FR-004 | Manual dismiss via close button | Must |
         | FR-005 | Maximum 5 toasts visible simultaneously | Must |
         | FR-006 | Notification center for history | Should |
         | FR-007 | Mark notifications as read/unread | Should |
         | FR-008 | Persist unread notifications across sessions | Should |
         
         ### 🇬🇧 Non-Functional Requirements / 🇻🇳 Yêu cầu Phi Chức năng
         
         | ID | Requirement | Target |
         |----|-------------|--------|
         | NFR-001 | Toast render time | < 50ms |
         | NFR-002 | Bundle size increase | < 10KB |
         | NFR-003 | No memory leaks | 0 leaks after 1hr |
         | NFR-004 | Accessibility | WCAG 2.1 AA |
         
         ### 🇬🇧 API Contract / 🇻🇳 Hợp đồng API
         
         **WebSocket Message Format:**
         ```typescript
         interface NotificationMessage {
           id: string;
           type: 'info' | 'success' | 'warning' | 'error';
           title: string;
           message: string;
           timestamp: number;
           action?: {
             label: string;
             url: string;
           };
         }
         ```
         
         **Notification Store Interface:**
         ```typescript
         interface NotificationStore {
           notifications: Notification[];
           unreadCount: number;
           addNotification: (n: NotificationMessage) => void;
           dismissNotification: (id: string) => void;
           markAsRead: (id: string) => void;
           markAllAsRead: () => void;
           clearAll: () => void;
         }
         ```
         
         📄 Created: `apphub-vision/docs/runs/feature-notification-system/01_spec/spec.md`
         
         ⏸️ STOP: Review specification.
         
         💡 Recommended: Run `/spec-review` for quality check.
```

### Step 4.2: Review Specification (Optional but Recommended)

```
You: /spec-review

Copilot: ## 🔍 Specification Review
         
         ### Quality Check
         
         | Criterion | Status | Notes |
         |-----------|--------|-------|
         | Completeness | ✅ Pass | All requirements covered |
         | Testability | ✅ Pass | Clear acceptance criteria |
         | Clarity | ✅ Pass | No ambiguous terms |
         | Feasibility | ✅ Pass | Within tech constraints |
         | Traceability | ⚠️ Minor | Add requirement IDs to AC |
         
         ### 🇬🇧 Suggestions / 🇻🇳 Đề xuất
         
         1. 🇬🇧 Add error handling for WebSocket disconnect
            🇻🇳 Thêm xử lý lỗi khi WebSocket disconnect
         
         2. 🇬🇧 Consider adding notification sound toggle for future
            🇻🇳 Cân nhắc thêm toggle âm thanh cho tương lai
         
         ### Verdict: ✅ APPROVED with minor suggestions
         
         Say `/phase-2-tasks` to proceed to Task Planning.

You: /phase-2-tasks
```

---

## 📋 Part 5: Phase 2 - Task Planning

### Step 5.1: Generate Tasks

```
Copilot: ## 📋 Phase 2: Task Planning
         
         ### 🇬🇧 Task Breakdown / 🇻🇳 Phân chia Task
         
         | ID | Task | Root | Est | Deps |
         |----|------|------|-----|------|
         | T-001 | Install and configure react-hot-toast | apphub-vision | 30m | - |
         | T-002 | Create notification Zustand store | apphub-vision | 1h | T-001 |
         | T-003 | Create useNotificationSocket hook | apphub-vision | 1h | T-002 |
         | T-004 | Create NotificationToast component | apphub-vision | 1h | T-001 |
         | T-005 | Create NotificationCenter component | apphub-vision | 2h | T-002 |
         | T-006 | Integrate into dashboard layout | apphub-vision | 30m | T-003, T-004 |
         | T-007 | Add notification preferences | apphub-vision | 1h | T-002 |
         | T-008 | Write unit tests | apphub-vision | 2h | T-001-T-007 |
         
         ### 🇬🇧 Task Details / 🇻🇳 Chi tiết Task
         
         #### T-001: Install and configure react-hot-toast
         
         🇬🇧 Install the toast library and add Toaster provider to app layout.
         🇻🇳 Cài đặt toast library và thêm Toaster provider vào app layout.
         
         **Files:**
         - `apps/dashboard/package.json`
         - `apps/dashboard/app/layout.tsx`
         
         #### T-002: Create notification Zustand store
         
         🇬🇧 Create store with persist middleware for notification state management.
         🇻🇳 Tạo store với persist middleware để quản lý state notification.
         
         **Files:**
         - `apps/dashboard/src/stores/notificationStore.ts`
         - `apps/dashboard/src/types/notification.ts`
         
         (... more task details ...)
         
         ### 🇬🇧 Summary / 🇻🇳 Tóm tắt
         
         | Metric | Value |
         |--------|-------|
         | Total tasks | 8 |
         | Estimated time | ~9 hours |
         | Files to create | 6 |
         | Files to modify | 3 |
         
         📄 Created: `apphub-vision/docs/runs/feature-notification-system/02_tasks/tasks.md`
         
         ⏸️ STOP: Review task plan.
         
         💡 Recommended: Run `/task-plan-review` for quality check.
```

### Step 5.2: Review Task Plan (Optional but Recommended)

```
You: /task-plan-review

Copilot: ## 🔍 Task Plan Review
         
         ### Quality Check
         
         | Criterion | Status | Notes |
         |-----------|--------|-------|
         | Granularity | ✅ Pass | Tasks are right-sized |
         | Dependencies | ✅ Pass | Correct order |
         | Estimates | ⚠️ Warn | T-005 may need 3h |
         | Coverage | ✅ Pass | All requirements mapped |
         | Testability | ✅ Pass | T-008 covers testing |
         
         ### 🇬🇧 Suggestions / 🇻🇳 Đề xuất
         
         1. 🇬🇧 Consider splitting T-005 (NotificationCenter) into UI + logic
            🇻🇳 Cân nhắc tách T-005 thành UI + logic
         
         ### Verdict: ✅ APPROVED
         
         Say `/phase-3-impl T-001` to start implementation.

You: /phase-3-impl T-001
```

---

## 🔧 Part 6: Phase 3 - Implementation

### Step 6.1: Plan Task (Gate 1)

```
Copilot: ## 🔧 Phase 3: Implementation
         
         ### Planning T-001: Install and configure react-hot-toast
         
         #### 🇬🇧 Task Summary / 🇻🇳 Tóm tắt Task
         
         🇬🇧 Install react-hot-toast library and configure Toaster provider 
         in the dashboard app layout.
         
         🇻🇳 Cài đặt thư viện react-hot-toast và cấu hình Toaster provider 
         trong layout của dashboard app.
         
         #### 🇬🇧 Requirements / 🇻🇳 Yêu cầu
         
         - From FR-001: Display toast notifications
         - From FR-002: Support 4 notification types
         - From NFR-002: Bundle size < 10KB (react-hot-toast is ~5KB)
         
         #### 🇬🇧 Approach / 🇻🇳 Cách tiếp cận
         
         1. Add react-hot-toast to package.json
         2. Add Toaster component to root layout
         3. Configure default toast options (position, duration)
         
         #### 🇬🇧 Files to Change / 🇻🇳 Files cần Thay đổi
         
         | File | Action | Description |
         |------|--------|-------------|
         | `apps/dashboard/package.json` | Modify | Add dependency |
         | `apps/dashboard/app/layout.tsx` | Modify | Add Toaster provider |
         
         ⏸️ GATE 1: Confirm approach?
         
         Say `/impl go` to proceed with implementation.
         Say "adjust" to modify the approach.
```

### Step 6.2: Implement (Gate 2)

```
You: /impl go

Copilot: 🔧 Implementing T-001...
         
         ✅ Modified: apps/dashboard/package.json
            + "react-hot-toast": "^2.4.1"
         
         ✅ Modified: apps/dashboard/app/layout.tsx
            + import { Toaster } from 'react-hot-toast';
            + <Toaster position="top-right" toastOptions={{...}} />
         
         ### 🇬🇧 Changes Summary / 🇻🇳 Tóm tắt Thay đổi
         
         | File | Lines | Change |
         |------|-------|--------|
         | package.json | +1 | Added dependency |
         | layout.tsx | +15 | Added Toaster with config |
         
         ### 🇬🇧 Next Steps / 🇻🇳 Bước Tiếp theo
         
         Run: `pnpm install` to install the new dependency.
         
         📄 Updated: impl-log.md
         
         ⏸️ GATE 2: Choose review method:
         
         - `/impl approved` — Mark complete (you've tested manually)
         - `/code-review T-001` — Request AI code review
```

### Step 6.3: Mark Task Complete

```
You: /impl approved

Copilot: ✅ T-001 marked as COMPLETED
         
         ### Progress
         
         | Task | Status |
         |------|--------|
         | T-001 | ✅ Completed |
         | T-002 | ⏳ Ready |
         | T-003 | ⏳ Blocked by T-002 |
         | T-004 | ⏳ Ready |
         | ... | ... |
         
         Say `/phase-3-impl T-002` or `/phase-3-impl next` to continue.
```

### Step 6.4: Continue with Next Tasks

```
You: /phase-3-impl next

Copilot: ## Planning T-002: Create notification Zustand store
         
         (... shows plan ...)
         
         ⏸️ GATE 1: Confirm approach?

You: /impl go

Copilot: 🔧 Implementing T-002...
         
         ✅ Created: apps/dashboard/src/stores/notificationStore.ts
         ✅ Created: apps/dashboard/src/types/notification.ts
         
         (... details ...)
         
         ⏸️ GATE 2: /impl approved or /code-review T-002?

You: /impl approved

(... repeat for T-003 through T-007 ...)
```

### Step 6.5: AI Code Review (Batch at End)

```
You: /code-review

Copilot: ## 🔍 Code Review: All Implementation Changes
         
         ### Files Reviewed
         
         | File | Issues | Suggestions |
         |------|--------|-------------|
         | notificationStore.ts | 0 | 1 |
         | useNotificationSocket.ts | 1 | 2 |
         | NotificationToast.tsx | 0 | 1 |
         | NotificationCenter.tsx | 1 | 0 |
         | layout.tsx | 0 | 0 |
         
         ### 🔴 Issues (Must Fix)
         
         **Issue 1: useNotificationSocket.ts:45**
         ```typescript
         // Current: Missing cleanup on unmount
         useEffect(() => {
           socket.on('notification', handleNotification);
         }, []);
         
         // Should be:
         useEffect(() => {
           socket.on('notification', handleNotification);
           return () => socket.off('notification', handleNotification);
         }, [handleNotification]);
         ```
         
         **Issue 2: NotificationCenter.tsx:78**
         ```typescript
         // Current: Potential memory leak
         const notifications = useNotificationStore(state => state.notifications);
         // No memoization on large list render
         ```
         
         ### 🟡 Suggestions (Optional)
         
         1. Add JSDoc comments to store functions
         2. Consider extracting toast config to constants
         3. Add aria-live for accessibility
         
         ### Verdict: ⚠️ NEEDS FIXES
         
         2 issues must be resolved before proceeding.
         
         Say `/code-fix-plan` to see fix plan.
```

### Step 6.6: Fix Issues

```
You: /code-fix-plan

Copilot: ## 🔧 Code Fix Plan
         
         ### Issue 1: Missing cleanup
         
         | Field | Value |
         |-------|-------|
         | File | useNotificationSocket.ts |
         | Line | 45 |
         | Type | Bug |
         | Risk | Memory leak |
         
         **Fix approach:**
         Add cleanup function in useEffect return.
         
         ### Issue 2: Missing memoization
         
         | Field | Value |
         |-------|-------|
         | File | NotificationCenter.tsx |
         | Line | 78 |
         | Type | Performance |
         | Risk | Re-render on every state change |
         
         **Fix approach:**
         Wrap notification list in useMemo.
         
         ⏸️ STOP: Approve fix plan?
         
         Say `/code-fix-apply` to apply fixes.

You: /code-fix-apply

Copilot: 🔧 Applying fixes...
         
         ✅ Fixed: useNotificationSocket.ts:45
            + Added cleanup function
            + Added handleNotification to deps
         
         ✅ Fixed: NotificationCenter.tsx:78
            + Added useMemo for notification list
         
         📄 Updated: impl-log.md
         
         Say `/phase-4-tests` to proceed to Testing.
```

---

## 🧪 Part 7: Phase 4 - Testing

### Step 7.1: Start Testing Phase

```
You: /phase-4-tests

Copilot: ## 🧪 Phase 4: Testing
         
         ### 🇬🇧 Test Strategy / 🇻🇳 Chiến lược Test
         
         🇬🇧 Based on implementation, here's the recommended test approach:
         
         🇻🇳 Dựa trên implementation, đây là cách tiếp cận test được khuyến nghị:
         
         | Test Type | Coverage Target | Priority |
         |-----------|-----------------|----------|
         | Unit Tests | ≥80% | High |
         | Integration | Key flows | Medium |
         | E2E | Happy path | Low |
         
         ### 🇬🇧 Test Plan / 🇻🇳 Kế hoạch Test
         
         #### Unit Tests
         
         | # | Test File | Test Cases | Priority |
         |---|-----------|------------|----------|
         | 1 | notificationStore.test.ts | addNotification, removeNotification, clearAll, persist/rehydrate | High |
         | 2 | useNotificationSocket.test.ts | connect, disconnect, reconnect, handleMessage | High |
         | 3 | NotificationToast.test.tsx | render types, dismiss, auto-dismiss timer | Medium |
         | 4 | NotificationCenter.test.tsx | render list, empty state, mark as read | Medium |
         
         #### Integration Tests
         
         | # | Test File | Test Cases | Priority |
         |---|-----------|------------|----------|
         | 1 | notification-flow.test.tsx | WebSocket → Store → Toast render | High |
         
         ### 🇬🇧 Creating Tests / 🇻🇳 Tạo Tests
         
         ⏸️ STOP: Approve test plan before creating test files?

You: approved

Copilot: 🧪 Creating test files...
         
         ✅ Created: src/__tests__/stores/notificationStore.test.ts
            - 8 test cases
            - Tests: add, remove, clear, persist
         
         ✅ Created: src/__tests__/hooks/useNotificationSocket.test.ts
            - 6 test cases
            - Tests: connect, disconnect, reconnect, message handling
            - Mocks: WebSocket, timers
         
         ✅ Created: src/__tests__/components/NotificationToast.test.tsx
            - 5 test cases
            - Tests: render 4 types, dismiss, auto-dismiss
         
         ✅ Created: src/__tests__/components/NotificationCenter.test.tsx
            - 4 test cases
            - Tests: render list, empty state, mark read
         
         📄 Created: tests.md
```

### Step 7.2: Run Tests

```
Copilot: ### 🇬🇧 Run Tests / 🇻🇳 Chạy Tests
         
         Run these commands and report results:
         
         ```bash
         # Run all tests
         pnpm --filter dashboard test
         
         # With coverage report
         pnpm --filter dashboard test:coverage
         
         # Watch mode (optional)
         pnpm --filter dashboard test:watch
         ```
         
         ⏸️ STOP: Run tests and tell me:
         1. Did all tests pass? (Y/N)
         2. Coverage percentage?
         3. Any failures? (paste error if any)

You: All pass, 78% coverage

Copilot: ✅ Test Results
         
         | Metric | Target | Actual | Status |
         |--------|--------|--------|--------|
         | Tests passing | 100% | 100% | ✅ |
         | Coverage | ≥70% | 78% | ✅ |
         | Statements | - | 78% | ✅ |
         | Branches | - | 72% | ✅ |
         | Functions | - | 85% | ✅ |
         | Lines | - | 78% | ✅ |
         
         ### 🇬🇧 Coverage Summary / 🇻🇳 Tóm tắt Coverage
         
         | File | Coverage | Notes |
         |------|----------|-------|
         | notificationStore.ts | 92% | Excellent |
         | useNotificationSocket.ts | 75% | Good |
         | NotificationToast.tsx | 80% | Good |
         | NotificationCenter.tsx | 68% | Acceptable |
         
         📄 Updated: tests.md with results
         
         ### 🇬🇧 Optional: Improve Coverage / 🇻🇳 Tùy chọn: Cải thiện Coverage
         
         Want to add more tests to improve coverage? (currently 78%, target 70%)
         
         - `NotificationCenter.tsx` could use edge case tests
         - WebSocket error scenarios not fully covered
         
         ⏸️ STOP: 
         - Say `improve` to add more tests
         - Say `/test-verify` to verify and proceed
         - Say `/phase-5-done` to skip to Done Check

You: /test-verify

Copilot: ## ✅ Test Verification
         
         ### 🇬🇧 Verification Checklist / 🇻🇳 Checklist Xác minh
         
         | Check | Status | Notes |
         |-------|--------|-------|
         | All tests pass | ✅ | 23/23 passed |
         | Coverage ≥70% | ✅ | 78% achieved |
         | Critical paths tested | ✅ | Store, hook, components |
         | Edge cases covered | ⚠️ | Basic coverage |
         | Mocks appropriate | ✅ | WebSocket, timers mocked |
         | No flaky tests | ✅ | Deterministic |
         
         ### Verdict: ✅ PASS
         
         Testing phase complete. Coverage exceeds target.
         
         Say `/phase-5-done` to proceed to Done Check.
```

---

## ✅ Part 8: Phase 5 - Done Check

### Step 8.1: Start Done Check

```
You: /phase-5-done

Copilot: ## ✅ Phase 5: Done Check
         
         ### 🇬🇧 Definition of Done (DoD) / 🇻🇳 Định nghĩa Hoàn thành
         
         🇬🇧 Verifying all completion criteria are met before closing this workflow.
         
         🇻🇳 Xác minh tất cả tiêu chí hoàn thành được đáp ứng trước khi đóng workflow này.
```

### Step 8.2: Acceptance Criteria Check

```
Copilot: ### 🇬🇧 Acceptance Criteria / 🇻🇳 Tiêu chí Chấp nhận
         
         | # | Criterion | Status | Evidence |
         |---|-----------|--------|----------|
         | AC-1 | Toast notifications appear for new events | ✅ | Manual test + unit test |
         | AC-2 | 4 notification types supported (info, success, warning, error) | ✅ | NotificationToast.test.tsx |
         | AC-3 | Auto-dismiss after 5 seconds | ✅ | Unit test with fake timers |
         | AC-4 | Max 5 visible at once | ✅ | notificationStore.test.ts |
         | AC-5 | Unread notifications persist (localStorage) | ✅ | Zustand persist middleware |
         | AC-6 | Works on all dashboard pages | ✅ | Provider in root layout |
         
         **Result: 6/6 criteria met ✅**
```

### Step 8.3: Quality Gates

```
Copilot: ### 🇬🇧 Quality Gates / 🇻🇳 Cổng Chất lượng
         
         | Gate | Target | Actual | Status |
         |------|--------|--------|--------|
         | All tests pass | 100% | 100% | ✅ |
         | Code coverage | ≥70% | 78% | ✅ |
         | No lint errors | 0 | 0 | ✅ |
         | No type errors | 0 | 0 | ✅ |
         | Code review passed | Yes | Yes | ✅ |
         | No console errors | 0 | 0 | ✅ |
         | Performance | <100ms | ~30ms | ✅ |
         
         **Result: 7/7 gates passed ✅**
```

### Step 8.4: Documentation Verification

```
Copilot: ### 🇬🇧 Documentation / 🇻🇳 Tài liệu
         
         | Document | Location | Status |
         |----------|----------|--------|
         | solution-design.md | 00_analysis/ | ✅ Complete |
         | spec.md | 01_spec/ | ✅ Complete |
         | tasks.md | 02_tasks/ | ✅ Complete |
         | impl-log.md | 03_impl/ | ✅ Complete |
         | tests.md | 04_tests/ | ✅ Complete |
         | done.md | 05_done/ | 🔄 Creating... |
         
         ### 🇬🇧 Files Changed Summary / 🇻🇳 Tóm tắt Files Đã Thay đổi
         
         | Type | Count | Files |
         |------|-------|-------|
         | New | 7 | Store, hook, 2 components, 4 test files |
         | Modified | 2 | package.json, layout.tsx |
         | Deleted | 0 | - |
         
         📄 Creating: done.md...
```

### Step 8.5: Final Verdict

```
Copilot: ### 🎯 Final Verdict / 🇻🇳 Kết luận Cuối cùng
         
         ┌─────────────────────────────────────────┐
         │           ✅ WORKFLOW COMPLETE          │
         ├─────────────────────────────────────────┤
         │ Acceptance Criteria:  6/6  ✅           │
         │ Quality Gates:        7/7  ✅           │
         │ Documentation:        6/6  ✅           │
         │ Tasks Completed:      8/8  ✅           │
         └─────────────────────────────────────────┘
         
         ### 🇬🇧 Summary Statistics / 🇻🇳 Thống kê Tóm tắt
         
         | Metric | Value |
         |--------|-------|
         | Total phases | 6 (0-5) |
         | Total tasks | 8 |
         | Files created | 7 |
         | Files modified | 2 |
         | Test coverage | 78% |
         | Total time | ~2.5 days |
         
         📄 Created: done.md
         📄 Updated: .workflow-state.yaml (status: completed)
         
         ### 🇬🇧 Next Steps / 🇻🇳 Bước Tiếp theo
         
         1. `/strict-review --pr` → Self-review before creating PR
         2. `/pr-description` → Generate PR description
         3. `/pr-notify-reviewers` → Generate notification message
         4. `git add . && git commit` → Commit changes
         5. `git push` → Push to remote
         6. Create PR on GitHub/GitLab
         
         Say `/strict-review --pr` to self-review first.

---

## 🔍 Part 8.5: Self-Review Before PR (Optional but Recommended)

> Use `/strict-review` to catch issues before reviewers do.

### Step 8.5.1: Run Strict Self-Review

```
You: /strict-review --pr

Copilot: ## 🔍 Strict Code Review
         
         ### Summary
         | Verdict | 🟡 NEEDS WORK |
         | Files | 7 |
         | Issues | 🔴0 🟠2 🟡3 🟢2 🔵4 |
         
         ---
         
         ### 🔮 Predicted Criticisms for THIS Code
         
         #### What Each Hater Will Say
         - **Architecture Astronaut:** `notificationStore.ts:L15` — "Why not use a notification service class instead of raw store?"
         - **Performance Paranoiac:** `useNotificationSocket.ts:L42` — "Should debounce reconnection attempts"
         - **Type Terrorist:** `NotificationToast.tsx:L28` — "notification.data is typed as any"
         - **Security Sheriff:** `useNotificationSocket.ts:L55` — "WebSocket URL from env without validation"
         
         #### Top 5 Weak Spots
         | # | Location | Issue | Hater | Defense Needed |
         |---|----------|-------|-------|----------------|
         | 1 | useNotificationSocket.ts:L42 | No reconnect backoff | Performance | Add exponential backoff |
         | 2 | NotificationToast.tsx:L28 | any type | Type Terrorist | Define proper type |
         | 3 | notificationStore.ts:L67 | No max notifications limit | Memory | Add limit |
         | 4 | useNotificationSocket.ts:L55 | No URL validation | Security | Validate URL |
         | 5 | NotificationCenter.tsx:L89 | Missing loading state | UX | Add skeleton |
         
         #### Predicted PR Questions
         1. "Why Zustand instead of React Context at notificationStore.ts?"
         2. "What happens if WebSocket disconnects mid-notification?"
         3. "How do you handle notification overflow?"
         
         ---
         
         ### 🟠 High Priority
         
         #### [HIGH-001] Missing reconnection backoff
         **File:** `useNotificationSocket.ts:L42` | **Category:** Performance
         **Problem:** Immediate reconnection on disconnect can cause server hammering
         **Fix:** Add exponential backoff (1s, 2s, 4s, 8s... max 30s)
         
         #### [HIGH-002] Untyped notification data
         **File:** `NotificationToast.tsx:L28` | **Category:** Type Safety
         **Problem:** `notification.data` is typed as `any`
         **Fix:** Define `NotificationPayload` interface in types.ts
         
         ---
         
         ### 🟡 Medium Priority
         - [MED-001] No max notifications limit in store (memory concern)
         - [MED-002] Missing loading state in NotificationCenter
         - [MED-003] WebSocket URL not validated before connection
         
         ---
         
         ### ✅ What's Good
         - Clean separation of concerns (store, hook, components)
         - Proper cleanup in useEffect
         - Good test coverage (78%)
         - Consistent naming conventions
         
         ---
         
         ### 🛡️ Pre-emptive Defense Suggestions
         1. Add comment at `notificationStore.ts:L15`: `// Using Zustand for: persistence, devtools, minimal boilerplate`
         2. Add reconnect backoff logic at `useNotificationSocket.ts:L42`
         3. Define `NotificationPayload` type to replace `any`
         4. Add max notification limit (e.g., 100) with FIFO eviction
         
         ---
         
         💡 **Recommendation:** Fix HIGH issues before creating PR.
         
         Reply:
         - `fix` → I'll create a fix plan for these issues
         - `skip` → Proceed to PR anyway
         - `<issue-id>` → Focus on specific issue
```

### Step 8.5.2: Fix Critical Issues (Optional)

```
You: fix

Copilot: ## 🔧 Fix Plan for Self-Review Issues
         
         ### Fixes to Apply
         
         | # | Issue | File | Fix |
         |---|-------|------|-----|
         | 1 | HIGH-001 | useNotificationSocket.ts | Add exponential backoff |
         | 2 | HIGH-002 | NotificationToast.tsx | Define NotificationPayload type |
         | 3 | MED-001 | notificationStore.ts | Add max limit (100) |
         
         ⏸️ STOP: Apply these fixes? Say `go` to proceed.

You: go

Copilot: ✅ Applied fixes:
         
         - `useNotificationSocket.ts` → Added exponential backoff (1s-30s)
         - `types.ts` → Added NotificationPayload interface
         - `NotificationToast.tsx` → Updated to use NotificationPayload
         - `notificationStore.ts` → Added MAX_NOTIFICATIONS = 100
         
         Run `/strict-review` again to verify, or continue to `/pr-description`.

You: /strict-review --pr

Copilot: ## 🔍 Strict Code Review
         
         ### Summary
         | Verdict | 🟢 APPROVED |
         | Files | 8 |
         | Issues | 🔴0 🟠0 🟡1 🟢3 🔵2 |
         
         ### Remaining Minor Issues
         - [LOW-001] Consider adding JSDoc to public functions
         - [NITPICK-001] Inconsistent import ordering
         
         ### ✅ All HIGH issues resolved!
         
         Ready for PR. Continue with `/pr-description`.
```

---

## 📤 Part 9: PR & Notification

### Step 9.1: Generate PR Description

```
You: /pr-description

Copilot: ## 📄 PR Description Generated
         
         📄 Created: `apphub-vision/docs/runs/feature-notification-system/PR_DESCRIPTION.md`
         
         ### Preview:
         
         ---
         
         ## 🎯 Summary
         
         Add real-time notification system to dashboard with WebSocket support,
         toast notifications, and notification center.
         
         ## 📋 Changes
         
         ### New Files
         - `src/stores/notificationStore.ts` - Zustand store with persistence
         - `src/hooks/useNotificationSocket.ts` - WebSocket integration
         - `src/components/NotificationToast.tsx` - Toast component
         - `src/components/NotificationCenter.tsx` - Notification history
         
         ### Modified Files
         - `package.json` - Added react-hot-toast
         - `app/layout.tsx` - Added Toaster provider
         
         ## ✅ Testing
         
         - Unit tests: 100% passing
         - Coverage: 78%
         - Manual testing: Verified on all pages
         
         ## 📖 Documentation
         
         See: `docs/runs/feature-notification-system/`
         
         ---
         
         Say `/pr-notify-reviewers` to generate reviewer notification.
```

### Step 9.2: Notify Reviewers

```
You: /pr-notify-reviewers

Copilot: ## 📢 Reviewer Notification
         
         ### Slack/Teams Message:
         
         ---
         
         🔔 **PR Ready for Review**
         
         **Feature:** Real-time Notification System
         **Author:** @trucle
         **Branch:** feature-notification-system
         
         **Summary:**
         Added WebSocket-powered notification system with toast alerts 
         and notification center.
         
         **Key changes:**
         • New Zustand store for notifications
         • react-hot-toast integration
         • Notification center component
         
         **Review focus:**
         • WebSocket connection handling
         • State persistence logic
         
         **Testing:** ✅ 78% coverage
         
         🔗 [View PR](#) | 📖 [Docs](docs/runs/feature-notification-system/)
         
         ---
         
         ### 🇬🇧 Next Steps / 🇻🇳 Bước Tiếp theo
         
         1. 🇬🇧 Commit changes: `git add . && git commit`
            🇻🇳 Commit changes: `git add . && git commit`
         
         2. 🇬🇧 Push branch: `git push -u origin feature-notification-system`
            🇻🇳 Push branch: `git push -u origin feature-notification-system`
         
         3. 🇬🇧 Create PR on GitHub/GitLab
            🇻🇳 Tạo PR trên GitHub/GitLab
         
         4. 🇬🇧 Copy notification message to Slack/Teams
            🇻🇳 Copy message thông báo sang Slack/Teams
         
         🎉 Workflow complete!
```

---

## 🔄 Bonus: Handling Changes

### Scenario: Requirements Change Mid-Development

```
You: /work-update

Copilot: ## 📝 Work Update
         
         What changed? Describe the new/modified requirements.

You: Need to add notification sound option (toggle in settings)

Copilot: ## 📝 Requirement Change Detected
         
         ### 🇬🇧 Change Summary / 🇻🇳 Tóm tắt Thay đổi
         
         | Field | Value |
         |-------|-------|
         | Type | Scope Addition |
         | Impact | Medium |
         | Affects | Spec, Tasks |
         
         ### 🇬🇧 New Requirement / 🇻🇳 Yêu cầu Mới
         
         - FR-009: Add sound toggle in notification preferences
         - FR-010: Play notification sound when enabled
         
         ### 🇬🇧 Impact Analysis / 🇻🇳 Phân tích Ảnh hưởng
         
         | Document | Action Needed |
         |----------|---------------|
         | solution-design.md | No change |
         | spec.md | Add FR-009, FR-010 |
         | tasks.md | Add T-009: Sound feature |
         | impl-log.md | Will update during impl |
         
         ⏸️ STOP: Create spec-update-1.md with changes?

You: yes

Copilot: ✅ Created: spec-update-1.md
         ✅ Created: tasks-update-1.md
         
         ### New Task Added
         
         | ID | Task | Est |
         |----|------|-----|
         | T-009 | Add notification sound feature | 1h |
         
         Continue with `/phase-3-impl T-009` when ready.
```

---

## 🔄 Bonus: Session Recovery

### Scenario 1: Session Lost (VS Code Restarted)

```
# After VS Code restart, open Copilot chat

You: /cf-init

Copilot: 📍 Session Initialized
         
         tooling_root: copilot-flow
         default_docs_root: apphub-vision
         Current branch: feature-notification-system
         
         ⚠️ EXISTING WORKFLOW DETECTED
         
         | Field | Value |
         |-------|-------|
         | Branch | feature-notification-system |
         | Phase | 3 (Implementation) |
         | Current Task | T-004 |
         | Tasks Done | 3/8 |
         
         Options:
         1. `resume` - Continue from T-004
         2. `status` - Show detailed status
         3. `new` - Start fresh (current workflow will be archived)

You: resume

Copilot: ✅ Resuming workflow...
         
         ### 📍 Current State
         
         | Task | Status |
         |------|--------|
         | T-001 | ✅ Done |
         | T-002 | ✅ Done |
         | T-003 | ✅ Done |
         | T-004 | 🔄 In Progress |
         | T-005 | ⬜ Not Started |
         ...
         
         Last action: Implementation started for T-004
         
         Continue with `/phase-3-impl T-004` or `/impl go` if plan was approved.
```

### Scenario 2: Switch to Another Device

```
# On Device A (original):
git add .
git commit -m "WIP: T-003 done, T-004 in progress"
git push

# On Device B (new):
git pull
code boostcommerce.code-workspace
```

Then in Copilot on Device B:

```
You: /cf-init

Copilot: 📍 Session Initialized
         
         tooling_root: copilot-flow
         default_docs_root: apphub-vision
         Current branch: feature-notification-system
         
         ⚠️ EXISTING WORKFLOW DETECTED
         
         | Field | Value |
         |-------|-------|
         | Branch | feature-notification-system |
         | Phase | 3 (Implementation) |
         | Current Task | T-004 |
         
         Say `resume` to continue.

You: resume

Copilot: ✅ Workflow resumed from state file.
         
         Ready to continue with T-004.
         Say `/phase-3-impl T-004` to see the plan.
```

### Scenario 3: Copilot Gets Confused

Signs Copilot is confused:
- Repeats previous answers
- Suggests wrong files
- Forgets current phase
- Gives contradictory instructions

```
You: /cf-context-reset

Copilot: 🧹 Context Hygiene
         
         ### 🇬🇧 Clearing Context / 🇻🇳 Xóa Context
         
         This will:
         ✅ Clear my conversation memory
         ✅ Reset any confused state
         ❌ NOT affect your code or workflow files
         
         Your workflow state is safely stored in:
         `.workflow-state.yaml`
         
         After this, run `/workflow-resume` to continue.
         
         Proceeding with context clear...
         
         ✅ Context cleared.
         
         Now run: `/workflow-resume`

You: /workflow-resume

Copilot: 📍 Workflow Resumed
         
         | Field | Value |
         |-------|-------|
         | Branch | feature-notification-system |
         | Phase | 3 (Implementation) |
         | Current Task | T-004 |
         | Status | In Progress |
         
         ### Recent Activity
         
         | Time | Action |
         |------|--------|
         | 10:30 | T-003 completed |
         | 10:45 | T-004 plan approved |
         | 11:00 | Implementation started |
         
         Continue with `/impl go` or check status with `/workflow-status`.
```

### Scenario 4: Long Conversation (Context Overflow)

After ~50+ messages, Copilot may lose context. Proactively clean up:

```
You: /cf-context-reset

Copilot: 🧹 Context cleared.
         
         Now run: `/workflow-resume`

You: /workflow-resume

Copilot: 📍 Workflow Resumed
         
         [Shows current state from .workflow-state.yaml]
```

### 🔑 Key Points

| Command | When to Use |
|---------|-------------|
| `/cf-init` | Start of day, new chat, VS Code restart |
| `/workflow-resume` | Quick resume when you know workflow exists |
| `/cf-context-reset` | Copilot confused, long conversation |

**Why state file matters:**
```yaml
# .workflow-state.yaml stores:
- Current phase
- Task statuses  
- Decisions made
- Files changed
- Last action timestamp

# This means:
✅ You can resume anytime
✅ You can switch devices
✅ Multiple people can work on same workflow
✅ Context loss doesn't lose progress
```

## 📋 Quick Reference Card

Run `/quick-ref` anytime to see this:

```
You: /quick-ref

Copilot: ## 📋 Quick Reference Card
         
         ### Setup Commands
         | Prompt | Action |
         |--------|--------|
         | `/setup-workspace` | Full setup (4 steps) |
         | `/sync-instructions` | Sync coding standards |
         | `/generate-workspace-file` | Create .code-workspace |
         
         ### Session Commands
         | Prompt | Action |
         |--------|--------|
         | `/cf-init` | Start session |
         | `/workflow-resume` | Resume from state |
         | `/workflow-status` | Show current status |
         | `/quick-ref` | Show this card |
         
         ### Work Intake
         | Prompt | Action |
         |--------|--------|
         | `/work-intake` | Capture requirements |
         | `/work-review` | Review readiness |
         | `/work-update` | Handle changes |
         
         ### Workflow Phases
         | Phase | Start | Review |
         |-------|-------|--------|
         | 0. Analysis | `/phase-0-analysis` | - |
         | 1. Spec | `/phase-1-spec` | `/spec-review` |
         | 2. Tasks | `/phase-2-tasks` | `/task-plan-review` |
         | 3. Impl | `/phase-3-impl T-XXX` | `/code-review T-XXX` |
         | 4. Tests | `/phase-4-tests` | `/test-verify` |
         | 5. Done | `/phase-5-done` | - |
         
         ### Implementation (Phase 3)
         | Prompt | Action |
         |--------|--------|
         | `/phase-3-impl T-XXX` | Plan task |
         | `/phase-3-impl next` | Plan next task |
         | `/impl go` | Execute after plan approved |
         | `/impl approved` | Mark done (manual review) |
         | `/code-review T-XXX` | AI review single task |
         | `/code-review` | AI review all changes |
         | `/code-fix-plan` | Plan fixes |
         | `/code-fix-apply` | Apply fixes |
         
         ### Completion
         | Prompt | Action |
         |--------|--------|
         | `/pr-description` | Generate PR description |
         | `/pr-notify-reviewers` | Generate notification |
         
         ### Safety & Quality
         | Prompt | Action |
         |--------|--------|
         | `/rollback` | Undo changes |
         | `/cf-context-reset` | Clear confused state |
         | `/lite-mode <desc>` | Quick task mode |
         | `/strict-review` | Self-review before PR (critical reviewer) |
         | `/strict-review --pr` | Full PR review with hater prediction |
```

---

## 📚 Related Documents

- [README](../../README.md) - Main documentation
- [Setup Guide](setup.md) - Detailed setup instructions
- [Multilingual Guide](multilingual.md) - Bilingual format guide
- [Workflow Contract](../workflow/contract.md) - Full rules

---

**Last Updated:** 2026-01-25
