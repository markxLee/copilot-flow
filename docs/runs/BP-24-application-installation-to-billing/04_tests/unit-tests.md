# Unit Test Plan — BP-24: Billing App Installation Synchronization (v2)

> **v2 Model Update**: Service-Based Billing Model
> - Removed: StoreAccountLink
> - Added: Service, ServiceUsage, ServiceUsageStore
> - Changed: Store now has direct `organisationId` FK

---

# English

## Strategy
- **What to test:**
  - **ProvisionService**: orchestration of Organisation → Account → Store (with orgId) → ServiceUsage → ServiceUsageStore → Stripe Customer → Update Org
  - **ServiceRepository**: read-only service lookup (findByCode, findById, findAll)
  - **ServiceUsageRepository**: service usage CRUD (findOrCreate, addStore, removeStore, findByAccount)
  - **StoreRepository v2**: store CRUD with organisationId (findOrCreate, updateOrganisation)
  - **Provision API endpoint**: authentication, validation, response handling
  - **Zod schema**: request validation (including shopDomain)
  - **Idempotent behavior**: existing organisation/account/service-usage handling
  - **Error handling**: Stripe failures, DB failures, Service not found, validation errors

- **What NOT to test:**
  - Direct Prisma database operations (mocked via repositories)
  - Stripe API calls (mocked via StripeCustomerRepository)
  - Prisma internals (covered by Prisma itself)
  - Dashboard helper (fire-and-forget pattern, relies on internalApi)
  - Next.js middleware (tested separately in BP-25)

- **Boundaries / assumptions:**
  - All external dependencies are mocked
  - Tests run in isolation (no real database or Stripe calls)
  - `NODE_ENV !== 'production'` for testMode
  - Service records are seeded (findByCode returns existing record)

---

## Test Cases (Mapped to Tasks)

### Task 1 — Zod schema validation
- **Unit tests to add:**
  - Schema validates required fields (email, name)
  - Schema allows optional fields (phone, domain, shopDomain)
  - Schema rejects invalid email format
- **Files:**
  - `apps/billing/__tests__/app/api/internal/organisation/provision/route.test.ts` (validation tests)
- **Mocks / Stubs:**
  - None (pure Zod validation)
- **Expected outcomes:**
  - Invalid requests return 400 with field-specific errors

### Task 2 — ProvisionService
- **Unit tests to add:**
  - **v2 Flow:** Create Organisation → Account → Store (with orgId) → ServiceUsage → ServiceUsageStore → Stripe Customer → Update Org
  - Return existing records for existing org
  - Create Account if missing for existing org
  - **Service & ServiceUsage:**
    - Find service by code ("clearer")
    - Create ServiceUsage (account → service link)
    - Link Store to ServiceUsage via ServiceUsageStore
    - Handle Service not found error
    - Handle ServiceUsage creation failure
  - **Store Creation v2:**
    - Create Store with organisationId when shopDomain provided
    - Handle Store creation for existing organisation
    - Continue if Store creation fails (non-blocking)
  - **Stripe Metadata:**
    - Include organisationId, accountId, accountName in metadata
    - Include domain when provided
    - Include shopDomain, platform, storeId when Store is created
    - Include serviceUsageId when ServiceUsage is created
  - **Error Handling:**
    - Handle Organisation creation failure
    - Handle Account creation failure (new and existing org)
    - Handle Stripe customer creation failure
    - Handle getOrganisation failure after creation
    - Handle updateStripeCustomerId failure (non-critical, logged)
    - Handle fallback errors (null data without error)
  - Use provided accountName vs default
- **Files:**
  - `apps/billing/__tests__/services/provision.service.test.ts`
- **Mocks / Stubs:**
  - `@/lib/stripe` - getStripeClient
  - `@/lib/repository/stripe` - StripeCustomerRepository
  - `@/lib/repository/prisma` - OrganisationRepository, AccountRepository, **StoreRepository, ServiceRepository, ServiceUsageRepository**
