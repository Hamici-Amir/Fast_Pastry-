# PROMPT: Fix `as any` Type Assertions on Router Navigation

## Problem
32 occurrences of `router.push(... as any)` or `router.replace(... as any)` exist across the codebase. This bypasses Expo Router's type-safe route checking, meaning:
- Typos in route names won't be caught at compile time
- Route parameter mismatches won't be flagged
- Refactoring routes (renaming/moving files) becomes risky

## What to Do

For each `router.push(... as any)` and `router.replace(... as any)`:

1. **If the route is a known app route** (exists as a file in `app/`), use the correct typed string literal. Expo Router v3+ supports string literals directly:
   ```tsx
   // Instead of:
   router.push('/catalogue' as any)
   // Use:
   router.push('/(tabs)/catalogue')
   ```

2. **If the route has params**, use the array form:
   ```tsx
   // Instead of:
   router.push(`/tracking?orderId=${orderId}` as any)
   // Use:
   router.push(`/(tabs)/tracking?orderId=${orderId}`)
   ```

3. **If the route doesn't exist yet**, either create the screen file or find the correct existing path.

## Files to Check

Search the entire codebase for the pattern `as any` near `router.push` or `router.replace`:

```bash
rg "router\.(push|replace)\(.*as any" --include "*.tsx" --include "*.ts"
```

Fix each one with the correct typed route string.

## Verify
1. All `router.push(... as any)` and `router.replace(... as any)` are eliminated
2. Each fixed route navigates to the correct screen
3. No broken navigation paths
4. Run `npx tsc --noEmit` to confirm no new errors
