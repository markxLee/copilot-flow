# Billing App Installation Synchronization (BP-24)

---

# English

## Overview

**Problem:**
- When a merchant installs the Shopify app via Dashboard, there is no corresponding record in the Billing system
- Organisation and Account records must exist in Billing database before merchants can be charged
- Currently requires manual intervention to create billing records
- No automated provisioning flow exists between Dashboard and Billing

**Goals:**
- Automatically provision billing records (Organisation + Account) when Shopify app is installed
- Create Stripe Customer in Stripe's system for future billing operations
- Track Shopify store → Account relationships via Store and StoreAccountLink records
- Leverage internal API authentication from BP-25 for secure internal communication
- Ensure idempotent operations to handle retries safely

**Non-goals:**
- Subscription creation (separate flow after provisioning)
- Stripe payment method setup (handled in Billing UI)
- Multi-region support (default to `uk` region for now)
- Organisation/Account deletion or updates

---

## User Stories

- As a **system**, when a Shopify app is installed, I want to automatically create billing records, so that the merchant can be billed later
- As a **merchant**, I want my billing profile to be ready immediately after install, so that I can subscribe to plans without delays
- As a **developer**, I want idempotent provisioning, so that retries don't create duplicate records

---

## Scope

**In scope:**
- New internal API endpoint `POST /api/internal/organisation/provision` in Billing app
- Internal API token validation using BP-25 infrastructure
- Stripe Customer creation via existing `StripeCustomerRepository`
- Organisation record creation in billing database
- Account record creation with default name "Clearer"
- Store record creation to track Shopify shop domain
- StoreAccountLink record to link Store → Account (with accountName constraint)
- Idempotent lookup by `primaryContactEmail` (Organisation) and `shopDomain` (Store)
- Dashboard onboarding flow (get-started) integration to trigger provisioning
- Fallback provisioning for existing merchants who installed before billing feature
- Error handling and logging (failures should not break user flow)

**Out of scope:**
- Subscription creation or plan assignment
- Stripe payment method collection
- Organisation updates after creation
- Multi-region Stripe support (future enhancement)
- Billing UI changes
- Account name customization

---

## UX / Flow

> **Updated:** Originally planned to integrate into Shopify callback. Implementation changed to integrate into onboarding/get-started flow for better UX and reliability.

### Primary Flow (New Merchant Onboarding)
1) Merchant installs Shopify app and starts onboarding
2) Merchant completes profile in `/get-started` page (email, company name, phone, website)
3) On form submit, `registerCompany()` action is called
4) After saving merchant data, `provisionBillingOrganisationAsync()` is called (fire-and-forget)
   - Input: `{ email, name, phone, domain, shopDomain }` from form + session.shopKey
5) Dashboard helper calls Billing internal API: `POST /api/internal/organisation/provision`
   - Header: `Authorization: Bearer bil_<jwt>` (internal API token from BP-25)
   - Body: `{ email, name, phone, domain, shopDomain }`
6) Billing endpoint validates internal API token (BP-25 `getAuthContext()`)
7) Billing checks if Organisation exists by `primaryContactEmail`
   - **If not exists:**
     a. Create Stripe Customer (region: `uk`, testMode: `env !== production`)
     b. Create Organisation with `stripeCustomerId`
     c. Create Account with name "Clearer"
   - **If exists:**
     a. Check if Account with `organisationId` + `accountName="Clearer"` exists
     b. If not exists → create Account
     c. If exists → skip
8) Billing ensures Store and StoreAccountLink exist:
   a. Find or create Store by `shopDomain`
   b. Check if StoreAccountLink exists for (storeId, accountName="Clearer")
   c. If linked to different account → update link to new account
   d. If not linked → create new link
   e. If already linked to same account → no-op
9) Return `{ organisation, account, store, storeAccountLink, created }` to Dashboard
10) Billing provisioning failures are logged but do not block onboarding

### Fallback Flow (Existing Merchants)
1) Existing merchant (who installed before billing feature) accesses dashboard
2) `getStartedProgress()` action checks if onboarding is complete
3) If merchant profile is complete, fallback provisioning is triggered
4) Same flow as Primary Flow steps 4-10
5) Idempotent - safe to call multiple times, returns existing records if already provisioned

---

## Data & Contracts

**Entities / Schemas:**

