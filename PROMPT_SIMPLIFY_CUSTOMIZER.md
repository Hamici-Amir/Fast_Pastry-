# PROMPT: Slim Down the Customizer

## File
`app/(tabs)/customizer.tsx` — 2700 lines, one of the largest files in the codebase

## What to Do

Reduce complexity by removing low-value features and consolidating into a single, clean scrollable panel. Keep only what a user needs to configure a cake order.

### Remove These Features Entirely

1. **Perspective switcher** (front/top view toggle + `Compass` button) — removes ~60 lines of rendering logic for `perspective === 'front'` vs `'top'`
2. **Backdrop switcher** (sunrise/midnight/chantilly studio background toggle) — removes `backdropStyle` state, `getAmbientStyles()`, and the toggle button
3. **Gifting mode** (glass dome cloche overlay) — removes `giftingMode`, `giftCardMessage`, `giftingStationery`, `getStationeryCardLayout()`, and the entire bespoke gift card section
4. **3D tier animations** (animated tier stacking with `animStyleTop`, `animStyleMiddle`, shared values) — removes ~30 lines of animation variables, effects, and usage
5. **Edible sugar print upload simulation** — removes `sugarPrintUploaded`, `selectedSugarPrint`, `isUploading`, `showPresetsModal`, `DEFAULT_SUGAR_PRINTS`, the preset selection modal, and the fake `setTimeout` upload delay
6. **Calligraphy text** — removes `calligraphyText`, the text input, and its overlay rendering on the cake preview
7. **Designer themes carousel** — removes `DESIGNER_THEMES`, `handleApplyTheme`, and the themed gradient cards
8. **Frosting finish options** (mirror/velvet/rustic) — keep only one default finish, remove the selector
9. **Piping rim styles** (pearls/goldShells/minimal) — keep only one default, remove the selector
10. **Gold leaf sparkles overlay** — remove the `goldLeafEmitterOverlay` with 5 positioned `Sparkles` icons

### Keep These Features

1. **Size selector** (1/2/3 tiers) — essential for pricing
2. **Flavor selector** (4 flavors) — essential
3. **Frosting color picker** (10 colors) — core visual choice
4. **Toppings grid** (macarons/berries/orchids/goldLeaf) — core customization
5. **Topper selector** (none/birthday/anniversary/celebrate) — core choice
6. **Price computation** (already wired to `POST /catalog/compute-price`)
7. **Add to cart** button (already wired to `POST /client/cart`)

### Simplify the Cake Preview

Replace the 200+ line 3D cake preview with a single centered circle showing the selected frosting color. Remove:
- Tier stacking with animations
- Topping micro-rendering on the cake face
- Sugar print overlay
- Calligraphy text overlay
- Frosting finish visual effects (rustic streaks, gloss sheen, velvet overlay)
- Piping dot rendering
- Pedestal, glass dome, topper stick
- The entire front-view/top-view rendering split

Use a single `<View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: activeColor.hex }}>` with the selected emoji topper and topping list shown as a simple text label below it.

### Consolidate the Tab Panels

Remove the 5-tab horizontal scroll (`tier` | `color` | `toppings` | `toppers` | `print`). Replace with a single vertically scrollable list showing all options in order:
1. Size (3 cards inline)
2. Flavor (radio list)
3. Color (scrollable swatch row)
4. Toppings (toggle grid, 2 columns)
5. Topper (radio list)

### Result
Target: ~500-800 lines total (down from 2700). Clean, fast, and the user can see all options without horizontal tab switching.

## Verify
1. `app/(tabs)/customizer.tsx` compiles without errors
2. Users can select size, flavor, color, toppings, topper
3. Price updates reactively
4. "Add custom creation" button submits to cart correctly
5. No dead code or unused imports remain
