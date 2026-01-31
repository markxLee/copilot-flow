# Multilingual Documentation Guide

> 🇬🇧 Complete guide for bilingual workflow documentation
> 🇻🇳 Hướng dẫn đầy đủ cho tài liệu workflow song ngữ

---

## 📖 Table of Contents

1. [Why Multilingual?](#-why-multilingual)
2. [Format v4.0: Inline Bilingual](#-format-v40-inline-bilingual)
3. [Format Rules](#-format-rules)
4. [Examples](#-examples)
5. [Adding a New Language](#-adding-a-new-language)
6. [Template Locations](#-template-locations)

---

## 🎯 Why Multilingual?

### The Core Benefit: Faster Review of Copilot Output / Lợi ích Chính: Review Output Copilot Nhanh hơn

🇬🇧 **The #1 reason for bilingual docs**: When Copilot generates phase outputs (analysis, specs, task plans, implementation approaches), you need to review and approve them quickly. Reading in your native language is **2-3x faster** than mentally translating English.

🇻🇳 **Lý do #1 cho docs song ngữ**: Khi Copilot tạo output các phase (phân tích, spec, task plan, cách tiếp cận implementation), bạn cần review và approve nhanh. Đọc bằng ngôn ngữ mẹ đẻ **nhanh hơn 2-3 lần** so với dịch ngầm tiếng Anh.

**Impact on Workflow / Ảnh hưởng đến Workflow:**

| Without Bilingual | With Bilingual |
|-------------------|----------------|
| Read English → Translate mentally → Understand → Decide | Read native → Understand → Decide |
| ~2-3 min per phase review | ~1 min per phase review |
| Mental fatigue after few phases | Sustainable review speed |
| May miss nuances in translation | Full comprehension |

### The Problem / Vấn đề

🇬🇧 In multilingual teams, documentation often becomes a barrier:
- English-only docs slow down non-native speakers
- Separate translated docs get out of sync
- Developers waste time mentally translating technical concepts
- **Copilot outputs require quick review** - slow review = slow workflow

🇻🇳 Trong team đa ngôn ngữ, tài liệu thường trở thành rào cản:
- Docs chỉ tiếng Anh làm chậm người không phải native speaker
- Docs dịch riêng bị lệch sync
- Developer tốn thời gian dịch ngầm các khái niệm kỹ thuật
- **Output Copilot cần review nhanh** - review chậm = workflow chậm

### The Solution / Giải pháp

🇬🇧 Inline bilingual format with visual flags allows:
- **⚡ Fast phase review**: Review Copilot's analysis/spec/tasks in your language
- **Fast scanning**: Each person reads their preferred language
- **Always in sync**: Both languages in same location = updated together
- **Quick decisions**: Native language = faster comprehension
- **Universal code**: Technical content stays unchanged

🇻🇳 Format song ngữ inline với flags cho phép:
- **⚡ Review phase nhanh**: Review analysis/spec/tasks của Copilot bằng ngôn ngữ của bạn
- **Scan nhanh**: Mỗi người đọc ngôn ngữ ưa thích
- **Luôn đồng bộ**: Cả hai ngôn ngữ cùng vị trí = cập nhật cùng lúc
- **Quyết định nhanh**: Ngôn ngữ mẹ đẻ = hiểu nhanh hơn
- **Code chung**: Nội dung kỹ thuật giữ nguyên

### When to Use / Khi nào Sử dụng

| Content Type | Bilingual? | Reason |
|--------------|------------|--------|
| Phase docs (analysis, spec, tasks) | ✅ Yes | Need quick comprehension |
| Copilot prompts (instructions) | ❌ No | Keep prompts English-only for clarity and lower token noise |
| Code comments | ❌ No | English standard |
| API docs | ❌ No | Technical reference |
| README overview | ✅ Partial | Key sections only |
| Error messages | ❌ No | English for debugging |

---

## 🧠 Prompt Language Rule (Recommended)

🇬🇧 Prompts under `.github/prompts/` should be **English-only** for instructions, rules, and flows. This keeps the instructions unambiguous for Copilot and reduces token overhead.

🇻🇳 Các prompt trong `.github/prompts/` nên viết **English-only** cho phần hướng dẫn/rules/flow để Copilot hiểu rõ hơn và giảm nhiễu token.

**Bilingual should be reserved for generated artifacts** (Phase docs and reference cards) via the templates in `docs/templates/`.

---

## 📐 Format v4.0: Inline Bilingual

### Key Principles / Nguyên tắc Chính

1. **Flag-first**: 🇬🇧/🇻🇳 flags at start of each language block
2. **Adjacent placement**: Translations immediately follow each other
3. **Universal code**: Tables, code blocks, technical terms stay English
4. **Scan-friendly**: Easy to visually skip to preferred language

### Visual Example / Ví dụ Trực quan

```markdown
## 🇬🇧 Problem Statement / 🇻🇳 Mô tả Vấn đề

🇬🇧 The current dashboard lacks real-time analytics, causing users 
to refresh manually to see updated data.

🇻🇳 Dashboard hiện tại thiếu analytics real-time, khiến user phải 
refresh thủ công để xem data cập nhật.

### 🇬🇧 Acceptance Criteria / 🇻🇳 Tiêu chí Chấp nhận

- 🇬🇧 Data updates within 5 seconds / 🇻🇳 Data cập nhật trong 5 giây
- 🇬🇧 No manual refresh needed / 🇻🇳 Không cần refresh thủ công

| Metric | Target | Current |
|--------|--------|---------|
| Update latency | < 5s | 30s |
| User satisfaction | > 80% | 45% |
```

---

## 📏 Format Rules

### Rule 1: Headings — Inline with Flags

```markdown
## 🇬🇧 Section Title / 🇻🇳 Tiêu đề Section

### 🇬🇧 Subsection / 🇻🇳 Tiểu mục
```

### Rule 2: Paragraphs — Separate Lines

```markdown
🇬🇧 This is the English explanation of the feature. It provides 
context for what we're building and why.

🇻🇳 Đây là giải thích tiếng Việt về tính năng. Nó cung cấp context 
cho những gì chúng ta đang xây dựng và tại sao.
```

### Rule 3: Lists — Flag at Item Start

**Short items (inline):**
```markdown
- 🇬🇧 Check permissions / 🇻🇳 Kiểm tra quyền
- 🇬🇧 Validate input / 🇻🇳 Xác thực đầu vào
- 🇬🇧 Save to database / 🇻🇳 Lưu vào database
```

**Long items (multi-line):**
```markdown
- 🇬🇧 Implement real-time WebSocket connection for live updates
  🇻🇳 Triển khai kết nối WebSocket real-time cho cập nhật trực tiếp

- 🇬🇧 Add retry logic with exponential backoff for reliability
  🇻🇳 Thêm logic retry với exponential backoff để đảm bảo ổn định
```

### Rule 4: Tables — Universal (No Flags)

Tables contain data, which is language-neutral:

```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | yes | Unique user identifier |
| email | string | yes | User email address |
| role | enum | no | admin, user, guest |
```

### Rule 5: Code — Universal (No Flags)

Code is universal, comments stay in English:

```typescript
// Initialize WebSocket connection
const socket = new WebSocket(WS_URL);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateDashboard(data);
};
```

### Rule 6: Technical Terms — Keep English

```markdown
🇬🇧 The API returns a 404 error when the user is not found.
🇻🇳 API trả về lỗi 404 khi không tìm thấy user.

🇬🇧 Use the useEffect hook for side effects.
🇻🇳 Sử dụng useEffect hook cho side effects.
```

Common terms to keep in English:
- API, REST, GraphQL, WebSocket
- Component, hook, state, props
- Database, cache, queue
- Deploy, build, test
- PR, commit, branch

---

## 📝 Examples

### Example 1: Analysis Document

```markdown
# 🇬🇧 Analysis: Real-time Dashboard / 🇻🇳 Phân tích: Dashboard Real-time

## 🇬🇧 Executive Summary / 🇻🇳 Tóm tắt

🇬🇧 This analysis explores options for adding real-time updates to the 
analytics dashboard. We recommend using WebSocket with fallback to 
Server-Sent Events.

🇻🇳 Phân tích này khảo sát các phương án thêm cập nhật real-time cho 
dashboard analytics. Chúng tôi đề xuất sử dụng WebSocket với fallback 
sang Server-Sent Events.

## 🇬🇧 Current State / 🇻🇳 Trạng thái Hiện tại

🇬🇧 The dashboard currently uses polling every 30 seconds, causing:
🇻🇳 Dashboard hiện tại sử dụng polling mỗi 30 giây, gây ra:

- 🇬🇧 Delayed data visibility / 🇻🇳 Trễ hiển thị data
- 🇬🇧 Unnecessary server load / 🇻🇳 Tải server không cần thiết
- 🇬🇧 Poor user experience / 🇻🇳 Trải nghiệm user kém

## 🇬🇧 Options Analysis / 🇻🇳 Phân tích Phương án

| Option | Pros | Cons | Effort |
|--------|------|------|--------|
| WebSocket | Real-time, bidirectional | Complex setup | 3 days |
| SSE | Simple, auto-reconnect | One-way only | 2 days |
| Polling | Easy | High latency | 1 day |

## 🇬🇧 Recommendation / 🇻🇳 Đề xuất

🇬🇧 **WebSocket with SSE fallback** provides the best balance of 
real-time performance and browser compatibility.

🇻🇳 **WebSocket với SSE fallback** cung cấp sự cân bằng tốt nhất giữa 
hiệu suất real-time và tương thích trình duyệt.
```

### Example 2: Task Description

```markdown
## T-003: 🇬🇧 Implement WebSocket Hook / 🇻🇳 Triển khai WebSocket Hook

### 🇬🇧 Description / 🇻🇳 Mô tả

🇬🇧 Create a custom React hook `useWebSocket` that manages WebSocket 
connection lifecycle, handles reconnection, and provides real-time 
data to components.

🇻🇳 Tạo custom React hook `useWebSocket` quản lý vòng đời kết nối 
WebSocket, xử lý reconnection, và cung cấp data real-time cho components.

### 🇬🇧 Acceptance Criteria / 🇻🇳 Tiêu chí Chấp nhận

- 🇬🇧 Auto-reconnect on disconnect / 🇻🇳 Tự động reconnect khi mất kết nối
- 🇬🇧 Exponential backoff (max 30s) / 🇻🇳 Exponential backoff (tối đa 30s)
- 🇬🇧 TypeScript types for messages / 🇻🇳 TypeScript types cho messages

### 🇬🇧 Technical Notes / 🇻🇳 Ghi chú Kỹ thuật

```typescript
interface UseWebSocketOptions {
  url: string;
  onMessage: (data: unknown) => void;
  reconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions) {
  // Implementation
}
```
```

### Example 3: Implementation Log Entry

```markdown
## 🇬🇧 T-003 Implementation / 🇻🇳 Triển khai T-003

### 🇬🇧 Changes Made / 🇻🇳 Các thay đổi

| File | Change |
|------|--------|
| `hooks/useWebSocket.ts` | Created hook with reconnection logic |
| `types/websocket.ts` | Added TypeScript interfaces |
| `hooks/index.ts` | Exported new hook |

### 🇬🇧 Approach / 🇻🇳 Cách tiếp cận

🇬🇧 Used the native WebSocket API wrapped in a custom hook. Added 
exponential backoff using setTimeout with doubling delay.

🇻🇳 Sử dụng native WebSocket API được wrap trong custom hook. Thêm 
exponential backoff dùng setTimeout với delay tăng gấp đôi.

### 🇬🇧 Testing Notes / 🇻🇳 Ghi chú Test

🇬🇧 Tested manually by disconnecting network. Reconnection works 
after 1s, 2s, 4s delays.

🇻🇳 Test thủ công bằng cách ngắt network. Reconnection hoạt động 
sau các delay 1s, 2s, 4s.
```

---

## 🌍 Adding a New Language

### Step 1: Choose Flag Emoji

| Language | Flag | Code |
|----------|------|------|
| English | 🇬🇧 | `:gb:` or `🇬🇧` |
| Vietnamese | 🇻🇳 | `:vn:` or `🇻🇳` |
| Japanese | 🇯🇵 | `:jp:` or `🇯🇵` |
| Korean | 🇰🇷 | `:kr:` or `🇰🇷` |
| Chinese | 🇨🇳 | `:cn:` or `🇨🇳` |
| Spanish | 🇪🇸 | `:es:` or `🇪🇸` |
| French | 🇫🇷 | `:fr:` or `🇫🇷` |
| German | 🇩🇪 | `:de:` or `🇩🇪` |

### Step 2: Update Templates

Add new language to each template in `docs/templates/`:

**Before (2 languages):**
```markdown
## 🇬🇧 Section / 🇻🇳 Section

🇬🇧 English content here.

🇻🇳 Vietnamese content here.
```

**After (3 languages):**
```markdown
## 🇬🇧 Section / 🇻🇳 Section / 🇯🇵 セクション

🇬🇧 English content here.

🇻🇳 Vietnamese content here.

🇯🇵 Japanese content here.
```

### Step 3: Update Workflow State

Add language preference to `.workflow-state.yaml`:

```yaml
user_preferences:
  languages:
    - code: en
      flag: 🇬🇧
      name: English
    - code: vi
      flag: 🇻🇳
      name: Vietnamese
    - code: ja
      flag: 🇯🇵
      name: Japanese
  primary_language: vi  # For AI-generated content priority
```

### Step 4: Configure Copilot

Update `copilot-instructions.md` to recognize new language:

```markdown
### Supported Languages
| Flag | Language | When to Use |
|------|----------|-------------|
| 🇬🇧 | English | Default, technical terms |
| 🇻🇳 | Vietnamese | Local team |
| 🇯🇵 | Japanese | Japan team |
```

### Step 5: Inform Team

Add to team onboarding:
- Which flag to look for
- Translation guidelines
- Technical terms to keep in English

---

## 📁 Template Locations

All templates follow v4.0 bilingual format:

```
copilot-flow/docs/templates/
├── analysis.template.md      # Phase 0: Analysis
├── spec.template.md          # Phase 1: Specification
├── tasks.template.md         # Phase 2: Task Planning
├── impl-log.template.md      # Phase 3: Implementation Log
├── tests.template.md         # Phase 4: Testing
├── done.template.md          # Phase 5: Done Check
└── workflow-state.template.yaml  # State tracking
```

### Template Header Example

Each template starts with:

```markdown
<!-- 
Template Version: 4.0
Format: Inline Bilingual with Visual Flags
Languages: 🇬🇧 English, 🇻🇳 Vietnamese
-->

# 🇬🇧 [Phase Name] / 🇻🇳 [Tên Phase]

> 🇬🇧 Brief description of this phase document.
> 🇻🇳 Mô tả ngắn về tài liệu phase này.
```

---

## 🔧 Tips & Best Practices

### Do's ✅

- Keep translations adjacent (not in separate files)
- Use flags consistently at line start
- Keep technical terms in English
- Update both languages together
- Use tables for data (no translation needed)

### Don'ts ❌

- Don't translate code or variable names
- Don't translate error messages in code
- Don't create separate translation files
- Don't mix languages in same paragraph
- Don't over-translate technical jargon

### Quick Reference

```markdown
# Heading:      ## 🇬🇧 Title / 🇻🇳 Tiêu đề
# Paragraph:    🇬🇧 Text...\n\n🇻🇳 Text...
# Short list:   - 🇬🇧 Item / 🇻🇳 Item
# Long list:    - 🇬🇧 Item\n  🇻🇳 Item
# Table:        (no flags, data is universal)
# Code:         (no flags, code is universal)
```

---

## 📚 Related Documents

- [README](../../README.md) - Main documentation
- [Templates](../templates/) - Phase document templates
- [Workflow Contract](../workflow/contract.md) - Full workflow rules

---

**Version:** 4.0 (Inline Bilingual with Visual Flags)
**Last Updated:** 2026-01-25
