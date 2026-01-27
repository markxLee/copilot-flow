# Specification — BP-32 Add Payment Details Page
<!-- Template v4.0 | Inline Bilingual Format with Visual Flags -->

---

## TL;DR

| Aspect | Value |
|--------|-------|
| Feature | Add Payment Details Page |
| Status | Approved |
| Functional Requirements | 11 |
| Non-Functional Requirements | 4 |
| Affected Roots | apphub-vision |

---

## 1. Overview

🇻🇳 Spec này định nghĩa các yêu cầu chi tiết cho trang Payment Details trong Billing app. Trang cho phép users xem, thêm, và quản lý payment methods qua Stripe. Implementation được chia thành 4 phases: Layout → UI → API → Integration.

🇬🇧 This spec defines detailed requirements for the Payment Details page in the Billing app. The page allows users to view, add, and manage payment methods via Stripe. Implementation is divided into 4 phases: Layout → UI → API → Integration.

---

## 2. Implementation Phases

| Phase | Name | Requirements |
|-------|------|--------------|
| A | Layout Foundation | FR-001 |
| B | UI Components | FR-002, FR-003, FR-004, FR-005 |
| C | API Layer | FR-006, FR-007 |
| D | Stripe Integration | FR-008, FR-009, FR-010, FR-011 |

---

## 3. Requirements Matrix

| ID | Title | Priority | Phase |
|----|-------|----------|-------|
| FR-001 | Setup BillingLayout with Providers | Must | A |
| FR-002 | Create PaymentDetailsPage Route | Must | B |
| FR-003 | Migrate PaymentMethods Component | Must | B |
| FR-004 | Migrate AddPaymentModal | Must | B |
| FR-005 | Migrate BillingAddressCard | Should | B |
| FR-006 | API - Get Payment Methods | Must | C |
| FR-007 | API - Payment Method Operations | Must | C |
| FR-008 | Integrate Stripe Elements | Must | D |
| FR-009 | Connect List to Real Data | Must | D |
| FR-010 | Connect BillingAddress to Session | Should | D |
| FR-011 | Page Authentication & Error States | Must | D |

---

## 4. Functional Requirements

### FR-001: Setup BillingLayout with Providers

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | A - Layout Foundation |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Tạo BillingLayout wrapper component với sidebar và topbar để bọc tất cả các trang trong billing app. Bao gồm AppProviders để wrap SidebarProvider và TooltipProvider cho UI components.

🇬🇧 Create BillingLayout wrapper component with sidebar and topbar to wrap all pages in the billing app. Include AppProviders to wrap SidebarProvider and TooltipProvider for UI components.

#### Acceptance Criteria

- [ ] AC1: BillingLayout wrapper component created
- [ ] AC2: AppProviders wraps SidebarProvider + TooltipProvider
- [ ] AC3: BillingSidebar with menu: Your apps, Billing history, Payment details
- [ ] AC4: BillingTopBar with breadcrumb, user avatar, dropdown (org display: see FR-013)
- [ ] AC5: LayoutContent2ColScrollMain for main content area

---

### FR-002: Create PaymentDetailsPage Route

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | B - UI Components |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Tạo route trang `/payment-details` sử dụng BillingLayout wrapper. Trang bao gồm HeaderBlock với title và hai sections chính: PaymentMethods và BillingAddress.

🇬🇧 Create page route `/payment-details` using BillingLayout wrapper. Page includes HeaderBlock with title and two main sections: PaymentMethods and BillingAddress.

#### Acceptance Criteria

- [ ] AC1: Page accessible at `/payment-details`
- [ ] AC2: Uses BillingLayout wrapper
- [ ] AC3: HeaderBlock shows title "Payment details"
- [ ] AC4: Two sections: PaymentMethods and BillingAddress

---

### FR-003: Migrate PaymentMethods Component from Storybook

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | B - UI Components |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Migrate PaymentMethods component từ Storybook sang billing app. Component hiển thị danh sách cards với brand icon, masked number, và dropdown menu cho actions (Set default, Delete).

🇬🇧 Migrate PaymentMethods component from Storybook to billing app. Component displays list of cards with brand icon, masked number, and dropdown menu for actions (Set default, Delete).

#### Acceptance Criteria

