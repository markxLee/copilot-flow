# Implementation Log — BP-32 Add Payment Details Page
<!-- Template v4.0 | Inline Bilingual Format with Visual Flags -->

---

## Progress Overview

| Phase | Status | Tasks |
|-------|--------|-------|
| A - Layout Foundation | ✅ Done | T-001 ✅, T-002 ✅, T-003 ✅, T-004 ✅ |
| B - UI Components | ✅ Done | T-005 ✅, T-006 ✅, T-007 ✅, T-008 ✅ |
| C - API Layer | ✅ Done | T-009 ✅, T-010 ✅ |
| D - Stripe Integration | ✅ Done | T-011 ✅, T-012 ✅, T-013 ✅ |
| E - Extended Features | ✅ Done | T-014 ✅, T-015 ✅ |

---

## Completed Tasks

---

### T-001: Setup BillingLayout Base

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 1.5h |
| Completed | 2026-01-24 |

#### Summary

🇻🇳 Đã tạo BillingLayout wrapper component với cấu trúc sidebar/main. Dùng CSS Grid với sidebar 200px và main content scrollable. Component được export từ `components/billing/layout/`.

🇬🇧 Created BillingLayout wrapper component with sidebar/main structure. Used CSS Grid with 200px sidebar and scrollable main content. Component exported from `components/billing/layout/`.

#### Files Changed

| File | Change |
|------|--------|
| [billing-layout.tsx](../../apps/billing/app/components/billing/layout/billing-layout.tsx) | Created - Main layout wrapper |
| [layout-content.tsx](../../apps/billing/app/components/billing/layout/layout-content.tsx) | Created - Grid container |
| [index.ts](../../apps/billing/app/components/billing/layout/index.ts) | Created - Exports |

#### Implementation Notes

🇻🇳
- Layout dùng `grid-template-columns: 200px 1fr` cho responsive sidebar
- Main area có `overflow-y: auto` và `height: 100vh` cho full-page scroll
- Children được wrap trong `LayoutContent2ColScrollMain` component
- Tương thích với dashboard layout pattern để dễ maintain

🇬🇧
- Layout uses `grid-template-columns: 200px 1fr` for responsive sidebar
- Main area has `overflow-y: auto` and `height: 100vh` for full-page scroll
- Children wrapped in `LayoutContent2ColScrollMain` component
- Compatible with dashboard layout pattern for easy maintenance

---

### T-002: Add BillingSidebar

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 1h |
| Completed | 2026-01-24 |

#### Summary

🇻🇳 Đã tạo BillingSidebar với menu 3 items sử dụng NavMain pattern. Active state được quản lý dựa trên pathname. Icons từ Lucide React.

🇬🇧 Created BillingSidebar with 3-item menu using NavMain pattern. Active state managed based on pathname. Icons from Lucide React.

#### Files Changed

| File | Change |
|------|--------|
| [billing-sidebar.tsx](../../apps/billing/app/components/billing/layout/sidebar/billing-sidebar.tsx) | Created |
| [sidebar-nav.tsx](../../apps/billing/app/components/billing/layout/sidebar/sidebar-nav.tsx) | Created |
| [nav-main.tsx](../../apps/billing/app/components/billing/layout/sidebar/nav-main.tsx) | Created |
| [index.ts](../../apps/billing/app/components/billing/layout/sidebar/index.ts) | Created |

#### Implementation Notes

🇻🇳
- Menu items:
  - Your apps (`/`) - LayoutGrid icon
  - Billing history (`/billing-history`) - Receipt icon
  - Payment details (`/payment-details`) - CreditCard icon
- Dùng `usePathname()` để determine active item
- Collapsible group cho tương lai expansion
- SidebarProvider wrap ở AppProviders level

🇬🇧
- Menu items:
  - Your apps (`/`) - LayoutGrid icon
  - Billing history (`/billing-history`) - Receipt icon
  - Payment details (`/payment-details`) - CreditCard icon
- Used `usePathname()` to determine active item
- Collapsible group for future expansion
- SidebarProvider wrapped at AppProviders level

---

### T-003: Add BillingTopBar

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 1h |
| Completed | 2026-01-24 |

#### Summary

🇻🇳 Đã tạo BillingTopBar với breadcrumb navigation và user avatar dropdown. Sign out functionality đã hoạt động với next-auth.

🇬🇧 Created BillingTopBar with breadcrumb navigation and user avatar dropdown. Sign out functionality working with next-auth.