- **Expected outcomes:**
  - All orchestration paths covered
  - Service/ServiceUsage flow non-blocking (failure doesn't fail provision)
  - Error handling with proper logging

### Task 2a — ServiceRepository
- **Unit tests to add:**
  - `findByCode`: return service when found
  - `findByCode`: return null when not found
  - `findByCode`: handle database error
  - `findById`: return service when found
  - `findById`: return null when not found
  - `findById`: handle database error
  - `findAll`: return all services ordered by name
  - `findAll`: return empty array when no services
  - `findAll`: handle database error
- **Files:**
  - `apps/billing/__tests__/lib/repository/prisma/service.repository.test.ts`
- **Mocks / Stubs:**
  - `@clearer/billing-database` - prisma client
- **Expected outcomes:**
  - All CRUD operations covered
  - Error handling verified

### Task 2b — ServiceUsageRepository
- **Unit tests to add:**
  - `findOrCreate`: create new ServiceUsage when not exists
  - `findOrCreate`: return existing ServiceUsage when exists (idempotent)
  - `findOrCreate`: handle database error
  - `findByAccountAndService`: return ServiceUsage when found
  - `findByAccountAndService`: return null when not found
  - `findByAccountAndServiceWithStores`: return ServiceUsage with stores
  - `addStore`: create new ServiceUsageStore link
  - `addStore`: return existing link when exists (idempotent)
  - `addStore`: handle database error
  - `removeStore`: delete existing link, return true
  - `removeStore`: return false when link not found
  - `removeStore`: handle database error
  - `findByAccount`: return all ServiceUsages with stores
  - `findByAccount`: return empty array when no usages
- **Files:**
  - `apps/billing/__tests__/lib/repository/prisma/service-usage.repository.test.ts`
- **Mocks / Stubs:**
  - `@clearer/billing-database` - prisma client
- **Expected outcomes:**
  - All CRUD operations covered
  - Idempotent behavior verified
  - Error handling verified

### Task 2c — StoreRepository (v2)
- **Unit tests to add:**
  - `findByShopDomain`: return store when found
  - `findByShopDomain`: return null when not found
  - `findByShopDomain`: handle database error
  - `createStore`: create store with organisationId
  - `createStore`: handle database error
  - `findOrCreate`: create new store when not exists
  - `findOrCreate`: return existing store when exists
  - `findOrCreate`: update organisationId if existing store has none
  - `findOrCreate`: handle database error
  - `updateOrganisation`: update store's organisationId
  - `updateOrganisation`: handle database error
- **Files:**
  - `apps/billing/__tests__/lib/repository/prisma/store.repository.test.ts`
- **Mocks / Stubs:**
  - `@clearer/billing-database` - prisma client
- **Expected outcomes:**
  - All CRUD operations covered
  - organisationId handling verified
  - Error handling verified

### Task 3 — Provision API endpoint
- **Unit tests to add:**
  - Return 401 for unauthenticated requests
  - Return 401 for user session (internal only)
  - Accept internal auth token
  - Return 400 for invalid JSON body
  - Return 400 for missing required fields
  - Return 200 with data for successful provision
  - Return different message for new vs existing org
  - Return 500 on provisioning error (without exposing details)
  - Use auth.service as accountName
- **Files:**
  - `apps/billing/__tests__/app/api/internal/organisation/provision/route.test.ts`
- **Mocks / Stubs:**
  - `@/lib/auth/dual-auth` - getAuthContext, isInternalAuth
  - `@/services/provision.service` - ProvisionService
- **Expected outcomes:**
  - All HTTP status codes tested
  - Internal errors not exposed to client

### Task 4-5 — Dashboard helper & integration
- **Unit tests to add:**
  - Not covered in this phase (fire-and-forget pattern)
  - Would require mocking internalApi client
- **Files:**
  - N/A (integration tested via manual testing)
- **Notes:**
  - Dashboard helper is a thin wrapper around internalApi
  - Testing would essentially test the mock, not real behavior

---

## Coverage Summary (v2 Model)

### Target Files (v2 Components)
| File | Statements | Branches | Functions | Lines | Status |
|------|------------|----------|-----------|-------|--------|
| provision.service.ts | 100% | 97.72% | 100% | 100% | ✅ |
| schema.ts (provision) | 100% | 100% | 100% | 100% | ✅ |
| service.repository.ts | 100% | 100% | 100% | 100% | ✅ |
| service-usage.repository.ts | 100% | 100% | 100% | 100% | ✅ |
| store.repository.ts | 100% | 94.11% | 100% | 100% | ✅ |

### Overall Test Statistics
- **Test Suites**: 16 passed
- **Tests**: 265 passed
- **New Tests Added (v2)**: 41 tests
  - ServiceRepository: 9 tests
  - ServiceUsageRepository: 18 tests
  - StoreRepository: 14 tests

### Coverage Requirement
- **Minimum**: 70% on all metrics for v2 components
- **Current Status**: ✅ **PASS** - All v2 components exceed 70% threshold

### Coverage Gaps Analysis

**store.repository.ts Branch at 94.11%** - Single uncovered branch:
- Line 152: Error fallback in `findOrCreate` when `newStore` is null without error

This is a defensive fallback that would only trigger if Prisma returns `null` without throwing an error (unlikely in practice).

**Justification**: All v2 components achieve ≥94% coverage, well above the 70% requirement.

---

## Execution Log (v2)

### Previous Batches (v1 → v2 Migration)
- Batches 1-4 from v1 covered ProvisionService
- ProvisionService tests updated for v2 model in Phase 3 Task 9
- Repository tests now needed for coverage

### Batch 5 — ServiceRepository Tests
- **Command:** `pnpm --filter billing test -- __tests__/lib/repository/prisma/service.repository.test.ts`
- **Result:** ✅ **PASS** (9 tests)
- **Coverage:** 100% statements, 100% branches, 100% functions, 100% lines
- **Tests Added:**
  - `findByCode`: return service when found
  - `findByCode`: return null when not found
  - `findByCode`: handle database error
  - `findById`: return service when found
  - `findById`: return null when not found
  - `findById`: handle database error
  - `findAll`: return all services ordered by name
  - `findAll`: return empty array when no services
  - `findAll`: handle database error

### Batch 6 — ServiceUsageRepository Tests
- **Command:** `pnpm --filter billing test -- __tests__/lib/repository/prisma/service-usage.repository.test.ts`
- **Result:** ✅ **PASS** (18 tests)
- **Coverage:** 100% statements, 100% branches, 100% functions, 100% lines
- **Tests Added:**
  - `findOrCreate`: create new ServiceUsage when not exists
  - `findOrCreate`: return existing ServiceUsage when exists (idempotent)
  - `findOrCreate`: handle database error
  - `findByAccountAndService`: return ServiceUsage when found
  - `findByAccountAndService`: return null when not found
  - `findByAccountAndService`: handle database error
  - `findByAccountAndServiceWithStores`: return ServiceUsage with stores
  - `findByAccountAndServiceWithStores`: return null when not found
  - `findByAccountAndServiceWithStores`: handle database error
  - `addStore`: create new ServiceUsageStore link
  - `addStore`: return existing link when exists (idempotent)
  - `addStore`: handle database error
  - `removeStore`: delete existing link, return true
  - `removeStore`: return false when link not found
  - `removeStore`: handle database error
  - `findByAccount`: return all ServiceUsages with stores
  - `findByAccount`: return empty array when no usages
  - `findByAccount`: handle database error

### Batch 7 — StoreRepository Tests (v2)
- **Command:** `pnpm --filter billing test -- __tests__/lib/repository/prisma/store.repository.test.ts`
- **Result:** ✅ **PASS** (14 tests)
- **Coverage:** 100% statements, 94.11% branches, 100% functions, 100% lines
- **Tests Added:**
  - `findByShopDomain`: return store when found
  - `findByShopDomain`: return null when not found
  - `findByShopDomain`: handle database error
  - `createStore`: create store with organisationId
  - `createStore`: create store with default platform
  - `createStore`: handle database error
  - `findOrCreate`: create new store when not exists
  - `findOrCreate`: return existing store when exists
  - `findOrCreate`: update organisationId if existing store has none
  - `findOrCreate`: handle find error
  - `findOrCreate`: handle create error
  - `findOrCreate`: handle update organisationId error
  - `updateOrganisation`: update store's organisationId
  - `updateOrganisation`: handle database error

### Batch 8 — Full Suite Verification
- **Command:** `pnpm --filter billing test --coverage`
- **Result:** ✅ **PASS** (265 tests total)
  - 16 test suites
  - All v2 repository tests passing
  - All provision tests passing
- **Notes:**
  - Tests increased from 224 → 265 (+41 new tests)
  - All v2 components now have ≥94% coverage

---

# Tiếng Việt

## Chiến lược Test (v2)
- **Test những gì:**
  - ProvisionService: điều phối tạo Organisation → Account → Store (với orgId) → ServiceUsage → ServiceUsageStore → Stripe Customer → Update Org
  - ServiceRepository: lookup service (findByCode, findById, findAll)
  - ServiceUsageRepository: CRUD service usage (findOrCreate, addStore, removeStore)
  - StoreRepository v2: store CRUD với organisationId
  - Provision API endpoint: xác thực, validation, xử lý response
  - Zod schema: validate request (bao gồm shopDomain)
  - Hành vi idempotent: xử lý org/account/service-usage đã tồn tại
  - Xử lý lỗi: lỗi Stripe, DB, Service not found, validation

- **Không test những gì:**
  - Prisma database operations (mock qua repositories)
  - Stripe API calls (mock qua StripeCustomerRepository)
  - Dashboard helper (fire-and-forget, phụ thuộc internalApi)
  - Next.js middleware (test riêng trong BP-25)

---

## Tổng kết Coverage (v2)

| Component | Target | Actual | Status |
|-----------|--------|--------|--------|
| provision.service.ts | ≥70% | 100% | ✅ |
| service.repository.ts | ≥70% | 100% | ✅ |
| service-usage.repository.ts | ≥70% | 100% | ✅ |
| store.repository.ts | ≥70% | 100% | ✅ |

---

## Kết luận

**Phase 4 Status: ✅ COMPLETE**

- **265 tests** implemented and passing (up from 224)
  - provision.service.test.ts: 29 tests
  - route.test.ts: 12 tests
  - service.repository.test.ts: 9 tests (NEW)
  - service-usage.repository.test.ts: 18 tests (NEW)
  - store.repository.test.ts: 14 tests (NEW)
- Coverage vượt ngưỡng 70% trên tất cả v2 components
- Tất cả v2 repositories đạt **100% line coverage**
- Branch coverage: service (100%), service-usage (100%), store (94.11%)

**New Tests Added (v2 Update):**
- ✅ ServiceRepository: findByCode, findById, findAll (9 tests)
- ✅ ServiceUsageRepository: findOrCreate, addStore, removeStore, findByAccount (18 tests)
- ✅ StoreRepository: findOrCreate with orgId, updateOrganisation (14 tests)
