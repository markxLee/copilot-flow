# Task Plan — Billing App Installation Synchronization (BP-24)

---

# English

## Goal
- Implement automatic billing provisioning when Shopify app is installed
- Create Organisation + Account records in Billing database via internal API
- Track Store → Account relationships via Store and StoreAccountLink records
- Integrate Dashboard onboarding flow (get-started) with Billing provisioning endpoint

---

## Task List (Ordered)

### Task 1 — Create Zod validation schema for provision request

- **Files:**
  - Create:
    - `apps/billing/app/api/internal/organisation/provision/schema.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - `provisionRequestSchema` (Zod schema)
    - `ProvisionRequest` (TypeScript type inferred from schema)
  - Purpose:
    - Define and validate incoming provision request body
  - Inputs:
    - `email: string` (required)
    - `name: string` (required)
    - `phone?: string` (optional)
    - `domain?: string` (optional)
  - Outputs:
    - Validated `ProvisionRequest` object or validation error
- **Done Criteria:**
  - Schema validates required fields (email, name)
  - Schema allows optional fields (phone, domain)
  - TypeScript type is exported
- **Notes:**
  - Follow existing Zod patterns in Billing app

---

### Task 2 — Create provisioning service for Organisation + Account + Stripe Customer + Store

- **Files:**
  - Create:
    - `apps/billing/services/provision.service.ts`
    - `apps/billing/lib/repository/prisma/store.repository.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - `ProvisionService` class
    - `provisionOrganisation()` method
    - `StoreRepository` class
    - `ensureStoreLinkedToAccount()` method
  - Purpose:
    - Orchestrate Stripe Customer → Organisation → Account creation
    - Track Store → Account linking via StoreAccountLink
    - Handle idempotent lookups by email (Org) and shopDomain (Store)
  - Inputs:
    - `email: string`
    - `name: string`
    - `phone?: string`
    - `domain?: string` (shopDomain)
    - `shopName?: string`
  - Outputs:
    - `{ organisation, account, store, storeAccountLink, created, storeCreated, linkCreated }`
- **Done Criteria:**
  - Creates Stripe Customer if Organisation doesn't exist
  - Creates Organisation with mapped fields
  - Creates Account with name "Clearer"
  - Creates Store by shopDomain if not exists
  - Creates StoreAccountLink to link Store → Account
  - Updates StoreAccountLink if store linked to different account
  - Returns existing records if Organisation found by email
  - Creates Account if missing for existing Organisation
  - Uses `tryCatch` for error handling
  - Logs errors with Stripe customer ID for cleanup
- **Notes:**
  - Use `getStripeClient('uk', testMode)` from `@/lib/stripe`
  - Use Prisma client from `@clearer/billing-database`
  - `testMode = process.env.NODE_ENV !== 'production'`
  - StoreAccountLink unique constraint: (storeId, accountName)

---

### Task 3 — Create provision API endpoint in Billing

- **Files:**
  - Create:
    - `apps/billing/app/api/internal/organisation/provision/route.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - `POST` handler function
  - Purpose:
    - Expose internal API for provisioning
    - Validate internal API token via `getAuthContext()`
    - Validate request body via Zod schema
    - Call `ProvisionService.provisionOrganisation()`
  - Inputs:
    - Request with `Authorization: Bearer bil_xxx` header
    - JSON body: `{ email, name, phone?, domain? }`
  - Outputs:
    - 200: `{ organisation, account, created }`
    - 400: `{ error: 'validation error' }`
    - 401: `{ error: 'auth error' }`
    - 500: `{ error: 'internal error' }`
- **Done Criteria:**
  - Endpoint rejects requests without valid internal API token (401)
  - Endpoint rejects invalid request body (400)
  - Endpoint returns Organisation + Account on success
  - Errors are logged but not exposed in detail
- **Notes:**
  - Use `getAuthContext(request, { allowUser: false })` to only accept internal tokens
  - Follow pattern from `/api/internal/test/route.ts`

---

### Task 4 — Create billing provisioning helper in Dashboard

- **Files:**
  - Create:
    - `apps/dashboard/helper/billing/provision.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - `provisionBillingOrganisation()` async function
  - Purpose:
    - Call Billing API to provision organisation
    - Handle errors gracefully (fire-and-forget pattern)
  - Inputs:
    - `org: { email: string, name: string, phone?: string, domain?: string }`
  - Outputs:
    - `{ success: boolean, data?: ProvisionResponse, error?: string }`