#### Files Changed

| File | Change |
|------|--------|
| [billing-topbar.tsx](../../apps/billing/app/components/billing/layout/topbar/billing-topbar.tsx) | Created |
| [nav-user.tsx](../../apps/billing/app/components/billing/layout/topbar/nav-user.tsx) | Created |
| [index.ts](../../apps/billing/app/components/billing/layout/topbar/index.ts) | Created |

#### Implementation Notes

🇻🇳
- Breadcrumb format: "Billing" > "{Current Page}"
- Current page được derive từ pathname
- User avatar hiển thị initials nếu không có image
- Dropdown menu với:
  - User info (name, email)
  - Sign out button
- Sign out gọi `signOut()` từ `next-auth/react`

🇬🇧
- Breadcrumb format: "Billing" > "{Current Page}"
- Current page derived from pathname
- User avatar shows initials if no image
- Dropdown menu with:
  - User info (name, email)
  - Sign out button
- Sign out calls `signOut()` from `next-auth/react`

---

### T-004: Create AppProviders

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 20m |
| Completed | 2026-01-24 |

#### Summary

🇻🇳 Đã tạo AppProviders component để wrap necessary providers cho UI components. SidebarProvider và TooltipProvider được include.

🇬🇧 Created AppProviders component to wrap necessary providers for UI components. SidebarProvider and TooltipProvider included.

#### Files Changed

| File | Change |
|------|--------|
| [app-providers.tsx](../../apps/billing/app/components/providers/app-providers.tsx) | Created |
| [index.ts](../../apps/billing/app/components/providers/index.ts) | Created |
| [layout.tsx](../../apps/billing/app/layout.tsx) | Modified - Added AppProviders |

#### Implementation Notes

🇻🇳
- Provider hierarchy:
  ```tsx
  <SidebarProvider>
    <TooltipProvider>
      {children}
    </TooltipProvider>
  </SidebarProvider>
  ```
- Được sử dụng trong root layout
- Cho phép sidebar state được shared across components
- Tooltips work globally

🇬🇧
- Provider hierarchy:
  ```tsx
  <SidebarProvider>
    <TooltipProvider>
      {children}
    </TooltipProvider>
  </SidebarProvider>
  ```
- Used in root layout
- Allows sidebar state to be shared across components
- Tooltips work globally

---

### T-005: Create PaymentMethodsList Component

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 2h |
| Completed | 2026-01-25 |

#### Summary

🇻🇳 Đã migrate PaymentMethodsList component từ Storybook. Component hiển thị list of cards với brand icon, masked number, default badge, và dropdown menu cho actions (Set default, Delete).

🇬🇧 Migrated PaymentMethodsList component from Storybook. Component displays list of cards with brand icon, masked number, default badge, and dropdown menu for actions (Set default, Delete).

#### Files Changed

| File | Change |
|------|--------|
| `apps/billing/app/components/payment/index.ts` | Created - Barrel exports |
| `apps/billing/app/components/payment/CardBrandIcon.tsx` | Created - Card brand SVG icons |
| `apps/billing/app/components/payment/PaymentMethodCard.tsx` | Created - Single card component |
| `apps/billing/app/components/payment/PaymentMethodsList.tsx` | Created - Full list component |
| `apps/billing/app/payment-details/page.tsx` | Modified - Integrated PaymentMethodsList |

#### Implementation Notes

🇻🇳
- PaymentMethodCard hiển thị: CardBrandIcon + masked number + default badge
- DropdownMenu với "Set as default" và "Delete" actions
- AlertDialogConfirm cho cả 2 actions (set default và delete)
- Empty state component cho khi không có cards
- Mock data được sử dụng, sẽ connect API ở T-011

🇬🇧
- PaymentMethodCard shows: CardBrandIcon + masked number + default badge
- DropdownMenu with "Set as default" and "Delete" actions
- AlertDialogConfirm for both actions (set default and delete)
- Empty state component when no cards
- Mock data used, will connect API in T-011

---

### T-006: Create AddPaymentModal Component

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 1h |
| Completed | 2026-01-25 |

#### Summary

🇻🇳 Đã migrate AddPaymentModal từ Storybook với mock UI cho card input. Modal bao gồm title, mock card fields, "Use as default" checkbox, terms text, và Cancel/Add buttons. Stripe CardElement sẽ được integrate ở T-010.

