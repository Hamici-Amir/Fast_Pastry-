# PROMPT: Remove Fake API setTimeout Delays

## Problem
Three files use `setTimeout` with a fixed delay to simulate network/processing time instead of relying on actual API call timing. This makes every interaction feel equally slow regardless of network conditions.

## Files to Fix

### 1. `app/(tabs)/cart.tsx:253` — 800ms fake checkout delay
```tsx
setTimeout(() => {
  router.push(`/checkout?deliveryMode=${deliveryMode}&...`);
}, 800);
```
The 800ms delay before navigating to checkout serves no purpose. It adds artificial latency.

**Fix**: Remove the `setTimeout` wrapper and call `router.push()` immediately.

### 2. `src/screens/CatalogueScreen.tsx:135` — 1800ms fake "Add to Cart" delay
```tsx
setTimeout(() => {
  // add to cart logic...
}, 1800);
```
Artificially delays adding to cart by 1.8 seconds.

**Fix**: Remove the `setTimeout` wrapper. The actual API call to `POST /client/cart` already provides real timing. If you want a loading state, use the API promise's timing (it will be fast on good networks, slower on bad ones — which is realistic).

### 3. `src/screens/driver/DriverEarningsView.tsx:155` — 1500ms fake cashout delay
```tsx
setTimeout(() => {
  // show success state
}, 1500);
```
Artificially delays showing success after cashout.

**Fix**: Remove the `setTimeout`. Show success immediately upon API response, or let the API call duration determine the timing.

## Additional Check
Search for any other `setTimeout` calls in `app/` and `src/` that look like they're simulating API latency (delay > 200ms not used for UX purposes like debounce or scroll positioning).

## Verify
1. Cart checkout navigates immediately, not after 800ms
2. Catalogue "Add to Cart" responds immediately (real API timing only)
3. Driver cashout shows success immediately upon API response
4. No fake latency patterns remain
