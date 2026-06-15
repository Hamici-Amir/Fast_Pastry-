# Add Multi-Language Support — Arabic / French / English

## Goal

Add full i18n (internationalization) to the Fast Pastry app with **3 languages**: English (default), French, and Arabic (RTL). All static text must be translated — no hardcoded strings.

## Requirements

### 1. Translation Library

Use `expo-localization` (device locale detection) + `i18next` + `react-i18next`. This is the standard Expo/i18n stack. Do NOT use `expo-router`'s built-in `i18n` because it lacks RTL support out of the box.

```
npx expo install expo-localization
npm install i18next react-i18next
```

### 2. Project Structure

```
src/i18n/
  index.ts              # i18next init, detect language, export t()
  locales/
    en/
      common.json        # shared labels (Save, Cancel, Loading, Search, No results, etc.)
      auth.json          # Login, Register, Forgot password, Email, Password, etc.
      home.json          # Welcome, Featured, Promotions, Categories, etc.
      catalogue.json     # Filters, Sort, Price range, All categories, etc.
      cart.json          # Cart, Checkout, Total, Items, Quantity, Remove, etc.
      orders.json        # Order status, History, Details, etc.
      profile.json       # Profile, Settings, Language, etc.
      admin.json         # Dashboard, Manage products, Orders, Fleet, etc.
      driver.json        # Deliveries, Earnings, Navigation, etc.
      errors.json        # Error messages, Network error, etc.
    fr/
      common.json        (French translations)
      auth.json
      home.json
      catalogue.json
      cart.json
      orders.json
      profile.json
      admin.json
      driver.json
      errors.json
    ar/
      common.json        (Arabic translations — RTL)
      auth.json
      home.json
      catalogue.json
      cart.json
      orders.json
      profile.json
      admin.json
      driver.json
      errors.json
```

### 3. Language Switcher

Add a **Language Selector** accessible from:
- **Login/Register screen** — a small flag/language picker at the top
- **Profile / Settings screen** — a row to change language
- **Admin sidebar** — language toggle option

Use a simple modal or bottom sheet with 3 options: 🇬🇧 English, 🇫🇷 Français, 🇩🇿 العربية. On selection, call `i18next.changeLanguage(lang)` and persist choice to AsyncStorage.

### 4. RTL Support (Arabic)

Arabic requires Right-to-Left layout. In `app/_layout.tsx`:

```tsx
import { I18nManager } from 'react-native';

// After language change:
const isRTL = lang === 'ar';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);
// Note: forceRTL requires app restart on Android.
// Show an Alert asking user to restart, or use expo-updates reload.
```

Also wrap the app with:
```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Already present, ensure it works with RTL.
```

### 5. Migration Strategy

1. **Create `src/i18n/index.ts`** with i18next init using `expo-localization` for initial locale, AsyncStorage as cache.
2. **Create en/fr/ar locale files** — start with the most-used screens (auth → home → catalogue → cart → orders → profile).
3. **Replace ALL hardcoded strings** across the codebase with `t('namespace:key')` calls.
4. **Language picker** — add to Auth screens + Profile/Settings.
5. **RTL flip** — test Arabic layout, fix any `left`/`right` hardcoded styles (use `start`/`end` instead).

### 6. Files to Modify

| File | Change |
|------|--------|
| `app/_layout.tsx` | Wrap with I18nProvider, detect locale, set RTL |
| `app/(auth)/_layout.tsx` | Add language picker to auth header |
| `src/screens/LoginScreen.tsx` | Replace strings with `t('auth:...')` |
| `src/screens/RegisterScreen.tsx` | Replace strings with `t('auth:...')` |
| `src/screens/HomeScreen.tsx` | Replace strings with `t('home:...')` |
| `src/screens/CatalogueScreen.tsx` | Replace strings with `t('catalogue:...')` |
| `src/screens/CakeDetailsScreen.tsx` | Replace strings with `t('catalogue:...')` |
| `src/screens/CartScreen.tsx` | Replace strings with `t('cart:...')` |
| `src/screens/ProfileScreen.tsx` | Replace strings + add language selector |
| `src/screens/Admin*.tsx` | Replace strings with `t('admin:...')` |
| `src/screens/Driver*.tsx` | Replace strings with `t('driver:...')` |
| `src/components/**/*.tsx` | Replace common strings with `t('common:...')` |
| `src/components/navigation/TabBar.tsx` | Tab labels via `t('common:tab_...')` |
| `src/components/navigation/AdminTabBar.tsx` | Same |
| `src/components/navigation/DriverTabBar.tsx` | Same |

### 7. Key Considerations

- **Arabic typography**: Use a font that supports Arabic script (e.g., Cairo, Noto Naskh Arabic). Keep the existing Cairo font if it's loaded.
- **Date/number formatting**: Use `Intl.DateTimeFormat` / `Intl.NumberFormat` with the active locale.
- **DZD currency**: Already using `DA` — keep as-is for all languages (or localize to `د.ج` for Arabic).
- **Plurals**: i18next handles plural rules for en/fr/ar natively.
- **Screens with 1000+ lines** (cart.tsx, checkout.tsx): Replace strings first, refactor later.

### 8. Testing

- Switch EN → FR → AR in the app
- Verify all text changes correctly
- For Arabic: verify RTL layout works (text aligned right, UI flips)
- Check that login/auth works after language switch
- Check that price formatting is consistent

## Files to Create

1. `src/i18n/index.ts` — i18next setup
2. `src/i18n/locales/en/common.json`
3. `src/i18n/locales/en/auth.json`
4. `src/i18n/locales/en/home.json`
5. `src/i18n/locales/en/catalogue.json`
6. `src/i18n/locales/en/cart.json`
7. `src/i18n/locales/en/orders.json`
8. `src/i18n/locales/en/profile.json`
9. `src/i18n/locales/en/admin.json`
10. `src/i18n/locales/en/driver.json`
11. `src/i18n/locales/en/errors.json`
12. Same 10 files under `fr/` and `ar/`
13. `src/components/ui/LanguagePicker.tsx` — language selector component
