
# Prompt: Replace All Remaining Mock Data with Real API Calls

## Context

This is a React Native (Expo) app with a Node.js/Express backend. The app has a `src/services/api.ts` client that wraps axios with base URL `http://localhost:3000/api`. Auth tokens are stored via `expo-secure-store` and attached automatically.

The app uses:
- React Context for auth (`src/context/AuthContext.tsx`) with `useAuth()` providing `user`, `token`, etc.
- React Context for cart (`src/context/CartContext.tsx`) with `useCart()` providing `items`, `addItem`, `updateQuantity`, `removeItem`, `clearCart`, `getCartTotal()`
- Socket.io for real-time (`src/services/socket.ts`) — connects when authenticated
- API client (`src/services/api.ts`) — exports `api` (axios instance with auth interceptor)

## Source Files (do NOT modify these)

Read these files to understand the API patterns:
- `app/(tabs)/orders.tsx` — example of fetching from API with loading/error states
- `app/(tabs)/profile.tsx` — example of fetch + mutation pattern
- `app/(tabs)/events.tsx` — example of fetching list from API
- `src/screens/driver/DriverDashboardView.tsx` — example of complex API integration with socket
- `src/services/api.ts` — API client
- `src/services/socket.ts` — Socket.io client

## Files to Modify

Wire each file below to the real API. Remove ALL hardcoded/mock data. Use proper loading, error, and empty states.

---

### 1. `src/components/home/HeroSlider.tsx`

**Current state:** `PROMOTIONS` array with 3 hardcoded objects (id, title, subtitle, image URL, color).

**Action:**
- Remove `PROMOTIONS` constant
- Fetch promotions from `GET /api/promotions`
- Display a loading skeleton while fetching
- Show an error state if the request fails (with retry button)
- If empty array returned, show nothing (or a default placeholder)
- Keep the carousel/swiper UI, just populate from API response

---

### 2. `src/components/home/RecommendationGrid.tsx`

**Current state:** `RECS` array with 4 hardcoded products (id, name, price, rating, image URL).

**Action:**
- Remove `RECS` constant
- Fetch recommendations from `GET /api/cakes?featured=true&limit=4`
- Loading skeleton while fetching
- Error state with retry
- Empty state ("No recommendations yet")

---

### 3. `src/components/home/HomeHeader.tsx`

**Current state:** Hardcoded user name `"Jane Cooper"`, hardcoded greeting logic, hardcoded avatar URL.

**Action:**
- Import `useAuth()` from `src/context/AuthContext`
- Use `user?.firstName ?? 'Guest'` for the name
- Use `user?.avatarUrl ?? null` for the avatar (fallback to initials if null)
- Compute greeting from current hour (this is fine to keep as-is)
- Remove all hardcoded string fallbacks

---

### 4. `src/components/home/LiveTrackingWidget.tsx`

**Current state:** Hardcoded driver name `"Jean-Pierre D."`, hardcoded temperature `"3.6°C"`, hardcoded map markers.

**Action:**
- Accept `orderId` as a prop (passed from parent)
- Fetch active delivery from `GET /api/orders/:id` or subscribe to socket event `order:tracking`
- Display real driver name, real temperature from backend
- For the map: if real coordinates exist in the API response (boutique lat/lng, destination lat/lng), render them; otherwise show a "no location data" placeholder
- Socket event to listen for: `delivery:locationUpdate`
- Loading/error/empty states

---

### 5. `app/chat.tsx`

**Current state:** `INITIAL_MESSAGES` array with 3 hardcoded messages, simulated automated reply after 2.5s, hardcoded order ref `"FP-892110"`.

**Action:**
- Accept `orderId` as route param (or from order context)
- Fetch initial messages from `GET /api/orders/:orderId/messages`
- Send new messages via `POST /api/orders/:orderId/messages`
- Listen for real-time messages via socket event `order:message`
- Remove the simulated 2.5s auto-reply
- Loading state while fetching messages
- Empty state ("No messages yet — start the conversation!")
- Error state with retry

---

### 6. `app/driver-notifications.tsx`

**Current state:** `INITIAL_NOTIFICATIONS` array with 5 hardcoded objects (id, type, title, body, timestamp, actionText, actionType).

**Action:**
- Remove `INITIAL_NOTIFICATIONS`
- Fetch notifications from `GET /api/notifications`
- Listen for real-time notifications via socket event `notification:new`
- Loading skeleton
- Empty state ("No notifications")
- Error state with retry
- Keep the existing notification card UI

---

### 7. `app/(tabs)/customizer.tsx`

**Current state:** 6 hardcoded arrays: `SIZES`, `FLAVORS`, `FROSTING_COLORS`, `DESIGNER_THEMES`, `TOPPINGS`, `TOPPERS`, `SUGAR_PRINTS`. Fallback cake object if no route params.