```
Organisation (existing model)
├── id: UUID
├── organisationName: string     ← org.name
├── primaryContactEmail: string  ← org.email (lookup key)
├── primaryContactPhone: string  ← org.phone
├── stripeCustomerId: string     ← from Stripe API
├── stripeRegion: 'uk'           ← default
└── testMode: boolean            ← env !== 'production'

Account (existing model)
├── id: UUID
├── organisationId: FK → Organisation
├── accountName: 'Clearer'       ← default
└── notes: null

Store (new model)
├── id: UUID
├── shopDomain: string           ← unique, e.g. "myshop.myshopify.com"
├── shopName?: string            ← display name
├── platform: 'shopify'          ← default
├── createdAt: DateTime
└── updatedAt: DateTime

StoreAccountLink (new model)
├── id: UUID
├── storeId: FK → Store
├── accountId: FK → Account
├── accountName: string          ← e.g. "Clearer", "Boost"
├── linkedAt: DateTime
└── unique constraint: (storeId, accountName)  ← one account per accountName per store
```

**Key Constraints:**
- A Store can link to multiple Accounts (different accountNames)
- A Store can only link to ONE Account per accountName
  (e.g., store can have Clearer account AND Boost account, but not two Clearer accounts)

**API endpoints / Events:**

```
POST /api/internal/organisation/provision (Billing App)
├── Auth: Internal API token (bil_* prefix, from BP-25)
├── Request Body:
│   ├── email: string (required, lookup key)
│   ├── name: string (required)
│   ├── phone?: string (optional)
│   └── domain?: string (optional, for future use)
├── Response 200:
│   ├── organisation: Organisation
│   ├── account: Account
│   ├── store: Store
│   ├── storeAccountLink: StoreAccountLink
│   └── created: boolean (true if newly created)
├── Response 400: Invalid request body
├── Response 401: Invalid/missing internal API token
└── Response 500: Internal error (Stripe/DB failure)
```

---

## Acceptance Criteria

- [ ] AC1: `POST /api/internal/organisation/provision` endpoint exists in Billing app
- [ ] AC2: Endpoint validates internal API token using BP-25 infrastructure
- [ ] AC3: If Organisation with matching `primaryContactEmail` does not exist:
  - Creates Stripe Customer (region: `uk`, testMode based on env)
  - Creates Organisation with mapped fields
  - Creates Account with name "Clearer"
- [ ] AC4: If Organisation exists but Account "Clearer" doesn't exist → creates Account
- [ ] AC5: If both Organisation and Account exist → returns existing, `created: false`
- [ ] AC6: Store record created/found by shopDomain
- [ ] AC7: StoreAccountLink created to link Store → Account with accountName "Clearer"
- [ ] AC8: If Store already linked to different Account for "Clearer" → link updated
- [ ] AC9: Dashboard onboarding flow (registerCompany) calls provisioning endpoint after merchant completes profile
- [ ] AC10: Billing provisioning failures are logged but do not break onboarding flow
- [ ] AC11: Response includes `{ organisation, account, store, storeAccountLink, created }` structure
- [ ] AC12: Fallback provisioning in getStartedProgress() for existing merchants

---

## Edge Cases

- **Duplicate email with different Stripe customer**: Should not happen (email is lookup key, Stripe customer created only on first provision)
- **Stripe API failure**: Log error, return 500, Dashboard continues onboarding
- **Database transaction failure after Stripe customer created**: Log error with Stripe customer ID for manual cleanup
- **Internal API token expired/invalid**: Return 401, Dashboard logs and continues
- **Missing required fields**: Return 400 with validation errors
- **Account "Clearer" already exists for org**: Skip creation, return existing
- **Concurrent requests for same email**: Database unique constraint on `stripeCustomerId` prevents duplicates; second request should find existing org
- **Store already linked to different account for same accountName**: Update link to point to new account (store transfer scenario)
- **Concurrent requests for same shopDomain**: Database unique constraint on `shopDomain` prevents duplicates; second request should find existing store
- **Same store, different accountNames**: Allowed - store can have multiple account links (e.g., Clearer + Boost)
- **Existing merchant without billing records**: Fallback provisioning in getStartedProgress() handles this case

---

## Risks & Mitigations

- **Risk:** Stripe Customer created but Organisation creation fails (orphaned Stripe customer)
  - **Mitigation:** Log Stripe customer ID in error for manual cleanup; consider future saga pattern
  
- **Risk:** No unique constraint on `primaryContactEmail` in schema
  - **Mitigation:** Application-level check first; consider adding unique constraint in future migration

- **Risk:** Internal API token leakage could allow unauthorized provisioning
  - **Mitigation:** Internal API tokens are short-lived (from BP-25), endpoint only creates records (no delete/update)

