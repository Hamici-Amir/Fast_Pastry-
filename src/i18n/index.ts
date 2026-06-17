import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enCatalogue from './locales/en/catalogue.json';
import enCart from './locales/en/cart.json';
import enOrders from './locales/en/orders.json';
import enProfile from './locales/en/profile.json';
import enAdmin from './locales/en/admin.json';
import enDriver from './locales/en/driver.json';
import enErrors from './locales/en/errors.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frHome from './locales/fr/home.json';
import frCatalogue from './locales/fr/catalogue.json';
import frCart from './locales/fr/cart.json';
import frOrders from './locales/fr/orders.json';
import frProfile from './locales/fr/profile.json';
import frAdmin from './locales/fr/admin.json';
import frDriver from './locales/fr/driver.json';
import frErrors from './locales/fr/errors.json';

const STORAGE_KEY = '@app_language';

const SUPPORTED_LANGS = ['en', 'fr'];

export async function changeLanguage(lang: string) {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(STORAGE_KEY, lang);
}

export async function getStoredLanguage(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, auth: enAuth, home: enHome, catalogue: enCatalogue, cart: enCart, orders: enOrders, profile: enProfile, admin: enAdmin, driver: enDriver, errors: enErrors },
    fr: { common: frCommon, auth: frAuth, home: frHome, catalogue: frCatalogue, cart: frCart, orders: frOrders, profile: frProfile, admin: frAdmin, driver: frDriver, errors: frErrors },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  ns: ['common', 'auth', 'home', 'catalogue', 'cart', 'orders', 'profile', 'admin', 'driver', 'errors'],
  defaultNS: 'common',
  returnObjects: true,
});

(async () => {
  const stored = await getStoredLanguage();
  const detected = stored || Localization.getLocales()?.[0]?.languageCode || 'en';
  const lang = SUPPORTED_LANGS.includes(detected) ? detected : 'en';
  await i18n.changeLanguage(lang);
})();

export default i18n;
