import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import csCommon from './locales/cs/common.json'
import csBooking from './locales/cs/booking.json'
import enCommon from './locales/en/common.json'
import enBooking from './locales/en/booking.json'
import ukCommon from './locales/uk/common.json'
import ukBooking from './locales/uk/booking.json'

export const SUPPORTED_LANGUAGES = ['cs', 'en', 'uk']
export const DEFAULT_LANGUAGE = 'cs'
const STORAGE_KEY = 'maison-lang'

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored
  } catch {
    /* localStorage unavailable (private mode) — fall through to default */
  }
  return DEFAULT_LANGUAGE
}

const initialLanguage = getInitialLanguage()
// Set synchronously, before React mounts, so first paint already has the right lang.
document.documentElement.lang = initialLanguage

i18n.use(initReactI18next).init({
  resources: {
    cs: { translation: { ...csCommon, ...csBooking } },
    en: { translation: { ...enCommon, ...enBooking } },
    uk: { translation: { ...ukCommon, ...ukBooking } },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false }, // React already escapes
  initImmediate: false, // resolve synchronously (resources are bundled, no backend)
  debug: import.meta.env.DEV,
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
})

export default i18n