- **Risk:** Billing app unavailable during Shopify install
  - **Mitigation:** Fire-and-forget pattern; Dashboard continues install, logs failure for later review

---

## Assumptions

- BP-25 internal API authentication is merged and functional
- `StripeCustomerRepository.createCustomer()` works correctly
- `StripeClient` can be instantiated with region `uk` and testMode flag
- Dashboard session contains `org` object with `email`, `name`, `phone`, `domain`
- Prisma client for billing-database is properly configured
- `AUTH_SECRET` environment variable is shared between Dashboard and Billing

---

## Open Questions

- ~~Q1: Which Stripe region to use?~~ → **Resolved: Default `uk`**
- ~~Q2: How to determine testMode?~~ → **Resolved: `env !== 'production'`**
- ~~Q3: Field mapping?~~ → **Resolved: See Data & Contracts**
- Q4: Should we add unique constraint on `primaryContactEmail`? → **Defer to Phase 3 discussion**
- Q5: Retry mechanism if provisioning fails? → **Out of scope for MVP; log and continue**

---

# Tiếng Việt

## Tổng quan

**Vấn đề:**
- Khi merchant cài đặt Shopify app qua Dashboard, không có record tương ứng trong hệ thống Billing
- Các bản ghi Organisation và Account phải tồn tại trong Billing database trước khi merchant có thể được tính phí
- Hiện tại cần can thiệp thủ công để tạo billing records
- Chưa có luồng provisioning tự động giữa Dashboard và Billing

**Mục tiêu:**
- Tự động tạo billing records (Organisation + Account) khi Shopify app được cài đặt
- Tạo Stripe Customer trong hệ thống Stripe cho các thao tác billing sau này
- Theo dõi quan hệ Shopify store → Account qua Store và StoreAccountLink records
- Tận dụng internal API authentication từ BP-25 cho giao tiếp internal an toàn
- Đảm bảo operations idempotent để xử lý retry an toàn

**Không thuộc phạm vi:**
- Tạo Subscription (flow riêng sau provisioning)
- Setup payment method trên Stripe (xử lý trong Billing UI)
- Hỗ trợ multi-region (mặc định `uk` region)
- Xóa hoặc cập nhật Organisation/Account

---

## User Stories

- Là **hệ thống**, khi Shopify app được cài đặt, tôi muốn tự động tạo billing records, để merchant có thể được tính phí sau này
- Là **merchant**, tôi muốn billing profile sẵn sàng ngay sau khi cài đặt, để có thể subscribe các plan mà không bị chậm trễ
- Là **developer**, tôi muốn provisioning idempotent, để retry không tạo duplicate records

---

## Phạm vi

**Trong phạm vi:**
- API endpoint internal mới `POST /api/internal/organisation/provision` trong Billing app
- Validate internal API token sử dụng hạ tầng BP-25
- Tạo Stripe Customer qua `StripeCustomerRepository` có sẵn
- Tạo Organisation record trong billing database
- Tạo Account record với tên mặc định "Clearer"
- Tạo Store record để theo dõi Shopify shop domain
- Tạo StoreAccountLink record để link Store → Account (với accountName constraint)
- Lookup idempotent bằng `primaryContactEmail` (Organisation) và `shopDomain` (Store)
- Tích hợp Dashboard onboarding flow (get-started) để trigger provisioning
- Fallback provisioning cho existing merchants đã cài đặt trước khi có billing feature
- Error handling và logging (failures không block user flow)

**Ngoài phạm vi:**
- Tạo Subscription hoặc gán plan
- Thu thập payment method trên Stripe
- Cập nhật Organisation sau khi tạo
- Hỗ trợ multi-region Stripe (cải tiến trong tương lai)
- Thay đổi Billing UI
- Tùy chỉnh tên Account

---

## UX / Luồng xử lý

> **Đã cập nhật:** Kế hoạch ban đầu là tích hợp vào Shopify callback. Implementation đã đổi sang tích hợp vào onboarding/get-started flow để UX tốt hơn và đáng tin cậy hơn.

### Luồng chính (Merchant mới Onboarding)
1) Merchant cài đặt Shopify app và bắt đầu onboarding
2) Merchant hoàn thành profile trong trang `/get-started` (email, company name, phone, website)
3) Khi submit form, `registerCompany()` action được gọi
4) Sau khi lưu merchant data, `provisionBillingOrganisationAsync()` được gọi (fire-and-forget)
   - Input: `{ email, name, phone, domain, shopDomain }` từ form + session.shopKey