- **Done Criteria:**
  - Uses `internalApi.post('billing', '/api/internal/organisation/provision', ...)`
  - Extracts org info from session
  - Logs errors but does not throw
  - Returns result for optional handling
- **Notes:**
  - Use existing `internalApi` client from `@/lib/internal-api`

---

### Task 5 — Integrate billing provisioning into Onboarding (get-started)

> **Updated:** Originally planned to integrate into Shopify callback. Changed to integrate into onboarding/get-started flow instead for better UX and reliability.

- **Files:**
  - Create:
    - None
  - Modify:
    - `apps/dashboard/app/(frameless-layout)/get-started/actions.ts`
- **Implementation:**
  - Function/Class:
    - Add call to `provisionBillingOrganisationAsync()` in `registerCompany()`
    - Add fallback call in `getStartedProgress()` for existing merchants
  - Purpose:
    - Trigger billing provisioning when merchant completes onboarding
    - Provide fallback provisioning for merchants who installed before billing feature
  - Inputs:
    - Form data: `{ email, companyName, phone, domain }`
    - Session: `{ shopKey }` for Store linking
  - Outputs:
    - Provision result (logged, not blocking)
- **Done Criteria:**
  - Provisioning called in `registerCompany()` after merchant completes profile
  - Fallback provisioning in `getStartedProgress()` for existing merchants
  - Provisioning failures logged but do not block user flow
  - shopDomain extracted from session.shopKey for Store linking
- **Notes:**
  - Fire-and-forget pattern using `provisionBillingOrganisationAsync()`
  - Idempotent - safe to call multiple times

---

### Task 6 — Add unit tests for ProvisionService and StoreRepository

- **Files:**
  - Create:
    - `apps/billing/services/__tests__/provision.service.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/store.repository.test.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - Test suite for `ProvisionService`
    - Test suite for `StoreRepository`
  - Purpose:
    - Verify provisioning logic correctness
    - Verify store linking logic correctness
  - Inputs:
    - Mock Stripe client
    - Mock Prisma client
  - Outputs:
    - Test results
- **Done Criteria:**
  - Test: Creates Stripe Customer + Organisation + Account when new
  - Test: Returns existing when Organisation found by email
  - Test: Creates Account when missing for existing Organisation
  - Test: Handles Stripe API failure gracefully
  - Test: Handles DB failure gracefully
  - Test: Creates Store when shopDomain not found
  - Test: Creates StoreAccountLink when not linked
  - Test: Updates StoreAccountLink when linked to different account
  - Test: No-op when already linked to correct account
- **Notes:**
  - Use Jest mocks for external dependencies

---

### Task 7 — Add integration test for provision endpoint

- **Files:**
  - Create:
    - `apps/billing/app/api/internal/organisation/provision/__tests__/route.test.ts`
  - Modify:
    - None
- **Implementation:**
  - Function/Class:
    - Test suite for `/api/internal/organisation/provision`
  - Purpose:
    - Verify endpoint behavior end-to-end
  - Inputs:
    - Mock HTTP requests
    - Mock auth context
  - Outputs:
    - Test results
- **Done Criteria:**
  - Test: 401 when no auth token
  - Test: 400 when invalid body
  - Test: 200 with valid request + new org
  - Test: 200 with valid request + existing org
- **Notes:**
  - Follow existing test patterns in Billing app

---

## Summary

| Task | Description | AC Coverage |
|------|-------------|-------------|
| 1 | Zod schema | AC1 (partial) |
| 2 | ProvisionService + StoreRepository | AC3, AC4, AC5, AC6, AC7, AC8, AC11 |
| 3 | Provision endpoint | AC1, AC2 |
| 4 | Dashboard helper | AC9, AC10 |
| 5 | Shopify callback integration | AC9, AC10 |
| 6 | Unit tests | Regression |
| 7 | Integration tests | E2E verification |

---

# Tiếng Việt

## Mục tiêu
- Triển khai auto provisioning billing khi Shopify app được cài đặt
- Tạo Organisation + Account records trong Billing database qua internal API
- Theo dõi quan hệ Store → Account qua Store và StoreAccountLink records
- Tích hợp Dashboard onboarding flow (get-started) với Billing provisioning endpoint

---

## Danh sách Task (Theo thứ tự)

### Task 1 — Tạo Zod validation schema cho provision request

- **Files:**
  - Tạo mới:
    - `apps/billing/app/api/internal/organisation/provision/schema.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - `provisionRequestSchema` (Zod schema)
    - `ProvisionRequest` (TypeScript type từ schema)
  - Mục đích:
    - Định nghĩa và validate incoming provision request body
  - Input:
    - `email: string` (bắt buộc)
    - `name: string` (bắt buộc)
    - `phone?: string` (tùy chọn)
    - `domain?: string` (tùy chọn)
  - Output:
    - Object `ProvisionRequest` đã validate hoặc validation error
