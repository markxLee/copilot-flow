# Phase 4: Testing — BP-32 Add Payment Details

## Overview

| Field | Value |
|-------|-------|
| Branch | bp-32-add-payment-detail |
| Target Root | apphub-vision |
| Test Framework | Jest |
| Coverage Target | ≥70% |

---

## Test Batch 1 — Payment Methods API Routes

| Field | Value |
|-------|-------|
| Written | 2026-01-26 |
| Type | Unit (API Routes) |
| Root | apphub-vision |
| Status | ⏳ Awaiting execution |

### Tests Written

| File | Tests | Coverage Target |
|------|-------|-----------------|
| `__tests__/app/api/payment-methods/[id]/route.test.ts` | 12 tests | DELETE endpoint |
| `__tests__/app/api/payment-methods/default/route.test.ts` | 11 tests | POST set default |
| `__tests__/app/api/payment-methods/setup/route.test.ts` | 10 tests | POST setup intent |

### Test Cases

#### DELETE /api/payment-methods/[id]
- ✅ Validation: missing ID, invalid ID format
- ✅ Authentication: invalid session, missing email
- ✅ Organisation: not found, query error, no Stripe customer, pending customer
- ✅ Ownership: PM not found, PM belongs to different customer
- ✅ Success: PM detached, Stripe error handling

#### POST /api/payment-methods/default
- ✅ Authentication: invalid session, missing email
- ✅ Validation: missing paymentMethodId, invalid JSON
- ✅ Organisation: not found, query error, no Stripe customer, pending customer
- ✅ Success: default set, Stripe error handling

#### POST /api/payment-methods/setup
- ✅ Authentication: invalid session, missing email
- ✅ Organisation: not found, query error, no Stripe customer, pending customer
- ✅ Success: clientSecret returned, Stripe error, no client_secret error

### Coverage Target

| File | Target | Actual |
|------|--------|--------|
| `api/payment-methods/[id]/route.ts` | 80%+ | TBD |
| `api/payment-methods/default/route.ts` | 80%+ | TBD |
| `api/payment-methods/setup/route.ts` | 80%+ | TBD |

---

## Existing Tests (Already Passing)

| File | Coverage | Status |
|------|----------|--------|
| `api/billing-address/route.ts` | 92.5% | ✅ |
| `api/payment-methods/route.ts` | 100% | ✅ |
| `api/session/route.ts` | Has tests | ✅ |

---

## Notes

- React components (payment-details/page.tsx, modals) are exempt from coverage requirements
- All API routes follow the same mock pattern for consistency
- Tests verify authentication, authorization, validation, and error handling
