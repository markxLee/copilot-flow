# BP-24: Billing App Installation Synchronization

> **Status:** Phase 4 Complete (Tests) ✅ → Ready for Phase 5 (Done Check)
> **Branch:** `feature/BP-24-application-installation-to-billing`
> **Last Updated:** 2026-01-27

---

## Summary / Tóm tắt

**EN:** Auto-provision billing records (Organisation + Account + Store + ServiceUsage) when a merchant installs the Shopify app. Uses v2 Service-Based Billing Model.

**VI:** Tự động tạo billing records (Organisation + Account + Store + ServiceUsage) khi merchant cài đặt Shopify app. Sử dụng v2 Service-Based Billing Model.

---

## Key Decisions / Quyết định Chính

| # | Decision | Rationale |
|---|----------|-----------|
| D-001 | Use Service-Based Billing Model (v2) | Account is abstract billing group, supports billing beyond app usage |
| D-002 | Store belongs directly to Organisation | Simpler relationship model, store is organizational asset |
| D-003 | ServiceUsage replaces AppAccount concept | More flexible - bills for apps, support, custom work, consulting |

---

## Progress / Tiến độ

| Phase | Name | Status |
|-------|------|--------|
| 0 | Analysis & Design | ✅ Approved |
| 1 | Specification | ✅ Approved (v1 + Update 1) |
| 2 | Task Planning | ✅ Approved (17 tasks) |
| 3 | Implementation | ✅ Complete (T-001 to T-017) |
| 4 | Tests | ✅ Complete (265 tests, ≥94% coverage) |
| 5 | Done Check | ⏳ Not Started |

---

## Artifacts / Tài liệu

| Phase | File | Status |
|-------|------|--------|
| 0 | [00_analysis/technical-feasibility.md](00_analysis/technical-feasibility.md) | ✅ |
| 1 | [01_spec/spec.md](01_spec/spec.md) | ✅ |
| 1 | [01_spec/spec-update-1.md](01_spec/spec-update-1.md) | ✅ |
| 2 | [02_tasks/tasks.md](02_tasks/tasks.md) | ✅ |
| 2 | [02_tasks/tasks-update-1.md](02_tasks/tasks-update-1.md) | ✅ |
| 3 | [03_impl/impl-log.md](03_impl/impl-log.md) | ✅ |
| 4 | [04_tests/unit-tests.md](04_tests/unit-tests.md) | ✅ |
| 5 | 05_done/done-check.md | ⏳ Pending |

---

## Test Summary / Kết quả Test

| Metric | Value |
|--------|-------|
| Total Tests | 265 |
| Passed | 265 |
| Failed | 0 |
| Coverage | 97.72% (branch) |

### v2 Component Coverage
| File | Coverage |
|------|----------|
| service.repository.ts | 100% |
| service-usage.repository.ts | 100% |
| store.repository.ts | 94.11% |
| provision.service.ts | 97.72% |

---

## Next Steps / Bước tiếp theo

1. Run `/phase-5-done` to start Done Check
2. Generate PR description
3. Final review and merge

---

## v2 Model Architecture

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

Service (seeded lookup table):
  • clearer (app)
  • boost (app)
  • support (support package)
  • custom-theme (custom work)
```
