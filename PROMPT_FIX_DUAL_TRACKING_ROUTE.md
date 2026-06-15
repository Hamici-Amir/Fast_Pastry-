# PROMPT: Fix Ambiguous Dual Tracking Route

## Problem
Two files define a `tracking` route:

| File | Route |
|------|-------|
| `app/tracking.tsx` | `/tracking` (standalone) |
| `app/(tabs)/tracking.tsx` | `/(tabs)/tracking` (inside tab layout) |

This causes routing ambiguity. When any component calls `router.push('/tracking')`, Expo Router may resolve to either file depending on context, leading to inconsistent behavior.

## What to Do

### Option A: Merge into One File (Recommended)
Move the standalone `app/tracking.tsx` logic into `app/(tabs)/tracking.tsx` (or vice versa) and delete the duplicate.

1. Read both files
2. Compare them — they likely contain the same tracking/delivery status screen
3. Merge the best of both into one file (keep the one that has the most complete implementation)
4. Delete the duplicate file
5. Update all references that point to the deleted route

### Option B: Dedicate Each Route
Keep both but make their purposes clear:
- `app/tracking.tsx` — standalone deep link (e.g., from push notification)
- `app/(tabs)/tracking.tsx` — in-app tab screen

Ensure every `router.push('/tracking')` call explicitly uses the full path `/(tabs)/tracking` or `/tracking` depending on intent.

## Update References
Find all files that reference `tracking` in route navigation:

```bash
rg "tracking" --include "*.tsx" --include "*.ts" -l
```

Update their `router.push()` targets to the correct, unambiguous path.

## Verify
1. Only one `tracking` route file exists after merge
2. All navigation references point to the correct path
3. `npx tsc --noEmit` passes
