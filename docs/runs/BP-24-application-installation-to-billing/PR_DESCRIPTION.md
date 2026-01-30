# BP-24: Billing App Installation Synchronization

- Jra ticket: https://clearerio.atlassian.net/browse/BP-24

## 📋 Summary

Implements automatic billing provisioning when a merchant completes onboarding, creating Organisation, Account, Store records in Billing database with Stripe Customer integration.

---

## 🔴 Problem

When a merchant installs the Shopify app:
- **No billing records exist** - Organisation and Account must exist before merchants can be charged
- **Manual intervention required** - DevOps had to manually create billing records
- **No Store tracking** - No way to link Shopify stores to billing accounts
- **Delayed billing setup** - Merchants couldn't subscribe to plans immediately

---

## 🔄 Solution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PROVISIONING FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Merchant   │───▶│  Dashboard   │───▶│   Billing    │                   │
│  │  Onboarding  │    │  get-started │    │   API        │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│         │                   │                   │                           │
│         ▼                   ▼                   ▼                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐   │
│  │ Fill profile │    │ POST         │    │     ProvisionService         │   │
│  │ email, name  │───▶│ /api/internal│───▶│                              │   │
│  │ phone, domain│    │ /provision   │    │  1. Create Stripe Customer   │   │
│  └──────────────┘    │ (async)      │    │  2. Create Organisation      │   │
│                      └──────────────┘    │  3. Create Account           │   │
│                                          │  4. Find/Create Store*       │   │
│                                          │  5. Lookup Service**         │   │
│                                          │  6. Create ServiceAccountStore│  │
│                                          │  7. Update Stripe metadata   │   │
│                                          └──────────────────────────────┘   │
│                                                                             │
│  * Store only created if storeDomain provided                               │
│  ** Service looked up by code ('clearer') - must be seeded first            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Two Integration Points:**

| Trigger | Location | Purpose |
|---------|----------|---------|
| `registerCompany()` | `/get-started` actions | New merchant completes profile |
| `getStartedProgress()` | `/get-started` actions | Fallback for existing merchants |

---

## ✅ Solution Details

### 1. Billing App - New API Endpoint
```
POST /api/internal/provision
├── Auth: Internal API token (bil_* prefix, from BP-25)
├── Request: { email, name, phone?, domain?, storeDomain? }
└── Response: { organisation, account, service, store?, serviceAccountStore?, accountId, created }
```

### 2. Database Models

**Store** - Shopify store with direct Organisation link:
```prisma
model Store {
  id             String   @id @default(uuid())
  organisationId String?  @map("organisation_id")  // Direct link to Organisation
  domain         String   @unique                   // e.g., "mystore.myshopify.com"
  name           String?
  platform       String   @default("shopify")
  
  organisation         Organisation?         @relation(...)
  serviceAccountStores ServiceAccountStore[]
}
```

**Service** - Master lookup table for billable services (must be seeded):
```prisma
model Service {
  id          String      @id @default(uuid())
  code        String      @unique  // e.g., "clearer", "boost"
  name        String                // Display name
  type        ServiceType           // app, support, custom
  
  serviceAccounts ServiceAccountStore[]
  pricePlans      PricePlan[]
  entitlements    Entitlement[]
  usageMeters     UsageMeter[]
}
```

**ServiceAccountStore** - Links Account + Service + Store (consolidated model):
```prisma
model ServiceAccountStore {
  id        String   @id @default(uuid())
  accountId String
  serviceId String
  storeId   String
  linkedAt  DateTime @default(now())
  isActive  Boolean  @default(true)
  
  @@unique([accountId, serviceId, storeId])
}
```

### 3. Key Constraints
- **Store → Organisation**: Store has direct `organisationId` FK (nullable for migration)
- **Service-Based Model**: `Service` replaces `Product` as the billing entity
- **ServiceAccountStore**: Consolidates old ServiceUsage + ServiceUsageStore (2 tables → 1)
- **Unique Triple**: One ServiceAccountStore per (account, service, store) combination
- **Idempotent**: Safe to call multiple times (returns existing records)
- **Non-blocking**: Failures logged but don't break user flow

### 4. Files Changed