🇬🇧 Migrated AddPaymentModal from Storybook with mock UI for card input. Modal includes title, mock card fields, "Use as default" checkbox, terms text, and Cancel/Add buttons. Stripe CardElement will be integrated in T-010.

#### Files Changed

| File | Change |
|------|--------|
| `apps/billing/app/components/payment/AddPaymentModal.tsx` | Created |
| `apps/billing/app/components/payment/index.ts` | Modified - Added export |
| `apps/billing/app/payment-details/page.tsx` | Modified - Integrated AddPaymentModal |

#### Implementation Notes

🇻🇳
- Modal structure: Dialog với custom content
- Mock card input fields (sẽ được thay bằng Stripe CardElement ở T-010)
- "Use as default" checkbox với state
- Terms text với Privacy Policy và Terms of Service links
- Cancel/Add buttons với loading state
- Placeholder approach: mock UI sẽ bị remove khi integrate Stripe

🇬🇧
- Modal structure: Dialog with custom content
- Mock card input fields (will be replaced by Stripe CardElement in T-010)
- "Use as default" checkbox with state
- Terms text with Privacy Policy and Terms of Service links
- Cancel/Add buttons with loading state
- Placeholder approach: mock UI will be removed when integrating Stripe

---

### T-007: Create BillingAddressCard Component

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 30m |
| Completed | 2026-01-25 |
| Reviewed | Manual by user |

#### Summary

🇻🇳 Đã migrate BillingAddressCard component từ Storybook. Component hiển thị billing address trong Card layout với 2-row grid (6 fields). Edit button hiển thị nhưng disabled (functionality ngoài scope).

🇬🇧 Migrated BillingAddressCard component from Storybook. Component displays billing address in Card layout with 2-row grid (6 fields). Edit button displayed but disabled (functionality out of scope).

#### Files Changed

| File | Change |
|------|--------|
| `apps/billing/app/components/payment/BillingAddressCard.tsx` | Created - Main component with BillingAddressSummary |
| `apps/billing/app/components/payment/index.ts` | Modified - Added exports |
| `apps/billing/app/payment-details/page.tsx` | Modified - Integrated BillingAddressCard |

#### Implementation Notes

🇻🇳
- Card layout với SubHeaderBlock (title, description, Edit button)
- BillingAddressSummary: 2-row grid layout
  - Row 1: Country, Address line 1, Address line 2
  - Row 2: City, State, ZIP code
- Edit button disabled (functionality ngoài scope)
- Mock data được sử dụng, sẽ connect session.org ở T-012
- Cleanup: removed unused isEditAddressModalOpen state

🇬🇧
- Card layout with SubHeaderBlock (title, description, Edit button)
- BillingAddressSummary: 2-row grid layout
  - Row 1: Country, Address line 1, Address line 2
  - Row 2: City, State, ZIP code
- Edit button disabled (functionality out of scope)
- Mock data used, will connect session.org in T-012
- Cleanup: removed unused isEditAddressModalOpen state

---

### T-008: Create Payment Methods API Routes

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 0.5h |
| Completed | 2026-01-26 |

#### Summary

🇻🇳 Đã tạo GET `/api/payment-methods` endpoint để lấy danh sách payment methods từ Stripe. Flow: validate session → lookup org by email → get Stripe customer → list payment methods. Sử dụng patterns đã có: readSession, organisationRepository, StripeClient.

🇬🇧 Created GET `/api/payment-methods` endpoint to fetch payment methods from Stripe. Flow: validate session → lookup org by email → get Stripe customer → list payment methods. Uses existing patterns: readSession, organisationRepository, StripeClient.

#### Files Changed

| File | Change |
|------|--------|
| `apps/billing/app/api/payment-methods/route.ts` | Created - GET handler with full flow |

#### Implementation Notes

🇻🇳
- Dùng `readSession()` từ session-reader.ts cho authentication
- Lookup org với `organisationRepository.findOrganisationByEmail()`
- Tạo StripeClient với org.stripeRegion và org.testMode
- Gọi `stripe.customers.listPaymentMethods()` để lấy cards
- Xác định default payment method từ customer.invoice_settings
- Handle case org chưa có stripeCustomerId (return empty array)
- Dùng `withLogging` wrapper cho request logging
- Dùng `tryCatch` cho tất cả async operations

🇬🇧
- Uses `readSession()` from session-reader.ts for authentication
- Lookup org with `organisationRepository.findOrganisationByEmail()`
- Create StripeClient with org.stripeRegion and org.testMode
- Call `stripe.customers.listPaymentMethods()` to fetch cards
- Determine default payment method from customer.invoice_settings
- Handle case where org has no stripeCustomerId yet (return empty array)
- Uses `withLogging` wrapper for request logging
- Uses `tryCatch` for all async operations