- [ ] AC1: PaymentMethodsList component created
- [ ] AC2: PaymentMethodCard shows brand icon + masked number
- [ ] AC3: Default badge for default payment method
- [ ] AC4: Dropdown menu: "Set as default", "Delete"
- [ ] AC5: Card format: `**** **** **** {last4}`
- [ ] AC6: Empty state when no cards
- [ ] AC7: AlertDialogConfirm for Set Default action
- [ ] AC8: AlertDialogConfirm for Delete action

---

### FR-004: Migrate AddPaymentModal from Storybook

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | B - UI Components |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Migrate AddPaymentModal từ Storybook với placeholder cho Stripe CardElement. Modal bao gồm title, checkbox "Use as default", terms text, và Cancel/Add buttons.

🇬🇧 Migrate AddPaymentModal from Storybook with placeholder for Stripe CardElement. Modal includes title, "Use as default" checkbox, terms text, and Cancel/Add buttons.

#### Acceptance Criteria

- [ ] AC1: AddPaymentModal component created
- [ ] AC2: Modal opens/closes correctly
- [ ] AC3: Title "Add payment method"
- [ ] AC4: Placeholder div for Stripe CardElement (not integrated yet)
- [ ] AC5: "Use as default" checkbox
- [ ] AC6: Terms text with links
- [ ] AC7: Cancel and Add buttons (Add disabled until Stripe integrated)

---

### FR-005: Migrate BillingAddressCard Component from Storybook

| Aspect | Detail |
|--------|--------|
| Priority | Should |
| Phase | B - UI Components |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Migrate BillingAddressCard từ Storybook để hiển thị billing address. Edit/Add button có mặt, functionality implement trong FR-012.

🇬🇧 Migrate BillingAddressCard from Storybook to display billing address. Edit/Add button present, functionality implemented in FR-012.

#### Acceptance Criteria

- [ ] AC1: BillingAddressCard component created
- [ ] AC2: Shows name, email, phone, domain
- [ ] AC3: Edit/Add button present (functionality: see FR-012)
- [ ] AC4: Works with mock/session data

---

### FR-006: API - Get Payment Methods

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | C - API Layer |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Tạo API endpoint để lấy payment methods từ Stripe. Lấy organisation qua session email, sau đó list payment methods cho Stripe customer.

🇬🇧 Create API endpoint to fetch payment methods from Stripe. Get organisation via session email, then list payment methods for Stripe customer.

#### Acceptance Criteria

- [ ] AC1: GET `/api/payment-methods` endpoint created
- [ ] AC2: Validates session authentication
- [ ] AC3: Queries Organisation by `session.org.email`
- [ ] AC4: Calls Stripe API to list payment methods
- [ ] AC5: Returns formatted payment method list
- [ ] AC6: Error handling for auth, org not found, Stripe errors

---

### FR-007: API - Payment Method Operations

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | C - API Layer |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Tạo các API endpoints cho tạo SetupIntent, đặt default, và xóa payment methods.

🇬🇧 Create API endpoints for SetupIntent creation, setting default, and deleting payment methods.

#### Acceptance Criteria

- [ ] AC1: POST `/api/payment-methods/setup` - creates SetupIntent, returns clientSecret
- [ ] AC2: POST `/api/payment-methods/default` - sets default payment method
- [ ] AC3: DELETE `/api/payment-methods/[id]` - detaches payment method
- [ ] AC4: All endpoints validate session
- [ ] AC5: All endpoints use tryCatch for error handling

---

### FR-008: Integrate Stripe Elements in AddPaymentModal

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | D - Stripe Integration |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Thay placeholder trong AddPaymentModal bằng Stripe Elements CardElement. Implement flow SetupIntent để thêm thẻ an toàn.

🇬🇧 Replace placeholder in AddPaymentModal with Stripe Elements CardElement. Implement SetupIntent flow for secure card addition.

#### Acceptance Criteria

- [ ] AC1: Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- [ ] AC2: Elements provider wraps the modal
- [ ] AC3: CardElement renders in modal
- [ ] AC4: On submit: create SetupIntent → confirmCardSetup → refresh list
- [ ] AC5: Error messages from Stripe displayed
- [ ] AC6: Loading state during submission

---

