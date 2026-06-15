# PROMPT: Clean Unused Imports Across Admin and Client Screens

## Problem
Multiple files import icons, components, and modules that are never used in their JSX or StyleSheet. These bloat bundle size and create lint noise.

## Files to Fix

### 1. `app/admin.tsx`
Remove these unused imports:
- `LinearGradient` from `expo-linear-gradient` (line 3)
- `Menu`, `Search`, `Bell`, `MoreVertical`, `Award` from `lucide-react-native` (lines 9-23)
- These icons are passed as props to `AppHeader` which renders its own icons internally

### 2. `app/admin-orders.tsx`
Remove these unused imports:
- `LinearGradient` from `expo-linear-gradient` (line 3)
- `Menu`, `Bell`, `Filter`, `TrendingUp`, `ArrowUpDown` from `lucide-react-native` (lines 10-21)

### 3. `app/admin-customers.tsx`
Remove these unused imports (14 unused icons — biggest offender):
- `Bell`, `Users`, `UserPlus`, `TrendingUp`, `DollarSign`, `ChevronRight`, `ArrowUpDown`, `ShoppingBag`, `Calendar`, `ShieldCheck`, `AlertCircle`, `Clock`, `Star` from `lucide-react-native` (lines 8-24)
- Keep only what's actually rendered in the JSX (read the file to determine what's used)

### 4. `app/admin-cakes.tsx`
Remove these unused imports:
- `Menu`, `Bell`, `Filter`, `ChevronDown` from `lucide-react-native` (lines 6-12)

### 5. `app/admin-drivers.tsx`
Remove:
- `ShieldCheck` from `lucide-react-native` (line 10) if unused

### 6. `app/(tabs)/cart.tsx`
Remove:
- `Image` from `expo-image` (line 15)
- `LinearGradient` from `expo-linear-gradient` (line 17)
- `ShieldCheck` from `lucide-react-native` (line 33)

### 7. `src/screens/driver/DriverEarningsView.tsx`
Remove:
- `LinearGradient` from `expo-linear-gradient` (line 19) — SVG's own `LinearGradient` is aliased as `SvgLinearGradient`
- `BlurView` from `expo-blur` (line 20)
- `ArrowRight`, `ChevronRight` from `lucide-react-native` (lines 41, 45)

## What to Do
For each file:
1. Read the file fully
2. Check which imports are actually used in JSX or StyleSheet
3. Remove unused imports
4. Do NOT add comments

## Verify
1. Each file compiles without errors after removing imports
2. No functionality is lost (verify by checking icon/component usage in JSX)
3. Run `npx tsc --noEmit` to confirm no new errors
