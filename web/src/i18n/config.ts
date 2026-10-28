import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'

/**
 * Initializes i18next for the browser app. This deployment ships English only,
 * so the language is pinned rather than detected; translation resources remain
 * the home for user-facing copy.
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
