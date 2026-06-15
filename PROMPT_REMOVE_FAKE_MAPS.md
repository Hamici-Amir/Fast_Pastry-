# PROMPT: Replace Fake Maps with Real Maps or Strip Them

## Files
- `app/checkout.tsx` — `SimulatedRouteMap` component (lines 111-159), hardcoded "Rue Royale Boutique", "Cooper Residence", "Refrigerated Courier departed at 3:00 PM"
- `app/tracking.tsx` — `InteractiveLogisticsMap` component (lines 91-214), hardcoded "RUE ROYALE", "BD HAUSSMANN", "AVENUE MONTAIGNE", "Rue Royale Boutique", "Cooper Residence", "CLOCHE SENSOR: 3.6°C OPTIMAL CHILL"

## What to Do

### Option A: Real Maps (Recommended)
Install `react-native-maps` and replace both fake map components with real `MapView` + `Marker`.

**Checkout (`app/checkout.tsx`)**:
- Replace `SimulatedRouteMap` with a real map showing the user's selected delivery address pinned via coordinates
- Remove hardcoded "Rue Royale Boutique", "Cooper Residence", "Refrigerated Courier departed at 3:00 PM"
- Keep it compact — a small preview map is enough

**Tracking (`app/tracking.tsx`)**:
- Replace `InteractiveLogisticsMap` with a real `MapView`
- Use the real `driverLocation` state (already wired via socket `driver:location` event) to show the courier's actual position
- Remove all hardcoded street lines, Paris street names, S-shaped dotted route, decorative sparkles
- Remove the fake animated courier van loop (`useEffect` with `withRepeat(withTiming(...))`) — replace with a real marker that updates from `driverLocation` state
- Remove the hardcoded "CLOCHE SENSOR: 3.6°C" badge
- Remove fake `handleCallDriver` alert — wire to `Linking.openURL('tel:...')` or remove if no real phone available
- Remove hardcoded emoji rating stars, use numeric rating from API data instead

### Option B: Strip Maps Entirely
If real maps are not feasible, delete both `SimulatedRouteMap` and `InteractiveLogisticsMap` and replace with clean non-map alternatives:

**Checkout**: Show a simple address card with the selected address, a text-based distance estimate, and a "White-Glove Refrigerated Courier" badge.

**Tracking**: Show a delivery status timeline card (already present in the file) with ETA and milestones. Remove the map section entirely. The timeline + ETA is more useful than a fake map.

## Constraints
- `getSocket()` returns `Promise<Socket>` — for tracking, listen to `driver:location` and `order:updated` events (already set up)
- API endpoint `GET /client/orders/{orderId}/status` returns `{ order, milestones }` (already used)
- Use `useLocalSearchParams<{ orderId: string }>()` to get orderId from route params
- Use `react-native-maps` if available, or `expo-maps` for Expo
- Keep existing loading/error states in tracking.tsx (they're already wired correctly)
- Do NOT add comments explaining the changes

## Verify
1. `app/checkout.tsx` — no `SimulatedRouteMap`, no "Rue Royale Boutique", no "Cooper Residence", no "Refrigerated Courier departed at 3:00 PM"
2. `app/tracking.tsx` — no `InteractiveLogisticsMap`, no Paris street names, no animated courier loop, no fake temperature badge
3. Both files render correctly without errors
