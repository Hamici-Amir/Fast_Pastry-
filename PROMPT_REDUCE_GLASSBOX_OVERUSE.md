# PROMPT: Reduce GlassBox Overuse and Font Variety

## Problem
The app wraps nearly every card, row, button, and badge in `GlassBox` component. Combined with 7+ font weights across 2 font families (Poppins + Cairo), rendering is slow on lower-end devices.

## What to Do

### Replace GlassBox with native Views in non-hero elements

Scan all `.tsx` and `.ts` files under `app/` and `src/` (exclude `node_modules`, `.expo`). For each `GlassBox` usage, check if it is:

**Keep GlassBox** (hero/prominent elements):
- Hero slider cards
- Featured cake cards
- Modal/dialog containers
- Header/AppHeader items
- The 1-2 most prominent cards per screen

**Replace with native `<View>`** (everything else):
- List item rows (e.g., flavor list, address cards, order items)
- Sub-badges, small labels, timestamp containers
- Tab buttons, filter chips
- Secondary info cards (like the courier profile card in tracking)
- Pricing breakdown panels
- Any GlassBox that has zero or near-zero border/background customization
- Timeline step indicators, milestone cards
- Notification items
- Driver document cards

Use a simple `<View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(232,211,194,0.3)' }}>` — no glass effect needed.

### Consolidate Font Families

Pick **one** primary font family:
- **Poppins** for all body text, labels, headings
- Drop `Cairo` entirely, or limit it to decorative elements only

Reduce weights to a maximum of 3 per family:
- `Poppins-Regular` (body)
- `Poppins-SemiBold` (labels, buttons)
- `Poppins-Bold` (headings, prices)

Remove usage of: `Cairo-Bold`, `Cairo-Medium`, `Cairo-SemiBold`, `Cairo-Regular`, `Poppins-Medium`, `Poppins-Light`, `Poppins-ExtraBold` — replace with one of the 3 above.

### Specific High-Impact Files

| File | GlassBox Count | Font Variants | Action |
|------|---------------|---------------|--------|
| `app/(tabs)/customizer.tsx` | ~40 | 6+ | Replace 80% of GlassBox with View, reduce to 3 font variants |
| `app/tracking.tsx` | ~8 | 6+ | Replace non-hero GlassBox with View, consolidate fonts |
| `app/driver-notifications.tsx` | ~8 | 5+ | Replace notification card GlassBox with View |
| `app/driver-pending.tsx` | ~6 | 4+ | Replace doc cards with View |
| `app/checkout.tsx` | ~10 | 6+ | Replace address cards, date cards with View |
| `src/components/home/` | varies | varies | Keep GlassBox on HeroSlider only |

### Find All GlassBox Usages
```bash
rg "GlassBox" --include "*.tsx" --include "*.ts" -l
```

For each file, replace GlassBox with `<View>` unless it's a hero element.

### Find All Cairo Font Usages
```bash
rg "Cairo-" --include "*.tsx" --include "*.ts" -l
```

For each match, replace `Cairo-*` with the equivalent `Poppins-*` weight.

## Verify
1. App renders without breaking on any screen
2. No import of `GlassBox` remains in files where it was removed (remove the import too)
3. No `Cairo-*` font references remain in `StyleSheet.create()` blocks
4. Visual hierarchy is maintained — hero elements still use GlassBox
5. `npm run lint` passes (or equivalent)
