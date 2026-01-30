# Specification Update #1 — BP-24: Billing App Installation Synchronization
<!-- Specification Update #1 based on PR Review Feedback -->
<!-- Data Model Refinement: Service-Based Architecture -->

---

## 📋 Update Context

| Aspect | Value |
|--------|-------|
| Update Number | **#1** |
| Update Type | **PR_REVIEW** |
| Update Date | 2026-01-28 |
| Previous Spec | [spec.md](./spec.md) |
| Restart Phase | Phase 1 (Specification) |

### Changes Overview / Tổng quan Thay đổi

🇻🇳 **Các thay đổi chính từ PR review:**
1. Loại bỏ model `Product` → chỉ giữ model `Service` (khái niệm rộng hơn, phù hợp hơn)
2. Loại bỏ model `ServiceUsageStore` → gộp vào model mới
3. Đổi tên `ServiceUsage` → `ServiceAccountStore` (ngữ nghĩa rõ ràng hơn)
4. Thêm logic lưu `accountId` trong Dashboard để sử dụng khi gọi Billing API

🇬🇧 **Key changes from PR review:**
1. Remove `Product` model → keep only `Service` model (broader concept, better fit)
2. Remove `ServiceUsageStore` model → consolidate into renamed model
3. Rename `ServiceUsage` → `ServiceAccountStore` (clearer semantics)
4. Add logic to store `accountId` in Dashboard for use when calling Billing API

---

## TL;DR

| Aspect | Value |
|--------|-------|
| Feature | BP-24: Billing App Installation Synchronization |
| Status | **Update #1** - Draft |
| Previous Version | [spec.md](./spec.md) (v1 baseline) |
| Functional Requirements | 13 (Updated) |
| Non-Functional Requirements | 3 |
| Affected Roots | apphub-vision |
| Breaking Changes | ✅ Yes (Schema changes) |

---

## 1. Overview / Tổng quan

### 1.1 Problem Statement / Phát biểu Vấn đề

🇻🇳 **Vấn đề:**
- Khi merchant cài đặt Shopify app qua Dashboard, không có record tương ứng trong hệ thống Billing
- Organisation và ServiceAccountStore (quan hệ Account → Service → Store) phải tồn tại trong Billing database trước khi merchant có thể được tính phí
- Hiện tại cần can thiệp thủ công để tạo billing records
- Chưa có luồng provisioning tự động giữa Dashboard và Billing

🇬🇧 **Problem:**
- When a merchant installs the Shopify app via Dashboard, there is no corresponding record in the Billing system
- Organisation and ServiceAccountStore (Account → Service → Store relationship) must exist in Billing database before merchants can be charged
- Currently requires manual intervention to create billing records
- No automated provisioning flow exists between Dashboard and Billing

### 1.2 Goals / Mục tiêu

🇻🇳 **Mục tiêu:**
1. Tự động tạo billing records (Organisation + ServiceAccountStore) khi Shopify app được cài đặt
2. Tạo Stripe Customer trong hệ thống Stripe cho các thao tác billing sau này
3. Theo dõi quan hệ Account → Service → Store qua model ServiceAccountStore
4. Tận dụng internal API authentication từ BP-25 cho giao tiếp internal an toàn
5. Đảm bảo operations idempotent để xử lý retry an toàn
6. **[NEW]** Dashboard lưu accountId để sử dụng khi gọi Billing API

🇬🇧 **Goals:**
1. Automatically provision billing records (Organisation + ServiceAccountStore) when Shopify app is installed
2. Create Stripe Customer in Stripe's system for future billing operations
3. Track Account → Service → Store relationships via ServiceAccountStore model
4. Leverage internal API authentication from BP-25 for secure internal communication
5. Ensure idempotent operations to handle retries safely
6. **[NEW]** Dashboard persists accountId for use when calling Billing API

### 1.3 Non-Goals / Ngoài Phạm vi

🇻🇳 **Không thuộc phạm vi:**
- Tạo Subscription (flow riêng sau provisioning)
- Setup payment method trên Stripe (xử lý trong Billing UI)
- Hỗ trợ multi-region (mặc định `uk` region)
- Xóa hoặc cập nhật Organisation/Account sau khi tạo
- Multi-service provisioning (chỉ "clearer" service trong MVP)