### FR-009: Connect PaymentMethodsList to Real Data

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | D - Stripe Integration |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Thay mock data trong PaymentMethodsList bằng data thật từ API. Implement các action Set Default và Delete.

🇬🇧 Replace mock data in PaymentMethodsList with real data from API. Implement Set Default and Delete actions.

#### Acceptance Criteria

- [ ] AC1: Page fetches payment methods from API on load
- [ ] AC2: Empty state shown when no cards
- [ ] AC3: Set Default calls API and refreshes list
- [ ] AC4: Delete calls API and removes card from list
- [ ] AC5: Loading states during API calls

---

### FR-010: Connect BillingAddress to Session Data

| Aspect | Detail |
|--------|--------|
| Priority | Should |
| Phase | D - Stripe Integration |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Thay mock data trong BillingAddressCard bằng data thật từ session.org.

🇬🇧 Replace mock data in BillingAddressCard with real data from session.org.

#### Acceptance Criteria

- [ ] AC1: Displays `session.org.name`
- [ ] AC2: Displays `session.org.email`
- [ ] AC3: Displays `session.org.phone` (if available)
- [ ] AC4: Displays `session.org.domain` (if available)

---

### FR-011: Page Authentication & Error States

| Aspect | Detail |
|--------|--------|
| Priority | Must |
| Phase | D - Stripe Integration |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Thêm kiểm tra authentication và error states cho trang. Redirect hoặc hiển thị error nếu chưa authenticated hoặc không tìm thấy organisation.

🇬🇧 Add authentication check and error states to the page. Redirect or show error if not authenticated or organisation not found.

#### Acceptance Criteria

- [ ] AC1: Page checks session on load
- [ ] AC2: Redirect to login if no session
- [ ] AC3: Error state if organisation not found
- [ ] AC4: Error state if Stripe customer not configured

---

### FR-012: Add/Edit Billing Address Modal & API

| Aspect | Detail |
|--------|--------|
| Priority | Should |
| Phase | E - Extended Features |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Implement modal và API để add/edit billing address. Modal cho phép user nhập/sửa thông tin address, API lưu vào Stripe Customer.

🇬🇧 Implement modal and API for adding/editing billing address. Modal allows user to input/edit address info, API saves to Stripe Customer.

#### Acceptance Criteria

- [ ] AC1: AddBillingAddressModal component created
- [ ] AC2: Modal form with fields: name, email, phone, address line 1, line 2, city, state, postal code, country
- [ ] AC3: POST /api/billing-address endpoint creates/updates Stripe Customer address
- [ ] AC4: Edit mode pre-populates existing address
- [ ] AC5: Form validation with error messages
- [ ] AC6: Success toast notification after save

---

### FR-013: TopBar Display Organisation Name & Email

| Aspect | Detail |
|--------|--------|
| Priority | Should |
| Phase | E - Extended Features |
| Affected Roots | apphub-vision |

#### Description

🇻🇳 Update BillingTopBar để hiển thị organisation name và email thay vì user info. Fallback to user info nếu org không available.

🇬🇧 Update BillingTopBar to display organisation name and email instead of user info. Fallback to user info if org not available.

#### Acceptance Criteria

- [ ] AC1: TopBar displays org.name (from session.org)
- [ ] AC2: TopBar displays org.email (from session.org)
- [ ] AC3: Fallback to user.name/email if org data not available
- [ ] AC4: Update nav-user.tsx component

---

## 5. Non-Functional Requirements

### NFR-001: Security - Card Data Handling

| Aspect | Detail |
|--------|--------|
| Category | Security |
| Metric | Zero card data on server |

#### Description

🇻🇳 Card data không bao giờ được chạm vào server của chúng ta. Tất cả card input được xử lý bởi Stripe Elements tokenize trực tiếp với Stripe.

🇬🇧 Card data must never touch our server. All card input is handled by Stripe Elements which tokenizes directly with Stripe.

---

### NFR-002: Security - Authentication

| Aspect | Detail |
|--------|--------|
| Category | Security |
| Metric | All endpoints require valid session |

#### Description

🇻🇳 Tất cả API endpoints phải xác minh session authentication. Requests không có session hợp lệ trả về 401 Unauthorized.

🇬🇧 All API endpoints must verify session authentication. Requests without valid session return 401 Unauthorized.

