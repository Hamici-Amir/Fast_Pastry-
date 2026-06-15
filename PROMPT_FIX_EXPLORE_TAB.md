# PROMPT: Fix the Explore Tab Dead End

## File
`app/(tabs)/explore.tsx`

## Problem
This file is the default Expo Router template boilerplate. It contains:
- Expo onboarding text ("This app includes example code to help you get started.")
- Generic collapsible sections about file-based routing, images, animations
- References to template components (`@/components/external-link`, `@/components/parallax-scroll-view`)
- A hardcoded `require('@/assets/images/react-logo.png')` for an Expo logo

Users who tap "See All" on the home screen (`RecommendationGrid.tsx` routes to `/(tabs)/explore`) land on this boilerplate.

## What to Do

### Option A: Redirect to Catalogue (Recommended)
Replace the entire file content with an immediate `router.replace('/catalogue')` redirect. The catalogue screen (`app/(tabs)/index.tsx` or `src/screens/CatalogueScreen.tsx`) already shows all products with proper API-driven data.

```tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const router = useRouter();
  useEffect(() => { router.replace('/catalogue'); }, []);
  return null;
}
```

Then find and update the reference in `RecommendationGrid.tsx`:
- The "See All" `TouchableOpacity` uses `router.push('/(tabs)/explore')` — change to `router.push('/catalogue')`

### Option B: Build a Real Explore/Catalogue Screen
If you want a dedicated explore screen, build it using the existing `useCakes()` or `useAdmin()` hooks to fetch and display all cakes in a grid/list layout. Use `FlashList` from `@shopify/flash-list` for performance. Reference the existing `CatalogueScreen` pattern.

### Option C: Hide the Tab
If the explore tab serves no purpose, remove it from the tab navigator in `app/(tabs)/_layout.tsx`. Also update `RecommendationGrid.tsx` to point "See All" somewhere useful (like the orders tab or profile tab).

## Additional Fix
In `src/components/home/RecommendationGrid.tsx`, verify the "See All" button routes correctly. Currently uses `router.push('/(tabs)/explore')`. Change to `router.push('/catalogue')` if going with Option A.

## Verify
1. Tapping "See All" on the home screen does NOT show Expo boilerplate text
2. The explore tab (if kept) shows real app content
3. No broken routes or import errors