🇬🇧 **Out of scope:**
- Subscription creation (separate flow after provisioning)
- Stripe payment method setup (handled in Billing UI)
- Multi-region support (default to `uk` region)
- Organisation/Account deletion or updates after creation
- Multi-service provisioning (only "clearer" service in MVP)

---

## 2. Data Model Changes / Thay đổi Data Model

### 2.1 Model Removals / Models bị Loại bỏ

#### ❌ Product (REMOVED)

🇻🇳 **Lý do loại bỏ:**
- Khái niệm `Product` và `Service` trùng lặp về mặt ngữ nghĩa
- `Service` là khái niệm rộng hơn, phù hợp với business model (billing cho apps, support packages, custom work, consulting)
- Tất cả relationships của `Product` được migrate vào `Service`:
  - Product → ServiceAccountStore relationships → Service → ServiceAccountStore
  - Product metadata (name, description) → Service metadata

🇬🇧 **Reason for removal:**
- `Product` and `Service` concepts overlap semantically
- `Service` is broader and better fits the business model (billing for apps, support packages, custom work, consulting)
- All `Product` relationships migrated to `Service`:
  - Product → ServiceAccountStore relationships → Service → ServiceAccountStore
  - Product metadata (name, description) → Service metadata

#### ❌ ServiceUsageStore (REMOVED)

🇻🇳 **Lý do loại bỏ:**
- Tạo indirection không cần thiết
- Logic được gộp vào model `ServiceAccountStore` (renamed từ `ServiceUsage`)
- Đơn giản hóa quan hệ: Account → Service → Store thành một model duy nhất

🇬🇧 **Reason for removal:**
- Creates unnecessary indirection
- Logic consolidated into `ServiceAccountStore` model (renamed from `ServiceUsage`)
- Simplifies Account → Service → Store relationship into single model

### 2.2 Model Renames / Đổi tên Models

#### 🔄 ServiceUsage → ServiceAccountStore

🇻🇳 **Lý do đổi tên:**
- Ngữ nghĩa rõ ràng hơn: model này đại diện cho việc Store nào (thuộc Account nào) đang sử dụng Service nào
- Tránh nhầm lẫn với "usage" (sử dụng thực tế) vs "account" (đăng ký sử dụng)
- Tên mới phản ánh đầy đủ 3 thực thể: Service + Account + Store

🇬🇧 **Reason for rename:**
- Clearer semantics: this model represents which Store (under which Account) uses which Service
- Avoids confusion between "usage" (actual usage) vs "account" (subscription)
- New name fully reflects all 3 entities: Service + Account + Store

---

## 3. Updated Data Model / Data Model Cập nhật

### 3.1 Prisma Schema

```prisma
// ============================================================
// Billing Core Models
// ============================================================

model Organisation {
  id                   String    @id @default(uuid())
  organisationName     String
  primaryContactEmail  String    // Lookup key
  primaryContactPhone  String?
  stripeCustomerId     String
  stripeRegion         String    @default("uk")
  testMode             Boolean   @default(false)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  accounts             Account[]

  @@map("organisations")
}

model Account {
  id             String              @id @default(uuid())
  organisationId String
  accountName    String              @default("Clearer")
  notes          String?
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  organisation   Organisation        @relation(fields: [organisationId], references: [id])
  serviceAccounts ServiceAccountStore[]

  @@map("accounts")
}

// ============================================================
// Service Models (UPDATED)
// ============================================================

model Service {
  id          String                @id @default(uuid())
  name        String                @unique  // "clearer", "boost", "support", "custom-theme"
  displayName String
  description String?
  isActive    Boolean               @default(true)
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  serviceAccounts ServiceAccountStore[]

  @@map("services")
}

// ============================================================
// Store & Linking Models (UPDATED)
// ============================================================

model Store {
  id         String                @id @default(uuid())
  shopDomain String                @unique  // e.g., "myshop.myshopify.com"
  shopName   String?
  platform   String                @default("shopify")
  organisationId String
  createdAt  DateTime              @default(now())
  updatedAt  DateTime              @updatedAt

  organisation Organisation          @relation(fields: [organisationId], references: [id])
  serviceAccounts ServiceAccountStore[]

  @@map("stores")
}

// NEW: Consolidated model replacing ServiceUsage + ServiceUsageStore
model ServiceAccountStore {
  id          String   @id @default(uuid())
  accountId   String
  serviceId   String
  storeId     String
  linkedAt    DateTime @default(now())
  isActive    Boolean  @default(true)
  
  account     Account  @relation(fields: [accountId], references: [id])
  service     Service  @relation(fields: [serviceId], references: [id])
  store       Store    @relation(fields: [storeId], references: [id])

  // Constraint: One service per store per account
  @@unique([accountId, serviceId, storeId])
  @@map("service_account_stores")
}
```