| Area | Files | Purpose |
|------|-------|---------|
| **API** | `route.ts`, `schema.ts` | Provision endpoint + Zod validation |
| **Service** | `provision.service.ts` | Orchestration logic |
| **Repository** | `store.repository.ts`, `service.repository.ts`, `service-account-store.repository.ts` | Store/Service/Link CRUD |
| **Mapper** | `service.mapper.ts` | Service → Response mapping |
| **Dashboard** | `provision.ts`, `actions.ts` | Helper + Integration |
| **Database** | `schema.prisma`, `migration.sql` | Store, Service, ServiceAccountStore tables |

---

## 🧪 Test Coverage

### Coverage Results
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| **Statements** | 100% | 70% | ✅ PASS |
| **Branches** | 97.72% | 70% | ✅ PASS |
| **Functions** | 100% | 70% | ✅ PASS |
| **Lines** | 100% | 70% | ✅ PASS |

### Test Breakdown
| File | Tests | Coverage |
|------|-------|----------|
| `provision.service.test.ts` | 80+ | 100% stmt, 97.72% branch |
| `service-account-store.repository.test.ts` | 19 | 100% all metrics |
| `service.mapper.test.ts` | 12 | 100% all metrics |
| `route.test.ts` | 12 | 100% all metrics |
| **Total** | **347** (22 suites) | - |

### Key Test Scenarios
- ✅ v2 Flow: Org → Account → Store → Stripe → Update Org
- ✅ Idempotent: Return existing for duplicate email
- ✅ Store linking: Create, update, handle failures
- ✅ Error handling: Stripe/DB failures gracefully handled
- ✅ Auth: Internal token validation (401 for invalid/user tokens)
- ✅ Validation: Zod schema errors (400 for invalid body)

---

## 📝 Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC1 | `POST /api/internal/provision` endpoint exists | ✅ |
| AC2 | Endpoint validates internal API token (BP-25) | ✅ |
| AC3 | Creates Stripe Customer + Organisation + Account if new | ✅ |
| AC4 | Creates Account if missing for existing Organisation | ✅ |
| AC5 | Returns existing records with `created: false` | ✅ |
| AC6 | Store record created/found by storeDomain | ✅ |
| AC7 | ServiceAccountStore created for Account+Service+Store | ✅ |
| AC8 | Link updated if Store linked to different Account | ✅ |
| AC9 | Dashboard calls provision on onboarding complete | ✅ |
| AC10 | Failures logged but don't block user flow | ✅ |
| AC11 | Response includes full structure | ✅ |
| AC12 | Fallback provisioning for existing merchants | ✅ |

---

## 🔗 Related

- **Depends on**: BP-25 (Internal API Auth) ✅ Merged
- **Target branch**: `feature/BP-11-main-billing-platform`
- **Documentation**: `docs/runs/bp-24-application-installation-to-billing/`

---

## 🚀 How to Test

```bash
# 1. Run migrations
cd packages/billing-database && pnpm db:push

# 2. Run tests
cd apps/billing && pnpm test

# 3. Manual test (requires BP-25 internal token)
curl -X POST http://localhost:3001/api/internal/provision \
  -H "Authorization: Bearer bil_<jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Company",
    "storeDomain": "test-store.myshopify.com"
  }'
```
---

### Recent Updates

#### Route Simplification
- Simplified provision endpoint: `/api/internal/organisation/provision` → `/api/internal/provision`
- Moved route files and updated all imports accordingly

#### Documentation Updates
- Updated terminology from "app" to "service" across technical docs
- Clarified that internal tokens identify calling services, not applications

#### TypeScript Fixes
Fixed 48 TypeScript errors across test files:
| File | Issues Fixed |
|------|-------------|
| `auth/test/routes.test.ts` | Missing `token` in Session mocks |
| `health/route.test.ts` | Request parameter for `withLogging` wrapper |
| `internal/provision/route.test.ts` | `billing_internal` type, Session import |
| `internal/test/route.test.ts` | Service name capitalization, Session token |
| `dual-auth.test.ts` | Service names, type casts, Session tokens |
| `session-reader.test.ts` | Session tokens, type casts |

#### Health Route Fix
- Added optional `NextRequest` parameter to `healthCheckHandler` to align with `withLogging` wrapper type expectations

### Verification
- ✅ TypeScript: `npx tsc --noEmit` - 0 errors
- ✅ Tests: 265 passed, 16 suites
- ✅ Lint: Clean