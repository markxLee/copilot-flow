---
applyTo: '**'
---

# Shared Coding Practices

> Master copy in `copilot-flow/.github/instructions/shared/`
> Run `sync instructions` to sync to other workspace roots

## Error Handling

- Use the `tryCatch` utility function for all asynchronous operations where possible
- `tryCatch` returns `{ data: T, error: null } | { data: null, error: E }`
- Use try/catch for synchronous operations only
- Always log errors to console for debugging
- Return user-friendly error messages in API responses
- Never expose sensitive information in error messages

```typescript
// ✅ CORRECT: Type-safe error handling
import { tryCatch } from '@clearer/utils';

const { data, error } = await tryCatch(fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error);
  return { success: false, message: 'User not found' };
}
// data is safely typed here

// ❌ WRONG: Raw try/catch for async operations
try {
  const data = await fetchUser(id);
} catch (error) {
  // Avoid this pattern for async
}
```

## Code Style

- Follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use consistent indentation (2 spaces)
- Use Prettier for auto-formatting

## Package Management

- Use `pnpm` as the package manager (except Shopify app uses npm)
- Run pnpm scripts from the root of the project
- Use `workspace:*` protocol for internal dependencies

## Monorepo

- Turborepo manages build orchestration
- Respect package build order (check turbo.json)
- Use `@clearer/*` import aliases, not relative paths across packages