### 3.2 Data Model Diagram / Sơ đồ Data Model

```
Organisation (1) ──────< (N) Account
      │                      │
      │ (1)                  │ (1)
      │                      │
      ▼                      ▼
    Store (N)          ServiceAccountStore (N) ──> (1) Service

Relationships / Quan hệ:
- One Organisation has many Accounts (1:N)
- One Organisation has many Stores (1:N) - Store belongs directly to Organisation
- One Account can use multiple Services across multiple Stores (1:N ServiceAccountStore)
- One Service can be used by multiple Accounts (1:N ServiceAccountStore)
- One Store can be linked to multiple Service-Account combinations (1:N ServiceAccountStore)
- Unique constraint: (accountId, serviceId, storeId) - one service per store per account
```

### 3.3 Key Constraints / Ràng buộc Quan trọng

🇻🇳 **Ràng buộc:**
1. `Service.name` phải unique (e.g., "clearer", "boost")
2. `Store.shopDomain` phải unique (e.g., "shop.myshopify.com")
3. `Store.organisationId` FK to Organisation - Store belongs directly to Organisation
4. `ServiceAccountStore` có unique constraint: `(accountId, serviceId, storeId)`
   - Một Store chỉ có thể link với một Account cho mỗi Service
   - Store có thể sử dụng nhiều Services (clearer + boost)
   - Account có thể có nhiều Stores sử dụng cùng một Service

🇬🇧 **Constraints:**
1. `Service.name` must be unique (e.g., "clearer", "boost")
2. `Store.shopDomain` must be unique (e.g., "shop.myshopify.com")
3. `Store.organisationId` FK to Organisation - Store belongs directly to Organisation
4. `ServiceAccountStore` has unique constraint: `(accountId, serviceId, storeId)`
   - One Store can only link to one Account per Service
   - Store can use multiple Services (clearer + boost)
   - Account can have multiple Stores using the same Service

---

## 4. Functional Requirements / Yêu cầu Chức năng

### FR-001: Internal Provisioning API Endpoint

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **Updated** (model changes) |

#### Description / Mô tả

🇻🇳 Cập nhật internal API endpoint `POST /api/internal/provision` (đã tồn tại) trong Billing app để trả về `accountId` trong response. Endpoint tạo Organisation, Account, Service (nếu chưa có), ServiceAccountStore, và Store records.

🇬🇧 Update existing internal API endpoint `POST /api/internal/provision` in Billing app to return `accountId` in response. Endpoint creates Organisation, Account, Service (if not exists), ServiceAccountStore, and Store records.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC1-1: Endpoint path is `POST /api/internal/provision` (existing endpoint)
- [ ] AC1-2: Validates internal API token using BP-25 `getAuthContext()`
- [ ] AC1-3: Returns 401 if token is invalid or missing
- [ ] AC1-4: Returns 400 if request body validation fails
- [ ] AC1-5: Returns 500 if Stripe or database errors occur

---

### FR-002: Stripe Customer Creation

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | No change from v1 |

#### Description / Mô tả

🇻🇳 Tạo Stripe Customer khi Organisation chưa tồn tại. Sử dụng region `uk` và `testMode` dựa trên environment.

🇬🇧 Create Stripe Customer when Organisation does not exist. Use region `uk` and `testMode` based on environment.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC2-1: Stripe Customer created with region `uk`
- [ ] AC2-2: `testMode` set to `true` if environment is not `production`
- [ ] AC2-3: Stripe Customer ID stored in `Organisation.stripeCustomerId`
- [ ] AC2-4: If Stripe API fails, log error and return 500

---

### FR-003: Organisation Idempotent Creation

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | No change from v1 |

#### Description / Mô tả

🇻🇳 Kiểm tra Organisation tồn tại bằng `primaryContactEmail`. Nếu chưa tồn tại, tạo mới với Stripe Customer ID. Nếu đã tồn tại, trả về existing.

