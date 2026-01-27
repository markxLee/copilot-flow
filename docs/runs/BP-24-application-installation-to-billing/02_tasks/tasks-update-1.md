# Task Plan — BP-24 Spec Update 1: Service-Based Billing Model (v2)

---

# English

## Goal
- Implement v2 billing model with Service, ServiceUsage, ServiceUsageStore
- Update Store to belong directly to Organisation
- Create seed script for Service table
- Update ProvisionService for v2 logic

---

## Task List (Ordered)

### Task 1 — Add Prisma Schema Models

- **Files:**
  - Modify:
    - `packages/billing-database/prisma/schema.prisma`
- **Implementation:**
  - Function/Class:
    - `Service` model
    - `ServiceUsage` model
    - `ServiceUsageStore` model
    - Update `Store` model (add `organisationId`)
  - Purpose:
    - Define database schema for v2 billing model
  - Inputs:
    - N/A (schema definition)
  - Outputs:
    - Updated Prisma schema with 3 new models + Store FK
- **Done Criteria:**
  - [ ] `Service` model has: id, code (unique), name, type, description, timestamps
  - [ ] `ServiceUsage` model has: id, accountId, serviceId, timestamps, unique(accountId, serviceId)
  - [ ] `ServiceUsageStore` model has: id, serviceUsageId, storeId, timestamps, unique(serviceUsageId, storeId)
  - [ ] `Store` model has `organisationId` FK with relation to Organisation
  - [ ] Schema compiles without errors
- **Notes:**
  - Keep `StoreAccountLink` for now (deprecated, remove later)
  - Add proper indexes for lookups

---

### Task 2 — Generate Prisma Migration

- **Files:**
  - Create:
    - `packages/billing-database/prisma/migrations/<timestamp>_add_service_models/migration.sql`
- **Implementation:**
  - Function/Class:
    - Prisma migration
  - Purpose:
    - Apply schema changes to database
  - Inputs:
    - Updated schema.prisma
  - Outputs:
    - Migration SQL file
- **Done Criteria:**
  - [ ] Migration created successfully
  - [ ] Migration applies without errors on fresh DB
  - [ ] Prisma Client regenerated
- **Notes:**
  - Run: `pnpm --filter @clearer/billing-database db:migrate --name add_service_models`

---

### Task 3 — Update Seed Script for Service Table

- **Files:**
  - Modify:
    - `packages/billing-database/prisma/seed/services.ts`
- **Implementation:**
  - Function/Class:
    - `seedServices()` function
  - Purpose:
    - Ensure seed script uses correct Prisma model names from generated client
  - Inputs:
    - Service seed data array
  - Outputs:
    - 4 Service records in database