5) Dashboard helper gọi Billing internal API: `POST /api/internal/organisation/provision`
   - Header: `Authorization: Bearer bil_<jwt>` (internal API token từ BP-25)
   - Body: `{ email, name, phone, domain, shopDomain }`
6) Billing endpoint validate internal API token (BP-25 `getAuthContext()`)
7) Billing kiểm tra Organisation tồn tại bằng `primaryContactEmail`
   - **Nếu chưa tồn tại:**
     a. Tạo Stripe Customer (region: `uk`, testMode: `env !== production`)
     b. Tạo Organisation với `stripeCustomerId`
     c. Tạo Account với tên "Clearer"
   - **Nếu đã tồn tại:**
     a. Kiểm tra Account với `organisationId` + `accountName="Clearer"` có tồn tại
     b. Nếu chưa → tạo Account
     c. Nếu có rồi → bỏ qua
8) Billing đảm bảo Store và StoreAccountLink tồn tại:
   a. Tìm hoặc tạo Store bằng `shopDomain`
   b. Kiểm tra StoreAccountLink tồn tại cho (storeId, accountName="Clearer")
   c. Nếu đã link với account khác → cập nhật link sang account mới
   d. Nếu chưa link → tạo link mới
   e. Nếu đã link đúng account → no-op
9) Trả về `{ organisation, account, store, storeAccountLink, created }` cho Dashboard
10) Billing provisioning failures được log nhưng không block onboarding

### Luồng Fallback (Merchants đã tồn tại)
1) Existing merchant (đã cài đặt trước khi có billing feature) truy cập dashboard
2) `getStartedProgress()` action kiểm tra onboarding đã hoàn thành chưa
3) Nếu merchant profile đã đầy đủ, fallback provisioning được trigger
4) Các bước giống Luồng chính 4-10
5) Idempotent - an toàn khi gọi nhiều lần, trả về existing records nếu đã provisioned

---

## Dữ liệu & Hợp đồng

**Thực thể / Schema:**

```
Organisation (model có sẵn)
├── id: UUID
├── organisationName: string     ← org.name
├── primaryContactEmail: string  ← org.email (lookup key)
├── primaryContactPhone: string  ← org.phone
├── stripeCustomerId: string     ← từ Stripe API
├── stripeRegion: 'uk'           ← mặc định
└── testMode: boolean            ← env !== 'production'

Account (model có sẵn)
├── id: UUID
├── organisationId: FK → Organisation
├── accountName: 'Clearer'       ← mặc định
└── notes: null

Store (model mới)
├── id: UUID
├── shopDomain: string           ← unique, vd: "myshop.myshopify.com"
├── shopName?: string            ← tên hiển thị
├── platform: 'shopify'          ← mặc định
├── createdAt: DateTime
└── updatedAt: DateTime

StoreAccountLink (model mới)
├── id: UUID
├── storeId: FK → Store
├── accountId: FK → Account
├── accountName: string          ← vd: "Clearer", "Boost"
├── linkedAt: DateTime
└── unique constraint: (storeId, accountName)  ← một account cho mỗi accountName mỗi store
```

**Ràng buộc quan trọng:**
- Một Store có thể link với nhiều Accounts (các accountNames khác nhau)
- Một Store chỉ có thể link với MỘT Account cho mỗi accountName
  (vd: store có thể có Clearer account VÀ Boost account, nhưng không thể có hai Clearer accounts)

**API / Sự kiện:**

```
POST /api/internal/organisation/provision (Billing App)
├── Auth: Internal API token (prefix bil_*, từ BP-25)
├── Request Body:
│   ├── email: string (bắt buộc, lookup key)
│   ├── name: string (bắt buộc)
│   ├── phone?: string (tùy chọn)
│   └── domain?: string (tùy chọn, cho tương lai)
├── Response 200:
│   ├── organisation: Organisation
│   ├── account: Account
│   ├── store: Store
│   ├── storeAccountLink: StoreAccountLink
│   └── created: boolean (true nếu mới tạo)
├── Response 400: Request body không hợp lệ
├── Response 401: Internal API token không hợp lệ/thiếu
└── Response 500: Lỗi internal (Stripe/DB failure)
```

---

## Tiêu chí nghiệm thu