🇬🇧 Check if Organisation exists by `primaryContactEmail`. If not, create new with Stripe Customer ID. If exists, return existing.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC3-1: Lookup Organisation by `primaryContactEmail`
- [ ] AC3-2: If not found, create Organisation with mapped fields from request
- [ ] AC3-3: If found, skip creation and use existing Organisation
- [ ] AC3-4: Map request fields: `email` → `primaryContactEmail`, `name` → `organisationName`, `phone` → `primaryContactPhone`

---

### FR-004: Account Creation

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | No change from v1 |

#### Description / Mô tả

🇻🇳 Tạo Account với tên mặc định "Clearer" cho Organisation. Nếu Account đã tồn tại, bỏ qua.

🇬🇧 Create Account with default name "Clearer" for Organisation. If Account exists, skip.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC4-1: Check if Account exists with `organisationId` + `accountName="Clearer"`
- [ ] AC4-2: If not found, create Account
- [ ] AC4-3: If found, skip and use existing Account

---

### FR-005: Service Seed Data

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **New** (replaces Product) |

#### Description / Mô tả

🇻🇳 Seed Service table với các services mặc định: "clearer", "boost", "support", "custom-theme". Provisioning endpoint luôn sử dụng service "clearer".

🇬🇧 Seed Service table with default services: "clearer", "boost", "support", "custom-theme". Provisioning endpoint always uses "clearer" service.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC5-1: Seed script creates Service records with names: "clearer", "boost", "support", "custom-theme"
- [ ] AC5-2: Each Service has `displayName` and `description`
- [ ] AC5-3: All Services default to `isActive: true`
- [ ] AC5-4: Provisioning endpoint references service by name "clearer"

---

### FR-006: Store Creation with Organisation Link

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **Updated** (Store now belongs to Organisation) |

#### Description / Mô tả

🇻🇳 Tìm hoặc tạo Store record bằng `shopDomain`. Store thuộc về Organisation (organisationId FK). Store là unique per `shopDomain`.

🇬🇧 Find or create Store record by `shopDomain`. Store belongs to Organisation (organisationId FK). Store is unique per `shopDomain`.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC6-1: Lookup Store by `shopDomain`
- [ ] AC6-2: If not found, create Store with `shopDomain`, `platform: "shopify"`, and `organisationId`
- [ ] AC6-3: If found, verify `organisationId` matches (or update if transfer scenario)
- [ ] AC6-4: Unique constraint on `shopDomain` prevents duplicates

---

### FR-007: ServiceAccountStore Linking

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **New** (replaces ServiceUsage + ServiceUsageStore) |

#### Description / Mô tả

🇻🇳 Tạo ServiceAccountStore record để link Account + Service "clearer" + Store. Đảm bảo unique constraint `(accountId, serviceId, storeId)` được tôn trọng.

🇬🇧 Create ServiceAccountStore record to link Account + Service "clearer" + Store. Ensure unique constraint `(accountId, serviceId, storeId)` is respected.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC7-1: Lookup Service by name "clearer"
- [ ] AC7-2: Check if ServiceAccountStore exists for `(accountId, serviceId="clearer", storeId)`
- [ ] AC7-3: If not found, create ServiceAccountStore with `isActive: true`
- [ ] AC7-4: If found, skip and use existing
- [ ] AC7-5: Unique constraint prevents duplicate links

---

### FR-008: Response Structure

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **Updated** (include accountId) |

#### Description / Mô tả

🇻🇳 API trả về cấu trúc `{ organisation, account, service, store, serviceAccountStore, accountId, created }`. Field `accountId` là Account.id để Dashboard lưu trữ.

🇬🇧 API returns structure `{ organisation, account, service, store, serviceAccountStore, accountId, created }`. Field `accountId` is Account.id for Dashboard to persist.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC8-1: Response includes `organisation` object
- [ ] AC8-2: Response includes `account` object
- [ ] AC8-3: Response includes `service` object (name: "clearer")
- [ ] AC8-4: Response includes `store` object
- [ ] AC8-5: Response includes `serviceAccountStore` object
- [ ] AC8-6: **[NEW]** Response includes `accountId` (string, Account.id)
- [ ] AC8-7: Response includes `created` boolean (true if newly created)

