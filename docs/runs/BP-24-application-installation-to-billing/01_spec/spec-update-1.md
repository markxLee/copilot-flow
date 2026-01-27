# BP-24 Spec Update 1: Service-Based Billing Model (v2)

---

# English

## Overview

**Problem:**
- Original spec (v1) linked Store directly to Account via `StoreAccountLink`
- PR review feedback: Account should be an **abstract billing group**, not directly tied to Store
- Need to support billing for items beyond app usage: support packages, custom work, consulting
- Current model cannot answer "what service is being billed?" only "which store is linked?"

**Goals:**
- Introduce `Service` entity to define **what can be billed** (apps, support, custom work, consulting)
- Track service usage via `ServiceUsage` (Account → Service relationship) — *replaces the concept of "AppAccount"*
- Track which stores use a service via `ServiceUsageStore` (ServiceUsage → Store)
- Store belongs directly to Organisation (not linked through Account)
- Service table should be **seeded** with master data

> **Terminology Note:** We use **"Service"** instead of "App" to have a broader meaning. Billing is not just for app usage (Clearer, Boost) but also for other billable items such as:
> - **Support packages** (premium support, SLA)
> - **Custom development** (theme customization, app customization)
> - **Consulting** (setup assistance, training)
> - **One-time services** (data migration, integration setup)
>
> Therefore, **`ServiceUsage`** replaces the earlier concept of "AppAccount" to provide this flexibility.

**Non-goals:**
- Changing Organisation or Account core structure
- Multi-account per organisation (future enhancement)
- Service pricing or plan assignment (separate feature)

---

## User Stories

- As a **billing system**, I want to track which services an account uses, so that I can bill for apps, support, and custom work separately
- As a **system**, when provisioning a merchant, I want to create the appropriate service usage record, so that billing attribution is correct
- As a **developer**, I want a seeded Service table, so that I don't need to manually create services in each environment

---

## Scope

**In scope:**
- New `Service` model (seeded lookup table)
- New `ServiceUsage` model (Account uses Service)
- New `ServiceUsageStore` model (which Stores are associated with usage)
- Update `Store` model to belong to Organisation directly (`organisationId` FK)
- Deprecate `StoreAccountLink` model
- Create seed script for Service table
- Update `ProvisionService` for v2 model logic
- Update API response to include `serviceUsage` instead of `storeAccountLink`

**Out of scope:**
- Service pricing configuration
- ServiceUsage billing cycle management
- Retroactive migration of existing StoreAccountLinks
- Multi-service provisioning in single request

---

## UX / Flow

### Updated Provisioning Flow (v2)

1) Dashboard calls `POST /api/internal/organisation/provision`
2) Billing validates internal API token
3) Billing checks if Organisation exists by `primaryContactEmail`
   - **If not exists:**
     a. Create Stripe Customer
     b. Create Organisation with `stripeCustomerId`
     c. Create Account with name "Default"
4) Billing creates/finds Store by `shopDomain`:
   - Store now has `organisationId` FK (belongs to org directly)
5) Billing creates ServiceUsage for "clearer" service:
   a. Lookup Service by code `'clearer'`
   b. Find or create ServiceUsage (accountId + serviceId)
   c. Create ServiceUsageStore linking Store to ServiceUsage
6) Return `{ organisation, account, store, serviceUsage }` to Dashboard

### Model Relationship Diagram

```
Organisation (merchant company)
    │
    ├──── (1:N) ──── Account (abstract billing group)
    │                   │
    │                   └──── (1:N) ──── ServiceUsage
    │                                        │
    │                                        ├── serviceId → Service
    │                                        │
    │                                        └── (1:N) ──── ServiceUsageStore
    │                                                           │
    └──── (1:N) ──── Store ◄────────────────────────────────────┘
```

---

## Data & Contracts

**Entities / Schemas:**