---

## Pending Tasks

| Task | Status | Blocked By |
|------|--------|------------|
| T-010: Integrate Stripe Elements | ⏸️ Pending | T-006 ✅, T-009 🔄 |
| T-011: Connect PaymentMethodsList to API | ⏸️ Pending | T-005 ✅, T-008 ✅ |
| T-012: Connect BillingAddress to session | ⏸️ Pending | T-007 ✅ |

---

### T-009: Install Stripe Packages

| Aspect | Detail |
|--------|--------|
| Status | 🔄 Awaiting Review |
| Duration | 5m |
| Completed | 2026-01-26 |

#### Summary

🇻🇳 Đã thêm Stripe client-side packages vào billing app để hỗ trợ Stripe Elements integration.

🇬🇧 Added Stripe client-side packages to billing app to support Stripe Elements integration.

#### Files Changed

| File | Change |
|------|--------|
| [package.json](../../../apps/billing/package.json) | Added @stripe/react-stripe-js, @stripe/stripe-js |

#### Packages Added

| Package | Version | Purpose |
|---------|---------|---------|
| `@stripe/stripe-js` | ^5.5.0 | Stripe.js loader for browser |
| `@stripe/react-stripe-js` | ^3.1.1 | React bindings for Stripe Elements |

#### Implementation Notes

🇻🇳
- Server SDK `stripe` đã có sẵn (^20.0.0)
- Thêm client packages cho Elements integration
- Cần chạy `pnpm install` để cài đặt packages

🇬🇧
- Server SDK `stripe` was already present (^20.0.0)
- Added client packages for Elements integration
- Need to run `pnpm install` to install packages

---

### T-010: Integrate Stripe Elements in Modal

| Aspect | Detail |
|--------|--------|
| Status | ✅ Done |
| Duration | 2h |
| Completed | 2026-01-26 |
| Reviewed | Awaiting review |

#### Summary

🇻🇳 Đã integrate Stripe Elements vào AddPaymentModal. Thay thế manual card inputs bằng CardElement của Stripe cho PCI-compliant card collection. Tạo SetupIntent API endpoint và StripeProvider component.

🇬🇧 Integrated Stripe Elements into AddPaymentModal. Replaced manual card inputs with Stripe's CardElement for PCI-compliant card collection. Created SetupIntent API endpoint and StripeProvider component.

#### Files Changed

| File | Change |
|------|--------|
| `apps/billing/app/api/payment-methods/setup/route.ts` | Created - SetupIntent API endpoint |
| `apps/billing/app/api/payment-methods/default/route.ts` | Created - Set default payment method API |
| `apps/billing/app/components/providers/StripeProvider.tsx` | Created - Stripe Elements provider |
| `apps/billing/app/components/providers/index.ts` | Created - Provider exports |
| `apps/billing/app/components/payment/AddPaymentModal.tsx` | Modified - Replaced inputs with CardElement |
| `apps/billing/app/payment-details/page.tsx` | Modified - Wrapped modal with StripeProvider |

#### Implementation Notes

🇻🇳
- Flow: User clicks Add → POST /setup → get clientSecret → confirmCardSetup → Done
- CardElement thay thế các input fields (card number, expiry, CVC)
- StripeProvider cung cấp Elements context
- SetupIntent API tạo intent cho customer từ session
- Default API cho phép set default payment method
- Error handling với tryCatch pattern
- Loading states trong modal

🇬🇧
- Flow: User clicks Add → POST /setup → get clientSecret → confirmCardSetup → Done
- CardElement replaces input fields (card number, expiry, CVC)
- StripeProvider provides Elements context
- SetupIntent API creates intent for customer from session
- Default API allows setting default payment method
- Error handling with tryCatch pattern
- Loading states in modal

#### API Endpoints Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payment-methods/setup` | POST | Create SetupIntent, return clientSecret |
| `/api/payment-methods/default` | POST | Set payment method as default |

---

## Issues Encountered

| Issue | Task | Resolution |
|-------|------|------------|
| None | - | - |

---

## T-011: Connect PaymentMethodsList to API

| Aspect | Detail |
|--------|--------|
| Status | ✅ Completed |
| Duration | 30m |
| Completed | 2026-01-26 |
| Reviewed | AI Review |