---

### FR-009: Dashboard Integration (Onboarding Flow)

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Dashboard app) |
| Status | **Updated** (persist accountId) |

#### Description / Mô tả

🇻🇳 Dashboard onboarding flow (`/get-started`) gọi provisioning endpoint sau khi merchant hoàn thành profile. Sau khi nhận response, Dashboard lưu `accountId` vào database để sử dụng khi gọi Billing API sau này.

🇬🇧 Dashboard onboarding flow (`/get-started`) calls provisioning endpoint after merchant completes profile. After receiving response, Dashboard persists `accountId` to database for use when calling Billing API later.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC9-1: `registerCompany()` action calls `provisionBillingOrganisationAsync()` after saving merchant data
- [ ] AC9-2: Provisioning call is fire-and-forget (failures logged, do not block onboarding)
- [ ] AC9-3: Request includes: `{ email, name, phone, domain, shopDomain }`
- [ ] AC9-4: **[NEW]** Dashboard receives `accountId` from response
- [ ] AC9-5: **[NEW]** Dashboard persists `accountId` to merchant/organisation record
- [ ] AC9-6: **[NEW]** `accountId` is available for subsequent Billing API calls

---

### FR-010: Dashboard accountId Storage Schema

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Dashboard app, app-database) |
| Status | **New** |

#### Description / Mô tả

🇻🇳 Thêm field `billingAccountId` vào table `Merchant` trong app-database để lưu Account ID từ Billing app. Field này được sử dụng khi Dashboard cần gọi Billing API.

🇬🇧 Add field `billingAccountId` to `Merchant` table in app-database to store Account ID from Billing app. This field is used when Dashboard needs to call Billing API.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC10-1: Add `billingAccountId` field to `Merchant` table in app-database schema
- [ ] AC10-2: Prisma migration created for `Merchant.billingAccountId` field
- [ ] AC10-3: Field type is `String?` (nullable UUID from Billing)
- [ ] AC10-4: Field is nullable for backward compatibility with existing merchants
- [ ] AC10-5: Update `registerCompany()` to save accountId after receiving provision response
- [ ] AC10-6: Update `getStartedProgress()` fallback to save accountId if missing

---

### FR-011: Fallback Provisioning

| Aspect | Detail |
|--------|--------|
| Priority | **Should** |
| Affected Roots | apphub-vision (Dashboard app) |
| Status | No change from v1 |

#### Description / Mô tả

🇻🇳 Existing merchants (đã cài đặt trước billing feature) cần fallback provisioning khi họ truy cập dashboard. Logic trong `getStartedProgress()` kiểm tra nếu profile đã complete nhưng chưa provision, trigger provisioning.

🇬🇧 Existing merchants (installed before billing feature) need fallback provisioning when accessing dashboard. Logic in `getStartedProgress()` checks if profile is complete but not provisioned, triggers provisioning.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC11-1: `getStartedProgress()` checks if provisioning needed
- [ ] AC11-2: If merchant profile complete but no billing records, trigger provisioning
- [ ] AC11-3: Idempotent - safe to call multiple times
- [ ] AC11-4: **[NEW]** Persist accountId after fallback provisioning

---

### FR-012: Error Handling & Logging

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app, Dashboard app) |
| Status | No change from v1 |

#### Description / Mô tả

🇻🇳 Provisioning failures không block onboarding flow. Tất cả errors được log để review sau. Dashboard tiếp tục onboarding nếu provisioning fail.

🇬🇧 Provisioning failures do not block onboarding flow. All errors are logged for later review. Dashboard continues onboarding if provisioning fails.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC12-1: Billing endpoint logs all errors to console
- [ ] AC12-2: Dashboard logs provisioning failures
- [ ] AC12-3: Onboarding flow continues even if provisioning fails
- [ ] AC12-4: Stripe Customer ID logged if Organisation creation fails (for cleanup)

---

### FR-013: Idempotency & Concurrency

| Aspect | Detail |
|--------|--------|
| Priority | **Must** |
| Affected Roots | apphub-vision (Billing app) |
| Status | **Updated** (new constraints) |

#### Description / Mô tả

🇻🇳 Provisioning endpoint phải idempotent - gọi nhiều lần với cùng input trả về cùng kết quả. Xử lý concurrent requests an toàn với database constraints.

