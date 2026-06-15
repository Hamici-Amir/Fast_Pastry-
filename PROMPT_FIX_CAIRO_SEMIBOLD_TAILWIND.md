# PROMPT: Fix Cairo-SemiBold Font Config Mismatch

## Problem
`app/_layout.tsx:135` loads `'Cairo-SemiBold': Cairo_600SemiBold` as a font asset, but `tailwind.config.js` does NOT define a `cairo-semibold` Tailwind font class. This means:

1. The font file is loaded and occupies memory on every app launch
2. No style in the app can actually reference `Cairo-SemiBold` via Tailwind classNames
3. The font weight is effectively dead code

## What to Do

### Option A: Add the Tailwind Config Entry
Add `'cairo-semibold': ['Cairo-SemiBold']` to the `fontFamily` section in `tailwind.config.js`:

```js
fontFamily: {
  'cairo': ['Cairo-Regular'],
  'cairo-medium': ['Cairo-Medium'],
  'cairo-semibold': ['Cairo-SemiBold'],  // Add this
  'cairo-bold': ['Cairo-Bold'],
  // ... poppins entries
}
```

### Option B: Stop Loading the Unused Font
Remove the `'Cairo-SemiBold': Cairo_600SemiBold` line from `app/_layout.tsx` font loader (line 135). This saves a network fetch and ~100KB of memory.

### Option C (Recommended): Drop Cairo Entirely
Since all Cairo font usages in StyleSheet blocks have been replaced with Poppins (per the font consolidation prompt), there is no reason to keep Cairo fonts loaded at all.

1. Remove ALL Cairo font loading from `app/_layout.tsx` (lines 133-136)
2. Remove Cairo font imports and `useFonts` entries
3. Remove Cairo entries from `tailwind.config.js`
4. Update any remaining Cairo classNames (check if Tailwind classes like `font-cairo` are used anywhere)

```bash
# Find any remaining Cairo font class usage
rg "font-cairo" --include "*.tsx" --include "*.ts"
```

## Verify
1. If adding config: `font-cairo-semibold` works as a Tailwind class
2. If removing Cairo: no `Cairo-` references remain except in comments or git history
3. App renders without font-related warnings
4. `npx tsc --noEmit` passes