```
Service (NEW - seeded lookup table)
├── id: UUID
├── code: string          ← unique, e.g. "clearer", "boost", "support"
├── name: string          ← display name, e.g. "Clearer App"
├── type: string          ← "app" | "support" | "custom"
├── description?: string  ← optional description
├── createdAt: DateTime
└── updatedAt: DateTime

ServiceUsage (NEW - Account uses Service)
├── id: UUID
├── accountId: FK → Account
├── serviceId: FK → Service
├── createdAt: DateTime
├── updatedAt: DateTime
└── unique constraint: (accountId, serviceId)

ServiceUsageStore (NEW - which Stores use the service)
├── id: UUID
├── serviceUsageId: FK → ServiceUsage
├── storeId: FK → Store
├── createdAt: DateTime
└── unique constraint: (serviceUsageId, storeId)

Store (UPDATED)
├── id: UUID
├── organisationId: FK → Organisation  ← NEW (belongs to org directly)
├── shopDomain: string                 ← unique
├── shopName?: string
├── platform: 'shopify'
├── createdAt: DateTime
└── updatedAt: DateTime

StoreAccountLink (DEPRECATED)
└── To be removed in future migration
```

**Seed Data (Service table):**

| code | name | type | description |
|------|------|------|-------------|
| clearer | Clearer App | app | AI-powered analytics platform |
| boost | Boost App | app | Product filter & search app |
| support | Support Package | support | Premium customer support |
| custom-theme | Theme Customization | custom | Custom theme development |

**API Response (Updated):**

```json
{
  "organisation": { "id": "...", "organisationName": "..." },
  "account": { "id": "...", "accountName": "Default" },
  "store": { "id": "...", "shopDomain": "...", "organisationId": "..." },
  "serviceUsage": {
    "id": "...",
    "accountId": "...",
    "serviceId": "...",
    "service": { "code": "clearer", "name": "Clearer App", "type": "app" },
    "stores": [{ "id": "...", "shopDomain": "..." }]
  },
  "created": true
}
```

---

## Acceptance Criteria

- [ ] AC1: `Service` model exists with fields: id, code, name, type, description
- [ ] AC2: `ServiceUsage` model exists with unique constraint on (accountId, serviceId)
- [ ] AC3: `ServiceUsageStore` model exists with unique constraint on (serviceUsageId, storeId)
- [ ] AC4: `Store` model has `organisationId` FK
- [ ] AC5: Seed script creates 4 services: clearer, boost, support, custom-theme
- [ ] AC6: `db:seed` command runs successfully and is idempotent
- [ ] AC7: Provisioning creates ServiceUsage for "clearer" service
- [ ] AC8: Provisioning creates ServiceUsageStore linking Store to ServiceUsage
- [ ] AC9: API response includes `serviceUsage` with service details
- [ ] AC10: README documents seed requirement for deployments

---

## Edge Cases

- **Service 'clearer' not found**: Error 500 - seed required before provisioning
- **ServiceUsage already exists for account+service**: Return existing, skip creation
- **ServiceUsageStore already exists**: Return existing, skip creation
- **Store already exists for different org**: Error - shopDomain must be unique
- **No shopDomain provided**: Skip store and service usage creation
- **Concurrent provision requests**: Database unique constraints prevent duplicates

---

## Risks & Mitigations

- **Risk:** Service table not seeded before deployment
  - **Mitigation:** Document in README, add to CI/CD pipeline, log clear error if service not found

- **Risk:** Breaking change for existing StoreAccountLink data
  - **Mitigation:** Keep StoreAccountLink for now (deprecated), migrate data in separate task

- **Risk:** Service code typo causes lookup failure
  - **Mitigation:** Use constants/enum for service codes, validate at compile time

---

## Assumptions

- Service table will be seeded before any provisioning calls
- One service usage per account+service combination
- Store can only belong to one organisation
- "Default" account name replaces "Clearer" account name

---

## Open Questions

- Q1: Should we migrate existing StoreAccountLink data? → **Defer to separate migration task**
- Q2: Can an account have multiple stores for same service? → **Yes, via multiple ServiceUsageStore records**
- Q3: How to handle service deactivation? → **Out of scope for MVP**

---

# Tiếng Việt

## Tổng quan

