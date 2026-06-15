# PROMPT: Kill Infinite Loop Animations

## Files to Fix

### 1. `app/tracking.tsx` — `InteractiveLogisticsMap` (lines 91-145)
- `useEffect` runs `withRepeat(withTiming(1, { duration: 8000 }), -1, false)` — courier van loops forever
- `AmbientSparkle` component loops opacity/scale forever with `withRepeat(..., -1, true)`
- The map component renders `SPARKLE_COUNT = 10` decorative sparkles that continuously animate

### 2. `src/components/home/LiveTrackingWidget.tsx` (lines 27-46)
- `pulseScale`, `pulseOpacity`, `progressPercent` all use `withRepeat(withTiming(...), -1, ...)` — three infinite animations on a single widget

### 3. `app/checkout.tsx` — `FloatingGoldDustFlake` (lines 52-108)
- `GOLD_DUST_COUNT = 18` gold dust particles each loop `translateY`, `translateX` with `withRepeat(..., -1, ...)` — 36 infinite animation instances

## What to Do

For each infinite animation:
1. Change `withRepeat(..., -1, ...)` to `withRepeat(..., 1, false)` or remove `withRepeat` entirely
2. Use single-shot `withTiming` or `withSpring` that plays once on mount and stops
3. For entrance effects, use `FadeInDown`, `FadeInRight` from `react-native-reanimated` (single entrance, no loop)
4. Remove `useSharedValue` + `useAnimatedStyle` patterns that are only used for looping animations if the visual can be achieved with static styles

### Specific Changes

**tracking.tsx**:
- `courierProgress` — remove infinite loop; use a single 8s animation that plays once, then stops at final position (or use real driver position data)
- `AmbientSparkle` — remove the component entirely or make it static (fixed opacity, no animation)
- Remove `SPARKLE_COUNT` and `AmbientSparkle` rendering from `InteractiveLogisticsMap`

**LiveTrackingWidget.tsx**:
- `pulseScale` — remove `withRepeat(-1)`, use a single `withTiming(1.6)` on mount
- `pulseOpacity` — remove `withRepeat(-1)`, use a single `withTiming(0)` on mount  
- `progressPercent` — remove `withRepeat(-1)`, animate once from 0 to 1 and stop at a realistic position (e.g., based on real delivery status if available)

**checkout.tsx**:
- `FloatingGoldDustFlake` — remove the component entirely. The gold dust overlay adds dramatic visual noise on top of an already busy success screen
- Remove `GOLD_DUST_COUNT` constant
- Remove `FloatingGoldDustFlake` rendering from the success overlay

## Verify
1. No `withRepeat(..., -1, ...)` patterns remain in these three files
2. All exit animations use `FadeOutLeft` or similar from `react-native-reanimated`'s entering/exiting (not custom `withRepeat` loops)
3. Components render without animation-related errors
4. App performance improves — no animations running when components are off-screen