### Summary

🇻🇳 Đã connect PaymentMethodsList với real API data. Thay mock data bằng fetch từ GET `/api/payment-methods`. Implement Delete endpoint và các handlers cho Set Default / Delete actions.

🇬🇧 Connected PaymentMethodsList to real API data. Replaced mock data with fetch from GET `/api/payment-methods`. Implemented Delete endpoint and handlers for Set Default / Delete actions.

### Files Changed

| File | Change |
|------|--------|
| [route.ts](../../apps/billing/app/api/payment-methods/[id]/route.ts) | Created - DELETE endpoint to detach payment method |
| [page.tsx](../../apps/billing/app/payment-details/page.tsx) | Modified - Replaced mock with API fetch, loading/error states |

### Implementation Notes

🇻🇳
- `fetchPaymentMethods()` gọi GET `/api/payment-methods` khi mount
- Map API response (`PaymentMethodApiResponse`) sang component interface (`PaymentMethod`)
- `handleSetDefault()` gọi POST `/api/payment-methods/default` rồi refresh
- `handleDelete()` gọi DELETE `/api/payment-methods/[id]` rồi refresh
- Loading state với `Spinner` component
- Error state với retry button
- DELETE route verify payment method thuộc về customer trước khi detach

🇬🇧
- `fetchPaymentMethods()` calls GET `/api/payment-methods` on mount
- Maps API response (`PaymentMethodApiResponse`) to component interface (`PaymentMethod`)
- `handleSetDefault()` calls POST `/api/payment-methods/default` then refreshes
- `handleDelete()` calls DELETE `/api/payment-methods/[id]` then refreshes
- Loading state with `Spinner` component
- Error state with retry button
- DELETE route verifies payment method belongs to customer before detaching

---

## Next Steps

🇻🇳
1. **T-013**: Document Stripe Environment Setup

🇬🇧
1. **T-013**: Document Stripe Environment Setup

---

## T-012: Connect BillingAddress to Session

| Aspect | Detail |
|--------|--------|
| Status | ✅ Completed |
| Duration | 30m |
| Completed | 2026-01-26 |
| Reviewed | AI Review |

### Summary

🇻🇳 Đã connect BillingAddressCard với real data từ Stripe Customer. Tạo API endpoint `/api/billing-address` để lấy address từ Stripe, update page.tsx để fetch và hiển thị real billing address thay vì mock data.

🇬🇧 Connected BillingAddressCard to real data from Stripe Customer. Created API endpoint `/api/billing-address` to get address from Stripe, updated page.tsx to fetch and display real billing address instead of mock data.

### Files Changed

| File | Change |
|------|--------|
| [route.ts](../../apps/billing/app/api/billing-address/route.ts) | Created - GET endpoint for billing address from Stripe Customer |
| [page.tsx](../../apps/billing/app/payment-details/page.tsx) | Modified - Fetch and display real billing address with loading/error states |

### Implementation Notes

🇻🇳
- API endpoint: GET `/api/billing-address`
- Flow: validate session → lookup org → retrieve Stripe customer → extract address
- Map Stripe address fields: `line1` → `address1`, `line2` → `address2`, `postal_code` → `zip`
- Handle 3 states: loading, error, null address (no address on file)
- Page fetches both payment methods và billing address on mount (parallel)
- "No billing address on file" message nếu customer chưa có address
- Removed mock billing address data

🇬🇧
- API endpoint: GET `/api/billing-address`
- Flow: validate session → lookup org → retrieve Stripe customer → extract address
- Map Stripe address fields: `line1` → `address1`, `line2` → `address2`, `postal_code` → `zip`
- Handle 3 states: loading, error, null address (no address on file)
- Page fetches both payment methods and billing address on mount (parallel)
- "No billing address on file" message if customer has no address yet
- Removed mock billing address data

---

## T-013: Document Stripe Environment Setup

| Aspect | Detail |
|--------|--------|
| Status | ✅ Awaiting Review |
| Duration | 15m |
| Completed | 2026-01-26 |
| Reviewed | Awaiting |

### Summary

🇻🇳 Đã thêm documentation section "Stripe Payment Integration" vào README.md với hướng dẫn đầy đủ về setup Stripe environment variables, bao gồm server-side và client-side keys, multi-region support, security best practices.

🇬🇧 Added "Stripe Payment Integration" documentation section to README.md with complete guide for Stripe environment variables setup, including server-side and client-side keys, multi-region support, security best practices.

