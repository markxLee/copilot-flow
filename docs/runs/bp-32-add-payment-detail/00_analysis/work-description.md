# Work Description — BP-32 Add Payment Details Page
<!-- Template v4.0 | Inline Bilingual Format with Visual Flags -->

---

## TL;DR

| Aspect | Value |
|--------|-------|
| Ticket | BP-32 |
| Branch | `bp-32-add-payment-detail` |
| Work Type | FEATURE |
| Affected Roots | apphub-vision |
| Route | `/payment-details` |
| Created | 2026-01-24 |

---

## 1. Problem Statement

### Current Behavior

🇻🇳 Billing app hiện tại không có trang Payment Details. Users không thể xem hoặc quản lý payment methods và billing address của họ trong app.

🇬🇧 The billing app currently has no Payment Details page. Users cannot view or manage their payment methods and billing address within the app.

### Desired Behavior

🇻🇳 Billing app cần có trang Payment Details nơi users có thể:
- Xem danh sách payment methods (credit/debit cards)
- Thêm payment method mới qua Stripe Elements
- Đặt default payment method
- Xóa payment method
- Xem billing address

🇬🇧 The billing app needs a Payment Details page where users can:
- View list of payment methods (credit/debit cards)
- Add new payment method via Stripe Elements
- Set default payment method
- Delete payment method
- View billing address

### Gap Analysis

🇻🇳 UI đã được thiết kế trong Storybook nhưng chưa được implement trong billing app. Cần migrate UI và tích hợp với Stripe API để xử lý payment methods thật.

🇬🇧 UI has been designed in Storybook but not implemented in the billing app. Need to migrate UI and integrate with Stripe API to handle real payment methods.

---

## 2. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Stripe Integration | Stripe Elements | Stays in modal, better UX, matches Storybook design |
| Data Flow | session.org.email → Organisation → stripeCustomerId | Session already has org email |
| Display Format | `**** **** **** {last4}` | Standard card masking |
| Empty State | Show message when no cards | Better UX |

---

## 3. Data Flow

```
Session
  └── org.email: "zelda@boostcommerce.net"
        │
        ▼
Organisation (query by primaryContactEmail)
  └── stripeCustomerId: "cus_xxx"
        │
        ▼
Stripe API
  ├── List PaymentMethods
  ├── Create SetupIntent
  ├── Attach PaymentMethod
  └── Delete PaymentMethod
```

---

## 4. Scope

### In Scope

🇻🇳
- Layout trang Payment Details với BillingLayout
- Component PaymentMethods (list, set default, delete)
- Component BillingAddress (chỉ xem)
- Modal Add Payment Method với Stripe Elements
- API để lấy org theo email và truy xuất stripeCustomerId
- API để list/add/delete payment methods qua Stripe

🇬🇧
- Payment Details page layout with BillingLayout
- PaymentMethods component (list, set default, delete)
- BillingAddress component (view only)
- Add Payment Method modal with Stripe Elements
- API to get org by email and retrieve stripeCustomerId
- API to list/add/delete payment methods via Stripe

### Out of Scope

🇻🇳
- Chức năng edit billing address
- Thay đổi component Storybook
- Xử lý nhiều Stripe regions
- Edit payment method (chỉ add/delete)

🇬🇧
- Edit billing address functionality
- Storybook component modifications
- Multiple Stripe regions handling
- Payment method editing (only add/delete)

---

## 5. Acceptance Criteria

- [ ] **AC1:** Payment Details page accessible at `/payment-details` route
- [ ] **AC2:** Page fetches `stripeCustomerId` via `session.org.email` → Organisation query
- [ ] **AC3:** PaymentMethods displays real Stripe payment methods as `**** **** **** {last4}`
- [ ] **AC4:** Empty state shown when customer has no payment methods
- [ ] **AC5:** "Add New" button opens modal with Stripe Elements (CardElement)
- [ ] **AC6:** SetupIntent created and card attached to Stripe customer on submit
- [ ] **AC7:** Default payment method can be set/changed
- [ ] **AC8:** Payment method can be deleted (with confirmation)
- [ ] **AC9:** BillingAddress displays organisation billing info from session/org
- [ ] **AC10:** UI matches Storybook design (layout, components, styling)

---

## 6. References

| Reference | Path |
|-----------|------|
| Storybook | `reviews-assets/public/documentation/ui-library/src/stories/production/PaymentDetails.stories.tsx` |
| Organisation Repository | `apps/billing/lib/repository/prisma/organisation.repository.ts` |
| Session Structure | Contains `session.org.email` for org lookup |