**Vấn đề:**
- Spec gốc (v1) link Store trực tiếp với Account qua `StoreAccountLink`
- Feedback từ PR review: Account nên là **billing group trừu tượng**, không link trực tiếp với Store
- Cần hỗ trợ billing cho các item ngoài app usage: support packages, custom work, consulting
- Model hiện tại không thể trả lời "service nào đang được billing?" chỉ có "store nào đang link?"

**Mục tiêu:**
- Giới thiệu entity `Service` để định nghĩa **cái gì có thể billing** (apps, support, custom work, consulting)
- Theo dõi service usage qua `ServiceUsage` (quan hệ Account → Service) — *thay thế khái niệm "AppAccount"*
- Theo dõi stores nào sử dụng service qua `ServiceUsageStore` (ServiceUsage → Store)
- Store thuộc trực tiếp Organisation (không link qua Account)
- Bảng Service cần được **seed** với master data

> **Ghi chú thuật ngữ:** Chúng tôi sử dụng **"Service"** thay vì "App" để có ý nghĩa rộng hơn. Billing không chỉ dành cho việc sử dụng app (Clearer, Boost) mà còn cho các dịch vụ phát sinh khác như:
> - **Support packages** (hỗ trợ premium, SLA)
> - **Custom development** (tùy chỉnh theme, tùy chỉnh app)
> - **Consulting** (hỗ trợ setup, training)
> - **One-time services** (data migration, integration setup)
>
> Do đó, **`ServiceUsage`** thay thế cho khái niệm "AppAccount" để cung cấp sự linh hoạt này.

**Không thuộc phạm vi:**
- Thay đổi cấu trúc core của Organisation hoặc Account
- Multi-account per organisation (cải tiến tương lai)
- Cấu hình giá Service hoặc gán plan (feature riêng)

---

## User Stories

- Là **billing system**, tôi muốn theo dõi account sử dụng services nào, để có thể billing riêng cho apps, support, và custom work
- Là **system**, khi provisioning merchant, tôi muốn tạo service usage record phù hợp, để billing attribution chính xác
- Là **developer**, tôi muốn bảng Service được seed sẵn, để không cần tạo services thủ công ở mỗi environment

---

## Phạm vi

**Trong phạm vi:**
- Model `Service` mới (bảng lookup được seed)
- Model `ServiceUsage` mới (Account sử dụng Service)
- Model `ServiceUsageStore` mới (Stores nào liên kết với usage)
- Cập nhật model `Store` thuộc trực tiếp Organisation (`organisationId` FK)
- Deprecate model `StoreAccountLink`
- Tạo seed script cho bảng Service
- Cập nhật `ProvisionService` cho logic v2
- Cập nhật API response bao gồm `serviceUsage` thay vì `storeAccountLink`

**Ngoài phạm vi:**
- Cấu hình giá Service
- Quản lý billing cycle của ServiceUsage
- Migration dữ liệu StoreAccountLink hiện có
- Provisioning nhiều services trong một request

---

## UX / Luồng xử lý

### Luồng Provisioning cập nhật (v2)

1) Dashboard gọi `POST /api/internal/organisation/provision`
2) Billing validate internal API token
3) Billing kiểm tra Organisation tồn tại bằng `primaryContactEmail`
   - **Nếu không tồn tại:**
     a. Tạo Stripe Customer
     b. Tạo Organisation với `stripeCustomerId`
     c. Tạo Account với tên "Default"
4) Billing tạo/tìm Store bằng `shopDomain`:
   - Store bây giờ có `organisationId` FK (thuộc trực tiếp org)
5) Billing tạo ServiceUsage cho service "clearer":
   a. Lookup Service bằng code `'clearer'`
   b. Tìm hoặc tạo ServiceUsage (accountId + serviceId)
   c. Tạo ServiceUsageStore link Store với ServiceUsage
6) Trả về `{ organisation, account, store, serviceUsage }` cho Dashboard

---

## Dữ liệu & Hợp đồng

**Thực thể / Schema:**