- **Tiêu chí hoàn thành:**
  - Schema validate required fields (email, name)
  - Schema cho phép optional fields (phone, domain)
  - TypeScript type được export
- **Ghi chú:**
  - Theo pattern Zod có sẵn trong Billing app

---

### Task 2 — Tạo provisioning service cho Organisation + Account + Stripe Customer + Store

- **Files:**
  - Tạo mới:
    - `apps/billing/services/provision.service.ts`
    - `apps/billing/lib/repository/prisma/store.repository.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - `ProvisionService` class
    - `provisionOrganisation()` method
    - `StoreRepository` class
    - `ensureStoreLinkedToAccount()` method
  - Mục đích:
    - Điều phối tạo Stripe Customer → Organisation → Account
    - Theo dõi Store → Account linking qua StoreAccountLink
    - Xử lý idempotent lookups bằng email (Org) và shopDomain (Store)
  - Input:
    - `email: string`
    - `name: string`
    - `phone?: string`
    - `domain?: string` (shopDomain)
    - `shopName?: string`
  - Output:
    - `{ organisation, account, store, storeAccountLink, created, storeCreated, linkCreated }`
- **Tiêu chí hoàn thành:**
  - Tạo Stripe Customer nếu Organisation chưa tồn tại
  - Tạo Organisation với các field được map
  - Tạo Account với tên "Clearer"
  - Tạo Store bằng shopDomain nếu chưa tồn tại
  - Tạo StoreAccountLink để link Store → Account
  - Cập nhật StoreAccountLink nếu store đã link với account khác
  - Trả về records có sẵn nếu tìm thấy Organisation bằng email
  - Tạo Account nếu thiếu cho Organisation đã có
  - Sử dụng `tryCatch` để xử lý lỗi
  - Log errors với Stripe customer ID để cleanup
- **Ghi chú:**
  - Dùng `getStripeClient('uk', testMode)` từ `@/lib/stripe`
  - Dùng Prisma client từ `@clearer/billing-database`
  - `testMode = process.env.NODE_ENV !== 'production'`
  - StoreAccountLink unique constraint: (storeId, accountName)

---

### Task 3 — Tạo provision API endpoint trong Billing

- **Files:**
  - Tạo mới:
    - `apps/billing/app/api/internal/organisation/provision/route.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - `POST` handler function
  - Mục đích:
    - Expose internal API cho provisioning
    - Validate internal API token qua `getAuthContext()`
    - Validate request body qua Zod schema
    - Gọi `ProvisionService.provisionOrganisation()`
  - Input:
    - Request với `Authorization: Bearer bil_xxx` header
    - JSON body: `{ email, name, phone?, domain? }`
  - Output:
    - 200: `{ organisation, account, created }`
    - 400: `{ error: 'validation error' }`
    - 401: `{ error: 'auth error' }`
    - 500: `{ error: 'internal error' }`
- **Tiêu chí hoàn thành:**
  - Endpoint reject requests không có internal API token hợp lệ (401)
  - Endpoint reject invalid request body (400)
  - Endpoint trả về Organisation + Account khi thành công
  - Errors được log nhưng không expose chi tiết
- **Ghi chú:**
  - Dùng `getAuthContext(request, { allowUser: false })` để chỉ accept internal tokens
  - Theo pattern từ `/api/internal/test/route.ts`

---

### Task 4 — Tạo billing provisioning helper trong Dashboard