---

### NFR-003: Performance - Page Load

| Aspect | Detail |
|--------|--------|
| Category | Performance |
| Metric | < 2 seconds initial load |

#### Description

🇻🇳 Trang Payment Details phải load trong 2 giây bao gồm fetch Stripe data. Dùng Next.js Server Components cho initial data fetch.

🇬🇧 Payment Details page should load within 2 seconds including Stripe data fetch. Use Next.js Server Components for initial data fetch.

---

### NFR-004: Error Handling

| Aspect | Detail |
|--------|--------|
| Category | Reliability |
| Metric | All errors show user-friendly messages |

#### Description

🇻🇳 Tất cả error scenarios phải hiển thị messages thân thiện với user. Dùng `tryCatch` utility cho tất cả async operations. Log errors ra console để debug.

🇬🇧 All error scenarios must display user-friendly messages. Use `tryCatch` utility for all async operations. Log errors to console for debugging.

---

## 6. Data Contracts

### GET /api/payment-methods

```typescript
// Response (200)
{
  paymentMethods: Array<{
    id: string;              // "pm_xxx"
    brand: string;           // "visa" | "mastercard" | "amex"
    last4: string;           // "4242"
    expMonth: number;        // 12
    expYear: number;         // 2028
    isDefault: boolean;
  }>;
  customerId: string;
  stripeRegion: string;
  testMode: boolean;
}

// Error (401)
{ error: "Unauthorized", message: "No valid session" }

// Error (404)
{ error: "Not Found", message: "Organisation not found" }
```

### POST /api/payment-methods/setup

```typescript
// Response (200)
{ clientSecret: string }
```

### POST /api/payment-methods/default

```typescript
// Request
{ paymentMethodId: string }

// Response (200)
{ success: true }
```

### DELETE /api/payment-methods/[id]

```typescript
// Response (200)
{ success: true }
```

---

## 7. Data Models

```typescript
interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface BillingAddress {
  name: string;
  email: string;
  phone?: string;
  domain?: string;
}
```

---

## 8. UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: "Payment details"                              │
│  Subtitle: "View and manage your payment methods..."    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Card: Payment Methods                     [+ Add]│   │
│  │  ─────────────────────────────────────────────── │   │
│  │  🔵 Visa  **** **** **** 1313  [Default]         │   │
│  │  ─────────────────────────────────────────────── │   │
│  │  🔴 MC    **** **** **** 4242         [...menu]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Card: Billing Address                    [Edit] │   │
│  │  ─────────────────────────────────────────────── │   │
│  │  clearer-zelda07                                 │   │
│  │  zelda@boostcommerce.net                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Edge Cases

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-001 | No session | Redirect to login |
| EC-002 | Organisation not found | Show error state |
| EC-003 | No stripeCustomerId | Show "Billing not configured" error |
| EC-004 | Stripe API error | Show user-friendly error |
| EC-005 | Card declined | Show Stripe's error message |
| EC-006 | Delete last card | Allow deletion |
| EC-007 | Network timeout | Show retry option |
| EC-008 | Delete default card | Hide delete option for default card |

---

## 10. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@stripe/stripe-js` | Package | New |
| `@stripe/react-stripe-js` | Package | New |
| `@clearer/utils` | Package | Existing |
| `@clearer/billing-database` | Package | Existing |
| OrganisationRepository | Service | Existing |
| StripeClient | Service | Existing |

---

## 11. Environment Variables

```env
# Client-side (new)
NEXT_PUBLIC_STRIPE_UK_TEST_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_UK_LIVE_PUBLISHABLE_KEY=pk_live_xxx

# Server-side (existing)
STRIPE_UK_TEST_SECRET_KEY=sk_test_xxx
STRIPE_UK_LIVE_SECRET_KEY=sk_live_xxx
```

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Organisation not found | High | Clear error message, log for debugging |
| Stripe API rate limits | Medium | Use existing retry logic in StripeClient |
| SetupIntent expires | Low | Create new SetupIntent if expired |
| UI doesn't match Storybook | Low | Use same component structure |

---

## Approval

| Role | Status | Date |
|------|--------|------|
| Spec Author | ✅ Done | 2026-01-24 |
| Reviewer | ✅ Approved | 2026-01-24 |