- [ ] AC1: Endpoint `POST /api/internal/organisation/provision` tồn tại trong Billing app
- [ ] AC2: Endpoint validate internal API token sử dụng hạ tầng BP-25
- [ ] AC3: Nếu Organisation với `primaryContactEmail` khớp chưa tồn tại:
  - Tạo Stripe Customer (region: `uk`, testMode dựa trên env)
  - Tạo Organisation với các field được map
  - Tạo Account với tên "Clearer"
- [ ] AC4: Nếu Organisation tồn tại nhưng Account "Clearer" chưa có → tạo Account
- [ ] AC5: Nếu cả Organisation và Account đều tồn tại → trả về existing, `created: false`
- [ ] AC6: Store record được tạo/tìm thấy bằng shopDomain
- [ ] AC7: StoreAccountLink được tạo để link Store → Account với accountName "Clearer"
- [ ] AC8: Nếu Store đã link với Account khác cho "Clearer" → link được cập nhật
- [ ] AC9: Dashboard onboarding flow (registerCompany) gọi provisioning endpoint sau khi merchant hoàn thành profile
- [ ] AC10: Billing provisioning failures được log nhưng không block onboarding flow
- [ ] AC11: Response bao gồm cấu trúc `{ organisation, account, store, storeAccountLink, created }`
- [ ] AC12: Fallback provisioning trong getStartedProgress() cho existing merchants

---

## Trường hợp biên

- **Duplicate email với Stripe customer khác**: Không nên xảy ra (email là lookup key, Stripe customer chỉ tạo khi provision lần đầu)
- **Stripe API failure**: Log error, return 500, Dashboard tiếp tục onboarding
- **Database transaction failure sau khi Stripe customer đã tạo**: Log error với Stripe customer ID để cleanup thủ công
- **Internal API token hết hạn/không hợp lệ**: Return 401, Dashboard log và tiếp tục
- **Thiếu required fields**: Return 400 với validation errors
- **Account "Clearer" đã tồn tại cho org**: Bỏ qua tạo, trả về existing
- **Concurrent requests cho cùng email**: Database unique constraint trên `stripeCustomerId` ngăn duplicates; request thứ 2 sẽ tìm thấy org đã có
- **Store đã link với account khác cho cùng accountName**: Cập nhật link sang account mới (kịch bản transfer store)
- **Concurrent requests cho cùng shopDomain**: Database unique constraint trên `shopDomain` ngăn duplicates; request thứ 2 sẽ tìm thấy store đã có
- **Cùng store, khác accountNames**: Được phép - store có thể có nhiều account links (vd: Clearer + Boost)
- **Existing merchant không có billing records**: Fallback provisioning trong getStartedProgress() xử lý trường hợp này

---

## Rủi ro & Giảm thiểu

- **Rủi ro:** Stripe Customer đã tạo nhưng Organisation creation fail (orphaned Stripe customer)
  - **Giảm thiểu:** Log Stripe customer ID trong error để cleanup thủ công; cân nhắc saga pattern trong tương lai

- **Rủi ro:** Không có unique constraint trên `primaryContactEmail` trong schema
  - **Giảm thiểu:** Kiểm tra ở application level trước; cân nhắc thêm unique constraint trong migration sau

- **Rủi ro:** Internal API token bị leak có thể cho phép provisioning trái phép
  - **Giảm thiểu:** Internal API tokens có thời hạn ngắn (từ BP-25), endpoint chỉ tạo records (không delete/update)

- **Rủi ro:** Billing app không available trong Shopify install
  - **Giảm thiểu:** Fire-and-forget pattern; Dashboard tiếp tục install, log failure để review sau

---

## Giả định

- BP-25 internal API authentication đã merge và hoạt động
- `StripeCustomerRepository.createCustomer()` hoạt động chính xác
- `StripeClient` có thể khởi tạo với region `uk` và testMode flag
- Dashboard session chứa `org` object với `email`, `name`, `phone`, `domain`
- Prisma client cho billing-database đã được configure đúng
- Biến môi trường `AUTH_SECRET` được share giữa Dashboard và Billing

---

## Câu hỏi mở

- ~~Q1: Stripe region nào?~~ → **Đã giải quyết: Mặc định `uk`**
- ~~Q2: Xác định testMode như thế nào?~~ → **Đã giải quyết: `env !== 'production'`**
- ~~Q3: Field mapping?~~ → **Đã giải quyết: Xem Data & Contracts**
- Q4: Có nên thêm unique constraint trên `primaryContactEmail`? → **Hoãn để thảo luận Phase 3**
- Q5: Cơ chế retry nếu provisioning fail? → **Ngoài scope MVP; log và tiếp tục**