**Action:**
- Fetch cake base data from `GET /api/cakes/:id` (get `id` from route params or context)
- Fetch customization options from `GET /api/customization/options` which should return sizes, flavors, colors, themes, toppings, toppers, prints grouped together
- If the API doesn't have a dedicated endpoint yet, create separate fetches:
  - `GET /api/cakes/sizes`
  - `GET /api/cakes/flavors`
  - `GET /api/customization/themes`
  - etc.
- Loading skeleton for the entire customizer while data loads
- Error state with retry
- Remove all hardcoded fallback data

---

### 8. `app/checkout.tsx`

**Current state:** `SimulatedRouteMap` with hardcoded abstract SVG map, hardcoded `"Rue Royale Boutique"` and `"Cooper Residence"`, hardcoded delivery time `"3:00 PM"`, hardcoded delivery fee `$15.00`, hardcoded timeline in success overlay.

**Action:**
- Remove `SimulatedRouteMap` component entirely
- Show a text-based delivery summary instead (address, estimated time, driver name) from `GET /api/orders/:id`
- If real map coordinates available, conditionally show a map placeholder
- Fetch actual delivery fee from `POST /api/orders/validate` or `GET /api/config/delivery-fee`
- Loading state while order is being processed
- Error state if order validation fails

---

### 9. `app/tracking.tsx`

**Current state:** `SimulatedRouteMap` with hardcoded S-shaped route, hardcoded street names, hardcoded markers. Hardcoded `steps` array for status progression.

**Action:**
- Remove `SimulatedRouteMap` component
- Show a text-based tracking summary instead (current status, estimated delivery time, driver name/phone if assigned)
- If real coordinates available, conditionally show map
- Status steps should come from `GET /api/orders/:id` response (map the backend status enum to display steps)
- Listen to socket event `order:statusUpdate` for real-time status changes
- Loading skeleton
- Error state with retry
- Empty/not-found state if order doesn't exist

---

### 10. `app/driver-pending.tsx`

**Current state:** `DOCUMENTS` array with 4 hardcoded documents (id, title, icon, status, color). Hardcoded `"Estimated Approval Time: 24 - 48 Hours"`.

**Action:**
- Fetch documents/verification status from `GET /api/driver/documents`
- Loading skeleton
- Error state with retry
- Empty state ("No documents required")
- Fetch approval estimate from `GET /api/driver/verification-status` if available

---

### 11. `src/screens/OnboardingScreen.tsx`

**Current state:** `ONBOARDING_DATA` array with 3 hardcoded slides.

**Action:**
- Fetch onboarding content from `GET /api/config/onboarding`
- If that endpoint doesn't exist, keep the hardcoded data as-is but add a comment `// TODO: fetch from GET /api/config/onboarding when available`
- Loading state (show a simple loader during fetch)

---

### 12. `src/screens/CakeDetailsScreen.tsx`

**Current state:** Fallback data when API fields are missing: `[{ name: 'Premium ingredients', emoji: '🍽️', origin: '' }]` for ingredients, `[]` for reviews, `'Custom Craftsmanship'` for prepTime, `'Curated flavors'` for flavorProfile.

**Action:**
- Remove all hardcoded fallback values
- If API returns null/undefined for a field, simply don't render that section (conditionally render)
- For ingredients: if `cake.ingredients` is null/empty, hide the ingredients section entirely
- For reviews: if `cake.reviews` is null/empty, show "No reviews yet" empty state
- For missing optional fields, use `null` coalescing — don't fabricate values

---

### 13. `src/components/ui/AdminOrderCard.tsx` (line ~60)

**Current state:** Default prop `items = ['Signature Red Velvet (Med)', 'Gold Leaf Topping']` as hardcoded fallback.

**Action:**
- Remove the default value for `items` prop
- If `items` is undefined or empty, show "No items" text
- The parent component should always pass real items from the API

---

## General Rules

1. **Never hardcode user data** — always use `useAuth()`
2. **Never hardcode order data** — always fetch from API or receive as props/route params
3. **Never simulate server responses** — no fake timeouts, no hardcoded replies
4. **Every fetch must have 4 states:**
   - `loading` — show a skeleton/spinner
   - `error` — show error message with a retry button
   - `empty` — show "No X found" friendly message
   - `data` — render the actual content
5. **Use the existing `api` client** from `src/services/api.ts`
6. **Socket events** must use the existing socket from `src/services/socket.ts`
7. **Do not add comments** to the code itself
8. **Follow the existing code style** of each file (imports, component structure, etc.)
9. **Test after each file:** `npx expo start` and verify no TypeScript errors or crashes
10. **Do not modify files outside the list above**
