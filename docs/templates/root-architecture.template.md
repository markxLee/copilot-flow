# Architecture: <ROOT_NAME>

> System architecture for <ROOT_NAME>
> Last updated: <DATE>

---

## 📋 Overview

| Attribute | Value |
|-----------|-------|
| **Purpose** | <One-line description> |
| **Type** | <monorepo/microservices/library/static-assets> |
| **Tech Stack** | <Main technologies> |
| **Package Manager** | <pnpm/npm/yarn> |

---

## 🏗️ Structure

```
<root>/
├── apps/                # Applications (if monorepo)
│   ├── <app-1>/
│   └── <app-2>/
├── packages/            # Shared packages (if monorepo)
│   ├── <package-1>/
│   └── <package-2>/
├── src/                 # Source code (if single app)
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

---

## 📦 Key Components

### <Component/App Name>
| Attribute | Value |
|-----------|-------|
| **Path** | `<path>` |
| **Purpose** | <What it does> |
| **Tech** | <Framework, key libraries> |
| **Entry** | <Main file> |

### <Another Component>
| Attribute | Value |
|-----------|-------|
| **Path** | `<path>` |
| **Purpose** | <What it does> |

---

## 🔗 Internal Dependencies

```
<package-a>
    │
    ├──▶ <package-b>
    │
    └──▶ <package-c>
           │
           └──▶ <app-1>
```

---

## 📊 Data Flow (if applicable)

```
[Input/Trigger]
      │
      ▼
┌─────────────┐
│  Component  │
└─────────────┘
      │
      ▼
[Output/Storage]
```

---

## 🔧 Key Decisions

### ADR-001: <Decision Title>
- **Context**: <Why this decision was needed>
- **Decision**: <What was decided>
- **Consequences**: <Trade-offs accepted>

---

## 🚀 Development

### Prerequisites
```bash
# Required tools
<list prerequisites>
```

### Setup
```bash
# Install dependencies
<package-manager> install

# Generate types/clients (if needed)
<package-manager> run generate

# Start development
<package-manager> run dev
```

### Build Order (if monorepo)
```
<dep-1> → <dep-2> → <main-app>
```

### Common Commands
| Command | Purpose |
|---------|---------|
| `<cmd>` | <what it does> |
| `<cmd>` | <what it does> |

---

## 🔌 External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| <service> | <why> | <env var or config file> |

---

## 📚 Related Documentation

- [README](README.md)
- [Workspace Architecture](../copilot-flow/ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md) (if exists)
