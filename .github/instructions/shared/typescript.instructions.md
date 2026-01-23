---
applyTo: '**/*.ts,**/*.tsx'
---

# Shared TypeScript Standards

> Master copy in `copilot-flow/.github/instructions/shared/`
> Run `sync instructions` to sync to other workspace roots

## TypeScript Standards

- Strict mode is enabled in all packages
- Module system: ESNext with `"type": "module"`
- Module resolution: `bundler` strategy

## Type Safety

- **No `any`**: Use `unknown` and type guards instead
- Prefer `interface` over `type` for object shapes
- Use explicit return types for exported functions
- Leverage TypeScript's inference where it's clear

```typescript
// ✅ CORRECT
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ WRONG
type User = { id: any; name: any };
```

## Import Organization

```typescript
// 1. External dependencies
import { Fastify } from 'fastify';
import { PrismaClient } from '@prisma/client';

// 2. Internal workspace packages
import { tryCatch } from '@clearer/utils';
import { db } from '@clearer/app-database';

// 3. Relative imports
import { createAgent } from './agents';
import type { UserContext } from './types';
```

## Naming Conventions

- `camelCase` for variables and functions
- `PascalCase` for types, interfaces, classes, components
- `UPPER_SNAKE_CASE` for constants
- Prefix interfaces with `I` only if it helps clarity (not required)

## Generics

- Use meaningful names: `TData`, `TError`, `TResult`
- Avoid single letters unless very simple: `T`, `U`, `K`, `V`

## Enums vs Union Types

- Prefer union types for simple cases: `type Status = 'active' | 'inactive'`
- Use enums for complex cases with many values or computed values