```
Service (MỚI - bảng lookup được seed)
├── id: UUID
├── code: string          ← unique, vd: "clearer", "boost", "support"
├── name: string          ← tên hiển thị, vd: "Clearer App"
├── type: string          ← "app" | "support" | "custom"
├── description?: string  ← mô tả tùy chọn
├── createdAt: DateTime
└── updatedAt: DateTime

ServiceUsage (MỚI - Account sử dụng Service)
├── id: UUID
├── accountId: FK → Account
├── serviceId: FK → Service
├── createdAt: DateTime
├── updatedAt: DateTime
└── unique constraint: (accountId, serviceId)

ServiceUsageStore (MỚI - Stores nào sử dụng service)
├── id: UUID
├── serviceUsageId: FK → ServiceUsage
├── storeId: FK → Store
├── createdAt: DateTime
└── unique constraint: (serviceUsageId, storeId)

Store (CẬP NHẬT)
├── id: UUID
├── organisationId: FK → Organisation  ← MỚI (thuộc trực tiếp org)
├── shopDomain: string                 ← unique
├── shopName?: string
├── platform: 'shopify'
├── createdAt: DateTime
└── updatedAt: DateTime
```

**Seed Data (bảng Service):**

| code | name | type | description |
|------|------|------|-------------|
| clearer | Clearer App | app | Nền tảng analytics AI |
| boost | Boost App | app | App filter & search sản phẩm |
| support | Support Package | support | Hỗ trợ khách hàng premium |
| custom-theme | Theme Customization | custom | Phát triển theme tùy chỉnh |

---

## Tiêu chí nghiệm thu

- [ ] AC1: Model `Service` tồn tại với các fields: id, code, name, type, description
- [ ] AC2: Model `ServiceUsage` tồn tại với unique constraint trên (accountId, serviceId)
- [ ] AC3: Model `ServiceUsageStore` tồn tại với unique constraint trên (serviceUsageId, storeId)
- [ ] AC4: Model `Store` có `organisationId` FK
- [ ] AC5: Seed script tạo 4 services: clearer, boost, support, custom-theme
- [ ] AC6: Command `db:seed` chạy thành công và idempotent
- [ ] AC7: Provisioning tạo ServiceUsage cho service "clearer"
- [ ] AC8: Provisioning tạo ServiceUsageStore link Store với ServiceUsage
- [ ] AC9: API response bao gồm `serviceUsage` với chi tiết service
- [ ] AC10: README document yêu cầu seed cho deployments

---

## Trường hợp biên

- **Service 'clearer' không tìm thấy**: Error 500 - cần seed trước provisioning
- **ServiceUsage đã tồn tại cho account+service**: Trả về existing, bỏ qua creation
- **ServiceUsageStore đã tồn tại**: Trả về existing, bỏ qua creation
- **Store đã tồn tại cho org khác**: Error - shopDomain phải unique
- **Không có shopDomain**: Bỏ qua store và service usage creation
- **Concurrent provision requests**: Database unique constraints ngăn duplicates

---

## Rủi ro & Giảm thiểu

- **Rủi ro:** Bảng Service chưa seed trước deployment
  - **Giảm thiểu:** Document trong README, thêm vào CI/CD pipeline, log error rõ ràng nếu service không tìm thấy

- **Rủi ro:** Breaking change cho dữ liệu StoreAccountLink hiện có
  - **Giảm thiểu:** Giữ StoreAccountLink (deprecated), migrate data trong task riêng

- **Rủi ro:** Typo service code gây lookup failure
  - **Giảm thiểu:** Dùng constants/enum cho service codes, validate tại compile time

---

## Giả định

- Bảng Service sẽ được seed trước bất kỳ provisioning calls nào
- Một service usage per account+service combination
- Store chỉ có thể thuộc một organisation
- Tên account "Default" thay thế tên account "Clearer"

---

## Câu hỏi mở

- Q2: Account có thể có nhiều stores cho cùng service? → **Có, qua nhiều ServiceUsageStore records**
- Q3: Xử lý deactivation service như thế nào? → **Ngoài phạm vi MVP**
