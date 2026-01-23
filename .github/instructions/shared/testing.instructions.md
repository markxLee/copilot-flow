---
applyTo: '**/*.test.ts,**/*.spec.ts,**/__tests__/**'
---

# Shared Testing Standards

> Master copy in `copilot-flow/.github/instructions/shared/`
> Run `sync instructions` to sync to other workspace roots

## Testing Framework

- Jest 29.x with ts-jest
- Place tests next to source files or in `__tests__/` directories
- Use `.test.ts` or `.spec.ts` suffix

## Test Structure

```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // Setup
    });

    it('should do expected behavior', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      // ...
    });
  });
});
```

## Mocking

- Mock external dependencies (APIs, databases)
- Use `jest.mock()` for module mocks
- Use `jest.spyOn()` for partial mocks

```typescript
// Mock entire module
jest.mock('@clearer/utils', () => ({
  tryCatch: jest.fn(),
}));

// Spy on specific function
jest.spyOn(service, 'fetchData').mockResolvedValue({ data: [] });
```

## Async Testing

```typescript
// ✅ CORRECT: Use async/await
it('should fetch data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// ✅ CORRECT: Test error handling
it('should handle errors', async () => {
  await expect(fetchData('invalid')).rejects.toThrow('Not found');
});
```

## Test Naming

- Use descriptive names: `should return user when id is valid`
- Group related tests with `describe`
- Test both happy path and error cases