---

## T-014: Add/Edit Billing Address Modal & API

| Aspect | Detail |
|--------|--------|
| Status | ✅ Awaiting Review |
| Duration | 2h |
| Completed | 2026-01-26 |
| Reviewed | Awaiting |

### Summary

🇻🇳 Đã tạo AddBillingAddressModal component với full form validation và POST API endpoint để update Stripe Customer address. Modal hỗ trợ cả Add và Edit mode thông qua prop `existingAddress`. Form có country/state selects, validation cho required fields, và success/error notifications.

🇬🇧 Created AddBillingAddressModal component with full form validation and POST API endpoint to update Stripe Customer address. Modal supports both Add and Edit mode via `existingAddress` prop. Form has country/state selects, validation for required fields, and success/error notifications.

### Files Changed

| File | Change |
|------|--------|
| [AddBillingAddressModal.tsx](../../apps/billing/app/components/payment/AddBillingAddressModal.tsx) | Created - Modal component with form for add/edit address |
| [index.ts](../../apps/billing/app/components/payment/index.ts) | Modified - Export AddBillingAddressModal |
| [route.ts](../../apps/billing/app/api/billing-address/route.ts) | Modified - Added POST handler to update Stripe Customer address |
| [page.tsx](../../apps/billing/app/payment-details/page.tsx) | Modified - Added modal state and connected to BillingAddressCard |

### Implementation Notes

🇻🇳
- AddBillingAddressModal dựa trên EditAddressModal.stories.tsx từ reviews-assets
- Form fields: country (Select), address1 (Input), address2 (Input), city (Input), state (Select/Input), zip (Input)
- Country options: US, GB, CA, AU, DE, FR, VN
- US State options: Full list 50 states
- Validation: country, address1, city, zip required; state required if US
- POST `/api/billing-address` updates Stripe Customer.address
- Modal connected to BillingAddressCard qua onEditAddress callback
- Modal connected to empty state "Add billing address" button
- Success notification hiển thị 1 second trước khi close

🇬🇧
- AddBillingAddressModal based on EditAddressModal.stories.tsx from reviews-assets
- Form fields: country (Select), address1 (Input), address2 (Input), city (Input), state (Select/Input), zip (Input)
- Country options: US, GB, CA, AU, DE, FR, VN
- US State options: Full list of 50 states
- Validation: country, address1, city, zip required; state required if US
- POST `/api/billing-address` updates Stripe Customer.address
- Modal connected to BillingAddressCard via onEditAddress callback
- Modal connected to empty state "Add billing address" button
- Success notification displayed for 1 second before close

### Files Changed

| File | Change |
|------|--------|
| [README.md](../../apps/billing/README.md) | Added Stripe Payment Integration section |

### Documentation Added

- Server-side secret key pattern: `STRIPE_{REGION}_{MODE}_SECRET_KEY`
- Client-side publishable key pattern: `NEXT_PUBLIC_STRIPE_{REGION}_{MODE}_PUBLISHABLE_KEY`
- Key resolution priority order
- How to get keys from Stripe Dashboard
- Test vs Live mode comparison
- Minimal development setup example
- Payment Details feature API breakdown
- Security best practices

---

## Session Log

| Date | Tasks | Duration | Notes |
|------|-------|----------|-------|
| 2026-01-24 | T-001, T-002, T-003, T-004 | 4h | Phase A complete |
| 2026-01-25 | T-005, T-006, T-007 | 3.5h | Phase B UI Components complete |
| 2026-01-26 | T-008, T-009, T-010, T-011, T-012, T-013 | 4h | Phase C + D Stripe integration complete |
| 2026-01-26 | T-014 | 2h | Add/Edit Billing Address Modal & API |
| 2026-01-26 | T-015 | 1h | TopBar Display Org Name & Email |

---

## Quality Checklist

- [x] All Phase A tasks completed
- [x] All Phase B tasks completed
- [x] Code follows project conventions
- [x] tryCatch used for async operations
- [x] Components properly exported
- [x] T-008 GET /api/payment-methods created
- [x] T-009 Stripe packages installed
- [x] T-010 Stripe Elements integrated
- [x] T-011 Connect PaymentMethodsList to API
- [x] T-012 Connect BillingAddress to session
- [x] T-013 Document Stripe Environment Setup
- [x] T-014 Add/Edit Billing Address Modal & API
- [x] T-015 TopBar Display Org Name & Email
- [ ] Tests pending
