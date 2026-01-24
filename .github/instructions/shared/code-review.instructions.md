---
applyTo: '**'
---

# Code Review Guidelines

> Master copy in `copilot-flow/.github/instructions/shared/`
> Run `sync instructions` to sync to other workspace roots

## Review Checklist

### 1. Error Handling
- [ ] Async operations use `tryCatch` utility
- [ ] Errors are logged with context
- [ ] User-facing errors are friendly (no stack traces)
- [ ] Edge cases are handled

### 2. Type Safety
- [ ] No `any` types (use `unknown` + type guards)
- [ ] Explicit return types for exported functions
- [ ] Proper null/undefined handling
- [ ] Generic types are meaningful (`TData` not `T`)

### 3. Code Organization
- [ ] Imports are organized (external → internal → relative)
- [ ] Functions are small and focused
- [ ] Complex logic is commented
- [ ] Dead code is removed

### 4. Security
- [ ] No hardcoded secrets
- [ ] User input is validated
- [ ] SQL uses parameterized queries (Prisma)
- [ ] URLs are validated before fetch

### 5. Performance
- [ ] No N+1 queries
- [ ] Large lists are paginated
- [ ] Expensive operations are cached
- [ ] Unnecessary re-renders avoided (React)

### 6. Testing
- [ ] New features have tests
- [ ] Edge cases are tested
- [ ] Mocks are appropriate
- [ ] Tests are readable

## Review Comments Format

```
// MUST: <critical issue that blocks merge>
// SHOULD: <important improvement>
// CONSIDER: <optional suggestion>
// QUESTION: <clarification needed>
// PRAISE: <good pattern worth noting>
```

## Common Issues to Flag

### Error Handling
```typescript
// ❌ Flag this
try {
  await doSomething();
} catch (e) {
  // Silent failure
}

// ✅ Suggest this
const { data, error } = await tryCatch(doSomething());
if (error) {
  console.error('Context:', error);
  return { success: false };
}
```

### Type Safety
```typescript
// ❌ Flag this
function process(data: any) { ... }

// ✅ Suggest this
function process(data: unknown) {
  if (!isValidData(data)) throw new Error('Invalid');
  // data is now typed
}
```

### Security
```typescript
// ❌ Flag this
const API_KEY = "sk-1234567890";

// ✅ Suggest this
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error('API_KEY required');
```

## Approval Criteria

### Approve if:
- All MUST items are addressed
- No security vulnerabilities
- Tests pass
- Code is readable

### Request changes if:
- Security issues present
- Missing error handling
- Breaking changes without migration
- Tests are missing for new features