🇬🇧 Provisioning endpoint must be idempotent - calling multiple times with same input returns same result. Handle concurrent requests safely with database constraints.

#### Acceptance Criteria / Tiêu chí Nghiệm thu

- [ ] AC13-1: `Service.name` unique constraint prevents duplicate services
- [ ] AC13-2: `Store.shopDomain` unique constraint prevents duplicate stores
- [ ] AC13-3: `ServiceAccountStore` unique constraint `(accountId, serviceId, storeId)` prevents duplicate links
- [ ] AC13-4: Concurrent requests for same email return existing Organisation
- [ ] AC13-5: Concurrent requests for same shopDomain return existing Store
- [ ] AC13-6: Calling endpoint multiple times returns `created: false` after first call

---

## 5. Non-Functional Requirements / Yêu cầu Phi Chức năng

### NFR-001: Performance

| Aspect | Detail |
|--------|--------|
| Category | Performance |
| Metric | < 2s end-to-end for provisioning |

🇻🇳 **Mô tả:** Provisioning endpoint phải hoàn thành trong vòng 2 giây (bao gồm Stripe API call + database operations).

🇬🇧 **Description:** Provisioning endpoint must complete within 2 seconds (including Stripe API call + database operations).

---

### NFR-002: Security

| Aspect | Detail |
|--------|--------|
| Category | Security |
| Metric | Internal API token validation required |

🇻🇳 **Mô tả:** Endpoint chỉ chấp nhận requests với valid internal API token (BP-25). Token phải có prefix `bil_*`.

🇬🇧 **Description:** Endpoint only accepts requests with valid internal API token (BP-25). Token must have prefix `bil_*`.

---

### NFR-003: Reliability

| Aspect | Detail |
|--------|--------|
| Category | Reliability |
| Metric | 99% success rate (excluding Stripe failures) |

🇻🇳 **Mô tả:** Provisioning phải thành công 99% trường hợp (không tính Stripe API failures ngoài tầm kiểm soát).

🇬🇧 **Description:** Provisioning must succeed 99% of the time (excluding Stripe API failures beyond our control).

---

## 6. API Contracts / Hợp đồng API

### 6.1 Request Schema

```typescript
// POST /api/internal/provision
// Header: Authorization: Bearer bil_<jwt>

interface ProvisionRequest {
  email: string;        // Required, lookup key
  name: string;         // Required, organisation name
  phone?: string;       // Optional
  domain?: string;      // Optional (for future use)
  shopDomain: string;   // Required, e.g., "myshop.myshopify.com"
}
```

### 6.2 Response Schema (Updated)

```typescript
interface ProvisionResponse {
  organisation: {
    id: string;
    organisationName: string;
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    stripeCustomerId: string;
    stripeRegion: string;
    testMode: boolean;
  };
  account: {
    id: string;
    organisationId: string;
    accountName: string;
    notes: string | null;
  };
  service: {
    id: string;
    name: string;         // "clearer"
    displayName: string;
    description: string | null;
    isActive: boolean;
  };
  store: {
    id: string;
    shopDomain: string;
    shopName: string | null;
    platform: string;     // "shopify"
    organisationId: string;
  };
  serviceAccountStore: {
    id: string;
    accountId: string;
    serviceId: string;
    storeId: string;
    linkedAt: string;
    isActive: boolean;
  };
  accountId: string;      // NEW: Account.id for Dashboard to persist
  created: boolean;       // true if newly created, false if existing
}
```

### 6.3 Error Responses

```typescript
// 400 Bad Request
{
  error: "Validation error",
  details: {
    email: "Invalid email format",
    shopDomain: "Required field"
  }
}

// 401 Unauthorized
{
  error: "Invalid or missing internal API token"
}

// 500 Internal Server Error
{
  error: "Provisioning failed",
  details: "Stripe API error: ..."
}
```

---

## 7. Migration Impact / Ảnh hưởng Migration

### 7.1 Database Migration

🇻🇳 **Các bước Migration:**

1. **Tạo migration mới:**
   - Drop table `ServiceUsageStore` (nếu đã tồn tại)
   - Drop table `Product` (nếu đã tồn tại)
   - Rename table `ServiceUsage` → `service_account_stores`
   - Add `organisationId` column to Store table
   - Add Service reference to ServiceAccountStore