- **Files:**
  - Tạo mới:
    - `apps/dashboard/helper/billing/provision.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - `provisionBillingOrganisation()` async function
  - Mục đích:
    - Gọi Billing API để provision organisation
    - Xử lý errors gracefully (fire-and-forget pattern)
  - Input:
    - `org: { email: string, name: string, phone?: string, domain?: string }`
  - Output:
    - `{ success: boolean, data?: ProvisionResponse, error?: string }`
- **Tiêu chí hoàn thành:**
  - Dùng `internalApi.post('billing', '/api/internal/organisation/provision', ...)`
  - Trích xuất org info từ session
  - Log errors nhưng không throw
  - Trả về result để optional handling
- **Ghi chú:**
  - Dùng `internalApi` client có sẵn từ `@/lib/internal-api`

---

### Task 5 — Tích hợp billing provisioning vào Onboarding (get-started)

> **Đã cập nhật:** Kế hoạch ban đầu là tích hợp vào Shopify callback. Đã đổi sang tích hợp vào onboarding/get-started flow để UX tốt hơn và đáng tin cậy hơn.

- **Files:**
  - Tạo mới:
    - Không có
  - Sửa:
    - `apps/dashboard/app/(frameless-layout)/get-started/actions.ts`
- **Triển khai:**
  - Function/Class:
    - Thêm gọi `provisionBillingOrganisationAsync()` trong `registerCompany()`
    - Thêm fallback call trong `getStartedProgress()` cho existing merchants
  - Mục đích:
    - Trigger billing provisioning khi merchant hoàn thành onboarding
    - Cung cấp fallback provisioning cho merchants đã cài đặt trước khi có billing feature
  - Input:
    - Form data: `{ email, companyName, phone, domain }`
    - Session: `{ shopKey }` cho Store linking
  - Output:
    - Provision result (logged, không blocking)
- **Tiêu chí hoàn thành:**
  - Provisioning được gọi trong `registerCompany()` sau khi merchant hoàn thành profile
  - Fallback provisioning trong `getStartedProgress()` cho existing merchants
  - Provisioning failures được log nhưng không block user flow
  - shopDomain được trích xuất từ session.shopKey cho Store linking
- **Ghi chú:**
  - Dùng fire-and-forget pattern với `provisionBillingOrganisationAsync()`
  - Idempotent - an toàn khi gọi nhiều lần

---

### Task 6 — Thêm unit tests cho ProvisionService và StoreRepository

- **Files:**
  - Tạo mới:
    - `apps/billing/services/__tests__/provision.service.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/store.repository.test.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - Test suite cho `ProvisionService`
    - Test suite cho `StoreRepository`
  - Mục đích:
    - Kiểm tra logic provisioning đúng đắn
    - Kiểm tra logic store linking đúng đắn
  - Input:
    - Mock Stripe client
    - Mock Prisma client
  - Output:
    - Test results
- **Tiêu chí hoàn thành:**
  - Test: Tạo Stripe Customer + Organisation + Account khi mới
  - Test: Trả về existing khi tìm thấy Organisation bằng email
  - Test: Tạo Account khi thiếu cho Organisation đã có
  - Test: Xử lý Stripe API failure gracefully
  - Test: Xử lý DB failure gracefully
  - Test: Tạo Store khi shopDomain không tìm thấy
  - Test: Tạo StoreAccountLink khi chưa link
  - Test: Cập nhật StoreAccountLink khi đã link với account khác
  - Test: No-op khi đã link đúng account
- **Ghi chú:**
  - Dùng Jest mocks cho external dependencies

---

### Task 7 — Thêm integration test cho provision endpoint

- **Files:**
  - Tạo mới:
    - `apps/billing/app/api/internal/organisation/provision/__tests__/route.test.ts`
  - Sửa:
    - Không có
- **Triển khai:**
  - Function/Class:
    - Test suite cho `/api/internal/organisation/provision`
  - Mục đích:
    - Kiểm tra endpoint behavior end-to-end
  - Input:
    - Mock HTTP requests
    - Mock auth context
  - Output:
    - Test results
- **Tiêu chí hoàn thành:**
  - Test: 401 khi không có auth token
  - Test: 400 khi invalid body
  - Test: 200 với valid request + new org
  - Test: 200 với valid request + existing org
- **Ghi chú:**
  - Theo test patterns có sẵn trong Billing app

---

## Tóm tắt

| Task | Mô tả | AC Coverage |
|------|-------|-------------|
| 1 | Zod schema | AC1 (một phần) |
| 2 | ProvisionService | AC3, AC4, AC5, AC8 |
| 3 | Provision endpoint | AC1, AC2 |
| 4 | Dashboard helper | AC6, AC7 |
| 5 | Shopify callback integration | AC6, AC7 |
| 6 | Unit tests | Regression |
| 7 | Integration tests | E2E verification |
