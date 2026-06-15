# PROMPT: Kill Remaining Infinite Loop Animations

## Files to Fix

### 1. `app/driver-pending.tsx` — 3 Ininfinite Reanimated Loops
Lines 57-76: three `withRepeat(..., -1, ...)` loops:

- **floatY** (lines 57-64): `withRepeat(withSequence(withTiming(-12), withTiming(0)), -1, true)` — document icon floats forever
- **pulseScale** (lines 66-70): `withRepeat(withTiming(1.15, { duration: 1000 }), -1, true)` — scales forever
- **pulseOpacity** (lines 72-76): `withRepeat(withTiming(0.4, { duration: 1000 }), -1, true)` — fades forever

**Fix**: Remove `withRepeat` wrapping. Use single-shot `withTiming` with final values, or remove the animation entirely since these are decorative (document icon doesn't need to float, pulse can be static).

### 2. `src/components/ui/Skeleton.tsx` — 1 Infinite Reanimated Loop
Line 22-29: shimmer skeleton opacity loops with `withRepeat(withSequence(...), -1, true)`

**Fix**: Change `-1` to `3` (play 3 times then stop) since skeletons only need to shimmer briefly while content loads. Or keep it as-is since skeleton shimmer is a standard pattern that stops when replaced — this is lower priority.

### 3. `src/screens/SplashScreen.tsx` — 5 Legacy `Animated.loop()` Calls
Using the old `react-native` `Animated` API (not Reanimated):

- Line 22: gold dust particle animation
- Line 33: logo pulse animation
- Line 51: decorative element animation
- Line 115: progress bar animation
- Line 172: another gold dust-like animation

**Fix**: 
- Replace `Animated.loop()` with single `Animated.timing()` that plays once and stops
- For gold dust particles (splash screen), this is the one place where an entrance animation is acceptable — but it should play once, not loop
- For the progress bar, make it animate to 100% once and stop

## What to Do

1. Read each file
2. Replace all `withRepeat(..., -1, ...)` with single-shot animations or remove entirely
3. Replace all `Animated.loop()` with single-shot `Animated.timing()`
4. Do NOT add comments

## Verify
1. No `withRepeat(..., -1)` remains in any of the three files
2. No `Animated.loop()` remains in SplashScreen.tsx
3. Components render without animation-related errors
4. Visual transitions are still smooth (single entrance animation on mount)
