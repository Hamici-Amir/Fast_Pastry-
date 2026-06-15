# Fast Pastry — Fixes Applied

## 1. Bottom Tab Bar Spacing (`TabBar.tsx`, `AdminTabBar.tsx`, `DriverTabBar.tsx`)

**Before**: Used `gap: 6` CSS property on the container — unreliable in older RN versions and not visibly enough spacing.

**After**: 
- Removed `gap` from container styles
- Each tab now gets `marginRight: GAP` (except last) = explicit reliable spacing
- `GAP` increased from 6 → 10
- Indicator position calculation still uses `tabW + GAP` so animation stays accurate

## 2. Image URLs (seed data)

**Before**: Used `picsum.photos/seed/...` — random non-food images, not related to pastry.

**After**: All 5 cakes + 3 promotions use direct Unsplash photo URLs of real pastries:
- **Chocolat Royal**: `photo-1578985545062-69928b1d9587` (chocolate cake)
- **Framboise Éclat**: `photo-1565958011703-44f9829ba187` (raspberry pastry)
- **Voile de Mariée**: `photo-1464349095431-e9a21285b5f3` (elegant cake)
- **Soleil d'Été**: `photo-1488477181946-6428a0291777` (summer cake)
- **Paris-Brest Classique**: `photo-1509365465985-25d11c17e812` (French pastry)
- **NEW COLLECTION promo**: `photo-1558301211-0d8c8ddee6ec`
- **WEDDING OFFER promo**: same wedding cake photo
- **CHOCOLATE WEEK promo**: same chocolate cake photo

## 3. Seed Script Fixes (`prisma/seed.ts`)

**Problems**: 
- Cake `upsert` used `update: {}` — never updated image URLs on re-seed
- Promotions used `create` — created duplicates on every re-seed

**Fixes**:
- Cake upsert now: `update: { imageUrl: cakeData.imageUrl }`
- Promotions now: `await prisma.promotion.deleteMany()` before creating

## 4. Catalogue Price Ranges (`CatalogueScreen.tsx`)

**Before**:
```
Under 100 DA | 100 - 200 DA | 200 DA+
```
Max was `1000`, no `400+` range.

**After**:
```
All Prices | Under 100 DA | 100 - 200 DA | 200 - 400 DA | 400 DA+
```
Max is `999999` to cover all possible prices.

## 5. Server-Side Price Filtering

**Before**: Price filtering was client-only via `filteredCakes` memo — pagination broke filtering.

**After**: 
- `backend/src/services/catalog.service.ts`: accepts `minPrice`/`maxPrice` → `basePrice: { gte, lte }`
- `backend/src/controllers/client_catalog.controller.ts`: parses `minPrice`/`maxPrice` from query as floats
- `src/hooks/useCakes.ts`: `fetchCatalog` supports `minPrice`/`maxPrice` params
- `CatalogueScreen.tsx`: `applyFilters()` sends price range to API on category change and filter apply

## 6. Search Resets Category

**Before**: `handleSearchChange` called `searchCakes(text)` without resetting `selectedCategory` — stale category persisted.

**After**: `handleSearchChange` now calls `setSelectedCategory('All')` before searching.

## 7. Search Clears Category from Params

**Before**: `searchCakes` spread `currentParams.current` which might include stale `category`.

**After**: `searchCakes` destructures `category` out before spreading, so search never carries a stale category.

## 8. Reset Filters More Complete

**Before**: `handleResetFilters` only reset `selectedPriceRange` and `searchQuery`.

**After**: Also resets `selectedCategory` to `'All'` and calls `fetchCatalog()` to refresh.

## 9. HeroSlider Enhancements (`HeroSlider.tsx`)

**Additions**:
- **Tap navigation**: `onPress` on promotion cards → `router.push(item.link)`
- **Pagination dots**: Row of dots below the carousel; active dot is gold (`#D4A373`), inactive is translucent
- **Auto-scroll**: Every 4 seconds scrolls to next promotion; uses `useRef<Animated.FlatList>` + `setInterval`
- **Image error fallback**: `onError` → shows beige placeholder with "Image unavailable" text

## 10. ProductCarousel Tap Navigation

**Before**: ProductCard had no `onPress` handler — clicking did nothing.

**After**: Added `router.push(`/cake/${product.id}`)` via `onPress` on the card.

## 11. `CakeItem.image` → `CakeItem.imageUrl`

Renamed the `CakeItem` interface field from `image` to `imageUrl` to match the backend field name. Updated all references in `CatalogueScreen.tsx`.

## 12. Active Backend Services

| Service | URL | Status |
|---------|-----|--------|
| Fast Pastry API | `http://192.168.1.38:3000` | Running (PID varies) |
| Expo dev server | `http://localhost:8081` | LAN mode |
| PostgreSQL | `localhost:5243` (PG 13) | Running |

## Environment

- `.env`: `EXPO_PUBLIC_API_URL=http://192.168.1.38:3000/api`
- `backend/.env`: `DATABASE_URL="postgresql://postgres:postgres@localhost:5243/fast_pastry?schema=public"`

## Restart Commands

```powershell
# Backend (from backend/)
cmd.exe /c "start /B node.exe ""node_modules\ts-node\dist\bin.js"" ""src\server.ts"" > ""backend.log"" 2>&1"

# Expo (from project root)
cmd.exe /c "start /B npx.cmd expo start --lan > ""expo.log"" 2>&1"
```
