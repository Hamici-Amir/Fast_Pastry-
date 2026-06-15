# Fix Bottom Tab Bar Spacing — All Actors (Client / Admin / Driver)

## Problem

The 3 bottom tab bars use `gap: 6` (CSS Flexbox `gap` property) for spacing between tab icons. This `gap` property is **not reliably supported** across React Native versions (requires RN ≥ 0.71) and provides **no visible breathing room** between icons at only 6px.

The result: icons feel cramped, touching edges, and the bar looks like a solid block rather than a set of distinct buttons.

## Actors & Files

| Actor   | File | Icon Count |
|---------|------|-----------|
| Client  | `src/components/navigation/TabBar.tsx` | 5 (dynamic, filtered from `state.routes`) |
| Admin   | `src/components/navigation/AdminTabBar.tsx` | 5 (static `TABS` array) |
| Driver  | `src/components/navigation/DriverTabBar.tsx` | 5 (static `TABS` array) |

All 3 files share the same pattern: a row `container` with `gap: GAP`, and each tab gets `width: tabW`. The indicator animates via `translateX: currentIndex * (tabW + GAP)`.

## Fix (apply identically to all 3 files)

### 1. Remove `gap` from container style

```diff
 container: {
   flexDirection: 'row',
   width: TAB_BAR_WIDTH,
   height: 72,
   borderRadius: 36,
   justifyContent: 'center',
   alignItems: 'center',
   paddingHorizontal: PAD,
-  gap: GAP,
   borderWidth: 1.5,
   ...
 },
```

### 2. Change GAP to 10 for visible breathing room

```diff
-const GAP = 6;
+const GAP = 10;
```

### 3. Add `marginRight` to each tab (except last)

Each tab gets `marginRight: idx < count - 1 ? GAP : 0`.

In **TabBar.tsx** (dynamic routes):
```diff
-{visibleRoutes.map((route) => {
+{visibleRoutes.map((route, idx) => {
   ...
   return (
     <TouchableOpacity
       key={route.key}
       ...
-      style={[styles.tab, { width: tabW }]}
+      style={[styles.tab, { width: tabW, marginRight: idx < count - 1 ? GAP : 0 }]}
     >
```

In **AdminTabBar.tsx** and **DriverTabBar.tsx** (static arrays):
```diff
-{TABS.map((tab) => {
+{TABS.map((tab, idx) => {
   ...
   return (
     <TouchableOpacity
       key={tab.id}
       ...
-      style={[styles.tab, { width: tabW }]}
+      style={[styles.tab, { width: tabW, marginRight: idx < TABS.length - 1 ? GAP : 0 }]}
     >
```

### 4. Verify indicator position formula

The indicator already uses `currentVisibleIndex * (tabW + GAP)` for `translateX`. Since `marginRight` adds the same `GAP` pixels to each tab (except last), the indicator step matches the visual tab spacing. No change needed to the indicator logic.

### 5. Verify the `count` / `tabW` calculation

- `innerW = TAB_BAR_WIDTH - PAD * 2`
- `tabW = (innerW - GAP * (count - 1)) / count`

This subtracts total gap space (`GAP * (count - 1)`) from available width before dividing by `count`. This gives each tab its exact width. The `marginRight: GAP` on each tab (except last) adds exactly `GAP * (count - 1)` total spacing, which matches what was subtracted. The bar lays out perfectly.

For **TabBar.tsx**:
- `TAB_BAR_WIDTH = width - 40`
- `count = visibleRoutes.length`

For **AdminTabBar.tsx** / **DriverTabBar.tsx**:
- `TAB_BAR_WIDTH = Math.min(width - 40, 420)`
- `count = TABS.length` (= 5)

## Result

- 10px visible gap between every icon
- No reliance on `gap` CSS property (uses `marginRight` = works on all RN versions)
- Indicator pill animates correctly to each tab
- Consistent spacing across Client, Admin, and Driver

## Verification

1. Launch app as CLIENT → tab bar shows 5 icons with 10px gaps
2. Launch app as ADMIN → same layout, admin-style colors
3. Launch app as DRIVER → same layout, driver-style colors
4. Tap each tab → indicator slides to correct position
