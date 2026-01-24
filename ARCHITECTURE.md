# Workspace Architecture Overview

> **AUTO-GENERATED** from WORKSPACE_CONTEXT.md
> Run `generate architecture` to regenerate
> Last updated: 2026-01-24

---

## 🗺️ Workspace Map

```
boostcommerce/
├── copilot-flow/           # Copilot workflows, prompts, shared docs (impl_root)
├── apphub-vision/          # Clearer App - AI analytics platform (primary)
├── reviews-assets/         # UI library + Storybook (@apphubdev/clearer-ui)
└── boost-pfs-backend/      # Discovery feature microservices (SIP)
```

---

## 📦 Root Descriptions

### copilot-flow
| Attribute | Value |
|-----------|-------|
| **Purpose** | Shared Copilot workflows and prompts for multi-root workspace |
| **Type** | documentation |
| **Role** | `impl_root` - All workflow docs stored here |
| **Tech** | Markdown |
| **Package Manager** | - |

### apphub-vision
| Attribute | Value |
|-----------|-------|
| **Purpose** | Clearer App - AI analytics & automation platform for Shopify |
| **Type** | monorepo |
| **Role** | `primary_root` - Main codebase |
| **Tech** | TypeScript, Fastify, Next.js, LangChain, LangGraph, Prisma, React |
| **Package Manager** | pnpm |
| **Dev Command** | `pnpm dev` |
| **Build Command** | `pnpm build` |

### reviews-assets
| Attribute | Value |
|-----------|-------|
| **Purpose** | UI component library & static assets |
| **Type** | library |
| **Package** | `@apphubdev/clearer-ui` |
| **Tech** | TypeScript, SCSS, React, Storybook, Tailwind, Radix UI |
| **Package Manager** | npm |
| **Storybook Source** | `public/documentation/ui-library/` |

### boost-pfs-backend
| Attribute | Value |
|-----------|-------|
| **Purpose** | Discovery feature microservices (SIP - Sync Index Process) |
| **Type** | monorepo |
| **Tech** | TypeScript, Express, Elasticsearch |
| **Package Manager** | npm |
| **Dev Command** | `npm run dev` |
| **Build Command** | `npm run build:common` |

---

## 🔗 Cross-Root Relationships

```
┌─────────────────────┐
│   reviews-assets    │
│ @apphubdev/clearer-ui│
└──────────┬──────────┘
           │ storybook-implementation (versioned)
           ▼
┌─────────────────────┐      api-integration      ┌─────────────────────┐
│   apphub-vision     │◄─────────────────────────│  boost-pfs-backend  │
│   (primary_root)    │      (REST API + JWT)     │   (Discovery/SIP)   │
└─────────────────────┘                           └─────────────────────┘
           ▲
           │ shared-tooling (prompts & docs)
           │
┌─────────────────────┐
│    copilot-flow     │
│    (impl_root)      │
└─────────────────────┘
```

### Relationship Table

| From | To | Type | Sync | Via |
|------|----|------|------|-----|
| reviews-assets | apphub-vision | storybook-implementation | versioned | `@apphubdev/clearer-ui` |
| boost-pfs-backend | apphub-vision | microservice-peer | none | REST API (`clearer-auth-token`) |
| apphub-vision | reviews-assets | shared-package | versioned | `@apphubdev/clearer-ui` |
| copilot-flow | all roots | shared-tooling | none | prompts & docs |

---

## 🏗️ Key Architectural Decisions

### ADR-001: Separate impl_root for Workflow Docs
- **Decision:** Store all Copilot workflow artifacts in `copilot-flow/`
- **Rationale:** Keep workflow docs separate from source code, easy PR review
- **Status:** Adopted

### ADR-002: Versioned UI Library
- **Decision:** Publish `@apphubdev/clearer-ui` to GitHub Packages
- **Rationale:** Clear versioning, consumer roots can update independently
- **Status:** Adopted

### ADR-003: JWT Authentication for Cross-Service API
- **Decision:** Use `clearer-auth-token` JWT header for boost-pfs-backend APIs
- **Rationale:** Secure service-to-service communication
- **Status:** Adopted

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Shopify Store                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Events/Webhooks
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      apphub-vision                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │  dashboard  │    │   ai-api    │    │   lambda/billing    │ │
│  │  (Next.js)  │    │  (Fastify)  │    │     (AWS)           │ │
│  └──────┬──────┘    └──────┬──────┘    └─────────────────────┘ │
│         │                  │                                    │
│         │    ┌─────────────┴─────────────┐                     │
│         │    │    @clearer/packages      │                     │
│         │    │ utils, core, assistant    │                     │
│         │    └───────────────────────────┘                     │
└─────────┼───────────────────────────────────────────────────────┘
          │
          │ REST API (Discovery features)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    boost-pfs-backend                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  sip-api   │  │  admin-api │  │  filter    │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                         │                                       │
│                         ▼                                       │
│                  ┌─────────────┐                                │
│                  │Elasticsearch│                                │
│                  └─────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Development Workflow

### Setup (One-time)
```bash
# 1. Open workspace
code boostcommerce.code-workspace

# 2. Run setup
> setup workspace
# This runs: discovery → cross-root → sync instructions → generate files
```

### Daily Development
```bash
# 1. Start session
> init

# 2. Check for existing workflow
> status

# 3. Start new work
> lite: <description>  # Simple tasks
# OR
> <describe work>      # Complex tasks (full workflow)
```

### Cross-Root Changes

#### UI Library → Consumer
```bash
# 1. Edit in reviews-assets
cd reviews-assets/public/documentation/ui-library
# make changes...

# 2. Build library
npm run build

# 3. Publish (if ready)
npm publish

# 4. Update consumer
cd apphub-vision
pnpm update @apphubdev/clearer-ui
```

#### API Changes (boost-pfs-backend → apphub-vision)
```bash
# 1. Update backend (backward compatible)
# 2. Deploy backend first
# 3. Update api.config.json in dashboard if new endpoint
# 4. Deploy frontend after backend is live
```

---

## 📁 Key File Locations

| What | Where |
|------|-------|
| Workspace file | `boostcommerce.code-workspace` |
| Workspace context | `copilot-flow/WORKSPACE_CONTEXT.md` |
| Workflow contract | `copilot-flow/docs/workflow/contract.md` |
| Shared instructions | `copilot-flow/.github/instructions/shared/` |
| Prompts | `copilot-flow/.github/prompts/` |
| API config | `apphub-vision/apps/dashboard/helper/boost/api/api.config.json` |

---

## 🚀 Quick Reference

### Commands
| Command | Action |
|---------|--------|
| `setup workspace` | Full setup (discovery + cross-root + sync) |
| `sync instructions` | Sync shared instructions + detect tech |
| `sync vscode settings` | Sync VS Code settings to all roots |
| `cross-root` | Configure cross-root patterns |
| `init` | Start working session |
| `status` | Check workflow status |
| `help` | Show quick reference card |

### Package Managers
| Root | Manager | Install Command |
|------|---------|-----------------|
| apphub-vision | pnpm | `pnpm install` |
| reviews-assets | npm | `npm install` |
| boost-pfs-backend | npm | `npm install` |
| copilot-flow | - | - |

---

## 📚 Related Documentation

- [Workflow Contract](docs/workflow/contract.md)
- [WORKSPACE_CONTEXT.md](WORKSPACE_CONTEXT.md)
- [apphub-vision README](../apphub-vision/README.md)
- [reviews-assets README](../reviews-assets/public/documentation/ui-library/README.md)
- [boost-pfs-backend README](../boost-pfs-backend/README.md)