2. **Seed Service table:**
   - Insert services: "clearer", "boost", "support", "custom-theme"

3. **Data migration (nếu có data cũ):**
   - For existing Store records: set `organisationId` (may need manual mapping)
   - Migrate existing `ServiceUsage` records to new schema
   - Map `accountId`, add `serviceId` (default "clearer"), add `storeId`

🇬🇧 **Migration Steps:**

1. **Create new migration:**
   - Drop table `ServiceUsageStore` (if exists)
   - Drop table `Product` (if exists)
   - Rename table `ServiceUsage` → `service_account_stores`
   - Add `organisationId` column to Store table
   - Add Service reference to ServiceAccountStore

2. **Seed Service table:**
   - Insert services: "clearer", "boost", "support", "custom-theme"

3. **Data migration (if old data exists):**
   - For existing Store records: set `organisationId` (may need manual mapping)
   - Migrate existing `ServiceUsage` records to new schema
   - Map `accountId`, add `serviceId` (default "clearer"), add `storeId`

### 7.2 Code Migration

🇻🇳 **Các file cần update:**

**Billing App:**
- `packages/billing-database/prisma/schema.prisma` - Schema changes (Service, ServiceAccountStore, Store.organisationId)
- `packages/billing-database/prisma/seed/services.ts` - Seed Service data
- `apps/billing/lib/repository/prisma/service.repository.ts` - New repository
- `apps/billing/lib/repository/prisma/service-usage.repository.ts` → rename to `service-account-store.repository.ts`
- `apps/billing/lib/repository/prisma/store.repository.ts` - Update for organisationId FK
- `apps/billing/services/provision.service.ts` - Update logic for new models
- `apps/billing/app/api/internal/provision/route.ts` - Update to return accountId in response
- `apps/billing/app/api/internal/provision/schema.ts` - Update response schema with accountId

**Dashboard App:**
- `packages/app-database/prisma/schema.prisma` - Add `billingAccountId: String?` to Merchant model
- `apps/dashboard/helper/billing/provision.ts` - Handle accountId in response, return to caller
- `apps/dashboard/app/(frameless-layout)/get-started/actions.ts` - Persist accountId to Merchant table in both `registerCompany()` and `getStartedProgress()` fallback

**Tests:**
- Update all affected test files for new model names
- Add tests for accountId persistence

🇬🇧 **Files to update:** (Same as above)

---

## 8. Cross-Root Impact / Ảnh hưởng Đa Root

### Root: apphub-vision

| Aspect | Detail |
|--------|--------|
| Changes | Schema changes, API updates, Dashboard persistence |
| Sync Type | Immediate (single monorepo) |

🇻🇳 **Điểm Tích hợp:**
- Billing app exposes internal API
- Dashboard consumes internal API
- Shared internal API token (BP-25)
- Dashboard persists accountId to app-database

🇬🇧 **Integration Points:**
- Billing app exposes internal API
- Dashboard consumes internal API
- Shared internal API token (BP-25)
- Dashboard persists accountId to app-database

🇻🇳 **Dependencies Affected:**
- `@clearer/billing-database` - Schema changes affect all Billing app imports
- `@clearer/app-database` - New field for accountId storage

🇬🇧 **Dependencies Affected:**
- `@clearer/billing-database` - Schema changes affect all Billing app imports
- `@clearer/app-database` - New field for accountId storage

---

## 9. Edge Cases / Trường hợp Biên

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-001 | Duplicate email with different Stripe customer | Should not happen (email is lookup key) |
| EC-002 | Stripe API failure | Log error, return 500, Dashboard continues |
| EC-003 | DB transaction failure after Stripe customer created | Log Stripe customer ID for manual cleanup |
| EC-004 | Internal API token expired/invalid | Return 401, Dashboard logs and continues |
| EC-005 | Missing required fields | Return 400 with validation errors |
| EC-006 | Account "Clearer" already exists for org | Skip creation, return existing |
| EC-007 | Concurrent requests for same email | DB constraint prevents duplicates |
| EC-008 | Service "clearer" not found | Ensure Service is seeded properly |
| EC-009 | ServiceAccountStore already exists | Skip creation, return existing |
| EC-010 | **[NEW]** Dashboard receives accountId but fails to persist | Log error, continue (can retry fallback provisioning later) |
| EC-011 | Store exists but belongs to different Organisation | Update organisationId (store transfer scenario) |