- **Done Criteria:**
  - [ ] Seed script imports from correct generated client path
  - [ ] `pnpm --filter @clearer/billing-database db:seed` runs successfully
  - [ ] 4 services created: clearer, boost, support, custom-theme
  - [ ] Seed is idempotent (running twice doesn't fail)
- **Notes:**
  - Verify Prisma model name matches schema (Service vs service)

---

### Task 4 — Create ServiceRepository

- **Files:**
  - Create:
    - `apps/billing/lib/repository/prisma/service.repository.ts`
- **Implementation:**
  - Function/Class:
    - `ServiceRepository` class
    - `findByCode(code: string): Promise<Service | null>`
  - Purpose:
    - Data access layer for Service lookups
  - Inputs:
    - `code`: string (e.g., "clearer")
  - Outputs:
    - `Service` entity or null
- **Done Criteria:**
  - [ ] Repository follows existing pattern (e.g., StoreRepository)
  - [ ] Uses `tryCatch` for error handling
  - [ ] Exports from repository index
- **Notes:**
  - Simple read-only repository for now

---

### Task 5 — Create ServiceUsageRepository

- **Files:**
  - Create:
    - `apps/billing/lib/repository/prisma/service-usage.repository.ts`
- **Implementation:**
  - Function/Class:
    - `ServiceUsageRepository` class
    - `findOrCreate(accountId, serviceId): Promise<ServiceUsage>`
    - `addStore(serviceUsageId, storeId): Promise<ServiceUsageStore>`
  - Purpose:
    - Data access layer for ServiceUsage and ServiceUsageStore
  - Inputs:
    - `accountId`, `serviceId`, `storeId`
  - Outputs:
    - `ServiceUsage`, `ServiceUsageStore` entities
- **Done Criteria:**
  - [ ] `findOrCreate` is idempotent (unique constraint handled)
  - [ ] `addStore` is idempotent (unique constraint handled)
  - [ ] Uses `tryCatch` for error handling
  - [ ] Exports from repository index
- **Notes:**
  - Handle Prisma unique constraint errors gracefully

---

### Task 6 — Update StoreRepository for v2

- **Files:**
  - Modify:
    - `apps/billing/lib/repository/prisma/store.repository.ts`
- **Implementation:**
  - Function/Class:
    - Update `findOrCreate(shopDomain, organisationId): Promise<Store>`
  - Purpose:
    - Store now requires organisationId when creating
  - Inputs:
    - `shopDomain`: string
    - `organisationId`: string (NEW)
  - Outputs:
    - `Store` entity with organisationId
- **Done Criteria:**
  - [ ] `findOrCreate` accepts organisationId parameter
  - [ ] Creates Store with organisationId FK
  - [ ] Existing tests updated
- **Notes:**
  - Breaking change: all callers must pass organisationId

---

### Task 7 — Update ProvisionService for v2 Model

- **Files:**
  - Modify:
    - `apps/billing/services/provision.service.ts`
- **Implementation:**
  - Function/Class:
    - Update `provisionOrganisation()` method
  - Purpose:
    - Replace StoreAccountLink logic with ServiceUsage logic
  - Inputs:
    - `{ email, name, phone, domain, shopDomain }`
  - Outputs:
    - `{ organisation, account, store, serviceUsage, created }`
- **Done Criteria:**
  - [ ] Looks up Service by code 'clearer'
  - [ ] Creates ServiceUsage (account + service)
  - [ ] Creates ServiceUsageStore (serviceUsage + store)
  - [ ] Returns serviceUsage instead of storeAccountLink
  - [ ] Handles missing Service with clear error
- **Notes:**
  - Remove or comment out StoreAccountLink creation
  - Log error if 'clearer' service not found

---

### Task 8 — Update Provision API Response Schema

- **Files:**
  - Modify:
    - `apps/billing/app/api/internal/organisation/provision/schema.ts`
- **Implementation:**
  - Function/Class:
    - Update Zod response schema
  - Purpose:
    - Response includes serviceUsage instead of storeAccountLink
  - Inputs:
    - N/A (schema definition)
  - Outputs:
    - Updated Zod schema
- **Done Criteria:**
  - [ ] Response schema includes `serviceUsage` field
  - [ ] `serviceUsage` includes `service` nested object
  - [ ] `serviceUsage` includes `stores` array
  - [ ] Remove `storeAccountLink` from schema
- **Notes:**
  - Keep backward compatibility notes in comments

---

### Task 9 — Update Unit Tests

- **Files:**
  - Modify:
    - `apps/billing/services/__tests__/provision.service.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/store.repository.test.ts`
  - Create:
    - `apps/billing/lib/repository/prisma/__tests__/service.repository.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/service-usage.repository.test.ts`
- **Implementation:**
  - Function/Class:
    - Test cases for new repositories
    - Updated test cases for ProvisionService
  - Purpose:
    - Ensure v2 model logic is tested
  - Inputs:
    - Mock data
  - Outputs:
    - Passing test suite
- **Done Criteria:**
  - [ ] ServiceRepository tests pass
  - [ ] ServiceUsageRepository tests pass
  - [ ] StoreRepository tests updated for organisationId
  - [ ] ProvisionService tests use v2 model
  - [ ] All tests pass: `pnpm --filter billing test`
- **Notes:**
  - Mock Prisma client for unit tests

---

### Task 10 — Verify End-to-End Flow

- **Files:**
  - Modify:
    - N/A (manual verification)
- **Implementation:**
  - Function/Class:
    - N/A
  - Purpose:
    - Verify complete provisioning flow works
  - Inputs:
    - Test API request to provision endpoint
  - Outputs:
    - Successful response with serviceUsage
- **Done Criteria:**
  - [ ] Seed database: `pnpm --filter @clearer/billing-database db:seed`
  - [ ] Call provision API with test data
  - [ ] Response includes organisation, account, store, serviceUsage
  - [ ] Database records created correctly
  - [ ] Idempotent: second call returns existing records
- **Notes:**
  - Use Prisma Studio to verify records: `pnpm --filter @clearer/billing-database db:studio`

---

## Summary

| Task | Description | AC Coverage |
|------|-------------|-------------|
| 1 | Add Prisma Schema Models | AC1, AC2, AC3, AC4 |
| 2 | Generate Prisma Migration | AC1, AC2, AC3, AC4 |
| 3 | Update Seed Script | AC5, AC6 |
| 4 | Create ServiceRepository | AC7 |
| 5 | Create ServiceUsageRepository | AC7, AC8 |
| 6 | Update StoreRepository | AC4 |
| 7 | Update ProvisionService | AC7, AC8, AC9 |
| 8 | Update Response Schema | AC9 |
| 9 | Update Unit Tests | All |
| 10 | Verify E2E Flow | AC10 |

---

# Tiếng Việt

## Mục tiêu
- Implement v2 billing model với Service, ServiceUsage, ServiceUsageStore
- Cập nhật Store thuộc trực tiếp Organisation
- Tạo seed script cho bảng Service
- Cập nhật ProvisionService cho logic v2

---

## Danh sách Task (Theo thứ tự)

### Task 1 — Thêm Prisma Schema Models

- **Files:**
  - Sửa:
    - `packages/billing-database/prisma/schema.prisma`
- **Triển khai:**
  - Function/Class:
    - Model `Service`
    - Model `ServiceUsage`
    - Model `ServiceUsageStore`
    - Cập nhật model `Store` (thêm `organisationId`)
  - Mục đích:
    - Định nghĩa database schema cho v2 billing model
  - Input:
    - N/A (định nghĩa schema)
  - Output:
    - Prisma schema cập nhật với 3 models mới + Store FK
- **Tiêu chí hoàn thành:**
  - [ ] Model `Service` có: id, code (unique), name, type, description, timestamps
  - [ ] Model `ServiceUsage` có: id, accountId, serviceId, timestamps, unique(accountId, serviceId)
  - [ ] Model `ServiceUsageStore` có: id, serviceUsageId, storeId, timestamps, unique(serviceUsageId, storeId)
  - [ ] Model `Store` có `organisationId` FK với relation đến Organisation
  - [ ] Schema compile không lỗi
- **Ghi chú:**
  - Giữ `StoreAccountLink` (deprecated, xóa sau)
  - Thêm indexes phù hợp cho lookups

---

### Task 2 — Generate Prisma Migration

- **Files:**
  - Tạo mới:
    - `packages/billing-database/prisma/migrations/<timestamp>_add_service_models/migration.sql`
- **Triển khai:**
  - Function/Class:
    - Prisma migration
  - Mục đích:
    - Apply schema changes vào database
  - Input:
    - schema.prisma đã cập nhật
  - Output:
    - File SQL migration
- **Tiêu chí hoàn thành:**
  - [ ] Migration tạo thành công
  - [ ] Migration apply không lỗi trên DB fresh
  - [ ] Prisma Client regenerated
- **Ghi chú:**
  - Chạy: `pnpm --filter @clearer/billing-database db:migrate --name add_service_models`

---

### Task 3 — Cập nhật Seed Script cho Service Table

- **Files:**
  - Sửa:
    - `packages/billing-database/prisma/seed/services.ts`
- **Triển khai:**
  - Function/Class:
    - Function `seedServices()`
  - Mục đích:
    - Đảm bảo seed script sử dụng đúng Prisma model names từ generated client
  - Input:
    - Mảng dữ liệu seed Service
  - Output:
    - 4 Service records trong database
- **Tiêu chí hoàn thành:**
  - [ ] Seed script import từ đúng generated client path
  - [ ] `pnpm --filter @clearer/billing-database db:seed` chạy thành công
  - [ ] 4 services được tạo: clearer, boost, support, custom-theme
  - [ ] Seed idempotent (chạy 2 lần không fail)
- **Ghi chú:**
  - Verify Prisma model name match với schema

---

### Task 4 — Tạo ServiceRepository

- **Files:**
  - Tạo mới:
    - `apps/billing/lib/repository/prisma/service.repository.ts`
- **Triển khai:**
  - Function/Class:
    - Class `ServiceRepository`
    - `findByCode(code: string): Promise<Service | null>`
  - Mục đích:
    - Data access layer cho Service lookups
  - Input:
    - `code`: string (vd: "clearer")
  - Output:
    - Entity `Service` hoặc null
- **Tiêu chí hoàn thành:**
  - [ ] Repository theo pattern hiện có (vd: StoreRepository)
  - [ ] Sử dụng `tryCatch` cho error handling
  - [ ] Export từ repository index
- **Ghi chú:**
  - Repository read-only đơn giản cho bây giờ

---

### Task 5 — Tạo ServiceUsageRepository

- **Files:**
  - Tạo mới:
    - `apps/billing/lib/repository/prisma/service-usage.repository.ts`
- **Triển khai:**
  - Function/Class:
    - Class `ServiceUsageRepository`
    - `findOrCreate(accountId, serviceId): Promise<ServiceUsage>`
    - `addStore(serviceUsageId, storeId): Promise<ServiceUsageStore>`
  - Mục đích:
    - Data access layer cho ServiceUsage và ServiceUsageStore
  - Input:
    - `accountId`, `serviceId`, `storeId`
  - Output:
    - Entities `ServiceUsage`, `ServiceUsageStore`
- **Tiêu chí hoàn thành:**
  - [ ] `findOrCreate` idempotent (xử lý unique constraint)
  - [ ] `addStore` idempotent (xử lý unique constraint)
  - [ ] Sử dụng `tryCatch` cho error handling
  - [ ] Export từ repository index
- **Ghi chú:**
  - Xử lý Prisma unique constraint errors gracefully

---

### Task 6 — Cập nhật StoreRepository cho v2

- **Files:**
  - Sửa:
    - `apps/billing/lib/repository/prisma/store.repository.ts`
- **Triển khai:**
  - Function/Class:
    - Cập nhật `findOrCreate(shopDomain, organisationId): Promise<Store>`
  - Mục đích:
    - Store bây giờ cần organisationId khi tạo
  - Input:
    - `shopDomain`: string
    - `organisationId`: string (MỚI)
  - Output:
    - Entity `Store` với organisationId
- **Tiêu chí hoàn thành:**
  - [ ] `findOrCreate` nhận tham số organisationId
  - [ ] Tạo Store với organisationId FK
  - [ ] Tests hiện có được cập nhật
- **Ghi chú:**
  - Breaking change: tất cả callers phải truyền organisationId

---

### Task 7 — Cập nhật ProvisionService cho v2 Model

- **Files:**
  - Sửa:
    - `apps/billing/services/provision.service.ts`
- **Triển khai:**
  - Function/Class:
    - Cập nhật method `provisionOrganisation()`
  - Mục đích:
    - Thay thế logic StoreAccountLink bằng logic ServiceUsage
  - Input:
    - `{ email, name, phone, domain, shopDomain }`
  - Output:
    - `{ organisation, account, store, serviceUsage, created }`
- **Tiêu chí hoàn thành:**
  - [ ] Lookup Service bằng code 'clearer'
  - [ ] Tạo ServiceUsage (account + service)
  - [ ] Tạo ServiceUsageStore (serviceUsage + store)
  - [ ] Trả về serviceUsage thay vì storeAccountLink
  - [ ] Xử lý trường hợp không tìm thấy Service với error rõ ràng
- **Ghi chú:**
  - Xóa hoặc comment out việc tạo StoreAccountLink
  - Log error nếu không tìm thấy service 'clearer'

---

### Task 8 — Cập nhật Provision API Response Schema

- **Files:**
  - Sửa:
    - `apps/billing/app/api/internal/organisation/provision/schema.ts`
- **Triển khai:**
  - Function/Class:
    - Cập nhật Zod response schema
  - Mục đích:
    - Response bao gồm serviceUsage thay vì storeAccountLink
  - Input:
    - N/A (định nghĩa schema)
  - Output:
    - Zod schema cập nhật
- **Tiêu chí hoàn thành:**
  - [ ] Response schema bao gồm field `serviceUsage`
  - [ ] `serviceUsage` bao gồm object `service` nested
  - [ ] `serviceUsage` bao gồm array `stores`
  - [ ] Xóa `storeAccountLink` khỏi schema
- **Ghi chú:**
  - Giữ backward compatibility notes trong comments

---

### Task 9 — Cập nhật Unit Tests

- **Files:**
  - Sửa:
    - `apps/billing/services/__tests__/provision.service.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/store.repository.test.ts`
  - Tạo mới:
    - `apps/billing/lib/repository/prisma/__tests__/service.repository.test.ts`
    - `apps/billing/lib/repository/prisma/__tests__/service-usage.repository.test.ts`
- **Triển khai:**
  - Function/Class:
    - Test cases cho repositories mới
    - Test cases cập nhật cho ProvisionService
  - Mục đích:
    - Đảm bảo logic v2 model được test
  - Input:
    - Mock data
  - Output:
    - Test suite pass
- **Tiêu chí hoàn thành:**
  - [ ] ServiceRepository tests pass
  - [ ] ServiceUsageRepository tests pass
  - [ ] StoreRepository tests cập nhật cho organisationId
  - [ ] ProvisionService tests sử dụng v2 model
  - [ ] Tất cả tests pass: `pnpm --filter billing test`
- **Ghi chú:**
  - Mock Prisma client cho unit tests

---

### Task 10 — Xác minh End-to-End Flow

- **Files:**
  - Sửa:
    - N/A (xác minh thủ công)
- **Triển khai:**
  - Function/Class:
    - N/A
  - Mục đích:
    - Verify complete provisioning flow hoạt động
  - Input:
    - Test API request đến provision endpoint
  - Output:
    - Response thành công với serviceUsage
- **Tiêu chí hoàn thành:**
  - [ ] Seed database: `pnpm --filter @clearer/billing-database db:seed`
  - [ ] Gọi provision API với test data
  - [ ] Response bao gồm organisation, account, store, serviceUsage
  - [ ] Database records được tạo đúng
  - [ ] Idempotent: gọi lần 2 trả về existing records
- **Ghi chú:**
  - Dùng Prisma Studio để verify records: `pnpm --filter @clearer/billing-database db:studio`

---

## Tổng kết

| Task | Mô tả | AC Coverage |
|------|-------|-------------|
| 1 | Thêm Prisma Schema Models | AC1, AC2, AC3, AC4 |
| 2 | Generate Prisma Migration | AC1, AC2, AC3, AC4 |
| 3 | Cập nhật Seed Script | AC5, AC6 |
| 4 | Tạo ServiceRepository | AC7 |
| 5 | Tạo ServiceUsageRepository | AC7, AC8 |
| 6 | Cập nhật StoreRepository | AC4 |
| 7 | Cập nhật ProvisionService | AC7, AC8, AC9 |
| 8 | Cập nhật Response Schema | AC9 |
| 9 | Cập nhật Unit Tests | All |
| 10 | Xác minh E2E Flow | AC10 |