---

## 10. Risks & Mitigations / Rủi ro & Giảm thiểu

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Stripe Customer orphaned** (created but Org creation fails) | Medium | Log Stripe customer ID for manual cleanup |
| **No unique constraint on primaryContactEmail** | Low | Application-level check first; consider DB constraint later |
| **Internal API token leakage** | Medium | Tokens short-lived (BP-25), endpoint only creates records |
| **Billing app unavailable** | Low | Fire-and-forget pattern; Dashboard continues, logs failure |
| **Service seed data missing** | High | Add validation in provisioning endpoint; fail fast if service not found |
| **ServiceAccountStore constraint violation** | Low | Unique constraint handles, return existing |
| **Dashboard fails to persist accountId** | Low | Log error, fallback provisioning can retry later |
| **Store organisationId mismatch** | Medium | Handle store transfer scenario; update organisationId if needed |

---

## 11. Dependencies / Phụ thuộc

| Dependency | Type | Status |
|------------|------|--------|
| BP-25 Internal API Auth | Feature | ✅ Merged & Active |
| Stripe API (region: uk) | External Service | ✅ Available |
| `@clearer/billing-database` | Internal Package | 🔄 Schema update required |
| `@clearer/app-database` | Internal Package | 🔄 Schema update required (accountId field) |
| Prisma ORM | Tool | ✅ Available |

---

## 12. Open Questions / Câu hỏi Mở

| ID | Question | Status | Resolution |
|----|----------|--------|------------|
| Q1 | Which Dashboard table should store `billingAccountId`? | **� Resolved** | **Merchant table** - Add `billingAccountId: String?` field to `Merchant` model in app-database |
| Q2 | Should we add unique constraint on `Service.name` at DB level? | **🟢 Resolved** | Yes, added in schema |
| Q3 | Migration strategy for existing data (if any)? | **🟡 Pending** | Need to check if any existing ServiceUsage data |
| Q4 | Should fallback provisioning retry if accountId persistence fails? | **🟢 Resolved** | No retry - idempotent fallback in `getStartedProgress()` handles it |
| Q5 | How to handle Store transfer between Organisations? | **🟡 Pending** | Defer to implementation - likely return error for security |

---

## 13. Approval / Phê duyệt

| Role | Status | Date |
|------|--------|------|
| Spec Author (Copilot) | ✅ Done | 2026-01-28 |
| Reviewer | ⏳ Pending | |
| Stakeholder | ⏳ Pending | |

---

## ⏸️ STOP: Spec Update #1 Complete / Hoàn thành Spec Update #1

### Summary / Tóm tắt

| Aspect | Value |
|--------|-------|
| Update Type | PR_REVIEW |
| Breaking Changes | ✅ Yes (Schema changes) |
| Functional Requirements | 13 (3 new: FR-005, FR-007, FR-010) |
| Non-Functional Requirements | 3 |
| Open Questions | 5 |
| Models Removed | 2 (Product, ServiceUsageStore) |
| Models Renamed | 1 (ServiceUsage → ServiceAccountStore) |
| New Fields | 2 (Store.organisationId, Dashboard.billingAccountId - table TBD) |

### Key Changes from v1 / Thay đổi Chính so với v1

🇻🇳
1. ❌ Loại bỏ: `Product`, `ServiceUsageStore`
2. 🔄 Đổi tên: `ServiceUsage` → `ServiceAccountStore`
3. ➕ Thêm: `Service` model với seed data
4. ➕ Thêm: `Store.organisationId` FK - Store thuộc trực tiếp Organisation
5. ➕ Thêm: `accountId` return value + Dashboard persistence logic
6. 🔄 Cập nhật: API response schema
7. 🔄 Cập nhật: Constraints và relationships

🇬🇧
1. ❌ Removed: `Product`, `ServiceUsageStore`
2. 🔄 Renamed: `ServiceUsage` → `ServiceAccountStore`
3. ➕ Added: `Service` model with seed data
4. ➕ Added: `Store.organisationId` FK - Store belongs directly to Organisation
5. ➕ Added: `accountId` return value + Dashboard persistence logic
6. 🔄 Updated: API response schema
7. 🔄 Updated: Constraints and relationships

---

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
